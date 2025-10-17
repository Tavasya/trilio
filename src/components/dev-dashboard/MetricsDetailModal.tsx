import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { DashboardSummary, GrowthTimeline, PostsTimeline } from '@/types/devDashboard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

interface MetricsDetailModalProps {
  open: boolean;
  onClose: () => void;
  metricType: 'users' | 'activation' | 'posts' | 'publish' | null;
  summary: DashboardSummary | null;
  growthTimeline: GrowthTimeline[];
  postsTimeline: PostsTimeline[];
}

export function MetricsDetailModal({
  open,
  onClose,
  metricType,
  summary,
  growthTimeline,
  postsTimeline
}: MetricsDetailModalProps) {
  if (!metricType || !summary) return null;

  // Format date for display (e.g., "2025-10-01" -> "Oct 1")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prepare time-series data based on metric type
  const getTimeSeriesData = () => {
    if (metricType === 'users' || metricType === 'activation') {
      // Use growth timeline
      return growthTimeline.map(item => ({
        date: formatDate(item.date),
        total: item.total_users,
        active: item.active_users,
        new: item.new_users,
        rate: item.total_users > 0 ? ((item.active_users / item.total_users) * 100).toFixed(1) : 0,
      }));
    }

    if (metricType === 'posts' || metricType === 'publish') {
      // Use posts timeline
      return postsTimeline.map(item => {
        const total = item.drafts_created + item.posts_published + item.posts_scheduled;
        return {
          date: formatDate(item.date),
          drafts: item.drafts_created,
          published: item.posts_published,
          scheduled: item.posts_scheduled,
          failed: item.posts_failed,
          rate: total > 0 ? ((item.posts_published / total) * 100).toFixed(1) : 0,
        };
      });
    }

    return [];
  };

  const timeSeriesData = getTimeSeriesData();

  const getTitle = () => {
    switch (metricType) {
      case 'users':
        return 'User Growth Over Time';
      case 'activation':
        return 'Activation Rate Trend';
      case 'posts':
        return 'Post Creation Over Time';
      case 'publish':
        return 'Publish Rate Trend';
      default:
        return 'Metrics';
    }
  };

  const getDescription = () => {
    switch (metricType) {
      case 'users':
        return `Currently ${summary.total_users} total users with ${summary.active_users} active users`;
      case 'activation':
        return `${summary.activation_rate.toFixed(1)}% of users have created at least one post`;
      case 'posts':
        return `${summary.posts.total} total posts across all users`;
      case 'publish':
        return `${summary.posts.publish_conversion.toFixed(1)}% of posts have been published`;
      default:
        return '';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
          <p className="text-sm text-gray-600 mt-2">{getDescription()}</p>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Main Chart */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Historical Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              {metricType === 'users' ? (
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8b5cf6" name="Total Users" strokeWidth={2} />
                  <Line type="monotone" dataKey="active" stroke="#10b981" name="Active Users" strokeWidth={2} />
                  <Line type="monotone" dataKey="new" stroke="#f59e0b" name="New Users" strokeWidth={2} />
                </LineChart>
              ) : metricType === 'posts' ? (
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="drafts" fill="#f59e0b" name="Drafts" />
                  <Bar dataKey="published" fill="#10b981" name="Published" />
                  <Bar dataKey="scheduled" fill="#3b82f6" name="Scheduled" />
                </BarChart>
              ) : (
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rate" stroke="#8b5cf6" name="Rate (%)" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Current Stats */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Current Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              {metricType === 'users' && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600">Total Users</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{summary.total_users}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-600">Active Users</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{summary.active_users}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs text-gray-600">Inactive Users</span>
                    <p className="text-2xl font-semibold text-gray-900">{summary.inactive_users}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs text-gray-600">With Published Posts</span>
                    <p className="text-2xl font-semibold text-gray-900">{summary.users_with_published_posts}</p>
                  </div>
                </>
              )}

              {metricType === 'posts' && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs text-gray-600">Total Posts</span>
                    <p className="text-2xl font-semibold text-gray-900">{summary.posts.total}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs text-gray-600">Drafts</span>
                    <p className="text-2xl font-semibold text-yellow-600">{summary.posts.drafts}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs text-gray-600">Published</span>
                    <p className="text-2xl font-semibold text-green-600">{summary.posts.published}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs text-gray-600">Scheduled</span>
                    <p className="text-2xl font-semibold text-blue-600">{summary.posts.scheduled}</p>
                  </div>
                </>
              )}

              {(metricType === 'activation' || metricType === 'publish') && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                    <span className="text-xs text-gray-600">
                      {metricType === 'activation' ? 'Current Activation Rate' : 'Current Publish Rate'}
                    </span>
                    <p className="text-3xl font-semibold text-gray-900">
                      {metricType === 'activation'
                        ? `${summary.activation_rate.toFixed(1)}%`
                        : `${summary.posts.publish_conversion.toFixed(1)}%`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Insights</h4>
            <p className="text-sm text-blue-800">
              {metricType === 'users' && `Your user base has grown to ${summary.total_users} users. Focus on converting the ${summary.inactive_users} inactive users to boost engagement.`}
              {metricType === 'activation' && `${summary.activation_rate.toFixed(1)}% activation rate. Consider onboarding improvements to help more users create their first post.`}
              {metricType === 'posts' && `Users have created ${summary.posts.total} posts. ${summary.posts.drafts} drafts are waiting to be published.`}
              {metricType === 'publish' && `Only ${summary.posts.publish_conversion.toFixed(1)}% of posts get published. Help users overcome publishing barriers.`}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
