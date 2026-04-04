<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useTabStore } from '@/store/modules/tab';
import { useSvgIcon } from '@/hooks/common/icon';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ContextMenu'
});

// 组件 Props：右键菜单坐标/目标 tabId/排除项/禁用项
interface Props {
  /** ClientX */
  x: number;
  /** ClientY */
  y: number;
  tabId: string;
  excludeKeys?: App.Global.DropdownKey[];
  disabledKeys?: App.Global.DropdownKey[];
}

// 声明 props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  excludeKeys: () => [],
  disabledKeys: () => []
});

// 右键菜单显隐（v-model:visible）
const visible = defineModel<boolean>('visible');

// TabStore 操作方法（关闭/固定/清空等）
const { removeTab, clearTabs, clearLeftTabs, clearRightTabs, fixTab, unfixTab, isTabRetain, homeTab } = useTabStore();
// SvgIcon VNode 工具（用于 dropdown 图标）
const { SvgIconVNode } = useSvgIcon();

// Dropdown 选项结构
type DropdownOption = {
  key: App.Global.DropdownKey;
  label: string;
  icon?: () => VNode;
  disabled?: boolean;
};

// 计算右键菜单选项（基础关闭项 +（非首页）固定/取消固定 + 排除/禁用处理）
const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'closeCurrent',
      label: $t('dropdown.closeCurrent'),
      icon: SvgIconVNode({ icon: 'ant-design:close-outlined', fontSize: 18 })
    },
    {
      key: 'closeOther',
      label: $t('dropdown.closeOther'),
      icon: SvgIconVNode({ icon: 'ant-design:column-width-outlined', fontSize: 18 })
    },
    {
      key: 'closeLeft',
      label: $t('dropdown.closeLeft'),
      icon: SvgIconVNode({ icon: 'mdi:format-horizontal-align-left', fontSize: 18 })
    },
    {
      key: 'closeRight',
      label: $t('dropdown.closeRight'),
      icon: SvgIconVNode({ icon: 'mdi:format-horizontal-align-right', fontSize: 18 })
    },
    {
      key: 'closeAll',
      label: $t('dropdown.closeAll'),
      icon: SvgIconVNode({ icon: 'ant-design:line-outlined', fontSize: 18 })
    }
  ];

  if (props.tabId !== homeTab?.id) {
    if (isTabRetain(props.tabId)) {
      opts.push({
        key: 'unpin',
        label: $t('dropdown.unpin'),
        icon: SvgIconVNode({ icon: 'mdi:pin-off-outline', fontSize: 18 })
      });
    } else {
      opts.push({
        key: 'pin',
        label: $t('dropdown.pin'),
        icon: SvgIconVNode({ icon: 'mdi:pin-outline', fontSize: 18 })
      });
    }
  }

  const { excludeKeys, disabledKeys } = props;

  // 过滤排除项
  const result = opts.filter(opt => !excludeKeys.includes(opt.key));

  // 标记禁用项
  disabledKeys.forEach(key => {
    const opt = result.find(item => item.key === key);

    if (opt) {
      opt.disabled = true;
    }
  });

  return result;
});

// 隐藏右键菜单
function hideDropdown() {
  visible.value = false;
}

// 右键菜单动作映射
const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
  closeCurrent() {
    removeTab(props.tabId);
  },
  closeOther() {
    clearTabs([props.tabId]);
  },
  closeLeft() {
    clearLeftTabs(props.tabId);
  },
  closeRight() {
    clearRightTabs(props.tabId);
  },
  closeAll() {
    clearTabs();
  },
  pin() {
    fixTab(props.tabId);
  },
  unpin() {
    unfixTab(props.tabId);
  }
};

// 选择菜单项：执行动作并隐藏菜单
function handleDropdown(optionKey: App.Global.DropdownKey) {
  dropdownAction[optionKey]?.();
  hideDropdown();
}
</script>

<template>
  <!-- Tab 右键菜单：手动触发定位到 x/y -->
  <NDropdown
    :show="visible"
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    @clickoutside="hideDropdown"
    @select="handleDropdown"
  />
</template>

<style scoped></style>
