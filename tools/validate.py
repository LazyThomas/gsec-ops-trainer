import json, collections
from pathlib import Path
root=Path(__file__).resolve().parents[1]
qs=json.loads((root/'data/questions.json').read_text())
labs=json.loads((root/'data/labs.json').read_text())
allq=qs+[q for lab in labs for q in lab['steps']]
assert len({q['id'] for q in allq})==len(allq),'Duplicate IDs'
assert len({q['q'].strip().lower() for q in allq})==len(allq),'Duplicate question text'
for q in allq:
 assert q['section'] in {f'SEC401.{i}' for i in range(1,7)},q['id']
 assert len(q['choices'])==4 and len(set(q['choices']))==4,q['id']
 assert type(q['answer']) is int and 0<=q['answer']<4,q['id']
 assert q['why'] and q['cue'] and q['indexCues'] and q['domain'],q['id']
 assert q['bookCue']['section']==q['section'],q['id']
 assert 'page' in q['bookCue'] and 'edition' in q['bookCue'],q['id']
 assert q['status']=='published' and q['origin'],q['id']
 assert not any('TODO' in s or 'PLACEHOLDER' in s for s in [q['q'],q['why'],*q['choices']]),q['id']
for sec in range(1,7):assert sum(q['section']==f'SEC401.{sec}' for q in qs)>=18
for name in ['index.html','app.js','styles.css','service-worker.js','manifest.webmanifest','icon-192.png','icon-512.png','README.md']:
 assert (root/name).is_file(),name
assert len(labs)==20 and all(len(l['steps'])==6 for l in labs)
print(f'PASS: {len(qs)} standard questions, {len(labs)} missions, {len(allq)-len(qs)} lab steps; unique IDs/prompts, metadata, answers, sections, assets.')
print(dict(collections.Counter(q['section'] for q in qs)))
