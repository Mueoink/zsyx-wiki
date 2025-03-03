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
                    <p> 测试结果仅供参考 ~ </p>
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
        };
    },
    mounted() {
        this.initializeFactionScores();
    },
    methods: {
        initializeFactionScores() {
            this.factions.forEach((faction) => {
                this.initialFactionScores[faction] = 0; // 初始化主信仰初始分数
            });
            for (const faction in this.factionBranches) {
                this.factionBranches[faction].forEach(branch => {
                    this.factionScores[branch] = 0; // 初始化分支信仰分数
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
                        this.initialFactionScores[factionOrBranch] += score; // 累加主信仰初始分
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

            // 1. & 2. 步骤在 selectOption 中已完成：
            //    - initialFactionScores 存储主信仰初始分
            //    - factionScores 存储分支信仰初始分

            // 3. 计算主信仰总分
            for (const mainFaction in this.factions) {
                const factionName = this.factions[mainFaction];
                let totalBranchInitialScore = 0;
                if (this.factionBranches[factionName]) { // 确保存在分支
                    this.factionBranches[factionName].forEach(branch => {
                        totalBranchInitialScore += this.factionScores[branch] || 0;
                    });
                }

                const mainFactionInitialScore = this.initialFactionScores[factionName] || 0;
                const opposingMainFactionName = this.opposingFactions[factionName];
                const opposingMainFactionInitialScore = this.initialFactionScores[opposingMainFactionName] || 0;

                mainFactionTotalScores[factionName] = mainFactionInitialScore + (totalBranchInitialScore * 0.6) - (opposingMainFactionInitialScore * 0.2);
            }

            // 4. 确定主结果
            let topFactionName = null;
            let maxMainFactionScore = -Infinity;

            for (const faction in mainFactionTotalScores) {
                if (mainFactionTotalScores[faction] > maxMainFactionScore) {
                    maxMainFactionScore = mainFactionTotalScores[faction];
                    topFactionName = faction;
                }
            }
            this.topFaction = topFactionName || '未知信仰';


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


            //  次要结果部分 (保持原逻辑，并修改部分)
            const finalBranchScoresForSecondary = {};
            for (const mainFaction in this.factionBranches) {
                const branches = this.factionBranches[mainFaction];
                const currentFinalMainFactionScore = mainFactionTotalScores[mainFaction];
                branches.forEach(branch => {
                    const branchInitialScore = this.factionScores[branch] || 0;
                    const safeDivide = (numerator, denominator) => {
                        const den = Math.max(1, denominator);
                        return numerator / den;
                    };
                    finalBranchScoresForSecondary[branch] = safeDivide(branchInitialScore, currentFinalMainFactionScore) * branchInitialScore * 1.1;
                });
            }


            const sortedBranchesForSecondary = Object.entries(finalBranchScoresForSecondary)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([branch]) => branch);

            const topBranchSecondary = sortedBranchesForSecondary[0];
            let secondaryBranchResult = null;


            if (topBranchSecondary) {
                let topBranchMainFactionForSecondary = null;
                for (const faction in this.factionBranches) {
                    if (this.factionBranches[faction].includes(topBranchSecondary)) {
                        topBranchMainFactionForSecondary = faction;
                        break;
                    }
                }

                if (topBranchMainFactionForSecondary === this.topFaction) {
                    let firstNonTopFactionBranch = null;
                    for (const branch of sortedBranchesForSecondary) {
                        let branchMainFaction = null;
                        for (const faction in this.factionBranches) {
                            if (this.factionBranches[faction].includes(branch)) {
                                branchMainFaction = faction;
                                break;
                            }
                        }
                        if (branchMainFaction !== this.topFaction) {
                            firstNonTopFactionBranch = branch;
                            break;
                        }
                    }

                    if (firstNonTopFactionBranch) { // 原有逻辑保持不变
                        const topBranchSecondaryScore = finalBranchScoresForSecondary[topBranchSecondary] || 0;
                        const firstNonTopFactionBranchScore = finalBranchScoresForSecondary[firstNonTopFactionBranch] || 0;
                        const coefficient = topBranchSecondaryScore / (topBranchSecondaryScore + firstNonTopFactionBranchScore);

                        if (coefficient >= 0.45) {
                            secondaryBranchResult = topBranchSecondary;
                        } else {
                            secondaryBranchResult = firstNonTopFactionBranch;
                        }
                    } else { // 修改部分：未找到其余主信仰分支时
                        const topFactionBranchesSorted = sortedBranchesForSecondary.filter(branch => {
                            for (const faction in this.factionBranches) {
                                if (faction === this.topFaction && this.factionBranches[faction].includes(branch)) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (topFactionBranchesSorted.length >= 2) {
                            secondaryBranchResult = topFactionBranchesSorted[1]; // 选择第二高分支
                        } else {
                            secondaryBranchResult = '其他分支'; // 如果不足两个分支，则为 '其他分支'
                        }
                    }


                } else {
                    secondaryBranchResult = topBranchSecondary; // 原有逻辑保持不变
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


        },
        findTopBranch(factionName) { // 移除，不再需要
            return 'N/A'; // 结果直接取最高分支，不再需要findTopBranch
        },
        restartQuiz() {
            this.currentQuestionIndex = 0;
            this.initializeFactionScores();
            this.topFaction = null;
            this.secondFaction = null;
            this.topFactionBranch = null;
            this.secondFactionBranch = null;
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
    margin-top: 30px;
}

.result-description p {
    margin-bottom: 15px;
    font-size: 19px;
    /* 描述段落字体大小 */
}

.restart-button {
    margin-top: 40px;
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
</style>