import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

// ============================================================
// DONATE / SUPPORT SEKCIA
// Ko-fi link — zmen na skutocny link po registracii
// ============================================================
const KOFI_URL = 'https://ko-fi.com/ke_cathedral'; // <-- ZMEN PO REGISTRACII

const AMOUNTS = [
  { label: '1 €', emoji: '☕', desc: 'Káva pre devélopéra' },
  { label: '3 €', emoji: '💛', desc: 'Malá podpora' },
  { label: '5 €', emoji: '👏', desc: 'Veľká vděk' },
  { label: '10 €', emoji: '🌟', desc: 'Superpodpora' },
];

const TEXTS: Record<string, Record<string, string>> = {
  title: {
    sk: 'Podporte projekt',
    en: 'Support the project',
    de: 'Projekt unterstützen',
    hu: 'Támogassa a projektet',
    pl: 'Wesprzyj projekt',
    fr: 'Soutenir le projet',
    it: 'Sostieni il progetto',
    es: 'Apoya el proyecto',
    uk: 'Підтривайте проект',
  },
  subtitle: {
    sk: 'Táto aplikácia je zadarmo a vytvoril ju nezavislý developer so srćom pre Dóm sv. Alžbety. Ak sa vám páčí, podporte jej ďalej rozvoj.',
    en: 'This app is free and was created by an independent developer with passion for St. Elizabeth Cathedral. If you enjoy it, support its further development.',
    de: 'Diese App ist kostenlos und wurde von einem unabhängigen Entwickler mit Leidenschaft für den Dom der hl. Elisabeth erstellt. Wenn sie Ihnen gefällt, unterstützen Sie ihre Weiterentwicklung.',
    hu: 'Ez az alkalmazás ingyenes, és egy független fejlesztő készítette a Szt. Erzsébet-dóm iránti szeretettel. Ha tetszik, támogassa további fejlesztését.',
    pl: 'Ta aplikacja jest bezpłatna i została stworzona przez niezależnego developera z pasją do Katedry św. Elżbiety. Jeśli ci się podoba, wesprzyj jej dalszy rozwój.',
    uk: 'Цього додаток безкоштовний і був створений незалежним розробником з любов'юдо Собору св. Єлизавети.',
  },
  donateBtn: {
    sk: 'Podporať cez Ko-fi',
    en: 'Support via Ko-fi',
    de: 'Über Ko-fi unterstützen',
    hu: 'Támogatás Ko-fi-n át',
    pl: 'Wesprzyj przez Ko-fi',
    fr: 'Soutenir via Ko-fi',
    it: 'Sostieni tramite Ko-fi',
    es: 'Apoyar vía Ko-fi',
    uk: 'Підтримати через Ko-fi',
  },
  thanks: {
    sk: 'Dakujem za podporu! 🙏',
    en: 'Thank you for your support! 🙏',
    de: 'Danke für Ihre Unterstützung! 🙏',
    hu: 'Köszönöm a támogatást! 🙏',
    pl: 'Dziękuję za wsparcie! 🙏',
    uk: 'Дякую за підтримку! 🙏',
  },
  back: {
    sk: 'Späť', en: 'Back', de: 'Zurück', hu: 'Vissza',
    pl: 'Wróć', fr: 'Retour', it: 'Indietro', es: 'Volver', uk: 'Назад',
  },
};

function t(key: string, lang: string): string {
  return TEXTS[key]?.[lang] ?? TEXTS[key]?.['en'] ?? key;
}

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang] = useState('sk');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('title', lang)}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>❤️</Text>
          <Text style={styles.heroTitle}>{t('title', lang)}</Text>
          <Text style={styles.heroText}>{t('subtitle', lang)}</Text>
        </View>

        {/* Ko-fi button */}
        <Pressable
          style={({ pressed }) => [styles.kofiBtn, pressed && { opacity: 0.85 }]}
          onPress={() => Linking.openURL(KOFI_URL)}
        >
          <Text style={styles.kofiEmoji}>☕</Text>
          <Text style={styles.kofiText}>{t('donateBtn', lang)}</Text>
          <Ionicons name="open-outline" size={18} color="#fff" />
        </Pressable>

        {/* Amount suggestions */}
        <View style={styles.amountsRow}>
          {AMOUNTS.map((a, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.amountCard, pressed && { opacity: 0.8 }]}
              onPress={() => Linking.openURL(KOFI_URL)}
            >
              <Text style={styles.amountEmoji}>{a.emoji}</Text>
              <Text style={styles.amountLabel}>{a.label}</Text>
              <Text style={styles.amountDesc}>{a.desc}</Text>
            </Pressable>
          ))}
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#D4AF37" />
          <Text style={styles.infoText}>
            Platba prebieha bezpečne cez Ko-fi. Nemusíte mať účet — stačí platba kartou.
          </Text>
        </View>

        {/* Thanks */}
        <Text style={styles.thanks}>{t('thanks', lang)}</Text>

        {/* Cathedral info */}
        <View style={styles.cathedralCard}>
          <Text style={styles.cathedralTitle}>Dom sv. Alžbety — Košice</Text>
          <Text style={styles.cathedralText}>
            Najväčší gotický chrám na Slovensku{'
'}
            Audio sprievodca v 9 jazykoch{'
'}
            14 zastávok • Vytvoril Matuš Jachar
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.text.primary, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  content: { paddingHorizontal: 16 },
  heroCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#2D241E', textAlign: 'center', marginBottom: 10, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  heroText: { fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  kofiBtn: { backgroundColor: '#FF5E5B', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, shadowColor: '#FF5E5B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  kofiEmoji: { fontSize: 20 },
  kofiText: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  amountsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  amountCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  amountEmoji: { fontSize: 22, marginBottom: 4 },
  amountLabel: { fontSize: 15, fontWeight: '800', color: '#D4AF37', marginBottom: 2 },
  amountDesc: { fontSize: 9, color: Colors.text.secondary, textAlign: 'center' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14, marginBottom: 20 },
  infoText: { fontSize: 13, color: Colors.text.secondary, flex: 1, lineHeight: 20 },
  thanks: { fontSize: 16, textAlign: 'center', color: Colors.text.secondary, marginBottom: 20, fontStyle: 'italic' },
  cathedralCard: { backgroundColor: '#2D241E', borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 10 },
  cathedralTitle: { fontSize: 16, fontWeight: '700', color: '#D4AF37', marginBottom: 8, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  cathedralText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22 },
});
