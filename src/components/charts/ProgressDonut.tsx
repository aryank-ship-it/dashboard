import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressDonutProps {
  data: any[];
}

const ProgressDonut = ({ data }: ProgressDonutProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const completedItem = data.find(item => item.name === 'Completed');
  const completedPercent = total > 0 ? Math.round(((completedItem?.value || 0) / total) * 100) : 0;

  return (
    <div className="dashboard-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Project Progress</h3>
        <p className="text-sm text-muted-foreground">Overall completion rate</p>
      </div>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{completedPercent}%</span>
          <span className="text-sm text-muted-foreground">Complete</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressDonut;
