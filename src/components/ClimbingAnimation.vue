<template>
  <div class="climbing-animation-overlay" v-if="isVisible">
    <div class="climbing-container">
      <!-- 山峰背景 -->
      <div class="mountain"></div>
      <div class="mountain mountain-2"></div>
      <div class="mountain mountain-3"></div>
      
      <!-- 登山者 -->
      <div class="climber" :style="{ top: climberPosition + 'px' }"></div>
      
      <!-- 云朵装饰 -->
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      
      <!-- 登录成功文字 -->
      <div class="success-text">登录成功！正在攀登至个人中心...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['animation-end']);

const climberPosition = ref(400); // 初始位置

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    startAnimation();
  }
});

const startAnimation = () => {
  climberPosition.value = 400; // 重置位置
  
  // 使用requestAnimationFrame创建平滑动画
  const duration = 1000; // 动画持续时间（毫秒）
  const startTime = performance.now();
  const endPosition = 50; // 结束位置
  const startPosition = 400;
  const distance = endPosition - startPosition;
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用缓动函数使动画更自然
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    climberPosition.value = startPosition + distance * easeOutCubic;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // 动画结束，通知父组件
      emit('animation-end');
    }
  };
  
  requestAnimationFrame(animate);
};
</script>

<style scoped>
.climbing-animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #87CEEB, #E0F6FF);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.climbing-container {
  position: relative;
  width: 600px;
  height: 500px;
  overflow: hidden;
}

/* 山峰样式 */
.mountain {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-bottom: 300px solid #2C3E50;
  left: 50px;
}

.mountain-2 {
  border-left: 200px solid transparent;
  border-right: 200px solid transparent;
  border-bottom: 350px solid #34495E;
  left: 200px;
  z-index: -1;
}

.mountain-3 {
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 250px solid #7F8C8D;
  left: 400px;
  z-index: -2;
}

/* 登山者样式 */
.climber {
  position: absolute;
  left: 120px;
  width: 40px;
  height: 60px;
  background: #E74C3C;
  border-radius: 20px 20px 0 0;
  transition: top 0.1s linear;
  z-index: 10;
}

.climber::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  background: #F39C12;
  border-radius: 50%;
}

.climber::after {
  content: '';
  position: absolute;
  top: 40px;
  left: -5px;
  width: 50px;
  height: 10px;
  background: #2C3E50;
  border-radius: 5px;
}

/* 云朵样式 */
.cloud {
  position: absolute;
  width: 100px;
  height: 40px;
  background: white;
  border-radius: 20px;
  opacity: 0.8;
}

.cloud::before, .cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 10px;
}

.cloud::after {
  width: 50px;
  height: 50px;
  top: -20px;
  right: 10px;
}

.cloud-1 {
  top: 100px;
  left: 50px;
  animation: float 6s ease-in-out infinite;
}

.cloud-2 {
  top: 150px;
  right: 80px;
  animation: float 8s ease-in-out infinite reverse;
}

.cloud-3 {
  top: 80px;
  left: 300px;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(20px); }
}

/* 登录成功文字 */
.success-text {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #2C3E50;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}
</style>