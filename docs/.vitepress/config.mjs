// https://vitepress.dev/reference/site-config
// .vitepress/config.ts

import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";


// Teek 主题配置
const teekConfig = defineTeekConfig({
  teekHome: false,

  vitePlugins: {
    permalinkOption: {
      ignoreList: ["js", "components"], // 支持正则表达式
    },
    sidebarOption: {
      ignoreList: ["js", "components"], // 支持正则表达式
    },
  },
  //  bodyBgImg: {
  //   imgSrc: ["body.png"], // body 背景图片链接。单张图片 string | 多张图片 string[], 多张图片时每隔 imgInterval 秒换一张
  //   imgOpacity: 0.3, // body 背景图透明度，选值 0.1 ~ 1.0
  //   imgInterval: 15000, //  body 当多张背景图时（imgSrc 为数组），设置切换时间，单位：毫秒
  //   imgShuffle: false, // body 背景图是否随机切换，为 false 时按顺序切换
  //   mask: false, // body 背景图遮罩
  //   maskBg: "rgba(0, 0, 0, 0.2)", // body 背景图遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。mask 为 true 时生效
  // },

  article: {
    showIcon: false, // 作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息的图标是否显示
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 文章日期格式，首页和文章页解析日期时使用
    showInfo: false, // 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息，分别作用于首页和文章页
    showAuthor: false, // 是否展示作者
    showCreateDate: false, // 是否展示创建日期
    showUpdateDate: false, // 是否展示更新日期，仅在文章页显示
    showCategory: false, // 是否展示分类
    showTag: false, // 是否展示标签
  },
  breadcrumb: {
    enabled: false, // 是否启用面包屑
    showCurrentName: false, // 面包屑最后一列是否显示当前文章的文件名
    separator: "/", // 面包屑分隔符
  },
  articleShare: {
    enabled: true, // 是否开启文章链接分享功能
    text: "分享此页面", // 分享按钮文本
    copiedText: "链接已复制", // 复制成功文本
    query: false, // 是否包含查询参数
    hash: false, // 是否包含哈希值
  },
  footerInfo: {
    // 页脚信息，支持 HTML 格式（位于主题版权上方）
    topMessage: ["基于 CC BY-NC-ND 4.0. 发布"],

    // 页脚信息，支持 HTML 格式（位于主题版权下方）
    // bottomMessage: ["Released under the CC BY-NC-ND 4.0."],

    // 主题版权配置
    theme: {
      show: false, // 是否显示主题版权，建议显示
      name: "Mueo", // 自定义名称
      link: "", // 自定义链接
    },

    // 博客版权配置
    copyright: {
      show: true, // 是否显示博客版权
      createYear: 2024, // 创建年份
      suffix: "诸神愚戏 WIKI", // 后缀
    },
    // ICP 备案信息配置
    // icpRecord: {
    //   name: "桂ICP备2021009994号",
    //   link: "http://beian.miit.gov.cn/",
    // },
    //
    // 网络安全备案信息配置
    // securityRecord: {
    //   name: "",
    //   link: "",
    // },
  },
});
// VitePress 配置
export default defineConfig({
  extends: teekConfig,
  title: "诸神愚戏 WIKI",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  description: "诸神愚戏 WIKI",
  lang: "zh",
  lastUpdated: {
    text: "最后更新于",
    formatOptions: {
      dateStyle: "full",
      timeStyle: "medium",
    },
  },
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
          items: [
            { text: "介绍", link: "/wiki/start" },
            { text: "信仰测试", link: "/wiki/test" },
            { text: "虚空祈求", link: "/wiki/pray" },
            { text: "信仰回响", link: "/wiki/divination" },
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
                {
                  text: "虚须吞豚",
                  link: "/wiki/setting/race/hollow-beard -swallow-the-piglet.md",
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
                      text: "诞育",
                      link: "/wiki/gods/main/life/procreative.md",
                    },
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
                {
                  text: "沉沦",
                  collapsed: true,
                  items: [
                    {
                      text: "污堕",
                      link: "/wiki/gods/main/vice/fouling.md",
                    },
                    {
                      text: "腐朽",
                      link: "/wiki/gods/main/vice/rotten.md",
                    },
                    {
                      text: "湮灭",
                      link: "/wiki/gods/main/vice/annihilate.md",
                    },
                  ],
                },
                {
                  text: "文明",
                  collapsed: true,
                  items: [
                    {
                      text: "秩序",
                      link: "/wiki/gods/main/civilized/order.md",
                    },
                    {
                      text: "真理",
                      link: "/wiki/gods/main/civilized/truth.md",
                    },
                    {
                      text: "战争",
                      link: "/wiki/gods/main/civilized/war.md",
                    },
                  ],
                },
                {
                  text: "混沌",
                  collapsed: true,
                  items: [
                    {
                      text: "混乱",
                      link: "/wiki/gods/main/chaos/disarray.md",
                    },
                    {
                      text: "痴愚",
                      link: "/wiki/gods/main/chaos/imbecility.md",
                    },
                    {
                      text: "沉默",
                      link: "/wiki/gods/main/chaos/silence.md",
                    },
                  ],
                },
                {
                  text: "存在",
                  collapsed: true,
                  items: [
                    {
                      text: "记忆",
                      link: "/wiki/gods/main/exist/memory.md",
                    },
                    {
                      text: "时间",
                      link: "/wiki/gods/main/exist/time.md",
                    },
                  ],
                },
                {
                  text: "虚无",
                  collapsed: true,
                  items: [
                    {
                      text: "欺诈",
                      link: "/wiki/gods/main/nothingness/fraud.md",
                    },
                    {
                      text: "命运",
                      link: "/wiki/gods/main/nothingness/fate.md",
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
                {
                  text: "沉沦",
                  collapsed: true,
                  items: [
                    {
                      text: "污堕",
                      link: "/wiki/gods/from_the_gods/vice/fouling.md",
                    },
                    {
                      text: "腐朽",
                      link: "/wiki/gods/from_the_gods/vice/rotten.md",
                    },
                    {
                      text: "湮灭",
                      link: "/wiki/gods/from_the_gods/vice/annihilate.md",
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
          items: [
            { text: "如何贡献", link: "/contribution/contribute" },
            { text: "编写要求", link: "/contribution/compile" },
            { text: "更新指南", link: "/contribution/updata" },
            { text: "内容管理流程规范", link: "/contribution/flow" },
            { text: "贡献审核指南", link: "/contribution/guide" },
            { text: "贡献团队", link: "/contribution/team" },
          ],
        },
        {
          text: "开发",
          items: [{ text: "更新日志", link: "/contribution/logs" }],
        },
      ],
    },

    outline: {
      label: `本页层级`,
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Mueoink/zsyx-wiki/" },
    ],
  },
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
});
