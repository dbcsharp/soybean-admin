<script lang="ts" setup>
import { ref } from 'vue';
import { icons } from './icons';

// 当前选择的图标值（用于图标选择器 v-model）
const selectValue = ref('');

// 本地图标文件名列表（用于 SvgIcon 的 local-icon 动态渲染）
const localIcons = ['custom-icon', 'activity', 'at-sign', 'cast', 'chrome', 'copy', 'wind'];
</script>

<template>
  <!-- 图标插件页：展示 iconify 图标与自定义本地图标 -->
  <div class="h-full">
    <NCard title="Icon组件示例" :bordered="false" class="card-wrapper">
      <!-- iconify 图标网格 -->
      <div class="grid grid-cols-10">
        <template v-for="item in icons" :key="item">
          <div class="mt-5px flex-x-center">
            <SvgIcon :icon="item" class="text-30px" />
          </div>
        </template>
      </div>
      <!-- 图标选择器示例 -->
      <div class="mt-50px">
        <h1 class="mb-20px text-18px font-500">Icon图标选择器</h1>
        <CustomIconSelect v-model:value="selectValue" :icons="icons" />
      </div>
      <template #footer>
        <!-- Iconify 图标库链接 -->
        <WebSiteLink label="iconify地址：" link="https://icones.js.org/" class="mt-10px" />
      </template>
    </NCard>
    <!-- 自定义本地图标示例 -->
    <NCard title="自定义图标示例" :bordered="false" class="mt-10px card-wrapper">
      <div class="pb-12px text-16px">
        在src/assets/svg-icon文件夹下的svg文件，通过在template里面以 icon - local - {文件名} 直接渲染,
        其中icon-local为.env文件里的 VITE_ICON_LOCAL_PREFIX
      </div>
      <div class="grid grid-cols-10">
        <div class="mt-5px flex-x-center">
          <icon-local-activity class="text-40px text-success" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-local-cast class="text-20px text-error" />
        </div>
      </div>
      <!-- SvgIcon 动态渲染本地图标 -->
      <div class="py-12px text-16px">通过SvgIcon组件动态渲染, 菜单通过meta的localIcon属性渲染自定义图标</div>
      <div class="grid grid-cols-10">
        <div v-for="(fileName, index) in localIcons" :key="index" class="mt-5px flex-x-center">
          <SvgIcon :local-icon="fileName" class="text-30px text-primary" />
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
