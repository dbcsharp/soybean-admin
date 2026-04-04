<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { fetchGetAllPages, fetchGetMenuTree } from '@/service/api';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'MenuAuthModal'
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
const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));

// 当前角色首页（routeName）
const home = shallowRef('');

// 获取当前角色首页（示例占位，实际应请求后端接口）
async function getHome() {
  console.log(props.roleId);

  home.value = 'home';
}

// 更新当前角色首页（示例占位，实际应请求后端接口）
async function updateHome(val: string) {
  // request

  home.value = val;
}

// 所有页面列表（用于首页下拉选择）
const pages = shallowRef<string[]>([]);

// 获取所有页面（用于首页下拉选项）
async function getPages() {
  const { error, data } = await fetchGetAllPages();

  if (!error) {
    pages.value = data;
  }
}

// 首页下拉选项
const pageSelectOptions = computed(() => {
  const opts: CommonType.Option[] = pages.value.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

// 菜单树数据
const tree = shallowRef<Api.SystemManage.MenuTree[]>([]);

// 获取菜单树（用于授权勾选）
async function getTree() {
  const { error, data } = await fetchGetMenuTree();

  if (!error) {
    tree.value = data;
  }
}

// 当前勾选的菜单 id 列表
const checks = shallowRef<number[]>([]);

// 获取当前角色已授权的菜单 id（示例占位，实际应请求后端接口）
async function getChecks() {
  console.log(props.roleId);
  // request
  checks.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
}

// 提交菜单权限变更
function handleSubmit() {
  console.log(checks.value, props.roleId);
  // request

  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

// 初始化：加载首页/页面列表/菜单树/勾选项
function init() {
  getHome();
  getPages();
  getTree();
  getChecks();
}

// 打开弹窗时初始化数据
watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <!-- 菜单权限配置弹窗：设置角色首页与菜单树勾选权限 -->
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <!-- 首页选择 -->
    <div class="flex-y-center gap-16px pb-12px">
      <div>{{ $t('page.manage.menu.home') }}</div>
      <NSelect :value="home" :options="pageSelectOptions" size="small" class="w-160px" @update:value="updateHome" />
    </div>
    <!-- 菜单树：checked-keys 绑定 checks -->
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="id"
      checkable
      expand-on-click
      virtual-scroll
      block-line
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
