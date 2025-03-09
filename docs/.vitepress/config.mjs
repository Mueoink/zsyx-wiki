import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: "诸神愚戏 WIKI",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  description: "诸神愚戏 WIKI",
  lang: "zh",
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.png",
    search: { provider: "local" },
    nav: [
      { text: "WIKI", link: "/wiki/start", activeMatch: "/wiki/" },
      {
        text: "贡献",
        link: "/contribution/contribute",
        activeMatch: "/contribution/",
      },
    ],
    editLink: {
      pattern: "https://github.com/Mueoink/zsyx-wiki/tree/main/docs/:path",
      text: "编辑此页",
    },

    sidebar: {
      "/wiki/": [
        {
          text: "开始",
          collapsed: false,
          items: [
            { text: "介绍", link: "/wiki/start" },
            { text: "信仰测试", link: "/wiki/test" },
          ],
        },

        // 总览
        {
          text: "总览",
          collapsed: false,
          items: [
            { text: "世界观", link: "/wiki/setting/world_setting.md" },
            { text: "基础规则", link: "/wiki/setting/rule.md" },
            {
              text: "地理档案",
              collapsed: true,
              items: [
                {
                  text: "希望之州",
                  link: "/wiki/setting/geography/state_of_hope.md",
                },
              ],
            },
            {
              text: "种族档案",
              collapsed: true,
              items: [
                {
                  text: "蕈足人",
                  link: "/wiki/setting/race/mushroom-footed.md",
                },
              ],
            },
          ],
        },

        // 诸神信仰
        {
          text: "诸神信仰",
          collapsed: false,
          items: [
            { text: "概览", link: "/wiki/gods/main.md" },
            {
              text: "真神名录",
              collapsed: true,
              items: [
                {
                  text: "生命",
                  collapsed: true,
                  items: [
                    {
                      text: "繁荣",
                      link: "/wiki/gods/main/life/prosperity.md",
                    },
                    {
                      text: "死亡",
                      link: "/wiki/gods/main/life/dead.md",
                    },
                  ],
                },
              ],
            },
            {
              text: "从神档案",
              collapsed: true,
              items: [
                {
                  text: "生命",
                  collapsed: true,
                  items: [
                    {
                      text: "繁荣",
                      link: "/wiki/gods/from_the_gods/life/vibrant.md",
                    },
                  ],
                },
              ],
            },
            {
              text: "野神档案",
              collapsed: true,
              items: [{}],
            },
          ],
        },

        // 角色档案
        {
          text: "角色档案",
          collapsed: false,
          items: [
            {
              text: "主要角色信息",
              collapsed: true,
              items: [
                {
                  text: "程实",
                  link: "/wiki/characters/main/cheng_shi.md",
                },
                {
                  text: "神选名单",
                  link: "/wiki/characters/main/chosen.md",
                },
                {
                  text: "重要角色",
                  link: "/wiki/characters/main/important.md",
                },
              ],
            },
            { text: "次要角色信息", link: "/wiki/characters/minor.md" },
          ],
        },

        // 道具天赋档案
        {
          text: "道具天赋档案",
          collapsed: false,
          items: [
            { text: "道具档案", link: "/wiki/assets/props.md" },
            { text: "未知分类", link: "/wiki/assets/unclassified.md" },
            { text: "天赋档案", link: "/wiki/assets/skills.md" },
          ],
        },

        // 势力组织
        {
          text: "势力组织",
          collapsed: false,
          items: [
            { text: "势力概览", link: "/wiki/organization/main.md" },
            {
              text: "玩家势力",
              collapsed: true,
              items: [
                {
                  text: "传火者",
                  link: "/wiki/organization/player/flame.md",
                },
                {
                  text: "理质协会",
                  link: "/wiki/organization/player/rational-principles",
                },
                {
                  text: "秩序联盟",
                  link: "/wiki/organization/player/alliance-for-order",
                },
                {
                  text: "自然教派",
                  link: "/wiki/organization/player/nature-sect",
                },
                {
                  text: "亡灵超度会",
                  link: "/wiki/organization/player/dead-souls",
                },
                {
                  text: "历史学派",
                  link: "/wiki/organization/player/historical",
                },
                {
                  text: "崇神会",
                  link: "/wiki/organization/player/gods-worship",
                },
                {
                  text: "棺中人",
                  link: "/wiki/organization/player/coffin",
                },
                {
                  text: "庸人会",
                  link: "/wiki/organization/player/average-joe-club",
                },
                {
                  text: "命定之人",
                  link: "/wiki/organization/player/destined-person",
                },
                {
                  text: "丑角",
                  link: "/wiki/organization/player/clown.md",
                },
              ],
            },
            {
              text: "非玩家势力",
              collapsed: true,
              items: [
                {
                  text: "理质之塔",
                  link: "/wiki/organization/npc/tower-of-reason.md",
                },
                {
                  text: "大审判庭",
                  link: "/wiki/organization/npc/grand-chamber.md",
                },
                {
                  text: "余晖教廷",
                  link: "/wiki/organization/npc/dusk-holy-see.md",
                },
                {
                  text: "生命教会",
                  link: "/wiki/organization/npc/life-church",
                },
                {
                  text: "自然联盟",
                  link: "/wiki/organization/npc/natural-union",
                },
                {
                  text: "代理之手",
                  link: "/wiki/organization/npc/agent-hand",
                },
                {
                  text: "极欲兄弟会",
                  link: "/wiki/organization/npc/greed-brotherhood",
                },
                {
                  text: "战争之国",
                  link: "/wiki/organization/npc/war-country",
                },
                {
                  text: "窃子兄弟会",
                  link: "/wiki/organization/npc/bastard-brotherhood",
                },
              ],
            },
          ],
        },

        // 情节与事件
        {
          text: "情节与事件",
          collapsed: false,
          items: [
            {
              text: "小说剧情时间线",
              collapsed: true,
              items: [
                { text: "第一卷", link: "/wiki/story/main/first.md" },
                { text: "第二卷", link: "/wiki/story/main/sec.md" },
                { text: "第三卷", link: "/wiki/story/main/thr.md" },
              ],
            },
            {
              text: "纪元故事线",
              collapsed: true,
              items: [
                { text: "第一纪元-生命", link: "/wiki/story/age/first_age.md" },
                { text: "第二纪元-沉沦", link: "/wiki/story/age/sec_age.md" },
                { text: "第三纪元-文明", link: "/wiki/story/age/thr_age.md" },
                { text: "第四纪元-混沌", link: "/wiki/story/age/four_age.md" },
                { text: "第五纪元-存在", link: "/wiki/story/age/five_age.md" },
                { text: "第六纪元-虚无", link: "/wiki/story/age/six_age.md" },
              ],
            },
          ],
        },

        // 同人收录
        {
          text: "同人收录",
          collapsed: true,
          items: [
            {
              text: "诸神牌",
              collapsed: true,
              items: [
                { text: "规则", link: "/wiki/fanwork/puke/rule.md" },
                { text: "体系详情", link: "/wiki/fanwork/puke/details.md" },
              ],
            },
          ],
        },
      ],

      "/contribution/": [
        {
          text: "贡献",
          collapsed: false,
          items: [
            { text: "如何贡献", link: "/contribution/contribute" },
            { text: "编写要求", link: "/contribution/compile" },
            { text: "贡献审核指南", link: "/contribution/guide" },
            { text: "贡献团队", link: "/contribution/team" },
          ],
        },
      ],
    },

    outline: {
      label: `本页层级`,
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Mueoink/zsyx-wiki/" },
    ],
    markdown: {
      container: {
        tipLabel: "提示",
        warningLabel: "警告",
        dangerLabel: "危险",
        infoLabel: "信息",
        detailsLabel: "详细信息",
      },
    },
    footer: {
      message: "Released under the CC BY-NC-ND 4.0.",
      copyright: "Copyright © 2024-present Mueo",
    },
  },
});
