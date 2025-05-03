// .vitepress/theme/index.js

//默认主题
import DefaultTheme from "vitepress/theme";

import "./custom.css";
import MemberBlock from "../../components/MemberBlock.vue";
import Gallery from "../../components/Gallery.vue";
import Faction from "../../components/Faction.vue";
import GachaSimulator from "../../components/GachaSimulator.vue";
import MessageBoard from "../../components/MessageBoard.vue";



// 主题
import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";


// 新样式
import "vitepress-theme-teek/theme-chalk/tk-mark.css";  
import "vitepress-theme-teek/theme-chalk/tk-sidebar.css"; 
import "vitepress-theme-teek/theme-chalk/tk-code-block-mobile.css"; 

import "vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css";
import "vitepress-theme-teek/theme-chalk/tk-banner-full-img-scale.css";
import "./tk-index-rainbow.scss";

/** @type {import('vitepress').Theme} */
export default {
  extends: Teek,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component("MemberBlock", MemberBlock);
    app.component("Gallery", Gallery);
    app.component("Faction", Faction);
    app.component("GachaSimulator", GachaSimulator);
    app.component("MessageBoard", MessageBoard);
  },
};
