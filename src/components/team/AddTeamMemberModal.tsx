import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { useTeamMembers, SearchUser } from '@/hooks/useTeamMembers';
import { cn } from '@/lib/utils';

interface AddTeamMemberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddTeamMemberModal = ({ open, onOpenChange }: AddTeamMemberModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const { searchUsers, addTeamMember } = useTeamMembers();

    // Debounced search function
    const performSearch = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        setHasSearched(true);

        try {
            const results = await searchUsers(query);
            setSearchResults(results);
        } catch (error) {
            setSearchError(error instanceof Error ? error.message : 'Failed to search users');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchUsers]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const handleAddMember = async (userId: string) => {
        try {
            await addTeamMember.mutateAsync(userId);
            // Remove the added user from search results
            setSearchResults(prev => prev.filter(user => user._id !== userId));
            // If no more results, close modal
            if (searchResults.length <= 1) {
                onOpenChange(false);
                setSearchQuery('');
                setSearchResults([]);
                setHasSearched(false);
            }
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const getInitials = (fullName: string | null, email: string) => {
        if (fullName) {
            return fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return email.slice(0, 2).toUpperCase();
    };

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setSearchQuery('');
            setSearchResults([]);
            setHasSearched(false);
            setSearchError(null);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                        Search for registered users by name or email to add them to your team.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            autoFocus
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                    </div>

                    {/* Search Results */}
                    <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                        {/* Empty State - Before Search */}
                        {!hasSearched && !isSearching && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Search users to add to your team
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Type at least 2 characters to start searching
                                </p>
                            </div>
                        )}

                        {/* Loading State */}
                        {isSearching && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                                <p className="text-sm text-muted-foreground">Searching users...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {searchError && !isSearching && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <AlertCircle className="h-12 w-12 text-destructive mb-3" />
                                <p className="text-sm text-destructive font-medium">Error</p>
                                <p className="text-xs text-muted-foreground mt-1">{searchError}</p>
                            </div>
                        )}

                        {/* No Results State */}
                        {hasSearched && !isSearching && !searchError && searchResults.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground font-medium">
                                    No registered users found
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Try a different search term
                                </p>
                            </div>
                        )}

                        {/* Search Results List */}
                        {!isSearching && searchResults.length > 0 && (
                            <div className="space-y-2">
                                {searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        className={cn(
                                            'flex items-center justify-between p-3 rounded-lg border border-border',
                                            'hover:bg-accent/50 transition-colors'
                                        )}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <Avatar className="h-10 w-10 flex-shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                                    {getInitials(user.fullName, user.email)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-foreground truncate">
                                                    {user.fullName || user.email}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'capitalize text-xs flex-shrink-0',
                                                    user.role === 'admin' && 'border-primary/30 text-primary'
                                                )}
                                            >
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddMember(user._id)}
                                            disabled={addTeamMember.isPending}
                                            className="ml-3 flex-shrink-0"
                                        >
                                            {addTeamMember.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4 mr-1" />
                                                    Add
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
