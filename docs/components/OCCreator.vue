<script setup>
import { reactive, computed, watch, ref } from 'vue';
import { professionsData } from '../js/oc-data';
import {
    levelMap,
    rarityMap,
    getRarityClass,
    getCenteredAttributeBarStyle,
    getBarEndCapClass
} from '../js/ocUtils.js';
import html2canvas from 'html2canvas';

const props = defineProps({
    itemsData: { type: Array, required: true, default: () => [] }
});

const showCommunityPage = ref(true);

const communityInfo = reactive({
    title: '欢迎加入WIKI官方社区',
    avatar: '/avatar.png',
    name: 'QQ频道',
    description: 'zsyxwiki233',
    joinLink: 'https://pd.qq.com/s/7hfn4j2na'
});

function enterCreator() {
    showCommunityPage.value = false;
}

const avatarPreviewUrl = ref(null);
const fullbodyPreviewUrl = ref(null);
const previewCard = ref(null);
const isGenerating = ref(false);
const generatedImageUrl = ref(null);
const showImagePreviewModal = ref(false);


const oc = reactive({
    name: 'Mueo',
    displayMode: 'avatar',
    avatarUrl: 'https://cdn.demo.com/',
    fullbodyUrl: 'https://cdn.demo.com/',
    avatarFile: null,
    fullbodyFile: null,
    info: { height: '185cm', weight: '70kg', gender: '男', age: 18, birthday: '10月26日', hobby: '探索未知, 收集古物' },
    keyStats: { faith: '真理', profession: '博识学者', ascensionPath: 418, stairway: 56, globalRank: 107, pathRank: 123 },
    attributes: { piety: 0.5, intelligence: 1.6, constitution: 1.5, charisma: 1.7, sanity: 2.0, morality: 0.9, combatPower: 1.8 },
    backpack: [],
});

const faiths = Object.keys(professionsData);
const availableProfessions = computed(() => professionsData[oc.keyStats.faith]?.filter(p => p.name) || []);
watch(() => oc.keyStats.faith, () => { oc.keyStats.profession = availableProfessions.value[0]?.name || ''; });

const handleFileChange = (event, type) => {
    const file = event.target.files[0]; if (!file) return;
    const previewUrlRef = type === 'avatar' ? avatarPreviewUrl : fullbodyPreviewUrl;
    if (previewUrlRef.value) URL.revokeObjectURL(previewUrlRef.value);
    oc[`${type}File`] = file; previewUrlRef.value = URL.createObjectURL(file);
};

const clearFile = (type) => {
    oc[`${type}File`] = null; const previewUrlRef = type === 'avatar' ? avatarPreviewUrl : fullbodyPreviewUrl;
    if (previewUrlRef.value) URL.revokeObjectURL(previewUrlRef.value);
    previewUrlRef.value = null;
};

const onImageError = (event) => {
    event.target.src = '/avatar.png';
};

const displayAvatarSrc = computed(() => avatarPreviewUrl.value || oc.avatarUrl);
const displayFullbodySrc = computed(() => fullbodyPreviewUrl.value || oc.fullbodyUrl);

const selectedPredefinedItem = reactive({ name: '' });
const customItem = reactive({ name: '', rarity: 'C', description: '', quantity: 1 });

const groupedItemsData = computed(() => {
    return props.itemsData.reduce((acc, item) => {
        const group = item.card || '未分类'; if (!acc[group]) acc[group] = []; acc[group].push(item); return acc;
    }, {});
});

function addItemToBackpack() {
    let itemToAdd = null;
    let quantityToAdd = 1;

    if (selectedPredefinedItem.name) {
        const item = props.itemsData.find(i => i.name === selectedPredefinedItem.name);
        if (item) {
            itemToAdd = {
                name: item.name,
                rarity: levelMap[item.level],
                description: item.description || item.text,
                level: item.level
            };
        }
        selectedPredefinedItem.name = '';
    } else if (customItem.name.trim()) {
        itemToAdd = {
            name: customItem.name.trim(),
            rarity: customItem.rarity,
            description: customItem.description,
            level: rarityMap[customItem.rarity]
        };
        quantityToAdd = customItem.quantity;
        Object.assign(customItem, { name: '', rarity: 'C', description: '', quantity: 1 });
    }

    if (itemToAdd) {
        const existingItem = oc.backpack.find(i => i.name === itemToAdd.name);
        if (existingItem) {
            existingItem.quantity += quantityToAdd;
        } else {
            oc.backpack.push({ id: Date.now(), ...itemToAdd, quantity: quantityToAdd });
        }
    }
}

const isAddButtonDisabled = computed(() => !selectedPredefinedItem.name && !customItem.name.trim());
function removeItem(itemId) { oc.backpack = oc.backpack.filter(item => item.id !== itemId); }

const topTwoItems = computed(() => [...oc.backpack].sort((a, b) => b.level - a.level).slice(0, 2));

const generateImage = async () => {
    if (!previewCard.value || isGenerating.value) return;
    isGenerating.value = true;

    try {
        const canvas = await html2canvas(previewCard.value, {
            backgroundColor: '#f8f9fa',
            useCORS: true,
            scale: 2,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (isMobile) {
            generatedImageUrl.value = dataUrl;
            showImagePreviewModal.value = true;
        } else {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${oc.name}_OC_Card.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    } catch (error) {
        console.error('生成图片失败:', error);
        alert('生成图片失败，请检查控制台获取更多信息。');
    } finally {
        isGenerating.value = false;
    }
};

</script>

<template>
    <div v-if="showImagePreviewModal" class="image-preview-modal" @click="showImagePreviewModal = false">
        <div class="modal-content" @click.stop>
            <img :src="generatedImageUrl" alt="生成的OC卡片" />
            <p>长按图片或右键即可保存</p>
            <button @click="showImagePreviewModal = false">关闭</button>
        </div>
    </div>

    <div class="oc-creator-container">

        <div v-if="showCommunityPage" class="community-ad-card">
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
                <button class="community-button secondary" @click="enterCreator">我已知晓</button>
            </div>
        </div>

        <template v-else>
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
                    <div class="image-input-group"><input v-model="oc.avatarUrl" type="text" placeholder="输入头像图片链接"
                            v-if="oc.displayMode === 'avatar'"><input v-model="oc.fullbodyUrl" type="text"
                            placeholder="输入立绘图片链接" v-if="oc.displayMode === 'fullbody'"><label
                            class="file-upload-button">上传文件<input type="file"
                                @change="handleFileChange($event, oc.displayMode)" accept="image/*"></label><button
                            v-if="oc[`${oc.displayMode}File`]" @click="clearFile(oc.displayMode)"
                            class="clear-btn">清除文件</button></div>
                    <small class="form-note">提示：优先显示上传的文件。</small>
                </fieldset>
                <fieldset>
                    <legend>基础信息</legend>
                    <div class="form-grid-responsive"><label>身高:<input v-model="oc.info.height"></label><label>体重:<input
                                v-model="oc.info.weight"></label><label>性别:<input
                                v-model="oc.info.gender"></label><label>年龄:<input v-model.number="oc.info.age"
                                type="number"></label><label>生日:<input v-model="oc.info.birthday"></label></div>
                    <label>兴趣爱好:<input v-model="oc.info.hobby"></label>
                </fieldset>
                <fieldset>
                    <legend>信仰与职业</legend>
                    <div class="form-grid-2"><label>信仰:<select v-model="oc.keyStats.faith">
                                <option v-for="faith in faiths" :key="faith" :value="faith">{{ faith }}</option>
                            </select></label><label>职业:<select v-model="oc.keyStats.profession"
                                :disabled="!oc.keyStats.faith">
                                <option value="" disabled>--选择职业--</option>
                                <option v-for="prof in availableProfessions" :key="prof.name" :value="prof.name">{{
                                    prof.type }}: {{ prof.name }}</option>
                            </select></label></div>
                </fieldset>
                <fieldset>
                    <legend>关键数值</legend>
                    <div class="form-grid-responsive"><label>登神之路:<input v-model.number="oc.keyStats.ascensionPath"
                                type="number"></label><label>觐见之梯:<input v-model.number="oc.keyStats.stairway"
                                type="number"></label><label>全球排名:<input v-model.number="oc.keyStats.globalRank"
                                type="number"></label><label>命途排名:<input v-model.number="oc.keyStats.pathRank"
                                type="number"></label></div>
                </fieldset>
                <fieldset>
                    <legend>属性面板</legend>
                    <div class="form-grid-2">
                        <div class="attribute-slider"><label>虔诚: {{ oc.attributes.piety }}
                                <small>(-1至1)</small></label><input v-model.number="oc.attributes.piety" type="range"
                                min="-1" max="1" step="0.1"></div>
                        <div class="attribute-slider"><label>道德: {{ oc.attributes.morality }}
                                <small>(-1至1)</small></label><input v-model.number="oc.attributes.morality" type="range"
                                min="-1" max="1" step="0.1"></div>
                    </div>
                    <div class="form-grid-responsive"><label>智力 <small>(-10至10)</small>:<input
                                v-model.number="oc.attributes.intelligence" type="number" step="0.1" min="-10"
                                max="10"></label><label>体质 <small>(-10至10)</small>:<input
                                v-model.number="oc.attributes.constitution" type="number" step="0.1" min="-10"
                                max="10"></label><label>魅力 <small>(-10至10)</small>:<input
                                v-model.number="oc.attributes.charisma" type="number" step="0.1" min="-10"
                                max="10"></label><label>理智 <small>(-10至10)</small>:<input
                                v-model.number="oc.attributes.sanity" type="number" step="0.1" min="-10"
                                max="10"></label><label>战力 <small>(-10至10)</small>:<input
                                v-model.number="oc.attributes.combatPower" type="number" step="0.1" min="-10"
                                max="10"></label></div>
                </fieldset>
                <fieldset>
                    <legend>背包管理</legend>
                    <div class="backpack-adder-grid">
                        <div class="adder-section">
                            <h4>从列表添加</h4><select v-model="selectedPredefinedItem.name">
                                <option value="" disabled>选择天赋或道具...</option>
                                <optgroup v-for="(items, groupName) in groupedItemsData" :key="groupName"
                                    :label="groupName">
                                    <option v-for="item in items" :key="item.name" :value="item.name">{{
                                        levelMap[item.level] }} - {{ item.name }}</option>
                                </optgroup>
                            </select>
                        </div>
                        <div class="adder-section">
                            <h4>或自定义添加</h4><input v-model="customItem.name" placeholder="物品名称" type="text">
                            <div class="custom-item-row"><select v-model="customItem.rarity">
                                    <option v-for="r in Object.values(levelMap)" :key="r" :value="r">{{ r }}</option>
                                </select><input v-model.number="customItem.quantity" type="number" min="1"
                                    placeholder="数量">
                            </div><textarea v-model="customItem.description" placeholder="物品描述..."></textarea>
                        </div>
                    </div>
                    <button @click="addItemToBackpack" class="add-button" :disabled="isAddButtonDisabled">添加到背包</button>
                </fieldset>
                <div class="generate-button-container"><button @click="generateImage" class="generate-button"
                        :disabled="isGenerating">{{ isGenerating ? '生成中...' : '生成OC卡片' }}</button></div>
            </div>

            <div class="oc-profile-preview-wrapper gradient-border-active">
                <div class="oc-profile-preview" ref="previewCard">
                    <div :class="oc.displayMode === 'avatar' ? 'profile-grid-avatar' : 'profile-grid-fullbody'">
                        <template v-if="oc.displayMode === 'avatar'">
                            <div class="card-module header-module"><img :src="displayAvatarSrc" @error="onImageError"
                                    alt="头像" class="avatar">
                                <div class="name-section">
                                    <h1>{{ oc.name }}</h1>
                                    <div class="tags"><span class="tag faith">{{ oc.keyStats.faith }}</span><span
                                            class="tag profession">{{ oc.keyStats.profession }}</span></div>
                                </div>
                            </div>
                            <div class="card-module stats-module">
                                <div class="stat-item"><span>登神之路</span><strong>{{ oc.keyStats.ascensionPath
                                }}</strong>
                                </div>
                                <div class="stat-item"><span>觐见之梯</span><strong>{{ oc.keyStats.stairway }}</strong>
                                </div>
                                <div class="stat-item"><span>全球排名</span><strong>{{ oc.keyStats.globalRank }}</strong>
                                </div>
                                <div class="stat-item"><span>命途排名</span><strong>{{ oc.keyStats.pathRank }}</strong>
                                </div>
                            </div>
                            <div class="card-module info-module-avatar">
                                <h4>基础信息</h4>
                                <div class="info-list">
                                    <div><span class="label">身高</span><span>{{ oc.info.height }}</span></div>
                                    <div><span class="label">体重</span><span>{{ oc.info.weight }}</span></div>
                                    <div><span class="label">性别</span><span>{{ oc.info.gender }}</span></div>
                                    <div><span class="label">年龄</span><span>{{ oc.info.age }}</span></div>
                                    <div><span class="label">生日</span><span>{{ oc.info.birthday }}</span></div>
                                    <div class="info-hobby"><span class="label">爱好</span><span>{{ oc.info.hobby
                                    }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="card-module image-module"><img :src="displayFullbodySrc" @error="onImageError"
                                    alt="立绘" class="fullbody-image"></div>
                            <div class="card-module info-module">
                                <h1>{{ oc.name }}</h1>
                                <p class="profession-text">{{ oc.keyStats.faith }} · {{ oc.keyStats.profession }}</p>
                                <p class="hobby-text"><strong>爱好:</strong> {{ oc.info.hobby }}</p>
                                <div class="info-stats-grid">
                                    <div class="info-stat-item">登神之路<strong>{{ oc.keyStats.ascensionPath
                                    }}</strong></div>
                                    <div class="info-stat-item">觐见之梯<strong>{{ oc.keyStats.stairway }}</strong></div>
                                    <div class="info-stat-item">全球排名<strong>{{ oc.keyStats.globalRank }}</strong></div>
                                    <div class="info-stat-item">命途排名<strong>{{ oc.keyStats.pathRank }}</strong></div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="shared-modules">
                        <div class="card-module attributes-module-full">
                            <h4>属性面板</h4>
                            <div class="attributes-list">
                                <div class="attribute-item"><span class="label">虔诚</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-piety"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.piety, 1)"
                                            :class="getBarEndCapClass(oc.attributes.piety)"></div>
                                    </div><span>{{ oc.attributes.piety }}</span>
                                </div>
                                <div class="attribute-item"><span class="label">道德</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-morality"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.morality, 1)"
                                            :class="getBarEndCapClass(oc.attributes.morality)"></div>
                                    </div><span>{{ oc.attributes.morality }}</span>
                                </div>
                                <div class="attribute-item"><span class="label">智力</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-intel"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.intelligence, 10)"
                                            :class="getBarEndCapClass(oc.attributes.intelligence)"></div>
                                    </div><span>{{ oc.attributes.intelligence }}</span>
                                </div>
                                <div class="attribute-item"><span class="label">体质</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-const"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.constitution, 10)"
                                            :class="getBarEndCapClass(oc.attributes.constitution)"></div>
                                    </div><span>{{ oc.attributes.constitution }}</span>
                                </div>
                                <div class="attribute-item"><span class="label">魅力</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-charisma"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.charisma, 10)"
                                            :class="getBarEndCapClass(oc.attributes.charisma)"></div>
                                    </div><span>{{ oc.attributes.charisma }}</span>
                                </div>
                                <div class="attribute-item"><span class="label">理智</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-sanity"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.sanity, 10)"
                                            :class="getBarEndCapClass(oc.attributes.sanity)"></div>
                                    </div><span>{{ oc.attributes.sanity }}</span>
                                </div>
                                <div class="attribute-item"><span class="label">战力</span>
                                    <div class="progress-bar-container centered">
                                        <div class="progress-bar-inner p-combat"
                                            :style="getCenteredAttributeBarStyle(oc.attributes.combatPower, 10)"
                                            :class="getBarEndCapClass(oc.attributes.combatPower)"></div>
                                    </div><span>{{ oc.attributes.combatPower }}</span>
                                </div>
                            </div>
                            <p class="attribute-note">注：虔诚与道德以0为中立点，其余属性以0为略弱于普通人水平。</p>
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
                                <div v-for="item in oc.backpack" :key="item.id" class="item-badge"
                                    @click="removeItem(item.id)" title="点击移除"><span class="rarity-tag"
                                        :class="`tag-${getRarityClass(item.rarity)}`">{{ item.rarity
                                        }}</span><span class="item-name">{{ item.name }} x{{ item.quantity }}</span>
                                </div>
                                <p v-if="!oc.backpack.length" class="empty-backpack">背包是空的...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.image-preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    box-sizing: border-box;
}

.modal-content {
    background-color: white;
    padding: 1.5rem;
    border-radius: 16px;
    text-align: center;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.modal-content img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 8px;
}

.modal-content p {
    margin: 0;
    color: #333;
    font-weight: 500;
}

.modal-content button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

.community-ad-card {
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    padding: 40px;
    border: 1px solid #e9e9e9;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    box-sizing: border-box;
}

.question-header {
    margin-bottom: 30px;
    text-align: center;
}

.question-number {
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

.oc-profile-preview-wrapper {
    position: relative;
    border-radius: 24px;
}

.oc-profile-preview {
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 24px;
}

.profile-grid-avatar,
.profile-grid-fullbody {
    display: grid;
    gap: 1.5rem;
}


.profile-grid-avatar {
    grid-template-columns: auto 1fr;
    grid-template-areas: "header stats" "info info";
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

.profile-grid-fullbody {
    grid-template-columns: 1fr 2fr;
    grid-template-areas: "image info";
}

.image-module {
    grid-area: image;
}

.info-module {
    grid-area: info;
}

.shared-modules {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.card-module {
    background-color: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}


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

input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    background: #e9ecef;
    border-radius: 5px;
    outline: none;
    padding: 0;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #6c757d;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin-top: -6px;
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #6c757d;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
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

.add-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
}

.generate-button-container {
    text-align: center;
    margin-top: 2rem;
}

.generate-button {
    background: linear-gradient(45deg, #43e97b, #38f9d7);
    color: white;
    font-weight: bold;
    border: none;
    padding: 14px 28px;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(56, 249, 215, 0.5);
}

.generate-button:disabled {
    background: #B0BEC5;
    cursor: wait;
    box-shadow: none;
}

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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
}

.tag.faith {
    background-color: #007bff;
}

.tag.profession {
    background-color: #e83e8c;
}

.stats-module {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
}

.stat-item {
    text-align: left;
    color: #555;
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: #f1f3f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-item strong {
    font-size: 1.75em;
    font-weight: 700;
    color: #333;
}

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
    gap: 0.75rem 1.5rem;
}

.info-list>div {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    padding: 4px 0;
}

.info-hobby {
    grid-column: 1 / -1;
    justify-content: flex-start;
    gap: 1rem;
}

.info-list .label {
    color: #666;
    font-weight: 500;
}

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
    margin-bottom: 1rem;
}

.hobby-text {
    font-size: 1rem;
    color: #444;
    margin-top: 0;
    margin-bottom: 1.5rem;
    background: #f8f9fa;
    padding: 0.5rem 1rem;
    border-radius: 8px;
}

.info-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 1rem;
}

.info-stat-item {
    color: #555;
    padding: 0.5rem;
    border-radius: 8px;
    background: #f8f9fa;
    text-align: center;
}

.info-stat-item strong {
    display: block;
    font-size: 1.5em;
    font-weight: 700;
    color: #333;
    margin-top: 0.25rem;
}

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
    position: relative;
}

.progress-bar-container.centered::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
    z-index: 1;
}

.progress-bar-inner {
    height: 100%;
    transition: all 0.5s ease;
    position: absolute;
    top: 0;
}

.progress-bar-inner.end-cap-right {
    border-radius: 0 8px 8px 0;
}

.progress-bar-inner.end-cap-left {
    border-radius: 8px 0 0 8px;
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    color: white;
    font-weight: bold;
    margin-right: 8px;
    align-self: stretch;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
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

@media (max-width: 960px) {

    .profile-grid-avatar,
    .profile-grid-fullbody {
        grid-template-columns: 1fr;
    }

    .profile-grid-avatar {
        grid-template-areas: "header" "stats" "info";
    }

    .profile-grid-fullbody {
        grid-template-areas: "image" "info";
    }

    .fullbody-image {
        max-height: 400px;
    }

    .stats-module {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .stat-item {
        text-align: center;
        flex-direction: column;
        justify-content: center;
    }

    .stat-item strong {
        margin-top: 0.25rem;
    }
}

@media (max-width: 768px) {
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

    .community-ad-card {
        padding: 20px;
    }

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

    .info-module h1,
    .name-section h1 {
        font-size: 1.8rem;
    }

    .attribute-item {
        grid-template-columns: 40px 1fr 40px;
    }
}

@media (max-width: 480px) {

    .stats-module,
    .info-stats-grid {
        grid-template-columns: 1fr;
    }

    .stat-item,
    .info-stat-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text-align: left;
    }

    .stat-item strong,
    .info-stat-item strong {
        margin-top: 0;
        font-size: 1.5em;
    }

    .item-badge {
        font-size: 0.8rem;
    }
}
</style>