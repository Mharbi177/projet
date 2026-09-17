const fs = require('fs');
const data = JSON.parse(fs.readFileSync('D:/instagram-mohamedharbi_21-2026-09-04-KP2O2qji/your_instagram_activity/messages/inbox/tasnimyousfi_1944846576908793/message_1.json', 'utf8'));

// The Instagram JSON sometimes has incorrectly decoded UTF-8 strings.
function decode(str) {
  if (!str) return str;
  try { return decodeURIComponent(escape(str)); } catch(e) { return str; }
}

const msgs = data.messages || [];
console.log('Total messages:', msgs.length);
if (data.participants) {
  console.log('Participants:', data.participants.map(p => decode(p.name)).join(', '));
}

if (msgs.length > 0) {
  const first = msgs[msgs.length - 1];
  const last = msgs[0];
  console.log('First msg date:', new Date(first.timestamp_ms).toISOString());
  console.log('Last msg date:', new Date(last.timestamp_ms).toISOString());

  const counts = {};
  msgs.forEach(m => {
    const sender = decode(m.sender_name);
    counts[sender] = (counts[sender] || 0) + 1;
  });
  console.log('Message counts:', counts);

  console.log('\n--- First 10 messages (Start of chat) ---');
  msgs.slice(-10).reverse().forEach(m => {
    const date = new Date(m.timestamp_ms).toISOString().split('T')[0];
    const text = m.content ? decode(m.content) : (m.share ? '(Share)' : '(Media)');
    console.log(`[${date}] ${decode(m.sender_name)}: ${text}`);
  });

  console.log('\n--- Last 15 messages (Most recent) ---');
  msgs.slice(0, 15).reverse().forEach(m => {
    const date = new Date(m.timestamp_ms).toISOString().split('T')[0];
    const text = m.content ? decode(m.content) : (m.share ? '(Share)' : '(Media)');
    console.log(`[${date}] ${decode(m.sender_name)}: ${text}`);
  });
}
