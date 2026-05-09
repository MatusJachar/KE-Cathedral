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
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Nájdeme aktuálnu a ďalšiu zastávku
  const stops = [...tourStops].sort((a: any, b: any) => a.stop_number - b.stop_number);
  const stop = stops.find((s: any) => s.id === id || String(s.stop_number) === String(id));
  const currentIndex = stops.findIndex((s: any) => s.id === id || String(s.stop_number) === String(id));
  const nextStop = stops[currentIndex + 1] || null;

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

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

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
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `${API_BASE_URL.replace('/api', '')}/uploads/audio/${audioUrl}` },
        { shouldPlay: true },
        (status: any) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            if (status.didJustFinish) setIsPlaying(false);
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (e) {
      console.error('Audio error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNext = () => {
    if (sound) sound.unloadAsync();
    setSound(null);
    setIsPlaying(false);
    router.replace(`/tour/${nextStop.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#2D241E" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fotka */}
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

          {/* Audio player */}
          {audioUrl ? (
            <View style={styles.audioCard}>
              <TouchableOpacity style={styles.playBtn} onPress={toggleAudio} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
                )}
              </TouchableOpacity>
              <View style={styles.audioInfo}>
                <Text style={styles.audioLabel}>{isPlaying ? 'Prehráva sa...' : 'Audio sprievodca'}</Text>
                {duration > 0 && (
                  <Text style={styles.audioTime}>{formatTime(position)} / {formatTime(duration)}</Text>
                )}
                {duration > 0 && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(position / duration) * 100}%` }]} />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.noAudio}>
              <Ionicons name="headset-outline" size={20} color="#9C8B6E" />
              <Text style={styles.noAudioText}>Audio nie je k dispozícii</Text>
            </View>
          )}

          {/* Popis */}
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Next stop button */}
      {nextStop && (
        <View style={styles.nextContainer}>
          <TouchableOpacity style={styles.nextBtn} onPress={goToNext}>
            <View style={styles.nextBtnContent}>
              <View>
                <Text style={styles.nextLabel}>Ďalšia zastávka</Text>
                <Text style={styles.nextTitle} numberOfLines={1}>
                  {nextStop.translations?.find((t: any) => t.language_code === (selectedLanguage || 'sk'))?.title || `Zastávka ${nextStop.stop_number}`}
                </Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={36} color="#D4AF37" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#FDFBF7' },
  backBtn:          { position: 'absolute', top: 16, left: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(253,251,247,0.9)', justifyContent: 'center', alignItems: 'center' },
  centered:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image:            { width: width, height: 280 },
  imagePlaceholder: { width: width, height: 280, backgroundColor: '#EDE8DF', justifyContent: 'center', alignItems: 'center' },
  content:          { padding: 20, paddingBottom: 100 },
  stopNumber:       { fontSize: 13, color: '#9C8B6E', fontWeight: '600', marginBottom: 4 },
  title:            { fontSize: 26, fontWeight: '800', color: '#2D241E', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 20 },
  audioCard:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2D241E', borderRadius: 16, padding: 16, gap: 14, marginBottom: 24 },
  playBtn:          { width: 52, height: 52, borderRadius: 26, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center' },
  audioInfo:        { flex: 1 },
  audioLabel:       { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  audioTime:        { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
  progressBar:      { height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  progressFill:     { height: 3, backgroundColor: '#D4AF37', borderRadius: 2 },
  noAudio:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24, opacity: 0.6 },
  noAudioText:      { fontSize: 14, color: '#9C8B6E' },
  description:      { fontSize: 16, color: '#2D241E', lineHeight: 26, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  nextContainer:    { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FDFBF7', borderTopWidth: 1, borderTopColor: '#EDE8DF' },
  nextBtn:          { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EDE8DF' },
  nextBtnContent:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nextLabel:        { fontSize: 12, color: '#9C8B6E', fontWeight: '600', marginBottom: 2 },
  nextTitle:        { fontSize: 16, fontWeight: '700', color: '#2D241E' },
});