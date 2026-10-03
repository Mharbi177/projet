import re
import os
import json

# Step 1: Extract all [Media] / attachment entries from full_transcript.txt
with open('full_transcript.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

media_entries = []
current_date = ''
for line in lines:
    line_stripped = line.strip()
    if line_stripped.startswith('--- '):
        current_date = line_stripped.strip('-').strip()
    elif '[Media]' in line_stripped or 'You sent an attachment' in line_stripped:
        match = re.match(r'\[(\d{2}:\d{2}:\d{2})\] (\w+): (.+)', line_stripped)
        if match:
            time_val = match.group(1)
            sender = match.group(2)
            content = match.group(3)
            media_entries.append({
                'date': current_date,
                'time': time_val,
                'sender': sender,
                'raw': content
            })

print(f"Total media/attachment entries in transcript: {len(media_entries)}")

# Step 2: List audio files sorted
audio_dir = r'D:\tasnim-letter\audio'
audio_files = sorted([f for f in os.listdir(audio_dir) if f.endswith('.ogg') or f.endswith('.mp4')])
print(f"Total audio files in directory: {len(audio_files)}")

# Step 3: Load transcripts if whisper output is available
whisper_file = r'D:\tasnim-letter\transcripts_whisper.json'
google_file = r'D:\tasnim-letter\transcripts.json'

transcripts = {}
if os.path.exists(whisper_file):
    with open(whisper_file, 'r', encoding='utf-8') as f:
        transcripts = json.load(f)
    print(f"Loaded {len(transcripts)} Whisper transcripts")
elif os.path.exists(google_file):
    with open(google_file, 'r', encoding='utf-8') as f:
        transcripts = json.load(f)
    print(f"Loaded {len(transcripts)} Google transcripts")

# Step 4: Build combined timeline
# The audio files are Instagram/Messenger message IDs sorted numerically.
# The transcript orders media entries chronologically.
# We match by position (file i = media_entry i, assuming 1-to-1 correspondence)
# But [Media] appears for both voice notes AND photos/videos, so we need to be careful.
# We'll just annotate each audio file with its positional date/time guess.

# For now: filter media entries to only the ones sent BY Harbi (attachments are sent by Harbi)
# and [Media] can be either side
harbi_media = [e for e in media_entries if e['sender'] == 'Harbi' or 'sent an attachment' in e.get('raw','')]
tasnim_media = [e for e in media_entries if e['sender'] == 'Tasnim']

print(f"\nHarbi media entries: {len(harbi_media)}")
print(f"Tasnim media entries: {len(tasnim_media)}")
print(f"Total: {len(media_entries)}")

# Build full timeline output file
output = []
output.append("=" * 80)
output.append("FULL VOICE NOTE TIMELINE & ANALYSIS")
output.append("=" * 80)
output.append(f"\nTotal audio files: {len(audio_files)}")
output.append(f"Total media entries in transcript: {len(media_entries)}")
output.append(f"Transcripts available: {len(transcripts)}")
output.append("\n")

# List all media entries with index
output.append("--- ALL MEDIA ENTRIES IN TRANSCRIPT ORDER ---\n")
for i, e in enumerate(media_entries):
    output.append(f"[{i+1:03d}] {e['date']} {e['time']} | {e['sender']:8s} | {e['raw']}")

output.append("\n--- AUDIO FILES WITH TRANSCRIPTS ---\n")
for i, filename in enumerate(audio_files):
    t = transcripts.get(filename, '[Not yet transcribed]')
    # Try to match to a media entry by position
    matching_entry = None
    if i < len(media_entries):
        matching_entry = media_entries[i]
    
    output.append(f"[File {i+1:02d}] {filename}")
    if matching_entry:
        output.append(f"  Approx. date: {matching_entry['date']} {matching_entry['time']}")
        output.append(f"  Sender: {matching_entry['sender']}")
    output.append(f"  Transcript: {t}")
    output.append("")

timeline_path = r'D:\tasnim-letter\voice_timeline.txt'
with open(timeline_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f"\nTimeline written to {timeline_path}")
