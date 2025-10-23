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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Xatolik', error.message || 'Kirish jarayonida xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section with Gradient */}
          <LinearGradient
            colors={colors.gradient1}
            style={styles.heroSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/yuhakway-logo-1.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.tagline}>Your Pathway to Korean Universities</Text>
            </View>
          </LinearGradient>

          {/* Form Section */}
          <View style={[styles.formContainer, { backgroundColor: colors.background }]}>
            <View style={styles.welcomeSection}>
              <Text style={[styles.title, { color: colors.text }]}>Xush kelibsiz</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Hisobingizga kirish uchun ma'lumotlaringizni kiriting
              </Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="example@email.com"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.text }]}>Parol</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradient1}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Yuklanmoqda...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Kirish</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Hisobingiz yo'qmi?
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.7}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  Ro'yxatdan o'tish
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
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 120,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
