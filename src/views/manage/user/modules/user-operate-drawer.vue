<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { fetchGetAllRoles } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'UserOperateDrawer'
});

// 组件 Props：新增/编辑类型 + 可选的行数据
interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
}

// 声明 props
const props = defineProps<Props>();

// 组件事件：提交成功
interface Emits {
  (e: 'submitted'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 抽屉显隐状态（由父组件 v-model 控制）
const visible = defineModel<boolean>('visible', {
  default: false
});

// 获取表单引用与校验方法
const { formRef, validate, restoreValidation } = useNaiveForm();
// 获取默认必填规则
const { defaultRequiredRule } = useFormRules();

// 抽屉标题（根据操作类型切换“新增/编辑”）
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

// 表单模型类型：只包含新增/编辑需要的字段
type Model = Pick<
  Api.SystemManage.User,
  'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'userRoles' | 'status'
>;

// 表单模型（在抽屉打开时初始化）
const model = ref(createDefaultModel());

// 创建默认模型（新增时的初始值）
function createDefaultModel(): Model {
  return {
    userName: '',
    userGender: null,
    nickName: '',
    userPhone: '',
    userEmail: '',
    userRoles: [],
    status: null
  };
}

// 需要必填校验的字段 key
type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

// 表单校验规则（仅对用户名与状态做必填校验）
const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};

/** the enabled role options */
// 可用角色选项（从接口获取角色列表，供多选使用）
const roleOptions = ref<CommonType.Option<string>[]>([]);

// 获取角色选项（并补齐 mock 数据缺失的 roleCode）
async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: item.roleCode
    }));

    // the mock data does not have the roleCode, so fill it
    // if the real request, remove the following code
    // mock 数据补齐：将当前用户已有的角色字符串转为选项，避免下拉中找不到已选值
    const userRoleOptions = model.value.userRoles.map(item => ({
      label: item,
      value: item
    }));
    // end

    // 合并写入角色选项（已有角色 + 接口角色）
    roleOptions.value = [...userRoleOptions, ...options];
  }
}

// 初始化表单模型（新增时用默认值，编辑时克隆 rowData）
function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

// 关闭抽屉
function closeDrawer() {
  visible.value = false;
}

// 提交表单（校验通过后执行请求，并通知父组件刷新）
async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

// 监听抽屉打开：初始化模型、重置校验、拉取角色选项
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});
</script>

<template>
  <!-- 用户新增/编辑抽屉 -->
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <!-- 表单区域 -->
      <NForm ref="formRef" :model="model" :rules="rules">
        <!-- 用户名 -->
        <NFormItem :label="$t('page.manage.user.userName')" path="userName">
          <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItem>
        <!-- 性别 -->
        <NFormItem :label="$t('page.manage.user.userGender')" path="userGender">
          <NRadioGroup v-model:value="model.userGender">
            <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <!-- 昵称 -->
        <NFormItem :label="$t('page.manage.user.nickName')" path="nickName">
          <NInput v-model:value="model.nickName" :placeholder="$t('page.manage.user.form.nickName')" />
        </NFormItem>
        <!-- 手机号 -->
        <NFormItem :label="$t('page.manage.user.userPhone')" path="userPhone">
          <NInput v-model:value="model.userPhone" :placeholder="$t('page.manage.user.form.userPhone')" />
        </NFormItem>
        <!-- 邮箱 -->
        <NFormItem :label="$t('page.manage.user.userEmail')" path="email">
          <NInput v-model:value="model.userEmail" :placeholder="$t('page.manage.user.form.userEmail')" />
        </NFormItem>
        <!-- 状态 -->
        <NFormItem :label="$t('page.manage.user.userStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <!-- 角色 -->
        <NFormItem :label="$t('page.manage.user.userRole')" path="roles">
          <NSelect
            v-model:value="model.userRoles"
            multiple
            :options="roleOptions"
            :placeholder="$t('page.manage.user.form.userRole')"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <!-- 底部操作按钮 -->
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
