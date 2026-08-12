import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

# Fix in renderTypeSettings
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(type, { animationIn: val })}\1options={[\2]}',
    content, count=1
)
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(type, { animationOut: val })}\1options={[\2]}',
    content, count=1
)
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(type, { easing: val })}\1options={[\2]}',
    content, count=1
)
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(type, { textEffect: val })}\1options={[\2]}',
    content, count=1
)
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(type, { fontFamily: val })}\1options={[\2]}',
    content, count=1
)
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(type, { mediaEffect: val })}\1options={[\2]}',
    content, count=1
)
# Line 309
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => updateDefaults(\'text\', { fontFamily: val })}\1options={[\2]}',
    content, count=1
)
# Line 449 & 462
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => setKeylightType(val as any)}\1options={[\2]}',
    content, count=1
)
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => useStore.getState().setGridOverlay(val)}\1options={[\2]}',
    content, count=1
)
# Line 565
content = re.sub(
    r'onChange=\{\(val\) => \(\) => \{\}\}([\s\S]*?)options=\{\[([\s\S]*?)\]\}',
    r'onChange={(val) => setGeminiModel(val)}\1options={[\2]}',
    content, count=1
)

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(content)
print("Done!")
