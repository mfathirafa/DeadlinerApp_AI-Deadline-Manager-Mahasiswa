<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'code'  => 'nullable|string|max:20',
            'color' => 'nullable|string|max:20',
        ]);

        $course = $request->user()->courses()->create($validated);

        return response()->json($course, 201); // ← langsung object
    }


    public function update(Request $request, Course $course)
    {
        if ($course->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'code'  => 'nullable|string|max:20',
            'color' => 'nullable|string|max:20',
        ]);

        $course->update($validated);

        return response()->json($course); // ← langsung object
    }

    public function index(Request $request)
    {
        $courses = $request->user()
            ->courses()
            ->withCount([
                'tasks',
                'tasks as completed_count' => fn($q) => $q->where('status', 'completed')
            ])
            ->latest()
            ->get()
            ->map(function ($course) {
                $course->task_count = $course->tasks_count;
                return $course;
            });

        return response()->json($courses); // ← langsung array, tanpa wrapper
    }

    public function show(Request $request, Course $course)
    {
        if ($course->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        return response()->json($course); // ← langsung object
    }

    public function destroy(Request $request, Course $course)
    {
        if ($course->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $course->delete();

        return response()->json(['message' => 'Mata kuliah berhasil dihapus']);
    }
}
