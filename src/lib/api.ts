import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL ||
    'https://dashboard-backend-1-ycf9.onrender.com';

// remove this url on production

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Attach auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401
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

// ================= AUTH (already correct) =================
export const authAPI = {
    register: async (email: string, password: string, fullName: string) => {
        const { data } = await api.post('/api/auth/register', {
            email,
            password,
            fullName,
        });
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    login: async (email: string, password: string) => {
        const { data } = await api.post('/api/auth/login', { email, password });
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

// ================= USERS =================
export const userAPI = {
    getProfile: async () => {
        const { data } = await api.get('/api/users/me');
        return data;
    },

    updateProfile: async (updates: {
        fullName?: string;
        avatarUrl?: string;
    }) => {
        const { data } = await api.put('/api/users/me', updates);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    searchUsers: async (query: string) => {
        const { data } = await api.get('/api/users/search', {
            params: { q: query },
        });
        return data;
    },
};

// ================= TEAM =================
export const teamAPI = {
    getTeamMembers: async () => {
        const { data } = await api.get('/api/team-members');
        return data;
    },

    addTeamMember: async (userId: string) => {
        const { data } = await api.post('/api/team-members', {
            user_id: userId,
        });
        return data;
    },

    removeTeamMember: async (memberId: string) => {
        const { data } = await api.delete(
            `/api/team-members/${memberId}`
        );
        return data;
    },
};

//okya now all set

// ================= TASKS =================
export const taskAPI = {
    getTasks: async () => {
        const { data } = await api.get('/api/tasks');
        return data;
    },

    createTask: async (task: {
        title: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string;
    }) => {
        const { data } = await api.post('/api/tasks', task);
        return data;
    },

    updateTask: async (id: string, updates: any) => {
        const { data } = await api.put(`/api/tasks/${id}`, updates);
        return data;
    },

    deleteTask: async (id: string) => {
        const { data } = await api.delete(`/api/tasks/${id}`);
        return data;
    },
};

// ================= EVENTS =================
export const eventAPI = {
    getEvents: async () => {
        const { data } = await api.get('/api/events');
        return data;
    },

    createEvent: async (event: {
        title: string;
        date: string;
        color?: string;
        description?: string;
    }) => {
        const { data } = await api.post('/api/events', event);
        return data;
    },

    updateEvent: async (id: string, updates: any) => {
        const { data } = await api.put(`/api/events/${id}`, updates);
        return data;
    },

    deleteEvent: async (id: string) => {
        const { data } = await api.delete(`/api/events/${id}`);
        return data;
    },
};
