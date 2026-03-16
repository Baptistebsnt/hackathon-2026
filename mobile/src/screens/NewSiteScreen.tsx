import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createSite, MaterialType } from '../services/api';

const MATERIALS: { key: MaterialType; label: string; factor: string }[] = [
  { key: 'CONCRETE',  label: 'Béton',      factor: '150 kgCO₂/t' },
  { key: 'STEEL',     label: 'Acier',      factor: '1 850 kgCO₂/t' },
  { key: 'GLASS',     label: 'Verre',      factor: '1 400 kgCO₂/t' },
  { key: 'WOOD',      label: 'Bois',       factor: '-1 600 kgCO₂/t' },
  { key: 'ALUMINUM',  label: 'Aluminium',  factor: '8 000 kgCO₂/t' },
];

export default function NewSiteScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [surfaceM2, setSurfaceM2] = useState('');
  const [parkingSpots, setParkingSpots] = useState('');
  const [energyMwh, setEnergyMwh] = useState('');
  const [employees, setEmployees] = useState('');
  const [workstations, setWorkstations] = useState('');
  const [materialQty, setMaterialQty] = useState<Record<MaterialType, string>>({
    CONCRETE: '', STEEL: '', GLASS: '', WOOD: '', ALUMINUM: ''
  });

  const handleSubmit = async () => {
    if (!name || !surfaceM2 || !energyMwh) {
      Alert.alert('Champs manquants', 'Nom, surface et énergie sont obligatoires.');
      return;
    }

    const materials = MATERIALS
      .filter(m => materialQty[m.key] && parseFloat(materialQty[m.key]) > 0)
      .map(m => ({ materialType: m.key, quantityTons: parseFloat(materialQty[m.key]) }));

    setLoading(true);
    try {
      const result = await createSite({
        name,
        surfaceM2: parseFloat(surfaceM2),
        parkingSpots: parseInt(parkingSpots) || 0,
        energyConsumptionMwh: parseFloat(energyMwh),
        employees: parseInt(employees) || 0,
        workstations: parseInt(workstations) || 0,
        materials
      });
      navigation.navigate('SiteDetail', { siteId: result.id });
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de créer le site. Vérifiez la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Nouveau site</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <Field label="Nom du site *" value={name} onChangeText={setName} placeholder="Campus Rennes" />
        <Row>
          <Field label="Surface (m²) *" value={surfaceM2} onChangeText={setSurfaceM2} placeholder="11771" keyboardType="numeric" flex />
          <Field label="Parking (places)" value={parkingSpots} onChangeText={setParkingSpots} placeholder="308" keyboardType="numeric" flex />
        </Row>
        <Field label="Énergie annuelle (MWh) *" value={energyMwh} onChangeText={setEnergyMwh} placeholder="1840" keyboardType="numeric" />
        <Row>
          <Field label="Employés" value={employees} onChangeText={setEmployees} placeholder="1800" keyboardType="numeric" flex />
          <Field label="Postes de travail" value={workstations} onChangeText={setWorkstations} placeholder="1037" keyboardType="numeric" flex />
        </Row>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Matériaux de construction</Text>
        <Text style={styles.sectionHint}>Laissez vide si non applicable</Text>
        {MATERIALS.map(m => (
          <View key={m.key} style={styles.materialRow}>
            <View style={styles.materialLabel}>
              <Text style={styles.materialName}>{m.label}</Text>
              <Text style={styles.materialFactor}>{m.factor}</Text>
            </View>
            <TextInput
              style={styles.materialInput}
              value={materialQty[m.key]}
              onChangeText={v => setMaterialQty(prev => ({ ...prev, [m.key]: v }))}
              placeholder="0 t"
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btnSubmit, loading && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="white" />
          : <Text style={styles.btnText}>Calculer l'empreinte carbone</Text>
        }
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Sous-composants locaux
const Field = ({ label, flex, ...props }: any) => (
  <View style={[styles.field, flex && { flex: 1 }]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const Row = ({ children }: any) => (
  <View style={{ flexDirection: 'row', gap: 10 }}>{children}</View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 20 },
  section: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  sectionHint: { fontSize: 12, color: '#94a3b8', marginTop: -8, marginBottom: 12 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: '#6b7280', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: '#fafafa' },
  materialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  materialLabel: { flex: 1 },
  materialName: { fontSize: 14, fontWeight: '500', color: '#0f172a' },
  materialFactor: { fontSize: 11, color: '#94a3b8' },
  materialInput: { width: 90, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 8, fontSize: 14, textAlign: 'right', backgroundColor: '#fafafa' },
  btnSubmit: { backgroundColor: '#6366f1', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
