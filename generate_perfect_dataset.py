import json
import re
import sys
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

# Load the current 598 questions
with open('quiz-app/src/data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} questions")

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
        "desc": "Triết học giải quyết vấn đề cơ bản gồm 2 mặt: Mặt thứ nhất (bản thể luận - vật chất hay ý thức có trước) phân định chủ nghĩa duy vật và chủ nghĩa duy tâm; Mặt thứ hai (nhận thức luận) xác định khả năng nhận thức thế giới của con người."
    },
    "1.2": {
        "chapter": 1,
        "title": "1.2. Triết học Mác - Lênin và vai trò trong đời sống xã hội",
        "pages": "Trang 47 – 116",
        "desc": "Triết học Mác ra đời là bước ngoặt cách mạng trên cơ sở kế thừa có phê phán các tiền đề lý luận (triết học cổ điển Đức, kinh tế chính trị cổ điển Anh, CNXH không tưởng Pháp) và các thành tựu khoa học tự nhiên thế kỷ XIX."
    },
    "2.1": {
        "chapter": 2,
        "title": "2.1. Vật chất và ý thức",
        "pages": "Trang 117 – 182",
        "desc": "Vật chất là thực tại khách quan tồn tại độc lập với ý thức con người. Ý thức là sự phản ánh năng động, sáng tạo thế giới khách quan vào bộ óc con người dựa trên cơ sở hoạt động thực tiễn."
    },
    "2.2": {
        "chapter": 2,
        "title": "2.2. Phép biện chứng duy vật",
        "pages": "Trang 182 – 257",
        "desc": "Phép biện chứng duy vật nghiên cứu những quy luật phổ biến nhất của sự vận động và phát triển trong tự nhiên, xã hội và tư duy. Các phạm trù và quy luật phản ánh tính khách quan, phổ biến và đa dạng của các mối liên hệ."
    },
    "2.3": {
        "chapter": 2,
        "title": "2.3. Lý luận nhận thức duy vật biện chứng",
        "pages": "Trang 257 – 283",
        "desc": "Thực tiễn là toàn bộ hoạt động vật chất - cảm tính, mang tính lịch sử - xã hội nhằm cải tạo thế giới; thực tiễn là cơ sở, động lực, mục đích của nhận thức và là tiêu chuẩn duy nhất kiểm tra chân lý."
    },
    "3.1": {
        "chapter": 3,
        "title": "3.1. Học thuyết hình thái kinh tế - xã hội",
        "pages": "Trang 284 – 329",
        "desc": "Sản xuất vật chất là cơ sở tồn tại và phát triển của xã hội. Quy luật quan hệ sản xuất phải phù hợp với trình độ phát triển của lực lượng sản xuất; cơ sở hạ tầng quyết định kiến trúc thượng tầng."
    },
    "3.2": {
        "chapter": 3,
        "title": "3.2. Giai cấp và dân tộc",
        "pages": "Trang 329 – 384",
        "desc": "Giai cấp là những tập đoàn người to lớn khác nhau về địa vị trong hệ thống sản xuất xã hội. Đấu tranh giai cấp là động lực phát triển trực tiếp của các xã hội có đối kháng giai cấp."
    },
    "3.3": {
        "chapter": 3,
        "title": "3.3. Nhà nước và cách mạng xã hội",
        "pages": "Trang 384 – 419",
        "desc": "Nhà nước là sản phẩm và biểu hiện của các mâu thuẫn giai cấp không thể điều hòa được. Cách mạng xã hội là đỉnh cao của đấu tranh giai cấp, thay thế chính quyền cũ bằng chính quyền tiến bộ hơn."
    },
    "3.4": {
        "chapter": 3,
        "title": "3.4. Ý thức xã hội",
        "pages": "Trang 419 – 447",
        "desc": "Tồn tại xã hội quyết định ý thức xã hội, nhưng ý thức xã hội có tính độc lập tương đối và tác động trở lại mạnh mẽ đối với tồn tại xã hội."
    },
    "3.5": {
        "chapter": 3,
        "title": "3.5. Triết học về con người",
        "pages": "Trang 447 – 489",
        "desc": "Bản chất con người trong tính hiện thực là tổng hòa các quan hệ xã hội. Quần chúng nhân dân là chủ thể sáng tạo chân chính ra lịch sử, giữ vai trò quyết định trong sự phát triển của xã hội."
    }
}

# Accurate rules per topic
TOPIC_RULES = {
    # Chapter 3
    "3.5": {
        "strong": [
            'tha hóa', 'bản chất con người', 'quần chúng nhân dân', 'lãnh tụ',
            'cá nhân và xã hội', 'quan hệ cá nhân', 'vai trò của quần chúng', 'vai trò lãnh tụ',
            'giải phóng con người', 'thực thể sinh học - xã hội', 'tổng hòa những quan hệ xã hội',
            'con người là thực thể', 'lao động đã sáng tạo ra bản thân con người',
            'vấn đề con người', 'lực lượng sáng tạo ra lịch sử', 'vĩ nhân', 'quần chúng'
        ],
        "keywords": ['con người', 'nhân dân']
    },
    "3.4": {
        "strong": [
            'tồn tại xã hội', 'ý thức xã hội', 'tâm lý xã hội', 'hệ tư tưởng', 'hình thái ý thức',
            'ttxh', 'ytxh', 'tính độc lập tương đối của ý thức xã hội', 'ý thức chính trị',
            'ý thức pháp quyền', 'ý thức đạo đức', 'ý thức thẩm mỹ', 'ý thức tôn giáo',
            'ý thức thông thường', 'ý thức lý luận', 'tính kế thừa của ý thức xã hội',
            'tính độc lập tương đối', 'đời sống tinh thần của xã hội'
        ],
        "keywords": ['ý thức xã hội', 'tồn tại xã hội']
    },
    "3.3": {
        "strong": [
            'nhà nước', 'cách mạng xã hội', 'chính quyền nhà nước', 'chuyên chính vô sản',
            'bạo lực cách mạng', 'kiểu nhà nước', 'hình thức nhà nước', 'chức năng của nhà nước',
            'bản chất của nhà nước', 'thời cơ cách mạng', 'tình thế cách mạng', 'khái quát của cách mạng xã hội',
            'cách mạng xã hội giữa vai trò', 'nhà nước là gì', 'nguồn gốc nhà nước'
        ],
        "keywords": ['nhà nước', 'cách mạng xã hội']
    },
    "3.2": {
        "strong": [
            'giai cấp', 'đấu tranh giai cấp', 'dân tộc', 'nguồn gốc giai cấp', 'kết cấu giai cấp',
            'liên minh giai cấp', 'quan hệ giai cấp', 'bộ tộc', 'bộ lạc', 'đặc trưng của dân tộc',
            'đối kháng giai cấp', 'đỉnh cao của đấu tranh giai cấp', 'đặc trưng của giai cấp',
            'vấn đề giai cấp', 'áp bức bóc lột', 'nền dân chủ công xã'
        ],
        "keywords": ['giai cấp', 'dân tộc']
    },
    "3.1": {
        "strong": [
            'lực lượng sản xuất', 'quan hệ sản xuất', 'cơ sở hạ tầng', 'kiến trúc thượng tầng',
            'hình thái kinh tế - xã hội', 'hình thái kinh tế xã hội', 'sản xuất vật chất',
            'tư liệu sản xuất', 'phương thức sản xuất', 'tư liệu lao động', 'công cụ lao động',
            'đối tượng lao động', 'người lao động', 'llsx', 'qhsx', 'csht', 'kttt',
            'lịch sử - tự nhiên', 'lịch sử tự nhiên', 'quy luật quan hệ sản xuất',
            'sản xuất của cải vật chất', 'sản xuất ra của cải', 'kinh tế chiếm hữu nô lệ',
            'tiền đề xuất phát chủ nghĩa duy vật lịch sử', 'trật tự xã hội mới', 'lượng giá trị',
            'phân công lao động', 'đại phân công lao động', 'tổ chức độc quyền', 'giá cả độc quyền',
            'chủ nghĩa cộng sản chia làm', 'công cuộc đổi mới xã hội chủ nghĩa', 'cạnh tranh kinh tế',
            'ngày lao động của công nhân', 'thời đại kinh tế', 'loại hình sản xuất cơ bản',
            'duy vật lịch sử'
        ],
        "keywords": ['sản xuất', 'kinh tế', 'phương thức sản xuất', 'kết cấu kinh tế']
    },
    # Chapter 2
    "2.3": {
        "strong": [
            'lý luận nhận thức', 'nhận thức cảm tính', 'nhận thức lý tính', 'thực tiễn',
            'cảm giác', 'tri giác', 'biểu tượng', 'khái niệm', 'phán đoán', 'suy lý', 'suy luận',
            'chân lý', 'tiêu chuẩn của chân lý', 'chân lý tuyệt đối', 'chân lý tương đối',
            'nhận thức kinh nghiệm', 'nhận thức lý luận', 'trực quan sinh động', 'tư duy trừu tượng',
            'hoạt động thực tiễn', 'thực nghiệm khoa học', 'tiêu chuẩn chân lý', 'vai trò của thực tiễn',
            'nhận thức là một quá trình', 'nhận thức và thực tiễn'
        ],
        "keywords": ['nhận thức', 'chân lý', 'thực tiễn']
    },
    "2.2": {
        "strong": [
            'mối liên hệ phổ biến', 'nguyên lý về sự phát triển', 'cái riêng', 'cái chung', 'cái đơn nhất',
            'nguyên nhân và kết quả', 'quan hệ nhân quả', 'mối liên hệ nhân quả', 'tất nhiên và ngẫu nhiên',
            'nội dung và hình thức', 'bản chất và hiện tượng', 'khả năng và hiện thực',
            'quy luật lượng - chất', 'quy luật lượng chất', 'lượng và chất', 'chất và lượng',
            'thay đổi về lượng', 'sự thay đổi về lượng', 'độ là', 'điểm nút', 'bước nhảy',
            'quy luật mâu thuẫn', 'mặt đối lập', 'thống nhất và đấu tranh', 'phủ định của phủ định',
            'phủ định biện chứng', 'phủ định siêu hình', 'đường xoáy ốc', 'phép biện chứng duy vật',
            'quan điểm toàn diện', 'quan điểm lịch sử - cụ thể', 'quan điểm phát triển',
            'phát triển là quá trình', 'tính chất của sự phát triển', 'hiện tượng là',
            'nguyên lý là thuật ngữ', 'cái toàn bộ, phong phú hơn', 'góp gió thành bão',
            'quy luật mâu thuẫn', 'mâu thuẫn biện chứng'
        ],
        "keywords": ['phép biện chứng', 'quy luật', 'phạm trù', 'phát triển']
    },
    "2.1": {
        "strong": [
            'định nghĩa vật chất', 'thuộc tính cơ bản của vật chất', 'thực tại khách quan',
            'hình thức vận động', 'vận động của vật chất', 'vận động và đứng im', 'đứng im',
            'không gian và thời gian', 'tính thống nhất vật chất', 'nguồn gốc của ý thức',
            'nguồn gốc tự nhiên của ý thức', 'nguồn gốc xã hội của ý thức', 'bản chất của ý thức',
            'kết cấu của ý thức', 'bộ não người', 'não người', 'phản ánh là', 'hình thức phản ánh',
            'tâm lý động vật', 'mối quan hệ giữa vật chất và ý thức', 'vật chất quyết định ý thức',
            'năng động chủ quan', 'chủ quan duy ý chí', 'phương thức tồn tại của vật chất',
            'vật chất là một phạm trù', 'thế giới vật chất', 'vật chất là gì', 'ý thức là gì',
            'tia phóng xạ', 'tia rơnghen', 'thuyết tương đối', 'khủng hoảng vật lý',
            'vật chất có trước', 'vật chất bao gồm tất cả những thứ', 'cái bàn, cái ghế có phải vật chất',
            'bản nguyên của thế giới', 'tính thống nhất của thế giới', 'vận động không chỉ là',
            'hình thức tồn tại của vật chất', 'tiềm thức', 'vô thức'
        ],
        "keywords": ['vật chất', 'ý thức', 'vận động', 'phản ánh', 'không gian', 'thời gian']
    },
    # Chapter 1
    "1.2": {
        "strong": [
            'sự ra đời của triết học mác', 'ra đời vào khoảng thời gian nào', 'ra đời dựa trên bao nhiêu tiền đề',
            'tiền đề kinh tế', 'tiền đề lý luận', 'tiền đề khoa học tự nhiên', 'triết học cổ điển đức',
            'kinh tế chính trị cổ điển anh', 'chủ nghĩa xã hội không tưởng', 'hêghen', 'phoiobắc',
            'adam smith', 'ricardo', 'xanh-ximông', 'xanh ximông', 'phuriê', 'định luật bảo toàn',
            'thuyết tế bào', 'thuyết tiến hóa', 'đác-uyn', 'darwin', 'giai đoạn lênin',
            'bước ngoặt cách mạng', 'tuyên ngôn của đảng cộng sản', 'luận cương về phoiơbắc',
            'chống đuyrinh', 'biện chứng của tự nhiên', 'chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê phán',
            'bút ký triết học', 'vai trò của triết học mác', 'chức năng của triết học mác',
            'đối tượng của triết học mác', 'học thuyết của các ông', 'nền tảng lý luận của chủ nghĩa mác'
        ],
        "keywords": ['triết học mác - lênin', 'triết học mác', 'c.mác', 'ph.ăngghen', 'v.i.lênin']
    },
    "1.1": {
        "strong": [
            'vấn đề cơ bản của triết học', 'mặt thứ nhất', 'mặt thứ hai', 'thế giới quan',
            'phương pháp luận', 'hạt nhân lý luận', 'chức năng thế giới quan', 'triết học duy vật',
            'chủ nghĩa duy vật chất phác', 'chủ nghĩa duy vật siêu hình', 'chủ nghĩa duy tâm chủ quan',
            'chủ nghĩa duy tâm khách quan', 'thuyết khả tri', 'thuyết bất khả tri', 'nhị nguyên luận',
            'phương pháp siêu hình', 'phương pháp biện chứng', 'nguồn gốc của triết học',
            'nguyên nhân ra đời của triết học', 'đối tượng của triết học', 'khái niệm triết học',
            'thế giới quan huyền thoại', 'thế giới quan tôn giáo', 'thế giới quan triết học',
            'thời kỳ phục hưng', 'ngũ hành', 'âm dương', 'triết học trung quốc', 'triết học ấn độ',
            'nữ tì của thần học', 'đêmôcrít', 'đêmôcrit', 'lơxíp', 'duy vật chất phác',
            'duy tâm', 'khả tri', 'bất khả tri', 'triết học ra đời'
        ],
        "keywords": ['triết học', 'duy vật', 'duy tâm', 'thế giới quan']
    }
}

# Explicit overrides for specific ambiguous questions after expert analysis
EXPLICIT_OVERRIDES = {
    4: "1.2",   # Phát minh vĩ đại của C.Mác tạo nên cách mạng trong triết học
    5: "3.2",   # Sự khác biệt cơ bản giữa các giai cấp
    12: "1.1",  # Một trong những nguyên nhân ra đời của triết học
    16: "1.1",  # Triết học nghiên cứu thế giới như thế nào (đối tượng triết học)
    21: "1.2",  # Chủ nghĩa Mác-Lênin ra đời dựa trên bao nhiêu tiền đề
    23: "2.1",  # Theo Lênin, khách quan là cái đang tồn tại
    49: "3.3",  # Sự ra đời và tồn tại của nhà nước
    52: "3.5",  # Quan điểm của CN Mác-Lênin về con người
    91: "1.2",  # TH Mác ra đời kế thừa trực tiếp từ
    151: "3.1", # Yếu tố cơ bản tạo điều kiện sinh hoạt vật chất
    156: "3.1", # Các loại hình sản xuất cơ bản
    160: "3.1", # Lịch sử tự nhiên của hình thái KT-XH
    162: "3.1", # Mỗi phương thức sản xuất
    180: "1.1", # Thế giới quan là gì
    186: "1.1", # Nội dung mặt thứ nhất vấn đề cơ bản
    229: "3.5", # Con người theo CNDVLS
    250: "1.1", # Triết học cùng với thế giới quan
    265: "1.1", # Vấn đề cơ bản của triết học có hai mặt
    312: "1.1", # Triết học trở thành nữ tì của thần học
    353: "2.1", # Ai tìm ra tia phóng xạ (bối cảnh vật chất của Lênin)
    362: "3.1", # Sản xuất ra của cải vật chất
    365: "1.1", # Vấn đề cơ bản của triết học mặt thứ hai
    369: "2.1", # Tia Rơnghen
    401: "3.1", # Chuyển dịch hình thái kinh tế
    418: "3.1", # Sản xuất của cải vật chất giữ vai trò
    421: "1.1", # Vấn đề cơ bản của Triết học là gì
    434: "1.1", # Thời kỳ Phục hưng
    436: "1.1", # Ngũ hành
    452: "1.1", # Vấn đề cơ bản có hai mặt
    462: "3.1", # Tiền đề xuất phát của CNDVLS
    494: "2.1", # Thuyết tương đối tổng quát (không gian thời gian)
    500: "1.1", # Nữ tì của thần học
    551: "2.2", # Phủ định siêu hình
    587: "2.2"  # Nguyên lý là thuật ngữ
}

def classify_question(q):
    qid = q['id']
    if qid in EXPLICIT_OVERRIDES:
        return EXPLICIT_OVERRIDES[qid]
        
    text = (q['question'] + ' ' + ' '.join(o['text'] for o in q['options']) + ' ' + q.get('answer_raw', '')).lower()
    
    scores = {}
    for tid, rule in TOPIC_RULES.items():
        s = 0
        for pat in rule['strong']:
            if pat in text:
                s += 12
        for kw in rule['keywords']:
            matches = len(re.findall(r'\b' + re.escape(kw) + r'\b', text))
            s += matches * 2
        scores[tid] = s
        
    sorted_s = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_tid, best_val = sorted_s[0]
    if best_val > 0:
        return best_tid
    return "2.1"

# Process all questions
final_questions = []
distribution = Counter()

for q in questions:
    tid = classify_question(q)
    ch = TOPIC_INFO[tid]['chapter']
    t_info = TOPIC_INFO[tid]
    ch_info = CHAPTER_INFO[ch]
    
    distribution[tid] += 1
    
    # Rebuild explanation text
    correct_keys = q.get('correctAnswers', ['A'])
    correct_opts_text = [opt['text'] for opt in q['options'] if opt['id'] in correct_keys]
    correct_summary = '; '.join(correct_opts_text) if correct_opts_text else ""
    
    explanation = f"Đáp án đúng là: {', '.join(correct_keys)} ({correct_summary}). "
    explanation += f"Căn cứ lý luận: Theo Giáo trình Triết học Mác – Lênin (2021), {t_info['title']} ({t_info['pages']}), "
    explanation += t_info['desc']
    
    q_copy = dict(q)
    q_copy['chapter'] = ch
    q_copy['chapterTitle'] = ch_info['title']
    q_copy['topicId'] = tid
    q_copy['topicTitle'] = t_info['title']
    q_copy['pageReference'] = t_info['pages']
    q_copy['textbook'] = "Giáo trình Triết học Mác – Lênin (2021), NXB Chính trị quốc gia Sự thật"
    q_copy['explanation'] = explanation
    
    final_questions.append(q_copy)

# Save to quiz-app/src/data/questions.json
with open('quiz-app/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(final_questions, f, ensure_ascii=False, indent=2)

# Save to mln111_dataset.json
with open('mln111_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(final_questions, f, ensure_ascii=False, indent=2)

print("\nSaved 598 questions successfully!")
print("\nFinal Topic Distribution:")
ch_dist = Counter()
for tid, cnt in sorted(distribution.items()):
    ch = TOPIC_INFO[tid]['chapter']
    ch_dist[ch] += cnt
    print(f"  {tid} - {TOPIC_INFO[tid]['title'][:45]}: {cnt} câu")

print("\nFinal Chapter Distribution:")
for ch, cnt in sorted(ch_dist.items()):
    print(f"  Chương {ch}: {cnt} câu")
