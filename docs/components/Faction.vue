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
                <div class="result-description">
                    <p> 测试并非权威,结果仅供参考 </p>

                    <div class="charts-container">
                        <!-- 主信仰偏向 (包含正负) -->
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

                        <!-- 分支信仰偏向 (包含正负) -->
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
            factionScores: {}, // 分支信仰得分 (分支初始分)
            initialFactionScores: {}, // 主信仰初始得分 (仅主信仰)
            topFaction: null,
            secondFaction: null,
            topFactionBranch: null,
            secondFactionBranch: null,
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

            mainFactionPreferenceData: [], // 主信仰偏向
            branchFactionPreferenceData: [], // 分支信仰偏向
        };
    },
    mounted() {
        this.initializeFactionScores();
    },
    methods: {
        initializeFactionScores() {
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
            const currentQuestion = this.questions[this.currentQuestionIndex];
            const selectedOptionScores = currentQuestion.scores[optionIndex];

            if (selectedOptionScores) {
                for (const factionOrBranch in selectedOptionScores) {
                    const score = selectedOptionScores[factionOrBranch];
                    if (this.factions.includes(factionOrBranch)) {
                        this.initialFactionScores[factionOrBranch] += score; 
                    } else if (this.factionBranches[Object.keys(this.factionBranches).find(key => this.factionBranches[key].includes(factionOrBranch))]) {
                        this.factionScores[factionOrBranch] += score; // 累加分支信仰分数
                    }
                }
            }

            this.currentQuestionIndex++;

            if (this.currentQuestionIndex === this.questions.length) {
                this.calculateResults();
            }
        },
        calculateResults() {
            const mainFactionTotalScores = {}; // 存储主信仰总分


            // 主信仰总分
            for (const factionName of this.factions) { 
                let totalBranchInitialScore = 0;
                let branchCount = 0;
                if (this.factionBranches[factionName]) { // 确保存在分支
                    this.factionBranches[factionName].forEach(branch => {
                        totalBranchInitialScore += this.factionScores[branch] || 0;
                        branchCount++;
                    });
                }

                const mainFactionInitialScore = this.initialFactionScores[factionName] || 0;
                const opposingMainFactionName = this.opposingFactions[factionName];
                const opposingMainFactionInitialScore = this.initialFactionScores[opposingMainFactionName] || 0;

                // 主信仰最终得分计算
                const averageBranchScore = branchCount > 0 ? totalBranchInitialScore / branchCount : 0; // Calculate average branch score
                mainFactionTotalScores[factionName] = mainFactionInitialScore + (averageBranchScore * 0.6) - (opposingMainFactionInitialScore * 0.2);
            }


            // 主结果
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
            sortedMainFactions.sort((a, b) => b.score - a.score); // 降序
            this.topFaction = topFactionName || '未知信仰';
            this.secondFaction = sortedMainFactions[1]?.name || '其他信仰';

            let topBranchName = null;
            let maxBranchInitialScore = -Infinity;
            if (this.factionBranches[topFactionName]) {
                this.factionBranches[topFactionName].forEach(branch => {
                    if (this.factionScores[branch] > maxBranchInitialScore) {
                        maxBranchInitialScore = this.factionScores[branch];
                        topBranchName = branch;
                    }
                });
            }
            this.topFactionBranch = topBranchName || '无分支';


            //  次要结果
            const finalBranchScoresForSecondary = {};
            for (const faction in this.factionBranches) {
                const branches = this.factionBranches[faction];
                const mainFactionInitial = this.initialFactionScores[faction] || 0;
                const opposingFactionInitial = this.initialFactionScores[this.opposingFactions[faction]] || 0;

                branches.forEach(branch => {
                    const branchInitialScore = this.factionScores[branch] || 0;
                    finalBranchScoresForSecondary[branch] = branchInitialScore + (0.75 * mainFactionInitial) - (0.15 * opposingFactionInitial);
                });
            }


            const sortedBranchesForSecondary = Object.entries(finalBranchScoresForSecondary)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([branch]) => branch);

            let secondaryBranchResult = null;
            const filteredBranchesForSecondary = sortedBranchesForSecondary.filter(branch => {
                if (finalBranchScoresForSecondary[branch] < 0) return false;
                // 排除 topFactionBranch
                if (branch === this.topFactionBranch) return false;
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

                if (topBranchMainFactionForSecondary === this.topFaction) {
                    if (filteredBranchesForSecondary.length >= 2) {
                        const secondBranchSecondary = filteredBranchesForSecondary[1];
                        let secondBranchMainFaction = null;
                        for (const faction in this.factionBranches) {
                            if (this.factionBranches[faction].includes(secondBranchSecondary)) {
                                secondBranchMainFaction = faction;
                                break;
                            }
                        }
                        if (secondBranchMainFaction === this.topFaction) {
                            secondaryBranchResult = topBranchSecondary;
                        } else {
                            const topBranchSecondaryScore = finalBranchScoresForSecondary[topBranchSecondary] || 0;
                            const secondBranchSecondaryScore = finalBranchScoresForSecondary[secondBranchSecondary] || 0;
                            const coefficient = secondBranchSecondaryScore === 0 ? 0 : topBranchSecondaryScore / secondBranchSecondaryScore;
                            if (coefficient >= 0.65) {
                                secondaryBranchResult = topBranchSecondary;
                            } else {
                                secondaryBranchResult = secondBranchSecondary;
                            }

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
                for (const faction in this.factionBranches) {
                    if (this.factionBranches[faction].includes(this.secondFactionBranch)) {
                        this.secondFaction = faction;
                        break;
                    }
                }
            } else {
                this.secondFaction = '其他信仰';
            }

            if (!this.secondFaction) this.secondFaction = '其他信仰';


            // 主信仰偏向
            const mainFactionPreferenceChartData = [];
            let totalPositiveMainFactionScore = 0;
            let totalNegativeMainFactionScoreAbs = 0;

            for (const faction in mainFactionTotalScores) {
                if (mainFactionTotalScores[faction] >= 0) {
                    totalPositiveMainFactionScore += mainFactionTotalScores[faction];
                } else {
                    totalNegativeMainFactionScoreAbs += Math.abs(mainFactionTotalScores[faction]);
                }
            }

            for (const faction in mainFactionTotalScores) {
                let percentage = '0';
                let percentageValue = 0;
                if (mainFactionTotalScores[faction] >= 0 && totalPositiveMainFactionScore > 0) {
                    percentageValue = parseFloat(((mainFactionTotalScores[faction] / totalPositiveMainFactionScore) * 100).toFixed(1));
                    percentage = percentageValue.toFixed(1);
                } else if (mainFactionTotalScores[faction] < 0 && totalNegativeMainFactionScoreAbs > 0) {
                    percentageValue = parseFloat(((Math.abs(mainFactionTotalScores[faction]) / totalNegativeMainFactionScoreAbs) * 100).toFixed(1));
                    percentage = "-" + percentageValue.toFixed(1);
                }
                mainFactionPreferenceChartData.push({ name: faction, percentage: percentage, percentageValue: Math.abs(percentageValue), score: mainFactionTotalScores[faction] });
            }
            mainFactionPreferenceChartData.sort((a, b) => b.score - a.score);
            this.mainFactionPreferenceData = mainFactionPreferenceChartData;


            // 分支信仰偏向
            const branchFactionPreferenceChartData = [];
            let totalPositiveBranchScore = 0;
            let totalNegativeBranchScoreAbs = 0;

            for (const branch in finalBranchScoresForSecondary) {
                if (finalBranchScoresForSecondary[branch] >= 0) {
                    totalPositiveBranchScore += finalBranchScoresForSecondary[branch];
                } else {
                    totalNegativeBranchScoreAbs += Math.abs(finalBranchScoresForSecondary[branch]);
                }
            }


            for (const branch in finalBranchScoresForSecondary) {
                let percentage = '0';
                let percentageValue = 0;
                if (finalBranchScoresForSecondary[branch] >= 0 && totalPositiveBranchScore > 0) {
                    percentageValue = parseFloat(((finalBranchScoresForSecondary[branch] / totalPositiveBranchScore) * 100).toFixed(1));
                    percentage = percentageValue.toFixed(1);
                } else if (finalBranchScoresForSecondary[branch] < 0 && totalNegativeBranchScoreAbs > 0) {
                    percentageValue = parseFloat(((Math.abs(finalBranchScoresForSecondary[branch]) / totalNegativeBranchScoreAbs) * 100).toFixed(1));
                    percentage = "-" + percentageValue.toFixed(1);
                }
                branchFactionPreferenceChartData.push({ name: branch, percentage: percentage, percentageValue: Math.abs(percentageValue), score: finalBranchScoresForSecondary[branch] });
            }
            branchFactionPreferenceChartData.sort((a, b) => b.score - a.score);
            this.branchFactionPreferenceData = branchFactionPreferenceChartData;


        },

        restartQuiz() {
            this.currentQuestionIndex = 0;
            this.initializeFactionScores();
            this.topFaction = null;
            this.secondFaction = null;
            this.topFactionBranch = null;
            this.secondFactionBranch = null;

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
    /* 卡片背景色 */
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    /* 卡片内部的间距（四周：上、右、下、左） */
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
    /* 渐变边框颜色 */
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
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
    /* 标题字体大小 */
    color: #777;
    /* 标题字体颜色 */
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
}

.question-text,
.result-faction-title {
    font-size: 20px;
    /* 大标题字体大小 */
    font-weight: 700;
    color: #333;
    /* 大标题字体颜色 */
    margin-bottom: 20px;
    line-height: 1.3;
}

.result-faction-title {
    font-size: 25px;
    /* 结果主势力标题字体大小 */
    margin-bottom: 15px;
}

.result-faction-second {
    font-size: 18px;
    /* 次要结果字体大小 */
    color: #555;
    /* 次要结果字体颜色 */
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
    /* 按钮背景色 */
    color: #bb594c;
    /* 按钮文字颜色，主题色 */
    font-size: 20px;
    /* 按钮字体大小 */
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    outline: none;
    border: 2px solid #e0e0e0;
    /* 按钮边框颜色 */
}

.option-button:hover,
.restart-button:hover,
.previous-button:hover {

    background-color: #e39784;
    /* 按钮hover背景色，主题色 */
    color: #fff;
    /* 按钮hover文字颜色 */
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
    border-color: #e0784f;
    /* 按钮hover边框颜色，主题色 */
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
    /* 势力名称颜色，主题色 */
}

.result-description {
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    border: none;
    color: #777;
    /* 描述文字颜色 */
    line-height: 1.8;
    margin-top: 10px;
    /* 修改 margin-top 值 */
}

.result-description p {
    margin-bottom: 15px;
    font-size: 19px;
    /* 描述段落字体大小 */
}

.restart-button {
    margin-top: 30px;
    padding: 22px 44px;
    border-radius: 16px;
    font-size: 24px;
    /* 重测按钮字体大小 */
    background-color: #dc8e4d;
    /* 重测按钮背景色，主题色 */
    color: #fff;
    /* 重测按钮文字颜色 */
    border: none;
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.restart-button:hover {
    background-color: #e36e47;
    /* 重测按钮hover背景色，主题色 */
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

/* 图表容器样式 */
.charts-container {
    display: flex;
    flex-direction: column;
    /* 垂直排列 */
    gap: 20px;
    /* 图表之间的垂直间距 */
    margin-top: 20px;
}


/* 条形图样式 */
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
    /* 正数条形图颜色 */
}

.bar.negative {
    background-color: #f25f5c;
    /* 负数条形图颜色 */
}
</style>