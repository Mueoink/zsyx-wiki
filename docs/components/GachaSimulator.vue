<template>
    <div class="gacha-simulator-page">
        <div class="gacha-container">
            <!-- 抽卡控制区域 -->
            <div class="draw-controls">
                <button class="draw-button" @click="performDraw" :disabled="isDrawing">
                    <span v-if="!isDrawing">进行祈求</span>
                    <span v-else>
                        <span class="button-spinner"></span> 祈求中...
                    </span>
                </button>
            </div>

            <!-- 抽卡次数显示 -->
            <div class="draw-counter">
                已祈求 {{ drawCount }} 次
            </div>

            <!-- 卡片展示区域 -->
            <div class="card-display-area">
                <transition name="card-reveal" mode="out-in">
                    <!-- 加载状态 -->
                    <div v-if="isDrawing" key="loading" class="loading-overlay">
                        <div class="spinner"></div>
                        <p>正在沟通虚空...</p>
                    </div>
                    <!-- 抽到的卡片 -->
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
                    <h4>高稀有度获得列表:</h4>
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
            // probabilities: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 100 },
            probabilities: { 1: 37.4, 2: 32, 3: 16.2, 4: 9.0, 5: 3.54, 6: 1.42, 7: 0.43, 8: 0.01 },
            levelMap: { 0: '?', 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S', 6: 'SS', 7: 'SSS', 8: 'SP' }
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
            // 直接过滤 drawHistory，保留 level >= 4 的卡片
            return this.drawHistory.filter(card => card.level >= 4);
        }
    },
    methods: {
        performDraw() {
            if (this.isDrawing || !this.cardData || this.cardData.length === 0) return;
            this.isDrawing = true;
            this.drawCount++;

            setTimeout(() => {
                const drawnLevel = this.determineDrawLevel();
                const possibleCards = this.cardData.filter(card => card.level === drawnLevel);
                let cardToDisplay = null;
                const currentDrawCount = this.drawCount; // 获取当前的抽卡次数

                if (possibleCards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * possibleCards.length);
                    cardToDisplay = {
                        ...possibleCards[randomIndex],
                        uniqueId: this.uniqueCounter++,
                        drawNumber: currentDrawCount
                    };
                } else {
                    console.warn(`警告：在卡池数据中找不到等级 ${drawnLevel} 的卡片。`);
                    cardToDisplay = {
                        name: "虚空回响",
                        text: `无法找到等级 ${this.getCardLevelLabel(drawnLevel)} (${drawnLevel}) 的有效卡片...`,
                        level: 0, // 使用 level 0 表示错误
                        card: "错误",
                        uniqueId: this.uniqueCounter++,
                        drawNumber: currentDrawCount
                    };
                }

                this.drawnCard = cardToDisplay;
                // 确保即使是错误卡片也被添加到历史记录中
                this.drawHistory.push(this.drawnCard);
                this.isDrawing = false;

            }, 1200); // 模拟抽卡延迟
        },

        determineDrawLevel() {
            const random = Math.random() * 100;
            let cumulativeProbability = 0;
            // 按数字顺序迭代等级
            const sortedLevels = Object.keys(this.probabilities)
                .map(Number)
                .sort((a, b) => a - b);

            for (const level of sortedLevels) {
                const prob = this.probabilities[level];
                // 概率值校验
                if (typeof prob === 'number' && prob > 0) {
                    cumulativeProbability += prob;
                    if (random <= cumulativeProbability) {
                        return level;
                    }
                } else if (prob !== 0) { // 允许概率为0，但不允许非数字或负数
                    console.warn(`等级 ${level} 的概率配置无效: ${prob}`);
                }
            }
            
            console.warn("确定抽卡等级时概率总和可能不足100%或随机数异常。返回配置中的最低有效等级。");
            const fallbackLevel = sortedLevels.find(level => this.probabilities[level] > 0 && typeof this.probabilities[level] === 'number');
            return fallbackLevel !== undefined ? fallbackLevel : 1; 
        },

        getCardLevelLabel(level) {
            return this.levelMap[level] || '?'; // 处理 level 0 或无效 level
        },

        getCardLevelClass(level) {
            const numericLevel = Number(level);
            // 统一返回 0
            if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 8) {
                return 'level-0';
            }
            return `level-${numericLevel}`;
        }
    }
};
</script>

<style>

body {
    margin: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
}
</style>

<style scoped>

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

.draw-controls {
    margin-bottom: 5px;
}

.draw-button {
    padding: 18px 40px;
    border: none;
    border-radius: 16px;
    background-color: #f09819;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
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
}

.card-display-area {
    width: 100%;
    min-height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
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
    /* 默认边框厚度 */
    --tag-bg-color: #adb5bd;
    /* 默认标签背景色 */
    --tag-text-color: #fff;
    /* 默认标签文字颜色 */
    --shine-opacity: 0;

    background-color: #fff;
    color: #555;
    /* 基础文字颜色 */
    border-radius: 24px;
    /* 圆角 */
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
    /* 卡片阴影 */
    padding: 35px;
    /* 内边距 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    /* 用于定位伪元素和闪光 */
    overflow: hidden;
    /* 隐藏溢出的闪光和边框 */
    min-height: 290px;
    /* 最小高度 */
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    z-index: 1;
}

.result-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

/* 卡片流动边框 */
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

/* 初始占位卡片 */
.placeholder-card {
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 24px;
    padding: 60px 40px;
    text-align: center;
    color: #adb5bd;
    /* 灰色文字 */
    font-size: 17px;
    line-height: 1.6;
    border: 2px dashed #ced4da;
    /* 虚线边框 */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 290px;
}

/* 卡片内部结构 */
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
    /* 使用变量定义背景 */
    color: var(--tag-text-color);
    /* 使用变量定义文字颜色 */
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
    line-height: 1;
    white-space: nowrap;
}

.card-name {
    font-size: 24px;
    font-weight: 700;
    color: #343a40;
    /* 深灰色标题 */
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
    /* 错误或未知等级 */
    --tag-bg-color: #6c757d;
    --gradient-border: linear-gradient(110deg, #dee2e6, #adb5bd, #dee2e6);
    --gradient-opacity: 0.4;
    --gradient-speed: 11s;
    --gradient-thickness: 1px;
}

.level-1 {
    /* D */
    --tag-bg-color: #adb5bd;
    --gradient-border: linear-gradient(110deg, #f8f9fa, #e9ecef, #ced4da, #adb5bd, #ced4da, #e9ecef, #f8f9fa);
    --gradient-opacity: 0.5;
    --gradient-speed: 9s;
    --gradient-thickness: 1px;
}

.level-2 {
    /* C */
    --tag-bg-color: #52b788;
    --gradient-border: linear-gradient(110deg, #d8f3dc, #b7e4c7, #95d5b2, #74c69d, #52b788, #74c69d, #95d5b2, #b7e4c7, #d8f3dc);
    --gradient-opacity: 0.6;
    --gradient-speed: 8s;
    --gradient-thickness: 2px;
}

.level-3 {
    /* B */
    --tag-bg-color: #4895ef;
    --gradient-border: linear-gradient(110deg, #caf0f8, #ade8f4, #90e0ef, #48cae4, #00b4d8, #48cae4, #90e0ef, #ade8f4, #caf0f8);
    --gradient-opacity: 0.7;
    --gradient-speed: 7s;
    --gradient-thickness: 2px;
}

.level-4 {
    /* A */
    --tag-bg-color: #a78bfa;
    --gradient-border: linear-gradient(110deg, #e9d5ff, #d8b4fe, #c084fc, #a855f7, #9333ea, #a855f7, #c084fc, #d8b4fe, #e9d5ff);
    --gradient-opacity: 0.8;
    --gradient-speed: 6s;
    --gradient-thickness: 2px;
}

.level-5 {
    /* S */
    --tag-bg-color: #ffc107;
    --tag-text-color: #493803;
    /* S级标签用深色文字 */
    text-shadow: none;
    --gradient-border: linear-gradient(110deg, #fff8e1, #ffecb3, #ffd54f, #ffc107, #ffb300, #ffc107, #ffd54f, #ffecb3, #fff8e1);
    --gradient-opacity: 1;
    --gradient-speed: 4.5s;
    --gradient-thickness: 3px;
    --shine-opacity: 0.3;
    /* S级及以上增加闪光 */
}

.level-6 {
    /* SS */
    --tag-bg-color: #fd7e14;
    --gradient-border: linear-gradient(110deg, #fff3e0, #ffe0b2, #ffb74d, #fd7e14, #f57c00, #e65100, #f57c00, #fd7e14, #ffb74d, #ffe0b2, #fff3e0);
    --gradient-opacity: 1;
    --gradient-speed: 3.8s;
    --gradient-thickness: 3px;
    --shine-opacity: 0.35;
}

.level-7 {
    /* SSS */
    --tag-bg-color: linear-gradient(45deg, #e75aa0, #d63384, #b32a72);
    --gradient-border: linear-gradient(110deg, #fce4ec, #f8bbd0, #f06292, #d63384, #c2185b, #ad1457, #c2185b, #d63384, #f06292, #f8bbd0, #fce4ec);
    --gradient-opacity: 1;
    --gradient-speed: 3.2s;
    --gradient-thickness: 4px;
    --shine-opacity: 0.4;
}

.level-8 {
    /* SP */
    --gradient-border: linear-gradient(110deg, #ffdd57, #ff964f, #ff7b7b, #f771e1, #b78dff, #7ac7ff, #69f0ae, #a5ff7a, #f4ff6a, #ffdd57);
    /* 彩虹渐变 */
    --gradient-opacity: 1;
    --gradient-speed: 2.5s;
    /* 最快速度 */
    --gradient-thickness: 4px;
    /* 最厚边框 */
    --shine-opacity: 0.55;
    /* 最强闪光 */
}

/* SP卡片特殊名字样式 */
.level-8 .card-name {
    color: #a77c04;
    /* 金色文字 */
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
    /* 白色高光 */
}

/* 卡片闪光效果 */
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
    /* 扫光动画 */
    animation-delay: 1s;
    /* 延迟启动 */
    z-index: 0;
}

/* 卡片出现/消失过渡 */
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

/* 抽卡历史记录区域 */
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

/* 低等级统计 */
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
    /* 横向排列 */
    margin-right: 18px;
    /* 项目间距 */
    margin-bottom: 8px;
    /* 行间距 */
    font-size: 14px;
    color: #495057;
    white-space: nowrap;
    /* 防止换行 */
}

/* 历史记录中的标签 */
.history-tag {
    padding: 4px 10px;
    /* 比卡片上的标签小 */
    font-size: 11px;
    margin-right: 6px;
    vertical-align: middle;
}

/* 高等级列表 */
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
    /* 显示省略号 */
    white-space: nowrap;
}

.history-card-count {
    color: #adb5bd;
    /* 计数颜色 */
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

/* 标签等级颜色定义 */
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
    /* 彩虹渐变 */
    background: var(--gradient-border);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    background-size: 300% 100%;
    animation: gradient-flow var(--gradient-speed, 2.5s) linear infinite;
}
</style>