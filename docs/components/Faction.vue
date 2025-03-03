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
            factionScores: {},
            topFaction: null,
            secondFaction: null,
            topFactionBranch: null,
            secondFactionBranch: null,
            factions: ['生命', '沉沦', '文明', '混沌', '存在', '虚无'], // 内置信仰列表
            factionBranches: { // 内置信仰分支关系
                '生命': ['诞育', '繁荣', '死亡'],
                '沉沦': ['污堕', '腐朽', '湮灭'],
                '文明': ['秩序', '真理', '战争'],
                '混沌': ['混乱', '痴愚', '沉默'],
                '存在': ['记忆', '时间'],
                '虚无': ['欺诈', '命运'],
            },
        };
    },
    mounted() {
        this.initializeFactionScores();
    },
    methods: {
        initializeFactionScores() {
            this.factions.forEach((faction) => {
                this.factionScores[faction] = 0; // 初始化主信仰分数
                if (this.factionBranches[faction]) {
                    this.factionBranches[faction].forEach(branch => {
                        this.factionScores[branch] = 0; // 初始化信仰分数
                    });
                }
            });
        },
        selectOption(optionText, optionIndex) {
            const currentQuestion = this.questions[this.currentQuestionIndex];
            const selectedOptionScores = currentQuestion.scores[optionIndex];

            if (selectedOptionScores) {
                for (const factionOrBranch in selectedOptionScores) {
                    const score = selectedOptionScores[factionOrBranch];
                    if (this.factionScores.hasOwnProperty(factionOrBranch)) {
                        this.factionScores[factionOrBranch] += score;
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
            this.factions.forEach(faction => {
                mainFactionTotalScores[faction] = this.factionScores[faction]; // 初始主信仰分数
                if (this.factionBranches[faction]) {
                    this.factionBranches[faction].forEach(branch => {
                        mainFactionTotalScores[faction] += this.factionScores[branch]; // 累加分支分数到主信仰
                    });
                }
            });

            const sortedMainFactions = Object.entries(mainFactionTotalScores)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([faction]) => faction);

            this.topFaction = sortedMainFactions[0] || '未知信仰';
            this.secondFaction = sortedMainFactions[1] || '其他信仰';

            this.topFactionBranch = this.findTopBranch(this.topFaction);
            this.secondFactionBranch = this.findTopBranch(this.secondFaction);
        },
        findTopBranch(factionName) {
            let topBranch = '无分支'; // 默认无分支
            let topBranchScore = -Infinity;
            if (this.factionBranches[factionName]) {
                this.factionBranches[factionName].forEach(branch => {
                    if (this.factionScores[branch] > topBranchScore) {
                        topBranchScore = this.factionScores[branch];
                        topBranch = branch;
                    }
                });
            }
            return topBranch;
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