<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'SearchResult' });

// 组件 Props：搜索结果菜单列表
interface Props {
  options: App.Global.Menu[];
}

// 声明 props
defineProps<Props>();

// 组件事件：触发“回车跳转”
interface Emits {
  (e: 'enter'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 获取主题状态（用于 active 高亮背景色）
const theme = useThemeStore();

// 当前高亮的 routePath（v-model:path）
const active = defineModel<string>('path', { required: true });

// 鼠标移入：更新高亮项
async function handleMouseEnter(item: App.Global.Menu) {
  active.value = item.routePath;
}

// 点击跳转：交由父组件统一处理
function handleTo() {
  emit('enter');
}
</script>

<template>
  <!-- 搜索结果列表：支持鼠标 hover 高亮与点击跳转 -->
  <NScrollbar>
    <div class="pb-12px">
      <template v-for="item in options" :key="item.routePath">
        <div
          class="mt-8px h-56px flex-y-center cursor-pointer justify-between rounded-4px bg-#e5e7eb px-14px dark:bg-dark"
          :style="{
            background: item.routePath === active ? theme.themeColor : '',
            color: item.routePath === active ? '#fff' : ''
          }"
          @click="handleTo"
          @mouseenter="handleMouseEnter(item)"
        >
          <!-- 菜单图标 -->
          <component :is="item.icon" />
          <span class="ml-5px flex-1">
            {{ (item.i18nKey && $t(item.i18nKey)) || item.label }}
          </span>
          <!-- Enter 图标提示 -->
          <icon-ant-design-enter-outlined class="icon mr-3px p-2px text-20px" />
        </div>
      </template>
    </div>
  </NScrollbar>
</template>

<style lang="scss" scoped></style>
