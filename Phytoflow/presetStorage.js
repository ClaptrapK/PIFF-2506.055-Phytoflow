import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOM_SOIL_KEY = "CUSTOM_SOIL_PRESETS";
const CUSTOM_CROP_KEY = "CUSTOM_CROP_PRESETS";

export async function saveCustomPreset(type, preset) {
  const key = type === "soil" ? CUSTOM_SOIL_KEY : CUSTOM_CROP_KEY;
  const current = JSON.parse(await AsyncStorage.getItem(key)) || [];
  const updated = [...current, preset];
  await AsyncStorage.setItem(key, JSON.stringify(updated));
}

export async function loadCustomPresets() {
  const soil = JSON.parse(await AsyncStorage.getItem(CUSTOM_SOIL_KEY)) || [];
  const crop = JSON.parse(await AsyncStorage.getItem(CUSTOM_CROP_KEY)) || [];
  return { soil, crop };
}

export async function deletePreset(type, name) {
  const key = type === "soil" ? CUSTOM_SOIL_KEY : CUSTOM_CROP_KEY;
  const list = JSON.parse(await AsyncStorage.getItem(key)) || [];
  const newList = list.filter((item) => item.name !== name);
  await AsyncStorage.setItem(key, JSON.stringify(newList));
}
