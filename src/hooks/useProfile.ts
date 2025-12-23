import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { userAPI } from '@/lib/api';

export interface Profile {
  _id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?._id],
    queryFn: async () => {
      if (!user) return null;
      return await userAPI.getProfile();
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { fullName?: string; avatarUrl?: string }) => {
      if (!user) throw new Error('User not authenticated');
      return await userAPI.updateProfile(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Also invalidate authentication user since profile data is shared
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
};
