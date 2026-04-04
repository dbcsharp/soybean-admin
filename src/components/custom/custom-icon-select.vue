<script lang="ts" setup>
import { computed, ref } from 'vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'CustomIconSelect' });

// 组件 Props：图标列表与当前选中值
interface Props {
  /** Selected icon */
  value: string;
  /** List of icons */
  icons: string[];
  /** Icon for when nothing is selected */
  emptyIcon?: string;
}

// 声明 props 并设置默认空值图标
const props = withDefaults(defineProps<Props>(), {
  emptyIcon: 'mdi:apps'
});

// 组件事件：更新选中值
interface Emits {
  (e: 'update:value', val: string): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 内部双向绑定：桥接 props.value 与 update:value
const modelValue = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  }
});

// 当前展示图标：优先选中值，否则用 emptyIcon
const selectedIcon = computed(() => modelValue.value || props.emptyIcon);

// 搜索关键字
const searchValue = ref('');

// 过滤后的图标列表
const iconsList = computed(() => props.icons.filter(v => v.includes(searchValue.value)));

// 选择图标：更新 modelValue
function handleChange(iconItem: string) {
  modelValue.value = iconItem;
}
</script>

<template>
  <!-- 图标选择器：点击输入框弹出 Popover，支持搜索与选择 -->
  <NPopover placement="bottom-end" trigger="click">
    <template #trigger>
      <NInput v-model:value="modelValue" readonly placeholder="点击选择图标">
        <template #suffix>
          <SvgIcon :icon="selectedIcon" class="p-5px text-30px" />
        </template>
      </NInput>
    </template>
    <template #header>
      <!-- 搜索输入 -->
      <NInput v-model:value="searchValue" placeholder="搜索图标"></NInput>
    </template>
    <!-- 图标网格列表 -->
    <div v-if="iconsList.length > 0" class="grid grid-cols-9 h-auto overflow-auto">
      <span v-for="iconItem in iconsList" :key="iconItem" @click="handleChange(iconItem)">
        <SvgIcon
          :icon="iconItem"
          class="m-2px cursor-pointer border-1px border-#d9d9d9 p-5px text-30px"
          :class="{ 'border-primary': modelValue === iconItem }"
        />
      </span>
    </div>
    <!-- 无结果 -->
    <NEmpty v-else class="w-306px" description="你什么也找不到" />
  </NPopover>
</template>

<style lang="scss" scoped>
:deep(.n-input-wrapper) {
  padding-right: 0;
}

:deep(.n-input__suffix) {
  border: 1px solid #d9d9d9;
}
</style>
