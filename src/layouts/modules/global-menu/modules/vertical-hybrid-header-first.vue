<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { SimpleScrollbar } from '@sa/materials';
import { useBoolean } from '@sa/hooks';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';
import FirstLevelMenu from '../components/first-level-menu.vue';
import GlobalLogo from '../../global-logo/index.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'VerticalHybridHeaderFirst'
});

// 当前路由（用于监听路由变化更新展开项）
const route = useRoute();
// 获取应用状态（侧边栏折叠/固定 mix 子菜单等）
const appStore = useAppStore();
// 获取主题状态（侧边栏反转/暗黑模式/自动选中等）
const themeStore = useThemeStore();
// 获取路由状态（菜单树与选中路径计算）
const routeStore = useRouteStore();
// 获取路由跳转方法（带 meta.query）
const { routerPushByKeyWithMetaQuery } = useRouterPush();
// 控制子菜单抽屉显隐（当非固定时 hover/选择后显示）
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
// 混合菜单上下文：一级/二级/子级菜单与激活 key 等
const {
  firstLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  getActiveFirstLevelMenuKey,
  secondLevelMenus,
  activeSecondLevelMenuKey,
  isActiveSecondLevelMenuHasChildren,
  handleSelectSecondLevelMenu,
  getActiveSecondLevelMenuKey,
  childLevelMenus,
  hasChildLevelMenus,
  activeDeepestLevelMenuKey
} = useMixMenuContext('VerticalHybridHeaderFirst');
// 菜单上下文：当前选中 key
const { selectedKey } = useMenu();

// 菜单是否反色（亮色模式且 sider.inverted=true 时反色）
const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

// 是否显示子菜单抽屉（有子级菜单且（已打开或固定））
const showDrawer = computed(() => hasChildLevelMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

// 选择二级（混合侧栏）菜单：若有子级则打开抽屉
function handleSelectMixMenu(key: RouteKey) {
  handleSelectSecondLevelMenu(key);

  if (isActiveSecondLevelMenuHasChildren.value) {
    setDrawerVisible(true);
  }
}

// 选择一级菜单（顶部横向）：根据 autoSelectFirstMenu 决定是否自动跳转到最深菜单
function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  if (secondLevelMenus.value.length === 0) return;

  const secondFirstMenuKey = secondLevelMenus.value[0].routeKey;

  // 不自动选中：仅用于展示，如果存在三级菜单则展开
  if (!themeStore.sider.autoSelectFirstMenu) {
    const hasChildren = secondLevelMenus.value.find(menu => menu.key === secondFirstMenuKey)?.children?.length;

    if (hasChildren) {
      handleSelectMixMenu(secondFirstMenuKey);
    }
    return;
  }

  // 自动选中：直接跳转到最深层菜单，并关闭抽屉
  activeDeepestLevelMenuKey();
  setDrawerVisible(false);
}

// 鼠标离开：关闭抽屉，并在非固定模式下恢复激活菜单
function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
    getActiveSecondLevelMenuKey();
  }
}

// 展开菜单 key 列表（用于子级 NMenu）
const expandedKeys = ref<string[]>([]);

// 更新展开项（折叠状态或无选中项时清空，否则展开选中路径）
function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

// 监听路由 name 变化：同步展开项
watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <!-- 垂直混合-顶部优先：顶部横向一级菜单 + 侧边混合二级菜单 + 子级抽屉 -->
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="activeFirstLevelMenuKey"
      :options="firstLevelMenus"
      :indent="18"
      responsive
      @update:value="handleSelectMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <!-- 二级菜单：缩略图标列表 -->
      <FirstLevelMenu
        :menus="secondLevelMenus"
        :active-menu-key="activeSecondLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <!-- 顶部 Logo：仅显示图标 -->
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <!-- 子级菜单容器：用于过渡宽度 -->
      <div
        class="relative h-full transition-width-300"
        :style="{
          width: appStore.mixSiderFixed && hasChildLevelMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px'
        }"
      >
        <!-- 子级菜单抽屉：按 showDrawer 控制宽度 -->
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
        >
          <!-- 抽屉头部：系统标题 + 固定按钮 -->
          <header class="flex-y-center justify-between px-12px" :style="{ height: themeStore.header.height + 'px' }">
            <h2 class="text-16px text-primary font-bold">{{ $t('system.title') }}</h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <!-- 子级菜单列表 -->
          <SimpleScrollbar>
            <NMenu
              v-model:expanded-keys="expandedKeys"
              mode="vertical"
              :value="selectedKey"
              :options="childLevelMenus"
              :inverted="inverted"
              :indent="18"
              @update:value="routerPushByKeyWithMetaQuery"
            />
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
