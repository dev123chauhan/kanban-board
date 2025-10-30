import React, { useCallback } from 'react';
import clsx from 'clsx';
import { KanbanTask } from './KanbanBoard.types';
import { formatDate, isOverdue, getPriorityBadgeColor } from '@/utils/task.utils';
import { Avatar } from '../primitives/Avatar';

interface KanbanCardProps {
  task: KanbanTask;
  isDragging: boolean;
  onEdit: (task: KanbanTask) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  isDragging,
  onEdit,
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
      onDragStart(task.id);
    },
    [task.id, onDragStart]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEdit(task);
      }
    },
    [task, onEdit]
  );

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${task.status}. ${
        task.priority ? `Priority: ${task.priority}.` : ''
      } Press Enter to edit.`}
        className={clsx(
      'bg-white border border-neutral-200 rounded-lg p-3 mb-2',
      'shadow-card hover:shadow-card-hover transition-all',
      'cursor-grab active:cursor-grabbing',
      'min-h-[80px]',
      isDragging && 'opacity-50 shadow-lg',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
    )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2 flex-1 pr-2">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={clsx(
              'text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap',
              getPriorityBadgeColor(task.priority)
            )}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1 flex-wrap">
          {task.tags?.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags && task.tags.length > 3 && (
            <span className="text-xs text-neutral-500 px-2 py-0.5">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
        {task.assignee && <Avatar name={task.assignee} size="sm" />}
      </div>

      {task.dueDate && (
        <div
          className={clsx(
            'text-xs mt-2 font-medium',
            isOverdue(task.dueDate) ? 'text-error-600' : 'text-neutral-500'
          )}
        >
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};