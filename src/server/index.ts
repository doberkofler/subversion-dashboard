import Debug from 'debug';
import path from 'path';
import express from 'express';
import compression from 'compression';
import {handlerDashboardPage} from '../router/handlerDashboard.js';
import {handlerConfig} from '../router/handlerConfig.js';

import type * as http from 'http';
import type {configType} from '../config.js';

const debug = Debug('subversion-dashboard:server');

export const serverClose = async (server: http.Server): Promise<void> => new Promise(resolve => server.close(() => {
	resolve();
}));

export const serverStart = async (config: configType): Promise<{app: express.Express, server: http.Server}> => {
	debug('startServer');

	return new Promise(resolve => {
		const app = express();

		// listen
		const server = app.listen(config.options.port, config.options.address, () => {
			resolve({app, server});
		});

		// compression
		app.use(compression());

		// "static" route
		const staticDirectory = path.resolve(__dirname, '..');
		debug(`Static directory "${staticDirectory}"`);
		app.use('/static', express.static(staticDirectory));

		// "default" route
		app.get('/', handlerDashboardPage.bind(null, config));

		// "config" route
		app.get('/config', handlerConfig.bind(null, config));

		// "close" route
		app.get('/close', () => void serverClose(server));
	});
};

