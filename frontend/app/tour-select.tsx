import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const HERO_IMAGE = `${API_BASE_URL}/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg`;

const TOUR_TYPES = [
  {
    id: 'complete',
    color: '#D4AF37',
    icon: 'business',
    stops: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    label: {
      sk: 'Kompletná prehliadka', en: 'Complete Tour', de: 'Vollständige Tour',
      hu: 'Teljes körút', pl: 'Pełna wycieczka', fr: 'Visite complète',
      it: 'Tour completo', es: 'Visita completa', uk: 'Повний тур',
    },
    desc: {
      sk: 'Prejdite všetkými 14 zastávkami katedrály.', en: 'Walk through all 14 stops of the cathedral.',
      de: 'Besuchen Sie alle 14 Stationen der Kathedrale.', hu: 'Járja be a katedrális mind a 14 állomását.',
      pl: 'Przejdź przez wszystkie 14 przystaneków katedry.', fr: 'Parcourez les 14 arrêts de la cathédrale.',
      it: 'Visita tutte le 14 fermate della cattedrale.', es: 'Recorra las 14 paradas de la catedral.',
      uk: 'Пройдіть через усі 14 зупинок собору.',
    },
    duration: '~90 min',
  },
  {
    id: 'spiritual',
    color: '#8B6914',
    icon: 'heart',
    stops: [1,2,3,7,8,11,13,14],
    label: {
      sk: 'Duchovná cesta', en: 'Spiritual Journey', de: 'Spirituelle Reise',
      hu: 'Lelki út', pl: 'Duchowa droga', fr: 'Chemin spirituel',
      it: 'Cammino spirituale', es: 'Camino espiritual', uk: 'Духовний шлях',
    },
    desc: {
      sk: 'Vybrané zastávky s hlbším duchovným výkladom.', en: 'Selected stops with deeper spiritual interpretation.',
      de: 'Ausgewählte Stationen mit tieferer spiritueller Deutung.', hu: 'Kiválasztott megállók mélyebb lelki értelmezéssel.',
      pl: 'Wybrane przystanki z głębszą interpretacją duchową.', fr: 'Arrêts choisis avec une interprétation spirituelle plus profonde.',
      it: 'Fermate selezionate con un’interpretazione spirituale più profonda.', es: 'Paradas seleccionadas con interpretación espiritual más profunda.',
      uk: 'Вибрані зупинки з глибшою духовною інтерпретацією.',
    },
    duration: '~45 min',
  },
];

const LABELS = {
  title: { sk: 'Vyberte prehliadku', en: 'Choose your tour', de: 'Wählen Sie Ihre Tour', hu: 'Válassza ki a körútját', pl: 'Wybierz wycieczkę', fr: 'Choisissez votre visite', it: 'Scegli il tour', es: 'Elige tu visita', uk: 'Оберіть екскурсію' },
  stops: { sk: 'zastávok', en: 'stops', de: 'Stationen', hu: 'megálló', pl: 'przystanek', fr: 'arrêts', it: 'fermate', es: 'paradas', uk: 'зупинок' },
  select: { sk: 'Vybrať prehliadku', en: 'Select tour', de: 'Tour wählen', hu: 'Körút kiválasztása', pl: 'Wybierz', fr: 'Sélectionner', it: 'Seleziona', es: 'Seleccionar', uk: 'Обрати' },
  back: { sk: 'Späť', en: 'Back', de: 'Zurück', hu: 'Vissza', pl: 'Wróć', fr: 'Retour', it: 'Indietro', es: 'Volver', uk: 'Назад' },
};

function t(key, lang) {
  return LABELS[key]?.[lang] ?? LABELS[key]?.['en'] ?? key;
}

export default function TourSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState('sk');
  const [selected, setSelected] = useState('complete');

  useEffect(() => {
    AsyncStorage.getItem('selectedLanguage').then(v => { if (v) setLang(v); });
  }, []);

  function handleSelect(tourId) {
    router.push({ pathname: '/tour/[id]', params: { id: tourId } });
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#FDFBF7" />
            <Text style={styles.backText}>{t('back', lang)}</Text>
          </Pressable>
          <Text style={styles.heroTitle}>{t('title', lang)}</Text>
          <Text style={styles.heroSubtitle}>Dom sv. Alžbety — Košice</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        {TOUR_TYPES.map(tour => {
          const isSelected = selected === tour.id;
          const label = tour.label[lang] ?? tour.label['en'];
          const desc = tour.desc[lang] ?? tour.desc['en'];
          return (
            <Pressable
              key={tour.id}
              style={({ pressed }) => [styles.tourCard, isSelected && { borderColor: tour.color, borderWidth: 2 }, pressed && styles.tourCardPressed]}
              onPress={() => setSelected(tour.id)}
            >
              <View style={[styles.tourIconCircle, { backgroundColor: tour.color }]}>
                <Ionicons name={tour.icon} size={28} color="#FDFBF7" />
              </View>
              <View style={styles.tourInfo}>
                <Text style={styles.tourLabel}>{label}</Text>
                <Text style={styles.tourDesc}>{desc}</Text>
                <View style={styles.tourMeta}>
                  <View style={styles.metaChip}>
                    <Ionicons name="location" size={12} color={tour.color} />
                    <Text style={[styles.metaText, { color: tour.color }]}>{tour.stops.length} {t('stops', lang)}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="time" size={12} color={tour.color} />
                    <Text style={[styles.metaText, { color: tour.color }]}>{tour.duration}</Text>
                  </View>
                </View>
              </View>
              {isSelected && (
                <View style={[styles.checkCircle, { backgroundColor: tour.color }]}>
                  <Ionicons name="checkmark" size={18} color="#FDFBF7" />
                </View>
              )}
            </Pressable>
          );
        })}

        <Pressable
          style={({ pressed }) => [styles.selectBtn, pressed && { opacity: 0.85 }]}
          onPress={() => handleSelect(selected)}
        >
          <Ionicons name="play-circle" size={22} color="#FDFBF7" />
          <Text style={styles.selectBtnText}>{t('select', lang)}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  heroContainer: { height: 200, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45,36,30,0.65)' },
  heroContent: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, justifyContent: 'flex-end', paddingBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginBottom: 12 },
  backText: { color: '#FDFBF7', fontSize: 14 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FDFBF7', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  heroSubtitle: { fontSize: 13, color: '#D4AF37', marginTop: 4, letterSpacing: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  tourCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  tourCardPressed: { opacity: 0.9 },
  tourIconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  tourInfo: { flex: 1 },
  tourLabel: { fontSize: 17, fontWeight: '800', color: '#2D241E', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  tourDesc: { fontSize: 13, color: '#6B5E56', marginTop: 4, lineHeight: 19 },
  tourMeta: { flexDirection: 'row', gap: 12, marginTop: 10 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontWeight: '600' },
  checkCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  selectBtn: { backgroundColor: '#2D241E', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  selectBtnText: { color: '#FDFBF7', fontSize: 17, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
});﻿import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const { width, height } = Dimensions.get('window');
const HERO_IMAGE = `${API_BASE_URL}/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg`;

const TOUR_TYPES = [
  {
    id: 'complete',
    name: 'Kompletnna prehliadka',
    icon: 'business',
    description: 'Prejdite vsetkymi 14 zastavkami katedraly.',
    duration: '~90 min',
    stops: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    color: '#D4AF37',
  },
  {
    id: 'spiritual',
    name: 'Duchovnna cesta',
    icon: 'heart',
    description: 'Vybrane zastavky s hlbsim duchovnym vykladom.',
    duration: '~60 min',
    stops: [1,2,3,5,6,7,11,14],
    color: '#9C6B3C',
  },
];

export default function TourSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSelectedTourType } = useApp();
  const [selected, setSelected] = useState('complete');

  const handleContinue = () => {
    setSelectedTourType(selected);
    router.push('/tour');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: HERO_IMAGE }} style={styles.bgImage} resizeMode="cover" blurRadius={Platform.OS === 'web' ? 0 : 4} />
      <View style={styles.bgOverlay} />
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="business" size={36} color="#D4AF37" />
        </View>
        <Text style={styles.title}>Vyber prehliadku</Text>
        <Text style={styles.subtitle}>Dom sviatej Alzbety - Kosice</Text>
        {TOUR_TYPES.map((tour) => {
          const isSelected = selected === tour.id;
          return (
            <Pressable key={tour.id} style={[styles.tourCard, isSelected && { borderColor: tour.color, borderWidth: 2 }]} onPress={() => setSelected(tour.id)}>
              {isSelected && (<View style={[styles.checkBadge, { backgroundColor: '#4CAF50' }]}><Ionicons name="checkmark" size={14} color="#fff" /></View>)}
              <View style={[styles.tourIconCircle, { backgroundColor: tour.color }]}>
                <Ionicons name={tour.icon as any} size={26} color="#2D241E" />
              </View>
              <Text style={[styles.tourName, { color: tour.color }]}>{tour.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, marginBottom: 8 }}>
                <Ionicons name="gift" size={12} color="#4CAF50" />
                <Text style={{ fontSize: 11, color: '#4CAF50', fontWeight: '700' }}>Zadarmo</Text>
              </View>
              <Text style={styles.tourDesc}>{tour.description}</Text>
              <View style={styles.includesCard}>
                <Text style={styles.includesTitle}>OBSAH:</Text>
                <Text style={styles.includesItem}>{'\u2022'} {tour.stops.length} zastavok</Text>
                <Text style={styles.includesItem}>{'\u2022'} Audio vyklad vo vybranom jazyku</Text>
                <Text style={styles.includesItem}>{'\u2022'} Fotografie kazdej zastavky</Text>
                <Text style={styles.includesItem}>{'\u2022'} Offline pristup</Text>
              </View>
              <View style={styles.durationRow}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.durationText}>{tour.duration}</Text>
              </View>
            </Pressable>
          );
        })}
        <Pressable style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]} onPress={handleContinue}>
          <Text style={styles.continueText}>Pokracovat</Text>
          <Ionicons name="arrow-forward" size={22} color="#2D241E" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D241E' },
  bgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,15,10,0.78)' },
  scrollView: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', marginBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  iconContainer: { alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#D4AF37', textAlign: 'center', marginBottom: 24, fontStyle: 'italic' },
  tourCard: { backgroundColor: 'rgba(45,36,30,0.90)', borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)', position: 'relative' },
  checkBadge: { position: 'absolute', top: 14, right: 14, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  tourIconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  tourName: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  tourDesc: { fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 20, marginBottom: 12 },
  includesCard: { backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)' },
  includesTitle: { fontSize: 11, fontWeight: '800', color: '#D4AF37', marginBottom: 6, letterSpacing: 1 },
  includesItem: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 3, paddingLeft: 2 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  durationText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  continueButton: { backgroundColor: '#D4AF37', borderRadius: 28, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  continueButtonPressed: { backgroundColor: '#B8960B', transform: [{ scale: 0.97 }] },
  continueText: { fontSize: 18, fontWeight: '800', color: '#2D241E' },
});
