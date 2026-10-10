import { Pressable, StyleSheet, Text, View } from 'react-native';
import StatusBadge from './StatusBadge';

export default function IssueCard({ issue, onPress, onDelete }) {
  const date = new Date(issue.created_at.replace(' ', 'T') + 'Z').toLocaleDateString();
  return <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
    <View style={styles.row}><Text style={styles.category}>{issue.category}</Text><StatusBadge status={issue.status} /></View>
    <Text style={styles.title} numberOfLines={2}>{issue.title}</Text>
    <Text style={styles.location} numberOfLines={1}>{issue.location}</Text>
    <View style={styles.footer}><Text style={styles.date}>{date} · Reported by {issue.reporter_name}</Text>{onDelete ? <Pressable onPress={onDelete} hitSlop={8}><Text style={styles.delete}>Delete</Text></Pressable> : null}</View>
  </Pressable>;
}

const styles = StyleSheet.create({ card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5EAF0', shadowColor: '#12263A', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, pressed: { opacity: 0.8 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, category: { color: '#637083', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }, title: { color: '#172033', fontSize: 18, fontWeight: '700', marginTop: 12 }, location: { color: '#425466', fontSize: 14, marginTop: 8 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, date: { color: '#8A96A6', fontSize: 12, marginTop: 14, flex: 1 }, delete: { color: '#B42318', fontSize: 12, fontWeight: '800', marginTop: 14, marginLeft: 12 } });
