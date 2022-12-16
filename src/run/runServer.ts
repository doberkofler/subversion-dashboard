import Debug from 'debug';
import {spawn, Thread, Worker} from 'threads';
import {installShutdown} from '../shutdown.js';
import {serverStart, serverClose} from '../server/index.js';
import * as tty from '../util/tty.js';

import type {configType} from '../config.js';
import type {AddressInfo} from 'net';
import type {Gatherer} from '../gatherer';

const debug = Debug('subversion-dashboard:runserver');

export async function runServer(config: configType): Promise<void> {
	debug('runServer', config);

	// install shutdown handler
	installShutdown(shutdownHandler);

	// start srever
	const {server} = await serverStart(config);
	const address = server.address() as AddressInfo;
	tty.log(`Listening at http://${address.address}:${address.port}`);

	// start gatherer thread
	debug('start gatherer thread');
	const gatherer = await spawn<Gatherer>(new Worker('./gatherer'));
	await gatherer(config);

	async function shutdownHandler(): Promise<void> {
		// terminate gataherer thread
		tty.log('Stopping gatherer thread...');
		await Thread.terminate(gatherer);
		tty.log('Stopped gatherer thread.');

		// close server
		tty.log('Closing server connection...');
		await serverClose(server);
		tty.log('Closed server connections.');
	}
}
