import {getEmptyUrl, getTestUrl} from '../src/createTestRepo/createTestRepo.js';
import {svnLog} from '../src/util/svn.js';

jest.setTimeout(60 * 1000);

describe('svnLog', () => {
	it('should return an empty log if there are no revisions', async () => {
		expect.hasAssertions();
		
		const result = await svnLog({url: getEmptyUrl()});

		expect(result).toBeInstanceOf(Array);
		expect(result).toHaveLength(0);
	});

	it('should return all logs in one request', async () => {
		expect.hasAssertions();
		
		const result = await svnLog({url: getTestUrl()});

		expect(result).toBeInstanceOf(Array);
		expect(result).toHaveLength(28);

		// revision 1
		const revision1 = result.find(e => e.revision === 1);
		expect(revision1?.author).toBe('test_username');
		expect(revision1?.msg).toBe('create trunk');

		// revision 28
		const revision28 = result.find(e => e.revision === 28);
		expect(revision28?.author).toBe('test_username');
		expect(revision28?.msg).toBe('changed 29');
	});

	it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('log should return all the logs in batches of %i', async (limit) => {
		expect.hasAssertions();
		
		const result = await svnLog({
			url: getTestUrl(),
			limit,
		});

		expect(result).toBeInstanceOf(Array);
		expect(result).toHaveLength(28);

		// revision 1
		const revision1 = result.find(e => e.revision === 1);
		expect(revision1?.author).toBe('test_username');
		expect(revision1?.msg).toBe('create trunk');

		// revision 28
		const revision28 = result.find(e => e.revision === 28);
		expect(revision28?.author).toBe('test_username');
		expect(revision28?.msg).toBe('changed 29');
	});

	it('log should return the logs starting with revision 4', async () => {
		expect.hasAssertions();
		
		const result = await svnLog({
			url: getTestUrl(),
			lastRevision: 4,
		});

		expect(result).toBeInstanceOf(Array);
		expect(result).toHaveLength(24);

		// revision 1
		const revision1 = result.find(e => e.revision === 1);
		expect(revision1).toBeUndefined();

		// revision 28
		const revision28 = result.find(e => e.revision === 28);
		expect(revision28?.author).toBe('test_username');
		expect(revision28?.msg).toBe('changed 29');
	});
});
