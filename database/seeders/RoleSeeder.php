<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'owner']);
        Role::firstOrCreate(['name' => 'tenant']);
        $permissions = [
            'list_role', 'create_role', 'assign_permission_to_role', 'delete_role',
            'list_user', 'create_user', 'edit_user', 'delete_user',
            'list_property', 'create_property', 'edit_property', 'delete_property',
        ];
        $createdPermission = array();
        foreach($permissions as $permission) {
            $createdPermission[] = Permission::firstOrCreate(['name' => $permission]);
        }
        $role->syncPermissions($createdPermission);
        $user = User::firstOrCreate(
            ['phone' => '9894325176'],
            ['name' => 'Arun', 'password' => Hash::make('Qwert@12345')] 
        );

        if ($user) $user->assignRole('admin');
    }
}
