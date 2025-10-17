import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserMetric, UserActivityTimeline } from '@/types/devDashboard';
import { CheckCircle, XCircle, MessageSquare, FileText } from 'lucide-react';
import { UserExpandedRow } from './UserExpandedRow';
import { UserExpandedRowSkeleton } from './UserExpandedRowSkeleton';

interface UserTableProps {
  users: UserMetric[];
  loading: boolean;
  title: string;
  onUserClick?: (user: UserMetric) => void;
  expandedUserId?: string | null;
  userTimelines?: Record<string, UserActivityTimeline[]>;
  onCollapseUser?: () => void;
  loadingUserId?: string | null;
}

export function UserTable({
  users,
  loading,
  title,
  onUserClick,
  expandedUserId,
  userTimelines = {},
  onCollapseUser,
  loadingUserId = null
}: UserTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">No users found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Posts</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Messages</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <>
                  <tr
                    key={user.user_id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      expandedUserId === user.user_id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => onUserClick?.(user)}
                  >
                    <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{user.full_name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        {user.linkedin_connected ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-600">
                          {user.linkedin_connected ? 'LinkedIn' : 'No LinkedIn'}
                        </span>
                      </div>
                      <Badge variant={user.subscription_tier === 'free' ? 'secondary' : 'default'} className="w-fit text-xs">
                        {user.subscription_tier}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">{user.total_posts}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span className="text-yellow-600">{user.draft_posts}D</span>
                        <span className="text-green-600">{user.published_posts}P</span>
                        {user.scheduled_posts > 0 && (
                          <span className="text-blue-600">{user.scheduled_posts}S</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.total_messages}</span>
                    </div>
                    <span className="text-xs text-gray-500">{user.total_conversations} chats</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      {user.last_post_created_at ? (
                        <>
                          <span className="text-xs text-gray-600">Post:</span>
                          <span className="text-xs text-gray-900">
                            {new Date(user.last_post_created_at).toLocaleDateString()}
                          </span>
                        </>
                      ) : user.last_message_at ? (
                        <>
                          <span className="text-xs text-gray-600">Message:</span>
                          <span className="text-xs text-gray-900">
                            {new Date(user.last_message_at).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">No activity</span>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedUserId === user.user_id && (
                  <>
                    {loadingUserId === user.user_id ? (
                      <UserExpandedRowSkeleton />
                    ) : userTimelines[user.user_id] ? (
                      <UserExpandedRow
                        user={user}
                        timeline={userTimelines[user.user_id]}
                        onCollapse={() => onCollapseUser?.()}
                      />
                    ) : null}
                  </>
                )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
