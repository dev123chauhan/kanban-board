export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  
  return {
    source: sourceClone,
    destination: destClone,
  };
};

export const getWIPLimitStatus = (
  currentCount: number,
  maxTasks?: number
): 'safe' | 'warning' | 'exceeded' => {
  if (!maxTasks) return 'safe';
  
  const percentage = (currentCount / maxTasks) * 100;
  
  if (currentCount > maxTasks) return 'exceeded';
  if (percentage >= 80) return 'warning';
  return 'safe';
};
export const getColumnHeaderColor = (color: string): string => {
  return color;
};