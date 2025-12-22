import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: {
    title: string;
    date: string;
    color: string;
    description?: string;
  }) => void;
  defaultDate?: string;
}

const colorOptions = [
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EF4444', label: 'Red' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#10B981', label: 'Green' },
  { value: '#3B82F6', label: 'Blue' },
];

const AddEventDialog = ({ open, onOpenChange, onAddEvent, defaultDate }: AddEventDialogProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate || '');
  const [color, setColor] = useState('#8B5CF6');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setIsSubmitting(true);
    
    onAddEvent({
      title,
      date,
      color,
      description: description || undefined,
    });

    // Reset form
    setTitle('');
    setDate('');
    setColor('#8B5CF6');
    setDescription('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Event</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Schedule a new event on your calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="eventTitle">Title *</Label>
              <Input
                id="eventTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {colorOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full" 
                            style={{ backgroundColor: opt.value }}
                          />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Event'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
