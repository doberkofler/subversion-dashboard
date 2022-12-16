import * as path from 'path';
import * as fs from 'fs-extra';
import {execCommand} from '../util/execCommand.js';

const svn_tempDir = 'temp';
const svn_testRepoName = 'test_repo';
const svn_emptyRepoName = 'empty_repo';
const svn_username = 'test_username';
const svn_password = 'test_password';

const exec = async (args: string[]): Promise<void> => {
	const {code} = await execCommand(args);

	if (code !== 0) {
		throw new Error(`Unable to run command "${args.join(', ')}"`);
	}
};

const svn = async (command: string, args: string[]): Promise<void> => {
	const commands = ['svn', command, `--username=${svn_username}`, `--password=${svn_password}`, ...args];

	const {code} = await execCommand(commands);

	if (code !== 0) {
		throw new Error(`Unable to run command "${commands.join(', ')}"`);
	}
};

export const getEmptyUrl = (): string => `file://${path.resolve(path.join(svn_tempDir, svn_emptyRepoName))}`;
export const getTestUrl = (): string => `file://${path.resolve(path.join(svn_tempDir, svn_testRepoName))}`;

export const createTestRepo = async (): Promise<void> => {
	const emptyRepoPath = path.join(svn_tempDir, svn_emptyRepoName);
	const testRepoPath = path.join(svn_tempDir, svn_testRepoName);
	const repoUrl = getTestUrl();
	const trunkDir = path.join(svn_tempDir, 'trunk');
	const branchesDir = path.join(svn_tempDir, 'branches');
	const tagsDir = path.join(svn_tempDir, 'tags');

	// create temp directory
	fs.emptyDirSync(svn_tempDir);

	// create svn empty repo
	await exec(['svnadmin', 'create', emptyRepoPath]);

	// create svn test repo
	await exec(['svnadmin', 'create', testRepoPath]);

	// create standard directory structure
	await svn('mkdir', ['--message="create trunk"', `${repoUrl}/trunk`]);
	await svn('mkdir', ['--message="create tags"', `${repoUrl}/tags`]);
	await svn('mkdir', ['--message="create branches"', `${repoUrl}/branches`]);

	// create working directories
	fs.mkdirSync(trunkDir);
	fs.mkdirSync(branchesDir);
	fs.mkdirSync(tagsDir);

	// checkout trunk
	await svn('checkout', [repoUrl, trunkDir]);
	
	// populate svn working directory
	fs.writeFileSync(path.join(trunkDir, 'file1.txt'), '1');
	fs.writeFileSync(path.join(trunkDir, 'file2.txt'), '1');
	fs.writeFileSync(path.join(trunkDir, 'file3.txt'), '1');
	await svn('add', [path.join(trunkDir, '*.txt')]);
	await svn('commit', ['--message="added files"', trunkDir]);
	
	// create release-1
	await svn('copy', [`${repoUrl}/trunk`, `${repoUrl}/tags/release-1`, '--message="tagging release 1"']);
	
	// change working directory
	fs.writeFileSync(path.join(trunkDir, 'file1.txt'), '2');
	fs.writeFileSync(path.join(trunkDir, 'file2.txt'), '2');
	fs.writeFileSync(path.join(trunkDir, 'file3.txt'), '2');
	await svn('commit', ['--message="changed files to 2"', trunkDir]);
	
	// create release-2
	await svn('copy', [`${repoUrl}/trunk`, `${repoUrl}/tags/release-2`, '--message="tagging release 2"']);
	
	// change working directory
	fs.writeFileSync(path.join(trunkDir, 'file1.txt'), '3');
	fs.writeFileSync(path.join(trunkDir, 'file2.txt'), '3');
	fs.writeFileSync(path.join(trunkDir, 'file3.txt'), '3');
	await svn('commit', ['--message="changed files to 3"', trunkDir]);

	// add 20 more commits
	for (let i = 10; i < 30; i++) {
		fs.writeFileSync(path.join(trunkDir, 'file3.txt'), i.toString());
		await svn('commit', [`--message="changed ${i}"`, trunkDir]);
	}
};
