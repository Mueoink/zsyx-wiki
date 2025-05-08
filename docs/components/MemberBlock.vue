<template>
    <div class="member-block">
        <div v-for="member in filteredMembers" :key="member.text" class="member-item">
            <!-- 成员卡片背景色优先使用 member.color，否则使用 defaultColor (已适配VP主题) -->
            <div class="member-card" :style="{ backgroundColor: member.color || defaultColor }">
                <a v-if="member.avatar || defaultAvatar" :href="(member.avatar || defaultAvatar)" target="_blank"
                    rel="noopener noreferrer" class="member-avatar-link">
                    <div class="member-avatar">
                        <img v-if="member.avatar" :src="member.avatar" alt="头像" />
                        <img v-else-if="defaultAvatar" :src="defaultAvatar" alt="默认头像" />
                        <div v-else class="avatar-placeholder"></div>
                    </div>
                </a>
                <div v-else class="member-avatar">
                    <div class="avatar-placeholder"></div>
                </div>
                <div class="member-text">{{ member.text }}</div>
            </div>
        </div>
        <div v-if="filterNames && filterNames.length > 0 && filteredMembers.length === 0" class="no-members-message">
            在贡献名单中未找到指定的成员。
        </div>

        <div v-if="(!filterNames || filterNames.length === 0) && members && members.length > 0 && filteredMembers.length === 0"
            class="no-members-message">
            请提供 `filterNames` 来指定要显示的成员。
        </div>
    </div>
</template>

<script>
import { teamMembers as defaultInternalMembers } from "../js/teamMembers.js";

export default {
    name: 'MemberBlock',
    props: {
        members: {
            type: Array,
            required: false,
            default: () => (typeof defaultInternalMembers !== 'undefined' ? defaultInternalMembers : [])
        },
        defaultColor: {
            type: String,
            default: 'var(--vp-c-bg-alt)'
        },
        defaultAvatar: {
            type: String,
            default: '/logo.png'
        },
        filterNames: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        filteredMembers() {
            const sourceMembers = this.members;

            // 如果 filterNames 为空数组或未提供，则不渲染任何成员
            if (!this.filterNames || this.filterNames.length === 0) {
                return [];
            }

            // 按照 filterNames 的顺序进行映射和过滤
            return this.filterNames
                .map(nameToFind => {
                    // 在 sourceMembers 中查找与 nameToFind 匹配的成员
                    const member = sourceMembers.find(
                        m => m && typeof m.name === 'string' && m.name === nameToFind
                    );

                    // 如果找到成员，则映射其属性
                    if (member) {
                        return {
                            avatar: member.avatar,
                            text: member.name, // 使用 member.name 作为 text
                            color: member.color // 保留成员自定义颜色
                        };
                    }
                    // 如果未找到，返回 null，后续会过滤掉
                    return null;
                })
                .filter(member => member !== null); // 过滤掉未找到的成员（null 值）
        }
    }
}
</script>

<style scoped>
.member-block {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: flex-start;
    justify-content: center;
    margin-top: 1rem;
}

.member-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.member-card {
    padding: 15px 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 90px;
    min-height: 110px;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    background-color: var(--vp-c-bg-soft);
}

.member-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.member-avatar-link {
    display: block;
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
}

.member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--vp-c-mute);
    border: 2px solid var(--vp-c-bg);
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    background-color: transparent;
}

.member-text {
    font-size: 0.875rem;
    color: var(--vp-c-text-1);
    word-break: break-all;
    max-width: 70px;
    line-height: 1.4;
    margin-top: auto;
    min-height: calc(0.875rem * 1.4 * 2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
}

.no-members-message {
    width: 100%;
    text-align: center;
    color: var(--vp-c-text-2);
    padding: 20px 0;
    font-style: italic;
}
</style>