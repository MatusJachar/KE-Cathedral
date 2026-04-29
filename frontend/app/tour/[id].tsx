import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Image, Dimensions, ActivityIndicator, SafeAreaView,
  StatusBar, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const API_BASE = 'http://l4lcga17cpq7qo6hkc0srgzg.178.104.72.151.sslip.io';
const CATHEDRAL_IMAGE = API_BASE + '/api/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg';

const TOUR_DEFS = {
  complete: {
    label: { sk: 'Kompletná prehliadka', en: 'Complete Tour', de: 'Vollständige Tour', hu: 'Teljes körút', pl: 'Pełna wycieczka', fr: 'Visite complète', it: 'Tour completo', es: 'Visita completa', uk: 'Повний тур' },
    stops: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'],
    duration: 90,
  },
  spiritual: {
    label: { sk: 'Duchovná prehliadka', en: 'Spiritual Tour', de: 'Spirituelle Tour', hu: 'Lelki körút', pl: 'Wycieczka duchowa', fr: 'Visite spirituelle', it: 'Tour spirituale', es: 'Visita espiritual', uk: 'Духовний тур' },
    stops: ['1','2','3','7','8','11','13','14'],
    duration: 45,
  },
};

const LABELS = {
  back: { sk: 'Späť', en: 'Back', de: 'Zurück', hu: 'Vissza', pl: 'Wróć', fr: 'Retour', it: 'Indietro', es: 'Volver', uk: 'Назад' },
  stops: { sk: 'zastávok', en: 'stops', de: 'Stationen', hu: 'megálló', pl: 'przystanek', fr: 'arrêts', it: 'fermate', es: 'paradas', uk: 'зупинок' },
  minutes: { sk: 'min', en: 'min', de: 'Min.', hu: 'perc', pl: 'min', fr: 'min', it: 'min', es: 'min', uk: 'хв' },
  startTour: { sk: 'Začať prehliadku', en: 'Start Tour', de: 'Tour starten', hu: 'Körút indítása', pl: 'Rozpocznij', fr: 'Commencer', it: 'Inizia', es: 'Iniciar', uk: 'Почати' },
  stopList: { sk: 'Zastávky prehliadky', en: 'Tour Stops', de: 'Stationen', hu: 'Megállók', pl: 'Przystanki', fr: 'Arrêts', it: 'Fermate', es: 'Paradas', uk: 'Зупинки' },
};

function t(key, lang) {
  return LABELS[key]?.[lang] ?? LABELS[key]?.['en'] ?? key;
}

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState('sk');
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const tourDef = TOUR_DEFS[id] ?? TOUR_DEFS['complete'];

  useEffect(() => {
    AsyncStorage.getItem('selectedLanguage').then(v => { if (v) setLang(v); });
  }, []);

  useEffect(() => { fetchStops(); }, []);

  async function fetchStops() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE + '/api/stops');
      const data = await res.json();
      const filtered = tourDef.stops
        .map(num => data.find(s => String(s.order) === num))
        .filter(Boolean);
      setStops(filtered);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function handleStart() {
    if (!stops.length) return;
    router.push({
      pathname: '/tour/stop',
      params: { stopId: stops[0]._id, tourId: id, stopIndex: '0', tourStops: JSON.stringify(stops.map(s => s._id)) },
    });
  }

  const tourLabel = tourDef.label[lang] ?? tourDef.label['en'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#2D241E" />
          <Text style={styles.backText}>{t('back', lang)}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: CATHEDRAL_IMAGE }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{tourLabel}</Text>
            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <Ionicons name="location" size={14} color="#D4AF37" />
                <Text style={styles.badgeText}>{tourDef.stops.length} {t('stops', lang)}</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="time" size={14} color="#D4AF37" />
                <Text style={styles.badgeText}>{tourDef.duration} {t('minutes', lang)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('stopList', lang)}</Text>
          {loading ? (
            <ActivityIndicator color="#D4AF37" style={{ marginTop: 20 }} />
          ) : (
            stops.map((stop, index) => {
              const title = stop.translations?.[lang]?.title ?? stop.translations?.['en']?.title ?? ('Stop ' + stop.order);
              const imgUri = stop.imageUrl
                ? (stop.imageUrl.startsWith('http') ? stop.imageUrl : API_BASE + stop.imageUrl)
                : null;
              return (
                <Pressable
                  key={stop._id}
                  style={({ pressed }) => [styles.stopRow, pressed && styles.stopRowPressed]}
                  onPress={() => router.push({
                    pathname: '/tour/stop',
                    params: { stopId: stop._id, tourId: id, stopIndex: String(index), tourStops: JSON.stringify(stops.map(s => s._id)) },
                  })}
                >
                  {imgUri ? (
                    <Image source={{ uri: imgUri }} style={styles.thumbnail} resizeMode="cover" />
                  ) : (
                    <View style={styles.thumbnailPlaceholder}>
                      <Ionicons name="business" size={22} color="#D4AF37" />
                    </View>
                  )}
                  <View style={styles.stopInfo}>
                    <View style={styles.stopNumberBadge}>
                      <Text style={styles.stopNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stopTitle} numberOfLines={2}>{title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C4B99A" />
                </Pressable>
              );
            })
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.startContainer}>
        <Pressable
          style={[styles.startBtn, (loading || !stops.length) && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={loading || !stops.length}
        >
          {loading ? <ActivityIndicator color="#FDFBF7" /> : (
            <>
              <Ionicons name="play-circle" size={22} color="#FDFBF7" />
              <Text style={styles.startBtnText}>{t('startTour', lang)}</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFBF7' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 16, color: '#2D241E' },
  scroll: { flex: 1 },
  heroContainer: { width: '100%', height: height * 0.32, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45,36,30,0.5)' },
  heroContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#FDFBF7', marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroBadges: { flexDirection: 'row', gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(45,36,30,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#FDFBF7', fontSize: 13 },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2D241E', marginBottom: 16 },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 14, marginBottom: 10, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  stopRowPressed: { opacity: 0.85 },
  thumbnail: { width: 72, height: 72, borderRadius: 10 },
  thumbnailPlaceholder: { width: 72, height: 72, borderRadius: 10, backgroundColor: '#EDE8DF', justifyContent: 'center', alignItems: 'center' },
  stopInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  stopNumberBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stopNumberText: { color: '#2D241E', fontWeight: '800', fontSize: 12 },
  stopTitle: { flex: 1, fontSize: 15, color: '#2D241E', fontWeight: '600', lineHeight: 21 },
  startContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FDFBF7', paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EDE8DF' },
  startBtn: { backgroundColor: '#2D241E', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startBtnDisabled: { opacity: 0.5 },
  startBtnText: { color: '#FDFBF7', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
});import React, { useState, useEffect, useRef } from "react";
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
      sk: "Kompletná prehliadka",
      en: "Complete Tour",
      de: "Vollständige Tour",
      hu: "Teljes körút",
      pl: "Pełna wycieczka",
      fr: "Visite complète",
      it: "Tour completo",
      es: "Visita completa",
      uk: "Повний тур",
    },
    stops: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
  },
  spiritual: {
    label: {
      sk: "Duchovná prehliadka",
      en: "Spiritual Tour",
      de: "Spirituelle Tour",
      hu: "Lelki körút",
      pl: "Wycieczka duchowa",
      fr: "Visite spirituelle",
      it: "Tour spirituale",
      es: "Visita espiritual",
      uk: "Духовний тур",
    },
    stops: ["1", "2", "3", "7", "8", "11", "13", "14"],
  },
};

const HIGHLIGHTS: Record<string, Record<string, string[]>> = {
  sk: {
    complete: [
      "Hlavný oltár sv. Alžbety",
      "Severná veža s vyhliadkou",
      "Kaplnka Zápoľských",
      "Oltár Navštívenia Panny Márie",
      "Gotické vitráže",
      "Krstiteľnica z 15. storočia",
    ],
    spiritual: [
      "Modlitebné miesta",
      "Sv. omšové oltáre",
      "Mariánska kaplnka",
      "Sakristia",
    ],
  },
  en: {
    complete: [
      "Main altar of St. Elizabeth",
      "North tower with viewpoint",
      "Zápolya Chapel",
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
      "Zápolya-Kapelle",
      "Altar der Heimsuchung Mariens",
      "Gotische Buntglasfenster",
      "Taufbecken aus dem 15. Jahrhundert",
    ],
    spiritual: [
      "Gebetsorte",
      "Messaltäre",
      "Marienkapelle",
      "Sakristei",
    ],
  },
  hu: {
    complete: [
      "Szt. Erzsébet főoltár",
      "Északi torony kilátóval",
      "Zápolya-kápolna",
      "Szűz Mária látogatásának oltára",
      "Gótikus üvegablakok",
      "15. századi keresztelőmedence",
    ],
    spiritual: [
      "Imádkozó helyek",
      "Misék oltárai",
      "Mária-kápolna",
      "Sekrestye",
    ],
  },
  pl: {
    complete: [
      "Główny ołtarz św. Elżbiety",
      "Wieża północna z punktem widokowym",
      "Kaplica Zápolya",
      "Ołtarz Nawiedzenia NMP",
      "Gotyckie witraże",
      "Chrzcielnica z XV wieku",
    ],
    spiritual: [
      "Miejsca modlitwy",
      "Ołtarze mszalne",
      "Kaplica Maryi",
      "Zakrystia",
    ],
  },
  fr: {
    complete: [
      "Autel principal de Ste Élisabeth",
      "Tour nord avec belvédère",
      "Chapelle Zápolya",
      "Autel de la Visitation de la Vierge",
      "Vitraux gothiques",
      "Fonts baptismaux du XVe siècle",
    ],
    spiritual: [
      "Espaces de prière",
      "Autels de messe",
      "Chapelle mariale",
      "Sacristie",
    ],
  },
  it: {
    complete: [
      "Altare principale di S. Elisabetta",
      "Torre nord con belvedere",
      "Cappella Zápolya",
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
      "Capilla Zápolya",
      "Altar de la Visitación de la Virgen",
      "Vidrieras góticas",
      "Pila bautismal del siglo XV",
    ],
    spiritual: [
      "Lugares de oración",
      "Altares de misa",
      "Capilla mariana",
      "Sacristía",
    ],
  },
  uk: {
    complete: [
      "Головний вівтар св. Єлизавети",
      "Північна вежа з оглядовим майданчиком",
      "Капела Заполья",
      "Вівтар Відвідин Діви Марії",
      "Готичні вітражі",
      "Купіль XV століття",
    ],
    spiritual: [
      "Місця молитви",
      "Вівтарі меси",
      "Маріанська капела",
      "Ризниця",
    ],
  },
};

const LABELS: Record<string, Record<string, string>> = {
  back: {
    sk: "Späť", en: "Back", de: "Zurück", hu: "Vissza",
    pl: "Wróć", fr: "Retour", it: "Indietro", es: "Volver", uk: "Назад",
  },
  stops: {
    sk: "zastávok", en: "stops", de: "Stationen", hu: "megálló",
    pl: "przystanków", fr: "arrêts", it: "fermate", es: "paradas", uk: "зупинок",
  },
  highlights: {
    sk: "Najdôležitejšie miesta", en: "Highlights", de: "Höhepunkte",
    hu: "Főbb látványosságok", pl: "Najważniejsze miejsca", fr: "Points forts",
    it: "Punti salienti", es: "Aspectos destacados", uk: "Головні місця",
  },
  startTour: {
    sk: "Začať prehliadku", en: "Start Tour", de: "Tour starten",
    hu: "Körút indítása", pl: "Rozpocznij wycieczkę", fr: "Commencer la visite",
    it: "Inizia il tour", es: "Iniciar visita", uk: "Почати тур",
  },
  duration: {
    sk: "Trvanie", en: "Duration", de: "Dauer", hu: "Időtartam",
    pl: "Czas trwania", fr: "Durée", it: "Durata", es: "Duración", uk: "Тривалість",
  },
  min: {
    sk: "min", en: "min", de: "Min.", hu: "perc",
    pl: "min", fr: "min", it: "min", es: "min", uk: "хв",
  },
  loading: {
    sk: "Načítava sa...", en: "Loading...", de: "Wird geladen...", hu: "Betöltés...",
    pl: "Ładowanie...", fr: "Chargement...", it: "Caricamento...", es: "Cargando...", uk: "Завантаження...",
  },
  stopList: {
    sk: "Zoznam zastávok", en: "Stop List", de: "Haltestellen", hu: "Megállók listája",
    pl: "Lista przystanków", fr: "Liste des arrêts", it: "Elenco fermate", es: "Lista de paradas", uk: "Список зупинок",
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
