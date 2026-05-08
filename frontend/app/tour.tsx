import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../constants/api';

export default function TourScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tourStops, selectedLanguage } = useApp();

  const getTranslation = (stop: any) => {
    const lang = selectedLanguage || 'sk';
    const translation = stop.translations?.find((t: any) => t.language_code === lang) || stop.translations?.[0] || {};
    return {
      title: translation?.title || `Zastávka ${stop.stop_number}`,
      audio_url: translation?.audio_url || null,
    };
  };

  const stops = useMemo(() => {
    return tourStops
      .filter((s: any) => [1,2,3,4,5,6,7,8,9,10,11,12,13,14].includes(s.stop_number))
      .sort((a: any, b: any) => a.stop_number - b.stop_number);
  }, [tourStops]);

  const renderStop = ({ item }: { item: any }) => {
    const trans = getTranslation(item);
    const imageUrl = item.image_url
      ? `${API_BASE_URL.replace('/api', '')}${item.image_url}`
      : null;
    const hasAudio = !!trans.audio_url;

    return (
      <TouchableOpacity
        style={styles.stopCard}
        onPress={() => router.push(`/tour/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.stopImage} contentFit="cover" />
          ) : (
            <View style={[styles.stopImage, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={28} color="#D4AF37" />
            </View>
          )}
          <View style={styles.stopNumberBadge}>
            <Text style={styles.stopNumberText}>{item.stop_number}</Text>
          </View>
        </View>
        <View style={styles.stopInfo}>
          <Text style={styles.stopTitle} numberOfLines={2}>{trans.title}</Text>
          {hasAudio && (
            <View style={styles.metaItem}>
              <Ionicons name="headset-outline" size={14} color="#D4AF37" />
              <Text style={[styles.metaText, { color: '#D4AF37' }]}>Audio</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#78716c" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zastávky katedrály</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={stops}
        renderItem={renderStop}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E0D8' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5DC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1C1917', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  listContent: { padding: 16 },
  stopCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E5E0D8' },
  imageContainer: { position: 'relative' },
  stopImage: { width: 80, height: 80, borderRadius: 12 },
  imagePlaceholder: { backgroundColor: '#F3EBE3', justifyContent: 'center', alignItems: 'center' },
  stopNumberBadge: { position: 'absolute', top: -6, left: -6, width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  stopNumberText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  stopInfo: { flex: 1, marginLeft: 12 },
  stopTitle: { fontSize: 16, fontWeight: '700', color: '#1C1917', marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#78716c' },
  separator: { height: 12 },
});