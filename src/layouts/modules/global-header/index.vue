<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalLogo from '../global-logo/index.vue';
import GlobalBreadcrumb from '../global-breadcrumb/index.vue';
import GlobalSearch from '../global-search/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalHeader'
});

// 组件 Props：控制是否显示 Logo/菜单折叠按钮/顶部菜单容器
interface Props {
  /** Whether to show the logo */
  showLogo?: App.Global.HeaderProps['showLogo'];
  /** Whether to show the menu toggler */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler'];
  /** Whether to show the menu */
  showMenu?: App.Global.HeaderProps['showMenu'];
}

// 声明组件 props
defineProps<Props>();

// 获取应用状态（移动端/侧边栏折叠/语言等）
const appStore = useAppStore();
// 获取主题状态（头部配置/暗黑模式等）
const themeStore = useThemeStore();
// 全屏控制（浏览器全屏，不等同于“全内容”模式）
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <!-- 全局头部：Logo/折叠按钮/面包屑/搜索/全屏/语言/主题/用户 -->
  <DarkModeContainer class="h-full flex-y-center px-12px shadow-header">
    <!-- 左侧：Logo（可选显示） -->
    <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: themeStore.sider.width + 'px' }" />
    <!-- 菜单折叠按钮（可选显示） -->
    <MenuToggler v-if="showMenuToggler" :collapsed="appStore.siderCollapse" @click="appStore.toggleSiderCollapse" />
    <!-- 顶部菜单占位容器：菜单组件会挂载到该节点 -->
    <div v-if="showMenu" :id="GLOBAL_HEADER_MENU_ID" class="h-full flex-y-center flex-1-hidden"></div>
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <!-- 面包屑：仅非移动端显示 -->
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
    </div>
    <!-- 右侧：功能区 -->
    <div class="h-full flex-y-center justify-end">
      <!-- 全局搜索 -->
      <GlobalSearch v-if="themeStore.header.globalSearch.visible" />
      <!-- 浏览器全屏：仅非移动端显示 -->
      <FullScreen v-if="!appStore.isMobile" :full="isFullscreen" @click="toggle" />
      <!-- 语言切换 -->
      <LangSwitch
        v-if="themeStore.header.multilingual.visible"
        :lang="appStore.locale"
        :lang-options="appStore.localeOptions"
        @change-lang="appStore.changeLocale"
      />
      <!-- 主题模式切换（明亮/暗黑/跟随系统） -->
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleThemeScheme"
      />
      <!-- 主题配置按钮 -->
      <ThemeButton />
      <!-- 用户头像与下拉菜单 -->
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
