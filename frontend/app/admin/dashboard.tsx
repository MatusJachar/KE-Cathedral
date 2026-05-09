import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../constants/api';

const C = { bg: '#FDFBF7', gold: '#D4AF37', dark: '#2D241E', light: '#9C8B6E', border: '#EDE8DF', white: '#fff' };

const LANGS = [
  { code: 'sk', label: '🇸🇰 Slovensky' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'hu', label: '🇭🇺 Magyar' },
  { code: 'pl', label: '🇵🇱 Polski' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'uk', label: '🇺🇦 Українська' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState('');
  const [stops, setStops] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stops' | 'qr' | 'settings'>('stops');
  const [editingStop, setEditingStop] = useState<any>(null);
  const [editLang, setEditLang] = useState('sk');
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [editSettings, setEditSettings] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteDesc, setSiteDesc] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const t = await AsyncStorage.getItem('adminToken') || '';
      setToken(t);
      const [stopsRes, settingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tour-stops`),
        axios.get(`${API_BASE_URL}/site-settings`).catch(() => ({ data: null })),
      ]);
      setStops(stopsRes.data.sort((a: any, b: any) => a.stop_number - b.stop_number));
      if (settingsRes.data) {
        setSiteSettings(settingsRes.data);
        setSiteName(settingsRes.data.site_name || 'Dóm sv. Alžbety');
        setSiteDesc(settingsRes.data.welcome_description || '');
      }
    } catch (e) {
      Alert.alert('Chyba', 'Nepodarilo sa načítať dáta');
    } finally {
      setLoading(false);
    }
  };

  const getTranslation = (stop: any, lang: string) => {
    return stop.translations?.find((x: any) => x.language_code === lang) || { title: '', description: '', audio_url: null };
  };

  const openEdit = (stop: any) => {
    setEditingStop(stop);
    setEditLang('sk');
    const t = getTranslation(stop, 'sk');
    setEditTitle(t.title || '');
    setEditDesc(t.description || '');
  };

  const changeLang = (lang: string) => {
    setEditLang(lang);
    const t = getTranslation(editingStop, lang);
    setEditTitle(t.title || '');
    setEditDesc(t.description || '');
  };

  const saveEdit = async () => {
    if (!editingStop) return;
    setSaving(true);
    try {
      const translations = LANGS.map(l => {
        const existing = getTranslation(editingStop, l.code);
        if (l.code === editLang) {
          return { ...existing, language_code: l.code, title: editTitle, description: editDesc };
        }
        return { ...existing, language_code: l.code };
      });
      await axios.put(
        `${API_BASE_URL}/admin/tour-stops/${editingStop.id}`,
        { translations },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Aktualizuj lokálne
      setStops(prev => prev.map(s => s.id === editingStop.id ? { ...s, translations } : s));
      setEditingStop({ ...editingStop, translations });
      Alert.alert('✅', 'Uložené');
    } catch (e) {
      Alert.alert('Chyba', 'Nepodarilo sa uložiť');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/admin/site-settings`,
        { site_name: siteName, welcome_description: siteDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('✅', 'Nastavenia uložené');
      setEditSettings(false);
      loadData();
    } catch (e) {
      Alert.alert('Chyba', 'Nepodarilo sa uložiť nastavenia');
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('adminToken');
    router.replace('/admin');
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={C.gold} /></View>;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={C.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin panel</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={C.light} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['stops', 'qr', 'settings'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'stops' ? 'Zastávky' : tab === 'qr' ? 'QR kódy' : 'Nastavenia'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ZASTÁVKY */}
      {activeTab === 'stops' && (
        <ScrollView contentContainerStyle={styles.list}>
          {stops.map(stop => (
            <TouchableOpacity key={stop.id} style={styles.stopCard} onPress={() => openEdit(stop)}>
              <View style={styles.badge}><Text style={styles.badgeText}>{stop.stop_number}</Text></View>
              <View style={styles.stopInfo}>
                <Text style={styles.stopTitle} numberOfLines={1}>{getTranslation(stop, 'sk').title || `Zastávka ${stop.stop_number}`}</Text>
                <Text style={styles.stopSub} numberOfLines={1}>{getTranslation(stop, 'sk').description || '—'}</Text>
              </View>
              <Ionicons name="create-outline" size={20} color={C.gold} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* QR KÓDY */}
      {activeTab === 'qr' && (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.note}>QR kódy odkazujú na jednotlivé zastávky v aplikácii.</Text>
          {stops.map(stop => (
            <View key={stop.id} style={styles.qrCard}>
              <View style={styles.qrTop}>
                <View style={styles.badge}><Text style={styles.badgeText}>{stop.stop_number}</Text></View>
                <Text style={styles.qrTitle} numberOfLines={2}>{getTranslation(stop, 'sk').title || `Zastávka ${stop.stop_number}`}</Text>
              </View>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ke-cathedral://tour/${stop.id}&qzone=2&format=png` }}
                style={styles.qrImg}
                resizeMode="contain"
              />
              <Text style={styles.qrUrl}>ke-cathedral://tour/{stop.id}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* NASTAVENIA */}
      {activeTab === 'settings' && (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.label}>Názov aplikácie / front page</Text>
          <TextInput style={styles.input} value={siteName} onChangeText={setSiteName} />
          <Text style={styles.label}>Úvodný popis (front page)</Text>
          <TextInput style={[styles.input, styles.inputMulti]} value={siteDesc} onChangeText={setSiteDesc} multiline numberOfLines={4} />
          <TouchableOpacity style={styles.saveBtn} onPress={saveSettings} disabled={saving}>
            {saving ? <ActivityIndicator color={C.white} /> : <Text style={styles.saveBtnText}>Uložiť nastavenia</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* EDIT MODAL */}
      <Modal visible={!!editingStop} animationType="slide">
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setEditingStop(null)}>
              <Ionicons name="close" size={28} color={C.dark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Zastávka {editingStop?.stop_number}</Text>
            <TouchableOpacity onPress={saveEdit} disabled={saving}>
              {saving ? <ActivityIndicator color={C.gold} /> : <Ionicons name="checkmark" size={28} color={C.gold} />}
            </TouchableOpacity>
          </View>

          {/* Výber jazyka */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {LANGS.map(l => (
              <TouchableOpacity key={l.code} style={[styles.langBtn, editLang === l.code && styles.langBtnActive]} onPress={() => changeLang(l.code)}>
                <Text style={[styles.langBtnText, editLang === l.code && styles.langBtnTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={{ padding: 16 }}>
            <Text style={styles.label}>Názov</Text>
            <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} placeholder="Názov zastávky" />
            <Text style={styles.label}>Popis</Text>
            <TextInput style={[styles.input, { height: 300, textAlignVertical: 'top' }]} value={editDesc} onChangeText={setEditDesc} multiline placeholder="Popis zastávky..." />
            <TouchableOpacity style={[styles.saveBtn, { marginTop: 16 }]} onPress={saveEdit} disabled={saving}>
              {saving ? <ActivityIndicator color={C.white} /> : <Text style={styles.saveBtnText}>Uložiť</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: C.dark },
  tabs:           { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  tab:            { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:      { borderBottomWidth: 2, borderBottomColor: C.gold },
  tabText:        { fontSize: 14, color: C.light, fontWeight: '600' },
  tabTextActive:  { color: C.gold },
  list:           { padding: 16, gap: 12 },
  stopCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border, gap: 12 },
  badge:          { width: 32, height: 32, borderRadius: 16, backgroundColor: C.gold, justifyContent: 'center', alignItems: 'center' },
  badgeText:      { color: C.white, fontWeight: '700', fontSize: 13 },
  stopInfo:       { flex: 1 },
  stopTitle:      { fontSize: 15, fontWeight: '700', color: C.dark },
  stopSub:        { fontSize: 12, color: C.light, marginTop: 2 },
  note:           { fontSize: 13, color: C.light, marginBottom: 8, textAlign: 'center' },
  qrCard:         { backgroundColor: C.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  qrTop:          { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', marginBottom: 12, width: '100%' },
  qrTitle:        { fontSize: 14, fontWeight: '700', color: C.dark, flex: 1 },
  qrImg:          { width: 200, height: 200, marginBottom: 8 },
  qrUrl:          { fontSize: 11, color: C.light },
  label:          { fontSize: 13, fontWeight: '600', color: C.light, marginBottom: 6, marginTop: 12 },
  input:          { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12, fontSize: 15, color: C.dark },
  inputMulti:     { height: 120, textAlignVertical: 'top' },
  saveBtn:        { backgroundColor: C.dark, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText:    { color: C.white, fontWeight: '700', fontSize: 16 },
  langRow:        { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: C.border },
  langBtn:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.border, height: 36, justifyContent: 'center' },
  langBtnActive:  { backgroundColor: C.gold },
  langBtnText:    { fontSize: 13, color: C.dark, fontWeight: '600' },
  langBtnTextActive: { color: C.white },
});