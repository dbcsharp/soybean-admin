<script setup lang="ts">
import { computed, reactive } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试与 keep-alive 匹配）
defineOptions({
  name: 'PwdLogin'
});

// 获取鉴权 Store（用于执行登录）
const authStore = useAuthStore();
// 获取路由跳转工具（用于切换登录模块）
const { toggleLoginModule } = useRouterPush();
// 获取表单引用与校验方法
const { formRef, validate } = useNaiveForm();

// 表单模型类型（用户名/密码）
interface FormModel {
  // 用户名
  userName: string;
  // 密码
  password: string;
  // FormModel 接口定义结束
}

// 表单数据模型（这里预填默认账号用于演示）
const model: FormModel = reactive({
  userName: 'Soybean',
  password: '123456'
});

// 表单校验规则（放在 computed 内，确保语言切换时文案可响应更新）
const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

// 提交登录（先校验表单，再调用登录接口）
async function handleSubmit() {
  // 校验表单
  await validate();
  // 执行登录
  await authStore.login(model.userName, model.password);
}

// 快捷账号 key 类型
type AccountKey = 'super' | 'admin' | 'user';

// 快捷账号结构（用于一键填充并登录）
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

// 快捷账号列表（使用 i18n 文案作为按钮 label）
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

// 使用快捷账号登录（直接调用登录方法）
async function handleAccountLogin(account: Account) {
  // 执行登录
  await authStore.login(account.userName, account.password);
}
</script>

<template>
  <!-- 密码登录表单：回车触发提交 -->
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <!-- 用户名输入项 -->
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <!-- 密码输入项 -->
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <!-- 表单操作区 -->
    <NSpace vertical :size="24">
      <!-- 记住我与忘记密码 -->
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <!-- 登录按钮 -->
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <!-- 切换到验证码登录 / 注册 -->
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
      <!-- 其他账号登录分隔线 -->
      <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
      <!-- 快捷账号按钮组 -->
      <div class="flex-center gap-12px">
        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">
          {{ item.label }}
        </NButton>
      </div>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
