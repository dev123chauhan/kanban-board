import React, { useState, useEffect } from 'react';
import { KanbanTask, KanbanColumn, TaskPriority } from './KanbanBoard.types';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import clsx from 'clsx';
import { toast } from 'sonner';
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTask | null;
  columns: KanbanColumn[];
  onSave: (taskId: string | null, updates: Partial<KanbanTask>) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  columns,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: 'medium' as TaskPriority,
    assignee: '',
    tags: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || '',
        priority: task.priority || 'medium',
        assignee: task.assignee || '',
        tags: task.tags?.join(', ') || '',
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: columns[0]?.id || '',
        priority: 'medium',
        assignee: '',
        tags: '',
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, columns, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const updates: Partial<KanbanTask> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee.trim() || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };

    onSave(task?.id || null, updates);
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete && toast.success("Deleted Successfully")){
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={clsx(
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.title ? 'border-error-500' : 'border-neutral-300'
            )}
            placeholder="Enter task title"
          />
          {errors.title && <p className="mt-1 text-sm text-error-600">{errors.title}</p>}
        </div>


        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter task description"
          />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={clsx(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.status ? 'border-error-500' : 'border-neutral-300'
              )}
            >
              {columns.map(column => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-sm text-error-600">{errors.status}</p>}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-neutral-700 mb-1">
              Assignee
            </label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>


        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="frontend, urgent, bug (comma separated)"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-4 sticky bottom-0 bg-white pb-2">
          <div className="w-full sm:w-auto">
            {task && onDelete && (
              <Button type="button" variant="danger" onClick={handleDelete} className="w-full sm:w-auto">
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};