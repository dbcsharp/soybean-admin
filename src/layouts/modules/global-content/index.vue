<script setup lang="ts">
import { computed } from 'vue';
import { LAYOUT_SCROLL_EL_ID } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useTabStore } from '@/store/modules/tab';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalContent'
});

// 组件 Props：控制内容区是否增加 padding
interface Props {
  /** Show padding for content */
  showPadding?: boolean;
}

// 声明 props 并设置默认值
withDefaults(defineProps<Props>(), {
  showPadding: true
});

// 获取应用状态（reloadFlag/横向滚动锁定等）
const appStore = useAppStore();
// 获取主题状态（页面切换动画等）
const themeStore = useThemeStore();
// 获取路由缓存配置（include/exclude）
const routeStore = useRouteStore();
// 获取 Tab 状态（用于生成组件 key）
const tabStore = useTabStore();

// 页面切换过渡动画名称（animate=false 时禁用过渡）
const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''));

// 切换路由后重置滚动位置（回到顶部）
function resetScroll() {
  const el = document.querySelector(`#${LAYOUT_SCROLL_EL_ID}`);

  el?.scrollTo({ left: 0, top: 0 });
}
</script>

<template>
  <!-- 全局内容区：负责 RouterView + Transition + KeepAlive 的组合渲染 -->
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-leave="resetScroll"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <!-- KeepAlive：按 routeStore 配置缓存路由组件 -->
      <KeepAlive :include="routeStore.cacheRoutes" :exclude="routeStore.excludeCacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="tabStore.getTabIdByRoute(route)"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
