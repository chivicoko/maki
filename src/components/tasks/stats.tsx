import { useTasks } from '@/hooks/use-tasks';
import { useUIStore } from '@/store/ui-store';
import { Task } from '../../../types';
import { Skeleton } from '../ui/skeleton';

const Stats = () => {
    const { data: tasks = [], isLoading } = useTasks();
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
            {isLoading ? <Skeleton className="h-6 w-12 mt-2" /> : <h2 className="text-2xl font-bold">{tasks.length}</h2>}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">To Do</p>
            {isLoading ? <Skeleton className="h-6 w-12 mt-2" /> : <h2 className="text-2xl font-bold">{totalTodo.length}</h2>}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">In Progress</p>
            {isLoading ? <Skeleton className="h-6 w-12 mt-2" /> : <h2 className="text-2xl font-bold">{totalInProgress.length}</h2>}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Completed</p>
            {isLoading ? <Skeleton className="h-6 w-12 mt-2" /> : <h2 className="text-2xl font-bold">{totalDone.length}</h2>}
        </div>
    </div>
  )
}

export default Stats