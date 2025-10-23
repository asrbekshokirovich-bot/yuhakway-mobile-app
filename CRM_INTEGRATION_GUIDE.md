# Yuhakway CRM Integration Guide
## Student Account Management for Mobile App

## 📋 Overview

The Yuhakway mobile app now operates with a **CRM-managed authentication system**. Students can no longer sign up themselves - all accounts are created by admins through the CRM when adding new students.

---

## 🔄 Current Workflow

### Mobile App (Student Side)
1. ✅ **Login Only** - No signup button
2. ✅ **Password Change** - Students can change their password
3. ✅ **Forgot Password** - Contact admin message
4. ✅ Logo integration with actual Yuhakway branding

### CRM (Admin Side)  
**REQUIRES IMPLEMENTATION IN YOUR WEB CRM:**

## 🛠️ What Needs to Be Implemented in Your CRM

### 1. Random Password Generation
When creating a student account in the CRM, you need to:

**File to Update:** `/supabase/functions/create-student-user/index.ts` (Edge Function)

```typescript
// Add this function to generate random password
function generateRandomPassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// In your create-student-user function:
const randomPassword = generateRandomPassword();

// When creating the user:
const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
  email: emailToUse,
  password: randomPassword,
  email_confirm: true, // Auto-confirm email
  user_metadata: {
    full_name: fullName,
    role: 'student'
  }
});

// Store the password in student_details or profiles table
await supabaseAdmin
  .from('profiles')
  .update({ 
    temporary_password: randomPassword, // Add this column to profiles table
    password_changed: false // Track if student changed password
  })
  .eq('id', authData.user.id);
```

### 2. Display Password in Student Card

**File to Update:** `src/components/crm/StudentDetailModal.tsx`

Add this section in the Profile tab (around line 605-650):

```tsx
{/* Login Credentials Section */}
<div className="border-t pt-4 mt-4">
  <h3 className="font-semibold mb-3 flex items-center gap-2">
    <Key className="h-4 w-4" />
    Login Credentials (For Student)
  </h3>
  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Email</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input 
            value={student.email || "Not set"} 
            disabled 
            className="font-mono text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(student.email);
              toast.success("Email copied!");
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {student.temporary_password && (
        <div>
          <Label className="text-xs text-muted-foreground">
            Temporary Password 
            {student.password_changed && (
              <Badge variant="outline" className="ml-2">Changed by student</Badge>
            )}
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              value={student.temporary_password} 
              disabled 
              className="font-mono text-sm font-bold"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(student.temporary_password);
                toast.success("Password copied!");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            📱 Share these credentials with the student to login to the mobile app
          </p>
        </div>
      )}
    </div>
  </div>
</div>
```

### 3. Database Schema Updates

Add these columns to your `profiles` table in Supabase:

```sql
-- Add temporary_password column
ALTER TABLE profiles 
ADD COLUMN temporary_password text;

-- Add password_changed tracking
ALTER TABLE profiles 
ADD COLUMN password_changed boolean DEFAULT false;

-- Add last_password_change timestamp
ALTER TABLE profiles 
ADD COLUMN last_password_change timestamp with time zone;
```

### 4. Password Change Webhook (Optional but Recommended)

Create a database trigger to update the CRM when student changes password:

**File:** Create new Edge Function `supabase/functions/update-password-status/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { userId } = await req.json()

  // Update password_changed flag
  await supabaseAdmin
    .from('profiles')
    .update({ 
      password_changed: true,
      last_password_change: new Date().toISOString()
    })
    .eq('id', userId)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## 📱 Mobile App Features

### ✅ Implemented Features:

**1. Login Screen**
- Modern gradient design with Yuhakway logo
- Email + Password authentication
- "Forgot Password" link (shows contact admin message)
- Eye icon to show/hide password
- No signup link

**2. Change Password Screen**
- Accessible from Profile → Settings → "Parolni o'zgartirish"
- Current password verification
- New password with confirmation
- Password strength requirements (min 6 characters)
- Updates Supabase auth password
- Success feedback

**3. Profile Screen**
- User information display
- Theme toggle (Light/Dark mode)
- Language display (Uzbek)
- **Change Password** button
- Sign out functionality

---

## 🔐 Security Flow

### Initial Login
1. Admin creates student in CRM
2. System generates random password (12 characters, alphanumeric + symbols)
3. Password displayed in student card in CRM
4. Admin shares credentials with student via:
   - WhatsApp
   - Phone call
   - In-person
   - Email (if secure)

### Student First Login
1. Student opens Yuhakway mobile app
2. Enters email and temporary password from admin
3. Successfully logs in
4. Sees dashboard

### Student Changes Password
1. Goes to Profile → "Parolni o'zgartirish"
2. Enters current password (the temporary one)
3. Enters new password (min 6 chars)
4. Confirms new password
5. System updates Supabase auth
6. CRM `profiles` table updated with `password_changed = true`

### CRM Admin View
- Can see if student changed password (badge: "Changed by student")
- Can still see the original temporary password for reference
- Can see last password change timestamp

---

## 🎯 Implementation Checklist

### Mobile App (✅ COMPLETED)
- [x] Remove signup screen
- [x] Update login screen with forgot password
- [x] Add change password screen
- [x] Add navigation to change password from profile
- [x] Integrate Yuhakway logo
- [x] Update authentication flow

### CRM Web (🔄 YOUR TASK)
- [ ] Add random password generation to `create-student-user` edge function
- [ ] Add `temporary_password` and `password_changed` columns to `profiles` table
- [ ] Update StudentDetailModal to display login credentials
- [ ] Add copy-to-clipboard buttons for email and password
- [ ] Add visual indicator when student has changed password
- [ ] (Optional) Add password reset functionality for admins
- [ ] (Optional) Add webhook to track password changes

---

## 🚀 Testing Guide

### Test Student Account Creation
1. Open CRM
2. Click "Add New Student"
3. Fill in student details (name, email, phone, etc.)
4. Click "Add Student"
5. Open student detail modal
6. Verify:
   - ✅ Login credentials section appears
   - ✅ Email is displayed
   - ✅ Temporary password is displayed (e.g., "aB7!mK9pL2nQ")
   - ✅ Copy buttons work

### Test Mobile App Login
1. Open mobile app
2. Enter student email
3. Enter temporary password from CRM
4. Click "Kirish"
5. Verify:
   - ✅ Login successful
   - ✅ Dashboard appears
   - ✅ Student data loads

### Test Password Change
1. In mobile app, go to Profile
2. Tap "Parolni o'zgartirish"
3. Enter current password
4. Enter new password (min 6 chars)
5. Confirm new password
6. Tap "Parolni o'zgartirish"
7. Verify:
   - ✅ Success message appears
   - ✅ Returns to profile
8. Go back to CRM, refresh student details
9. Verify:
   - ✅ "Changed by student" badge appears
   - ✅ `password_changed = true` in database

### Test Login with New Password
1. Log out from mobile app
2. Log in with student email
3. Enter NEW password (not temporary)
4. Verify:
   - ✅ Login successful

---

## 🔍 Troubleshooting

### Issue: Password not showing in CRM
**Solution:** Check if `temporary_password` column exists in `profiles` table

### Issue: Student can't login with temporary password
**Solution:** 
- Verify email confirmation is disabled in Supabase Auth settings
- Check if password was properly set during user creation

### Issue: Password change doesn't work
**Solution:**
- Check Supabase Auth settings
- Verify student is authenticated
- Check console logs for error messages

### Issue: CRM not updating when password changes
**Solution:**
- Implement the webhook/trigger
- OR refresh the student detail modal after student changes password

---

## 📞 Contact for Support

If students forget their password:
- They should contact admin via email: admin@yuhakway.uz
- Admin can reset password in Supabase dashboard
- OR admin can generate new temporary password and share

---

## 🎨 UI Screenshots Reference

**Login Screen:**
- Gradient header with Yuhakway logo
- Email input with mail icon
- Password input with lock icon and eye toggle
- "Parolni unutdingizmi?" link at bottom

**Change Password Screen:**
- Back button in header
- Current password field
- New password field
- Confirm password field
- Info box with password requirements
- Blue gradient submit button

**Profile Settings:**
- Theme toggle with sun/moon icon
- Language selector showing "O'zbekcha"
- "Parolni o'zgartirish" with key icon and forward chevron

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [React Native Password Best Practices](https://reactnative.dev/docs/security)

---

**Version:** 1.0.0  
**Last Updated:** Current Session  
**Maintained by:** Yuhakway Development Team
