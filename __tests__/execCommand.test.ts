import {execCommand} from '../src/util/execCommand.js';

describe('execCommand', () => {
	it('execCommand invokes a command', async () => {
		expect.hasAssertions();
		
		const result = await execCommand(['svn', '--version']);

		expect(result.code).toBe(0);
		expect(result.stdout).toMatch(/^svn, version.*/);
		expect(result.stderr).toBe('');
	});
});
