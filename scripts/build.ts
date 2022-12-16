import glob from 'glob';
import path from 'path';
import fs from 'fs';
import esbuild from 'esbuild';

const OUT_DIR = 'out';

const hasFileAccess = (filename: string): boolean => {
	try {
		fs.accessSync(filename, fs.constants.R_OK);
		return true;
	} catch (err) {
		return false;
	}
};

const build = (config: esbuild.BuildOptions): boolean => {
	try {
		/*const results = */esbuild.buildSync(config);

		/*
		results.errors.forEach(console.error);
		results.warnings.forEach(console.warn);
		*/

		return true;
	} catch (e) {
		return false;
	}
};

const build_server = (): void => {
	const ok = build({
		entryPoints: {
			'createTestRepo': './src/createTestRepo/index.ts',
			'server/index': './src/index.ts',
			'server/gatherer': './src/gatherer.ts',
		},
		bundle: true,
		write: true,
		minify: true,
		platform: 'node',
		target: 'node16',
		sourcemap: true,
		outdir: OUT_DIR,
		logLevel: 'info',
	});

	console.log(`Build of server ${ok ? 'successful' : 'failed'}`);
};

const build_client = (): void => {
	const pages = glob.sync('./src/pages/*');

	const entryPoints = pages.reduce<Record<string, string>>((prev, curr) => {
		const sourceFile = path.join(curr, '/client/index.tsx');

		if (hasFileAccess(sourceFile)) {
			const pageName = path.basename(curr);

			prev[`client/${pageName}/index`] = sourceFile;
		}

		return prev;
	}, {});

	const ok = build({
		entryPoints,
		bundle: true,
		write: true,
		minify: true,
		platform: 'browser',
		target: 'es2020',
		sourcemap: true,
		outdir: OUT_DIR,
		logLevel: 'info',
	});

	console.log(`Build of client ${ok ? 'successful' : 'failed'}`);
};

/**
 * @param {string} [error=''] - The error message.
 */
const usage = (error = ''): void => {
	if (typeof error === 'string' && error.length > 0) {
		console.log(error);
	}	
	console.log('Usage: node build.mjs');
};

const main = (): void => {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		build_server();
		build_client();
	} else if (args[0] === 'server') {
		build_server();
	} else if (args[0] === 'client') {
		build_client();
	} else {
		usage();
	}
};

main();
