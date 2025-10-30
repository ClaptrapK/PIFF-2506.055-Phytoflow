// App.js (JavaScript version completo: menu do lado direito, ícone real, animação básica, cards grandes, perfil e logout, menu acima dos cards, título afastado)
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Animated, Easing } from "react-native";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
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
      {/* Profile Icon */}
      <TouchableOpacity style={styles.profileIconRight} onPress={toggleMenu}>
        <Ionicons name="person-circle" size={36} color="#4c8c4a" />
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

      {/* Título afastado do topo */}
      <Text style={styles.titleDashboard}>Dados da Irrigação</Text>

      <FlatList
        contentContainerStyle={{ alignItems: "center", paddingTop: 20 }}
        data={sensorData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bigCard}>
            <Text>Umidade do Solo: {item.soilMoisture}</Text>
            <Text>Temperatura do Ar: {item.airTemp}</Text>
            <Text>Umidade Relativa do Ar: {item.airHumidity}</Text>
            <Text>Coeficiente Cultural: {item.cultureCoef}</Text>
            <Text>Fluxo de Seiva: {item.sapFlow}</Text>
            <Text>Horário: {item.timestamp}</Text>
          </View>
        )}
      />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#eef7ee" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 25, color: "#2b6e35" },
  titleDashboard: { fontSize: 28, fontWeight: "bold", marginTop: 80, marginBottom: 20, color: "#2b6e35" },
  input: { width: "100%", height: 50, backgroundColor: "#fff", marginBottom: 12, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#88b090" },
  button: { width: "100%", height: 50, backgroundColor: "#2b6e35", justifyContent: "center", alignItems: "center", borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { color: "#1a73e8", marginTop: 15, fontWeight: "bold" },
  bigCard: { width: "95%", backgroundColor: "#fff", padding: 30, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: "#c8dbc8", elevation: 6, zIndex: 1 },
  profileIconRight: { position: "absolute", top: 40, right: 20, zIndex: 20 },
  sideMenuRight: { position: "absolute", top: 90, width: 180, backgroundColor: "white", borderLeftWidth: 2, borderColor: "#4c8c4a", paddingVertical: 10, elevation: 10 },
  menuItem: { padding: 12, borderBottomWidth: 1, borderColor: "#c8dbc8" },
  menuText: { fontSize: 18, fontWeight: "600", color: "#2b6e35" },
  menuButton: { backgroundColor: "#4c8c4a", padding: 10, borderRadius: 8, marginTop: 15 }
});
