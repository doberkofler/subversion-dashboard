import type express from 'express';
import request from 'supertest';
import type * as http from 'http';
import {serverStart, serverClose} from '../src/server/index.js';

let app: express.Express;
let server: http.Server;

describe('server', () => {
	beforeAll(async () => {
		const config = {
			options: {
				address: '127.0.0.1',
				port: 12345,
				pollingTime: {
					hh: 5,
					mi: 0,
				},
				verbose: false,
			},
			repositories: [],
		};

		const result = await serverStart(config);
		app = result.app;
		server = result.server;
	});

	afterAll(() => void serverClose(server));

	it('handlerDefault', async () => {
		const response = await request(app).get('').send({});
		expect(response.statusCode).toBe(200);
	});

	it('handlerConfig', async () => {
		const response = await request(app).get('/config').send({});
		expect(response.statusCode).toBe(200);
	});
});
