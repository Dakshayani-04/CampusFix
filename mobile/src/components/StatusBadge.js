import { StyleSheet, Text, View } from 'react-native';

const colors = {
  Pending: { background: '#FFF0D7', text: '#A76000' },
  'In Progress': { background: '#DDEBFF', text: '#1A5EAB' },
  Resolved: { background: '#DDF5E7', text: '#187244' },
};

export default function StatusBadge({ status }) {
  const palette = colors[status] || colors.Pending;
  return <View style={[styles.badge, { backgroundColor: palette.background }]}><Text style={[styles.text, { color: palette.text }]}>{status}</Text></View>;
}

const styles = StyleSheet.create({ badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' }, text: { fontSize: 12, fontWeight: '700' } });
