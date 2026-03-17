import ActivityFeed from '@/components/dashboard/ActivityFeed'
import KanbanBoard from '@/components/tasks/KanbanBoard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const page = () => {
  return (
    <div>
      <div className='pb-4'>
        <Button onClick={() => console.log('Done.')}>
          <Plus />
        </Button>
      </div>
      <KanbanBoard />
      <ActivityFeed />
    </div>
  )
}

export default page