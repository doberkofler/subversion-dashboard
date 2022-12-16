import fs from 'fs';

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[/|\\]$/;

/*
 * Load text file
 */
export function textLoad(filename: string): string {
	try {
		return fs.readFileSync(filename, 'utf8');
	} catch (e: unknown) {
		throw new Error(`The file "${filename}" cannot be read`);
	}
}

/*
 * Save text file
 */
export function textSave(filename: string, data: string): void {
	try {
		fs.writeFileSync(filename, data, {});
	} catch (e: unknown) {
		/* istanbul ignore next */
		throw new Error(`The file "${filename}" cannot be written`);
	}
}

/*
 * Load json file
 */
export function jsonLoad(filename: string): unknown {
	const data = textLoad(filename);

	try {
		return JSON.parse(data, jsonDateParser);
	} catch (e: unknown) {
		throw new Error(`The content "${data}" of the file "${filename}" is not valid json`);
	}
}

/*
 * Save json file
 */
export const jsonSave = (filename: string, value: unknown): void => {
	textSave(filename, JSON.stringify(value));
};

/*
*	JSON date parser
*/
function jsonDateParser(_key: string, value: string): string | number | boolean | Date | null {
	if (typeof value === 'string') {
		let a = reISO.exec(value);
		if (a) {
			return new Date(value);
		}
		
		a = reMsAjax.exec(value);
		/* istanbul ignore next */
		if (a) {
			const b = a[1].split(/[-+,.]/);
			return new Date(b[0] ? +b[0] : 0 - +b[1]);
		}
	}

	return value;
}
