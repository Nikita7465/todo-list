export interface TaskState {
  task_id: number;
  user_id: number;
  title: string;
  description: string;
  completed: number;
}

export interface TasksState {
  tasks: TaskState[];
  displayedTasks: TaskState[];
}