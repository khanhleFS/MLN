const fs = require('fs');

const SUBTOPIC_INFO = {
  // Chapter 4 Subtopics
  '4.1.1': {
    id: '4.1.1',
    chapter: 4,
    topicId: '4.1',
    code: 'RA_DOI_DOC_QUYEN',
    title: '1. Nguyên nhân hình thành độc quyền & Tác động đối với nền kinh tế',
    badge: '1. Ra đời & Tác động độc quyền',
    desc: 'Khái niệm độc quyền, 5 đặc điểm của Lênin, cạnh tranh tự do đẻ ra độc quyền, các nguyên nhân dẫn đến độc quyền và 2 mặt tác động'
  },
  '4.1.2': {
    id: '4.1.2',
    chapter: 4,
    topicId: '4.1',
    code: 'LOINHUAN_GIACA_DQ',
    title: '2. Lợi nhuận độc quyền, Giá cả độc quyền & Cạnh tranh trong độc quyền',
    badge: '2. Lợi nhuận & Giá cả độc quyền',
    desc: 'Quy luật lợi nhuận độc quyền cao, nguồn gốc m độc quyền, giá cả độc quyền, quan hệ cạnh tranh và độc quyền'
  },
  '4.1.3': {
    id: '4.1.3',
    chapter: 4,
    topicId: '4.1',
    code: 'HINHTHUC_TOCHUC_DQ',
    title: '3. Các hình thức tổ chức độc quyền từ đơn giản đến hiện đại',
    badge: '3. Hình thức tổ chức độc quyền',
    desc: 'Liên kết ngang & liên kết dọc, các tổ chức cổ điển (Cartel -> Syndicate -> Trust -> Consortium) và biểu hiện mới (Concern, Conglomerate)'
  },
  '4.1.4': {
    id: '4.1.4',
    chapter: 4,
    topicId: '4.1',
    code: 'TUBAN_TAICHINH',
    title: '4. Tư bản tài chính, Đầu sỏ tài chính & Chế độ tham dự',
    badge: '4. Tư bản tài chính',
    desc: 'Sự hợp nhất độc quyền ngân hàng và công nghiệp, các nhà tài phiệt, chế độ tham dự, chế độ ủy nhiệm và các biểu hiện mới'
  },
  '4.1.5': {
    id: '4.1.5',
    chapter: 4,
    topicId: '4.1',
    code: 'XUATKHAU_TUBAN',
    title: '5. Xuất khẩu tư bản và Sự phân chia thế giới (Kinh tế & Lãnh thổ)',
    badge: '5. Xuất khẩu tư bản & Phân chia TG',
    desc: 'Xuất khẩu hàng hóa vs xuất khẩu tư bản, FDI & FPI, xuất khẩu tư bản nhà nước vs tư nhân, phân chia thị trường toàn cầu và phân chia lãnh thổ'
  },
  '4.2.1': {
    id: '4.2.1',
    chapter: 4,
    topicId: '4.2',
    code: 'DOCQUYEN_NHANUOC',
    title: '6. Bản chất, nguyên nhân & Các biểu hiện của Độc quyền nhà nước trong CNTB',
    badge: '6. Độc quyền nhà nước',
    desc: 'Bản chất liên minh độc quyền tư nhân và nhà nước tư sản, 4 nguyên nhân, cơ chế kinh tế, kết hợp nhân sự, sở hữu nhà nước và điều tiết kinh tế'
  },
  '4.2.2': {
    id: '4.2.2',
    chapter: 4,
    topicId: '4.2',
    code: 'VAITRO_LICHSU_CNTB',
    title: '7. Vai trò lịch sử, Hạn chế & Giới hạn phát triển của Chủ nghĩa tư bản',
    badge: '7. Vai trò lịch sử CNTB',
    desc: 'Ba vai trò tích cực thúc đẩy LLSX và xã hội hóa, ba giới hạn lịch sử của CNTB, mâu thuẫn cơ bản giữa LLSX xã hội hóa với QHSX tư nhân TBCN'
  }
};

const CH4_ORDER_PLAN = {
  '4.1.1': [
    // 1. Giai đoạn CNTB & Khái niệm độc quyền
    219, 441, 115, 381, 64,
    // 2. Mối quan hệ tự do cạnh tranh đẻ ra tập trung sản xuất và độc quyền
    220, 331, 159, 476,
    // 3. Các nguyên nhân dẫn đến độc quyền
    343, 525, 246, 420, 506,
    // 4. Hai mặt tác động tích cực & tiêu cực của độc quyền
    157, 462, 532
  ],
  '4.1.2': [
    // 1. Lợi nhuận độc quyền & Quy luật GTTD
    402, 183,
    // 2. Giá cả độc quyền
    100, 12,
    // 3. Cạnh tranh trong điều kiện độc quyền
    15, 413, 470
  ],
  '4.1.3': [
    // 1. Cơ sở và hình thức liên kết
    396, 342, 178,
    // 2. Các hình thức độc quyền kinh điển (Cartel, Syndicate, Trust, Consortium)
    467, 110, 309, 440, 488, 363,
    // 3. Biểu hiện mới của tổ chức độc quyền hiện đại
    424, 458, 505, 93
  ],
  '4.1.4': [
    // 1. Định nghĩa và nguồn gốc tư bản tài chính
    51, 94, 447,
    // 2. Đầu sỏ tài chính & Cơ chế thống trị
    311, 536, 113, 395
  ],
  '4.1.5': [
    // 1. Phân biệt xuất khẩu hàng hóa và xuất khẩu tư bản, bản chất
    180, 167, 198, 154,
    // 2. Hình thức và chủ thể xuất khẩu tư bản (FDI/FPI, Nhà nước/Tư nhân, Biểu hiện mới)
    439, 344, 510, 348,
    // 3. Phân chia thị trường và phân chia lãnh thổ thế giới
    1, 382, 379
  ],
  '4.2.1': [
    // 1. Bản chất và liên minh độc quyền nhà nước
    405, 78, 160, 95, 85, 225,
    // 2. Nguyên nhân và cơ chế kinh tế
    32, 216, 13,
    // 3. Ba biểu hiện chủ yếu & biểu hiện mới
    35, 383, 23, 509
  ],
  '4.2.2': [
    // 1. Vai trò tích cực của CNTB
    161,
    // 2. Hạn chế và giới hạn lịch sử của CNTB
    81, 205, 518,
    // 3. Nguồn gốc sâu xa: Mâu thuẫn cơ bản của CNTB
    211, 487
  ]
};

// Map of QID -> meta for Chapter 4
const ch4IdToMeta = {};
let currentLogicalOrder = 1;

Object.keys(CH4_ORDER_PLAN).forEach(subId => {
  const meta = SUBTOPIC_INFO[subId];
  CH4_ORDER_PLAN[subId].forEach(qid => {
    ch4IdToMeta[qid] = {
      topicId: meta.topicId,
      topicTitle: meta.topicId === '4.1'
        ? '4.1. Cạnh tranh ở cấp độ độc quyền trong nền kinh tế thị trường'
        : '4.2. Độc quyền nhà nước trong chủ nghĩa tư bản & vai trò lịch sử của CNTB',
      pageReference: meta.topicId === '4.1' ? 'Trang 167 – 188' : 'Trang 188 – 209',
      subtopicId: subId,
      subtopicTitle: meta.title,
      subtopicBadge: meta.badge,
      logicalOrder: currentLogicalOrder++
    };
  });
});

console.log(`Mapped ${Object.keys(ch4IdToMeta).length} Chapter 4 questions (logicalOrder: 1 to ${currentLogicalOrder - 1})`);

function updateDataset(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCh4Count = 0;

  data.forEach(q => {
    if (q.chapter === 4 && ch4IdToMeta[q.id]) {
      const meta = ch4IdToMeta[q.id];
      q.topicId = meta.topicId;
      q.topicTitle = meta.topicTitle;
      q.pageReference = meta.pageReference;
      q.subtopicId = meta.subtopicId;
      q.subtopicTitle = meta.subtopicTitle;
      q.subtopicBadge = meta.subtopicBadge;
      q.logicalOrder = meta.logicalOrder;
      updatedCh4Count++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updatedCh4Count} Chapter 4 questions in ${filePath}`);
}

updateDataset('quiz-app/src/data/mln122_questions.json');
updateDataset('mln122_dataset.json');
