<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useElementBounding } from '@vueuse/core';
import { PageTab } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useTabStore } from '@/store/modules/tab';
import { isPC } from '@/utils/agent';
import BetterScroll from '@/components/custom/better-scroll.vue';
import ContextMenu from './context-menu.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalTab'
});

// 当前路由（用于初始化与新增 Tab）
const route = useRoute();
// 获取应用状态（reloadFlag/全内容等）
const appStore = useAppStore();
// 获取主题状态（tab 模式/中键关闭等）
const themeStore = useThemeStore();
// 获取 Tab 状态（tab 列表/当前激活 tab）
const tabStore = useTabStore();

// BetterScroll 容器引用（用于计算宽度与位置）
const bsWrapper = ref<HTMLElement>();
// 容器宽度与左侧偏移（用于计算滚动目标）
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);
// BetterScroll 实例引用
const bsScroll = ref<InstanceType<typeof BetterScroll>>();
// tab 列表容器引用（用于遍历子节点定位当前激活 tab）
const tabRef = ref<HTMLElement>();
// 是否 PC 端（用于 BetterScroll click 参数）
const isPCFlag = isPC();

// tab DOM 上用于保存 tabId 的 data 属性名
const TAB_DATA_ID = 'data-tab-id';
// 鼠标中键按钮 code
const MIDDLE_MOUSE_BUTTON = 1;
// 鼠标右键按钮 code
const RIGHT_MOUSE_BUTTON = 2;

// NamedNodeMap 扩展：包含 TAB_DATA_ID 对应的 Attr
type TabNamedNodeMap = NamedNodeMap & {
  [TAB_DATA_ID]: Attr;
};

// 将滚动条移动到当前激活的 tab（中文说明：取 tab 中心点对齐容器中心）
async function scrollToActiveTab() {
  await nextTick();
  if (!tabRef.value) return;

  const { children } = tabRef.value;

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    const { value: tabId } = (child.attributes as TabNamedNodeMap)[TAB_DATA_ID];

    if (tabId === tabStore.activeTabId) {
      const { left, width } = child.getBoundingClientRect();
      const clientX = left + width / 2;

      setTimeout(() => {
        scrollByClientX(clientX);
      }, 50);

      break;
    }
  }
}

// 根据屏幕坐标 clientX 计算需要滚动的距离，并调用 BetterScroll.scrollBy
function scrollByClientX(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;

  if (bsScroll.value?.instance) {
    const { maxScrollX, x: leftX, scrollBy } = bsScroll.value.instance;

    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);

    scrollBy(update, 0, 300);
  }
}

// 获取右键菜单禁用项（中文说明：首页等保留 tab 禁用“关闭当前/关闭左侧”）
function getContextMenuDisabledKeys(tabId: string) {
  const disabledKeys: App.Global.DropdownKey[] = [];

  if (tabStore.isTabRetain(tabId)) {
    const homeDisable: App.Global.DropdownKey[] = ['closeCurrent', 'closeLeft'];
    disabledKeys.push(...homeDisable);
  }

  return disabledKeys;
}

// 关闭 tab（中文说明：从 tabStore 中移除指定 tab）
function handleCloseTab(tab: App.Global.Tab) {
  tabStore.removeTab(tab.id);
}

// 鼠标按下事件：处理中键关闭 tab（按配置且非保留 tab 才允许关闭）
function handleMousedown(e: MouseEvent, tab: App.Global.Tab) {
  const isMiddleClick = e.button === MIDDLE_MOUSE_BUTTON;
  if (!isMiddleClick || !themeStore.tab.closeTabByMiddleClick) {
    return;
  }

  if (tabStore.isTabRetain(tab.id)) {
    return;
  }

  e.preventDefault();
  handleCloseTab(tab);
}

// 切换 tab（中文说明：过滤中键/右键，左键触发路由切换）
function switchTab(e: MouseEvent, tab: App.Global.Tab) {
  if ([MIDDLE_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON].includes(e.button)) return;

  tabStore.switchRouteByTab(tab);
}

// 刷新页面（中文说明：触发 appStore.reloadPage，强制重新渲染 RouterView）
async function refresh() {
  appStore.reloadPage(500);
}

// 右键菜单状态结构
interface DropdownConfig {
  visible: boolean;
  x: number;
  y: number;
  tabId: string;
}

// 右键菜单状态（中文说明：控制 ContextMenu 的显示/位置/目标 tab）
const dropdown: DropdownConfig = reactive({
  visible: false,
  x: 0,
  y: 0,
  tabId: ''
});

// 合并更新右键菜单状态
function setDropdown(config: Partial<DropdownConfig>) {
  Object.assign(dropdown, config);
}

// 是否处于“点击右键菜单”过程（用于避免 visible 被外部 update 覆盖）
let isClickContextMenu = false;

// 右键菜单显隐变化处理（中文说明：非右键触发场景才同步 visible）
function handleDropdownVisible(visible: boolean | undefined) {
  if (!isClickContextMenu) {
    setDropdown({ visible });
  }
}

// 触发右键菜单（中文说明：先隐藏再延迟显示，避免位置更新不生效）
async function handleContextMenu(e: MouseEvent, tabId: string) {
  e.preventDefault();

  const { clientX, clientY } = e;

  isClickContextMenu = true;

  const DURATION = dropdown.visible ? 150 : 0;

  setDropdown({ visible: false });

  setTimeout(() => {
    setDropdown({
      visible: true,
      x: clientX,
      y: clientY,
      tabId
    });
    isClickContextMenu = false;
  }, DURATION);
}

// 初始化 TabStore（中文说明：创建首页等保留 tab）
function init() {
  tabStore.initTabStore(route);
}

// 移除焦点（中文说明：用于移动端点击空白处收起输入焦点）
function removeFocus() {
  (document.activeElement as HTMLElement)?.blur();
}

// watch
// 监听路由变化：自动新增 tab
watch(
  () => route.fullPath,
  () => {
    tabStore.addTab(route);
  }
);
// 监听激活 tab 变化：自动滚动到可视区域
watch(
  () => tabStore.activeTabId,
  () => {
    scrollToActiveTab();
  }
);

// init
init();
</script>

<template>
  <!-- 全局标签页栏：支持水平滚动、右键菜单、中键关闭与刷新/全内容按钮 -->
  <DarkModeContainer class="size-full flex-y-center px-16px shadow-tab">
    <div ref="bsWrapper" class="h-full flex-1-hidden">
      <BetterScroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: !isPCFlag }" @click="removeFocus">
        <div
          ref="tabRef"
          class="h-full flex pr-18px"
          :class="[
            themeStore.tab.mode === 'chrome' || themeStore.tab.mode === 'slider' ? 'items-end' : 'items-center gap-12px'
          ]"
        >
          <PageTab
            v-for="tab in tabStore.tabs"
            :key="tab.id"
            :[TAB_DATA_ID]="tab.id"
            :mode="themeStore.tab.mode"
            :dark-mode="themeStore.darkMode"
            :active="tab.id === tabStore.activeTabId"
            :active-color="themeStore.themeColor"
            :closable="!tabStore.isTabRetain(tab.id)"
            @pointerdown="switchTab($event, tab)"
            @mousedown="handleMousedown($event, tab)"
            @close="handleCloseTab(tab)"
            @contextmenu="handleContextMenu($event, tab.id)"
          >
            <template #prefix>
              <SvgIcon :icon="tab.icon" :local-icon="tab.localIcon" class="inline-block align-text-bottom text-16px" />
            </template>
            <div class="max-w-240px ellipsis-text">{{ tab.label }}</div>
          </PageTab>
        </div>
      </BetterScroll>
    </div>
    <!-- 刷新按钮 -->
    <ReloadButton :loading="!appStore.reloadFlag" @click="refresh" />
    <!-- 全内容切换（隐藏 header/sider/tab 等） -->
    <FullScreen :full="appStore.fullContent" @click="appStore.toggleFullContent" />
  </DarkModeContainer>
  <!-- Tab 右键菜单 -->
  <ContextMenu
    :visible="dropdown.visible"
    :tab-id="dropdown.tabId"
    :disabled-keys="getContextMenuDisabledKeys(dropdown.tabId)"
    :x="dropdown.x"
    :y="dropdown.y"
    @update:visible="handleDropdownVisible"
  />
</template>

<style scoped></style>
