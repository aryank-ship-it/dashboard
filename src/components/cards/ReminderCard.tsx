import { Video, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReminderCard = () => {
  return (
    <div className="dashboard-card overflow-hidden">
      <div className="gradient-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Video className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium opacity-90">Upcoming Meeting</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Project Review</h3>
        <p className="text-sm opacity-80 mb-4">Weekly sync with the design team to review progress</p>
        
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-4 w-4 opacity-80" />
          <span className="text-sm">2:00 PM - 3:00 PM</span>
        </div>
        
        <Button 
          className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
        >
          Start Meeting
        </Button>
      </div>
    </div>
  );
};

export default ReminderCard;
