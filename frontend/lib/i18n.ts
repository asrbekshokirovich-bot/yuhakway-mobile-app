import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  uz: {
    translation: {
      // Auth
      'auth.signIn': 'Kirish',
      'auth.signUp': 'Ro\'yxatdan o\'tish',
      'auth.email': 'Email',
      'auth.password': 'Parol',
      'auth.fullName': 'To\'liq ism',
      'auth.createAccount': 'Hisobingizni yarating',
      'auth.welcomeBack': 'Xush kelibsiz',
      'auth.signUpDesc': 'Janubiy Koreyada o\'qish safari boshlang',
      'auth.signInDesc': 'Hisobingizga kirish uchun tizimga kiring',
      'auth.alreadyHaveAccount': 'Hisobingiz bormi?',
      'auth.dontHaveAccount': 'Hisobingiz yo\'qmi?',
      'auth.loading': 'Yuklanmoqda...',
      
      // Dashboard
      'dashboard.signOut': 'Chiqish',
      'dashboard.myApplications': 'Mening arizalarim',
      'dashboard.applications': 'Arizalar',
      'dashboard.calendar': 'Taqvim',
      'dashboard.profile': 'Profil',
      'dashboard.trackProgress': 'Ariza jarayoni va hujjatlar holatini kuzating',
      'dashboard.noApplications': 'Hali arizalar yo\'q',
      'dashboard.contactCounselor': 'Janubiy Koreyada o\'qish uchun maslahatchi bilan bog\'laning',
      'dashboard.applicationProgress': 'Ariza jarayoni',
      'dashboard.documentStatus': 'Hujjatlar holati',
      'dashboard.currentStage': 'Hozirgi bosqich',
      'dashboard.universityNotSet': 'Universitet tanlanmagan',
      'dashboard.programNotSet': 'Dastur tanlanmagan',
      'dashboard.loadingDashboard': 'Boshqaruv paneli yuklanmoqda...',
      
      // Progress Steps
      'dashboard.steps.inquiry': 'So\'rov',
      'dashboard.steps.submitted': 'Yuborildi',
      'dashboard.steps.review': 'Ko\'rib chiqish',
      'dashboard.steps.offer': 'Taklif',
      'dashboard.steps.visa': 'Viza',
      'dashboard.steps.complete': 'Tugallandi',
      
      // Calendar
      'calendar.title': 'Muhim sanalar va muddatlar',
      'calendar.loading': 'Taqvim yuklanmoqda...',
      'calendar.noEvents': 'Bu sana uchun voqealar yo\'q',
      'calendar.today': 'Bugun',
      
      // Profile
      'profile.title': 'Profil',
      'profile.personalInfo': 'Shaxsiy ma\'lumotlar',
      'profile.email': 'Email',
      'profile.phone': 'Telefon',
      'profile.theme': 'Mavzu',
      'profile.light': 'Yorug\'',
      'profile.dark': 'To\'q',
      'profile.language': 'Til',
      
      // Common
      'common.loading': 'Yuklanmoqda...',
      'common.error': 'Xatolik',
      'common.success': 'Muvaffaqiyat',
    }
  },
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('app_language');
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage || 'uz',
      fallbackLng: 'uz',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
