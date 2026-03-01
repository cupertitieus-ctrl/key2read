require('dotenv').config();
const key = process.env.CLAUDE_API_KEY;
console.log('Key exists:', !!key);
console.log('Key length:', key ? key.length : 0);
console.log('Is placeholder:', key === 'your-claude-api-key-here');
