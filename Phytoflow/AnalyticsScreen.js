import React, {
  useRef,
  useState,
  useMemo
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import { LineChart } from "react-native-chart-kit";
import ViewShot from "react-native-view-shot";

import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

import {
  Ionicons
} from "@expo/vector-icons";

import {
  generateAnalytics
} from "./analyticsBuilder";

import {
  chartWidth,
  chartHeight
} from "./chartBuilder";

export default function AnalyticsScreen({ route }) {

  const shotRef = useRef();

  const [period, setPeriod] =
    useState("10");

  const {
    sensorData = [],
    soilParams = null
  } = route?.params || {};

  //----------------------------------
  // Filtro de período
  //----------------------------------

  const filteredSensorData =
    useMemo(() => {

      if (!sensorData.length)
        return [];

      const sorted =
        [...sensorData].sort(

          (a, b) =>
            new Date(a.rawTimestamp) -
            new Date(b.rawTimestamp)

        );

      const now =
        new Date();

      switch (period) {

        case "10":
          return sorted.slice(-10);

        case "24h":

          return sorted.filter(item =>

            now -
            new Date(item.rawTimestamp)

            <=

            24 * 60 * 60 * 1000

          );

        case "3d":

          return sorted.filter(item =>

            now -
            new Date(item.rawTimestamp)

            <=

            3 * 24 * 60 * 60 * 1000

          );

        case "7d":

          return sorted.filter(item =>

            now -
            new Date(item.rawTimestamp)

            <=

            7 * 24 * 60 * 60 * 1000

          );

        case "30d":

          return sorted.filter(item =>

            now -
            new Date(item.rawTimestamp)

            <=

            30 * 24 * 60 * 60 * 1000

          );

        default:
          return sorted;

      }

    }, [sensorData, period]);

  //----------------------------------
  // Dados dos gráficos
  //----------------------------------

  const data =
    generateAnalytics(filteredSensorData);

  //----------------------------------
  // Exportar imagem
  //----------------------------------

  async function exportImage() {

    try {

      const uri =
        await shotRef.current.capture();

      await Sharing.shareAsync(uri);

    }

    catch (e) {

      Alert.alert(
        "Erro",
        e.message
      );

    }

  }

  //----------------------------------
  // Exportar PDF
  //----------------------------------

  async function exportPDF() {

    try {

      const img =
        await shotRef.current.capture({

          result: "base64",
          format: "jpg",
          quality: 1

        });

      const html = `

      <html>

      <body>

      <h2>Relatório</h2>

      <img
      src="data:image/jpeg;base64,${img}"
      style="width:100%;"/>

      </body>

      </html>

      `;

      const pdf =
        await Print.printToFileAsync({

          html

        });

      await Sharing.shareAsync(pdf.uri);

    }

    catch (e) {

      Alert.alert(
        "Erro",
        e.message
      );

    }

  }

  //----------------------------------
  // Tela
  //----------------------------------

  return (

<ScrollView
style={styles.container}>

<Text style={styles.title}>

Análises e Gráficos

</Text>

<ViewShot
ref={shotRef}>

<View style={styles.summaryCard}>

<Text style={styles.summaryTitle}>

Indicadores Atuais

</Text>

<Text>

Temperatura do Ar:
{" "}
{data.current.airTemp} °C

</Text>

<Text>

Temperatura Foliar:
{" "}
{data.current.ctd} °C

</Text>

<Text>

Umidade do Solo:
{" "}
{data.current.soil} %

</Text>

<Text>

Umidade do Ar:
{" "}
{data.current.humidity} %

</Text>

<Text>

DPV:
{" "}
{data.current.dpv}

</Text>

<Text>

CTD:
{" "}
{data.current.ctd}

</Text>

<Text>

Fluxo de Seiva:
{" "}
{data.current.sapFlow}

</Text>

<Text>

Δ Sap:
{" "}
{data.current.deltaSap}

</Text>

<Text>

Δ CTD:
{" "}
{data.current.deltaCTD}

</Text>

<Text>

Δ DPV:
{" "}
{data.current.deltaDPV}

</Text>

<Text>

SI Sigma:
{" "}
{data.current.siSigma}

</Text>

<Text>

SI Híbrido:
{" "}
{data.current.siHybrid}

</Text>

<Text>

R²:
{" "}
{data.current.r2}

</Text>

<Text

style={{

marginTop:12,

fontWeight:"700",

color:

data.status==="Sem Stress"

?

"#2ecc71"

:

data.status==="Stress Moderado"

?

"#f39c12"

:

"#e74c3c"

}}

>

{data.status}

</Text>

</View>

<View style={styles.filterRow}>

{["10","24h","3d","7d","30d"].map(item=>(

<TouchableOpacity

key={item}

style={[

styles.filterBtn,

period===item &&

styles.filterBtnActive

]}

onPress={()=>setPeriod(item)}

>

<Text style={styles.filterText}>

{item==="10"

?

"10 Leituras"

:

item}

</Text>

</TouchableOpacity>

))}

</View>

<Text style={styles.chartTitle}>

Umidade do Solo

</Text>

<LineChart

data={data.soilChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.soilChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>

Umidade Relativa

</Text>

<LineChart

data={data.humidityChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.humidityChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>

Temperatura do Ar

</Text>

<LineChart

data={data.tempChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.tempChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>

Temperatura Foliar

</Text>

<LineChart

data={data.leafChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.leafChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>

DPV

</Text>

<LineChart

data={data.dpvChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.dpvChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>

CTD

</Text>

<LineChart

data={data.ctdChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.ctdChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>

Fluxo de Seiva

</Text>

<LineChart

data={data.sapFlowChart.data}

width={chartWidth}

height={chartHeight}

chartConfig={data.sapFlowChart.config}

style={styles.chart}

/>

<Text style={styles.chartTitle}>
Δ CTD
</Text>

<LineChart
  data={data.deltaCTDChart.data}
  width={chartWidth}
  height={chartHeight}
  chartConfig={data.deltaCTDChart.config}
  style={styles.chart}
/>

<Text style={styles.chartTitle}>
Δ DPV
</Text>

<LineChart
  data={data.deltaDPVChart.data}
  width={chartWidth}
  height={chartHeight}
  chartConfig={data.deltaDPVChart.config}
  style={styles.chart}
/>

</ViewShot>

<View style={styles.buttons}>

<TouchableOpacity
style={styles.btn}
onPress={exportImage}
>

<Ionicons
name="image"
size={20}
color="#fff"
/>

<Text style={styles.btnText}>
Exportar Imagem
</Text>

</TouchableOpacity>

<TouchableOpacity
style={styles.btn}
onPress={exportPDF}
>

<Ionicons
name="document"
size={20}
color="#fff"
/>

<Text style={styles.btnText}>
Exportar PDF
</Text>

</TouchableOpacity>

</View>

</ScrollView>

);

}

const styles = StyleSheet.create({

container:{

flex:1,

padding:14,

backgroundColor:"#eef7ee"

},

title:{

fontSize:22,

fontWeight:"800",

marginBottom:12,

color:"#2b6e35"

},

summaryCard:{

backgroundColor:"#fff",

padding:16,

borderRadius:12,

marginBottom:18,

elevation:3

},

summaryTitle:{

fontSize:18,

fontWeight:"700",

marginBottom:12,

color:"#2b6e35"

},

filterRow:{

flexDirection:"row",

flexWrap:"wrap",

justifyContent:"center",

marginBottom:20

},

filterBtn:{

backgroundColor:"#dce8dc",

paddingHorizontal:12,

paddingVertical:8,

borderRadius:20,

margin:4

},

filterBtnActive:{

backgroundColor:"#2b6e35"

},

filterText:{

fontWeight:"700",

color:"#213522"

},

chartTitle:{

fontSize:16,

fontWeight:"700",

marginTop:18,

marginBottom:8,

color:"#213522"

},

chart:{

borderRadius:12,

marginBottom:20

},

buttons:{

marginTop:10,

marginBottom:50

},

btn:{

flexDirection:"row",

justifyContent:"center",

alignItems:"center",

backgroundColor:"#2b6e35",

padding:14,

borderRadius:12,

marginTop:12

},

btnText:{

color:"#fff",

fontWeight:"700",

marginLeft:8

}

});
