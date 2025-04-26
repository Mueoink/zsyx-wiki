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
            mainFactionPreferenceData: [],
            branchFactionPreferenceData: [],
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
                        this.initialFactionScores[factionOrBranch] = (this.initialFactionScores[factionOrBranch] || 0) + score;
                    }
                    else if (this.factionBranches[Object.keys(this.factionBranches).find(key => this.factionBranches[key].includes(factionOrBranch))]) {
                        this.factionScores[factionOrBranch] = (this.factionScores[factionOrBranch] || 0) + score;
                    }
                }
            }

            this.currentQuestionIndex++;

            if (this.currentQuestionIndex === this.questions.length) {
                this.calculateResults();
            }
        },
        calculateResults() {
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

                mainFactionTotalScores[factionName] = (mainFactionInitialScore * 0.75) + (averageBranchScore * 0.5) - (opposingMainFactionInitialScore * 0.4);
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
            this.topFactionBranch = topBranchName || '无分支';


            const finalBranchScoresForSecondary = {};
            for (const faction in this.factionBranches) {
                const branches = this.factionBranches[faction];
                const mainFactionInitial = this.initialFactionScores[faction] || 0;
                const opposingFactionInitial = this.initialFactionScores[this.opposingFactions[faction]] || 0;

                branches.forEach(branch => {
                    const branchInitialScore = this.factionScores[branch] || 0;
                    finalBranchScoresForSecondary[branch] = (branchInitialScore * 0.9) + (mainFactionInitial * 0.35) - (opposingFactionInitial * 0.25);
                });
            }


            const sortedBranchesForSecondary = Object.entries(finalBranchScoresForSecondary)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([branch]) => branch);

            let secondaryBranchResult = null;
            const filteredBranchesForSecondary = sortedBranchesForSecondary.filter(branch => {
                if (finalBranchScoresForSecondary[branch] < 0) return false;
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
                            const coefficient = secondBranchSecondaryScore === 0 ? Infinity : topBranchSecondaryScore / secondBranchSecondaryScore;
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
                let foundSecondFaction = false;
                for (const faction in this.factionBranches) {
                    if (this.factionBranches[faction].includes(this.secondFactionBranch)) {
                        this.secondFaction = faction;
                        foundSecondFaction = true;
                        break;
                    }
                }
                if (!foundSecondFaction) {
                    this.secondFaction = '其他信仰';
                }
            } else {
                this.secondFaction = '其他信仰';
            }


            const mainFactionPreferenceChartData = [];
            let grandTotalAbsMainScore = 0;
            for (const faction in mainFactionTotalScores) {
                grandTotalAbsMainScore += Math.abs(mainFactionTotalScores[faction] || 0);
            }
            for (const faction in mainFactionTotalScores) {
                const score = mainFactionTotalScores[faction] || 0;
                let percentageString = '0.0';
                let percentageValue = 0;

                if (grandTotalAbsMainScore > 0) {
                    percentageValue = parseFloat(((Math.abs(score) / grandTotalAbsMainScore) * 100).toFixed(1));
                    percentageString = score < 0 ? `-${percentageValue.toFixed(1)}` : percentageValue.toFixed(1);
                }

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
            for (const branch in finalBranchScoresForSecondary) {
                const score = finalBranchScoresForSecondary[branch] || 0;
                let percentageString = '0.0';
                let percentageValue = 0;

                if (grandTotalAbsBranchScore > 0) {
                    percentageValue = parseFloat(((Math.abs(score) / grandTotalAbsBranchScore) * 100).toFixed(1));
                    percentageString = score < 0 ? `-${percentageValue.toFixed(1)}` : percentageValue.toFixed(1);
                }

                branchFactionPreferenceChartData.push({
                    name: branch,
                    percentage: percentageString,
                    percentageValue: percentageValue,
                    score: score
                });
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
</style>