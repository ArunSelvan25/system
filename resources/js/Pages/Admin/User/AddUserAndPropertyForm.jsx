import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DropzoneInput from '@/Components/DropzoneInput';

export default function AddUserAndPropertyForm ({ 
    handleAddUser,
    data,
    setData,
    errors,
    roles,
    user,
    propertyTypes,
    propertyStatuses,
    paymentFrequencies,
    processing,
    addProperty,
    propertyImages,
    handleDrop,
    handleRemove
}) {
    return (
        <>
            <form onSubmit={handleAddUser} className="space-y-6">
                    {/* Section: User Info */}
                <div className="border rounded-xl bg-white shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">User Details</h3>
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="name" value="Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Phone *" />
                                <TextInput
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-1 block w-full"
                                    autoComplete="phone"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role_id" value="Role *" />
                                <SelectInput
                                    name="role_id"
                                    value={data.role_id}
                                    onChange={(e) => setData('role_id', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="" className="capitalize" disabled>select role</option>
                                    {roles?.map((role, index) => (
                                    <option key={index} value={role.id} className="capitalize">{role.name}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.role_id} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Conditional Property Form */}
                {(user?.permissions?.includes("create_property") || user?.role?.includes("admin")) && addProperty && (
                    <>
                    {/* Section: Basic Info */}
                    <div className="border rounded-xl bg-white shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Property Details</h3>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="property_name" value="Property Name *" />
                                    <TextInput
                                        id="property_name"
                                        type="text"
                                        name="property_name"
                                        value={data.property_name}
                                        className="mt-1 block w-full"
                                        autoComplete="property_name"
                                        onChange={(e) => setData('property_name', e.target.value)}
                                    />
                                    <InputError message={errors.property_name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="property_type" value="Property Type *" />
                                    <SelectInput
                                        name="property_type"
                                        value={data.property_type}
                                        onChange={(e) => setData('property_type', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="" className="capitalize" disabled>select type</option>
                                        {propertyTypes?.map((type, index) => (
                                        <option key={index} value={type.name} className="capitalize">{type.name}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.property_type} className="mt-2" />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextInput
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        autoComplete="description"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="property_status" value="Property Status *" />
                                    <SelectInput
                                        name="property_status"
                                        value={data.property_status}
                                        onChange={(e) => setData('property_status', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="" className="capitalize" disabled>select type</option>
                                        {propertyStatuses?.map((propertyStatus, index) => (
                                        <option key={index} value={propertyStatus.value} className="capitalize">{propertyStatus.label}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.property_status} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Financial Info */}
                    <div className="border rounded-xl bg-white shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Financial Details</h3>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="monthly_rent" value="Monthly Rent (₹) *" />
                                    <TextInput
                                        id="monthly_rent"
                                        type="text"
                                        name="monthly_rent"
                                        value={data.monthly_rent}
                                        className="mt-1 block w-full"
                                        autoComplete="monthly_rent"
                                        onChange={(e) => setData('monthly_rent', e.target.value)}
                                    />
                                    <InputError message={errors.monthly_rent} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="security_deposit" value="Security Deposit (₹)" />
                                    <TextInput
                                        id="security_deposit"
                                        type="text"
                                        name="security_deposit"
                                        value={data.security_deposit}
                                        className="mt-1 block w-full"
                                        autoComplete="security_deposit"
                                        onChange={(e) => setData('security_deposit', e.target.value)}
                                    />
                                    <InputError message={errors.security_deposit} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="maintenance_charges" value="Maintenance Charges (₹)" />
                                    <TextInput
                                        id="maintenance_charges"
                                        type="text"
                                        name="maintenance_charges"
                                        value={data.maintenance_charges}
                                        className="mt-1 block w-full"
                                        autoComplete="maintenance_charges"
                                        onChange={(e) => setData('maintenance_charges', e.target.value)}
                                    />
                                    <InputError message={errors.maintenance_charges} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="lease_duration" value="Lease Duration (months)" />
                                    <TextInput
                                        id="lease_duration"
                                        type="text"
                                        name="lease_duration"
                                        value={data.lease_duration}
                                        className="mt-1 block w-full"
                                        autoComplete="lease_duration"
                                        onChange={(e) => setData('lease_duration', e.target.value)}
                                    />
                                    <InputError message={errors.lease_duration} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="rent_due_day" value="Rent Due Day" />
                                    <TextInput
                                        id="rent_due_day"
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        step="1"
                                        name="rent_due_day"
                                        value={data.rent_due_day}
                                        className="mt-1 block w-full"
                                        autoComplete="rent_due_day"
                                        onChange={(e) => setData('rent_due_day', e.target.value)}
                                    />
                                    <InputError message={errors.rent_due_day} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="is_negotiable" value="Is Rent Negotiable?" />
                                    <SelectInput
                                        name="is_negotiable"
                                        value={data.is_negotiable}
                                        onChange={(e) => setData('is_negotiable', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="" className="capitalize" disabled>select type</option>
                                        <option value="false" className="capitalize">No</option>
                                        <option value="true" className="capitalize">YES</option>
                                    </SelectInput>
                                    <InputError message={errors.is_negotiable} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_frequency" value="Payment Frequency" />
                                    <SelectInput
                                        name="payment_frequency"
                                        value={data.payment_frequency}
                                        onChange={(e) => setData('payment_frequency', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="" className="capitalize" disabled>select type</option>
                                        {paymentFrequencies?.map((paymentFrequency, index) => (
                                        <option key={index} value={paymentFrequency.value} className="capitalize">{paymentFrequency.label}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.payment_frequency} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="currency" value="Currency" />
                                    <SelectInput
                                        name="currency"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="" className="capitalize" disabled>select type</option>
                                        <option value="INR" className="capitalize">INR</option>
                                        <option value="USD" className="capitalize">USD</option>
                                        <option value="EUR" className="capitalize">EUR</option>
                                    </SelectInput>
                                    <InputError message={errors.currency} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Address Info */}
                    <div className="border rounded-xl bg-white shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Address Details</h3>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="address_line_1" value="Address Line 1 *" />
                                    <TextInput
                                        id="address_line_1"
                                        type="text"
                                        name="address_line_1"
                                        value={data.address_line_1}
                                        className="mt-1 block w-full"
                                        autoComplete="address_line_1"
                                        onChange={(e) => setData('address_line_1', e.target.value)}
                                    />
                                    <InputError message={errors.address_line_1} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="address_line_2" value="Address Line 2" />
                                    <TextInput
                                        id="address_line_2"
                                        type="text"
                                        name="address_line_2"
                                        value={data.address_line_2}
                                        className="mt-1 block w-full"
                                        autoComplete="address_line_2"
                                        onChange={(e) => setData('address_line_2', e.target.value)}
                                    />
                                    <InputError message={errors.address_line_2} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="city" value="City *" />
                                    <TextInput
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={data.city}
                                        className="mt-1 block w-full"
                                        autoComplete="city"
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                    <InputError message={errors.city} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="state" value="State *" />
                                    <TextInput
                                        id="state"
                                        type="text"
                                        name="state"
                                        value={data.state}
                                        className="mt-1 block w-full"
                                        autoComplete="state"
                                        onChange={(e) => setData('state', e.target.value)}
                                    />
                                    <InputError message={errors.state} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="postal_code" value="Postal Code *" />
                                    <TextInput
                                        id="postal_code"
                                        type="text"
                                        name="postal_code"
                                        value={data.postal_code}
                                        className="mt-1 block w-full"
                                        autoComplete="postal_code"
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                    />
                                    <InputError message={errors.postal_code} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="country" value="Country *" />
                                    <TextInput
                                        id="country"
                                        type="text"
                                        name="country"
                                        value={data.country}
                                        className="mt-1 block w-full"
                                        autoComplete="country"
                                        onChange={(e) => setData('country', e.target.value)}
                                    />
                                    <InputError message={errors.country} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Geo Coordinates Info */}
                    <div className="border rounded-xl bg-white shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Geo Coordinates</h3>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="latitude" value="Latitude" />
                                    <TextInput
                                        id="latitude"
                                        type="text"
                                        name="latitude"
                                        value={data.latitude}
                                        className="mt-1 block w-full"
                                        autoComplete="latitude"
                                        step="0.0000001"
                                        onChange={(e) => setData('latitude', e.target.value)}
                                    />
                                    <InputError message={errors.latitude} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="longitude" value="Longitude" />
                                    <TextInput
                                        id="longitude"
                                        type="text"
                                        name="longitude"
                                        value={data.longitude}
                                        className="mt-1 block w-full"
                                        autoComplete="longitude"
                                        step="0.0000001"
                                        onChange={(e) => setData('longitude', e.target.value)}
                                    />
                                    <InputError message={errors.longitude} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Images Info */}
                    <div className="border rounded-xl bg-white shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Images</h3>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div>
                                    <DropzoneInput
                                    label="Property Images"
                                    files={propertyImages}
                                    onDrop={handleDrop}
                                    onRemove={handleRemove}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Status Info */}
                    <div className="border rounded-xl bg-white shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Status</h3>
                        <div className="space-y-10">
                            <div>
                                <InputLabel htmlFor="status" value="Status *" />
                                <SelectInput
                                name="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full"
                                >
                                    <option value="" className="capitalize" disabled>select status</option>
                                    <option value="1" className="capitalize">Active</option>
                                    <option value="0" className="capitalize">Inactive</option>
                                </SelectInput>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>
                    </div>
                    </>
                )}

                <div className="flex justify-end">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}