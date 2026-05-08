import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useApp } from '../../context/AppContext';
import { API_BASE_URL } from '../../constants/api';

const { width } = Dimensions.get('window');

export default function StopDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tourStops, selectedLanguage } = useApp();
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stop = tourStops.find((s: any) => s.id === id || String(s.stop_number) === String(id));

  useEffect(() => {
    return () => { if (sound) sound.unloadAsync(); };
  }, [sound]);

  if (!stop) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D241E" />
        </TouchableOpacity>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      </SafeAreaView>
    );
  }

  const lang = selectedLanguage || 'sk';
  const translation = stop.translations?.find((t: any) => t.language_code === lang) || stop.translations?.[0] || {};
  const title = translation?.title || `Zastávka ${stop.stop_number}`;
  const description = translation?.description || '';
  const audioUrl = translation?.audio_url || null;
  const imageUrl = stop.image_url
    ? `${API_BASE_URL.replace('/api', '')}${stop.image_url}`
    : null;

  const toggleAudio = async () => {
    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      return;
    }
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
      return;
    }
    if (!audioUrl) return;
    setIsLoading(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `${API_BASE_URL.replace('/api', '')}/uploads/audio/${audioUrl}` },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
    } catch (e) {
      console.error('Audio error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#2D241E" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color="#D4AF37" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.stopNumber}>Zastávka #{stop.stop_number}</Text>
          <Text style={styles.title}>{title}</Text>

          {audioUrl ? (
            <TouchableOpacity style={styles.audioBtn} onPress={toggleAudio} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
              )}
              <Text style={styles.audioBtnText}>
                {isLoading ? 'Načítava...' : isPlaying ? 'Pozastaviť' : 'Prehrať audio'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.noAudio}>
              <Ionicons name="headset-outline" size={20} color="#9C8B6E" />
              <Text style={styles.noAudioText}>Audio nie je k dispozícii</Text>
            </View>
          )}

          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(253,251,247,0.9)', justifyContent: 'center', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width, height: 280 },
  imagePlaceholder: { width: width, height: 280, backgroundColor: '#EDE8DF', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  stopNumber: { fontSize: 13, color: '#9C8B6E', fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: '#2D241E', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 20 },
  audioBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D4AF37', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  audioBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  noAudio: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24, opacity: 0.6 },
  noAudioText: { fontSize: 14, color: '#9C8B6E' },
  description: { fontSize: 16, color: '#2D241E', lineHeight: 26, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
});