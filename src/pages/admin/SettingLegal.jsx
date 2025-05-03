import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { usePolicyContext } from "../../store/PrivacyPolicy";
import { toast } from "react-toastify";

function SettingLegal() {
  const [serviceData, setServiceData] = useState("");
  const [privacyData, setPrivacyData] = useState("");

  const { AddPolicy, fetchPolicy} = usePolicyContext();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
    history: {
      delay: 1000,
      maxStack: 500,
    },
  };

  const formats = [
    "header",
    "font",
    "list",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "link",
    "blockquote",
    "code-block",
    "color",
    "background",
  ];

  async function handleUpdate() {
    const finalValue = { service: serviceData, privacy: privacyData };
   const data= await AddPolicy(finalValue);
   if(!data){
    toast.success("Policy updated successfully!");
   }else{
    toast.warning("Something went wrong ")
   }
  }

useEffect(()=>{
  async function getvalue() {
    const value= await fetchPolicy()
    setPrivacyData(value.privacy)
    setServiceData(value.service)
  }
  getvalue()
},[])

  return (
    <div className="p-[15px] bg-white rounded-[10px]">
      <div className="flex items-center justify-end">
        <div>
          <button className="text-base font-normal text-black py-2.5 h-[42px] px-[28px] rounded-[10px] bg-[#F1F1F1] me-[15px]">
            Discard
          </button>
          <button
            onClick={handleUpdate}
            className="text-base font-normal text-white py-2.5 h-[42px] px-[28px] rounded-[10px] bg-[#0832DE]"
          >
            Update
          </button>
        </div>
      </div>
      <div className="my-[15px] border-t-[1px] border-[#00000033]"></div>
      <p className="text-base font-medium text-black">Terms of Services</p>
      <div
        className="mt-[15px] "
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <ReactQuill
          value={serviceData}
          onChange={setServiceData}
          modules={modules}
          formats={formats}
          theme="snow"
          style={{ minHeight: "50px" }}
        />
      </div>
      <p className="text-base font-medium text-black mt-[50px]">
        Privacy Policy
      </p>
      <div
        className="mt-[15px] "
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <ReactQuill
          value={privacyData}
          onChange={setPrivacyData}
          modules={modules}
          formats={formats}
          theme="snow"
          style={{ minHeight: "50px" }}
        />
      </div>
    </div>
  );
}

export default SettingLegal;
