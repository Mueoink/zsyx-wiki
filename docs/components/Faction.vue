<template>
    <div class="faction-quiz-page">
        <div class="quiz-container">
            <div v-if="currentQuestionIndex < questions.length" class="question-card">
                <div class="question-header">
                    <span class="question-number">Question {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
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
                    <p class="credibility-explanation" v-else-if="credibilityScore >= 91 ">如此完美的答卷！</p>
                </div>
                <div class="result-description">
                    <p> 测试并非权威,结果仅供参考 </p>

                    <div class="charts-container">
                        <div v-if="mainFactionPreferenceData.length > 0" class="bar-chart-wrapper">
                            <h3 class="chart-title">主信仰偏向</h3>
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
                            <h3 class="chart-title">分支信仰偏向</h3>
                            <div class="chart-bars">
                                <div v-for="(branchData, index) in branchFactionPreferenceData" :key="index"
                                    class="chart-bar-item">
                                    <span class="bar-label">{{ branchData.name }} ({{ branchData.percentage }}%)</span>
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
</template>

<script>
export default {
    props: {
        questions: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
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

            const scalingFactor = 1.6; // 可信度系数，防止过低，越高越低
            this.credibilityScore = Math.round(100 * Math.max(0, 1 - conflictRatio * scalingFactor));
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
                mainFactionTotalScores[factionName] = (mainFactionInitialScore * 0.7) + (averageBranchScore * 0.5) - (opposingMainFactionInitialScore * 0.35);
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
                    finalBranchScoresForSecondary[branch] = (branchInitialScore * 0.85) + (mainFactionInitial * 0.3) - (opposingFactionInitial * 0.2);
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
                        if (coefficient < 1.4) { 
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
                if (sortedMainFactions.length > 1 && sortedMainFactions[1].name !== this.topFaction && sortedMainFactions[1].score > 0) { // Check for positive score
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
        },
        previousQuestion() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
            }
        },

    },
};
</script>

<style scoped>
.faction-quiz-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 10px;
}

.quiz-container {
    width: 100%;
    max-width: 1000px;
}

.question-card,
.result-card {
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    margin-bottom: 30px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
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
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
}

.question-card:hover::before,
.result-card:hover::before {
    opacity: 1;
}


.question-header,
.result-header {
    margin-bottom: 25px;
    text-align: center;
}

.question-number,
.result-title {
    font-size: 20px;
    color: #777;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
}

.question-text,
.result-faction-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    line-height: 1.3;
}

.result-faction-title {
    font-size: 25px;
    margin-bottom: 15px;
}

.result-faction-second {
    font-size: 18px;
    color: #555;
    margin-bottom: 20px;
}

.options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
}

@media (min-width: 768px) {
    .options-grid {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
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
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
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
    background-color: transparent;
    border-radius: 0;
    border: none;
    color: #777;
    line-height: 1.8;
    margin-top: 10px;
}

.result-description p {
    margin-bottom: 15px;
    font-size: 19px;
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
    margin-top: 20px;
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
    margin-top: 20px;
}

.bar-chart-wrapper {
    padding: 15px;
    border-radius: 12px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
}

.chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
    text-align: center;
    margin-top: 0;
}

.chart-bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.chart-bar-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.bar-label {
    font-size: 14px;
    color: #666;
}

.bar-container {
    background-color: #e0e0e0;
    border-radius: 8px;
    height: 15px;
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
</style>