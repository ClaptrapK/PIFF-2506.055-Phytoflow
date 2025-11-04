
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Animated, Easing, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [local, setLocal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Localização" value={local} onChangeText={setLocal} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  const [name, setName] = useState("Usuário Exemplo");
  const [email, setEmail] = useState("usuario@email.com");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <TouchableOpacity style={styles.button} onPress={() => alert("Dados atualizados")}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
        <Text style={styles.menuText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

function DashboardScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    if(menuVisible){
      Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: false }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 180, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: false }).start();
    }
    setMenuVisible(!menuVisible);
  };

  const sensorData = [{ id: "1", soilMoisture: "32%", airTemp: "28°C", airHumidity: "60%", cultureCoef: "0.85", sapFlow: "2.4 L/h", timestamp: "2025-10-30 14:15" }];

  return (
    <View style={styles.containerCenter}>
      {/* Icone Perfil */}
      <TouchableOpacity style={styles.profileIconRight} onPress={toggleMenu}>
        <Ionicons name="person-circle" size={40} color="#4c8c4a" />
      </TouchableOpacity>

      {/* Side Menu acima dos cards */}
      <Animated.View style={[styles.sideMenuRight, { right: slideAnim.interpolate({ inputRange: [0, 180], outputRange: [-180, 0] }), zIndex: 10 }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate("Profile"); }}>
          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Título */}
      <Text style={styles.titleDashboard}>Dados da Irrigação</Text>

      <FlatList
        contentContainerStyle={{ alignItems: "center", paddingTop: 20 }}
        data={sensorData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.infoCard}>
            <Text>Umidade do Solo: {item.soilMoisture}</Text>
            <Text>Temperatura do Ar: {item.airTemp}</Text>
            <Text>Umidade Relativa do Ar: {item.airHumidity}</Text>
            <Text>Coeficiente Cultural: {item.cultureCoef}</Text>
            <Text>Fluxo de Seivas: {item.sapFlow}</Text>
            <Text>Horário: {item.timestamp}</Text>
          </View>
        )}
      />
      /* Botão Registrar area */
      <TouchableOpacity style={styles.regabutton} onPress={() => navigation.navigate("Area")}>
        <Text style={styles.buttonText}>Gerenciar Area e Cultura</Text>
      </TouchableOpacity>
    </View>
  );
}
function AreaScreen({ navigation }) {
  /* Area */
  const [name, setName] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [solo, setSolo] = useState("");
  const [campo, setCampo] = useState("");
  const [murcha, setMurcha] = useState("");

  /* Cultura */
  const [namec, setNameC] = useState("");
  const [data, setData] = useState("");
  const [profund, setProfund] = useState("");
  return (
    <ScrollView style={styles.containerScroll}>
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Area</Text>
      <Text style={styles.title2}>Areas Cadastradas</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Localização" value={localizacao} onChangeText={setLocalizacao} />
      <TextInput style={styles.input} placeholder="Tamanho" value={tamanho} onChangeText={setTamanho} />
      <TextInput style={styles.input} placeholder="Tipo de Solo" value={solo} onChangeText={setSolo} />
      <TextInput style={styles.input} placeholder="Ponto de Murcha Permanente" value={murcha} onChangeText={setMurcha} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EditArea")}>
        <Text style={styles.buttonText}>Editar Area</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RegisterArea")}>
        <Text style={styles.buttonText}>Cadastrar Area</Text>
      </TouchableOpacity>
      <Text style={styles.title2}>Culturas Cadastradas</Text>
      <TextInput style={styles.input} placeholder="Nome" value={namec} onChangeText={setNameC} />
      <TextInput style={styles.input} placeholder="Data de Plantio" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Profundidade Efetiva Raiz" value={profund} onChangeText={setProfund} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EditCultura")}>
        <Text style={styles.buttonText}>Editar Cultura</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RegisterCultura")}>
        <Text style={styles.buttonText}>Cadastrar Cultura</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

/* Registrar Area */
function RegisterAreaScreen({ navigation }) {
  const [name, setName] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [solo, setSolo] = useState("");
  const [campo, setCampo] = useState("");
  const [murcha, setMurcha] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Cadastro de Area</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Localização" value={localizacao} onChangeText={setLocalizacao} />
      <TextInput style={styles.input} placeholder="Tamanho" value={tamanho} onChangeText={setTamanho} />
      <TextInput style={styles.input} placeholder="Tipo de Solo" value={solo} onChangeText={setSolo} />
      <TextInput style={styles.input} placeholder="Ponto de Murcha Permanente" value={murcha} onChangeText={setMurcha} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
/* Editar Area */
function EditAreaScreen({ navigation }) {
  const [name, setName] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [solo, setSolo] = useState("");
  const [campo, setCampo] = useState("");
  const [murcha, setMurcha] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Editar Area</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Localização" value={localizacao} onChangeText={setLocalizacao} />
      <TextInput style={styles.input} placeholder="Tamanho" value={tamanho} onChangeText={setTamanho} />
      <TextInput style={styles.input} placeholder="Tipo de Solo" value={solo} onChangeText={setSolo} />
      <TextInput style={styles.input} placeholder="Ponto de Murcha Permanente" value={murcha} onChangeText={setMurcha} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
/* Registrar Cultura */
function RegisterCulturaScreen({ navigation }) {
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [profund, setProfund] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Cadastrar Cultura</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Data de Plantio" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Profundidade Efetiva Raiz" value={profund} onChangeText={setProfund} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
/* Editar Cultura */
function EditCulturaScreen({ navigation }) {
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [profund, setProfund] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Editar Cultura</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Data de Plantio" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Profundidade Efetiva Raiz" value={profund} onChangeText={setProfund} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Area" component={AreaScreen} />
        <Stack.Screen name="RegisterArea" component={RegisterAreaScreen} />
        <Stack.Screen name="EditArea" component={EditAreaScreen} />
        <Stack.Screen name="RegisterCultura" component={RegisterCulturaScreen} />
        <Stack.Screen name="EditCultura" component={EditCulturaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#eef7ee"},
  containerScroll: {marginTop: 30, marginBottom: 45},
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 25, color: "#2b6e35" },
  title2: { fontSize: 20, fontWeight: "bold", marginBottom: 25, color: "#2b6e35" },
  titleDashboard: { fontSize: 28, fontWeight: "bold", marginTop: 35, marginBottom: 20, color: "#2b6e35" },
  input: { width: "100%", height: 50, backgroundColor: "#fff", marginBottom: 12, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#88b090" },
  button: { width: "100%", height: 50, backgroundColor: "#2b6e35", justifyContent: "center", alignItems: "center", borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { color: "#1a73e8", marginTop: 15, fontWeight: "bold" },
  infoCard: { width: "95%", backgroundColor: "#fff", padding: 30, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: "#c8dbc8", elevation: 6, zIndex: 1 },
  profileIconRight: { position: "absolute", top: 55, right: 20, zIndex: 20 },
  sideMenuRight: { position: "absolute", top: 105, width: 180, backgroundColor: "white", borderLeftWidth: 2, borderColor: "#4c8c4a", paddingVertical: 10, elevation: 10 },
  menuItem: { padding: 12, borderBottomWidth: 1, borderColor: "#c8dbc8" },
  menuText: { fontSize: 18, fontWeight: "600", color: "#2b6e35" },
  menuButton: { backgroundColor: "#4c8c4a", padding: 10, borderRadius: 8, marginTop: 15 },
  regabutton: { width: "100%", height: 50, backgroundColor: "#2b6e35", justifyContent: "center", alignItems: "center", borderRadius: 10, bottom: 50 }
});
