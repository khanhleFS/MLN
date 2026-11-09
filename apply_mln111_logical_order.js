const fs = require('fs');

const data111 = JSON.parse(fs.readFileSync('quiz-app/src/data/mln111_questions.json', 'utf8'));
const ch2 = data111.filter(q => q.chapter === 2);

console.log('Total MLN111 Ch2:', ch2.length);

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
    if (q.chapter === 2 && mln111Meta[q.id]) {
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
