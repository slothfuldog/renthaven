import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { Container, Flex, Image } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/swiperKita.css";
import banner1 from "../assets/landingBanner/banner-1.jpg";
import banner2 from "../assets/landingBanner/banner-2.jpg";
import banner3 from "../assets/landingBanner/banner-3.jpg";
import banner4 from "../assets/landingBanner/banner-4.jpg";

function LandingBanner(props) {
  return (
    <Container px={{ base: 0, lg: "16px" }} maxW={{ base: "container", md: "container.xl" }}>
      <Swiper
        navigation={false}
        spaceBetween={0}
        modules={[Navigation, Autoplay]}
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="landing-banner"
      >
        <SwiperSlide>
          <Image
            height="388px"
            width="1248px"
            src={banner1}
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/500"
            alt="Landing Banner"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            height="388px"
            width="1248px"
            src={banner2}
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/500"
            alt="Landing Banner"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            height="388px"
            width="1248px"
            src={banner3}
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/500"
            alt="Landing Banner"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            height="388px"
            width="1248px"
            src={banner4}
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/500"
            alt="Landing Banner"
          />
        </SwiperSlide>
      </Swiper>
    </Container>
  );
}

export default LandingBanner;
