import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

// 鉴权 Store：管理 token、用户信息、登录/退出流程、以及登录后重定向与 Tab 清理策略
export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  // 获取当前路由信息（用于判断是否常量路由）
  const route = useRoute();
  // 获取自身 store 实例（用于调用 $reset）
  const authStore = useAuthStore();
  // 获取路由 Store（用于重置路由相关状态）
  const routeStore = useRouteStore();
  // 获取标签页 Store（用于缓存/清理 Tabs）
  const tabStore = useTabStore();
  // 获取路由跳转工具（在 setup 外使用全局 router）
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  // 登录 loading 状态与控制方法
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  // token（内存态 token，实际请求头 token 存在 localStorage）
  const token = ref('');

  // 用户信息（使用 reactive，便于直接 Object.assign 更新）
  const userInfo: Api.Auth.UserInfo = reactive({
    // 用户 ID
    userId: '',
    // 用户名
    userName: '',
    // 角色列表
    roles: [],
    // 按钮权限码列表
    buttons: []
    // userInfo 对象结束
  });

  /** is super role in static route */
  // 静态路由模式下是否为超级角色（用于决定是否加载全部静态权限路由）
  const isStaticSuper = computed(() => {
    // 读取鉴权路由模式与静态超级角色标识
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    // 静态模式且角色命中静态超级角色时为 true
    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
    // isStaticSuper 计算回调结束
  });

  /** Is login */
  // 是否已登录（token 存在即视为已登录）
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  // 重置鉴权状态（记录上次用户、清理缓存、重置 store，并按路由情况跳转登录）
  async function resetStore() {
    // 记录本次会话的用户 ID，用于下次登录对比
    recordUserId();

    // 清理鉴权相关本地缓存
    clearAuthStorage();

    // 重置当前 store 到初始状态
    authStore.$reset();

    // 非常量路由访问时重置后跳转登录页
    if (!route.meta.constant) {
      // 跳转到登录页
      await toLogin();
      // constant 判断分支结束
    }

    // 缓存 Tabs（避免刷新丢失）
    tabStore.cacheTabs();
    // 重置路由 Store（会重置权限路由等状态）
    routeStore.resetStore();
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  // 记录上一次登录用户 ID（用于对比是否切换账号，必要时清空 Tabs）
  function recordUserId() {
    // 没有 userId 时不记录
    if (!userInfo.userId) {
      // 直接返回
      return;
      // userId 判断分支结束
    }

    // Store current user ID locally for next login comparison
    // 将当前用户 ID 写入本地缓存，供下一次登录对比
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  // 检查是否需要清空 Tabs（若本次登录用户与上次不同，则清空全局 Tabs）
  function checkTabClear(): boolean {
    // 没有 userId 时无需清空
    if (!userInfo.userId) {
      // 返回不清空
      return false;
      // userId 判断分支结束
    }

    // 读取上次登录用户 ID
    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    // 上次用户不存在或与当前不同则清空 Tabs
    if (!lastLoginUserId || lastLoginUserId !== userInfo.userId) {
      // 清除本地缓存的 Tabs
      localStg.remove('globalTabs');
      // 清空 Tabs Store
      tabStore.clearTabs();

      // 清除上次登录用户缓存
      localStg.remove('lastLoginUserId');
      // 返回已清空
      return true;
      // 清空分支结束
    }

    // 用户一致时也移除比较用的 lastLoginUserId
    localStg.remove('lastLoginUserId');
    // 返回不清空
    return false;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  // 登录（请求登录接口获取 token，再拉取用户信息，最后按需重定向并提示）
  async function login(userName: string, password: string, redirect = true) {
    // 开始 loading
    startLoading();

    // 请求登录接口
    const { data: loginToken, error } = await fetchLogin(userName, password);

    // 登录接口成功
    if (!error) {
      // 使用 token 完成登录流程（写入缓存并拉取用户信息）
      const pass = await loginByToken(loginToken);

      // 用户信息拉取成功才继续
      if (pass) {
        // Check if the tab needs to be cleared
        // 检查是否切换账号，必要时清空 Tabs
        const isClear = checkTabClear();
        // 是否需要重定向（默认使用入参 redirect）
        let needRedirect = redirect;

        // 若已清空 Tabs，则不做登录重定向
        if (isClear) {
          // If the tab needs to be cleared,it means we don't need to redirect.
          // 清空 Tabs 代表不需要重定向到原页面
          needRedirect = false;
          // isClear 分支结束
        }
        // 执行登录后的重定向逻辑
        await redirectFromLogin(needRedirect);

        // 弹出登录成功通知
        window.$notification?.success({
          // 通知标题
          title: $t('page.login.common.loginSuccess'),
          // 通知内容：欢迎回来 + 用户名
          content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
          // 持续时间
          duration: 4500
          // notification 配置结束
        });
        // pass 分支结束
      }
    } else {
      // 登录接口失败时重置鉴权状态
      resetStore();
      // error 分支结束
    }

    // 结束 loading
    endLoading();
  }

  // 通过 token 完成登录（写入 token/refreshToken，并拉取用户信息以确认登录有效）
  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    // 写入 token 到本地缓存（后续请求会从本地读取并带到请求头）
    localStg.set('token', loginToken.token);
    // 写入 refreshToken 到本地缓存（用于刷新 token）
    localStg.set('refreshToken', loginToken.refreshToken);

    // 2. get user info
    // 拉取用户信息，确认 token 有效
    const pass = await getUserInfo();

    // 拉取成功则写入内存 token 并返回 true
    if (pass) {
      // 更新内存态 token
      token.value = loginToken.token;

      // 返回登录成功
      return true;
      // pass 分支结束
    }

    // 返回登录失败
    return false;
  }

  // 拉取用户信息（请求用户信息接口并写入 userInfo）
  async function getUserInfo() {
    // 请求用户信息接口
    const { data: info, error } = await fetchGetUserInfo();

    // 接口成功
    if (!error) {
      // update store
      // 将接口返回的用户信息合并写入 store
      Object.assign(userInfo, info);

      // 返回成功
      return true;
      // !error 分支结束
    }

    // 返回失败
    return false;
  }

  // 初始化用户信息（页面刷新后从本地恢复 token，并尝试拉取用户信息）
  async function initUserInfo() {
    // 从本地获取可能存在的 token
    const maybeToken = getToken();

    // token 存在时尝试初始化
    if (maybeToken) {
      // 写入内存 token
      token.value = maybeToken;
      // 拉取用户信息
      const pass = await getUserInfo();

      // 拉取失败则重置鉴权状态
      if (!pass) {
        // 重置 store 并清理缓存
        resetStore();
        // !pass 分支结束
      }
      // maybeToken 分支结束
    }
  }

  // 对外暴露鉴权状态与方法
  return {
    // 内存态 token
    token,
    // 用户信息
    userInfo,
    // 静态超级角色标记
    isStaticSuper,
    // 是否已登录
    isLogin,
    // 登录 loading 状态
    loginLoading,
    // 重置鉴权状态方法
    resetStore,
    // 登录方法
    login,
    // 初始化用户信息方法
    initUserInfo
    // 返回对象定义结束
  };
  // useAuthStore setup 回调结束
});
