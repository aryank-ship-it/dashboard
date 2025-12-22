import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/cards/StatCard';
import WeeklyBarChart from '@/components/charts/WeeklyBarChart';
import ProgressDonut from '@/components/charts/ProgressDonut';
import TimeTracker from '@/components/cards/TimeTracker';
import ReminderCard from '@/components/cards/ReminderCard';
import TeamCollaboration from '@/components/cards/TeamCollaboration';
import { Folder, CheckCircle, Clock, Calendar, Loader2 } from 'lucide-react';
import { teamMembers } from '@/lib/data';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProfile } from '@/hooks/useProfile';

const Dashboard = () => {
  const { stats, weeklyData, progressData, isLoading } = useDashboardStats();
  const { profile } = useProfile();

  const displayName = profile?.fullName?.split(' ')[0] || 'there';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {displayName}! Here's what's happening.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div style={{ animationDelay: '0ms' }}>
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              trend={0}
              icon={Folder}
            />
          </div>
          <div style={{ animationDelay: '100ms' }}>
            <StatCard
              title="Completed"
              value={stats.completedTasks}
              trend={0}
              icon={CheckCircle}
            />
          </div>
          <div style={{ animationDelay: '200ms' }}>
            <StatCard
              title="In Progress"
              value={stats.inProgressTasks}
              trend={0}
              icon={Clock}
            />
          </div>
          <div style={{ animationDelay: '300ms' }}>
            <StatCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              trend={0}
              icon={Calendar}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Analytics & Reminders */}
          <div className="space-y-6 lg:col-span-2">
            <WeeklyBarChart data={weeklyData} />
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ReminderCard />
              <TimeTracker />
            </div>
          </div>

          {/* Right Column - Progress & Team */}
          <div className="space-y-6">
            <ProgressDonut data={progressData} />
            <TeamCollaboration members={teamMembers} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
