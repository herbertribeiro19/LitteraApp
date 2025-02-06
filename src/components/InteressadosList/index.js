import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Eye } from "lucide-react-native";

const InteressadosList = ({ interessados, onPressInteressado }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interessados no Livro</Text>
      {interessados.map((interessado, index) => (
        <TouchableOpacity
          key={index}
          style={styles.interessadoContainer}
          onPress={() => onPressInteressado(interessado)}
        >
          <View>
            <Text style={styles.interessadoNome}>{interessado.user.name}</Text>
            <Text style={styles.interessadoInfo}>{interessado.user.email}</Text>
            <Text style={styles.interessadoInfo}>{interessado.user.phone}</Text>
          </View>
          <View style={styles.icon}>
            <Eye size={24} color="#631C11" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     marginTop: 20,
  //   },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#631C11",
    marginBottom: 10,
  },
  interessadoContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  icon: {
    alignSelf: "center",
    marginRight: 20,
  },
  interessadoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#631C11",
  },
  interessadoInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});

export default InteressadosList;
