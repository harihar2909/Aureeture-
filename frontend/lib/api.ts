/**
 * Centralized API client for backend communication
 * All API calls should go through this utility
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export type AuthTokenProvider = () => Promise<string | null>;
let authTokenProvider: AuthTokenProvider | null = null;

/**
 * Allows the app (Clerk-aware client component) to provide a token getter.
 * This keeps `apiClient` usable from any file without importing Clerk hooks here.
 */
export function setAuthTokenProvider(provider: AuthTokenProvider) {
  authTokenProvider = provider;
}

export function clearAuthTokenProvider() {
  authTokenProvider = null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available (from Clerk)
    const token = typeof window !== 'undefined' 
      ? await this.getAuthToken()
      : null;
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          // backend patterns
          (data?.error?.message as string | undefined) ||
          (data?.message as string | undefined) ||
          // fallback
          `HTTP ${response.status}: ${response.statusText}`;
        return {
          success: false,
          error: {
            message,
            code: String(response.status),
          },
        };
      }

      return {
        success: true,
        data: (data?.data ?? data) as T,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Network error occurred',
          code: 'NETWORK_ERROR',
        },
      };
    }
  }

  private async getAuthToken(): Promise<string | null> {
    if (!authTokenProvider) return null;
    try {
      return await authTokenProvider();
    } catch {
      return null;
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience functions for common endpoints
export const api = {
  // Profile
  profile: {
    get: () => apiClient.get('/api/profile'),
    create: (data: any) => apiClient.post('/api/profile', data),
    update: (data: any) => apiClient.put('/api/profile', data),
    student: {
      get: () => apiClient.get('/api/profile/student'),
      update: (data: any) => apiClient.put('/api/profile/student', data),
    },
  },

  // Auth
  auth: {
    verify: (token: string) => apiClient.post('/api/auth/verify', { token }),
  },

  // Onboarding
  onboarding: {
    status: () => apiClient.get('/api/onboarding/status'),
    step: (step: 'personal' | 'goal' | 'review', payload: any) =>
      apiClient.post('/api/onboarding/step', { step, payload }),
  },

  // Jobs
  jobs: {
    list: (params?: Record<string, string>) => apiClient.get('/api/jobs', params),
    getById: (id: string) => apiClient.get(`/api/jobs/${id}`),
    apply: (id: string, data?: { coverLetter?: string; resumeUrl?: string }) =>
      apiClient.post(`/api/jobs/${id}/apply`, data),
    myApplications: () => apiClient.get('/api/jobs/applications/me'),
  },

  // Projects
  projects: {
    list: (params?: Record<string, string>) => apiClient.get('/api/projects', params),
    getById: (id: string) => apiClient.get(`/api/projects/${id}`),
    join: (id: string) => apiClient.post(`/api/projects/${id}/join`),
    mine: () => apiClient.get('/api/projects/me'),
  },

  // People / Connections
  people: {
    list: (params?: Record<string, string>) => apiClient.get('/api/people', params),
    connections: () => apiClient.get('/api/people/connections'),
    connect: (data: { recipientId: string; message?: string }) => apiClient.post('/api/people/connect', data),
    respond: (connectionId: string, status: 'accepted' | 'declined') =>
      apiClient.put(`/api/people/connections/${connectionId}`, { status }),
  },

  // Mentors directory (students browse)
  mentors: {
    list: () => apiClient.get('/api/mentors'),
  },

  // Mentor dashboards
  mentor: {
    stats: (mentorId: string) => apiClient.get('/api/mentor/stats', { mentorId }),
    pendingRequests: (mentorId: string) => apiClient.get('/api/mentor/pending-requests', { mentorId }),
    earnings: (mentorId: string, period: 'all' | 'this_month' | 'last_90_days' = 'all') =>
      apiClient.get('/api/mentor/earnings', { mentorId, period }),
  },

  // Mentor Sessions
  mentorSessions: {
    getAll: (mentorId: string, scope?: 'all' | 'upcoming' | 'past') =>
      apiClient.get('/api/mentor-sessions', { mentorId, scope: scope || 'all' }),
    getById: (id: string, mentorId: string) =>
      apiClient.get(`/api/mentor-sessions/${id}`, { mentorId }),
    create: (data: any) => apiClient.post('/api/mentor-sessions', data),
    update: (id: string, mentorId: string, data: any) =>
      apiClient.patch(`/api/mentor-sessions/${id}?mentorId=${mentorId}`, data),
    delete: (id: string, mentorId: string) =>
      apiClient.delete(`/api/mentor-sessions/${id}?mentorId=${mentorId}`),
    verifyJoin: (id: string, mentorId: string) =>
      apiClient.get(`/api/mentor-sessions/${id}/verify-join`, { mentorId }),
    complete: (id: string, mentorId: string) =>
      apiClient.post(`/api/mentor-sessions/${id}/complete?mentorId=${mentorId}`),
    createDemo: (mentorId: string) =>
      apiClient.post(`/api/mentor-sessions/create-demo?mentorId=${mentorId}`),
    confirmPayment: (data: any) => apiClient.post('/api/mentor-sessions/confirm-payment', data),
  },

  // Mentor Mentees
  mentorMentees: {
    getAll: (mentorId: string) =>
      apiClient.get('/api/mentor-mentees', { mentorId }),
    getById: (id: string, mentorId: string) =>
      apiClient.get(`/api/mentor-mentees/${id}`, { mentorId }),
    add: (data: { mentorId: string; name: string; email: string; goal: string; status?: string }) =>
      apiClient.post('/api/mentor-mentees', data),
    sendMessage: (menteeId: string, data: { mentorId: string; message: string }) =>
      apiClient.post(`/api/mentor-mentees/${menteeId}/message`, data),
  },

  // Mentor Availability
  mentorAvailability: {
    getSlots: (mentorId: string, startDate?: string, endDate?: string) =>
      apiClient.get('/api/mentor-availability/slots', {
        mentorId,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
  },

  // Student Sessions
  studentSessions: {
    getAll: (studentId: string, scope?: 'all' | 'upcoming' | 'past') =>
      apiClient.get('/api/student-sessions', { studentId, scope: scope || 'all' }),
    getById: (id: string, studentId: string) =>
      apiClient.get(`/api/student-sessions/${id}`, { studentId }),
  },

  // Session Join
  session: {
    join: (sessionId: string, userId: string) =>
      apiClient.post('/api/session/join', { sessionId, userId }),
  },

  // CARO
  caro: {
    history: () => apiClient.get('/api/caro/history'),
    message: (data: { message: string; sessionId: string; context?: any }) =>
      apiClient.post('/api/caro/message', data),
  },

  // Recommendations
  recommendations: {
    get: (filters?: { careerGoal?: string; institution?: string }) =>
      apiClient.post('/api/recommendations', filters || {}),
  },

  // Contact Forms
  contact: {
    submitLead: (data: { name: string; email: string; mobile: string; utm?: string; page?: string }) =>
      apiClient.post('/api/leads', data),
    submitEnterpriseDemo: (data: { name: string; email: string; company: string; page?: string }) =>
      apiClient.post('/api/enterprise-demo', data),
    submitContact: (data: { name: string; email: string; phone?: string; subject: string; message: string }) =>
      apiClient.post('/api/contact', data),
  },
};

export default apiClient;


