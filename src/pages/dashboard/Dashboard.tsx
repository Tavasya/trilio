// src/pages/dashboard/Dashboard.tsx
const Dashboard = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Posts</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Research Items</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default Dashboard