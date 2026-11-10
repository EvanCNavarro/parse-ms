# parse-ms

> Parse milliseconds into an object

## Install

```sh
npm install parse-ms
```

## Usage

```js
import parseMilliseconds from 'parse-ms';

parseMilliseconds(1337000001);
/*
{
	days: 15,
	hours: 11,
	minutes: 23,
	seconds: 20,
	milliseconds: 1,
	microseconds: 0,
	nanoseconds: 0
}
*/

parseMilliseconds(1337000001n);
/*
{
	days: 15n,
	hours: 11n,
	minutes: 23n,
	seconds: 20n,
	milliseconds: 1n,
	microseconds: 0n,
	nanoseconds: 0n
}
*/

parseMilliseconds(144_000_000, {largestUnit: 'hours'});
/*
{
	hours: 40,
	minutes: 0,
	seconds: 0,
	milliseconds: 0,
	microseconds: 0,
	nanoseconds: 0
}
*/
```

## API

### parseMilliseconds(milliseconds, options?)

#### options

Type: `object`

##### weeks

Type: `boolean`\
Default: `false`

Include a `weeks` field, reducing `days` to its 0-6 remainder.

##### largestUnit

Type: `string`\
Default: `'days'`

The largest unit to include in the result, one of `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, `'nanoseconds'`. Every unit above it is folded into it and omitted from the returned object.

## Related

- [to-milliseconds](https://github.com/sindresorhus/to-milliseconds) - The inverse of this module
- [pretty-ms](https://github.com/sindresorhus/pretty-ms) - Convert milliseconds to a human readable string
