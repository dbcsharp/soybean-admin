import { computed, onScopeDispose, ref } from 'vue';
import { useRafFn } from '@vueuse/core';

/**
 * 倒计时 Hook（中文说明：使用 requestAnimationFrame 实现更平滑/更准确的倒计时）
 *
 * @param initialSeconds 初始倒计时总秒数
 */
export default function useCountDown(initialSeconds: number) {
  // 剩余秒数（内部用小数记录，更平滑）
  const remainingSeconds = ref(0);

  // 对外暴露的整数秒（向上取整）
  const count = computed(() => Math.ceil(remainingSeconds.value));

  // 是否正在倒计时
  const isCounting = computed(() => remainingSeconds.value > 0);

  // rAF 循环：delta 为上一帧到当前帧的毫秒差
  const { pause, resume } = useRafFn(
    ({ delta }) => {
      // 倒计时已结束：归零并暂停
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        pause();
        return;
      }

      // 计算本帧经过的秒数
      const secondsPassed = delta / 1000;
      remainingSeconds.value -= secondsPassed;

      // 本帧扣减后结束：归零并暂停
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        pause();
      }
    },
    // 默认不自动开始
    { immediate: false }
  );

  /**
   * 开始倒计时
   *
   * @param updatedSeconds 可选：使用新的时长开始，默认 initialSeconds
   */
  function start(updatedSeconds: number = initialSeconds) {
    remainingSeconds.value = updatedSeconds;
    resume();
  }

  /** 停止倒计时并重置剩余时间为 0 */
  function stop() {
    remainingSeconds.value = 0;
    pause();
  }

  // 作用域销毁时停止 rAF 循环，避免泄露
  onScopeDispose(() => {
    pause();
  });

  // 对外暴露：count/isCounting/start/stop
  return {
    count,
    isCounting,
    start,
    stop
  };
}
