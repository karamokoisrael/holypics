import re
filename = "website/index.html"
# SAMPLE1.TXT
# Hello World!
# I am a human.

with open(filename, 'r+') as f:
    text = f.read()
    text = re.sub('<meta charset="utf-8"/>', '<meta charset="utf-8"/>', text)
    f.seek(0)
    f.write(text)
    f.truncate()

# SAMPLE1.TXT
# Hello World!
# I am a cat.