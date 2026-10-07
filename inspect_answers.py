import re
import sys
from parse_questions import questions

sys.stdout.reconfigure(encoding='utf-8')

multi_ans = [q for q in questions if ',' in q['answer_raw'] or 'và' in q['answer_raw'] or '&' in q['answer_raw']]
print(f'Total questions with multi answers: {len(multi_ans)}')
for q in multi_ans:
    print(f"Q{q['id']}: {q['question']}")
    for opt in q['options']:
        print(f"   {opt['key']}. {opt['text']}")
    print(f"   Ans: {q['answer_raw']}")
    print('-'*40)
