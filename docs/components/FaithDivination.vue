<template>
    <div class="divination-page"> 
        <div class="divination-container">
            <h1 class="main-title">信仰回响占卜</h1>

            <transition name="fade" mode="out-in">
                <div class="divination-card" :key="step">

                    <!-- 阶段一：信息输入 -->
                    <div v-if="step === 'input'" class="step-content">
                        <div class="step-header">
                            <span class="step-number">第一步</span>
                            <h2 class="step-title">虔诚祈问</h2>
                        </div>
                        <p class="description">请选择你心中所问之事，并告知你的信仰归属，以获得更精准的回响。</p>
                        <div class="form-group">
                            <label for="subject">占卜主题：</label>
                            <select id="subject" v-model="selectedSubject" class="select-input">
                                <option disabled value="">请选择...</option>
                                <option v-for="sub in availableSubjects" :key="sub" :value="sub">
                                    {{ sub }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="userFaith">你的信仰：</label>
                            <select id="userFaith" v-model="selectedUserFaith" class="select-input">
                                <option disabled value="">请选择...</option>
                                <option v-for="faith in allFaiths" :key="faith" :value="faith">
                                    {{ faith }}
                                </option>
                            </select>
                        </div>
                        <button @click="startDivination" :disabled="!selectedSubject || !selectedUserFaith"
                            class="action-button primary-button"
                            :class="{ 'disabled-button': !selectedSubject || !selectedUserFaith }">
                            开始感应命途
                        </button>
                    </div>

                    <!-- 阶段二：命途抉择 -->
                    <div v-else-if="step.startsWith('select')" class="step-content">
                        <div class="step-header">
                            <span class="step-number">第二步</span>
                            <h2 class="step-title">聆听命途的低语</h2>
                        </div>
                        <p class="description">感应涌动的力量，选择指引着 <strong
                                :style="{ color: selectionTargetColor, fontWeight: '700' }">{{ currentSelectionTarget
                                }}</strong> 的命途领域。</p>
                        <p class="sub-description">(选择命途，其下的具体信仰将在最后揭示)</p>

                        <div v-if="isSensing" class="sensing-indicator">
                            <div class="spinner"></div>
                            <span>正在感应命途的回响... 请稍候</span>
                        </div>

                        <div v-else class="path-options-grid two-options">
                            <button v-for="path in currentPathOptions" :key="path" class="path-card option-button"
                                @click="selectPath(path)">
                                <span class="path-name">{{ path }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- 阶段三：结果展示 -->
                    <div v-else-if="step === 'results'" class="step-content result-card-content">
                        <div class="result-header">
                            <span class="result-title-label">最终启示</span>
                            <h2 class="result-main-title">信仰回响已显现</h2>
                        </div>

                        <div class="results-summary">
                            <p><strong>占卜主题：</strong> {{ selectedSubject }}</p>
                            <p><strong>你的信仰：</strong> {{ selectedUserFaith }}</p>
                        </div>

                        <div class="results-display">
                            <!-- 源点 -->
                            <div class="result-item">
                                <span class="result-label" style="color: #9a8c98;"><strong>【源点 Source】</strong></span>
                                <span class="result-faith" :style="{ color: getFaithColor(selectedFaiths.source) }">{{
                                    selectedFaiths.source || '---' }}</span>
                                <div class="result-placeholder">
                                    <!-- 调用 getInterpretation 获取解读 -->
                                    <p>{{ getInterpretation(selectedSubject, selectedFaiths.source, '源点') }}</p>
                                </div>
                            </div>
                            <!-- 流转 -->
                            <div class="result-item">
                                <span class="result-label" style="color: #4a7c59;"><strong>【流转 Flux】</strong></span>
                                <span class="result-faith" :style="{ color: getFaithColor(selectedFaiths.flux) }">{{
                                    selectedFaiths.flux || '---' }}</span>
                                <div class="result-placeholder">
                                    <p>{{ getInterpretation(selectedSubject, selectedFaiths.flux, '流转') }}</p>
                                </div>
                            </div>
                            <!-- 启示 -->
                            <div class="result-item">
                                <span class="result-label" style="color: #c08497;"><strong>【启示 Outlook】</strong></span>
                                <span class="result-faith" :style="{ color: getFaithColor(selectedFaiths.outlook) }">{{
                                    selectedFaiths.outlook || '---' }}</span>
                                <div class="result-placeholder">
                                    <p>{{ getInterpretation(selectedSubject, selectedFaiths.outlook, '启示') }}</p>
                                </div>
                            </div>
                        </div>
                        <!-- 综合解读 -->
                        <div class="result-placeholder final-interpretation">
                            <p style="font-weight: 600; color: #5c5470; margin-bottom: 10px;">综合解读：</p>
                            <!-- 获取组合解读 -->
                            <p>{{ getCombinedInterpretation() }}</p>
                        </div>

                        <button @click="resetDivination" class="action-button restart-button">
                            再次占卜
                        </button>
                    </div>

                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue';


const props = defineProps({
    interpretations: {
        type: Array,
        required: true,
        default: () => []
        // 示例结构: [{ type: '恋爱运势', faith: '欺诈', position: '源点', result: '解读文本...' }, ...]
        //          [{ type: '恋爱运势', faith: '欺诈-命运-秩序', position: '综合', result: '组合解读...' }, ...]
    }
});

const { interpretations } = toRefs(props);

// 基础数据 
const faithData = {
    '文明': { faiths: ['秩序', '真理', '战争'], color: '#5f79b8' },
    '混沌': { faiths: ['混乱', '痴愚', '沉默'], color: '#c87a8f' },
    '生命': { faiths: ['诞育', '繁荣', '死亡'], color: '#7aa974' },
    '沉沦': { faiths: ['污堕', '腐朽', '湮灭'], color: '#9a8c98' },
    '存在': { faiths: ['时间', '记忆'], color: '#c5a169' },
    '虚无': { faiths: ['命运', '欺诈'], color: '#80a6ad' }
};
const allPaths = Object.keys(faithData);
const allFaiths = allPaths.reduce((acc, path) => acc.concat(faithData[path].faiths), []);
const availableSubjects = ref([
    '恋爱运势', '事业前程', '生活指引', '人际关系', '财运机遇', '学业考试', '综合运势'
]);

// 状态
const step = ref('input');
const selectedSubject = ref('');
const selectedUserFaith = ref('');
const currentPathOptions = ref([]);
const selectedFaiths = ref({ source: null, flux: null, outlook: null });
const isSensing = ref(false);
const sensingTimeoutId = ref(null);


const currentSelectionTarget = computed(() => {
    if (step.value === 'selectSource') return '源点 (Source)';
    if (step.value === 'selectFlux') return '流转 (Flux)';
    if (step.value === 'selectOutlook') return '启示 (Outlook)';
    return '';
});

const selectionTargetColor = computed(() => {
    if (step.value === 'selectSource') return '#9a8c98';
    if (step.value === 'selectFlux') return '#4a7c59';
    if (step.value === 'selectOutlook') return '#c08497';
    return '#333';
});

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
function getRandomElement(array) {
    if (!array || array.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function generatePathOptions() {
    isSensing.value = true;
    currentPathOptions.value = [];
    if (sensingTimeoutId.value) clearTimeout(sensingTimeoutId.value);

    sensingTimeoutId.value = setTimeout(() => {
        const shuffledPaths = shuffleArray([...allPaths]);
        currentPathOptions.value = shuffledPaths.slice(0, 2); // 只取前2个
        isSensing.value = false;
        sensingTimeoutId.value = null;
    }, 2800);
}

function getFaithColor(faithName) {
    if (!faithName) return '#555';
    for (const path in faithData) {
        if (faithData[path].faiths.includes(faithName)) {
            return faithData[path].color;
        }
    }
    return '#555';
}

function startDivination() {
    if (!selectedSubject.value || !selectedUserFaith.value) return;
    step.value = 'selectSource';
    generatePathOptions();
}

function selectPath(chosenPath) {
    if (isSensing.value) return;

    let position = '';
    if (step.value === 'selectSource') position = 'source';
    else if (step.value === 'selectFlux') position = 'flux';
    else if (step.value === 'selectOutlook') position = 'outlook';
    else return;

    const faithsInPath = faithData[chosenPath].faiths;
    const selected = getRandomElement(faithsInPath);
    if (!selected) {
        console.error(`无法从命途 ${chosenPath} 中抽取信仰`);
        return;
    }
    selectedFaiths.value[position] = selected;

    let nextStep = '';
    if (position === 'source') nextStep = 'selectFlux';
    else if (position === 'flux') nextStep = 'selectOutlook';
    else nextStep = 'results';

    step.value = nextStep;

    if (nextStep !== 'results') {
        generatePathOptions();
    } else {
        if (sensingTimeoutId.value) clearTimeout(sensingTimeoutId.value);
        isSensing.value = false;
        currentPathOptions.value = [];
    }
}
function resetDivination() {
    if (sensingTimeoutId.value) clearTimeout(sensingTimeoutId.value);
    step.value = 'input';
    selectedSubject.value = '';
    selectedUserFaith.value = '';
    currentPathOptions.value = [];
    selectedFaiths.value = { source: null, flux: null, outlook: null };
    isSensing.value = false;
}

function getInterpretation(subject, faith, position) {
    if (!subject || !faith || !position || !interpretations.value) {
        return '信息不完整，无法获取解读。';
    }
    const found = interpretations.value.find(item =>
        item.type === subject &&
        item.faith === faith &&
        item.position === position
    );
    // 返回找到的解读，如果找不到则返回提示信息
    return found ? found.result : `【${subject}】>【${position}】>【${faith}】\n暂无对应解读，请发挥想象力或等待后续补充！`;
}

function getCombinedInterpretation() {
    const { source, flux, outlook } = selectedFaiths.value;
    const subject = selectedSubject.value;

    if (!subject || !source || !flux || !outlook || !interpretations.value) {
        return '信息不完整，无法获取综合解读。';
    }

    const combinedFaith = `${source}-${flux}-${outlook}`;

    const found = interpretations.value.find(item =>
        item.type === subject &&
        item.faith === combinedFaith &&
        item.position === '综合'
    );
    // 返回找到的组合解读，如果找不到则返回提示信息
    return found ? found.result : `【${subject}】> 组合：【${source}】-【${flux}】-【${outlook}】\n暂无对应组合解读。请尝试结合 源点、流转、启示 的单独解读进行理解，或等待后续补充！`;
}

</script>

<style scoped>
/* --- 全局与布局 --- */
.divination-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    font-family: 'Noto Sans SC', 'Helvetica Neue', Arial, sans-serif;
}

.divination-container {
    width: 100%;
    max-width: 800px;
}

.main-title {
    text-align: center;
    color: #4a4a4a;
    margin-bottom: 2rem;
    font-size: 2.4em;
    font-weight: 600;
    letter-spacing: 1px;
}

/* --- 卡片样式 --- */
.divination-card {
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
    padding: 35px 40px;
    margin-bottom: 30px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    border: 1px solid #e8e8e8;
}

.divination-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(to right, #fbc2eb, #a6c1ee);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: -1;
}

.divination-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.divination-card:hover::before {
    opacity: 1;
}


.step-header,
.result-header {
    margin-bottom: 25px;
    text-align: center;
}

.step-number,
.result-title-label {
    font-size: 14px;
    color: #888;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
    display: block;
    margin-bottom: 5px;
}

.step-title,
.result-main-title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    line-height: 1.3;
}

.description {
    font-size: 16px;
    color: #666;
    margin-bottom: 25px;
    line-height: 1.7;
    text-align: center;
}

.sub-description {
    font-size: 14px;
    color: #999;
    margin-top: -15px;
    margin-bottom: 30px;
    text-align: center;
    font-style: italic;
}


.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-size: 15px;
    font-weight: 600;
}

.select-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #dcdcdc;
    border-radius: 10px;
    background-color: #fdfdfd;
    font-size: 16px;
    color: #444;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 1em;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.select-input:focus {
    outline: none;
    border-color: #bb86fc;
    box-shadow: 0 0 0 3px rgba(187, 134, 252, 0.15);
}

/* 按钮通用样式 */
.action-button,
.option-button {
    padding: 15px 25px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    outline: none;
    border: 2px solid #e0e0e0;
    background-color: #fff;
    color: #c08497;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    display: block;
    width: 100%;
    text-align: center;
}

.action-button:hover:not(.disabled-button),
.option-button:hover {
    background-color: #f4acb7;
    color: #fff;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
    border-color: #e598aa;
}

.action-button:active:not(.disabled-button),
.option-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.primary-button {
    margin-top: 25px;
    background-color: #ad7a99;
    color: #fff;
    border: none;
}

.primary-button:hover:not(.disabled-button) {
    background-color: #9a6a89;
    border: none;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.restart-button {
    margin-top: 30px;
    padding: 18px 36px;
    font-size: 18px;
    background-color: #8d6e97;
    color: #fff;
    border: none;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
}

.restart-button:hover {
    background-color: #7b5e87;
    box-shadow: 0 7px 18px rgba(0, 0, 0, 0.15);
    border: none;
}

.disabled-button {
    background-color: #f0f0f0;
    color: #bbb;
    cursor: not-allowed;
    border-color: #e0e0e0;
    box-shadow: none;
}

.disabled-button:hover {
    background-color: #f0f0f0;
    color: #bbb;
    transform: none;
    box-shadow: none;
    border-color: #e0e0e0;
}

/* 命途选择网格 */
.path-options-grid.two-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 20px;
}

@media (max-width: 500px) {
    .path-options-grid.two-options {
        grid-template-columns: 1fr;
        gap: 15px;
    }
}

.path-card {
    padding: 20px 15px;
}

.path-name {
    font-size: 18px;
    font-weight: 700;
}

/* 感应状态 */
.sensing-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 2rem;
    text-align: center;
    color: #777;
    font-size: 16px;
}

.spinner {
    border: 5px solid rgba(173, 122, 153, 0.2);
    border-left-color: #ad7a99;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    animation: spin 1.2s linear infinite;
    margin-bottom: 1.5rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 结果展示 */
.results-summary {
    background-color: #f8f9fa;
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 30px;
    border: 1px solid #eee;
}

.results-summary p {
    margin: 8px 0;
    color: #555;
    font-size: 15px;
}

.results-summary strong {
    color: #333;
    font-weight: 600;
}

.results-display {
    margin-top: 20px;
}

.result-item {
    margin-bottom: 25px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    border-left: 5px solid;
    border-color: #e0e0e0;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
}

.result-item:nth-child(1) {
    border-left-color: #9a8c98;
}

.result-item:nth-child(2) {
    border-left-color: #4a7c59;
}

.result-item:nth-child(3) {
    border-left-color: #c08497;
}

.result-label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
}

.result-label strong {
    font-weight: 700;
}

.result-faith {
    display: block;
    font-size: 26px;
    font-weight: 700;
    margin-top: 5px;
    margin-bottom: 10px;
}

.result-placeholder {
    font-size: 15px;
    color: #666;
    margin-top: 15px;
    line-height: 1.7;
    padding: 15px;
    background-color: #fafafa;
    border-radius: 8px;
    border: 1px dashed #e5e5e5;
    min-height: 50px;
}

.result-placeholder p {
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
}

.final-interpretation {
    margin-top: 30px;
    border-left: 5px solid #b39ddb;
    background-color: #f7f5fa;
    padding: 20px;
}

.final-interpretation p {
    margin-bottom: 10px;
    white-space: pre-wrap;
    word-break: break-word;
}

.final-interpretation p:first-child {
    margin-bottom: 10px;
    white-space: normal;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-list-move,
.fade-list-enter-active,
.fade-list-leave-active {
    transition: all 0.5s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
    opacity: 0;
    transform: translateY(15px);
}
</style>