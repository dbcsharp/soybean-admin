<script setup lang="ts">
import { ref } from 'vue';
import { useTabStore } from '@/store/modules/tab';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

// 获取 Tab Store（用于演示新增/关闭/修改标签页）
const tabStore = useTabStore();
// 获取路由跳转方法（用于打开指定路由并创建 Tab）
const { routerPushByKey } = useRouterPush();

// 自定义标签页标题输入值
const tabLabel = ref('');

// 修改当前标签页标题（将输入值设置为 newLabel）
function changeTabLabel() {
  tabStore.setTabLabel(tabLabel.value);
}

// 重置当前标签页标题（清空 newLabel，回退到 oldLabel/label）
function resetTabLabel() {
  tabStore.resetTabLabel();
}
</script>

<template>
  <!-- 标签页功能示例：Tab 操作与 Tab 标题修改 -->
  <NSpace vertical :size="16">
    <!-- Tab 操作示例 -->
    <NCard
      :title="$t('page.function.tab.tabOperate.title')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <!-- 添加 Tab -->
      <NDivider title-placement="left">{{ $t('page.function.tab.tabOperate.addTab') }}</NDivider>
      <NButton @click="routerPushByKey('about')">{{ $t('page.function.tab.tabOperate.addTabDesc') }}</NButton>
      <!-- 关闭 Tab -->
      <NDivider title-placement="left">{{ $t('page.function.tab.tabOperate.closeTab') }}</NDivider>
      <NSpace>
        <NButton @click="tabStore.removeActiveTab">
          {{ $t('page.function.tab.tabOperate.closeCurrentTab') }}
        </NButton>
        <NButton @click="tabStore.removeTabByRouteName('about')">
          {{ $t('page.function.tab.tabOperate.closeAboutTab') }}
        </NButton>
      </NSpace>
      <!-- 添加多 Tab -->
      <NDivider title-placement="left">{{ $t('page.function.tab.tabOperate.addMultiTab') }}</NDivider>
      <NSpace>
        <NButton @click="routerPushByKey('function_multi-tab')">
          {{ $t('page.function.tab.tabOperate.addMultiTabDesc1') }}
        </NButton>
        <NButton @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })">
          {{ $t('page.function.tab.tabOperate.addMultiTabDesc2') }}
        </NButton>
      </NSpace>
    </NCard>
    <!-- Tab 标题示例 -->
    <NCard
      :title="$t('page.function.tab.tabTitle.title')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <!-- 修改标题 -->
      <NDivider title-placement="left">{{ $t('page.function.tab.tabTitle.changeTitle') }}</NDivider>
      <NInputGroup class="max-w-240px">
        <NInput v-model:value="tabLabel" />
        <NButton type="primary" @click="changeTabLabel">{{ $t('page.function.tab.tabTitle.change') }}</NButton>
      </NInputGroup>
      <!-- 重置标题 -->
      <NDivider title-placement="left">{{ $t('page.function.tab.tabTitle.resetTitle') }}</NDivider>
      <NButton type="error" ghost class="w-80px" @click="resetTabLabel">
        {{ $t('page.function.tab.tabTitle.reset') }}
      </NButton>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
