import docx
import re
import sys
import json
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

# Load raw questions from mln111_dataset.json or mln111_598_cau_hoan_chinh.docx
with open('mln111_dataset.json', 'r', encoding='utf-8') as f:
    raw_questions = json.load(f)

print(f"Loaded {len(raw_questions)} questions from mln111_dataset.json")

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
        "pages": "Trang 11 – 47"
    },
    "1.2": {
        "chapter": 1,
        "title": "1.2. Triết học Mác - Lênin và vai trò trong đời sống xã hội",
        "pages": "Trang 47 – 116"
    },
    "2.1": {
        "chapter": 2,
        "title": "2.1. Vật chất và ý thức",
        "pages": "Trang 117 – 182"
    },
    "2.2": {
        "chapter": 2,
        "title": "2.2. Phép biện chứng duy vật",
        "pages": "Trang 182 – 257"
    },
    "2.3": {
        "chapter": 2,
        "title": "2.3. Lý luận nhận thức duy vật biện chứng",
        "pages": "Trang 257 – 283"
    },
    "3.1": {
        "chapter": 3,
        "title": "3.1. Học thuyết hình thái kinh tế - xã hội",
        "pages": "Trang 284 – 329"
    },
    "3.2": {
        "chapter": 3,
        "title": "3.2. Giai cấp và dân tộc",
        "pages": "Trang 329 – 384"
    },
    "3.3": {
        "chapter": 3,
        "title": "3.3. Nhà nước và cách mạng xã hội",
        "pages": "Trang 384 – 419"
    },
    "3.4": {
        "chapter": 3,
        "title": "3.4. Ý thức xã hội",
        "pages": "Trang 419 – 447"
    },
    "3.5": {
        "chapter": 3,
        "title": "3.5. Triết học về con người",
        "pages": "Trang 447 – 489"
    }
}

# Score-based classification with prioritized patterns and exclusions
TOPIC_RULES = {
    "3.5": {
        "strong": [
            'tha hóa', 'con người là', 'bản chất con người', 'quần chúng nhân dân', 'lãnh tụ',
            'cá nhân và xã hội', 'quan hệ cá nhân', 'vai trò của quần chúng', 'vai trò lãnh tụ',
            'giải phóng con người', 'thực thể sinh học - xã hội', 'tổng hòa những quan hệ xã hội'
        ],
        "keywords": ['con người', 'nhân dân', 'cá nhân', 'vĩ nhân']
    },
    "3.4": {
        "strong": [
            'tồn tại xã hội', 'ý thức xã hội', 'tâm lý xã hội', 'hệ tư tưởng', 'hình thái ý thức',
            'ttxh', 'ytxh', 'tính độc lập tương đối của ý thức xã hội', 'ý thức chính trị',
            'ý thức pháp quyền', 'ý thức đạo đức', 'ý thức thẩm mỹ', 'ý thức tôn giáo',
            'ý thức thông thường', 'ý thức lý luận', 'lạc hậu hơn', 'vượt trước'
        ],
        "keywords": ['ý thức cá nhân', 'đời sống tinh thần của xã hội']
    },
    "3.3": {
        "strong": [
            'nhà nước', 'cách mạng xã hội', 'chính quyền nhà nước', 'chuyên chính vô sản',
            'bạo lực cách mạng', 'kiểu nhà nước', 'hình thức nhà nước', 'chức năng của nhà nước',
            'bản chất của nhà nước', 'thời cơ cách mạng', 'tình thế cách mạng'
        ],
        "keywords": ['chính quyền', 'cách mạng']
    },
    "3.2": {
        "strong": [
            'giai cấp', 'đấu tranh giai cấp', 'dân tộc', 'nguồn gốc giai cấp', 'kết cấu giai cấp',
            'liên minh giai cấp', 'quan hệ giai cấp', 'bộ tộc', 'bộ lạc', 'đặc trưng của dân tộc',
            'đối kháng giai cấp', 'đỉnh cao của đấu tranh giai cấp'
        ],
        "keywords": ['áp bức', 'bóc lột', 'vô sản và tư sản']
    },
    "3.1": {
        "strong": [
            'lực lượng sản xuất', 'quan hệ sản xuất', 'cơ sở hạ tầng', 'kiến trúc thượng tầng',
            'hình thái kinh tế - xã hội', 'hình thái kinh tế xã hội', 'sản xuất vật chất',
            'tư liệu sản xuất', 'phương thức sản xuất', 'tư liệu lao động', 'công cụ lao động',
            'đối tượng lao động', 'người lao động', 'llsx', 'qhsx', 'csht', 'kttt',
            'lịch sử - tự nhiên', 'lịch sử tự nhiên', 'quy luật quan hệ sản xuất',
            'sản xuất của cải vật chất', 'kinh tế chiếm hữu nô lệ', 'tiền đề xuất phát của chủ nghĩa duy vật lịch sử'
        ],
        "keywords": ['sản xuất', 'kinh tế - xã hội', 'kết cấu kinh tế']
    },
    "2.3": {
        "strong": [
            'lý luận nhận thức', 'nhận thức cảm tính', 'nhận thức lý tính', 'thực tiễn',
            'cảm giác', 'tri giác', 'biểu tượng', 'khái niệm', 'phán đoán', 'suy lý', 'suy luận',
            'chân lý', 'tiêu chuẩn của chân lý', 'chân lý tuyệt đối', 'chân lý tương đối',
            'nhận thức kinh nghiệm', 'nhận thức lý luận', 'trực quan sinh động', 'tư duy trừu tượng',
            'hoạt động thực tiễn', 'thực nghiệm khoa học'
        ],
        "keywords": ['nhận thức', 'hiểu biết', 'kinh nghiệm']
    },
    "2.2": {
        "strong": [
            'mối liên hệ phổ biến', 'nguyên lý về sự phát triển', 'cái riêng', 'cái chung', 'cái đơn nhất',
            'nguyên nhân và kết quả', 'quan hệ nhân quả', 'tất nhiên và ngẫu nhiên', 'tất nhiên', 'ngẫu nhiên',
            'nội dung và hình thức', 'bản chất và hiện tượng', 'khả năng và hiện thực', 'hiện thực',
            'quy luật lượng - chất', 'lượng và chất', 'quy luật chuyển hóa từ những thay đổi về lượng',
            'độ là', 'điểm nút', 'bước nhảy', 'quy luật mâu thuẫn', 'mặt đối lập',
            'thống nhất và đấu tranh', 'thống nhất của các mặt đối lập', 'đấu tranh của các mặt đối lập',
            'phủ định của phủ định', 'phủ định biện chứng', 'đường xoáy ốc', 'phép biện chứng duy vật',
            'quan điểm toàn diện', 'quan điểm lịch sử - cụ thể', 'quan điểm phát triển'
        ],
        "keywords": ['phạm trù', 'quy luật cơ bản của phép biện chứng']
    },
    "2.1": {
        "strong": [
            'định nghĩa vật chất', 'thuộc tính cơ bản của vật chất', 'thực tại khách quan',
            'hình thức vận động', 'vận động của vật chất', 'vận động và đứng im', 'đứng im',
            'không gian và thời gian', 'tính thống nhất vật chất', 'nguồn gốc của ý thức',
            'nguồn gốc tự nhiên của ý thức', 'nguồn gốc xã hội của ý thức', 'bản chất của ý thức',
            'kết cấu của ý thức', 'bộ não người', 'phản ánh là', 'hình thức phản ánh',
            'tâm lý động vật', 'mối quan hệ giữa vật chất và ý thức', 'vật chất quyết định ý thức',
            'năng động chủ quan', 'chủ quan duy ý chí', 'phương thức tồn tại của vật chất',
            'vật chất là một phạm trù', 'thế giới vật chất', 'vận động là', 'không gian là', 'thời gian là'
        ],
        "keywords": ['vật chất', 'ý thức', 'vận động', 'phản ánh']
    },
    "1.2": {
        "strong": [
            'sự ra đời của triết học mác', 'tiền đề kinh tế', 'tiền đề lý luận', 'tiền đề khoa học tự nhiên',
            'triết học cổ điển đức', 'kinh tế chính trị cổ điển anh', 'chủ nghĩa xã hội không tưởng',
            'hêghen', 'phoiobắc', 'phoierbac', 'adam smith', 'ricardo', 'xanh ximông', 'phuriê',
            'định luật bảo toàn', 'thuyết tế bào', 'thuyết tiến hóa', 'đác-uyn', 'darwin',
            'giai đoạn lênin', 'bước ngoặt cách mạng', 'tuyên ngôn của đảng cộng sản',
            'luận cương về phoiơbắc', 'chống đuyrinh', 'biện chứng của tự nhiên',
            'chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê phán', 'bút ký triết học',
            'vai trò của triết học mác', 'chức năng của triết học mác', 'đối tượng của triết học mác'
        ],
        "keywords": ['c.mác', 'ph.ăngghen', 'v.i.lênin', 'mác - lênin']
    },
    "1.1": {
        "strong": [
            'vấn đề cơ bản của triết học', 'mặt thứ nhất của vấn đề cơ bản', 'mặt thứ hai của vấn đề cơ bản',
            'thế giới quan', 'phương pháp luận', 'hạt nhân lý luận', 'chức năng thế giới quan',
            'triết học duy vật', 'chủ nghĩa duy vật chất phác', 'chủ nghĩa duy vật siêu hình',
            'chủ nghĩa duy tâm chủ quan', 'chủ nghĩa duy tâm khách quan', 'thuyết khả tri',
            'thuyết bất khả tri', 'nhị nguyên luận', 'phương pháp siêu hình', 'phương pháp biện chứng',
            'nguồn gốc của triết học', 'đối tượng của triết học', 'khái niệm triết học',
            'thế giới quan huyền thoại', 'thế giới quan tôn giáo', 'thế giới quan triết học'
        ],
        "keywords": ['triết học', 'duy vật', 'duy tâm', 'khả tri']
    }
}

def classify(q):
    text = (q['question'] + ' ' + ' '.join(o['text'] for o in q['options']) + ' ' + q.get('answer_raw', '')).lower()
    
    # Check strong patterns with scoring
    scores = {}
    for tid, rule in TOPIC_RULES.items():
        s = 0
        for pat in rule['strong']:
            if pat in text:
                s += 10 # high weight for exact concept match
        for kw in rule['keywords']:
            # Word boundary check for short keywords
            matches = len(re.findall(r'\b' + re.escape(kw) + r'\b', text))
            s += matches * 2
        scores[tid] = s

    # Sort topics by score
    sorted_topics = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_tid, best_score = sorted_topics[0]
    
    if best_score > 0:
        return best_tid
    return "2.1" # default

# Run test on all questions
new_distribution = Counter()
for q in raw_questions:
    t = classify(q)
    new_distribution[t] += 1

print("\nReclassified Distribution:")
ch_dist = Counter()
for tid, cnt in sorted(new_distribution.items()):
    ch = TOPIC_INFO[tid]['chapter']
    ch_dist[ch] += cnt
    print(f"  Topic {tid} ({TOPIC_INFO[tid]['title'][:40]}...): {cnt} questions")

print("\nChapter totals:")
for ch, cnt in sorted(ch_dist.items()):
    print(f"  Chương {ch}: {cnt} questions")
