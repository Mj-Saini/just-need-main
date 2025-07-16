

'use client';
import { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../store/supabaseCreateClient';
import DisablePopUp from '../../Components/Popups/DisablePopUp';
import { useNavigate } from 'react-router-dom';
import ApproveIcon from '../../assets/png/Approve_icon.svg.png';
import RejectIcon from '../../assets/png/reject-icon.jpg';

const Withdraw = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: "Approve"/"Reject", id }

  // Fetch Withdraw data from Supabase
  useEffect(() => {
    const fetchWithdraws = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Withdraw').select('*');

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

  const handleConfirm = async () => {
    if (!confirmAction) return;

    const { type, id } = confirmAction;
    const newStatus = type === 'Approve' ? 'Approved' : 'Rejected';

    // Update in state
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );

    // Update in Supabase
    await supabase.from('Withdraw').update({ status: newStatus }).eq('id', id);

    // Close popup
    setConfirmAction(null);
  };

  // Filter requests matching active tab
  const filteredRequests = requests.filter(
    (req) => req.status === activeTab
  );

  console.log('requests',filteredRequests);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdraw Requests</h1>

      {loading && <p className="text-gray-500">Loading requests...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 mb-4 border-b">
            {['Pending', 'Approved', 'Rejected'].map((tab) => (
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.No</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UPI ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  {activeTab === 'Pending' && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req,index) => (
                    <tr key={req.id} className="border-t">
                      <td className="px-4 py-2">{index +1}</td>
                      <td
                        onClick={() => navigate(`/dashboard/usersList/userDetails/${req.userId}`)}
                        className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
                      >
                        {req.user_name}
                      </td>
                      <td className="px-4 py-2 flex items-center  space-x-2">
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
                            req.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : req.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      {activeTab === 'Pending' && (
                        <td className="px-4 py-2 space-x-2 flex items-center">
                          <button
                            onClick={() => setConfirmAction({ type: 'Approve', id: req.id })}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                            title="Approve"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: 'Reject', id: req.id })}
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
                      colSpan={activeTab === 'Pending' ? 6 : 5}
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

      {confirmAction && (
        <DisablePopUp
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          isActive={confirmAction.type === 'Approve' ? false : true}
          confirmText={confirmAction.type}
          icon={confirmAction.type === 'Approve' ? ApproveIcon : RejectIcon}
        />
      )}
    </div>
  );
};

export default Withdraw;
