import { useState, useCallback } from 'react';
import { KanbanTask, KanbanColumn } from '@/components/KanbanBoard/KanbanBoard.types';
import { reorderTasks } from '@/utils/column.utils';
import { generateId } from '@/utils/task.utils';

interface UseKanbanBoardProps {
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
}

export const useKanbanBoard = ({ initialColumns, initialTasks }: UseKanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const handleTaskMove = useCallback(
    (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
      setColumns(prevColumns => {
        const updatedColumns = prevColumns.map(col => {
          if (col.id === fromColumn) {
            const sourceIndex = col.taskIds.indexOf(taskId);
            
            if (fromColumn === toColumn) {
              return {
                ...col,
                taskIds: reorderTasks(col.taskIds, sourceIndex, newIndex),
              };
            } else {
              return {
                ...col,
                taskIds: col.taskIds.filter(id => id !== taskId),
              };
            }
          }
          
          if (col.id === toColumn && fromColumn !== toColumn) {
            const newTaskIds = [...col.taskIds];
            newTaskIds.splice(newIndex, 0, taskId);
            return {
              ...col,
              taskIds: newTaskIds,
            };
          }
          
          return col;
        });
        
        return updatedColumns;
      });

      if (fromColumn !== toColumn) {
        setTasks(prevTasks => ({
          ...prevTasks,
          [taskId]: {
            ...prevTasks[taskId],
            status: toColumn,
          },
        }));
      }
    },
    []
  );

  const handleTaskCreate = useCallback(
    (columnId: string, taskData: Omit<KanbanTask, 'id' | 'createdAt'>) => {
      const newTaskId = generateId();
      const newTask: KanbanTask = {
        ...taskData,
        id: newTaskId,
        createdAt: new Date(),
      };

      setTasks(prev => ({
        ...prev,
        [newTaskId]: newTask,
      }));

      setColumns(prev =>
        prev.map(col =>
          col.id === columnId
            ? { ...col, taskIds: [...col.taskIds, newTaskId] }
            : col
        )
      );
    },
    []
  );

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...updates,
      },
    }));
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    setColumns(prev =>
      prev.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );
  }, []);

  return {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  };
};