// CustomConfirmationPopup.jsx
import React from 'react';

const CustomConfirmationPopup = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "info", // "info", "warning", "danger", "success"
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getIconAndColor = () => {
        switch (type) {
            case "warning":
                return {
                    icon: (
                        <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    ),
                    bgColor: "bg-yellow-100",
                    textColor: "text-yellow-800",
                    buttonColor: "bg-yellow-600 hover:bg-yellow-700"
                };
            case "danger":
                return {
                    icon: (
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: "bg-red-100",
                    textColor: "text-red-800",
                    buttonColor: "bg-red-600 hover:bg-red-700"
                };
            case "success":
                return {
                    icon: (
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: "bg-green-100",
                    textColor: "text-green-800",
                    buttonColor: "bg-green-600 hover:bg-green-700"
                };
            default:
                return {
                    icon: (
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    buttonColor: "bg-blue-600 hover:bg-blue-700"
                };
        }
    };

    const { icon, bgColor, textColor, buttonColor } = getIconAndColor();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className={`${bgColor} rounded-t-xl p-6`}>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            {icon}
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${textColor}`}>
                                {title}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-700 mb-6">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2.5 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirmationPopup;