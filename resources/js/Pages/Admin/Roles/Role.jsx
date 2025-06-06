import React, { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Role({ permissions }) {
  const { data, setData, post, processing, errors, reset } = useForm({
            role: '',
        });
  const user = usePage().props.auth.user;
  const [roles, setRoles] = useState([]);
  const [addRole, setAddRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteRoleClick, setDeleteRoleClick] = useState(false);
  const [deleteRoleData, setDeleteRoleData] = useState([]);

  // Pagination state
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  const fetchRoles = async (page = 1, perPageCount = perPage) => {
    setLoading(true);
    const start = (page - 1) * perPageCount;

    try {
      const response = await axios.get(route('roles.datatable'), {
        params: {
          draw: page,
          start: start,
          length: perPageCount,
        },
      });

      setRoles(response.data.data);

      const totalRecords = response.data.recordsTotal || 0;
      const totalPages = Math.ceil(totalRecords / perPageCount);

      setPagination({
        current_page: page,
        last_page: totalPages,
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(1, perPage);
  }, [perPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchRoles(page, perPage);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    if (newPerPage !== perPage) {
      setPerPage(newPerPage);
      // fetchRoles will be triggered by useEffect on perPage change
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const isChecked = (perm) => selectedRole?.permissions?.some((p) => p.name === perm.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPermissions = permissions
      .filter((p) => document.getElementById(`perm-${p.id}`).checked)
      .map((p) => p.name);

    try {
      router.put(
        route('roles.update', selectedRole.id),
        { permissions: selectedPermissions },
        {
          preserveScroll: true,
          onSuccess: () => {
            fetchRoles(pagination.current_page, perPage); // Refresh roles list with current pagination
            setShowModal(false);
          },
        }
      );
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

    const closeModal = () => {
        setAddRole(false);
        setDeleteRoleClick(false);
        setDeleteRoleData([]);
    };

    const addRoleClick = () => {
        setAddRole(true)
    }

    const handleRoleAddSubmit = (e) => {
        e.preventDefault();
        post(route('role-permission.store', data), {
            onFinish: () => setAddRole(false),
        });
        reset('role')
        fetchRoles();
    }

    const handleDelete = (deleteRole) => {
        setDeleteRoleData(deleteRole)
        setDeleteRoleClick(true) 
    }

    const handleRoleDelete = () => {
        axios.delete(route('role-permission.destroy', deleteRoleData.id));
        setDeleteRoleClick(false) 
        setDeleteRoleData([])
        fetchRoles();
    }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">Roles & Permissions</h2>
      }
    >
      <Head title="Roles & Permissions" />

      {/* Add role */}
      <Modal maxWidth='md' show={addRole} onClose={closeModal}>
          <form onSubmit={handleRoleAddSubmit} className="p-6">
              <h2 className="text-lg font-medium text-gray-900">
                  Add Role
              </h2>

              <div>
                  <InputLabel htmlFor="role" value="Role" />

                  <TextInput
                      id="role"
                      type="role"
                      name="role"
                      value={data.role}
                      className="mt-1 p-2 block w-full"
                      autoComplete="role"
                      isFocused={true}
                      onChange={(e) => setData('role', e.target.value)}
                  />

                  <InputError message={errors.role} className="mt-2" />
              </div>

              <div className="mt-6 flex justify-end">
                  <SecondaryButton onClick={closeModal}>
                      Cancel
                  </SecondaryButton>

                  <PrimaryButton className="ms-3">
                      Submit
                  </PrimaryButton>
              </div>
          </form>
      </Modal>

      {/* Delete role */}
      <Modal maxWidth='md' show={deleteRoleClick} onClose={closeModal}>
          <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">
                    Role
              </h2>

              <p>Are you sure you want to delete this role?</p>

              <div className="mt-6 flex justify-end">
                  <SecondaryButton onClick={closeModal}>
                      Cancel
                  </SecondaryButton>

                  <PrimaryButton onClick={handleRoleDelete} className="ms-3">
                      Submit
                  </PrimaryButton>
              </div>
          </div>
      </Modal>

      {/* Edit permissions */}
      <Modal maxWidth='2xl' show={showModal} onClose={closeModal}>

          <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">
              Edit Permissions for {selectedRole?.name}
              </h2>

              <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto mb-4">
                  {permissions.map((perm) => (
                      <label key={perm.id}>
                      <input
                          type="checkbox"
                          id={`perm-${perm.id}`}
                          defaultChecked={isChecked(perm)}
                      />
                      <span className="ml-2">{perm.name}</span>
                      </label>
                  ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                  <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 px-4 py-2 rounded"
                  >
                      Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                      Save
                  </button>
                  </div>
              </form>
          </div>
      </Modal>

      <div className="mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 text-gray-900">
            {(user?.permissions?.includes("create_role") || user?.role?.includes("admin")) && <div className="flex justify-end mb-4">
                <SecondaryButton onClick={addRoleClick}>Add Role</SecondaryButton>
              </div>}
            <table className="w-full border">
              <thead>
                  <tr className="bg-gray-100">
                  <th className="p-2">#</th>
                  <th className="p-2">Name</th>
                  {(["assign_permission_to_role", "delete_role"].some(p => user?.permissions?.includes(p)) || user?.role?.includes("admin")) &&
                    <th className="p-2">Actions</th>
                    }
                  </tr>
              </thead>
              <tbody className="text-center">
                  {roles.map((role) => (
                  <tr key={role.id}>
                      <td className="p-2">{role.id}</td>
                      <td className="p-2">{role.name}</td>
                      <td className="p-2">
                        {(user?.permissions?.includes("assign_permission_to_role") || user?.role?.includes("admin")) && <SecondaryButton
                          onClick={() => handleEdit(role)}
                          className='mx-4'
                        >
                          Edit Permissions
                        </SecondaryButton>}
                        
                        {(user?.permissions?.includes("delete_role") || user?.role?.includes("admin")) && <PrimaryButton
                          onClick={() => handleDelete(role)}
                          className='mx-4'
                        >
                          Delete
                        </PrimaryButton>}
                      </td>
                  </tr>
                  ))}
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
      </div>
    </AuthenticatedLayout>
  );
}
