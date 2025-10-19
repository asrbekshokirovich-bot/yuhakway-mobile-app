import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: string;
}

export default function CalendarScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user?.id)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      deadline: 'time',
      interview: 'people',
      submission: 'document-text',
      meeting: 'calendar',
    };
    return icons[type] || 'calendar';
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      deadline: '#EF4444',
      interview: '#8B5CF6',
      submission: '#F59E0B',
      meeting: '#3B82F6',
    };
    return colors[type] || '#6B7280';
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
        <Text style={styles.headerTitle}>Taqvim</Text>
        <Text style={styles.headerSubtitle}>Muhim sanalar va muddatlar</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {events.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="calendar-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Voqealar yo'q</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Hozircha rejalashtirilgan voqealar yo'q
            </Text>
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.eventIcon,
                    { backgroundColor: getEventColor(event.event_type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getEventIcon(event.event_type) as any}
                    size={24}
                    color={getEventColor(event.event_type)}
                  />
                </View>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                  {event.description && (
                    <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                      {event.description}
                    </Text>
                  )}
                  <View style={styles.eventFooter}>
                    <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
                      {format(new Date(event.event_date), 'dd MMM yyyy, HH:mm')}
                    </Text>
                  </View>
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
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  eventsContainer: {
    padding: 16,
  },
  eventCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDate: {
    fontSize: 14,
  },
});
