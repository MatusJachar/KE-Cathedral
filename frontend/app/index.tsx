import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, ActivityIndicator, ScrollView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const { width, height } = Dimensions.get('window');
const HERO_IMAGE = `${API_BASE_URL}/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg`;
const CATHEDRAL_MAP = 'https://raw.githubusercontent.com/MatusJachar/KE-Cathedral/main/frontend/assets/images/cathedral_map.png';

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { loadData, isLoading, tourStops, languages } = useApp();
    const [showMapModal, setShowMapModal] = useState(false);
    const [mapRotation, setMapRotation] = useState(0);

  const rotateMap = () => setMapRotation(r => (r + 90) % 360);
    const resetMap = () => setMapRotation(0);

  useEffect(() => {
        loadData();
  }, []);

  if (isLoading) {
        return (
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                          <ActivityIndicator size="large" color="#D4AF37" />
                </View>View>
              );
  }

  return (
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
          {/* HERO */}
                <View style={[styles.heroSection, { paddingTop: insets.top + 20 }]}>
                          <Image source={{ uri: HERO_IMAGE }} style={styles.heroBackground} resizeMode="cover" blurRadius={Platform.OS === 'web' ? 0 : 2} />
                          <View style={styles.heroOverlay} />
                          <View style={styles.heroContent}>
                                      <View style={styles.logoContainer}>
                                                    <Ionicons name="business" size={48} color="#D4AF37" />
                                      </View>View>
                                      <Text style={styles.title}>Dom sv. Alžbety</Text>Text>
                                      <Text style={styles.subtitle}>Sanctuary Light · Audio Guide</Text>Text>
                                      <Text style={styles.descWhite}>Najväčší gotický chrám na Slovensku – katedrála košického arcibiskupstva.</Text>Text>
                                      <Text style={styles.descYellow}>Audio sprievodca v 9 jazykoch.</Text>Text>
                                      <Pressable
                                                    style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
                                                    onPress={() => router.push('/language')}
                                                  >
                                                  <Text style={styles.startButtonText}>Začať prehliadku</Text>Text>
                                                  <Ionicons name="arrow-forward" size={22} color="#fff" />
                                      </Pressable>Pressable>
                                    <View style={styles.statsRow}>
                                                <View style={styles.statItem}>
                                                              <Text style={styles.statNumber}>{languages.length || 9}</Text>Text>
                                                              <Text style={styles.statLabel}>Jazyky</Text>Text>
                                                </View>View>
                                                <View style={styles.statDot} />
                                                <View style={styles.statItem}>
                                                              <Text style={styles.statNumber}>{tourStops.length || 14}</Text>Text>
                                                              <Text style={styles.statLabel}>Zastávky</Text>Text>
                                                </View>View>
                                                <View style={styles.statDot} />
                                                <View style={styles.statItem}>
                                                              <Text style={styles.statNumber}>14c</Text>Text>
                                                              <Text style={styles.statLabel}>Storočie</Text>Text>
                                                </View>View>
                                    </View>View>
                          </View>View>
                </View>View>
        
          {/* ICON MENU */}
              <View style={styles.menuSection}>
                      <View style={styles.iconRow}>
                                <Pressable style={styles.iconItem} onPress={() => router.push('/features/info')}>
                                            <View style={[styles.iconCircle, { backgroundColor: '#4CAF50' }]}>
                                                          <Ionicons name="information-circle" size={26} color="#fff" />
                                            </View>View>
                                            <Text style={styles.iconLabel}>Info</Text>Text>
                                </Pressable>Pressable>
                                <Pressable style={styles.iconItem} onPress={() => router.push('/features/partners')}>
                                            <View style={[styles.iconCircle, { backgroundColor: '#00BCD4' }]}>
                                                          <Ionicons name="business" size={24} color="#fff" />
                                            </View>View>
                                            <Text style={styles.iconLabel}>Partneri</Text>Text>
                                </Pressable>Pressable>
                                <Pressable style={styles.iconItem} onPress={() => router.push('/features/transport')}>
                                            <View style={[styles.iconCircle, { backgroundColor: '#2196F3' }]}>
                                                          <Ionicons name="car" size={24} color="#fff" />
                                            </View>View>
                                            <Text style={styles.iconLabel}>Doprava</Text>Text>
                                </Pressable>Pressable>
                        {/* VIDEO - skryte */}
                        {/* <Pressable style={styles.iconItem} onPress={() => router.push('/features/video')}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#E91E63' }]}>
                                                  <Ionicons name="videocam" size={24} color="#fff" />
                                                              </View>
                                                                          <Text style={styles.iconLabel}>Videá</Text>
                                                                                    </Pressable> */}
                        {/* DONATE - skryte, pripravene */}
                        {/* <Pressable style={styles.iconItem} onPress={() => router.push('/features/support')}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#FF9800' }]}>
                                                  <Ionicons name="heart" size={24} color="#fff" />
                                                              </View>
                                                                          <Text style={styles.iconLabel}>Podporte</Text>
                                                                                    </Pressable> */}
                                <Pressable style={styles.iconItem} onPress={() => router.push('/admin')}>
                                            <View style={[styles.iconCircle, { backgroundColor: '#9C27B0' }]}>
                                                          <Ionicons name="settings" size={24} color="#fff" />
                                            </View>View>
                                            <Text style={styles.iconLabel}>Admin</Text>Text>
                                </Pressable>Pressable>
                      </View>View>
              </View>View>
        
          {/* CATHEDRAL MAP */}
              <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                                <Ionicons name="map" size={20} color="#D4AF37" />
                                <Text style={styles.sectionTitle}>Pôdorys katedrály</Text>Text>
                      </View>View>
                      <Pressable onPress={() => setShowMapModal(true)} style={styles.mapThumb}>
                                <Image source={{ uri: CATHEDRAL_MAP }} style={styles.mapImage} resizeMode="contain" />
                                <View style={styles.mapOverlay}>
                                            <Ionicons name="expand" size={22} color="#fff" />
                                            <Text style={styles.mapOverlayText}>Klepni pre zväčšenie</Text>Text>
                                </View>View>
                      </Pressable>Pressable>
              </View>View>
        
          {/* HIGHLIGHTS */}
              <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                                <Ionicons name="star" size={20} color="#D4AF37" />
                                <Text style={styles.sectionTitle}>Zaujímavosti</Text>Text>
                      </View>View>
                      <View style={styles.hoursCard}>
                                <View style={styles.hoursRow}>
                                            <Ionicons name="resize" size={16} color="#D4AF37" />
                                            <Text style={styles.hoursLabel}>Dĺžka interiéru</Text>Text>
                                            <Text style={styles.hoursValue}>55 m</Text>Text>
                                </View>View>
                                <View style={styles.hoursDivider} />
                                <View style={styles.hoursRow}>
                                            <Ionicons name="arrow-up" size={16} color="#D4AF37" />
                                            <Text style={styles.hoursLabel}>Výška hlavnej veže</Text>Text>
                                            <Text style={styles.hoursValue}>59 m</Text>Text>
                                </View>View>
                                <View style={styles.hoursDivider} />
                                <View style={styles.hoursRow}>
                                            <Ionicons name="time" size={16} color="#D4AF37" />
                                            <Text style={styles.hoursLabel}>Výstavba</Text>Text>
                                            <Text style={styles.hoursValue}>150 rokov</Text>Text>
                                </View>View>
                                <View style={styles.hoursDivider} />
                                <View style={styles.hoursRow}>
                                            <Ionicons name="calendar" size={16} color="#D4AF37" />
                                            <Text style={styles.hoursLabel}>Prvá zmienka</Text>Text>
                                            <Text style={styles.hoursValue}>13. storočie</Text>Text>
                                </View>View>
                      </View>View>
              </View>View>
        
          {/* OPENING HOURS */}
              <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                                <Ionicons name="time" size={20} color="#D4AF37" />
                                <Text style={styles.sectionTitle}>Otváracie hodiny</Text>Text>
                      </View>View>
                      <View style={styles.hoursCard}>
                                <View style={st</Pressable>
