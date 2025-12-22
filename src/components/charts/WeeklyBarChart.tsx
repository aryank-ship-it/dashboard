import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { weeklyData } from '@/lib/data';

const WeeklyBarChart = () => {
  const today = new Date().getDay();

  return (
    <div className="dashboard-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Project Analytics</h3>
        <p className="text-sm text-muted-foreground">Weekly task completion</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap="20%">
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }}
            />
            <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
              {weeklyData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={index === today ? 'hsl(150, 68%, 19%)' : 'hsl(150, 15%, 85%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyBarChart;
