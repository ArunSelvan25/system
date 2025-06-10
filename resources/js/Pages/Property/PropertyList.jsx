import React from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import EditPropertyForm from '@/Components/EditPropertyForm';
import Pagination from '@/Components/Pagination';

export default function PropertyList({ 
    properties, 
    editProperty, 
    propertyPagination, 
    handleViewProperty, 
    handleEditProperty, 
    editPropertyData, 
    propertyTypes, 
    propertyStatuses, 
    paymentFrequencies,
    resetPage,
    propertyPerPage,
    handlePropertyPageChange,
    handlePropertyPerPageChange,
    listUser
}) {
    
    return (
        <>
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
                    <React.Fragment key={property.property_id}>
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="p-3 border-b border-gray-200">{property.property_id}</td>
                        <td className="p-3 border-b border-gray-200 uppercase">{property.property_name}</td>
                        <td className="p-3 border-b border-gray-200 uppercase">{property.property_status}</td>
                        <td className="p-3 border-b border-gray-200 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <SecondaryButton onClick={() => handleViewProperty(property.property_id)} className="px-3 py-1 text-xs">View</SecondaryButton>
                                <PrimaryButton onClick={() => handleEditProperty(property.property_id)} className="px-3 py-1 text-xs">Edit</PrimaryButton>
                            </div>
                        </td>
                        </tr>
                        {editProperty === property.property_id && (
                        <tr>
                            <td colSpan={4} className="p-4 bg-gray-50 border-b border-gray-300">
                                <EditPropertyForm userId={listUser.id} property={editPropertyData} propertyTypes={propertyTypes} propertyStatuses={propertyStatuses} paymentFrequencies={paymentFrequencies} formSubmitted={resetPage}  />
                            </td>
                        </tr>
                        )}
                    </React.Fragment>
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
        </>
    )
}
