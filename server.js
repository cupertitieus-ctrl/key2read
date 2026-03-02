require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('./server/db');
const claude = require('./server/claude');
const { getChapterPages } = require('./server/book-pages');
const shopify = require('./server/shopify');
const klaviyo = require('./server/klaviyo');

const app = express();
const PORT = process.env.PORT || 3456;

// Trust proxy in production (Render uses a reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
app.use(express.json({
  verify: (req, res, buf) => {
    // Store raw body for Shopify webhook HMAC verification
    if (req.originalUrl === '/api/webhooks/shopify/order-paid') {
      req.rawBody = buf;
    }
  }
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'key2read-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Serve only public-safe directories (not server/, package.json, .env, etc.)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));
app.use('/pages', express.static(path.join(__dirname, 'pages'), { extensions: ['html'] }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/index.html', express.static(path.join(__dirname, 'index.html')));

// ─── Helper: build full session data for a user ───
async function buildSessionUser(user) {
  let sessionUser = { ...user };

  if (user.role === 'student' || user.role === 'child') {
    const studentRecord = await db.getStudentByUserId(user.id);
    if (studentRecord) {
      // Get class info for the student (only if they have a class)
      let cls = null;
      if (studentRecord.class_id) {
        const { data } = await db.supabase.from('classes').select('*, users!teacher_id (name, email)').eq('id', studentRecord.class_id).single();
        cls = data;
      }
      sessionUser = {
        ...sessionUser,
        studentId: studentRecord.id,
        classId: studentRecord.class_id || null,
        className: cls?.name || '',
        teacherName: cls?.users?.name || '',
        parentEmail: cls?.users?.email || '',
        grade: studentRecord.grade || cls?.grade || '4th',
        reading_level: studentRecord.reading_level || 3.0,
        reading_score: studentRecord.reading_score || 500,
        keys_earned: studentRecord.keys_earned || 0,
        quizzes_completed: studentRecord.quizzes_completed || 0,
        accuracy: studentRecord.accuracy || 0,
        streak_days: studentRecord.streak_days || 0,
        onboarded: studentRecord.onboarded || 0
      };
    }
  } else if (user.role === 'teacher') {
    const cls = await db.getTeacherClass(user.id);
    if (cls) {
      sessionUser.classId = cls.id;
      sessionUser.classCode = cls.class_code;
      sessionUser.className = cls.name;
      sessionUser.grade = cls.grade || '4th';
    }
  } else if (user.role === 'parent') {
    // Parent: look up their family class by class_id first, then fallback to teacher_id
    let cls = null;
    if (user.class_id) {
      const { data } = await db.supabase.from('classes').select('id, name, class_code, grade').eq('id', user.class_id).single();
      cls = data;
    }
    // Fallback: find class where parent is the teacher_id (family class creator)
    if (!cls) {
      cls = await db.getTeacherClass(user.id);
    }
    if (cls) {
      sessionUser.classId = cls.id;
      sessionUser.classCode = cls.class_code;
      sessionUser.familyCode = cls.class_code;
      sessionUser.className = cls.name;
      sessionUser.grade = cls.grade || '4th';
      // Also fix the user record if class_id was missing
      if (!user.class_id) {
        await db.supabase.from('users').update({ class_id: cls.id }).eq('id', user.id);
      }
    }
    sessionUser.plan = user.plan || 'free';
  }

  // Include plan for all users
  sessionUser.plan = user.plan || 'free';

  return sessionUser;
}

// ─── AUTH ROUTES ───
app.post('/api/auth/login', async (req, res) => {
  const { email, name, classCode, role, password, rememberMe } = req.body;

  try {
    if (role === 'student') {
      // School student login: find by name + class code (auto-create if not found)
      if (!name) return res.status(400).json({ error: 'Please enter your name.' });
      if (!classCode) return res.status(400).json({ error: 'Please enter your class code.' });

      const cls = await db.getClassByCode(classCode);
      if (!cls) return res.status(400).json({ error: 'Invalid class code. Ask your teacher for the correct code.' });

      // Find student by name in this class
      let { data: studentRecords } = await db.supabase
        .from('students')
        .select('*, users!user_id (id, email, name, role)')
        .eq('class_id', cls.id)
        .ilike('name', name.trim());

      let user;
      if (!studentRecords || studentRecords.length === 0) {
        // Auto-create student account with valid class code
        const trimmedName = name.trim();
        const stubEmail = `student_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@student.key2read.com`;
        const { data: newUser, error: userErr } = await db.supabase
          .from('users')
          .insert({ name: trimmedName, email: stubEmail, role: 'student' })
          .select()
          .single();
        if (userErr || !newUser) return res.status(500).json({ error: 'Could not create student account.' });

        const { error: studentErr } = await db.supabase
          .from('students')
          .insert({ user_id: newUser.id, class_id: cls.id, name: trimmedName });
        if (studentErr) console.error('Error creating student record:', studentErr);

        user = newUser;
        console.log(`✅ Auto-created student "${trimmedName}" in class ${cls.name} (${cls.class_code})`);
      } else {
        const studentRecord = studentRecords[0];
        user = studentRecord.users || await db.getUserById(studentRecord.user_id);
        if (!user) return res.status(400).json({ error: 'Student account not found.' });
      }

      const sessionUser = await buildSessionUser(user);
      req.session.userId = user.id;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser });

    } else if (role === 'child') {
      // Homeschool child login: find by name + family code (auto-create if not found)
      if (!name) return res.status(400).json({ error: 'Please enter your name.' });
      if (!classCode) return res.status(400).json({ error: 'Please enter your family code.' });

      const cls = await db.getClassByCode(classCode);
      if (!cls) return res.status(400).json({ error: 'Invalid family code. Ask your parent for the correct code.' });

      let { data: studentRecords } = await db.supabase
        .from('students')
        .select('*, users!user_id (id, email, name, role)')
        .eq('class_id', cls.id)
        .ilike('name', name.trim());

      let user;
      if (!studentRecords || studentRecords.length === 0) {
        // Auto-create child account with valid family code
        const trimmedName = name.trim();
        const stubEmail = `child_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@family.key2read.com`;
        const { data: newUser, error: userErr } = await db.supabase
          .from('users')
          .insert({ name: trimmedName, email: stubEmail, role: 'child' })
          .select()
          .single();
        if (userErr || !newUser) return res.status(500).json({ error: 'Could not create child account.' });

        const { error: studentErr } = await db.supabase
          .from('students')
          .insert({ user_id: newUser.id, class_id: cls.id, name: trimmedName });
        if (studentErr) console.error('Error creating child record:', studentErr);

        user = newUser;
        console.log(`✅ Auto-created child "${trimmedName}" in family ${cls.name} (${cls.class_code})`);
      } else {
        const studentRecord = studentRecords[0];
        user = studentRecord.users || await db.getUserById(studentRecord.user_id);
        if (!user) return res.status(400).json({ error: 'Account not found.' });
      }

      const sessionUser = await buildSessionUser(user);
      req.session.userId = user.id;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser });

    } else if (role === 'owner') {
      // Owner login: verify email + password
      if (!email) return res.status(400).json({ error: 'Please enter your email.' });
      if (!password) return res.status(400).json({ error: 'Please enter your password.' });

      const ownerEmail = process.env.OWNER_EMAIL;
      const ownerHash = process.env.OWNER_PASSWORD_HASH;
      if (!ownerEmail || !ownerHash) {
        return res.status(400).json({ error: 'Owner account is not configured.' });
      }
      if (email.toLowerCase() !== ownerEmail.toLowerCase()) {
        return res.status(400).json({ error: 'Invalid owner credentials.' });
      }

      const passwordMatch = await bcrypt.compare(password, ownerHash);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid owner credentials.' });
      }

      // Owner is authenticated
      const sessionUser = {
        id: 0,
        name: 'Owner',
        email: ownerEmail,
        role: 'owner',
      };
      req.session.userId = 0;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser });

    } else {
      // Teacher / Parent / Principal login: find by email + verify password
      if (!email) return res.status(400).json({ error: 'Please enter your email.' });

      const user = await db.getUserByEmail(email);
      if (!user) return res.status(400).json({ error: 'No account found with this email. Did you sign up first?' });

      // Verify password if the account has one set
      if (user.password_hash) {
        if (!password) return res.status(400).json({ error: 'Please enter your password.' });
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) return res.status(400).json({ error: 'Incorrect password. Please try again.' });
      }
      // If no password_hash yet (legacy account), allow login without password

      const sessionUser = await buildSessionUser(user);
      req.session.userId = user.id;
      req.session.user = sessionUser;
      // Extend session to 30 days if "Remember me" is checked
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }
      return res.json({ success: true, user: sessionUser });
    }
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/demo-login', async (req, res) => {
  const { name, email, role } = req.body;
  let user = await db.getUserByEmail(email || 'sarah@demo.com');
  if (!user) {
    user = await db.createUser({ email, name: name || 'Demo Teacher', role: role || 'teacher', auth_provider: 'demo' });
    // If teacher, create a class for them
    if ((role || 'teacher') === 'teacher') {
      const cls = await db.createClass(`${name || 'Demo Teacher'}'s Class`, '4th', user.id);
      user.classId = cls.id;
      user.classCode = cls.class_code;
    }
  }
  const sessionUser = await buildSessionUser(user);
  req.session.userId = user.id;
  req.session.user = sessionUser;
  res.json({ success: true, user: sessionUser });
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const parts = credential.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const { email, name, picture, sub } = payload;

    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({ email, name, role: 'teacher', auth_provider: 'google', auth_id: sub, avatar_url: picture });
      // Create class for new teacher
      const cls = await db.createClass(`${name}'s Class`, '4th', user.id);
      user.classId = cls.id;
      user.classCode = cls.class_code;
    }
    const sessionUser = await buildSessionUser(user);
    req.session.userId = user.id;
    req.session.user = sessionUser;
    res.json({ success: true, user: sessionUser });
  } catch (e) {
    console.error('Google auth error:', e);
    res.status(400).json({ error: 'Invalid Google credential' });
  }
});

app.post('/api/auth/clever', async (req, res) => {
  const { code } = req.body;
  try {
    if (process.env.CLEVER_CLIENT_ID && process.env.CLEVER_CLIENT_ID !== 'your-clever-client-id-here') {
      const tokenResp = await fetch('https://clever.com/oauth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(process.env.CLEVER_CLIENT_ID + ':' + process.env.CLEVER_CLIENT_SECRET).toString('base64') },
        body: JSON.stringify({ code, grant_type: 'authorization_code', redirect_uri: `http://localhost:${PORT}/api/auth/clever/callback` })
      });
      const tokenData = await tokenResp.json();
      const meResp = await fetch('https://api.clever.com/v3.0/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const meData = await meResp.json();
      const profile = meData.data;

      let user = await db.getUserByAuthId(profile.id, 'clever');
      if (!user) {
        user = await db.createUser({
          email: profile.email || `${profile.id}@clever.com`,
          name: profile.name?.first + ' ' + profile.name?.last,
          role: profile.type || 'teacher',
          auth_provider: 'clever',
          auth_id: profile.id
        });
      }
      req.session.userId = user.id;
      req.session.user = user;
      return res.json({ success: true, user });
    }
    // Demo Clever login
    let user = await db.getUserByEmail('sarah@demo.com');
    if (!user) {
      user = await db.createUser({ email: 'sarah@demo.com', name: 'Sarah Johnson', role: 'teacher', auth_provider: 'demo' });
    }
    const sessionUser = await buildSessionUser(user);
    req.session.userId = user.id;
    req.session.user = sessionUser;
    res.json({ success: true, user: sessionUser, demo: true });
  } catch (e) {
    console.error('Clever auth error:', e);
    res.status(400).json({ error: 'Clever authentication failed' });
  }
});

app.get('/api/auth/me', (req, res) => {
  if (req.session.user) return res.json({ user: req.session.user });
  res.json({ user: null });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.put('/api/auth/settings', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  const { name, grade } = req.body;
  const userId = req.session.userId;

  try {
    // Update user name
    if (name && userId) {
      const { error: nameErr } = await db.supabase.from('users').update({ name }).eq('id', userId);
      if (nameErr) console.error('[Settings] Name update error:', nameErr);
      else {
        req.session.user.name = name;
        console.log('[Settings] Name updated to:', name, 'for userId:', userId);
      }
    } else {
      console.log('[Settings] Skipped name update — name:', name, 'userId:', userId);
    }

    // Update grade on class (for teachers) or student record
    if (grade) {
      if (req.session.user.role === 'teacher' && req.session.user.classId) {
        await db.supabase.from('classes').update({ grade }).eq('id', req.session.user.classId);
      } else if (req.session.user.role === 'student' && req.session.user.studentId) {
        await db.supabase.from('students').update({ grade }).eq('id', req.session.user.studentId);
      }
      req.session.user.grade = grade;
    }

    // Explicitly save session to ensure persistence
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    res.json({ success: true, user: req.session.user });
  } catch (e) {
    console.error('Settings update error:', e);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ── Change Password ──────────────────────────────────────────
app.put('/api/auth/password', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    const userId = req.session.userId;
    const { data: user, error } = await db.supabase
      .from('users').select('password_hash').eq('id', userId).single();
    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // If user has an existing password, verify the current one
    if (user.password_hash) {
      if (!currentPassword) return res.status(400).json({ error: 'Current password is required' });
      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash and save new password
    const hash = await bcrypt.hash(newPassword, 10);
    const { error: updateErr } = await db.supabase
      .from('users').update({ password_hash: hash }).eq('id', userId);
    if (updateErr) throw updateErr;

    console.log(`[Password] Changed for userId: ${userId}`);
    res.json({ success: true });
  } catch (e) {
    console.error('Password change error:', e);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role, school, classCode } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  // Block direct teacher/parent signup — must go through Shopify
  if (role === 'teacher' || role === 'parent') {
    return res.status(403).json({ error: 'Teacher and parent accounts require a subscription. Please visit our pricing page to subscribe.' });
  }

  try {
    // Check if email already exists (for teacher/principal)
    if (email) {
      const existing = await db.getUserByEmail(email);
      if (existing) return res.status(400).json({ error: 'An account with this email already exists' });
    }

    if (role === 'student') {
      let cls = null;
      if (classCode) {
        cls = await db.getClassByCode(classCode);
        if (!cls) return res.status(400).json({ error: 'Invalid class code. Please check the code and try again.' });
      }

      const uniqueSuffix = Date.now().toString(36);
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}.${uniqueSuffix}@student.key2read.com`;
      const user = await db.createUser({ email: userEmail, name, role: 'student', auth_provider: 'local', school: school || '' });
      const grade = req.body.grade || cls?.grade || '4th';
      const student = await db.createStudent(name, cls ? cls.id : null, user.id, grade);

      req.session.userId = user.id;
      req.session.user = {
        ...user,
        studentId: student.id,
        classId: cls ? cls.id : null,
        className: cls ? cls.name : null,
        teacherName: cls ? cls.teacher_name : null,
        grade: student.grade || grade,
        reading_level: student.reading_level || 3.0,
        reading_score: student.reading_score || 500,
        keys_earned: student.keys_earned || 0,
        quizzes_completed: student.quizzes_completed || 0,
        accuracy: student.accuracy || 0,
        streak_days: student.streak_days || 0,
        onboarded: student.onboarded || 0
      };
      return res.json({ success: true, user: req.session.user });

    } else if (role === 'principal') {
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@key2read.com`;
      const user = await db.createUser({ email: userEmail, name, role: 'principal', auth_provider: 'local', school: school || '' });
      req.session.userId = user.id;
      req.session.user = user;
      return res.json({ success: true, user });

    } else if (role === 'parent') {
      // Parent signup: create user + family class with a family code
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@parent.key2read.com`;
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;
      const user = await db.createUser({ email: userEmail, name, role: 'parent', auth_provider: 'local', password_hash: passwordHash });
      if (!user) return res.status(500).json({ error: 'Failed to create account' });

      // Create a family "class" for the parent (generates a family code)
      const familyClass = await db.createClass(`${name}'s Family`, '4th', user.id);
      // Link the family class to the parent
      await db.supabase.from('users').update({ class_id: familyClass.id }).eq('id', user.id);

      const sessionUser = {
        ...user,
        classId: familyClass.id,
        classCode: familyClass.class_code,
        familyCode: familyClass.class_code,
        className: familyClass.name
      };
      req.session.userId = user.id;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser, familyCode: familyClass.class_code });

    } else {
      // Teacher signup (default)
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@key2read.com`;
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;
      const user = await db.createUser({ email: userEmail, name, role: 'teacher', auth_provider: 'local', school: school || '', password_hash: passwordHash });
      const grade = req.body.grade || '4th';
      const cls = await db.createClass(`${name}'s Class`, grade, user.id);

      req.session.userId = user.id;
      req.session.user = { ...user, classId: cls.id, classCode: cls.class_code };
      return res.json({ success: true, user: req.session.user, classCode: cls.class_code });
    }
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// ─── SHOPIFY WEBHOOK ───
// Health check endpoint — verify webhook URL is reachable
app.get('/api/webhooks/shopify/order-paid', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Shopify webhook endpoint is reachable',
    hasSecret: !!process.env.SHOPIFY_WEBHOOK_SECRET,
    hasKlaviyoKey: !!process.env.KLAVIYO_API_KEY
  });
});

app.post('/api/webhooks/shopify/order-paid', async (req, res) => {
  console.log('🔔 Shopify webhook received');
  console.log('  Headers:', JSON.stringify({
    'x-shopify-hmac-sha256': req.headers['x-shopify-hmac-sha256'] ? 'present' : 'MISSING',
    'content-type': req.headers['content-type']
  }));
  console.log('  Raw body:', req.rawBody ? `${req.rawBody.length} bytes` : 'MISSING');
  console.log('  Body keys:', req.body ? Object.keys(req.body).join(', ') : 'EMPTY');

  try {
    // 1. Verify HMAC signature
    const hmac = req.headers['x-shopify-hmac-sha256'];
    if (!shopify.verifyWebhookHMAC(req.rawBody, hmac)) {
      console.error('❌ Shopify webhook HMAC verification failed');
      console.error('  SHOPIFY_WEBHOOK_SECRET set:', !!process.env.SHOPIFY_WEBHOOK_SECRET);
      return res.status(401).json({ error: 'Invalid signature' });
    }
    console.log('  ✅ HMAC verified');

    // 2. Parse order data
    const orderData = shopify.parseOrderData(req.body);
    if (!orderData.email) {
      console.error('Shopify webhook: no customer email in order');
      return res.status(400).json({ error: 'No customer email' });
    }

    console.log(`📦 Shopify order received: ${orderData.orderId} for ${orderData.email} (${orderData.plan})`);

    // 3. Idempotency check
    const { data: existing } = await db.supabase
      .from('shopify_webhooks')
      .select('id')
      .eq('order_id', orderData.orderId)
      .limit(1);
    if (existing && existing.length > 0) {
      console.log(`Shopify webhook already processed: ${orderData.orderId}`);
      return res.status(200).json({ success: true, message: 'Already processed' });
    }

    // 4. Check if user already exists
    const existingUser = await db.getUserByEmail(orderData.email);
    if (existingUser) {
      // Generate new password for existing user
      const plainPassword = shopify.generateReadablePassword();
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      // Update existing user's plan and password
      await db.supabase.from('users').update({
        plan: orderData.plan,
        password_hash: passwordHash,
        shopify_order_id: orderData.orderId,
        shopify_customer_id: orderData.customerId
      }).eq('id', existingUser.id);

      // Get their class/family code
      let classCode = '';
      if (existingUser.class_id) {
        const { data: cls } = await db.supabase.from('classes').select('class_code').eq('id', existingUser.class_id).single();
        if (cls) classCode = cls.class_code;
      }

      // Log webhook
      await db.supabase.from('shopify_webhooks').insert({
        order_id: orderData.orderId,
        customer_email: orderData.email,
        plan: orderData.plan
      });

      console.log(`✅ Updated existing user ${orderData.email} to plan: ${orderData.plan}`);
      res.status(200).json({ success: true, message: 'User updated' });

      // Send Klaviyo welcome email with new password
      klaviyo.sendWelcomeEmail({
        email: orderData.email,
        firstName: orderData.firstName || existingUser.name?.split(' ')[0] || '',
        lastName: orderData.lastName || '',
        password: plainPassword,
        plan: orderData.plan,
        classCode: classCode,
        loginUrl: 'https://key2read.onrender.com/pages/signin.html'
      }).catch(err => console.error('Klaviyo welcome email error:', err.message));
      return;
    }

    // 5. Generate password
    const plainPassword = shopify.generateReadablePassword();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // 6. Create user
    const role = orderData.plan === 'school' ? 'teacher' : 'parent';
    const user = await db.createUser({
      email: orderData.email,
      name: orderData.fullName,
      role: role,
      auth_provider: 'shopify',
      password_hash: passwordHash,
      plan: orderData.plan,
      shopify_order_id: orderData.orderId,
      shopify_customer_id: orderData.customerId
    });

    if (!user) {
      console.error('Failed to create user for Shopify order:', orderData.orderId);
      return res.status(500).json({ error: 'User creation failed' });
    }

    // 7. Create class/family
    let classCode = '';
    if (role === 'parent') {
      const familyClass = await db.createClass(`${orderData.firstName || orderData.fullName}'s Family`, '4th', user.id);
      if (familyClass) {
        classCode = familyClass.class_code;
        await db.supabase.from('users').update({ class_id: familyClass.id }).eq('id', user.id);
      }
    } else {
      const teacherClass = await db.createClass(`${orderData.firstName || orderData.fullName}'s Class`, '4th', user.id);
      if (teacherClass) {
        classCode = teacherClass.class_code;
      }
    }

    // 8. Log webhook for idempotency
    await db.supabase.from('shopify_webhooks').insert({
      order_id: orderData.orderId,
      customer_email: orderData.email,
      plan: orderData.plan
    });

    console.log(`✅ Created ${role} account for ${orderData.email} (${orderData.plan}) — code: ${classCode}`);

    // 9. Return 200 immediately (Shopify requires <5s)
    res.status(200).json({ success: true });

    // 10. Fire-and-forget Klaviyo welcome email
    klaviyo.sendWelcomeEmail({
      email: orderData.email,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      password: plainPassword,
      plan: orderData.plan,
      classCode: classCode,
      loginUrl: 'https://key2read.onrender.com/pages/signin.html'
    }).catch(err => console.error('Klaviyo welcome email error:', err.message));

  } catch (e) {
    console.error('Shopify webhook error:', e);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ─── GUEST QUIZ MIGRATION ───
app.post('/api/auth/migrate-guest-results', async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });

    const { guestResults } = req.body;
    if (!guestResults || !Array.isArray(guestResults) || guestResults.length === 0) {
      return res.json({ migrated: 0 });
    }

    // Find the student record for this user
    const student = await db.getStudentByUserId(req.session.user.id || req.session.userId);
    if (!student) {
      return res.status(400).json({ error: 'No student record found. Add a child/student first.' });
    }

    let migrated = 0;
    for (const result of guestResults) {
      if (!result.chapterId) continue;

      // Skip if already has a result for this chapter
      const { data: existingResult } = await db.supabase
        .from('quiz_results')
        .select('id')
        .eq('student_id', student.id)
        .eq('chapter_id', result.chapterId)
        .limit(1);
      if (existingResult && existingResult.length > 0) continue;

      // Save the quiz result
      await db.saveQuizResult({
        studentId: student.id,
        chapterId: result.chapterId,
        answers: result.answers || [],
        score: result.score || 0,
        correctCount: result.correctCount || 0,
        totalQuestions: result.totalQuestions || 5,
        readingLevelChange: 0,
        keysEarned: result.keysEarned || 0,
        timeTaken: result.timeTaken || 0,
        strategiesUsed: [],
        hintsUsed: result.hintsUsed || 0,
        attemptData: [],
        vocabLookups: []
      });

      // Update student stats
      await db.updateStudentStats(student.id, result.keysEarned || 0, result.score || 0);
      migrated++;
    }

    console.log(`✅ Migrated ${migrated} guest quiz results for user ${req.session.user.email}`);
    res.json({ success: true, migrated });
  } catch (e) {
    console.error('Guest migration error:', e);
    res.status(500).json({ error: 'Migration failed' });
  }
});

// ─── STUDENT ROUTES ───
app.get('/api/students', async (req, res) => {
  const classId = req.query.classId || req.session.user?.classId;
  if (!classId) return res.json([]);
  const students = await db.getStudents(classId);
  res.json(students);
});

app.get('/api/students/:id', async (req, res) => {
  const s = await db.getStudent(parseInt(req.params.id));
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.json(s);
});

app.put('/api/students/:id/survey', async (req, res) => {
  const id = parseInt(req.params.id);
  await db.updateStudentSurvey(id, req.body);
  const student = await db.getStudent(id);
  res.json({ success: true, student });
});

app.get('/api/students/:id/reading-history', async (req, res) => {
  const history = await db.getReadingHistory(parseInt(req.params.id));
  res.json(history);
});

app.get('/api/students/:id/quiz-results', async (req, res) => {
  const results = await db.getStudentResults(parseInt(req.params.id));
  res.json(results);
});

// ─── WEEKLY STATS ───
app.get('/api/students/:id/weekly-stats', async (req, res) => {
  try {
    const stats = await db.getWeeklyStats(parseInt(req.params.id));
    res.json(stats);
  } catch (e) {
    console.error('Weekly stats error:', e);
    res.status(500).json({ error: 'Failed to load weekly stats' });
  }
});

// ─── BOOK PROGRESS (for My Quizzes page) ───
app.get('/api/students/:id/book-progress', async (req, res) => {
  try {
    const progress = await db.getStudentBookProgress(parseInt(req.params.id));
    res.json(progress);
  } catch (e) {
    console.error('Book progress error:', e);
    res.status(500).json({ error: 'Failed to load book progress' });
  }
});

// ─── STUDENT PERFORMANCE (Reading Score 0-1000) ───
app.get('/api/students/:id/performance', async (req, res) => {
  try {
    const performance = await db.getStudentPerformance(parseInt(req.params.id));
    res.json(performance);
  } catch (e) {
    console.error('Student performance error:', e);
    res.status(500).json({ error: 'Failed to load performance data' });
  }
});

// ─── CLASS ANALYTICS (batch summary for Students table) ───
app.get('/api/class/:classId/analytics', async (req, res) => {
  try {
    const analytics = await db.getClassAnalytics(parseInt(req.params.classId));
    res.json(analytics);
  } catch (e) {
    console.error('Class analytics error:', e);
    res.status(500).json({ error: 'Failed to load class analytics' });
  }
});

// ─── POPULAR BOOKS (for teacher dashboard) ───
app.get('/api/class/:classId/popular-books', async (req, res) => {
  try {
    const data = await db.getPopularBooks(parseInt(req.params.classId));
    res.json(data);
  } catch (e) {
    console.error('Popular books error:', e);
    res.status(500).json({ error: 'Failed to load popular books' });
  }
});

// ─── WEEKLY GROWTH DATA (for teacher dashboard trend chart) ───
app.get('/api/class/:classId/weekly-growth', async (req, res) => {
  try {
    const range = req.query.range || 'week'; // week, month, quarter, year
    const data = await db.getWeeklyGrowthData(parseInt(req.params.classId), range);
    res.json(data);
  } catch (e) {
    console.error('Weekly growth error:', e);
    res.status(500).json({ error: 'Failed to load weekly growth data' });
  }
});

// ─── RECENT ACTIVITY (for teacher dashboard) ───
app.get('/api/class/:classId/recent-activity', async (req, res) => {
  try {
    const data = await db.getRecentActivity(parseInt(req.params.classId));
    res.json(data);
  } catch (e) {
    console.error('Recent activity error:', e);
    res.status(500).json({ error: 'Failed to load recent activity' });
  }
});

// ─── TEACHER QUIZ MODE ───
app.post('/api/teacher/start-quiz-mode', async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user || (user.role !== 'teacher' && user.role !== 'owner' && user.role !== 'principal')) {
      return res.status(403).json({ error: 'Only teachers can use quiz mode' });
    }
    const classId = user.classId || 1;
    const teacherStudent = await db.getOrCreateTeacherStudent(user.id, classId);
    if (!teacherStudent) return res.status(500).json({ error: 'Failed to create teacher demo student' });
    res.json({ studentId: teacherStudent.id, student: teacherStudent });
  } catch (e) {
    console.error('Teacher quiz mode error:', e);
    res.status(500).json({ error: 'Failed to start quiz mode' });
  }
});

// ─── CHAPTER PROGRESS ───
app.get('/api/students/:id/completed-chapters/:bookId', async (req, res) => {
  const studentId = parseInt(req.params.id);
  const bookId = parseInt(req.params.bookId);
  try {
    const completed = await db.getCompletedChapters(studentId, bookId);
    res.json({ completed });
  } catch (e) {
    console.error('Completed chapters error:', e);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// ─── WARM UP ROUTES ───
app.get('/api/books/:bookId/warmup', async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  try {
    const warmup = await db.getWarmupQuiz(bookId);
    if (!warmup) return res.json({ hasWarmup: false });
    res.json({ hasWarmup: true, questions: warmup.questions });
  } catch (e) {
    console.error('Warmup quiz error:', e);
    res.status(500).json({ error: 'Failed to load warmup quiz' });
  }
});

app.get('/api/students/:id/warmup-status/:bookId', async (req, res) => {
  const studentId = parseInt(req.params.id);
  const bookId = parseInt(req.params.bookId);
  try {
    const result = await db.getWarmupResult(studentId, bookId);
    res.json({ passed: !!result });
  } catch (e) {
    console.error('Warmup status error:', e);
    res.status(500).json({ error: 'Failed to check warmup status' });
  }
});

app.post('/api/students/:studentId/gift-keys', async (req, res) => {
  const role = req.session.user?.role;
  if (role !== 'teacher' && role !== 'parent' && role !== 'owner') {
    return res.status(403).json({ error: 'Only teachers and parents can gift keys' });
  }
  const studentId = parseInt(req.params.studentId);
  const amount = parseInt(req.body.amount);
  if (!amount || amount < 1 || amount > 100) {
    return res.status(400).json({ error: 'Amount must be between 1 and 100' });
  }
  try {
    const result = await db.addStudentKeys(studentId, amount);
    if (!result.success) return res.status(400).json({ error: result.reason });
    res.json({ success: true, newBalance: result.newBalance });
  } catch (e) {
    console.error('Gift keys error:', e);
    res.status(500).json({ error: 'Failed to gift keys' });
  }
});

app.get('/api/warmup/student/:studentId', async (req, res) => {
  try {
    const warmups = await db.getStudentWarmups(parseInt(req.params.studentId));
    res.json(warmups);
  } catch (e) {
    console.error('Get student warmups error:', e);
    res.status(500).json({ error: 'Failed to fetch warmups' });
  }
});

app.post('/api/warmup/submit', async (req, res) => {
  const { studentId, bookId, answers, attempts } = req.body;
  try {
    const warmup = await db.getWarmupQuiz(bookId);
    if (!warmup) return res.status(404).json({ error: 'No warmup for this book' });

    const questions = warmup.questions;
    let correctCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct_answer) correctCount++;
    }
    const score = (correctCount / questions.length) * 100;
    const passed = correctCount === questions.length;

    await db.saveWarmupResult({
      studentId, bookId, passed, score, correctCount,
      totalQuestions: questions.length, attempts: attempts || 1
    });

    // Award 5 keys for passing the warmup (one-time per book)
    let keysEarned = 0;
    if (passed && studentId) {
      const { data: allPasses } = await db.supabase
        .from('warmup_results')
        .select('id')
        .eq('student_id', studentId)
        .eq('book_id', bookId)
        .eq('passed', true);
      if (allPasses && allPasses.length <= 1) {
        keysEarned = 5;
        await db.addStudentKeys(studentId, 5);
      }
    }

    res.json({ passed, score, correctCount, totalQuestions: questions.length, keysEarned });
  } catch (e) {
    console.error('Warmup submit error:', e);
    res.status(500).json({ error: 'Failed to submit warmup' });
  }
});

// ─── BOOK ROUTES ───
app.get('/api/books', async (req, res) => {
  const books = await db.getBooks();
  res.json(books);
});

app.get('/api/books/:id/chapters', async (req, res) => {
  const chapters = await db.getBookChapters(parseInt(req.params.id));
  res.json(chapters);
});

app.get('/api/books/:bookId/chapters/:num/quiz', async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const chapterNum = parseInt(req.params.num);
  const chapter = await db.getChapterByBookAndNum(bookId, chapterNum);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  let questions = await db.getChapterQuiz(chapter.id);
  if (questions.length > 0) {
    // Parse JSON fields if stored as strings (Supabase JSONB returns objects already)
    questions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
      vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
    }));
    return res.json({ chapter, questions });
  }

  // Generate quiz using Claude API
  const book = await db.getBookById(bookId);
  const allChapters = await db.getBookChapters(bookId);
  const questionCount = allChapters.length <= 9 ? 7 : 5;
  const pages = getChapterPages(book.title, chapterNum);
  const generated = await claude.generateChapterQuiz(book.title, book.author, chapterNum, chapter.title, chapter.summary, book.grade_level, questionCount, pages?.start || null, pages?.end || null);

  // Strip any HTML tags or markdown formatting Claude may include in text fields
  const stripHtml = (s) => typeof s === 'string' ? s.replace(/<[^>]*>/g, '').replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') : s;

  // Save generated questions to DB
  for (const q of generated.questions) {
    await db.insertQuizQuestion({
      chapter_id: chapter.id,
      question_number: q.question_number,
      question_type: q.question_type,
      question_text: stripHtml(q.question_text),
      passage_excerpt: stripHtml(q.passage_excerpt || ''),
      options: (q.options || []).map(o => stripHtml(o)),
      correct_answer: q.correct_answer,
      strategy_type: q.strategy_type,
      strategy_tip: stripHtml(q.strategy_tip),
      explanation: stripHtml(q.explanation),
      vocabulary_words: q.vocabulary_words || []
    });
  }

  questions = (await db.getChapterQuiz(chapter.id)).map(q => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
    vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
  }));
  res.json({ chapter, questions });
});

// ─── Regenerate Quiz (delete cached questions to force regeneration with page numbers) ───
app.post('/api/books/:bookId/chapters/:num/regenerate-quiz', async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const chapterNum = parseInt(req.params.num);
  const chapter = await db.getChapterByBookAndNum(bookId, chapterNum);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  // Delete existing quiz questions for this chapter
  const { error } = await db.supabase
    .from('quiz_questions')
    .delete()
    .eq('chapter_id', chapter.id);
  if (error) return res.status(500).json({ error: error.message });

  // Generate fresh quiz with real page numbers
  const book = await db.getBookById(bookId);
  const pages = getChapterPages(book.title, chapterNum);
  console.log(`🔄 Regenerating quiz for book ${bookId}, chapter ${chapterNum} (pages ${pages?.start || '?'}-${pages?.end || '?'})`);

  const allChapters = await db.getBookChapters(bookId);
  const questionCount = allChapters.length <= 9 ? 7 : 5;
  const generated = await claude.generateChapterQuiz(book.title, book.author, chapterNum, chapter.title, chapter.summary, book.grade_level, questionCount, pages?.start || null, pages?.end || null);

  const stripHtml2 = (s) => typeof s === 'string' ? s.replace(/<[^>]*>/g, '').replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') : s;
  for (const q of generated.questions) {
    await db.insertQuizQuestion({
      chapter_id: chapter.id,
      question_number: q.question_number,
      question_type: q.question_type,
      question_text: stripHtml2(q.question_text),
      passage_excerpt: stripHtml2(q.passage_excerpt || ''),
      options: (q.options || []).map(o => stripHtml2(o)),
      correct_answer: q.correct_answer,
      strategy_type: q.strategy_type,
      strategy_tip: stripHtml2(q.strategy_tip),
      explanation: stripHtml2(q.explanation),
      vocabulary_words: q.vocabulary_words || []
    });
  }

  let questions = (await db.getChapterQuiz(chapter.id)).map(q => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
    vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
  }));
  res.json({ chapter, questions, regenerated: true });
});

// ─── Full Book Quiz (20 questions across all chapters) ───
app.get('/api/books/:bookId/full-quiz', async (req, res) => {
  const bookId = parseInt(req.params.bookId);

  // Books without full book quizzes (all books)
  const noFullQuiz = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69];
  if (noFullQuiz.includes(bookId)) return res.status(404).json({ error: 'Full book quiz is not available for this book' });

  try {
    const { chapters, allQuestions } = await db.getFullBookQuiz(bookId);
    if (!chapters.length || !allQuestions.length) return res.status(404).json({ error: 'No quiz data found' });

    // Parse JSON fields
    const parsed = allQuestions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
      vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
    }));

    // Select 20 questions spread across chapters
    const perChapter = Math.max(1, Math.floor(20 / chapters.length));
    const extra = 20 - perChapter * chapters.length;
    let selected = [];

    chapters.forEach((ch, idx) => {
      const chQuestions = parsed.filter(q => q.chapter_id === ch.id);
      // Shuffle
      for (let i = chQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chQuestions[i], chQuestions[j]] = [chQuestions[j], chQuestions[i]];
      }
      const take = idx < extra ? perChapter + 1 : perChapter;
      selected.push(...chQuestions.slice(0, Math.min(take, chQuestions.length)));
    });

    // If we still have fewer than 20, grab more from any chapter
    if (selected.length < 20) {
      const selectedIds = new Set(selected.map(q => q.id));
      const remaining = parsed.filter(q => !selectedIds.has(q.id));
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      selected.push(...remaining.slice(0, 20 - selected.length));
    }

    // Cap at 20
    selected = selected.slice(0, 20);

    // Attach chapter info to each question for vocab lookup
    selected.forEach(q => {
      const ch = chapters.find(c => c.id === q.chapter_id);
      if (ch) q._chapterVocab = ch.key_vocabulary;
    });

    res.json({
      chapter: { id: null, chapter_number: 0, title: 'Full Book Quiz', key_vocabulary: [] },
      questions: selected,
      chapters
    });
  } catch(e) {
    res.status(500).json({ error: 'Failed to load full book quiz' });
  }
});

// ─── QUIZ / AI ROUTES ───
app.post('/api/quiz/personalize', async (req, res) => {
  const { questionId, studentId } = req.body;
  const { data: question } = await db.supabase.from('quiz_questions').select('*').eq('id', questionId).single();
  const student = await db.getStudent(studentId);
  if (!question || !student) return res.status(404).json({ error: 'Not found' });
  const personalized = await claude.personalizeQuestion(question, student);
  res.json(personalized);
});

app.post('/api/quiz/personalize-all', async (req, res) => {
  const { chapterId, studentId } = req.body;
  const questions = await db.getChapterQuiz(chapterId);
  const student = await db.getStudent(studentId);
  if (!student || questions.length === 0) return res.status(404).json({ error: 'Not found' });

  const personalized = [];
  for (const q of questions) {
    const p = await claude.personalizeQuestion(q, student);
    personalized.push({
      ...p,
      options: typeof p.options === 'string' ? JSON.parse(p.options) : (p.options || []),
      vocabulary_words: typeof p.vocabulary_words === 'string' ? JSON.parse(p.vocabulary_words) : (p.vocabulary_words || [])
    });
  }
  res.json({ questions: personalized });
});

app.post('/api/quiz/submit', async (req, res) => {
  const { studentId, chapterId, assignmentId, answers, timeTaken, hintCount, attemptData, vocabLookups, revealedIndices } = req.body;
  const student = await db.getStudent(studentId);
  const questions = await db.getChapterQuiz(chapterId);
  if (!student || questions.length === 0) return res.status(400).json({ error: 'Invalid submission' });

  // Track which question indices had answers revealed (student got wrong twice)
  const revealed = new Set(revealedIndices || []);

  let correctCount = 0;
  const strategiesUsed = [];
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
    const studentAnswer = answers[i]; // answer text (from shuffled client options)
    const correctText = opts[q.correct_answer] || '';
    // Don't count revealed answers as correct — the student got it wrong and was shown the answer
    const wasRevealed = revealed.has(i);
    const isCorrect = !wasRevealed && studentAnswer === correctText;
    if (isCorrect) correctCount++;
    if (q.strategy_type && !strategiesUsed.includes(q.strategy_type)) strategiesUsed.push(q.strategy_type);

    const feedback = await claude.getAnswerFeedback(q.question_text, studentAnswer || 'No answer', correctText, isCorrect, q.strategy_type, student.grade);
    results.push({ questionId: q.id, isCorrect, feedback: feedback.feedback, strategyReminder: feedback.strategy_reminder, wasRevealed });
  }

  const { data: chapter } = await db.supabase
    .from('chapters')
    .select('*, books!inner (lexile_level)')
    .eq('id', chapterId)
    .single();

  const score = (correctCount / questions.length) * 100;
  const levelChange = claude.calculateReadingLevelChange(student.reading_score, chapter?.books?.lexile_level || 600, correctCount, questions.length);
  // 5 keys if pass (>=80%), 4 if used try-again at all, 0 if fail
  const hints = hintCount || 0;
  let keysEarned = score >= 80 ? (hints > 0 ? 4 : 5) : 0;
  let alreadyEarned = false;

  // Prevent retake key duplication: if student already passed this chapter, no additional keys
  const { data: existingResults } = await db.supabase
    .from('quiz_results')
    .select('id, score, keys_earned')
    .eq('student_id', studentId)
    .eq('chapter_id', chapterId)
    .gte('score', 80);
  if (existingResults && existingResults.length > 0) {
    keysEarned = 0; // Already earned keys for this chapter
    alreadyEarned = true;
  }

  console.log(`[Quiz Submit] student=${studentId} chapter=${chapterId} score=${score.toFixed(1)}% correct=${correctCount}/${questions.length} revealed=${revealed.size} hints=${hints} keys=${keysEarned} alreadyEarned=${alreadyEarned}`);

  const newScore = Math.max(200, student.reading_score + levelChange);
  await db.updateReadingLevel(studentId, newScore, 'quiz');

  // Update student stats
  const newAccuracy = Math.round((student.accuracy * student.quizzes_completed + score) / (student.quizzes_completed + 1));
  await db.updateStudentStats(studentId, keysEarned, newAccuracy);

  await db.saveQuizResult({
    studentId, assignmentId, chapterId, answers,
    score, correctCount, totalQuestions: questions.length,
    readingLevelChange: levelChange, keysEarned,
    timeTaken: timeTaken || 0, strategiesUsed,
    hintsUsed: hints,
    attemptData: attemptData || [],
    vocabLookups: vocabLookups || []
  });

  // Precompute analytics and sync composite reading score
  try {
    await db.updateStudentAnalytics(studentId);
  } catch(e) {
    console.error('Analytics update error:', e);
  }

  // Read back the synced composite score
  const updatedStudent = await db.getStudent(studentId);
  const syncedScore = updatedStudent?.reading_score || newScore;

  // Keep session in sync with DB so /api/auth/me returns correct values
  if (req.session.user && updatedStudent) {
    req.session.user.keys_earned = updatedStudent.keys_earned || 0;
    req.session.user.quizzes_completed = updatedStudent.quizzes_completed || 0;
    req.session.user.reading_score = syncedScore;
    req.session.user.accuracy = updatedStudent.accuracy || 0;
  }

  res.json({
    score, correctCount, totalQuestions: questions.length,
    readingLevelChange: levelChange, newReadingScore: syncedScore,
    newReadingLevel: (syncedScore / 160).toFixed(1),
    keysEarned, alreadyEarned, results, strategiesUsed
  });
});

app.post('/api/define', async (req, res) => {
  const { word, context, gradeLevel } = req.body;
  const def = await claude.defineWord(word, context, gradeLevel);
  res.json(def);
});

app.post('/api/strategy', async (req, res) => {
  const { strategyType, question, passage, gradeLevel } = req.body;
  const help = await claude.getStrategyHelp(strategyType, question, passage, gradeLevel);
  res.json(help);
});

app.post('/api/feedback', async (req, res) => {
  const { question, studentAnswer, correctAnswer, isCorrect, strategyType, gradeLevel } = req.body;
  const feedback = await claude.getAnswerFeedback(question, studentAnswer, correctAnswer, isCorrect, strategyType, gradeLevel);
  res.json(feedback);
});

// ─── STUDENT FAVORITES ───
app.get('/api/students/:id/favorites', async (req, res) => {
  try {
    const favorites = await db.getFavoriteBooks(parseInt(req.params.id));
    res.json({ favorites });
  } catch (e) {
    console.error('Get favorites error:', e);
    res.json({ favorites: [] });
  }
});

app.post('/api/students/:id/favorites/toggle', async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ error: 'Missing bookId' });
  try {
    const result = await db.toggleFavoriteBook(parseInt(req.params.id), bookId);
    res.json(result);
  } catch (e) {
    console.error('Toggle favorite error:', e);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// ─── CLASS STORE ITEMS CRUD ───

app.get('/api/store/items', async (req, res) => {
  const classId = req.query.classId || req.session.user?.classId;
  if (!classId) return res.json([]);
  try {
    const items = await db.getStoreItems(classId);
    res.json(items);
  } catch (e) {
    console.error('Get store items error:', e);
    res.json([]);
  }
});

app.post('/api/store/items', async (req, res) => {
  const classId = req.body.classId || req.session.user?.classId;
  if (!classId) return res.status(400).json({ error: 'Missing classId' });
  try {
    const item = await db.createStoreItem(classId, req.body);
    if (!item) return res.status(500).json({ error: 'Failed to create item' });
    res.json(item);
  } catch (e) {
    console.error('Create store item error:', e);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.put('/api/store/items/:id', async (req, res) => {
  try {
    const item = await db.updateStoreItem(req.params.id, req.body);
    if (!item) return res.status(500).json({ error: 'Failed to update item' });
    res.json(item);
  } catch (e) {
    console.error('Update store item error:', e);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/store/items/:id', async (req, res) => {
  try {
    const success = await db.deleteStoreItem(req.params.id);
    if (!success) return res.status(500).json({ error: 'Failed to delete item' });
    res.json({ success: true });
  } catch (e) {
    console.error('Delete store item error:', e);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.post('/api/store/upload-image', async (req, res) => {
  const { imageData, filename } = req.body;
  if (!imageData) return res.status(400).json({ error: 'Missing image data' });
  try {
    const result = await db.uploadStoreImage(imageData, filename);
    res.json(result);
  } catch (e) {
    console.error('Upload store image error:', e);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ─── REWARD GALLERY (admin-managed images) ───

app.get('/api/store/gallery', async (req, res) => {
  try {
    const items = await db.getRewardGallery();
    res.json(items);
  } catch (e) {
    console.error('Get gallery error:', e);
    res.json([]);
  }
});

app.post('/api/store/gallery', async (req, res) => {
  const { name, imageData, category } = req.body;
  if (!name || !imageData) return res.status(400).json({ error: 'Missing name or image' });
  try {
    // Upload image first
    const uploadResult = await db.uploadStoreImage(imageData, name.replace(/\s+/g, '-').toLowerCase());
    const item = await db.addRewardGalleryItem(name, uploadResult.url, category);
    if (!item) return res.status(500).json({ error: 'Failed to add gallery item' });
    res.json(item);
  } catch (e) {
    console.error('Add gallery item error:', e);
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

app.delete('/api/store/gallery/:id', async (req, res) => {
  try {
    const success = await db.deleteRewardGalleryItem(req.params.id);
    if (!success) return res.status(500).json({ error: 'Failed to delete gallery item' });
    res.json({ success: true });
  } catch (e) {
    console.error('Delete gallery item error:', e);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// ─── CLASS STORE PURCHASE ───
app.post('/api/store/purchase', async (req, res) => {
  const { studentId, itemName, price, classId } = req.body;
  if (!studentId || !price || price <= 0) return res.status(400).json({ error: 'Invalid purchase data' });
  try {
    const result = await db.deductStudentKeys(studentId, price);
    if (!result.success) return res.status(400).json({ error: result.reason });
    // Record purchase history
    if (classId) {
      await db.recordPurchase(studentId, classId, itemName || 'Item', price);
    }
    // Keep session in sync after key deduction
    if (req.session.user) {
      req.session.user.keys_earned = result.newBalance;
    }
    // Clear cached purchase data so dashboard refreshes
    res.json({ success: true, newBalance: result.newBalance, itemName });
  } catch (e) {
    console.error('Store purchase error:', e);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

app.get('/api/class/:classId/recent-purchases', async (req, res) => {
  try {
    const purchases = await db.getRecentPurchases(parseInt(req.params.classId));
    res.json(purchases);
  } catch (e) {
    res.json([]);
  }
});

// ─── Toggle purchase fulfilled status ───
app.put('/api/store/purchases/:id/fulfill', async (req, res) => {
  try {
    const { fulfilled } = req.body;
    const result = await db.fulfillPurchase(parseInt(req.params.id), !!fulfilled);
    if (!result) return res.status(500).json({ error: 'Could not update purchase' });
    res.json({ success: true, purchase: result });
  } catch (e) {
    console.error('Fulfill purchase error:', e);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
});

// ─── ASSIGNMENT ROUTES ───
app.post('/api/assignments', async (req, res) => {
  const { classId, bookId, name, chapterStart, chapterEnd, dueDate, personalized } = req.body;
  const teacherId = req.session.userId || 1;
  const assignment = await db.createAssignment({
    class_id: classId || 1,
    teacher_id: teacherId,
    book_id: bookId,
    name,
    chapter_start: chapterStart || 1,
    chapter_end: chapterEnd || 1,
    due_date: dueDate,
    personalized: personalized !== undefined ? personalized : 1
  });
  res.json({ success: true, id: assignment?.id });
});

app.get('/api/assignments', async (req, res) => {
  const classId = req.query.classId || req.session.user?.classId;
  if (!classId) return res.json([]);
  const assignments = await db.getAssignments(classId);
  res.json(assignments);
});

app.get('/api/class/code', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  const cls = await db.getTeacherClass(req.session.userId);
  if (!cls) return res.json({ classCode: null });
  res.json({ classCode: cls.class_code, className: cls.name });
});

app.get('/api/class/validate/:code', async (req, res) => {
  const cls = await db.getClassByCode(req.params.code);
  if (!cls) return res.json({ valid: false });
  res.json({ valid: true, className: cls.name, teacherName: cls.teacher_name, grade: cls.grade });
});

// ─── OWNER ROUTES ───
function requireOwner(req, res, next) {
  if (req.session.user?.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
}

app.get('/api/owner/stats', requireOwner, async (req, res) => {
  try {
    const stats = await db.getOwnerStats();
    res.json(stats);
  } catch (e) {
    console.error('Owner stats error:', e);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

app.get('/api/owner/genres', requireOwner, async (req, res) => {
  try {
    const genres = await db.getGenreDistribution();
    res.json(genres);
  } catch (e) {
    console.error('Owner genres error:', e);
    res.status(500).json({ error: 'Failed to load genre data' });
  }
});

app.get('/api/owner/teachers', requireOwner, async (req, res) => {
  try {
    const teachers = await db.getAllTeachers();
    res.json(teachers);
  } catch (e) {
    console.error('Owner teachers error:', e);
    res.status(500).json({ error: 'Failed to load teachers' });
  }
});

app.get('/api/owner/students', requireOwner, async (req, res) => {
  try {
    const students = await db.getAllStudentsForOwner();
    res.json(students);
  } catch (e) {
    console.error('Owner students error:', e);
    res.status(500).json({ error: 'Failed to load students' });
  }
});

// ─── STATUS ───
app.get('/api/status', (req, res) => {
  res.json({
    version: '1.0.0',
    claudeConfigured: claude.isConfigured(),
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here'),
    cleverConfigured: !!(process.env.CLEVER_CLIENT_ID && process.env.CLEVER_CLIENT_ID !== 'your-clever-client-id-here')
  });
});

// Catch-all
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize and start server
(async () => {
  await db.initDB();
  app.listen(PORT, () => {
    console.log(`\n🔑 key2read server running at http://localhost:${PORT}`);
    console.log(`   Dashboard: http://localhost:${PORT}/pages/dashboard.html`);
    console.log(`   Database: ✅ Supabase (PostgreSQL)`);
    console.log(`   Claude API: ${claude.isConfigured() ? '✅ Configured' : '⚠️  Not configured — add CLAUDE_API_KEY to .env'}`);
    console.log(`   Google Auth: ${process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here' ? '✅ Configured' : '⚠️  Not configured — add GOOGLE_CLIENT_ID to .env'}`);
    console.log('');
  });
})();
