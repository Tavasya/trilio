import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllUsers,
  fetchSummary,
  fetchUserActivity,
  fetchGrowthTimeline,
  fetchPostsTimeline,
  setFilter,
  setSearchQuery,
  setHideAdmins
} from '@/features/devDashboard/devDashboardSlice';
import { StatsOverview } from '@/components/dev-dashboard/StatsOverview';
import { UserTable } from '@/components/dev-dashboard/UserTable';
import { MetricsDetailModal } from '@/components/dev-dashboard/MetricsDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, Filter, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { UserMetric } from '@/types/devDashboard';

export default function DevDashboard() {
  const dispatch = useAppDispatch();
  const {
    allUsers,
    summary,
    growthTimeline,
    postsTimeline,
    userActivityTimeline,
    loading,
    error,
    filter,
    searchQuery,
    hideAdmins
  } = useAppSelector((state) => state.devDashboard);

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'activation' | 'posts' | 'publish' | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right' });
    }
  }, [error]);

  // Fetch timelines when metric modal opens
  useEffect(() => {
    if (selectedMetric === 'users' || selectedMetric === 'activation') {
      if (growthTimeline.length === 0) {
        dispatch(fetchGrowthTimeline(90));
      }
    }
    if (selectedMetric === 'posts' || selectedMetric === 'publish') {
      if (postsTimeline.length === 0) {
        dispatch(fetchPostsTimeline(90));
      }
    }
  }, [selectedMetric, growthTimeline.length, postsTimeline.length, dispatch]);

  const loadDashboardData = () => {
    dispatch(fetchAllUsers());
    dispatch(fetchSummary());
  };

  const handleUserClick = async (user: UserMetric) => {
    if (expandedUserId === user.user_id) {
      // Collapse if already expanded
      setExpandedUserId(null);
      setLoadingUserId(null);
    } else {
      // Expand immediately
      setExpandedUserId(user.user_id);

      // Fetch timeline if not already loaded
      if (!userActivityTimeline[user.user_id]) {
        setLoadingUserId(user.user_id);
        try {
          await dispatch(fetchUserActivity({ userId: user.user_id, days: 30 })).unwrap();
        } catch {
          toast.error('Failed to load user activity', { position: 'top-right' });
          setExpandedUserId(null);
        } finally {
          setLoadingUserId(null);
        }
      }
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    toast.success('Dashboard refreshed', { position: 'top-right' });
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
  };

  const filteredUsers = useMemo(() => {
    let users = [...allUsers];

    // Hide admins if toggled
    if (hideAdmins) {
      users = users.filter(user => !user.is_admin);
    }

    // Apply filter
    if (filter === 'active') {
      users = users.filter(user => user.has_created_posts);
    } else if (filter === 'inactive') {
      users = users.filter(user => !user.has_created_posts);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      users = users.filter(user =>
        user.email.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query)
      );
    }

    return users;
  }, [allUsers, filter, searchQuery, hideAdmins]);

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Dev Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor user activity and platform metrics
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
              className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview
            summary={summary}
            loading={loading}
            onCardClick={(metricType) => setSelectedMetric(metricType)}
          />
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={localSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => dispatch(setFilter('all'))}
                    >
                      All ({allUsers.length})
                    </Button>
                    <Button
                      variant={filter === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => dispatch(setFilter('active'))}
                    >
                      Active ({allUsers.filter(u => u.has_created_posts).length})
                    </Button>
                    <Button
                      variant={filter === 'inactive' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => dispatch(setFilter('inactive'))}
                    >
                      Inactive ({allUsers.filter(u => !u.has_created_posts).length})
                    </Button>
                  </div>
                </div>

                {/* Hide Admins Toggle */}
                <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
                  <Button
                    variant={hideAdmins ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => dispatch(setHideAdmins(!hideAdmins))}
                  >
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide Admins
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Table */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          title={`Users (${filteredUsers.length})`}
          onUserClick={handleUserClick}
          expandedUserId={expandedUserId}
          userTimelines={userActivityTimeline}
          onCollapseUser={() => {
            setExpandedUserId(null);
            setLoadingUserId(null);
          }}
          loadingUserId={loadingUserId}
        />

        {/* Modals */}
        <MetricsDetailModal
          open={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          metricType={selectedMetric}
          summary={summary}
          growthTimeline={growthTimeline}
          postsTimeline={postsTimeline}
        />
      </div>
    </div>
  );
}
