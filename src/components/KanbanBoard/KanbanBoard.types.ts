export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: TaskPriority;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  maxTasks?: number;
}

export interface KanbanViewProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate: (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  sourceColumnId: string | null;
  dropTargetColumnId: string | null;
  dragOverIndex: number | null;
}