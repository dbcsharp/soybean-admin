// 存储工具：基于统一前缀创建 local/session/localforage 存储实例
import { createLocalforage, createStorage } from '@sa/utils';

// 存储 key 前缀：用于隔离不同项目/环境的存储空间
const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || '';

// 本地存储实例（localStorage）
export const localStg = createStorage<StorageType.Local>('local', storagePrefix);

// 会话存储实例（sessionStorage）
export const sessionStg = createStorage<StorageType.Session>('session', storagePrefix);

// localforage 实例（用于更大容量或异步存储场景）
export const localforage = createLocalforage<StorageType.Local>('local');
