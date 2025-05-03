import React from 'react';

function SettingKeysCredentials() {
  return (
    <div className="p-[15px] bg-white rounded-[10px]">
      <div className="flex items-center justify-end">
        <div>
          <button className="text-base font-normal text-black py-2.5 h-[42px] px-[28px] rounded-[10px] bg-[#F1F1F1] me-[15px]">
            Discard
          </button>
          <button className="text-base font-normal text-white py-2.5 h-[42px] px-[28px] rounded-[10px] bg-[#0832DE]">
            Update
          </button>
        </div>
      </div>
      <div className="mt-[15px] border-t-[1px] border-[#00000033]"></div>
      <div className="py-5 mt-[15px]">
        <div className="flex items-center justify-between gap-5">
          <label
            htmlFor="googleMapKey"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]">
            Google Map Key:
          </label>
          <input
            id="googleMapKey"
            name="googleMapKey"
            placeholder="Google Map Enter"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <label
            htmlFor="databaseUrl"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]">
            Database Url:
          </label>
          <input
            id="databaseUrl"
            name="databaseUrl"
            placeholder="Database Url Enter"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <label
            htmlFor="smsServiceUrl"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]">
            SMS Service Url:
          </label>
          <input
            id="smsServiceUrl"
            name="smsServiceUrl"
            placeholder="SMS Service Url Enter"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <label
            htmlFor="razorpayApiKey"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]">
            Razorpay API Key:
          </label>
          <input
            id="razorpayApiKey"
            name="razorpayApiKey"
            placeholder="Razorpay API Enter"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
      </div>
    </div>
  );
}

export default SettingKeysCredentials;
