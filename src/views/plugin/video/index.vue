<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';

// 播放器挂载容器 DOM 引用
const domRef = ref<HTMLElement>();
// 播放器实例引用
const player = ref<Player>();

// 渲染视频播放器（中文说明：创建 xgplayer 实例并设置播放地址与倍速）
function renderXgPlayer() {
  if (!domRef.value) return;
  const url = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4';
  player.value = new Player({
    el: domRef.value,
    url,
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
}
// 销毁播放器（中文说明：组件卸载时释放资源）
function destroyXgPlayer() {
  player.value?.destroy();
}

// 组件挂载后初始化播放器
onMounted(() => {
  renderXgPlayer();
});

// 组件卸载时销毁播放器
onUnmounted(() => {
  destroyXgPlayer();
});
</script>

<template>
  <!-- 视频播放器插件页：xgplayer 示例 -->
  <div>
    <NCard title="视频播放器插件" :bordered="false" class="h-full card-wrapper">
      <div class="flex-center">
        <!-- 播放器容器 -->
        <div ref="domRef" class="h-auto w-full shadow-md"></div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
