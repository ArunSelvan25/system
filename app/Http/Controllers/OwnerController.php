<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\DataTables;
use App\Enum\PropertyStatusEnum;
use App\Enum\PaymentFrequencyEnum;
use App\Models\Property;
use App\Models\PropertyFinancial;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\PropertyImage;

class OwnerController extends Controller
{
    protected $user;
    protected $roles;
    protected $property;
    protected $propertyFinancial;
    protected $propertyImage;
    public function __construct(
        User $user, 
        Role $roles, 
        Property $property, 
        PropertyFinancial $propertyFinancial,
        PropertyImage $propertyImage
    )
    {
        $this->user = $user;
        $this->roles = $roles;
        $this->property = $property;
        $this->propertyFinancial = $propertyFinancial;
        $this->propertyImage = $propertyImage;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $propertyTypes = \App\Models\PropertyType::where('status', 1)->get();
        $propertyStatuses = PropertyStatusEnum::options();
        $paymentFrequencies = PaymentFrequencyEnum::options();
        return Inertia::render('Admin/User/User', [
            'propertyTypes' => $propertyTypes,
            'propertyStatuses' => $propertyStatuses,
            'paymentFrequencies' => $paymentFrequencies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
    //    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user) {
            $user = User::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'] ?? null,
                'phone' => $request->user['phone'],
                'password' => Hash::make('Qwert@12345'),
            ]);

            if ($request->user['role_id']) {
                // Assign role
                $role = $this->roles->findById($request->user['role_id']);
                $user->assignRole($role);
            }
        }

        // store property
        if ($request->property) {
            $propertyData = $request->property;
            $propertyData['user_id'] = $user->id;
            $this->storeProperty($propertyData);
        }
        return Inertia::render('Admin/User/User');
    }

    public function propertyCreate(Request $request) {
        $propertyData = $request->all();
        $this->storeProperty($propertyData);
        return back()->with('success', 'Property created successfully.');
    }

    public function storeProperty($propertyData) {
        DB::beginTransaction();
        try {
            $propertyArray = [
                'user_id' => $propertyData['user_id'],
                'property_name' => $propertyData['property_name'],
                'property_type' => $propertyData['property_type'],
                'description' => $propertyData['description'] ?? null,
                'property_status' => $propertyData['property_status'],
                'status' => $propertyData['status'] ?? null,
                'address_line_1' => $propertyData['address_line_1'],
                'address_line_2' => $propertyData['address_line_2'] ?? null,
                'city' => $propertyData['city'],
                'state' => $propertyData['state'],
                'postal_code' => $propertyData['postal_code'],
                'country' => $propertyData['country'],
                'latitude' => $propertyData['latitude'] ?? null,
                'longitude' => $propertyData['longitude'] ?? null,
                'status' => $propertyData['status'] ?? 1
            ];
            $propertyCreate = $this->property->create($propertyArray);
            $propertyId = $propertyCreate->id;

            $propertyFinancialArray = [
                'property_id' => $propertyId,
                'monthly_rent' => floatval($propertyData['monthly_rent']),
                'security_deposit' => floatval($propertyData['security_deposit']) ?? null,
                'maintenance_charges' => floatval($propertyData['maintenance_charges']) ?? null,
                'lease_duration' => $propertyData['lease_duration'] ?? null,
                'rent_due_day' => $propertyData['rent_due_day'] ?? null,
                'is_negotiable' => $propertyData['is_negotiable'] ?? false,
                'payment_frequency' => $propertyData['payment_frequency'] ?? 'monthly',
                'charges' => $propertyData['charges'] ?? null,
                'status' => $propertyData['status'] ?? 1,
                'currency' => $propertyData['currency'] ?? 'INR'
            ];
            $this->propertyFinancial->create($propertyFinancialArray);

            // Store property images
            if ($propertyData['property_images']) {
                $folder = 'property_' . $propertyId;
                $disk = Storage::disk('property_images');

                // Delete the entire folder if it exists (remove old images)
                if ($disk->exists($folder)) {
                    $disk->deleteDirectory($folder);
                }

                // Re-create the folder (optional - Laravel auto-creates on storeAs)
                $disk->makeDirectory($folder);

                $propertyImageArray = [];

                foreach ($propertyData['property_images'] as $file) { 
                    // Generate a unique filename
                    $filename = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();

                    // Store the file in the folder
                    $path = $file->storeAs($folder, $filename, 'property_images');

                    $propertyImageArray[] = [
                        'property_id' => $propertyId,
                        'path' => $path, 
                        'alt_text' => $filename, 
                        'status' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }
                if (count($propertyImageArray)) {
                    $this->propertyImage->where('property_id', $propertyId)->delete();
                    $this->propertyImage->insert($propertyImageArray);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            Log::error('Error creating property: ' . $e);
            DB::rollBack();
        }
    }

    public function propertyUpdate(Request $request) {
        $this->updateProperty($request->propertyId, $request->user_id, $request->all());
    }

    public function updateProperty($propertyId, $userId, $propertyData)
    {
        DB::beginTransaction();
        try {
            // Update main property details
            $propertyArray = [
                'property_name' => $propertyData['property_name'],
                'property_type' => $propertyData['property_type'],
                'description' => $propertyData['description'] ?? null,
                'property_status' => $propertyData['property_status'],
                'status' => $propertyData['status'] ?? 1,
                'address_line_1' => $propertyData['address_line_1'],
                'address_line_2' => $propertyData['address_line_2'] ?? null,
                'city' => $propertyData['city'],
                'state' => $propertyData['state'],
                'postal_code' => $propertyData['postal_code'],
                'country' => $propertyData['country'],
                'latitude' => $propertyData['latitude'] ?? null,
                'longitude' => $propertyData['longitude'] ?? null,
            ];

            $this->property
                ->where('id', $propertyId)
                ->where('user_id', $userId)
                ->update($propertyArray);

            // Update financial details
            $propertyFinancialArray = [
                'monthly_rent' => floatval($propertyData['monthly_rent']),
                'security_deposit' => floatval($propertyData['security_deposit']) ?? null,
                'maintenance_charges' => floatval($propertyData['maintenance_charges']) ?? null,
                'lease_duration' => $propertyData['lease_duration'] ?? null,
                'rent_due_day' => $propertyData['rent_due_day'] ?? null,
                'is_negotiable' => $propertyData['is_negotiable'] ?? false,
                'payment_frequency' => $propertyData['payment_frequency'] ?? 'monthly',
                'charges' => $propertyData['charges'] ?? null,
                'status' => $propertyData['status'] ?? 1,
                'currency' => $propertyData['currency'] ?? 'INR',
            ];

            $this->propertyFinancial
                ->updateOrCreate(
                    ['property_id' => $propertyId],
                    $propertyFinancialArray
                );

            // Existing images IDs sent from frontend to keep
            $existingImageIds = $propertyData['existing_images'] ?? [];

            // Delete images that are currently in DB but not in existing_images
            $imagesToDelete = PropertyImage::where('property_id', $propertyId)
                                ->whereNotIn('id', $existingImageIds)
                                ->get();
                            

            foreach ($imagesToDelete as $image) {
                // Delete image file from storage
                Storage::disk('property_images')->delete($image->path); // adjust path field name

                // Delete record from DB
                $image->delete();
            }

            // Save new uploaded images
            if (!empty($propertyData['property_images'])) {
                foreach ($propertyData['property_images'] as $uploadedFile) {
                    // Generate a unique filename
                    $filename = uniqid() . '_' . time() . '.' . $uploadedFile->getClientOriginalExtension();

                    // Store file in storage/app/property_images/property_{id}/
                    $path = $uploadedFile->storeAs("property_{$propertyId}", $filename, 'property_images');

                    PropertyImage::create([
                        'property_id' => $propertyId,
                        'path' => $path,
                        'alt_text' => $filename, 
                        'status' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            Log::error('Error updating property: ' . $e->getMessage(), ['exception' => $e]);
            DB::rollBack();
            throw $e;
        }
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function datatable(Request $request)
    {
        $query = $this->user->with('roles');

        if ($request->role && $request->role !== '') {
            $query->whereHas('roles', function ($role) use ($request) {
                $role->where('id', $request->role);
            });
        }

        return DataTables::of($query)
            ->addColumn('actions', function ($role) {
                return '';
            })
            ->toJson();
    }

    public function listPropertyTypes() {
        
    }

    public function propertyList(Request $request) {

        // All filter list
        $ownerId = $request->owner_id ?? null;

        $query = $this->property->with('user')->select(
            'property_id', 
            'user_id',
            'property_name',
            'property_status'
        );

        if ($ownerId) {
            $query->where('user_id', $ownerId);
        }

        $query = $query->get();

        return DataTables::of($query)
            ->addColumn('actions', function () {
                return '';
            })
            ->toJson();
    }

    public function propertyView(Request $request) {
        if ($request->property_id) {
            return Inertia::render('Property/PropertyView', ['property_id' => $request->property_id]);
        }
        return back()->with('error', 'Property ID is required.');
    }   
    
    public function getPropertyDetails(Request $request) {
        $propertyId = $request->query('property_id');
        if (!$propertyId) {
            return response()->json(['error' => 'Property ID is required.'], 400);
        }
        $property = $this->property->where(function($q) {
            $q->Where(function($queryr) {
                if (auth()->user()->roles->contains('name', 'admin')) {
                    return true;
                }
                return false;
              });
        })->with(['user', 'amenities', 'images', 'documents', 'financials', 'tenants', 'transactions'])
            ->where('property_id', $propertyId)->first();

        if (!$property) {
            return response()->json(['error' => 'Property not found.'], 404);
        }

        return response()->json($property);
    }

    public function propertyAssignmentView() {
        return Inertia::render('PropertyAssignment/PropertyAssignment');
    }
}
