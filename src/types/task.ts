export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  jira_ticket?: string;
  created_at: string;
}
