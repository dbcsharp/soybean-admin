<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ButtonAuthModal'
});

// 组件 Props：传入当前角色 id
interface Props {
  /** the roleId */
  roleId: number;
}

// 声明 props
const props = defineProps<Props>();

// 弹窗显隐（v-model）
const visible = defineModel<boolean>('visible', {
  default: false
});

// 关闭弹窗
function closeModal() {
  visible.value = false;
}

// 弹窗标题
const title = computed(() => $t('common.edit') + $t('page.manage.role.buttonAuth'));

// 按钮权限配置结构（示例数据结构）
type ButtonConfig = {
  id: number;
  label: string;
  code: string;
};

// 按钮树数据
const tree = shallowRef<ButtonConfig[]>([]);

// 获取所有按钮（示例占位，实际应请求后端接口）
async function getAllButtons() {
  // request
  tree.value = [
    { id: 1, label: 'button1', code: 'code1' },
    { id: 2, label: 'button2', code: 'code2' },
    { id: 3, label: 'button3', code: 'code3' },
    { id: 4, label: 'button4', code: 'code4' },
    { id: 5, label: 'button5', code: 'code5' },
    { id: 6, label: 'button6', code: 'code6' },
    { id: 7, label: 'button7', code: 'code7' },
    { id: 8, label: 'button8', code: 'code8' },
    { id: 9, label: 'button9', code: 'code9' },
    { id: 10, label: 'button10', code: 'code10' }
  ];
}

// 当前勾选的按钮 id 列表
const checks = shallowRef<number[]>([]);

// 获取当前角色已授权的按钮 id（示例占位，实际应请求后端接口）
async function getChecks() {
  console.log(props.roleId);
  // request
  checks.value = [1, 2, 3, 4, 5];
}

// 提交按钮权限变更
function handleSubmit() {
  console.log(checks.value, props.roleId);
  // request

  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

// 初始化：加载按钮树与勾选项
function init() {
  getAllButtons();
  getChecks();
}

// init
init();
</script>

<template>
  <!-- 按钮权限配置弹窗：通过树形勾选配置角色按钮权限 -->
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <!-- 按钮树：checked-keys 绑定 checks -->
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="id"
      block-line
      checkable
      expand-on-click
      virtual-scroll
      class="h-280px"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
