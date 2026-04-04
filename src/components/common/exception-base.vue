<script lang="ts" setup>
import { computed } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'ExceptionBase' });

// 异常类型：403/404/500
type ExceptionType = '403' | '404' | '500';

// 组件 Props：异常类型
interface Props {
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType;
}

// 声明 props
const props = defineProps<Props>();

// 获取路由跳转方法
const { routerPushByKey } = useRouterPush();

// 异常类型对应本地图标名
const iconMap: Record<ExceptionType, string> = {
  '403': 'no-permission',
  '404': 'not-found',
  '500': 'service-error'
};

// 当前显示的图标
const icon = computed(() => iconMap[props.type]);
</script>

<template>
  <!-- 异常页基础组件：展示异常图标与返回首页按钮 -->
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon :local-icon="icon" />
    </div>
    <NButton type="primary" @click="routerPushByKey('root')">{{ $t('common.backToHome') }}</NButton>
  </div>
</template>

<style scoped></style>
