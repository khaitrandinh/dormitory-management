<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    
    public function index()
    {
        $user = auth()->user();

        
        if (in_array($user->role, ['admin', 'staff'])) {
            $students = Student::with('user')->get();
            return response()->json($students);
        }

        
        if ($user->role === 'student') {
            $student = Student::with('user')->where('user_id', $user->id)->first();

            if (!$student) {
                return response()->json(['message' => 'Không tìm thấy thông tin sinh viên của bạn'], 404);
            }

            return response()->json($student);
        }

        
        return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
    }


    
    public function show($id)
    {
        $student = Student::with('user')->find($id);

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên'], 404);
        }

        return response()->json($student);
    }

   
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

    
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $student = Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên'], 404);
        }

        // ✅ Nếu là student thì chỉ được sửa thông tin chính mình
        if ($user->role === 'student' && $student->user_id !== $user->id) {
            return response()->json(['message' => 'Bạn không thể sửa thông tin sinh viên khác'], 403);
        }

        $request->validate([
            'student_code' => 'sometimes|string|unique:students,student_code,' . $id,
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


    
    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên'], 404);
        }

        
        $student->user()->delete();
        $student->delete();

        return response()->json(['message' => 'Sinh viên đã bị xóa']);
    }
}
