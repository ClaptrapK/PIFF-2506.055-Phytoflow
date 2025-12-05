import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { soilPresets, cropPresets } from "./irrigationPresets";
import { saveCustomPreset, loadCustomPresets, deletePreset } from "./presetStorage";
import { irrigationRecommendation } from "./irrigationRecommendation";

export default function IrrigationParamsScreen({ navigation }) {
  // Input values
  const [thetaFC, setThetaFC] = useState("0.30");
  const [thetaWP, setThetaWP] = useState("0.10");
  const [rootDepth, setRootDepth] = useState("0.40");
  const [psto, setPsto] = useState("0.55");
  const [gravel, setGravel] = useState("0");
  const [topDepth, setTopDepth] = useState("0.15");

  // Custom preset creation field
  const [customName, setCustomName] = useState("");

  // Loaded custom presets
  const [customSoilPresets, setCustomSoilPresets] = useState([]);
  const [customCropPresets, setCustomCropPresets] = useState([]);

  useEffect(() => {
    loadAllPresets();
  }, []);

  const loadAllPresets = async () => {
    const { soil, crop } = await loadCustomPresets();
    setCustomSoilPresets(soil);
    setCustomCropPresets(crop);
  };

  // Aplicar Presets
  const applySoilPreset = (p) => {
    setThetaFC(String(p.thetaFC));
    setThetaWP(String(p.thetaWP));
    setRootDepth(String(p.rootDepth));
    setPsto(String(p.psto));
    setGravel(String(p.gravel));
    setTopDepth(String(p.topDepth));
  };

  const applyCropPreset = (p) => {
    if (p.rootDepth) setRootDepth(String(p.rootDepth));
    if (p.psto) setPsto(String(p.psto));
  };

  // Salvar custom preset
  const savePreset = async (type) => {
    if (!customName.trim()) return Alert.alert("Nome inválido");

    const preset = {
      name: customName.trim(),
      thetaFC: parseFloat(thetaFC),
      thetaWP: parseFloat(thetaWP),
      rootDepth: parseFloat(rootDepth),
      psto: parseFloat(psto),
      gravel: parseFloat(gravel),
      topDepth: parseFloat(topDepth)
    };

    await saveCustomPreset(type, preset);
    setCustomName("");
    await loadAllPresets();
  };

  const removePreset = async (type, name) => {
    await deletePreset(type, name);
    await loadAllPresets();
  };

  // Generate analytics + irrigation recommendation
  const handleGenerate = () => {
    const soilParams = {
      thetaFC: parseFloat(thetaFC),
      thetaWP: parseFloat(thetaWP),
      rootDepth: parseFloat(rootDepth),
      psto: parseFloat(psto),
      gravel: parseFloat(gravel),
      topDepth: parseFloat(topDepth)
    };

    const recommendation = irrigationRecommendation(soilParams);

    navigation.navigate("Analytics", {
      soilParams,
      recommendation
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Parâmetros de Irrigação</Text>

      {/* Presets de Solo */}
      <Text style={styles.subtitle}>Presets de Solo</Text>
      <View style={styles.row}>
        {Object.keys(soilPresets).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.presetBtn}
            onPress={() => applySoilPreset(soilPresets[key])}
          >
            <Text style={styles.presetText}>{key}</Text>
          </TouchableOpacity>
        ))}
        {customSoilPresets.map((p) => (
          <View key={p.name} style={styles.customPresetItem}>
            <TouchableOpacity style={styles.presetBtn} onPress={() => applySoilPreset(p)}>
              <Text style={styles.presetText}>{p.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removePreset("soil", p.name)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Presets de Safra */}
      <Text style={styles.subtitle}>Presets de Cultura</Text>
      <View style={styles.row}>
        {Object.keys(cropPresets).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.presetBtn}
            onPress={() => applyCropPreset(cropPresets[key])}
          >
            <Text style={styles.presetText}>{key}</Text>
          </TouchableOpacity>
        ))}

        {customCropPresets.map((p) => (
          <View key={p.name} style={styles.customPresetItem}>
            <TouchableOpacity style={styles.presetBtn} onPress={() => applyCropPreset(p)}>
              <Text style={styles.presetText}>{p.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removePreset("crop", p.name)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Salvar custom preset */}
      <Text style={styles.subtitle}>Salvar Preset Personalizado</Text>
      <TextInput
        placeholder="Nome do preset"
        value={customName}
        onChangeText={setCustomName}
        style={styles.input}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => savePreset("soil")}>
          <Text style={styles.saveText}>Salvar Solo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={() => savePreset("crop")}>
          <Text style={styles.saveText}>Salvar Cultura</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.card}>
        <Text style={styles.label}>Field Capacity (θFC)</Text>
        <TextInput style={styles.input} value={thetaFC} onChangeText={setThetaFC} keyboardType="decimal-pad" />

        <Text style={styles.label}>Wilting Point (θWP)</Text>
        <TextInput style={styles.input} value={thetaWP} onChangeText={setThetaWP} keyboardType="decimal-pad" />

        <Text style={styles.label}>Profundidade da Raiz (m)</Text>
        <TextInput style={styles.input} value={rootDepth} onChangeText={setRootDepth} keyboardType="decimal-pad" />

        <Text style={styles.label}>psto</Text>
        <TextInput style={styles.input} value={psto} onChangeText={setPsto} keyboardType="decimal-pad" />

        <Text style={styles.label}>Porcentagem de Cascalho (%)</Text>
        <TextInput style={styles.input} value={gravel} onChangeText={setGravel} keyboardType="decimal-pad" />

        <Text style={styles.label}>Camada Superior (m)</Text>
        <TextInput style={styles.input} value={topDepth} onChangeText={setTopDepth} keyboardType="decimal-pad" />

        <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
          <Ionicons name="analytics" size={20} color="#fff" />
          <Text style={styles.btnText}>Gerar Análises</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#eef7ee" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#2b6e35" },
  subtitle: { fontSize: 17, fontWeight: "700", marginTop: 16, color: "#213522" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  presetBtn: {
    backgroundColor: "#e5f8e5",
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8
  },
  presetText: { color: "#2b6e35", fontWeight: "700" },
  customPresetItem: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginTop: 16 },
  label: { fontSize: 14, marginTop: 10, fontWeight: "600", color: "#213522" },
  input: {
    backgroundColor: "#f0fff0",
    borderWidth: 1,
    borderColor: "#a3d8a3",
    borderRadius: 8,
    padding: 10,
    marginTop: 5
  },
  btn: {
    backgroundColor: "#2b6e35",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  saveBtn: {
    backgroundColor: "#c8eac8",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10
  },
  saveText: { fontWeight: "700", color: "#2b6e35" }
});
