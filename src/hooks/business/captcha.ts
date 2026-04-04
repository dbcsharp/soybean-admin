// 验证码相关组合式 Hook：提供获取验证码按钮文案、手机号校验与模拟获取验证码流程
import { computed } from 'vue';
import { useCountDown, useLoading } from '@sa/hooks';
import { REG_PHONE } from '@/constants/reg';
import { $t } from '@/locales';

// 获取验证码能力（提供按钮 label 计算、倒计时控制与 getCaptcha 方法）
export function useCaptcha() {
  // Loading 状态与控制方法（用于获取验证码时的加载态）
  const { loading, startLoading, endLoading } = useLoading();
  // 倒计时能力（用于控制“重新获取”文案与禁用状态）
  const { count, start, stop, isCounting } = useCountDown(10);

  // 获取按钮文案（根据 loading/isCounting 计算展示文本）
  const label = computed(() => {
    // 默认文案：获取验证码
    let text = $t('page.login.codeLogin.getCode');

    // 倒计时文案：重新获取（带剩余秒数）
    const countingLabel = $t('page.login.codeLogin.reGetCode', { time: count.value });

    // 加载中时不显示文案（由按钮 loading 展示占位）
    if (loading.value) {
      // 清空文案
      text = '';
      // loading 判断分支结束
    }

    // 倒计时中时显示倒计时文案
    if (isCounting.value) {
      // 设置倒计时文案
      text = countingLabel;
      // isCounting 判断分支结束
    }

    // 返回最终文案
    return text;
    // label 计算回调结束
  });

  // 校验手机号是否合法（非空且满足手机号正则）
  function isPhoneValid(phone: string) {
    // 去除空白后为空时提示必填
    if (phone.trim() === '') {
      // 提示手机号必填
      window.$message?.error?.($t('form.phone.required'));

      // 返回校验失败
      return false;
      // 空字符串判断分支结束
    }

    // 不匹配手机号正则时提示格式错误
    if (!REG_PHONE.test(phone)) {
      // 提示手机号格式不正确
      window.$message?.error?.($t('form.phone.invalid'));

      // 返回校验失败
      return false;
      // 正则判断分支结束
    }

    // 校验通过
    return true;
  }

  // 获取验证码（先校验手机号，再模拟请求并启动倒计时）
  async function getCaptcha(phone: string) {
    // 执行手机号校验
    const valid = isPhoneValid(phone);

    // 校验失败或正在加载中时直接返回
    if (!valid || loading.value) {
      // 直接返回，不执行请求
      return;
      // valid/loading 判断分支结束
    }

    // 开始加载
    startLoading();

    // request
    // 模拟请求耗时（这里用 setTimeout 代替真实接口调用）
    await new Promise(resolve => {
      // 延迟 500ms 结束模拟请求
      setTimeout(resolve, 500);
      // Promise executor 结束
    });

    // 提示发送验证码成功
    window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess'));

    // 启动倒计时
    start();

    // 结束加载
    endLoading();
  }

  // 对外暴露按钮文案与倒计时/加载/获取验证码方法
  return {
    // 按钮文案计算值
    label,
    // 启动倒计时方法
    start,
    // 停止倒计时方法
    stop,
    // 是否正在倒计时
    isCounting,
    // Loading 状态
    loading,
    // 获取验证码方法
    getCaptcha
    // 返回对象定义结束
  };
}
