import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = { bg: '#FDFBF7', gold: '#D4AF37', dark: '#2D241E', light: '#9C8B6E', border: '#EDE8DF', white: '#fff', error: '#D32F2F' };

export default function NearbyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      category: 'Atrakcie v okolí',
      icon: 'star' as const,
      color: '#7A5C8A',
      items: [
        { name: 'Kaplnka sv. Michala', detail: 'Gotická kaplnka priamo vedľa katedrály' },
        { name: 'Urbanova veža', detail: 'Zvonica pri Dóme, stála výstava o omšovom víne' },
        { name: 'Štátne divadlo Košice', detail: 'Historická budova, 5 minút pešo' },
        { name: 'Hlavná ulica', detail: 'Pešia zóna s fontánami a kaviarňami' },
        { name: 'Východoslovenské múzeum', detail: 'Zlatý poklad — unikátna zbierka mincí' },
      ],
    },
    {
      category: 'Ubytovanie',
      icon: 'bed' as const,
      color: '#4A7A9B',
      items: [
        { name: 'Hotel Hilton Košice', detail: 'Luxusný hotel, Hlavná ul. — 3 min pešo' },
        { name: 'Hotel Double Tree', detail: 'Centrum mesta, moderný dizajn' },
        { name: 'Penzión centrum', detail: 'Cenovo dostupné ubytovanie v centre' },
      ],
    },
    {
      category: 'Jedlo a nápoje',
      icon: 'restaurant' as const,
      color: '#C17A30',
      items: [
        { name: 'Reštaurácia Uhorský dvor', detail: 'Tradičná slovenská kuchyňa, Hlavná ul.' },
        { name: 'Caffe Trieste', detail: 'Výborná káva, vedľa katedrály' },
        { name: 'Mestský pivovar', detail: 'Lokálne pivo a jedlo, centrum' },
        { name: 'Košické trhy', detail: 'Čerstvé lokálne produkty, Hlavná ul.' },
      ],
    },
    {
      category: 'Osobný sprievodca',
      icon: 'person' as const,
      color: '#5C8A5C',
      items: [
        { name: 'Rezervácia osobného sprievodcu', detail: 'Profesionálny výklad v slovenčine, angličtine a nemčine' },
        { name: 'Kontakt', detail: 'Tel: 0944 376 007', phone: '0944376007' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={C.dark} />
        </Pressable>
        <Text style={styles.headerTitle}>Okolie katedrály</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                <Ionicons name={section.icon} size={18} color={C.white} />
              </View>
              <Text style={styles.sectionTitle}>{section.category}</Text>
            </View>
            {section.items.map((item, iidx) => (
              <Pressable
                key={iidx}
                style={styles.itemCard}
                onPress={() => item.phone ? Linking.openURL(`tel:${item.phone}`) : null}
              >
                <View style={[styles.dot, { backgroundColor: section.color }]} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={[styles.itemDetail, item.phone && { color: C.gold, fontWeight: '600' }]}>{item.detail}</Text>
                </View>
                {item.phone && <Ionicons name="call" size={18} color={C.gold} />}
              </Pressable>
            ))}
          </View>
        ))}

        {/* Emergency */}
        <View style={styles.emergency}>
          <Ionicons name="warning" size={22} color={C.error} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.emergencyTitle}>Tiesňové volania</Text>
            <Text style={styles.emergencyText}>Európske tiesňové číslo: 112</Text>
            <Text style={styles.emergencyText}>Polícia: 158 | Záchranná služba: 155</Text>
            <Text style={styles.emergencyText}>Hasiči: 150</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:        { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle:    { fontSize: 20, fontWeight: '700', color: C.dark },
  content:        { paddingHorizontal: 16, paddingTop: 16 },
  section:        { marginBottom: 20 },
  sectionHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionIcon:    { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionTitle:   { fontSize: 17, fontWeight: '700', color: C.dark },
  itemCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  dot:            { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  itemInfo:       { flex: 1 },
  itemName:       { fontSize: 14, fontWeight: '600', color: C.dark },
  itemDetail:     { fontSize: 12, color: C.light, marginTop: 3 },
  emergency:      { flexDirection: 'row', backgroundColor: '#FFF3F3', borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#FFCDD2' },
  emergencyTitle: { fontSize: 15, fontWeight: '700', color: C.error, marginBottom: 4 },
  emergencyText:  { fontSize: 13, color: C.dark, marginTop: 2 },
});