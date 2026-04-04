// 英文语言包（en-US）：系统/通用/请求/主题等模块的文案集合
// i18n Schema 根对象
const local: App.I18n.Schema = {
  // 系统相关文案
  system: {
    // 系统标题
    title: 'SoybeanAdmin',
    // 版本更新提示标题
    updateTitle: 'System Version Update Notification',
    // 版本更新提示内容
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    // 版本更新确认按钮文案
    updateConfirm: 'Refresh immediately',
    // 版本更新取消按钮文案
    updateCancel: 'Later'
    // system 对象结束
  },
  // 通用文案（按钮/提示/操作等）
  common: {
    // 操作列标题
    action: 'Action',
    // 新增按钮文案
    add: 'Add',
    // 新增成功提示
    addSuccess: 'Add Success',
    // 返回首页文案
    backToHome: 'Back to home',
    // 批量删除文案
    batchDelete: 'Batch Delete',
    // 取消按钮文案
    cancel: 'Cancel',
    // 关闭按钮文案
    close: 'Close',
    // 勾选文案
    check: 'Check',
    // 全选文案
    selectAll: 'Select All',
    // 展开列文案
    expandColumn: 'Expand Column',
    // 列设置文案
    columnSetting: 'Column Setting',
    // 配置文案
    config: 'Config',
    // 确认按钮文案
    confirm: 'Confirm',
    // 删除按钮文案
    delete: 'Delete',
    // 删除成功提示
    deleteSuccess: 'Delete Success',
    // 删除确认提示
    confirmDelete: 'Are you sure you want to delete?',
    // 编辑按钮文案
    edit: 'Edit',
    // 警告提示标题
    warning: 'Warning',
    // 错误提示标题
    error: 'Error',
    // 序号列标题
    index: 'Index',
    // 关键词搜索占位文案
    keywordSearch: 'Please enter keyword',
    // 退出登录文案
    logout: 'Logout',
    // 退出登录确认提示
    logoutConfirm: 'Are you sure you want to log out?',
    // 敬请期待提示
    lookForward: 'Coming soon',
    // 修改按钮文案
    modify: 'Modify',
    // 修改成功提示
    modifySuccess: 'Modify Success',
    // 无数据提示
    noData: 'No Data',
    // 操作文案
    operate: 'Operate',
    // 输入值校验提示
    pleaseCheckValue: 'Please check whether the value is valid',
    // 刷新按钮文案
    refresh: 'Refresh',
    // 重置按钮文案
    reset: 'Reset',
    // 搜索按钮文案
    search: 'Search',
    // 切换按钮文案
    switch: 'Switch',
    // 提示标题
    tip: 'Tip',
    // 触发文案
    trigger: 'Trigger',
    // 更新按钮文案
    update: 'Update',
    // 更新成功提示
    updateSuccess: 'Update Success',
    // 个人中心文案
    userCenter: 'User Center',
    // 是/否文案集合
    yesOrNo: {
      // 是
      yes: 'Yes',
      // 否
      no: 'No'
      // yesOrNo 对象结束
    }
    // common 对象结束
  },
  // 请求相关文案（鉴权、刷新 token、登出提示等）
  request: {
    // 请求失败后登出用户的描述
    logout: 'Logout user after request failed',
    // 登出提示信息
    logoutMsg: 'User status is invalid, please log in again',
    // 以弹窗方式提示后再登出用户的描述
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    // 弹窗登出提示信息
    logoutWithModalMsg: 'User status is invalid, please log in again',
    // token 过期刷新提示
    refreshToken: 'The requested token has expired, refresh the token',
    // token 已过期提示
    tokenExpired: 'The requested token has expired'
    // request 对象结束
  },
  // 主题相关文案（外观/布局/通用/预设/配置操作等）
  theme: {
    // 主题抽屉标题
    themeDrawerTitle: 'Theme Configuration',
    // 主题抽屉 Tab 标题集合
    tabs: {
      // 外观 Tab
      appearance: 'Appearance',
      // 布局 Tab
      layout: 'Layout',
      // 通用 Tab
      general: 'General',
      // 预设 Tab
      preset: 'Preset'
      // tabs 对象结束
    },
    // 外观相关配置文案
    appearance: {
      // 主题模式文案集合
      themeSchema: {
        // 主题模式标题
        title: 'Theme Schema',
        // 亮色模式
        light: 'Light',
        // 暗色模式
        dark: 'Dark',
        // 跟随系统
        auto: 'Follow System'
        // themeSchema 对象结束
      },
      // 灰度模式
      grayscale: 'Grayscale',
      // 色弱模式
      colourWeakness: 'Colour Weakness',
      // 主题色文案集合
      themeColor: {
        // 主题色标题
        title: 'Theme Color',
        // 主色
        primary: 'Primary',
        // 信息色
        info: 'Info',
        // 成功色
        success: 'Success',
        // 警告色
        warning: 'Warning',
        // 错误色
        error: 'Error',
        // 信息色跟随主色
        followPrimary: 'Follow Primary'
        // themeColor 对象结束
      },
      // 主题圆角文案
      themeRadius: {
        // 圆角标题
        title: 'Theme Radius'
        // themeRadius 对象结束
      },
      // 推荐算法颜色开关文案
      recommendColor: 'Apply Recommended Color Algorithm',
      // 推荐算法颜色描述
      recommendColorDesc: 'The recommended color algorithm refers to',
      // 主题预设文案集合
      preset: {
        // 预设标题
        title: 'Theme Presets',
        // 应用按钮文案
        apply: 'Apply',
        // 应用成功提示
        applySuccess: 'Preset applied successfully',
        // 默认预设
        default: {
          // 预设名称
          name: 'Default Preset',
          // 预设描述
          desc: 'Default theme preset with balanced settings'
          // default 对象结束
        },
        // 暗色预设
        dark: {
          // 预设名称
          name: 'Dark Preset',
          // 预设描述
          desc: 'Dark theme preset for night time usage'
          // dark 对象结束
        },
        // 紧凑预设
        compact: {
          // 预设名称
          name: 'Compact Preset',
          // 预设描述
          desc: 'Compact layout preset for small screens'
          // compact 对象结束
        },
        // Azir 预设
        azir: {
          // 预设名称
          name: "Azir's Preset",
          // 预设描述
          desc: 'It is a cold and elegant preset that Azir likes'
          // azir 对象结束
        }
        // preset 对象结束
      }
      // appearance 对象结束
    },
    // 布局相关配置文案
    layout: {
      // 布局模式文案集合
      layoutMode: {
        // 布局模式标题
        title: 'Layout Mode',
        // 左侧菜单布局
        vertical: 'Vertical Mode',
        // 顶部菜单布局
        horizontal: 'Horizontal Mode',
        // 左侧混合菜单布局
        'vertical-mix': 'Vertical Mix Mode',
        // 左侧混合-顶部优先布局
        'vertical-hybrid-header-first': 'Left Hybrid Header-First',
        // 顶部混合-侧边优先布局
        'top-hybrid-sidebar-first': 'Top-Hybrid Sidebar-First',
        // 顶部混合-顶部优先布局
        'top-hybrid-header-first': 'Top-Hybrid Header-First',
        // 左侧菜单布局说明
        vertical_detail: 'Vertical menu layout, with the menu on the left and content on the right.',
        // 左侧混合菜单布局说明
        'vertical-mix_detail':
          // 布局说明文本
          'Vertical mix-menu layout, with the primary menu on the dark left side and the secondary menu on the lighter left side.',
        // 左侧混合-顶部优先布局说明
        'vertical-hybrid-header-first_detail':
          // 布局说明文本
          'Left hybrid layout, with the primary menu at the top, the secondary menu on the dark left side, and the tertiary menu on the lighter left side.',
        // 顶部菜单布局说明
        horizontal_detail: 'Horizontal menu layout, with the menu at the top and content below.',
        // 顶部混合-侧边优先布局说明
        'top-hybrid-sidebar-first_detail':
          // 布局说明文本
          'Top hybrid layout, with the primary menu on the left and the secondary menu at the top.',
        // 顶部混合-顶部优先布局说明
        'top-hybrid-header-first_detail':
          // 布局说明文本
          'Top hybrid layout, with the primary menu at the top and the secondary menu on the left.'
        // layoutMode 对象结束
      },
      // 标签页设置文案集合
      tab: {
        // 标签页设置标题
        title: 'Tab Settings',
        // 是否显示标签页
        visible: 'Tab Visible',
        // 标签栏信息缓存
        cache: 'Tag Bar Info Cache',
        // 缓存提示文案
        cacheTip: 'One-click to open/close global keepalive',
        // 标签页高度
        height: 'Tab Height',
        // 标签页模式文案集合
        mode: {
          // 标签页模式标题
          title: 'Tab Mode',
          // 滑块模式
          slider: 'Slider',
          // Chrome 模式
          chrome: 'Chrome',
          // 按钮模式
          button: 'Button'
          // mode 对象结束
        },
        // 中键关闭标签页
        closeByMiddleClick: 'Close Tab by Middle Click',
        // 中键关闭提示
        closeByMiddleClickTip: 'Enable closing tabs by clicking with the middle mouse button'
        // tab 对象结束
      },
      // 顶部栏设置文案集合
      header: {
        // 顶部栏设置标题
        title: 'Header Settings',
        // 顶部栏高度
        height: 'Header Height',
        // 面包屑设置文案集合
        breadcrumb: {
          // 是否显示面包屑
          visible: 'Breadcrumb Visible',
          // 是否显示面包屑图标
          showIcon: 'Breadcrumb Icon Visible'
          // breadcrumb 对象结束
        }
        // header 对象结束
      },
      // 侧边栏设置文案集合
      sider: {
        // 侧边栏设置标题
        title: 'Sider Settings',
        // 暗色侧边栏
        inverted: 'Dark Sider',
        // 侧边栏宽度
        width: 'Sider Width',
        // 折叠宽度
        collapsedWidth: 'Sider Collapsed Width',
        // 混合侧边栏宽度
        mixWidth: 'Mix Sider Width',
        // 混合侧边栏折叠宽度
        mixCollapsedWidth: 'Mix Sider Collapse Width',
        // 混合子菜单宽度
        mixChildMenuWidth: 'Mix Child Menu Width',
        // 自动选中第一个子菜单
        autoSelectFirstMenu: 'Auto Select First Submenu',
        // 自动选中说明
        autoSelectFirstMenuTip:
          // 提示文本
          'When a first-level menu is clicked, the first submenu is automatically selected and navigated to the deepest level'
        // sider 对象结束
      },
      // 底部栏设置文案集合
      footer: {
        // 底部栏设置标题
        title: 'Footer Settings',
        // 是否显示底部栏
        visible: 'Footer Visible',
        // 固定底部栏
        fixed: 'Fixed Footer',
        // 底部栏高度
        height: 'Footer Height',
        // 右侧底部栏文案
        right: 'Right Footer'
        // footer 对象结束
      },
      // 内容区域设置文案集合
      content: {
        // 内容区域设置标题
        title: 'Content Area Settings',
        // 滚动模式文案集合
        scrollMode: {
          // 滚动模式标题
          title: 'Scroll Mode',
          // 滚动模式提示
          tip: 'The theme scroll only scrolls the main part, the outer scroll can carry the header and footer together',
          // 外层滚动
          wrapper: 'Wrapper',
          // 内容滚动
          content: 'Content'
          // scrollMode 对象结束
        },
        // 页面切换动画文案集合
        page: {
          // 是否启用页面动画
          animate: 'Page Animate',
          // 页面动画模式文案集合
          mode: {
            // 动画模式标题
            title: 'Page Animate Mode',
            // 渐隐
            fade: 'Fade',
            // 滑动
            'fade-slide': 'Slide',
            // 从底部渐隐
            'fade-bottom': 'Fade Zoom',
            // 渐隐缩放
            'fade-scale': 'Fade Scale',
            // 缩放渐隐
            'zoom-fade': 'Zoom Fade',
            // 缩放退出
            'zoom-out': 'Zoom Out',
            // 无动画
            none: 'None'
            // mode 对象结束
          }
          // page 对象结束
        },
        // 固定顶部栏与标签页
        fixedHeaderAndTab: 'Fixed Header And Tab'
        // content 对象结束
      }
      // layout 对象结束
    },
    // 通用设置文案集合
    general: {
      // 通用设置标题
      title: 'General Settings',
      // 水印设置文案集合
      watermark: {
        // 水印设置标题
        title: 'Watermark Settings',
        // 全屏水印可见
        visible: 'Watermark Full Screen Visible',
        // 自定义水印文本
        text: 'Custom Watermark Text',
        // 启用用户名水印
        enableUserName: 'Enable User Name Watermark',
        // 显示当前时间
        enableTime: 'Show Current Time',
        // 时间格式
        timeFormat: 'Time Format'
        // watermark 对象结束
      },
      // 多语言设置文案集合
      multilingual: {
        // 多语言设置标题
        title: 'Multilingual Settings',
        // 是否显示多语言按钮
        visible: 'Display multilingual button'
        // multilingual 对象结束
      },
      // 全局搜索设置文案集合
      globalSearch: {
        // 全局搜索设置标题
        title: 'Global Search Settings',
        // 是否显示全局搜索按钮
        visible: 'Display GlobalSearch button'
        // globalSearch 对象结束
      }
      // general 对象结束
    },
    // 配置操作文案集合
    configOperation: {
      // 复制配置按钮文案
      copyConfig: 'Copy Config',
      // 复制成功提示
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      // 重置配置按钮文案
      resetConfig: 'Reset Config',
      // 重置成功提示
      resetSuccessMsg: 'Reset Success'
      // configOperation 对象结束
    }
    // theme 对象结束
  },
  // 路由名称文案（用于菜单/面包屑/Tab 标题等）
  route: {
    // 登录
    login: 'Login',
    // 无权限
    403: 'No Permission',
    // 页面不存在
    404: 'Page Not Found',
    // 服务器错误
    500: 'Server Error',
    // Iframe 页面
    'iframe-page': 'Iframe',
    // 首页
    home: 'Home',
    // 文档
    document: 'Document',
    // 项目文档（站内）
    document_project: 'Project Document',
    // 项目文档（外链）
    'document_project-link': 'Project Document(External Link)',
    // 视频教程
    document_video: 'Video Tutorial',
    // Vue 文档
    document_vue: 'Vue Document',
    // Vite 文档
    document_vite: 'Vite Document',
    // UnoCSS 文档
    document_unocss: 'UnoCSS Document',
    // Naive UI 文档
    document_naive: 'Naive UI Document',
    // Pro Naive UI 文档
    'document_pro-naive': 'Pro Naive UI Document',
    // Ant Design Vue 文档
    document_antd: 'Ant Design Vue Document',
    // Alova 文档
    document_alova: 'Alova Document',
    // 个人中心
    'user-center': 'User Center',
    // 关于
    about: 'About',
    // 系统功能
    function: 'System Function',
    // Alova 示例
    alova: 'Alova Example',
    // Alova 请求
    alova_request: 'Alova Request',
    // 场景请求
    alova_scenes: 'Scenario Request',
    // Pro Naive 示例
    'pro-naive': 'Pro Naive Example',
    // Pro Naive 表单
    'pro-naive_form': 'Form',
    // 基础表单
    'pro-naive_form_basic': 'Basic Form',
    // 查询表单
    'pro-naive_form_query': 'Query Form',
    // 分步表单
    'pro-naive_form_step': 'Step Form',
    // Pro Naive 表格
    'pro-naive_table': 'Table',
    // 远程表格
    'pro-naive_table_remote': 'Remote',
    // 行编辑表格
    'pro-naive_table_row-edit': 'Row Edit',
    // Tab 功能
    function_tab: 'Tab',
    // 多 Tab 功能
    'function_multi-tab': 'Multi Tab',
    // 隐藏子菜单示例
    'function_hide-child': 'Hide Child',
    // 隐藏子菜单-一
    'function_hide-child_one': 'Hide Child',
    // 隐藏子菜单-二
    'function_hide-child_two': 'Two',
    // 隐藏子菜单-三
    'function_hide-child_three': 'Three',
    // 请求示例
    function_request: 'Request',
    // 切换权限示例
    'function_toggle-auth': 'Toggle Auth',
    // 超级管理员可见页面
    'function_super-page': 'Super Admin Visible',
    // 系统管理
    manage: 'System Manage',
    // 用户管理
    manage_user: 'User Manage',
    // 用户详情
    'manage_user-detail': 'User Detail',
    // 角色管理
    manage_role: 'Role Manage',
    // 菜单管理
    manage_menu: 'Menu Manage',
    // 多级菜单
    'multi-menu': 'Multi Menu',
    // 菜单一
    'multi-menu_first': 'Menu One',
    // 菜单一-子菜单
    'multi-menu_first_child': 'Menu One Child',
    // 菜单二
    'multi-menu_second': 'Menu Two',
    // 菜单二-子菜单
    'multi-menu_second_child': 'Menu Two Child',
    // 菜单二-子菜单-首页
    'multi-menu_second_child_home': 'Menu Two Child Home',
    // 异常页
    exception: 'Exception',
    // 异常页 403
    exception_403: '403',
    // 异常页 404
    exception_404: '404',
    // 异常页 500
    exception_500: '500',
    // 插件
    plugin: 'Plugin',
    // 复制插件
    plugin_copy: 'Copy',
    // 图表插件
    plugin_charts: 'Charts',
    // ECharts
    plugin_charts_echarts: 'ECharts',
    // AntV
    plugin_charts_antv: 'AntV',
    // VChart
    plugin_charts_vchart: 'VChart',
    // 编辑器插件
    plugin_editor: 'Editor',
    // Quill
    plugin_editor_quill: 'Quill',
    // Markdown
    plugin_editor_markdown: 'Markdown',
    // 图标插件
    plugin_icon: 'Icon',
    // 地图插件
    plugin_map: 'Map',
    // 打印插件
    plugin_print: 'Print',
    // Swiper 插件
    plugin_swiper: 'Swiper',
    // 视频插件
    plugin_video: 'Video',
    // 条形码插件
    plugin_barcode: 'Barcode',
    // 拼音插件
    plugin_pinyin: 'pinyin',
    // Excel 插件
    plugin_excel: 'Excel',
    // PDF 预览插件
    plugin_pdf: 'PDF preview',
    // 甘特图插件
    plugin_gantt: 'Gantt Chart',
    // dhtmlxGantt
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    // VTableGantt
    plugin_gantt_vtable: 'VTableGantt',
    // Typeit 插件
    plugin_typeit: 'Typeit',
    // 表格插件
    plugin_tables: 'Tables',
    // VTable
    plugin_tables_vtable: 'VTable'
    // route 对象结束
  },
  // 页面文案（按页面模块拆分：登录/首页/关于/功能示例等）
  page: {
    // 登录页文案集合
    login: {
      // 登录页通用文案
      common: {
        // 登录/注册切换文案
        loginOrRegister: 'Login / Register',
        // 用户名输入占位
        userNamePlaceholder: 'Please enter user name',
        // 手机号输入占位
        phonePlaceholder: 'Please enter phone number',
        // 验证码输入占位
        codePlaceholder: 'Please enter verification code',
        // 密码输入占位
        passwordPlaceholder: 'Please enter password',
        // 确认密码输入占位
        confirmPasswordPlaceholder: 'Please enter password again',
        // 验证码登录入口文案
        codeLogin: 'Verification code login',
        // 确认按钮文案
        confirm: 'Confirm',
        // 返回按钮文案
        back: 'Back',
        // 校验通过提示
        validateSuccess: 'Verification passed',
        // 登录成功提示
        loginSuccess: 'Login successfully',
        // 欢迎回来提示（带用户名）
        welcomeBack: 'Welcome back, {userName} !'
        // common 对象结束
      },
      // 密码登录模块文案
      pwdLogin: {
        // 模块标题
        title: 'Password Login',
        // 记住我
        rememberMe: 'Remember me',
        // 忘记密码
        forgetPassword: 'Forget password?',
        // 注册入口
        register: 'Register',
        // 其他账号登录
        otherAccountLogin: 'Other Account Login',
        // 其他登录方式
        otherLoginMode: 'Other Login Mode',
        // 超级管理员
        superAdmin: 'Super Admin',
        // 管理员
        admin: 'Admin',
        // 普通用户
        user: 'User'
        // pwdLogin 对象结束
      },
      // 验证码登录模块文案
      codeLogin: {
        // 模块标题
        title: 'Verification Code Login',
        // 获取验证码
        getCode: 'Get verification code',
        // 重新获取验证码（带倒计时）
        reGetCode: 'Reacquire after {time}s',
        // 发送成功提示
        sendCodeSuccess: 'Verification code sent successfully',
        // 图片验证码输入占位
        imageCodePlaceholder: 'Please enter image verification code'
        // codeLogin 对象结束
      },
      // 注册模块文案
      register: {
        // 模块标题
        title: 'Register',
        // 协议确认前缀
        agreement: 'I have read and agree to',
        // 用户协议文案
        protocol: '《User Agreement》',
        // 隐私政策文案
        policy: '《Privacy Policy》'
        // register 对象结束
      },
      // 重置密码模块文案
      resetPwd: {
        // 模块标题
        title: 'Reset Password'
        // resetPwd 对象结束
      },
      // 绑定微信模块文案
      bindWeChat: {
        // 模块标题
        title: 'Bind WeChat'
        // bindWeChat 对象结束
      }
      // login 对象结束
    },
    // 关于页文案集合
    about: {
      // 页面标题
      title: 'About',
      // 项目介绍文案
      introduction: `SoybeanAdmin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite7, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. SoybeanAdmin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      // 项目信息卡片文案集合
      projectInfo: {
        // 卡片标题
        title: 'Project Info',
        // 版本字段文案
        version: 'Version',
        // 最近构建时间字段文案
        latestBuildTime: 'Latest Build Time',
        // Github 链接字段文案
        githubLink: 'Github Link',
        // 预览链接字段文案
        previewLink: 'Preview Link'
        // projectInfo 对象结束
      },
      // 生产依赖标题
      prdDep: 'Production Dependency',
      // 开发依赖标题
      devDep: 'Development Dependency'
      // about 对象结束
    },
    // 首页文案集合
    home: {
      // 分支说明（主分支精简、示例分支维护）
      branchDesc:
        // 说明文本
        'For the convenience of everyone in developing and updating the merge, we have streamlined the code of the main branch, only retaining the homepage menu, and the rest of the content has been moved to the example branch for maintenance. The preview address displays the content of the example branch.',
      // 问候语（带用户名）
      greeting: 'Good morning, {userName}, today is another day full of vitality!',
      // 天气描述
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      // 项目数统计
      projectCount: 'Project Count',
      // 待办统计
      todo: 'Todo',
      // 消息统计
      message: 'Message',
      // 下载量统计
      downloadCount: 'Download Count',
      // 注册量统计
      registerCount: 'Register Count',
      // 作息安排标题
      schedule: 'Work and rest Schedule',
      // 学习项
      study: 'Study',
      // 工作项
      work: 'Work',
      // 休息项
      rest: 'Rest',
      // 娱乐项
      entertainment: 'Entertainment',
      // 访问量统计
      visitCount: 'Visit Count',
      // 营业额统计
      turnover: 'Turnover',
      // 成交量统计
      dealCount: 'Deal Count',
      // 项目动态文案集合
      projectNews: {
        // 模块标题
        title: 'Project News',
        // 更多新闻入口文案
        moreNews: 'More News',
        // 动态 1
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        // 动态 2
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        // 动态 3
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        // 动态 4
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        // 动态 5
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
        // projectNews 对象结束
      },
      // 创意模块标题
      creativity: 'Creativity'
      // home 对象结束
    },
    // 功能示例页文案集合
    function: {
      // Tab 示例文案集合
      tab: {
        // Tab 操作文案集合
        tabOperate: {
          // 模块标题
          title: 'Tab Operation',
          // 新增 Tab
          addTab: 'Add Tab',
          // 新增 Tab 描述
          addTabDesc: 'To about page',
          // 关闭 Tab
          closeTab: 'Close Tab',
          // 关闭当前 Tab
          closeCurrentTab: 'Close Current Tab',
          // 关闭 About Tab
          closeAboutTab: 'Close "About" Tab',
          // 新增多开 Tab
          addMultiTab: 'Add Multi Tab',
          // 新增多开 Tab 描述 1
          addMultiTabDesc1: 'To MultiTab page',
          // 新增多开 Tab 描述 2
          addMultiTabDesc2: 'To MultiTab page(with query params)'
          // tabOperate 对象结束
        },
        // Tab 标题设置文案集合
        tabTitle: {
          // 模块标题
          title: 'Tab Title',
          // 修改标题
          changeTitle: 'Change Title',
          // 修改按钮文案
          change: 'Change',
          // 重置标题
          resetTitle: 'Reset Title',
          // 重置按钮文案
          reset: 'Reset'
          // tabTitle 对象结束
        }
        // tab 对象结束
      },
      // 多 Tab 示例文案集合
      multiTab: {
        // 路由参数文案
        routeParam: 'Route Param',
        // 返回 Tab 示例页文案
        backTab: 'Back function_tab'
        // multiTab 对象结束
      },
      // 切换权限示例文案集合
      toggleAuth: {
        // 切换账号文案
        toggleAccount: 'Toggle Account',
        // 权限 Hook 说明
        authHook: 'Auth Hook Function `hasAuth`',
        // 超级管理员可见文案
        superAdminVisible: 'Super Admin Visible',
        // 管理员可见文案
        adminVisible: 'Admin Visible',
        // 管理员或用户可见文案
        adminOrUserVisible: 'Admin and User Visible'
        // toggleAuth 对象结束
      },
      // 请求示例文案集合
      request: {
        // 重复错误只提示一次说明
        repeatedErrorOccurOnce: 'Repeated Request Error Occurs Once',
        // 重复错误标题
        repeatedError: 'Repeated Request Error',
        // 自定义错误消息 1
        repeatedErrorMsg1: 'Custom Request Error 1',
        // 自定义错误消息 2
        repeatedErrorMsg2: 'Custom Request Error 2'
        // request 对象结束
      }
      // function 对象结束
    },
    // Alova 示例文案集合
    alova: {
      // 场景示例文案集合
      scenes: {
        // 发送验证码
        captchaSend: 'Captcha Send',
        // 自动请求
        autoRequest: 'Auto Request',
        // 窗口可见性自动请求提示
        visibilityRequestTips: 'Automatically request when switching browser window',
        // 轮询请求提示
        pollingRequestTips: 'It will request every 3 seconds',
        // 网络重连自动请求提示
        networkRequestTips: 'Automatically request after network reconnecting',
        // 刷新时间标题
        refreshTime: 'Refresh Time',
        // 开始请求按钮文案
        startRequest: 'Start Request',
        // 停止请求按钮文案
        stopRequest: 'Stop Request',
        // 跨组件请求文案
        requestCrossComponent: 'Request Cross Component',
        // 手动触发所有自动请求文案
        triggerAllRequest: 'Manually Trigger All Automated Requests'
        // scenes 对象结束
      }
      // alova 对象结束
    },
    // Pro Naive UI 示例文案集合
    proNaive: {
      // Pro Naive 表单示例文案集合
      form: {
        // 基础表单示例文案
        basic: {
          // 模块标题
          title: 'Basic Example',
          // 应用名称字段
          appName: 'ApplicationName',
          // 应用状态字段
          appStatus: 'ApplicationStatus',
          // 创建时间字段
          createTime: 'CreateTime',
          // 响应日期字段
          responseDate: 'ResponseDate',
          // 规格信息字段
          specificationInfo: 'SpecificationInfo',
          // 规格项字段
          specificate: 'Specificate',
          // 规格名称字段
          specificationName: 'SpecificationName',
          // 规格值字段
          specificationValue: 'SpecificationValue',
          // 规格颜色-红色
          specificationColorRed: 'Red',
          // 规格颜色-橙色
          specificationColorOrange: 'Orange',
          // 新增规格项按钮
          addSpecificateItem: 'Add Specificate Item',
          // 填充值文案
          fillValue: 'FillValue',
          // 重置按钮文案
          reset: 'Reset',
          // 提交按钮文案
          submit: 'Submit',
          // 新增按钮文案
          add: 'Add',
          // 删除按钮文案
          delete: 'Delete',
          // 颜色字段
          color: 'Color',
          // 正常状态
          normal: 'Normal',
          // 异常状态
          anomaly: 'Anomaly'
          // basic 对象结束
        },
        // 查询表单示例文案
        query: {
          // 标题 1（默认展开）
          title1: 'Query Example, which expands by default',
          // 标题 2（默认折叠，折叠保留两行）
          title2: 'Query Example, which fold by default, and two lines are retained when folding',
          // 应用名称字段
          appName: 'ApplicationName',
          // 应用状态字段
          appStatus: 'ApplicationStatus',
          // 创建时间字段
          createTime: 'CreateTime',
          // 响应日期字段
          responseDate: 'ResponseDate',
          // 结束日期字段
          endDate: 'EndDate',
          // 字段文案
          field: 'Field'
          // query 对象结束
        },
        // 分步表单示例文案
        step: {
          // 模块标题
          title: 'Step Form',
          // 第一步文案集合
          step1: {
            // 步骤标题
            title: 'Form 1',
            // 步骤字段
            field: 'Form 1 field',
            // 下一步按钮
            nextStep: 'Next Step'
            // step1 对象结束
          },
          // 第二步文案集合
          step2: {
            // 步骤标题
            title: 'Form 2',
            // 步骤字段
            field: 'Form 2 field',
            // 上一步按钮
            prevStep: 'Prev Step',
            // 提交按钮
            submit: 'Submit'
            // step2 对象结束
          }
          // step 对象结束
        }
        // form 对象结束
      },
      // Pro Naive 表格示例文案集合
      table: {
        // 远程表格示例文案
        remote: {
          // 筛选条件标题
          filterCondition: 'Filter Condition',
          // 名称字段
          name: 'Name',
          // 创建时间字段
          createTime: 'CreateTime',
          // 响应时间字段
          responseTime: 'ResponseTime',
          // 模块标题
          title: 'Remote Loading',
          // 可复制文本字段
          replicableText: 'Replicable Text',
          // 标签字段
          tags: 'Tags',
          // 日期格式化字段
          dateFormatting: 'Date Formatting',
          // 图片字段
          image: 'Image'
          // remote 对象结束
        },
        // 行编辑表格示例文案
        rowEdit: {
          // 模块标题
          title: 'Edit Table',
          // 重置按钮文案
          reset: 'Reset',
          // 提交按钮文案
          submit: 'Submit',
          // 编辑按钮文案
          edit: 'Edit',
          // 删除按钮文案
          delete: 'Delete',
          // 保存按钮文案
          save: 'Save',
          // 任务字段
          task: 'Task',
          // 分数字段
          score: 'Score',
          // 时间字段
          time: 'Time',
          // 名称字段
          name: 'Name',
          // 操作列标题
          action: 'Action'
          // rowEdit 对象结束
        }
        // table 对象结束
      }
      // proNaive 对象结束
    },
    // 系统管理页文案集合（角色/用户/菜单管理）
    manage: {
      // 通用文案集合
      common: {
        // 状态文案集合
        status: {
          // 启用状态
          enable: 'Enable',
          // 禁用状态
          disable: 'Disable'
          // status 对象结束
        }
        // common 对象结束
      },
      // 角色管理文案集合
      role: {
        // 列表标题
        title: 'Role List',
        // 角色名称列
        roleName: 'Role Name',
        // 角色编码列
        roleCode: 'Role Code',
        // 角色状态列
        roleStatus: 'Role Status',
        // 角色描述列
        roleDesc: 'Role Description',
        // 菜单权限列
        menuAuth: 'Menu Auth',
        // 按钮权限列
        buttonAuth: 'Button Auth',
        // 表单占位/校验文案集合
        form: {
          // 角色名称校验提示
          roleName: 'Please enter role name',
          // 角色编码校验提示
          roleCode: 'Please enter role code',
          // 角色状态校验提示
          roleStatus: 'Please select role status',
          // 角色描述校验提示
          roleDesc: 'Please enter role description'
          // form 对象结束
        },
        // 新增角色按钮文案
        addRole: 'Add Role',
        // 编辑角色按钮文案
        editRole: 'Edit Role'
        // role 对象结束
      },
      // 用户管理文案集合
      user: {
        // 列表标题
        title: 'User List',
        // 用户名列
        userName: 'User Name',
        // 性别列
        userGender: 'Gender',
        // 昵称列
        nickName: 'Nick Name',
        // 手机号列
        userPhone: 'Phone Number',
        // 邮箱列
        userEmail: 'Email',
        // 状态列
        userStatus: 'User Status',
        // 用户角色列
        userRole: 'User Role',
        // 表单占位/校验文案集合
        form: {
          // 用户名校验提示
          userName: 'Please enter user name',
          // 性别校验提示
          userGender: 'Please select gender',
          // 昵称校验提示
          nickName: 'Please enter nick name',
          // 手机号校验提示
          userPhone: 'Please enter phone number',
          // 邮箱校验提示
          userEmail: 'Please enter email',
          // 状态校验提示
          userStatus: 'Please select user status',
          // 用户角色校验提示
          userRole: 'Please select user role'
          // form 对象结束
        },
        // 新增用户按钮文案
        addUser: 'Add User',
        // 编辑用户按钮文案
        editUser: 'Edit User',
        // 性别文案集合
        gender: {
          // 男
          male: 'Male',
          // 女
          female: 'Female'
          // gender 对象结束
        }
        // user 对象结束
      },
      // 菜单管理文案集合
      menu: {
        // 首页文案（用于 home 选择项）
        home: 'Home',
        // 列表标题
        title: 'Menu List',
        // ID 列
        id: 'ID',
        // 父级 ID 列
        parentId: 'Parent ID',
        // 菜单类型列
        menuType: 'Menu Type',
        // 菜单名称列
        menuName: 'Menu Name',
        // 路由名称列
        routeName: 'Route Name',
        // 路由路径列
        routePath: 'Route Path',
        // 路径参数列
        pathParam: 'Path Param',
        // 布局组件列
        layout: 'Layout Component',
        // 页面组件列
        page: 'Page Component',
        // i18n key 列
        i18nKey: 'I18n Key',
        // 图标列
        icon: 'Icon',
        // 本地图标列
        localIcon: 'Local Icon',
        // 图标类型列标题
        iconTypeTitle: 'Icon Type',
        // 排序列
        order: 'Order',
        // 常量路由列
        constant: 'Constant',
        // keep-alive 缓存列
        keepAlive: 'Keep Alive',
        // 外链地址列
        href: 'Href',
        // 菜单隐藏列
        hideInMenu: 'Hide In Menu',
        // 激活菜单列
        activeMenu: 'Active Menu',
        // 多 Tab 列
        multiTab: 'Multi Tab',
        // Tab 固定索引列
        fixedIndexInTab: 'Fixed Index In Tab',
        // 路由 query 参数列
        query: 'Query Params',
        // 按钮列
        button: 'Button',
        // 按钮编码列
        buttonCode: 'Button Code',
        // 按钮描述列
        buttonDesc: 'Button Desc',
        // 菜单状态列
        menuStatus: 'Menu Status',
        // 表单占位/校验文案集合
        form: {
          // 首页选择校验提示
          home: 'Please select home',
          // 菜单类型校验提示
          menuType: 'Please select menu type',
          // 菜单名称校验提示
          menuName: 'Please enter menu name',
          // 路由名称校验提示
          routeName: 'Please enter route name',
          // 路由路径校验提示
          routePath: 'Please enter route path',
          // 路径参数校验提示
          pathParam: 'Please enter path param',
          // 页面组件校验提示
          page: 'Please select page component',
          // 布局组件校验提示
          layout: 'Please select layout component',
          // i18n key 校验提示
          i18nKey: 'Please enter i18n key',
          // iconify 名称校验提示
          icon: 'Please enter iconify name',
          // 本地图标名称校验提示
          localIcon: 'Please enter local icon name',
          // 排序校验提示
          order: 'Please enter order',
          // keepAlive 校验提示
          keepAlive: 'Please select whether to cache route',
          // href 校验提示
          href: 'Please enter href',
          // hideInMenu 校验提示
          hideInMenu: 'Please select whether to hide menu',
          // activeMenu 校验提示
          activeMenu: 'Please select route name of the highlighted menu',
          // multiTab 校验提示
          multiTab: 'Please select whether to support multiple tabs',
          // fixedInTab 校验提示
          fixedInTab: 'Please select whether to fix in the tab',
          // fixedIndexInTab 校验提示
          fixedIndexInTab: 'Please enter the index fixed in the tab',
          // query key 校验提示
          queryKey: 'Please enter route parameter Key',
          // query value 校验提示
          queryValue: 'Please enter route parameter Value',
          // button 校验提示
          button: 'Please select whether it is a button',
          // buttonCode 校验提示
          buttonCode: 'Please enter button code',
          // buttonDesc 校验提示
          buttonDesc: 'Please enter button description',
          // menuStatus 校验提示
          menuStatus: 'Please select menu status'
          // form 对象结束
        },
        // 新增菜单按钮文案
        addMenu: 'Add Menu',
        // 编辑菜单按钮文案
        editMenu: 'Edit Menu',
        // 新增子菜单按钮文案
        addChildMenu: 'Add Child Menu',
        // 菜单类型文案集合
        type: {
          // 目录
          directory: 'Directory',
          // 菜单
          menu: 'Menu'
          // type 对象结束
        },
        // 图标类型文案集合
        iconType: {
          // iconify 图标
          iconify: 'Iconify Icon',
          // 本地图标
          local: 'Local Icon'
          // iconType 对象结束
        }
        // menu 对象结束
      }
      // manage 对象结束
    }
  },
  // 表单校验文案集合
  form: {
    // 通用必填提示
    required: 'Cannot be empty',
    // 用户名校验文案集合
    userName: {
      // 必填提示
      required: 'Please enter user name',
      // 格式错误提示
      invalid: 'User name format is incorrect'
      // userName 对象结束
    },
    // 手机号校验文案集合
    phone: {
      // 必填提示
      required: 'Please enter phone number',
      // 格式错误提示
      invalid: 'Phone number format is incorrect'
      // phone 对象结束
    },
    // 密码校验文案集合
    pwd: {
      // 必填提示
      required: 'Please enter password',
      // 格式错误提示
      invalid: '6-18 characters, including letters, numbers, and underscores'
      // pwd 对象结束
    },
    // 确认密码校验文案集合
    confirmPwd: {
      // 必填提示
      required: 'Please enter password again',
      // 不一致提示
      invalid: 'The two passwords are inconsistent'
      // confirmPwd 对象结束
    },
    // 验证码校验文案集合
    code: {
      // 必填提示
      required: 'Please enter verification code',
      // 格式错误提示
      invalid: 'Verification code format is incorrect'
      // code 对象结束
    },
    // 邮箱校验文案集合
    email: {
      // 必填提示
      required: 'Please enter email',
      // 格式错误提示
      invalid: 'Email format is incorrect'
      // email 对象结束
    }
    // form 对象结束
  },
  // Tab 右键下拉菜单文案集合
  dropdown: {
    // 关闭当前
    closeCurrent: 'Close Current',
    // 关闭其他
    closeOther: 'Close Other',
    // 关闭左侧
    closeLeft: 'Close Left',
    // 关闭右侧
    closeRight: 'Close Right',
    // 关闭全部
    closeAll: 'Close All',
    // 固定标签页
    pin: 'Pin Tab',
    // 取消固定标签页
    unpin: 'Unpin Tab'
    // dropdown 对象结束
  },
  // 顶部功能图标提示文案集合
  icon: {
    // 主题配置
    themeConfig: 'Theme Configuration',
    // 主题模式
    themeSchema: 'Theme Schema',
    // 切换语言
    lang: 'Switch Language',
    // 全屏
    fullscreen: 'Fullscreen',
    // 退出全屏
    fullscreenExit: 'Exit Fullscreen',
    // 刷新页面
    reload: 'Reload Page',
    // 折叠菜单
    collapse: 'Collapse Menu',
    // 展开菜单
    expand: 'Expand Menu',
    // 固定
    pin: 'Pin',
    // 取消固定
    unpin: 'Unpin'
    // icon 对象结束
  },
  // 表格相关文案集合
  datatable: {
    // 总条数提示（带占位 total）
    itemCount: 'Total {total} items',
    // 固定列文案集合
    fixed: {
      // 左固定
      left: 'Left Fixed',
      // 右固定
      right: 'Right Fixed',
      // 不固定
      unFixed: 'Unfixed'
      // fixed 对象结束
    }
    // datatable 对象结束
  }
};

export default local;
