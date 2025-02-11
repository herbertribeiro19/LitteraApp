import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

const InteressadoDetails = ({ route, navigation }) => {
  const { interessado } = route.params;
  console.log("Dados recebidos no InteressadoDetails:", interessado); // Para depuração

  const phoneNumber = interessado.phone; // Número do WhatsApp com DDD e código do país
  const message =
    "Olá, você demonstrou interesse no livro que anunciei. Podemos conversar melhor?";
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  const handleContact = () => {
    Linking.openURL(whatsappLink).catch((err) =>
      console.error("Erro ao abrir o WhatsApp:", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <View>
          <Text style={styles.textbold}>Detalhes do interessado</Text>
          <Text style={styles.textspan}>
            Veja as informações do usuário interessado no livro.
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{interessado.name}</Text>

          {/* <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{interessado.email}</Text> */}

          <Text style={styles.label}>Telefone:</Text>
          {/* <Text style={styles.value}>{interessado.phone}</Text> */}
          <Text style={styles.value}>***********</Text>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.contactButtonText}>Entrar em Contato</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3F1",
  },
  content: {
    padding: 16,
  },
  header: {
    marginTop: "24%",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  textbold: {
    color: "#631C11",
    fontSize: 26,
    fontWeight: "600",
  },
  textspan: {
    color: "#631C11",
    marginTop: "1%",
    fontSize: 12,
    fontWeight: "300",
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#631C11",
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  contactButton: {
    backgroundColor: "#631C11",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InteressadoDetails;
