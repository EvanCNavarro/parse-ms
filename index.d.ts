export type TimeComponents<T extends (number | bigint) = number> = {
	weeks?: T;
	days: T;
	hours: T;
	minutes: T;
	seconds: T;
	milliseconds: T;
	microseconds: T;
	nanoseconds: T;
};

export type TimeUnit = 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds';

export type Options<LargestUnit extends TimeUnit = 'days'> = {
	/**
	Include a `weeks` field, reducing `days` to its 0-6 remainder.

	@default false
	*/
	readonly weeks?: boolean;

	/**
	The largest unit to include in the result. Every unit above it is folded into it and omitted from the returned object.

	@default 'days'
	*/
	readonly largestUnit?: LargestUnit;
};

type TimeUnitOrder = ['days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];

type TimeUnitsAbove<U extends TimeUnit, Order extends TimeUnit[] = TimeUnitOrder> = Order extends [infer Head extends TimeUnit, ...infer Tail extends TimeUnit[]]
	? Head extends U
		? never
		: Head | TimeUnitsAbove<U, Tail>
	: never;

/**
Parse milliseconds into an object.

@example
```
import parseMilliseconds from 'parse-ms';

parseMilliseconds(1337000001);
// {
// 	days: 15,
// 	hours: 11,
// 	minutes: 23,
// 	seconds: 20,
// 	milliseconds: 1,
// 	microseconds: 0,
// 	nanoseconds: 0
// }
```
*/
export default function parseMilliseconds<T extends number | bigint, LargestUnit extends TimeUnit = 'days'>(
	milliseconds: T,
	options?: Options<LargestUnit>,
): Omit<TimeComponents<T>, TimeUnitsAbove<LargestUnit>>;
