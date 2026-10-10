import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReportIssueScreen from './src/screens/ReportIssueScreen';
import IssueDetailScreen from './src/screens/IssueDetailScreen';
import MyIssuesScreen from './src/screens/MyIssuesScreen';

const Stack = createNativeStackNavigator(); const Tabs = createBottomTabNavigator();
const tabIcons = { Home: ['home-outline', 'home'], Report: ['add-circle-outline', 'add-circle'], MyIssues: ['list-outline', 'list'], Account: ['person-outline', 'person'] };
function AppTabs() { const { user, signOut } = useAuth(); return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: '#0D8B8B', tabBarInactiveTintColor: '#8A96A6', tabBarLabelStyle: { fontWeight: '700' }, tabBarStyle: { height: Platform.OS === 'ios' ? 82 : 62, paddingBottom: Platform.OS === 'ios' ? 24 : 8, paddingTop: 5 }, tabBarIcon: ({ focused, color, size }) => { const [outline, filled] = tabIcons[route.name]; return <Ionicons name={focused ? filled : outline} size={size} color={color} />; } })}><Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'All Issues' }} /><Tabs.Screen name="Report" component={ReportIssueScreen} options={{ tabBarLabel: 'Report' }} /><Tabs.Screen name="MyIssues" component={MyIssuesScreen} options={{ tabBarLabel: 'My Issues' }} /><Tabs.Screen name="Account" options={{ tabBarLabel: 'Account' }}>{() => <View style={styles.account}><Text style={styles.accountTitle}>{user?.name}</Text><Text style={styles.accountEmail}>{user?.email}</Text><Text style={styles.accountRole}>{user?.role === 'admin' ? 'Administrator' : 'Student'}</Text><Pressable style={styles.logout} onPress={signOut}><Text style={styles.logoutText}>Log out</Text></Pressable></View>}</Tabs.Screen></Tabs.Navigator>; }
function AuthFlow() { const [register, setRegister] = useState(false); return <AuthScreen mode={register ? 'register' : 'login'} onSwitch={() => setRegister(!register)} />; }
function Root() { const { user, loading } = useAuth(); if (loading) return <View style={styles.loading}><ActivityIndicator color="#0D8B8B" size="large" /></View>; return <NavigationContainer><Stack.Navigator><Stack.Screen name="App" component={user ? AppTabs : AuthFlow} options={{ headerShown: false }} /><Stack.Screen name="IssueDetail" component={IssueDetailScreen} options={{ title: 'Issue details', headerBackTitle: Platform.OS === 'ios' ? 'Back' : undefined, headerTintColor: '#0D8B8B' }} /></Stack.Navigator></NavigationContainer>; }
export default function App() { return <AuthProvider><Root /></AuthProvider>; }
const styles = StyleSheet.create({ loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FA' }, account: { flex: 1, backgroundColor: '#F4F7FA', padding: 24, alignItems: 'center', justifyContent: 'center' }, accountTitle: { color: '#172033', fontSize: 25, fontWeight: '800' }, accountEmail: { color: '#637083', marginTop: 8 }, accountRole: { color: '#0D8B8B', fontWeight: '800', marginTop: 18 }, logout: { marginTop: 36, backgroundColor: '#FFFFFF', borderColor: '#E2C9C9', borderWidth: 1, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 }, logoutText: { color: '#B42318', fontWeight: '800' } });
