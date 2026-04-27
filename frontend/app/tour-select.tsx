import React, { useState, useEffect } from 'react';
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
