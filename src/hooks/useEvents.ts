import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type EventRow = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  description: string | null;
  createdAt: string;
}

const mapEventFromDb = (event: EventRow): CalendarEvent => ({
  id: event.id,
  title: event.title,
  date: event.date,
  color: event.color,
  description: event.description,
  createdAt: event.created_at,
});

export const useEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      return (data || []).map(mapEventFromDb);
    },
    enabled: !!user,
  });

  const addEvent = useMutation({
    mutationFn: async (newEvent: Omit<EventInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...newEvent,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return mapEventFromDb(data);
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Created',
        description: `"${event.title}" has been scheduled for ${event.date}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Deleted',
        description: 'Event has been removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    events,
    isLoading,
    error,
    addEvent,
    deleteEvent,
  };
};
