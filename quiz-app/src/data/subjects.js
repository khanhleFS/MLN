import mln111Questions from './questions.json';
import mln122Questions from './mln122_questions.json';

export const SUBJECTS = {
  mln111: {
    id: 'mln111',
    code: 'MLN111',
    name: 'Triết học Mác – Lênin',
    shortName: 'Triết học',
    description: 'Ngân hàng 598 câu hỏi trắc nghiệm Triết học Mác – Lênin',
    questionCount: 598,
    textbook: 'Giáo trình Triết học Mác – Lênin (2021), NXB Chính trị quốc gia Sự thật',
    protocol: '// PROTOCOL_MLN111 // COMBAT_INTERFACE',
    badgeTitle: 'Bộ Huy Hiệu Triết Học',
    examTitle: 'THI THỬ TRIẾT HỌC MÁC – LÊNIN (MLN111)',
    examSubtitle: 'PHÒNG THI THỬ TRẮC NGHIỆM MLN111',
    searchPlaceholder: 'Tìm kiếm nội dung câu hỏi, từ khóa triết học...',
    questions: mln111Questions,
    chapters: [
      { id: 'all', title: 'Tất cả 598 câu', short: 'Tất cả' },
      { id: 1, title: 'Chương 1: Khái luận về triết học và TH Mác - Lênin', short: 'Chương 1' },
      { id: 2, title: 'Chương 2: Chủ nghĩa duy vật biện chứng', short: 'Chương 2' },
      { id: 3, title: 'Chương 3: Chủ nghĩa duy vật lịch sử', short: 'Chương 3' },
    ],
    topics: [
      { id: 'all', chapter: 'all', title: 'Tất cả đề mục' },
      { id: '1.1', chapter: 1, title: '1.1. Triết học & Vấn đề cơ bản của triết học (Trang 11-47)' },
      { id: '1.2', chapter: 1, title: '1.2. Triết học Mác - Lênin và vai trò (Trang 47-116)' },
      { id: '2.1', chapter: 2, title: '2.1. Vật chất và ý thức (Trang 117-182)' },
      { id: '2.2', chapter: 2, title: '2.2. Phép biện chứng duy vật (Trang 182-257)' },
      { id: '2.3', chapter: 2, title: '2.3. Lý luận nhận thức duy vật biện chứng (Trang 257-283)' },
      { id: '3.1', chapter: 3, title: '3.1. Học thuyết hình thái KT - XH (Trang 284-329)' },
      { id: '3.2', chapter: 3, title: '3.2. Giai cấp và dân tộc (Trang 329-384)' },
      { id: '3.3', chapter: 3, title: '3.3. Nhà nước và cách mạng xã hội (Trang 384-419)' },
      { id: '3.4', chapter: 3, title: '3.4. Ý thức xã hội (Trang 419-447)' },
      { id: '3.5', chapter: 3, title: '3.5. Triết học về con người (Trang 447-489)' },
    ],
    levelTitles: [
      'Tập sự Biện chứng',
      'Người tìm Chân lý',
      'Học giả Duy vật',
      'Chiến sĩ Thực tiễn',
      'Bậc thầy Nhận thức',
      'Nhà tư tưởng Hình thái',
      'Lý luận gia Cốt cán',
      'Đại Triết gia Thượng thừa'
    ]
  },
  mln122: {
    id: 'mln122',
    code: 'MLN122',
    name: 'Kinh tế chính trị Mác – Lênin',
    shortName: 'Kinh tế chính trị',
    description: 'Ngân hàng 540 câu hỏi trắc nghiệm Kinh tế chính trị Mác – Lênin',
    questionCount: 540,
    textbook: 'Giáo trình Kinh tế chính trị Mác – Lênin (2021), NXB Chính trị quốc gia Sự thật',
    protocol: '// PROTOCOL_MLN122 // COMBAT_INTERFACE',
    badgeTitle: 'Bộ Huy Hiệu Kinh Tế Chính Trị',
    examTitle: 'THI THỬ KINH TẾ CHÍNH TRỊ MÁC – LÊNIN (MLN122)',
    examSubtitle: 'PHÒNG THI THỬ TRẮC NGHIỆM MLN122',
    searchPlaceholder: 'Tìm kiếm nội dung câu hỏi, từ khóa kinh tế chính trị...',
    questions: mln122Questions,
    chapters: [
      { id: 'all', title: 'Tất cả 540 câu', short: 'Tất cả' },
      { id: 1, title: 'Chương 1: Đối tượng, PP nghiên cứu & Chức năng của KTCT', short: 'Chương 1' },
      { id: 2, title: 'Chương 2: Hàng hóa, thị trường & Vai trò các chủ thể', short: 'Chương 2' },
      { id: 3, title: 'Chương 3: Giá trị thặng dư trong nền kinh tế thị trường', short: 'Chương 3' },
      { id: 4, title: 'Chương 4: Cạnh tranh và độc quyền trong nền KTTT', short: 'Chương 4' },
      { id: 5, title: 'Chương 5: KTTT định hướng XHCN & Quan hệ lợi ích kinh tế', short: 'Chương 5' },
      { id: 6, title: 'Chương 6: CNH, HĐH và hội nhập kinh tế quốc tế', short: 'Chương 6' },
    ],
    topics: [
      { id: 'all', chapter: 'all', title: 'Tất cả đề mục' },
      { id: '1.1', chapter: 1, title: '1.1. Khái quát hình thành & phát triển KTCT (Trang 9-18)' },
      { id: '1.2', chapter: 1, title: '1.2. Đối tượng, mục đích & phương pháp nghiên cứu (Trang 19-29)' },
      { id: '1.3', chapter: 1, title: '1.3. Chức năng của kinh tế chính trị (Trang 29-37)' },
      { id: '2.1', chapter: 2, title: '2.1. Hàng hóa và hai thuộc tính của hàng hóa (Trang 38-65)' },
      { id: '2.2', chapter: 2, title: '2.2. Tiền tệ, thị trường & các quy luật thị trường (Trang 65-86)' },
      { id: '2.3', chapter: 2, title: '2.3. Vai trò các chủ thể chính tham gia thị trường (Trang 86-98)' },
      { id: '3.1', chapter: 3, title: '3.1. Nguồn gốc, bản chất & sản xuất giá trị thặng dư (Trang 99-132)' },
      { id: '3.2', chapter: 3, title: '3.2. Tích lũy, tuần hoàn & chu chuyển tư bản (Trang 132-148)' },
      { id: '3.3', chapter: 3, title: '3.3. Các hình thức biểu hiện của m: p, z, địa tô (Trang 148-166)' },
      { id: '4.1', chapter: 4, title: '4.1. Cạnh tranh và các hình thức độc quyền (Trang 167-188)' },
      { id: '4.2', chapter: 4, title: '4.2. Độc quyền nhà nước & vai trò của CNTB (Trang 188-209)' },
      { id: '5.1', chapter: 5, title: '5.1. KTTT định hướng XHCN & thể chế kinh tế (Trang 210-238)' },
      { id: '5.2', chapter: 5, title: '5.2. Các quan hệ lợi ích kinh tế ở Việt Nam (Trang 238-256)' },
      { id: '6.1', chapter: 6, title: '6.1. Cách mạng công nghiệp & CNH-HĐH ở Việt Nam (Trang 257-280)' },
      { id: '6.2', chapter: 6, title: '6.2. Hội nhập kinh tế quốc tế của Việt Nam (Trang 280-300)' },
    ],
    levelTitles: [
      'Tập sự Kinh tế',
      'Người tìm Giá trị',
      'Học giả Thặng dư',
      'Nhà phân tích Thị trường',
      'Chuyên gia Thể chế',
      'Lý luận gia Độc quyền',
      'Nhà kinh tế Cốt cán',
      'Đại Kinh tế gia Thượng thừa'
    ]
  }
};

export const DEFAULT_SUBJECT_ID = 'mln122';

