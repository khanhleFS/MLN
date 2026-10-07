import re
import json
import sys
from parse_questions import questions

sys.stdout.reconfigure(encoding='utf-8')

# Definition of topics and chapters based on the Excel file
# Chapter 1: Khái luận về triết học và triết học Mác-Lênin (pp. 11-116)
# 1.1: Khái lược về triết học, vấn đề cơ bản của triết học, biện chứng và siêu hình
# 1.2: Triết học Mác - Lênin, điều kiện ra đời, thời kỳ phát triển, đối tượng chức năng vai trò

# Chapter 2: Chủ nghĩa duy vật biện chứng (pp. 117-283)
# 2.1: Vật chất và ý thức (vật chất, vận động, không gian thời gian, nguồn gốc ý thức, bản chất ý thức, mqh vật chất - ý thức)
# 2.2: Phép biện chứng duy vật (2 nguyên lý: liên hệ phổ biến, phát triển; 6 cặp phạm trù: riêng-chung, nn-kq, tt-nn, nd-ht, bc-ht, kn-ht; 3 quy luật: lượng-chất, mâu thuẫn, phủ định của phủ định)
# 2.3: Lý luận nhận thức (thực tiễn, nhận thức cảm tính - lý tính, chân lý)

# Chapter 3: Chủ nghĩa duy vật lịch sử (pp. 284-489)
# 3.1: Hình thái KT-XH (sản xuất vật chất, LLSX & QHSX, CSHT & KTTT, phát triển lịch sử - tự nhiên)
# 3.2: Giai cấp và dân tộc (giai cấp, đấu tranh giai cấp, dân tộc, quan hệ giai cấp - dân tộc - nhân loại)
# 3.3: Nhà nước và cách mạng xã hội (nguồn gốc bản chất nhà nước, cách mạng xã hội)
# 3.4: Ý thức xã hội (tồn tại xã hội, ý thức xã hội, tính độc lập tương đối của YTXH)
# 3.5: Triết học về con người (bản chất con người, tha hóa, quan hệ cá nhân - xã hội, quần chúng nhân dân & lãnh tụ)

def classify_question(q):
    text = (q['question'] + ' ' + ' '.join(opt['text'] for opt in q['options']) + ' ' + q['answer_raw']).lower()
    
    # Check Chapter 3 features
    c3_keywords = [
        'lực lượng sản xuất', 'quan hệ sản xuất', 'cơ sở hạ tầng', 'kiến trúc thượng tầng',
        'hình thái kinh tế - xã hội', 'hình thái kinh tế xã hội', 'sản xuất vật chất', 'tư liệu sản xuất',
        'giai cấp', 'đấu tranh giai cấp', 'dân tộc', 'nhà nước', 'cách mạng xã hội',
        'tồn tại xã hội', 'ý thức xã hội', 'tâm lý xã hội', 'hệ tư tưởng',
        'con người và bản chất con người', 'tha hóa', 'quần chúng nhân dân', 'lãnh tụ',
        'cá nhân và xã hội', 'quy luật quan hệ sản xuất', 'llsx', 'qhsx', 'csht', 'kttt'
    ]
    
    # Check Chapter 2 features
    c2_keywords = [
        'vật chất', 'ý thức', 'vận động', 'đứng im', 'không gian', 'thời gian',
        'phản ánh', 'bộ não', 'tâm lý động vật', 'nguồn gốc của ý thức',
        'nguyên lý về mối liên hệ phổ biến', 'nguyên lý về sự phát triển', 'mối liên hệ phổ biến',
        'cái riêng', 'cái chung', 'cái đơn nhất', 'nguyên nhân', 'kết quả',
        'tất nhiên', 'ngẫu nhiên', 'nội dung', 'hình thức', 'bản chất', 'hiện tượng',
        'khả năng', 'hiện thực', 'chất', 'lượng', 'độ', 'điểm nút', 'bước nhảy',
        'mặt đối lập', 'mâu thuẫn', 'thống nhất và đấu tranh',
        'phủ định của phủ định', 'phủ định biện chứng',
        'lý luận nhận thức', 'thực tiễn', 'nhận thức cảm tính', 'nhận thức lý tính',
        'cảm giác', 'tri giác', 'biểu tượng', 'khái niệm', 'phán đoán', 'suy lý',
        'chân lý', 'kinh nghiệm', 'lý luận'
    ]
    
    # Check Chapter 1 features
    c1_keywords = [
        'vấn đề cơ bản của triết học', 'thế giới quan', 'phương pháp luận',
        'duy vật', 'duy tâm', 'khả tri', 'bất khả tri', 'nhị nguyên',
        'biện chứng và siêu hình', 'phương pháp siêu hình', 'phương pháp biện chứng',
        'sự ra đời của triết học mác', 'tiền đề kinh tế', 'tiền đề lý luận', 'tiền đề khoa học tự nhiên',
        'điều kiện lịch sử', 'c.mác', 'ph.ăngghen', 'v.i.lênin', 'hêghen', 'phoiobắc',
        'chức năng của triết học', 'đối tượng của triết học', 'triết học mác - lênin'
    ]
    
    # Score each chapter
    c1_score = sum(text.count(kw) for kw in c1_keywords)
    c2_score = sum(text.count(kw) for kw in c2_keywords)
    c3_score = sum(text.count(kw) for kw in c3_keywords)
    
    # Specific priority checks
    # E.g. If contains 'giai cấp' or 'sản xuất' or 'quần chúng' -> strongly C3
    if any(k in text for k in ['quan hệ sản xuất', 'lực lượng sản xuất', 'cơ sở hạ tầng', 'kiến trúc thượng tầng', 'giai cấp', 'nhà nước', 'cách mạng xã hội', 'tồn tại xã hội', 'ý thức xã hội', 'quần chúng nhân dân', 'hình thái kinh tế']):
        return 3
    if any(k in text for k in ['chất và lượng', 'điểm nút', 'bước nhảy', 'cặp phạm trù', 'cái riêng', 'cái chung', 'mâu thuẫn', 'phủ định của phủ định', 'vật chất là một phạm trù', 'nguồn gốc của ý thức', 'thực tiễn là', 'nhận thức cảm tính', 'chân lý']):
        return 2
    if any(k in text for k in ['vấn đề cơ bản của triết học', 'mặt thứ nhất', 'mặt thứ hai', 'thế giới quan', 'tiền đề lý luận', 'điều kiện kinh tế - xã hội cho sự ra đời']):
        return 1
        
    scores = [(c1_score, 1), (c2_score, 2), (c3_score, 3)]
    scores.sort(reverse=True)
    if scores[0][0] > 0:
        return scores[0][1]
    return 2 # default to Ch2 if neutral

stats = {1: 0, 2: 0, 3: 0}
classified = []
for q in questions:
    ch = classify_question(q)
    stats[ch] += 1
    classified.append((q['id'], ch, q['question']))

print(f"Initial classification distribution: {stats}")
