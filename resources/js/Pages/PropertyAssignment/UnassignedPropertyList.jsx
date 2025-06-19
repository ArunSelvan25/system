import React, { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import UnassignedTenantList from "./UnassignedTenantList";

export default function UnassignedPropertyList ({ property, onSelectTenant, onAddTenant, onRemoveTenant }) {
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [propertyOccupiedStatus, setPropertyOccupiedStatus] = useState(false);

    

    useEffect(() => {
      propertyStatus()
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const viewProperty = (property_id) => {
      router.visit('/property/view?property_id=' + property_id);
    }

    const propertyStatus = () => {
      const tenant = property.tenants?.[0]; // Assume only one active tenant
      const now = new Date();          

      let status = "Vacant";
      let badgeClass = "bg-yellow-100 text-yellow-700";

      if (tenant?.pivot?.start_date) {
        const startDate = new Date(tenant.pivot.start_date);
        const endDate = tenant.pivot.end_date ? new Date(tenant.pivot.end_date) : null;

        const isStartPast = startDate <= now;
        const isEndPast = endDate ? endDate < now : false;
        const isEndFutureOrNull = !endDate || endDate >= now;

        if (isStartPast && isEndFutureOrNull) {
          setPropertyOccupiedStatus(true);
          status = "Occupied";
          badgeClass = "bg-green-100 text-green-700";
        }
    }

    return (
      <article
        className="group bg-white rounded-3xl shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-5 animate-slide-in"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          {/* Left side: Icon + Property */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
              <HomeIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {property.property_name}
              </h3>
              <p className="text-xs text-gray-500 truncate">Property ID: {property.property_id}</p>
            </div>
          </div>

          {/* Dropdown menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="text-gray-300 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={() => viewProperty(property.property_id)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(property)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(property)}
                  className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

        </header>

        {/* Status Badge */}
        <div>
          <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}>
              {propertyOccupiedStatus && {status} }
            </span>
        </div>


        {/* Tenant Selector */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">Assign Tenant</p>
          <UnassignedTenantList
            tenants={property.allTenants}
            selectedTenant={property.tenant || null}
            onSelect={(tenant) => onSelectTenant(property.id, tenant)}
            onAddTenant={(name, phone) => onAddTenant(property.id, name, phone)}
          />
          {propertyOccupiedStatus && (
            <button
              onClick={() => onRemoveTenant(property.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        
      </article>


    );
  }
}