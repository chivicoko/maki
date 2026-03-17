import React from 'react'

const Stats = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <h2 className="text-2xl font-bold">12</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <h2 className="text-2xl font-bold">5</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Completed</p>
            <h2 className="text-2xl font-bold">7</h2>
        </div>
    </div>
  )
}

export default Stats