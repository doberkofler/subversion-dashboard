import Debug from 'debug';
import {getRootPage} from '../html/index.js';
import {loadRepository} from '../repository';

import type express from 'express';
import type {configType} from '../config.js';
import type {IDashboardStatus} from '../data/dashboard';

const debug = Debug('subversion-dashboard:handlerDefault');

const getStatus = (config: configType): IDashboardStatus => {
	return {
		timestamp: new Date(),
		repositories: config.repositories.map(r => {
			const repository = loadRepository(r.id);

			return {
				id: r.id,
				name: r.name,
				lastUpdate: repository.status.lastUpdate,
				lastRevision: repository.revisions.lastRevision,
				numberOfRevisions: repository.revisions.total,
			};
		}),
	};
};

/*
*	handler "dashboard" page
*/
export const handlerDashboardPage = (config: configType, _req: express.Request, res: express.Response): express.Response => {
	debug('handlerDashboardPage');
		
	// get status
	const status = getStatus(config);

	// get page
	const html = getRootPage({
		title: 'Dashboard',
		app: '',
		script: 'static/client/app/index.js',
		data: {
			status,
		},
	});

	// set header and status
	res.contentType('text/html');
	res.status(200);
		
	return res.send(html);
};

/*
*	handler "dashboard" data
*/
export const handlerDashboardData = (config: configType, _req: express.Request, res: express.Response): express.Response => {
	debug('handlerDashboardData');

	// get status
	const status = getStatus(config);
	
	// set header and status
	res.contentType('application/json');
	res.status(200);
		
	return res.send(status);
};
