

import { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../store/supabaseCreateClient';
import DisablePopUp from '../../Components/Popups/DisablePopUp';
import { useNavigate } from 'react-router-dom';
import ApproveIcon from '../../assets/png/Approve_icon.svg.png';
import RejectIcon from '../../assets/png/reject-icon.jpg';
import { useCustomerContext } from '../../store/CustomerContext';


// import { useUserContext } from '../../store/UserContext';


const Withdraw = () => {
  const { users } = useCustomerContext();
  // const { sendFCMMessage } = useUserContext();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

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

  const sendFcmNotification = async () => {
  try {
    const token = 'd1FMfLkvS-azXi6gV2bRGm:APA91bEk8AvHENGf8LQBHZ2ELCyoxMuMsBZO5fZTtrPiidMLyAu2KKt9bJwKgQjWwygWcAD50MfIDeY66iKB-eJESSb0dV_91QG1_9BYB-O1byQbnsD4zjM';

    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Notification sent:', data);
    } else {
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};


  // Copy UPI ID to clipboard
  const handleCopy = (upiId) => {
    navigator.clipboard.writeText(upiId);
    alert(`UPI ID "${upiId}" copied to clipboard!`);
  };

  // Handle Approve/Reject Confirmation
  const handleConfirm = async () => {
    if (!confirmAction) return;

    const { type, id } = confirmAction;
    const newStatus = type === 'Approve' ? 'Approved' : 'Rejected';

    // Optimistically update UI
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );

    // Update status in Supabase
    await supabase.from('Withdraw').update({ status: newStatus }).eq('id', id);

   // Find user token for FCM
  const currentRequest = requests.find((req) => req.id === id);
  if (currentRequest) {
    const userToken = users.find((u) => u.id === currentRequest.userId)?.msgToken;

    if (userToken) {
      const messageTitle = "Just Needs";
      const messageBody = type === 'Approve'
        ? `✅ Your withdrawal request of ₹${currentRequest.amount} has been approved.`
        : `❌ Your withdrawal request of ₹${currentRequest.amount} has been rejected.`;

      try {
        const result = await sendFcmNotification (userToken, messageTitle, messageBody);
        
        if (result.success) {
          console.log(`Notification sent to user ${currentRequest.user_name}`);
        } else {
          console.warn('Notification failed:', result.error);
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      console.warn('No FCM token found for user:', currentRequest.userId);
    }
  }
    
  

    setConfirmAction(null);
  };

  const filteredRequests = requests.filter((req) => req.status === activeTab);

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

          {/* Table */}
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
                  filteredRequests.map((req, index) => (
                    <tr key={req.id} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td
                        onClick={() => navigate(`/dashboard/usersList/userDetails/${req.userId}`)}
                        className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
                      >
                        {req.user_name}
                      </td>
                      <td className="px-4 py-2 flex items-center space-x-2">
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

      {/* Confirmation Popup */}
      {confirmAction && (
        <DisablePopUp
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          isActive={confirmAction.type !== 'Approve'}
          confirmText={confirmAction.type}
          icon={confirmAction.type === 'Approve' ? ApproveIcon : RejectIcon}
        />
      )}
    </div>
  );
};

export default Withdraw;

