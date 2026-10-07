import docx
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document('mln111_598_cau_hoan_chinh.docx')
lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

questions = []
current_q = None

for line in lines:
    m = re.match(r'^Câu\s+(\d+)\s*[:.]\s*(.*)', line, re.IGNORECASE)
    if m:
        if current_q:
            questions.append(current_q)
        current_q = {
            'id': int(m.group(1)),
            'question': m.group(2).strip(),
            'options': [],
            'answer_raw': '',
            'other_lines': []
        }
        continue
    
    if current_q:
        opt_m = re.match(r'^([A-H])\.\s*(.*)', line)
        ans_m = re.match(r'^(Đáp án|ĐÁP ÁN)\s*[:.]\s*(.*)', line, re.IGNORECASE)
        if opt_m:
            current_q['options'].append({'key': opt_m.group(1), 'text': opt_m.group(2).strip()})
        elif ans_m:
            current_q['answer_raw'] = ans_m.group(2).strip()
        else:
            if not current_q['options'] and not current_q['answer_raw']:
                current_q['question'] += ' ' + line
            else:
                current_q['other_lines'].append(line)

if current_q:
    questions.append(current_q)

print(f'Parsed total questions: {len(questions)}')
no_ans = [q['id'] for q in questions if not q['answer_raw']]
print(f'Questions without answer_raw: {len(no_ans)} -> {no_ans}')
no_opts = [q['id'] for q in questions if not q['options']]
print(f'Questions without options: {len(no_opts)} -> {no_opts}')

# Look at answer formats
ans_types = {}
for q in questions:
    raw = q['answer_raw']
    # let's extract keys like A, B, C, D, or A & B, etc.
    keys = re.findall(r'^[A-H](?:[\s,và&]+[A-H])*', raw)
    # let's see how raw starts
    m_key = re.match(r'^([A-H](?:\s*[,và&]\s*[A-H])*)', raw, re.IGNORECASE)
    k = m_key.group(1) if m_key else 'OTHER'
    ans_types[k] = ans_types.get(k, 0) + 1

print("\nAnswer key frequency:")
for k, count in sorted(ans_types.items(), key=lambda x: -x[1])[:25]:
    print(f"  {k}: {count}")

# Check any with 'OTHER'
others = [q for q in questions if not re.match(r'^[A-H]', q['answer_raw'], re.IGNORECASE)]
print(f"\nQuestions with non-standard answer format: {len(others)}")
for q in others[:10]:
    print(f"  Q{q['id']}: {q['answer_raw']} (Other lines: {q['other_lines']})")

# Check questions with other_lines
with_others = [q for q in questions if q['other_lines']]
print(f"\nQuestions with extra lines: {len(with_others)}")
for q in with_others[:10]:
    print(f"  Q{q['id']}: {q['other_lines']}")
