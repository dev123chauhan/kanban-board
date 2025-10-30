import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { getDefaultData, generateLargeDataset, sampleColumns } from './sampleData';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully functional Kanban board with drag-and-drop functionality, task management, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

const KanbanWrapper = ({ initialData }: { initialData: ReturnType<typeof getDefaultData> }) => {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard({
    initialColumns: initialData.columns,
    initialTasks: initialData.tasks,
  });

  return (
    <div className="h-screen">
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <KanbanWrapper initialData={getDefaultData()} />,
  parameters: {
    docs: {
      description: {
        story: 'Default Kanban board with sample tasks across different columns.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => (
    <KanbanWrapper
      initialData={{
        columns: sampleColumns.map(col => ({ ...col, taskIds: [] })),
        tasks: {},
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty Kanban board showing the initial state with no tasks.',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: () => <KanbanWrapper initialData={generateLargeDataset(30)} />,
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with 30+ tasks to test performance and scrolling behavior.',
      },
    },
  },
};

export const WithManyTasks: Story = {
  render: () => <KanbanWrapper initialData={generateLargeDataset(50)} />,
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with 50+ tasks demonstrating performance optimization.',
      },
    },
  },
};

export const DifferentPriorities: Story = {
  render: () => {
    const data = getDefaultData();
    const priorityTasks = {
      'priority-1': {
        id: 'priority-1',
        title: 'Low Priority Task',
        status: 'todo' as const,
        priority: 'low' as const,
        assignee: 'John Doe',
        tags: ['low-priority'],
        createdAt: new Date(),
      },
      'priority-2': {
        id: 'priority-2',
        title: 'Medium Priority Task',
        status: 'todo' as const,
        priority: 'medium' as const,
        assignee: 'Jane Smith',
        tags: ['medium-priority'],
        createdAt: new Date(),
      },
      'priority-3': {
        id: 'priority-3',
        title: 'High Priority Task',
        status: 'in-progress' as const,
        priority: 'high' as const,
        assignee: 'Alice Johnson',
        tags: ['high-priority'],
        createdAt: new Date(),
      },
      'priority-4': {
        id: 'priority-4',
        title: 'Urgent Priority Task',
        status: 'in-progress' as const,
        priority: 'urgent' as const,
        assignee: 'Bob Williams',
        tags: ['urgent'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() - 86400000),
      },
    };

    const columns = [...data.columns];
    columns[0].taskIds = ['priority-1', 'priority-2'];
    columns[1].taskIds = ['priority-3', 'priority-4'];

    return (
      <KanbanWrapper
        initialData={{
          columns,
          tasks: { ...data.tasks, ...priorityTasks },
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all priority levels (low, medium, high, urgent) with color-coded badges.',
      },
    },
  },
};

export const MobileView: Story = {
  render: () => <KanbanWrapper initialData={getDefaultData()} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Kanban board optimized for mobile devices with responsive layout.',
      },
    },
  },
};

export const TabletView: Story = {
  render: () => <KanbanWrapper initialData={getDefaultData()} />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Kanban board optimized for tablet devices.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => <KanbanWrapper initialData={getDefaultData()} />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive Kanban board. Try dragging tasks between columns, clicking to edit, or adding new tasks!',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  render: () => <KanbanWrapper initialData={getDefaultData()} />,
  parameters: {
    docs: {
      description: {
        story: 'Use Tab to navigate between elements, Enter to edit tasks, and drag with mouse or keyboard.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
        ],
      },
    },
  },
};