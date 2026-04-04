<script setup lang="ts">
import { toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'RoleSearch'
});

// 组件事件：触发搜索
interface Emits {
  (e: 'search'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 搜索表单模型（使用 v-model 由父组件传入并双向绑定）
const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

// 默认表单模型快照（用于重置）
const defaultModel = jsonClone(toRaw(model.value));

// 重置模型数据（回填默认值）
function resetModel() {
  Object.assign(model.value, defaultModel);
}

// 搜索操作：触发父组件 search 事件
function search() {
  emit('search');
}
</script>

<template>
  <!-- 角色搜索区域：折叠面板 + 表单筛选 -->
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
        <!-- 搜索表单 -->
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <!-- 角色名称 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleName')" path="roleName" class="pr-24px">
              <NInput v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
            </NFormItemGi>
            <!-- 角色编码 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleCode')" path="roleCode" class="pr-24px">
              <NInput v-model:value="model.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />
            </NFormItemGi>
            <!-- 角色状态 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleStatus')" path="status" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                :placeholder="$t('page.manage.role.form.roleStatus')"
                :options="translateOptions(enableStatusOptions)"
                clearable
              />
            </NFormItemGi>
            <!-- 操作按钮区 -->
            <NFormItemGi span="24 s:12 m:6">
              <NSpace class="w-full" justify="end">
                <!-- 重置按钮 -->
                <NButton @click="resetModel">
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
