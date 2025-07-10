
// /* eslint-disable react/prop-types */

// import { StatusCloseIcon } from "../../assets/icon/Icons";
// import avatar from "../../assets/png/user-profile-icon.png"; // fallback image

// const BlockedUserPopups = ({ blockedUsers, onClose, onUnblock }) => {
//   return (
//     <>
//       <div
//         onClick={onClose}
//         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
//       ></div>

//       <div className="fixed inset-0 z-50 flex items-center justify-center">
//         <div className="w-[600px] max-h-[80vh] bg-white rounded-xl shadow-lg overflow-auto p-6 relative">
//           <button className="absolute top-4 right-4" onClick={onClose}>
//             <StatusCloseIcon />
//           </button>

//           <h2 className="text-xl font-semibold mb-4">Blocked Users</h2>

//           {blockedUsers.length === 0 ? (
//             <p>No blocked users found.</p>
//           ) : (
//             <ul className="space-y-4">
//               {blockedUsers.map((user) => (
//                 <li
//                   key={user.id}
//                   className="flex items-center justify-between gap-4 p-3 border rounded-lg"
//                 >
//                   <div className="flex items-center gap-4">
//                     <img
//                       src={user.image || avatar}
//                       alt="User"
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <div>
//                       <p className="font-medium">
//                         {user.firstName} {user.lastName}
//                       </p>
//                       <p className="text-sm text-gray-500">{user.useremail}</p>
//                     </div>
//                   </div>
//                   <button
//                     className="bg-[#0832DE] text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#0621b5] transition-colors"
//                     onClick={() => onUnblock(user.id)}
//                   >
//                     Unblock
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlockedUserPopups;



/* eslint-disable react/prop-types */

import { StatusCloseIcon } from "../../assets/icon/Icons";
import avatar from "../../assets/png/user-profile-icon.png"; // fallback image

const BlockedUserPopups = ({ blockedUsers, onClose, onUnblock }) => {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[600px] max-h-[80vh] bg-white rounded-xl shadow-lg overflow-auto p-6 relative">
          <button className="absolute top-4 right-4" onClick={onClose}>
            <StatusCloseIcon />
          </button>

          <h2 className="text-xl font-semibold mb-4">Blocked Users</h2>

          {blockedUsers.length === 0 ? (
            <p>No blocked users found.</p>
          ) : (
            <ul className="space-y-4">
              {blockedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-4 p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.image || avatar}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.useremail}</p>
                    </div>
                  </div>
                  <button
                    className="bg-[#0832DE] text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#0621b5] transition-colors"
                    onClick={() => onUnblock(user.id)}
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default BlockedUserPopups;
