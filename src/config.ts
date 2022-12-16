import path from 'path';
import fs from 'fs-extra';
import {jsonLoad} from './util/files.js';
import {z} from 'zod';

const z$timeType = z.object({
	hh: z.number().gte(0).lte(24).default(5),
	mi: z.number().gte(0).lte(59).default(0),
}).strict();
export type timeType = z.infer<typeof z$timeType>;

const z$repositoryType = z.object({
	id: z.custom<string>(),
	name: z.string(),
	url: z.optional(z.string()),
	dir: z.optional(z.string()),
	username: z.optional(z.string()),
	password: z.optional(z.string()),
}).strict();

export type repositoryType = {
	id: string,
	name: string,
	url: string,
	username: string,
	password: string,
};

const z$configOptionsType = z.object({
	address: z.string().default('127.0.0.1'),
	port: z.number().gte(1).lte(65536).default(80),
	pollingTime: z.optional(z$timeType).default({hh: 5, mi: 0}),
	verbose: z.optional(z.boolean()).default(false),
}).strict();
export type configOptionsType = Required<z.infer<typeof z$configOptionsType>>;

const z$configType = z.object({
	options: z$configOptionsType,
	repositories: z.array(z$repositoryType),
}).strict();
export type configType = {
	options: configOptionsType,
	repositories: repositoryType[],
};

/**
 * Returns a configuration object.
 *
 * @param [filename='config.json'] - The configuration filename.
 * @returns A configuration object.
 */
export const configLoad = (filename = 'config.json'): configType => configValidate(jsonLoad(filename));

/**
 * Parse and validate the configuration object.
 *
 * @param config - The unvalidated configuration object.
 * @returns The configuration.
 */
export const configValidate = (config: unknown): configType => {
	const result = z$configType.parse(config);

	if ('url' in result && 'dir' in result) {
		throw new Error('A repository can only have a "url" or a "dir" property');
	}
	result.repositories.forEach(e => {
		// id
		if (typeof e.id !== 'string') {
			e.id = e.name;
		}
		e.id = e.id.replace(/[^A-Za-z0-9]/g, '_');

		// url
		if (typeof e.url === 'string' && typeof e.dir === 'string') {
			throw new Error(`The repository "${e.name}" can only have a "url" or a "dir" property`);
		}
		if (typeof e.dir === 'string') {
			const dir = path.resolve(e.dir);

			if (!fs.pathExistsSync(dir)) {
				throw new Error(`The repository url "${dir}" does not exist`);
			}

			e.url = `file://${dir}`;
			delete e.dir;
		}
	});

	return result as configType;
};
