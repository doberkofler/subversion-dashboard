import path from 'path';
import {configLoad, configValidate} from '../src/config.js';

describe('configValidate', () => {
	it('returns a validated configuration object', () => {
		expect(configValidate({
			options: {},
			repositories: [],
		})).toStrictEqual({
			options: {
				address: '127.0.0.1',
				port: 80,
				pollingTime: {
					hh: 5,
					mi: 0,
				},
				verbose: false,
			},
			repositories: [],
		});

		expect(configValidate({
			options: {
				address: '128.1.1.2',
				port: 8080,
				pollingTime: {
					hh: 7,
					mi: 33,
				},
				verbose: true,
			},
			repositories: [{
				name: 'name',
				url: 'url',
				username: 'username',
				password: 'password',
			}],
		})).toStrictEqual({
			options: {
				address: '128.1.1.2',
				port: 8080,
				pollingTime: {
					hh: 7,
					mi: 33,
				},
				verbose: true,
			},
			repositories: [{
				id: 'name',
				name: 'name',
				url: 'url',
				username: 'username',
				password: 'password',
			}],
		});


		expect(configValidate({
			options: {
				address: '1.2.3.4',
				port: 8080,
				pollingTime: {
					hh: 7,
					mi: 33,
				},
				verbose: true,
			},
			repositories: [{
				name: 'name',
				dir: '.',
				username: 'username',
				password: 'password',
			}],
		})).toStrictEqual({
			options: {
				address: '1.2.3.4',
				port: 8080,
				pollingTime: {
					hh: 7,
					mi: 33,
				},
				verbose: true,
			},
			repositories: [{
				id: 'name',
				name: 'name',
				url: `file://${path.resolve('.')}`,
				username: 'username',
				password: 'password',
			}],
		});
	});
});

describe('configLoad', () => {
	it('loads the configuration and returns a validated configuration object or throws an error', () => {
		expect(configLoad('./__tests__/config.test.json')).toStrictEqual({
			options: {
				address: '127.0.0.1',
				port: 80,
				pollingTime: {
					hh: 5,
					mi: 0,
				},
				verbose: false,
			},
			repositories: [],
		});
	});
});
