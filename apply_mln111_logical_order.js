const fs = require('fs');

const data111 = JSON.parse(fs.readFileSync('quiz-app/src/data/mln111_questions.json', 'utf8'));
const ch1 = data111.filter(q => q.chapter === 1);
const ch2 = data111.filter(q => q.chapter === 2);

console.log('Total MLN111 Ch1:', ch1.length);
console.log('Total MLN111 Ch2:', ch2.length);

const MLN111_CH1_SUBTOPICS = {
  '1.1.1': {
    id: '1.1.1',
    chapter: 1,
    topicId: '1.1',
    title: '1. Nguồn gốc, Khái niệm Triết học & Thế giới quan',
    badge: '1. Triết học & Thế giới quan',
    desc: 'Thời gian ra đời, nguồn gốc nhận thức và nguồn gốc xã hội, khái niệm triết học và thế giới quan'
  },
  '1.1.2': {
    id: '1.1.2',
    chapter: 1,
    topicId: '1.1',
    title: '2. Vấn đề cơ bản của Triết học: Duy vật, Duy tâm, Khả tri & Bất khả tri',
    badge: '2. Vấn đề cơ bản TH',
    desc: 'Hai mặt vấn đề cơ bản của triết học, chủ nghĩa duy vật, chủ nghĩa duy tâm, nhị nguyên luận, khả tri và bất khả tri'
  },
  '1.1.3': {
    id: '1.1.3',
    chapter: 1,
    topicId: '1.1',
    title: '3. Phép biện chứng và Phương pháp siêu hình trong lịch sử',
    badge: '3. Biện chứng & Siêu hình',
    desc: 'Đối lập giữa phương pháp biện chứng và phương pháp siêu hình, các hình thức của phép biện chứng và triết học cổ đại/trung cổ/cận đại'
  },
  '1.2.1': {
    id: '1.2.1',
    chapter: 1,
    topicId: '1.2',
    title: '4. Sự ra đời, Tiền đề & Tác phẩm kinh điển của Triết học Mác - Lênin',
    badge: '4. Sự ra đời TH Mác - Lênin',
    desc: 'Ba tiền đề ra đời (kinh tế-xã hội, lý luận, khoa học tự nhiên), kế thừa Hêghen - Phoiơbắc và tác phẩm kinh điển'
  },
  '1.2.2': {
    id: '1.2.2',
    chapter: 1,
    topicId: '1.2',
    title: '5. Đối tượng, Bản chất & Vai trò của Triết học Mác - Lênin',
    badge: '5. Vai trò TH Mác - Lênin',
    desc: 'Đối tượng, bản chất cách mạng - khoa học và vai trò nền tảng tư tưởng, kim chỉ nam trong thời đại mới'
  }
};

function classifyMLN111Ch1Question(q) {
  const qLower = (q.question + ' ' + (q.options ? q.options.map(o => o.text).join(' ') : '')).toLowerCase();
  if (
    q.topicId === '1.2' ||
    qLower.includes('triết học mác') ||
    qLower.includes('chủ nghĩa mác') ||
    qLower.includes('c.mác') ||
    qLower.includes('ăngghen') ||
    qLower.includes('lênin') ||
    qLower.includes('tuyên ngôn của đảng') ||
    qLower.includes('xanh-ximông') ||
    qLower.includes('không tưởng')
  ) {
    if (
      qLower.includes('tiền đề') ||
      qLower.includes('nguồn gốc lý luận') ||
      qLower.includes('kế thừa trực tiếp') ||
      qLower.includes('phát minh') ||
      qLower.includes('ra đời') ||
      qLower.includes('xanh-ximông') ||
      qLower.includes('không tưởng') ||
      qLower.includes('cổ điển đức') ||
      qLower.includes('người nước nào') ||
      qLower.includes('tác phẩm')
    ) {
      return '1.2.1';
    }
    return '1.2.2';
  }
  if (qLower.includes('siêu hình') || qLower.includes('biện chứng') || qLower.includes('phương pháp luận')) {
    return '1.1.3';
  }
  if (
    qLower.includes('vấn đề cơ bản') ||
    qLower.includes('duy vật') ||
    qLower.includes('duy tâm') ||
    qLower.includes('nhị nguyên') ||
    qLower.includes('khả tri') ||
    qLower.includes('bất khả tri') ||
    qLower.includes('thuyết có thể biết') ||
    qLower.includes('thuyết không thể biết') ||
    qLower.includes('bản thể luận')
  ) {
    return '1.1.2';
  }
  return '1.1.1';
}

const classifiedCh1 = {};
ch1.forEach(q => {
  const sub = classifyMLN111Ch1Question(q);
  if (!classifiedCh1[sub]) classifiedCh1[sub] = [];
  classifiedCh1[sub].push(q);
});

let ch1Order = 1;
const mln111Ch1Meta = {};
const sortedCh1Subkeys = ['1.1.1', '1.1.2', '1.1.3', '1.2.1', '1.2.2'];
sortedCh1Subkeys.forEach(subKey => {
  const list = classifiedCh1[subKey] || [];
  const meta = MLN111_CH1_SUBTOPICS[subKey];
  console.log(`MLN111 [${subKey}] ${meta.title}: ${list.length} questions`);
  list.forEach(q => {
    mln111Ch1Meta[q.id] = {
      topicId: meta.topicId,
      subtopicId: subKey,
      subtopicTitle: meta.title,
      subtopicBadge: meta.badge,
      logicalOrder: ch1Order++
    };
  });
});

const MLN111_SUBTOPICS = {
  '2.1.1': {
    id: '2.1.1',
    chapter: 2,
    topicId: '2.1',
    title: '1. Vật chất và các phương thức tồn tại của vật chất',
    badge: '1. Vật chất & Vận động',
    desc: 'Định nghĩa vật chất của Lênin, Vận động và 5 hình thức vận động, Không gian, Thời gian, Tính thống nhất vật chất của thế giới'
  },
  '2.1.2': {
    id: '2.1.2',
    chapter: 2,
    topicId: '2.1',
    title: '2. Nguồn gốc, bản chất và kết cấu của Ý thức',
    badge: '2. Nguồn gốc & Bản chất Ý thức',
    desc: 'Nguồn gốc tự nhiên & nguồn gốc xã hội, bộ óc người và thế giới khách quan, lao động và ngôn ngữ, bản chất phản ánh sáng tạo'
  },
  '2.1.3': {
    id: '2.1.3',
    chapter: 2,
    topicId: '2.1',
    title: '3. Mối quan hệ biện chứng giữa Vật chất và Ý thức',
    badge: '3. Quan hệ Vật chất - Ý thức',
    desc: 'Vai trò quyết định của vật chất, tính độc lập tương đối và vai trò tác động trở lại của ý thức, chống chủ quan duy ý chí'
  },
  '2.2.1': {
    id: '2.2.1',
    chapter: 2,
    topicId: '2.2',
    title: '4. Hai nguyên lý cơ bản của phép biện chứng duy vật',
    badge: '4. Hai nguyên lý PBCDV',
    desc: 'Nguyên lý về mối liên hệ phổ biến (quan điểm toàn diện, lịch sử cụ thể), Nguyên lý về sự phát triển (quan điểm phát triển)'
  },
  '2.2.2': {
    id: '2.2.2',
    chapter: 2,
    topicId: '2.2',
    title: '5. Sáu cặp phạm trù cơ bản của phép biện chứng',
    badge: '5. Sáu cặp phạm trù',
    desc: 'Cái riêng - Cái chung, Nguyên nhân - Kết quả, Tất nhiên - Ngẫu nhiên, Nội dung - Hình thức, Bản chất - Hiện tượng, Khả năng - Hiện thực'
  },
  '2.2.3': {
    id: '2.2.3',
    chapter: 2,
    topicId: '2.2',
    title: '6. Ba quy luật cơ bản của phép biện chứng duy vật',
    badge: '6. Ba quy luật PBCDV',
    desc: 'Quy luật lượng - chất (độ, điểm nút, bước nhảy), Quy luật mâu thuẫn (nguồn gốc, động lực phát triển), Quy luật phủ định của phủ định'
  },
  '2.3.1': {
    id: '2.3.1',
    chapter: 2,
    topicId: '2.3',
    title: '7. Thực tiễn và vai trò của thực tiễn đối với nhận thức',
    badge: '7. Thực tiễn & Nhận thức',
    desc: 'Khái niệm thực tiễn, 3 hình thức cơ bản của thực tiễn, thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của chân lý'
  },
  '2.3.2': {
    id: '2.3.2',
    chapter: 2,
    topicId: '2.3',
    title: '8. Các giai đoạn của quá trình nhận thức & Chân lý',
    badge: '8. Các giai đoạn & Chân lý',
    desc: 'Nhận thức cảm tính (cảm giác, tri giác, biểu tượng), Nhận thức lý tính (khái niệm, phán đoán, suy lý), Chân lý và tính chất chân lý'
  }
};

function classifyMLN111Question(q) {
  const qLower = q.question.toLowerCase();
  const allText = (q.question + ' ' + (q.options ? q.options.map(o => o.text).join(' ') : '') + ' ' + (q.explanation || '')).toLowerCase();

  // 2.3 topics
  if (q.topicId === '2.3' || qLower.includes('nhận thức') || qLower.includes('thực tiễn') || qLower.includes('chân lý')) {
    if (qLower.includes('thực tiễn') || qLower.includes('thực nghiệm') || qLower.includes('hoạt động thực tiễn')) {
      return '2.3.1';
    }
    return '2.3.2';
  }

  // 2.2 topics
  if (q.topicId === '2.2' || qLower.includes('nguyên lý') || qLower.includes('phạm trù') || qLower.includes('quy luật') || qLower.includes('biện chứng')) {
    if (
      qLower.includes('nguyên lý về mối liên hệ') ||
      qLower.includes('mối liên hệ phổ biến') ||
      qLower.includes('nguyên lý về sự phát triển') ||
      qLower.includes('quan điểm toàn diện') ||
      qLower.includes('quan điểm phát triển') ||
      qLower.includes('quan điểm lịch sử')
    ) {
      return '2.2.1';
    }
    if (
      qLower.includes('cái riêng') || qLower.includes('cái chung') || qLower.includes('cái đơn nhất') ||
      qLower.includes('nguyên nhân') || qLower.includes('kết quả') ||
      qLower.includes('tất nhiên') || qLower.includes('ngẫu nhiên') ||
      qLower.includes('nội dung') || qLower.includes('hình thức') ||
      qLower.includes('bản chất') || qLower.includes('hiện tượng') ||
      qLower.includes('khả năng') || qLower.includes('hiện thực')
    ) {
      return '2.2.2';
    }
    return '2.2.3';
  }

  // 2.1 topics
  if (qLower.includes('chủ quan duy ý chí') || qLower.includes('vai trò của ý thức') || qLower.includes('tác động trở lại của ý thức')) {
    return '2.1.3';
  }
  if (qLower.includes('ý thức') || qLower.includes('não') || qLower.includes('ngôn ngữ') || qLower.includes('phản ánh')) {
    return '2.1.2';
  }
  return '2.1.1';
}

const classified = {};
ch2.forEach(q => {
  const sub = classifyMLN111Question(q);
  if (!classified[sub]) classified[sub] = [];
  classified[sub].push(q);
});

let order = 1;
const mln111Meta = {};

// Order subtopics sequentially: 2.1.1 -> 2.1.2 -> 2.1.3 -> 2.2.1 -> 2.2.2 -> 2.2.3 -> 2.3.1 -> 2.3.2
const sortedSubkeys = ['2.1.1', '2.1.2', '2.1.3', '2.2.1', '2.2.2', '2.2.3', '2.3.1', '2.3.2'];
sortedSubkeys.forEach(subKey => {
  const list = classified[subKey] || [];
  const meta = MLN111_SUBTOPICS[subKey];
  console.log(`MLN111 [${subKey}] ${meta.title}: ${list.length} questions`);
  list.forEach(q => {
    mln111Meta[q.id] = {
      subtopicId: subKey,
      subtopicTitle: meta.title,
      subtopicBadge: meta.badge,
      logicalOrder: order++
    };
  });
});

function applyToDataset(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;
  
  data.forEach(q => {
    if (q.chapter === 1 && mln111Ch1Meta[q.id]) {
      const meta = mln111Ch1Meta[q.id];
      q.topicId = meta.topicId;
      q.subtopicId = meta.subtopicId;
      q.subtopicTitle = meta.subtopicTitle;
      q.subtopicBadge = meta.subtopicBadge;
      q.logicalOrder = meta.logicalOrder;
      updatedCount++;
    } else if (q.chapter === 2 && mln111Meta[q.id]) {
      const meta = mln111Meta[q.id];
      q.subtopicId = meta.subtopicId;
      q.subtopicTitle = meta.subtopicTitle;
      q.subtopicBadge = meta.subtopicBadge;
      q.logicalOrder = meta.logicalOrder;
      updatedCount++;
    } else {
      q.logicalOrder = q.id;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} questions in ${filePath}`);
}

applyToDataset('quiz-app/src/data/mln111_questions.json');
applyToDataset('quiz-app/src/data/questions.json');
applyToDataset('mln111_dataset.json');
