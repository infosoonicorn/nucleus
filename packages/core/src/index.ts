export const NUCLEUS_TIME_ZONE = 'Asia/Kolkata';
export const NUCLEUS_LOCALE = 'en-IN';

export const WORKFLOW_STATUSES = ['todo', 'in_progress', 'review', 'done', 'blocked'] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];
