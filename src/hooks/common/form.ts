// 表单相关组合式 Hook：提供通用校验规则（正则/必填/确认密码）与 NaiveUI Form 的校验封装
import { ref, toValue } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';
import { $t } from '@/locales';

// 生成常用表单校验规则集合（用户名/手机号/密码/验证码/邮箱等）
export function useFormRules() {
  // 定义基于正则表达式的校验规则集合
  const patternRules = {
    // 用户名规则：匹配用户名正则
    userName: {
      // 用户名校验正则
      pattern: REG_USER_NAME,
      // 用户名不合法时的提示文案
      message: $t('form.userName.invalid'),
      // 触发时机：值变化时触发校验
      trigger: 'change'
      // userName 规则对象结束
    },
    // 手机号规则：匹配手机号正则
    phone: {
      // 手机号校验正则
      pattern: REG_PHONE,
      // 手机号不合法时的提示文案
      message: $t('form.phone.invalid'),
      // 触发时机：值变化时触发校验
      trigger: 'change'
      // phone 规则对象结束
    },
    // 密码规则：匹配密码正则
    pwd: {
      // 密码校验正则
      pattern: REG_PWD,
      // 密码不合法时的提示文案
      message: $t('form.pwd.invalid'),
      // 触发时机：值变化时触发校验
      trigger: 'change'
      // pwd 规则对象结束
    },
    // 验证码规则：匹配 6 位数字验证码正则
    code: {
      // 验证码校验正则
      pattern: REG_CODE_SIX,
      // 验证码不合法时的提示文案
      message: $t('form.code.invalid'),
      // 触发时机：值变化时触发校验
      trigger: 'change'
      // code 规则对象结束
    },
    // 邮箱规则：匹配邮箱正则
    email: {
      // 邮箱校验正则
      pattern: REG_EMAIL,
      // 邮箱不合法时的提示文案
      message: $t('form.email.invalid'),
      // 触发时机：值变化时触发校验
      trigger: 'change'
      // email 规则对象结束
    }
    // patternRules 对象结束
  } satisfies Record<string, App.Global.FormRule>;

  // 定义每个字段的规则数组（必填规则 + 正则规则）
  const formRules = {
    // 用户名：必填 + 用户名格式
    userName: [createRequiredRule($t('form.userName.required')), patternRules.userName],
    // 手机号：必填 + 手机号格式
    phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
    // 密码：必填 + 密码格式
    pwd: [createRequiredRule($t('form.pwd.required')), patternRules.pwd],
    // 验证码：必填 + 验证码格式
    code: [createRequiredRule($t('form.code.required')), patternRules.code],
    // 邮箱：必填 + 邮箱格式
    email: [createRequiredRule($t('form.email.required')), patternRules.email]
    // formRules 对象结束
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  // 默认必填规则：用于没有单独文案时的通用必填提示
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  // 创建必填规则（生成 required=true 的校验规则）
  function createRequiredRule(message: string): App.Global.FormRule {
    // 返回符合 NaiveUI 规则结构的必填规则对象
    return {
      // 标记为必填
      required: true,
      // 校验失败提示文案
      message
      // 规则对象结束
    };
  }

  /** create a rule for confirming the password */
  // 创建确认密码规则（要求必填，且必须与传入 pwd 一致）
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    // 定义确认密码的规则数组（必填 + 自定义异步校验）
    const confirmPwdRule: App.Global.FormRule[] = [
      // 确认密码必填规则
      { required: true, message: $t('form.confirmPwd.required') },
      // 确认密码一致性校验规则
      {
        // 自定义异步校验：当输入不为空且不等于 pwd 时拒绝
        asyncValidator: (rule, value) => {
          // 输入非空且与原密码不一致时返回 reject
          if (value.trim() !== '' && value !== toValue(pwd)) {
            // 返回校验失败（使用规则内 message 作为错误信息）
            return Promise.reject(rule.message);
          }
          // 校验通过时返回 resolve
          return Promise.resolve();
          // asyncValidator 回调结束
        },
        // 校验失败提示文案
        message: $t('form.confirmPwd.invalid'),
        // 触发时机：输入时触发校验
        trigger: 'input'
        // 确认密码一致性校验规则对象结束
      }
      // confirmPwdRule 数组项定义结束
    ];
    // 返回确认密码规则数组
    return confirmPwdRule;
  }

  // 对外暴露规则集合与规则工厂方法
  return {
    // 正则规则集合
    patternRules,
    // 字段规则集合
    formRules,
    // 默认必填规则
    defaultRequiredRule,
    // 必填规则工厂方法
    createRequiredRule,
    // 确认密码规则工厂方法
    createConfirmPwdRule
    // 返回对象定义结束
  };
}

// NaiveUI Form 组合式 Hook：封装 FormInst 引用与校验相关方法
export function useNaiveForm() {
  // 表单实例引用（由组件通过 ref 绑定到 n-form）
  const formRef = ref<FormInst | null>(null);

  // 执行表单校验（调用 NaiveUI 的 validate）
  async function validate() {
    // 触发表单校验（formRef 为空时会安全跳过）
    await formRef.value?.validate();
  }

  // 恢复校验状态（清除校验错误与校验状态）
  async function restoreValidation() {
    // 恢复表单校验状态（formRef 为空时会安全跳过）
    formRef.value?.restoreValidation();
  }

  // 对外暴露表单实例引用与方法
  return {
    // NaiveUI 表单实例引用
    formRef,
    // 校验方法
    validate,
    // 恢复校验状态方法
    restoreValidation
    // 返回对象定义结束
  };
}
