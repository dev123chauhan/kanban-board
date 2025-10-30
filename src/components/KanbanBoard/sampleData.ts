import { KanbanColumn, KanbanTask } from './KanbanBoard.types';
export const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: 'bg-primary-100 border-primary-500', taskIds: [], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: 'bg-warning-100 border-warning-500', taskIds: [], maxTasks: 5 },
  { id: 'review', title: 'Review', color: 'bg-error-100 border-error-500', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: 'bg-success-100 border-success-500', taskIds: [] },
];

export const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop functionality',
    description: 'Add D&D functionality to kanban cards with smooth animations',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal component',
    description: 'Create modal for editing task details with form validation',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript configuration',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup folder structure and initial files',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
};
export const getDefaultData = () => {
  const columns = [...sampleColumns];
  columns[0].taskIds = ['task-1', 'task-2'];
  columns[1].taskIds = ['task-3'];
  columns[3].taskIds = ['task-4'];
  
  return { 
    columns, 
    tasks: sampleTasks 
  };
};
export const generateLargeDataset = (taskCount: number = 30) => {
  const tasks: Record<string, KanbanTask> = {};
  const columns = sampleColumns.map(col => ({ ...col, taskIds: [] as string[] }));
  
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams', 'Carol Davis'];
  const tagOptions = ['frontend', 'backend', 'design', 'bug', 'feature', 'urgent', 'documentation'];
  
  for (let i = 1; i <= taskCount; i++) {
    const taskId = `task-${i}`;
    const columnIndex = i % columns.length;
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const assignee = assignees[Math.floor(Math.random() * assignees.length)];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags = Array.from({ length: numTags }, () => 
      tagOptions[Math.floor(Math.random() * tagOptions.length)]
    );
    
    tasks[taskId] = {
      id: taskId,
      title: `Task ${i}: ${['Implement', 'Design', 'Fix', 'Review', 'Test'][Math.floor(Math.random() * 5)]} feature`,
      description: Math.random() > 0.5 ? `Description for task ${i}` : undefined,
      status: columns[columnIndex].id,
      priority,
      assignee,
      tags,
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 28) + 1),
      dueDate: Math.random() > 0.3 ? new Date(2024, 0, Math.floor(Math.random() * 28) + 1) : undefined,
    };
    
    columns[columnIndex].taskIds.push(taskId);
  }
  
  return { columns, tasks };
};