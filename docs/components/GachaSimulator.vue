<template>
    <div class="gacha-simulator-page">
        <div class="gacha-container">
            <!-- 抽卡控制区域 -->
            <div class="draw-controls">
                <button class="draw-button" @click="performSingleDraw" :disabled="isDrawing">
                    <span v-if="!isDrawing">进行祈求 (x1)</span>
                    <span v-else>
                        <span class="button-spinner"></span> 祈求中...
                    </span>
                </button>
                <button class="draw-button draw-button-multi" @click="performMultiDraw(5)" :disabled="isDrawing">
                    <span v-if="!isDrawing">进行祈求 (x5)</span>
                    <span v-else>
                        <span class="button-spinner"></span> 祈求中...
                    </span>
                </button>
            </div>

            <!-- 抽卡次数显示 -->
            <div class="draw-counter">
                已祈求 {{ drawCount }} 次 (距下次SS+保底 {{ pityThresholdSSPlus - pityCounterSSPlus }} 次)
            </div>

            <!-- 卡片展示区域 -->
            <div class="card-display-area">
                <transition name="card-reveal" mode="out-in">
                    <!-- 加载状态 -->
                    <div v-if="isDrawing" key="loading" class="loading-overlay">
                        <div class="spinner"></div>
                        <p>正在沟通虚空...</p>
                        <p v-if="currentDrawType === 5" class="multi-draw-notice">(五连祈求进行中)</p>
                    </div>
                    <!-- 抽到的卡片 (单抽或五连最高) -->
                    <div v-else-if="drawnCard" :key="drawnCard.uniqueId" class="card-display-wrapper">
                        <div class="result-card" :class="getCardLevelClass(drawnCard.level)">
                            <div class="card-shine"></div>
                            <div class="card-header">
                                <span class="card-level-tag" :class="'tag-' + getCardLevelClass(drawnCard.level)">
                                    {{ getCardLevelLabel(drawnCard.level) }}
                                </span>
                                <span class="card-type">{{ drawnCard.card }}</span>
                            </div>
                            <h2 class="card-name">{{ drawnCard.name }}</h2>
                            <div class="card-content">
                                <p class="card-text">{{ drawnCard.text }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- 初始占位卡片 -->
                    <div v-else key="placeholder" class="placeholder-card">
                        <p>点击按钮开始祈求<br />获取你的天赋或道具</p>
                    </div>
                </transition>
            </div>

            <!-- 五连抽结果提示 -->
            <div v-if="multiDrawHighestLevel > 0 && !isDrawing && currentDrawType === 5" class="multi-draw-summary">
                本次五连祈求最高获得
                <span class="card-level-tag history-tag" :class="['tag-' + getCardLevelClass(multiDrawHighestLevel)]">
                    {{ getCardLevelLabel(multiDrawHighestLevel) }}
                </span>
                级别物品!<p> (已展示最高稀有度卡片，其余结果见历史记录)</p>
            </div>

            <!-- 抽卡历史记录区域 -->
            <div v-if="drawHistory.length > 0" class="draw-history-area">
                <h3 class="history-title">祈求记录</h3>

                <!-- 低等级卡片统计 -->
                <div class="low-level-summary">
                    <h4>低稀有度统计:</h4>
                    <span v-for="level in [1, 2, 3]" :key="'summary-' + level" class="low-level-item">
                        <span class="card-level-tag history-tag" :class="['tag-' + getCardLevelClass(level)]">
                            {{ getCardLevelLabel(level) }}
                        </span>
                        : {{ lowLevelCounts[level] || 0 }} 个
                    </span>
                </div>

                <!-- 高等级卡片列表 -->
                <div class="high-level-list">
                    <h4>高稀有度获得列表 (A级及以上):</h4>
                    <ul v-if="highLevelHistoryItems.length > 0">
                        <li v-for="card in highLevelHistoryItems" :key="card.uniqueId" class="high-level-item"
                            :class="['level-' + card.level]">
                            <span class="card-level-tag history-tag" :class="['tag-' + getCardLevelClass(card.level)]">
                                {{ getCardLevelLabel(card.level) }}
                            </span>
                            <span class="history-card-name">{{ card.name }}</span>
                            <span class="history-card-count">(第 {{ card.drawNumber }} 次祈求)</span>
                        </li>
                    </ul>
                    <p v-else class="no-high-level">尚未获得 A 级或以上物品</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'GachaSimulator',
    props: {
        cardData: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            isDrawing: false,
            drawnCard: null,
            drawCount: 0,
            drawHistory: [],
            uniqueCounter: 0,
            currentDrawType: 1,
            multiDrawHighestLevel: 0,
            // 单抽
            probabilitiesSingle: { 1: 37.4, 2: 32, 3: 16.2, 4: 9.0, 5: 3.54, 6: 1.42, 7: 0.43, 8: 0.01 },
            // 五连基础
            probabilitiesMulti: { 1: 44.595, 2: 30, 3: 15, 4: 6, 5: 3, 6: 1.2, 7: 0.2, 8: 0.005 },
            // 五连保底
            probabilitiesGuaranteedBPlus: { 3: 75.995, 4: 20.6, 5: 2, 6: 1.2, 7: 0.2, 8: 0.005 },
            levelMap: { 0: '?', 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S', 6: 'SS', 7: 'SSS', 8: 'SP' },
            // 追踪SS+保底计数
            pityCounterSSPlus: 0, 
            // SS+保底阈值
            pityThresholdSSPlus: 500, 
            // SS+保底概率
            probabilitiesPitySSPlus: { 6: 95, 7: 4.99, 8: 0.01 } 
        };
    },
    computed: {
        lowLevelCounts() {
            const counts = { 1: 0, 2: 0, 3: 0 };
            this.drawHistory.forEach(card => {
                if (counts.hasOwnProperty(card.level)) {
                    counts[card.level]++;
                }
            });
            return counts;
        },
        highLevelHistoryItems() {
            return this.drawHistory.filter(card => card.level >= 4).slice().reverse();
        }
    },
    methods: {
        performSingleDraw() {
            if (this.isDrawing || !this.validateCardData()) return;
            this.isDrawing = true;
            this.currentDrawType = 1;
            this.multiDrawHighestLevel = 0;
            const startingDrawCount = this.drawCount;

            setTimeout(() => {
                let drawnLevel;
                let cardToDisplay;
                const currentDrawNumber = startingDrawCount + 1;
                let triggeredSSPlusPity = false;

            
                this.pityCounterSSPlus++; 

                // 检查SS+保底
                if (this.pityCounterSSPlus >= this.pityThresholdSSPlus) {
                    drawnLevel = this.determinePitySSPlusLevel(); 
                    triggeredSSPlusPity = true; 
                    this.pityCounterSSPlus = 0; // 重置计数器
                } else {
                    drawnLevel = this.determineLevelFromProbabilities(this.probabilitiesSingle); // 正常概率
                    // 如果没触发保底，但抽到了SS+，也要重置计数器
                    if (drawnLevel >= 6) {
                        this.pityCounterSSPlus = 0;
                    }
                }
            

                cardToDisplay = this.findCardByLevel(drawnLevel, currentDrawNumber);

                this.drawnCard = cardToDisplay;
                this.drawHistory.push(this.drawnCard);
                this.drawCount++;
                this.isDrawing = false;

            }, 1200);
        },

        performMultiDraw(count = 5) {
            if (this.isDrawing || !this.validateCardData()) return;
            this.isDrawing = true;
            this.currentDrawType = 5;
            this.multiDrawHighestLevel = 0;
            const startingDrawCount = this.drawCount;
            const results = [];
            let maxLevelInBatch = 0;
            let hasGuaranteedItem = false;
            let ssPlusPityJustTriggeredInBatch = false; // 确保一个五连只触发一次硬保底

            for (let i = 0; i < count; i++) {
                const currentDrawNumber = startingDrawCount + i + 1;
                let drawnLevel;
                let drawnCard;
                let triggeredSSPlusPityThisDraw = false;

                // SS+ 多抽保底
                this.pityCounterSSPlus++; // 计数增加

                
                if (!ssPlusPityJustTriggeredInBatch && this.pityCounterSSPlus >= this.pityThresholdSSPlus) {
                    drawnLevel = this.determinePitySSPlusLevel(); 
                    triggeredSSPlusPityThisDraw = true;
                    ssPlusPityJustTriggeredInBatch = true; 
                    this.pityCounterSSPlus = 0; 
                } else {
                    drawnLevel = this.determineLevelFromProbabilities(this.probabilitiesMulti); 
                    
                    if (drawnLevel >= 6) {
                        this.pityCounterSSPlus = 0;
                    }
                }
            

                drawnCard = this.findCardByLevel(drawnLevel, currentDrawNumber);
                results.push(drawnCard);

                if (drawnCard.level >= 3) {
                    hasGuaranteedItem = true;
                }
                if (drawnCard.level > maxLevelInBatch) {
                    maxLevelInBatch = drawnCard.level;
                }
            }

            
            if (!hasGuaranteedItem && !ssPlusPityJustTriggeredInBatch) {
                const replaceIndex = Math.floor(Math.random() * count);
                const guaranteedLevel = this.determineLevelFromProbabilities(this.probabilitiesGuaranteedBPlus);
                const originalDrawNumber = results[replaceIndex].drawNumber;
                const guaranteedCard = this.findCardByLevel(guaranteedLevel, originalDrawNumber);

                // 替换的卡原本是SS+，需要重新调整保底计数器 
                if (results[replaceIndex].level >= 6 && guaranteedCard.level < 6) {
                    console.warn("B+保底替换掉了一个SS+卡片，SS+计数器可能未按预期恢复（此情况概率极低）。");
                }

                results[replaceIndex] = guaranteedCard;

                if (guaranteedCard.level > maxLevelInBatch) {
                    maxLevelInBatch = guaranteedCard.level;
                }
            }

            const highestLevelCards = results.filter(card => card.level === maxLevelInBatch);
            const cardToDisplay = highestLevelCards[Math.floor(Math.random() * highestLevelCards.length)];

            setTimeout(() => {
                this.drawnCard = cardToDisplay;
                this.drawHistory.push(...results);
                this.drawCount += count;
                this.multiDrawHighestLevel = maxLevelInBatch;
                this.isDrawing = false;
            }, 1500);
        },

        validateCardData() {
            if (!this.cardData || this.cardData.length === 0) {
                console.error("错误：卡池数据 (cardData) 为空或未提供！");
                this.drawnCard = this.createErrorCard("卡池配置错误", 0, this.drawCount + 1);
                return false;
            }
            return true;
        },

        determineLevelFromProbabilities(probabilities) {
            const random = Math.random() * 100;
            let cumulativeProbability = 0;
            const sortedLevels = Object.keys(probabilities)
                .map(Number)
                .sort((a, b) => a - b);

            for (const level of sortedLevels) {
                const prob = probabilities[level];
                if (typeof prob === 'number' && prob > 0) {
                    cumulativeProbability += prob;
                    if (random <= cumulativeProbability) {
                        return level;
                    }
                } else if (prob !== 0) {
                    console.warn(`等级 ${level} 的概率配置无效: ${prob}`);
                }
            }
            console.warn("确定抽卡等级时出现问题。可能概率总和略小于100%或随机数异常。返回最低有效等级。");
            const fallbackLevel = sortedLevels.find(level => probabilities[level] > 0 && typeof probabilities[level] === 'number');
            return fallbackLevel !== undefined ? fallbackLevel : 1;
        },

        // SS+保底等级
        determinePitySSPlusLevel() {
            const random = Math.random() * 100;
            let cumulativeProbability = 0;
            const pityLevels = [6, 7, 8]; // 按SS, SSS, SP顺序检查
            for (const level of pityLevels) {
                const prob = this.probabilitiesPitySSPlus[level];
                cumulativeProbability += prob;
                if (random <= cumulativeProbability) {
                    return level;
                }
            }
            // 回退
            console.warn("SS+保底概率计算回退");
            return 6; // 默认返回SS
        },

        findCardByLevel(level, drawNumber) {
            const possibleCards = this.cardData.filter(card => card.level === level);
            let card;

            if (possibleCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * possibleCards.length);
                card = {
                    ...possibleCards[randomIndex],
                    uniqueId: this.uniqueCounter++,
                    drawNumber: drawNumber
                };
            } else {
                console.warn(`警告：在卡池数据中找不到等级 ${level} 的卡片。`);
                card = this.createErrorCard(
                    `未找到等级 ${this.getCardLevelLabel(level)} 卡片`,
                    level,
                    drawNumber
                );
            }
            return card;
        },

        createErrorCard(message, level, drawNumber) {
            return {
                name: "虚空回响",
                text: message,
                level: level,
                card: "错误",
                uniqueId: this.uniqueCounter++,
                drawNumber: drawNumber
            };
        },

        getCardLevelLabel(level) {
            return this.levelMap[level] || '?';
        },

        getCardLevelClass(level) {
            const numericLevel = Number(level);
            if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 8) {
                return 'level-0';
            }
            return `level-${numericLevel}`;
        }
    }
};
</script>

<style>
/* Global styles (body, etc.) - Keep as is */
body {
    margin: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
/* All scoped styles from the original code - Keep as is */

.draw-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 5px;
    justify-content: center;
    flex-wrap: wrap;
}


.draw-button {
    padding: 16px 30px;
    font-size: 18px;
    min-width: 160px;
    text-align: center;
}


.draw-button-multi {
    background-color: #4895ef;
}

.draw-button-multi:hover:not(:disabled) {
    background-color: #3a86e0;
}

/* 五连抽加载提示 */
.multi-draw-notice {
    font-size: 14px;
    color: #868e96;
    margin-top: 8px;
}

/* 五连抽结果 */
.multi-draw-summary {
    width: 100%;
    max-width: 480px;
    /* 与历史记录区域同宽 */
    margin-top: -10px;
    /* 稍微向上移动，靠近卡片 */
    margin-bottom: 20px;
    padding: 12px 18px;
    background-color: #e9ecef;
    /* 淡灰色背景 */
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    color: #495057;
    border: 1px solid #dee2e6;
}

.multi-draw-summary .history-tag {
    vertical-align: baseline;
    margin: 0 4px;

}

.card-display-area {
    width: 100%;
    min-height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    position: relative;

}



@keyframes gradient-flow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes shine-sweep {
    0% {
        left: -100%;
    }

    50% {
        left: 125%;
    }

    100% {
        left: 125%;
    }
}

@keyframes button-spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.gacha-simulator-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 40px 15px 60px;
}

.gacha-container {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
}

.draw-button {
    /*padding: 18px 40px;*/
    border: none;
    border-radius: 16px;
    background-color: #f09819;
    color: #fff;
    /*font-size: 20px;*/
    font-weight: 600;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    vertical-align: top;
}

.draw-button:hover:not(:disabled) {
    background-color: #e67e22;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
}

.draw-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.draw-button:disabled {
    background-color: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transform: none;
}

.button-spinner {
    display: inline-block;
    border: 3px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: button-spin 1s linear infinite;
}

.draw-counter {
    color: #6c757d;
    font-size: 15px;
    margin-top: 10px;
}

.loading-overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    color: #6c757d;
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.spinner {
    border: 5px solid #e9ecef;
    border-top: 5px solid #f09819;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    animation: spin 1.2s linear infinite;
    margin-bottom: 20px;
}

.card-display-wrapper {
    width: 100%;
    max-width: 400px;
    perspective: 1500px;
}

.result-card {
    --gradient-border: linear-gradient(110deg, #f1f3f5, #dee2e6, #f1f3f5);
    --gradient-opacity: 0.5;
    --gradient-speed: 10s;
    --gradient-thickness: 2px;
    --tag-bg-color: #adb5bd;
    --tag-text-color: #fff;
    --shine-opacity: 0;
    background-color: #fff;
    color: #555;
    border-radius: 24px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
    padding: 35px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
    min-height: 290px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    z-index: 1;
}

.result-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.result-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: var(--gradient-thickness);
    background: var(--gradient-border);
    background-size: 300% 100%;
    opacity: var(--gradient-opacity);
    animation: gradient-flow var(--gradient-speed) linear infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: -1;
    pointer-events: none;
    transition: opacity 0.4s ease;
}

.placeholder-card {
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 24px;
    padding: 60px 40px;
    text-align: center;
    color: #adb5bd;
    font-size: 17px;
    line-height: 1.6;
    border: 2px dashed #ced4da;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 290px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
}

.card-type {
    font-size: 14px;
    color: #868e96;
    font-weight: 500;
    background-color: #f1f3f5;
    padding: 5px 12px;
    border-radius: 10px;
}

.card-level-tag {
    font-size: 13px;
    font-weight: bold;
    padding: 7px 15px;
    border-radius: 15px;
    background: var(--tag-bg-color);
    color: var(--tag-text-color);
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
    line-height: 1;
    white-space: nowrap;
}

.card-name {
    font-size: 24px;
    font-weight: 700;
    color: #343a40;
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 1.3;
    text-align: center;
    padding-bottom: 10px;
    position: relative;
    z-index: 2;
}

.card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
}

.card-text {
    font-size: 16px;
    color: #495057;
    line-height: 1.7;
    text-align: center;
    margin-bottom: 0;
    white-space: pre-line;
}

.level-0 {
    --tag-bg-color: #6c757d;
    --gradient-border: linear-gradient(110deg, #dee2e6, #adb5bd, #dee2e6);
    --gradient-opacity: 0.4;
    --gradient-speed: 11s;
    --gradient-thickness: 1px;
}

.level-1 {
    --tag-bg-color: #adb5bd;
    --gradient-border: linear-gradient(110deg, #f8f9fa, #e9ecef, #ced4da, #adb5bd, #ced4da, #e9ecef, #f8f9fa);
    --gradient-opacity: 0.5;
    --gradient-speed: 9s;
    --gradient-thickness: 1px;
}

.level-2 {
    --tag-bg-color: #52b788;
    --gradient-border: linear-gradient(110deg, #d8f3dc, #b7e4c7, #95d5b2, #74c69d, #52b788, #74c69d, #95d5b2, #b7e4c7, #d8f3dc);
    --gradient-opacity: 0.6;
    --gradient-speed: 8s;
    --gradient-thickness: 2px;
}

.level-3 {
    --tag-bg-color: #4895ef;
    --gradient-border: linear-gradient(110deg, #caf0f8, #ade8f4, #90e0ef, #48cae4, #00b4d8, #48cae4, #90e0ef, #ade8f4, #caf0f8);
    --gradient-opacity: 0.7;
    --gradient-speed: 7s;
    --gradient-thickness: 2px;
}

.level-4 {
    --tag-bg-color: #a78bfa;
    --gradient-border: linear-gradient(110deg, #e9d5ff, #d8b4fe, #c084fc, #a855f7, #9333ea, #a855f7, #c084fc, #d8b4fe, #e9d5ff);
    --gradient-opacity: 0.8;
    --gradient-speed: 6s;
    --gradient-thickness: 2px;
}

.level-5 {
    --tag-bg-color: #ffc107;
    --tag-text-color: #493803;
    text-shadow: none;
    --gradient-border: linear-gradient(110deg, #fff8e1, #ffecb3, #ffd54f, #ffc107, #ffb300, #ffc107, #ffd54f, #ffecb3, #fff8e1);
    --gradient-opacity: 1;
    --gradient-speed: 4.5s;
    --gradient-thickness: 3px;
    --shine-opacity: 0.3;
}

.level-6 {
    --tag-bg-color: #fd7e14;
    --gradient-border: linear-gradient(110deg, #fff3e0, #ffe0b2, #ffb74d, #fd7e14, #f57c00, #e65100, #f57c00, #fd7e14, #ffb74d, #ffe0b2, #fff3e0);
    --gradient-opacity: 1;
    --gradient-speed: 3.8s;
    --gradient-thickness: 3px;
    --shine-opacity: 0.35;
}

.level-7 {
    --tag-bg-color: linear-gradient(45deg, #e75aa0, #d63384, #b32a72);
    --gradient-border: linear-gradient(110deg, #fce4ec, #f8bbd0, #f06292, #d63384, #c2185b, #ad1457, #c2185b, #d63384, #f06292, #f8bbd0, #fce4ec);
    --gradient-opacity: 1;
    --gradient-speed: 3.2s;
    --gradient-thickness: 4px;
    --shine-opacity: 0.4;
}

.level-8 {
    --gradient-border: linear-gradient(110deg, #ffdd57, #ff964f, #ff7b7b, #f771e1, #b78dff, #7ac7ff, #69f0ae, #a5ff7a, #f4ff6a, #ffdd57);
    --gradient-opacity: 1;
    --gradient-speed: 2.5s;
    --gradient-thickness: 4px;
    --shine-opacity: 0.55;
}

.level-8 .card-name {
    color: #a77c04;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

.card-shine {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 75%;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 100%);
    transform: skewX(-25deg);
    pointer-events: none;
    opacity: var(--shine-opacity);
    transition: opacity 0.4s ease;
    animation: shine-sweep 3.0s infinite linear;
    animation-delay: 1s;
    z-index: 0;
}

.card-reveal-enter-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-reveal-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.card-reveal-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
}

.card-reveal-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.card-reveal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.placeholder-card.card-reveal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.draw-history-area {
    width: 100%;
    max-width: 480px;
    margin-top: 30px;
    padding: 25px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    border: 1px solid #e9ecef;
}

.history-title {
    text-align: center;
    color: #495057;
    font-size: 18px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dee2e6;
}

.low-level-summary {
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 10px;
}

.low-level-summary h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 15px;
    color: #6c757d;
    font-weight: 500;
}

.low-level-item {
    display: inline-block;
    margin-right: 18px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #495057;
    white-space: nowrap;
}

.history-tag {
    padding: 4px 10px;
    font-size: 11px;
    margin-right: 6px;
    vertical-align: middle;
}

.high-level-list h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 15px;
    color: #343a40;
    font-weight: 500;
}

.high-level-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 400px;
    overflow-y: auto;
}

.high-level-item {
    display: flex;
    align-items: center;
    padding: 10px 5px;
    border-bottom: 1px dashed #e9ecef;
    font-size: 14px;
    position: relative;
}

.high-level-item:last-child {
    border-bottom: none;
}

.history-card-name {
    color: #343a40;
    font-weight: 500;
    margin-left: 5px;
    margin-right: 8px;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-card-count {
    color: #adb5bd;
    font-size: 13px;
    white-space: nowrap;
    margin-left: auto;
}

.no-high-level {
    color: #adb5bd;
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
    padding: 10px;
}

.tag-level-0 {
    background: #6c757d;
    color: #fff;
}

.tag-level-1 {
    background: #adb5bd;
    color: #fff;
}

.tag-level-2 {
    background: #52b788;
    color: #fff;
}

.tag-level-3 {
    background: #4895ef;
    color: #fff;
}

.tag-level-4 {
    background: #a78bfa;
    color: #fff;
}

.tag-level-5 {
    background: #ffc107;
    color: #493803;
    text-shadow: none;
}

.tag-level-6 {
    background: #fd7e14;
    color: #fff;
}

.tag-level-7 {
    background: linear-gradient(45deg, #e75aa0, #d63384, #b32a72);
    color: #fff;
}

.tag-level-8 {
    background: var(--gradient-border);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    background-size: 300% 100%;
    animation: gradient-flow var(--gradient-speed, 2.5s) linear infinite;
}
</style>