import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorPage from '@/pages/ErrorPage';

/* -------- Páginas placeholder (implementadas nas próximas etapas) -- */
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import HealthHistoryPage from '@/pages/health/HealthHistoryPage';
import HealthNewPage from '@/pages/health/HealthNewPage';
import HealthEvolutionPage from '@/pages/health/HealthEvolutionPage';
import WorkoutsListPage from '@/pages/workouts/WorkoutsListPage';
import WorkoutNewPage from '@/pages/workouts/WorkoutNewPage';
import WorkoutDetailPage from '@/pages/workouts/WorkoutDetailPage';
import WorkoutTodayPage from '@/pages/workouts/WorkoutTodayPage';
import WorkoutProgressPage from '@/pages/workouts/WorkoutProgressPage';
import ExerciseSearchPage from '@/pages/exercises/ExerciseSearchPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import ChangePasswordPage from '@/pages/profile/ChangePasswordPage';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <AppShell />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <DashboardPage /> },

            { path: 'health', element: <HealthHistoryPage /> },
            { path: 'health/new', element: <HealthNewPage /> },
            { path: 'health/evolution', element: <HealthEvolutionPage /> },

            { path: 'workouts', element: <WorkoutsListPage /> },
            { path: 'workouts/new', element: <WorkoutNewPage /> },
            { path: 'workouts/today', element: <WorkoutTodayPage /> },
            { path: 'workouts/:id', element: <WorkoutDetailPage /> },
            { path: 'workouts/:id/progress', element: <WorkoutProgressPage /> },

            { path: 'exercises', element: <ExerciseSearchPage /> },

            { path: 'profile', element: <ProfilePage /> },
            { path: 'profile/password', element: <ChangePasswordPage /> },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
]);