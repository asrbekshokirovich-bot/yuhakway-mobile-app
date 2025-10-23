import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Xatolik', 'Parol kamida 6 belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    
    // Add timeout protection
    const timeoutId = setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Xatolik',
        'Ro\'yxatdan o\'tish juda uzoq davom etmoqda. Iltimos, qaytadan urinib ko\'ring yoki internet aloqangizni tekshiring.'
      );
    }, 30000); // 30 second timeout

    try {
      console.log('Starting registration...');
      await signUp(email, password, fullName);
      clearTimeout(timeoutId);
      console.log('Registration successful!');
      // Navigation will happen automatically via auth state change
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Registration error:', error);
      
      let errorMessage = 'Ro\'yxatdan o\'tish jarayonida xatolik yuz berdi';
      
      if (error.message) {
        if (error.message.includes('already registered')) {
          errorMessage = 'Bu email allaqachon ro\'yxatdan o\'tgan. Iltimos, kirish tugmasini bosing.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email manzil noto\'g\'ri formatda. Iltimos, to\'g\'ri email kiriting.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Parol talablarga javob bermaydi. Kamida 6 belgidan iborat bo\'lishi kerak.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Xatolik', errorMessage);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>Yuhakway</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{t('auth.createAccount')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('auth.signUpDesc')}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('auth.fullName')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="Ismingiz"
                placeholderTextColor={colors.textSecondary}
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('auth.email')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="example@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('auth.password')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="Kamida 6 belgi"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? t('auth.loading') : t('auth.signUp')}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                {t('auth.alreadyHaveAccount')}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  {t('auth.signIn')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
