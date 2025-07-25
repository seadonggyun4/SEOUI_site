export const translations = {
  ko: {
    // 섹션 제목들
    'slot.method.search': 'Slot 방식 검색 셀렉트',
    'array.method.search': '배열 방식 검색 셀렉트',
    'float.theme.search': 'Float 테마 (기본값) - 검색 기능',
    'basic.theme.search': 'Basic 테마 - 검색 기능',
    'chosung.search.test': '초성 검색 기능 테스트',
    'continuous.loading.state': '지속적 로딩 상태',
    'large.dataset.search': '10,000개 옵션 - 실시간 검색',
    'multiple.selection.search': '다중 선택과 검색 조합',
    'search.event.test': '검색 이벤트 테스트',
    'light.vs.dark.search': '라이트 모드 vs 다크 모드 검색 비교',
    'theme.dark.comparison': '테마별 다크 모드 검색 비교',
    'multi.dark.search': '다중 선택 + 다크 모드 + 검색',

    // 데모 설명 노트들
    'demo.note.slot.search': '🔍 드롭다운을 열고 "현대", "ㅎㄷ", "bmw" 등으로 검색해보세요',
    'demo.note.array.search': '🏙️ "서울", "ㅅㅇ", "광역", "ㄱㅇ" 등으로 지역을 검색해보세요',
    'demo.note.float.search': '🎨 둥근 모서리, 그라데이션 글로우, 슬라이드 애니메이션이 적용됩니다. "script", "ㅅㅋㄹㅍㅌ" 등으로 검색해보세요.',
    'demo.note.basic.search': '📐 직각 모서리와 즉시 표시되는 전통적인 스타일입니다. "java", "ㅈㅂ" 등으로 검색해보세요.',
    'demo.note.chosung.test': '"서울" → 서울특별시 매칭 / "ㅅㅇ" → 서울특별시 매칭 / "광역" → 모든 광역시 매칭 / "ㄱㅇ" → 광주광역시, 경기도 매칭',
    'demo.note.continuous.loading': '💫 옵션이 비어있어서 드롭다운을 열 때마다 로딩 상태가 표시됩니다',
    'demo.note.large.search': '"프론트" → 프론트엔드 관련 항목들 / "ㅍㄹㅌ" → 프론트엔드 항목들 (초성 검색) / "백엔드" → 백엔드 관련 항목들 / "0001" → 특정 번호의 항목들',
    'demo.note.multi.search': '🏷️ "script", "ㅅㅋㄹㅍㅌ" 등으로 검색 후 선택해보세요. 모든 항목을 선택하면 "데이터 없음"이 표시됩니다.',
    'demo.note.search.event': '🔍 "첫", "ㅊㅂ", "옵션" 등으로 검색 후 선택해보세요',
    'demo.note.color.theme': '🌓 검색창의 색상, 포커스 효과, 아이콘까지 모든 요소가 다크 테마로 변환됩니다. "사과", "ㅅㄱ" 등으로 검색해보세요.',
    'demo.note.theme.comparison': '🎭 모든 테마에서 검색 기능과 다크 모드가 완벽하게 지원됩니다. "java", "ㅈㅂ", "react", "ㄹㅇ" 등으로 검색해보세요.',
    'demo.note.multi.dark': '🏷️ 다크 모드에서 태그, 검색창, 드롭다운이 모두 완벽하게 동작합니다. "광역", "ㄱㅇ" 등으로 검색해보세요.',

    // 버튼 텍스트들
    'clear.log': '로그 지우기',
    'submit': '제출',
    'start.loading': '데이터 로딩 시작',

    // 폼 라벨들
    'region.required': '거주 지역 (필수):',
    'please.select': '선택해주세요',
    'interests.multiple': '관심 분야 (다중 선택):',
    'form.data.output': '폼 데이터 출력:',

    // 이벤트 로그 텍스트들
    'event.log.placeholder': '이벤트 로그가 여기에 표시됩니다...',
    'multi.event.log': '다중 선택 이벤트 로그',
    'search.event.log': '검색 이벤트 로그',
    'selected': '선택됨',
    'deselected': '해제됨',
    'reset.completed': '리셋됨',
    'search.reset': '리셋됨 - 검색어도 초기화',
    'form.value.changed': '폼 값 변경',

    // 지역 이름들
    'seoul': '서울특별시',
    'busan': '부산광역시',
    'daegu': '대구광역시',
    'incheon': '인천광역시',
    'gwangju': '광주광역시',
    'daejeon': '대전광역시',
    'ulsan': '울산광역시',
    'sejong': '세종특별자치시',
    'gyeonggi': '경기도',
    'gangwon': '강원특별자치도',
    'chungbuk': '충청북도',
    'chungnam': '충청남도',
    'jeonbuk': '전북특별자치도',
    'jeonnam': '전라남도',
    'gyeongbuk': '경상북도',
    'gyeongnam': '경상남도',
    'jeju': '제주특별자치도',

    // 기술 스택들
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'nodejs': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'kotlin': 'Kotlin',
    'swift': 'Swift',

    // 자동차 브랜드들
    'kia.motors': '기아자동차',
    'hyundai.motor': '현대자동차',

    // 관심 분야들
    'frontend.dev': '프론트엔드 개발',
    'backend.dev': '백엔드 개발',
    'mobile.dev': '모바일 앱 개발',
    'ai.ml': '인공지능/머신러닝',
    'blockchain': '블록체인',
    'devops': '데브옵스/인프라',
    'uiux.design': 'UI/UX 디자인',
    'data.analysis': '데이터 분석',

    // 과일들
    'apple': '사과 (Apple)',
    'banana': '바나나 (Banana)',
    'cherry': '체리 (Cherry)',
    'date': '대추 (Date)',
    'elderberry': '엘더베리 (Elderberry)',

    // 옵션 텍스트들
    'option': '옵션',
    'first.option': '첫 번째 옵션',
    'second.option': '두 번째 옵션',
    'third.option': '세 번째 옵션',
    'fourth.option': '네 번째 옵션',
    'fifth.option': '다섯 번째 옵션',

    // 기타 텍스트들
    'item': '아이템',
    'tech.stack': '기술 스택',
    'detail.description': '상세 설명',
    'dynamic.loaded.item': '동적 로딩된 아이템',
    'data.loading.complete': '데이터 로딩 완료',
    'search.activated': '검색 기능 활성화',
    'light.mode.search': '라이트 모드 검색',
    'dark.mode.search': '다크 모드 검색',
    'basic.theme.dark': 'Basic 테마 + 다크 모드',
    'float.theme.dark': 'Float 테마 + 다크 모드'
  },

  en: {
    // 섹션 제목들
    'slot.method.search': 'Slot Method Search Select',
    'array.method.search': 'Array Method Search Select',
    'float.theme.search': 'Float Theme (Default) - Search Feature',
    'basic.theme.search': 'Basic Theme - Search Feature',
    'chosung.search.test': 'Initial Consonant Search Test',
    'continuous.loading.state': 'Continuous Loading State',
    'large.dataset.search': '10,000 Options - Real-time Search',
    'multiple.selection.search': 'Multiple Selection with Search',
    'search.event.test': 'Search Event Test',
    'light.vs.dark.search': 'Light vs Dark Mode Search Comparison',
    'theme.dark.comparison': 'Theme-based Dark Mode Search Comparison',
    'multi.dark.search': 'Multiple Selection + Dark Mode + Search',

    // 데모 설명 노트들
    'demo.note.slot.search': '🔍 Open dropdown and try searching with "Hyundai", "ㅎㄷ", "bmw" etc.',
    'demo.note.array.search': '🏙️ Search regions with "Seoul", "ㅅㅇ", "Metro", "ㄱㅇ" etc.',
    'demo.note.float.search': '🎨 Rounded corners, gradient glow, slide animations applied. Search with "script", "ㅅㅋㄹㅍㅌ" etc.',
    'demo.note.basic.search': '📐 Traditional style with straight corners and immediate display. Search with "java", "ㅈㅂ" etc.',
    'demo.note.chosung.test': '"Seoul" → Matches Seoul Metropolitan City / "ㅅㅇ" → Matches Seoul Metropolitan City / "Metro" → Matches all metropolitan cities / "ㄱㅇ" → Matches Gwangju Metropolitan City, Gyeonggi Province',
    'demo.note.continuous.loading': '💫 Loading state is displayed every time dropdown opens due to empty options',
    'demo.note.large.search': '"Frontend" → Frontend-related items / "ㅍㄹㅌ" → Frontend items (initial consonant search) / "Backend" → Backend-related items / "0001" → Specific numbered items',
    'demo.note.multi.search': '🏷️ Search with "script", "ㅅㅋㄹㅍㅌ" then select. "No data" is displayed when all items are selected.',
    'demo.note.search.event': '🔍 Search with "First", "ㅊㅂ", "Option" etc. then select',
    'demo.note.color.theme': '🌓 All elements including search field colors, focus effects, icons are converted to dark theme. Search with "Apple", "ㅅㄱ" etc.',
    'demo.note.theme.comparison': '🎭 Search functionality and dark mode are perfectly supported in all themes. Search with "java", "ㅈㅂ", "react", "ㄹㅇ" etc.',
    'demo.note.multi.dark': '🏷️ Tags, search field, dropdown all work perfectly in dark mode. Search with "Metro", "ㄱㅇ" etc.',

    // 버튼 텍스트들
    'clear.log': 'Clear Log',
    'submit': 'Submit',
    'start.loading': 'Start Loading Data',

    // 폼 라벨들
    'region.required': 'Residence Region (Required):',
    'please.select': 'Please select',
    'interests.multiple': 'Areas of Interest (Multiple Selection):',
    'form.data.output': 'Form Data Output:',

    // 이벤트 로그 텍스트들
    'event.log.placeholder': 'Event logs will be displayed here...',
    'multi.event.log': 'Multiple Selection Event Log',
    'search.event.log': 'Search Event Log',
    'selected': 'Selected',
    'deselected': 'Deselected',
    'reset.completed': 'Reset',
    'search.reset': 'Reset - Search term also initialized',
    'form.value.changed': 'Form value changed',

    // 지역 이름들
    'seoul': 'Seoul Metropolitan City',
    'busan': 'Busan Metropolitan City',
    'daegu': 'Daegu Metropolitan City',
    'incheon': 'Incheon Metropolitan City',
    'gwangju': 'Gwangju Metropolitan City',
    'daejeon': 'Daejeon Metropolitan City',
    'ulsan': 'Ulsan Metropolitan City',
    'sejong': 'Sejong Special Autonomous City',
    'gyeonggi': 'Gyeonggi Province',
    'gangwon': 'Gangwon Special Autonomous Province',
    'chungbuk': 'North Chungcheong Province',
    'chungnam': 'South Chungcheong Province',
    'jeonbuk': 'Jeonbuk Special Autonomous Province',
    'jeonnam': 'South Jeolla Province',
    'gyeongbuk': 'North Gyeongsang Province',
    'gyeongnam': 'South Gyeongsang Province',
    'jeju': 'Jeju Special Autonomous Province',

    // 기술 스택들
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'nodejs': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'kotlin': 'Kotlin',
    'swift': 'Swift',

    // 자동차 브랜드들
    'kia.motors': 'Kia Motors',
    'hyundai.motor': 'Hyundai Motor',

    // 관심 분야들
    'frontend.dev': 'Frontend Development',
    'backend.dev': 'Backend Development',
    'mobile.dev': 'Mobile App Development',
    'ai.ml': 'AI/Machine Learning',
    'blockchain': 'Blockchain',
    'devops': 'DevOps/Infrastructure',
    'uiux.design': 'UI/UX Design',
    'data.analysis': 'Data Analysis',

    // 과일들
    'apple': 'Apple',
    'banana': 'Banana',
    'cherry': 'Cherry',
    'date': 'Date',
    'elderberry': 'Elderberry',

    // 옵션 텍스트들
    'option': 'Option',
    'first.option': 'First Option',
    'second.option': 'Second Option',
    'third.option': 'Third Option',
    'fourth.option': 'Fourth Option',
    'fifth.option': 'Fifth Option',

    // 기타 텍스트들
    'item': 'Item',
    'tech.stack': 'Tech Stack',
    'detail.description': 'Detailed Description',
    'dynamic.loaded.item': 'Dynamically Loaded Item',
    'data.loading.complete': 'Data Loading Complete',
    'search.activated': 'Search Functionality Activated',
    'light.mode.search': 'Light Mode Search',
    'dark.mode.search': 'Dark Mode Search',
    'basic.theme.dark': 'Basic Theme + Dark Mode',
    'float.theme.dark': 'Float Theme + Dark Mode'
  },

  ja: {
    // 섹션 제목들
    'slot.method.search': 'Slot方式検索セレクト',
    'array.method.search': '配列方式検索セレクト',
    'float.theme.search': 'Floatテーマ（デフォルト）- 検索機能',
    'basic.theme.search': 'Basicテーマ - 検索機能',
    'chosung.search.test': '初声検索機能テスト',
    'continuous.loading.state': '継続的ローディング状態',
    'large.dataset.search': '10,000項目 - リアルタイム検索',
    'multiple.selection.search': '複数選択と検索の組み合わせ',
    'search.event.test': '検索イベントテスト',
    'light.vs.dark.search': 'ライトモードvsダークモード検索比較',
    'theme.dark.comparison': 'テーマ別ダークモード検索比較',
    'multi.dark.search': '複数選択 + ダークモード + 検索',

    // 데모 설명 노트들
    'demo.note.slot.search': '🔍 ドロップダウンを開いて「現代」、「ㅎㄷ」、「bmw」などで検索してみてください',
    'demo.note.array.search': '🏙️ 「ソウル」、「ㅅㅇ」、「広域」、「ㄱㅇ」などで地域を検索してみてください',
    'demo.note.float.search': '🎨 丸い角、グラデーショングロー、スライドアニメーションが適用されます。「script」、「ㅅㅋㄹㅍㅌ」などで検索してみてください。',
    'demo.note.basic.search': '📐 直角と即座に表示される伝統的なスタイルです。「java」、「ㅈㅂ」などで検索してみてください。',
    'demo.note.chosung.test': '「ソウル」→ソウル特別市マッチ / 「ㅅㅇ」→ソウル特別市マッチ / 「広域」→すべての広域市マッチ / 「ㄱㅇ」→光州広域市、京畿道マッチ',
    'demo.note.continuous.loading': '💫 オプションが空のためドロップダウンを開くたびにローディング状態が表示されます',
    'demo.note.large.search': '「フロント」→フロントエンド関連項目 / 「ㅍㄹㅌ」→フロントエンド項目（初声検索）/ 「バック」→バックエンド関連項目 / 「0001」→特定番号の項目',
    'demo.note.multi.search': '🏷️ 「script」、「ㅅㅋㄹㅍㅌ」などで検索後選択してみてください。すべての項目を選択すると「データなし」が表示されます。',
    'demo.note.search.event': '🔍 「最初」、「ㅊㅂ」、「オプション」などで検索後選択してみてください',
    'demo.note.color.theme': '🌓 検索フィールドの色、フォーカス効果、アイコンまですべての要素がダークテーマに変換されます。「りんご」、「ㅅㄱ」などで検索してみてください。',
    'demo.note.theme.comparison': '🎭 すべてのテーマで検索機能とダークモードが完璧にサポートされます。「java」、「ㅈㅂ」、「react」、「ㄹㅇ」などで検索してみてください。',
    'demo.note.multi.dark': '🏷️ ダークモードでタグ、検索フィールド、ドロップダウンがすべて完璧に動作します。「広域」、「ㄱㅇ」などで検索してみてください。',

    // 버튼 텍스트들
    'clear.log': 'ログクリア',
    'submit': '送信',
    'start.loading': 'データ読み込み開始',

    // 폼 라벨들
    'region.required': '居住地域（必須）：',
    'please.select': '選択してください',
    'interests.multiple': '関心分野（複数選択）：',
    'form.data.output': 'フォームデータ出力：',

    // 이벤트 로그 텍스트들
    'event.log.placeholder': 'イベントログがここに表示されます...',
    'multi.event.log': '複数選択イベントログ',
    'search.event.log': '検索イベントログ',
    'selected': '選択',
    'deselected': '解除',
    'reset.completed': 'リセット',
    'search.reset': 'リセット - 検索語も初期化',
    'form.value.changed': 'フォーム値変更',

    // 지역 이름들
    'seoul': 'ソウル特別市',
    'busan': '釜山広域市',
    'daegu': '大邱広域市',
    'incheon': '仁川広域市',
    'gwangju': '光州広域市',
    'daejeon': '大田広域市',
    'ulsan': '蔚山広域市',
    'sejong': '世宗特別自治市',
    'gyeonggi': '京畿道',
    'gangwon': '江原特別自治道',
    'chungbuk': '忠清北道',
    'chungnam': '忠清南道',
    'jeonbuk': '全北特別自治道',
    'jeonnam': '全羅南道',
    'gyeongbuk': '慶尚北道',
    'gyeongnam': '慶尚南道',
    'jeju': '済州特別自治道',

    // 기술 스택들
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'nodejs': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'kotlin': 'Kotlin',
    'swift': 'Swift',

    // 자동차 브랜드들
    'kia.motors': '起亜自動車',
    'hyundai.motor': '現代自動車',

    // 관심 분야들
    'frontend.dev': 'フロントエンド開発',
    'backend.dev': 'バックエンド開発',
    'mobile.dev': 'モバイルアプリ開発',
    'ai.ml': '人工知能/機械学習',
    'blockchain': 'ブロックチェーン',
    'devops': 'DevOps/インフラ',
    'uiux.design': 'UI/UXデザイン',
    'data.analysis': 'データ分析',

    // 과일들
    'apple': 'りんご',
    'banana': 'バナナ',
    'cherry': 'チェリー',
    'date': 'デーツ',
    'elderberry': 'エルダーベリー',

    // 옵션 텍스트들
    'option': 'オプション',
    'first.option': '最初のオプション',
    'second.option': '2番目のオプション',
    'third.option': '3番目のオプション',
    'fourth.option': '4番目のオプション',
    'fifth.option': '5番目のオプション',

    // 기타 텍스트들
    'item': 'アイテム',
    'tech.stack': '技術スタック',
    'detail.description': '詳細説明',
    'dynamic.loaded.item': '動的読み込みアイテム',
    'data.loading.complete': 'データ読み込み完了',
    'search.activated': '検索機能有効化',
    'light.mode.search': 'ライトモード検索',
    'dark.mode.search': 'ダークモード検索',
    'basic.theme.dark': 'Basicテーマ + ダークモード',
    'float.theme.dark': 'Floatテーマ + ダークモード'
  },

  zh: {
    // 섹션 제목들
    'slot.method.search': 'Slot 方式搜索选择框',
    'array.method.search': '数组方式搜索选择框',
    'float.theme.search': 'Float 主题（默认）- 搜索功能',
    'basic.theme.search': 'Basic 主题 - 搜索功能',
    'chosung.search.test': '首字母搜索功能测试',
    'continuous.loading.state': '持续加载状态',
    'large.dataset.search': '10,000 个选项 - 实时搜索',
    'multiple.selection.search': '多选与搜索组合',
    'search.event.test': '搜索事件测试',
    'light.vs.dark.search': '浅色模式 vs 暗黑模式搜索比较',
    'theme.dark.comparison': '主题暗黑模式搜索比较',
    'multi.dark.search': '多选 + 暗黑模式 + 搜索',

    // 데모 설명 노트들
    'demo.note.slot.search': '🔍 打开下拉框并尝试搜索"现代"、"ㅎㄷ"、"bmw"等',
    'demo.note.array.search': '🏙️ 搜索地区"首尔"、"ㅅㅇ"、"广域"、"ㄱㅇ"等',
    'demo.note.float.search': '🎨 应用圆角、渐变发光、滑动动画。搜索"script"、"ㅅㅋㄹㅍㅌ"等。',
    'demo.note.basic.search': '📐 传统直角和立即显示的样式。搜索"java"、"ㅈㅂ"等。',
    'demo.note.chosung.test': '"首尔"→匹配首尔特别市 / "ㅅㅇ"→匹配首尔特别市 / "广域"→匹配所有广域市 / "ㄱㅇ"→匹配光州广域市、京畿道',
    'demo.note.continuous.loading': '💫 选项为空时每次打开下拉框都会显示加载状态',
    'demo.note.large.search': '"前端"→前端相关项目 / "ㅍㄹㅌ"→前端项目（首字母搜索）/ "后端"→后端相关项目 / "0001"→特定编号项目',
    'demo.note.multi.search': '🏷️ 搜索"script"、"ㅅㅋㄹㅍㅌ"然后选择。选择所有项目时显示"暂无数据"。',
    'demo.note.search.event': '🔍 搜索"第一"、"ㅊㅂ"、"选项"等然后选择',
    'demo.note.color.theme': '🌓 搜索框颜色、焦点效果、图标等所有元素都转换为暗黑主题。搜索"苹果"、"ㅅㄱ"等。',
    'demo.note.theme.comparison': '🎭 所有主题都完美支持搜索功能和暗黑模式。搜索"java"、"ㅈㅂ"、"react"、"ㄹㅇ"等。',
    'demo.note.multi.dark': '🏷️ 暗黑模式下标签、搜索框、下拉框都完美运行。搜索"广域"、"ㄱㅇ"等。',

    // 버튼 텍스트들
    'clear.log': '清除日志',
    'submit': '提交',
    'start.loading': '开始加载数据',

    // 폼 라벨들
    'region.required': '居住地区（必填）：',
    'please.select': '请选择',
    'interests.multiple': '兴趣领域（多选）：',
    'form.data.output': '表单数据输出：',

    // 이벤트 로그 텍스트들
    'event.log.placeholder': '事件日志将在此显示...',
    'multi.event.log': '多选事件日志',
    'search.event.log': '搜索事件日志',
    'selected': '已选择',
    'deselected': '已取消选择',
    'reset.completed': '重置',
    'search.reset': '重置 - 搜索词也已初始化',
    'form.value.changed': '表单值已更改',

    // 지역 이름들
    'seoul': '首尔特别市',
    'busan': '釜山广域市',
    'daegu': '大邱广域市',
    'incheon': '仁川广域市',
    'gwangju': '光州广域市',
    'daejeon': '大田广域市',
    'ulsan': '蔚山广域市',
    'sejong': '世宗特别自治市',
    'gyeonggi': '京畿道',
    'gangwon': '江原特别自治道',
    'chungbuk': '忠清北道',
    'chungnam': '忠清南道',
    'jeonbuk': '全北特别自治道',
    'jeonnam': '全罗南道',
    'gyeongbuk': '庆尚北道',
    'gyeongnam': '庆尚南道',
    'jeju': '济州特别自治道',

    // 기술 스택들
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'nodejs': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'kotlin': 'Kotlin',
    'swift': 'Swift',

    // 자동차 브랜드들
    'kia.motors': '起亚汽车',
    'hyundai.motor': '现代汽车',

    // 관심 분야들
    'frontend.dev': '前端开发',
    'backend.dev': '后端开发',
    'mobile.dev': '移动应用开发',
    'ai.ml': '人工智能/机器学习',
    'blockchain': '区块链',
    'devops': 'DevOps/基础设施',
    'uiux.design': 'UI/UX 设计',
    'data.analysis': '数据分析',

    // 과일들
    'apple': '苹果',
    'banana': '香蕉',
    'cherry': '樱桃',
    'date': '枣子',
    'elderberry': '接骨木莓',

    // 옵션 텍스트들
    'option': '选项',
    'first.option': '第一个选项',
    'second.option': '第二个选项',
    'third.option': '第三个选项',
    'fourth.option': '第四个选项',
    'fifth.option': '第五个选项',

    // 기타 텍스트들
    'item': '项目',
    'tech.stack': '技术栈',
    'detail.description': '详细描述',
    'dynamic.loaded.item': '动态加载项目',
    'data.loading.complete': '数据加载完成',
    'search.activated': '搜索功能已激活',
    'light.mode.search': '浅色模式搜索',
    'dark.mode.search': '暗黑模式搜索',
    'basic.theme.dark': 'Basic 主题 + 暗黑模式',
    'float.theme.dark': 'Float 主题 + 暗黑模式'
  }
};