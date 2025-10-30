import { Toaster } from "sonner";
import { KanbanBoard } from "./components/KanbanBoard/KanbanBoard";
import { getDefaultData } from "./components/KanbanBoard/sampleData";
import { useKanbanBoard } from "./hooks/useKanbanBoard";

const App = () => {
  const defaultData = getDefaultData();
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard({
    initialColumns: defaultData.columns,
    initialTasks: defaultData.tasks,
  });
  console.log("Columns:", columns);
  console.log("Tasks:", tasks);

  if (!columns || columns.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-screen h-screen">
      <Toaster position="top-right" richColors />
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

export default App;
