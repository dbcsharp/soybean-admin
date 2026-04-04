<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core';
import type { RouteKey } from '@elegant-router/types';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalBreadcrumb'
});

// 获取主题状态（面包屑显隐/是否显示图标）
const themeStore = useThemeStore();
// 获取路由状态（面包屑数据）
const routeStore = useRouteStore();
// 获取路由跳转方法
const { routerPushByKey } = useRouterPush();

// 面包屑内容组件 Props
interface BreadcrumbContentProps {
  breadcrumb: App.Global.Menu;
}

// 创建可复用模板：DefineBreadcrumbContent 用于定义，BreadcrumbContent 用于使用
const [DefineBreadcrumbContent, BreadcrumbContent] = createReusableTemplate<BreadcrumbContentProps>();

// 点击面包屑下拉菜单项：按 route key 跳转
function handleClickMenu(key: RouteKey) {
  routerPushByKey(key);
}
</script>

<template>
  <!-- 全局面包屑：支持下拉子菜单并可选显示图标 -->
  <NBreadcrumb v-if="themeStore.header.breadcrumb.visible">
    <!-- define component start: BreadcrumbContent -->
    <DefineBreadcrumbContent v-slot="{ breadcrumb }">
      <div class="i-flex-y-center align-middle">
        <!-- 面包屑图标：按配置决定是否显示 -->
        <component :is="breadcrumb.icon" v-if="themeStore.header.breadcrumb.showIcon" class="mr-4px text-icon" />
        {{ breadcrumb.label }}
      </div>
    </DefineBreadcrumbContent>
    <!-- define component end: BreadcrumbContent -->

    <NBreadcrumbItem v-for="item in routeStore.breadcrumbs" :key="item.key">
      <!-- 有下拉选项时显示 NDropdown -->
      <NDropdown v-if="item.options?.length" :options="item.options" @select="handleClickMenu">
        <BreadcrumbContent :breadcrumb="item" />
      </NDropdown>
      <!-- 无下拉选项时直接渲染 -->
      <BreadcrumbContent v-else :breadcrumb="item" />
    </NBreadcrumbItem>
  </NBreadcrumb>
</template>

<style scoped></style>
