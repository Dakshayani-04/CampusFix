import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import client from '../api/client';
import IssueCard from '../components/IssueCard';

export default function MyIssuesScreen({ navigation }) {
  const [issues, setIssues] = useState([]); const [refreshing, setRefreshing] = useState(false); const [error, setError] = useState('');
  const load = useCallback(async () => { try { const { data } = await client.get('/issues/mine'); setIssues(data); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load your issues.'); } }, []);
  useEffect(() => { load(); }, [load]);
  function confirmDelete(issue) { Alert.alert('Delete report?', 'This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await client.delete(`/issues/${issue.id}`); load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Could not delete this issue.'); } } }]); }
  return <View style={styles.screen}><FlatList data={issues} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor="#0D8B8B" />} ListHeaderComponent={<><Text style={styles.heading}>My reports</Text><Text style={styles.subtitle}>Track the issues you have raised.</Text>{error ? <Text style={styles.error}>{error}</Text> : null}</>} ListEmptyComponent={<Text style={styles.empty}>You have not reported anything yet.</Text>} renderItem={({ item }) => <IssueCard issue={item} onPress={() => navigation.navigate('IssueDetail', { issueId: item.id })} onDelete={() => confirmDelete(item)} />} />}</View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F4F7FA' }, list: { padding: 18, paddingBottom: 30 }, heading: { color: '#172033', fontSize: 30, fontWeight: '800', marginTop: 8 }, subtitle: { color: '#637083', fontSize: 15, marginTop: 5, marginBottom: 22 }, empty: { color: '#637083', textAlign: 'center', marginTop: 50 }, error: { color: '#B42318', marginBottom: 12 } });
