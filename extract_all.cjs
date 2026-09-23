const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('D:/instagram-mohamedharbi_21-2026-09-04-KP2O2qji/your_instagram_activity/messages/inbox/tasnimyousfi_1944846576908793/message_1.json', 'utf8'));

function decode(str) {
  if (!str) return str;
  try { return decodeURIComponent(escape(str)); } catch(e) { return str; }
}

const msgs = data.messages || [];
// Reverse to chronological order (oldest first)
msgs.reverse();

let out = '';
let currentDay = '';

msgs.forEach(m => {
  const dateObj = new Date(m.timestamp_ms);
  const day = dateObj.toISOString().split('T')[0];
  const time = dateObj.toTimeString().split(' ')[0];
  
  if (day !== currentDay) {
    out += `\n--- ${day} ---\n`;
    currentDay = day;
  }
  
  const sender = decode(m.sender_name) === 'Mohamed Harbi' ? 'Harbi' : 'Tasnim';
  const text = m.content ? decode(m.content) : (m.share ? '[Share]' : '[Media]');
  
  // Compact format to save lines
  out += `[${time}] ${sender}: ${text.replace(/\n/g, ' ')}\n`;
});

const outPath = path.join(__dirname, 'full_transcript.txt');
fs.writeFileSync(outPath, out, 'utf8');
console.log(`Saved ${msgs.length} messages to full_transcript.txt. Total lines: ${out.split('\n').length}`);
