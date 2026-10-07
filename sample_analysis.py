import sys
from parse_questions import questions

sys.stdout.reconfigure(encoding='utf-8')

sample_check = [1, 2, 3, 4, 5, 20, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 598]
for qid in sample_check:
    q = questions[qid - 1]
    print(f"Q{q['id']:3d}: {q['question'][:65]}... | Ans: {q['answer_raw'][:30]}")
