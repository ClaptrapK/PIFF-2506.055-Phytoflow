import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";

const ESP32_IP = "http://192.168.0.150/data";   // <-- Change to your ESP32 IP

export default function SensorReader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch function
  const fetchData = async () => {
    try {
      setError(null);
      const res = await fetch(ESP32_IP);
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      setError("Could not connect to ESP32");
      setLoading(false);
    }
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2b6e35" />
        <Text style={styles.info}>Loading sensor data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sensor Readings</Text>

      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.card}>
          <Text style={styles.label}>{formatLabel(key)}</Text>
          <Text style={styles.value}>{String(value)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// Convert JSON keys to readable text
function formatLabel(key) {
  return key
    .replace(/_/g, " ")               // soil_temp -> soil temp
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
    color: "#2b6e35",
  },
  value: {
    fontSize: 16,
    color: "#222"
  },
  info: {
    marginTop: 12,
    fontSize: 14,
    color: "#555"
  },
  error: {
    fontSize: 16,
    color: "red"
  }
});
