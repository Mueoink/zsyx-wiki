<!-- .vitepress/components/OCCreator.vue -->
<script setup>
import { reactive, computed, watch, ref } from 'vue';
// 确保这个路径与你的项目结构一致！
import { professionsData } from '../js/oc-data';
const props = defineProps({
    itemsData: { type: Array, required: true, default: () => [] }
});

const avatarPreviewUrl = ref(null);
const fullbodyPreviewUrl = ref(null);

const oc = reactive({
    name: 'Mueo',
    displayMode: 'avatar',
    avatarUrl: 'https://cdn.jsdelivr.net/gh/morax-hhh/files/img/202404172352125.webp',
    fullbodyUrl: 'https://cdn.jsdelivr.net/gh/morax-hhh/files/img/202404172350431.webp',
    avatarFile: null,
    fullbodyFile: null,
    info: { height: '185cm', weight: '70kg', gender: '男', age: 24, birthday: '10月26日', hobby: '探索未知, 收集古物' },
    keyStats: { faith: '真理', profession: '博识学者', ascensionPath: 418, stairway: 56, globalRank: 107, pathRank: 123 },
    attributes: { piety: 0.5, intelligence: 1.6, constitution: 1.5, charisma: 1.7, sanity: 2.0, morality: 0.9, combatPower: 1.8 },
    backpack: [],
});


const faiths = Object.keys(professionsData);
const availableProfessions = computed(() => professionsData[oc.keyStats.faith]?.filter(p => p.name) || []);
watch(() => oc.keyStats.faith, () => { oc.keyStats.profession = availableProfessions.value[0]?.name || ''; });

const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    const previewUrlRef = type === 'avatar' ? avatarPreviewUrl : fullbodyPreviewUrl;
    if (previewUrlRef.value) URL.revokeObjectURL(previewUrlRef.value);
    oc[`${type}File`] = file;
    previewUrlRef.value = URL.createObjectURL(file);
};
const clearFile = (type) => {
    oc[`${type}File`] = null;
    const previewUrlRef = type === 'avatar' ? avatarPreviewUrl : fullbodyPreviewUrl;
    if (previewUrlRef.value) URL.revokeObjectURL(previewUrlRef.value);
    previewUrlRef.value = null;
};
const displayAvatarSrc = computed(() => avatarPreviewUrl.value || oc.avatarUrl);
const displayFullbodySrc = computed(() => fullbodyPreviewUrl.value || oc.fullbodyUrl);

const levelMap = { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S', 6: 'SS', 7: 'SSS', 8: 'SP' };
const rarityMap = Object.fromEntries(Object.entries(levelMap).map(([k, v]) => [v, parseInt(k)]));
const selectedPredefinedItem = reactive({ name: '' });
const customItem = reactive({ name: '', rarity: 'C', description: '', quantity: 1 });
function addItemToBackpack() {
    if (selectedPredefinedItem.name) {
        const item = props.itemsData.find(i => i.name === selectedPredefinedItem.name);
        if (item) oc.backpack.push({ id: Date.now(), ...item, rarity: levelMap[item.level], level: item.level, quantity: 1 });
        selectedPredefinedItem.name = '';
    } else if (customItem.name) {
        oc.backpack.push({ id: Date.now(), ...customItem, level: rarityMap[customItem.rarity] });
        Object.assign(customItem, { name: '', rarity: 'C', description: '', quantity: 1 });
    }
}
function removeItem(itemId) { oc.backpack = oc.backpack.filter(item => item.id !== itemId); }
const getRarityClass = (rarityLabel) => `level-${rarityMap[rarityLabel] || 0}`;

const getAttributeBarStyle = (value, isCentered = false, scale = 5) => {
    const percentage = isCentered ? ((value + 1) / 2) * 100 : (Math.abs(value) / scale) * 100;
    return { width: `${Math.min(100, percentage)}%` };
};
const topTwoItems = computed(() => [...oc.backpack].sort((a, b) => b.level - a.level).slice(0, 2));
</script>

<template>
    <div class="oc-creator-container">
        <!-- Part 1: 输入表单 -->
        <div class="oc-form-panel gradient-border-active">
            <div class="form-header"><span class="form-title">OC生成器</span></div>

            <fieldset>
                <legend>外观与身份</legend>
                <div class="form-grid-2">
                    <div><label>名字:</label><input v-model="oc.name" type="text"></div>
                    <div><label>显示模式:</label><select v-model="oc.displayMode">
                            <option value="avatar">头像</option>
                            <option value="fullbody">立绘</option>
                        </select></div>
                </div>
                <div class="image-input-group">
                    <input v-model="oc.avatarUrl" type="text" placeholder="输入头像图片链接" v-if="oc.displayMode === 'avatar'">
                    <input v-model="oc.fullbodyUrl" type="text" placeholder="输入立绘图片链接"
                        v-if="oc.displayMode === 'fullbody'">
                    <label class="file-upload-button">
                        上传文件
                        <input type="file" @change="handleFileChange($event, oc.displayMode)" accept="image/*">
                    </label>
                    <button v-if="oc[`${oc.displayMode}File`]" @click="clearFile(oc.displayMode)"
                        class="clear-btn">清除文件</button>
                </div>
                <small class="form-note">提示：优先显示上传的文件。</small>
            </fieldset>

            <fieldset>
                <legend>基础信息</legend>
                <div class="form-grid-responsive">
                    <label>身高:<input v-model="oc.info.height"></label>
                    <label>体重:<input v-model="oc.info.weight"></label>
                    <label>性别:<input v-model="oc.info.gender"></label>
                    <label>年龄:<input v-model.number="oc.info.age" type="number"></label>
                    <label>生日:<input v-model="oc.info.birthday"></label>
                </div>
                <label>兴趣爱好:<input v-model="oc.info.hobby"></label>
            </fieldset>

            <fieldset>
                <legend>信仰与职业</legend>
                <div class="form-grid-2">
                    <label>信仰:<select v-model="oc.keyStats.faith">
                            <option v-for="faith in faiths" :key="faith" :value="faith">{{ faith }}</option>
                        </select></label>
                    <label>职业:<select v-model="oc.keyStats.profession" :disabled="!oc.keyStats.faith">
                            <option value="" disabled>--选择职业--</option>
                            <option v-for="prof in availableProfessions" :key="prof.name" :value="prof.name">{{
                                prof.type }}: {{ prof.name }}</option>
                        </select></label>
                </div>
            </fieldset>

            <fieldset>
                <legend>关键数值</legend>
                <div class="form-grid-responsive">
                    <label>登神之路:<input v-model.number="oc.keyStats.ascensionPath" type="number"></label>
                    <label>觐见之梯:<input v-model.number="oc.keyStats.stairway" type="number"></label>
                    <label>全球排名:<input v-model.number="oc.keyStats.globalRank" type="number"></label>
                    <label>命途排名:<input v-model.number="oc.keyStats.pathRank" type="number"></label>
                </div>
            </fieldset>

            <fieldset>
                <legend>属性面板</legend>
                <div class="form-grid-2">
                    <div class="attribute-slider"><label>虔诚度: {{ oc.attributes.piety }}
                            <small>(-1至1)</small></label><input v-model.number="oc.attributes.piety" type="range"
                            min="-1" max="1" step="0.1"></div>
                    <div class="attribute-slider"><label>道德: {{ oc.attributes.morality }}
                            <small>(-1至1)</small></label><input v-model.number="oc.attributes.morality" type="range"
                            min="-1" max="1" step="0.1"></div>
                </div>
                <div class="form-grid-responsive">
                    <label>智力 <small>(0为平均)</small>:<input v-model.number="oc.attributes.intelligence" type="number"
                            step="0.1"></label>
                    <label>体质 <small>(0为平均)</small>:<input v-model.number="oc.attributes.constitution" type="number"
                            step="0.1"></label>
                    <label>魅力 <small>(0为平均)</small>:<input v-model.number="oc.attributes.charisma" type="number"
                            step="0.1"></label>
                    <label>理智 <small>(0为平均)</small>:<input v-model.number="oc.attributes.sanity" type="number"
                            step="0.1"></label>
                    <label>战力 <small>(0为标准)</small>:<input v-model.number="oc.attributes.combatPower" type="number"
                            step="0.1"></label>
                </div>
            </fieldset>

            <fieldset>
                <legend>背包管理</legend>
                <div class="backpack-adder-grid">
                    <div class="adder-section">
                        <h4>从列表添加</h4>
                        <select v-model="selectedPredefinedItem.name">
                            <option value="" disabled>选择天赋或道具...</option>
                            <option v-for="item in itemsData" :key="item.name" :value="item.name">{{
                                levelMap[item.level] }} - {{ item.name }}</option>
                        </select>
                    </div>
                    <div class="adder-section">
                        <h4>或自定义添加</h4>
                        <input v-model="customItem.name" placeholder="物品名称" type="text">
                        <div class="custom-item-row">
                            <select v-model="customItem.rarity">
                                <option v-for="r in Object.values(levelMap)" :key="r" :value="r">{{ r }}</option>
                            </select>
                            <input v-model.number="customItem.quantity" type="number" min="1" placeholder="数量">
                        </div>
                        <textarea v-model="customItem.description" placeholder="物品描述..."></textarea>
                    </div>
                </div>
                <button @click="addItemToBackpack" class="add-button">添加到背包</button>
            </fieldset>
        </div>

        <!-- Part 2: 实时预览 -->
        <div class="oc-profile-preview gradient-border-active">
            <!-- 头像模式布局 -->
            <div v-if="oc.displayMode === 'avatar'" class="profile-grid-avatar">
                <div class="card-module header-module"><img :src="displayAvatarSrc" alt="头像" class="avatar">
                    <div class="name-section">
                        <h1>{{ oc.name }}</h1>
                        <div class="tags"><span class="tag faith">{{ oc.keyStats.faith }}</span><span
                                class="tag profession">{{ oc.keyStats.profession }}</span></div>
                    </div>
                </div>
                <div class="card-module stats-module">
                    <div class="stat-item">登神之路<strong>{{ oc.keyStats.ascensionPath }}</strong></div>
                    <div class="stat-item">觐见之梯<strong>{{ oc.keyStats.stairway }}</strong></div>
                    <div class="stat-item">全球排名<strong>{{ oc.keyStats.globalRank }}</strong></div>
                    <div class="stat-item">命途排名<strong>{{ oc.keyStats.pathRank }}</strong></div>
                </div>
                <div class="card-module info-module-avatar">
                    <h4>基础信息</h4>
                    <div class="info-list">
                        <div><span class="label">身高</span><span>{{ oc.info.height }}</span></div>
                        <div><span class="label">体重</span><span>{{ oc.info.weight }}</span></div>
                        <div><span class="label">性别</span><span>{{ oc.info.gender }}</span></div>
                        <div><span class="label">年龄</span><span>{{ oc.info.age }}</span></div>
                        <div><span class="label">生日</span><span>{{ oc.info.birthday }}</span></div>
                    </div>
                </div>
                <div class="card-module attributes-module-full">
                    <h4>属性面板</h4>
                    <div class="attributes-list">
                        <div class="attribute-item"><span class="label">虔诚度</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-piety"
                                    :style="getAttributeBarStyle(oc.attributes.piety, true)"></div>
                            </div><span>{{ oc.attributes.piety }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">道德</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-morality"
                                    :style="getAttributeBarStyle(oc.attributes.morality, true)"></div>
                            </div><span>{{ oc.attributes.morality }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">智力</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-intel"
                                    :style="getAttributeBarStyle(oc.attributes.intelligence, false, 5)"></div>
                            </div><span>{{ oc.attributes.intelligence }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">体质</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-const"
                                    :style="getAttributeBarStyle(oc.attributes.constitution, false, 5)"></div>
                            </div><span>{{ oc.attributes.constitution }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">魅力</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-charisma"
                                    :style="getAttributeBarStyle(oc.attributes.charisma, false, 5)"></div>
                            </div><span>{{ oc.attributes.charisma }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">理智</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-sanity"
                                    :style="getAttributeBarStyle(oc.attributes.sanity, false, 5)"></div>
                            </div><span>{{ oc.attributes.sanity }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">战力</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-combat"
                                    :style="getAttributeBarStyle(oc.attributes.combatPower, false, 10)"></div>
                            </div><span>{{ oc.attributes.combatPower }}</span>
                        </div>
                    </div>
                    <p class="attribute-note">注：虔诚度与道德以0为中立点；其余属性以0为平均水准。</p>
                </div>
                <div class="card-module items-module-full">
                    <h4>核心装备 / 背包</h4>
                    <div class="featured-items-grid" v-if="topTwoItems.length > 0">
                        <div v-for="item in topTwoItems" :key="item.id" class="featured-item-card">
                            <div class="featured-item-header"><span class="rarity-tag"
                                    :class="`tag-${getRarityClass(item.rarity)}`">{{ item.rarity }}</span><span
                                    class="featured-item-name">{{ item.name }}</span></div>
                            <p class="featured-item-desc">{{ item.description || item.text }}</p>
                        </div>
                    </div>
                    <div class="items-container">
                        <div v-for="item in oc.backpack" :key="item.id" class="item-badge" @click="removeItem(item.id)"
                            title="点击移除"><span class="rarity-tag" :class="`tag-${getRarityClass(item.rarity)}`">{{
                                item.rarity }}</span><span class="item-name">{{ item.name }} x{{ item.quantity }}</span>
                        </div>
                        <p v-if="!oc.backpack.length" class="empty-backpack">背包是空的...</p>
                    </div>
                </div>
            </div>

            <!-- 立绘模式布局 -->
            <div v-else class="profile-grid-fullbody">
                <div class="card-module image-module"><img :src="displayFullbodySrc" alt="立绘" class="fullbody-image">
                </div>
                <div class="card-module info-module">
                    <h1>{{ oc.name }}</h1>
                    <p class="profession-text">{{ oc.keyStats.faith }} · {{ oc.keyStats.profession }}</p>
                    <div class="info-stats-grid">
                        <div class="info-stat-item">登神之路<strong>{{ oc.keyStats.ascensionPath }}</strong></div>
                        <div class="info-stat-item">觐见之梯<strong>{{ oc.keyStats.stairway }}</strong></div>
                        <div class="info-stat-item">全球排名<strong>{{ oc.keyStats.globalRank }}</strong></div>
                        <div class="info-stat-item">命途排名<strong>{{ oc.keyStats.pathRank }}</strong></div>
                    </div>
                </div>
                <div class="card-module attributes-module-full">
                    <h4>属性面板</h4>
                    <div class="attributes-list">
                        <div class="attribute-item"><span class="label">虔诚度</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-piety"
                                    :style="getAttributeBarStyle(oc.attributes.piety, true)"></div>
                            </div><span>{{ oc.attributes.piety }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">道德</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-morality"
                                    :style="getAttributeBarStyle(oc.attributes.morality, true)"></div>
                            </div><span>{{ oc.attributes.morality }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">智力</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-intel"
                                    :style="getAttributeBarStyle(oc.attributes.intelligence, false, 5)"></div>
                            </div><span>{{ oc.attributes.intelligence }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">体质</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-const"
                                    :style="getAttributeBarStyle(oc.attributes.constitution, false, 5)"></div>
                            </div><span>{{ oc.attributes.constitution }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">魅力</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-charisma"
                                    :style="getAttributeBarStyle(oc.attributes.charisma, false, 5)"></div>
                            </div><span>{{ oc.attributes.charisma }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">理智</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-sanity"
                                    :style="getAttributeBarStyle(oc.attributes.sanity, false, 5)"></div>
                            </div><span>{{ oc.attributes.sanity }}</span>
                        </div>
                        <div class="attribute-item"><span class="label">战力</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-inner p-combat"
                                    :style="getAttributeBarStyle(oc.attributes.combatPower, false, 10)"></div>
                            </div><span>{{ oc.attributes.combatPower }}</span>
                        </div>
                    </div>
                    <p class="attribute-note">注：虔诚度与道德以0为中立点；其余属性以0为平均水准。</p>
                </div>
                <div class="card-module items-module-full">
                    <h4>核心装备 / 背包</h4>
                    <div class="featured-items-grid" v-if="topTwoItems.length > 0">
                        <div v-for="item in topTwoItems" :key="item.id" class="featured-item-card">
                            <div class="featured-item-header"><span class="rarity-tag"
                                    :class="`tag-${getRarityClass(item.rarity)}`">{{ item.rarity }}</span><span
                                    class="featured-item-name">{{ item.name }}</span></div>
                            <p class="featured-item-desc">{{ item.description || item.text }}</p>
                        </div>
                    </div>
                    <div class="items-container">
                        <div v-for="item in oc.backpack" :key="item.id" class="item-badge" @click="removeItem(item.id)"
                            title="点击移除"><span class="rarity-tag" :class="`tag-${getRarityClass(item.rarity)}`">{{
                                item.rarity }}</span><span class="item-name">{{ item.name }} x{{ item.quantity }}</span>
                        </div>
                        <p v-if="!oc.backpack.length" class="empty-backpack">背包是空的...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* --- 全局与布局 --- */
.oc-creator-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}

.oc-form-panel {
    background: #fff;
    border-radius: 24px;
    padding: 25px;
    position: relative;
}

.oc-profile-preview {
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 24px;
    position: relative;
}

.profile-grid-avatar,
.profile-grid-fullbody {
    display: grid;
    gap: 1.5rem;
}

/* --- 模块化布局 --- */
.profile-grid-avatar {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "header stats" "info info" "attributes attributes" "items items";
}

.header-module {
    grid-area: header;
}

.stats-module {
    grid-area: stats;
}

.info-module-avatar {
    grid-area: info;
}

.attributes-module-full {
    grid-area: attributes;
}

.items-module-full {
    grid-area: items;
}

.profile-grid-fullbody {
    grid-template-columns: 1fr 2fr;
    grid-template-areas: "image info" "attributes attributes" "items items";
}

.image-module {
    grid-area: image;
}

.info-module {
    grid-area: info;
}

.card-module {
    background: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* --- 持久化渐变边框 --- */
.gradient-border-active {
    position: relative;
    border-radius: 24px;
}

.gradient-border-active::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(110deg, #ec8a79, #b042bf, #4169E1, #32CD32, #f0e68c);
    background-size: 400%;
    animation: gradient-flow 10s linear infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
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

/* --- 表单美化 --- */
.form-header {
    text-align: center;
    margin-bottom: 2rem;
}

.form-title {
    font-size: 1.5rem;
    color: #888;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
}

fieldset {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
}

legend {
    font-weight: 600;
    padding: 0 0.5rem;
}

input,
select,
textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-grid-responsive {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
}

.attribute-slider {
    margin-top: 1rem;
}

.attribute-slider label {
    font-size: 0.9em;
}

.attribute-slider small {
    margin-left: 0.5rem;
    color: #888;
    font-weight: normal;
}

.image-input-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.5rem;
}

.image-input-group input[type="text"] {
    flex-grow: 1;
}

.file-upload-button {
    display: inline-block;
    padding: 10px 15px;
    background-color: #6c757d;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s;
    white-space: nowrap;
}

.file-upload-button:hover {
    background-color: #5a6268;
}

.file-upload-button input {
    display: none;
}

.clear-btn {
    padding: 10px 15px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.form-note {
    font-size: 0.8em;
    color: #666;
    display: block;
    margin-top: 0.5rem;
    width: 100%;
}

.backpack-adder-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.adder-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.adder-section h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.custom-item-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
}

.add-button {
    background: linear-gradient(45deg, #ef7fac, #a28eeb);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(162, 142, 235, 0.4);
    margin-top: 1rem;
}

/* --- 预览卡片模块 --- */
/* Header (Avatar) */
.header-module {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    flex-shrink: 0;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.name-section h1 {
    font-size: 2.2rem;
    margin: 0 0 0.5rem;
    line-height: 1.1;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
}

.tag.faith {
    background-color: #007bff;
}

.tag.profession {
    background-color: #e83e8c;
}

/* Stats */
.stats-module {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-content: center;
}

.stat-item {
    text-align: center;
    color: #555;
    font-size: 0.95rem;
}

.stat-item strong {
    font-size: 1.5em;
    font-weight: 700;
    color: #333;
    margin-left: 0.25rem;
}

/* Basic Info */
.info-module-avatar h4,
.attributes-module-full h4,
.items-module-full h4 {
    font-size: 1.2rem;
    margin: 0 0 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
}

.info-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
}

.info-list>div {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
}

.info-list .label {
    color: #666;
}

/* Full-body Info */
.image-module {
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.fullbody-image {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 12px;
}

.info-module {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.info-module h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.profession-text {
    font-size: 1.1rem;
    color: #555;
    margin-top: 0;
    margin-bottom: 1.5rem;
}

.info-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.info-stat-item {
    color: #555;
}

.info-stat-item strong {
    font-size: 1.5em;
    font-weight: 700;
    color: #333;
    margin-left: 0.25rem;
}

/* --- 属性进度条 --- */
.attributes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.attribute-item {
    display: grid;
    grid-template-columns: 50px 1fr 40px;
    align-items: center;
    gap: 1rem;
}

.attribute-item .label {
    text-align: right;
    font-size: 0.9em;
    font-weight: 500;
}

.attribute-item span:last-child {
    text-align: center;
    font-size: 0.9em;
    font-weight: bold;
    color: #555;
}

.progress-bar-container {
    height: 16px;
    background: #f1f3f5;
    border-radius: 8px;
    overflow: hidden;
}

.progress-bar-inner {
    height: 100%;
    border-radius: 8px;
    transition: width 0.5s ease;
}

.attribute-note {
    font-size: 0.8em;
    color: #888;
    text-align: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #eee;
}

.p-piety {
    background: linear-gradient(90deg, #6a82fb, #fc5c7d);
}

.p-morality {
    background: linear-gradient(90deg, #89f7fe, #66a6ff);
}

.p-intel {
    background: linear-gradient(90deg, #38f9d7, #43e97b);
}

.p-const {
    background: linear-gradient(90deg, #c79081, #dfa579);
}

.p-charisma {
    background: linear-gradient(90deg, #f093fb, #f5576c);
}

.p-sanity {
    background: linear-gradient(90deg, #a7a6cb, #8989ba);
}

.p-combat {
    background: linear-gradient(90deg, #f5576c, #f093fb);
}

/* --- 特色物品与背包 --- */
.featured-items-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.featured-item-card {
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
}

.featured-item-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.featured-item-header .rarity-tag {
    border-radius: 6px;
}

.featured-item-name {
    font-weight: bold;
}

.featured-item-desc {
    font-size: 0.9em;
    color: #555;
    white-space: pre-line;
    line-height: 1.6;
    margin: 0;
}

.items-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    margin-top: 1rem;
}

.empty-backpack {
    color: #999;
    width: 100%;
}

.item-badge {
    display: inline-flex;
    align-items: center;
    background-color: #f1f3f5;
    border-radius: 16px;
    overflow: hidden;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
}

.item-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rarity-tag {
    padding: 6px 10px;
    color: white;
    font-weight: bold;
    margin-right: 8px;
    align-self: stretch;
    display: flex;
    align-items: center;
}

.item-name {
    padding: 6px 10px 6px 0;
    color: #343a40;
}

.tag-level-0 {
    background: #6c757d;
}

.tag-level-1 {
    background: #adb5bd;
}

.tag-level-2 {
    background: #52b788;
}

.tag-level-3 {
    background: #4895ef;
}

.tag-level-4 {
    background: #a78bfa;
}

.tag-level-5 {
    background: #ffc107;
    color: #493803;
    text-shadow: none;
}

.tag-level-6 {
    background: #fd7e14;
}

.tag-level-7 {
    background: linear-gradient(45deg, #e75aa0, #d63384, #b32a72);
}

.tag-level-8 {
    background: linear-gradient(110deg, #ffdd57, #ff964f, #ff7b7b, #f771e1, #b78dff, #7ac7ff, #69f0ae, #a5ff7a, #f4ff6a, #ffdd57);
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    background-size: 300% 100%;
    animation: gradient-flow 3s linear infinite;
}

/* --- 移动端适配 --- */
@media (max-width: 960px) {

    .profile-grid-avatar,
    .profile-grid-fullbody {
        grid-template-columns: 1fr;
    }

    .profile-grid-avatar {
        grid-template-areas: "header" "stats" "info" "attributes" "items";
    }

    .profile-grid-fullbody {
        grid-template-areas: "image" "info" "attributes" "items";
    }

    .fullbody-image {
        max-height: 400px;
    }
}

@media (max-width: 768px) {
    .oc-form-panel {
        padding: 15px;
    }

    .oc-profile-preview {
        padding: 1rem;
    }

    .card-module {
        padding: 1rem;
    }

    .form-grid-2,
    .backpack-adder-grid {
        grid-template-columns: 1fr;
    }

    .stats-module,
    .info-stats-grid {
        grid-template-columns: 1fr 1fr;
    }

    .info-module h1,
    .name-section h1 {
        font-size: 1.8rem;
    }

    .attribute-item {
        grid-template-columns: 40px 1fr 40px;
    }
}
</style>