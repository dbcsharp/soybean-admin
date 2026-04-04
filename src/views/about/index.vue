<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import pkg from '~/package.json';

// 获取应用状态（用于判断移动端并调整布局列数）
const appStore = useAppStore();

// 描述列表列数：移动端 1 列，非移动端 2 列
const column = computed(() => (appStore.isMobile ? 1 : 2));

// package.json 数据结构类型（中文说明：用于展示项目名称、版本与依赖信息）
interface PkgJson {
  // 项目名称
  name: string;
  // 项目版本
  version: string;
  // 生产依赖列表
  dependencies: PkgVersionInfo[];
  // 开发依赖列表
  devDependencies: PkgVersionInfo[];
  // PkgJson 接口定义结束
}

// 依赖项结构（中文说明：展示 name/version）
interface PkgVersionInfo {
  // 依赖名称
  name: string;
  // 依赖版本
  version: string;
  // PkgVersionInfo 接口定义结束
}

// 从 package.json 中解构需要展示的字段
const { name, version, dependencies, devDependencies } = pkg;

// 将 [name, version] 二元组转换为对象结构
function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  // 解构二元组
  const [$name, $version] = tuple;
  // 返回依赖项对象
  return {
    name: $name,
    version: $version
  };
  // transformVersionData 函数结束
}

// 标准化后的 package.json 数据（中文说明：将 dependencies/devDependencies 转为数组便于 v-for 渲染）
const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item))
};

// 最近构建时间（由 Vite 注入的 BUILD_TIME 常量）
const latestBuildTime = BUILD_TIME;
</script>

<template>
  <!-- 关于页：项目介绍、项目信息、生产依赖与开发依赖 -->
  <NSpace vertical :size="16">
    <!-- 项目介绍卡片 -->
    <NCard :title="$t('page.about.title')" :bordered="false" size="small" segmented class="card-wrapper">
      <p>{{ $t('page.about.introduction') }}</p>
    </NCard>
    <!-- 项目信息卡片 -->
    <NCard :title="$t('page.about.projectInfo.title')" :bordered="false" size="small" segmented class="card-wrapper">
      <NDescriptions label-placement="left" bordered size="small" :column="column">
        <!-- 版本信息 -->
        <NDescriptionsItem :label="$t('page.about.projectInfo.version')">
          <NTag type="primary">{{ pkgJson.version }}</NTag>
        </NDescriptionsItem>
        <!-- 最近构建时间 -->
        <NDescriptionsItem :label="$t('page.about.projectInfo.latestBuildTime')">
          <NTag type="primary">{{ latestBuildTime }}</NTag>
        </NDescriptionsItem>
        <!-- Github 链接 -->
        <NDescriptionsItem :label="$t('page.about.projectInfo.githubLink')">
          <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.githubLink') }}
          </a>
        </NDescriptionsItem>
        <!-- 预览链接 -->
        <NDescriptionsItem :label="$t('page.about.projectInfo.previewLink')">
          <a class="text-primary" :href="pkg.website" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.previewLink') }}
          </a>
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
    <!-- 生产依赖卡片 -->
    <NCard :title="$t('page.about.prdDep')" :bordered="false" size="small" segmented class="card-wrapper">
      <NDescriptions label-placement="left" bordered size="small" :column="column">
        <!-- 生产依赖列表 -->
        <NDescriptionsItem v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
    <!-- 开发依赖卡片 -->
    <NCard :title="$t('page.about.devDep')" :bordered="false" size="small" segmented class="card-wrapper">
      <NDescriptions label-placement="left" bordered size="small" :column="column">
        <!-- 开发依赖列表 -->
        <NDescriptionsItem v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
