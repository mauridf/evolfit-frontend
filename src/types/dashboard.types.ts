/* ---------- GET /dashboard ---------- */

export interface DashboardResponse {
    currentBmi: number;
    currentBmiCategory: string;
    currentTdee: number;
    activeRoutines: number;
    totalHealthMetrics: number;
    todayExercises: number;
    todayCompleted: number;
    todayCompletionPercent: number;
    weeklyCompletionAvg: number;
}

/* ---------- GET /dashboard/progress ---------- */

export interface DashboardProgressResponse {
    labels: string[]; // datas YYYY-MM-DD
    bmiData: number[];
    weightData: number[];
    targetBmi: number;
}

/* ---------- GET /dashboard/compliance ---------- */

export interface DashboardComplianceDay {
    date: string;
    totalExercises: number;
    completed: number;
    percent: number;
}

export interface DashboardComplianceResponse {
    period: number;
    days: DashboardComplianceDay[];
    averagePercent: number;
}