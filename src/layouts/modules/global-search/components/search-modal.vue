<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { onKeyStroke, useDebounceFn } from '@vueuse/core';
import { useRouteStore } from '@/store/modules/route';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import SearchResult from './search-result.vue';
import SearchFooter from './search-footer.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'SearchModal' });

// 路由实例：用于跳转到选中的菜单
const router = useRouter();
// 应用状态：用于判断是否移动端（决定弹窗尺寸与 footer 显示）
const appStore = useAppStore();
// 路由状态：用于读取可搜索菜单列表
const routeStore = useRouteStore();

// 是否移动端
const isMobile = computed(() => appStore.isMobile);

// 搜索关键字
const keyword = ref('');
// 当前高亮的路由路径
const activePath = ref('');
// 搜索结果菜单列表
const resultOptions = shallowRef<App.Global.Menu[]>([]);

// 防抖搜索（300ms）
const handleSearch = useDebounceFn(search, 300);

// 弹窗显隐（v-model:show）
const visible = defineModel<boolean>('show', { required: true });

// 执行搜索（中文说明：按关键字在 menu 标题中匹配）
function search() {
  resultOptions.value = routeStore.searchMenus.filter(menu => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim();
    const title = (menu.i18nKey ? $t(menu.i18nKey) : menu.label).toLocaleLowerCase();
    return trimKeyword && title.includes(trimKeyword);
  });
  activePath.value = resultOptions.value[0]?.routePath ?? '';
}

// 关闭弹窗并清空状态（中文说明：延迟处理以避免用户看到清空过程）
function handleClose() {
  // handle with setTimeout to prevent user from seeing some operations
  setTimeout(() => {
    visible.value = false;
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key up */
// 键盘向上：循环选中上一条
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;

  const index = getActivePathIndex();
  if (index === -1) return;

  const activeIndex = index === 0 ? length - 1 : index - 1;

  activePath.value = resultOptions.value[activeIndex].routePath;
}

/** key down */
// 键盘向下：循环选中下一条
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;

  const index = getActivePathIndex();
  if (index === -1) return;

  const activeIndex = index === length - 1 ? 0 : index + 1;

  activePath.value = resultOptions.value[activeIndex].routePath;
}

// 获取当前 activePath 在结果中的索引
function getActivePathIndex() {
  return resultOptions.value.findIndex(item => item.routePath === activePath.value);
}

/** key enter */
// 键盘回车：跳转到当前选中菜单
function handleEnter() {
  if (resultOptions.value?.length === 0 || activePath.value === '') return;
  handleClose();
  router.push(activePath.value);
}

// 注册快捷键（Esc/Enter/方向键）
function registerShortcut() {
  onKeyStroke('Escape', handleClose);
  onKeyStroke('Enter', handleEnter);
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
}

// 初始化快捷键监听
registerShortcut();
</script>

<template>
  <!-- 搜索弹窗：输入关键字并展示菜单匹配结果 -->
  <NModal
    v-model:show="visible"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    auto-focus
    footer-style="padding: 0; margin: 0"
    class="fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-0px rounded-0' : 'w-630px top-50px']"
    @after-leave="handleClose"
  >
    <!-- 输入区：关键字搜索 -->
    <NInputGroup>
      <NInput v-model:value="keyword" clearable :placeholder="$t('common.keywordSearch')" @input="handleSearch">
        <template #prefix>
          <icon-uil-search class="text-15px text-#c2c2c2" />
        </template>
      </NInput>
      <!-- 移动端：显示取消按钮 -->
      <NButton v-if="isMobile" type="primary" ghost @click="handleClose">{{ $t('common.cancel') }}</NButton>
    </NInputGroup>

    <!-- 结果区：无数据展示 Empty，有数据展示 SearchResult -->
    <div class="mt-20px">
      <NEmpty v-if="resultOptions.length === 0" :description="$t('common.noData')" />
      <SearchResult v-else v-model:path="activePath" :options="resultOptions" @enter="handleEnter" />
    </div>
    <template #footer>
      <!-- 桌面端：展示快捷键提示 -->
      <SearchFooter v-if="!isMobile" />
    </template>
  </NModal>
</template>

<style lang="scss" scoped></style>
