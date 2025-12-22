import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TimeTracker = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="dashboard-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Time Tracker</h3>
        <p className="text-sm text-muted-foreground">Track your work sessions</p>
      </div>

      <div className="flex flex-col items-center py-6">
        <div className="text-5xl font-mono font-bold text-foreground tracking-wider">
          {formatTime(seconds)}
        </div>
        
        <div className="mt-6 flex items-center gap-3">
          <Button
            size="lg"
            className={isRunning ? 'bg-warning hover:bg-warning/90' : 'bg-primary hover:bg-primary/90'}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            disabled={seconds === 0}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
