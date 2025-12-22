import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/cards/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart
} from 'recharts';
import { DollarSign, TrendingUp, Users, Target, Upload, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { parseCSV, parseExcel, processAnalyticsData, AnalyticsData, MonthlyData } from '@/lib/analytics-utils';

const Analytics = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for dashboard data
  const [kpis, setKpis] = useState<AnalyticsData>({
    revenue: 0,
    growth: 0,
    users: 0,
    conversion: 0
  });

  const [chartData, setChartData] = useState<MonthlyData[]>([
    { month: 'Jan', revenue: 0, projects: 0 },
    { month: 'Feb', revenue: 0, projects: 0 },
    { month: 'Mar', revenue: 0, projects: 0 },
    { month: 'Apr', revenue: 0, projects: 0 },
    { month: 'May', revenue: 0, projects: 0 },
    { month: 'Jun', revenue: 0, projects: 0 },
  ]);

  const [analysisResult, setAnalysisResult] = useState<null | {
    size: string;
    type: string;
    status: 'clean' | 'warning' | 'error';
  }>(null);

  const resetData = () => {
    setKpis({
      revenue: 0,
      growth: 0,
      users: 0,
      conversion: 0
    });
    setChartData([
      { month: 'Jan', revenue: 0, projects: 0 },
      { month: 'Feb', revenue: 0, projects: 0 },
      { month: 'Mar', revenue: 0, projects: 0 },
      { month: 'Apr', revenue: 0, projects: 0 },
      { month: 'May', revenue: 0, projects: 0 },
      { month: 'Jun', revenue: 0, projects: 0 },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisResult(null);
      setError(null);
      resetData();
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

    try {
      let result;
      if (file.name.endsWith('.csv')) {
        result = await parseCSV(file);
      } else if (file.name.match(/\.(xlsx|xls)$/)) {
        result = await parseExcel(file);
      } else {
        throw new Error("Unsupported file format");
      }

      if ((!result.summary || Object.keys(result.summary).length === 0) && (!result.monthly || result.monthly.length === 0)) {
        throw new Error("Could not find required data columns. Please check file structure.");
      }

      const { kpis: newKpis, chartData: newChartData } = processAnalyticsData(result.summary, result.monthly);

      setKpis(newKpis);
      if (newChartData.length > 0) {
        setChartData(newChartData);
      }

      setAnalysisResult({
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'Unknown',
        status: 'clean'
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse file.");
      setAnalysisResult({
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'Unknown',
        status: 'error'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track performance and insights</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`$${(kpis.revenue / 1000).toFixed(1)}K`}
            trend={18}
            icon={DollarSign}
          />
          <StatCard
            title="Growth Rate"
            value={`${kpis.growth}%`}
            trend={5}
            icon={TrendingUp}
          />
          <StatCard
            title="Active Users"
            value={kpis.users.toLocaleString()}
            trend={12}
            icon={Users}
          />
          <StatCard
            title="Conversion"
            value={`${kpis.conversion}%`}
            trend={-2}
            icon={Target}
          />
        </div>

        {/* File Analysis Section */}
        <div className="dashboard-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">File Analysis</h3>
            <p className="text-sm text-muted-foreground">Upload a CSV or Excel file to populate the dashboard.</p>
          </div>

          <div className="flex flex-col gap-6 md:flex-row">
            {/* Upload Area */}
            <div className="flex-1">
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-8 text-center transition-colors hover:border-primary/50">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 text-sm font-semibold text-foreground">Click to upload</h4>
                <p className="mb-4 text-xs text-muted-foreground">CSV or Excel (.xlsx)</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.xls"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">Select File</label>
                </Button>
              </div>
            </div>

            {/* Analysis Result Area */}
            {file && (
              <div className="flex-1 space-y-4 rounded-xl border border-border bg-card p-6 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {!analysisResult || analysisResult.status === 'error' ? (
                  <Button onClick={handleAnalyze} disabled={analyzing} className="w-full">
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className="flex items-center gap-1 text-sm font-medium text-success">
                          <CheckCircle className="h-4 w-4" />
                          Success
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium text-foreground">{analysisResult.type}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => { setFile(null); setAnalysisResult(null); resetData(); }}>
                      Analyze Another File
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="dashboard-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly revenue trends</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150, 68%, 19%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(150, 68%, 19%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }}
                    tickFormatter={(value) => value === 0 ? '0' : `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(150, 15%, 90%)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(150, 68%, 19%)"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projects Chart */}
          <div className="dashboard-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Projects Completed</h3>
              <p className="text-sm text-muted-foreground">Monthly project completion</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(150, 10%, 45%)', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(150, 15%, 90%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar
                    dataKey="projects"
                    fill="hsl(150, 68%, 19%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="dashboard-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
            <p className="text-sm text-muted-foreground">Key performance indicators</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Avg. Project Duration</p>
              <p className="mt-2 text-2xl font-bold text-foreground">23 days</p>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Team Efficiency</p>
              <p className="mt-2 text-2xl font-bold text-foreground">89%</p>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-full w-[89%] rounded-full bg-success" />
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              <p className="mt-2 text-2xl font-bold text-foreground">4.8/5</p>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-full w-[96%] rounded-full bg-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
