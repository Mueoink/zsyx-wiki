<!-- MemberBlock.vue -->

<template>
    <div class="member-block">
        <div v-for="member in members" :key="member.text" class="member-item">
            <div class="member-card" :style="{ backgroundColor: member.color || defaultColor }">
                <a v-if="member.avatar || defaultAvatar" :href="(member.avatar || defaultAvatar)" target="_blank"
                    rel="noopener noreferrer" class="member-avatar-link">
                    <div class="member-avatar">
                        <img v-if="member.avatar" :src="member.avatar" alt="头像" />
                        <img v-else-if="defaultAvatar" :src="defaultAvatar" alt="默认头像" />
                        <div v-else class="avatar-placeholder"></div> <!-- 如果都没有，则显示占位符 -->
                    </div>
                </a>
                <div v-else class="member-avatar">
                    <div class="avatar-placeholder"></div>
                </div>
                <div class="member-text">{{ member.text }}</div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'MemberBlock',
    props: {
        members: {
            type: Array,
            required: true,
            default: () => []
        },
        defaultColor: {
            type: String,
            default: '#dcdbdb'
        },
        defaultAvatar: {
            type: String,
            default: '/logo.png'
        }
    }
}
</script>

<style scoped>
.member-block {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
    vertical-align: top;
    justify-content: center;
    /* 修改为 center */
}

.member-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.member-card {
    padding: 25px;
    /* 卡片内边距 */
    border-radius: 6px;
    /* 卡片圆角 */
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.member-avatar-link {
    display: block;
    width: 40px;
    height: 40px;
    margin-bottom: 0px;
}

.member-avatar {
    width: 40px;
    height: 40px;
    margin-bottom: 0px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    
}

.avatar-placeholder {
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0);

}

.member-text {
    font-size: 0.8em;
    color: var(--vp-c-text-2);
    word-break: break-word;
    word-wrap: break-word;
    max-width: 80px;
    line-height: 1.2;
    margin-top: 4px;
}
</style>