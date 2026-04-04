<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { getPaletteColorByNumber, mixColor } from '@sa/color';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import PwdLogin from './modules/pwd-login.vue';
import CodeLogin from './modules/code-login.vue';
import Register from './modules/register.vue';
import ResetPwd from './modules/reset-pwd.vue';
import BindWechat from './modules/bind-wechat.vue';

// 组件 Props（通过路由可选参数指定默认登录模块）
interface Props {
  /** The login module */
  module?: UnionKey.LoginModule;
  // Props 接口定义结束
}

// 声明组件 props
const props = defineProps<Props>();

// 获取应用状态（语言等）
const appStore = useAppStore();
// 获取主题状态（暗黑模式/主题色/动画模式等）
const themeStore = useThemeStore();

// 登录模块配置类型（label 用于标题显示，component 为对应模块组件）
interface LoginModule {
  // i18n key（用于显示模块标题）
  label: App.I18n.I18nKey;
  // 模块组件
  component: Component;
  // LoginModule 接口定义结束
}

// 登录模块映射（将模块 key 映射到标题 i18nKey 与组件）
const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  'code-login': { label: loginModuleRecord['code-login'], component: CodeLogin },
  register: { label: loginModuleRecord.register, component: Register },
  'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd },
  'bind-wechat': { label: loginModuleRecord['bind-wechat'], component: BindWechat }
};

// 当前激活的登录模块（默认使用 pwd-login）
const activeModule = computed(() => moduleMap[props.module || 'pwd-login']);

// 背景波浪的主题色（暗黑模式使用更深色阶，亮色模式使用主色）
const bgThemeColor = computed(() =>
  themeStore.darkMode ? getPaletteColorByNumber(themeStore.themeColor, 600) : themeStore.themeColor
);

// 登录页背景色（将白色与主题色按比例混合，暗黑模式比例更高）
const bgColor = computed(() => {
  // 白色基底
  const COLOR_WHITE = '#ffffff';

  // 混合比例：暗黑模式偏向主题色，亮色模式偏向白色
  const ratio = themeStore.darkMode ? 0.5 : 0.2;

  // 返回混合后的背景色
  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio);
  // bgColor 计算回调结束
});
</script>

<template>
  <!-- 登录页容器：全屏居中，并使用计算得到的背景色 -->
  <div class="relative size-full flex-center overflow-hidden" :style="{ backgroundColor: bgColor }">
    <!-- 背景波浪动画 -->
    <WaveBg :theme-color="bgThemeColor" />
    <!-- 登录卡片容器 -->
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <!-- 登录卡片内容区：响应式宽度 -->
      <div class="w-400px lt-sm:w-300px">
        <!-- 顶部区域：Logo、系统标题、主题/语言切换 -->
        <header class="flex-y-center justify-between">
          <!-- 系统 Logo -->
          <SystemLogo class="size-64px lt-sm:size-48px" />
          <!-- 系统标题 -->
          <h3 class="text-28px text-primary font-500 lt-sm:text-22px">{{ $t('system.title') }}</h3>
          <!-- 顶部操作区：主题模式/语言切换 -->
          <div class="i-flex-col">
            <!-- 主题模式切换 -->
            <ThemeSchemaSwitch
              :theme-schema="themeStore.themeScheme"
              :show-tooltip="false"
              class="text-20px lt-sm:text-18px"
              @switch="themeStore.toggleThemeScheme"
            />
            <!-- 语言切换：按配置决定是否显示 -->
            <LangSwitch
              v-if="themeStore.header.multilingual.visible"
              :lang="appStore.locale"
              :lang-options="appStore.localeOptions"
              :show-tooltip="false"
              @change-lang="appStore.changeLocale"
            />
          </div>
        </header>
        <!-- 主体区域：模块标题与模块内容 -->
        <main class="pt-24px">
          <!-- 当前模块标题（i18n） -->
          <h3 class="text-18px text-primary font-medium">{{ $t(activeModule.label) }}</h3>
          <!-- 模块内容区 -->
          <div class="pt-24px">
            <!-- 模块切换过渡动画：使用主题配置的动画模式 -->
            <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
              <!-- 动态渲染当前登录模块组件 -->
              <component :is="activeModule.component" />
            </Transition>
          </div>
        </main>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
