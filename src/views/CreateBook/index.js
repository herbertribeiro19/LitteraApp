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

export default function CreateBook() {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
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
    // Verificando se todos os campos obrigatórios estão preenchidos
    if (!nome || !generoIds.length || !statusBookId || !transactionId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    // Definindo o payload a ser enviado
    const newBook = {
      nome,
      descricao,
      TypeTrasactionId: transactionId,
      GeneroIds: generoIds,
      StatusBookId: statusBookId,
      valor: null, // Inicializando com null
    };

    // Se a transação for 1 ou 2, inclui o valor informado
    if (transactionId === "1" || transactionId === "2") {
      newBook.valor = valor ? valor : null; // Se valor estiver presente, usa ele; caso contrário, coloca null
    }

    try {
      // Pegando o token do AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // Chamando a função createBook para enviar os dados
      await createBook(newBook);

      // Exibindo mensagem de sucesso e navegando de volta
      Alert.alert("Sucesso", "Livro criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      // Tratando erro
      console.log("Erro ao criar livro:", error);
      Alert.alert("Erro", "Não foi possível criar o livro.");
    }
  };

  return (
    <LinearGradient
      colors={["#E4D5D2", "#F5F3F1", "#F5F3F1"]}
      style={styles.container}
    >
      <View style={styles.boxmain}>
        <Text style={styles.textbold}>Criar Publicação</Text>
        <Text style={styles.textspan}>
          Preencha as informações do item que deseja vender, trocar ou doar.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.boxListForm, { flexGrow: 1 }]} // Garante que o conteúdo da ScrollView tenha espaço para rolar
        scrollToOverflowEnabled={true}
      >
        <View>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor={"#631C11"}
            placeholder="Nome do livro"
          />

          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
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
              !isFocusGeneros ? "Selecione um ou mais gêneros" : "..."
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
        </View>
        <View style={styles.content}>
          <TouchableOpacity style={styles.btnSave} onPress={handleCreateBook}>
            <Text style={styles.textbtnSave}>Criar publicação</Text>
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
    // flex: 1,
    marginBottom: "50%",
    paddingBottom: 50, // Garante que o botão de cancelar tenha espaço para não ser cortado
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
    marginTop: "10%",
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
