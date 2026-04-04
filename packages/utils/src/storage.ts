import localforage from 'localforage';

// 存储类型：localStorage 或 sessionStorage
export type StorageType = 'local' | 'session';

// 创建同步 Storage（封装 get/set/remove/clear，并统一加上 key 前缀）
export function createStorage<T extends object>(type: StorageType, storagePrefix: string) {
  // 根据类型选择本地存储或会话存储
  const stg = type === 'session' ? window.sessionStorage : window.localStorage;

  // 存储操作集合
  const storage = {
    /**
     * 写入存储
     *
     * @param key 存储 key
     * @param value 存储 value
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      // 将 value 序列化为 JSON 字符串
      const json = JSON.stringify(value);

      // 写入 storage（拼接前缀避免 key 冲突）
      stg.setItem(`${storagePrefix}${key as string}`, json);
    },
    /**
     * 读取存储
     *
     * @param key 存储 key
     */
    get<K extends keyof T>(key: K): T[K] | null {
      // 读取 JSON 字符串
      const json = stg.getItem(`${storagePrefix}${key as string}`);
      if (json) {
        // 解析后的数据
        let storageData: T[K] | null = null;

        try {
          // 尝试解析 JSON
          storageData = JSON.parse(json);
        } catch {}

        // storageData 可能为 false（布尔类型），因此用 !== null 判断而非 truthy 判断
        if (storageData !== null) {
          return storageData as T[K];
        }
      }

      // 解析失败或为空时清理该 key，避免脏数据残留
      stg.removeItem(`${storagePrefix}${key as string}`);

      // 返回 null 表示不存在
      return null;
    },
    // 移除指定 key
    remove(key: keyof T) {
      stg.removeItem(`${storagePrefix}${key as string}`);
    },
    // 清空存储
    clear() {
      stg.clear();
    }
  };
  // 返回 storage 操作对象
  return storage;
}

// LocalForage 类型封装（补齐 getItem/setItem/removeItem 的类型签名）
type LocalForage<T extends object> = Omit<typeof localforage, 'getItem' | 'setItem' | 'removeItem'> & {
  getItem<K extends keyof T>(key: K, callback?: (err: any, value: T[K] | null) => void): Promise<T[K] | null>;

  setItem<K extends keyof T>(key: K, value: T[K], callback?: (err: any, value: T[K]) => void): Promise<T[K]>;

  removeItem(key: keyof T, callback?: (err: any) => void): Promise<void>;
};

// Localforage driver 类型
type LocalforageDriver = 'local' | 'indexedDB' | 'webSQL';

// 创建 localforage 实例（按 driver 配置底层存储实现）
export function createLocalforage<T extends object>(driver: LocalforageDriver) {
  // driver 映射（字符串 -> localforage 常量）
  const driverMap: Record<LocalforageDriver, string> = {
    local: localforage.LOCALSTORAGE,
    indexedDB: localforage.INDEXEDDB,
    webSQL: localforage.WEBSQL
  };

  // 配置 localforage
  localforage.config({
    driver: driverMap[driver]
  });

  // 返回带类型的 localforage 实例
  return localforage as LocalForage<T>;
}
