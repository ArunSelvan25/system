import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function UnassignedTenantList ({ tenants, selectedTenant, onSelect, onAddTenant }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [addMode, setAddMode] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");

    const containerRef = useRef(null);

    // Close dropdown on outside click or Esc
    useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setAddMode(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Escape") {
        setOpen(false);
        setAddMode(false);
        }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleKey);
    };
    }, [open]);

    const getInitial = (name) => name.charAt(0).toUpperCase();

    const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleAdd = () => {
        if (!newName.trim()) return;
        onAddTenant(newName.trim(), newPhone.trim());
        setAddMode(false);
        setNewName("");
        setNewPhone("");
        setOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="min-w-[200px] w-full bg-white border border-gray-200 hover:border-indigo-300 shadow-sm rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
      >
        {selectedTenant ? (
          <span className="truncate">{selectedTenant.name}</span>
        ) : (
          <span className="text-gray-400">Select tenant…</span>
        )}

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ease-out ${open ? "rotate-180" : "rotate-0"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute inset-x-0 z-20 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-black/10 overflow-hidden animate-fade-in">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tenants…"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full capitalize"
            />
          </div>

          {/* List */}
          <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent divide-y divide-gray-100">
            {filteredTenants.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    onSelect(t);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                    {getInitial(t.name)}
                  </span>
                  <span className="truncate text-sm">{t.name}</span>
                </button>
              </li>
            ))}

            {filteredTenants.length === 0 && !addMode && (
              <li className="px-3 py-4 text-center text-sm text-gray-400">No tenants found</li>
            )}
          </ul>

          {/* Add‑new toggle / form */}
          {!addMode ? (
            <button
              onClick={() => setAddMode(true)}
              className="w-full flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium px-3 py-2 bg-gray-50 hover:bg-indigo-50 border-t border-gray-200 transition"
            >
              <PlusIcon className="w-4 h-4" />
              Add new tenant
            </button>
          ) : (
            <div className="p-4 space-y-3 bg-gray-50 border-t border-gray-200">
              <input
                type="text"
                placeholder="Full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-md px-3 py-2 text-sm outline-none transition"
              />
              <input
                type="text"
                placeholder="Phone number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-md px-3 py-2 text-sm outline-none transition"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setAddMode(false)}
                  className="flex-1 text-sm px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Add &amp; Assign
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    )
}