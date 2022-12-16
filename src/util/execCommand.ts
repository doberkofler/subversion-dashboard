import {exec} from 'child_process';
import Debug from 'debug';

const debug = Debug('subversion-dashboard:execCommand');

interface IExecResult {
	code: number,
	stdout: string,
	stderr: string,
}

export const execCommand = async (cmd: string | string[], timeoutMinutes = 10): Promise<IExecResult> => new Promise((resolve, reject) => {
	const options = {
		maxBuffer: 10486750,
		timeout: timeoutMinutes * 60 * 1000,
	};

	const command = Array.isArray(cmd) ? cmd.join(' ') : cmd;
	const execution = exec(command, options);

	let stdout = '';
	let stderr = '';

	execution.stdout?.on('data', data => {
		stdout += data;
	});

	execution.stderr?.on('data', data => {
		stderr += data;
	});

	execution.on('exit', code => {
		debug(`${command}\n${stdout}\n${stderr}`);
		if (code === 0) {
			resolve({code, stdout, stderr});
		} else {
			reject(new Error(`${command}\n${stderr}`));
		}
	});
});

