import type { UserMetric, UserActivityTimeline } from '@/types/devDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageSquare, FileText, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserExpandedRowProps {
  user: UserMetric;
  timeline: UserActivityTimeline[];
  onCollapse: () => void;
}

export function UserExpandedRow({ user, timeline, onCollapse }: UserExpandedRowProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = timeline.map(item => ({
    date: formatDate(item.date),
    posts: item.posts_created,
    messages: item.messages_sent,
    conversations: item.conversations_started,
  }));

  return (
    <tr className="bg-gray-50 border-t-2 border-primary/20 animate-in slide-in-from-top-2 fade-in duration-300">
      <td colSpan={5} className="p-6">
        <div className="space-y-6">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              {user.full_name}'s Activity Timeline
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronUp className="w-4 h-4 mr-1" />
              Collapse
            </Button>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-600">Total Posts</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{user.total_posts}</p>
              <div className="flex gap-2 mt-2 text-xs">
                <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">
                  {user.draft_posts} drafts
                </Badge>
                <Badge variant="secondary" className="text-green-600 bg-green-50">
                  {user.published_posts} published
                </Badge>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-600">Messages</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{user.total_messages}</p>
              <p className="text-xs text-gray-500 mt-2">
                in {user.total_conversations} conversations
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-600">Publish Rate</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {user.total_posts > 0
                  ? ((user.published_posts / user.total_posts) * 100).toFixed(1)
                  : '0'}%
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {user.published_posts} of {user.total_posts} posts
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <span className="text-xs text-gray-600">Last Active</span>
              <p className="text-sm font-medium text-gray-900 mt-2">
                {user.last_post_created_at
                  ? new Date(user.last_post_created_at).toLocaleDateString()
                  : user.last_message_at
                  ? new Date(user.last_message_at).toLocaleDateString()
                  : 'No activity'}
              </p>
            </div>
          </div>

          {/* Activity Line Chart */}
          {timeline.length > 0 ? (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">30-Day Activity Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Posts"
                    dot={{ fill: '#8b5cf6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Messages"
                    dot={{ fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversations"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Conversations"
                    dot={{ fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
              <p className="text-sm text-gray-500">No activity data available for this user</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
