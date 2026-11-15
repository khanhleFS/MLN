import questions from './prm393_questions.json';

const chapterTitles = [
  'Tổng quan Flutter, công cụ và Dart',
  'Widgets, giao diện và điều hướng',
  'Biểu mẫu và quản lý trạng thái',
  'REST API và xác thực',
  'Lưu trữ dữ liệu và kiến trúc ứng dụng',
  'Animation và tối ưu hiệu năng',
  'Kiểm thử và triển khai',
];

const studyTopics = [
  ['1.1', 'Tổng quan Flutter và phát triển đa nền tảng'],
  ['1.2', 'Flutter SDK, môi trường và quy trình phát triển'],
  ['1.3', 'Ngôn ngữ Dart, OOP, collections và bất đồng bộ'],
  ['2.1', 'Widget tree, vòng đời và giao diện phản ứng'],
  ['2.2', 'Bố cục, themes, cuộn và slivers'],
  ['2.3', 'Navigator, routes và truyền dữ liệu giữa màn hình'],
  ['3.1', 'Forms, nhập liệu và validation'],
  ['3.2', 'setState, Provider và phạm vi trạng thái'],
  ['3.3', 'BLoC, Cubit, events, states và streams'],
  ['4.1', 'HTTP, REST, API và mô hình dữ liệu'],
  ['4.2', 'Đăng nhập, tokens và kiểm soát truy cập'],
  ['5.1', 'SharedPreferences, Hive, SQLite và lưu trữ cục bộ'],
  ['5.2', 'Kiến trúc ứng dụng và Repository pattern'],
  ['6.1', 'Implicit animation, Tween, curves và controllers'],
  ['6.2', 'Rebuilds, rendering và công cụ đo hiệu năng'],
  ['7.1', 'Unit, widget, integration và golden tests'],
  ['7.2', 'Release builds, bảo mật triển khai và Git'],
];

export const PRM393_SUBJECT = {
  id: 'prm393',
  code: 'PRM393',
  name: 'Lập trình di động (Mobile Programming)',
  shortName: 'Lập trình di động',
  description: `Ngân hàng ${questions.length} câu hỏi trắc nghiệm PRM393 về Dart và Flutter (Source FA26)`,
  questionCount: questions.length,
  textbook: 'Tài liệu ôn tập PRM393 – Mobile Programming (Source FA26)',
  sourceLabel: 'Tài liệu ôn tập FA26',
  explanationTitle: 'Đáp Án Từ Tài Liệu Ôn Tập',
  protocol: '// PROTOCOL_PRM393 // MOBILE_PROGRAMMING_INTERFACE',
  badgeTitle: 'Bộ Huy Hiệu Lập Trình Di Động',
  examTitle: 'THI THỬ LẬP TRÌNH DI ĐỘNG (PRM393)',
  examSubtitle: 'PHÒNG THI THỬ TRẮC NGHIỆM PRM393',
  searchPlaceholder: 'Tìm kiếm câu hỏi, Dart, Flutter, widgets, BLoC, REST API...',
  questions,
  chapters: [
    { id: 'all', title: `Tất cả ${questions.length} câu`, short: 'Tất cả' },
    ...chapterTitles.map((title, index) => ({
      id: index + 1,
      title: `Nhóm ${index + 1}: ${title}`,
      short: `Nhóm ${index + 1}`,
    })),
  ],
  topics: [
    { id: 'all', chapter: 'all', title: 'Tất cả đề mục' },
    ...studyTopics.map(([id, title]) => ({
      id,
      chapter: Number(id.split('.')[0]),
      title: `${id}. ${title}`,
    })),
  ],
  levelTitles: [
    'Tập sự Mobile',
    'Người học Dart',
    'Lập trình viên Flutter',
    'Kỹ sư Giao diện',
    'Chuyên gia Trạng thái',
    'Kiến trúc sư Ứng dụng',
    'Chuyên gia Hiệu năng',
    'Bậc thầy Mobile',
  ],
  rankTitles: {
    S: 'Bậc Thầy Lập Trình Di Động',
    A: 'Chuyên Gia Flutter',
    B: 'Lập Trình Viên Tiềm Năng',
    C: 'Đạt Chuẩn Cần Cố Gắng',
    D: 'Cần Ôn Luyện Lại',
  },
};
