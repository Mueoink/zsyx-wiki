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
                        <template v-if="message.level === '普通'">
                            <div class="name-badge-line-normal">
                                <span class="message-name" :class="{ 'anonymous': !message.name }">
                                    {{ message.name || '匿名用户' }}
                                </span>
                                <span v-if="message.badges && message.badges[0]" class="badge faith-badge">
                                    {{ message.badges[0] }}
                                </span>
                                <span v-if="message.badges && message.badges[1]" class="badge profession-badge">
                                    {{ message.badges[1] }}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <span class="message-name" :class="{ 'anonymous': !message.name }">
                                {{ message.name || '匿名用户' }}
                            </span>
                            <div class="badge-row">
                                <span v-if="message.level !== '普通'"
                                    :class="['badge', getLevelBadgeClass(message.level)]">
                                    {{ message.level }}
                                </span>
                                <span v-if="message.badges && message.badges[0]" class="badge faith-badge">
                                    {{ message.badges[0] }}
                                </span>
                                <span v-if="message.badges && message.badges[1]" class="badge profession-badge">
                                    {{ message.badges[1] }}
                                </span>
                            </div>
                        </template>
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
                <button @click.stop="loadMore" class="load-more-button">
                    加载更多留言
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, PropType, reactive } from 'vue';

interface Message {
    text: string;
    level: '贡献者' | '支持者' | '普通';
    name?: string;
    avatar?: string;
    badges?: string[];
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

const getLevelSortOrder = (level: Message['level']): number => {
    switch (level) {
        case '贡献者':
            return 0;
        case '支持者':
            return 1;
        case '普通':
        default:
            return 2;
    }
};

const processedMessages = computed(() => {
    const messagesWithIndex = props.messages.map((message, index) => ({
        ...message,
        originalIndex: index
    }));

    return messagesWithIndex.sort((a, b) => {
        const levelOrderA = getLevelSortOrder(a.level);
        const levelOrderB = getLevelSortOrder(b.level);

        if (levelOrderA !== levelOrderB) {
            return levelOrderA - levelOrderB;
        }
        return a.originalIndex - b.originalIndex;
    });
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
    return message.level !== '普通' && !!message.avatar;
};

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
    background-color: var(--vp-c-green-soft);
}


.message-header {
    display: flex;
    align-items: center;
    gap: 0.85rem;
}

.avatar-wrapper {
    flex-shrink: 0;
    align-self: flex-start;
}

.avatar-container {
    padding: 1px;
    background-color: rgba(3, 3, 3, 0.41);
    border-radius: 50%;
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
    margin-right: 0.5rem;
}

.name-badge-line-normal {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.4rem;
    width: 100%;
}


.message-name {
    font-weight: 500;
    color: var(--vp-c-text-1);
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.name-badge-line-normal .message-name {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    flex-shrink: 1;
}


.message-name.anonymous {
    font-weight: 400;
    color: var(--vp-c-text-2);
    font-style: italic;
}

.badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.2rem;
    line-height: 1.2;
}

.badge {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    vertical-align: baseline;
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.95);
}

.badge-contributor {
    background-color: rgba(47, 37, 235, 0.834);
}

.level-contributor .faith-badge {
    background-color: rgba(118, 44, 229, 0.862);

}

.level-contributor .profession-badge {
    background-color: rgb(70, 121, 231);

}

.badge-supporter {
    background-color: rgb(217, 105, 6);
}

.level-supporter .faith-badge {
    background-color: rgb(252, 67, 39);

}

.level-supporter .profession-badge {
    background-color: rgb(249, 165, 10);

}

.level-normal .faith-badge {
    background-color: rgb(13, 204, 102);
}

.level-normal .profession-badge {
    background-color: rgb(9, 162, 121);

}


.expand-indicator {
    flex-shrink: 0;
    color: var(--vp-c-text-3);
    transition: transform 0.3s ease;
    align-self: center;
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

.level-contributor .message-content,
.level-supporter .message-content {
    color: var(--vp-c-text-1);
}

.level-normal .message-content {
    color: var(--vp-c-text-2);
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