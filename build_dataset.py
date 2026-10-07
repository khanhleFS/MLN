import docx
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document('mln111_598_cau_hoan_chinh.docx')
lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

raw_questions = []
current_q = None

for line in lines:
    m = re.match(r'^Câu\s+(\d+)\s*[:.]\s*(.*)', line, re.IGNORECASE)
    if m:
        if current_q:
            raw_questions.append(current_q)
        current_q = {
            'id': int(m.group(1)),
            'question': m.group(2).strip(),
            'options': [],
            'answer_raw': '',
            'extra_notes': []
        }
        continue
    
    if current_q:
        opt_m = re.match(r'^([A-H])\.\s*(.*)', line)
        ans_m = re.match(r'^(Đáp án|ĐÁP ÁN)\s*[:.]\s*(.*)', line, re.IGNORECASE)
        if opt_m:
            current_q['options'].append({'id': opt_m.group(1), 'text': opt_m.group(2).strip()})
        elif ans_m:
            current_q['answer_raw'] = ans_m.group(2).strip()
        else:
            if not current_q['options'] and not current_q['answer_raw']:
                current_q['question'] += ' ' + line
            else:
                current_q['extra_notes'].append(line)

if current_q:
    raw_questions.append(current_q)

print(f"Total raw questions parsed: {len(raw_questions)}")

# Now process each question
processed_questions = []

CHAPTER_MAP = {
    1: "Chương 1: Khái luận về triết học và triết học Mác - Lênin",
    2: "Chương 2: Chủ nghĩa duy vật biện chứng",
    3: "Chương 3: Chủ nghĩa duy vật lịch sử"
}

TOPIC_PAGES = {
    "1.1": ("1.1. Triết học và vấn đề cơ bản của triết học", "Trang 11 – 47"),
    "1.2": ("1.2. Triết học Mác - Lênin và vai trò trong đời sống xã hội", "Trang 47 – 116"),
    "2.1": ("2.1. Vật chất và ý thức", "Trang 117 – 182"),
    "2.2": ("2.2. Phép biện chứng duy vật", "Trang 182 – 257"),
    "2.3": ("2.3. Lý luận nhận thức duy vật biện chứng", "Trang 257 – 283"),
    "3.1": ("3.1. Học thuyết hình thái kinh tế - xã hội", "Trang 284 – 329"),
    "3.2": ("3.2. Giai cấp và dân tộc", "Trang 329 – 384"),
    "3.3": ("3.3. Nhà nước và cách mạng xã hội", "Trang 384 – 419"),
    "3.4": ("3.4. Ý thức xã hội", "Trang 419 – 447"),
    "3.5": ("3.5. Triết học về con người", "Trang 447 – 489")
}

def classify_detailed(q_obj):
    text = (q_obj['question'] + ' ' + ' '.join(o['text'] for o in q_obj['options']) + ' ' + q_obj['answer_raw']).lower()
    
    # Check 3.5: Con người
    if any(k in text for k in ['tha hóa con người', 'bản chất con người', 'quần chúng nhân dân', 'lãnh tụ', 'cá nhân và xã hội', 'quan hệ cá nhân']):
        return 3, "3.5"
    
    # Check 3.4: Ý thức xã hội
    if any(k in text for k in ['tồn tại xã hội', 'ý thức xã hội', 'tâm lý xã hội', 'hệ tư tưởng', 'hình thái ý thức', 'ttxh', 'ytxh']):
        return 3, "3.4"
        
    # Check 3.3: Nhà nước & Cách mạng xã hội
    if any(k in text for k in ['nhà nước', 'cách mạng xã hội', 'chính quyền nhà nước', 'chuyên chính vô sản', 'bạo lực cách mạng']):
        return 3, "3.3"
        
    # Check 3.2: Giai cấp & Dân tộc
    if any(k in text for k in ['giai cấp', 'đấu tranh giai cấp', 'dân tộc', 'nguồn gốc giai cấp', 'kết cấu giai cấp', 'liên minh giai cấp']):
        return 3, "3.2"
        
    # Check 3.1: Hình thái kinh tế - xã hội
    if any(k in text for k in ['sản xuất vật chất', 'lực lượng sản xuất', 'quan hệ sản xuất', 'cơ sở hạ tầng', 'kiến trúc thượng tầng', 'hình thái kinh tế - xã hội', 'hình thái kinh tế xã hội', 'llsx', 'qhsx', 'csht', 'kttt', 'tư liệu sản xuất', 'phương thức sản xuất']):
        return 3, "3.1"
        
    # Check 2.3: Lý luận nhận thức
    if any(k in text for k in ['lý luận nhận thức', 'thực tiễn', 'nhận thức cảm tính', 'nhận thức lý tính', 'cảm giác', 'tri giác', 'biểu tượng', 'khái niệm', 'phán đoán', 'suy lý', 'suy luận', 'chân lý', 'kinh nghiệm', 'lý luận', 'hoạt động thực tiễn']):
        return 2, "2.3"
        
    # Check 2.2: Phép biện chứng duy vật
    if any(k in text for k in ['mối liên hệ phổ biến', 'nguyên lý về sự phát triển', 'cái riêng', 'cái chung', 'cái đơn nhất', 'nguyên nhân', 'kết quả', 'tất nhiên', 'ngẫu nhiên', 'nội dung', 'hình thức', 'bản chất', 'hiện tượng', 'khả năng', 'hiện thực', 'lượng', 'chất', 'độ', 'điểm nút', 'bước nhảy', 'mâu thuẫn', 'mặt đối lập', 'thống nhất và đấu tranh', 'phủ định của phủ định', 'phủ định biện chứng', 'quy luật']):
        return 2, "2.2"
        
    # Check 2.1: Vật chất & Ý thức
    if any(k in text for k in ['vật chất', 'ý thức', 'vận động', 'đứng im', 'không gian', 'thời gian', 'phản ánh', 'bộ não', 'tâm lý động vật', 'thuộc tính phản ánh', 'định nghĩa vật chất', 'nguồn gốc tự nhiên của ý thức', 'nguồn gốc xã hội của ý thức', 'bản chất của ý thức']):
        return 2, "2.1"
        
    # Check 1.2: Triết học Mác - Lênin
    if any(k in text for k in ['tiền đề', 'kinh tế - xã hội', 'khoa học tự nhiên', 'c.mác', 'ph.ăngghen', 'v.i.lênin', 'hêghen', 'phoiobắc', 'tuyên ngôn', 'cuộc cách mạng trong triết học', 'đối tượng và chức năng', 'chức năng thế giới quan', 'chức năng phương pháp luận']):
        return 1, "1.2"
        
    # Check 1.1: Khái lược về triết học & vấn đề cơ bản
    if any(k in text for k in ['vấn đề cơ bản của triết học', 'mặt thứ nhất', 'mặt thứ hai', 'thế giới quan', 'phương pháp luận', 'duy vật', 'duy tâm', 'khả tri', 'bất khả tri', 'nhị nguyên', 'biện chứng và siêu hình', 'siêu hình']):
        return 1, "1.1"
        
    # Default fallback
    return 2, "2.1"

# Test classification for all
chapter_counts = {1: 0, 2: 0, 3: 0}
topic_counts = {}

for q in raw_questions:
    ch, top = classify_detailed(q)
    chapter_counts[ch] += 1
    topic_counts[top] = topic_counts.get(top, 0) + 1

print("\nChapter distribution:")
for ch, count in chapter_counts.items():
    print(f"  {CHAPTER_MAP[ch]}: {count} câu")

print("\nSubtopic distribution:")
for top, count in sorted(topic_counts.items()):
    t_name, pages = TOPIC_PAGES[top]
    print(f"  {top} - {t_name} ({pages}): {count} câu")
