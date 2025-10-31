<template>
  <div class="direct-test">
    <h3>直接图片测试</h3>
    
    <div class="test-case">
      <h4>测试 1: Favicon 图标</h4>
      <img 
        id="favicon-test" 
        src="/favicon.ico" 
        alt="Favicon测试" 
        style="width: 100px; height: 100px; border: 2px solid green;"
        @load="onFaviconLoad"
        @error="onFaviconError"
      />
      <p :class="faviconStatusClass">{{ faviconStatus }}</p>
    </div>
    
    <div class="test-case">
      <h4>测试 2: 本地图片（假设存在问题）</h4>
      <img 
        id="mount-test" 
        src="/mount-everest.jpg" 
        alt="山景测试" 
        style="width: 200px; height: 150px; border: 2px solid red;"
        @load="onMountImageLoad"
        @error="onMountImageError"
      />
      <p :class="mountImageStatusClass">{{ mountImageStatus }}</p>
    </div>
    
    <div class="debug-info">
      <h4>调试信息</h4>
      <p>当前时间: {{ currentTime }}</p>
      <p>图片请求状态记录在控制台</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 状态变量
const faviconStatus = ref('等待加载...')
const faviconStatusClass = ref('waiting')
const mountImageStatus = ref('等待加载...')
const mountImageStatusClass = ref('waiting')
const currentTime = ref(new Date().toLocaleString())

// 处理函数
const onFaviconLoad = () => {
  faviconStatus.value = 'Favicon 加载成功！'
  faviconStatusClass.value = 'success'
  console.log('[图片调试] Favicon 加载成功:', new Date().toLocaleTimeString())
  console.log('图片元素信息:', document.getElementById('favicon-test'))
}

const onFaviconError = (event) => {
  faviconStatus.value = 'Favicon 加载失败！'
  faviconStatusClass.value = 'error'
  console.error('[图片调试] Favicon 加载失败:', new Date().toLocaleTimeString())
  console.error('错误事件:', event)
}

const onMountImageLoad = () => {
  mountImageStatus.value = '山景图片加载成功！'
  mountImageStatusClass.value = 'success'
  console.log('[图片调试] 山景图片加载成功:', new Date().toLocaleTimeString())
}

const onMountImageError = (event) => {
  mountImageStatus.value = '山景图片加载失败！'
  mountImageStatusClass.value = 'error'
  console.error('[图片调试] 山景图片加载失败:', new Date().toLocaleTimeString())
  console.error('错误事件:', event)
}

// 组件挂载时执行额外检查
onMounted(() => {
  console.log('[图片调试] 组件挂载完成，开始检查图片加载')
  
  // 手动检查图片元素
  setTimeout(() => {
    const faviconImg = document.getElementById('favicon-test')
    const mountImg = document.getElementById('mount-test')
    
    console.log('Favicon 图片元素存在:', !!faviconImg)
    console.log('山景图片元素存在:', !!mountImg)
    
    if (faviconImg) {
      console.log('Favicon src:', faviconImg.src)
      console.log('Favicon 自然尺寸:', faviconImg.naturalWidth, 'x', faviconImg.naturalHeight)
    }
    
    if (mountImg) {
      console.log('山景图片 src:', mountImg.src)
      console.log('山景图片 自然尺寸:', mountImg.naturalWidth, 'x', mountImg.naturalHeight)
    }
  }, 1000)
})
</script>

<style scoped>
.direct-test {
  border: 3px solid purple;
  padding: 20px;
  margin: 20px 0;
}

.test-case {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.debug-info {
  background-color: #e8f4f8;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9em;
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

.waiting {
  color: orange;
}
</style>