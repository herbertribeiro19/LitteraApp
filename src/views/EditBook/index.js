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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MultiSelect } from "react-native-element-dropdown";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LibraryBig, ChevronLeft } from "lucide-react-native";
import { getGenero } from "../../services/api/genero";
import { getStatusBook } from "../../services/api/statusbook";
import { getTransactions } from "../../services/api/transactions.js";
import { getBookId, updateBookId } from "../../services/api/book.js";
import { createImage } from "../../services/api/createImage.js";
import * as ImagePicker from "expo-image-picker";

export default function EditBook() {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;

  const [images, setImages] = useState([]); // Lista de imagens URI
  const [imagesBase64, setImagesBase64] = useState([]); // Lista de imagens Base64
  const [removedImages, setRemovedImages] = useState([]); // Lista de imagens removidas
  const [nome, setNome] = useState(book.nome);
  const [description, setDescription] = useState(book.description);
  const [cidade, setCidade] = useState(book.cidade);
  const [generos, setGeneros] = useState([]);
  const [generoIds, setGeneroIds] = useState(
    book.Generos?.map((g) => g.id.toString()) || [] // Verifique se book.Generos existe
  );
  const [statusBooks, setStatusBooks] = useState([]);
  const [statusBookId, setStatusBookId] = useState(
    book.StatusBookId?.toString() || ""
  );
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState(
    book.TypeTransactionId?.toString() || ""
  );
  const [value, setValue] = useState(book.value ? book.value.toString() : "");
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

  useEffect(() => {
    // Carregar as imagens associadas ao livro
    const fetchBookData = async () => {
      try {
        const bookData = await getBookId(book.id);
        // Verifica se a resposta da API contém o campo 'imagens' e carrega no estado
        if (bookData?.book?.imagens) {
          setImages(bookData.book.imagens); // Carregar as imagens associadas ao livro
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as imagens do livro.");
      }
    };

    fetchBookData();
  }, [book.id]);

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

  const removeImage = (index) => {
    const imageToRemove = images[index]; // Identificar qual imagem foi removida
    setRemovedImages((prev) => [...prev, imageToRemove]); // Adiciona a imagem removida na lista de removidas

    const newImages = images.filter((_, i) => i !== index);
    const newImagesBase64 = imagesBase64.filter((_, i) => i !== index);

    setImages(newImages);
    setImagesBase64(newImagesBase64);
  };

  const handleUpdateBook = async () => {
    if (!nome || !generoIds.length || !statusBookId || !transactionId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true); // Ativa o loading

    const formattedValor = value !== "" ? Number(value) : null;

    const updatedBook = {
      nome,
      description,
      TypeTransactionId: Number(transactionId),
      generos: generoIds.map(Number),
      StatusBookId: Number(statusBookId),
      value: formattedValor,
      cidade,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // Atualizar o livro sem as imagens removidas
      await updateBookId(book.id, updatedBook);

      // Enviar as imagens removidas para a API para excluí-las
      if (removedImages.length > 0) {
        // Se necessário, enviar um endpoint para deletar imagens no servidor
        console.log("Imagens removidas", removedImages);
        // Excluir imagens removidas no servidor se necessário (depende da API)
      }

      // Enviar as imagens novas
      if (imagesBase64.length > 0) {
        const newImagePayload = {
          imagens: imagesBase64.map((base64, index) => ({
            fileName: `imagem_${index + 1}.jpg`,
            fileContent: base64,
            fileType: "image/jpeg",
            BookId: book.id,
          })),
        };

        await createImage(newImagePayload);
      }

      setIsLoading(false); // Desativa o loading

      navigation.navigate("DetailsBook", { book: { ...book, ...updatedBook } }); // Redireciona para a página de detalhes com os dados atualizados
    } catch (error) {
      setIsLoading(false); // Desativa o loading em caso de erro
      Alert.alert(
        "Erro",
        `Não foi possível atualizar o livro: ${error.message}`
      );
    }
  };

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
          <Text style={styles.textbold}>Editar anúncio</Text>
          <Text style={styles.textspan}>
            Edite as informações do anúncio e salve quando finalizar
          </Text>
        </View>
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

        <TextInput
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
          placeholderTextColor={"#631C11"}
          placeholder="Está em qual cidade?"
        />

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

        {(transactionId === "1" || transactionId === "2") && (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setValue(numericValue);
            }}
            placeholder="Valor do livro"
            keyboardType="numeric"
          />
        )}
        <View style={styles.content}>
          <TouchableOpacity style={styles.btnSave} onPress={handleUpdateBook}>
            <Text style={styles.textbtnSave}>Salvar Alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textbtnCancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent={true} visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#631C11" />
            <Text style={styles.modalText}>Atualizando anúncio...</Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
