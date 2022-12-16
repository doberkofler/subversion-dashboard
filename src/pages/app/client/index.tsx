import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import {ColorModeContext, useMode} from '../../global/theme';
//import {getDataSSR} from '../../../html';
import {App} from './App';

//import type {paraType} from '../server';

const AppContext = (): JSX.Element => {
	const [theme, colorMode] = useMode();
	//const data = getDataSSR<paraType>();

	return (
		<React.StrictMode>
			<BrowserRouter>
				<ColorModeContext.Provider value={colorMode}>
					<ThemeProvider theme={theme}>
						<App />
					</ThemeProvider>
				</ColorModeContext.Provider>
			</BrowserRouter>
		</React.StrictMode>
	);
};

const container = document.getElementById('root');
if (container) {
	ReactDOM.createRoot(container).render(<AppContext />);
}
