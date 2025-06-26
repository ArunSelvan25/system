import React, { useEffect, useRef, useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import UnassignedTenantList from "./UnassignedTenantList";

export default function UnassignedPropertyList({
  property,
  onSelectTenant,
  onAddTenant,
  onRemoveTenant,
  onEditProperty,
  onRemoveProperty,
}) {
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tenant = property.tenants?.[0] || null;
  
  const now = new Date();

  // Memoized tenant status and date label
  const { status, badgeClass, showStartDate, startDateLabel } = useMemo(() => {
    if (!tenant?.pivot?.start_date) {
      return {
        status: "Vacant",
        badgeClass: "bg-yellow-100 text-yellow-700",
        showStartDate: false,
        startDateLabel: null,
      };
    }

    const start = new Date(tenant.pivot.start_date);
    const end = tenant.pivot.end_date ? new Date(tenant.pivot.end_date) : null;

    if (start > now) {
      return {
        status: "Assigned (Upcoming)",
        badgeClass: "bg-blue-100 text-blue-700",
        showStartDate: true,
        startDateLabel: `Starts on: ${start.toLocaleDateString()}`,
      };
    } else if (start <= now && (!end || end >= now)) {
      return {
        status: "Occupied",
        badgeClass: "bg-green-100 text-green-700",
        showStartDate: false,
        startDateLabel: null,
      };
    } else {
      return {
        status: "Vacant",
        badgeClass: "bg-yellow-100 text-yellow-700",
        showStartDate: false,
        startDateLabel: null,
      };
    }
  }, [tenant]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const viewProperty = () => {
    router.visit(`/property/view?property_id=${property.property_id}`);
  };

  const editProperty = () => {
    if (onEditProperty) {
      onEditProperty(property);
    } else {
      router.visit(`/property/edit/${property.id}`);
    }
  };

  const removeProperty = () => {
    if (onRemoveProperty) {
      onRemoveProperty(property.id);
    } else {
      if (confirm("Are you sure you want to delete this property?")) {
        router.delete(`/property/delete/${property.id}`);
      }
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-md p-6 flex flex-col gap-4">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <HomeIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{property.property_name}</h3>
            <p className="text-xs text-gray-500">ID: {property.property_id}</p>
          </div>
        </div>

        {/* Dropdown menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
              <button
                onClick={viewProperty}
                className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              >
                View
              </button>
              <button
                onClick={editProperty}
                className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={removeProperty}
                className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Status and Date Info */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
        >
          {status}
        </span>

        {showStartDate && (
          <span className="text-xs text-gray-500 italic">
            {startDateLabel}
          </span>
        )}
      </div>

      {/* Tenant Assignment */}
      <div className="space-y-1">
        <p className="text-sm font-medium">Assign Tenant</p>
        <UnassignedTenantList
          tenants={property.allTenants}
          selectedTenant={tenant}
          onSelect={(tenant) => onSelectTenant(property.id, tenant)}
          onAddTenant={(name, phone) => onAddTenant(property.id, name, phone)}
        />
        {status === "Occupied" && (
          <button
            onClick={() => onRemoveTenant(property.id)}
            className="text-xs text-red-500 hover:underline mt-1"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
