// .vitepress/theme/index.js

import DefaultTheme from "vitepress/theme";
import "./custom.css";
import MemberBlock from "../../components/MemberBlock.vue";
import Gallery from "../../components/Gallery.vue";
import Faction from "../../components/Faction.vue";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component("MemberBlock", MemberBlock);
    app.component("Gallery", Gallery);
    app.component("Faction", Faction);
  }
}