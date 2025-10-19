import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Application {
  id: string;
  university: string;
  program: string;
  status: string;
  created_at: string;
  notes?: string;
}

export default function ApplicationsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      inquiry: '#3B82F6',
      application_submitted: '#F59E0B',
      documents_pending: '#F97316',
      under_review: '#8B5CF6',
      offer_received: '#10B981',
      visa_applied: '#14B8A6',
      visa_approved: '#059669',
      completed: '#3B82F6',
      rejected: '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getProgressPercentage = (status: string) => {
    const statusMap: Record<string, number> = {
      inquiry: 12,
      application_submitted: 25,
      documents_pending: 37,
      under_review: 50,
      offer_received: 62,
      visa_applied: 75,
      visa_approved: 87,
      completed: 100,
      rejected: 0,
    };
    return statusMap[status] || 0;
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
        <Text style={styles.headerTitle}>Yuhakway</Text>
        <Text style={styles.headerSubtitle}>{t('dashboard.myApplications')}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {applications.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="school-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('dashboard.noApplications')}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('dashboard.contactCounselor')}
            </Text>
          </View>
        ) : (
          <View style={styles.applicationsContainer}>
            {applications.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/application/${app.id}`)}
                activeOpacity={0.7}
              >
                {/* University Info */}
                <View style={styles.cardHeader}>
                  <View style={styles.universityInfo}>
                    <Ionicons name="school" size={24} color={colors.primary} />
                    <View style={styles.universityText}>
                      <Text style={[styles.universityName, { color: colors.text }]}>
                        {app.university || t('dashboard.universityNotSet')}
                      </Text>
                      <Text style={[styles.programName, { color: colors.textSecondary }]}>
                        {app.program || t('dashboard.programNotSet')}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) + '20' }]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(app.status) }]}>
                      {getStatusLabel(app.status)}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: colors.text }]}>
                      {t('dashboard.applicationProgress')}
                    </Text>
                    <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                      {getProgressPercentage(app.status)}%
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: getStatusColor(app.status),
                          width: `${getProgressPercentage(app.status)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* View Details */}
                <View style={styles.cardFooter}>
                  <Text style={[styles.viewDetails, { color: colors.primary }]}>Batafsil ko'rish</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  },
  emptyContainer: {
    margin: 16,
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  applicationsContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
  },
  universityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  universityText: {
    flex: 1,
    marginLeft: 12,
  },
  universityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  programName: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  viewDetails: {
    fontSize: 16,
    fontWeight: '600',
  },
});
