<script lang="ts" setup>
import printJS from 'print-js';

// 打印表格（以 json 数据源打印表格）
function printTable() {
  printJS({
    printable: [
      { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' },
      { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' }
    ],
    properties: ['name', 'wechat', 'remark'],
    type: 'json'
  });
}
// 打印图片（传入图片 URL 数组进行打印）
function printImage() {
  printJS({
    printable: [
      'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg',
      'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg'
    ],
    type: 'image',
    header: 'Multiple Images',
    imageStyle: 'width:100%;'
  });
}
</script>

<template>
  <!-- 打印插件页：print-js 示例（表格/图片） -->
  <div class="h-full">
    <NCard title="打印" :bordered="false" class="card-wrapper">
      <!-- 打印表格 -->
      <NButton type="primary" class="mr-10px" @click="printTable">打印表格</NButton>
      <!-- 打印图片 -->
      <NButton type="primary" @click="printImage">打印图片</NButton>
      <template #footer>
        <!-- 项目地址 -->
        <GithubLink label="printJS：" link="https://github.com/crabbly/Print.js" class="mt-10px" />
      </template>
    </NCard>
  </div>
</template>

<style scoped></style>
