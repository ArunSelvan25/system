import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import UnassignedPropertyList from "./UnassignedPropertyList";
import axios from "axios";

export default function PropertyAssignment() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertySearch, setPropertySearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPropertyPages, setTotalPropertyPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState('');
  const [previousPageUrl, setPreviousPageUrl] = useState('');
  const propertyPageLimit = 12;

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingTenant, setPendingTenant] = useState(null);
  const [pendingPropertyId, setPendingPropertyId] = useState(null);

  const { data, setData, processing, errors, reset } = useForm({
    property_id: '',
    tenant_id: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [propertySearch]);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(route('users.datatable'), {
        params: { role: 3 },
      });
      setTenants(response.data.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchProperties = async (url = null, pageNum = page) => {
    try {
      const response = await axios.get(route("property.assignment.list"), {
        params: {
          page: pageNum,
          limit: propertyPageLimit,
          search: propertySearch
        },
      });

      setProperties(response.data.data);
      setTotalPropertyPages(response.data.last_page);
      setNextPageUrl(response.data.next_page_url);
      setPreviousPageUrl(response.data.prev_page_url);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const nextPage = () => {
    if (nextPageUrl && page < totalPropertyPages) {
      const next = page + 1;
      setPage(next);
      fetchProperties(null, next);
    }
  };

  const previousPage = () => {
    if (previousPageUrl && page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchProperties(null, prev);
    }
  };

  const requestAssignTenant = (propertyId, tenantPassed) => {
    const property = properties.find((p) => p.id === propertyId);
    const assignedTenant = property?.tenants?.[0]; // Get tenant with pivot if exists

    const startDate = assignedTenant?.pivot?.start_date || "";
    const endDate = assignedTenant?.pivot?.end_date || "";

    setPendingTenant(tenantPassed); // The new tenant being selected for assignment
    setPendingPropertyId(propertyId);

    setData({
      property_id: propertyId,
      tenant_id: tenantPassed?.id,
      start_date: startDate,
      end_date: endDate,
      editMode: false,
    });

    setConfirmModalOpen(true);
  };



  const handleSelectTenant = (propertyId, tenantObj) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, tenants: [tenantObj] } : p
      )
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      property_id: pendingPropertyId,
      tenant_id: pendingTenant?.id,
    };

    try {
      await axios.post(route('property.assignment.post'), payload);
      handleSelectTenant(payload.property_id, {
        id: pendingTenant.id,
        name: pendingTenant.name,
        phone: pendingTenant.phone,
        pivot: {
          start_date: payload.start_date,
          end_date: payload.end_date,
        }
      });
      onClose();
      reset();
    } catch (error) {
      console.error("Error assigning property with tenant:", error);
    }
  };

  const handleAddTenant = (propertyId, name, phone) => {
    const newTenant = { id: `t_${tenants.length + 1}`, name, phone };
    setTenants((prev) => [...prev, newTenant]);
    handleSelectTenant(propertyId, {
      ...newTenant,
      pivot: { start_date: null, end_date: null }
    });
  };

  const handleRemoveTenant = async (propertyId) => {
    try {
      await axios.post(route('property.assignment.remove'), { property_id: propertyId });
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, tenants: [] } : p
        )
      );
    } catch (error) {
      console.error("Error removing tenant:", error);
    }
  };

  const onClose = () => {
    setPendingTenant(null);
    setPendingPropertyId(null);
    setConfirmModalOpen(false);
  };

  const propsWithTenantData = properties.map((p) => ({
    ...p,
    allTenants: tenants,
  }));

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Tenant Assignment</h2>}>
      <Head title="Tenant Assignment" />
      <main className="min-h-screen flex items-start justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white rounded-3xl shadow-lg p-6 space-y-8">
          <div className="flex items-center gap-3">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties…"
              value={propertySearch}
              onChange={(e) => {
                setPropertySearch(e.target.value);
                setPage(1);
              }}
              className="rounded-md border-gray-300 shadow-sm w-full"
            />
          </div>

          {propsWithTenantData.length === 0 ? (
            <p className="text-center text-gray-400 italic py-20">No properties found</p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {propsWithTenantData.map((p) => (
                <UnassignedPropertyList
                  key={p.id}
                  property={p}
                  onSelectTenant={requestAssignTenant}
                  onAddTenant={handleAddTenant}
                  onRemoveTenant={handleRemoveTenant}
                />
              ))}
            </div>
          )}

          <div className="flex justify-end items-center gap-3 text-sm">
            <button onClick={previousPage} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
            <span>Page {page} of {totalPropertyPages}</span>
            <button onClick={nextPage} disabled={page === totalPropertyPages} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Next</button>
          </div>
        </div>
      </main>

      {/* Confirm Assign Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Assign Tenant</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                Assign <span className="font-medium text-indigo-600">{pendingTenant?.name}</span> to this property?
              </p>

              {/* Show current dates if any */}
              {pendingTenant?.pivot?.start_date && (
                <div className="text-sm text-gray-500">
                  Current Start Date:{" "}
                  <span className="font-medium">{pendingTenant.pivot.start_date}</span>
                </div>
              )}
              {pendingTenant?.pivot?.end_date && (
                <div className="text-sm text-gray-500">
                  Current End Date:{" "}
                  <span className="font-medium">{pendingTenant.pivot.end_date}</span>
                </div>
              )}

              {/* Toggle Edit Mode */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editDates"
                  checked={data.editMode || false}
                  onChange={(e) => setData("editMode", e.target.checked)}
                />
                <label htmlFor="editDates" className="text-sm text-gray-700">
                  Change assignment dates
                </label>
              </div>

              {/* Editable Dates */}
              <div>
                <label className="block text-sm">Start Date</label>
                <input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData("start_date", e.target.value)}
                  className="w-full border rounded"
                  disabled={!data.editMode}
                />
                {errors.start_date && (
                  <p className="text-red-600 text-xs">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm">End Date</label>
                <input
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData("end_date", e.target.value)}
                  className="w-full border rounded"
                  disabled={!data.editMode}
                  min={data.start_date || new Date().toISOString().split("T")[0]}
                />
                {errors.end_date && (
                  <p className="text-red-600 text-xs">{errors.end_date}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 rounded bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    processing ||
                    !data.editMode ||
                    (pendingTenant?.pivot?.start_date === data.start_date &&
                      pendingTenant?.pivot?.end_date === data.end_date)
                  }
                  className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AuthenticatedLayout>
  );
}
