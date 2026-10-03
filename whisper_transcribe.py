import whisper
import os
import json

audio_dir = r"D:\tasnim-letter\audio"
output_file = r"D:\tasnim-letter\transcripts_whisper.json"

print("Loading Whisper model (this may take a moment the first time)...")
model = whisper.load_model("base")

files = sorted([f for f in os.listdir(audio_dir) if f.endswith('.ogg') or f.endswith('.mp4')])
print(f"Found {len(files)} audio files. Starting transcription...")

transcripts = {}
for i, filename in enumerate(files):
    filepath = os.path.join(audio_dir, filename)
    print(f"[{i+1}/{len(files)}] {filename}...", flush=True)
    try:
        result = model.transcribe(filepath, language="ar", fp16=False)
        transcripts[filename] = result["text"].strip()
        print(f"  -> Done", flush=True)
    except Exception as e:
        transcripts[filename] = "[Error]"
        print(f"  -> Error", flush=True)

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(transcripts, f, ensure_ascii=False, indent=4)

print(f"\nAll done! Saved to {output_file}")
