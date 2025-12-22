import { useTasks } from './useTasks';
import { useEvents } from './useEvents';

export const useDashboardStats = () => {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { events, isLoading: eventsLoading } = useEvents();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;

  // Calculate weekly data for charts
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    return days.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      const dateStr = dayDate.toISOString().split('T')[0];

      const dayTasks = tasks.filter((t) => {
        const taskDate = t.createdAt.split('T')[0];
        return taskDate === dateStr;
      }).length;

      const dayEvents = events.filter((e) => e.date === dateStr).length;

      return { day, tasks: dayTasks, events: dayEvents };
    });
  };

  // Calculate progress data for donut chart
  const getProgressData = () => [
    { name: 'Completed', value: completedTasks, color: 'hsl(150, 60%, 40%)' },
    { name: 'In Progress', value: inProgressTasks, color: 'hsl(38, 92%, 50%)' },
    { name: 'To Do', value: todoTasks, color: 'hsl(150, 10%, 70%)' },
  ];

  return {
    stats: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      upcomingEvents,
    },
    weeklyData: getWeeklyData(),
    progressData: getProgressData(),
    isLoading: tasksLoading || eventsLoading,
  };
};
