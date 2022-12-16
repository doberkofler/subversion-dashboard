/* eslint-disable @typescript-eslint/require-await */

import Debug from 'debug';
import {scheduleJob} from 'node-schedule';
import {expose} from 'threads/worker';
import {gatherRepositories} from './repository';

import type {configType} from './config.js';

const debug = Debug('subversion-dashboard:gatherer');

export type Gatherer = typeof gatherer;

expose(gatherer);

/**
 * Start statistics gathering.
 *
 * @param {configType} config - The configuration object.
 * @returns {Promise<void>} - A promise that resolves when done.
 */
export async function gatherer(config: configType): Promise<void> {
	debug('gatherer');

	// shedule job
	const job = scheduleJob('gatherStats', `* ${config.options.pollingTime.mi} ${config.options.pollingTime.hh} * * *`, async () => gatherRepositories(config, true));

	// invoke immediately
	job.invoke();
}
