import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Image, Modal, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: SW, height: SH } = Dimensions.get('window');
const CATHEDRAL_MAP = 'https://raw.githubusercontent.com/MatusJachar/KE-Cathedral/main/frontend/assets/images/cathedral_map.png';

const PRICES = [
  { label: 'Dospělí / Adults', price: '5.00 €' },
  { label: 'Deti (6-15) / Children', price: '3.00 €' },
  { label: 'Študenti, seniori', price: '4.00 €' },
  { label: 'Rodinný lísток (2+2)', price: '12.00 €', highlight: true },
  { label: 'ZTP deti', price: '2.00 €' },
  { label: 'ZTP dospělí', price: '3.00 €' },
];

export default function VisitorInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Informácie</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Dôležité informácie pre vašu návštevu Dómu sv. Alžbety</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#4CAF50' }]}><Ionicons name="ticket" size={18} color="#fff" /></View>
            <Text style={styles.sectionTitle}>Vstupné</Text>
          </View>
          <View style={styles.priceTable}>
            {PRICES.map((row, idx) => (
              <View key={idx} style={[styles.priceRow, idx % 2 === 0 && styles.priceRowAlt, row.highlight && styles.priceRowHL]}>
                <Text style={[styles.priceLabel, row.highlight && styles.priceLabelHL]}>{row.label}</Text>
                <Text style={[styles.priceValue, row.highlight && styles.priceValueHL]}>{row.price}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.note}>⚠️ Ceny sú orientáčné, overte aktuálne ceny na mieste.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#FF9800' }]}><Ionicons name="time" size={18} color="#fff" /></View>
            <Text style={styles.sectionTitle}>Otváracie hodiny</Text>
          </View>
          <View style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Ionicons name="sunny" size={20} color="#FF9800" />
              <View style={styles.hoursInfo}>
                <Text style={styles.hoursLabel}>Pondelok – Piatok</Text>
                <Text style={styles.hoursValue}>9:00 – 18:00</Text>
              </View>
            </View>
            <View style={styles.hoursDivider} />
            <View style={styles.hoursRow}>
              <Ionicons name="partly-sunny" size={20} color="#607D8B" />
              <View style={styles.hoursInfo}>
                <Text style={styles.hoursLabel}>Sobota</Text>
                <Text style={styles.hoursValue}>9:00 – 16:00</Text>
              </View>
            </View>
            <View style={styles.hoursDivider} />
            <View style={styles.hoursRow}>
              <Ionicons name="rainy" size={20} color="#607D8B" />
              <View style={styles.hoursInfo}>
                <Text style={styles.hoursLabel}>Nedeľa</Text>
                <Text style={styles.hoursValue}>13:00 – 17:00</Text>
              </View>
            </View>
            <View style={styles.hoursDivider} />
            <View style={styles.hoursRow}>
              <Ionicons name="information-circle" size={20} color="#D4AF37" />
              <View style={styles.hoursInfo}>
                <Text style={styles.hoursLabel}>Počas omší</Text>
                <Text style={styles.hoursValue}>Katedrála môže byť uzavretá pre turistov</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#D4AF37' }]}><Ionicons name="business" size={18} color="#fff" /></View>
            <Text style={styles.sectionTitle}>O katedrále</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Dóm sv. Alžbety je najväčší gotický chrám na Slovensku a katedrála Košického arcibiskupstva. Stavëa sa vyše 150 rokov — od 14. do 16. storočia. Je zasvätený sv. Alžbete Uhorskej, patrónke Uhorska.</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}><Text style={styles.statValue}>55 m</Text><Text style={styles.statLabel}>Dĺžka</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statValue}>59 m</Text><Text style={styles.statLabel}>Véža</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statValue}>14c</Text><Text style={styles.statLabel}>Storočie</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statValue}>150r</Text><Text style={styles.statLabel}>Stavba</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#795548' }]}><Ionicons name="map" size={18} color="#fff" /></View>
            <Text style={styles.sectionTitle}>Pôdorys katedrály</Text>
          </View>
          <Pressable onPress={() => setShowMapModal(true)} style={styles.mapContainer}>
            <Image source={{ uri: CATHEDRAL_MAP }} style={styles.mapImage} resizeMode="contain" />
            <View style={styles.mapOverlay}>
              <Ionicons name="expand" size={18} color="#fff" />
              <Text style={styles.mapOverlayText}>Klepni pre zväčšenie</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#2196F3' }]}><Ionicons name="call" size={18} color="#fff" /></View>
            <Text style={styles.sectionTitle}>Kontakt</Text>
          </View>
          <View style={styles.infoCard}>
            <Pressable style={styles.contactRow} onPress={() => Linking.openURL('tel:+421556224045')}>
              <Ionicons name="call" size={18} color="#D4AF37" />
              <Text style={styles.contactText}>+421 55 622 4045</Text>
            </Pressable>
            <View style={styles.contactDivider} />
            <Pressable style={styles.contactRow} onPress={() => Linking.openURL('mailto:dom@dominikani.sk')}>
              <Ionicons name="mail" size={18} color="#D4AF37" />
              <Text style={styles.contactText}>dom@dominikani.sk</Text>
            </Pressable>
            <View style={styles.contactDivider} />
            <View style={styles.contactRow}>
              <Ionicons name="location" size={18} color="#D4AF37" />
              <Text style={styles.contactText}>Hlavná 28, 040 01 Košice</Text>
            </View>
          </View>
          <View style={styles.socialRow}>
            <Pressable style={[styles.socialBtn, { backgroundColor: '#1877F2' }]} onPress={() => Linking.openURL('https://www.facebook.com/domsvalizbetyke')}>
              <Ionicons name="logo-facebook" size={20} color="#fff" /><Text style={styles.socialText}>Facebook</Text>
            </Pressable>
            <Pressable style={[styles.socialBtn, { backgroundColor: '#E1306C' }]} onPress={() => Linking.openURL('https://www.instagram.com/domsvalizbetyke')}>
              <Ionicons name="logo-instagram" size={20} color="#fff" /><Text style={styles.socialText}>Instagram</Text>
            </Pressable>
            <Pressable style={[styles.socialBtn, { backgroundColor: '#4285F4' }]} onPress={() => Linking.openURL('https://www.dom.ke.sk')}>
              <Ionicons name="globe-outline" size={20} color="#fff" /><Text style={styles.socialText}>Web</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showMapModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={[styles.modalClose, { top: insets.top + 12 }]} onPress={() => setShowMapModal(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Image source={{ uri: CATHEDRAL_MAP }} style={{ width: SW - 24, height: SH * 0.7 }} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.text.primary },
  content: { paddingHorizontal: 16 },
  mainTitle: { fontSize: 20, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', marginBottom: 20, lineHeight: 28 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  sectionIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text.primary },
  note: { fontSize: 12, color: Colors.text.secondary, marginTop: 8, fontStyle: 'italic' },
  priceTable: { backgroundColor: Colors.white, borderRadius: 14, overflow: 'hidden', elevation: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  priceRowAlt: { backgroundColor: '#FAFAFA' },
  priceRowHL: { backgroundColor: '#FFF8E1' },
  priceLabel: { fontSize: 14, color: Colors.text.primary, flex: 1 },
  priceLabelHL: { fontWeight: '600' },
  priceValue: { fontSize: 15, fontWeight: '700', color: Colors.accent, minWidth: 70, textAlign: 'right' },
  priceValueHL: { fontSize: 16, color: '#E65100' },
  hoursCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, elevation: 2 },
  hoursRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  hoursInfo: { flex: 1 },
  hoursLabel: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary },
  hoursValue: { fontSize: 15, fontWeight: '700', color: Colors.text.primary, marginTop: 2 },
  hoursDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 12 },
  infoCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, elevation: 2 },
  infoText: { fontSize: 14, color: Colors.text.secondary, lineHeight: 22 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#D4AF37' },
  statLabel: { fontSize: 11, color: Colors.text.secondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.borderLight },
  mapContainer: { backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: 'center', elevation: 2 },
  mapImage: { width: '100%', height: 220, borderRadius: 10 },
  mapOverlay: { position: 'absolute', bottom: 20, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingVertical: 6 },
  mapOverlayText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  contactText: { fontSize: 15, color: Colors.text.primary, fontWeight: '500' },
  contactDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 10 },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, gap: 8 },
  socialText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  modalClose: { position: 'absolute', right: 16, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});
