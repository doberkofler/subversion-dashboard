/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* istanbul ignore file */

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {configLoad} from './config';
import {runServer} from './run/runServer.js';
import {runGather} from './run/runGather.js';

import type {configType} from './config';

type argvType = {
	config?: unknown,
	verbose?: unknown,
};

const getConfig = (argv: argvType): configType => {
	if (typeof argv.config !== 'string') {
		throw new Error('argv.config must be of type "string"');
	}

	const config = configLoad(argv.config);

	if (typeof argv.verbose === 'boolean') {
		config.options.verbose = argv.verbose;
	}

	return config;
};

yargs(hideBin(process.argv))
	.command({
		command: ['start', '$0'],
		describe: 'Start the server',
		handler: async argv => runServer(getConfig(argv as argvType)),
	})
	.command({
		command: 'init',
		describe: 'Initialize gathering all data',
		handler: async argv => runGather(getConfig(argv as argvType)),
	})
	.option('config', {
		demandOption: false,
		default: 'config.json',
		describe: 'configuration file',
		type: 'string',
	})
	.option('verbose', {
		demandOption: false,
		describe: 'verbose',
		type: 'boolean',
	})
	.demandCommand()
	.strict()
	.help()
	.argv;
