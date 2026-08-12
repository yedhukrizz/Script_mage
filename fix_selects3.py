import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("{ value: 'fade-zoom-out', label: 'Fade & Zoom Out' }", 
"{ value: 'fade-zoom-out', label: 'Fade & Zoom Out' },\n                  { value: 'typewriter', label: 'Write Out (Typewriter)' },\n                  { value: 'fly-in', label: 'Fly In (Bounce)' }")

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(content)
print("Done!")
