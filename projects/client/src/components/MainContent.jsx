import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Flex, Container, Heading } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import PropertyCard from "./PropertyCard";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/swiperKita.css";
import { useDispatch, useSelector } from "react-redux";
import { clearAllDate } from "../actions/dateAction";

function MainContent(props) {
  const [propertyData, setPropertyData] = useState([]);
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => {
    return {
      startDate: state.dateBook.startDate,
      endDate: state.dateBook.endDate,
    };
  });
  const getPropertyData = async () => {
    try {
      const res = await Axios.post(process.env.REACT_APP_API_BASE_URL + "/property/all", {
        startDate,
        endDate,
      });
      setPropertyData(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPropertyData();
  }, []);
  return (
    <Container maxW={{ base: "container", md: "container.xl" }}>
      <Heading mb="6">Recommended places for you</Heading>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        grabCursor={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
        className="main-content"
        pagination={{ clickable: true, horizontalClass: "pagination-kita" }}
        modules={[Pagination]}
      >
        {propertyData.map((val) => {
          return (
            <SwiperSlide>
              <PropertyCard data={val} isMobile={props.isMobile}></PropertyCard>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
}

export default MainContent;
