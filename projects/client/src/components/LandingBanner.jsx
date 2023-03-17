import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { Container, Flex, Image, Skeleton } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/swiperKita.css";
import banner1 from "../assets/landingBanner/banner-1.jpg";
import banner2 from "../assets/landingBanner/banner-2.jpg";
import banner3 from "../assets/landingBanner/banner-3.jpg";
import banner4 from "../assets/landingBanner/banner-4.jpg";

function LandingBanner(props) {
  const [banner, setBanner] = React.useState([banner1, banner2, banner3, banner4]);
  return (
    <Container px={0} maxW={{ base: "container", md: "100%" }}>
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
        {banner.map((banner, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Skeleton isLoaded>
                <Image
                  height="450px"
                  width="100%"
                  src={banner}
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/500"
                  alt="Landing Banner"
                />
              </Skeleton>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
}

export default LandingBanner;
