import React from 'react';
import LocationView from './LocationView';
import AmenitiesView from './AmenitiesView';

export default function PropertyLocationAndAmenitiesView({ property, amenities, isLoading = false }) {
    return (
        <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LocationView property={property} isLoading={isLoading}/>

                <AmenitiesView amenities={amenities} isLoading={isLoading}/>
            </section>
        </>
    );
}