import React, { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import AddPropertyForm from '@/Components/AddProperty';
import PropertyList from '@/Pages/Property/PropertyList';
import AddUserAndPropertyForm from './AddUserAndPropertyForm';

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
  const [editProperty, setEditProperty] = useState(null);
  const [editPropertyData, setEditPropertyData] = useState([]);

  const resetPage = () => {
    setShowPropertyOwnerId(null);
    setUserPropertyType(0);
    setSearchUserRole('all');
    setAdduser(false);
    setAddProperty(false);
    setEditProperty(false);
    setEditPropertyData([]);
  }

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
    fetchusers(1);
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
    if (showPropertyOwnerId == SelectedUser.id && userPropertyType == 1) {
      setShowPropertyOwnerId(null);
      setUserPropertyType(0)
      return true
    }
    setShowPropertyOwnerId(SelectedUser.id);
    setEditProperty(null);
    setEditPropertyData([]);
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

  const addPropertyForUser = (selectedUser) => {
    setEditProperty(null);
    setEditPropertyData([]);
    if (showPropertyOwnerId === selectedUser.id && userPropertyType === 2) {
      setShowPropertyOwnerId(null);
      setUserPropertyType(0);
    } else {
      setShowPropertyOwnerId(selectedUser.id);
      setUserPropertyType(2);
    }
  }

  const handleViewProperty = (property_id) => {
    router.visit('/property/view?property_id=' + property_id);
  };

  const handleEditProperty = (property_id) => {
    if (editProperty === property_id) {
      setEditProperty(null);
      setEditPropertyData(null); // clear data when collapsing
    } else {
      axios.get(route('property.details'), {
        params: { property_id }
      })
      .then(response => {
        setEditProperty(property_id); // only set after data is loaded
        setEditPropertyData(response.data);
      })
      .catch(error => {
        console.error('Error fetching property details:', error);
      });
    }
  };


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

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="w-full max-w-xs">
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
                  <AddUserAndPropertyForm 
                    handleAddUser={handleAddUser} 
                    setData={setData}
                    data={data}
                    errors={errors}
                    roles={roles}
                    user={user}
                    propertyTypes={propertyTypes} 
                    propertyStatuses={propertyStatuses} 
                    paymentFrequencies={paymentFrequencies}
                    processing={processing}
                    addProperty={addProperty}
                    propertyImages={propertyImages}
                    handleDrop={handleDrop}
                    handleRemove={handleRemove}
                  />
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
                        {
                          (showPropertyOwnerId === listUser.id) && 
                          (
                          <>
                            {(userPropertyType === 1) && (
                              <>
                                <tr>
                                  <td colSpan={4} className="p-4 bg-gray-50 border-b border-gray-300">
                                    <PropertyList 
                                      properties={properties} 
                                      editProperty={editProperty} 
                                      propertyPagination={propertyPagination} 
                                      handleViewProperty={handleViewProperty} 
                                      handleEditProperty={handleEditProperty} 
                                      editPropertyData={editPropertyData} 
                                      propertyTypes={propertyTypes} 
                                      propertyStatuses={propertyStatuses} 
                                      resetPage={resetPage} 
                                      propertyPerPage={propertyPerPage}
                                      handlePropertyPageChange={handlePropertyPageChange}
                                      handlePropertyPerPageChange={handlePropertyPerPageChange}
                                      listUser={listUser}
                                      />
                                  </td>
                                </tr>
                              </>
                            )}

                            {userPropertyType === 2 && (
                              <>
                                <tr>
                                  <td colSpan={4} className="p-4 bg-gray-50 border-b border-gray-300">
                                    <AddPropertyForm 
                                      propertyStatuses={propertyStatuses} 
                                      propertyTypes={propertyTypes} 
                                      paymentFrequencies={paymentFrequencies} 
                                      userId={listUser.id} 
                                    />
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
