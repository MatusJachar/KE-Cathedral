import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

const C = { bg: '#FDFBF7', gold: '#D4AF37', dark: '#2D241E', light: '#9C8B6E', border: '#EDE8DF', white: '#fff' };

export default function PartnersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/partners`)
      .then(res => setPartners(res.data))
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={C.dark} />
        </Pressable>
        <Text style={styles.headerTitle}>Partneri</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={C.gold} /></View>
      ) : partners.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="business-outline" size={48} color={C.light} />
          <Text style={styles.emptyText}>Žiadni partneri</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {partners.map((p: any, i: number) => (
            <Pressable key={i} style={styles.card} onPress={() => p.website ? Linking.openURL(p.website) : null}>
              <View style={[styles.icon, { backgroundColor: C.gold }]}>
                <Ionicons name="business" size={24} color={C.white} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.desc}>{p.description}</Text>
                {p.website && <Text style={styles.web}>{p.website.replace('https://', '')}</Text>}
              </View>
              {p.website && <Ionicons name="open-outline" size={18} color={C.light} />}
            </Pressable>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:     { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: C.dark },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText:   { fontSize: 16, color: C.light },
  content:     { padding: 16, gap: 12 },
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, gap: 14 },
  icon:        { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  info:        { flex: 1 },
  name:        { fontSize: 15, fontWeight: '700', color: C.dark, marginBottom: 4 },
  desc:        { fontSize: 13, color: C.light, marginBottom: 4, lineHeight: 18 },
  web:         { fontSize: 12, color: C.gold, fontWeight: '600' },
});