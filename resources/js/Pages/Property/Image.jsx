import React from 'react';

export default function PropertyImageView({ images, isLoading }) {
    const shimmerItems = Array.from({ length: 6 });

    return (
        <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                Images & Documents
            </h2>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {shimmerItems.map((_, idx) => (
                        <div
                            key={idx}
                            className="h-40 bg-gray-200 rounded-xl animate-pulse"
                        ></div>
                    ))}
                </div>
            ) : images?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="relative overflow-hidden rounded-xl shadow-md bg-white border border-gray-200 group"
                            title={img.alt_text || 'Image'}
                        >
                            {img.path ? (
                                <img
                                    src={`/storage/property_images/${img.path}`}
                                    alt={img.alt_text || 'Property Image'}
                                    className="w-full h-40 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-40 flex items-center justify-center text-gray-400 bg-gray-100 text-sm italic">
                                    No image
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-5xl text-gray-300 mb-3">📁</div>
                    <p className="text-gray-500 italic">No images or documents available.</p>
                </div>
            )}
        </section>
    );
}
