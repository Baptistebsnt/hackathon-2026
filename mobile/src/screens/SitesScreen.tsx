import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSites, SiteResponse } from '../services/api';

export default function SitesScreen() {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const load = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const getScoreColor = (co2PerM2: number) => {
    if (co2PerM2 < 50) return '#15803d';
    if (co2PerM2 < 150) return '#b45309';
    return '#dc2626';
  };

  const getScore = (co2PerM2: number) => {
    if (co2PerM2 < 50) return 'A';
    if (co2PerM2 < 150) return 'B';
    return 'C';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sites}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🌱 CarbonTrack</Text>
            <TouchableOpacity
              style={styles.btnNew}
              onPress={() => navigation.navigate('NewSite')}
            >
              <Text style={styles.btnNewText}>+ Nouveau</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun site enregistré</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewSite')}>
              <Text style={styles.emptyLink}>Créer le premier site →</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SiteDetail', { siteId: item.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={[styles.badge, { backgroundColor: getScoreColor(item.co2PerM2) + '20' }]}>
                <Text style={[styles.badgeText, { color: getScoreColor(item.co2PerM2) }]}>
                  {getScore(item.co2PerM2)}
                </Text>
              </View>
            </View>

            <Text style={styles.co2Total}>
              {(item.totalCo2Kg / 1000).toFixed(1)} t CO₂e
            </Text>

            <View style={styles.kpiRow}>
              <View style={styles.kpi}>
                <Text style={styles.kpiValue}>{item.co2PerM2.toFixed(1)} kg</Text>
                <Text style={styles.kpiLabel}>/ m²</Text>
              </View>
              <View style={styles.kpi}>
                <Text style={styles.kpiValue}>{Math.round(item.co2PerEmployee)} kg</Text>
                <Text style={styles.kpiLabel}>/ employé</Text>
              </View>
              <View style={styles.kpi}>
                <Text style={styles.kpiValue}>{item.surfaceM2.toLocaleString()} m²</Text>
                <Text style={styles.kpiLabel}>surface</Text>
              </View>
            </View>

            {/* Barre construction vs exploitation */}
            <View style={styles.barContainer}>
              <View style={[styles.barSegment, {
                flex: item.constructionCo2Kg,
                backgroundColor: '#f59e0b'
              }]} />
              <View style={[styles.barSegment, {
                flex: item.operationCo2KgPerYear,
                backgroundColor: '#3b82f6'
              }]} />
            </View>
            <View style={styles.barLegend}>
              <Text style={styles.legendDot}>🟡 Construction</Text>
              <Text style={styles.legendDot}>🔵 Exploitation</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  btnNew: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnNewText: { color: 'white', fontWeight: '600', fontSize: 14 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#0f172a', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  badgeText: { fontWeight: '700', fontSize: 13 },
  co2Total: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginVertical: 8 },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  kpi: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: 8, alignItems: 'center' },
  kpiValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  kpiLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  barContainer: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#f1f5f9' },
  barSegment: { height: 6 },
  barLegend: { flexDirection: 'row', gap: 12, marginTop: 6 },
  legendDot: { fontSize: 11, color: '#64748b' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginBottom: 8 },
  emptyLink: { color: '#6366f1', fontSize: 15 },
});
