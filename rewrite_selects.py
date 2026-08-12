import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { CustomSelect }" not in content:
    content = content.replace("import { X", "import { CustomSelect } from './CustomSelect';\nimport { X")

# We will just write a regex that finds <select ...> ... </select> block.
# Since regex parsing of HTML is tricky, we can use a simpler approach because the format is consistent.

# Pattern for:
# <select \n value={...} \n onChange={...} \n className={...} \n>
#   <option value="...">...</option>
#   ...
# </select>
def replacer(match):
    attrs = match.group(1)
    options_block = match.group(2)
    
    # extract value
    val_m = re.search(r'value=\{([^}]+)\}', attrs)
    value_expr = val_m.group(1) if val_m else '""'
    
    # extract onChange
    onchange_m = re.search(r'onChange=\{\(e\) => (.+?)\}', attrs)
    onchange_expr = onchange_m.group(1) if onchange_m else '() => {}'
    
    # rewrite e.target.value to val
    onchange_expr = onchange_expr.replace('e.target.value', 'val')
    
    # extract options
    options = []
    for opt_m in re.finditer(r'<option\s+value="([^"]+)">([^<]+)</option>', options_block):
        options.append(f"{{ value: '{opt_m.group(1)}', label: '{opt_m.group(2)}' }}")
        
    options_str = "[\n                  " + ",\n                  ".join(options) + "\n                ]"
    
    return f"""<CustomSelect 
              value={{{value_expr}}} 
              onChange={{(val) => {onchange_expr}}}
              options={{{options_str}}}
            />"""

new_content = re.sub(r'<select([^>]+)>(.*?)</select>', replacer, content, flags=re.DOTALL)

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(new_content)
print("Done!")
