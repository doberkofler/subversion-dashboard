//
// Requirements
//

import React from 'react';
import CircularIndeterminate from '../../components/CircularIndeterminate';
import ErrorPage from '../../pages/ErrorPage';
import {useTimesheets} from '../../data/dashboard';
import {useTheme} from '@mui/material/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer} from 'recharts';
import Title from './Title';

//
// Types
//

//
// Component
//

export default function Chart(): JSX.Element {
	const theme = useTheme();
	const status = useTimesheets();

	if (status.isLoading) {
		return <CircularIndeterminate />;
	}
	if (status.error) {
		return <ErrorPage error={status.error.message} />;
	}

	return (
		<>
			<Title>Your timesheet</Title>
			<ResponsiveContainer>
				<LineChart data={status.data.map(e => ({time: e.week, amount: e.hours}))} margin={{top: 16, right: 16, bottom: 0, left: 24}}>
					<XAxis dataKey="time" stroke={theme.palette.text.secondary} style={theme.typography.body2}/>
					<YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
						<Label
							angle={270}
							position="left"
							style={{
								textAnchor: 'middle',
								fill: theme.palette.text.primary,
								...theme.typography.body1,
							}}
						>
							Hours (#)
						</Label>
					</YAxis>
					<Line isAnimationActive animationDuration={500} type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false}/>
				</LineChart>
			</ResponsiveContainer>
		</>
	);
}
