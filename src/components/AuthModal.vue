<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">{{ currentView === 'login' ? '用户登录' : '用户注册' }}</h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <LoginView v-if="currentView === 'login'" @switch-to-register="switchToRegister" @login-success="handleLoginSuccess" />
        <RegisterView v-if="currentView === 'register'" @switch-to-login="switchToLogin" @register-success="handleRegisterSuccess" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  initialView: {
    type: String,
    default: 'login'
  }
});

const emit = defineEmits(['close', 'login-success']);

const currentView = ref(props.initialView);

const closeModal = () => {
  emit('close');
};

const switchToRegister = () => {
  currentView.value = 'register';
};

const switchToLogin = () => {
  currentView.value = 'login';
};

const handleLoginSuccess = () => {
  emit('login-success');
  closeModal();
};

const handleRegisterSuccess = () => {
  currentView.value = 'login';
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f0f0f0;
  color: #2c3e50;
}

.modal-body {
  padding: 0;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .modal-overlay {
    padding: 0;
  }
}
</style>