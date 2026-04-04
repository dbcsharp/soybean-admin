// 中文语言包（zh-CN）：系统/通用/请求/主题等模块的文案集合
// i18n Schema 根对象
const local: App.I18n.Schema = {
  // 系统相关文案
  system: {
    // 系统标题
    title: 'Soybean 管理系统',
    // 版本更新提示标题
    updateTitle: '系统版本更新通知',
    // 版本更新提示内容
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    // 版本更新确认按钮文案
    updateConfirm: '立即刷新',
    // 版本更新取消按钮文案
    updateCancel: '稍后再说'
    // system 对象结束
  },
  // 通用文案（按钮/提示/操作等）
  common: {
    // 操作列标题
    action: '操作',
    // 新增按钮文案
    add: '新增',
    // 新增成功提示
    addSuccess: '添加成功',
    // 返回首页文案
    backToHome: '返回首页',
    // 批量删除文案
    batchDelete: '批量删除',
    // 取消按钮文案
    cancel: '取消',
    // 关闭按钮文案
    close: '关闭',
    // 勾选文案
    check: '勾选',
    // 全选文案
    selectAll: '全选',
    // 展开列文案
    expandColumn: '展开列',
    // 列设置文案
    columnSetting: '列设置',
    // 配置文案
    config: '配置',
    // 确认按钮文案
    confirm: '确认',
    // 删除按钮文案
    delete: '删除',
    // 删除成功提示
    deleteSuccess: '删除成功',
    // 删除确认提示
    confirmDelete: '确认删除吗？',
    // 编辑按钮文案
    edit: '编辑',
    // 警告提示标题
    warning: '警告',
    // 错误提示标题
    error: '错误',
    // 序号列标题
    index: '序号',
    // 关键词搜索占位文案
    keywordSearch: '请输入关键词搜索',
    // 退出登录文案
    logout: '退出登录',
    // 退出登录确认提示
    logoutConfirm: '确认退出登录吗？',
    // 敬请期待提示
    lookForward: '敬请期待',
    // 修改按钮文案
    modify: '修改',
    // 修改成功提示
    modifySuccess: '修改成功',
    // 无数据提示
    noData: '无数据',
    // 操作文案
    operate: '操作',
    // 输入值校验提示
    pleaseCheckValue: '请检查输入的值是否合法',
    // 刷新按钮文案
    refresh: '刷新',
    // 重置按钮文案
    reset: '重置',
    // 搜索按钮文案
    search: '搜索',
    // 切换按钮文案
    switch: '切换',
    // 提示标题
    tip: '提示',
    // 触发文案
    trigger: '触发',
    // 更新按钮文案
    update: '更新',
    // 更新成功提示
    updateSuccess: '更新成功',
    // 个人中心文案
    userCenter: '个人中心',
    // 是/否文案集合
    yesOrNo: {
      // 是
      yes: '是',
      // 否
      no: '否'
      // yesOrNo 对象结束
    }
    // common 对象结束
  },
  // 请求相关文案（鉴权、刷新 token、登出提示等）
  request: {
    // 请求失败后登出用户的描述
    logout: '请求失败后登出用户',
    // 登出提示信息
    logoutMsg: '用户状态失效，请重新登录',
    // 以弹窗方式提示后再登出用户的描述
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    // 弹窗登出提示信息
    logoutWithModalMsg: '用户状态失效，请重新登录',
    // token 过期刷新提示
    refreshToken: '请求的token已过期，刷新token',
    // token 已过期提示
    tokenExpired: 'token已过期'
    // request 对象结束
  },
  // 主题相关文案（外观/布局/通用/预设/配置操作等）
  theme: {
    // 主题抽屉标题
    themeDrawerTitle: '主题配置',
    // 主题抽屉 Tab 标题集合
    tabs: {
      // 外观 Tab
      appearance: '外观',
      // 布局 Tab
      layout: '布局',
      // 通用 Tab
      general: '通用',
      // 预设 Tab
      preset: '预设'
      // tabs 对象结束
    },
    // 外观相关配置文案
    appearance: {
      // 主题模式文案集合
      themeSchema: {
        // 主题模式标题
        title: '主题模式',
        // 亮色模式
        light: '亮色模式',
        // 暗黑模式
        dark: '暗黑模式',
        // 跟随系统
        auto: '跟随系统'
        // themeSchema 对象结束
      },
      // 灰色模式
      grayscale: '灰色模式',
      // 色弱模式
      colourWeakness: '色弱模式',
      // 主题色文案集合
      themeColor: {
        // 主题色标题
        title: '主题颜色',
        // 主色
        primary: '主色',
        // 信息色
        info: '信息色',
        // 成功色
        success: '成功色',
        // 警告色
        warning: '警告色',
        // 错误色
        error: '错误色',
        // 信息色跟随主色
        followPrimary: '跟随主色'
        // themeColor 对象结束
      },
      // 主题圆角文案
      themeRadius: {
        // 圆角标题
        title: '主题圆角'
        // themeRadius 对象结束
      },
      // 推荐算法颜色开关文案
      recommendColor: '应用推荐算法的颜色',
      // 推荐算法颜色描述
      recommendColorDesc: '推荐颜色的算法参照',
      // 主题预设文案集合
      preset: {
        // 预设标题
        title: '主题预设',
        // 应用按钮文案
        apply: '应用',
        // 应用成功提示
        applySuccess: '预设应用成功',
        // 默认预设
        default: {
          // 预设名称
          name: '默认预设',
          // 预设描述
          desc: 'Soybean 默认主题预设'
          // default 对象结束
        },
        // 暗色预设
        dark: {
          // 预设名称
          name: '暗色预设',
          // 预设描述
          desc: '适用于夜间使用的暗色主题预设'
          // dark 对象结束
        },
        // 紧凑预设
        compact: {
          // 预设名称
          name: '紧凑型',
          // 预设描述
          desc: '适用于小屏幕的紧凑布局预设'
          // compact 对象结束
        },
        // Azir 预设
        azir: {
          // 预设名称
          name: 'Azir的预设',
          // 预设描述
          desc: '是 Azir 比较喜欢的莫兰迪色系冷淡风'
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
        title: '布局模式',
        // 左侧菜单模式
        vertical: '左侧菜单模式',
        // 左侧菜单混合模式
        'vertical-mix': '左侧菜单混合模式',
        // 左侧混合-顶部优先
        'vertical-hybrid-header-first': '左侧混合-顶部优先',
        // 顶部菜单模式
        horizontal: '顶部菜单模式',
        // 顶部混合-侧边优先
        'top-hybrid-sidebar-first': '顶部混合-侧边优先',
        // 顶部混合-顶部优先
        'top-hybrid-header-first': '顶部混合-顶部优先',
        // 左侧菜单模式说明
        vertical_detail: '左侧菜单布局，菜单在左，内容在右。',
        // 左侧菜单混合模式说明
        'vertical-mix_detail': '左侧双菜单布局，一级菜单在左侧深色区域，二级菜单在左侧浅色区域。',
        // 左侧混合-顶部优先说明
        'vertical-hybrid-header-first_detail':
          // 布局说明文本
          '左侧混合布局，一级菜单在顶部，二级菜单在左侧深色区域，三级菜单在左侧浅色区域。',
        // 顶部菜单模式说明
        horizontal_detail: '顶部菜单布局，菜单在顶部，内容在下方。',
        // 顶部混合-侧边优先说明
        'top-hybrid-sidebar-first_detail': '顶部混合布局，一级菜单在左侧，二级菜单在顶部。',
        // 顶部混合-顶部优先说明
        'top-hybrid-header-first_detail': '顶部混合布局，一级菜单在顶部，二级菜单在左侧。'
        // layoutMode 对象结束
      },
      // 标签栏设置文案集合
      tab: {
        // 标签栏设置标题
        title: '标签栏设置',
        // 是否显示标签栏
        visible: '显示标签栏',
        // 标签栏信息缓存
        cache: '标签栏信息缓存',
        // 缓存提示文案
        cacheTip: '一键开启/关闭全局 keepalive',
        // 标签栏高度
        height: '标签栏高度',
        // 标签栏风格文案集合
        mode: {
          // 标签栏风格标题
          title: '标签栏风格',
          // 滑块风格
          slider: '滑块风格',
          // 谷歌风格
          chrome: '谷歌风格',
          // 按钮风格
          button: '按钮风格'
          // mode 对象结束
        },
        // 鼠标中键关闭标签页
        closeByMiddleClick: '鼠标中键关闭标签页',
        // 中键关闭提示
        closeByMiddleClickTip: '启用后可以使用鼠标中键点击标签页进行关闭'
        // tab 对象结束
      },
      // 头部设置文案集合
      header: {
        // 头部设置标题
        title: '头部设置',
        // 头部高度
        height: '头部高度',
        // 面包屑设置文案集合
        breadcrumb: {
          // 显示面包屑
          visible: '显示面包屑',
          // 显示面包屑图标
          showIcon: '显示面包屑图标'
          // breadcrumb 对象结束
        }
        // header 对象结束
      },
      // 侧边栏设置文案集合
      sider: {
        // 侧边栏设置标题
        title: '侧边栏设置',
        // 深色侧边栏
        inverted: '深色侧边栏',
        // 侧边栏宽度
        width: '侧边栏宽度',
        // 侧边栏折叠宽度
        collapsedWidth: '侧边栏折叠宽度',
        // 混合布局侧边栏宽度
        mixWidth: '混合布局侧边栏宽度',
        // 混合布局侧边栏折叠宽度
        mixCollapsedWidth: '混合布局侧边栏折叠宽度',
        // 混合布局子菜单宽度
        mixChildMenuWidth: '混合布局子菜单宽度',
        // 自动选择第一个子菜单
        autoSelectFirstMenu: '自动选择第一个子菜单',
        // 自动选择提示
        autoSelectFirstMenuTip: '点击一级菜单时，自动选择并导航到第一个子菜单的最深层级'
        // sider 对象结束
      },
      // 底部设置文案集合
      footer: {
        // 底部设置标题
        title: '底部设置',
        // 显示底部
        visible: '显示底部',
        // 固定底部
        fixed: '固定底部',
        // 底部高度
        height: '底部高度',
        // 底部居右
        right: '底部居右'
        // footer 对象结束
      },
      // 内容区域设置文案集合
      content: {
        // 内容区域设置标题
        title: '内容区域设置',
        // 滚动模式文案集合
        scrollMode: {
          // 滚动模式标题
          title: '滚动模式',
          // 滚动模式提示
          tip: '主题滚动仅 main 部分滚动，外层滚动可携带头部底部一起滚动',
          // 外层滚动
          wrapper: '外层滚动',
          // 主体滚动
          content: '主体滚动'
          // scrollMode 对象结束
        },
        // 页面切换动画文案集合
        page: {
          // 页面切换动画开关文案
          animate: '页面切换动画',
          // 页面切换动画类型文案集合
          mode: {
            // 动画类型标题
            title: '页面切换动画类型',
            // 滑动
            'fade-slide': '滑动',
            // 淡入淡出
            fade: '淡入淡出',
            // 底部消退
            'fade-bottom': '底部消退',
            // 缩放消退
            'fade-scale': '缩放消退',
            // 渐变
            'zoom-fade': '渐变',
            // 闪现
            'zoom-out': '闪现',
            // 无动画
            none: '无'
            // mode 对象结束
          }
          // page 对象结束
        },
        // 固定头部和标签栏
        fixedHeaderAndTab: '固定头部和标签栏'
        // content 对象结束
      }
      // layout 对象结束
    },
    // 通用设置文案集合
    general: {
      // 通用设置标题
      title: '通用设置',
      // 水印设置文案集合
      watermark: {
        // 水印设置标题
        title: '水印设置',
        // 显示全屏水印
        visible: '显示全屏水印',
        // 自定义水印文本
        text: '自定义水印文本',
        // 启用用户名水印
        enableUserName: '启用用户名水印',
        // 显示当前时间
        enableTime: '显示当前时间',
        // 时间格式
        timeFormat: '时间格式'
        // watermark 对象结束
      },
      // 多语言设置文案集合
      multilingual: {
        // 多语言设置标题
        title: '多语言设置',
        // 显示多语言按钮
        visible: '显示多语言按钮'
        // multilingual 对象结束
      },
      // 全局搜索设置文案集合
      globalSearch: {
        // 全局搜索设置标题
        title: '全局搜索设置',
        // 显示全局搜索按钮
        visible: '显示全局搜索按钮'
        // globalSearch 对象结束
      }
      // general 对象结束
    },
    // 配置操作文案集合
    configOperation: {
      // 复制配置按钮文案
      copyConfig: '复制配置',
      // 复制成功提示
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      // 重置配置按钮文案
      resetConfig: '重置配置',
      // 重置成功提示
      resetSuccessMsg: '重置成功'
      // configOperation 对象结束
    }
    // theme 对象结束
  },
  // 路由名称文案（用于菜单/面包屑/Tab 标题等）
  route: {
    // 登录
    login: '登录',
    // 无权限
    403: '无权限',
    // 页面不存在
    404: '页面不存在',
    // 服务器错误
    500: '服务器错误',
    // 外链页面（iframe）
    'iframe-page': '外链页面',
    // 首页
    home: '首页',
    // 文档
    document: '文档',
    // 项目文档（站内）
    document_project: '项目文档',
    // 项目文档（外链）
    'document_project-link': '项目文档(外链)',
    // 视频教程
    document_video: '视频教程',
    // Vue 文档
    document_vue: 'Vue文档',
    // Vite 文档
    document_vite: 'Vite文档',
    // UnoCSS 文档
    document_unocss: 'UnoCSS文档',
    // Naive UI 文档
    document_naive: 'Naive UI文档',
    // Pro Naive UI 文档
    'document_pro-naive': 'Pro Naive UI文档',
    // Ant Design Vue 文档
    document_antd: 'Ant Design Vue文档',
    // Alova 文档
    document_alova: 'Alova文档',
    // 个人中心
    'user-center': '个人中心',
    // 关于
    about: '关于',
    // 系统功能
    function: '系统功能',
    // alova 示例
    alova: 'alova示例',
    // alova 请求
    alova_request: 'alova请求',
    // 场景化请求
    alova_scenes: '场景化请求',
    // Pro Naive UI 示例
    'pro-naive': 'Pro Naive UI 示例',
    // Pro Naive 表单
    'pro-naive_form': '表单',
    // 基础表单
    'pro-naive_form_basic': '基础表单',
    // 查询表单
    'pro-naive_form_query': '查询表单',
    // 分步表单
    'pro-naive_form_step': '分步表单',
    // Pro Naive 表格
    'pro-naive_table': '表格',
    // 远程加载表格
    'pro-naive_table_remote': '远程加载',
    // 行编辑表格
    'pro-naive_table_row-edit': '行编辑',
    // 标签页示例
    function_tab: '标签页',
    // 多标签页示例
    'function_multi-tab': '多标签页',
    // 隐藏子菜单示例
    'function_hide-child': '隐藏子菜单',
    // 隐藏子菜单-一
    'function_hide-child_one': '隐藏子菜单',
    // 隐藏子菜单-二
    'function_hide-child_two': '菜单二',
    // 隐藏子菜单-三
    'function_hide-child_three': '菜单三',
    // 请求示例
    function_request: '请求',
    // 切换权限示例
    'function_toggle-auth': '切换权限',
    // 超级管理员可见页面
    'function_super-page': '超级管理员可见',
    // 系统管理
    manage: '系统管理',
    // 用户管理
    manage_user: '用户管理',
    // 用户详情
    'manage_user-detail': '用户详情',
    // 角色管理
    manage_role: '角色管理',
    // 菜单管理
    manage_menu: '菜单管理',
    // 多级菜单
    'multi-menu': '多级菜单',
    // 菜单一
    'multi-menu_first': '菜单一',
    // 菜单一子菜单
    'multi-menu_first_child': '菜单一子菜单',
    // 菜单二
    'multi-menu_second': '菜单二',
    // 菜单二子菜单
    'multi-menu_second_child': '菜单二子菜单',
    // 菜单二子菜单首页
    'multi-menu_second_child_home': '菜单二子菜单首页',
    // 异常页
    exception: '异常页',
    // 异常页 403
    exception_403: '403',
    // 异常页 404
    exception_404: '404',
    // 异常页 500
    exception_500: '500',
    // 插件示例
    plugin: '插件示例',
    // 剪贴板
    plugin_copy: '剪贴板',
    // 图表
    plugin_charts: '图表',
    // ECharts
    plugin_charts_echarts: 'ECharts',
    // AntV
    plugin_charts_antv: 'AntV',
    // VChart
    plugin_charts_vchart: 'VChart',
    // 编辑器
    plugin_editor: '编辑器',
    // 富文本编辑器
    plugin_editor_quill: '富文本编辑器',
    // Markdown 编辑器
    plugin_editor_markdown: 'MD 编辑器',
    // 图标
    plugin_icon: '图标',
    // 地图
    plugin_map: '地图',
    // 打印
    plugin_print: '打印',
    // Swiper
    plugin_swiper: 'Swiper',
    // 视频
    plugin_video: '视频',
    // 条形码
    plugin_barcode: '条形码',
    // 拼音
    plugin_pinyin: '拼音',
    // Excel
    plugin_excel: 'Excel',
    // PDF 预览
    plugin_pdf: 'PDF 预览',
    // 甘特图
    plugin_gantt: '甘特图',
    // dhtmlxGantt
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    // VTableGantt
    plugin_gantt_vtable: 'VTableGantt',
    // 打字机
    plugin_typeit: '打字机',
    // 表格
    plugin_tables: '表格',
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
        loginOrRegister: '登录 / 注册',
        // 用户名输入占位
        userNamePlaceholder: '请输入用户名',
        // 手机号输入占位
        phonePlaceholder: '请输入手机号',
        // 验证码输入占位
        codePlaceholder: '请输入验证码',
        // 密码输入占位
        passwordPlaceholder: '请输入密码',
        // 确认密码输入占位
        confirmPasswordPlaceholder: '请再次输入密码',
        // 验证码登录入口文案
        codeLogin: '验证码登录',
        // 确认按钮文案
        confirm: '确定',
        // 返回按钮文案
        back: '返回',
        // 校验通过提示
        validateSuccess: '验证成功',
        // 登录成功提示
        loginSuccess: '登录成功',
        // 欢迎回来提示（带用户名）
        welcomeBack: '欢迎回来，{userName} ！'
        // common 对象结束
      },
      // 密码登录模块文案
      pwdLogin: {
        // 模块标题
        title: '密码登录',
        // 记住我
        rememberMe: '记住我',
        // 忘记密码
        forgetPassword: '忘记密码？',
        // 注册入口
        register: '注册账号',
        // 其他账号登录
        otherAccountLogin: '其他账号登录',
        // 其他登录方式
        otherLoginMode: '其他登录方式',
        // 超级管理员
        superAdmin: '超级管理员',
        // 管理员
        admin: '管理员',
        // 普通用户
        user: '普通用户'
        // pwdLogin 对象结束
      },
      // 验证码登录模块文案
      codeLogin: {
        // 模块标题
        title: '验证码登录',
        // 获取验证码
        getCode: '获取验证码',
        // 重新获取验证码（带倒计时）
        reGetCode: '{time}秒后重新获取',
        // 发送成功提示
        sendCodeSuccess: '验证码发送成功',
        // 图片验证码输入占位
        imageCodePlaceholder: '请输入图片验证码'
        // codeLogin 对象结束
      },
      // 注册模块文案
      register: {
        // 模块标题
        title: '注册账号',
        // 协议确认前缀
        agreement: '我已经仔细阅读并接受',
        // 用户协议文案
        protocol: '《用户协议》',
        // 隐私权政策文案
        policy: '《隐私权政策》'
        // register 对象结束
      },
      // 重置密码模块文案
      resetPwd: {
        // 模块标题
        title: '重置密码'
        // resetPwd 对象结束
      },
      // 绑定微信模块文案
      bindWeChat: {
        // 模块标题
        title: '绑定微信'
        // bindWeChat 对象结束
      }
      // login 对象结束
    },
    // 关于页文案集合
    about: {
      // 页面标题
      title: '关于',
      // 项目介绍文案
      introduction: `SoybeanAdmin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite7, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。SoybeanAdmin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。`,
      // 项目信息卡片文案集合
      projectInfo: {
        // 卡片标题
        title: '项目信息',
        // 版本字段文案
        version: '版本',
        // 最近构建时间字段文案
        latestBuildTime: '最新构建时间',
        // Github 地址字段文案
        githubLink: 'Github 地址',
        // 预览地址字段文案
        previewLink: '预览地址'
        // projectInfo 对象结束
      },
      // 生产依赖标题
      prdDep: '生产依赖',
      // 开发依赖标题
      devDep: '开发依赖'
      // about 对象结束
    },
    // 首页文案集合
    home: {
      // 分支说明（main 精简/示例分支维护）
      branchDesc:
        // 说明文本
        '为了方便大家开发和更新合并，我们对main分支的代码进行了精简，只保留了首页菜单，其余内容已移至example分支进行维护。预览地址显示的内容即为example分支的内容。',
      // 问候语（带用户名）
      greeting: '早安，{userName}, 今天又是充满活力的一天!',
      // 天气描述
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      // 项目数统计
      projectCount: '项目数',
      // 待办统计
      todo: '待办',
      // 消息统计
      message: '消息',
      // 下载量统计
      downloadCount: '下载量',
      // 注册量统计
      registerCount: '注册量',
      // 作息安排标题
      schedule: '作息安排',
      // 学习项
      study: '学习',
      // 工作项
      work: '工作',
      // 休息项
      rest: '休息',
      // 娱乐项
      entertainment: '娱乐',
      // 访问量统计
      visitCount: '访问量',
      // 成交额统计
      turnover: '成交额',
      // 成交量统计
      dealCount: '成交量',
      // 项目动态文案集合
      projectNews: {
        // 模块标题
        title: '项目动态',
        // 更多动态入口文案
        moreNews: '更多动态',
        // 动态 1
        desc1: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!',
        // 动态 2
        desc2: 'Yanbowe 向 soybean-admin 提交了一个bug，多标签栏不会自适应。',
        // 动态 3
        desc3: 'Soybean 准备为 soybean-admin 的发布做充分的准备工作!',
        // 动态 4
        desc4: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        // 动态 5
        desc5: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！'
        // projectNews 对象结束
      },
      // 创意模块标题
      creativity: '创意'
      // home 对象结束
    },
    // 系统功能示例页文案集合
    function: {
      // 标签页示例文案集合
      tab: {
        // 标签页操作文案集合
        tabOperate: {
          // 模块标题
          title: '标签页操作',
          // 添加标签页按钮文案
          addTab: '添加标签页',
          // 添加标签页说明
          addTabDesc: '跳转到关于页面',
          // 关闭标签页按钮文案
          closeTab: '关闭标签页',
          // 关闭当前标签页按钮文案
          closeCurrentTab: '关闭当前标签页',
          // 关闭关于标签页按钮文案
          closeAboutTab: '关闭"关于"标签页',
          // 添加多标签页按钮文案
          addMultiTab: '添加多标签页',
          // 添加多标签页说明 1
          addMultiTabDesc1: '跳转到多标签页页面',
          // 添加多标签页说明 2
          addMultiTabDesc2: '跳转到多标签页页面(带有查询参数)'
          // tabOperate 对象结束
        },
        // 标签页标题设置文案集合
        tabTitle: {
          // 模块标题
          title: '标签页标题',
          // 修改标题文案
          changeTitle: '修改标题',
          // 修改按钮文案
          change: '修改',
          // 重置标题文案
          resetTitle: '重置标题',
          // 重置按钮文案
          reset: '重置'
          // tabTitle 对象结束
        }
        // tab 对象结束
      },
      // 多标签页示例文案集合
      multiTab: {
        // 路由参数文案
        routeParam: '路由参数',
        // 返回标签页示例页文案
        backTab: '返回 function_tab'
        // multiTab 对象结束
      },
      // 切换权限示例文案集合
      toggleAuth: {
        // 切换账号按钮文案
        toggleAccount: '切换账号',
        // 权限钩子说明文案
        authHook: '权限钩子函数 `hasAuth`',
        // 超级管理员可见文案
        superAdminVisible: '超级管理员可见',
        // 管理员可见文案
        adminVisible: '管理员可见',
        // 管理员和用户可见文案
        adminOrUserVisible: '管理员和用户可见'
        // toggleAuth 对象结束
      },
      // 请求示例文案集合
      request: {
        // 重复错误只提示一次说明
        repeatedErrorOccurOnce: '重复请求错误只出现一次',
        // 重复请求错误标题
        repeatedError: '重复请求错误',
        // 自定义请求错误 1
        repeatedErrorMsg1: '自定义请求错误 1',
        // 自定义请求错误 2
        repeatedErrorMsg2: '自定义请求错误 2'
        // request 对象结束
      }
      // function 对象结束
    },
    // Alova 示例文案集合
    alova: {
      // 场景示例文案集合
      scenes: {
        // 发送验证码
        captchaSend: '发送验证码',
        // 自动请求
        autoRequest: '自动请求',
        // 窗口可见性自动请求提示
        visibilityRequestTips: '浏览器窗口切换自动请求数据',
        // 轮询请求提示
        pollingRequestTips: '每3秒自动请求一次',
        // 网络重连自动请求提示
        networkRequestTips: '网络重连后自动请求',
        // 更新时间标题
        refreshTime: '更新时间',
        // 开始请求按钮文案
        startRequest: '开始请求',
        // 停止请求按钮文案
        stopRequest: '停止请求',
        // 跨组件触发请求文案
        requestCrossComponent: '跨组件触发请求',
        // 手动触发所有自动请求文案
        triggerAllRequest: '手动触发所有自动请求'
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
          title: '基础示例',
          // 应用名称字段
          appName: '应用名称',
          // 应用状态字段
          appStatus: '应用状态',
          // 创建时间字段
          createTime: '创建时间',
          // 响应日期字段
          responseDate: '响应日期',
          // 规格信息字段
          specificationInfo: '规格信息',
          // 规格字段
          specificate: '规格',
          // 规格名字段
          specificationName: '规格名',
          // 规格值字段
          specificationValue: '规格值',
          // 规格颜色-红
          specificationColorRed: '红',
          // 规格颜色-橙
          specificationColorOrange: '橙',
          // 添加规格项按钮文案
          addSpecificateItem: '添加规格项',
          // 填充值文案
          fillValue: '填充值',
          // 重置按钮文案
          reset: '重置',
          // 提交按钮文案
          submit: '提交',
          // 新建按钮文案
          add: '新建',
          // 删除按钮文案
          delete: '删除',
          // 颜色字段
          color: '颜色',
          // 正常状态
          normal: '正常',
          // 异常状态
          anomaly: '异常'
          // basic 对象结束
        },
        // 查询表单示例文案
        query: {
          // 标题 1（默认展开）
          title1: '查询表单，默认展开',
          // 标题 2（默认折叠，折叠保留 2 行）
          title2: '查询表单，默认折叠，折叠时保留2行',
          // 应用名称字段
          appName: '应用名称',
          // 应用状态字段
          appStatus: '应用状态',
          // 创建时间字段
          createTime: '创建时间',
          // 响应日期字段
          responseDate: '响应日期',
          // 结束日期字段
          endDate: '结束日期',
          // 字段文案
          field: '字段'
          // query 对象结束
        },
        // 分步表单示例文案
        step: {
          // 模块标题
          title: '分步表单',
          // 第一步文案集合
          step1: {
            // 步骤标题
            title: '表单1',
            // 步骤字段
            field: '表单1字段',
            // 下一步按钮文案
            nextStep: '下一步'
            // step1 对象结束
          },
          // 第二步文案集合
          step2: {
            // 步骤标题
            title: '表单2',
            // 步骤字段
            field: '表单2字段',
            // 上一步按钮文案
            prevStep: '上一步',
            // 提交按钮文案
            submit: '提交'
            // step2 对象结束
          }
          // step 对象结束
        }
        // form 对象结束
      },
      // Pro Naive 表格示例文案集合
      table: {
        // 远程加载表格示例文案
        remote: {
          // 筛选条件标题
          filterCondition: '筛选条件',
          // 名称字段
          name: '名称',
          // 创建时间字段
          createTime: '创建时间',
          // 响应时间字段
          responseTime: '响应时间',
          // 模块标题
          title: '远程加载',
          // 可复制文本字段
          replicableText: '可复制文本',
          // 标签字段
          tags: 'tags',
          // 日期格式化字段
          dateFormatting: '日期格式化',
          // 图片字段
          image: '图片'
          // remote 对象结束
        },
        // 行编辑表格示例文案
        rowEdit: {
          // 模块标题
          title: '编辑表格',
          // 重置按钮文案
          reset: '重置',
          // 提交按钮文案
          submit: '提交',
          // 编辑按钮文案
          edit: '编辑',
          // 删除按钮文案
          delete: '删除',
          // 保存按钮文案
          save: '保存',
          // 任务字段
          task: '任务',
          // 评分字段
          score: '评分',
          // 时间字段
          time: '时间',
          // 名称字段
          name: '名称',
          // 操作列标题
          action: '操作'
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
          enable: '启用',
          // 禁用状态
          disable: '禁用'
          // status 对象结束
        }
        // common 对象结束
      },
      // 角色管理文案集合
      role: {
        // 列表标题
        title: '角色列表',
        // 角色名称列
        roleName: '角色名称',
        // 角色编码列
        roleCode: '角色编码',
        // 角色状态列
        roleStatus: '角色状态',
        // 角色描述列
        roleDesc: '角色描述',
        // 菜单权限列
        menuAuth: '菜单权限',
        // 按钮权限列
        buttonAuth: '按钮权限',
        // 表单占位/校验文案集合
        form: {
          // 角色名称校验提示
          roleName: '请输入角色名称',
          // 角色编码校验提示
          roleCode: '请输入角色编码',
          // 角色状态校验提示
          roleStatus: '请选择角色状态',
          // 角色描述校验提示
          roleDesc: '请输入角色描述'
          // form 对象结束
        },
        // 新增角色按钮文案
        addRole: '新增角色',
        // 编辑角色按钮文案
        editRole: '编辑角色'
        // role 对象结束
      },
      // 用户管理文案集合
      user: {
        // 列表标题
        title: '用户列表',
        // 用户名列
        userName: '用户名',
        // 性别列
        userGender: '性别',
        // 昵称列
        nickName: '昵称',
        // 手机号列
        userPhone: '手机号',
        // 邮箱列
        userEmail: '邮箱',
        // 用户状态列
        userStatus: '用户状态',
        // 用户角色列
        userRole: '用户角色',
        // 表单占位/校验文案集合
        form: {
          // 用户名校验提示
          userName: '请输入用户名',
          // 性别校验提示
          userGender: '请选择性别',
          // 昵称校验提示
          nickName: '请输入昵称',
          // 手机号校验提示
          userPhone: '请输入手机号',
          // 邮箱校验提示
          userEmail: '请输入邮箱',
          // 状态校验提示
          userStatus: '请选择用户状态',
          // 用户角色校验提示
          userRole: '请选择用户角色'
          // form 对象结束
        },
        // 新增用户按钮文案
        addUser: '新增用户',
        // 编辑用户按钮文案
        editUser: '编辑用户',
        // 性别文案集合
        gender: {
          // 男
          male: '男',
          // 女
          female: '女'
          // gender 对象结束
        }
        // user 对象结束
      },
      // 菜单管理文案集合
      menu: {
        // 首页文案（用于 home 选择项）
        home: '首页',
        // 列表标题
        title: '菜单列表',
        // ID 列
        id: 'ID',
        // 父级菜单 ID 列
        parentId: '父级菜单ID',
        // 菜单类型列
        menuType: '菜单类型',
        // 菜单名称列
        menuName: '菜单名称',
        // 路由名称列
        routeName: '路由名称',
        // 路由路径列
        routePath: '路由路径',
        // 路径参数列
        pathParam: '路径参数',
        // 布局列
        layout: '布局',
        // 页面组件列
        page: '页面组件',
        // 国际化 key 列
        i18nKey: '国际化key',
        // 图标列
        icon: '图标',
        // 本地图标列
        localIcon: '本地图标',
        // 图标类型列标题
        iconTypeTitle: '图标类型',
        // 排序列
        order: '排序',
        // 常量路由列
        constant: '常量路由',
        // 缓存路由列
        keepAlive: '缓存路由',
        // 外链列
        href: '外链',
        // 隐藏菜单列
        hideInMenu: '隐藏菜单',
        // 高亮的菜单列
        activeMenu: '高亮的菜单',
        // 支持多页签列
        multiTab: '支持多页签',
        // 固定在页签中的序号列
        fixedIndexInTab: '固定在页签中的序号',
        // 路由参数列
        query: '路由参数',
        // 按钮列
        button: '按钮',
        // 按钮编码列
        buttonCode: '按钮编码',
        // 按钮描述列
        buttonDesc: '按钮描述',
        // 菜单状态列
        menuStatus: '菜单状态',
        // 表单占位/校验文案集合
        form: {
          // 首页选择校验提示
          home: '请选择首页',
          // 菜单类型校验提示
          menuType: '请选择菜单类型',
          // 菜单名称校验提示
          menuName: '请输入菜单名称',
          // 路由名称校验提示
          routeName: '请输入路由名称',
          // 路由路径校验提示
          routePath: '请输入路由路径',
          // 路径参数校验提示
          pathParam: '请输入路径参数',
          // 页面组件校验提示
          page: '请选择页面组件',
          // 布局组件校验提示
          layout: '请选择布局组件',
          // 国际化 key 校验提示
          i18nKey: '请输入国际化key',
          // 图标校验提示
          icon: '请输入图标',
          // 本地图标校验提示
          localIcon: '请选择本地图标',
          // 排序校验提示
          order: '请输入排序',
          // 缓存路由校验提示
          keepAlive: '请选择是否缓存路由',
          // 外链校验提示
          href: '请输入外链',
          // 隐藏菜单校验提示
          hideInMenu: '请选择是否隐藏菜单',
          // 高亮菜单校验提示
          activeMenu: '请选择高亮的菜单的路由名称',
          // 多标签校验提示
          multiTab: '请选择是否支持多标签',
          // 固定页签校验提示
          fixedInTab: '请选择是否固定在页签中',
          // 固定序号校验提示
          fixedIndexInTab: '请输入固定在页签中的序号',
          // 路由参数 Key 校验提示
          queryKey: '请输入路由参数Key',
          // 路由参数 Value 校验提示
          queryValue: '请输入路由参数Value',
          // 按钮校验提示
          button: '请选择是否按钮',
          // 按钮编码校验提示
          buttonCode: '请输入按钮编码',
          // 按钮描述校验提示
          buttonDesc: '请输入按钮描述',
          // 菜单状态校验提示
          menuStatus: '请选择菜单状态'
          // form 对象结束
        },
        // 新增菜单按钮文案
        addMenu: '新增菜单',
        // 编辑菜单按钮文案
        editMenu: '编辑菜单',
        // 新增子菜单按钮文案
        addChildMenu: '新增子菜单',
        // 菜单类型文案集合
        type: {
          // 目录
          directory: '目录',
          // 菜单
          menu: '菜单'
          // type 对象结束
        },
        // 图标类型文案集合
        iconType: {
          // iconify 图标
          iconify: 'iconify图标',
          // 本地图标
          local: '本地图标'
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
    required: '不能为空',
    // 用户名校验文案集合
    userName: {
      // 必填提示
      required: '请输入用户名',
      // 格式错误提示
      invalid: '用户名格式不正确'
      // userName 对象结束
    },
    // 手机号校验文案集合
    phone: {
      // 必填提示
      required: '请输入手机号',
      // 格式错误提示
      invalid: '手机号格式不正确'
      // phone 对象结束
    },
    // 密码校验文案集合
    pwd: {
      // 必填提示
      required: '请输入密码',
      // 格式错误提示
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
      // pwd 对象结束
    },
    // 确认密码校验文案集合
    confirmPwd: {
      // 必填提示
      required: '请输入确认密码',
      // 不一致提示
      invalid: '两次输入密码不一致'
      // confirmPwd 对象结束
    },
    // 验证码校验文案集合
    code: {
      // 必填提示
      required: '请输入验证码',
      // 格式错误提示
      invalid: '验证码格式不正确'
      // code 对象结束
    },
    // 邮箱校验文案集合
    email: {
      // 必填提示
      required: '请输入邮箱',
      // 格式错误提示
      invalid: '邮箱格式不正确'
      // email 对象结束
    }
    // form 对象结束
  },
  // Tab 右键下拉菜单文案集合
  dropdown: {
    // 关闭当前
    closeCurrent: '关闭',
    // 关闭其它
    closeOther: '关闭其它',
    // 关闭左侧
    closeLeft: '关闭左侧',
    // 关闭右侧
    closeRight: '关闭右侧',
    // 关闭所有
    closeAll: '关闭所有',
    // 固定标签
    pin: '固定标签',
    // 取消固定
    unpin: '取消固定'
    // dropdown 对象结束
  },
  // 顶部功能图标提示文案集合
  icon: {
    // 主题配置
    themeConfig: '主题配置',
    // 主题模式
    themeSchema: '主题模式',
    // 切换语言
    lang: '切换语言',
    // 全屏
    fullscreen: '全屏',
    // 退出全屏
    fullscreenExit: '退出全屏',
    // 刷新页面
    reload: '刷新页面',
    // 折叠菜单
    collapse: '折叠菜单',
    // 展开菜单
    expand: '展开菜单',
    // 固定
    pin: '固定',
    // 取消固定
    unpin: '取消固定'
    // icon 对象结束
  },
  // 表格相关文案集合
  datatable: {
    // 总条数提示（带占位 total）
    itemCount: '共 {total} 条',
    // 固定列文案集合
    fixed: {
      // 左固定
      left: '左固定',
      // 右固定
      right: '右固定',
      // 取消固定
      unFixed: '取消固定'
      // fixed 对象结束
    }
    // datatable 对象结束
  }
};

export default local;
