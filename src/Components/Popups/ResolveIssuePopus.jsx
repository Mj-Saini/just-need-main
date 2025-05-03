import React from 'react';

const ResolveIssuePopus = ({onClose}) => {
  return (
    <div>
      <div>
        <div  onClick={onClose} className="bg-white border-2 border-[#00000026] w-[120px] absolute mt-4 rounded-[10px] lg:right-3 z-50 sm:right-[10%] ">
          <h2 className="font-normal sm:text-sm md:text-base text-black opacity-60 hover:opacity-100 py-[14px] px-5 hover:bg-[#eee] hover:text-black">
            Resolved
          </h2>

          <h2 className="font-normal sm:text-sm md:text-base text-black opacity-60 hover:opacity-100 py-[14px] px-5 hover:bg-[#eee] hover:text-black">
            Processing
          </h2>
          <h2 className="font-normal sm:text-sm md:text-base text-black opacity-60 hover:opacity-100 py-[14px] px-5 hover:bg-[#eee] hover:text-black">
            Invalid
          </h2>
          <h2 className="font-normal sm:text-sm md:text-base text-black opacity-60 hover:opacity-100 py-[14px] px-5 hover:bg-[#eee] hover:text-black">
            Withdrawn
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ResolveIssuePopus;
