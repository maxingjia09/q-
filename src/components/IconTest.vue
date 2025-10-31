<template>
  <div class="icon-test">
    <h3>图标测试组件</h3>
    <p>使用favicon.ico测试图片加载</p>
    <img 
      src="/favicon.ico" 
      alt="测试图标" 
      class="test-icon"
      @load="onImageLoad"
      @error="onImageError"
    />
    <div v-if="loadStatus" :class="statusClass">
      {{ loadStatus }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconTest',
  data() {
    return {
      loadStatus: '',
      statusClass: ''
    }
  },
  methods: {
    onImageLoad() {
      this.loadStatus = '图标加载成功！';
      this.statusClass = 'success';
      console.log('图标加载成功');
    },
    onImageError() {
      this.loadStatus = '图标加载失败！';
      this.statusClass = 'error';
      console.error('图标加载失败');
    }
  }
}
</script>

<style scoped>
.icon-test {
  border: 2px solid green;
  padding: 20px;
  margin: 20px;
}

.test-icon {
  border: 2px solid blue;
  width: 50px;
  height: 50px;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>