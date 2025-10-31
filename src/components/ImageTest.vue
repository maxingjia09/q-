<template>
  <div class="image-test">
    <h2>图片测试组件</h2>
    <img src="/mount-everest.jpg" alt="珠穆朗玛峰" class="test-image">
    <p>图片路径: /mount-everest.jpg</p>
  </div>
</template>

<script>
export default {
  name: 'ImageTest'
}
</script>

<style scoped>
.image-test {
  margin: 20px;
  text-align: center;
}

.test-image {
  width: 100%;
  max-width: 800px;
  height: auto;
  border: 3px solid green;
}
</style>