// src/components/dashboard/ActivityFeed.tsx

const activities = [
  "Victor created a task",
  "John moved task to Done",
  "Sarah commented on task",
];

export default function ActivityFeed() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-bold mb-4">Activity</h2>

      <ul className="space-y-2 text-sm text-gray-600">
        {activities.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}