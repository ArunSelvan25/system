import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PropertyOverView from './OverView';
import PropertyLocationAndAmenitiesView from './PropertyLocationAndAmnitiesView';
import PropertyImageAndDocumentView from './ImageAndDocumentView';
import PropertyFinancial from './FinancialView';
import Tenant from './Tenant';
import Transactions from './Transactions';
import axios from 'axios';

// 🎯 Sample Data
const sampleData = {
  property: {
    id: 1,
    property_id: 'PROP-2025001',
    property_name: 'Sunset Villa',
    property_type: 'Villa',
    property_status: 'available',
    description: 'A luxurious villa with sea view and private pool.',
    address_line_1: 'Ocean Drive, Sector 5',
    address_line_2: 'Beachside Estate',
    city: 'Goa',
    state: 'Goa',
    postal_code: '403001',
    country: 'India',
    latitude: '15.4800',
    longitude: '73.8278',
    status: 1,
  },
  amenities: [
    { id: 1, name: 'WiFi', status: 1 },
    { id: 2, name: 'Swimming Pool', status: 1 },
    { id: 3, name: 'Gym', status: 0 },
  ],
  images: [
    { id: 1, path: 'property_1/img1.jpg', alt_text: 'Front view' },
    { id: 2, path: 'property_1/img2.jpg', alt_text: 'Pool area' },
    { id: 3, path: 'property_1/img3.jpg', alt_text: 'Living room' },
  ],
  documents: [
    { id: 1, document_type: 'Floor Plan', path: '/docs/plan.pdf', status: 1 },
    { id: 2, document_type: 'Ownership Proof', path: '/docs/ownership.pdf', status: 1 },
  ],
  financial: {
    monthly_rent: 120000.0,
    security_deposit: 240000.0,
    maintenance_charges: 5000.0,
    lease_duration: 12,
    rent_due_day: 5,
    is_negotiable: true,
    payment_frequency: 'monthly',
    charges: ['Water', 'Electricity'],
    status: 1,
    currency: 'INR',
  },
  tenants: [
    { id: 1, user: { name: 'John Doe' }, start_date: '2024-06-01', end_date: null, status: 1 },
    { id: 2, user: { name: 'Jane Smith' }, start_date: '2023-01-01', end_date: '2023-12-31', status: 0 },
  ],
  transactions: [
    {
      id: 1,
      transaction_date: '2024-06-05',
      transaction_type: 'rent',
      amount: 120000.0,
      currency: 'INR',
      status: 'completed',
      reference_id: 'INV-1001',
    },
    {
      id: 2,
      transaction_date: '2024-05-05',
      transaction_type: 'maintenance',
      amount: 5000.0,
      currency: 'INR',
      status: 'pending',
      reference_id: 'INV-1000',
    },
  ],
};

export default function PropertyPage({ property_id }) {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([]);
  const [property, setProperty] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [financial, setFinancial] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get(route('property.details'), {
      params: { property_id }
    })
    .then(response => {
      // Assuming the response contains the same structure as sampleData
      const data = response.data;
      setData(data);
      setProperty(data); 
      setAmenities(data.amenities)
      setImages(data.images)
      setDocuments(data.documents)
      setFinancial(data.financials)
      setTenants(data.tenants)
      setTransactions(data.transactions)
      setIsLoading(false)
    })
    .catch(error => {
      console.error('Error fetching property details:', error);
    });
  }, []);


  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Property Details</h2>}
    >
      <Head title="Property Details" />

      <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
        {/* Overview */}
        <PropertyOverView property={property} isLoading={isLoading} />

        {/* Location & Amenities */}
        <PropertyLocationAndAmenitiesView property={property} amenities={amenities} isLoading={isLoading} />

        {/* Images & Documents */}
        <PropertyImageAndDocumentView images={images} documents={documents} isLoading={isLoading}/>

        {/* Financials */}
        <PropertyFinancial financial={financial} isLoading={isLoading}/>

        {/* Tenants */}
        <Tenant tenants={tenants} isLoading={isLoading}/>

        {/* Transactions */}
        <Transactions transactions={transactions} isLoading={isLoading}/>
      </div>
    </AuthenticatedLayout>
  );
}
