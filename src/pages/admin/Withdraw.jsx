

'use client';
import { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../store/supabaseCreateClient';

const Withdraw = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Withdraw data from Supabase
  useEffect(() => {
    const fetchWithdraws = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Withdraw')
        .select('*');

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setRequests(data);
      }
      setLoading(false);
    };

    fetchWithdraws();
  }, []);

  const handleCopy = (upiId) => {
    navigator.clipboard.writeText(upiId);
    alert(`UPI ID "${upiId}" copied to clipboard!`);
  };

  const handleApprove = async (id) => {
    // Update in state
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'approved' } : req))
    );

    // Update in Supabase
    await supabase
      .from('Withdraw')
      .update({ status: 'approved' })
      .eq('id', id);
  };

  const handleReject = async (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'rejected' } : req))
    );

    await supabase
      .from('Withdraw')
      .update({ status: 'rejected' })
      .eq('id', id);
  };

  // Fix: compare lowercase status
  const filteredRequests = requests.filter(
    (req) => req.status?.toLowerCase() === activeTab
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdraw Requests</h1>

      {loading && <p className="text-gray-500">Loading requests...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 mb-4 border-b">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 capitalize border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Seller Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UPI ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  {activeTab === 'pending' && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="border-t">
                      <td className="px-4 py-2">{req.id}</td>
                      <td className="px-4 py-2">{req.user_name}</td>
                      <td className="px-4 py-2 flex items-center justify-between space-x-2">
                        <span>{req.upi_id}</span>
                        <button
                          onClick={() => handleCopy(req.upi_id)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Copy UPI ID"
                        >
                          <ClipboardIcon className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="px-4 py-2">₹{req.amount}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            req.status?.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : req.status?.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                        </span>
                      </td>
                      {activeTab === 'pending' && (
                        <td className="px-4 py-2 space-x-2 flex items-center">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                            title="Approve"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                            title="Reject"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={activeTab === 'pending' ? 6 : 5}
                      className="text-center py-6 text-gray-500"
                    >
                      No {activeTab} requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Withdraw;
