<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // ✅ Lấy danh sách tất cả sinh viên
    public function index()
    {
        $students = Student::with('user')->get();
        return response()->json($students);
    }

    // ✅ Lấy thông tin sinh viên theo id
    public function show($id)
    {
        $student = Student::with('user')->find($id);

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên'], 404);
        }

        return response()->json($student);
    }

    // ✅ Tạo sinh viên mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'student_code' => 'required|string|unique:students',
            'gender' => 'required|string',
            'birth_date' => 'required|date',
            'class' => 'required|string',
            'faculty' => 'required|string',
            'phone' => 'required|string',
            'room_code' => 'nullable|string',
        ]);

        // Tạo user trước
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        // Tạo student và liên kết với user
        $student = Student::create([
            'user_id' => $user->id,
            'student_code' => $request->student_code,
            'gender' => $request->gender,
            'birth_date' => $request->birth_date,
            'class' => $request->class,
            'faculty' => $request->faculty,
            'phone' => $request->phone,
            'room_code' => $request->room_code,
        ]);

        return response()->json(['message' => 'Sinh viên đã được tạo', 'student' => $student], 201);
    }

    // ✅ Cập nhật thông tin sinh viên
    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên'], 404);
        }

        $request->validate([
            'student_code' => 'sometimes|string|unique:students,student_code,'.$id,
            'gender' => 'sometimes|string',
            'birth_date' => 'sometimes|date',
            'class' => 'sometimes|string',
            'faculty' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'room_code' => 'nullable|string',
        ]);

        $student->update($request->all());

        return response()->json(['message' => 'Thông tin sinh viên đã được cập nhật', 'student' => $student]);
    }

    // ✅ Xóa sinh viên
    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên'], 404);
        }

        // Xóa luôn user liên quan
        $student->user()->delete();
        $student->delete();

        return response()->json(['message' => 'Sinh viên đã bị xóa']);
    }
}
