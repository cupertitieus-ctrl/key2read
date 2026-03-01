// ============================================================
// key2read — Shopify Integration (Webhook Verification & Order Parsing)
// ============================================================
const crypto = require('crypto');

/**
 * Verify Shopify webhook HMAC-SHA256 signature
 * @param {Buffer} rawBody - Raw request body buffer
 * @param {string} hmacHeader - X-Shopify-Hmac-Sha256 header value
 * @returns {boolean}
 */
function verifyWebhookHMAC(rawBody, hmacHeader) {
  if (!rawBody || !hmacHeader) return false;
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing SHOPIFY_WEBHOOK_SECRET env variable');
    return false;
  }
  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

/**
 * Parse Shopify order payload into clean data
 * @param {object} order - Shopify order JSON
 * @returns {{ email, firstName, lastName, fullName, orderId, customerId, plan, rawOrder }}
 */
function parseOrderData(order) {
  const customer = order.customer || {};
  const email = order.email || customer.email || '';
  const firstName = customer.first_name || order.billing_address?.first_name || '';
  const lastName = customer.last_name || order.billing_address?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Customer';

  // Determine plan from line items
  let plan = 'family'; // default
  const lineItems = order.line_items || [];
  for (const item of lineItems) {
    const title = (item.title || '').toLowerCase();
    const sku = (item.sku || '').toLowerCase();
    const combined = title + ' ' + sku;
    if (combined.includes('school') || combined.includes('classroom') || combined.includes('teacher')) {
      plan = 'school';
      break;
    }
  }

  return {
    email,
    firstName,
    lastName,
    fullName,
    orderId: String(order.id || order.order_number || ''),
    customerId: String(customer.id || ''),
    plan,
    rawOrder: order
  };
}

/**
 * Generate a human-readable password
 * @returns {string} e.g. "BookWorm-7392"
 */
function generateReadablePassword() {
  const words = [
    'BookWorm', 'ReadKey', 'PageTurn', 'StoryTime',
    'QuizStar', 'KeyReader', 'WordHero', 'ChapterPro',
    'ReadStar', 'BookHero', 'QuizChamp', 'PageHero'
  ];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${word}-${num}`;
}

module.exports = {
  verifyWebhookHMAC,
  parseOrderData,
  generateReadablePassword
};
