import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/primitives/Button';
import { getWIPLimitStatus } from '@/utils/column.utils';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  isDragOver: boolean;
  draggedTaskId: string | null;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskCreate: () => void;
  onDragStart: (taskId: string, columnId: string) => void;
  onDragOver: (columnId: string, index: number) => void;
  onDragEnd: () => void;
  onDrop: (columnId: string, index: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  isDragOver,
  draggedTaskId,
  onTaskEdit,
  onTaskCreate,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
      onDragOver(column.id, index);
    },
    [column.id, onDragOver]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      setDragOverIndex(null);
      onDrop(column.id, index);
    },
    [column.id, onDrop]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const wipStatus = getWIPLimitStatus(tasks.length, column.maxTasks);

  return (
    <div
      className={clsx(
      'flex flex-col bg-neutral-100 rounded-xl p-4',
      'w-full md:w-80 md:flex-shrink-0',  
      isDragOver && 'ring-2 ring-primary-500 bg-primary-50'
    )}
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks.`}
    >
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-neutral-100 z-10 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
            aria-hidden="true"
          />
          <h3 className="font-semibold text-neutral-900">{column.title}</h3>
          <span
            className={clsx(
              'text-xs px-2 py-0.5 rounded font-medium',
              wipStatus === 'exceeded' && 'bg-error-100 text-error-700',
              wipStatus === 'warning' && 'bg-warning-100 text-warning-700',
              wipStatus === 'safe' && 'bg-neutral-200 text-neutral-700'
            )}
          >
            {tasks.length}
            {column.maxTasks && ` / ${column.maxTasks}`}
          </span>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto custom-scrollbar min-h-[200px]"
        onDragOver={(e) => {
          e.preventDefault();
          if (tasks.length === 0) {
            handleDragOver(e, 0);
          }
        }}
        onDrop={(e) => {
          if (tasks.length === 0) {
            handleDrop(e, 0);
          }
        }}
        onDragLeave={handleDragLeave}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-neutral-400 text-sm">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragLeave={handleDragLeave}
              className={clsx(
                dragOverIndex === index && draggedTaskId !== task.id && 'pt-20'
              )}
            >
              <KanbanCard
                task={task}
                isDragging={draggedTaskId === task.id}
                onEdit={onTaskEdit}
                onDragStart={(taskId) => onDragStart(taskId, column.id)}
                onDragEnd={onDragEnd}
              />
            </div>
          ))
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onTaskCreate}
        className="mt-4 w-full justify-center"
        aria-label={`Add task to ${column.title}`}
      >
        + Add Task
      </Button>
    </div>
  );
};