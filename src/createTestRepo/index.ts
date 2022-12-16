import {createTestRepo, getEmptyUrl, getTestUrl} from './createTestRepo.js';

const main = async (): Promise<void> => {
	console.log(`Creating repositories "${getEmptyUrl()}" and "${getTestUrl()}" ...`);
	await createTestRepo();
	console.log('Done.');
};

void main();
