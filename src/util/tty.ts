/*
import * as readline from 'readline';
*/

export const getTimestamp = (text = ''): string => `[${new Date().toJSON()}] ${text}`;

/*
export const write = (text: string): void => {
	process.stdout.write(text);
};

export const writeNewlineAfter = (text: string): void => {
	process.stdout.write(`${text}\n`);
};

export const writeNewlineBefore = (text: string): void => {
	process.stdout.write(`\n${text}`);
};

export const writeAfterEraseLine = (text: string): void => {
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);
	process.stdout.write(text);
};

export const writeStartingOnColumn = (text: string, x: number): void => {
	readline.cursorTo(process.stdout, x);
	readline.clearLine(process.stdout, 1);
	process.stdout.write(text);
};
*/

export const log = (text: string): void => {
	process.stdout.write(`${getTimestamp(text)}\n`);
};
