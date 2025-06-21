
 /**
 * 角色匹配数据
 * 
 * 每个角色对象包含以下属性:
 * - name: {string} 角色名称
 * - quote: {string} (可选) 角色的经典名言
 * - description: {string} (可选) 对角色的简短描述
 * - matchRules: {Array<Object>} 匹配规则数组
 *   - type: {string} 规则类型
 *     - 'PRIMARY_FACTION': 主信仰匹配
 *     - 'SECONDARY_FACTION': 次要信仰匹配
 *     - 'BRANCH_PERCENT_RANGE': 分支信仰百分比范围
 *     - 'BRANCH_PERCENT_COMPARE_VALUE': 分支信仰百分比与固定值比较
 *     - 'BRANCH_PERCENT_COMPARE_BRANCH': 两个分支信仰百分比互相比较
 *   - ... (其他规则相关参数, 如 faction, min, max, value)
 *   - points: {number} 满足此规则可获得的分数
 * - minTotalPoints: {number} (可选) 匹配该角色所需的最低总分，用于严格校验
 * - matchReasonTemplate: {string} 匹配原因的模板，{PLACEHOLDER} 会被替换

 * - 核心亲和度: >10%
 * - 重要亲和度: >5%
 * - 存在倾向: >2%
 */

export const characters = [
    {
        name: "程实",
        quote: "我从不骗人,也从不相信任何人说的话,包括我自己",
        description: "一位在诸神游戏中挣扎求生的天生骗子，虚无的宠儿，内心深处却保留着一丝善良与柔软。",
        minTotalPoints: 60, // 保留但大幅降低最低分，体现相对严格
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '虚无', points: 30 },
            { type: 'SECONDARY_FACTION', faction: '混沌', points: 10 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '欺诈', min: 12, max: 100, points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '命运', min: 8, max: 100, points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '时间', comparison: 'GREATER_THAN', value: 3, points: 10 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '欺诈', comparison: 'GREATER_THAN', branch2: '混乱', points: 5 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '繁荣', comparison: 'GREATER_THAN', value: 0, points: 5 },
        ],
        matchReasonTemplate: "你的内心充满了矛盾与可能，如同【虚无】本身那般深邃。你对【欺诈】高达 {欺诈}% 的超凡亲和力，以及在【命运】与【混乱】之间的游走，都与那位在诸神棋局中挣扎求生的骗子不谋而合。你渴望活下去，却又不惜一切代价，这正是他的写照。"
    },
    {
        name: "安铭瑜",
        quote: "如果说秦薪心怀的是家国世界的大情，那大猫便是友朋安康的小情，而我介于这两者之间。",
        description: "理性的命运预言家，神秘的撞钟人，渴望为美好的人筑造一个崭新的世界。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '存在', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '命运', min: 10, max: 100, points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '死亡', min: 3, max: 100, points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '混乱', comparison: 'LESS_THAN', value: 2, points: 10 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '真理', comparison: 'GREATER_THAN', value: 1, points: 5 },
        ],
        matchReasonTemplate: "你倾向于【存在】的宏大，坚信万物皆有其轨迹。你对【命运】高达 {命运}% 的深刻理解，让你能洞察未来的丝线，同时也不畏惧【死亡】带来的终焉。你理性而温暖，渴望为美好的人筑造美好的世界，这正是那位命运歌者的心声。"
    },
    {
        name: "红霖",
        quote: "我喜欢庇佑朋友，让朋友繁荣下去。",
        description: "乐观坚韧的“大猫”，珍视友情，从不吝啬自己的力量，是【繁荣】意志的体现。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '生命', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '繁荣', min: 12, max: 100, points: 30 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '繁荣', comparison: 'GREATER_THAN', branch2: '腐朽', points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '战争', comparison: 'GREATER_THAN', value: 2, points: 5 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '沉沦', comparison: 'LESS_THAN', value: 0, points: 10 },
        ],
        matchReasonTemplate: "你充满了【生命】的活力，对【繁荣】有着高达 {繁荣}% 的天生亲近感。你珍视友情，愿意为守护身边的人而战，如同那只乐观坚韧的‘大猫’。你相信命运的眷顾，也愿意用自己的力量让朋友们繁荣下去。"
    },
    {
        name: "毒药",
        quote: "她从不索取，只希望你快乐，只会找到一个最巧妙的时机在你最需要她的地方出现。",
        description: "谨慎而致命的刺客，欲望的化身，总能在最巧妙的时机出现，让人心甘情愿地“付出”。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '沉沦', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '污堕', min: 8, max: 100, points: 25 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '文明', comparison: 'LESS_THAN', value: 0, points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '欺诈', comparison: 'GREATER_THAN', value: 5, points: 10 },
        ],
        matchReasonTemplate: "你的灵魂深处与【沉沦】共鸣，对【污堕】的力量了如指掌，亲和度高达 {污堕}%。你洞悉欲望的本质，懂得在最恰当的时机出现，让一切心甘情愿地为你‘付出’。你谨慎而危险，正如那位从不索取，却能得到一切的刺客。"
    },
    {
        name: "李景明",
        quote: "生命脆弱，文明短暂，在一切都将逝去之前，自然想为这里做点什么。",
        description: "【记忆】的践行者，热衷于铭记与交换记忆的道人，后为求知而容纳了【欺诈】。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '存在', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '记忆', min: 9, max: 100, points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '欺诈', min: 4, max: 100, points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '记忆', comparison: 'GREATER_THAN', branch2: '欺诈', points: 10 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '真理', comparison: 'GREATER_THAN', value: 3, points: 10 },
        ],
        matchReasonTemplate: "你对【存在】的本质充满探究欲，认为【记忆】是生命存在过的最佳证明，对其抱有 {记忆}% 的高度认同。为了探寻与铭记，你甚至不排斥【欺诈】的手段。你想要铭记一切，正如那位行走在历史长河中的云野观道人。"
    },
    {
        name: "张祭祖",
        quote: "我觉得并不是每个人生来都有意义，我只是单纯的不想死。",
        description: "稳健务实的守墓人，为了“活下去”而无所不用其极，嘴巴絮叨但内心可靠。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '生命', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '死亡', min: 3, max: 100, points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '欺诈', min: 3, max: 100, points: 10 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '死亡', comparison: 'GREATER_THAN', branch2: '诞育', points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '混乱', comparison: 'LESS_THAN', value: 0, points: 10 },
        ],
        matchReasonTemplate: "你对【生命】有着最朴素的执着——那就是单纯地活着。你对【死亡】高达 {死亡}% 的理解，并非为了终结，而是为了更好地规避它。你稳健、务实，甚至有点絮叨，但一切都是为了能活得更久，见得更多，这与那位墓园管理员的想法不谋而合。"
    },
    {
        name: "墨殊",
        quote: "腼腆谨慎，果断残忍务实，笑面虎",
        description: "【湮灭】意志的执行者，在“腼腆”的笑容下隐藏着果断的残忍。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '沉沦', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '湮灭', min: 10, max: 100, points: 30 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '生命', comparison: 'LESS_THAN', value: -5, points: 20 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '欺诈', comparison: 'GREATER_THAN', value: 2, points: 5 },
        ],
        matchReasonTemplate: "在你的世界观里，【沉沦】或许是最终的归宿。你对【湮灭】高达 {湮灭}% 的亲和力，让你成为了一位果断的清道夫。你认为一切终将归于虚无，这与那位喜欢分享小蛋糕的【湮灭】神选一样，将终极的破坏隐藏在无害的表象之下。"
    },
    {
        name: "韦牧",
        quote: "微末凡躯，观世愚者，掌幕之人，韦牧，向三位......令使大人问安。",
        description: "冷静而疯狂的【痴愚】神选，以木偶为身，鄙夷神明，索要权柄。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '混沌', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '痴愚', min: 5, max: 100, points: 30 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '痴愚', comparison: 'GREATER_THAN', branch2: '真理', points: 15 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '文明', comparison: 'LESS_THAN', value: 0, points: 10 },
        ],
        matchReasonTemplate: "你对世间的【混沌】有着深刻的洞见，并对【痴愚】高达 {痴愚}% 的本质有着强烈的认同。你冷静、稳重，甚至敢于鄙夷权威，认为所谓的智慧中充满了愚行。这种疯狂而清醒的特质，与那位以木偶为身的巅峰榜一如出一辙。"
    },
    {
        name: "胡为",
        quote: "记住我的话，我胡为，只对敌人出手。",
        description: "“慷慨”而强硬的【混乱】神选，利益至上，善于用灵活的仗义迫使一切选择偏向自己。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '混沌', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '混乱', min: 5, max: 100, points: 25 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '混乱', comparison: 'GREATER_THAN', branch2: '秩序', points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '战争', comparison: 'GREATER_THAN', value: 3, points: 10 },
        ],
        matchReasonTemplate: "你深谙【混沌】之道，对【混乱】有着 {混乱}% 的高亲和度。你行事强硬，慷他人之慨，懂得如何让局势朝着对你有利的方向发展。你所谓的仗义，永远服务于最终的利益，这正是那位大元帅的行事风格。"
    },
    {
        name: "王为进 (0221)",
        quote: "为追求真理不择手段。",
        description: "疯狂、狡猾、偏执的学者，为了追求【真理】可以牺牲一切，包括自己。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '文明', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '真理', min: 10, max: 100, points: 30 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '生命', comparison: 'LESS_THAN', value: -5, points: 15 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '痴愚', comparison: 'GREATER_THAN', value: 5, points: 10 },
        ],
        matchReasonTemplate: "你对【文明】的极致——【真理】，抱有近乎疯狂的执着，亲和度高达 {真理}%。为了探寻世界的最终答案，你可以不择手段，无视情感与生命。这种偏执与冷酷，与那位被称为“骗子博士”的疯狂学者十分相似。"
    },
    {
        name: "陶怡",
        quote: "这个傻子明明跟我没有任何关系......但她没有。",
        description: "古灵精怪的“小狐狸”，善良纯粹，有恩必报，是乱世中一抹温暖明亮的色彩。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '生命', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '繁荣', min: 10, max: 100, points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '诞育', min: 5, max: 100, points: 15 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '沉沦', comparison: 'LESS_THAN', value: -5, points: 10 },
        ],
        matchReasonTemplate: "你的天性向往【生命】的美好，对【繁荣】有着 {繁荣}% 的纯粹向往。你善良、知恩图报，古灵精怪的外表下是一颗金子般的心。你就像那只“小狐狸”，是朋友身边最温暖可靠的守护者。"
    },
    {
        name: "屈言",
        quote: "极其善于伪装自己静待猎物的猎人。",
        description: "冷静、沉默的猎人，混沌的崇拜者，善于伪装，在关键时刻果断出手。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '混沌', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '沉默', min: 8, max: 100, points: 30 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '腐朽', comparison: 'GREATER_THAN', value: 0, points: 10 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '文明', comparison: 'LESS_THAN', value: 0, points: 10 },
        ],
        matchReasonTemplate: "你信奉【混沌】的力量，并精通【沉默】的艺术，亲和度高达 {沉默}%。你如同一位冷静的猎人，善于伪装，静待时机，在最关键的时刻给予致命一击。这种蛰伏与果决，正是那位变色龙的生存之道。"
    },
    {
        name: "崔顶天",
        quote: "后悔吗？后悔！可如果有再选一次的机会......老汉还是选择后悔。",
        description: "诚实、稳重的老者，【腐朽】的信徒，在生命的尽头依然坚守着自己的选择与真诚。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '沉沦', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '腐朽', min: 5, max: 100, points: 25 },
            { type: 'BRANCH_PERCENT_COMPARE_BRANCH', branch1: '腐朽', comparison: 'GREATER_THAN', branch2: '污堕', points: 10 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '欺诈', comparison: 'LESS_THAN', value: 1, points: 10 },
        ],
        matchReasonTemplate: "你直面【沉沦】的终局，对【腐朽】高达 {腐朽}% 的理解并非源于恶意，而是一种对生命循环的坦然。你诚实、稳重，即使面对无可挽回的结局，依然会坚守自己的选择。这种风骨，与那位顶天立地的老人如出一辙。"
    },
    {
        name: "龙井",
        quote: "我姓龚，如果你们不介意，可以叫我......老龚？",
        description: "优雅又暴躁的杂技演员，【欺诈】的信徒，似乎总在不干正事。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '虚无', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '欺诈', min: 4, max: 100, points: 20 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '混乱', comparison: 'GREATER_THAN', value: 3, points: 10 },
        ],
        matchReasonTemplate: "你游走在【虚无】的边缘，享受着【欺诈】带来的乐趣，亲和度达到了 {欺诈}%。你时而优雅，时而暴躁，热衷于在舞台上吸引所有人的目光。这种看似“不务正业”的混乱感，正是那位杂技演员的魅力所在。"
    },
    {
        name: "公羊角",
        quote: "一个偏执、残忍，喜欢吃人的疯子。",
        description: "【污堕】的狂信徒，以恐惧为食，享受折磨敌人带来的快感。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '沉沦', points: 30 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '污堕', min: 8, max: 100, points: 25 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '战争', comparison: 'GREATER_THAN', value: 3, points: 15 },
            { type: 'FACTION_SCORE_COMPARE_VALUE', faction: '生命', comparison: 'LESS_THAN', value: -10, points: 15 },
        ],
        matchReasonTemplate: "你对【沉沦】有着狂热的崇拜，将【污堕】的力量（亲和度 {污堕}%）发挥到了极致。你享受恐惧，以他人的痛苦为食，是一位偏执而残忍的战士。你的行事风格，与那位中世纪贵族般的疯子别无二致。"
    },
    {
        name: "可塔罗",
        quote: "可怜的孩子，承受了这么多还没啥戏份，也得亏是个人偶抗造。",
        description: "理智之塔的学者，后成为【混乱】的信徒，将自己制成傀儡，默默承受一切。",
        matchRules: [
            { type: 'PRIMARY_FACTION', faction: '混沌', points: 25 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '混乱', min: 3, max: 100, points: 20 },
            { type: 'BRANCH_PERCENT_RANGE', branch: '真理', min: 3, max: 100, points: 10 },
            { type: 'BRANCH_PERCENT_COMPARE_VALUE', branch: '沉默', comparison: 'GREATER_THAN', value: 3, points: 10 },
        ],
        matchReasonTemplate: "你从对【真理】的追求，最终走向了【混沌】的怀抱，并对【混乱】有着 {混乱}% 的认知。你习惯于默默承受，将自己隐藏在坚固的外壳之下，如同那个把自己制作成傀儡的学者，坚韧而又令人心疼。"
    },
];