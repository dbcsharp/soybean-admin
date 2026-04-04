<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useSvgIcon } from '@/hooks/common/icon';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'UserAvatar'
});

// 获取鉴权状态（用于判断登录态与读取用户名）
const authStore = useAuthStore();
// 获取路由跳转方法（用户中心/跳转登录）
const { routerPushByKey, toLogin } = useRouterPush();
// 获取 SvgIcon VNode 工具（用于下拉菜单图标）
const { SvgIconVNode } = useSvgIcon();

// 未登录时点击：跳转登录/注册页
function loginOrRegister() {
  toLogin();
}

// 下拉菜单 key
type DropdownKey = 'user-center' | 'logout';

// 下拉菜单项类型（普通项/分割线）
type DropdownOption =
  | {
      key: DropdownKey;
      label: string;
      icon?: () => VNode;
    }
  | {
      type: 'divider';
      key: string;
    };

// 下拉菜单选项（用户中心/退出登录）
const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.userCenter'),
      key: 'user-center',
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 })
    },
    {
      type: 'divider',
      key: 'divider'
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ];

  return opts;
});

// 退出登录（中文说明：弹出确认对话框，确认后清空 authStore）
function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore();
    }
  });
}

// 下拉菜单选择处理
function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    // 其它项：按 route key 直接跳转
    routerPushByKey(key);
  }
}
</script>

<template>
  <!-- 用户入口：未登录显示登录按钮，已登录显示头像/用户名下拉菜单 -->
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div>
      <ButtonIcon>
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
