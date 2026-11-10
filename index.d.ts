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

export type Options = {
	/**
	Include a `weeks` field, reducing `days` to its 0-6 remainder.

	@default false
	*/
	readonly weeks?: boolean;
};

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
export default function parseMilliseconds<T extends number | bigint>(milliseconds: T, options?: Options): TimeComponents<T>;
