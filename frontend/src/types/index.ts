export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Workspace {
  id: number;
  owner_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  workspace_id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}