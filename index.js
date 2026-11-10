// Scaling a value to nanoseconds carries up to half a ulp of error, which would truncate a whole number of nanoseconds down by one.
const SCALING_EPSILON = 0.0000001;
const MAX_NANOSECONDS_IN_MILLISECOND = 999_999;

const UNITS = ['days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
const FACTORS = [24, 60, 60, 1000, 1000, 1000]; // FACTORS[i] converts UNITS[i] into UNITS[i + 1].

function parseNumber(milliseconds) {
	// The sub-millisecond parts come from scaling the value to nanoseconds, which recovers its intended decimal best. That scaling leaves the exact integer range above ~9e9ms, so it is reduced modulo a second there to avoid yielding phantom values for what is a whole number of milliseconds.
	const scaledNanoseconds = (Number.isSafeInteger(Math.trunc(milliseconds) * 1e6) ? milliseconds : milliseconds % 1000) * 1e6;
	// The nudge absorbs the scaling error, which would otherwise truncate a whole number of nanoseconds down by one. Clamping stops it from carrying into the next millisecond.
	const nudgedNanoseconds = (scaledNanoseconds % 1e6) + (Math.sign(scaledNanoseconds) * SCALING_EPSILON);
	const totalNanoseconds = Math.min(
		MAX_NANOSECONDS_IN_MILLISECOND,
		Math.max(
			Math.trunc(nudgedNanoseconds),
			-MAX_NANOSECONDS_IN_MILLISECOND,
		),
	);

	return {
		days: Math.trunc(milliseconds / 86_400_000),
		// The sub-day parts come from a remainder, as a large quotient loses the low digits of the part to float error.
		hours: Math.trunc(milliseconds % 86_400_000 / 3_600_000),
		minutes: Math.trunc(milliseconds % 3_600_000 / 60_000),
		seconds: Math.trunc(milliseconds % 60_000 / 1000),
		milliseconds: Math.trunc(milliseconds % 1000),
		microseconds: Math.trunc(totalNanoseconds / 1000),
		nanoseconds: totalNanoseconds % 1000,
	};
}

function parseBigint(milliseconds) {
	return {
		days: milliseconds / 86_400_000n,
		hours: milliseconds / 3_600_000n % 24n,
		minutes: milliseconds / 60_000n % 60n,
		seconds: milliseconds / 1000n % 60n,
		milliseconds: milliseconds % 1000n,
		microseconds: 0n,
		nanoseconds: 0n,
	};
}

function applyWeeks(components) {
	const isBigint = typeof components.days === 'bigint';
	const weeks = isBigint ? (components.days / 7n) : Math.trunc(components.days / 7);
	const days = isBigint ? (components.days % 7n) : (components.days % 7);

	return {
		weeks,
		...components,
		days,
	};
}

function applyLargestUnit(components, largestUnit) {
	const index = UNITS.indexOf(largestUnit);
	if (index === -1) {
		throw new TypeError(`Expected largestUnit to be one of ${UNITS.join(', ')}, got \`${largestUnit}\``);
	}

	if (index === 0) {
		return components;
	}

	const isBigint = typeof components.days === 'bigint';
	let carry = isBigint ? 0n : 0;
	for (let i = 0; i < index; i++) {
		const factor = isBigint ? BigInt(FACTORS[i]) : FACTORS[i];
		carry = (carry + components[UNITS[i]]) * factor;
	}

	const result = {};
	for (let i = index; i < UNITS.length; i++) {
		result[UNITS[i]] = i === index ? (carry + components[UNITS[i]]) : components[UNITS[i]];
	}

	return result;
}

export default function parseMilliseconds(milliseconds, options = {}) {
	const {weeks = false, largestUnit = 'days'} = options;

	let components;
	switch (typeof milliseconds) {
		case 'number': {
			if (Number.isFinite(milliseconds)) {
				components = parseNumber(milliseconds);
			} else {
				throw new TypeError('Expected a finite number or bigint');
			}

			break;
		}

		case 'bigint': {
			components = parseBigint(milliseconds);
			break;
		}

		default: {
			throw new TypeError('Expected a finite number or bigint');
		}
	}

	components = applyLargestUnit(components, largestUnit);

	return (weeks && largestUnit === 'days') ? applyWeeks(components) : components;
}
