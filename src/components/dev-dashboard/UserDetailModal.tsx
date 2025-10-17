import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { UserMetric } from '@/types/devDashboard';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, Mail, Calendar, MessageSquare, FileText, TrendingUp } from 'lucide-react';

interface UserDetailModalProps {
  user: UserMetric | null;
  open: boolean;
  onClose: () => void;
}

const COLORS = {
  draft: '#f59e0b',
  published: '#10b981',
  scheduled: '#3b82f6',
  failed: '#ef4444',
  cancelled: '#6b7280',
};

export function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  if (!user) return null;

  // Prepare post status data for pie chart
  const postStatusData = [
    { name: 'Drafts', value: user.draft_posts, color: COLORS.draft },
    { name: 'Published', value: user.published_posts, color: COLORS.published },
    { name: 'Scheduled', value: user.scheduled_posts, color: COLORS.scheduled },
    { name: 'Failed', value: user.failed_posts, color: COLORS.failed },
    { name: 'Cancelled', value: user.cancelled_posts, color: COLORS.cancelled },
  ].filter(item => item.value > 0);

  // Activity data for bar chart
  const activityData = [
    { name: 'Posts', count: user.total_posts },
    { name: 'Conversations', count: user.total_conversations },
    { name: 'Messages', count: user.total_messages },
  ];

  const engagementRate = user.total_posts > 0
    ? ((user.published_posts / user.total_posts) * 100).toFixed(1)
    : '0.0';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.full_name || 'Unknown'}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
              <Badge variant={user.subscription_tier === 'free' ? 'secondary' : 'default'}>
                {user.subscription_tier}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                {user.linkedin_connected ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-700">
                  {user.linkedin_connected ? 'LinkedIn Connected' : 'No LinkedIn'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {user.onboarding_completed ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-700">
                  {user.onboarding_completed ? 'Onboarding Complete' : 'Onboarding Incomplete'}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined: {new Date(user.user_created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Last login: {new Date(user.last_login_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Key Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Total Posts</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{user.total_posts}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Messages</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{user.total_messages}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Publish Rate</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{engagementRate}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Post Status Distribution */}
          {user.total_posts > 0 && (
            <>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Post Status Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={postStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {postStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <Separator />
            </>
          )}

          {/* Activity Overview */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Activity Overview</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Last Activity */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Last Activity</h4>
            <div className="space-y-2 text-sm">
              {user.last_post_created_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Post Created:</span>
                  <span className="text-gray-900">
                    {new Date(user.last_post_created_at).toLocaleString()}
                  </span>
                </div>
              )}
              {user.last_message_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Message:</span>
                  <span className="text-gray-900">
                    {new Date(user.last_message_at).toLocaleString()}
                  </span>
                </div>
              )}
              {!user.last_post_created_at && !user.last_message_at && (
                <p className="text-gray-500">No activity recorded</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
