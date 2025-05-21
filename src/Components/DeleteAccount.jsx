/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import ss1 from '../assets/Images/Png/ss1.jpeg';
import ss2 from '../assets/Images/Png/ss2.jpeg';
import ss3 from '../assets/Images/Png/ss3.jpeg';
import ss4 from '../assets/Images/Png/ss4.jpeg';

const DeleteAccount = () => {
  const [step, setStep] = useState('step1');

  const steps = [
    { key: 'step1', title: 'Step 1: ',  subtitle: 'Open the Mobile Application' },
    { key: 'step2', title: 'Step 2: ',  subtitle: 'Navigate to Profile' },
    { key: 'step3', title: 'Step 3: ',  subtitle: 'Open the Mobile Application' },
    { key: 'step4', title: 'Step 4: ',  subtitle: 'Navigate to Account Settings' },
    { key: 'step5', title: 'Step 5: ',  subtitle: 'Open the Mobile Application' },
    { key: 'step6', title: 'Step 6: ',  subtitle: 'Navigate to Account Settings' },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 'step1':
        return (
            <>
                  
                
            <p className="text-lg font-bold text-black mb-0">Step 1: Open the Mobile Application</p>
            <p className="text-sm font-normal text-black mt-2">
              Open the “Just Need” mobile application on your device.
            </p>
          </>
        );
      case 'step2':
        return (
            <>
               
            <p className="text-lg font-bold text-black mb-0">Step 2: Navigate to Profile</p>
            <p className="text-sm font-normal text-black mt-2">
              In the app, locate and navigate to the "Contact us" or a similar section.
            </p> <div className='flex gap-5'> <img className='w-[300px] py-6' src={ss1} alt="ss" />
                 <img className='w-[300px] py-6' src={ss2} alt="ss" /></div>
          </>
        );
      case 'step3':
        return (
            <>
               
            <p className="text-lg font-bold text-black mb-0">Step 3: Find the Deletion Feature/Button</p>
            <p className="text-sm font-normal text-black mt-2">
              Look for the "Delete Account" feature or button
                </p>
                <div className='flex gap-5'> <img className='w-[300px] py-6' src={ss3} alt="ss" />
                 </div>
          </>
        );
      case 'step4':
        return (
            <>
            <p className="text-lg font-bold text-black mb-0">Step 4: Confirm Deletion</p>
            <p className="text-sm font-normal text-black mt-2">
              Upon selecting the "Delete Account" feature, the app may prompt you to confirm
              your decision. Please review the confirmation message carefully.
                </p>
                <img className='w-[300px] py-6' src={ss4} alt="ss" />
          </>
        );
      case 'step5':
        return (
            <>
             
            <p className="text-lg font-bold text-black mb-0">Step 5: Additional Verification (if applicable)</p>
            <p className="text-sm font-normal text-black mt-2">
              For security purposes, you may be required to enter your password or provide
              additional verification information.
            </p>
          </>
        );
      case 'step6':
        return (
            <>
            
            <p className="text-lg font-bold text-black mb-0">Step 6: Receive Confirmation</p>
            <p className="text-sm font-normal text-black mt-2">
              Once you've successfully completed the deletion process, you will receive a
              confirmation message on the mobile app confirming the deletion of your account.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const stepOrder = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* <div className="bg-[#0832DE] py-3">
        <div className="max-w-6xl mx-auto flex items-center">
          <p className="text-base font-bold text-white ml-2 mb-0">
            STSM - Save Time Save Money
          </p>
        </div>
      </div> */}

      <div className="mx-auto flex-grow px-4">
        <p className="text-lg font-bold text-black mt-4 pt-1">Account Deletion Request</p>
        <p className="text-sm font-normal text-black mt-3 pt-1">
          Welcome to [Your Company] Account Deletion Page. At [Your Company], we understand that
          your privacy is important. If you wish to delete your user account, please follow the
          steps below.
        </p>

        <div className="overflow-auto mt-4">
          <div className="flex items-center gap-4 min-w-[700px] mb-1">
            {steps.map(({ key, title, subtitle }) => (
              <div
                key={key}
                onClick={() => setStep(key)}
                className={`flex flex-col items-center w-full p-3 rounded-md cursor-pointer  ${
                  step === key ? 'bg-[#0832DE]' : 'bg-[#6C4DEF] '
                        }`}>
                <p className="text-xs font-medium text-white my-1">{title}</p>
                <p className="text-[10px] font-normal text-white text-center">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {renderStepContent()}
          <div className="flex justify-end gap-4 mt-4">
            {step !== 'step1' && (
              <button
                className="bg-green-600 text-white px-4 py-1 text-sm rounded"
                onClick={() => {
                  const index = stepOrder.indexOf(step);
                  if (index > 0) setStep(stepOrder[index - 1]);
                }}>
                Back
              </button>
            )}
            {step !== 'step6' && (
              <button
                className="bg-[#0832DE] text-white px-4 py-1 text-sm rounded"
                onClick={() => {
                  const index = stepOrder.indexOf(step);
                  if (index < stepOrder.length - 1) setStep(stepOrder[index + 1]);
                }}>
                Next
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-lg font-bold text-black">Important Notes:</p>
          <p className="text-sm font-normal text-black mt-3">
            <span className="font-bold">Data Removal:</span> Your personal data will be removed
            from our system as per our Privacy Policy.
          </p>
          <p className="text-sm font-normal text-black mt-3">
            <span className="font-bold">Irreversible Process:</span> Account deletion is
            irreversible. Make sure you have backed up any important data before proceeding.
          </p>
          <p className="text-sm font-normal text-black mt-3">
            <span className="font-bold">Contact Support:</span> If you encounter any issues or
            have questions, please contact our support team.
          </p>
          <p className="text-sm font-normal text-black mt-3 pb-2">
            Thank you for being a part of our community!
          </p>
        </div>
      </div>

      <div className="bg-[#0832DE] py-3">
        <div className="max-w-6xl mx-auto">
          <p className="text-white text-sm mb-0">
            © All Rights Reserved at STSM - Save Time Save Money
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
