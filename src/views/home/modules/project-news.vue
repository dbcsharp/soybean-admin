<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ProjectNews'
});

// 项目动态结构（用于列表渲染）
interface NewsItem {
  // 唯一 id（用于 v-for key）
  id: number;
  // 动态内容
  content: string;
  // 时间字符串
  time: string;
  // NewsItem 接口定义结束
}

// 项目动态列表（演示用静态数据，可替换为接口返回）
const newses = computed<NewsItem[]>(() => [
  { id: 1, content: $t('page.home.projectNews.desc1'), time: '2021-05-28 22:22:22' },
  { id: 2, content: $t('page.home.projectNews.desc2'), time: '2021-10-27 10:24:54' },
  { id: 3, content: $t('page.home.projectNews.desc3'), time: '2021-10-31 22:43:12' },
  { id: 4, content: $t('page.home.projectNews.desc4'), time: '2021-11-03 20:33:31' },
  { id: 5, content: $t('page.home.projectNews.desc5'), time: '2021-11-07 22:45:32' }
]);
</script>

<template>
  <!-- 项目动态卡片：标题 + 更多入口 + 动态列表 -->
  <NCard :title="$t('page.home.projectNews.title')" :bordered="false" size="small" segmented class="card-wrapper">
    <!-- 头部右侧更多入口 -->
    <template #header-extra>
      <a class="text-primary" href="javascript:;">{{ $t('page.home.projectNews.moreNews') }}</a>
    </template>
    <!-- 动态列表 -->
    <NList>
      <!-- 单条动态 -->
      <NListItem v-for="item in newses" :key="item.id">
        <!-- 前缀：头像 -->
        <template #prefix>
          <SoybeanAvatar class="size-48px!" />
        </template>
        <!-- 内容：标题 + 时间 -->
        <NThing :title="item.content" :description="item.time" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
