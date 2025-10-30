import React, { useState, useCallback } from 'react';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnForCreate, setActiveColumnForCreate] = useState<string | null>(null);

  const {
    draggedId,
    sourceColumnId,
    dropTargetColumnId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    resetDrag,
  } = useDragAndDrop();

  const handleTaskEdit = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setActiveColumnForCreate(null);
    setIsModalOpen(true);
  }, []);

  const handleTaskCreateClick = useCallback((columnId: string) => {
    setSelectedTask(null);
    setActiveColumnForCreate(columnId);
    setIsModalOpen(true);
  }, []);

  const handleModalSave = useCallback(
    (taskId: string | null, updates: Partial<KanbanTask>) => {
      if (taskId) {
        onTaskUpdate(taskId, updates);
      } else if (activeColumnForCreate) {
        onTaskCreate(activeColumnForCreate, {
          ...updates,
          status: updates.status || activeColumnForCreate,
        } as Omit<KanbanTask, 'id' | 'createdAt'>);
      }
    },
    [activeColumnForCreate, onTaskCreate, onTaskUpdate]
  );

  const handleDrop = useCallback(
    (columnId: string, index: number) => {
      if (draggedId && sourceColumnId) {
        onTaskMove(draggedId, sourceColumnId, columnId, index);
      }
      handleDragEnd();
    },
    [draggedId, sourceColumnId, onTaskMove, handleDragEnd]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setActiveColumnForCreate(null);
  }, []);

  return (
    <>
        <div className="w-full h-full overflow-x-auto overflow-y-scroll custom-scrollbar">
      <div className="flex flex-col md:flex-row gap-4 p-6 min-h-full">
          {columns.map(column => {
            const columnTasks = column.taskIds
              .map(taskId => tasks[taskId])
              .filter(Boolean);

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                isDragOver={dropTargetColumnId === column.id}
                draggedTaskId={draggedId}
                onTaskEdit={handleTaskEdit}
                onTaskCreate={() => handleTaskCreateClick(column.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={resetDrag}
                onDrop={handleDrop}
              />
            );
          })}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        columns={columns}
        onSave={handleModalSave}
        onDelete={selectedTask ? onTaskDelete : undefined}
      />
    </>
  );
};