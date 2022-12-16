import Debug from 'debug';
import {gatherRepositories} from '../repository';

const debug = Debug('subversion-dashboard:rungather');

import type {configType} from '../config.js';

export const runGather = async (config: configType): Promise<void> => {
	debug('runGather', config);

	// run gathering
	debug('start gatherering');
	await gatherRepositories(config, false);
};
