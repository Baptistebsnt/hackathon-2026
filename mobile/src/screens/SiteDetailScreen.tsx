import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getSiteById, SiteResponse } from '../services/api';

const MATERIAL_LABELS: Record<string, string> = {
  CONCRETE: 'Béton', STEEL: 'Acier', GLASS: 'Verre', WOOD: 'Bois', ALUMINUM: 'Aluminium'
};

export default function SiteDetailScreen() {
  const route = useRoute<any>();
  const [site, setSite] = useState<SiteResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteById(route.params.siteId)
      .then(setSite)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6366f1" /></View>;
  if (!site) return <View style={styles.center}><Text>Site introuvable</Text></View>;

  const constrPct = site.totalCo2Kg > 0 ? (site.constructionCo2Kg / site.totalCo2Kg) * 100 : 0;
  const operPct = 100 - constrPct;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{site.name}</Text>

      {/* CO₂ total */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>CO₂ total</Text>
        <Text style={styles.totalValue}>{(site.totalCo2Kg / 1000).toFixed(1)} t CO₂e</Text>
      </View>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <KPI label="CO₂ / m²" value={`${site.co2PerM2.toFixed(1)} kg`} />
        <KPI label="CO₂ / employé" value={`${Math.round(site.co2PerEmployee)} kg`} />
        <KPI label="Surface" value={`${site.surfaceM2.toLocaleString()} m²`} />
      </View>

      {/* Barre construction vs exploitation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Construction vs Exploitation</Text>
        <View style={styles.bar}>
          <View style={[styles.barConstruction, { flex: constrPct }]} />
          <View style={[styles.barOperation, { flex: operPct }]} />
        </View>
        <View style={styles.barLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Construction : {(site.constructionCo2Kg / 1000).toFixed(1)} t ({constrPct.toFixed(0)}%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Exploitation : {(site.operationCo2KgPerYear / 1000).toFixed(1)} t/an ({operPct.toFixed(0)}%)</Text>
          </View>
        </View>
      </View>

      {/* Infos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Caractéristiques</Text>
        {[
          ['Parking', `${site.parkingSpots} places`],
          ['Énergie', `${site.energyConsumptionMwh.toLocaleString()} MWh/an`],
          ['Employés', String(site.employees)],
          ['Postes', String(site.workstations)],
        ].map(([k, v]) => (
          <View key={k} style={styles.infoRow}>
            <Text style={styles.infoKey}>{k}</Text>
            <Text style={styles.infoVal}>{v}</Text>
          </View>
        ))}
      </View>

      {/* Matériaux */}
      {site.materialBreakdown?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matériaux</Text>
          {site.materialBreakdown.map(m => (
            <View key={m.materialType} style={styles.materialRow}>
              <Text style={styles.materialName}>{MATERIAL_LABELS[m.materialType] || m.materialType}</Text>
              <Text style={styles.materialCo2}>{(m.co2Kg / 1000).toFixed(1)} t</Text>
              <View style={styles.pctBar}>
                <View style={[styles.pctFill, { width: `${m.percentageOfTotal}%` }]} />
              </View>
              <Text style={styles.pct}>{m.percentageOfTotal.toFixed(0)}%</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const KPI = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.kpi}>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  totalCard: { backgroundColor: '#0f172a', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 12 },
  totalLabel: { color: '#93c5fd', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { color: 'white', fontSize: 32, fontWeight: '700', marginTop: 4 },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  kpi: { flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  kpiValue: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  kpiLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
  section: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 12 },
  bar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  barConstruction: { backgroundColor: '#f59e0b' },
  barOperation: { backgroundColor: '#3b82f6' },
  barLegend: { gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#374151' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  infoKey: { fontSize: 14, color: '#6b7280' },
  infoVal: { fontSize: 14, fontWeight: '500', color: '#0f172a' },
  materialRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  materialName: { width: 80, fontSize: 13, color: '#374151' },
  materialCo2: { width: 55, fontSize: 13, fontWeight: '600', color: '#0f172a', textAlign: 'right' },
  pctBar: { flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  pctFill: { height: 6, backgroundColor: '#6366f1', borderRadius: 3 },
  pct: { width: 32, fontSize: 11, color: '#94a3b8', textAlign: 'right' },
});
