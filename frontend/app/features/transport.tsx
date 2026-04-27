import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GPS_LAT = 48.7197;
const GPS_LNG = 21.2580;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${GPS_LAT},${GPS_LNG}`;

const LABELS: Record<string, Record<string, string>> = {
  title: {
    sk: 'Doprava', en: 'Transport', de: 'Anreise', hu: 'Megközelítés',
    pl: 'Dojazd', fr: 'Transport', it: 'Trasporto', es: 'Transporte', uk: 'Транспорт',
  },
  mainTitle: {
    sk: 'Ako sa dostať do Dómu sv. Alžbety',
    en: 'How to get to St. Elizabeth Cathedral',
    de: 'Anreise zum Dom der hl. Elisabeth',
    hu: 'Hogyan juthat el a Szt. Erzsébet-dómhoz',
    pl: 'Jak dotrzeć do Katedry św. Elżbiety',
    fr: "Comment se rendre à la Cathédrale Ste-Élisabeth",
    it: 'Come raggiungere la Cattedrale di S. Elisabetta',
    es: 'Cómo llegar a la Catedral de Sta. Isabel',
    uk: 'Як дістатися до Собору св. Єлизавети',
  },
  gpsTitle: {
    sk: 'GPS Poloha', en: 'GPS Location', de: 'GPS-Standort', hu: 'GPS-koordináták',
    pl: 'Lokalizacja GPS', fr: 'Position GPS', it: 'Posizione GPS', es: 'Ubicación GPS', uk: 'GPS-координати',
  },
  openMaps: {
    sk: 'Otvoriť v Google Maps', en: 'Open in Google Maps', de: 'In Google Maps öffnen',
    hu: 'Megnyitás Google Maps-ben', pl: 'Otwórz w Google Maps', fr: 'Ouvrir dans Google Maps',
    it: 'Apri in Google Maps', es: 'Abrir en Google Maps', uk: 'Відкрити в Google Maps',
  },
  byCar: {
    sk: 'Autom', en: 'By Car', de: 'Mit dem Auto', hu: 'Autóval',
    pl: 'Samochodem', fr: 'En voiture', it: 'In auto', es: 'En coche', uk: 'Автомобілем',
  },
  byTrain: {
    sk: 'Vlakom', en: 'By Train', de: 'Mit dem Zug', hu: 'Vonattal',
    pl: 'Pociągiem', fr: 'En train', it: 'In treno', es: 'En tren', uk: 'Потягом',
  },
  byBus: {
    sk: 'Autobusom / MHD', en: 'By Bus / Public Transport', de: 'Mit Bus / ÖPNV',
    hu: 'Busszal / tömegközlekedéssel', pl: 'Autobusem / komunikacją miejską',
    fr: 'En bus / transports en commun', it: 'In autobus / trasporto pubblico',
    es: 'En autobús / transporte público', uk: 'Автобусом / громадським транспортом',
  },
  byPlane: {
    sk: 'Lietadlom', en: 'By Plane', de: 'Mit dem Flugzeug', hu: 'Repülővel',
    pl: 'Samolotem', fr: 'En avion', it: 'In aereo', es: 'En avión', uk: 'Літаком',
  },
  parking: {
    sk: 'Parkovanie', en: 'Parking', de: 'Parken', hu: 'Parkolás',
    pl: 'Parking', fr: 'Stationnement', it: 'Parcheggio', es: 'Aparcamiento', uk: 'Парковка',
  },
  back: {
    sk: 'Späť', en: 'Back', de: 'Zurück', hu: 'Vissza',
    pl: 'Wróć', fr: 'Retour', it: 'Indietro', es: 'Volver', uk: 'Назад',
  },
};

function t(key: string, lang: string): string {
  return LABELS[key]?.[lang] ?? LABELS[key]?.['en'] ?? key;
}

export default function TransportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState('sk');

  useEffect(() => {
    AsyncStorage.getItem('selectedLanguage').then(val => { if (val) setLang(val); });
  }, []);

  const carContent: Record<string, string> = {
    sk: `Dóm sv. Alžbety sa nachádza v centre Košíc na Hlavnej ulici.\n\n• Z D1 (smer Bratislava – Košice): zíďte na výjazd Košice-západ alebo Košice-centrum\n• Z D1 (smer Prešov): výjazd Košice-sever, smerom do centra\n• Z Popradu (~80 km): po D1 smerom na Košice\n• Z Prešova (~36 km): po D1 smerom na Košice\n• Z Miskolca (Maďarsko, ~90 km): cez Tornyosnémeti / Milhosť, po R4 do Košíc`,
    en: `St. Elizabeth Cathedral is located in the centre of Košice on Hlavná Street.\n\n• From D1 (Bratislava direction): exit Košice-west or Košice-centre\n• From D1 (Prešov direction): exit Košice-north, towards city centre\n• From Poprad (~80 km): via D1 motorway towards Košice\n• From Prešov (~36 km): via D1 motorway towards Košice\n• From Miskolc (Hungary, ~90 km): via Tornyosnémeti / Milhosť, R4 to Košice`,
    de: `Der Dom der hl. Elisabeth befindet sich im Zentrum von Košice in der Hlavná-Straße.\n\n• Von der D1 (Richtung Bratislava): Ausfahrt Košice-West oder Košice-Zentrum\n• Von der D1 (Richtung Prešov): Ausfahrt Košice-Nord, Richtung Stadtzentrum\n• Von Poprad (~80 km): über die D1 Richtung Košice\n• Von Prešov (~36 km): über die D1 Richtung Košice\n• Von Miskolc (Ungarn, ~90 km): über Tornyosnémeti / Milhosť, R4 nach Košice`,
    hu: `A Szt. Erzsébet-dóm Kassa belvárosában, a Fő utcán (Hlavná) található.\n\n• D1-ről (Pozsony felőli irány): Kassa-nyugat vagy Kassa-centrum lehajtó\n• D1-ről (Eperjes felőli irány): Kassa-észak lehajtó, belváros felé\n• Poprádból (~80 km): D1 autópályán Kassa felé\n• Eperjesről (~36 km): D1 autópályán Kassa felé\n• Miskolcról (~90 km): Tornyosnémeti / Milhosť érintésével, R4-en Kassára`,
    pl: `Katedra św. Elżbiety znajduje się w centrum Koszyce przy ulicy Hlavná.\n\n• Z D1 (kierunek Bratysława): zjazd Koszyce-zachód lub Koszyce-centrum\n• Z D1 (kierunek Preszów): zjazd Koszyce-północ, w kierunku centrum\n• Z Popradu (~80 km): autostradą D1 w kierunku Koszyc\n• Z Preszowa (~36 km): autostradą D1 w kierunku Koszyc\n• Z Miszkolca (Węgry, ~90 km): przez Tornyosnémeti / Milhosť, R4 do Koszyc`,
    uk: `Собор св. Єлизавети розташований у центрі Кошице на вулиці Главна.\n\n• З D1 (з боку Братислави): з'їзд Кошице-захід або Кошице-центр\n• З D1 (з боку Прешова): з'їзд Кошице-північ, у напрямку центру\n• З Попрада (~80 км): автострадою D1 до Кошице\n• З Прешова (~36 км): автострадою D1 до Кошице\n• З Мішкольца (Угорщина, ~90 км): через Tornyosnémeti / Milhosť, R4 до Кошице`,
  };

  const trainContent: Record<string, string> = {
    sk: `Košice sú dobre dostupné vlakom z celého Slovenska.\n\n• Z Bratislavy: priame rýchliky IC/EC, cca 3,5 – 4 hod.\n• Z Popradu: cca 1 hod.\n• Z Prešova: cca 30 min.\n• Z Budapešti (Maďarsko): priame spojenie, cca 3 hod.\n\nKošická hlavná stanica je vzdialená ~15 min pešo od dómu, prípadne trolejbusom/taxíkom.`,
    en: `Košice is well connected by train from across Slovakia.\n\n• From Bratislava: direct IC/EC express, approx. 3.5 – 4 hrs\n• From Poprad: approx. 1 hr\n• From Prešov: approx. 30 min\n• From Budapest (Hungary): direct connection, approx. 3 hrs\n\nKošice main station is ~15 min walk from the cathedral, or by trolleybus/taxi.`,
    de: `Košice ist mit dem Zug aus der ganzen Slowakei gut erreichbar.\n\n• Von Bratislava: Direktzug IC/EC, ca. 3,5 – 4 Std.\n• Von Poprad: ca. 1 Std.\n• Von Prešov: ca. 30 Min.\n• Von Budapest (Ungarn): Direktverbindung, ca. 3 Std.\n\nDer Hauptbahnhof Košice liegt ~15 Gehminuten vom Dom entfernt, oder per Oberleitungsbus/Taxi.`,
    hu: `Kassa vonattal az egész Szlovákiából jól megközelíthető.\n\n• Pozsonyból: közvetlen IC/EC gyorsvonat, kb. 3,5 – 4 óra\n• Poprádból: kb. 1 óra\n• Eperjesről: kb. 30 perc\n• Budapestről: közvetlen járat, kb. 3 óra\n\nA kassai főpályaudvar kb. 15 perc sétára van a dómtól, vagy trolibusszal/taxival.`,
    pl: `Koszyce są dobrze skomunikowane pociągiem z całej Słowacji.\n\n• Z Bratysławy: bezpośredni ekspres IC/EC, ok. 3,5 – 4 godz.\n• Z Popradu: ok. 1 godz.\n• Z Preszowa: ok. 30 min.\n• Z Budapesztu (Węgry): bezpośrednie połączenie, ok. 3 godz.\n\nGłówny dworzec w Koszycach jest ok. 15 min pieszo od katedry, lub trolejbusem/taksówką.`,
    uk: `Кошице добре з'єднані потягом з усієї Словаччини.\n\n• З Братислави: прямий IC/EC експрес, прибл. 3,5 – 4 год.\n• З Попрада: прибл. 1 год.\n• З Прешова: прибл. 30 хв.\n• З Будапешта (Угорщина): пряме сполучення, прибл. 3 год.\n\nГоловний вокзал Кошице знаходиться за ~15 хв ходьби від собору, або тролейбусом/таксі.`,
  };

  const busContent: Record<string, string> = {
    sk: `MHD Košice (DPMK) zastavuje priamo pri dóme.\n\n• Trolejbusové linky 51, 52, 71 – zastávka Hlavná\n• Autobusová stanica Košice je ~10 min pešo\n• Medzimestské autobusy zo Spišskej Novej Vsi, Prešova, Rožňavy a ďalších miest zastavujú na autobusovej stanici Košice`,
    en: `Košice city transport (DPMK) stops directly near the cathedral.\n\n• Trolleybus lines 51, 52, 71 – stop Hlavná\n• Košice bus station is ~10 min walk\n• Intercity buses from Spišská Nová Ves, Prešov, Rožňava and other cities stop at Košice bus station`,
    de: `Der Stadtverkehr Košice (DPMK) hält direkt beim Dom.\n\n• Oberleitungsbus-Linien 51, 52, 71 – Haltestelle Hlavná\n• Busbahnhof Košice ist ~10 Gehminuten entfernt\n• Überlandbusse aus Spišská Nová Ves, Prešov, Rožňava und anderen Städten halten am Busbahnhof Košice`,
    hu: `A kassai városi tömegközlekedés (DPMK) közvetlenül a dóm közelében megáll.\n\n• Trolibusz 51, 52, 71 – Hlavná megálló\n• A kassai autóbusz-állomás kb. 10 perc sétára van\n• Távolsági buszok Iglóról, Eperjesről, Rozsnyóról és más városokból a kassai autóbusz-állomáson állnak meg`,
    pl: `Komunikacja miejska Koszyce (DPMK) zatrzymuje się bezpośrednio przy katedrze.\n\n• Trolejbusy 51, 52, 71 – przystanek Hlavná\n• Dworzec autobusowy Koszyce jest ok. 10 min pieszo\n• Autobusy międzymiastowe z Spiskiej Nowej Wsi, Preszowa, Rożniawy i innych miast zatrzymują się na dworcu autobusowym Koszyce`,
    uk: `Міський транспорт Кошице (DPMK) зупиняється безпосередньо біля собору.\n\n• Тролейбусні маршрути 51, 52, 71 – зупинка Hlavná\n• Автовокзал Кошице – ~10 хв пішки\n• Міжміські автобуси зі Спішської Нової Веси, Прешова, Рожняви та інших міст зупиняються на автовокзалі Кошице`,
  };

  const planeContent: Record<string, string> = {
    sk: `Najbližšie letiská:\n\n• Letisko Košice (KSC) – 6 km od centra, ~15 min taxíkom. Pravidelné linky do Viedne, Prahy, Londýna, Varšavy a ďalších miest.\n• Letisko Budapešť (BUD) – ~270 km, ~2,5 hod. autom. Najväčšie výber letov pre región.\n• Letisko Krakov (KRK) – ~250 km, ~2,5 hod. autom.`,
    en: `Nearest airports:\n\n• Košice Airport (KSC) – 6 km from the centre, ~15 min by taxi. Regular flights to Vienna, Prague, London, Warsaw and more.\n• Budapest Airport (BUD) – ~270 km, ~2.5 hrs by car. Largest flight selection for the region.\n• Kraków Airport (KRK) – ~250 km, ~2.5 hrs by car.`,
    de: `Nächstgelegene Flughäfen:\n\n• Flughafen Košice (KSC) – 6 km vom Zentrum, ~15 Min. mit dem Taxi. Regelmäßige Flüge nach Wien, Prag, London, Warschau und mehr.\n• Flughafen Budapest (BUD) – ~270 km, ~2,5 Std. mit dem Auto. Größte Flugauswahl für die Region.\n• Flughafen Krakau (KRK) – ~250 km, ~2,5 Std. mit dem Auto.`,
    hu: `Legközelebbi repülőterek:\n\n• Kassai repülőtér (KSC) – 6 km a belvárostól, ~15 perc taxival. Rendszeres járatok Bécsbe, Prágába, Londonba, Varsóba és más városokba.\n• Budapesti repülőtér (BUD) – ~270 km, ~2,5 óra autóval. A legtöbb járat a régióba.\n• Krakkói repülőtér (KRK) – ~250 km, ~2,5 óra autóval.`,
    pl: `Najbliższe lotniska:\n\n• Lotnisko Koszyce (KSC) – 6 km od centrum, ~15 min taksówką. Regularne loty do Wiednia, Pragi, Londynu, Warszawy i innych miast.\n• Lotnisko Budapeszt (BUD) – ~270 km, ~2,5 godz. samochodem. Największy wybór lotów dla regionu.\n• Lotnisko Kraków (KRK) – ~250 km, ~2,5 godz. samochodem.`,
    uk: `Найближчі аеропорти:\n\n• Аеропорт Кошице (KSC) – 6 км від центру, ~15 хв таксі. Регулярні рейси до Відня, Праги, Лондона, Варшави та інших міст.\n• Аеропорт Будапешт (BUD) – ~270 км, ~2,5 год. автомобілем. Найбільший вибір рейсів для регіону.\n• Аеропорт Краків (KRK) – ~250 км, ~2,5 год. автомобілем.`,
  };

  const parkingContent: Record<string, string> = {
    sk: `V centre Košíc je viacero parkovísk v blízkosti dómu:\n\n• Parkovisko Hlavná / Rooseveltova – ~3 min pešo\n• Parkovací dom OC Optima – ~8 min pešo\n• Parkovisko pri Dóme (Alžbetina ul.) – bezprostredné okolie\n\nCentrum Košíc je prevažne pešia zóna – odporúčame zaparkovať na kraji centra a pokračovať pešo.`,
    en: `There are several car parks near the cathedral in Košice city centre:\n\n• Car park Hlavná / Rooseveltova – ~3 min walk\n• OC Optima parking house – ~8 min walk\n• Parking near the Cathedral (Alžbetina St.) – immediate surroundings\n\nKošice city centre is largely a pedestrian zone – we recommend parking on the edge of the centre and walking.`,
    de: `Im Zentrum von Košice gibt es mehrere Parkmöglichkeiten in der Nähe des Doms:\n\n• Parkplatz Hlavná / Rooseveltova – ~3 Gehminuten\n• Parkhaus OC Optima – ~8 Gehminuten\n• Parkplatz beim Dom (Alžbetina Str.) – unmittelbare Umgebung\n\nDas Zentrum von Košice ist weitgehend Fußgängerzone – wir empfehlen, am Rand des Zentrums zu parken und zu Fuß weiterzugehen.`,
    hu: `Kassa belvárosában több parkoló is található a dóm közelében:\n\n• Parkoló Hlavná / Rooseveltova – ~3 perc séta\n• OC Optima parkolóház – ~8 perc séta\n• Parkoló a dóm közelében (Alžbetina u.) – közvetlen közelség\n\nKassa belvárosának nagy része gyalogos övezet – javasoljuk, hogy a belváros szélén parkoljon és gyalog menjen tovább.`,
    pl: `W centrum Koszyc jest kilka parkingów w pobliżu katedry:\n\n• Parking Hlavná / Rooseveltova – ~3 min pieszo\n• Parking OC Optima – ~8 min pieszo\n• Parking przy Katedrze (ul. Alžbetina) – bezpośrednie otoczenie\n\nCentrum Koszyc jest w większości strefą pieszą – zalecamy parkowanie na obrzeżach centrum i dalsze poruszanie się pieszo.`,
    uk: `У центрі Кошице є кілька парковок поблизу собору:\n\n• Парковка Hlavná / Rooseveltova – ~3 хв пішки\n• Паркінг OC Optima – ~8 хв пішки\n• Парковка біля собору (вул. Alžbetina) – безпосередня близькість\n\nЦентр Кошице здебільшого є пішохідною зоною – рекомендуємо паркуватися на краю центру та йти пішки.`,
  };

  const langKey = (obj: Record<string, string>) => obj[lang] ?? obj['en'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('title', lang)}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>{t('mainTitle', lang)}</Text>

        {/* GPS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={22} color={Colors.accent} />
            <Text style={styles.cardTitle}>{t('gpsTitle', lang)}</Text>
          </View>
          <Text style={styles.gpsCoords}>48°43'10.9"N, 21°15'28.8"E</Text>
          <Text style={styles.cardText}>Hlavná 28, 040 01 Košice</Text>
          <Pressable style={styles.mapButton} onPress={() => Linking.openURL(MAPS_URL)}>
            <Ionicons name="map" size={18} color="#fff" />
            <Text style={styles.mapButtonText}>{t('openMaps', lang)}</Text>
          </Pressable>
        </View>

        {/* By Car */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="car" size={22} color="#4CAF50" />
            <Text style={styles.cardTitle}>{t('byCar', lang)}</Text>
          </View>
          <Text style={styles.cardText}>{langKey(carContent)}</Text>
        </View>

        {/* Parking */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="business" size={22} color="#607D8B" />
            <Text style={styles.cardTitle}>{t('parking', lang)}</Text>
          </View>
          <Text style={styles.cardText}>{langKey(parkingContent)}</Text>
        </View>

        {/* By Train */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="train" size={22} color="#FF9800" />
            <Text style={styles.cardTitle}>{t('byTrain', lang)}</Text>
          </View>
          <Text style={styles.cardText}>{langKey(trainContent)}</Text>
        </View>

        {/* By Bus */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bus" size={22} color="#2196F3" />
            <Text style={styles.cardTitle}>{t('byBus', lang)}</Text>
          </View>
          <Text style={styles.cardText}>{langKey(busContent)}</Text>
        </View>

        {/* By Plane */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="airplane" size={22} color="#E91E63" />
            <Text style={styles.cardTitle}>{t('byPlane', lang)}</Text>
          </View>
          <Text style={styles.cardText}>{langKey(planeContent)}</Text>
          <Pressable
            style={styles.mapButton}
            onPress={() => Linking.openURL('https://www.airportkosice.sk')}
          >
            <Ionicons name="globe" size={16} color="#fff" />
            <Text style={styles.mapButtonText}>airportkosice.sk</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    flex: 1, textAlign: 'center', fontSize: 18,
    fontWeight: '700', color: Colors.text.primary,
  },
  content: { paddingHorizontal: 16 },
  mainTitle: {
    fontSize: 20, fontWeight: '800', color: Colors.text.primary,
    textAlign: 'center', marginBottom: 20, lineHeight: 28,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    marginBottom: 10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text.primary },
  cardText: { fontSize: 13, color: Colors.text.secondary, lineHeight: 21 },
  gpsCoords: {
    fontSize: 14, color: Colors.text.secondary,
    fontFamily: 'monospace', marginBottom: 4,
  },
  mapButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#4285F4', borderRadius: 10,
    paddingVertical: 10, gap: 8, marginTop: 12,
  },
  mapButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
