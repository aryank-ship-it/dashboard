// Mock data for the dashboard

export interface StatCard {
  id: string;
  title: string;
  value: number;
  trend: number;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  progress: number;
  team: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  currentTask: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  project: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

export const statCards: StatCard[] = [
  { id: '1', title: 'Total Projects', value: 45, trend: 12, icon: 'folder' },
  { id: '2', title: 'Completed', value: 28, trend: 8, icon: 'check-circle' },
  { id: '3', title: 'In Progress', value: 12, trend: -3, icon: 'clock' },
  { id: '4', title: 'Pending', value: 5, trend: 2, icon: 'pause-circle' },
];

export const projects: Project[] = [
  { id: '1', name: 'Website Redesign', status: 'in-progress', dueDate: '2024-02-15', progress: 65, team: ['JD', 'AM', 'SK'] },
  { id: '2', name: 'Mobile App Development', status: 'in-progress', dueDate: '2024-03-01', progress: 40, team: ['RK', 'LP'] },
  { id: '3', name: 'Brand Identity', status: 'completed', dueDate: '2024-01-20', progress: 100, team: ['AM', 'JD'] },
  { id: '4', name: 'Marketing Campaign', status: 'pending', dueDate: '2024-02-28', progress: 0, team: ['SK', 'LP', 'RK'] },
  { id: '5', name: 'E-commerce Platform', status: 'in-progress', dueDate: '2024-04-10', progress: 25, team: ['JD', 'RK'] },
];

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Project Manager', avatar: 'JD', status: 'online', currentTask: 'Website Redesign' },
  { id: '2', name: 'Alice Morgan', email: 'alice@example.com', role: 'UI/UX Designer', avatar: 'AM', status: 'online', currentTask: 'Brand Identity' },
  { id: '3', name: 'Sam Kim', email: 'sam@example.com', role: 'Frontend Developer', avatar: 'SK', status: 'busy', currentTask: 'Marketing Campaign' },
  { id: '4', name: 'Lisa Park', email: 'lisa@example.com', role: 'Backend Developer', avatar: 'LP', status: 'offline', currentTask: 'Mobile App Development' },
  { id: '5', name: 'Ryan Kelly', email: 'ryan@example.com', role: 'Full Stack Developer', avatar: 'RK', status: 'online', currentTask: 'E-commerce Platform' },
];

export const tasks: Task[] = [
  { id: '1', title: 'Design homepage wireframes', description: 'Create wireframes for the new homepage', status: 'completed', priority: 'high', assignee: 'Alice Morgan', dueDate: '2024-01-25', project: 'Website Redesign' },
  { id: '2', title: 'Implement authentication', description: 'Set up user authentication system', status: 'in-progress', priority: 'high', assignee: 'Ryan Kelly', dueDate: '2024-02-01', project: 'Mobile App Development' },
  { id: '3', title: 'Write API documentation', description: 'Document all REST endpoints', status: 'todo', priority: 'medium', assignee: 'Lisa Park', dueDate: '2024-02-10', project: 'E-commerce Platform' },
  { id: '4', title: 'Create social media assets', description: 'Design graphics for social media', status: 'in-progress', priority: 'medium', assignee: 'Alice Morgan', dueDate: '2024-02-05', project: 'Marketing Campaign' },
  { id: '5', title: 'Set up CI/CD pipeline', description: 'Configure automated deployments', status: 'todo', priority: 'low', assignee: 'Sam Kim', dueDate: '2024-02-15', project: 'Website Redesign' },
  { id: '6', title: 'User testing sessions', description: 'Conduct user testing for new features', status: 'todo', priority: 'high', assignee: 'John Doe', dueDate: '2024-02-20', project: 'Mobile App Development' },
];

export const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', date: '2024-01-22', time: '09:00', type: 'meeting' },
  { id: '2', title: 'Project Review', date: '2024-01-22', time: '14:00', type: 'meeting' },
  { id: '3', title: 'Design Deadline', date: '2024-01-25', time: '17:00', type: 'deadline' },
  { id: '4', title: 'Client Call', date: '2024-01-26', time: '11:00', type: 'meeting' },
  { id: '5', title: 'Sprint Planning', date: '2024-01-29', time: '10:00', type: 'meeting' },
];

export const weeklyData = [
  { day: 'Sun', tasks: 4, projects: 2 },
  { day: 'Mon', tasks: 12, projects: 5 },
  { day: 'Tue', tasks: 8, projects: 3 },
  { day: 'Wed', tasks: 15, projects: 6 },
  { day: 'Thu', tasks: 10, projects: 4 },
  { day: 'Fri', tasks: 7, projects: 3 },
  { day: 'Sat', tasks: 3, projects: 1 },
];

export const projectProgress = [
  { name: 'Completed', value: 28, color: 'hsl(150, 60%, 40%)' },
  { name: 'In Progress', value: 12, color: 'hsl(38, 92%, 50%)' },
  { name: 'Pending', value: 5, color: 'hsl(150, 10%, 70%)' },
];

export const monthlyAnalytics = [
  { month: 'Jan', revenue: 4200, projects: 8 },
  { month: 'Feb', revenue: 5100, projects: 12 },
  { month: 'Mar', revenue: 4800, projects: 10 },
  { month: 'Apr', revenue: 6200, projects: 15 },
  { month: 'May', revenue: 5800, projects: 14 },
  { month: 'Jun', revenue: 7100, projects: 18 },
];
