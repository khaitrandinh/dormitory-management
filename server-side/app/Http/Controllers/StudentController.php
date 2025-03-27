<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Room;
use Carbon\Carbon;

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
                return response()->json(['message' => 'Student profile not found'], 404);
            }
            return response()->json($student);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function show($id)
    {
        $student = Student::with('user')->find($id);
        return $student
            ? response()->json($student)
            : response()->json(['message' => 'Student not found'], 404);
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

        return response()->json(['message' => 'Student created successfully', 'student' => $student], 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $validated = $request->validate([
            'gender' => 'sometimes|string',
            'birth_date' => 'sometimes|date',
            'class' => 'sometimes|string',
            'faculty' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'room_code' => 'sometimes|string|nullable',
        ]);

        if (array_key_exists('room_code', $validated)) {
            if ($validated['room_code']) {
                $student->room_code = $validated['room_code'];
                $student->room_request_status = 'pending';
            } else {
                $student->room_code = null;
                $student->room_request_status = null;
            }
        }

        $student->fill($validated)->save();

        return response()->json(['message' => 'Student updated successfully', 'data' => $student]);
    }

    public function approveRoom($id)
    {
        $student = Student::find($id);
        if (!$student || !$student->room_code || $student->room_request_status !== 'pending') {
            return response()->json(['message' => 'No pending request to approve'], 400);
        }

        // Sau khi duyệt yêu cầu chọn phòng
        $student->room_request_status = 'approved';
        $student->save();

        // ✅ Tạo hợp đồng trước
        $room = Room::where('room_code', $student->room_code)->first();
        $existingContract = Contract::where('student_id', $student->id)->first();
        if (!$existingContract) {
            $contract = Contract::create([
                'student_id' => $student->id,
                'room_id' => $room->id,
                'start_date' => now(),
                'end_date' => now()->addMonths(6),
                'status' => 'active',
            ]);
        }

        // ✅ Tạo hóa đơn duy nhất nếu chưa có
        $existingBill = Payment::where('contract_id', $contract->id ?? $existingContract->id)
            ->where('status', '!=', 'canceled')
            ->first();

        if (!$existingBill) {
            Payment::create([
                'contract_id' => $contract->id ?? $existingContract->id,
                'amount' => $room->price,
                'payment_date' => now(),
                'status' => 'pending',
            ]);
        }


        return response()->json(['message' => 'Room approved and records created']);
    }

    public function rejectRoom($id)
    {
        $student = Student::find($id);
        if (!$student || $student->room_request_status !== 'pending') {
            return response()->json(['message' => 'No pending request to reject'], 400);
        }

        $student->room_code = null;
        $student->room_request_status = null;
        $student->save();

        return response()->json(['message' => 'Room request rejected']);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->user()->delete();
        $student->delete();

        return response()->json(['message' => 'Student deleted']);
    }
}
