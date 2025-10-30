import { useState, useCallback } from 'react';

interface UseKeyboardDragProps {
  onMove: (taskId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onDrop: (taskId: string) => void;
}

export const useKeyboardDrag = ({ onMove, onDrop }: UseKeyboardDragProps) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isGrabbed, setIsGrabbed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, taskId: string) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (!isGrabbed) {
          setActiveTaskId(taskId);
          setIsGrabbed(true);
        } else if (activeTaskId === taskId) {
          onDrop(taskId);
          setIsGrabbed(false);
          setActiveTaskId(null);
        }
        return;
      }
      if (isGrabbed && activeTaskId === taskId) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            onMove(taskId, 'up');
            break;
          case 'ArrowDown':
            e.preventDefault();
            onMove(taskId, 'down');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            onMove(taskId, 'left');
            break;
          case 'ArrowRight':
            e.preventDefault();
            onMove(taskId, 'right');
            break;
          case 'Enter':
            e.preventDefault();
            onDrop(taskId);
            setIsGrabbed(false);
            setActiveTaskId(null);
            break;
          case 'Escape':
            e.preventDefault();
            setIsGrabbed(false);
            setActiveTaskId(null);
            break;
        }
      }
    },
    [isGrabbed, activeTaskId, onMove, onDrop]
  );

  const getAriaLabel = useCallback(
    (taskId: string, taskTitle: string) => {
      if (isGrabbed && activeTaskId === taskId) {
        return `${taskTitle}. Grabbed. Use arrow keys to move. Press Enter to drop. Press Escape to cancel.`;
      }
      return `${taskTitle}. Press Space to grab.`;
    },
    [isGrabbed, activeTaskId]
  );

  return {
    isGrabbed,
    activeTaskId,
    handleKeyDown,
    getAriaLabel,
  };
};