export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'doctor';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user' | 'doctor';
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'doctor';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  token?: string;
  patientId?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user?: UserResponse;
}
