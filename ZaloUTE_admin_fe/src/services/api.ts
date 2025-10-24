import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  Admin,
  UsersResponse,
  User,
  UserStats,
  CreateAdminRequest,
} from "../types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:4001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor để thêm token vào header
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để xử lý lỗi
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  async getCurrentAdmin(): Promise<ApiResponse<Admin>> {
    const response = await this.api.get<ApiResponse<Admin>>("/auth/me");
    return response.data;
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.api.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  }

  async createAdmin(
    adminData: CreateAdminRequest
  ): Promise<ApiResponse<Admin>> {
    const response = await this.api.post<ApiResponse<Admin>>(
      "/auth/create-admin",
      adminData
    );
    return response.data;
  }

  // User APIs
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ): Promise<ApiResponse<User[]>> {
    const response = await this.api.get<ApiResponse<User[]>>("/users", {
      params: { page, limit, search },
    });
    return response.data;
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await this.api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await this.api.get<ApiResponse<UserStats>>("/users/stats");
    return response.data;
  }

  async searchUsers(filters: {
    username?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<User[]>> {
    const response = await this.api.get<ApiResponse<User[]>>("/users/search", {
      params: filters,
    });
    return response.data;
  }

  async toggleUserStatus(id: string): Promise<ApiResponse<User>> {
    const response = await this.api.patch<ApiResponse<User>>(
      `/users/${id}/toggle-status`
    );
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<User>> {
    const response = await this.api.delete<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  // Message APIs
  async getMediaMessages(
    filters: {
      page?: number;
      limit?: number;
      conversationId?: string;
      senderId?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ): Promise<ApiResponse<any>> {
    const response = await this.api.get<ApiResponse<any>>("/messages/media", {
      params: filters,
    });
    return response.data;
  }

  // Hidden Message APIs
  async hideMessage(
    messageId: string,
    reason?: string
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      `/messages/${messageId}/hide`,
      {
        reason,
      }
    );
    return response.data;
  }

  async getAllHiddenMessages(
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      hiddenBy?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ): Promise<ApiResponse<any>> {
    const response = await this.api.get<ApiResponse<any>>("/messages/hidden", {
      params: filters,
    });
    return response.data;
  }

  async getHiddenMessageStats(
    filters: {
      hiddenBy?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {}
  ): Promise<ApiResponse<any>> {
    const response = await this.api.get<ApiResponse<any>>(
      "/messages/hidden/stats",
      {
        params: filters,
      }
    );
    return response.data;
  }

  async getHiddenMessageById(messageId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get<ApiResponse<any>>(
      `/messages/hidden/${messageId}`
    );
    return response.data;
  }

  async restoreMessage(messageId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      `/messages/${messageId}/restore`
    );
    return response.data;
  }

  async deleteMessagePermanently(messageId: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete<ApiResponse<any>>(
      `/messages/${messageId}/permanent`
    );
    return response.data;
  }
}

export default new ApiService();
