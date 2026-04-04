<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { SimpleScrollbar } from '@sa/materials';
import { transformColorWithOpacity } from '@sa/color';
import type { RouteKey } from '@elegant-router/types';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'FirstLevelMenu'
});

// 组件 Props：一级菜单列表与展示状态（反色/折叠/主题色等）
interface Props {
  menus: App.Global.Menu[];
  activeMenuKey?: string;
  inverted?: boolean;
  siderCollapse?: boolean;
  darkMode?: boolean;
  themeColor: string;
}

// 声明 props
const props = defineProps<Props>();

// 组件事件：选中菜单/切换侧边栏折叠
interface Emits {
  (e: 'select', menuKey: RouteKey): boolean;
  (e: 'toggleSiderCollapse'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// Mix 菜单项模板 Props
interface MixMenuItemProps {
  /** Menu item label */
  label: App.Global.Menu['label'];
  /** Menu item icon */
  icon: App.Global.Menu['icon'];
  /** Active menu item */
  active: boolean;
  /** Mini size */
  isMini?: boolean;
}
// 创建可复用模板：DefineMixMenuItem 用于定义，MixMenuItem 用于使用
const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>();

// 选中背景色（中文说明：根据主题色 + 模式混合透明度，兼容暗黑/亮色）
const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = props;

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff');
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000');

  return darkMode ? dark : light;
});

// 点击菜单项：触发 select 事件
function handleClickMixMenu(menuKey: RouteKey) {
  emit('select', menuKey);
}

// 切换侧边栏折叠：触发 toggleSiderCollapse 事件
function toggleSiderCollapse() {
  emit('toggleSiderCollapse');
}
</script>

<template>
  <!-- define component: MixMenuItem -->
  <DefineMixMenuItem v-slot="{ label, icon, active, isMini }">
    <div
      class="mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px transition-300 hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': inverted,
        '!text-white !bg-primary': active && inverted
      }"
    >
      <!-- 菜单图标 -->
      <component :is="icon" :class="[isMini ? 'text-icon-small' : 'text-icon-large']" />
      <!-- 菜单标题：折叠状态下收起高度 -->
      <p
        class="w-full ellipsis-text text-center text-12px transition-height-300"
        :class="[isMini ? 'h-0 pt-0' : 'h-20px pt-4px']"
      >
        {{ label }}
      </p>
    </div>
  </DefineMixMenuItem>
  <!-- define component end: MixMenuItem -->

  <!-- 一级菜单容器：顶部 slot + 菜单列表 + 折叠开关 -->
  <div class="h-full flex-col-stretch flex-1-hidden">
    <slot></slot>
    <!-- 菜单列表：可滚动 -->
    <SimpleScrollbar>
      <MixMenuItem
        v-for="menu in menus"
        :key="menu.key"
        :label="menu.label"
        :icon="menu.icon"
        :active="menu.key === activeMenuKey"
        :is-mini="siderCollapse"
        @click="handleClickMixMenu(menu.routeKey)"
      />
    </SimpleScrollbar>
    <!-- 折叠按钮 -->
    <MenuToggler
      arrow-icon
      :collapsed="siderCollapse"
      :z-index="99"
      :class="{ 'text-white:88 !hover:text-white': inverted }"
      @click="toggleSiderCollapse"
    />
  </div>
</template>

<style scoped>
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}
</style>
