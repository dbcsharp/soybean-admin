// @unocss-include
import { getColorPalette, getRgb } from '@sa/color';
import { DARK_CLASS } from '@/constants/app';
import { localStg } from '@/utils/storage';
import { toggleHtmlClass } from '@/utils/common';
import { $t } from '@/locales';

// 首屏 Loading：在应用挂载前注入 HTML，展示 Logo、动画与主题色，避免白屏
export function setupLoading() {
  // 从缓存读取主题色（没有则使用默认色）
  const themeColor = localStg.get('themeColor') || '#646cff';
  // 从缓存读取暗黑模式标记（没有则默认 false）
  const darkMode = localStg.get('darkMode') || false;
  // 生成主题色调色板（用于 SVG 渐变色）
  const palette = getColorPalette(themeColor);

  // 将主题色转为 RGB，用于写入 CSS 变量
  const { r, g, b } = getRgb(themeColor);

  // 主色 CSS 变量（用于 UnoCSS 的 bg-primary/text-primary）
  const primaryColor = `--primary-color: ${r} ${g} ${b}`;

  // 生成 Logo 渐变所需的 CSS 变量（--logo-color-xxx）
  const svgCssVars = Array.from(palette.entries())
    // 将 palette entries 映射为 css var 定义字符串
    .map(([key, value]) => `--logo-color-${key}: ${value}`)
    // 拼接为一段 css 变量字符串
    .join(';');

  // 合并主色与 logo 颜色变量
  const cssVars = `${primaryColor}; ${svgCssVars}`;

  // 暗黑模式时提前给 html 添加暗黑 class，确保 loading 背景/主题一致
  if (darkMode) {
    // 添加暗黑 class
    toggleHtmlClass(DARK_CLASS).add();
    // if 分支结束
  }

  // 4 个点的定位与延迟动画 class 集合（用于组成旋转脉冲动画）
  const loadingClasses = [
    'left-0 top-0',
    'left-0 bottom-0 animate-delay-500',
    'right-0 top-0 animate-delay-1000',
    'right-0 bottom-0 animate-delay-1500'
  ];

  // 生成 4 个点的 HTML 字符串
  const dot = loadingClasses
    // 映射为单个点的 div
    .map(item => {
      // 返回点的 HTML
      return `<div class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse ${item}"></div>`;
      // map 回调结束
    })
    // 用换行连接，便于阅读
    .join('\n');

  // 生成 Loading 容器 HTML（包含 Logo、旋转动画与标题）
  const loading = `
<div class="fixed-center flex-col bg-layout" style="${cssVars}">
  <div class="w-128px h-128px">
    ${getLogoSvg()}
  </div>
  <div class="w-56px h-56px my-36px">
    <div class="relative h-full animate-spin">
      ${dot}
    </div>
  </div>
  <h2 class="text-28px font-500 text-primary">${$t('system.title')}</h2>
</div>`;

  // 获取应用挂载节点
  const app = document.getElementById('app');

  // 节点存在时注入 Loading HTML
  if (app) {
    // 写入 loading 内容
    app.innerHTML = loading;
    // if 分支结束
  }
  // setupLoading 函数结束
}

// 获取 Logo SVG 字符串（中文说明：SVG 内部通过 CSS 变量控制渐变颜色）
function getLogoSvg() {
  // Logo SVG 模板字符串
  const logoSvg = `<svg
        width="100%"
        height="100%"
        version="1.1"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <path
            d="M 200,866 C 100,866 50,779.4 100,692.8 L 200,519.6 C 220,485 240,490 265,499.6 S 360,542.68 360,542.68 C 480.5,601 498,642.5 500,720 C 498,811 462,856 420,866"
            fill="url(#LinearGradient)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
          <path
            d="M 420,866 C 455,861 478,846 500,827 C 614,696 615,597 500,517 C 394,444 333,374 380,207.82 L 260,415.67 C 240.22,450 254.37,465.1 275.28,481.79 S 360,542.68 360,542.68 C 480.5,601 498,642.5 500,720 C 498,811 462,856 420,866"
            fill="url(#LinearGradient_2)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
          <path
            d="M 500,517 C 394,444 333,374 380,207.82 L 400,173.2 C 367,295 421,350 603,428 C 572,440 524,474 500,517"
            fill="url(#LinearGradient_3)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
          <path
            d="M 500,827 L 660,660 C 738,589 710,482 603,428 C 572,440 524,474 500,517 C 615,597 614,696 500,827"
            fill="url(#LinearGradient_4)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
          <path
            d="M 400,173.2 C 367,295 421,350 603,428 C 690,389, 750,445 788,500 L 600,173.2 C 550,86.6 450,86.6 400,173.2"
            fill="url(#LinearGradient_5)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
          <path
            d="M 500,827 L 660,660 C 738,589 710,482 603,428 C 690,389, 750,445 788,500 C 816,554 797,606 750,640 L 500,827"
            fill="url(#LinearGradient_6)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
          <path
            d="M 788,500 C 816,554 797,606 750,640 L 500,827 C 497,851 513,862 540,866 L 800,866 C 900,866 950,779.4 900,692.8 L 788,500"
            fill="url(#LinearGradient_7)"
            fill-rule="nonzero"
            opacity="1"
            stroke="none"
          />
        </g>
        <defs>
          <linearGradient
            id="LinearGradient"
            gradientTransform="matrix(104.391 -73.3432 73.3432 104.391 277.441 710.122)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-700)" />
            <stop offset="1" stop-color="var(--logo-color-600)" />
          </linearGradient>
          <linearGradient
            id="LinearGradient_2"
            gradientTransform="matrix(-173.747 557.324 -557.324 -173.747 508.829 258.172)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-300)" />
            <stop offset="1" stop-color="var(--logo-color-500)" />
          </linearGradient>
          <linearGradient
            id="LinearGradient_3"
            gradientTransform="matrix(157.951 295.666 -295.666 157.951 382.944 193.642)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-600)" />
            <stop offset="1" stop-color="var(--logo-color-700)" />
          </linearGradient>
          <linearGradient
            id="LinearGradient_4"
            gradientTransform="matrix(-44.3023 219.578 -219.578 -44.3023 619.69 469.652)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-400)" />
            <stop offset="1" stop-color="var(--logo-color-600)" />
          </linearGradient>
          <linearGradient
            id="LinearGradient_5"
            gradientTransform="matrix(125.52 334.256 -334.256 125.52 539.723 235.139)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-500)" />
            <stop offset="1" stop-color="var(--logo-color-300)" />
          </linearGradient>
          <linearGradient
            id="LinearGradient_6"
            gradientTransform="matrix(-241.23 357.206 -357.206 -241.23 754.054 449.312)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-300)" />
            <stop offset="1" stop-color="var(--logo-color-500)" />
          </linearGradient>
          <linearGradient
            id="LinearGradient_7"
            gradientTransform="matrix(125.978 210.065 -210.065 125.978 596.433 613.665)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0" stop-color="var(--logo-color-700)" />
            <stop offset="1" stop-color="var(--logo-color-600)" />
          </linearGradient>
        </defs>
      </svg>
  `;

  // 返回 SVG 字符串
  return logoSvg;
  // getLogoSvg 函数结束
}
