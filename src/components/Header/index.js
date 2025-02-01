import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Hi, Herbert</Text>
      <TouchableOpacity style={styles.buttonCircle}>
        <AntDesign name="user" size={30} color="#631C11" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginTop: "14%",
    width: "96%",
    height: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    flexDirection: "row",
  },
  name: {
    fontSize: 24,
    color: "#631C11",
  },
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
