import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddEventDialog from '@/components/dialogs/AddEventDialog';
import { useEvents, CalendarEvent } from '@/hooks/useEvents';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const colorStyles: Record<string, string> = {
  '#8B5CF6': 'bg-primary/10 text-primary border-l-4 border-l-primary',
  '#EF4444': 'bg-destructive/10 text-destructive border-l-4 border-l-destructive',
  '#F59E0B': 'bg-warning/10 text-warning border-l-4 border-l-warning',
  '#10B981': 'bg-success/10 text-success border-l-4 border-l-success',
  '#3B82F6': 'bg-info/10 text-info border-l-4 border-l-info',
};

const getEventStyle = (color: string) => {
  return colorStyles[color] || 'bg-primary/10 text-primary border-l-4 border-l-primary';
};

import { useSearch } from '@/contexts/SearchContext';

const CalendarPage = () => {
  const { events, isLoading, createEvent, deleteEvent } = useEvents();
  const { searchQuery } = useSearch();
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.date.includes(searchQuery)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter((event) => event.date === dateStr);
  };

  const handleAddEvent = (newEvent: { title: string; date: string; color: string; description?: string }) => {
    createEvent.mutate({
      title: newEvent.title,
      date: newEvent.date,
      color: newEvent.color,
      description: newEvent.description || undefined,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent.mutate(eventId);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your events</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => {
            setSelectedDate('');
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Calendar */}
        <div className="dashboard-card p-6">
          {/* Calendar Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">{monthName}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="min-h-24 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];

                return (
                  <div
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    className={cn(
                      'min-h-24 rounded-lg border border-transparent p-2 transition-colors',
                      day && 'hover:bg-muted/50 cursor-pointer',
                      isToday(day || 0) && 'bg-primary/5 border-primary/20'
                    )}
                  >
                    {day && (
                      <>
                        <span className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm',
                          isToday(day) && 'bg-primary text-primary-foreground font-medium'
                        )}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event._id}
                              className={cn(
                                'rounded px-1.5 py-0.5 text-xs truncate',
                                getEventStyle(event.color)
                              )}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Upcoming Events</h3>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No events found. {searchQuery ? 'Try a different search.' : 'Click on a day or "Add Event" to create one.'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className={cn(
                    'flex items-center justify-between rounded-lg p-3',
                    getEventStyle(event.color)
                  )}
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm opacity-80">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      onClick={() => handleDeleteEvent(event._id)}
                      disabled={deleteEvent.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddEventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddEvent={handleAddEvent}
        defaultDate={selectedDate}
      />
    </DashboardLayout>
  );
};

export default CalendarPage;
