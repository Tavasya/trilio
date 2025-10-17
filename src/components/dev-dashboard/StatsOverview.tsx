import { MetricsCard } from './MetricsCard';
import { Users, UserCheck, FileText, TrendingUp } from 'lucide-react';
import type { DashboardSummary } from '@/types/devDashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsOverviewProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onCardClick?: (metricType: 'users' | 'activation' | 'posts' | 'publish') => void;
}

export function StatsOverview({ summary, loading, onCardClick }: StatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricsCard
        title="Total Users"
        value={summary.total_users}
        subtitle={`${summary.active_users} active`}
        icon={Users}
        onClick={() => onCardClick?.('users')}
      />

      <MetricsCard
        title="Activation Rate"
        value={`${summary.activation_rate.toFixed(1)}%`}
        subtitle={`${summary.active_users} of ${summary.total_users} users`}
        icon={UserCheck}
        onClick={() => onCardClick?.('activation')}
      />

      <MetricsCard
        title="Total Posts"
        value={summary.posts.total}
        subtitle={`${summary.posts.published} published`}
        icon={FileText}
        onClick={() => onCardClick?.('posts')}
      />

      <MetricsCard
        title="Publish Rate"
        value={`${summary.posts.publish_conversion.toFixed(1)}%`}
        subtitle={`${summary.posts.published} of ${summary.posts.total} posts`}
        icon={TrendingUp}
        onClick={() => onCardClick?.('publish')}
      />
    </div>
  );
}
