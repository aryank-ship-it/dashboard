import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { taskAPI, eventAPI, teamAPI } from '@/lib/api';

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?._id],
    queryFn: async () => {
      const [tasks, events, teamMembers] = await Promise.all([
        taskAPI.getTasks(),
        eventAPI.getEvents(),
        teamAPI.getTeamMembers(),
      ]);

      const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
      const inProgressTasks = tasks.filter((t: any) => t.status === 'in-progress').length;
      const todoTasks = tasks.filter((t: any) => t.status === 'todo').length;
      const upcomingEvents = events.filter((e: any) => new Date(e.date) >= new Date()).length;

      // Weekly data for charts
      const getWeeklyData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        return days.map((day, index) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + index);
          const dateStr = dayDate.toISOString().split('T')[0];

          const dayTasksCount = tasks.filter((t: any) => {
            const taskDate = (t.createdAt || t.created_at || '').split('T')[0];
            return taskDate === dateStr;
          }).length;

          const dayEventsCount = events.filter((e: any) => {
            const eventDate = (e.date || '').split('T')[0];
            return eventDate === dateStr;
          }).length;

          return {
            name: day,
            tasks: dayTasksCount,
            events: dayEventsCount,
          };
        });
      };

      const progressData = [
        { name: 'Completed', value: completedTasks, color: '#10B981' },
        { name: 'In Progress', value: inProgressTasks, color: '#3B82F6' },
        { name: 'Todo', value: todoTasks, color: '#F59E0B' },
      ];

      return {
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        todoTasks,
        upcomingEvents,
        teamCount: teamMembers.length,
        weeklyData: getWeeklyData(),
        progressData,
      };
    },
    enabled: !!user,
  });
};
