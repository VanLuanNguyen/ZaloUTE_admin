export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "super_admin";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    admin: Admin;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationResponse;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationResponse;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface CreateAdminRequest {
  username: string;
  password: string;
  email: string;
  role?: "admin" | "super_admin";
}

// Message types
export interface Message {
  _id: string;
  conversation: Conversation;
  sender: User;
  content: string;
  type: "text" | "image" | "video" | "file" | "emoji" | "sticker";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  name?: string;
  participants: User[];
  isGroup: boolean;
  lastMessage?: Message;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface HiddenMessage {
  _id: string;
  messageId: Message;
  originalContent: string;
  originalType: "text" | "image" | "video" | "file" | "emoji" | "sticker";
  hiddenBy: Admin;
  hiddenAt: string;
  reason?: string;
  status: "hidden" | "restored" | "deleted";
  createdAt: string;
  updatedAt: string;
}

export interface MediaMessagesResponse {
  messages: Message[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface HiddenMessagesResponse {
  hiddenMessages: HiddenMessage[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface HiddenMessageStats {
  totalAll: number;
  totalHidden: number;
  totalRestored: number;
  totalDeleted: number;
}
