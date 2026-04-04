<script setup lang="ts">
import { computed, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'UserSearch'
});

// 组件事件：触发搜索
interface Emits {
  (e: 'search'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 获取表单引用与校验方法
const { formRef, validate, restoreValidation } = useNaiveForm();

// 搜索表单模型（使用 v-model 由父组件传入并双向绑定）
const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });

// 需要做格式校验的字段 key
type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

// 表单校验规则（放在 computed 内，确保语言切换时文案可响应更新）
const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  };
});

// 默认表单模型快照（用于重置）
const defaultModel = jsonClone(toRaw(model.value));

// 重置模型数据（回填默认值）
function resetModel() {
  Object.assign(model.value, defaultModel);
}

// 重置操作：清空校验并重置模型
async function reset() {
  await restoreValidation();
  resetModel();
}

// 搜索操作：校验通过后触发父组件 search 事件
async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <!-- 用户搜索区域：折叠面板 + 表单筛选 -->
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <!-- 搜索表单 -->
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <!-- 用户名 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userName')" path="userName" class="pr-24px">
              <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
            </NFormItemGi>
            <!-- 性别 -->
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.userGender')"
              path="userGender"
              class="pr-24px"
            >
              <NSelect
                v-model:value="model.userGender"
                :placeholder="$t('page.manage.user.form.userGender')"
                :options="translateOptions(userGenderOptions)"
                clearable
              />
            </NFormItemGi>
            <!-- 昵称 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.nickName')" path="nickName" class="pr-24px">
              <NInput v-model:value="model.nickName" :placeholder="$t('page.manage.user.form.nickName')" />
            </NFormItemGi>
            <!-- 手机号 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userPhone')" path="userPhone" class="pr-24px">
              <NInput v-model:value="model.userPhone" :placeholder="$t('page.manage.user.form.userPhone')" />
            </NFormItemGi>
            <!-- 邮箱 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userEmail')" path="userEmail" class="pr-24px">
              <NInput v-model:value="model.userEmail" :placeholder="$t('page.manage.user.form.userEmail')" />
            </NFormItemGi>
            <!-- 用户状态 -->
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.userStatus')"
              path="userStatus"
              class="pr-24px"
            >
              <NSelect
                v-model:value="model.status"
                :placeholder="$t('page.manage.user.form.userStatus')"
                :options="translateOptions(enableStatusOptions)"
                clearable
              />
            </NFormItemGi>
            <!-- 操作按钮区 -->
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <!-- 重置按钮 -->
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <!-- 搜索按钮 -->
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
