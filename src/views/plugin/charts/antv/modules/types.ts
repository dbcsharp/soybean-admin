import type { EdgeData, GraphData, NodeData } from '@antv/g6';

// 节点状态枚举（用于流程节点的不同业务状态）
export type NodeStatus =
  | 'MILESTONE'
  | 'NOT_STARTED'
  | 'DELAYED'
  | 'PAUSED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'COMPLETED_EARLY'
  | 'COMPLETED_LATE';

// 自定义节点数据（扩展 G6 NodeData，增加状态/删除/里程碑等字段）
export interface CustomNodeData extends NodeData {
  // 是否延期（用于显示“延期”徽标）
  isDelayed?: boolean;
  // 是否删除（用于红色描边与虚线）
  isDeleted?: boolean;
  // 是否里程碑节点（用于显示旗帜图标）
  milestone?: boolean;
  // 状态（用于图标/颜色/文案）
  status?: NodeStatus;
  // CustomNodeData 接口定义结束
}

// 自定义边数据（扩展 G6 EdgeData，增加删除/延期等字段）
export interface CustomEdgeData extends EdgeData {
  // 是否延期
  isDelayed?: boolean;
  // 是否删除
  isDeleted?: boolean;
  // CustomEdgeData 接口定义结束
}

// 自定义图数据（明确 nodes/edges 类型为自定义结构）
export interface CustomGraphData extends GraphData {
  // 节点列表
  nodes: CustomNodeData[];
  // 边列表
  edges: CustomEdgeData[];
  // CustomGraphData 接口定义结束
}
