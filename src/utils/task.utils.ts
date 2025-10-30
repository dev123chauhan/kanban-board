import { format, isPast } from 'date-fns';
export const isOverdue = (dueDate: Date): boolean => {
  return isPast(dueDate) && !isToday(dueDate);
};
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
export const getPriorityColor = (priority: string): string => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};
export const getPriorityBadgeColor = (priority: string): string => {
  const colors = {
    low: 'bg-blue-500 text-white',
    medium: 'bg-yellow-500 text-white',
    high: 'bg-orange-500 text-white',
    urgent: 'bg-red-500 text-white',
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};
export const generateId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};