import { http, HttpResponse } from 'msw';

const API = 'http://localhost:5000/api';

export const handlers = [
  /* -------------------- Auth -------------------- */

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'erro@evolfit.app') {
      return HttpResponse.json(
        {
          type: 'about:blank',
          title: 'Unauthorized',
          status: 401,
          detail: 'E-mail ou senha incorretos.',
        },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      accessToken: 'access-token-teste',
      refreshToken: 'refresh-token-teste',
      expiresIn: 7200,
      user: {
        id: 1,
        username: 'carlos',
        email: body.email,
        displayName: 'Carlos Silva',
      },
    });
  }),

  http.post(`${API}/auth/register`, async () =>
    HttpResponse.json(
      {
        id: 1,
        username: 'carlos',
        email: 'carlos@email.com',
        accessToken: 'access-token-teste',
        refreshToken: 'refresh-token-teste',
      },
      { status: 201 },
    ),
  ),

  http.post(`${API}/auth/refresh`, async () =>
    HttpResponse.json({
      accessToken: 'novo-access-token',
      refreshToken: 'novo-refresh-token',
    }),
  ),

  http.post(`${API}/auth/logout`, async () => new HttpResponse(null, { status: 204 })),

  http.get(`${API}/auth/profile`, async () =>
    HttpResponse.json({
      id: 1,
      username: 'carlos',
      email: 'carlos@email.com',
      displayName: 'Carlos Silva',
      birthDate: '1998-05-15',
      createdAt: '2026-09-10T10:00:00Z',
    }),
  ),

  http.put(`${API}/auth/profile`, async ({ request }) => {
    const body = (await request.json()) as { displayName: string; birthDate?: string };
    return HttpResponse.json({
      id: 1,
      username: 'carlos',
      email: 'carlos@email.com',
      displayName: body.displayName,
      birthDate: body.birthDate ?? null,
      createdAt: '2026-09-10T10:00:00Z',
    });
  }),

  http.post(`${API}/auth/change-password`, async () => new HttpResponse(null, { status: 204 })),

  /* -------------------- Health -------------------- */

  http.post(`${API}/health/metrics`, async ({ request }) => {
    const body = (await request.json()) as { weightKg: number; heightCm: number };
    const bmi = body.weightKg / Math.pow(body.heightCm / 100, 2);
    return HttpResponse.json(
      {
        id: 42,
        weightKg: body.weightKg,
        heightCm: body.heightCm,
        bmi: Math.round(bmi * 100) / 100,
        bmr: 1680,
        tdee: 2604,
        activityLevel: 'moderate',
        measuredAt: '2026-09-10T14:30:00Z',
        macrosSuggestion: { proteinG: 151, carbsG: 293, fatG: 87 },
      },
      { status: 201 },
    );
  }),

  http.get(`${API}/health/metrics`, () =>
    HttpResponse.json({
      items: [
        {
          id: 1,
          weightKg: 75.5,
          heightCm: 180,
          bmi: 23.3,
          bmr: 1680,
          tdee: 2604,
          activityLevel: 'moderate',
          measuredAt: '2026-09-10T14:30:00Z',
        },
      ],
      page: 1,
      pageSize: 20,
      totalCount: 1,
      totalPages: 1,
    }),
  ),

  http.get(`${API}/health/metrics/latest`, async () =>
    HttpResponse.json({
      id: 1,
      weightKg: 75.5,
      heightCm: 180,
      bmi: 23.3,
      bmr: 1680,
      tdee: 2604,
      activityLevel: 'moderate',
      measuredAt: '2026-09-10T14:30:00Z',
    }),
  ),

  http.get(`${API}/health/metrics/evolution`, async () =>
    HttpResponse.json({
      data: [
        { date: '2026-08-01', bmi: 24.5, weightKg: 80 },
        { date: '2026-09-10', bmi: 23.3, weightKg: 75.5 },
      ],
      startBmi: 24.5,
      currentBmi: 23.3,
      bmiChange: -1.2,
      startWeight: 80,
      currentWeight: 75.5,
      weightChange: -4.5,
    }),
  ),

  /* -------------------- Workouts -------------------- */

  http.post(`${API}/workouts/generate`, async () =>
    HttpResponse.json(
      {
        id: 1,
        name: 'Treino Full Body',
        goal: 'hypertrophy',
        startDate: '2026-09-10',
        endDate: '2026-10-10',
        status: 1,
        totalDays: 30,
        totalExercises: 90,
        exercises: [
          {
            id: 1,
            dayNumber: 1,
            exerciseName: 'Bench Press',
            wgerExerciseId: 32,
            sets: 3,
            reps: 10,
            weight: null,
            orderInDay: 1,
          },
        ],
      },
      { status: 201 },
    ),
  ),

  http.get(`${API}/workouts/today`, async () =>
    HttpResponse.json({
      routineName: 'Treino Full Body',
      dayNumber: 3,
      date: '2026-09-12',
      exercises: [
        {
          id: 15,
          exerciseName: 'Bench Press',
          wgerExerciseId: 32,
          sets: 3,
          reps: 10,
          weight: null,
          orderInDay: 1,
          completed: false,
        },
      ],
      completionPercent: 0,
    }),
  ),

  http.post(`${API}/workouts/log`, async ({ request }) => {
    const body = (await request.json()) as { workoutExerciseId: number; completed: boolean };
    return HttpResponse.json(
      {
        id: 1,
        workoutExerciseId: body.workoutExerciseId,
        date: '2026-09-12',
        completed: body.completed,
        weightUsed: null,
      },
      { status: 201 },
    );
  }),

  /* -------------------- Dashboard -------------------- */

  http.get(`${API}/dashboard`, async () =>
    HttpResponse.json({
      currentBmi: 23.3,
      currentBmiCategory: 'Normal weight',
      currentTdee: 2604,
      activeRoutines: 1,
      totalHealthMetrics: 15,
      todayExercises: 5,
      todayCompleted: 2,
      todayCompletionPercent: 40,
      weeklyCompletionAvg: 75,
    }),
  ),

  http.get(`${API}/dashboard/compliance`, async () =>
    HttpResponse.json({
      period: 7,
      days: [
        { date: '2026-09-04', totalExercises: 5, completed: 5, percent: 100 },
        { date: '2026-09-05', totalExercises: 5, completed: 3, percent: 60 },
      ],
      averagePercent: 80,
    }),
  ),

  /* -------------------- Exercises -------------------- */

  http.get(`${API}/exercises/search`, ({ request }) => {
    const url = new URL(request.url);
    const term = url.searchParams.get('term') ?? '';
    return HttpResponse.json({
      results: [
        {
          id: 32,
          name: `${term || 'bench'} press`,
          description: 'Exercício composto.',
          category: 'Chest',
          muscles: ['Pectoralis Major', 'Triceps Brachii'],
        },
      ],
    });
  }),

  http.get(`${API}/exercises/:id`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      name: 'Bench Press',
      description: 'A compound exercise…',
      category: 'Chest',
      muscles: ['Pectoralis Major', 'Triceps Brachii'],
      equipment: ['Barbell'],
      images: [],
    }),
  ),
];