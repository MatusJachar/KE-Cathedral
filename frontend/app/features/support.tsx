import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = { bg: '#FDFBF7', gold: '#D4AF37', dark: '#2D241E', light: '#9C8B6E', border: '#EDE8DF', white: '#fff' };
const KOFI_URL = 'https://ko-fi.com/keaudioguide';

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={C.dark} />
        </Pressable>
        <Text style={styles.headerTitle}>Podpora</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Ionicons name="heart" size={48} color={C.gold} />
          <Text style={styles.heroTitle}>Podporte aplikáciu</Text>
          <Text style={styles.heroDesc}>
            Táto aplikácia je bezplatná a vytvoril ju nezávislý vývojár s láskou k Dómu sv. Alžbety.
            Ak sa vám páči, podporte jej ďalší vývoj.
          </Text>
        </View>

        <Pressable style={styles.kofiBtn} onPress={() => Linking.openURL(KOFI_URL)}>
          <Ionicons name="cafe" size={24} color={C.white} />
          <Text style={styles.kofiBtnText}>Podporiť cez Ko-fi</Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Čo vaša podpora umožní</Text>
          {[
            'Nahrávanie audio sprievodcu vo všetkých jazykoch',
            'Pravidelná aktualizácia obsahu',
            'Nové funkcie a vylepšenia',
            'Udržiavanie serverov a infraštruktúry',
          ].map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <Ionicons name="checkmark-circle" size={18} color={C.gold} />
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Kontakt</Text>
          <Pressable style={styles.contactRow} onPress={() => Linking.openURL('tel:0944376007')}>
            <Ionicons name="call" size={18} color={C.gold} />
            <Text style={styles.contactText}>0944 376 007</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:      { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { fontSize: 20, fontWeight: '700', color: C.dark },
  content:      { padding: 16 },
  heroCard:     { backgroundColor: C.white, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  heroTitle:    { fontSize: 22, fontWeight: '800', color: C.dark, marginTop: 16, marginBottom: 12, textAlign: 'center' },
  heroDesc:     { fontSize: 15, color: C.light, textAlign: 'center', lineHeight: 22 },
  kofiBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FF5E5B', borderRadius: 14, paddingVertical: 16, marginBottom: 16 },
  kofiBtnText:  { fontSize: 17, fontWeight: '800', color: C.white },
  infoCard:     { backgroundColor: C.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  infoTitle:    { fontSize: 16, fontWeight: '700', color: C.dark, marginBottom: 14 },
  infoRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  infoText:     { fontSize: 14, color: C.dark, flex: 1 },
  contactCard:  { backgroundColor: C.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border },
  contactTitle: { fontSize: 16, fontWeight: '700', color: C.dark, marginBottom: 14 },
  contactRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contactText:  { fontSize: 16, color: C.gold, fontWeight: '700' },
});