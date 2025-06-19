import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import UnassignedPropertyList from "./UnassignedPropertyList";

/* --------------------------------------------------
 * Main component
 * -------------------------------------------------- */
export default function PropertyTenantAssignment() {
  /* ---------- initial tenants & properties ---------- */
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);

  const [propertySearch, setPropertySearch] = useState("");
  const PROPS_PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const [totalPropertyPages, setTotalPropertyPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState('');
  const [previousPageUrl, setPreviousPageUrl] = useState('');
  const [propertyPageLimit, setPropertyPageLimit] = useState(12);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingTenant, setPendingTenant] = useState(null);
  const [pendingPropertyId, setPendingPropertyId] = useState(null);

  // Assign Tenant property form
  const { data, setData, processing, errors, reset } = useForm({
    property_id: '',
    tenant_id: '',
    start_date: '',
    end_date: ''
  })


  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [propertySearch])

  const fetchTenants = async () =>  {
    const start = (page - 1) * PROPS_PER_PAGE;
    const searchByRole = 3;

    try {
      const response = await axios.get(route('users.datatable'), {
        params: {

          role: searchByRole,
        },
      });

      setTenants(response.data.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      // setLoading(false);
    }
  }

  const nextPage = () => {
    if (!nextPageUrl) return;
    const next = page + 1;
    if (page < totalPropertyPages) {
      setPage((p) => p + 1);
    }
    fetchProperties(null, next);
  };

  const previousPage = () => {
    if (!previousPageUrl) return;
    const prev = page - 1;
    setPage(prev);
    fetchProperties(null, prev);
  };

  const fetchProperties = async (url = null, pageNum = page) => {
    try {
      const finalUrl = url || route("property.list");

      const response = await axios.get(finalUrl, {
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


  const filteredProps = properties?.filter((p) =>
    p.property_name.toLowerCase().includes(propertySearch.toLowerCase())
  );

  const paginatedProps = filteredProps;

  /* ---------- handlers ---------- */

  const requestAssignTenant = (propertyId, tenant) => {
    setPendingTenant(tenant);
    setPendingPropertyId(propertyId);
    setConfirmModalOpen(true);
  };

  const handleSelectTenant = (propertyId, tenant) => {
    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, tenant } : p)));
  };

  const handleSubmit = async (e) => {

    e.preventDefault()

    const payload = {
      ...data,
      property_id: pendingPropertyId,
      tenant_id: pendingTenant?.id,
    }

    try {
      const response = await axios.post(route('property.assignment.post'), payload);
      handleSelectTenant(payload.property_id, payload.tenant_id);
    } catch (error) {
      console.error("Error assigning property with tenant:", error);
    }

    console.log('data', payload);

    

  }

  const handleAddTenant = (propertyId, name, phone) => {
    const newTenant = { id: `t_${tenants.length + 1}`, name, phone };
    setTenants((prev) => [...prev, newTenant]);
    handleSelectTenant(propertyId, newTenant);
  };

  const handleRemoveTenant = () => {
    console.log('tenant remove');
    
  }

  /* ---------- derived for card component ---------- */
  const propsWithTenantData = paginatedProps.map((p) => ({ ...p, allTenants: tenants }));

  /* ---------- render ---------- */
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Tenant Assignment</h2>}>
      <Head title="Tenant Assignment" />

      <main className="min-h-screen flex items-start justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl ring-1 ring-black/5 p-6 sm:p-10 space-y-8">
          {/* Search */}
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
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full capitalize"
            />
          </div>

          {/* Cards grid */}
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

          {/* Pagination */}
          <div className="flex justify-end items-center gap-3 text-sm text-gray-600">
            <button
              onClick={previousPage}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPropertyPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page === totalPropertyPages}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {confirmModalOpen && (
        // <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        //   <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
        //     <h2 className="text-lg font-semibold text-gray-800">Confirm Assignment</h2>
        //     <p className="text-sm text-gray-600">
        //       Assign <span className="font-medium text-indigo-600">{pendingTenant?.name}</span> to this property?
        //     </p>
        //     <div className="flex justify-end gap-2 pt-4">
        //       <button
        //         onClick={() => {
        //           setConfirmModalOpen(false);
        //           setPendingTenant(null);
        //           setPendingPropertyId(null);
        //         }}
        //         className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
        //       >
        //         Cancel
        //       </button>
        //       <button
        //         onClick={() => {
        //           handleSelectTenant(pendingPropertyId, pendingTenant);
        //           setConfirmModalOpen(false);
        //           setPendingTenant(null);
        //           setPendingPropertyId(null);
        //         }}
        //         className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        //       >
        //         Confirm
        //       </button>
        //     </div>
        //   </div>
        // </div>

         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Assign Tenant</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                Assign <span className="font-medium text-indigo-600">{pendingTenant?.name}</span> to this property?
              </p>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData("start_date", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
                {errors.start_date && <div className="text-sm text-red-600">{errors.start_date}</div>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData("end_date", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
                {errors.end_date && <div className="text-sm text-red-600">{errors.end_date}</div>}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    reset();
                  }}
                  className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
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
