import {z} from 'zod';

const zRepository = z.object({
	id: z.string(),
	name: z.string(),
	lastUpdate: z.nullable(z.date()),
	lastRevision: z.number(),
	numberOfRevisions: z.number(),
}).strict();

const zDashboardStatus = z.object({
	timestamp: z.date(),
	repositories: z.array(zRepository),
}).strict();

export type IDashboardStatus = z.infer<typeof zDashboardStatus>;
