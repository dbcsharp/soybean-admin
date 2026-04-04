<script setup lang="tsx">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import type { Ref } from 'vue';
import type { CustomBehaviorOption, IPointerEvent } from '@antv/g6';
import AntvFlow from './modules/antv-flow.vue';
import type { CustomGraphData } from './modules/types';
import { getFlowData } from './data';

// AntV G6 示例：展示流程图、节点选中、以及动态增删节点/边
const antvFlowRef = useTemplateRef('antvFlowRef');

// 流程图数据（nodes/edges）
const flowData = ref({
  nodes: [],
  edges: []
}) as Ref<CustomGraphData>;

// 当前选中的节点 id
const selectedNode = ref<string | undefined>('N2');

// 行为配置：点击节点后选中并提示
const behaviors: CustomBehaviorOption[] = [
  {
    type: 'click-select',
    enable: (event: IPointerEvent) => event.targetType === 'node',
    onClick: (event: IPointerEvent) => {
      const node = event.target as unknown as HTMLElement;
      const nodeData = flowData.value.nodes.find(item => item.id === node.id);
      selectedNode.value = nodeData?.id;
      window.$message?.success(`选中节点：[${node.id}]${nodeData?.name}`);
    }
  }
];
// 是否已存在新节点 NN（用于切换“添加/删除新节点”按钮）
const hasNodeN = computed(() => flowData.value.nodes.some(node => node.id === 'NN'));

// 添加新节点并连线（向 Node5 添加一个新后继节点）
function addNode() {
  const { nodes, edges } = flowData.value;

  nodes.push({ id: 'NN', name: 'New node', status: 'NOT_STARTED' });
  edges.push({ id: 'EN', source: 'N5', target: 'NN' });
  flowData.value = { nodes, edges };
}

// 删除节点（删除节点的同时删除与其相连的边）
function removeNode(id: string) {
  const { nodes, edges } = flowData.value;
  // 删除node的同时，也需要删除包含NX的edge
  flowData.value = {
    nodes: nodes.filter(node => node.id !== id),
    edges: edges.filter(edge => edge.source !== id && edge.target !== id)
  };
}

// 组件挂载后初始化流程图数据
onMounted(() => {
  flowData.value = getFlowData();
});
</script>

<template>
  <!-- AntV G6 Next 示例页：流程图渲染与节点操作 -->
  <div class="h-full">
    <NCard title="AntV G6 Next" :bordered="false" class="h-full card-wrapper">
      <!-- 流程图组件 -->
      <AntvFlow ref="antvFlowRef" :data="flowData" :selected="selectedNode" :behaviors="behaviors" />
      <NDivider />
      <!-- 操作按钮区 -->
      <NFlex>
        <NButton @click="selectedNode = 'N5'">选中节点N5(需要自行处理选中事件，不会触发元素点击)</NButton>
        <NButton v-if="!hasNodeN" @click="addNode">添加节点并与Node5连线</NButton>
        <NButton v-else @click="() => removeNode('NN')">删除新添加的节点</NButton>
        <NButton @click="() => removeNode('NX')">删除NodeX</NButton>
      </NFlex>
    </NCard>
  </div>
</template>
