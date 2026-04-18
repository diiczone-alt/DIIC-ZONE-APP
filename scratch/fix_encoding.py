
import os

path = r'c:\PROYECTOS\DIICZONE_APP\components\workstation\cm\CMWorkstationLayout.js'

with open(path, 'rb') as f:
    data = f.read()

# Try to find where the mangled part starts.
# It likely starts where I added the CMProfileView or where the first backslash-quote appeared.
# The error said index 177749.

# We'll try to fix common mangling:
# 1. Replace \> with ">
# 2. Replace \ with " (if it looks like a quote)
# 3. Fix the ? characters if possible, or just replace them with the correct ones.

try:
    text = data.decode('utf-8', errors='ignore')
except:
    text = data.decode('latin-1', errors='ignore')

# Fixing the mangled quotes
fixed_text = text.replace('\\>', '">').replace('\\ ', '" ').replace('\\"', '"').replace('\\}', '"}').replace('\\)', '")').replace('\\[', '"[').replace('\\]', '"]').replace('\\<', '"<')

# The user reported "R" and "?" characters.
# Sincronizaci?n -> Sincronización
# ?LITE -> ÉLITE
fixed_text = fixed_text.replace('Sincronizaci?n', 'Sincronización').replace('?LITE', 'ÉLITE').replace('Configuraci?n', 'Configuración').replace('Pr?ximamente', 'Próximamente')

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed_text)

print("File fixed attempted.")
