import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
}

const statusStyles = {
  'completed': 'bg-success/10 text-success border-success/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  'pending': 'bg-muted text-muted-foreground border-border',
};

const statusLabels = {
  'completed': 'Completed',
  'in-progress': 'In Progress',
  'pending': 'Pending',
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{project.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">Due: {project.dueDate}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {project.team.slice(0, 3).map((member, i) => (
            <Avatar key={i} className="h-7 w-7 border-2 border-card">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {member}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        
        <Badge 
          variant="outline" 
          className={cn('text-xs font-medium', statusStyles[project.status])}
        >
          {statusLabels[project.status]}
        </Badge>
      </div>
    </div>
  );
};

export default ProjectCard;
