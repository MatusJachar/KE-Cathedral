import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const PARTNERS = [
  { name: 'Košické arcibiskupstvo', description: 'Rimsškokatolická cirkev — arcidiecéza Košice. Spávca Dómu sv. Alžbety.', icon: 'business', color: '#D4AF37', web: 'https://www.ke-arcidieceza.sk' },
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
        <Text style={styles.mainTitle}>Naši partneri v Košiciach</Text>
        <Text style={styles.subtitle}>Dóm sv. Alžbety spolupracuje s miestými organizáciami na podpore cestovného ruchu.</Text>
        {PARTNERS.map((partner, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: partner.color }]}>
                <Ionicons name={partner.icon} size={22} color="#fff" />
              </View>
              <Text style={styles.partnerName}>{partner.name}</Text>
            </View>
            <Text style={styles.partnerDesc}>{partner.description}</Text>
            {partner.web && (
              <Pressable style={styles.webBtn} onPress={() => Linking.openURL(partner.web)}>
                <Ionicons name="globe-outline" size={16} color="#fff" />
                <Text style={styles.webBtnText}>Navštíviť webstránku</Text>
              </Pressable>
            )}
          </View>
        ))}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#D4AF37" />
          <Text style={styles.infoText}>Máte záujem o partnerstvo? Kontaktujte nás na dom@dominikani.sk</Text>
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
  card: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  partnerName: { fontSize: 16, fontWeight: '700', color: Colors.text.primary, flex: 1 },
  partnerDesc: { fontSize: 13, color: Colors.text.secondary, lineHeight: 20, marginBottom: 12 },
  webBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D241E', borderRadius: 10, paddingVertical: 10, gap: 8 },
  webBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14, marginTop: 8 },
  infoText: { fontSize: 13, color: Colors.text.secondary, flex: 1, lineHeight: 20 },
});import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const PARTNERS = [
  {
    name: 'Košické arcibiskupstvo',
    description: 'Rimsškokatolická cirkev — arcidiecéza Košice. Spávca Dómu sv. Alžbety.',
    icon: 'business',
    color: '#D4AF37',
    web: 'https://www.ke-arcidieceza.sk',
  },
  {
    name: 'Mesto Košice',
    description: 'Hlavné mesto Východného Slovenska a druhé najväčšie mesto Slovenska.',
    icon: 'home',
    color: '#2196F3',
    web: 'https://www.kosice.sk',
  },
  {
    name: 'Visit Košice',
    description: 'Oficiálny turistický portol mesta Košice. Informácie o cestovnom ruchu a atrakciách.',
    icon: 'map',
    color: '#4CAF50',
    web: 'https://www.visitkosice.eu',
  },
  {
    name: 'Košice Turósmo',
    description: 'Informácie o kulturných podujatiach a turistických atrakciách v Košiciach.',
    icon: 'globe',
    color: '#9C27B0',
    web: 'https://www.visitkosice.eu',
  },
  {
    name: 'Slovakia Travel',
    description: 'Oficiálna slovínská turistická organizácia. Objavte krásy Slovenska.',
    icon: 'airplane',
    color: '#FF5722',
    web: 'https://www.slovakia.travel',
  },
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

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>Naši partneri v Košiciach</Text>
        <Text style={styles.subtitle}>
          Dóm sv. Alžbety spolupracuje s miestými organizáciami na podpore cestovného ruchu a kultúrneho dedisťva Košíc.
        </Text>

        {PARTNERS.map((partner, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: partner.color }]}>
                <Ionicons name={partner.icon as any} size={22} color="#fff" />
              </View>
              <Text style={styles.partnerName}>{partner.name}</Text>
            </View>
            <Text style={styles.partnerDesc}>{partner.description}</Text>
            {partner.web && (
              <Pressable
                style={styles.webBtn}
                onPress={() => Linking.openURL(partner.web)}
              >
                <Ionicons name="globe-outline" size={16} color="#fff" />
                <Text style={styles.webBtnText}>Navštíviť webstránku</Text>
              </Pressable>
            )}
          </View>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#D4AF37" />
          <Text style={styles.infoText}>
            Máte záujem o partnerstvo? Kontaktujte nás na dom@dominikani.sk
          </Text>
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
  card: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  partnerName: { fontSize: 16, fontWeight: '700', color: Colors.text.primary, flex: 1 },
  partnerDesc: { fontSize: 13, color: Colors.text.secondary, lineHeight: 20, marginBottom: 12 },
  webBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D241E', borderRadius: 10, paddingVertical: 10, gap: 8 },
  webBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14, marginTop: 8 },
  infoText: { fontSize: 13, color: Colors.text.secondary, flex: 1, lineHeight: 20 },
});import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, getFullUrl } from '../../constants/api';
import axios from 'axios';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  category: string;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  restaurant: { icon: 'restaurant', color: '#FF5722', label: 'Restaurant' },
  hotel: { icon: 'bed', color: '#2196F3', label: 'Accommodation' },
  shop: { icon: 'bag-handle', color: '#9C27B0', label: 'Shop' },
  transport: { icon: 'car', color: '#4CAF50', label: 'Transport' },
  attraction: { icon: 'camera', color: '#FF9800', label: 'Attraction' },
  other: { icon: 'business', color: '#607D8B', label: 'Service' },
};

export default function PartnersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/partners`);
      setPartners(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Partners & Services</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Recommended businesses near Spi{'\u0161'} Castle</Text>

        {partners.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="business" size={40} color={Colors.text.light} />
            <Text style={styles.emptyText}>No partners listed yet</Text>
            <Text style={styles.emptySubtext}>Add partners via Admin panel</Text>
          </View>
        ) : (
          partners.map(partner => {
            const cat = CATEGORY_CONFIG[partner.category] || CATEGORY_CONFIG.other;
            return (
              <View key={partner.id} style={styles.partnerCard}>
                <View style={styles.partnerTop}>
                  {partner.logo_url ? (
                    <Image source={{ uri: getFullUrl(partner.logo_url) }} style={styles.partnerLogo} resizeMode="contain" />
                  ) : (
                    <View style={[styles.partnerLogoPlaceholder, { backgroundColor: cat.color + '20' }]}>
                      <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                    </View>
                  )}
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: cat.color + '15' }]}>
                      <Ionicons name={cat.icon as any} size={12} color={cat.color} />
                      <Text style={[styles.categoryText, { color: cat.color }]}>{cat.label}</Text>
                    </View>
                  </View>
                </View>
                {partner.description ? (
                  <Text style={styles.partnerDesc}>{partner.description}</Text>
                ) : null}
                {partner.address ? (
                  <View style={styles.partnerDetail}>
                    <Ionicons name="location-outline" size={14} color={Colors.text.light} />
                    <Text style={styles.partnerDetailText}>{partner.address}</Text>
                  </View>
                ) : null}
                <View style={styles.partnerActions}>
                  {partner.phone ? (
                    <Pressable style={[styles.partnerActionBtn, { backgroundColor: '#4CAF50' }]} onPress={() => Linking.openURL(`tel:${partner.phone}`)}>
                      <Ionicons name="call" size={16} color="#fff" />
                      <Text style={styles.partnerActionText}>Call</Text>
                    </Pressable>
                  ) : null}
                  {partner.website ? (
                    <Pressable style={[styles.partnerActionBtn, { backgroundColor: '#2196F3' }]} onPress={() => Linking.openURL(partner.website!)}>
                      <Ionicons name="globe" size={16} color="#fff" />
                      <Text style={styles.partnerActionText}>Website</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })
        )}

        {/* Become a Partner CTA */}
        <View style={styles.ctaCard}>
          <Ionicons name="handshake" size={28} color="#D4A017" />
          <Text style={styles.ctaTitle}>Become a Partner</Text>
          <Text style={styles.ctaDesc}>Want your business featured in the Spi{'\u0161'} Castle Audio Guide app? Contact us to reach thousands of castle visitors.</Text>
          <Pressable style={styles.ctaButton} onPress={() => Linking.openURL('tel:0944376007')}>
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.ctaButtonText}>Contact Us</Text>
          </Pressable>
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
  subtitle: { fontSize: 14, color: Colors.text.secondary, textAlign: 'center', marginBottom: 16 },

  emptyCard: { alignItems: 'center', padding: 40, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  emptyText: { fontSize: 16, color: Colors.text.light, marginTop: 10 },
  emptySubtext: { fontSize: 13, color: Colors.text.light, marginTop: 4 },

  partnerCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  partnerTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  partnerLogo: { width: 56, height: 56, borderRadius: 12 },
  partnerLogoPlaceholder: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 16, fontWeight: '700', color: Colors.text.primary },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 4 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  partnerDesc: { fontSize: 13, color: Colors.text.secondary, lineHeight: 20, marginTop: 10 },
  partnerDetail: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  partnerDetailText: { fontSize: 12, color: Colors.text.light },
  partnerActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  partnerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  partnerActionText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  ctaCard: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 8 },
  ctaTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 8 },
  ctaDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20, marginTop: 8 },
  ctaButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#D4A017', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, marginTop: 14 },
  ctaButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
