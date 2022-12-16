import React from 'react';

import type {configType} from '../../../config.js';

export type paraType = {
	config: configType,
};

const pageTitle = 'Config Page';

export const ConfigPage = ({
	config,
}: paraType): JSX.Element => {
	return (
		<>
			<h1>{pageTitle}</h1>
			<pre>{JSON.stringify(config, null, ' ')}</pre>
		</>
	);
};

