import React from 'react';
import PropertyImageView from './Image';
import PropertyDocumentView from './Document';
export default function PropertyImageAndDocumentView({ images, documents, isLoading = false }) {

    return (
        <>
            <section className="bg-white rounded-2xl shadow p-6">
               <PropertyImageView images={images} isLoading={isLoading}/>
                <PropertyDocumentView documents={documents} isLoading={isLoading}/>
            </section>
        </>
    );
}