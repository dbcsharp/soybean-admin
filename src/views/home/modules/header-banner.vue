<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'HeaderBanner'
});

// 获取应用状态（用于判断移动端并调整栅格间距）
const appStore = useAppStore();
// 获取鉴权状态（用于读取用户名）
const authStore = useAuthStore();

// 栅格间距：移动端不留横向间距，非移动端使用 16
const gap = computed(() => (appStore.isMobile ? 0 : 16));

// 统计数据结构（用于顶部右侧 NStatistic）
interface StatisticData {
  // 唯一 id（用于 v-for key）
  id: number;
  // 标题文案
  label: string;
  // 显示值
  value: string;
  // StatisticData 接口定义结束
}

// 顶部统计数据（演示用静态数据，可替换为接口返回）
const statisticData = computed<StatisticData[]>(() => [
  {
    id: 0,
    label: $t('page.home.projectCount'),
    value: '25'
  },
  {
    id: 1,
    label: $t('page.home.todo'),
    value: '4/16'
  },
  {
    id: 2,
    label: $t('page.home.message'),
    value: '12'
  }
]);
</script>

<template>
  <!-- 首页头部 Banner：头像/问候语/天气 + 右侧统计数据 -->
  <NCard :bordered="false" class="card-wrapper">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:18">
        <!-- 左侧：头像与问候语 -->
        <div class="flex-y-center">
          <!-- 头像 -->
          <div class="size-72px shrink-0 overflow-hidden rd-1/2">
            <img src="@/assets/imgs/soybean.jpg" class="size-full" />
          </div>
          <!-- 问候语与天气描述 -->
          <div class="pl-12px">
            <h3 class="text-18px font-semibold">
              {{ $t('page.home.greeting', { userName: authStore.userInfo.userName }) }}
            </h3>
            <p class="text-#999 leading-30px">{{ $t('page.home.weatherDesc') }}</p>
          </div>
        </div>
      </NGi>
      <NGi span="24 s:24 m:6">
        <!-- 右侧：统计数据 -->
        <NSpace :size="24" justify="end">
          <NStatistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item" />
        </NSpace>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
