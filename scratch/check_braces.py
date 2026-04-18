
content = open(r'c:\PROYECTOS\DIICZONE_APP\app\dashboard\hq\team\page.js', 'r', encoding='utf-8').read()
stack = []
lines = content.split('\n')
for i, line in enumerate(lines):
    for char in line:
        if char == '{':
            stack.append(i+1)
        elif char == '}':
            if not stack:
                print(f"Extra closing brace at line {i+1}")
            else:
                stack.pop()
if stack:
    print(f"Unclosed braces starting at lines: {stack}")
