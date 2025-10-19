# Yuhakway Mobile App

Yuhakway student dashboard mobile application built with Expo and React Native, connected to the existing Supabase backend.

## Features Implemented

### ✅ Phase 1 Features (MVP)
1. **Authentication** - Login/Register with Supabase Auth
2. **Applications List** - View all student applications with progress tracking
3. **Application Details** - Detailed view of each application with status, progress bar, and notes
4. **Calendar** - Important dates and deadlines for applications
5. **Profile** - User profile information with theme toggle
6. **Theme Toggle** - Light/Dark mode support
7. **Language Support** - Uzbek language (structure ready for more languages)

## Tech Stack

- **Frontend**: Expo (React Native)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: expo-router (file-based routing)
- **State Management**: React Context
- **UI Components**: Native React Native components
- **Styling**: Yuhakway brand colors (Primary Blue #3B82F6)
- **i18n**: i18next with Uzbek translations

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/                 # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                 # Main app tabs
│   │   ├── index.tsx          # Applications list
│   │   ├── calendar.tsx       # Calendar screen
│   │   └── profile.tsx        # Profile screen
│   ├── application/[id].tsx   # Application detail modal
│   ├── _layout.tsx            # Root layout with providers
│   └── index.tsx              # Entry point with auth redirect
├── contexts/
│   ├── AuthContext.tsx        # Supabase authentication
│   └── ThemeContext.tsx       # Theme management
├── lib/
│   ├── supabase.ts            # Supabase client setup
│   └── i18n.ts                # i18n configuration
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and Yarn
- Expo CLI
- Supabase account with existing project

### Install Dependencies
```bash
cd /app/frontend
yarn install
```

### Environment Variables
The app is already connected to the Supabase project:
- **Supabase URL**: https://dacegfnivzdkzctgubqt.supabase.co
- **Supabase Anon Key**: (configured in lib/supabase.ts)

### Run the App
```bash
# Start development server
yarn start

# For Android
yarn android

# For iOS
yarn ios

# For Web
yarn web
```

## Database Schema

The app connects to existing Supabase tables:

### profiles
- `id` (uuid, PK)
- `full_name` (text)
- `email` (text)
- `phone` (text)
- `created_at` (timestamp)

### applications
- `id` (uuid, PK)
- `student_id` (uuid, FK → profiles)
- `university` (text)
- `program` (text)
- `status` (text)
- `notes` (text)
- `created_at` (timestamp)

### calendar_events
- `id` (uuid, PK)
- `user_id` (uuid, FK → profiles)
- `title` (text)
- `description` (text)
- `event_date` (timestamp)
- `event_type` (text)

## Application Status Flow

```
inquiry → application_submitted → documents_pending → 
under_review → offer_received → visa_applied → 
visa_approved → completed
```

## Key Features Details

### 1. Authentication
- Supabase Auth with email/password
- Auto-redirect based on auth state
- Session persistence with AsyncStorage

### 2. Applications List
- Pull-to-refresh
- Color-coded status badges
- Progress bars (12% → 100%)
- Quick navigation to details

### 3. Application Details
- University and program info
- Progress tracking with visual steps
- Current stage description
- Counselor notes
- Document status

### 4. Calendar
- Upcoming events and deadlines
- Color-coded event types
- Date formatting with date-fns

### 5. Profile
- Personal information display
- Theme toggle (Light/Dark)
- Language switcher (ready for expansion)
- Sign out functionality

## Design System

### Colors
- **Primary**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Orange)
- **Error**: #EF4444 (Red)

### Theme Support
- Light mode and Dark mode
- System preference detection
- Persistent theme selection

## Navigation Structure

```
Root
├── (auth)
│   ├── login
│   └── register
└── (tabs)
    ├── index (Applications)
    ├── calendar
    └── profile
```

## Security

- Supabase Row Level Security (RLS) policies
- JWT-based authentication
- Secure token storage with AsyncStorage
- User can only access their own data

## Future Enhancements (Not in MVP)

- [ ] Messages/Communications
- [ ] Document uploads
- [ ] Push notifications
- [ ] Multi-language support (Russian, English, Korean)
- [ ] Biometric authentication
- [ ] Offline mode
- [ ] Deep linking

## Testing

To test the app:

1. **Register a new account** or use existing credentials
2. **View Applications**: See your applications list
3. **Tap on an application**: View detailed progress
4. **Check Calendar**: View upcoming deadlines
5. **Visit Profile**: Toggle theme, view user info
6. **Sign Out**: Test authentication flow

## Support

For issues or questions:
- Check Supabase logs for backend errors
- Check Expo DevTools for frontend errors
- Verify Supabase credentials are correct

## Version

**v1.0.0** - MVP Release with core student dashboard features

---

Built with ❤️ for Yuhakway students
