import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://dashboard-backend-1-ycf9.onrender.com';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (email: string, password: string, fullName: string) => {
        const { data } = await api.post('/auth/register', { email, password, fullName });
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    login: async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};

// User API
export const userAPI = {
    getProfile: async () => {
        const { data } = await api.get('/users/me');
        return data;
    },

    updateProfile: async (updates: { fullName?: string; avatarUrl?: string }) => {
        const { data } = await api.put('/users/me', updates);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    searchUsers: async (query: string) => {
        const { data } = await api.get('/users/search', { params: { q: query } });
        return data;
    },
};

// Team API
export const teamAPI = {
    getTeamMembers: async () => {
        const { data } = await api.get('/team-members');
        return data;
    },

    addTeamMember: async (userId: string) => {
        const { data } = await api.post('/team-members', { user_id: userId });
        return data;
    },

    removeTeamMember: async (memberId: string) => {
        const { data } = await api.delete(`/team-members/${memberId}`);
        return data;
    },
};

// Task API
export const taskAPI = {
    getTasks: async () => {
        const { data } = await api.get('/tasks');
        return data;
    },

    createTask: async (task: {
        title: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string;
    }) => {
        const { data } = await api.post('/tasks', task);
        return data;
    },

    updateTask: async (id: string, updates: any) => {
        const { data } = await api.put(`/tasks/${id}`, updates);
        return data;
    },

    deleteTask: async (id: string) => {
        const { data } = await api.delete(`/tasks/${id}`);
        return data;
    },
};

// Event API
export const eventAPI = {
    getEvents: async () => {
        const { data } = await api.get('/events');
        return data;
    },

    createEvent: async (event: {
        title: string;
        date: string;
        color?: string;
        description?: string;
    }) => {
        const { data } = await api.post('/events', event);
        return data;
    },

    updateEvent: async (id: string, updates: any) => {
        const { data } = await api.put(`/events/${id}`, updates);
        return data;
    },

    deleteEvent: async (id: string) => {
        const { data } = await api.delete(`/events/${id}`);
        return data;
    },
};
