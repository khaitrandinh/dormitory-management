<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::all());
    }

    public function show($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }
        return response()->json($room);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate(Room::validationRules());

        $room = Room::create($validatedData);
        return response()->json($room, 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $validatedData = $request->validate(Room::validationRules($id));

        $room->update($validatedData);
        return response()->json($room);
    }

    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $room->delete();
        return response()->json(['message' => 'Room deleted successfully']);
    }
}
