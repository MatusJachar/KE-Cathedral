import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');
const CATHEDRAL_IMAGE = `${API_BASE_URL}/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg`;

// KE Cathedral â€” 2 typy prehliadky
const TOUR_DEFS: Record<string, { stops: number[]; legends: number[] }> = {
  complete:  { stops: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], legends: [] },
  spiritual: { stops: [1, 2, 3, 7, 8, 11, 13, 14],                      legends: [] },
};

const STOP_ICONS: Record<number, { icon: string; bg: string }> = {
  1:  { icon: 'enter',          bg: '#D4AF37' },  // Vitajte
  2:  { icon: 'star',           bg: '#D4AF37' },  // OltĂˇr sv. AlĹľbety
  3:  { icon: 'water',          bg: '#D4AF37' },  // ZĂˇzrak Kristovej krvi
  4:  { icon: 'flower',         bg: '#D4AF37' },  // Kaplnka sv. Antona + KrstiteÄľnica
  5:  { icon: 'key',            bg: '#D4AF37' },  // KapitulnĂˇ zakristia
  6:  { icon: 'git-merge',      bg: '#D4AF37' },  // DvojitĂ© schodisko + Empora
  7:  { icon: 'flame',          bg: '#D4AF37' },  // OltĂˇr 3 koĹˇickĂ˝ch muÄŤenĂ­kov
  8:  { icon: 'add-circle',     bg: '#D4AF37' },  // OltĂˇr povĂ˝Ĺˇenia sv. KrĂ­Ĺľa
  9:  { icon: 'image',          bg: '#D4AF37' },  // OltĂˇr s obrazom Metercie
  10: { icon: 'musical-notes',  bg: '#D4AF37' },  // OrgĂˇn + sochy krĂˇÄľov
  11: { icon: 'sunny',          bg: '#D4AF37' },  // Luster + KazateÄľnica
  12: { icon: 'ribbon',         bg: '#D4AF37' },  // ApoteĂłza RĂˇkocziho
  13: { icon: 'person',         bg: '#D4AF37' },  // OltĂˇr sv. Jozefa + Freska
  14: { icon: 'business',       bg: '#D4AF37' },  // ZĂˇver â€” Urbanova veĹľa
};

export default function TourScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tourStops, legends, selectedLanguage, selectedTourType } = useApp();

  const tourDef = useMemo(() => TOUR_DEFS[selectedTourType] || TOUR_DEFS.complete, [selectedTourType]);

  const filteredStops = useMemo(() => {
    return tourStops
      .filter(s => tourDef.stops.includes(s.stop_number))
      .sort((a, b) => a.stop_number - b.stop_number);
  }, [tourStops, tourDef]);

  const filteredLegends = useMemo(() => {
    return legends
      .filter(l => tourDef.legends.includes(l.stop_number))
      .sort((a, b) => a.stop_number - b.stop_number);
  }, [legends, tourDef]);

  const getTranslation = (stop: any) => {
    const lang = selectedLanguage;
    const fallback = 'en';
    const content = stop.content?.[lang] || stop.content?.[fallback] || Object.values(stop.content || {})[0] || {};
    const audioUrl = stop.audio?.[lang] || stop.audio?.[fallback] || Object.values(stop.audio || {})[0] || null;
    return {
      title: content?.title || '',
      description: content?.description || '',
      short_description: content?.short_description || content?.description || '',
      audio_url: audioUrl,
    };
  };

  const tourLabel = selectedTourType === 'spiritual' ? 'DuchovnĂˇ prehliadka' : 'KompletnĂˇ prehliadka';
  const tourColor = selectedTourType === 'spiritual' ? '#5D5650' : '#D4AF37';

  return (
    <View style={styles.container}>
      <Image source={{ uri: CATHEDRAL_IMAGE }} style={styles.bgImage} resizeMode="cover" blurRadius={Platform.OS === 'web' ? 0 : 5} />
      <View style={styles.bgOverlay} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#2D241E" />
        </Pressable>
        <View style={[styles.tourBadge, { backgroundColor: tourColor }]}>
          <Text style={styles.tourBadgeText}>{tourLabel}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tour Stops */}
        <View style={styles.sectionHeader}>
          <Ionicons name="navigate" size={18} color="#D4AF37" />
          <Text style={styles.sectionTitle}>ZastĂˇvky</Text>
          <Text style={styles.sectionCount}>{filteredStops.length}</Text>
        </View>

        {filteredStops.map((stop) => {
          const trans = getTranslation(stop);
          const iconDef = STOP_ICONS[stop.stop_number] || { icon: 'location', bg: '#D4AF37' };
          const hasAudio = !!trans.audio_url;

          return (
            <Pressable
              key={stop.id}
              style={({ pressed }) => [styles.stopCard, pressed && styles.stopCardPressed]}
              onPress={() => router.push(`/tour/${stop.id}`)}
            >
              <View style={[styles.stopIcon, { backgroundColor: iconDef.bg }]}>
                <Ionicons name={iconDef.icon as any} size={20} color="#2D241E" />
              </View>
              <View style={styles.stopContent}>
                <View style={styles.stopTopRow}>
                  <Text style={styles.stopNumber}>#{stop.stop_number}</Text>
                  {hasAudio && (
                    <View style={styles.audioBadge}>
                      <Ionicons name="headset" size={10} color="#D4AF37" />
                    </View>
                  )}
                </View>
                <Text style={styles.stopTitle} numberOfLines={1}>{trans.title || 'ZastĂˇvka'}</Text>
                <Text style={styles.stopDesc} numberOfLines={2}>{trans.short_description}</Text>
              </View>
              <View style={styles.playIcon}>
                <Ionicons name="chevron-forward" size={18} color="#D4AF37" />
              </View>
            </Pressable>
          );
        })}

        {/* Legends â€” zatiaÄľ prĂˇzdne, pripravenĂ© pre budĂşcnosĹĄ */}
        {filteredLegends.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 28 }]}>
              <Ionicons name="book" size={18} color="#D4AF37" />
              <Text style={styles.sectionTitle}>PrĂ­behy</Text>
              <Text style={styles.sectionCount}>{filteredLegends.length}</Text>
            </View>

            {filteredLegends.map((legend) => {
              const trans = getTranslation(legend);
              const hasAudio = !!trans.audio_url;

              return (
                <Pressable
                  key={legend.id}
                  style={({ pressed }) => [styles.legendCard, pressed && styles.legendCardPressed]}
                  onPress={() => router.push(`/tour/${legend.id}`)}
                >
                  <View style={styles.legendIcon}>
                    <Ionicons name="book" size={22} color="#2D241E" />
                  </View>
                  <View style={styles.legendContent}>
                    <Text style={styles.legendTitle} numberOfLines={1}>{trans.title || 'PrĂ­beh'}</Text>
                    <Text style={styles.legendDesc} numberOfLines={2}>{trans.short_description}</Text>
                  </View>
                  <View style={styles.legendRight}>
                    {hasAudio && <Ionicons name="headset" size={20} color="#D4AF37" />}
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D241E' },
  bgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45, 36, 30, 0.72)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, zIndex: 2 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(253,251,247,0.15)', justifyContent: 'center', alignItems: 'center' },
  tourBadge: { flex: 1, alignSelf: 'center', marginHorizontal: 12, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center' },
  tourBadgeText: { fontSize: 14, fontWeight: '800', color: '#FDFBF7' },
  scrollView: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#FDFBF7' },
  sectionCount: { fontSize: 13, fontWeight: '700', color: 'rgba(253,251,247,0.4)', marginLeft: 'auto' },
  stopCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(253,251,247,0.08)', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)' },
  stopCardPressed: { backgroundColor: 'rgba(253,251,247,0.14)', borderColor: 'rgba(212,175,55,0.4)' },
  stopIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stopContent: { flex: 1 },
  stopTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  stopNumber: { fontSize: 11, fontWeight: '800', color: 'rgba(253,251,247,0.4)' },
  audioBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(212,175,55,0.2)', justifyContent: 'center', alignItems: 'center' },
  stopTitle: { fontSize: 16, fontWeight: '700', color: '#FDFBF7', marginBottom: 3 },
  stopDesc: { fontSize: 12, color: 'rgba(253,251,247,0.5)', lineHeight: 17 },
  playIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(212,175,55,0.15)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  legendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)' },
  legendCardPressed: { backgroundColor: 'rgba(212,175,55,0.14)', borderColor: 'rgba(212,175,55,0.45)' },
  legendIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  legendContent: { flex: 1 },
  legendTitle: { fontSize: 16, fontWeight: '800', color: '#FDFBF7', marginBottom: 3 },
  legendDesc: { fontSize: 12, color: 'rgba(253,251,247,0.5)', lineHeight: 17 },
  legendRight: { marginLeft: 8 },
});

