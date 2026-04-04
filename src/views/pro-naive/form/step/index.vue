<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { createProForm } from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

// 当前步骤
const step = ref(1);
// 提交 loading
const submiting = ref(false);
// Naive UI message 实例
const message = useMessage();
// 第一步表单实例
const form = createProForm();

// 第二步表单实例（中文说明：提交时合并两步表单值）
const form2 = createProForm({
  onSubmit: async values => {
    submiting.value = true;
    await delay(1000);
    message.success(
      JSON.stringify({
        ...form.values.value,
        ...values
      })
    );
    submiting.value = false;
  }
});

// 校验通过后进入下一步
function toNextStepAfterValidated() {
  form.validate()?.then(() => {
    step.value += 1;
  });
}

// 延迟工具（中文说明：模拟请求耗时）
function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}
</script>

<template>
  <!-- ProNaiveUI 分步表单示例：两步表单校验与合并提交 -->
  <ConfigProvider>
    <div class="color-#fff">
      <ProCard :title="$t('page.proNaive.form.step.title')" :segmented="{ content: true }" :show-collapse="false">
        <div class="flex flex-col items-center justify-center">
          <!-- 步骤条 -->
          <NSteps :current="step" class="mb-50px ml-200px w-60%">
            <NStep :title="$t('page.proNaive.form.step.step1.title')" />
            <NStep :title="$t('page.proNaive.form.step.step2.title')" />
          </NSteps>
          <template v-if="step === 1">
            <!-- 第一步 -->
            <ProForm :form="form" label-placement="left">
              <ProInput :title="$t('page.proNaive.form.step.step1.field')" path="form1Field" required />
              <NButton @click="toNextStepAfterValidated">{{ $t('page.proNaive.form.step.step1.nextStep') }}</NButton>
            </ProForm>
          </template>
          <template v-if="step === 2">
            <!-- 第二步 -->
            <ProForm :form="form2" :loading="submiting" label-placement="left">
              <ProInput :title="$t('page.proNaive.form.step.step2.field')" path="form2Field" required />
              <NFlex>
                <NButton :disabled="submiting" @click="step -= 1">
                  {{ $t('page.proNaive.form.step.step2.prevStep') }}
                </NButton>
                <NButton type="primary" attr-type="submit" :loading="submiting">
                  {{ $t('page.proNaive.form.step.step2.submit') }}
                </NButton>
              </NFlex>
            </ProForm>
          </template>
        </div>
      </ProCard>
    </div>
  </ConfigProvider>
</template>
