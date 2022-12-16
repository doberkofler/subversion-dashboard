import os from 'os';
import fs from 'fs';
import path from 'path';
import {parseStringPromise} from 'xml2js';
import {execCommand} from './execCommand.js';
import {stringToInteger} from './util';
import Debug from 'debug';
import * as tty from './tty';
import {z} from 'zod';

const debug = Debug('subversion-dashboard:svn');

const z$logType = z.object({
	log: z.object({
		logentry: z.array(z.object({
			$: z.object({
				revision: z.string(),
			}),
			author: z.array(z.string()),
			date: z.array(z.string()),
			msg: z.array(z.string()),
		})),
	}).strict(),
}).strict();

export type logType = {
	revision: number,
	author: string,
	date: Date,
	msg: string,
};

interface IDefaultOptions {
	url: string,
	username?: string,
	password?: string,
	debug?: boolean,
}

interface ILogOptions extends IDefaultOptions {
	lastRevision?: number,
	limit?: number,
	verbose?: boolean,
}

export const svn = async (cmd: string, args: string[]): ReturnType<typeof execCommand> => execCommand(['svn', cmd, ...args], 60);

export const svnLog = async (options: ILogOptions, verbose = false): Promise<logType[]> => {
	const logs: logType[] = [];

	// get the HEAD revision
	const headRevision = await getHeadRevision({url: options.url, username: options.username, password: options.password});
	if (headRevision === null) {
		return logs;
	}

	// get all revisions
	const startRevision = typeof options.lastRevision === 'number' && options.lastRevision > 0 ? options.lastRevision : 0;
	const limit = typeof options.limit === 'number' && options.limit > 0 ? options.limit + 1 : 1000;
	for (let lastRevision = startRevision; lastRevision < headRevision;) {
		const result = await getLog({url: options.url, username: options.username, password: options.password, revision: `${lastRevision}:HEAD`, limit, verbose: false});

		for (const i of result.logs) {
			if (i.revision !== lastRevision) {
				logs.push(i);
			}
		}

		lastRevision = logs[logs.length - 1].revision;

		if (verbose) {
			tty.log(`Gathering revisions from repository "${options.url}" - revision "${lastRevision}" of "${headRevision}" ...`);
		}
	}

	return logs;
};

async function getLog(options: {
	url: string,
	username?: string,
	password?: string,
	revision?: string,
	limit?: number,
	verbose: boolean,
}): Promise<{xmlFilename: string, logs: logType[]}> {
	const logs: logType[] = [];
	const xmlFilename = path.join(os.tmpdir(), 'log.xml');
	const args = ['--xml', '--verbose', ...getAuth({username: options.username, password:options.password})];
	if (typeof options.limit === 'number') {
		args.push(`--limit=${options.limit}`);
	}
	if (typeof options.revision === 'string' && options.revision.length > 0) {
		args.push(`--revision=${options.revision}`);
	}
	if (options.verbose) {
		args.push('--verbose');
	}
	args.push(options.url);
	args.push('>');
	args.push(xmlFilename);

	debug(`filename="${xmlFilename}"`);
	debug(`svn log ${args.join(' ')}`);

	await svn('log', args);

	// load xml file
	const logXml = fs.readFileSync(xmlFilename);

	// convert xml to an object
	const logTemp = await parseStringPromise(logXml) as unknown;
	debug({logTemp});

	// empty log
	if (typeof (logTemp as Record<'log', unknown>).log !== 'object') {
		return {xmlFilename, logs};
	}

	// validate object
	const logValid = z$logType.parse(logTemp);
	debug(`retrieved=[${logValid.log.logentry.map(e => e.$.revision).join(',')}]`);

	// convert
	for (const i of logValid.log.logentry) {
		const revision = stringToInteger(i.$.revision);

		logs.push({
			revision,
			author: i.author[0],
			date: new Date(i.date[0]),
			msg: i.msg[0],
		});
	}

	return {xmlFilename, logs};
}

async function getHeadRevision(options: IDefaultOptions): Promise<number | null> {
	const result = await getLog({url: options.url, username: options.username, password: options.password, revision: 'HEAD', verbose: false});
	
	return result.logs.length === 0 ? null : result.logs[0].revision;
}

function getAuth(options: {username?: string, password?: string}): string[] {
	const args = [];

	if (typeof options.username === 'string' && options.username.length > 0) {
		args.push(`--username=${options.username}`);
	}

	if (typeof options.password === 'string' && options.password.length > 0) {
		args.push(`--password=${options.password}`);
	}

	return args;
}
