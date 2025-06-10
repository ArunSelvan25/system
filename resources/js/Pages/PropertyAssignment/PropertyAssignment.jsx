import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaSearch, FaGripVertical } from 'react-icons/fa';

const initialProperties = Array.from({ length: 100 }, (_, i) => ({
  id: `property-${i + 1}`,
  name: `Property ${i + 1}`,
  tenants: [],
}));

const initialTenants = Array.from({ length: 100 }, (_, i) => ({
  id: `tenant-${i + 1}`,
  name: `Tenant ${i + 1}`,
}));


const PropertyAssignment = () => {
    // Pagination
    const [tenantPage, setTenantPage] = useState(1);
    const [propertyPage, setPropertyPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [pagePropertySize, setPagePropertySize] = useState(5);

    const [tenantSearch, setTenantSearch] = useState('');
    const [propertySearch, setPropertySearch] = useState('');
    const [propertyList, setPropertyList] = useState(initialProperties);
    const [unassignedTenants, setUnassignedTenants] = useState(initialTenants);

    const filteredTenants = unassignedTenants.filter(t =>
        t.name.toLowerCase().includes(tenantSearch.toLowerCase())
    );
    const filteredProperties = propertyList.filter(p =>
        p.name.toLowerCase().includes(propertySearch.toLowerCase())
    );

    const paginatedTenants = filteredTenants.slice((tenantPage - 1) * pageSize, tenantPage * pageSize);
    const paginatedProperties = filteredProperties.slice((propertyPage - 1) * pagePropertySize, propertyPage * pagePropertySize);

    const handleDrop = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        const tenant = unassignedTenants.find(t => t.id === draggableId)
        || propertyList.flatMap(p => p.tenants).find(t => t.id === draggableId);

        if (!tenant) return;

        if (destination.droppableId === 'unassigned-tenants') {
        // Move back to unassigned
        const updatedProperties = propertyList.map(p => ({
            ...p,
            tenants: p.tenants.filter(t => t.id !== draggableId),
        }));
        setUnassignedTenants([...unassignedTenants, tenant]);
        setPropertyList(updatedProperties);
        } else {
        const updatedProperties = propertyList.map(p => {
            if (p.id === destination.droppableId) {
            return {
                ...p,
                tenants: [...p.tenants, tenant],
            };
            }
            return {
            ...p,
            tenants: p.tenants.filter(t => t.id !== draggableId),
            };
        });

        setPropertyList(updatedProperties);
        setUnassignedTenants(unassignedTenants.filter(t => t.id !== draggableId));
        }
    };

  return (
    <AuthenticatedLayout>
      <Head title="Tenant Assignment" />

        <div className='py-4'>


            {/* 5 */}
            <div className="mx-auto mt-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-2xl sm:rounded-3xl border border-gray-100">
                    <div className="p-8 text-gray-900">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <DragDropContext onDragEnd={handleDrop}>
                        {/* LEFT PANEL - UNASSIGNED TENANTS */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-0 z-10 bg-white pb-4">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Unassigned Tenants</h2>
                            <div className="relative">
                                <FaSearch className="absolute top-3.5 left-4 text-gray-400" />
                                <input
                                type="text"
                                placeholder="Search tenants..."
                                value={tenantSearch}
                                onChange={(e) => setTenantSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-gray-50 transition"
                                />
                            </div>
                            </div>

                            <Droppable droppableId="unassigned-tenants">
                            {(provided, snapshot) => (
                                <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`mt-5 p-4 rounded-2xl border transition-all shadow-inner max-h-[600px] overflow-y-auto 
                                    ${snapshot.isDraggingOver ? 'bg-green-50' : 'bg-gray-50'}
                                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
                                >
                                    {paginatedTenants.length === 0 ? (
                                        <div className="text-center text-gray-400 py-10 italic">No tenants found.</div>
                                    ) : (
                                        paginatedTenants.map((tenant, index) => (
                                        <Draggable key={tenant.id} draggableId={tenant.id} index={index}>
                                            {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-4 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md flex items-center gap-3 transition transform hover:-translate-y-0.5"
                                            >
                                                <FaGripVertical className="text-gray-400" />
                                                <span className="font-medium text-gray-800">{tenant.name}</span>
                                            </div>
                                            )}
                                        </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                            
                            </Droppable>
                            <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="perPage" className="text-sm text-gray-600">Per Page:</label>
                                    <select
                                    id="perPage"
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(parseInt(e.target.value));
                                        setTenantPage(1); // reset to first page on page size change
                                    }}
                                    className="border rounded px-2 py-1 text-sm bg-white"
                                    >
                                    {[5, 10, 20, 50].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                    disabled={tenantPage === 1}
                                    onClick={() => setTenantPage((p) => Math.max(1, p - 1))}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                    Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                    Page {tenantPage} of {Math.ceil(filteredTenants.length / pageSize)}
                                    </span>
                                    <button
                                    disabled={tenantPage >= Math.ceil(filteredTenants.length / pageSize)}
                                    onClick={() => setTenantPage((p) => p + 1)}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                    Next
                                    </button>
                                </div>
                            </div>
                        </div>
                        

                        {/* RIGHT PANEL - PROPERTIES */}
                        <div className="w-full lg:w-2/3">
                            <div className="sticky top-0 z-10 bg-white pb-4">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Properties</h2>
                            <div className="relative">
                                <FaSearch className="absolute top-3.5 left-4 text-gray-400" />
                                <input
                                type="text"
                                placeholder="Search properties..."
                                value={propertySearch}
                                onChange={(e) => setPropertySearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-gray-50 transition"
                                />
                            </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-5 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1">
                            {paginatedProperties.length === 0 ? (
                                <div className="col-span-2 text-center text-gray-400 italic py-6">
                                No properties found.
                                </div>
                            ) : (
                                paginatedProperties.map((property) => (
                                <Droppable droppableId={property.id} key={property.id}>
                                    {(provided, snapshot) => (
                                
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`rounded-2xl p-5 border transition-all shadow hover:shadow-lg ${
                                        snapshot.isDraggingOver ? 'bg-indigo-50' : 'bg-gray-50'
                                        }`}
                                    >
                                        <h3 className="text-black font-semibold text-lg mb-3">{property.name}</h3>
                                        <div className="space-y-2">
                                        {property.tenants.length === 0 ? (
                                            <p className="text-sm text-black italic">No tenants assigned.</p>
                                        ) : (
                                            property.tenants.map((tenant, index) => (
                                            <Draggable key={tenant.id} draggableId={tenant.id} index={index}>
                                                {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2 transition transform hover:-translate-y-0.5"
                                                >
                                                    <FaGripVertical className="text-gray-400" />
                                                    <span className="text-gray-800">{tenant.name}</span>
                                                </div>
                                                )}
                                            </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                        </div>
                                    </div>
                                    )}
                                </Droppable>
                                ))
                            )}
                            </div>
                            <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="perPage" className="text-sm text-gray-600">Per Page:</label>
                                    <select
                                    id="perPropertyPage"
                                    value={pagePropertySize}
                                    onChange={(e) => {
                                        setPagePropertySize(parseInt(e.target.value));
                                        setPropertyPage(1); // reset to first page on page size change
                                    }}
                                    className="border rounded px-2 py-1 text-sm bg-white"
                                    >
                                    {[5, 10, 20, 50].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                    disabled={propertyPage === 1}
                                    onClick={() => setPropertyPage((p) => Math.max(1, p - 1))}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                    Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                    Page {propertyPage} of {Math.ceil(filteredTenants.length / pagePropertySize)}
                                    </span>
                                    <button
                                    disabled={propertyPage >= Math.ceil(filteredTenants.length / pagePropertySize)}
                                    onClick={() => setPropertyPage((p) => p + 1)}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                    Next
                                    </button>
                                </div>
                            </div>
                        </div>
                        </DragDropContext>
                    </div>
                    </div>
                </div>
            </div>


        </div>
    </AuthenticatedLayout>
  );
};

export default PropertyAssignment;
