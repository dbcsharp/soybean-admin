// 正则常量：统一维护常用输入校验规则（用户名/手机号/密码/邮箱/验证码/URL 等）
export const REG_USER_NAME = /^[\u4E00-\u9FA5a-zA-Z0-9_-]{4,16}$/;

/** Phone reg */
// 手机号正则（匹配国内手机号段）
export const REG_PHONE =
  /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/;

/**
 * Password reg
 *
 * 6-18 characters, including letters, numbers, and underscores
 */
// 密码正则（6-18 位，包含字母/数字/下划线）
export const REG_PWD = /^\w{6,18}$/;

/** Email reg */
// 邮箱正则（常见邮箱格式校验）
export const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** Six digit code reg */
// 6 位数字验证码正则
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
// 4 位数字验证码正则
export const REG_CODE_FOUR = /^\d{4}$/;

/** Url reg */
// URL 正则（匹配 http/https 或常见 URL 结构）
export const REG_URL =
  /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
