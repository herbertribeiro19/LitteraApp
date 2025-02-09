import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getNotification } from "../../services/api/notification";
import { ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function Notification() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await getNotification();
      setNotifications(response.notifications); // Atualiza o estado com as notificações
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#631C11" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#631C11" />
        </TouchableOpacity>
        <View>
          <Text style={styles.textbold}>Notificações</Text>
          <Text style={styles.textspan}>
            Veja as principais notificações recebidas.
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma notificação encontrada.</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.notificationItem}
                onPress={() =>
                  navigation.navigate("InteressadoDetails", {
                    interessado: item.InterestedUser,
                  })
                }
              >
                <Text style={styles.notificationTitle}>
                  Novo interessado(a)!
                </Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    height: "100%",
    paddingBottom: "46%",
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
  notificationItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#631C11",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 16,
    color: "#631C11",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
