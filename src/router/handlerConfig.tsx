import Debug from 'debug';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {getRootPage} from '../html/index.js';
import {ConfigPage} from '../pages/config/server';

import type express from 'express';
import type {configType} from '../config.js';

const debug = Debug('subversion-dashboard:handlerConfig');

const getPage = (config: configType): string => {
	debug('getPage', config);

	return getRootPage({
		title: 'Status',
		app: ReactDOMServer.renderToString(<ConfigPage config={config} />),
		script: 'static/client/config/index.js',
		data: {config},
	});
};

/*
*	handler "default"
*/
export const handlerConfig = (config: configType, _req: express.Request, res: express.Response): express.Response => {
	debug('"handlerConfig');

	// get page
	const html = getPage(config);

	// set header and status
	res.contentType('text/html');
	res.status(200);
		
	return res.send(html);
};
