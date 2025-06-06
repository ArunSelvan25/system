<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Yajra\DataTables\DataTables;

class RoleAndPermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allPermissions = Permission::all();
        return Inertia::render('Admin/Roles/Role', [
            'permissions' => $allPermissions,
        ]);
    }

    public function datatable(Request $request)
    {
        $query = Role::with('permissions');

        return DataTables::of($query)
            ->addColumn('actions', function ($role) {
                return ''; // Can be handled in frontend
            })
            ->toJson(); // Laravel DataTables handles pagination automatically
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|unique:roles,name',
        ]);
        Role::create(['name' => $validated['role']]);
        return redirect()->route('role-permission.index')->with('success', 'Role added successfully.'); 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $permissions = $request->input('permissions', []);
        $role->syncPermissions($permissions);

        return redirect()->route('role-permission.index')->with('success', 'Permissions updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    public function listRoles()
    {
        $roles = Role::where('name', '!=', 'admin')->select('id', 'name')->get();
        return response()->json($roles);
    }
}
