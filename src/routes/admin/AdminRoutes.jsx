/* eslint-disable no-unused-vars */
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "../../Components/AdminLayout";
import Aside from "../../pages/admin/Aside";
import ProvidersDetail from "../../pages/admin/ProvidersDetail";
import ServiceRequest from "../../pages/admin/ServiceRequest";
import Setting from "../../pages/admin/Setting";
import Logout from "../../pages/admin/Logout";
import { customersDataList } from "../../Components/Common/Helper";
import Services from "../../Components/Common/Services";
import Actions from "../../Components/Popups/Actions";
import Subscription from "../../Components/Subscription";
import Users from "../../pages/admin/Users";
import UserDetails from "../../pages/admin/UserDetails";
import { Complaints } from "../../pages/admin/Complaints";
import Provider_Detail from "../../pages/admin/Provider_Detail";
import SettinGeneral from "../../pages/admin/SettinGeneral";
import SettingLegal from "../../pages/admin/SettingLegal";
import SettingKeysCredentials from "../../pages/admin/SettingKeysCredentials";
import Chat from "../../pages/Chat";
import LoginPupUp from "../../Components/Popups/LoginPupUp";
import resetPassword from "../../Components/Popups/ResetPassword";
import emailVerification from "../../Components/Popups/EmailVerification";
import createPassword from "../../Components/Popups/CreatePassword";
import passwordchanged from "../../Components/Popups/PasswordChanged";
import ProtectedRoute from "../../Components/ProtectedRoute";
import BannerDetails from "../../pages/admin/BannerDetails";
import Listing from "../../pages/admin/Listing";
import ListingDetails from "../../pages/admin/ListingDetails";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<ProtectedRoute Children={LoginPupUp} />} />
      <Route
        path="/resetPassword"
        element={<ProtectedRoute Children={resetPassword} />}
      />
      <Route
        path="/emailVerification"
        element={<ProtectedRoute Children={emailVerification} />}
      />
      <Route
        path="/createPassword"
        element={<ProtectedRoute Children={createPassword} />}
      />
      <Route
        path="/passwordchanged"
        element={<ProtectedRoute Children={passwordchanged} />}
      />

      <Route
        path="/dashboard"
        element={<ProtectedRoute Children={AdminLayout} />}
      >
        <Route index element={<Aside />} />
        <Route path="usersList" element={<Users />}>
          <Route path="userDetails/:id" element={<UserDetails />} />
        </Route>
        <Route path="serviceRequest" element={<ServiceRequest />} />
        <Route path="services" element={<Services />} />


        <Route path="listings" element={<Listing />} />
        <Route path="listings/:id" element={<ListingDetails />} />

        <Route path="bannerDetail" element={<BannerDetails />} />
        <Route path="complaints" element={<Complaints />}>
          <Route path="complaintsDetails/:id" element={<Provider_Detail />} />
        </Route>
        <Route path="setting" element={<Setting />} />
        <Route path="setting/general" element={<SettinGeneral />} />
        <Route path="setting/legal" element={<SettingLegal />} />
        <Route
          path="setting/keys&Credentials"
          element={<SettingKeysCredentials />}
        />
        <Route path="Provider_Detail" element={<Provider_Detail />} />
        <Route path="logout" element={<Logout />} />
        <Route path="Chat" element={<Chat />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
