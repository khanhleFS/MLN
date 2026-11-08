import docx
import re
import json
from collections import Counter

doc = docx.Document('MLN122_540.docx')
lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

blocks = []
current = []
for line in lines:
    if re.match(r'^Câu\s+\d+[:.]', line, re.IGNORECASE):
        if current:
            blocks.append(current)
        current = [line]
    else:
        if current:
            current.append(line)
if current:
    blocks.append(current)

CHAPTER_INFO = {
    1: {
        "title": "Chương 1: Đối tượng, phương pháp nghiên cứu và chức năng của kinh tế chính trị Mác - Lênin",
        "short": "Chương 1",
        "pages": "Trang 9 – 37"
    },
    2: {
        "title": "Chương 2: Hàng hóa, thị trường và vai trò của các chủ thể tham gia thị trường",
        "short": "Chương 2",
        "pages": "Trang 38 – 98"
    },
    3: {
        "title": "Chương 3: Giá trị thặng dư trong nền kinh tế thị trường",
        "short": "Chương 3",
        "pages": "Trang 99 – 166"
    },
    4: {
        "title": "Chương 4: Cạnh tranh và độc quyền trong nền kinh tế thị trường",
        "short": "Chương 4",
        "pages": "Trang 167 – 209"
    },
    5: {
        "title": "Chương 5: Kinh tế thị trường định hướng XHCN và các quan hệ lợi ích kinh tế ở Việt Nam",
        "short": "Chương 5",
        "pages": "Trang 210 – 256"
    },
    6: {
        "title": "Chương 6: Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc tế của Việt Nam",
        "short": "Chương 6",
        "pages": "Trang 257 – 300"
    }
}

TOPIC_INFO = {
    "1.1": {
        "chapter": 1,
        "title": "1.1. Khái quát sự hình thành và phát triển của KTCT Mác - Lênin",
        "pages": "Trang 9 – 18",
        "desc": "Kinh tế chính trị ra đời từ thế kỷ XVII, phát triển qua chủ nghĩa trọng thương, chủ nghĩa trọng nông, kinh tế chính trị tư sản cổ điển Anh và đạt tới đỉnh cao khoa học trong học thuyết kinh tế của C. Mác và V.I. Lênin."
    },
    "1.2": {
        "chapter": 1,
        "title": "1.2. Đối tượng, mục đích và phương pháp nghiên cứu của KTCT Mác - Lênin",
        "pages": "Trang 19 – 29",
        "desc": "Đối tượng nghiên cứu là các quan hệ xã hội của sản xuất và trao đổi trong sự liên hệ biện chứng với lực lượng sản xuất và kiến trúc thượng tầng. Phương pháp nghiên cứu cơ bản là trừu tượng hóa khoa học."
    },
    "1.3": {
        "chapter": 1,
        "title": "1.3. Chức năng của kinh tế chính trị Mác - Lênin",
        "pages": "Trang 29 – 37",
        "desc": "Kinh tế chính trị Mác - Lênin có 4 chức năng cốt lõi: chức năng nhận thức, chức năng thực tiễn, chức năng tư tưởng và chức năng phương pháp luận."
    },
    "2.1": {
        "chapter": 2,
        "title": "2.1. Lý luận của C. Mác về sản xuất hàng hóa và hàng hóa",
        "pages": "Trang 38 – 65",
        "desc": "Hàng hóa là sản phẩm của lao động, có hai thuộc tính: giá trị sử dụng và giá trị. Tính chất hai mặt của lao động sản xuất hàng hóa gồm lao động cụ thể và lao động trừu tượng; lượng giá trị chịu ảnh hưởng của năng suất và cường độ lao động."
    },
    "2.2": {
        "chapter": 2,
        "title": "2.2. Tiền tệ, thị trường và các quy luật kinh tế của thị trường",
        "pages": "Trang 65 – 86",
        "desc": "Nguồn gốc, bản chất và 5 chức năng của tiền tệ. Các quy luật kinh tế chủ yếu của thị trường gồm: quy luật giá trị, quy luật cung - cầu, quy luật lưu thông tiền tệ và quy luật cạnh tranh."
    },
    "2.3": {
        "chapter": 2,
        "title": "2.3. Vai trò của các chủ thể chính tham gia thị trường",
        "pages": "Trang 86 – 98",
        "desc": "Các chủ thể chính tham gia thị trường bao gồm người sản xuất, người tiêu dùng, các chủ thể trung gian và nhà nước trong việc quản lý, định hướng và điều tiết nền kinh tế."
    },
    "3.1": {
        "chapter": 3,
        "title": "3.1. Nguồn gốc, bản chất và các phương pháp sản xuất giá trị thặng dư",
        "pages": "Trang 99 – 132",
        "desc": "Công thức chung của tư bản T - H - T'; hàng hóa sức lao động; tư bản bất biến (c) và tư bản khả biến (v); hai phương pháp sản xuất giá trị thặng dư tuyệt đối và tương đối; giá trị thặng dư siêu ngạch và tiền công."
    },
    "3.2": {
        "chapter": 3,
        "title": "3.2. Tích lũy tư bản, tuần hoàn và chu chuyển của tư bản",
        "pages": "Trang 132 – 148",
        "desc": "Bản chất tích lũy tư bản là biến một phần giá trị thặng dư thành tư bản; cấu tạo hữu cơ (c/v); tuần hoàn tư bản qua 3 giai đoạn; chu chuyển tư bản, thời gian chu chuyển, tư bản cố định và tư bản lưu động, tái sản xuất xã hội."
    },
    "3.3": {
        "chapter": 3,
        "title": "3.3. Các hình thức biểu hiện của giá trị thặng dư (Lợi nhuận, lợi tức, địa tô)",
        "pages": "Trang 148 – 166",
        "desc": "Chi phí sản xuất tư bản chủ nghĩa (k), lợi nhuận (p), tỷ suất lợi nhuận (p'), lợi nhuận bình quân, giá cả sản xuất, lợi tức, địa tô tư bản chủ nghĩa (địa tô chênh lệch I, II và địa tô tuyệt đối)."
    },
    "4.1": {
        "chapter": 4,
        "title": "4.1. Cạnh tranh và độc quyền trong nền kinh tế thị trường",
        "pages": "Trang 167 – 188",
        "desc": "Tập trung sản xuất và các tổ chức độc quyền (Cartel, Syndicate, Trust, Consortium); tư bản tài chính và tài phiệt; xuất khẩu tư bản; sự phân chia thế giới giữa các tập đoàn độc quyền và các cường quốc tư bản."
    },
    "4.2": {
        "chapter": 4,
        "title": "4.2. Độc quyền nhà nước và vai trò lịch sử của CNTB",
        "pages": "Trang 188 – 209",
        "desc": "Bản chất, nguyên nhân và các biểu hiện mới của độc quyền nhà nước trong CNTB; sự kết hợp về nhân sự và sở hữu nhà nước; vai trò tích cực và những giới hạn lịch sử của chủ nghĩa tư bản."
    },
    "5.1": {
        "chapter": 5,
        "title": "5.1. Kinh tế thị trường định hướng XHCN và thể chế kinh tế ở Việt Nam",
        "pages": "Trang 210 – 238",
        "desc": "Tính tất yếu khách quan, bản chất, mục tiêu và đặc trưng của KTTT định hướng XHCN ở Việt Nam; hoàn thiện thể chế kinh tế thị trường định hướng XHCN về sở hữu, các thành phần kinh tế và các loại thị trường."
    },
    "5.2": {
        "chapter": 5,
        "title": "5.2. Các quan hệ lợi ích kinh tế ở Việt Nam",
        "pages": "Trang 238 – 256",
        "desc": "Khái niệm, bản chất của lợi ích kinh tế; quan hệ lợi ích giữa người lao động và người sử dụng lao động, giữa cá nhân - tập thể - xã hội; vai trò của nhà nước trong việc bảo đảm hài hòa các lợi ích kinh tế."
    },
    "6.1": {
        "chapter": 6,
        "title": "6.1. Cách mạng công nghiệp và CNH, HĐH ở Việt Nam",
        "pages": "Trang 257 – 280",
        "desc": "Lịch sử các cuộc cách mạng công nghiệp (lần 1 đến lần 4); tính tất yếu khách quan, nội dung và các tiêu chí thực hiện công nghiệp hóa, hiện đại hóa ở Việt Nam trong bối cảnh cuộc CMCN 4.0 và kinh tế tri thức."
    },
    "6.2": {
        "chapter": 6,
        "title": "6.2. Hội nhập kinh tế quốc tế của Việt Nam",
        "pages": "Trang 280 – 300",
        "desc": "Tính tất yếu khách quan, nội dung, hình thức và tác động của hội nhập kinh tế quốc tế (WTO, ASEAN, FTA...); phương hướng và giải pháp nâng cao hiệu quả hội nhập kinh tế quốc tế của Việt Nam."
    }
}

TOPIC_RULES = {
    "6.2": [
        'hội nhập kinh tế', 'hội nhập quốc tế', 'asean', 'wto', 'apec', 'tpp', 'cptpp', 'fta', 'asem',
        'thương mại quốc tế', 'tổ chức thương mại thế giới', 'hiệp định thương mại',
        'chuyển giao công nghệ từ nước ngoài', 'thu hút fdi', 'đầu tư trực tiếp nước ngoài',
        'toàn cầu hóa kinh tế', 'toàn cầu hoá kinh tế', 'kinh tế đối ngoại', 'hợp tác và phát triển kinh tế',
        'oecd', 'kinh tế tự chủ', 'đa dạng hóa thị trường'
    ],
    "6.1": [
        'cách mạng công nghiệp', 'công nghiệp hóa', 'công nghiệp hoá', 'hiện đại hóa', 'hiện đại hoá',
        'kinh tế tri thức', 'công nghệ sinh học', 'dữ liệu lớn', 'big data', 'vạn vật kết nối', 'iot',
        'trí tuệ nhân tạo', 'in 3d', 'động cơ hơi nước', 'james watt', 'khung dệt', 'con thoi',
        'cmcn', 'cmcn 4.0', 'công nghiệp 4.0', 'công nghệ số', 'chuyển đổi số', 'năng lượng tái tạo',
        'máy kéo sợi', 'máy phát điện', 'dây chuyền sản xuất hàng loạt', 'henry ford', 'nics', 'nước công nghiệp mới'
    ],
    "5.2": [
        'lợi ích kinh tế', 'quan hệ lợi ích', 'lợi ích xã hội', 'lợi ích cá nhân', 'lợi ích tập thể',
        'điều hòa lợi ích', 'xung đột lợi ích', 'hài hòa các lợi ích', 'mâu thuẫn lợi ích',
        'những quan hệ kinh tế của một xã hội nhất định được biểu hiện', 'xét về bản chất, thì lợi ích kinh tế'
    ],
    "5.1": [
        'định hướng xã hội chủ nghĩa', 'định hướng xhcn', 'kinh tế thị trường định hướng',
        'thể chế kinh tế', 'hoàn thiện thể chế', 'thành phần kinh tế', 'kinh tế nhà nước',
        'kinh tế tư nhân', 'kinh tế có vốn đầu tư nước ngoài', 'kinh tế tập thể',
        'dân giàu, nước mạnh', 'đảng cộng sản việt nam', 'bản chất nền kinh tế thị trường định hướng',
        'sở hữu toàn dân', 'sở hữu nhà nước ở việt nam', 'thời kỳ quá độ', 'thể chế được phân loại',
        'tư duy của đảng', 'dân là gốc', 'công bằng trong phân phối', 'sở hữu chịu sự quy định',
        'sở hữu hiện thực', 'thể chế chính trị', 'thể chế được hiểu là'
    ],
    "4.2": [
        'độc quyền nhà nước', 'chủ nghĩa tư bản độc quyền nhà nước', 'sở hữu nhà nước trong cntb',
        'cơ chế nhân sự', 'kết hợp nhân sự', 'vai trò của chủ nghĩa tư bản', 'giới hạn của chủ nghĩa tư bản',
        'giới hạn phát triển của chủ nghĩa tư bản', 'vai trò tích cực của chủ nghĩa tư bản',
        'vai trò lịch sử của chủ nghĩa tư bản', 'hạn chế của chủ nghĩa tư bản', 'biểu hiện mới của độc quyền nhà nước',
        'điều tiết kinh tế của nhà nước tư sản', 'can thiệp của nhà nước tư sản', 'sở hữu nhà nước trong các ngành then chốt',
        'giới hạn lịch sử'
    ],
    "4.1": [
        'độc quyền', 'tổ chức độc quyền', 'cartel', 'syndicate', 'trust', 'consortium',
        'tư bản tài chính', 'tài phiệt', 'đầu sỏ tài chính', 'chế độ tham dự', 'chế độ ủy nhiệm',
        'xuất khẩu tư bản', 'liên minh độc quyền', 'phân chia thị trường thế giới',
        'phân chia lãnh thổ', 'giá cả độc quyền', 'lợi nhuận độc quyền', 'cạnh tranh giữa các tổ chức độc quyền',
        'cạnh tranh nội bộ ngành độc quyền', 'cạnh tranh ngoài độc quyền', 'liên kết các doanh nghiệp theo cùng một ngành',
        'thực dân mới', 'chính sách thực dân', 'lệ thuộc mới'
    ],
    "3.3": [
        'lợi nhuận', 'chi phí sản xuất tư bản', 'chi phí sản xuất tbcnh', 'tỷ suất lợi nhuận',
        'lợi nhuận bình quân', 'giá cả sản xuất', 'lợi tức', 'tư bản cho vay', 'cổ phần',
        'cổ phiếu', 'trái phiếu', 'thị trường chứng khoán', 'địa tô', 'địa tô chênh lệch',
        'địa tô tuyệt đối', 'thâm canh', 'độ màu mỡ', 'lợi nhuận thương nghiệp', 'tư bản thương nghiệp',
        'mục đích của cạnh tranh giữa các ngành'
    ],
    "3.2": [
        'tích lũy tư bản', 'tích tụ tư bản', 'tập trung tư bản', 'cấu tạo hữu cơ', 'cấu tạo kỹ thuật',
        'cấu tạo giá trị', 'tuần hoàn của tư bản', 'tuần hoàn tư bản', 'chu chuyển của tư bản',
        'chu chuyển tư bản', 'thời gian chu chuyển', 'tốc độ chu chuyển', 'tư bản cố định',
        'tư bản lưu động', 'hao mòn hữu hình', 'hao mòn vô hình', 'tái sản xuất tư bản',
        'tái sản xuất giản đơn', 'tái sản xuất mở rộng', 'hai khu vực', 'kvi', 'kvii', 'khủng hoảng thừa',
        'khủng hoảng kinh tế', 'tái sản xuất cá biệt', 'tái sản xuất là', 'khủng hoảng thửa', 'khủng hoàng kinh tế'
    ],
    "3.1": [
        'giá trị thặng dư', 'thặng dư tuyệt đối', 'thặng dư tương đối', 'thặng dư siêu ngạch',
        'công thức chung của tư bản', 'hàng hóa sức lao động', 'sức lao động', 'tư bản bất biến',
        'tư bản khả biến', 'tỷ suất giá trị thặng dư', 'khối lượng giá trị thặng dư', 'ngày lao động',
        'thời gian lao động tất yếu', 'thời gian lao động thặng dư', 'tiền công', 'tiền lương',
        'bóc lột', 'trình độ bốc lột', 'm\'', 'c + v + m', 'chi phí thực tế',
        'chủ nghĩa tư bản ra đời', 'phương thức sản xuất tư bản chủ nghĩa hình thành và thay thế'
    ],
    "2.3": [
        'chủ thể tham gia thị trường', 'người sản xuất', 'người tiêu dùng', 'chủ thể trung gian',
        'vai trò của nhà nước trong kinh tế thị trường', 'chủ thể kinh tế', 'thương nhân',
        'doanh nghiệp vừa và nhỏ', 'đặc điểm chung của mọi nền kinh tế thị trường về vai trò của nhà nước'
    ],
    "2.2": [
        'tiền tệ', 'nguồn gốc của tiền', 'bản chất của tiền', 'chức năng của tiền', 'thước đo giá trị',
        'phương tiện lưu thông', 'phương tiện cất trữ', 'phương tiện thanh toán', 'tiền tệ thế giới',
        'quy luật giá trị', 'quy luật cung cầu', 'quy luật cung - cầu', 'quy luật lưu thông tiền tệ',
        'quy luật cạnh tranh', 'cơ chế thị trường', 'bàn tay vô hình', 'lạm phát', 'giá cả thị trường',
        'quan hệ giữa giá trị và giá cả', 'khuyết tật của kinh tế thị trường', 'ưu thế của kinh tế thị trường',
        'kinh tế thị trường đã hình thành', 'kinh tế thị trường đã có mầm mống', 'kinh tế thị trường xuất hiện lần đầu tiên',
        'giá cả của thị trường còn phụ thuộc', 'giá cả của thị trưởng còn phụ thuộc', 'quan hệ cung cầu',
        'loại tiền nào có chức năng cất trữ', 'thị trường được hiểu như thế nào', 'thị trường có vai trò gì',
        'giá trị danh nghĩa (sức mua) vượt xa giá trị thực', 'thị trưởng được hiểu'
    ],
    "2.1": [
        'hàng hóa', 'hàng hoá', 'giá trị sử dụng', 'hai thuộc tính của hàng hóa', 'thuộc tính của hàng hóa',
        'lao động cụ thể', 'lao động trừu tượng', 'tính chất hai mặt', 'lượng giá trị',
        'thời gian lao động xã hội cần thiết', 'năng suất lao động', 'cường độ lao động',
        'lao động giản đơn', 'lao động phức tạp', 'điều kiện ra đời sản xuất hàng hóa',
        'sản xuất hàng hóa', 'sản xuất tự cung tự cấp', 'kinh tế tự nhiên', 'vật ngang giá',
        'phân công lao động xã hội lần thứ', 'sự tách biệt về mặt kinh tế giữa các chủ thể',
        'lao động sản xuất có vai trò gì', 'mức độ giàu có của xã hội', 'hai hàng hóa trao đổi',
        'hai hàng hoa trao đổi'
    ],
    "1.3": [
        'chức năng của kinh tế chính trị', 'chức năng nhận thức', 'chức năng thực tiễn',
        'chức năng tư tưởng', 'chức năng phương pháp luận', 'kinh tế chính trị gồm có những chức năng nào'
    ],
    "1.2": [
        'đối tượng nghiên cứu của kinh tế chính trị', 'đối tượng của kinh tế chính trị',
        'đối tượng nghiên cứu của kinh tế- chính trị', 'trừu tượng hóa khoa học',
        'phương pháp nghiên cứu của kinh tế chính trị', 'mục đích nghiên cứu của kinh tế chính trị',
        'mục đích xuyên suốt của kinh tế chính trị', 'quy luật kinh tế',
        'các phương thức sản xuất nối tiếp nhau', 'lực lượng sản xuất bao gồm các yếu tố nào',
        'tư liệu lao động gồm có', 'quy luật quan hệ sản xuất phải phù hợp'
    ],
    "1.1": [
        'sự hình thành và phát triển của kinh tế chính trị', 'chủ nghĩa trọng thương',
        'chủ nghĩa trọng nông', 'kinh tế chính trị tư sản cổ điển', 'kinh tế chính trị cổ điển anh',
        'antoine montchrestien', 'william petty', 'adam smith', 'david ricardo', 'k.marx', 'c. mác',
        'thuật ngữ "kinh tế chính trị"', 'thuật ngữ kinh tế chính trị',
        'môn kinh tế chính trị mác - lênin là môn khoa học có tính chất gì',
        'theo a. smith kinh tế chính trị là một ngành khoa học'
    ]
}

def classify_weighted(b):
    q_line = b[0].lower()
    ans_lines = [l for l in b if re.match(r'^(→\s*)?(Đáp án|ĐÁP ÁN)\s*[:.]', l, re.IGNORECASE)]
    ans_line = ans_lines[0].lower() if ans_lines else ''
    other_lines = ' '.join([l.lower() for l in b if l != b[0] and l != ans_line])
    
    scores = {}
    for topic, keywords in TOPIC_RULES.items():
        score = 0
        for kw in keywords:
            if kw in q_line:
                score += len(kw) * 5
            if kw in ans_line:
                score += len(kw) * 3
            if kw in other_lines:
                score += len(kw) * 1
        scores[topic] = score
        
    best_topic = max(scores, key=scores.get)
    if scores[best_topic] == 0:
        return "2.1", 0
    return best_topic, scores[best_topic]

# Process all 540 questions
questions_dataset = []

for idx, b in enumerate(blocks):
    qid = idx + 1
    first_line = b[0]
    m_q = re.match(r'^Câu\s+(\d+)\s*[:.]\s*(.*)', first_line, re.IGNORECASE)
    raw_q_text = m_q.group(2).strip()
    
    extra_notes = []
    # Clean Q33 typo specifically
    if qid == 33 and raw_q_text.startswith('2. Phân công'):
        clean_q_text = 'Tiền công thực tế là'
        extra_notes.append("Ghi chú: 4 nguyên nhân hình thành độc quyền nhà nước gồm tích tụ vốn lớn, phân công lao động xã hội, mâu thuẫn giai cấp, xu hướng quốc tế hóa và cạnh tranh quốc tế.")
    else:
        clean_q_text = raw_q_text
        
    # Options
    options = []
    opt_lines = [l for l in b if re.match(r'^[A-H]\.', l)]
    for ol in opt_lines:
        m_opt = re.match(r'^([A-H])\.\s*(.*)', ol)
        if m_opt:
            options.append({
                'id': m_opt.group(1),
                'text': m_opt.group(2).strip()
            })
            
    # Answers
    ans_lines = [l for l in b if re.match(r'^(→\s*)?(Đáp án|ĐÁP ÁN)\s*[:.]', l, re.IGNORECASE)]
    ans_clean = re.sub(r'^(→\s*)?(Đáp án|ĐÁP ÁN)\s*[:.]\s*', '', ans_lines[0], flags=re.IGNORECASE).strip()
    parts = [p.strip() for p in ans_clean.split('|')]
    correct_answers = []
    for p in parts:
        m_p = re.match(r'^([A-H])\.', p)
        if m_p:
            correct_answers.append(m_p.group(1))
        else:
            m_p2 = re.match(r'^([A-H])$', p)
            if m_p2:
                correct_answers.append(m_p2.group(1))
                
    # Classify
    topic_id, _ = classify_weighted(b)
    ch = TOPIC_INFO[topic_id]['chapter']
    t_info = TOPIC_INFO[topic_id]
    ch_info = CHAPTER_INFO[ch]
    
    # Build explanation
    correct_texts = [opt['text'] for opt in options if opt['id'] in correct_answers]
    if len(correct_answers) > 1:
        ans_str = ", ".join(correct_answers)
        summary_str = " | ".join(correct_texts)
        explanation = f"Các đáp án đúng là: {ans_str} ({summary_str}). Căn cứ lý luận: Theo Giáo trình Kinh tế chính trị Mác – Lênin (2021), {t_info['title']} ({t_info['pages']}), {t_info['desc']}"
    else:
        ans_str = correct_answers[0] if correct_answers else "A"
        summary_str = correct_texts[0] if correct_texts else ""
        explanation = f"Đáp án đúng là: {ans_str} ({summary_str}). Căn cứ lý luận: Theo Giáo trình Kinh tế chính trị Mác – Lênin (2021), {t_info['title']} ({t_info['pages']}), {t_info['desc']}"
        
    q_data = {
        'id': qid,
        'question': clean_q_text,
        'options': options,
        'correctAnswers': correct_answers,
        'chapter': ch,
        'chapterTitle': ch_info['title'],
        'topicId': topic_id,
        'topicTitle': t_info['title'],
        'pageReference': t_info['pages'],
        'textbook': "Giáo trình Kinh tế chính trị Mác – Lênin (2021), NXB Chính trị quốc gia Sự thật",
        'explanation': explanation,
        'extraNotes': extra_notes
    }
    questions_dataset.append(q_data)

# Save to mln122_dataset.json in root
with open('mln122_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(questions_dataset, f, ensure_ascii=False, indent=2)

# Save to quiz-app/src/data/mln122_questions.json
with open('quiz-app/src/data/mln122_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions_dataset, f, ensure_ascii=False, indent=2)

# Also ensure mln111_questions.json exists in quiz-app/src/data/
with open('quiz-app/src/data/questions.json', 'r', encoding='utf-8') as f:
    mln111_data = json.load(f)
with open('quiz-app/src/data/mln111_questions.json', 'w', encoding='utf-8') as f:
    json.dump(mln111_data, f, ensure_ascii=False, indent=2)

print(f"Generated mln122_dataset.json with {len(questions_dataset)} questions successfully!")
print(f"Created quiz-app/src/data/mln122_questions.json")
print(f"Created quiz-app/src/data/mln111_questions.json")

