import React, { useState, useRef, useContext, useEffect, createContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { getSensorData } from "./dataService";
import {
  calcTAW,
  calcRootZoneDepletion,
  calcTopSoilDepletion
} from "./irrigationCalc";

import { checkHydricStress } from "./stressMonitor";

import { LineChart, BarChart } from "react-native-chart-kit";
import {
  buildLineChartData,
  buildLineChartConfig,
  chartWidth,
  chartHeight
} from "./chartBuilder";

import AnalyticsScreen from './AnalyticsScreen';
import IrrigationParamsScreen from './IrrigationParamsScreen';

const Stack = createNativeStackNavigator();
const statusBarHeight = StatusBar.currentHeight;



/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark}/>
  {/* Outros componentes }
  </View>*/

/* -------------------- Verifica Login -------------------- */
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const signIn = (email) => setUser({ name: 'Usuário Exemplo', email });
  const signOut = () => setUser(null);
  const updateProfile = (profile) => setUser((prev) => ({ ...prev, ...profile }));
  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

/* -------------------- Reutilizavel -------------------- */
function Field({ label, value, onChange, placeholder, secure = false }) {
  return (
    <View style={ui.fieldWrap}>
      {label ? <Text style={ui.fieldLabel}>{label}</Text> : null}
      <TextInput
        style={ui.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        placeholderTextColor="#6b776b"
      />
    </View>
  );
}

function AppButton({ title, onPress, icon, style }) {
  return (
    <TouchableOpacity style={[ui.button, style]} onPress={onPress} activeOpacity={0.8}>
      {icon ? <View style={ui.btnIcon}>{icon}</View> : null}
      <Text style={ui.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Header({ title, onMenuPress }) {
  return (
    <View style={ui.header}>
      <Text style={ui.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={onMenuPress} style={ui.headerIcon}>
        <Ionicons name="person-circle" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- Side Menu -------------------- */
function SideMenu({ visible, onClose, onProfile, onSignOut }) {
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const right = anim.interpolate({ inputRange: [0, 1], outputRange: [-220, 10] });

  if (!visible) return null;

  return (
    <Animated.View style={[ui.menuContainer, { right }]}>
      <View style={ui.menuCard}>
        <TouchableOpacity style={ui.menuItem} onPress={() => { onProfile(); onClose(); }}>
          <Ionicons name="person" size={20} color="#2b6e35" />
          <Text style={ui.menuText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={ui.menuItem} onPress={() => { onSignOut(); onClose(); }}>
          <MaterialCommunityIcons name="logout" size={20} color="#2b6e35" />
          <Text style={ui.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

/*function SideMenu({ visible, onClose, onProfile, onSignOut }) {
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const right = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 10]
  });

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

      // Ovberlay
      <TouchableOpacity
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.1)" }]}
        activeOpacity={1}
        onPress={onClose}
      />

      // MENU
      <Animated.View
        style={[
          ui.menuContainer,
          { right, zIndex: 9999, elevation: 20 }   // <--- IMPORTANT
        ]}
      >
        <View style={ui.menuCard}>
          <TouchableOpacity
            style={ui.menuItem}
            onPress={() => { onProfile(); onClose(); }}
          >
            <Ionicons name="person" size={20} color="#2b6e35" />
            <Text style={ui.menuText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ui.menuItem}
            onPress={() => { onSignOut(); onClose(); }}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#2b6e35" />
            <Text style={ui.menuText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

    </View>
  );
}*/

/* -------------------- LOGIN SCREEN -------------------- */
function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) return Alert.alert('Erro', 'Preencha email e senha');
    signIn(email);
    navigation.replace('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.centerColumn} keyboardShouldPersistTaps="handled">
          <View style={styles.brandBox}>
            <Ionicons name="water" size={48} color="#fff" />
            <Text style={styles.brandTitle}>Phytoflow</Text>
            <Text style={styles.brandSubtitle}>Monitoramento e Gestão de Áreas de Irrigação</Text>
          </View>

          <View style={styles.cardSmall}>
            <Field placeholder="Email" value={email} onChange={setEmail} />
            <Field placeholder="Senha" value={password} onChange={setPassword} secure />
            <AppButton title="Entrar" onPress={handleLogin} icon={<Ionicons name="log-in" size={18} color="#fff" />} />
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }}>
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- REGISTER SCREEN -------------------- */
function RegisterScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) return Alert.alert('Erro', 'Preencha nome, email e senha');
    signIn(email);
    navigation.replace('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.centerColumn} keyboardShouldPersistTaps="handled">
          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Criar Conta</Text>
            <Field label="Nome" value={name} onChange={setName} placeholder="Seu nome" />
            <Field label="Localização" value={location} onChange={setLocation} placeholder="Cidade / Estado" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="email@exemplo.com" />
            <Field label="Senha" value={password} onChange={setPassword} placeholder="••••••••" secure />

            <AppButton title="Registrar" onPress={handleRegister} />

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
              <Text style={styles.link}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- DASHBOARD -------------------- */
function DashboardScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const sampleData = [
    { id: '1', soilMoisture: '32%', airTemp: '28°C', airHumidity: '60%', cultureCoef: '0.85', sapFlow: '2.4 L/h', timestamp: '2025-10-30 14:15' },
    { id: '2', soilMoisture: '40%', airTemp: '26°C', airHumidity: '58%', cultureCoef: '0.90', sapFlow: '1.9 L/h', timestamp: '2025-10-30 15:00' },
    { id: '3', soilMoisture: '45%', airTemp: '22°C', airHumidity: '50%', cultureCoef: '0.75', sapFlow: '2.0 L/h', timestamp: '2025-11-06 16:00' },
    { id: '4', soilMoisture: '40%', airTemp: '27°C', airHumidity: '50%', cultureCoef: '0.70', sapFlow: '2.2 L/h', timestamp: '2025-11-13 15:30' }
  ];
  // Carregar dados
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 10;

  const loadData = async () => {
    try {
      const result = await getSensorData();

      // Mais recentes primeiro
      const sorted = [...result].sort(
        (a, b) => {
          const da = new Date(
            a.rawTimestamp || a.timestamp
          );

          const db = new Date(
            b.rawTimestamp || b.timestamp
          );

          return db - da;
        }
      );

      setData(sorted);
      
      setCurrentPage(0); // resetar página
    } catch (err) {
      console.log("Erro ao carregar dados:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Atualizar dados
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Paginação
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = data.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  /* Vericar Stress Hídrico */

  const handleCheckStress = () => {
    const thetaFC = 0.30;
    const thetaWP = 0.10;
    const rootDepth = 0.40; // meters
    const gravel = 0;
    const psto = 0.55; // crop parameter

    const thetaCurrent = 0.22;
    const thetaTop = 0.18;
    const thetaTopFC = 0.28;
    const depthTop = 0.15;

    const TAW = calcTAW(thetaFC, thetaWP, rootDepth, gravel);
    const Dr = calcRootZoneDepletion(thetaCurrent, thetaFC, rootDepth, gravel);
    const DZtop = calcTopSoilDepletion(thetaTop, thetaTopFC, depthTop, gravel);

    const result = checkHydricStress(Dr, DZtop, TAW, psto);

    Alert.alert(
      "Status Hídrico da Planta",
      `${result.status}\n\n${result.recommendedAction}`
    );

    alert(`Status Hídrico da Planta\n${result.status}\n${result.recommendedAction}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark}/>
      <Header
        title="Dados da Irrigação"
        onMenuPress={() => setMenuVisible(prev => !prev)}
      />

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onProfile={() => navigation.navigate('Profile')}
        onSignOut={() => { signOut(); navigation.replace('Login'); }}
      />
        <ScrollView style={styles.container}>

        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Últimas Leituras</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Area')}>
              <Text style={styles.linkSmall}>Gerenciar áreas</Text>
            </TouchableOpacity>
          </View>
          <AppButton
          title="Atualizar Dados"
          onPress={loadData}
          icon={<Ionicons name="refresh" size={18} color="#fff" />}
          />
          <FlatList
            /*/data={sampleData}*/
            data={paginatedData}
            keyExtractor={(i) => i.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitleSmall}>Leitura {item.id}</Text>
                  <Text style={styles.cardTime}>{item.timestamp}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>Umidade do Solo: <Text style={styles.badge}>{item.soilMoisture}</Text></Text>
                  <Text style={styles.cardText}>Temperatura da folha: {item.leafTemp}</Text>
                  <Text style={styles.cardText}>Pressão: {item.pressure}</Text>
                  <Text style={styles.cardText}>Temperatura do Ar: {item.airTemp}</Text>
                  <Text style={styles.cardText}>Umidade do Ar: {item.airHumidity}</Text>
                  <Text style={styles.cardText}>Fluxo de Seiva: {item.sapFlow}</Text>
                  <Text style={styles.cardText}>Ks (Estresse): {item.Ks}</Text>
                </View>
              </View>
            )}
          />
          {/* PAGINAÇÃO */}
       <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>

         <TouchableOpacity
           onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
           disabled={currentPage === 0}
           style={[
             ui.button,
             { flex: 1, marginRight: 5, opacity: currentPage === 0 ? 0.5 : 1 }
           ]}
         >
           <Text style={ui.buttonText}>Anterior</Text>
         </TouchableOpacity>

         <TouchableOpacity
           onPress={() =>
             setCurrentPage((prev) =>
               Math.min(prev + 1, totalPages - 1)
             )
           }
           disabled={currentPage >= totalPages - 1}
           style={[
             ui.button,
             { flex: 1, marginLeft: 5, opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }
           ]}
         >
           <Text style={ui.buttonText}>Próximo</Text>
         </TouchableOpacity>
       </View>

       {/*INDICADOR */}
       <Text style={{ textAlign: "center", marginTop: 5 }}>
         Página {currentPage + 1} de {totalPages || 1}
       </Text>


          <AppButton
            title="Configurar Parâmetros"
            onPress={() => navigation.navigate("IrrigationParams")}
            icon={<Ionicons name="settings" size={18} color="#fff" />}
          />
          <AppButton
              title="Verificar Estresse Hídrico"
              onPress={handleCheckStress}
              icon={<Ionicons name="water" size={18} color="#fff" />}
            />
            <AppButton
            title="Gráficos"
            onPress={() => navigation.navigate("Analytics", {
              sensorData: data,
              soilParams: {
                thetaFC: 0.30,
                thetaWP: 0.10,
                rootDepth: 0.4,
                psto: 0.55
              }
            })}
            style={{ marginTop: 6 }}
            icon={<Ionicons name="layers" size={18} color="#fff" />}
          />
          <AppButton
            title="Gerenciar Área e Cultura"
            onPress={() => navigation.navigate('Area')}
            style={{ marginTop: 6 }}
            icon={<Ionicons name="layers" size={18} color="#fff" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- PROFILE -------------------- */
function ProfileScreen() {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const save = () => {
    updateProfile({ name, email });
    Alert.alert('Sucesso', 'Perfil atualizado');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Perfil</Text>

        <View style={styles.cardSmall}>
          <Field label="Nome" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} />
          <AppButton title="Salvar" onPress={save} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- AREA + CULTURE SCREEN -------------------- */
function AreaScreen({ navigation }) {
  const [name, setName] = useState('');
  const [local, setLocal] = useState('');
  const [size, setSize] = useState('');
  const [soil, setSoil] = useState('');
  const [wiltPoint, setWiltPoint] = useState('');

  const [cropName, setCropName] = useState('');
  const [plantDate, setPlantDate] = useState('');
  const [rootDepth, setRootDepth] = useState('');

  const saveArea = () => Alert.alert('Salvo', `Área "${name}" salva`);
  const saveCrop = () => Alert.alert('Salvo', `Cultura "${cropName}" salva`);

  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark}/>

      <Header title="Áreas & Culturas" onMenuPress={() => navigation.navigate('Profile')} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <Text style={styles.sectionTitle}>Cadastrar / Editar Área</Text>

          <View style={styles.cardSmall}>
            <Field label="Nome da Área" value={name} onChange={setName} placeholder="Talhão A" />
            <Field label="Localização" value={local} onChange={setLocal} placeholder="Cidade - Estado" />
            <Field label="Tamanho" value={size} onChange={setSize} placeholder="hectares" />
            <Field label="Tipo de Solo" value={soil} onChange={setSoil} placeholder="Argiloso / Arenoso" />
            <Field label="Ponto de Murcha" value={wiltPoint} onChange={setWiltPoint} placeholder="valor" />
            <AppButton title="Salvar Área" onPress={saveArea} />
          </View>

          <Text style={styles.sectionTitle}>Cadastrar / Editar Cultura</Text>

          <View style={styles.cardSmall}>
            <Field label="Nome da Cultura" value={cropName} onChange={setCropName} placeholder="Milho" />
            <Field label="Data de Plantio" value={plantDate} onChange={setPlantDate} placeholder="AAAA-MM-DD" />
            <Field label="Profundidade da Raiz" value={rootDepth} onChange={setRootDepth} placeholder="cm" />
            <AppButton title="Salvar Cultura" onPress={saveCrop} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- APP ROOT -------------------- */
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Area" component={AreaScreen} />
          <Stack.Screen name="IrrigationParams" component={IrrigationParamsScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

/* -------------------- Styles -------------------- */
const colors = {
  primary: '#2b6e35',
  primaryDark: '#23592c',
  background: '#eef7ee',
  card: '#ffffff',
  text: '#213522',
  muted: '#6b776b',
};

const ui = StyleSheet.create({
  fieldWrap: { width: '100%', marginBottom: 12 },
  fieldLabel: { color: colors.text, fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fbfdfb',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6efe6',
    color: colors.text
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 8
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnIcon: { marginRight: 10 },

  header: {
    height: 72,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerIcon: { padding: 6 },

  menuContainer: { position: 'absolute', top: 90, width: 200, zIndex: 999 },
  menuCard: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 6, elevation: 6 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, gap: 10 },
  menuText: { fontSize: 16, color: colors.text, fontWeight: '600' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, marginTop: statusBarHeight },
  centerColumn: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },

  brandBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    width: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    marginBottom: 18
  },
  brandTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  brandSubtitle: { color: '#e6f3e6', fontSize: 14, marginTop: 4 },

  cardSmall: {
    width: '100%',
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 12,
    elevation: 6,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitleSmall: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardTime: { fontSize: 12, color: colors.muted },

  cardBody: { marginTop: 6 },
  cardText: { color: colors.text, fontSize: 14, marginBottom: 6 },
  badge: { fontWeight: '800', color: colors.primary },

  content: { padding: 16, flexGrow: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginVertical: 12, marginTop: 20},
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  link: { textAlign: 'center', color: colors.primary, fontWeight: '700' },
  linkSmall: { color: colors.primary, fontWeight: '700' },
});
