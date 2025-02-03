import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const banners = [
  { id: "1", image: require("../../assets/banner01.png") },
  { id: "2", image: require("../../assets/banner02.png") },
];

const BannerCarousel = () => {
  return (
    <View style={styles.carouselContainer}>
      <Swiper
        autoplay={true}
        loop={true}
        dotColor="red"
        autoplayTimeout={4}
        activeDotColor="#F5F3F1"
      >
        {banners.map((banner) => (
          <View key={banner.id} style={styles.bannerContainer}>
            <Image source={banner.image} style={styles.bannerImage} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: "370",
    height: 173,
    marginBottom: 10,
    alignContent: "center",
    alignSelf: "center",
    boxShadow: "0 2 10 gray",
    borderRadius: 20,
  },
  bannerContainer: {
    width: "370",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  bannerImage: {
    width: "370",
    resizeMode: "cover",
  },
});

export default BannerCarousel;
