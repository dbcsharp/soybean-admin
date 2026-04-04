<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { useTabStore } from '@/store/modules/tab';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';

// 获取当前路由（用于重新初始化 TabStore）
const route = useRoute();
// 获取应用状态（用于刷新页面）
const appStore = useAppStore();
// 获取鉴权状态（用于切换账号登录与展示角色）
const authStore = useAuthStore();
// 获取 Tab 状态（用于重新初始化 Tabs）
const tabStore = useTabStore();
// 获取权限判断方法（用于演示按钮级权限）
const { hasAuth } = useAuth();
// loading 状态（用于切换账号时禁用按钮）
const { loading, startLoading, endLoading } = useLoading();

// 账号 key 类型
type AccountKey = 'super' | 'admin' | 'user';

// 账号结构（中文说明：用于一键切换账号）
interface Account {
  // 账号标识
  key: AccountKey;
  // 显示文案
  label: string;
  // 用户名
  userName: string;
  // 密码
  password: string;
  // Account 接口定义结束
}

// 账号列表（中文说明：演示用账号）
const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    userName: 'User',
    password: '123456'
  }
]);

// 当前登录账号 key（用于控制按钮 loading/disabled）
const loginAccount = ref<AccountKey>('super');

// 切换账号（中文说明：重新登录、重建 Tabs，并刷新页面以应用新权限）
async function handleToggleAccount(account: Account) {
  // 写入当前选择的账号 key
  loginAccount.value = account.key;

  // 开始 loading
  startLoading();
  // 以指定账号登录（redirect=false：不做登录重定向）
  await authStore.login(account.userName, account.password, false);
  // 重新初始化 TabStore（补齐首页等）
  tabStore.initTabStore(route);
  // 结束 loading
  endLoading();
  // 刷新页面（重置路由缓存并重新挂载）
  appStore.reloadPage();
  // handleToggleAccount 函数结束
}
</script>

<template>
  <!-- 切换权限示例：通过切换账号展示不同路由/按钮权限效果 -->
  <NSpace vertical :size="16">
    <!-- 账号角色与切换账号 -->
    <NCard :title="$t('route.function_toggle-auth')" :bordered="false" size="small" segmented class="card-wrapper">
      <NDescriptions bordered :column="1">
        <!-- 当前用户角色列表 -->
        <NDescriptionsItem :label="$t('page.manage.user.userRole')">
          <NSpace>
            <NTag v-for="role in authStore.userInfo.roles" :key="role">{{ role }}</NTag>
          </NSpace>
        </NDescriptionsItem>
        <!-- 切换账号按钮组 -->
        <NDescriptionsItem ions-item :label="$t('page.function.toggleAuth.toggleAccount')">
          <NSpace>
            <NButton
              v-for="account in accounts"
              :key="account.key"
              :loading="loading && loginAccount === account.key"
              :disabled="loading && loginAccount !== account.key"
              @click="handleToggleAccount(account)"
            >
              {{ account.label }}
            </NButton>
          </NSpace>
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
    <!-- 权限 Hook 示例：按按钮权限码显示不同按钮 -->
    <NCard
      :title="$t('page.function.toggleAuth.authHook')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <NSpace>
        <NButton v-if="hasAuth('B_CODE1')">{{ $t('page.function.toggleAuth.superAdminVisible') }}</NButton>
        <NButton v-if="hasAuth('B_CODE2')">{{ $t('page.function.toggleAuth.adminVisible') }}</NButton>
        <NButton v-if="hasAuth('B_CODE3')">
          {{ $t('page.function.toggleAuth.adminOrUserVisible') }}
        </NButton>
      </NSpace>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
