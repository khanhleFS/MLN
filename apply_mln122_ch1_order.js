const fs = require('fs');

const SUBTOPIC_INFO = {
  '1.1.1': {
    id: '1.1.1',
    chapter: 1,
    topicId: '1.1',
    topicTitle: '1.1. Khái quát sự hình thành và phát triển của kinh tế chính trị Mác - Lênin',
    pageReference: 'Trang 9 – 18',
    code: 'THUATNGU_TRONGTHUONG_NONG',
    title: '1. Sự ra đời thuật ngữ KTCT, Chủ nghĩa trọng thương & Chủ nghĩa trọng nông',
    badge: '1. Trọng thương & Trọng nông',
    desc: 'Thuật ngữ kinh tế chính trị (1615), Chủ nghĩa trọng thương (lưu thông) và Chủ nghĩa trọng nông (sản xuất)'
  },
  '1.1.2': {
    id: '1.1.2',
    chapter: 1,
    topicId: '1.1',
    topicTitle: '1.1. Khái quát sự hình thành và phát triển của kinh tế chính trị Mác - Lênin',
    pageReference: 'Trang 9 – 18',
    code: 'CODIENANH_KTCT_MAC',
    title: '2. Kinh tế chính trị cổ điển Anh & Sự ra đời, phát triển KTCT Mác - Lênin',
    badge: '2. Cổ điển Anh & KTCT Mác',
    desc: 'William Petty, Adam Smith, David Ricardo, sự kế thừa và phát triển của C. Mác - Ph. Ăngghen (bộ Tư bản)'
  },
  '1.2.1': {
    id: '1.2.1',
    chapter: 1,
    topicId: '1.2',
    topicTitle: '1.2. Đối tượng, mục đích và phương pháp nghiên cứu của kinh tế chính trị Mác - Lênin',
    pageReference: 'Trang 19 – 29',
    code: 'DOITUONG_NGHIENCUU',
    title: '3. Đối tượng nghiên cứu của KTCT Mác - Lênin (QHSX, LLSX & Tái sản xuất)',
    badge: '3. Đối tượng nghiên cứu',
    desc: 'Quan hệ xã hội của sản xuất và trao đổi trong 4 khâu tái sản xuất, LLSX, sở hữu và các phương thức sản xuất'
  },
  '1.2.2': {
    id: '1.2.2',
    chapter: 1,
    topicId: '1.2',
    topicTitle: '1.2. Đối tượng, mục đích và phương pháp nghiên cứu của kinh tế chính trị Mác - Lênin',
    pageReference: 'Trang 19 – 29',
    code: 'MUCDICH_QUYLUAT_PHUONGPHAP',
    title: '4. Mục đích nghiên cứu, Quy luật kinh tế, Chính sách kinh tế & Phương pháp',
    badge: '4. Quy luật & Phương pháp',
    desc: 'Mục đích thúc đẩy giàu có và văn minh, quan hệ lợi ích, quy luật kinh tế khách quan và phương pháp trừu tượng hóa khoa học'
  },
  '1.3.1': {
    id: '1.3.1',
    chapter: 1,
    topicId: '1.3',
    topicTitle: '1.3. Chức năng của kinh tế chính trị Mác - Lênin',
    pageReference: 'Trang 29 – 37',
    code: 'CHUCNANG_KTCT',
    title: '5. Bốn chức năng cơ bản của Kinh tế chính trị Mác - Lênin',
    badge: '5. Chức năng của KTCT',
    desc: 'Chức năng nhận thức, chức năng thực tiễn, chức năng tư tưởng và chức năng phương pháp luận'
  }
};

const CH1_ORDER_PLAN = {
  '1.1.1': [103, 59, 70, 319, 340],
  '1.1.2': [76, 129, 57, 497, 101, 493, 322, 116, 17, 182, 36, 88, 516],
  '1.2.1': [124, 140, 481, 125, 530, 272, 276, 201, 527, 406, 238],
  '1.2.2': [533, 274, 329, 482, 508, 369, 269, 162, 257, 50],
  '1.3.1': [22, 535, 126, 316]
};

const ch1IdToMeta = {};
let currentLogicalOrder = 1;

Object.keys(CH1_ORDER_PLAN).forEach(subId => {
  const meta = SUBTOPIC_INFO[subId];
  CH1_ORDER_PLAN[subId].forEach(qid => {
    ch1IdToMeta[qid] = {
      topicId: meta.topicId,
      topicTitle: meta.topicTitle,
      pageReference: meta.pageReference,
      subtopicId: subId,
      subtopicTitle: meta.title,
      subtopicBadge: meta.badge,
      logicalOrder: currentLogicalOrder++
    };
  });
});

console.log(`Mapped ${Object.keys(ch1IdToMeta).length} MLN122 Chapter 1 questions (logicalOrder: 1 to ${currentLogicalOrder - 1})`);

function updateDataset(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCh1Count = 0;

  data.forEach(q => {
    if (q.chapter === 1 && ch1IdToMeta[q.id]) {
      const meta = ch1IdToMeta[q.id];
      q.topicId = meta.topicId;
      q.topicTitle = meta.topicTitle;
      q.pageReference = meta.pageReference;
      q.subtopicId = meta.subtopicId;
      q.subtopicTitle = meta.subtopicTitle;
      q.subtopicBadge = meta.subtopicBadge;
      q.logicalOrder = meta.logicalOrder;
      updatedCh1Count++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updatedCh1Count} Chapter 1 questions in ${filePath}`);
}

updateDataset('quiz-app/src/data/mln122_questions.json');
updateDataset('mln122_dataset.json');
