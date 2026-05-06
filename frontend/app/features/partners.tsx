import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const PARTNERS = [
  { name: 'Košické arcibiskupstvo', description: 'Rímskokatolická cirkev — arcidiecéza Košice. Správca Dómu sv. Alžbety.', icon: 'business', color: '#D4AF37', web: 'https://www.ke-arcidieceza.sk' },
  { name: 'Mesto Košice', description: 'Hlavné mesto Východného Slovenska.', icon: 'home', color: '#2196F3', web: 'https://www.kosice.sk' },
  { name: 'Visit Košice', description: 'Oficiálny turistický portál mesta Košice.', icon: 'map', color: '#4CAF50', web: 'https://www.visitkosice.eu' },
  { name: 'Slovakia Travel', description: 'Oficiálna slovenská turistická organizácia.', icon: 'airplane', color: '#FF5722', web: 'https://www.slovakia.travel' },
];

export default function PartnersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Partneri</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Naši partneri</Text>
        <Text style={styles.subtitle}>Dóm sv. Alžbety spolupracuje s miestnymi organizáciami.</Text>
        {PARTNERS.map((partner, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: partner.color }]}>
                <Ionicons name={partner.icon as any} size={22} color="#fff" />
              </View>
              <Text style={styles.partnerName}>{partner.name}</Text>
            </View>
            <Text style={styles.partnerDesc}>{partner.description}</Text>
            <Pressable style={styles.webBtn} onPress={() => Linking.openURL(partner.web)}>
              <Ionicons name="globe-outline" size={16} color="#fff" />
              <Text style={styles.webBtnText}>Navštíviť webstránku</Text>
            </Pressable>
          </View>
        ))}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#D4AF37" />
          <Text style={styles.infoText}>Máte záujem o partnerstvo? Kontaktujte nás.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.text.primary },
  content: { paddingHorizontal: 16 },
  mainTitle: { fontSize: 20, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', marginBottom: 8, marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  partnerName: { fontSize: 16, fontWeight: '700', color: Colors.text.primary, flex: 1 },
  partnerDesc: { fontSize: 13, color: Colors.text.secondary, lineHeight: 20, marginBottom: 12 },
  webBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D241E', borderRadius: 10, paddingVertical: 10, gap: 8 },
  webBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14, marginTop: 8 },
  infoText: { fontSize: 13, color: Colors.text.secondary, flex: 1, lineHeight: 20 },
});
