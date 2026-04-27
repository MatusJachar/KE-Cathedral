import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/api';

const CATHEDRAL_IMAGE = `${API_BASE_URL}/uploads/images/ee7d4914-1a92-4d41-9395-055b24511c6a.jpg`;

const FLAG_IMAGES: Record<string, string> = {
  sk: 'https://flagcdn.com/w80/sk.png',
  en: 'https://flagcdn.com/w80/gb.png',
  de: 'https://flagcdn.com/w80/de.png',
  pl: 'https://flagcdn.com/w80/pl.png',
  hu: 'https://flagcdn.com/w80/hu.png',
  fr: 'https://flagcdn.com/w80/fr.png',
  es: 'https://flagcdn.com/w80/es.png',
  ru: 'https://flagcdn.com/w80/ru.png',
  zh: 'https://flagcdn.com/w80/cn.png',
};

const FALLBACK_LANGUAGES = [
  { code: 'sk', name: 'Slovak',    native_name: 'SlovenÄŤina' },
  { code: 'en', name: 'English',   native_name: 'English' },
  { code: 'de', name: 'German',    native_name: 'Deutsch' },
  { code: 'pl', name: 'Polish',    native_name: 'Polski' },
  { code: 'hu', name: 'Hungarian', native_name: 'Magyar' },
  { code: 'fr', name: 'French',    native_name: 'FranĂ§ais' },
  { code: 'es', name: 'Spanish',   native_name: 'EspaĂ±ol' },
  { code: 'ru', name: 'Russian',   native_name: 'Đ ŃŃŃĐşĐ¸Đą' },
  { code: 'zh', name: 'Chinese',   native_name: 'ä¸­ć–‡' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { languages, setSelectedLanguage } = useApp();

  const displayLanguages = languages.length > 0 ? languages : FALLBACK_LANGUAGES;

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    router.push('/tour-select');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: CATHEDRAL_IMAGE }} style={styles.bgImage} resizeMode="cover" blurRadius={Platform.OS === 'web' ? 0 : 4} />
      <View style={styles.bgOverlay} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2D241E" />
          </Pressable>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="globe" size={36} color="#D4AF37" />
        </View>

        <Text style={styles.title}>Vyberte jazyk</Text>
        <Text style={styles.subtitle}>Choose your language</Text>

        {displayLanguages.map((lang) => (
          <Pressable
            key={lang.code}
            style={({ pressed }) => [styles.langCard, pressed && styles.langCardPressed]}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <View style={styles.flagContainer}>
              {FLAG_IMAGES[lang.code] ? (
                <Image source={{ uri: FLAG_IMAGES[lang.code] }} style={styles.flagImage} resizeMode="cover" />
              ) : (
                <Text style={styles.flagEmoji}>{(lang as any).flag_emoji}</Text>
              )}
            </View>
            <View style={styles.langInfo}>
              <Text style={styles.langName}>{lang.native_name}</Text>
              <Text style={styles.langNameEn}>{lang.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(212,175,55,0.5)" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D241E' },
  bgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45, 36, 30, 0.72)' },
  scrollView: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', marginBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(253,251,247,0.15)', justifyContent: 'center', alignItems: 'center' },
  iconContainer: { alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: '#FDFBF7', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 15, color: 'rgba(253,251,247,0.55)', textAlign: 'center', marginBottom: 24 },
  langCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(253,251,247,0.08)', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.12)' },
  langCardPressed: { backgroundColor: 'rgba(253,251,247,0.14)', borderColor: 'rgba(212,175,55,0.35)' },
  flagContainer: { width: 48, height: 34, borderRadius: 6, overflow: 'hidden', marginRight: 14, backgroundColor: 'rgba(253,251,247,0.1)', justifyContent: 'center', alignItems: 'center' },
  flagImage: { width: 48, height: 34, borderRadius: 6 },
  flagEmoji: { fontSize: 28 },
  langInfo: { flex: 1 },
  langName: { fontSize: 17, fontWeight: '700', color: '#FDFBF7' },
  langNameEn: { fontSize: 13, color: 'rgba(253,251,247,0.5)', marginTop: 2 },
});

