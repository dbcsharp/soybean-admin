<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { useBoolean } from '@sa/hooks';
import { enableStatusOptions } from '@/constants/business';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import MenuAuthModal from './menu-auth-modal.vue';
import ButtonAuthModal from './button-auth-modal.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'RoleOperateDrawer'
});

// 组件 Props：新增/编辑类型 + 可选的行数据
interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
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
// 菜单权限弹窗显隐控制
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean();
// 按钮权限弹窗显隐控制
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean();

// 抽屉标题（中文说明：根据操作类型切换“新增/编辑”）
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

// 表单模型类型：只包含新增/编辑需要的字段
type Model = Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>;

// 表单模型（中文说明：在抽屉打开时初始化）
const model = ref(createDefaultModel());

// 创建默认模型（中文说明：新增时的初始值）
function createDefaultModel(): Model {
  return {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: null
  };
}

// 需要必填校验的字段 key（排除 roleDesc）
type RuleKey = Exclude<keyof Model, 'roleDesc'>;

// 表单校验规则（中文说明：角色名称/编码/状态为必填）
const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule,
  roleCode: defaultRequiredRule,
  status: defaultRequiredRule
};

// 当前角色 id（中文说明：编辑时用于权限弹窗传参）
const roleId = computed(() => props.rowData?.id || -1);

// 是否编辑模式（中文说明：编辑时才显示权限配置按钮）
const isEdit = computed(() => props.operateType === 'edit');

// 初始化表单模型（中文说明：新增时用默认值，编辑时克隆 rowData）
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

// 提交表单（中文说明：校验通过后执行请求，并通知父组件刷新）
async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

// 监听抽屉打开：初始化模型并重置校验
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <!-- 角色新增/编辑抽屉 -->
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <!-- 表单区域 -->
      <NForm ref="formRef" :model="model" :rules="rules">
        <!-- 角色名称 -->
        <NFormItem :label="$t('page.manage.role.roleName')" path="roleName">
          <NInput v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItem>
        <!-- 角色编码 -->
        <NFormItem :label="$t('page.manage.role.roleCode')" path="roleCode">
          <NInput v-model:value="model.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />
        </NFormItem>
        <!-- 角色状态 -->
        <NFormItem :label="$t('page.manage.role.roleStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <!-- 角色描述 -->
        <NFormItem :label="$t('page.manage.role.roleDesc')" path="roleDesc">
          <NInput v-model:value="model.roleDesc" :placeholder="$t('page.manage.role.form.roleDesc')" />
        </NFormItem>
      </NForm>
      <!-- 权限配置区：仅编辑模式显示 -->
      <NSpace v-if="isEdit">
        <NButton @click="openMenuAuthModal">{{ $t('page.manage.role.menuAuth') }}</NButton>
        <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
        <NButton @click="openButtonAuthModal">{{ $t('page.manage.role.buttonAuth') }}</NButton>
        <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
      </NSpace>
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
