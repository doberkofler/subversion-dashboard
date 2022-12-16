import {getHtmlPage, getRootPage, getDataSSR} from '../src/html/index.js';

type CustomGlobalThisType = typeof globalThis & {__INITIAL_SSR_DATA__?: string};

describe('getHtmlPage', () => {
	it('returns a html page with the given content', () => {
		expect(getHtmlPage('', '', [], {})).toBe([
			'<html lang="en">',
			'<head>',
			'<meta charset="UTF-8">',
			'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
			'<meta http-equiv="X-UA-Compatible" content="ie=edge">',
			'<meta name="description" content="Subversion Dashboard">',
			'<title>Subversion Dashboard</title>',
			'<style>',
			'* {font-family: Arial, Helvetica, sans-serif;}',
			'</style>',
			'</head>',
			'<body>',
			'</body>',
			'</html>',
		].join('\n'));

		expect(getHtmlPage('Title', 'content', [], {})).toBe([
			'<html lang="en">',
			'<head>',
			'<meta charset="UTF-8">',
			'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
			'<meta http-equiv="X-UA-Compatible" content="ie=edge">',
			'<meta name="description" content="Subversion Dashboard - Title">',
			'<title>Subversion Dashboard - Title</title>',
			'<style>',
			'* {font-family: Arial, Helvetica, sans-serif;}',
			'</style>',
			'</head>',
			'<body>',
			'content',
			'</body>',
			'</html>',
		].join('\n'));
	});
});

describe('getRootPage', () => {
	it('returns a html root page', () => {
		expect(getRootPage({
			title: 'Title',
			app: 'App',
			script: 'Script',
			data: {data: 'data'},
		})).toBe([
			'<html lang="en">',
			'<head>',
			'<meta charset="UTF-8">',
			'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
			'<meta http-equiv="X-UA-Compatible" content="ie=edge">',
			'<meta name="description" content="Subversion Dashboard - Title">',
			'<title>Subversion Dashboard - Title</title>',
			'<style>',
			'* {font-family: Arial, Helvetica, sans-serif;}',
			'</style>',
			'</head>',
			'<body>',
			`<script>globalThis.__INITIAL_SSR_DATA__ = \`${JSON.stringify({data: 'data'})}\`;</script>`,
			'<div id="root">App</div>',
			'<script src="Script" defer></script>',
			'</body>',
			'</html>',
		].join('\n'));
	});
});

describe('getDataSSR', () => {
	it('returns server data on client', () => {
		(globalThis as CustomGlobalThisType).__INITIAL_SSR_DATA__ = JSON.stringify({data: 'data'});

		expect(getDataSSR()).toStrictEqual({data: 'data'});
	});
});
