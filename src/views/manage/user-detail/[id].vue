<script setup lang="ts">
// 用户详情页：动态路由参数 id（占位页面，待完善详情内容）
interface Props {
  // 用户 id（来自路由 params）
  id: string;
  // Props 接口定义结束
}

// 声明 props（中文说明：当前页面为占位，使用 void 读取避免未使用告警）
const props = defineProps<Props>();
void props.id;
</script>

<template>
  <!-- 用户详情占位组件 -->
  <LookForward />
</template>

<style scoped></style>
