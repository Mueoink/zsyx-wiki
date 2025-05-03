<template>
    <div class="message-board">
        <div v-if="!processedMessages || processedMessages.length === 0" class="no-messages">
            还没有人留言，快来抢沙发吧！🛋️
        </div>
        <template v-else>
            <div v-for="(message) in visibleMessages" :key="message.originalIndex"
                :class="['message-item', getLevelClass(message.level), { 'is-expanded': expandedStates[message.originalIndex] }]"
                @click="toggleExpand(message.originalIndex)">
                <div class="message-header">
                    <div v-if="shouldShowAvatar(message)" class="avatar-wrapper">
                        <div class="avatar-container">
                            <img :src="message.avatar" alt="用户头像" class="message-avatar" />
                        </div>
                    </div>
                    <div class="name-area">
                        <span class="message-name" :class="{ 'anonymous': !message.name }">
                            {{ message.name || '匿名用户' }}
                        </span>
                        <span v-if="message.level !== '普通'" :class="['level-badge', getLevelBadgeClass(message.level)]">
                            {{ message.level }}
                        </span>
                    </div>
                    <div class="expand-indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41z" />
                        </svg>
                    </div>
                </div>
                <div class="message-content-wrapper">
                    <div class="message-content">
                        <p>{{ message.text }}</p>
                    </div>
                </div>
            </div>

            <div v-if="showLoadMoreButton" class="load-more-container">
                <button @click="loadMore" class="load-more-button">
                    加载更多留言
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, PropType, reactive, watch } from 'vue';

interface Message {
    text: string;
    level: '贡献者' | '支持者' | '普通';
    name?: string;
    avatar?: string;
}

interface ProcessedMessage extends Message {
    originalIndex: number;
}

const props = defineProps({
    messages: {
        type: Array as PropType<Message[]>,
        required: true,
        default: () => []
    },
    initialCount: {
        type: Number,
        default: 10
    },
    incrementCount: {
        type: Number,
        default: 10
    }
});

const visibleCount = ref(props.initialCount);
const expandedStates = reactive<{ [key: number]: boolean }>({});

const processedMessages = computed(() => {
    const contributors: ProcessedMessage[] = [];
    const supporters: ProcessedMessage[] = [];
    const normal: ProcessedMessage[] = [];

    props.messages.forEach((message, index) => {
        const processedMessage = { ...message, originalIndex: index };
        if (message.level === '贡献者') {
            contributors.push(processedMessage);
        } else if (message.level === '支持者') {
            supporters.push(processedMessage);
        } else {
            normal.push(processedMessage);
        }
    });

    return [...contributors, ...supporters, ...normal];
});


const visibleMessages = computed(() => {
    return processedMessages.value.slice(0, visibleCount.value);
});

const showLoadMoreButton = computed(() => {
    return visibleCount.value < processedMessages.value.length;
});

const loadMore = (event: MouseEvent) => {
    event.stopPropagation();
    visibleCount.value = Math.min(
        visibleCount.value + props.incrementCount,
        processedMessages.value.length
    );
};

const toggleExpand = (originalIndex: number) => {
    expandedStates[originalIndex] = !expandedStates[originalIndex];
};

const getLevelClass = (level: Message['level']): string => {
    switch (level) {
        case '贡献者':
            return 'level-contributor';
        case '支持者':
            return 'level-supporter';
        case '普通':
        default:
            return 'level-normal';
    }
};

const getLevelBadgeClass = (level: Message['level']): string => {
    switch (level) {
        case '贡献者':
            return 'badge-contributor';
        case '支持者':
            return 'badge-supporter';
        default:
            return '';
    }
}

const shouldShowAvatar = (message: Message): boolean => {
    return !!message.avatar && (message.level === '贡献者' || message.level === '支持者');
};

watch(() => props.messages, () => {

}, { deep: true });


</script>

<style scoped>
.message-board {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.no-messages {
    text-align: center;
    color: var(--vp-c-text-2);
    padding: 2rem;
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
}

.message-item {
    border-radius: 8px;
    padding: 0.75rem 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    border: 1px solid var(--vp-c-divider);
    overflow: hidden;
    cursor: pointer;
    position: relative;
}

.message-item:hover {
    border-color: var(--vp-c-brand-2);
    box-shadow: 0 1px 5px var(--vp-c-divider-light);
}

.level-contributor {
    background-color: var(--vp-c-brand-soft);
}

.level-supporter {
    background-color: var(--vp-c-yellow-soft);
}

.level-normal {
    background-color: var(--vp-c-bg-soft);
}


.message-header {
    display: flex;
    align-items: center;
    gap: 0.85rem;
}

.avatar-wrapper {
    flex-shrink: 0;
}

.avatar-container {
    padding: 0.75px;
    /* 内边距 */
    background-color: rgba(3, 3, 3, 0.41);
    border-radius: 50%;
    /* 圆形 */
    display: inline-block;
    line-height: 0;

}

.message-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
}

.name-area {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.3;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 0.5rem;
}

.message-name {
    font-weight: 500;
    color: var(--vp-c-text-1);
    font-size: 0.9rem;
}

.message-name.anonymous {
    font-weight: 400;
    color: var(--vp-c-text-2);
    font-style: italic;
}

.level-badge {
    font-size: 0.65rem;
    padding: 1px 5px;
    border-radius: 4px;
    margin-top: 0.15rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
    line-height: 1.2;
}

.badge-contributor {
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg-soft);
}

.badge-supporter {
    background-color: var(--vp-c-yellow-2);
    color: var(--vp-c-bg-soft);
}

.expand-indicator {
    flex-shrink: 0;
    color: var(--vp-c-text-3);
    transition: transform 0.3s ease;
}

.message-item.is-expanded .expand-indicator {
    transform: rotate(180deg);
}

.message-content-wrapper {
    overflow: hidden;
    transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.35s ease-in-out;
    max-height: 0;
    opacity: 0;
    margin-top: 0;
}

.message-item.is-expanded .message-content-wrapper {
    max-height: 500px;
    /* 可以根据需要调整 */
    opacity: 1;
    margin-top: 0.75rem;
}


.message-content {
    color: var(--vp-c-text-2);
    line-height: 1.6;
    font-size: 0.875rem;
    word-wrap: break-word;
    white-space: pre-wrap;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--vp-c-divider);
    padding-left: 0.1rem;
    padding-right: 0.1rem;
}

.level-contributor .message-content {
    color: var(--vp-c-text-1);
}

.message-content p {
    margin: 0;
}

.load-more-container {
    text-align: center;
    margin-top: 1.5rem;
}

.load-more-button {
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    border: 1px solid var(--vp-c-brand-soft);
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.load-more-button:hover {
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg-soft);
    border-color: var(--vp-c-brand-1);
}
</style>