import React, { useEffect, useState } from 'react';
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

const LABELS = {
  back: { sk: 'Späť', en: 'Back', de: 'Zurück', hu: 'Vissza', pl: 'Wróć', fr: 'Retour', it: 'Indietro', es: 'Volver', uk: 'Назад' },
  stop: { sk: 'Zastávka', en: 'Stop', de: 'Station', hu: 'Megálló', pl: 'Przystanek', fr: 'Arrêt', it: 'Fermata', es: 'Parada', uk: 'Зупинка' },
  next: { sk: 'Ďalej', en: 'Next', de: 'Weiter', hu: 'Következő', pl: 'Dalej', fr: 'Suivant', it: 'Avanti', es: 'Siguiente', uk: 'Далі' },
  prev: { sk: 'Predch.', en: 'Prev', de: 'Zurück', hu: 'Előző', pl: 'Poprz.', fr: 'Préc.', it: 'Prec.', es: 'Ant.', uk: 'Попер.' },
  finish: { sk: 'Dokončiť', en: 'Finish', de: 'Beenden', hu: 'Befejezés', pl: 'Zakończ', fr: 'Terminer', it: 'Fine', es: 'Finalizar', uk: 'Завершити' },
};

function t(key, lang) {
  return LABELS[key]?.[lang] ?? LABELS[key]?.['en'] ?? key;
}

export default function TourStopScreen() {
  const { stopId, tourId, stopIndex, tourStops } = useLocalSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState('sk');
  const [stop, setStop] = useState(null);
  const [loading, setLoading] = useState(true);

  const allStops = tourStops ? JSON.parse(tourStops) : [];
  const currentIdx = parseInt(stopIndex ?? '0');
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === allStops.length - 1;

  useEffect(() => {
    AsyncStorage.getItem('selectedLanguage').then(v => { if (v) setLang(v); });
  }, []);

  useEffect(() => { fetchStop(); }, [stopId]);

  async function fetchStop() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE + '/api/stops/' + stopId);
      const data = await res.json();
      setStop(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function goNext() {
    if (isLast) { router.back(); return; }
    router.push({ pathname: '/tour/stop', params: { stopId: allStops[currentIdx + 1], tourId, stopIndex: String(currentIdx + 1), tourStops } });
  }

  function goPrev() {
    if (isFirst) return;
    router.push({ pathname: '/tour/stop', params: { stopId: allStops[currentIdx - 1], tourId, stopIndex: String(currentIdx - 1), tourStops } });
  }

  const title = stop?.translations?.[lang]?.title ?? stop?.translations?.['en']?.title ?? '';
  const description = stop?.translations?.[lang]?.description ?? stop?.translations?.['en']?.description ?? '';
  const imageUri = stop?.imageUrl ? (stop.imageUrl.startsWith('http') ? stop.imageUrl : API_BASE + stop.imageUrl) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#2D241E" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#FDFBF7" />
          <Text style={styles.backText}>{t('back', lang)}</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.stopLabel}>{t('stop', lang)}</Text>
          <Text style={styles.stopCounter}>{currentIdx + 1} / {allStops.length}</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="business" size={64} color="#D4AF37" opacity={0.5} />
            </View>
          )}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: ((currentIdx + 1) / allStops.length * 100) + '%' }]} />
          </View>
          <View style={styles.content}>
            <View style={styles.stopBadge}>
              <Text style={styles.stopBadgeText}>{currentIdx + 1}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{description}</Text>
            <View style={{ height: 120 }} />
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Pressable style={[styles.navBtn, styles.navBtnSecondary, isFirst && styles.navBtnDisabled]} onPress={goPrev} disabled={isFirst}>
          <Ionicons name="chevron-back" size={20} color={isFirst ? '#aaa' : '#2D241E'} />
          <Text style={[styles.navBtnText, { color: isFirst ? '#aaa' : '#2D241E' }]}>{t('prev', lang)}</Text>
        </Pressable>
        <View style={styles.dots}>
          {allStops.slice(Math.max(0, currentIdx - 2), Math.min(allStops.length, currentIdx + 3)).map((_, i) => {
            const ai = Math.max(0, currentIdx - 2) + i;
            return <View key={ai} style={[styles.dot, ai === currentIdx && styles.dotActive]} />;
          })}
        </View>
        <Pressable style={[styles.navBtn, styles.navBtnPrimary]} onPress={goNext}>
          <Text style={[styles.navBtnText, { color: '#FDFBF7' }]}>{isLast ? t('finish', lang) : t('next', lang)}</Text>
          <Ionicons name={isLast ? 'checkmark' : 'chevron-forward'} size={20} color="#FDFBF7" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2D241E' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#2D241E' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60 },
  backText: { color: '#FDFBF7', fontSize: 14 },
  headerCenter: { alignItems: 'center' },
  stopLabel: { color: '#D4AF37', fontSize: 11, letterSpacing: 2 },
  stopCounter: { color: '#FDFBF7', fontSize: 16, fontWeight: '700' },
  scroll: { flex: 1, backgroundColor: '#FDFBF7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFBF7' },
  heroImage: { width: '100%', height: height * 0.38 },
  heroPlaceholder: { width: '100%', height: height * 0.38, backgroundColor: '#EDE8DF', justifyContent: 'center', alignItems: 'center' },
  progressBar: { height: 3, backgroundColor: '#EDE8DF' },
  progressFill: { height: 3, backgroundColor: '#D4AF37' },
  content: { padding: 24 },
  stopBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  stopBadgeText: { color: '#2D241E', fontSize: 16, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '800', color: '#2D241E', lineHeight: 34, marginBottom: 16 },
  divider: { height: 2, width: 50, backgroundColor: '#D4AF37', marginBottom: 20 },
  description: { fontSize: 16, color: '#4A3F38', lineHeight: 28 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, paddingBottom: Platform.OS === 'ios' ? 28 : 14, backgroundColor: '#FDFBF7', borderTopWidth: 1, borderTopColor: '#EDE8DF' },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  navBtnPrimary: { backgroundColor: '#2D241E' },
  navBtnSecondary: { backgroundColor: '#EDE8DF' },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 15, fontWeight: '700' },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C4B99A' },
  dotActive: { width: 18, height: 6, borderRadius: 3, backgroundColor: '#D4AF37' },
});
