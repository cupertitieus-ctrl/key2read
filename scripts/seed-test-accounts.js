#!/usr/bin/env node
// ============================================================
// Seed Test Accounts for key2read
// Creates 4 test accounts: paid teacher, free teacher, paid parent, free parent
// Run: node scripts/seed-test-accounts.js
// ============================================================
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seed() {
  console.log('🌱 Seeding test accounts...\n');

  // 1. Add plan and class_id columns to users table if they don't exist
  // (These are ALTER TABLE commands that need to be run in Supabase SQL Editor)
  // We'll skip column creation here — provide SQL separately

  // 2. Create paid teacher: Teacher@School.com
  let paidTeacher = await upsertUser({
    email: 'teacher@school.com',
    name: 'Mrs. Thompson',
    role: 'teacher',
    auth_provider: 'local',
    school: 'Lincoln Elementary',
    plan: 'paid'
  });
  console.log('✅ Paid Teacher:', paidTeacher?.email, '(id:', paidTeacher?.id, ')');

  // Create class for paid teacher
  if (paidTeacher) {
    const cls = await ensureClass(paidTeacher.id, "Mrs. Thompson's Class", '4th');
    if (cls) console.log('   Class:', cls.name, '| Code:', cls.class_code);
  }

  // 3. Create free teacher: GuestTeacher@School.com
  let freeTeacher = await upsertUser({
    email: 'guestteacher@school.com',
    name: 'Mr. Garcia',
    role: 'teacher',
    auth_provider: 'local',
    school: 'Washington Elementary',
    plan: 'free'
  });
  console.log('✅ Free Teacher:', freeTeacher?.email, '(id:', freeTeacher?.id, ')');

  // Create class for free teacher
  if (freeTeacher) {
    const cls = await ensureClass(freeTeacher.id, "Mr. Garcia's Class", '3rd');
    if (cls) console.log('   Class:', cls.name, '| Code:', cls.class_code);
  }

  // 4. Get a class_id for parent accounts (use paid teacher's class)
  let parentClassId = null;
  if (paidTeacher) {
    const { data: cls } = await supabase.from('classes').select('id').eq('teacher_id', paidTeacher.id).single();
    parentClassId = cls?.id;
  }

  // 5. Create paid parent: Parent@Home.com
  let paidParent = await upsertUser({
    email: 'parent@home.com',
    name: 'Sarah Williams',
    role: 'parent',
    auth_provider: 'local',
    plan: 'paid',
    class_id: parentClassId
  });
  console.log('✅ Paid Parent:', paidParent?.email, '(id:', paidParent?.id, ', class_id:', parentClassId, ')');

  // 6. Create free parent: GuestParent@Home.com
  let freeParent = await upsertUser({
    email: 'guestparent@home.com',
    name: 'Mike Johnson',
    role: 'parent',
    auth_provider: 'local',
    plan: 'free',
    class_id: parentClassId
  });
  console.log('✅ Free Parent:', freeParent?.email, '(id:', freeParent?.id, ', class_id:', parentClassId, ')');

  // 7. Create a test student in the paid teacher's class
  if (paidTeacher && parentClassId) {
    const { data: cls } = await supabase.from('classes').select('*').eq('teacher_id', paidTeacher.id).single();
    const studentUser = await upsertUser({
      email: 'emma.williams@student.key2read.com',
      name: 'Emma Williams',
      role: 'student',
      auth_provider: 'local'
    });
    if (studentUser) {
      // Check if student record already exists
      const { data: existingStudent } = await supabase.from('students')
        .select('*')
        .eq('user_id', studentUser.id)
        .single();
      if (!existingStudent) {
        const initials = 'EW';
        const colors = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#EC4899'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const { data: student, error } = await supabase.from('students').insert({
          name: 'Emma Williams',
          initials,
          color,
          class_id: cls.id,
          user_id: studentUser.id,
          grade: cls.grade || '4th'
        }).select().single();
        if (student) {
          console.log('✅ Test Student: Emma Williams (student id:', student.id, ', class:', cls.name, ')');
          console.log('   Login: Name "Emma Williams" + Class Code "' + cls.class_code + '"');
        } else {
          console.error('  ❌ Error creating student record:', error?.message);
        }
      } else {
        console.log('✅ Test Student: Emma Williams (already exists, student id:', existingStudent.id, ')');
        console.log('   Login: Name "Emma Williams" + Class Code "' + cls.class_code + '"');
      }
    }
  }

  console.log('\n📋 Test Account Summary:');
  console.log('─────────────────────────────────────────────────────');
  console.log('Paid Teacher:  teacher@school.com        → Sign in as Teacher');
  console.log('Free Teacher:  guestteacher@school.com   → Sign in as Teacher');
  console.log('Paid Parent:   parent@home.com           → Sign in as Parent');
  console.log('Free Parent:   guestparent@home.com      → Sign in as Parent');
  console.log('Test Student:  "Emma Williams" + class code → Sign in as Student');
  console.log('─────────────────────────────────────────────────────');
  console.log('\nNote: Teacher/Parent login is email-only (no password needed)');
  console.log('      Student login uses Name + Class Code');
}

async function upsertUser(userData) {
  // Check if user already exists
  const { data: existing } = await supabase.from('users').select('*').eq('email', userData.email).single();
  if (existing) {
    // Update plan and class_id if provided
    const updates = {};
    if (userData.plan) updates.plan = userData.plan;
    if (userData.class_id) updates.class_id = userData.class_id;
    if (Object.keys(updates).length > 0) {
      await supabase.from('users').update(updates).eq('id', existing.id);
    }
    return existing;
  }

  // Create new user
  const { data, error } = await supabase.from('users').insert(userData).select().single();
  if (error) {
    console.error('  ❌ Error creating user', userData.email, ':', error.message);
    // If plan/class_id column doesn't exist, retry without them
    if (error.message.includes('does not exist')) {
      const { plan, class_id, ...basicData } = userData;
      const { data: d2, error: e2 } = await supabase.from('users').insert(basicData).select().single();
      if (e2) { console.error('  ❌ Retry failed:', e2.message); return null; }
      return d2;
    }
    return null;
  }
  return data;
}

async function ensureClass(teacherId, className, grade) {
  // Check if teacher already has a class
  const { data: existing } = await supabase.from('classes').select('*').eq('teacher_id', teacherId).single();
  if (existing) return existing;

  // Generate unique class code
  const code = 'T' + Math.random().toString(36).substring(2, 7).toUpperCase();

  const { data, error } = await supabase.from('classes').insert({
    name: className,
    grade: grade,
    teacher_id: teacherId,
    class_code: code
  }).select().single();

  if (error) { console.error('  ❌ Error creating class:', error.message); return null; }
  return data;
}

seed().catch(console.error);
