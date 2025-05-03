/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import CustomerData from '../../Components/CustomerData';
import { customersDataList } from '../../Components/Common/Helper';
import { CiSearch, CiFilter } from 'react-icons/ci';
import UsersFilterPopUp from '../../Components/Popups/UsersFilterPopUp';
import { Outlet, useLocation } from 'react-router-dom';

function Users() {
  const location = useLocation();
  const isUserDetailsPage = location.pathname.includes('userDetails');

  return (
    <div className="p-4 bg-white rounded-[10px]">
      {!isUserDetailsPage && (
        <>
          <CustomerData mapData={customersDataList} />
        </>
      )}

      <Outlet />
    </div>
  );
}

export default Users;
