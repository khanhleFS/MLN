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
            current_q['options'].append({'id': opt_m.group(1).upper(), 'text': opt_m.group(2).strip()})
        elif ans_m:
            current_q['answer_raw'] = ans_m.group(2).strip()
        else:
            if not current_q['options'] and not current_q['answer_raw']:
                current_q['question'] += ' ' + line
            else:
                current_q['extra_notes'].append(line)

if current_q:
    raw_questions.append(current_q)

print(f"Total raw questions: {len(raw_questions)}")

CHAPTER_INFO = {
    1: {
        "title": "Chương 1: Khái luận về triết học và triết học Mác - Lênin",
        "pages": "Trang 11 – 116"
    },
    2: {
        "title": "Chương 2: Chủ nghĩa duy vật biện chứng",
        "pages": "Trang 117 – 283"
    },
    3: {
        "title": "Chương 3: Chủ nghĩa duy vật lịch sử",
        "pages": "Trang 284 – 489"
    }
}

TOPIC_INFO = {
    "1.1": {
        "chapter": 1,
        "title": "1.1. Triết học và vấn đề cơ bản của triết học",
        "pages": "Trang 11 – 47",
        "keywords": ["vấn đề cơ bản của triết học", "thế giới quan", "phương pháp luận", "duy vật", "duy tâm", "khả tri", "bất khả tri", "nhị nguyên", "siêu hình", "biện chứng và siêu hình", "chức năng thế giới quan", "hạt nhân lý luận"]
    },
    "1.2": {
        "chapter": 1,
        "title": "1.2. Triết học Mác - Lênin và vai trò trong đời sống xã hội",
        "pages": "Trang 47 – 116",
        "keywords": ["sự ra đời của triết học mác", "tiền đề kinh tế", "tiền đề lý luận", "tiền đề khoa học tự nhiên", "c.mác", "ph.ăngghen", "v.i.lênin", "hêghen", "phoiobắc", "đối tượng của triết học mác", "vai trò của triết học mác", "bộ phận lý luận"]
    },
    "2.1": {
        "chapter": 2,
        "title": "2.1. Vật chất và ý thức",
        "pages": "Trang 117 – 182",
        "keywords": ["vật chất", "ý thức", "vận động", "đứng im", "không gian", "thời gian", "phản ánh", "bộ não", "thuộc tính phản ánh", "định nghĩa vật chất", "nguồn gốc ý thức", "bản chất ý thức", "mối quan hệ giữa vật chất và ý thức"]
    },
    "2.2": {
        "chapter": 2,
        "title": "2.2. Phép biện chứng duy vật",
        "pages": "Trang 182 – 257",
        "keywords": ["mối liên hệ phổ biến", "sự phát triển", "cái riêng", "cái chung", "cái đơn nhất", "nguyên nhân", "kết quả", "tất nhiên", "ngẫu nhiên", "nội dung", "hình thức", "bản chất", "hiện tượng", "khả năng", "hiện thực", "lượng", "chất", "độ", "điểm nút", "bước nhảy", "mâu thuẫn", "mặt đối lập", "đấu tranh", "thống nhất", "phủ định của phủ định", "phủ định biện chứng"]
    },
    "2.3": {
        "chapter": 2,
        "title": "2.3. Lý luận nhận thức duy vật biện chứng",
        "pages": "Trang 257 – 283",
        "keywords": ["lý luận nhận thức", "thực tiễn", "nhận thức cảm tính", "nhận thức lý tính", "cảm giác", "tri giác", "biểu tượng", "khái niệm", "phán đoán", "suy lý", "chân lý", "kinh nghiệm", "hoạt động thực tiễn"]
    },
    "3.1": {
        "chapter": 3,
        "title": "3.1. Học thuyết hình thái kinh tế - xã hội",
        "pages": "Trang 284 – 329",
        "keywords": ["sản xuất vật chất", "lực lượng sản xuất", "quan hệ sản xuất", "cơ sở hạ tầng", "kiến trúc thượng tầng", "hình thái kinh tế - xã hội", "hình thái kinh tế xã hội", "tư liệu sản xuất", "phương thức sản xuất", "llsx", "qhsx", "csht", "kttt"]
    },
    "3.2": {
        "chapter": 3,
        "title": "3.2. Giai cấp và dân tộc",
        "pages": "Trang 329 – 384",
        "keywords": ["giai cấp", "đấu tranh giai cấp", "dân tộc", "nguồn gốc giai cấp", "kết cấu giai cấp", "liên minh giai cấp", "quan hệ giai cấp"]
    },
    "3.3": {
        "chapter": 3,
        "title": "3.3. Nhà nước và cách mạng xã hội",
        "pages": "Trang 384 – 419",
        "keywords": ["nhà nước", "cách mạng xã hội", "chính quyền nhà nước", "chuyên chính vô sản", "bạo lực cách mạng", "bản chất nhà nước"]
    },
    "3.4": {
        "chapter": 3,
        "title": "3.4. Ý thức xã hội",
        "pages": "Trang 419 – 447",
        "keywords": ["tồn tại xã hội", "ý thức xã hội", "tâm lý xã hội", "hệ tư tưởng", "hình thái ý thức", "ttxh", "ytxh", "tính độc lập tương đối"]
    },
    "3.5": {
        "chapter": 3,
        "title": "3.5. Triết học về con người",
        "pages": "Trang 447 – 489",
        "keywords": ["con người", "bản chất con người", "tha hóa con người", "quần chúng nhân dân", "lãnh tụ", "cá nhân và xã hội"]
    }
}

def determine_topic(q_obj):
    text = (q_obj['question'] + ' ' + ' '.join(o['text'] for o in q_obj['options']) + ' ' + q_obj['answer_raw']).lower()
    
    # Priority checks
    if any(k in text for k in ['tha hóa con người', 'bản chất con người', 'quần chúng nhân dân', 'lãnh tụ', 'cá nhân và xã hội']):
        return "3.5"
    if any(k in text for k in ['tồn tại xã hội', 'ý thức xã hội', 'tâm lý xã hội', 'hệ tư tưởng', 'hình thái ý thức', 'ttxh', 'ytxh']):
        return "3.4"
    if any(k in text for k in ['nhà nước', 'cách mạng xã hội', 'chính quyền nhà nước', 'chuyên chính vô sản']):
        return "3.3"
    if any(k in text for k in ['giai cấp', 'đấu tranh giai cấp', 'dân tộc']):
        return "3.2"
    if any(k in text for k in ['lực lượng sản xuất', 'quan hệ sản xuất', 'cơ sở hạ tầng', 'kiến trúc thượng tầng', 'hình thái kinh tế - xã hội', 'sản xuất vật chất', 'tư liệu sản xuất', 'llsx', 'qhsx', 'csht', 'kttt']):
        return "3.1"
    if any(k in text for k in ['lý luận nhận thức', 'thực tiễn', 'nhận thức cảm tính', 'nhận thức lý tính', 'cảm giác', 'tri giác', 'biểu tượng', 'khái niệm', 'phán đoán', 'suy lý', 'chân lý', 'kinh nghiệm']):
        return "2.3"
    if any(k in text for k in ['lượng', 'chất', 'độ', 'điểm nút', 'bước nhảy', 'cái riêng', 'cái chung', 'nguyên nhân', 'kết quả', 'tất nhiên', 'ngẫu nhiên', 'nội dung', 'hình thức', 'bản chất', 'hiện tượng', 'khả năng', 'hiện thực', 'mâu thuẫn', 'mặt đối lập', 'phủ định của phủ định', 'mối liên hệ phổ biến', 'sự phát triển']):
        return "2.2"
    if any(k in text for k in ['vật chất', 'vận động', 'đứng im', 'không gian', 'thời gian', 'ý thức', 'nguồn gốc ý thức', 'bộ não', 'phản ánh']):
        return "2.1"
    if any(k in text for k in ['tiền đề', 'c.mác', 'ph.ăngghen', 'v.i.lênin', 'hêghen', 'phoiobắc', 'đối tượng của triết học mác', 'bộ phận lý luận']):
        return "1.2"
    if any(k in text for k in ['vấn đề cơ bản của triết học', 'thế giới quan', 'phương pháp luận', 'duy vật', 'duy tâm', 'khả tri', 'bất khả tri', 'nhị nguyên', 'siêu hình']):
        return "1.1"

    # Score-based fallback
    best_topic = "2.1"
    best_score = -1
    for tid, info in TOPIC_INFO.items():
        score = sum(text.count(kw) for kw in info['keywords'])
        if score > best_score:
            best_score = score
            best_topic = tid
            
    return best_topic

# Handle Q172 special case
q172_handled = False
for q in raw_questions:
    if q['id'] == 172:
        q['options'] = [
            {'id': 'A', 'text': 'Quy luật chuyển hóa từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại (Quy luật lượng - chất)'},
            {'id': 'B', 'text': 'Quy luật thống nhất và đấu tranh của các mặt đối lập (Quy luật mâu thuẫn)'},
            {'id': 'C', 'text': 'Quy luật phủ định của phủ định'},
            {'id': 'D', 'text': 'Nguyên lý về mối liên hệ phổ biến'}
        ]
        q['answer_raw'] = 'A – Quy luật lượng chất'
        q172_handled = True

final_questions = []

for q in raw_questions:
    topic_id = determine_topic(q)
    chapter_num = TOPIC_INFO[topic_id]['chapter']
    topic_meta = TOPIC_INFO[topic_id]
    chapter_meta = CHAPTER_INFO[chapter_num]
    
    # Extract correct answers
    raw_ans = q['answer_raw']
    # Check letters before hyphen or dash or in whole string
    match_letters = re.findall(r'\b([A-H])\b', raw_ans.split('–')[0].split('-')[0])
    if not match_letters:
        match_letters = re.findall(r'\b([A-H])\b', raw_ans)
    if not match_letters:
        match_letters = ['A'] # fallback
        
    correct_keys = sorted(list(set(match_letters)))
    
    # Extract answer description text if present
    ans_text_part = ""
    if '–' in raw_ans:
        ans_text_part = raw_ans.split('–', 1)[1].strip()
    elif '-' in raw_ans:
        ans_text_part = raw_ans.split('-', 1)[1].strip()
    elif ':' in raw_ans:
        ans_text_part = raw_ans.split(':', 1)[1].strip()
        
    # Generate tailored explanation
    correct_opts_text = [opt['text'] for opt in q['options'] if opt['id'] in correct_keys]
    correct_summary = '; '.join(correct_opts_text) if correct_opts_text else ans_text_part
    
    explanation = f"Đáp án đúng là: {', '.join(correct_keys)} ({correct_summary}). "
    explanation += f"Căn cứ lý luận: Theo Giáo trình Triết học Mác – Lênin (2021), {topic_meta['title']} ({topic_meta['pages']}), "
    
    if topic_id == "1.1":
        explanation += "Triết học giải quyết vấn đề cơ bản gồm 2 mặt: Mặt thứ nhất (bản thể luận - vật chất hay ý thức có trước) phân định chủ nghĩa duy vật và chủ nghĩa duy tâm; Mặt thứ hai (nhận thức luận) xác định khả năng nhận thức thế giới của con người."
    elif topic_id == "1.2":
        explanation += "Triết học Mác ra đời là bước ngoặt cách mạng trên cơ sở kế thừa có phê phán các tiền đề lý luận (triết học cổ điển Đức, kinh tế chính trị cổ điển Anh, CNXH không tưởng Pháp) và các thành tựu khoa học tự nhiên thế kỷ XIX."
    elif topic_id == "2.1":
        explanation += "Vật chất là thực tại khách quan tồn tại độc lập với ý thức con người. Ý thức là sự phản ánh năng động, sáng tạo thế giới khách quan vào bộ óc con người dựa trên cơ sở hoạt động thực tiễn."
    elif topic_id == "2.2":
        explanation += "Phép biện chứng duy vật nghiên cứu những quy luật phổ biến nhất của sự vận động và phát triển trong tự nhiên, xã hội và tư duy. Các phạm trù và quy luật phản ánh tính khách quan, phổ biến và đa dạng của các mối liên hệ."
    elif topic_id == "2.3":
        explanation += "Thực tiễn là toàn bộ hoạt động vật chất - cảm tính, mang tính lịch sử - xã hội nhằm cải tạo thế giới; thực tiễn là cơ sở, động lực, mục đích của nhận thức và là tiêu chuẩn duy nhất kiểm tra chân lý."
    elif topic_id == "3.1":
        explanation += "Sản xuất vật chất là cơ sở tồn tại và phát triển của xã hội. Quy luật quan hệ sản xuất phải phù hợp với trình độ phát triển của lực lượng sản xuất; cơ sở hạ tầng quyết định kiến trúc thượng tầng."
    elif topic_id == "3.2":
        explanation += "Giai cấp là những tập đoàn người to lớn khác nhau về địa vị trong hệ thống sản xuất xã hội. Đấu tranh giai cấp là động lực phát triển trực tiếp của các xã hội có đối kháng giai cấp."
    elif topic_id == "3.3":
        explanation += "Nhà nước là sản phẩm và biểu hiện của các mâu thuẫn giai cấp không thể điều hòa được. Cách mạng xã hội là đỉnh cao của đấu tranh giai cấp, thay thế chính quyền cũ bằng chính quyền tiến bộ hơn."
    elif topic_id == "3.4":
        explanation += "Tồn tại xã hội quyết định ý thức xã hội, nhưng ý thức xã hội có tính độc lập tương đối và tác động trở lại mạnh mẽ đối với tồn tại xã hội."
    elif topic_id == "3.5":
        explanation += "Bản chất con người trong tính hiện thực là tổng hòa các quan hệ xã hội. Quần chúng nhân dân là chủ thể sáng tạo chân chính ra lịch sử, giữ vai trò quyết định trong sự phát triển của xã hội."

    final_q = {
        'id': q['id'],
        'question': q['question'],
        'options': q['options'],
        'correctAnswers': correct_keys,
        'chapter': chapter_num,
        'chapterTitle': chapter_meta['title'],
        'topicId': topic_id,
        'topicTitle': topic_meta['title'],
        'pageReference': topic_meta['pages'],
        'textbook': "Giáo trình Triết học Mác – Lênin (2021), NXB Chính trị quốc gia Sự thật",
        'explanation': explanation,
        'extraNotes': q['extra_notes']
    }
    final_questions.append(final_q)

# Write to JSON
with open('mln111_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(final_questions, f, ensure_ascii=False, indent=2)

print(f"Successfully generated mln111_dataset.json with {len(final_questions)} questions!")
