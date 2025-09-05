// src/pages/research/Research.tsx
const Research = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Research</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium">Research Topic</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Description of your research topic or findings
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  export default Research