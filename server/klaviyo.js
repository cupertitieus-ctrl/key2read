// ============================================================
// key2read — Klaviyo Email Integration
// ============================================================

const KLAVIYO_API_URL = 'https://a.klaviyo.com/api';

/**
 * Send welcome email via Klaviyo Events API v3
 * Creates an "Account Created" event that triggers a Klaviyo Flow
 *
 * @param {{ email, firstName, lastName, password, plan, classCode, loginUrl }} params
 */
async function sendWelcomeEmail({ email, firstName, lastName, password, plan, classCode, loginUrl }) {
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) {
    console.error('Missing KLAVIYO_API_KEY — skipping welcome email');
    return null;
  }

  const eventPayload = {
    data: {
      type: 'event',
      attributes: {
        metric: {
          data: {
            type: 'metric',
            attributes: {
              name: 'Account Created'
            }
          }
        },
        profile: {
          data: {
            type: 'profile',
            attributes: {
              email: email,
              first_name: firstName,
              last_name: lastName || '',
              properties: {
                plan: plan,
                source: 'shopify'
              }
            }
          }
        },
        properties: {
          password: password,
          plan: plan,
          class_code: classCode || '',
          login_url: loginUrl || 'https://key2read.com/pages/signin.html',
          first_name: firstName,
          email: email
        },
        time: new Date().toISOString()
      }
    }
  };

  try {
    const response = await fetch(`${KLAVIYO_API_URL}/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-10-15'
      },
      body: JSON.stringify(eventPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Klaviyo API error:', response.status, errorText);
      return null;
    }

    console.log(`✅ Klaviyo "Account Created" event sent for ${email}`);
    return true;
  } catch (err) {
    console.error('Klaviyo send error:', err.message);
    return null;
  }
}

/**
 * Add a profile to a Klaviyo list (optional)
 */
async function addToList(email, firstName, lastName) {
  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;
  if (!apiKey || !listId) return null;

  try {
    // First create/update the profile
    const profileRes = await fetch(`${KLAVIYO_API_URL}/profiles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-10-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email,
            first_name: firstName,
            last_name: lastName || ''
          }
        }
      })
    });

    let profileId;
    if (profileRes.status === 201) {
      const profileData = await profileRes.json();
      profileId = profileData.data?.id;
    } else if (profileRes.status === 409) {
      // Profile already exists — extract ID from error
      const errData = await profileRes.json();
      profileId = errData.errors?.[0]?.meta?.duplicate_profile_id;
    }

    if (!profileId) return null;

    // Add to list
    await fetch(`${KLAVIYO_API_URL}/lists/${listId}/relationships/profiles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-10-15'
      },
      body: JSON.stringify({
        data: [{ type: 'profile', id: profileId }]
      })
    });

    console.log(`✅ Added ${email} to Klaviyo list ${listId}`);
    return true;
  } catch (err) {
    console.error('Klaviyo list error:', err.message);
    return null;
  }
}

module.exports = {
  sendWelcomeEmail,
  addToList
};
