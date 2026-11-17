export type SyncStatus = "synced" | "pending" | "error";

export interface StudentRecord {
  cif: string;
  fullName: string;
  career: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  sheetRow: number | null;
  syncStatus: SyncStatus;
}

export type RegistrationCategory = "sponsor" | "teacher" | "guest";

export interface RegistrationRecord {
  id: string;
  category: RegistrationCategory;
  company: string | null;
  firstName: string;
  lastName: string;
  career: string | null;
  createdAt: string;
  syncStatus: SyncStatus;
}

export interface ActivityItem {
  id: string;
  type: "student" | "sponsor" | "teacher" | "guest";
  name: string;
  detail: string;
  timestamp: string;
  syncStatus: SyncStatus;
}

export interface DashboardStats {
  storageMode: "supabase" | "vercel-blob" | "sqlite";
  totalCheckedIn: number;
  students: {
    totalPaid: number;
    checkedIn: number;
    pendingSync: number;
    byCareer: Record<string, { paid: number; checkedIn: number }>;
  };
  sponsors: {
    total: number;
    pendingSync: number;
    byCompany: Array<{ company: string; count: number }>;
  };
  teachers: {
    total: number;
    pendingSync: number;
    byCareer: Record<string, number>;
  };
  guests: {
    total: number;
    pendingSync: number;
  };
  syncQueue: {
    pending: number;
    errors: number;
    lastSyncAt: string | null;
    lastSyncError: string | null;
  };
  recentActivity: ActivityItem[];
  timeline: Array<{ label: string; count: number }>;
  generatedAt: string;
}

export interface GoogleSetupStatus {
  oauthConfigured: boolean;
  connectedEmail: string | null;
  hasRefreshToken: boolean;
  spreadsheetId: string | null;
  appsScriptUrl: string | null;
  lastPullAt: string | null;
  lastSyncAt: string | null;
  lastSyncError: string | null;
}

export const ROULETTE_CAREERS = [
  "Arquitectura",
  "Ingeniería Civil",
  "Ingeniería Industrial",
] as const;

export type RouletteCareer = (typeof ROULETTE_CAREERS)[number];

export interface RouletteStudent {
  cif: string;
  fullName: string;
  career: RouletteCareer;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export interface RouletteCareerGroup {
  career: RouletteCareer;
  totalPaid: number;
  totalRegistered: number;
  registered: RouletteStudent[];
  allPaid: RouletteStudent[];
}


