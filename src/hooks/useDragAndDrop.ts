import { useState, useCallback } from 'react';
import { DragState } from '@/components/KanbanBoard/KanbanBoard.types';

export const useDragAndDrop = () => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    sourceColumnId: null,
    dropTargetColumnId: null,
    dragOverIndex: null,
  });

  const handleDragStart = useCallback((taskId: string, columnId: string) => {
    setState({
      isDragging: true,
      draggedId: taskId,
      sourceColumnId: columnId,
      dropTargetColumnId: null,
      dragOverIndex: null,
    });
  }, []);

  const handleDragOver = useCallback((columnId: string, index: number) => {
    setState(prev => ({
      ...prev,
      dropTargetColumnId: columnId,
      dragOverIndex: index,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState({
      isDragging: false,
      draggedId: null,
      sourceColumnId: null,
      dropTargetColumnId: null,
      dragOverIndex: null,
    });
  }, []);

  const resetDrag = useCallback(() => {
    setState({
      isDragging: false,
      draggedId: null,
      sourceColumnId: null,
      dropTargetColumnId: null,
      dragOverIndex: null,
    });
  }, []);

  return {
    ...state,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    resetDrag,
  };
};