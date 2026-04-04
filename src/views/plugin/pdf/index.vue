<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { useLoading } from '@sa/hooks';

// Loading 状态（首次渲染 PDF 前显示骨架屏）
const { loading, endLoading } = useLoading(true);

// PDF 组件实例引用（用于获取页数/打印/下载）
const pdfRef = shallowRef<InstanceType<typeof VuePdfEmbed> | null>(null);
// PDF 资源地址（示例链接）
const source = `https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf`;

// 是否显示所有页面（true 时一次渲染所有页）
const showAllPages = ref(false);
// 当前页码（showAllPages=true 时为 undefined）
const currentPage = ref<undefined | number>(1);
// 总页数
const pageCount = ref(1);

// PDF 渲染完成回调（结束 loading 并读取总页数）
function onPdfRendered() {
  endLoading();

  if (pdfRef.value?.doc) {
    pageCount.value = pdfRef.value.doc.numPages;
  }
}

// “显示所有页面”开关变化处理（切换 currentPage 为 undefined/1）
function showAllPagesChange() {
  currentPage.value = showAllPages.value ? undefined : 1;
}

// 旋转角度数组（每次旋转 90 度）
const rotations = [0, 90, 180, 270];
// 当前旋转索引
const currentRotation = ref(0);

// 旋转处理（循环切换旋转角度）
function handleRotate() {
  currentRotation.value = (currentRotation.value + 1) % 4;
}

// 打印 PDF（调用 VuePdfEmbed.print）
async function handlePrint() {
  await pdfRef.value?.print(undefined, 'test.pdf', true);
}

// 下载 PDF（调用 VuePdfEmbed.download）
async function handleDownload() {
  await pdfRef.value?.download('test.pdf');
}
</script>

<template>
  <!-- PDF 预览插件页：支持旋转/打印/下载/分页与全页显示 -->
  <div class="overflow-hidden">
    <NCard title="PDF 预览" :bordered="false" class="h-full card-wrapper" content-class="overflow-hidden">
      <div class="h-full flex-col-stretch">
        <!-- 项目与文档链接 -->
        <GithubLink link="https://github.com/hrynko/vue-pdf-embed" />
        <WebSiteLink label="文档地址：" link="https://www.npmjs.com/package/vue-pdf-embed" />
        <!-- 顶部操作区 -->
        <div class="flex-y-center justify-end gap-12px">
          <!-- 显示所有页面开关 -->
          <NCheckbox v-model:checked="showAllPages" @update:checked="showAllPagesChange">显示所有页面</NCheckbox>
          <!-- 旋转 -->
          <ButtonIcon tooltip-content="旋转90度" @click="handleRotate">
            <icon-material-symbols-light:rotate-90-degrees-ccw-outline-rounded />
          </ButtonIcon>
          <!-- 打印 -->
          <ButtonIcon tooltip-content="打印" @click="handlePrint">
            <icon-mdi:printer />
          </ButtonIcon>
          <!-- 下载 -->
          <ButtonIcon tooltip-content="下载" @click="handleDownload">
            <icon-charm:download />
          </ButtonIcon>
        </div>
        <!-- PDF 内容区：滚动容器 -->
        <NScrollbar class="flex-1-hidden">
          <!-- 骨架屏：PDF 渲染前显示 -->
          <NSkeleton v-if="loading" size="small" class="mt-12px" text :repeat="12" />
          <!-- PDF 预览组件 -->
          <VuePdfEmbed
            ref="pdfRef"
            class="container overflow-auto"
            :class="{ 'h-0': loading }"
            :rotation="rotations[currentRotation]"
            :page="currentPage"
            :source="source"
            @rendered="onPdfRendered"
          />
        </NScrollbar>
        <!-- 底部分页区 -->
        <div class="flex-y-center justify-between">
          <!-- 全页模式下仅显示总页数 -->
          <div v-if="showAllPages" class="text-18px font-medium">共{{ pageCount }}页</div>
          <!-- 单页模式下显示分页器 -->
          <NPagination v-else v-model:page="currentPage" :page-count="pageCount" :page-size="1" />
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
