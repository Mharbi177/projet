import os
import speech_recognition as sr
from pydub import AudioSegment
import json

audio_dir = r"D:\tasnim-letter\audio"
output_file = r"D:\tasnim-letter\transcripts.json"

recognizer = sr.Recognizer()

transcripts = {}

# Ensure the output directory exists
if not os.path.exists(audio_dir):
    print(f"Error: Directory {audio_dir} not found.")
    exit(1)

# List all files in the directory
files = os.listdir(audio_dir)
audio_files = [f for f in files if f.endswith('.ogg') or f.endswith('.mp4')]

print(f"Found {len(audio_files)} audio files. Starting transcription...")

# Process all files
for i, filename in enumerate(audio_files):
    filepath = os.path.join(audio_dir, filename)
    wav_path = filepath + ".wav"
    
    print(f"[{i+1}/{len(audio_files)}] Processing {filename}...")
    
    try:
        # Convert to WAV (speech_recognition requires WAV/AIFF/FLAC)
        if filename.endswith('.ogg'):
            audio = AudioSegment.from_ogg(filepath)
        elif filename.endswith('.mp4'):
            audio = AudioSegment.from_file(filepath, format="mp4")
        
        audio.export(wav_path, format="wav")
        
        # Transcribe
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            
            # Since the conversation is in Tunisian Arabic/French, we'll try Arabic first, 
            # though Google's Speech API might struggle with Darja. We'll try ar-TN.
            try:
                text = recognizer.recognize_google(audio_data, language="ar-TN")
                transcripts[filename] = text
                print(f"  Transcription successful for {filename}")
            except sr.UnknownValueError:
                print("  Google Speech Recognition could not understand audio")
                transcripts[filename] = "[Could not understand]"
            except sr.RequestError as e:
                transcripts[filename] = f"[API Error]"
                
    except Exception as e:
        print(f"  Error processing {filename}")
        transcripts[filename] = f"[Error]"
        
    finally:
        # Clean up temporary WAV file
        if os.path.exists(wav_path):
            os.remove(wav_path)

# Save to JSON
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(transcripts, f, ensure_ascii=False, indent=4)

print(f"\nSaved transcripts to {output_file}")
