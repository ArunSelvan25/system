import React from 'react';

export default function AmenitiesView({ amenities, isLoading }) {
    const shimmerItems = Array.from({ length: 6 });

    return (
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Amenities
            </h2>

            {isLoading ? (
                <ul className="flex flex-wrap gap-3">
                    {shimmerItems.map((_, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 rounded-full bg-gray-200 animate-pulse w-24 h-8"
                        ></li>
                    ))}
                </ul>
            ) : amenities?.length ? (
                <ul className="flex flex-wrap gap-3">
                    {amenities.map((a) => (
                        <li
                            key={a.id}
                            className={`
                                flex items-center justify-center
                                px-4 py-2 rounded-full text-sm font-semibold
                                transition duration-300 ease-in-out
                                ${a.status
                                    ? 'bg-emerald-100 text-emerald-800 shadow-md hover:bg-emerald-200 cursor-default'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'}
                            `}
                            title={a.status ? `${a.name} available` : `${a.name} unavailable`}
                        >
                            {a.name || '—'}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-500 italic">No amenities available</div>
            )}
        </div>
    );
}
