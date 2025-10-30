import { KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';
export interface SearchFilters {
  query: string;
  priority?: string;
  assignee?: string;
  tags?: string[];
}

export const filterTasks = (
  tasks: Record<string, KanbanTask>,
  filters: SearchFilters
): Record<string, KanbanTask> => {
  const filtered: Record<string, KanbanTask> = {};

  Object.entries(tasks).forEach(([id, task]) => {
    let matches = true;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description?.toLowerCase().includes(query);
      matches = matches && (titleMatch || descMatch || false);
    }

    if (filters.priority && filters.priority !== 'all') {
      matches = matches && task.priority === filters.priority;
    }

    if (filters.assignee && filters.assignee !== 'all') {
      matches = matches && task.assignee === filters.assignee;
    }

    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => task.tags?.includes(tag));
      matches = matches && hasTag;
    }

    if (matches) {
      filtered[id] = task;
    }
  });

  return filtered;
};

export const getUniqueAssignees = (tasks: Record<string, KanbanTask>): string[] => {
  const assignees = new Set<string>();
  Object.values(tasks).forEach(task => {
    if (task.assignee) {
      assignees.add(task.assignee);
    }
  });
  return Array.from(assignees).sort();
};

export const getUniqueTags = (tasks: Record<string, KanbanTask>): string[] => {
  const tags = new Set<string>();
  Object.values(tasks).forEach(task => {
    task.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
