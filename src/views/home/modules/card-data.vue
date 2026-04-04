<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'CardData'
});

// 卡片数据结构（用于展示统计标题/数值/渐变背景与图标）
interface CardData {
  // 唯一 key（用于 v-for key）
  key: string;
  // 标题文案
  title: string;
  // 数值
  value: number;
  // 单位（前缀）
  unit: string;
  // 渐变色配置
  color: {
    // 渐变起始色
    start: string;
    // 渐变结束色
    end: string;
    // color 对象结束
  };
  // 图标名称（SvgIcon）
  icon: string;
  // CardData 接口定义结束
}

// 卡片数据列表（演示用静态数据，可替换为接口返回）
const cardData = computed<CardData[]>(() => [
  {
    key: 'visitCount',
    title: $t('page.home.visitCount'),
    value: 9725,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    key: 'turnover',
    title: $t('page.home.turnover'),
    value: 1026,
    unit: '$',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'ant-design:money-collect-outlined'
  },
  {
    key: 'downloadCount',
    title: $t('page.home.downloadCount'),
    value: 970925,
    unit: '',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'carbon:document-download'
  },
  {
    key: 'dealCount',
    title: $t('page.home.dealCount'),
    value: 9527,
    unit: '',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'ant-design:trademark-circle-outlined'
  }
]);

// 渐变背景组件 Props（通过 gradientColor 注入 backgroundImage）
interface GradientBgProps {
  // 渐变背景字符串（linear-gradient）
  gradientColor: string;
  // GradientBgProps 接口定义结束
}

// 创建可复用模板：DefineGradientBg 用于定义，GradientBg 用于使用
const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

// 获取主题状态（用于读取主题圆角并应用到卡片）
const themeStore = useThemeStore();

// 将颜色配置转换为 CSS linear-gradient 字符串
function getGradientColor(color: CardData['color']) {
  // 返回右下角渐变
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <!-- 数据统计卡片组 -->
  <NCard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <!-- 定义渐变背景组件：为默认插槽包裹渐变背景与圆角 -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div
        class="px-16px pb-4px pt-8px text-white"
        :style="{ backgroundImage: gradientColor, borderRadius: themeStore.themeRadius + 'px' }"
      >
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <!-- 卡片栅格：响应式 1/2/4 列 -->
    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <!-- 单个统计卡片 -->
      <NGi v-for="item in cardData" :key="item.key">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
