<template>
    <div class="faction-quiz-page">
        <div class="quiz-container">
            <div v-if="showCommunityPage" class="question-card">
                <div class="question-header">
                    <span class="question-number">加入社区</span>
                </div>
                <div class="community-body">
                    <img :src="communityInfo.avatar" alt="Community Avatar" class="community-avatar">
                    <div class="community-text-content">
                        <h2 class="community-title">{{ communityInfo.title }}</h2>
                        <div class="community-channel-badge">
                            {{ communityInfo.name }}: {{ communityInfo.description }}
                        </div>
                    </div>
                </div>
                <div class="community-actions">
                    <a :href="communityInfo.joinLink" target="_blank" rel="noopener noreferrer"
                        class="community-button primary">
                        点击加入
                    </a>
                    <button class="community-button secondary" @click="startQuiz">我已知晓</button>
                </div>
            </div>

            <div v-else>
                <div v-if="currentQuestionIndex < questions.length" class="question-card">
                    <div class="question-header">
                        <span class="question-number">Question {{ currentQuestionIndex + 1 }}/{{ questions.length
                        }}</span>
                    </div>
                    <h2 class="question-text">{{ questions[currentQuestionIndex].question }}</h2>
                    <div class="options-grid">
                        <button v-for="(option, index) in questions[currentQuestionIndex].options" :key="index"
                            class="option-button" @click="selectOption(option, index)">
                            {{ option }}
                        </button>
                    </div>
                    <div class="navigation-buttons" v-if="currentQuestionIndex > 0">
                        <button class="previous-button" @click="previousQuestion">上一题</button>
                    </div>
                </div>
                <div v-else class="result-card">
                    <div class="result-header">
                        <span class="result-title">测试完成！</span>
                    </div>
                    <h2 class="result-faction-title">你更适合作为<span class="faction-name">【{{ topFaction
                    }}】{{ topFactionBranch }}</span> 的信徒</h2>
                    <p class="result-faction-second">当然，如果你不愿意，也可以试试<span class="faction-name">【{{
                        secondFaction }}】{{ secondFactionBranch }}</span>
                    </p>

                    <div class="recommended-job-section" v-if="recommendedPrimaryJob">
                        <h3 class="chart-title">推荐职业</h3>
                        <div class="job-display-wrapper">
                            <div class="job-display primary">
                                <span class="job-label">最适合</span>
                                <span class="job-name">{{ recommendedPrimaryJob }}</span>
                            </div>
                            <div class="job-display secondary" v-if="recommendedSecondaryJob">
                                <span class="job-label">亦或者</span>
                                <span class="job-name">{{ recommendedSecondaryJob }}</span>
                            </div>
                        </div>
                    </div>


                    <div class="credibility-section">
                        <h3 class="chart-title">测试结果可信度</h3>
                        <div class="credibility-rating" :class="credibilityRatingClass">{{ credibilityRating }} ({{
                            credibilityScore }}/100)</div>
                        <p class="credibility-explanation" v-if="credibilityScore < 25">啊哦,看样子你浪费了一段时间。</p>
                        <p class="credibility-explanation" v-else-if="credibilityScore < 60">准确度不高哦，请遵从本心哦
                        </p>
                        <p class="credibility-explanation" v-else-if="credibilityScore < 76">内心可能存在一些矛盾或摇摆哦
                        </p>
                        <p class="credibility-explanation" v-else-if="credibilityScore <= 90">已经很准确啦！
                        </p>
                        <p class="credibility-explanation" v-else-if="credibilityScore >= 91">如此完美的答卷！</p>
                    </div>

                    <div class="character-match-section">
                        <button v-if="!showCharacterResult" @click="findMatchedCharacter" class="find-match-button">
                            你更像谁？
                        </button>
                        <div v-if="showCharacterResult" class="character-result-card">
                            <div v-if="matchedCharacter">
                                <h3 class="character-name">在你身上，我们看到了【{{ matchedCharacter.name }}】的倒影</h3>
                                <p v-if="matchedCharacter.quote" class="character-quote">“{{ matchedCharacter.quote
                                }}”</p>
                                <p v-if="matchedCharacter.description" class="character-description">{{
                                    matchedCharacter.description }}</p>
                                <p class="match-reason">{{ formatMatchReason(matchedCharacter) }}</p>
                            </div>
                            <div v-else>
                                <h3 class="character-name">暂无完全契合的角色</h3>
                                <p class="character-description">你的灵魂独一无二，尚未在已知的人物中找到完美的回响。敬请期待后续更新！</p>
                            </div>
                        </div>
                    </div>

                    <div class="result-description">
                        <p> 测试并非权威,结果仅供参考 </p>

                        <div class="charts-container">
                            <div v-if="mainFactionPreferenceData.length > 0" class="bar-chart-wrapper">
                                <h3 class="chart-title">命途偏向</h3>
                                <div class="chart-bars">
                                    <div v-for="(factionData, index) in mainFactionPreferenceData" :key="index"
                                        class="chart-bar-item">
                                        <span class="bar-label">{{ factionData.name }} ({{ factionData.percentage
                                        }}%)</span>
                                        <div class="bar-container">
                                            <div class="bar"
                                                :class="{ positive: factionData.score >= 0, negative: factionData.score < 0 }"
                                                :style="{ width: factionData.percentageValue + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="branchFactionPreferenceData.length > 0" class="bar-chart-wrapper">
                                <h3 class="chart-title">信仰偏向</h3>
                                <div class="chart-bars">
                                    <div v-for="(branchData, index) in branchFactionPreferenceData" :key="index"
                                        class="chart-bar-item">
                                        <span class="bar-label">{{ branchData.name }} ({{ branchData.percentage
                                        }}%)</span>
                                        <div class="bar-container">
                                            <div class="bar"
                                                :class="{ positive: branchData.score >= 0, negative: branchData.score < 0 }"
                                                :style="{ width: branchData.percentageValue + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <button class="restart-button" @click="restartQuiz">重新测试</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const SCORE_WEIGHTS = {
    MAIN_FACTION_FROM_SELF: 0.7,
    MAIN_FACTION_FROM_BRANCH_AVG: 0.5,
    MAIN_FACTION_PENALTY_FROM_OPPOSING: 0.35,
    SECONDARY_BRANCH_FROM_SELF: 0.85,
    SECONDARY_BRANCH_FROM_MAIN_FACTION: 0.3,
    SECONDARY_BRANCH_PENALTY_FROM_OPPOSING: 0.2,
    SECONDARY_CHOICE_COEFFICIENT: 1.4,
    CREDIBILITY_SCALING_FACTOR: 1.6,
};

const jobsData = {
    '诞育': { '战士': '酋长', '法师': '生命贤者', '牧师': '子嗣牧师', '刺客': '借诞之婴', '猎人': '创生猎人', '歌者': '' },
    '繁荣': { '战士': '德鲁伊', '法师': '木精灵', '牧师': '园丁', '刺客': '荆棘之冠', '猎人': '美食家', '歌者': '' },
    '死亡': { '战士': '', '法师': '死灵法师', '牧师': '守墓人', '刺客': '死亡编织者', '猎人': '猩红猎手', '歌者': '撞钟人' },
    '污堕': { '战士': '尖啸伯爵', '法师': '欲望主宰', '牧师': '悲悯领主', '刺客': '恶孽', '猎人': '感官追猎者', '歌者': '塞壬' },
    '腐朽': { '战士': '木乃伊', '法师': '瘟疫枢机', '牧师': '凋零祭司', '刺客': '疮痍之目', '猎人': '黄昏猎人', '歌者': '腐烂颂唱者' },
    '湮灭': { '战士': '清道夫', '法师': '烬灭者', '牧师': '焚化工', '刺客': '寂灭使徒', '猎人': '终焉行者', '歌者': '毁灭宣告' },
    '秩序': { '战士': '秩序骑士', '法师': '元素法官', '牧师': '公正官', '刺客': '行刑官', '猎人': '搜查官', '歌者': '律者' },
    '真理': { '战士': '格斗专家', '法师': '博识学者', '牧师': '外科医生', '刺客': '暗杀博士', '猎人': '陷阱大师', '歌者': '博闻诗人' },
    '战争': { '战士': '陷阵勇士', '法师': '炼狱主教', '牧师': '督战官', '刺客': '隙光铁刺', '猎人': '鹰眼斥候', '歌者': '风暴之嗓' },
    '混乱': { '战士': '异血同袍', '法师': '灾祸之源', '牧师': '理智蚀者', '刺客': '折光析影', '猎人': '渔夫', '歌者': '失律琴师' },
    '痴愚': { '战士': '竖壁骑士', '法师': '幕后戏师', '牧师': '怯愚专家', '刺客': '解构之眼', '猎人': '猎愚人', '歌者': '独奏家' },
    '沉默': { '战士': '苦行僧', '法师': '默剧大师', '牧师': '守夜人', '刺客': '偃偶师', '猎人': '变色龙', '歌者': '囚徒' },
    '记忆': { '战士': '镜中人', '法师': '回忆旅者', '牧师': '见证者', '刺客': '旧日追猎者', '猎人': '窥梦游侠', '歌者': '史学家' },
    '时间': { '战士': '指针骑士', '法师': '时间行者', '牧师': '遗忘医生', '刺客': '另日刺客', '猎人': '驯风游侠', '歌者': '吟游诗人' },
    '欺诈': { '战士': '杂技演员', '法师': '诡术大师', '牧师': '小丑', '刺客': '受害者', '猎人': '驯兽师', '歌者': '魔术师' },
    '命运': { '战士': '今日勇士', '法师': '编剧', '牧师': '织命师', '刺客': '窃命之贼', '猎人': '终末之笔', '歌者': '预言家' }
};

const JOB_TYPE_AFFINITIES = {
    '战士': ['战争', '秩序', '诞育', '腐朽', '记忆', '时间', '繁荣'],
    '法师': ['真理', '湮灭', '时间', '混乱', '死亡', '污堕', '痴愚'],
    '牧师': ['诞育', '繁荣', '死亡', '腐朽', '秩序', '战争', '时间', '欺诈'],
    '刺客': ['湮灭', '死亡', '欺诈', '沉默', '时间', '真理', '污堕'],
    '猎人': ['繁荣', '记忆', '沉默', '命运', '欺诈', '战争', '死亡'],
    '歌者': ['命运', '混乱', '欺诈', '痴愚', '沉默', '腐朽', '污堕']
};

export default {
    props: {
        questions: {
            type: Array,
            required: true,
            default: () => [],
        },
        characters: {
            type: Array,
            required: true,
            default: () => [],
        }
    },
    data() {
        return {
            showCommunityPage: true,
            communityInfo: {
                title: '欢迎加入WIKI官方社区',
                avatar: '/avatar.png',
                name: 'QQ频道',
                description: 'zsyxwiki233',
                joinLink: 'https://pd.qq.com/s/7hfn4j2na'
            },
            currentQuestionIndex: 0,
            factionScores: {},
            initialFactionScores: {},
            userAnswers: {},
            topFaction: null,
            secondFaction: null,
            topFactionBranch: null,
            secondFactionBranch: null,
            credibilityScore: 100,
            credibilityRating: '完全可信',
            factions: ['生命', '沉沦', '文明', '混沌', '存在', '虚无'],
            factionBranches: {
                '生命': ['诞育', '繁荣', '死亡'],
                '沉沦': ['污堕', '腐朽', '湮灭'],
                '文明': ['秩序', '真理', '战争'],
                '混沌': ['混乱', '痴愚', '沉默'],
                '存在': ['记忆', '时间'],
                '虚无': ['欺诈', '命运'],
            },
            opposingFactions: {
                '生命': '沉沦',
                '沉沦': '生命',
                '文明': '混沌',
                '混沌': '文明',
                '存在': '虚无',
                '虚无': '存在',
            },
            conflictPairs: [
                ['STRONG_秩序', 'STRONG_混乱'], ['STRONG_秩序', 'STRONG_痴愚'], ['STRONG_秩序', 'STRONG_沉沦'], ['STRONG_秩序', 'OPPOSE_秩序'],
                ['STRONG_文明', 'STRONG_混乱'], ['STRONG_文明', 'STRONG_沉沦'], ['STRONG_文明', 'STRONG_虚无'], ['STRONG_文明', 'STRONG_湮灭'], ['STRONG_文明', 'OPPOSE_文明'],
                ['STRONG_混乱', 'STRONG_秩序'], ['STRONG_混乱', 'STRONG_真理'], ['STRONG_混乱', 'OPPOSE_混乱'],
                ['STRONG_混沌', 'STRONG_秩序'], ['STRONG_混沌', 'STRONG_文明'], ['STRONG_混沌', 'OPPOSE_混沌'],
                ['STRONG_生命', 'STRONG_沉沦'], ['STRONG_生命', 'STRONG_湮灭'], ['STRONG_生命', 'STRONG_死亡'], ['STRONG_生命', 'STRONG_腐朽'], ['STRONG_生命', 'STRONG_沉默'], ['STRONG_生命', 'STRONG_虚无'], ['STRONG_生命', 'OPPOSE_生命'],
                ['STRONG_繁荣', 'STRONG_湮灭'], ['STRONG_繁荣', 'STRONG_死亡'], ['STRONG_繁荣', 'STRONG_腐朽'], ['STRONG_繁荣', 'STRONG_沉默'], ['STRONG_繁荣', 'OPPOSE_繁荣'],
                ['STRONG_诞育', 'STRONG_湮灭'], ['STRONG_诞育', 'STRONG_死亡'], ['STRONG_诞育', 'STRONG_腐朽'], ['STRONG_诞育', 'OPPOSE_诞育'],
                ['STRONG_沉沦', 'STRONG_繁荣'], ['STRONG_沉沦', 'STRONG_秩序'], ['STRONG_沉沦', 'OPPOSE_沉沦'],
                ['STRONG_湮灭', 'STRONG_繁荣'], ['STRONG_湮灭', 'STRONG_诞育'], ['STRONG_湮灭', 'STRONG_秩序'], ['STRONG_湮灭', 'STRONG_存在'], ['STRONG_湮灭', 'OPPOSE_湮灭'],
                ['STRONG_真理', 'STRONG_欺诈'], ['STRONG_真理', 'STRONG_混乱'], ['STRONG_真理', 'STRONG_痴愚'], ['STRONG_真理', 'STRONG_虚无'], ['STRONG_真理', 'OPPOSE_真理'],
                ['STRONG_欺诈', 'STRONG_秩序'], ['STRONG_欺诈', 'STRONG_真理'], ['STRONG_欺诈', 'OPPOSE_欺诈'],
                ['STRONG_存在', 'STRONG_虚无'], ['STRONG_存在', 'STRONG_湮灭'], ['STRONG_存在', 'STRONG_沉默'], ['STRONG_存在', 'OPPOSE_存在'],
                ['STRONG_虚无', 'STRONG_秩序'], ['STRONG_虚无', 'STRONG_繁荣'], ['STRONG_虚无', 'STRONG_存在'], ['STRONG_虚无', 'OPPOSE_虚无'],
                ['STRONG_记忆', 'STRONG_湮灭'], ['STRONG_记忆', 'STRONG_沉默'], ['STRONG_记忆', 'OPPOSE_记忆'],
                ['STRONG_时间', 'STRONG_湮灭'], ['STRONG_时间', 'OPPOSE_时间'],
                ['STRONG_沉默', 'STRONG_繁荣'], ['STRONG_沉默', 'STRONG_诞育'], ['STRONG_沉默', 'STRONG_秩序'], ['STRONG_沉默', 'OPPOSE_沉默'],
                ['STRONG_死亡', 'STRONG_繁荣'], ['STRONG_死亡', 'STRONG_诞育'], ['STRONG_死亡', 'OPPOSE_死亡'],
                ['OPPOSE_秩序', 'STRONG_秩序'], ['OPPOSE_混乱', 'STRONG_混乱'], ['OPPOSE_文明', 'STRONG_文明'], ['OPPOSE_混沌', 'STRONG_混沌'], ['OPPOSE_生命', 'STRONG_生命'],
                ['OPPOSE_沉沦', 'STRONG_沉沦'], ['OPPOSE_存在', 'STRONG_存在'], ['OPPOSE_虚无', 'STRONG_虚无'], ['OPPOSE_真理', 'STRONG_真理'], ['OPPOSE_欺诈', 'STRONG_欺诈'],
                ['OPPOSE_繁荣', 'STRONG_繁荣'], ['OPPOSE_诞育', 'STRONG_诞育'], ['OPPOSE_湮灭', 'STRONG_湮灭'], ['OPPOSE_腐朽', 'STRONG_腐朽'], ['OPPOSE_记忆', 'STRONG_记忆'],
                ['OPPOSE_时间', 'STRONG_时间'], ['OPPOSE_沉默', 'STRONG_沉默'], ['OPPOSE_死亡', 'STRONG_死亡'], ['OPPOSE_痴愚', 'STRONG_痴愚'],
            ],
            mainFactionPreferenceData: [],
            branchFactionPreferenceData: [],
            matchedCharacter: null,
            showCharacterResult: false,
            recommendedPrimaryJob: null,
            recommendedSecondaryJob: null,
        };
    },
    computed: {
        credibilityRatingClass() {
            if (this.credibilityScore <= 10) return 'rating-unreliable';
            if (this.credibilityScore <= 25) return 'rating-low';
            if (this.credibilityScore <= 40) return 'rating-lower';
            if (this.credibilityScore <= 60) return 'rating-average';
            if (this.credibilityScore <= 75) return 'rating-higher';
            if (this.credibilityScore <= 90) return 'rating-high';
            return 'rating-perfect';
        }
    },
    mounted() {
        this.initializeFactionScores();
    },
    methods: {
        startQuiz() {
            this.showCommunityPage = false;
        },
        initializeFactionScores() {
            this.initialFactionScores = {};
            this.factionScores = {};
            this.factions.forEach((faction) => {
                this.initialFactionScores[faction] = 0;
            });
            for (const faction in this.factionBranches) {
                this.factionBranches[faction].forEach(branch => {
                    this.factionScores[branch] = 0;
                });
            }
        },

        selectOption(optionText, optionIndex) {
            this.userAnswers[this.currentQuestionIndex] = optionIndex;
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex === this.questions.length) {
                this.calculateResults();
            }
        },

        calculateCredibility() {
            let collectedTags = new Set();
            let totalStrongTags = 0;

            for (let i = 0; i < this.questions.length; i++) {
                const answerIndex = this.userAnswers[i];
                if (answerIndex !== undefined && this.questions[i]?.credibilityTags?.[answerIndex]) {
                    this.questions[i].credibilityTags[answerIndex].forEach(tag => {
                        if (tag.startsWith('STRONG_') || tag.startsWith('OPPOSE_')) {
                            collectedTags.add(tag);
                            totalStrongTags++;
                        }
                    });
                }
            }

            let numberOfConflicts = 0;
            const checkedPairs = new Set();

            this.conflictPairs.forEach(pair => {
                const tag1 = pair[0];
                const tag2 = pair[1];
                const pairKey1 = `${tag1}-${tag2}`;
                const pairKey2 = `${tag2}-${tag1}`;

                if (!checkedPairs.has(pairKey1) && !checkedPairs.has(pairKey2)) {
                    if (collectedTags.has(tag1) && collectedTags.has(tag2)) {
                        numberOfConflicts++;
                    }
                    checkedPairs.add(pairKey1);
                }
            });

            let conflictRatio = 0;
            if (totalStrongTags > 0) {
                conflictRatio = numberOfConflicts / totalStrongTags;
            }

            this.credibilityScore = Math.round(100 * Math.max(0, 1 - conflictRatio * SCORE_WEIGHTS.CREDIBILITY_SCALING_FACTOR));
            this.credibilityRating = this.getCredibilityRating(this.credibilityScore);
        },

        getCredibilityRating(score) {
            if (score <= 10) return '不可信';
            if (score <= 25) return '低';
            if (score <= 40) return '较低';
            if (score <= 60) return '一般';
            if (score <= 75) return '较高';
            if (score <= 90) return '高';
            return '完全可信';
        },


        calculateResults() {
            this.initializeFactionScores();

            for (let i = 0; i < this.questions.length; i++) {
                const optionIndex = this.userAnswers[i];
                if (optionIndex !== undefined) {
                    const currentQuestion = this.questions[i];
                    const selectedOptionScores = currentQuestion.scores[optionIndex];

                    if (selectedOptionScores) {
                        for (const factionOrBranch in selectedOptionScores) {
                            const score = selectedOptionScores[factionOrBranch];
                            if (this.factions.includes(factionOrBranch)) {
                                this.initialFactionScores[factionOrBranch] = (this.initialFactionScores[factionOrBranch] || 0) + score;
                            } else {
                                let mainFaction = Object.keys(this.factionBranches).find(key => this.factionBranches[key].includes(factionOrBranch));
                                if (mainFaction) {
                                    this.factionScores[factionOrBranch] = (this.factionScores[factionOrBranch] || 0) + score;
                                }
                            }
                        }
                    }
                }
            }


            const mainFactionTotalScores = {};
            for (const factionName of this.factions) {
                let totalBranchInitialScore = 0;
                let branchCount = 0;
                if (this.factionBranches[factionName]) {
                    this.factionBranches[factionName].forEach(branch => {
                        totalBranchInitialScore += this.factionScores[branch] || 0;
                        branchCount++;
                    });
                }
                const averageBranchScore = branchCount > 0 ? totalBranchInitialScore / branchCount : 0;
                const mainFactionInitialScore = this.initialFactionScores[factionName] || 0;
                const opposingMainFactionName = this.opposingFactions[factionName];
                const opposingMainFactionInitialScore = this.initialFactionScores[opposingMainFactionName] || 0;
                mainFactionTotalScores[factionName] = (mainFactionInitialScore * SCORE_WEIGHTS.MAIN_FACTION_FROM_SELF) + (averageBranchScore * SCORE_WEIGHTS.MAIN_FACTION_FROM_BRANCH_AVG) - (opposingMainFactionInitialScore * SCORE_WEIGHTS.MAIN_FACTION_PENALTY_FROM_OPPOSING);
            }


            let topFactionName = null;
            let maxMainFactionScore = -Infinity;
            let sortedMainFactions = [];
            for (const faction in mainFactionTotalScores) {
                sortedMainFactions.push({ name: faction, score: mainFactionTotalScores[faction] });
                if (mainFactionTotalScores[faction] > maxMainFactionScore) {
                    maxMainFactionScore = mainFactionTotalScores[faction];
                    topFactionName = faction;
                }
            }
            sortedMainFactions.sort((a, b) => b.score - a.score);
            this.topFaction = topFactionName || '未知信仰';

            let topBranchName = null;
            let maxBranchInitialScore = -Infinity;
            if (this.topFaction !== '未知信仰' && this.factionBranches[this.topFaction]) {
                this.factionBranches[this.topFaction].forEach(branch => {
                    const branchScore = this.factionScores[branch] || 0;
                    if (branchScore > maxBranchInitialScore) {
                        maxBranchInitialScore = branchScore;
                        topBranchName = branch;
                    }
                });
            }

            if (maxBranchInitialScore <= 0) {
                this.topFactionBranch = '核心';
            } else {
                this.topFactionBranch = topBranchName || '核心';
            }


            const finalBranchScoresForSecondary = {};
            for (const faction in this.factionBranches) {
                const branches = this.factionBranches[faction];
                const mainFactionInitial = this.initialFactionScores[faction] || 0;
                const opposingFactionInitial = this.initialFactionScores[this.opposingFactions[faction]] || 0;
                branches.forEach(branch => {
                    const branchInitialScore = this.factionScores[branch] || 0;
                    finalBranchScoresForSecondary[branch] = (branchInitialScore * SCORE_WEIGHTS.SECONDARY_BRANCH_FROM_SELF) + (mainFactionInitial * SCORE_WEIGHTS.SECONDARY_BRANCH_FROM_MAIN_FACTION) - (opposingFactionInitial * SCORE_WEIGHTS.SECONDARY_BRANCH_PENALTY_FROM_OPPOSING);
                });
            }


            const sortedBranchesForSecondary = Object.entries(finalBranchScoresForSecondary)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([branch]) => branch);

            let secondaryBranchResult = null;
            const filteredBranchesForSecondary = sortedBranchesForSecondary.filter(branch => {
                if (finalBranchScoresForSecondary[branch] <= 0) return false;

                let parentFaction = null;
                for (const fac in this.factionBranches) {
                    if (this.factionBranches[fac].includes(branch)) {
                        parentFaction = fac;
                        break;
                    }
                }
                if (parentFaction === this.topFaction && branch === this.topFactionBranch) return false;

                return true;
            });


            if (filteredBranchesForSecondary.length > 0) {
                const topBranchSecondary = filteredBranchesForSecondary[0];
                let topBranchMainFactionForSecondary = null;
                for (const faction in this.factionBranches) {
                    if (this.factionBranches[faction].includes(topBranchSecondary)) {
                        topBranchMainFactionForSecondary = faction;
                        break;
                    }
                }


                if (topBranchMainFactionForSecondary !== this.topFaction) {
                    secondaryBranchResult = topBranchSecondary;
                } else if (filteredBranchesForSecondary.length >= 2) {

                    const secondBranchSecondary = filteredBranchesForSecondary[1];
                    let secondBranchMainFaction = null;
                    for (const faction in this.factionBranches) {
                        if (this.factionBranches[faction].includes(secondBranchSecondary)) {
                            secondBranchMainFaction = faction;
                            break;
                        }
                    }

                    if (secondBranchMainFaction !== this.topFaction) {
                        const topScore = finalBranchScoresForSecondary[topBranchSecondary] || 0;
                        const secondScore = finalBranchScoresForSecondary[secondBranchSecondary] || 0;
                        const coefficient = secondScore === 0 ? Infinity : topScore / secondScore;
                        if (coefficient < SCORE_WEIGHTS.SECONDARY_CHOICE_COEFFICIENT) {
                            secondaryBranchResult = secondBranchSecondary;
                        } else {
                            secondaryBranchResult = topBranchSecondary;
                        }
                    } else {

                        secondaryBranchResult = topBranchSecondary;
                    }
                } else {

                    secondaryBranchResult = topBranchSecondary;
                }
            }


            this.secondFactionBranch = secondaryBranchResult || '其他分支';

            if (this.secondFactionBranch && this.secondFactionBranch !== '其他分支') {
                let foundSecondFaction = false;
                for (const faction in this.factionBranches) {
                    if (this.factionBranches[faction].includes(this.secondFactionBranch)) {
                        this.secondFaction = faction;
                        foundSecondFaction = true;
                        break;
                    }
                }
                if (!foundSecondFaction) this.secondFaction = '其他信仰';
            } else {
                if (sortedMainFactions.length > 1 && sortedMainFactions[1].name !== this.topFaction && sortedMainFactions[1].score > 0) {
                    this.secondFaction = sortedMainFactions[1].name;
                    this.secondFactionBranch = '核心';
                } else if (sortedMainFactions.length > 2 && sortedMainFactions[2].name !== this.topFaction && sortedMainFactions[2].score > 0) {
                    this.secondFaction = sortedMainFactions[2].name;
                    this.secondFactionBranch = '核心';
                }
                else {
                    this.secondFaction = '其他信仰';
                    this.secondFactionBranch = '无分支';
                }
            }


            const mainFactionPreferenceChartData = [];
            let grandTotalAbsMainScore = 0;
            for (const faction in mainFactionTotalScores) {
                grandTotalAbsMainScore += Math.abs(mainFactionTotalScores[faction] || 0);
            }
            if (grandTotalAbsMainScore === 0) grandTotalAbsMainScore = 1;
            for (const faction in mainFactionTotalScores) {
                const score = mainFactionTotalScores[faction] || 0;
                let percentageValue = parseFloat(((Math.abs(score) / grandTotalAbsMainScore) * 100).toFixed(1));
                let percentageString = score < 0 ? `-${percentageValue.toFixed(1)}` : percentageValue.toFixed(1);
                mainFactionPreferenceChartData.push({
                    name: faction,
                    percentage: percentageString,
                    percentageValue: percentageValue,
                    score: score
                });
            }
            mainFactionPreferenceChartData.sort((a, b) => b.score - a.score);
            this.mainFactionPreferenceData = mainFactionPreferenceChartData;


            const branchFactionPreferenceChartData = [];
            let grandTotalAbsBranchScore = 0;
            for (const branch in finalBranchScoresForSecondary) {
                grandTotalAbsBranchScore += Math.abs(finalBranchScoresForSecondary[branch] || 0);
            }
            if (grandTotalAbsBranchScore === 0) grandTotalAbsBranchScore = 1;
            for (const branch in finalBranchScoresForSecondary) {
                const score = finalBranchScoresForSecondary[branch] || 0;
                let percentageValue = parseFloat(((Math.abs(score) / grandTotalAbsBranchScore) * 100).toFixed(1));
                let percentageString = score < 0 ? `-${percentageValue.toFixed(1)}` : percentageValue.toFixed(1);
                branchFactionPreferenceChartData.push({
                    name: branch,
                    percentage: percentageString,
                    percentageValue: percentageValue,
                    score: score
                });
            }
            branchFactionPreferenceChartData.sort((a, b) => b.score - a.score);
            this.branchFactionPreferenceData = branchFactionPreferenceChartData;


            this.calculateCredibility();
            this.calculateRecommendedJob();
        },

        calculateRecommendedJob() {
            const branchesForAffinity = this.branchFactionPreferenceData
                .filter(branch => branch.score > 0)
                .filter(branch => branch.name !== this.topFactionBranch && branch.name !== this.secondFactionBranch)
                .slice(0, 6);

            const affinityScores = branchesForAffinity.reduce((acc, branch) => {
                acc[branch.name] = branch.score;
                return acc;
            }, {});

            const jobTypeScores = {};
            for (const jobType in JOB_TYPE_AFFINITIES) {
                jobTypeScores[jobType] = 0;
                JOB_TYPE_AFFINITIES[jobType].forEach(branch => {
                    if (affinityScores[branch]) {
                        jobTypeScores[jobType] += affinityScores[branch];
                    }
                });
            }

            const sortedJobTypes = Object.keys(jobTypeScores).sort((a, b) => jobTypeScores[b] - jobTypeScores[a]);
            const recommendedJobType = sortedJobTypes.length > 0 ? sortedJobTypes[0] : null;

            if (recommendedJobType) {
                if (this.topFactionBranch && this.topFactionBranch !== '核心') {
                    const primaryJobName = jobsData[this.topFactionBranch]?.[recommendedJobType];
                    if (primaryJobName) {
                        this.recommendedPrimaryJob = `${recommendedJobType} - ${primaryJobName}`;
                    }
                }

                if (this.secondFactionBranch && this.secondFactionBranch !== '其他分支' && this.secondFactionBranch !== '核心' && this.secondFactionBranch !== '无分支') {
                    const secondaryJobName = jobsData[this.secondFactionBranch]?.[recommendedJobType];
                    if (secondaryJobName) {
                        this.recommendedSecondaryJob = `${recommendedJobType} - ${secondaryJobName}`;
                    }
                }
            }
        },

        restartQuiz() {
            this.currentQuestionIndex = 0;
            this.userAnswers = {};
            this.initializeFactionScores();
            this.topFaction = null;
            this.secondFaction = null;
            this.topFactionBranch = null;
            this.secondFactionBranch = null;
            this.credibilityScore = 100;
            this.credibilityRating = '完全可信';
            this.mainFactionPreferenceData = [];
            this.branchFactionPreferenceData = [];
            this.matchedCharacter = null;
            this.showCharacterResult = false;
            this.recommendedPrimaryJob = null;
            this.recommendedSecondaryJob = null;
            this.showCommunityPage = true;
        },

        previousQuestion() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
            }
        },

        findMatchedCharacter() {
            const characterScores = {};
            const branchPercentages = this.branchFactionPreferenceData.reduce((acc, item) => {
                acc[item.name] = parseFloat(item.percentage);
                return acc;
            }, {});
            const mainFactionScores = this.mainFactionPreferenceData.reduce((acc, item) => {
                acc[item.name] = item.score;
                return acc;
            }, {});

            this.characters.forEach(character => {
                let currentScore = 0;
                character.matchRules.forEach(rule => {
                    let isMatch = false;
                    switch (rule.type) {
                        case 'PRIMARY_FACTION':
                            if (this.topFaction === rule.faction) isMatch = true;
                            break;
                        case 'SECONDARY_FACTION':
                            if (this.secondFaction === rule.faction) isMatch = true;
                            break;
                        case 'BRANCH_PERCENT_RANGE': {
                            const percent = branchPercentages[rule.branch] || 0;
                            if (percent >= rule.min && percent <= rule.max) isMatch = true;
                            break;
                        }
                        case 'BRANCH_PERCENT_COMPARE_VALUE': {
                            const percent = branchPercentages[rule.branch] || 0;
                            if (rule.comparison === 'GREATER_THAN' && percent > rule.value) isMatch = true;
                            if (rule.comparison === 'LESS_THAN' && percent < rule.value) isMatch = true;
                            break;
                        }
                        case 'BRANCH_PERCENT_COMPARE_BRANCH': {
                            const p1 = branchPercentages[rule.branch1] || 0;
                            const p2 = branchPercentages[rule.branch2] || 0;
                            if (rule.comparison === 'GREATER_THAN' && p1 > p2) isMatch = true;
                            if (rule.comparison === 'LESS_THAN' && p1 < p2) isMatch = true;
                            break;
                        }
                        case 'FACTION_SCORE_COMPARE_VALUE': {
                            const score = mainFactionScores[rule.faction] || 0;
                            if (rule.comparison === 'GREATER_THAN' && score > rule.value) isMatch = true;
                            if (rule.comparison === 'LESS_THAN' && score < rule.value) isMatch = true;
                            break;
                        }
                    }
                    if (isMatch) {
                        currentScore += rule.points;
                    }
                });
                characterScores[character.name] = currentScore;
            });

            let bestMatch = null;
            let maxScore = 0;

            this.characters.forEach(character => {
                const score = characterScores[character.name];
                if (score > maxScore) {
                    const minPoints = character.minTotalPoints || 0;
                    if (score >= minPoints) {
                        maxScore = score;
                        bestMatch = character;
                    }
                }
            });

            this.matchedCharacter = bestMatch;
            this.showCharacterResult = true;
        },

        formatMatchReason(character) {
            if (!character || !character.matchReasonTemplate) return '';

            const branchPercentages = this.branchFactionPreferenceData.reduce((acc, item) => {
                acc[item.name] = item.percentage;
                return acc;
            }, {});

            return character.matchReasonTemplate.replace(/\{(.+?)\}/g, (match, branchName) => {
                return branchPercentages[branchName] || '未知';
            });
        }
    },
};
</script>

<style scoped>
.faction-quiz-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 40px 10px;

}

.quiz-container {
    width: 100%;
    max-width: 1000px;
}

.question-card,
.result-card {
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    padding: 40px;
    margin-bottom: 30px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    border: 1px solid #e9e9e9;
}

.question-card::before,
.result-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(to right, #ec8a79, #b042bf);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.question-card:hover,
.result-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
    border-color: transparent;
}

.question-card:hover::before,
.result-card:hover::before {
    opacity: 1;
}

.question-header,
.result-header {
    margin-bottom: 30px;
    text-align: center;
}

.question-number,
.result-title {
    font-size: 18px;
    color: #888;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
}

.community-body {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 40px;
}

.community-avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #e69186;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
}

.community-text-content {
    text-align: left;
}

.community-title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
}

.community-channel-badge {
    display: inline-block;
    margin-top: 8px;
    padding: 10px 20px;
    background-color: #faf2e8;
    border-radius: 12px;
    color: #333;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.community-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.community-button {
    padding: 20px 10px;
    border-radius: 14px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.community-button.primary {
    background: linear-gradient(45deg, #ef7fac, #a28eeb);
    color: white;
    box-shadow: 0 4px 15px rgba(162, 142, 235, 0.4);
}

.community-button.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(162, 142, 235, 0.5);
}

.community-button.secondary {
    background-color: #f0f2f5;
    color: #555;
    border: 2px solid #f0f2f5;
}

.community-button.secondary:hover {
    background-color: #e4e6eb;
    border-color: #e4e6eb;
    color: #333;
    transform: translateY(-2px);
}

.question-text,
.result-faction-title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
    line-height: 1.4;
    text-align: center;
}

.result-faction-title {
    font-size: 25px;
    margin-bottom: 15px;
}

.result-faction-second {
    font-size: 18px;
    color: #555;
    margin-bottom: 30px;
    text-align: center;
}

.options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

.option-button,
.restart-button,
.previous-button {
    padding: 20px 10px;
    border: none;
    border-radius: 14px;
    background-color: #fff;
    color: #bb594c;
    font-size: 20px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    border: 2px solid #e0e0e0;
}

.option-button:hover,
.restart-button:hover,
.previous-button:hover {
    background-color: #e39784;
    color: #fff;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
    border-color: #e0784f;
}

.option-button:active,
.restart-button:active,
.previous-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.faction-name {
    font-weight: 700;
    color: #be5f3c;
}

.result-description {
    padding: 0;
    color: #777;
    line-height: 1.8;
    margin-top: 20px;
    text-align: center;
}

.result-description p {
    margin-bottom: 15px;
    font-size: 18px;
}

.restart-button {
    margin-top: 30px;
    padding: 22px 44px;
    border-radius: 16px;
    font-size: 24px;
    background-color: #dc8e4d;
    color: #fff;
    border: none;
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.restart-button:hover {
    background-color: #e36e47;
    box-shadow: 0 7px 18px rgba(0, 0, 0, 0.18);
}

.navigation-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
}

.previous-button {
    margin-right: 20px;
}

.charts-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;
}

.bar-chart-wrapper {
    padding: 20px;
    border-radius: 12px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #555;
    margin-bottom: 15px;
    text-align: center;
    margin-top: 0;
}

.chart-bars {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chart-bar-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.bar-label {
    font-size: 14px;
    color: #666;
}

.bar-container {
    background-color: #e0e0e0;
    border-radius: 8px;
    height: 16px;
    overflow: hidden;
}

.bar {
    height: 100%;
    border-radius: 8px;
    transition: width 0.5s ease;
    width: 0%;
}

.bar.positive {
    background-color: #7bd1ad;
}

.bar.negative {
    background-color: #f25f5c;
}

.credibility-section {
    margin-top: 30px;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    text-align: center;
    border: 1px solid #eee;
}

.credibility-rating {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 10px;
    padding: 8px 15px;
    border-radius: 8px;
    display: inline-block;
    color: #fff;
}

.credibility-explanation {
    font-size: 15px;
    color: #666;
    margin-top: 5px;
}

.rating-unreliable {
    background-color: #9f0904;
}

.rating-low {
    background-color: #d9534f;
}

.rating-lower {
    background-color: #f0ad4e;
    opacity: 0.9;
}

.rating-average {
    background-color: #235a89;
}

.rating-higher {
    background-color: #5bc0de;
    opacity: 0.9;
}

.rating-high {
    background-color: #5cb85c;
    opacity: 0.9;
}

.rating-perfect {
    background-color: #5cdc5c;
}

.character-match-section {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 15px;
}

.find-match-button {
    padding: 15px 30px;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(45deg, #ef7fac, #a28eeb);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.find-match-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.character-result-card {
    background-color: #fafafa;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 25px;
    margin-top: 20px;
    text-align: left;
}

.character-name {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
}

.character-name span {
    color: #fc5c7d;
}

.character-quote {
    font-style: italic;
    color: #555;
    margin-bottom: 15px;
    padding-left: 15px;
    border-left: 3px solid #ddd;
}

.character-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
}

.match-reason {
    margin-top: 20px;
    padding: 15px;
    background-color: #f0f4f8;
    border-radius: 8px;
    color: #69778f;
    font-size: 15px;
    line-height: 1.7;
}

.recommended-job-section {
    background-color: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
}

.job-display-wrapper {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    flex-wrap: wrap;
}

.job-display {
    text-align: center;
}

.job-label {
    display: block;
    font-size: 14px;
    color: #888;
    margin-bottom: 8px;
}

.job-name {
    font-size: 20px;
    font-weight: 700;
    padding: 10px 20px;
    border-radius: 10px;
}

.job-display.primary .job-name {
    background-color: #ffe8d6;
    color: #be5f3c;
}

.job-display.secondary .job-name {
    background-color: #e9ecef;
    color: #495057;
}


@media (max-width: 768px) {
    .options-grid {
        grid-template-columns: 1fr;
    }

    .community-body {
        flex-direction: column;
        text-align: center;
    }

    .community-text-content {
        text-align: center;
    }

    .community-actions {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 768px) {
    .options-grid {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
}
</style>