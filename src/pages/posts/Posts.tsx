
const Posts = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium">Post Title</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Preview of your post content...
            </p>
            <div className="flex gap-2 mt-4 text-xs text-muted-foreground">
              <span>Posted 2 days ago</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Posts