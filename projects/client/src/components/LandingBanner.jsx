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
  const [banner, setBanner] = React.useState([banner1, banner2, banner3, banner4]);
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
        {banner.map((banner, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Image
                height="388px"
                width="1248px"
                src={banner}
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/500"
                alt="Landing Banner"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
}

export default LandingBanner;
