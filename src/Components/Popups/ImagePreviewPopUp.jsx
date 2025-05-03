import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function ImagePreviewPopUp({ images, onCancel }) {
  const settings = {
    dots: true,
    arrows: true,
    autoplaySpeed: 1000,
    cssEase: "ease-in-out",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToScroll: 1,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>
      <div  className="fixed inset-0 flex items-center justify-center z-50  m-auto h-[588px]  w-8/12 xl:w-6/12"> 
        <div className=" w-full  bg-white p-10   relative  rounded-[10px] ">
          <button
            onClick={onCancel}
            className="absolute top-2 right-2 text-black hover:text-black"
            aria-label="Close"
          >
            &#10005;
          </button>
          <Slider className="mt-5 lg:mt-[30px] " {...settings}>
          {images.map((image,index)=>{
            return (
                <div key={index} className="w-full ">
                    <img className="w-full" src={image}/>
                </div>
            )
          })}
            </Slider>
        </div>
      </div>
    </>
  );
}

export default ImagePreviewPopUp;
