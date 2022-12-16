import React from 'react';
import {hydrate} from 'react-dom';
import {getDataSSR} from '../../../html';
import {ConfigPage} from '../server';

import type {paraType} from '../server';

const container = document.getElementById('root');

if (container) {
	const para = getDataSSR<paraType>();

	hydrate(<ConfigPage config={para.config} />, container);
}
