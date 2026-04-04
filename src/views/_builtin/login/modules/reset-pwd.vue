<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ResetPwd'
});

// 获取路由跳转工具（用于切换登录模块）
const { toggleLoginModule } = useRouterPush();
// 获取表单引用与校验方法
const { formRef, validate } = useNaiveForm();

// 表单模型类型（手机号/验证码/密码/确认密码）
interface FormModel {
  // 手机号
  phone: string;
  // 验证码
  code: string;
  // 新密码
  password: string;
  // 确认新密码
  confirmPassword: string;
  // FormModel 接口定义结束
}

// 表单数据模型
const model: FormModel = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

// 校验规则映射类型（中文说明：允许部分字段缺省）
type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;

// 表单校验规则（中文说明：放在 computed 内，确保语言切换时文案可响应更新）
const rules = computed<RuleRecord>(() => {
  // 获取基础规则与确认密码规则工厂方法
  const { formRules, createConfirmPwdRule } = useFormRules();

  // 返回字段规则映射（此处未对 code 设置规则）
  return {
    phone: formRules.phone,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
  // rules 计算回调结束
});

// 提交重置密码（中文说明：先校验表单，再模拟请求成功提示）
async function handleSubmit() {
  // 校验表单
  await validate();
  // request to reset password
  // 这里仅做演示提示，实际项目中应调用重置密码接口
  window.$message?.success($t('page.login.common.validateSuccess'));
  // handleSubmit 函数结束
}
</script>

<template>
  <!-- 重置密码表单：回车触发提交 -->
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <!-- 手机号输入项 -->
    <NFormItem path="phone">
      <NInput v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" />
    </NFormItem>
    <!-- 验证码输入项 -->
    <NFormItem path="code">
      <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
    </NFormItem>
    <!-- 新密码输入项 -->
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <!-- 确认新密码输入项 -->
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
      />
    </NFormItem>
    <!-- 操作按钮区 -->
    <NSpace vertical :size="18" class="w-full">
      <!-- 确认按钮 -->
      <NButton type="primary" size="large" round block @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <!-- 返回密码登录 -->
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
