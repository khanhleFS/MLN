const fs = require('fs');

const SUBTOPIC_INFO = {
  '2.1.1': {
    id: '2.1.1',
    chapter: 2,
    topicId: '2.1',
    code: 'SXHH',
    title: '1. Nền sản xuất hàng hóa & Điều kiện ra đời',
    badge: '1. Sản xuất hàng hóa',
    desc: 'Khái niệm, điều kiện ra đời (phân công LĐXH & tách biệt kinh tế), 3 cuộc đại phân công, kinh tế tự nhiên vs hàng hóa'
  },
  '2.1.2': {
    id: '2.1.2',
    chapter: 2,
    topicId: '2.1',
    code: 'HH_THUOCTINH',
    title: '2. Hàng hóa & Hai thuộc tính của hàng hóa',
    badge: '2. Thuộc tính hàng hóa',
    desc: 'Khái niệm hàng hóa, Giá trị sử dụng, Giá trị và Giá trị trao đổi, các loại hàng hóa đặc thù (dịch vụ, đất đai, thương hiệu...)'
  },
  '2.1.3': {
    id: '2.1.3',
    chapter: 2,
    topicId: '2.1',
    code: 'HAIMAT_LAODONG',
    title: '3. Tính hai mặt của lao động sản xuất hàng hóa',
    badge: '3. Lao động cụ thể & Trừu tượng',
    desc: 'Lao động cụ thể (tạo ra GTSD) & Lao động trừu tượng (tạo ra Giá trị), mâu thuẫn giữa lao động tư nhân và lao động xã hội'
  },
  '2.1.4': {
    id: '2.1.4',
    chapter: 2,
    topicId: '2.1',
    code: 'LUONG_GIATRI',
    title: '4. Lượng giá trị hàng hóa & Các nhân tố ảnh hưởng',
    badge: '4. Lượng giá trị & NSLĐ',
    desc: 'Thời gian LĐXH cần thiết, Năng suất lao động vs Cường độ lao động, Lao động giản đơn vs Lao động phức tạp, cấu thành lượng giá trị'
  },
  '2.2.1': {
    id: '2.2.1',
    chapter: 2,
    topicId: '2.2',
    code: 'TIENTE_LAMPHAT',
    title: '5. Tiền tệ, Các hình thái giá trị & Lạm phát',
    badge: '5. Tiền tệ & Lạm phát',
    desc: 'Lịch sử phát triển các hình thái giá trị, bản chất tiền tệ, 5 chức năng của tiền tệ, quy luật lưu thông tiền tệ và lạm phát'
  },
  '2.2.2': {
    id: '2.2.2',
    chapter: 2,
    topicId: '2.2',
    code: 'THITRUONG_KTTT',
    title: '6. Thị trường & Nền kinh tế thị trường',
    badge: '6. Thị trường & KTTT',
    desc: 'Khái niệm thị trường, cơ chế thị trường, phân loại thị trường, đặc điểm, ưu thế và khuyết tật của nền kinh tế thị trường'
  },
  '2.2.3': {
    id: '2.2.3',
    chapter: 2,
    topicId: '2.2',
    code: 'QUYLUAT_THITRUONG',
    title: '7. Các quy luật kinh tế chủ yếu của thị trường',
    badge: '7. Các quy luật thị trường',
    desc: 'Quy luật giá trị (nội dung, yêu cầu, tác động), Quy luật cung - cầu, Quy luật cạnh tranh (nội bộ ngành và giữa các ngành)'
  },
  '2.3.1': {
    id: '2.3.1',
    chapter: 2,
    topicId: '2.3',
    code: 'CHUTHE_THITRUONG',
    title: '8. Các chủ thể chính tham gia thị trường',
    badge: '8. Chủ thể thị trường',
    desc: 'Người sản xuất, Người tiêu dùng, Các chủ thể trung gian, Vai trò kinh tế của Nhà nước'
  }
};

const ORDER_PLAN = {
  // 1. Nền sản xuất hàng hóa & Điều kiện ra đời (21 câu)
  '2.1.1': [
    74, 233, 14, 253, 297, 321, 193, 290, 243, 27, 37, 239, 260, 281, 7, 9, 10, 295, 29, 199, 241
  ],

  // 2. Hàng hóa & Hai thuộc tính của hàng hóa (29 câu)
  '2.1.2': [
    130, 337, 206, 385, 378, 387, 267, 339, 283, 242, 141, 286, 478, 465, 268, 270, 352, 398, 461, 153, 237, 111, 349, 354, 472, 431, 164, 245, 491
  ],

  // 3. Tính hai mặt của lao động sản xuất hàng hóa (10 câu)
  '2.1.3': [
    293, 258, 75, 289, 236, 466, 528, 42, 384, 442
  ],

  // 4. Lượng giá trị hàng hóa & Các nhân tố ảnh hưởng (33 câu)
  '2.1.4': [
    261, 296, 399, 400, 304, 423, 335, 112, 52, 137, 408, 456, 144, 410, 41, 249, 53, 204, 230, 263, 459, 446, 254, 24, 347, 386, 247, 320, 217, 324, 358, 362, 367
  ],

  // 5. Tiền tệ, Các hình thái giá trị & Lạm phát (22 câu)
  '2.2.1': [
    186, 327, 471, 62, 177, 262, 168, 128, 277, 278, 189, 513, 333, 486, 455, 175, 136, 285, 370, 48, 255
  ],

  // 6. Thị trường & Nền kinh tế thị trường (19 câu)
  '2.2.2': [
    433, 417, 492, 197, 438, 450, 26, 519, 56, 11, 368, 25, 188, 460, 498, 118, 150, 151, 106
  ],

  // 7. Các quy luật kinh tế chủ yếu của thị trường (20 câu)
  '2.2.3': [
    275, 483, 429, 209, 210, 54, 79, 443, 445, 303, 389, 250, 86, 422, 453, 40, 345, 341, 139, 202
  ],

  // 8. Các chủ thể chính tham gia thị trường (4 câu)
  '2.3.1': [
    244, 325, 503, 407, 531
  ]
};

// Build question mapping
const idToMeta = {};
let currentLogicalOrder = 1;

Object.keys(ORDER_PLAN).forEach(subId => {
  const meta = SUBTOPIC_INFO[subId];
  ORDER_PLAN[subId].forEach(qid => {
    idToMeta[qid] = {
      subtopicId: subId,
      subtopicTitle: meta.title,
      subtopicBadge: meta.badge,
      logicalOrder: currentLogicalOrder++
    };
  });
});

console.log(`Mapped ${Object.keys(idToMeta).length} questions with logical order`);

function applyToDataset(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;
  
  data.forEach(q => {
    if (q.chapter === 2 && idToMeta[q.id]) {
      const meta = idToMeta[q.id];
      q.subtopicId = meta.subtopicId;
      q.subtopicTitle = meta.subtopicTitle;
      q.subtopicBadge = meta.subtopicBadge;
      q.logicalOrder = meta.logicalOrder;
      updatedCount++;
    } else {
      // For other chapters, default logicalOrder to their id for stable sorting
      q.logicalOrder = q.id;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} questions in ${filePath}`);
}

applyToDataset('quiz-app/src/data/mln122_questions.json');
applyToDataset('mln122_dataset.json');
