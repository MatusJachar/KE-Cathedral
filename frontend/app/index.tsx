import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, ActivityIndicator, ScrollView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const { width, height } = Dimensions.get('window');
const HERO_IMAGE = `${API_BASE_URL}/uploads/images/fb2f9335-ab15-4f80-aa3d-2a1c35c93faa.jpg`;
const CATHEDRAL_MAP = 'https://raw.githubusercontent.com/MatusJachar/KE-Cathedral/main/frontend/assets/images/cathedral_map.png';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loadData, isLoading } = useApp();
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapRotation, setMapRotation] = useState(0);

  useEffect(() => { loadData(); }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <View style={{ height: height * 0.88 }}>
        <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <View style={styles.heroGradient} />
        <View style={[styles.heroTop, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.label}>KOŠICE · SLOVENSKO</Text>
        </View>
        <View style={styles.heroBottom}>
          <Text style={styles.heroTitle}>Dóm{'\n'}sv. Alžbety</Text>
          <Text style={styles.heroSub}>Audio sprievodca</Text>
          <Text style={styles.heroDesc}>Najväčší gotický chrám na Slovensku.{'\n'}Katedrála košického arcibiskupstva.</Text>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={() => router.push('/language')}
          >
            <Text style={styles.btnText}>Začať prehliadku</Text>
            <Ionicons name="arrow-forward" size={20} color="#2D241E" />
          </Pressable>
        </View>
      </View>

      {/* ── MENU ─────────────────────────────────────────────────── */}
      <View style={styles.menuCard}>
        {[
          { label: 'Admin',    icon: 'settings',  color: '#5C8A5C', route: '/admin' },
          { label: 'Okolie',   icon: 'location',  color: '#4A7A9B', route: '/features/nearby' },
          { label: 'Doprava',  icon: 'car',       color: '#C17A30', route: '/features/transport' },
          { label: 'Partneri', icon: 'business',  color: '#7A5C8A', route: '/features/partners' },
          { label: 'Podpora',  icon: 'heart',     color: '#9B4A6A', route: '/features/support' },
        ].map(item => (
          <Pressable key={item.label} style={styles.menuItem} onPress={() => router.push(item.route as any)}>
            <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={22} color="#fff" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── MAPA ─────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Ionicons name="map" size={18} color="#D4AF37" />
          <Text style={styles.sectionTitle}>Pôdorys katedrály</Text>
        </View>
        <Pressable onPress={() => setShowMapModal(true)} style={styles.mapBox}>
          <Image source={{ uri: CATHEDRAL_MAP }} style={styles.mapImage} resizeMode="contain" />
          <View style={styles.mapBadge}>
            <Ionicons name="expand" size={16} color="#fff" />
            <Text style={styles.mapBadgeText}>Zväčšiť</Text>
          </View>
        </Pressable>
      </View>

      <View style={{ height: insets.bottom + 40 }} />

      {/* ── MAP MODAL ────────────────────────────────────────────── */}
      <Modal visible={showMapModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalToolbar, { top: insets.top + 12 }]}>
            <Pressable style={styles.modalBtn} onPress={() => setMapRotation(r => (r + 90) % 360)}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.modalBtnText}>Otočiť</Text>
            </Pressable>
            <Pressable style={[styles.modalBtn, { backgroundColor: 'rgba(180,40,40,0.7)' }]} onPress={() => { setShowMapModal(false); setMapRotation(0); }}>
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={styles.modalBtnText}>Zavrieť</Text>
            </Pressable>
          </View>
          <Image source={{ uri: CATHEDRAL_MAP }} style={[styles.modalImage, { transform: [{ rotate: `${mapRotation}deg` }] }]} resizeMode="contain" />
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#FDFBF7' },
  loader:         { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFBF7' },

  // Hero
  heroGradient:   { ...StyleSheet.absoluteFillObject, background: 'transparent',
                    backgroundColor: 'transparent',
                    // gradient simulácia cez overlay vrstvy
                  },
  heroTop:        { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 24 },
  label:          { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 3 },
  heroBottom:     { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 36,
                    backgroundColor: 'rgba(0,0,0,0)', },
  heroTitle:      { fontSize: 48, fontWeight: '800', color: '#fff', lineHeight: 52,
                    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
                    textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  heroSub:        { fontSize: 13, color: '#D4AF37', fontWeight: '700', letterSpacing: 3, marginTop: 6, marginBottom: 10 },
  heroDesc:       { fontSize: 14, color: '#fff', lineHeight: 22, marginBottom: 20, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  btn:            { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#D4AF37',
                    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 32, alignSelf: 'flex-start' },
  btnPressed:     { backgroundColor: '#B8960B', transform: [{ scale: 0.97 }] },
  btnText:        { fontSize: 16, fontWeight: '800', color: '#2D241E' },

  // Menu
  menuCard:       { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff',
                    marginHorizontal: 16, marginTop: -28, borderRadius: 20, paddingVertical: 20,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08,
                    shadowRadius: 12, elevation: 6 },
  menuItem:       { alignItems: 'center', gap: 6 },
  menuIcon:       { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  menuLabel:      { fontSize: 11, fontWeight: '600', color: '#44403c' },

  // Sekcie
  section:        { paddingHorizontal: 16, paddingTop: 16 },
  sectionRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle:   { fontSize: 17, fontWeight: '700', color: '#1C1917', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

  // Mapa
  mapBox:         { height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: '#EDE8DF' },
  mapImage:       { width: '100%', height: '100%' },
  mapBadge:       { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', alignItems: 'center',
                    gap: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 5,
                    borderRadius: 20 },
  mapBadgeText:   { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Modal
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.94)', justifyContent: 'center', alignItems: 'center' },
  modalToolbar:   { position: 'absolute', right: 16, zIndex: 10, flexDirection: 'row', gap: 10 },
  modalBtn:       { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)',
                    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  modalBtnText:   { color: '#fff', fontSize: 12, fontWeight: '600' },
  modalImage:     { width: width, height: height * 0.85 },
});