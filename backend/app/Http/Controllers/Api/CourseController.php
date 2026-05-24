<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::where('user_id', $request->user()->id)
            ->withCount('tasks')
            ->withCount(['tasks as completed_count' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->get();

        $formatted = $courses->map(function ($course) {
            return [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
                'color' => $course->color,
                'task_count' => (int) $course->tasks_count,
                'completed_count' => (int) $course->completed_count,
                'created_at' => $course->created_at->toIso8601String(),
                'updated_at' => $course->updated_at->toIso8601String(),
            ];
        });

        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'color' => 'required|string|max:20',
        ]);

        $course = Course::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'code' => $validated['code'],
            'color' => $validated['color'],
        ]);

        return response()->json([
            'id' => $course->id,
            'name' => $course->name,
            'code' => $course->code,
            'color' => $course->color,
            'task_count' => 0,
            'completed_count' => 0,
            'created_at' => $course->created_at->toIso8601String(),
            'updated_at' => $course->updated_at->toIso8601String(),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50',
            'color' => 'sometimes|required|string|max:20',
        ]);

        $course->update($validated);

        $course->loadCount('tasks');
        $course->loadCount(['tasks as completed_count' => function ($query) {
            $query->where('status', 'completed');
        }]);

        return response()->json([
            'id' => $course->id,
            'name' => $course->name,
            'code' => $course->code,
            'color' => $course->color,
            'task_count' => (int) $course->tasks_count,
            'completed_count' => (int) $course->completed_count,
            'created_at' => $course->created_at->toIso8601String(),
            'updated_at' => $course->updated_at->toIso8601String(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $course = Course::where('user_id', $request->user()->id)->findOrFail($id);
        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully.'
        ]);
    }
}
