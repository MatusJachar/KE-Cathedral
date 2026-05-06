import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const KOFI_URL = 'https://ko-fi.com/keaudioguide';

const TEXTS = {
  title: {
    sk: 'Podpora aplikácie', en: 'Support the App', de: 'App unterstützen',
    pl: 'Wesprzyj aplikację', hu: 'Támogassa az alkalmazást',
    fr: "Soutenir l'application", es: 'Apoyar la aplicación',
    it: "Supporta l'applicazione", uk: 'Підтримати додаток',
  },
  description: {
    sk: 'Táto aplikácia je bezplatná a vytvoril ju nezávislý vývojár s láskou k Dómu sv. Alžbety. Ak sa vám páčí, podporte jej ďalší vývoj.',
    en: 'This app is free and was created by an independent developer with love for St. Elisabeth Cathedral. If you like it, support its further development.',
    de: 'Diese App ist kostenlos und wurde von einem unabhängigen Entwickler mit Liebe zum Dom St. Elisabeth erstellt.',
    pl: 'Ta aplikacja jest bezpłatna i została stworzona przez niezależnego developera z pasją do Katedry św. Elżbiety.',
    hu: 'Ez az alkalmazás ingyenes, és egy független fejlesztő készítette a Szt. Erzsébet-dóm iránti szeretettel.',
    fr: "Cette application est gratuite et a été créée par un développeur indépendant avec amour pour la Cathédrale Sainte-Élisabeth.",
    es: 'Esta aplicación es gratuita y fue creada por un desarrollador independiente con amor por la Catedral de Santa Isabel.',
    it: "Questa app è gratuita ed è stata creata da uno sviluppatore indipendente con amore per la Cattedrale di Sant'Elisabetta.",
    uk: 'Цей додаток безкоштовний і був створений незалежним розробником з любов’ю до Собору св. Єлизавети.',
  },
  donateBtn: {
    sk: 'Podporiť cez Ko-fi', en: 'Support via Ko-fi', de: 'Via Ko-fi unterstützen',
    pl: 'Wesprzyj przez Ko-fi', hu: 'Támogatás Ko-fi-n keresztül',
    fr: 'Soutenir via Ko-fi', es: 'Apoyar vía Ko-fi',
    it: 'Supporta tramite Ko-fi', uk: 'Підтримати через Ko-fi',
  },
};

type LangKey = keyof typeof TEXTS.title;

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const lang = (language || 'sk') as LangKey;
  const t = (key: keyof typeof TEXTS) => TEXTS[key][lang] || TEXTS[key].en;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('title')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.iconWrap}>
          <Ionicons name="heart" size={64} color="#D4AF37" />
        </View>
        <Text style={styles.desc}>{t('description')}</Text>
        <Pressable style={styles.kofiBtn} onPress={() => Linking.openURL(KOFI_URL)}>
          <Ionicons name="cafe-outline" size={22} color="#fff" />
          <Text style={styles.kofiBtnText}>{t('donateBtn')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.text.primary },
  content: { paddingHorizontal: 20, alignItems: 'center' },
  iconWrap: { marginTop: 32, marginBottom: 24 },
  desc: { fontSize: 15, color: Colors.text.secondary, lineHeight: 24, textAlign: 'center', marginBottom: 32 },
  kofiBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF5E5B', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, gap: 10 },
  kofiBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
