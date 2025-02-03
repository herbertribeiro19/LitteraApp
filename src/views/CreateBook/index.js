import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MultiSelect } from "react-native-element-dropdown";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LibraryBig } from "lucide-react-native";
import { getGenero } from "../../services/api/genero";
import { getStatusBook } from "../../services/api/statusbook";
import { getTransactions } from "../../services/api/transactions.js";
import { createBook } from "../../services/api/createBook";
import { createImage } from "../../services/api/createImage.js";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

export default function CreateBook() {
  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const [nome, setNome] = useState("");
  const [description, setDescription] = useState("");
  const [generos, setGeneros] = useState([]);
  const [generoIds, setGeneroIds] = useState([]);
  const [statusBooks, setStatusBooks] = useState([]);
  const [statusBookId, setStatusBookId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [valor, setValor] = useState("");
  const [isFocusGeneros, setIsFocusGeneros] = useState(false);
  const [isFocusStatusBook, setIsFocusStatusBook] = useState(false);
  const [isFocusTransaction, setIsFocusTransaction] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const pickImage = async (fromCamera = false) => {
    if (fromCamera && hasCameraPermission === false) {
      Alert.alert(
        "Permissão Negada",
        "Conceda acesso à câmera nas configurações."
      );
      return;
    }

    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const fetchedGenres = await getGenero();
        setGeneros(
          fetchedGenres.genero.map((genero) => ({
            label: genero.name,
            value: genero.id.toString(),
          }))
        );
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os gêneros.");
      }
    };

    const fetchStatusBooks = async () => {
      try {
        const fetchedStatusBooks = await getStatusBook();
        setStatusBooks(
          fetchedStatusBooks.statusBook.map((status) => ({
            label: status.name,
            value: status.id.toString(),
          }))
        );
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os status do livro.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(
          fetchedTransactions.typeTransaction.map((transaction) => ({
            label: transaction.name,
            value: transaction.id.toString(),
          }))
        );
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os tipos de transação.");
      }
    };

    fetchGeneros();
    fetchStatusBooks();
    fetchTransactions();
  }, []);

  const handleCreateBook = async () => {
    if (!nome || !generoIds.length || !statusBookId || !transactionId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    const newBook = {
      nome,
      description,
      TypeTransactionId: Number(transactionId),
      generos: generoIds.map(Number),
      StatusBookId: Number(statusBookId),
      valor: valor !== null ? Number(valor) : null,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // Primeiro cria o livro e obtém o BookId
      const bookResponse = await createBook(newBook);
      console.log("Resposta da API:", bookResponse); // Log para depuração

      const bookId = bookResponse?.book?.id; // Ajustado para acessar corretamente o ID

      if (!bookId || typeof bookId !== "number") {
        console.error("ID inválido recebido:", bookResponse);
        throw new Error("Erro ao obter o ID do livro.");
      }

      Alert.alert("Sucesso", "Livro criado com sucesso!");

      // Agora, se houver uma imagem, envia associada ao BookId
      if (imageBase64) {
        const newImage = {
          fileName: "capa_livro.jpg",
          fileContent: imageBase64,
          fileType: "image/jpeg",
          BookId: bookId, // Associando ao livro recém-criado
        };

        // console.log("BASE 64 CODE IMAGE: ", imageBase64);

        try {
          await createImage(newImage);
          Alert.alert("Sucesso", "Imagem adicionada com sucesso!");
        } catch (error) {
          console.log("Erro ao subir Imagem:", error);
          Alert.alert("Erro", "Não foi possível subir a imagem.");
        }
      }

      // Resetar os campos do formulário
      setNome("");
      setDescription("");
      setGeneroIds([]);
      setStatusBookId("");
      setTransactionId("");
      setValor("");
      setImage(null);
      setImageBase64("");

      navigation.goBack();
    } catch (error) {
      console.log("Erro ao criar livro:", error);
      Alert.alert("Erro", `Não foi possível criar o livro: ${error.message}`);
    }
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.boxmain}>
        <Text style={styles.textbold}>Criar Anúncio</Text>
        <Text style={styles.textspan}>
          Preencha as informações do item que deseja vender, trocar ou doar.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.boxListForm, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 150, height: 150, borderRadius: 10 }}
            />
          )}

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(false)}
          >
            <Text style={styles.uploadButtonText}>Selecionar imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(true)}
          >
            <Text style={styles.uploadButtonText}>Tirar foto</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholderTextColor={"#631C11"}
          placeholder="Nome do livro"
        />

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={"#631C11"}
          placeholder="Descrição do livro"
        />

        {/* Dropdown para seleção de Gênero */}
        <MultiSelect
          style={[
            styles.dropdown,
            isFocusGeneros && { borderColor: "#631C11" },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={generos}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={
            !isFocusGeneros ? "Selecione um ou mais gêneros" : "Selecionando..."
          }
          searchPlaceholder="Buscar..."
          value={generoIds}
          onFocus={() => setIsFocusGeneros(true)}
          onBlur={() => setIsFocusGeneros(false)}
          onChange={(item) => {
            setGeneroIds(item);
            setIsFocusGeneros(false);
          }}
          renderLeftIcon={() => (
            <LibraryBig
              style={styles.icon}
              color={isFocusGeneros ? "#631C11" : "#631C11"}
              name="Books"
              size={20}
            />
          )}
        />

        {/* Dropdown para seleção de Status do Livro */}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={statusBooks}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Selecione o Status do Livro"
          value={statusBookId}
          onChange={(item) => {
            setStatusBookId(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="#631C11"
              name="book"
              size={20}
            />
          )}
        />

        {/* Dropdown para seleção de Tipo de Transação */}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={transactions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Selecione o Tipo de Transação"
          value={transactionId}
          onChange={(item) => {
            setTransactionId(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="#631C11"
              name="swap"
              size={20}
            />
          )}
        />

        {/* Exibir campo de valor apenas para 'Troca' ou 'Venda' */}
        {(transactionId === "1" || transactionId === "2") && (
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={(text) => {
              // Permite apenas números
              const numericValue = text.replace(/[^0-9]/g, ""); // Remove tudo que não for número
              setValor(numericValue); // Atualiza o valor apenas com números
            }}
            placeholder="Valor"
            keyboardType="numeric"
          />
        )}
        <View style={styles.content}>
          <TouchableOpacity style={styles.btnSave} onPress={handleCreateBook}>
            <Text style={styles.textbtnSave}>Criar Anúncio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textbtnCancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   gap: "6%",
  // },
  boxmain: { marginTop: "24%", marginBottom: "4%", marginHorizontal: "8%" },
  textbold: { color: "#631C11", fontSize: 26, fontWeight: "600" },
  textspan: {
    color: "#631C11",
    marginTop: "1%",
    fontSize: 10,
    fontWeight: "300",
  },
  boxListForm: {
    marginHorizontal: "7%",
    paddingBottom: "50%",
  },
  uploadButton: {
    backgroundColor: "#631C11",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#631C11",
    fontSize: 16,
    borderRadius: 6,
    padding: 16,
    marginBottom: 10,
    color: "#631C11",
  },
  dropdown: {
    borderBottomWidth: 2,
    borderBottomColor: "#631C11",
    padding: 12,
    marginBottom: 10,
    zIndex: 1,
    borderRadius: 6,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  content: {
    marginBottom: "10%",
  },
  btnSave: {
    backgroundColor: "#631C11",
    width: "87%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  textbtnSave: {
    color: "#F5F3F1",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  btnCancel: {
    backgroundColor: "#F5F3F1",
    borderColor: "#631C11",
    borderWidth: 0.5,
    width: "87%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 14,
  },
  textbtnCancel: {
    color: "#631C11",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "500",
  },
});
