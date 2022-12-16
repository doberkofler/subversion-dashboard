import Debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import {svnLog} from './util/svn.js';
import * as tty from './util/tty.js';
import {jsonLoad, jsonSave} from './util/files.js';
import {removeTime, compareDate} from './util/util.js';
import {z} from 'zod';

import type {configType, repositoryType} from './config.js';

const debug = Debug('subversion-dashboard:repository');

const z$repository = z.object({
	status: z.object({
		lastUpdate: z.nullable(z.date()),
	}).strict(),
	revisions: z.object({
		total: z.number(),
		lastRevision: z.number(),
	}).strict(),
	authors: z.array(z.object({
		name: z.string(),
		commits: z.number(),
	}).strict()),
	timeline: z.array(z.object({
		date: z.date(),
		commits: z.number(),
	}).strict()),
}).strict();

const dataDir = 'data';

export type IRepository = z.infer<typeof z$repository>;

const getRepositoryFilename = (id: string): string => path.join(dataDir, `repository-${id}.json`);

export const initRepository = (): IRepository => {
	return {
		status: {
			lastUpdate: null,
		},
		revisions: {
			total: 0,
			lastRevision: -1,
		},
		authors: [],
		timeline: [],
	};
};

export const loadRepository = (id: string): IRepository => {
	const filename = getRepositoryFilename(id);

	if (!fs.existsSync(filename)) {
		return initRepository();
	}

	return z$repository.parse(jsonLoad(filename));
};

export const saveRepository = (id: string, repository: IRepository): void => {
	fs.ensureDirSync(dataDir);

	const filename = getRepositoryFilename(id);

	jsonSave(filename, repository);
};

/*
*	gather subversion repository
*/
const gatherRepository = async (repository: repositoryType, incremental: boolean, verbose: boolean): Promise<void> => {
	debug('', repository);
	tty.log(`Gathering data from repository "${repository.id}" ...`);

	// load repository
	const data = incremental ? loadRepository(repository.id) : initRepository();

	// load logs
	const logs = await svnLog({
		url: repository.url,
		username: repository.username,
		password: repository.password,
		lastRevision: incremental ? data.revisions.lastRevision : 0,
		limit: 10000,
		verbose: true,
	}, verbose);
	debug(`Loaded "${logs.length}" logs starting with revision "${data.revisions.lastRevision}"`);
	//debug(JSON.stringify(logs, null, ' '));

	// update the total number of revisions
	data.revisions.total += logs.length;

	// process all logs
	let c = 0;
	for (const i of logs) {
		// update the last revision
		if (i.revision > data.revisions.lastRevision) {
			data.revisions.lastRevision = i.revision;
		}

		// update the authors
		const author = data.authors.find(e => e.name === i.author.toLowerCase());
		if (author) {
			author.commits++;
		} else {
			data.authors.push({
				name: i.author.toLowerCase(),
				commits: 1,
			});
		}

		// update the timeline
		const timeline = data.timeline.find(e => compareDate(e.date, i.date));
		if (timeline) {
			timeline.commits++;
		} else {
			data.timeline.push({
				date: removeTime(i.date),
				commits: 1,
			});
		}

		if (verbose && ++c % 10000 === 0) {
			tty.log(`Processing logs - ${c} of ${logs.length} ...`);
		}
	}

	data.status.lastUpdate = new Date();

	// save repository
	saveRepository(repository.id, data);

	tty.log(`Gathered "${logs.length}" revisions from repository "${repository.name}" ...`);
};

/*
*	gather subversion repositories
*/
export const gatherRepositories = async (config: configType, incremental: boolean): Promise<void> => {
	for (const repository of config.repositories) {
		await gatherRepository(repository, incremental, config.options.verbose);
	}
};
