import React from 'react';

export default function PropertyFinancial({ financial, isLoading = false }) {
  const shimmerItems = Array.from({ length: 9 });

  // Helper to safely display values or fallback '-'
  const displayValue = (val) => {
    if (val === undefined || val === null || val === '') return '-';
    if (Array.isArray(val)) {
      return val.length ? val.join(', ') : '-';
    }
    return val;
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Financial Details</h2>

      {isLoading || !financial ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shimmerItems.map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl p-5 animate-pulse h-20 shadow-sm cursor-default"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Rent</p>
            <p className="text-lg font-semibold">₹{displayValue(financial.monthly_rent)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Deposit</p>
            <p className="text-lg font-semibold">₹{displayValue(financial.security_deposit)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Maintenance</p>
            <p className="text-lg font-semibold">₹{displayValue(financial.maintenance_charges)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Lease Duration</p>
            <p className="text-lg font-semibold">{displayValue(financial.lease_duration)} mo</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Due Day</p>
            <p className="text-lg font-semibold">{displayValue(financial.rent_due_day)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default flex items-center justify-between">
            <p className="text-gray-500 uppercase text-xs font-semibold">Negotiable</p>
            <span
              className={`px-3 py-1 rounded-full font-semibold text-sm ${
                financial.is_negotiable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {financial.is_negotiable ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Payment Frequency</p>
            <p className="text-lg font-semibold">{displayValue(financial.payment_frequency)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Charges</p>
            <p className="text-lg font-semibold truncate">{displayValue(financial.charges)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Currency</p>
            <p className="text-lg font-semibold">{displayValue(financial.currency)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
