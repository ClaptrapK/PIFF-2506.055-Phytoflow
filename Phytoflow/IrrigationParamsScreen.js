import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function IrrigationParamsScreen({ navigation }) {
  // Default values
  const [thetaFC, setThetaFC] = useState("0.30");
  const [thetaWP, setThetaWP] = useState("0.10");
  const [rootDepth, setRootDepth] = useState("0.40");
  const [psto, setPsto] = useState("0.55");
  const [gravel, setGravel] = useState("0");
  const [topDepth, setTopDepth] = useState("0.15");

  const handleGenerate = () => {
    navigation.navigate("Analytics", {
      soilParams: {
        thetaFC: parseFloat(thetaFC),
        thetaWP: parseFloat(thetaWP),
        rootDepth: parseFloat(rootDepth),
        psto: parseFloat(psto),
        gravel: parseFloat(gravel),
        topDepth: parseFloat(topDepth)
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Parâmetros de Irrigação</Text>

      <View style={styles.card}>

        <Text style={styles.label}>Field Capacity (θFC)</Text>
        <TextInput style={styles.input} value={thetaFC} onChangeText={setThetaFC} keyboardType="decimal-pad" />

        <Text style={styles.label}>Wilting Point (θWP)</Text>
        <TextInput style={styles.input} value={thetaWP} onChangeText={setThetaWP} keyboardType="decimal-pad" />

        <Text style={styles.label}>Profundidade da Raiz (m)</Text>
        <TextInput style={styles.input} value={rootDepth} onChangeText={setRootDepth} keyboardType="decimal-pad" />

        <Text style={styles.label}>psto (Estresse Estomatal)</Text>
        <TextInput style={styles.input} value={psto} onChangeText={setPsto} keyboardType="decimal-pad" />

        <Text style={styles.label}>Porcentagem de Cascalho (%)</Text>
        <TextInput style={styles.input} value={gravel} onChangeText={setGravel} keyboardType="decimal-pad" />

        <Text style={styles.label}>Camada Superior do Solo (m)</Text>
        <TextInput style={styles.input} value={topDepth} onChangeText={setTopDepth} keyboardType="decimal-pad" />

        <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
          <Ionicons name="analytics-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Gerar Análises</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#eef7ee" },
  title: { fontSize: 22, fontWeight: "800", color: "#2b6e35", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 4
  },
  label: { marginTop: 12, fontSize: 14, fontWeight: "600", color: "#213522" },
  input: {
    backgroundColor: "#f6fff6",
    borderWidth: 1,
    borderColor: "#d2e8d2",
    padding: 10,
    borderRadius: 8,
    marginTop: 6
  },
  btn: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#2b6e35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: 10
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" }
});
