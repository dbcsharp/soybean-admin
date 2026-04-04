<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useCaptcha } from '@/hooks/business/captcha';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'CodeLogin'
});

// 获取路由跳转工具（用于切换登录模块）
const { toggleLoginModule } = useRouterPush();
// 获取表单引用与校验方法
const { formRef, validate } = useNaiveForm();
// 获取验证码 Hook（按钮文案/倒计时/加载态/获取验证码方法）
const { label, isCounting, loading, getCaptcha } = useCaptcha();

// 表单模型类型（手机号/验证码）
interface FormModel {
  // 手机号
  phone: string;
  // 验证码
  code: string;
  // FormModel 接口定义结束
}

// 表单数据模型
const model: FormModel = reactive({
  phone: '',
  code: ''
});

// 表单校验规则（中文说明：放在 computed 内，确保语言切换时文案可响应更新）
const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // 获取基础表单规则
  const { formRules } = useFormRules();

  // 返回字段规则映射
  return {
    phone: formRules.phone,
    code: formRules.code
  };
  // rules 计算回调结束
});

// 提交验证码登录（中文说明：先校验表单，再模拟请求成功提示）
async function handleSubmit() {
  // 校验表单
  await validate();
  // request
  // 这里仅做演示提示，实际项目中应调用登录接口
  window.$message?.success($t('page.login.common.validateSuccess'));
  // handleSubmit 函数结束
}
</script>

<template>
  <!-- 验证码登录表单：回车触发提交 -->
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <!-- 手机号输入项 -->
    <NFormItem path="phone">
      <NInput v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" />
    </NFormItem>
    <!-- 验证码输入项 -->
    <NFormItem path="code">
      <!-- 验证码输入 + 获取验证码按钮 -->
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <!-- 获取验证码：倒计时中禁用，加载中显示 loading -->
        <NButton size="large" :disabled="isCounting" :loading="loading" @click="getCaptcha(model.phone)">
          {{ label }}
        </NButton>
      </div>
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
