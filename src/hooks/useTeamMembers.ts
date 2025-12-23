import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { teamAPI, userAPI } from '@/lib/api';

export interface TeamMemberWithDetails {
    id: string;
    user_id: string;
    added_by: string;
    created_at: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'admin' | 'member';
}

export interface SearchUser {
    _id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: 'admin' | 'member';
}

export const useTeamMembers = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch all team members with details
    const { data: teamMembers = [], isLoading, error } = useQuery({
        queryKey: ['team-members'],
        queryFn: async () => {
            const data = await teamAPI.getTeamMembers();
            return data as TeamMemberWithDetails[];
        },
        enabled: !!user,
    });

    // Search users who are NOT already team members
    const searchUsers = async (query: string): Promise<SearchUser[]> => {
        if (!query || query.trim().length < 2) {
            return [];
        }

        try {
            const data = await userAPI.searchUsers(query);
            return data.users; // Return the array of users from the paginated response
        } catch (error) {
            console.error('Search users error:', error);
            throw error;
        }
    };

    // Add team member
    const addTeamMember = useMutation({
        mutationFn: async (userId: string) => {
            return await teamAPI.addTeamMember(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team-members'] });
            toast({
                title: 'Team Member Added',
                description: 'The user has been added to the team successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.error?.message || 'Failed to add team member',
                variant: 'destructive',
            });
        },
    });

    // Remove team member
    const removeTeamMember = useMutation({
        mutationFn: async (memberId: string) => {
            return await teamAPI.removeTeamMember(memberId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team-members'] });
            toast({
                title: 'Team Member Removed',
                description: 'The user has been removed from the team.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.error?.message || 'Failed to remove team member',
                variant: 'destructive',
            });
        },
    });

    return {
        teamMembers,
        isLoading,
        error,
        searchUsers,
        addTeamMember,
        removeTeamMember,
    };
};
