import {expectTypeOf} from 'nz';
import parseMilliseconds, {type TimeComponents} from './index.js';

const result1: TimeComponents = parseMilliseconds(3000);

expectTypeOf(result1.days).toBe<number>();
expectTypeOf(result1.hours).toBe<number>();
expectTypeOf(result1.minutes).toBe<number>();
expectTypeOf(result1.seconds).toBe<number>();
expectTypeOf(result1.milliseconds).toBe<number>();
expectTypeOf(result1.microseconds).toBe<number>();
expectTypeOf(result1.nanoseconds).toBe<number>();

const result2: TimeComponents<bigint> = parseMilliseconds(3000n);

expectTypeOf(result2.days).toBe<bigint>();
expectTypeOf(result2.hours).toBe<bigint>();
expectTypeOf(result2.minutes).toBe<bigint>();
expectTypeOf(result2.seconds).toBe<bigint>();
expectTypeOf(result2.milliseconds).toBe<bigint>();
expectTypeOf(result2.microseconds).toBe<bigint>();
expectTypeOf(result2.nanoseconds).toBe<bigint>();

const result3: TimeComponents = parseMilliseconds(3000, {weeks: true});
expectTypeOf(result3.weeks).toBe<number | undefined>();
expectTypeOf(result3.days).toBe<number>();

const result4: TimeComponents<bigint> = parseMilliseconds(3000n, {weeks: true});
expectTypeOf(result4.weeks).toBe<bigint | undefined>();

const inputNumber = 3000 as number;

const result5 = parseMilliseconds(inputNumber, {largestUnit: 'hours'});
expectTypeOf(result5.hours).toBe<number>();
expectTypeOf<'days' extends keyof typeof result5 ? true : false>().toBe<false>();

const result6 = parseMilliseconds(inputNumber);
expectTypeOf(result6.days).toBe<number>();
expectTypeOf<'days' extends keyof typeof result6 ? true : false>().toBe<true>();
expectTypeOf(result6).toBe<TimeComponents<number>>();
