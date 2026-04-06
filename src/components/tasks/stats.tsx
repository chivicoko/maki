import { useTasks } from '@/hooks/use-tasks';
import { useUIStore } from '@/store/ui-store';
import { Task } from '../../../types';

const Stats = () => {
    const { data: tasks = [] } = useTasks();
    const { selectedProject } = useUIStore();

    const filteredTasks =
      selectedProject === "all"
        ? tasks
        : tasks.filter((t: Task) => t.projectId === selectedProject);
        
        const totalTodo = filteredTasks.filter((t: Task) => t.status === "todo");
        const totalInProgress = filteredTasks.filter((t: Task) => t.status === "in-progress");
        const totalDone = filteredTasks.filter((t: Task) => t.status === "done");

  return (
    <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <h2 className="text-2xl font-bold">{tasks.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">To Do</p>
            <h2 className="text-2xl font-bold">{totalTodo?.length || 0}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <h2 className="text-2xl font-bold">{totalInProgress?.length || 0}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Completed</p>
            <h2 className="text-2xl font-bold">{totalDone?.length || 0}</h2>
        </div>
    </div>
  )
}

export default Stats