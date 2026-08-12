import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("updateDefaults(\\'text\\',", "updateDefaults('text',")

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(content)
print("Done!")
