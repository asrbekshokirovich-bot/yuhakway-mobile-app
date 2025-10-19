import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface Application {
  id: string;
  university: string;
  program: string;
  status: string;
  created_at: string;
  notes?: string;
}

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
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

  const getStageDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      inquiry: "Murojatingiz qabul qilindi. Maslahatchi tez orada siz bilan bog'lanadi.",
      application_submitted: "Arizangiz universitetga yuborildi. Dastlabki ko'rib chiqish kutilmoqda.",
      documents_pending: "Arizani davom ettirish uchun kerakli hujjatlarni topshiring.",
      under_review: "Arizangiz universitet qabul qilish komissiyasi tomonidan ko'rib chiqilmoqda.",
      offer_received: "Tabriklaymiz! Universitetdan taklif oldingiz.",
      visa_applied: "Viza uchun ariza topshirildi. Tasdiqlash kutilmoqda.",
      visa_approved: "Ajoyib yangilik! Vizangiz tasdiqlandi. Sayohatingizga tayyorlaning.",
      completed: "Ariza jarayoni muvaffaqiyatli yakunlandi. Yangi sayohatingiz bilan!",
      rejected: "Afsuski, bu ariza muvaffaqiyatsiz tugadi. Boshqa variantlar uchun maslahatchi bilan bog'laning.",
    };
    return descriptions[status] || '';
  };

  const progressSteps = [
    { key: 'inquiry', label: "So'rov", value: 12 },
    { key: 'application_submitted', label: 'Yuborildi', value: 25 },
    { key: 'under_review', label: "Ko'rib chiqish", value: 50 },
    { key: 'offer_received', label: 'Taklif', value: 62 },
    { key: 'visa_applied', label: 'Viza', value: 75 },
    { key: 'completed', label: 'Tugallandi', value: 100 },
  ];

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!application) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Ariza topilmadi</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ariza tafsilotlari</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* University Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.universityHeader}>
            <Ionicons name="school" size={32} color={colors.primary} />
            <View style={styles.universityInfo}>
              <Text style={[styles.universityName, { color: colors.text }]}>
                {application.university || 'Universitet tanlanmagan'}
              </Text>
              <Text style={[styles.programName, { color: colors.textSecondary }]}>
                {application.program || 'Dastur tanlanmagan'}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
              {getStatusLabel(application.status)}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Ariza jarayoni</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                {getProgressPercentage(application.status)}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: getStatusColor(application.status),
                    width: `${getProgressPercentage(application.status)}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Progress Steps */}
          <View style={styles.stepsContainer}>
            {progressSteps.map((step, index) => {
              const isCompleted = getProgressPercentage(application.status) >= step.value;
              const isCurrent = application.status === step.key;
              return (
                <View key={step.key} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor: isCompleted ? getStatusColor(application.status) : colors.border,
                        borderWidth: isCurrent ? 3 : 0,
                        borderColor: getStatusColor(application.status),
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCompleted ? colors.text : colors.textSecondary,
                        fontWeight: isCurrent ? '700' : '400',
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Current Stage Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Hozirgi bosqich</Text>
          <Text style={[styles.stageDescription, { color: colors.textSecondary }]}>
            {getStageDescription(application.status)}
          </Text>
        </View>

        {/* Notes Card */}
        {application.notes && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Maslahatchi izohlari</Text>
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>{application.notes}</Text>
          </View>
        )}

        {/* Document Status Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Hujjatlar holati</Text>
          <View style={styles.documentStatusRow}>
            <Ionicons
              name={
                application.status === 'documents_pending'
                  ? 'time'
                  : ['under_review', 'application_submitted'].includes(application.status)
                  ? 'hourglass'
                  : 'checkmark-circle'
              }
              size={24}
              color={
                application.status === 'documents_pending'
                  ? '#F59E0B'
                  : ['under_review', 'application_submitted'].includes(application.status)
                  ? '#3B82F6'
                  : '#10B981'
              }
            />
            <Text style={[styles.documentStatusText, { color: colors.textSecondary }]}>
              {application.status === 'documents_pending'
                ? "Hujjatlar ko'rib chiqilmoqda"
                : ['under_review', 'application_submitted'].includes(application.status)
                ? 'Hujjatlar tekshirilmoqda'
                : 'Hujjatlar tasdiqlandi'}
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  universityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  universityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  universityName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  programName: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  stepItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  stepLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  stageDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  documentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentStatusText: {
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    fontSize: 18,
  },
});
