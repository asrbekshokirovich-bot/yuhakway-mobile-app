import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { colors, theme, setTheme, actualTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Chiqish',
      'Hisobingizdan chiqmoqchimisiz?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Chiqish',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleTheme = () => {
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <Text style={styles.headerSubtitle}>{profile?.full_name || 'Foydalanuvchi'}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Personal Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Shaxsiy ma'lumotlar</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>To'liq ism</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {profile?.full_name || 'Kiritilmagan'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email}</Text>
            </View>
          </View>

          {profile?.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Telefon</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{profile.phone}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Settings Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sozlamalar</Text>

          <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={actualTheme === 'dark' ? 'moon' : 'sunny'}
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Mavzu</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                {actualTheme === 'dark' ? "To'q" : "Yorug'"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Til</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>O'zbekcha</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/change-password' as any)}>
            <View style={styles.settingLeft}>
              <Ionicons name="key" size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Parolni o'zgartirish</Text>
            </View>
            <View style={styles.settingRight}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.error }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color="#FFFFFF" />
          <Text style={styles.signOutText}>Chiqish</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>Yuhakway v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 24,
    marginBottom: 8,
  },
});
