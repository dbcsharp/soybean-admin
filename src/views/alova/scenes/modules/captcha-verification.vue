<script setup lang="ts">
import { computed } from 'vue';
import { actionDelegationMiddleware, useCaptcha, useForm } from '@sa/alova/client';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { sendCaptcha, verifyCaptcha } from '@/service-alova/api';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'CaptchaVerification'
});

// 验证码发送 Hook（使用 actionDelegationMiddleware 实现跨组件触发）
const { loading, send, countdown } = useCaptcha(sendCaptcha, {
  middleware: actionDelegationMiddleware('captcha:send')
});
// 验证码按钮文案（倒计时中显示剩余秒数，否则显示“获取验证码”）
const label = computed(() => {
  return countdown.value > 0
    ? $t('page.login.codeLogin.reGetCode', { time: countdown.value })
    : $t('page.login.codeLogin.getCode');
});
// 表单提交 Hook（提交手机号与验证码到校验接口）
const {
  form,
  loading: submiting,
  send: submit
} = useForm(formData => verifyCaptcha(formData.phone, formData.code), {
  initialForm: {
    phone: '',
    code: ''
  }
});

// 获取表单引用与校验方法（Naive UI Form）
const { formRef, validate } = useNaiveForm();

// 表单校验规则（放在 computed 内，确保语言切换时文案可响应更新）
const rules = computed<Record<keyof typeof form.value, App.Global.FormRule[]>>(() => {
  // 获取基础表单规则
  const { formRules } = useFormRules();

  // 返回字段规则映射
  return {
    phone: formRules.phone,
    code: formRules.code
  };
});

// 提交校验（先校验表单，再提交验证码校验请求）
async function handleSubmit() {
  // 校验表单
  await validate();
  // 提交表单（校验验证码）
  await submit();
  // request
  // 校验成功提示
  window.$message?.success($t('page.login.common.validateSuccess'));
}
</script>

<template>
  <!-- 验证码发送与校验表单：回车触发提交 -->
  <NForm ref="formRef" :model="form" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <!-- 手机号输入项 -->
    <NFormItem path="phone">
      <NInput v-model:value="form.phone" :placeholder="$t('page.login.common.phonePlaceholder')" :maxlength="11" />
    </NFormItem>
    <!-- 验证码输入项 -->
    <NFormItem path="code">
      <!-- 验证码输入 + 获取验证码按钮 -->
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="form.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <!-- 获取验证码：倒计时中禁用，加载中显示 loading -->
        <NButton size="large" :disabled="countdown > 0" :loading="loading" @click="send(form.phone)">
          {{ label }}
        </NButton>
      </div>
    </NFormItem>
    <!-- 提交按钮 -->
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block :loading="submiting" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
