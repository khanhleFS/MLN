const fs = require('fs');

const SUBTOPIC_INFO = {
  // Chapter 2 Subtopics
  '2.1.1': {
    id: '2.1.1',
    chapter: 2,
    topicId: '2.1',
    code: 'SXHH',
    title: '1. Nền sản xuất hàng hóa & Điều kiện ra đời',
    badge: '1. Sản xuất hàng hóa'
  },
  '2.1.2': {
    id: '2.1.2',
    chapter: 2,
    topicId: '2.1',
    code: 'HH_THUOCTINH',
    title: '2. Hàng hóa & Hai thuộc tính của hàng hóa',
    badge: '2. Thuộc tính hàng hóa'
  },
  '2.1.3': {
    id: '2.1.3',
    chapter: 2,
    topicId: '2.1',
    code: 'HAIMAT_LAODONG',
    title: '3. Tính hai mặt của lao động sản xuất hàng hóa',
    badge: '3. Lao động cụ thể & Trừu tượng'
  },
  '2.1.4': {
    id: '2.1.4',
    chapter: 2,
    topicId: '2.1',
    code: 'LUONG_GIATRI',
    title: '4. Lượng giá trị hàng hóa & Các nhân tố ảnh hưởng',
    badge: '4. Lượng giá trị & NSLĐ'
  },
  '2.2.1': {
    id: '2.2.1',
    chapter: 2,
    topicId: '2.2',
    code: 'TIENTE_LAMPHAT',
    title: '5. Tiền tệ, Các hình thái giá trị & Lạm phát',
    badge: '5. Tiền tệ & Lạm phát'
  },
  '2.2.2': {
    id: '2.2.2',
    chapter: 2,
    topicId: '2.2',
    code: 'THITRUONG_KTTT',
    title: '6. Thị trường & Nền kinh tế thị trường',
    badge: '6. Thị trường & KTTT'
  },
  '2.2.3': {
    id: '2.2.3',
    chapter: 2,
    topicId: '2.2',
    code: 'QUYLUAT_KINHTE',
    title: '7. Các quy luật kinh tế của thị trường',
    badge: '7. Quy luật thị trường'
  },
  '2.3.1': {
    id: '2.3.1',
    chapter: 2,
    topicId: '2.3',
    code: 'CHUTHE_THITRUONG',
    title: '8. Vai trò của các chủ thể tham gia thị trường',
    badge: '8. Chủ thể thị trường'
  },

  // Chapter 3 Subtopics
  '3.1.1': {
    id: '3.1.1',
    chapter: 3,
    topicId: '3.1',
    code: 'TIEN_SLD',
    title: '1. Chuyển hóa tiền thành tư bản & Hàng hóa sức lao động',
    badge: '1. Tiền & Hàng hóa SLĐ'
  },
  '3.1.2': {
    id: '3.1.2',
    chapter: 3,
    topicId: '3.1',
    code: 'SX_M_C_V',
    title: '2. Sản xuất giá trị thặng dư, Tư bản bất biến (c) & Khả biến (v)',
    badge: '2. Sản xuất m & Tư bản c, v'
  },
  '3.1.3': {
    id: '3.1.3',
    chapter: 3,
    topicId: '3.1',
    code: 'TYSUAT_PP_TIENCONG',
    title: '3. Tỷ suất, Khối lượng m, Hai phương pháp sản xuất m & Tiền công',
    badge: '3. Tỷ suất m & Tiền công'
  },
  '3.2.1': {
    id: '3.2.1',
    chapter: 3,
    topicId: '3.2',
    code: 'TICHLUY_CAUTAO',
    title: '4. Tích lũy tư bản & Cấu tạo hữu cơ của tư bản (c/v)',
    badge: '4. Tích lũy tư bản & c/v'
  },
  '3.2.2': {
    id: '3.2.2',
    chapter: 3,
    topicId: '3.2',
    code: 'TUANHOAN_CHUCHUYEN',
    title: '5. Tuần hoàn tư bản, Chu chuyển tư bản (Cố định & Lưu động)',
    badge: '5. Tuần hoàn & Chu chuyển tư bản'
  },
  '3.2.3': {
    id: '3.2.3',
    chapter: 3,
    topicId: '3.2',
    code: 'TAISANXUAT_KHUNGHOANG',
    title: '6. Tái sản xuất tư bản xã hội & Khủng hoảng kinh tế',
    badge: '6. Tái sản xuất & Khủng hoảng'
  },
  '3.3.1': {
    id: '3.3.1',
    chapter: 3,
    topicId: '3.3',
    code: 'CHIPHI_LOINHUAN',
    title: '7. Chi phí sản xuất (k), Lợi nhuận (p), Tỷ suất lợi nhuận & Lợi nhuận bình quân',
    badge: '7. Chi phí k, Lợi nhuận p'
  },
  '3.3.2': {
    id: '3.3.2',
    chapter: 3,
    topicId: '3.3',
    code: 'LOITUC_DIATO',
    title: '8. Lợi nhuận thương nghiệp, Tư bản cho vay, Lợi tức & Địa tô TBCN',
    badge: '8. Lợi tức & Địa tô TBCN'
  }
};

const CH3_ORDER_PLAN = {
  '3.1.1': [
    // 1. Ra đời CNTB & Bản chất tư bản
    163, 215, 291, 307, 251, 4, 223, 259,
    // 2. Công thức chung & Mâu thuẫn công thức chung
    184, 448, 298, 132, 221, 256, 355,
    // 3. Điều kiện sức lao động thành hàng hóa
    47, 302, 485, 437, 538,
    // 4. Hai thuộc tính hàng hóa sức lao động (Giá trị & GTSD đặc biệt)
    240, 377, 392, 412, 452, 218, 334, 266
  ],
  '3.1.2': [
    // 1. Quá trình sản xuất TBCN
    495, 60, 350, 284, 474, 66,
    // 2. Nguồn gốc giá trị thặng dư
    179, 390, 133,
    // 3. Căn cứ chia c & v, vai trò từng bộ phận
    264, 388, 234,
    // 4. Tư bản bất biến (c)
    265, 444, 480,
    // 5. Tư bản khả biến (v)
    30, 434
  ],
  '3.1.3': [
    // 1. Quy luật kinh tế tuyệt đối
    364,
    // 2. Tỷ suất m' & Khối lượng M
    314, 391, 109, 514, 131, 192, 299, 338,
    // 3. Hai phương pháp sản xuất m & m siêu ngạch
    357, 190, 96, 500, 84, 97, 540, 306,
    // 4. Bài tập tính toán W, c, v, m
    426, 80, 83,
    // 5. Bản chất và hình thức tiền công
    374, 421, 102, 228, 229, 235, 232, 33
  ],
  '3.2.1': [
    // 1. Bản chất và nguồn gốc tích lũy tư bản
    195, 288, 181, 328, 208,
    // 2. Cấu tạo tư bản (Kỹ thuật, Giá trị, Hữu cơ c/v)
    435, 89, 152, 313, 507,
    // 3. Hệ quả tích lũy (Tích tụ/Tập trung, Thất nghiệp, Bần cùng hóa)
    305, 34, 365, 120
  ],
  '3.2.2': [
    // 1. Tuần hoàn tư bản (3 giai đoạn, 3 hình thái)
    231, 330, 170, 171, 172, 449,
    // 2. Chu chuyển tư bản (Thời gian & Tốc độ chu chuyển)
    49, 376, 539, 416, 155, 315,
    // 3. Tư bản cố định và Tư bản lưu động
    173, 252, 292, 317, 393, 403, 271
  ],
  '3.2.3': [
    // 1. Tái sản xuất tư bản xã hội
    432, 409, 415, 200, 282, 5,
    // 2. Khủng hoảng kinh tế trong CNTB
    31, 418, 326, 294
  ],
  '3.3.1': [
    // 1. Chi phí sản xuất TBCN (k)
    214, 248, 353, 287, 207, 301,
    // 2. Lợi nhuận (p)
    351, 526, 65, 375, 203, 55,
    // 3. Tỷ suất lợi nhuận (p')
    185, 318, 366, 419,
    // 4. Cạnh tranh & Lợi nhuận bình quân
    430, 517, 227, 473
  ],
  '3.3.2': [
    // 1. Tư bản thương nghiệp & Lợi nhuận thương nghiệp
    499,
    // 2. Tư bản cho vay, Lợi tức & Thị trường tài chính
    401, 414, 411, 397, 226, 312, 346, 361, 191,
    // 3. Địa tô TBCN (Chênh lệch I, II, Tuyệt đối & Giá cả ruộng đất)
    436, 224, 308, 323, 8, 6, 87, 77
  ]
};

// Map of QID -> meta for Chapter 3
const ch3IdToMeta = {};
let currentLogicalOrder = 1;

Object.keys(CH3_ORDER_PLAN).forEach(subId => {
  const meta = SUBTOPIC_INFO[subId];
  CH3_ORDER_PLAN[subId].forEach(qid => {
    ch3IdToMeta[qid] = {
      subtopicId: subId,
      subtopicTitle: meta.title,
      subtopicBadge: meta.badge,
      logicalOrder: currentLogicalOrder++
    };
  });
});

console.log(`Mapped ${Object.keys(ch3IdToMeta).length} Chapter 3 questions (logicalOrder: 1 to ${currentLogicalOrder - 1})`);

function updateDataset(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCh3Count = 0;

  data.forEach(q => {
    if (q.chapter === 3 && ch3IdToMeta[q.id]) {
      const meta = ch3IdToMeta[q.id];
      q.subtopicId = meta.subtopicId;
      q.subtopicTitle = meta.subtopicTitle;
      q.subtopicBadge = meta.subtopicBadge;
      q.logicalOrder = meta.logicalOrder;
      updatedCh3Count++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updatedCh3Count} Chapter 3 questions in ${filePath}`);
}

updateDataset('quiz-app/src/data/mln122_questions.json');
updateDataset('mln122_dataset.json');
