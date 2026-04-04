<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { createProForm, zhCN } from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

// 提交 loading 状态
const submiting = ref(false);
// Naive UI message 实例
const message = useMessage();

// ProForm 实例（包含初始值、重置与提交回调）
const form = createProForm({
  initialValues: {
    attributes: [
      {
        name: $t('page.proNaive.form.basic.color'),
        items: [
          { name: $t('page.proNaive.form.basic.specificationColorRed') },
          { name: $t('page.proNaive.form.basic.specificationColorOrange') }
        ]
      }
    ]
  },
  onReset: () => {
    message.success('reset success');
  },
  onSubmit: async values => {
    submiting.value = true;
    await delay(1000);
    message.success(JSON.stringify(values));
    submiting.value = false;
  }
});

// 延迟工具（模拟请求耗时）
function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}

// 填充表单值（演示多种给 ProForm 回填值的方式）
function fillValues() {
  const values = {
    appName: $t('page.proNaive.form.basic.appName'),
    appStatus: 0,
    responseDate: Date.now()
  };
  // 方式一：直接修改 form.values.value
  // form.values.value.appName = '应用名称';
  // form.values.value.appStatus = 0;
  // form.values.value.responseDate = Date.now();

  // 方式二：使用 Object.assign
  Object.assign(form.values.value, values);

  // 方式三：直接重写 form.values.value
  // form.values.value = {...}
}
</script>

<template>
  <!-- ProNaiveUI 表单示例：基础表单（含 ProFormList） -->
  <ConfigProvider :locale="zhCN">
    <ProForm
      :form="form"
      :loading="submiting"
      :rules="{
        appName: {
          required: true
        }
      }"
    >
      <ProCard :title="$t('page.proNaive.form.basic.title')" :show-collapse="false">
        <template #header-extra>
          <!-- 头部操作：填充值/重置/提交 -->
          <NFlex>
            <NButton @click="fillValues">{{ $t('page.proNaive.form.basic.fillValue') }}</NButton>
            <NButton attr-type="reset">{{ $t('page.proNaive.form.basic.reset') }}</NButton>
            <NButton type="primary" attr-type="submit" :loading="submiting">
              {{ $t('page.proNaive.form.basic.submit') }}
            </NButton>
          </NFlex>
        </template>
        <!-- 表单内容：网格布局 -->
        <NGrid cols="1 s:2 l:3" :x-gap="16" responsive="screen">
          <NGi>
            <ProInput
              :title="$t('page.proNaive.form.basic.appName')"
              :tooltip="$t('page.proNaive.form.basic.appName')"
              path="appName"
            />
          </NGi>
          <NGi>
            <ProSelect
              :title="$t('page.proNaive.form.basic.appStatus')"
              path="appStatus"
              :field-props="{
                options: [
                  { label: $t('page.proNaive.form.basic.normal'), value: 0 },
                  { label: $t('page.proNaive.form.basic.anomaly'), value: 1 }
                ]
              }"
            />
          </NGi>
          <NGi>
            <ProDate :title="$t('page.proNaive.form.basic.createTime')" path="createTime" />
          </NGi>
          <NGi>
            <ProDate :title="$t('page.proNaive.form.basic.responseDate')" path="responseDate" required />
          </NGi>
          <NGi :span="3">
            <!-- ProFormList：规格信息（嵌套 FormList） -->
            <ProFormList
              :title="$t('page.proNaive.form.basic.specificationInfo')"
              path="attributes"
              :min="1"
              :creator-initial-value="
                () => ({
                  name: $t('page.proNaive.form.basic.color'),
                  items: [
                    { name: $t('page.proNaive.form.basic.specificationColorRed') },
                    { name: $t('page.proNaive.form.basic.specificationColorOrange') }
                  ]
                })
              "
              :copy-button-props="false"
              :creator-button-props="{
                content: $t('page.proNaive.form.basic.addSpecificateItem')
              }"
            >
              <template #item="{ index, itemDom, actionDom }">
                <NCard
                  size="small"
                  embedded
                  :title="`${$t('page.proNaive.form.basic.specificate')}${index + 1}`"
                  class="mb-8px"
                >
                  <template #header-extra>
                    <component :is="actionDom" />
                  </template>
                  <component :is="itemDom" />
                </NCard>
              </template>
              <ProInput
                :title="$t('page.proNaive.form.basic.specificationName')"
                path="name"
                :field-props="{
                  class: 'w-230px!'
                }"
              />
              <ProFormList
                :title="$t('page.proNaive.form.basic.specificationValue')"
                path="items"
                :min="1"
                :creator-button-props="{
                  dashed: false,
                  block: false,
                  renderIcon: undefined,
                  ghost: true,
                  text: true,
                  type: 'info',
                  content: $t('page.proNaive.form.basic.add')
                }"
                :copy-button-props="false"
                :remove-button-props="{
                  tooltip: $t('page.proNaive.form.basic.delete')
                }"
              >
                <template #item="{ itemDom, actionDom }">
                  <div class="me-25px inline-flex">
                    <component :is="itemDom" />
                    <div class="ml-8px">
                      <component :is="actionDom" />
                    </div>
                  </div>
                </template>
                <ProInput
                  path="name"
                  :field-props="{
                    class: 'w-104px!'
                  }"
                />
              </ProFormList>
            </ProFormList>
          </NGi>
        </NGrid>
      </ProCard>
    </ProForm>
  </ConfigProvider>
</template>
