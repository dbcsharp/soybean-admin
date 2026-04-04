<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'LangSwitch'
});

// 组件 Props：当前语言、语言选项与是否显示 tooltip
interface Props {
  /** Current language */
  lang: App.I18n.LangType;
  /** Language options */
  langOptions: App.I18n.LangOption[];
  /** Show tooltip */
  showTooltip?: boolean;
}

// 声明 props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  showTooltip: true
});

// 组件事件：切换语言
type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

// 声明 emits
const emit = defineEmits<Emits>();

// tooltip 文案（中文说明：showTooltip=false 时返回空字符串）
const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.lang');
});

/** Add bottom margin to all options except the last one for proper visual separation */
// 下拉选项（中文说明：除最后一项外增加 margin-bottom，提升视觉分隔）
const dropdownOptions = computed(() => {
  const lastIndex = props.langOptions.length - 1;

  return props.langOptions.map((option, index) => ({
    ...option,
    props: {
      class: index < lastIndex ? 'mb-1' : undefined
    }
  }));
});

// 触发语言切换
function changeLang(lang: App.I18n.LangType) {
  emit('changeLang', lang);
}
</script>

<template>
  <!-- 语言切换：hover 打开下拉菜单 -->
  <NDropdown :value="lang" :options="dropdownOptions" trigger="hover" @select="changeLang">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="heroicons:language" />
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
