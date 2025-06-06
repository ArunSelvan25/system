import React, { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import DropzoneInput from '@/Components/DropzoneInput';
import AddPropertyForm from '@/Components/AddProperty';

export default function User({ propertyTypes, propertyStatuses, paymentFrequencies}) {
  
  const [roles, setRoles] = useState([]);  
  const [users, setUsers] = useState([]);  
  const [properties, setProperties] = useState([]);
  const [showPropertyOwnerId, setShowPropertyOwnerId] = useState(null);
  const [userPropertyType, setUserPropertyType] = useState(0);
  const user = usePage().props.auth.user;
  const [searchUserRole, setSearchUserRole] = useState('all');
  const [addUser, setAdduser] = useState(false);
  const [addProperty, setAddProperty] = useState(false);
  const [propertyImages, setPropertyImages] = useState([]);
  const [documentUploads, setDocumentUploads] = useState([]);

  useEffect(() => {
    axios.get('/get-roles')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Failed to load roles:', error);
      });

    
  }, []);

  useEffect(() => {
    fetchusers();
  }, [searchUserRole]);

  // Form
  const { data, setData, processing, errors, reset } = useForm({
            name: '',
            email: '',
            phone: '',
            role_id: '',
            property_name: '',
            property_type: '',
            description: '',
            property_status: '',
            monthly_rent: '',
            security_deposit: '',
            maintenance_charges: '',
            lease_duration: '',
            rent_due_day: '',
            is_negotiable: '',
            payment_frequency: '',
            currency: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            latitude: '',
            longitude: '',
            status: '',
        });


  useEffect(() => {
    addUserRoleChange();
  }, [data.role_id])

  const addUserRoleChange = () => {
    if (data.role_id == 2) {
      setAddProperty(true);
    } else {
      setAddProperty(false);
    }
  }

  // Pagination
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [propertyPerPage, setPropertyPerPage] = useState(10);
  const [propertyPagination, setPropertyPagination] = useState({ property_current_page: 1, property_last_page: 1 });
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchusers(page, perPage);
    }
  };

  const handlePropertyPageChange = (page) => {
  if (page >= 1 && page <= propertyPagination.property_last_page) {
    fetchProperties(page, propertyPerPage);
  }
  };

  const fetchusers = async (page = 1, perPageCount = perPage) => {
    const start = (page - 1) * perPageCount;
    const searchByRole = searchUserRole === 'all' ? '' : searchUserRole;

    try {
      const response = await axios.get(route('users.datatable'), {
        params: {
          draw: page,
          start: start,
          length: perPageCount,
          role: searchByRole,
        },
      });

      setUsers(response.data.data);
      
      const totalRecords = response.data.recordsTotal || 0;
      const totalPages = Math.ceil(totalRecords / perPageCount);

      setPagination({
        current_page: page,
        last_page: totalPages,
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchusers(1, perPage);
  }, [perPage]);

  useEffect(() => {
   fetchProperties(1, propertyPerPage);
  }, [propertyPerPage]);

  const handlePerPageChange = (newPerPage) => {
    if (newPerPage !== propertyPerPage) {
      setPerPage(newPerPage);
      // fetchusers will be triggered by useEffect on perPage change
    }
  };

  const handlePropertyPerPageChange = (newPerPage) => {
    if (newPerPage !== propertyPerPage) {
      setPropertyPerPage(newPerPage);
      // fetchusers will be triggered by useEffect on perPage change
    }
  };

  const addUserForm = () => {
    setAdduser(!addUser);
  }

  const handleDrop = (newFiles) => {
    setPropertyImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemove = (indexToRemove) => {
    setPropertyImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const appendFormData = () => {
    const formData = new FormData();
    
    const userFields = ['name', 'email', 'phone', 'role_id'];
    const booleanFields = ['is_negotiable'];

    Object.entries(data).forEach(([key, value]) => {

      if (booleanFields.includes(key)) {
        
        if (value === 'true') value = 1;
        else if (value === 'false') value = 0;
      }
      
      if (userFields.includes(key)) {
        formData.append(`user[${key}]`, value);
      } else {
        formData.append(`property[${key}]`, value);
      }
    });

    // Append files (if any)
    propertyImages.forEach((file) => {
      formData.append('property[property_images][]', file);
    });

    
    
    return formData;
  }

  const handleAddUser = (e) => {
    e.preventDefault();

    const formData = appendFormData();
        
    try {
      router.post(route('owner.store'), formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          fetchusers();
          setAdduser(!addUser);
          setPropertyImages([]);
          reset();
        },
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  const fetchProperties = async (SelectedUser, page = 1, perPageCount = propertyPerPage) => {
    if (showPropertyOwnerId === SelectedUser.id  && userPropertyType === 1) {
      setShowPropertyOwnerId(null);
      setUserPropertyType(0);
    } else {

      setShowPropertyOwnerId(SelectedUser.id);

      const propertyStart = (page - 1) * perPageCount;
      try {
        const response = await axios.get(route('property.list'), {
          params: {
            draw: page,
            start: propertyStart,
            length: perPageCount,
            owner_id: SelectedUser.id,
          },
        });

        setProperties(response.data.data);
        
        const totalRecords = response.data.recordsTotal || 0;
        const totalPages = Math.ceil(totalRecords / perPageCount);

        setPropertyPagination({
          property_current_page: page,
          property_last_page: totalPages,
        });
        setUserPropertyType(1);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        // setLoading(false);
      }
    }
  }

  const addPropertyForUser = (selectedUser) => {
    if (showPropertyOwnerId === selectedUser.id && userPropertyType === 2) {
      setShowPropertyOwnerId(null);
      setUserPropertyType(0);
    } else {
      setShowPropertyOwnerId(selectedUser.id);
      setUserPropertyType(2);
    }
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">User</h2>
      }
    >
      <Head title="User" />

     <div className="mx-auto sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 text-gray-900">

          { (addUser) && 
            <div className="p-6 mx-auto">

            {/* Top Actions Row */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="w-full max-w-xs">
                {/* SelectInput placeholder (optional future use) */}
                <h2 className='text-lg font-semibold text-gray-800'>User Form</h2>
              </div>

              {(user?.permissions?.includes("list_user") || user?.role?.includes("admin")) && (
                <div className="shrink-0">
                  <SecondaryButton onClick={addUserForm}>List User</SecondaryButton>
                </div>
              )}
            </div>

            {/* Add User Form */}
            {
              (user?.permissions?.includes("create_user") || user?.role?.includes("admin")) && (
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
              )
            }
            </div>
          }

          { (!addUser) && 
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                {/* SelectInput Container */}
                <div className="w-full max-w-xs">
                  <InputLabel htmlFor="searchUserRole" value="Search by role" />
                  <SelectInput
                    name="searchUserRole"
                    id="searchUserRole"
                    value={data.role}
                    onChange={(e) => setSearchUserRole(e.target.value)}
                    className="mt-1 block w-full capitalize"
                  >
                    <option value="" className="capitalize" disabled>Search by role</option>
                    <option value="all" className="capitalize">all</option>
                    {roles?.map((role, index) => (
                      <option key={index} value={role.id} className="capitalize">
                        {role.name}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                {/* Add User Button */}
                {(user?.permissions?.includes("create_user") || user?.role?.includes("admin")) && (
                  <div className="shrink-0">
                    <SecondaryButton onClick={addUserForm}>Add User</SecondaryButton>
                  </div>
                )}
              </div>
              
              <div>
                <table className="table-fixed w-full border border-gray-300 rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm select-none">
                      <th className="w-16 p-3 border-b border-gray-300">#</th>
                      <th className="w-48 p-3 border-b border-gray-300">Name</th>
                      <th className="w-36 p-3 border-b border-gray-300">Role</th>
                      {(["edit_user", "delete_user"].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && (
                        <th className="w-72 p-3 border-b border-gray-300">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 text-sm">
                    {users?.length > 0 ?  ( 
                      users?.map((listUser) =>
                      <React.Fragment key={listUser.id}>
                        <tr className="hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                          <td className="p-3 border-b border-gray-200">{listUser.id}</td>
                          <td className="p-3 border-b border-gray-200">{listUser.name}</td>
                          <td className="p-3 border-b border-gray-200">{listUser.roles[0]?.name}</td>

                          {(["edit_user", "delete_user"].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) && (
                            <td className="p-3 border-b border-gray-200 whitespace-nowrap">
                              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {/* {(user?.permissions?.includes("edit_user") || user?.role?.includes("admin")) && (
                                  <SecondaryButton className="px-3 py-1 text-sm">Edit</SecondaryButton>
                                )}

                                {(user?.permissions?.includes("delete_user") || user?.role?.includes("admin")) && (
                                  <PrimaryButton className="px-3 py-1 text-sm">Delete</PrimaryButton>
                                )} */}

                                {((user?.permissions?.includes("list_property") || user?.role?.includes("admin")) &&
                                  listUser.roles[0]?.name === "owner") && (
                                  <SecondaryButton onClick={() => fetchProperties(listUser)} className="px-3 py-1 text-sm">
                                    View Property
                                  </SecondaryButton>
                                )}

                                {((user?.permissions?.includes("add_property") || user?.role?.includes("admin")) &&
                                  listUser.roles[0]?.name === "owner") && (
                                  <PrimaryButton onClick={() => addPropertyForUser(listUser)} className="px-3 py-1 text-sm">
                                    Add Property
                                  </PrimaryButton>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>

                        {/* Property Table Row */}
                        {(showPropertyOwnerId === listUser.id) && (
                          <>
                            {userPropertyType === 1 && (
                              <>
                                <tr>
                                  <td colSpan={4} className="p-4 bg-gray-50 border-b border-gray-300">
                                    <table className="table-fixed w-full border border-gray-300 rounded-md overflow-hidden">
                                      <thead>
                                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs select-none">
                                          <th className="w-[25%] p-3 border-b border-gray-300">Property ID</th>
                                          <th className="w-[25%] p-3 border-b border-gray-300">Property Name</th>
                                          <th className="w-[25%] p-3 border-b border-gray-300">Status</th>
                                          <th className="w-[25%] p-3 border-b border-gray-300 text-center">Action</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-gray-700 text-sm">
                                        {properties?.length > 0 ? (
                                          properties.map((property) => (
                                            <tr key={property.property_id} className="hover:bg-gray-50 transition-colors duration-150">
                                              <td className="p-3 border-b border-gray-200">{property.property_id}</td>
                                              <td className="p-3 border-b border-gray-200 uppercase">{property.property_name}</td>
                                              <td className="p-3 border-b border-gray-200 uppercase">{property.property_status}</td>
                                              <td className="p-3 border-b border-gray-200 text-center">
                                                <SecondaryButton className="px-3 py-1 text-xs">View</SecondaryButton>
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                                              No properties found.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>

                                    <Pagination
                                      currentPage={propertyPagination.property_current_page}
                                      lastPage={propertyPagination.property_last_page}
                                      perPage={propertyPerPage}
                                      onPageChange={handlePropertyPageChange}
                                      onPerPageChange={handlePropertyPerPageChange}
                                      className="mt-4"
                                    />
                                  </td>
                                </tr>
                              </>
                            )}

                            {userPropertyType === 2 && (
                              <>
                              <tr>
                                  <td colSpan={4} className="p-4 bg-gray-50 border-b border-gray-300">
                                    <AddPropertyForm propertyStatuses={propertyStatuses} propertyTypes={propertyTypes} paymentFrequencies={paymentFrequencies} userId={listUser.id} />
                                  </td>
                                </tr>
                              </>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                          No properties found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                perPage={perPage}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                className="mt-6"
                />

              </div>
            </div>
          }
         
        </div>
      </div>
    </div>

    </AuthenticatedLayout>
  );
}
