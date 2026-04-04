<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from '@sa/materials';
import type { LayoutMode } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalHeader from '../modules/global-header/index.vue';
import GlobalSider from '../modules/global-sider/index.vue';
import GlobalTab from '../modules/global-tab/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';
import ThemeDrawer from '../modules/theme-drawer/index.vue';
import { provideMixMenuContext } from '../modules/global-menu/context';

// 组件选项：设置组件名称（便于 Devtools 调试与 keep-alive 匹配）
defineOptions({
  name: 'BaseLayout'
});

// 获取应用状态（移动端/侧边栏折叠/全屏内容等）
const appStore = useAppStore();
// 获取主题状态（布局模式/头部/标签栏/侧边栏宽度等）
const themeStore = useThemeStore();
// 注入混合菜单上下文（用于二级/子级菜单的计算）
const { secondLevelMenus, childLevelMenus, isActiveFirstLevelMenuHasChildren } = provideMixMenuContext();

// GlobalMenu 使用异步组件加载（减少首屏 bundle）
const GlobalMenu = defineAsyncComponent(() => import('../modules/global-menu/index.vue'));

// 计算 AdminLayout 的布局模式（主题 mode 包含 vertical 则为 vertical，否则为 horizontal）
const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical';
  const horizontal: LayoutMode = 'horizontal';
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal;
});

// 头部组件参数（不同布局模式下控制 logo/menu/menu-toggler 的显示）
const headerProps = computed(() => {
  const { mode } = themeStore.layout;

  const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
    vertical: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false
    },
    'vertical-hybrid-header-first': {
      showLogo: !isActiveFirstLevelMenuHasChildren.value,
      showMenu: true,
      showMenuToggler: false
    },
    horizontal: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    'top-hybrid-sidebar-first': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    'top-hybrid-header-first': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: isActiveFirstLevelMenuHasChildren.value
    }
  };

  return headerPropsConfig[mode];
});

// 是否显示侧边栏（横向布局不显示侧边栏）
const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal');

// 是否为“左侧混合”布局
const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix');

// 是否为“左侧混合-顶部优先”布局
const isVerticalHybridHeaderFirst = computed(() => themeStore.layout.mode === 'vertical-hybrid-header-first');

// 是否为“顶部混合-侧边优先”布局
const isTopHybridSidebarFirst = computed(() => themeStore.layout.mode === 'top-hybrid-sidebar-first');

// 是否为“顶部混合-顶部优先”布局
const isTopHybridHeaderFirst = computed(() => themeStore.layout.mode === 'top-hybrid-header-first');

// 侧边栏展开宽度（根据布局模式与 mixSiderFixed/菜单层级动态计算）
const siderWidth = computed(() => getSiderAndCollapsedWidth(false));

// 侧边栏折叠宽度（根据布局模式与 mixSiderFixed/菜单层级动态计算）
const siderCollapsedWidth = computed(() => getSiderAndCollapsedWidth(true));

// 根据是否折叠计算侧边栏最终宽度
function getSiderAndCollapsedWidth(isCollapsed: boolean) {
  const {
    mixChildMenuWidth,
    collapsedWidth,
    width: themeWidth,
    mixCollapsedWidth,
    mixWidth: themeMixWidth
  } = themeStore.sider;

  const width = isCollapsed ? collapsedWidth : themeWidth;
  const mixWidth = isCollapsed ? mixCollapsedWidth : themeMixWidth;

  // 顶部混合-顶部优先：如果一级菜单无子级，则隐藏侧边栏
  if (isTopHybridHeaderFirst.value) {
    return isActiveFirstLevelMenuHasChildren.value ? width : 0;
  }

  // 左侧混合-顶部优先：如果一级菜单无子级，则隐藏侧边栏
  if (isVerticalHybridHeaderFirst.value && !isActiveFirstLevelMenuHasChildren.value) {
    return 0;
  }

  // 混合布局：使用 mixWidth，否则使用普通 width
  const isMixMode = isVerticalMix.value || isTopHybridSidebarFirst.value || isVerticalHybridHeaderFirst.value;
  let finalWidth = isMixMode ? mixWidth : width;

  // 左侧混合：固定二级菜单时追加子菜单宽度
  if (isVerticalMix.value && appStore.mixSiderFixed && secondLevelMenus.value.length) {
    finalWidth += mixChildMenuWidth;
  }

  // 左侧混合-顶部优先：固定子菜单时追加子菜单宽度
  if (isVerticalHybridHeaderFirst.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    finalWidth += mixChildMenuWidth;
  }

  // 返回最终宽度
  return finalWidth;
}
</script>

<template>
  <!-- 基础布局：统一承载 Header/Tab/Sider/Menu/Content/Footer/ThemeDrawer -->
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :footer-height="themeStore.footer.height"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
  >
    <template #header>
      <!-- 全局头部 -->
      <GlobalHeader v-bind="headerProps" />
    </template>
    <template #tab>
      <!-- 全局标签页栏 -->
      <GlobalTab />
    </template>
    <template #sider>
      <!-- 全局侧边栏 -->
      <GlobalSider />
    </template>
    <!-- 全局菜单（异步加载） -->
    <GlobalMenu />
    <!-- 全局内容区 -->
    <GlobalContent />
    <!-- 主题配置抽屉 -->
    <ThemeDrawer />
    <template #footer>
      <!-- 全局底部 -->
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar();
}
</style>
