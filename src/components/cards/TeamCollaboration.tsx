import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/data';

interface TeamCollaborationProps {
  members: TeamMember[];
}

const statusStyles = {
  'online': 'bg-success',
  'offline': 'bg-muted-foreground',
  'busy': 'bg-warning',
};

const TeamCollaboration = ({ members }: TeamCollaborationProps) => {
  return (
    <div className="dashboard-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Team Collaboration</h3>
        <p className="text-sm text-muted-foreground">Active team members</p>
      </div>
      
      <div className="space-y-4">
        {members.slice(0, 4).map((member) => (
          <div key={member.id} className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <span 
                className={cn(
                  'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card',
                  statusStyles[member.status]
                )}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{member.name}</p>
              <p className="text-sm text-muted-foreground truncate">{member.currentTask}</p>
            </div>
            
            <Badge variant="outline" className="text-xs shrink-0">
              {member.role.split(' ')[0]}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCollaboration;
