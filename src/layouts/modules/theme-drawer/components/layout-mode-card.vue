<script setup lang="ts">
import type { PopoverPlacement } from 'naive-ui';
import { themeLayoutModeRecord } from '@/constants/app';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'LayoutModeCard'
});

// 组件 Props：当前布局模式与禁用状态
interface Props {
  /** Layout mode */
  mode: UnionKey.ThemeLayoutMode;
  /** Disabled */
  disabled?: boolean;
}

// 声明 props
const props = defineProps<Props>();

// 组件事件：更新布局模式
interface Emits {
  /** Layout mode change */
  (e: 'update:mode', mode: UnionKey.ThemeLayoutMode): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 布局卡片配置结构（中文说明：不同布局模式下 tooltip 位置与卡片内部结构 class）
type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {
    placement: PopoverPlacement;
    menuClass: string;
    mainClass: string;
  }
>;

// 各布局模式的卡片配置（中文说明：menuClass/mainClass 用于描述布局示意图比例）
const layoutConfig: LayoutConfig = {
  vertical: {
    placement: 'bottom',
    menuClass: 'w-1/3 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  'vertical-mix': {
    placement: 'bottom',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  'vertical-hybrid-header-first': {
    placement: 'bottom',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  horizontal: {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-full h-3/4'
  },
  'top-hybrid-sidebar-first': {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  },
  'top-hybrid-header-first': {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  }
};

// 切换布局模式（disabled=true 时不响应）
function handleChangeMode(mode: UnionKey.ThemeLayoutMode) {
  if (props.disabled) return;

  emit('update:mode', mode);
}
</script>

<template>
  <!-- 布局模式卡片：点击选择布局模式，hover 显示说明 -->
  <div class="grid grid-cols-2 gap-x-16px gap-y-12px md:grid-cols-3">
    <div
      v-for="(item, key) in layoutConfig"
      :key="key"
      class="flex-col-center cursor-pointer"
      @click="handleChangeMode(key)"
    >
      <!-- tooltip：展示布局细节说明 -->
      <IconTooltip :placement="item.placement">
        <template #trigger>
          <!-- 卡片主体：ring 表示选中态 -->
          <div
            class="h-64px w-96px gap-6px rd-4px p-6px shadow ring-2 ring-transparent transition-all hover:ring-primary"
            :class="{ '!ring-primary': mode === key }"
          >
            <!-- 布局示意图插槽：按布局模式选择对应 slot -->
            <div class="h-full w-full gap-1" :class="[key.includes('vertical') ? 'flex' : 'flex-col']">
              <slot :name="key"></slot>
            </div>
          </div>
        </template>
        {{ $t(`theme.layout.layoutMode.${key}_detail`) }}
      </IconTooltip>
      <!-- 布局名称 -->
      <p class="mt-8px text-12px">{{ $t(themeLayoutModeRecord[key]) }}</p>
    </div>
  </div>
</template>

<style scoped></style>
