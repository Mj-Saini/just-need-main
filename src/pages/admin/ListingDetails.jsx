/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import user from "../../assets/png/user for listing.png";
import star from "../../assets/png/star.png";
import { Link, useParams } from "react-router-dom";
import disable_img from "../../assets/png/disable_img.png";
import enable_img from "../../assets/png/enable_img.png";
import { supabase } from "../../store/supabaseCreateClient";
import { EmailIcon, LocationIcon, PhoneIcon } from "../../assets/icon/Icons";
import { useListingContext } from "../../store/ListingContext";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { DisableIcon, EnableIcon } from "../../assets/icon/Icon";
import { truncateText } from "../../utility/wordTruncate";
import { list } from "postcss";
import userDummyImg from '../../assets/Images/Png/dummyimage.jpg'
import active from "../../assets/png/active.png"

const ListingDetails = () => {
  const [listData, setListData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleViewImage = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
  };

  const { id } = useParams();
  const { fetchlistingWithId } = useListingContext();

  async function getData() {
    const value = await fetchlistingWithId(id);
    setListData(value);
  }

  if (typeof global === "undefined") {
    window.global = window;
  }

  async function handleBlock(e, val) {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure to Block user?");
    if (confirmDelete) {
      const { data, error } = await supabase
        .from("service_listings")
        .update({
          blockStatus: {
            isBlocked: !val.isBlocked,
            reason: val.reason,
            blockedBy: val.blockedBy,
          },
        })
        .eq("id", id);

      if (!error) {
        setListData((prev) => ({
          ...prev,
          blockStatus: {
            ...listData.blockStatus,
            isBlocked: !prev.blockStatus.isBlocked,
          },
        }));
      } else {
        alert("Something went wrong. Please try again");
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  console.log(listData, "list data")

  return (
    <div className="bg-white rounded-md flex flex-col lg:flex-row h-full overflow-auto scrollRemove">

      {/* Left Side - Scrollable */}
      <div className="lg:w-7/12 w-full p-3 h-[calc(100vh-115px)] overflow-auto scrollRemove">
        <div>
          <div className="flex justify-between">
            <h3 className="text-[20px] font-medium">Posted By</h3>
            <p className="font-normal text-[12px]">{listData?.createdAt}</p>
          </div>

          {/* Updated Design */}
          <div className="flex justify-between mt-6">
            <div>
              <div className="flex justify-between">
                <div className="flex">
                  <div>
                    <img
                      className="flex h-[52px] w-[52px] rounded-full"
                      src={listData?.user_detail?.image || userDummyImg}
                      alt=""
                    />
                  </div>
                  <div className="ms-3">
                    <div className="flex items-center gap-[10px]">
                      <p className="font-semibold text-lg">
                        {listData?.user_detail?.firstName}{" "}
                        {listData?.user_detail?.lastName}

                      </p>
                    </div>
                    <p className="font-normal text-sm text-[#ADA4A5]">
                      {listData?.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mt-[16px]">
                <span className="font-normal w-[100px] text-sm text-[#1D1617] flex justify-between">
                  Phone No <span className="ms-5">:</span>
                </span>
                <span className="text-[#1D1617] font-normal text-sm opacity-[50%] ms-10">
                  +91-{listData?.user_detail?.mobile_number}
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal w-[100px] text-sm flex justify-between">
                  Category <span className="ms-5">:</span>
                </span>
                <span className="bg-[#6C4DEF1A] font-normal text-sm rounded-[90px] text-purple-700 px-2 py-0.5 border-none outline-none ms-10">
                  Vehicle
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal w-[100px] text-sm flex justify-between">
                  Email <span className="ms-5">:</span>
                </span>
                <span className="text-[#1D1617] font-normal text-sm opacity-[50%] ms-10">
                  {listData?.user_detail?.useremail}
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal w-[100px] text-sm flex justify-between">
                  Address <span className="ms-5">:</span>
                </span>
                <span className="text-[#1D1617] font-normal text-sm opacity-[50%] ms-10">

                  {listData?.user_detail?.address?.city && listData?.user_detail?.address?.state
                    ? `${listData.user_detail.address.city} ${listData.user_detail.address.state}`
                    : "N/A"}


                </span>
              </div>
            </div>

            <div className="text-end flex flex-col">
              <Link
                to={`/dashboard/usersList/userDetails/${listData?.user_detail?.id}`}
                className="px-[28px] py-[12px] text-[#6C4DEF] border-[#6C4DEF] border font-normal text-base rounded-[10px]"
              >
                View Profile
              </Link>
              <button className="py-1" onClick={(e) => handleBlock(e, listData.blockStatus)}>
                {listData?.blockStatus?.isBlocked ? (
                  <button className="px-[37px] py-[12px] text-[#FF0000] border-[#FF0000] border font-medium text-base rounded-[10px] mt-[19px] flex items-center">
                    <span className="me-2">
                      <DisableIcon />
                    </span>
                    Block
                  </button>
                ) : (
                  <button className="px-[37px] py-[12px] text-[green] border-[green] border font-medium text-base rounded-[10px] mt-[19px] flex items-center">
                    <span className="me-2">
                      <img src={active} alt="" />
                    </span>
                    Active
                  </button>
                )}
              </button>
            </div>
          </div>
        </div>

        <hr className="my-[32px]" />

        <div className="p-[14px] rounded-[10px] bg-[#DDDADA4D]">
          <div className="flex justify-between">
            <h2 className="font-semibold text-base text-black">
              {listData?.categoryName}
            </h2>
            <p className="font-semibold text-lg">₹ {listData?.price}</p>
          </div>
          <div className="w-full opacity-40 my-[14px]"></div>
          <p className="text-sm font-normal text-black opacity-70">
            {listData?.description}
          </p>

          <div className="flex gap-3 flex-wrap">
            {listData?.images?.length > 0 &&
              listData?.images?.map((item, index) => (
                <div
                  key={index}
                  className="relative rounded-md w-[200px] overflow-hidden group mt-5"
                >
                  <img
                    className="rounded-md w-full object-cover cursor-pointer"
                    src={item}
                    onClick={() => handleViewImage(item)}
                    alt="listDetail"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleViewImage(item)}
                      className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium shadow-lg hover:bg-gray-200 transition"
                    >
                      View Image
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {isOpen && (
            <Lightbox
              mainSrc={currentImage}
              onCloseRequest={() => setIsOpen(false)}
              enableZoom={true}
            />
          )}
        </div>
      </div>

      {/* Right Side - Fixed Height, Scrollable */}
      <div className="lg:w-5/12 w-full p-3 h-[calc(100vh-115px)] overflow-auto scrollRemove">
        <div className="bg-[#DDDADA4D] p-3 rounded-md">
          <h4 className="font-semibold text-[20px]">Reviews</h4>
          <div className="flex gap-[83px] items-center flex-wrap">
            <div className="flex items-center gap-5">
              <span className="text-[48px]">{listData?.rating}</span>
              <div>
                <div className="flex gap-2">
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                </div>
                <p className="mt-2">{listData?.reviewCount} reviews</p>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <img src={star} alt="star" />
              <div className="flex">
                <div className="relative group">
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity rounded-md h-[50px] w-[90px] py-[2px] bg-[#FF7F00] text-center -top-[60px] -left-[20px]">
                    <p className="text-white">1.44k</p>
                    <p className="text-white text-[12px]">1 star Ratings</p>
                  </div>
                  <div className="rounded-md h-[7px] w-[20px] bg-[#FF7F00]"></div>
                </div>
                <div className="relative group">
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity rounded-md h-[50px] w-[90px] py-[2px] bg-[#FF6565] text-center -top-[60px] -left-[20px]">
                    <p className="text-white">2.41k</p>
                    <p className="text-white text-[12px]">2 star Ratings</p>
                  </div>
                  <div className="rounded-md h-[7px] w-[40px] bg-[#FF6565]"></div>
                </div>
                <div className="relative group">
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity rounded-md h-[50px] w-[90px] py-[2px] bg-[#6C4DEF] text-center -top-[60px] -left-[20px]">
                    <p className="text-white">1.44k</p>
                    <p className="text-white text-[12px]">3 star Ratings</p>
                  </div>
                  <div className="rounded-md h-[7px] w-[40px] bg-[#6C4DEF]"></div>
                </div>
                <div className="relative group">
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity rounded-md h-[50px] w-[90px] py-[2px] bg-[#0DA800] text-center -top-[60px] -left-[20px]">
                    <p className="text-white">2.44k</p>
                    <p className="text-white text-[12px]">4 star Ratings</p>
                  </div>
                  <div className="rounded-md h-[7px] w-[50px] bg-[#0DA800]"></div>
                </div>
                <div className="relative group">
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity rounded-md h-[50px] w-[90px] py-[2px] bg-[#a84c00] text-center -top-[60px] -left-[20px]">
                    <p className="text-white">4.44k</p>
                    <p className="text-white text-[12px]">5 star Ratings</p>
                  </div>
                  <div className="rounded-md h-[7px] w-[30px] bg-[#a84c00]"></div>
                </div>
              </div>
              <p className="text-[18px] font-medium">5.12k</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {[0, 1, 2, 3, 4].map((item, index) => (
            <div key={index}>
              <hr className="my-[32px] border-dotted border-t-0 border-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user} alt="user" />
                  <div>
                    <h5 className="font-medium text-[14px]">Rovert Fox</h5>
                    <p className="text-[#00000099] text-[10px]">Nov 25, 2024</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                  <img src={star} alt="star" />
                </div>
              </div>
              <p className="text-[#00000099] text-[14px] mt-[22px]">
                It is a long established fact that a reader will be distracted by
                the readable content of a page when looking at its layout. The
                point of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters, as opposed to using 'Content here to a ,
                content here', making it look like readable English. Many desktop
                publishing packages and web page editors now use Lorem Ipsum as
                their default model text, and a search for 'lorem ipsum' will
                uncover many web sites still in their infancy. Various versions
                have evolved over the years, sometimes by accident, sometimes on
                purpose (injected humour and the like).
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;