import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
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

  const [images, setImages] = useState([]); // Lista de imagens URI
  const [imagesBase64, setImagesBase64] = useState([]); // Lista de imagens Base64

  const [nome, setNome] = useState("");
  const [description, setDescription] = useState("");
  const [generos, setGeneros] = useState([]);
  const [generoIds, setGeneroIds] = useState([]);
  const [statusBooks, setStatusBooks] = useState([]);
  const [statusBookId, setStatusBookId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [value, setValue] = useState("");
  const [isFocusGeneros, setIsFocusGeneros] = useState(false);
  const [isFocusStatusBook, setIsFocusStatusBook] = useState(false);
  const [isFocusTransaction, setIsFocusTransaction] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

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
        allowsMultipleSelection: true, // Permite múltiplas imagens
      });
    }

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      const newImagesBase64 = result.assets.map((asset) => asset.base64);

      setImages((prev) => [...prev, ...newImages]);
      setImagesBase64((prev) => [...prev, ...newImagesBase64]);
    }
  };

  // Função para remover uma imagem
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImagesBase64 = imagesBase64.filter((_, i) => i !== index);

    setImages(newImages);
    setImagesBase64(newImagesBase64);
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

    setIsLoading(true); // Ativa o loading

    const formattedValor = value !== "" ? Number(value) : null;

    const newBook = {
      nome,
      description,
      TypeTransactionId: Number(transactionId),
      generos: generoIds.map(Number),
      StatusBookId: Number(statusBookId),
      value: formattedValor,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const bookResponse = await createBook(newBook);
      const bookId = bookResponse?.book?.id;

      if (!bookId || typeof bookId !== "number") {
        throw new Error("Erro ao obter o ID do livro.");
      }

      if (imagesBase64.length > 0) {
        const newImagePayload = {
          imagens: imagesBase64.map((base64, index) => ({
            fileName: `imagem_${index + 1}.jpg`,
            fileContent: base64,
            fileType: "image/jpeg",
            BookId: bookId,
          })),
        };

        await createImage(newImagePayload);
      }

      // Resetar os campos
      setNome("");
      setDescription("");
      setGeneroIds([]);
      setStatusBookId("");
      setTransactionId("");
      setValue(null);
      setImages([]);
      setImagesBase64([]);

      setIsLoading(false); // Desativa o loading

      navigation.navigate("Home"); // Redireciona para a Home principal
    } catch (error) {
      setIsLoading(false); // Desativa o loading em caso de erro
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
          Preencha as informações do livro que deseja vender, trocar ou doar.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.boxListForm, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.iconButtonText}>Imagem do livro</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageContainer}
        >
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <AntDesign name="delete" size={20} color="#631C11" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Botões para adicionar imagens */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => pickImage(false)}
          >
            <AntDesign name="picture" size={24} color="#631C11" />
            <Text style={styles.iconButtonText}>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => pickImage(true)}
          >
            <AntDesign name="camera" size={24} color="#631C11" />
            <Text style={styles.iconButtonText}>Câmera</Text>
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
            value={value}
            onChangeText={(text) => {
              // Permite apenas números
              const numericValue = text.replace(/[^0-9]/g, ""); // Remove tudo que não for número
              setValue(numericValue); // Atualiza o valor apenas com números
            }}
            placeholder="Valor do livro"
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

      {/* Modal de Loading */}
      <Modal transparent={true} visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#631C11" />
            <Text style={styles.modalText}>Criando anúncio...</Text>
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    paddingTop: 4,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 14,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 14,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  iconButton: {
    alignItems: "center",
    // backgroundColor: "#F5F3F1",
    padding: 8,
    borderRadius: 10,
    width: "45%",
    borderWidth: 0.6,
    borderColor: "#631C11",
  },
  iconButtonText: {
    marginTop: 5,
    color: "#631C11",
    fontSize: 14,
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
    marginTop: "4%",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 200,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: "#631C11",
  },
});
