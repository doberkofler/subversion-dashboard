import {formatDistance, isDate as _isDate, isValid, format} from 'date-fns';
import {format as pretty_format} from 'pretty-format';

/**
 * Is the given value an array of "string"
 *
 * @param value - The value to be checked
 * @returns returns true if the value matches the type
 */
export const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(e => typeof e === 'string');

/**
 * Is the given value a "Number"
 *
 * @param value - The value to be checked
 * @returns returns true if the value matches the type
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);

/**
 *	Is the given value an integer
 *
 * @param value - The value to be checked
 * @returns returns true if the value matches the type
 */
export const isInteger = (value: unknown): value is number => isNumber(value) && value % 1 === 0;

/**
 * Is the given value a "Date"
 *
 * @param value - The value to be checked
 * @returns returns true if the value matches the type
 */
export const isDate = (value: unknown): value is Date => _isDate(value) && isValid(value);

/**
 *	Format a number as a human readable string
 *
 * @param value - The number
 * @returns returns a human readable string
 */
export function numberToString(value: number, precision = 2): string {
	const multiplier = 10 ** precision;
	const round = Math.round(value * multiplier) / multiplier;

	return round.toString();
}

/**
 * Convert a string to a number
 *
 * @param value - The string to convert
 * @returns The number
 * @example
 *	stringToNumber(0) -> 0
 *	stringToNumber(NaN) -> throws TypeError
 *	stringToNumber('0') -> 0
 *	stringToNumber('-1.1') -> -1.1
 *	stringToNumber('') -> throws TypeError
 *	stringToNumber(' 1') -> throws TypeError
 *	stringToNumber('1 ') -> throws TypeError
 */
export function stringToNumber(value: string | number): number {
	const num = stringToNumberWeak(value);

	if (num === null) {
		throw new TypeError(`"${value}" is not a number`);
	}

	return num;
}

/**
 * Convert a string to a number
 *
 * @param value - The string to convert
 * @returns The number or null if the string could not be converted
 * @example
 *	stringToNumberWeak(0) -> 0
 *	stringToNumberWeak(NaN) -> null
 *	stringToNumberWeak('0') -> 0
 *	stringToNumberWeak('-1.1') -> -1.1
 *	stringToNumberWeak('') -> null
 *	stringToNumberWeak(' 1') -> null
 *	stringToNumberWeak('1 ') -> null
 */
export function stringToNumberWeak(value: string | number): number | null {
	// is the value already of type number?
	if (typeof value === 'number') {
		return !Number.isNaN(value) && Number.isFinite(value) ? value : null;
	}

	// Test for invalid characters
	if (!/^[+-]?\d*\.?\d+(?:[Ee][+-]?\d+)?$/.test(value)) {
		return null;
	}

	// Convert value to a number
	const num = Number(value);
	return Number.isNaN(num) ? null : num;
}

/**
 * Convert a string to a integer
 *
 * @param value - The string to convert
 * @returns The integer
 * @example
 *	stringToInteger(0) -> 0
 *	stringToInteger(NaN) -> throws TypeError
 *	stringToInteger('0') -> 0
 *	stringToInteger('-1.1') -> throws TypeError
 *	stringToInteger('') -> throws TypeError
 *	stringToInteger(' 1') -> throws TypeError
 *	stringToInteger('1 ') -> throws TypeError
 */
export function stringToInteger(value: string | number): number {
	const num = stringToIntegerWeak(value);

	if (num === null) {
		throw new TypeError(`"${value}" is not a number`);
	}

	return num;
}

/**
 * Convert a string to a integer
 *
 * @param value - The string to convert
 * @returns The integer or null if the string could not be converted
 * @example
 *	stringToIntegerWeak(0) -> 0
 *	stringToIntegerWeak(NaN) -> null
 *	stringToIntegerWeak('0') -> 0
 *	stringToIntegerWeak('-1.1') -> null
 *	stringToIntegerWeak('') -> null
 *	stringToIntegerWeak(' 1') -> null
 *	stringToIntegerWeak('1 ') -> null
 */
export function stringToIntegerWeak(value: string | number): number | null {
	// is the value already a "real" integer, we just return the value
	if (typeof value === 'number' && Number.isInteger(value)) {
		return value;
	}

	// try to convert value to a number
	const num = stringToNumberWeak(value);
	if (num === null || !Number.isInteger(num)) {
		return null;
	}

	return num;
}

/**
 *	Format a distance between dates a human readable string
 *
 * @param relativeDate - The relative date
 * @param currentDate - The current date
 * @returns returns a human readable string of the time distance
 */
export const distanceToString = (relativeDate: Date, currentDate = new Date()): string => formatDistance(relativeDate, currentDate, {addSuffix: true});

/**
 *	Format a timestamp a human readable string
 *
 * @param date - The date
 * @returns returns a human readable string
 */
export const timestampToString = (date: Date): string => format(date, 'd MMM yyyy HH:mm:ss');

/**
 *	Remove time from date.
 *
 * @param date - The date
 * @returns Date without time.
 */
export const removeTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 *	Compare two dates.
 *
 * @param d1 - The first date.
 * @param d2 - The second date.
 * @returns true if equal or else false.
 */
export const compareDate = (d1: Date, d2: Date): boolean => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

/**
 *	Convert any value to a string
 *
 * @param {unknown} value - The value to be inspected
 * @param {number} [depth=10] - The depth
 * @returns {string} returns the string reprsentation
 */
export const prettyFormat = (value: unknown): string => pretty_format(value);
