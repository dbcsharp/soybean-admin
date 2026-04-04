import CryptoJS from 'crypto-js';

// AES 加解密工具类（中文说明：将对象序列化为 JSON 后进行 AES 加密/解密）
export class Crypto<T extends object> {
  // 密钥
  secret: string;

  // 创建加密器（中文说明：secret 用于 AES 密钥）
  constructor(secret: string) {
    this.secret = secret;
  }

  // 加密对象并返回密文字符串
  encrypt(data: T): string {
    // 将对象序列化为 JSON 字符串
    const dataString = JSON.stringify(data);
    // 使用 AES 加密
    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret);
    // 返回密文
    return encrypted.toString();
  }

  // 解密密文并返回对象（失败返回 null）
  decrypt(encrypted: string) {
    // 使用 AES 解密
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secret);
    // 将解密结果转为 UTF8 字符串
    const dataString = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      // 解析 JSON 并返回对象
      return JSON.parse(dataString) as T;
    } catch {
      // 解析失败时返回 null，避免抛错影响主流程
      return null;
    }
  }
}
