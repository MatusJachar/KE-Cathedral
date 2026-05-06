import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const API_BASE = "http://l4lcga17cpq7qo6hkc0srgzg.178.104.72.151.sslip.io";

const CATHEDRAL_IMAGE =
  `${API_BASE}/api/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg`;

// Tour definitions for KE Cathedral
const TOUR_DEFS: Record<string, { label: Record<string, string>; stops: string[] }> = {
  complete: {
    label: {
      sk: "KompletnĂˇ prehliadka",
      en: "Complete Tour",
      de: "VollstĂ¤ndige Tour",
      hu: "Teljes kĂ¶rĂşt",
      pl: "PeĹ‚na wycieczka",
      fr: "Visite complĂ¨te",
      it: "Tour completo",
      es: "Visita completa",
      uk: "ĐźĐľĐ˛Đ˝Đ¸Đą Ń‚ŃŃ€",
    },
    stops: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
  },
  spiritual: {
    label: {
      sk: "DuchovnĂˇ prehliadka",
      en: "Spiritual Tour",
      de: "Spirituelle Tour",
      hu: "Lelki kĂ¶rĂşt",
      pl: "Wycieczka duchowa",
      fr: "Visite spirituelle",
      it: "Tour spirituale",
      es: "Visita espiritual",
      uk: "Đ”ŃŃ…ĐľĐ˛Đ˝Đ¸Đą Ń‚ŃŃ€",
    },
    stops: ["1", "2", "3", "7", "8", "11", "13", "14"],
  },
};

const HIGHLIGHTS: Record<string, Record<string, string[]>> = {
  sk: {
    complete: [
      "HlavnĂ˝ oltĂˇr sv. AlĹľbety",
      "SevernĂˇ veĹľa s vyhliadkou",
      "Kaplnka ZĂˇpoÄľskĂ˝ch",
      "OltĂˇr NavĹˇtĂ­venia Panny MĂˇrie",
      "GotickĂ© vitrĂˇĹľe",
      "KrstiteÄľnica z 15. storoÄŤia",
    ],
    spiritual: [
      "ModlitebnĂ© miesta",
      "Sv. omĹˇovĂ© oltĂˇre",
      "MariĂˇnska kaplnka",
      "Sakristia",
    ],
  },
  en: {
    complete: [
      "Main altar of St. Elizabeth",
      "North tower with viewpoint",
      "ZĂˇpolya Chapel",
      "Altar of the Visitation of the Virgin Mary",
      "Gothic stained glass windows",
      "15th century baptismal font",
    ],
    spiritual: [
      "Prayer spaces",
      "Mass altars",
      "Marian chapel",
      "Sacristy",
    ],
  },
  de: {
    complete: [
      "Hauptaltar der hl. Elisabeth",
      "Nordturm mit Aussichtspunkt",
      "ZĂˇpolya-Kapelle",
      "Altar der Heimsuchung Mariens",
      "Gotische Buntglasfenster",
      "Taufbecken aus dem 15. Jahrhundert",
    ],
    spiritual: [
      "Gebetsorte",
      "MessaltĂ¤re",
      "Marienkapelle",
      "Sakristei",
    ],
  },
  hu: {
    complete: [
      "Szt. ErzsĂ©bet fĹ‘oltĂˇr",
      "Ă‰szaki torony kilĂˇtĂłval",
      "ZĂˇpolya-kĂˇpolna",
      "SzĹ±z MĂˇria lĂˇtogatĂˇsĂˇnak oltĂˇra",
      "GĂłtikus ĂĽvegablakok",
      "15. szĂˇzadi keresztelĹ‘medence",
    ],
    spiritual: [
      "ImĂˇdkozĂł helyek",
      "MisĂ©k oltĂˇrai",
      "MĂˇria-kĂˇpolna",
      "Sekrestye",
    ],
  },
  pl: {
    complete: [
      "GĹ‚Ăłwny oĹ‚tarz Ĺ›w. ElĹĽbiety",
      "WieĹĽa pĂłĹ‚nocna z punktem widokowym",
      "Kaplica ZĂˇpolya",
      "OĹ‚tarz Nawiedzenia NMP",
      "Gotyckie witraĹĽe",
      "Chrzcielnica z XV wieku",
    ],
    spiritual: [
      "Miejsca modlitwy",
      "OĹ‚tarze mszalne",
      "Kaplica Maryi",
      "Zakrystia",
    ],
  },
  fr: {
    complete: [
      "Autel principal de Ste Ă‰lisabeth",
      "Tour nord avec belvĂ©dĂ¨re",
      "Chapelle ZĂˇpolya",
      "Autel de la Visitation de la Vierge",
      "Vitraux gothiques",
      "Fonts baptismaux du XVe siĂ¨cle",
    ],
    spiritual: [
      "Espaces de priĂ¨re",
      "Autels de messe",
      "Chapelle mariale",
      "Sacristie",
    ],
  },
  it: {
    complete: [
      "Altare principale di S. Elisabetta",
      "Torre nord con belvedere",
      "Cappella ZĂˇpolya",
      "Altare della Visitazione della Vergine",
      "Vetrate gotiche",
      "Fonte battesimale del XV secolo",
    ],
    spiritual: [
      "Spazi di preghiera",
      "Altari della messa",
      "Cappella mariana",
      "Sagrestia",
    ],
  },
  es: {
    complete: [
      "Altar mayor de Santa Isabel",
      "Torre norte con mirador",
      "Capilla ZĂˇpolya",
      "Altar de la VisitaciĂłn de la Virgen",
      "Vidrieras gĂłticas",
      "Pila bautismal del siglo XV",
    ],
    spiritual: [
      "Lugares de oraciĂłn",
      "Altares de misa",
      "Capilla mariana",
      "SacristĂ­a",
    ],
  },
  uk: {
    complete: [
      "Đ“ĐľĐ»ĐľĐ˛Đ˝Đ¸Đą Đ˛Ń–Đ˛Ń‚Đ°Ń€ ŃĐ˛. Đ„Đ»Đ¸Đ·Đ°Đ˛ĐµŃ‚Đ¸",
      "ĐźŃ–Đ˛Đ˝Ń–Ń‡Đ˝Đ° Đ˛ĐµĐ¶Đ° Đ· ĐľĐłĐ»ŃŹĐ´ĐľĐ˛Đ¸ĐĽ ĐĽĐ°ĐąĐ´Đ°Đ˝Ń‡Đ¸ĐşĐľĐĽ",
      "ĐšĐ°ĐżĐµĐ»Đ° Đ—Đ°ĐżĐľĐ»ŃŚŃŹ",
      "Đ’Ń–Đ˛Ń‚Đ°Ń€ Đ’Ń–Đ´Đ˛Ń–Đ´Đ¸Đ˝ Đ”Ń–Đ˛Đ¸ ĐśĐ°Ń€Ń–Ń—",
      "Đ“ĐľŃ‚Đ¸Ń‡Đ˝Ń– Đ˛Ń–Ń‚Ń€Đ°Đ¶Ń–",
      "ĐšŃĐżŃ–Đ»ŃŚ XV ŃŃ‚ĐľĐ»Ń–Ń‚Ń‚ŃŹ",
    ],
    spiritual: [
      "ĐśŃ–ŃŃ†ŃŹ ĐĽĐľĐ»Đ¸Ń‚Đ˛Đ¸",
      "Đ’Ń–Đ˛Ń‚Đ°Ń€Ń– ĐĽĐµŃĐ¸",
      "ĐśĐ°Ń€Ń–Đ°Đ˝ŃŃŚĐşĐ° ĐşĐ°ĐżĐµĐ»Đ°",
      "Đ Đ¸Đ·Đ˝Đ¸Ń†ŃŹ",
    ],
  },
};

const LABELS: Record<string, Record<string, string>> = {
  back: {
    sk: "SpĂ¤ĹĄ", en: "Back", de: "ZurĂĽck", hu: "Vissza",
    pl: "WrĂłÄ‡", fr: "Retour", it: "Indietro", es: "Volver", uk: "ĐťĐ°Đ·Đ°Đ´",
  },
  stops: {
    sk: "zastĂˇvok", en: "stops", de: "Stationen", hu: "megĂˇllĂł",
    pl: "przystankĂłw", fr: "arrĂŞts", it: "fermate", es: "paradas", uk: "Đ·ŃĐżĐ¸Đ˝ĐľĐş",
  },
  highlights: {
    sk: "NajdĂ´leĹľitejĹˇie miesta", en: "Highlights", de: "HĂ¶hepunkte",
    hu: "FĹ‘bb lĂˇtvĂˇnyossĂˇgok", pl: "NajwaĹĽniejsze miejsca", fr: "Points forts",
    it: "Punti salienti", es: "Aspectos destacados", uk: "Đ“ĐľĐ»ĐľĐ˛Đ˝Ń– ĐĽŃ–ŃŃ†ŃŹ",
  },
  startTour: {
    sk: "ZaÄŤaĹĄ prehliadku", en: "Start Tour", de: "Tour starten",
    hu: "KĂ¶rĂşt indĂ­tĂˇsa", pl: "Rozpocznij wycieczkÄ™", fr: "Commencer la visite",
    it: "Inizia il tour", es: "Iniciar visita", uk: "ĐźĐľŃ‡Đ°Ń‚Đ¸ Ń‚ŃŃ€",
  },
  duration: {
    sk: "Trvanie", en: "Duration", de: "Dauer", hu: "IdĹ‘tartam",
    pl: "Czas trwania", fr: "DurĂ©e", it: "Durata", es: "DuraciĂłn", uk: "Đ˘Ń€Đ¸Đ˛Đ°Đ»Ń–ŃŃ‚ŃŚ",
  },
  min: {
    sk: "min", en: "min", de: "Min.", hu: "perc",
    pl: "min", fr: "min", it: "min", es: "min", uk: "Ń…Đ˛",
  },
  loading: {
    sk: "NaÄŤĂ­tava sa...", en: "Loading...", de: "Wird geladen...", hu: "BetĂ¶ltĂ©s...",
    pl: "Ĺadowanie...", fr: "Chargement...", it: "Caricamento...", es: "Cargando...", uk: "Đ—Đ°Đ˛Đ°Đ˝Ń‚Đ°Đ¶ĐµĐ˝Đ˝ŃŹ...",
  },
  stopList: {
    sk: "Zoznam zastĂˇvok", en: "Stop List", de: "Haltestellen", hu: "MegĂˇllĂłk listĂˇja",
    pl: "Lista przystankĂłw", fr: "Liste des arrĂŞts", it: "Elenco fermate", es: "Lista de paradas", uk: "ĐˇĐżĐ¸ŃĐľĐş Đ·ŃĐżĐ¸Đ˝ĐľĐş",
  },
};

function t(key: string, lang: string): string {
  return LABELS[key]?.[lang] ?? LABELS[key]?.["en"] ?? key;
}

interface Stop {
  _id: string;
  order: number;
  translations: Record<string, { title: string; description: string }>;
  imageUrl?: string;
}

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [lang, setLang] = useState("sk");
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const tourDef = TOUR_DEFS[id as string] ?? TOUR_DEFS["complete"];
  const stopNumbers = tourDef.stops;
  const duration = id === "spiritual" ? 45 : 90;

  useEffect(() => {
    AsyncStorage.getItem("selectedLanguage").then((val) => {
      if (val) setLang(val);
    });
  }, []);

  useEffect(() => {
    fetchStops();
  }, []);

  async function fetchStops() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/stops`);
      const data = await res.json();
      // Filter and sort by stopNumbers order
      const filtered = stopNumbers
        .map((num) => data.find((s: Stop) => String(s.order) === num))
        .filter(Boolean) as Stop[];
      setStops(filtered);
    } catch (e) {
      console.error("Error fetching stops:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleStartTour() {
    if (stops.length === 0) return;
    router.push({
      pathname: "/tour/stop",
      params: {
        stopId: stops[0]._id,
        tourId: id,
        stopIndex: "0",
        tourStops: JSON.stringify(stops.map((s) => s._id)),
      },
    });
  }

  const highlights =
    HIGHLIGHTS[lang]?.[id as string] ??
    HIGHLIGHTS["en"]?.[id as string] ??
    [];

  const tourLabel =
    tourDef.label[lang] ?? tourDef.label["en"];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#2D241E" />
          <Text style={styles.backText}>{t("back", lang)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: CATHEDRAL_IMAGE }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{tourLabel}</Text>
            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <Ionicons name="location" size={14} color="#D4AF37" />
                <Text style={styles.badgeText}>
                  {stopNumbers.length} {t("stops", lang)}
                </Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="time" size={14} color="#D4AF37" />
                <Text style={styles.badgeText}>
                  {duration} {t("min", lang)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Highlights */}
        {highlights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("highlights", lang)}</Text>
            {highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightDot} />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stop list */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.stopListHeader}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.sectionTitle}>{t("stopList", lang)}</Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#2D241E"
            />
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator color="#D4AF37" style={{ marginTop: 12 }} />
          ) : expanded ? (
            stops.map((stop, index) => {
              const title =
                stop.translations?.[lang]?.title ??
                stop.translations?.["en"]?.title ??
                `Stop ${stop.order}`;
              return (
                <View key={stop._id} style={styles.stopRow}>
                  <View style={styles.stopNumber}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stopTitle}>{title}</Text>
                </View>
              );
            })
          ) : null}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start button */}
      <View style={styles.startContainer}>
        <TouchableOpacity
          style={[styles.startBtn, loading && styles.startBtnDisabled]}
          onPress={handleStartTour}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FDFBF7" />
          ) : (
            <>
              <Ionicons name="play-circle" size={22} color="#FDFBF7" />
              <Text style={styles.startBtnText}>{t("startTour", lang)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FDFBF7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FDFBF7",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: "#2D241E",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  scroll: {
    flex: 1,
  },
  heroContainer: {
    width: "100%",
    height: height * 0.32,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(45,36,30,0.45)",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FDFBF7",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroBadges: {
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(45,36,30,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#FDFBF7",
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D241E",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginBottom: 12,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D4AF37",
  },
  highlightText: {
    fontSize: 15,
    color: "#2D241E",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    flex: 1,
  },
  stopListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE8DF",
    gap: 12,
  },
  stopNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
  },
  stopNumberText: {
    color: "#FDFBF7",
    fontWeight: "700",
    fontSize: 13,
  },
  stopTitle: {
    fontSize: 15,
    color: "#2D241E",
    fontFamily: Platform.OS === "ios" ? "iOS" : "serif",
    flex: 1,
  },
  startContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FDFBF7",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDE8DF",
  },
  startBtn: {
    backgroundColor: "#2D241E",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  startBtnDisabled: {
    opacity: 0.6,
  },
  startBtnText: {
    color: "#FDFBF7",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.5,
  },
});