import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null);
  const token = ref(localStorage.getItem('authToken') || null);
  const points = ref(0); // 用户积分
  const isAuthenticated = computed(() => !!token.value);

  // 模拟用户数据
  const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      points: 1000
    }
  ];

  // 登录
  const login = async (email, password) => {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('邮箱或密码不正确');
    }

    // 保存用户信息和token
    user.value = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      points: foundUser.points
    };
    points.value = foundUser.points;
    token.value = 'mock-token-' + Date.now();
    localStorage.setItem('authToken', token.value);

    return user.value;
  };

  // 注册
  const register = async (userData) => {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查邮箱是否已注册
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('该邮箱已被注册');
    }

    // 创建新用户
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      points: 0 // 初始积分为0
    };

    mockUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

    return true;
  };

  // 登出
  const logout = () => {
    user.value = null;
    token.value = null;
    points.value = 0;
    localStorage.removeItem('authToken');
  };

  // 充值积分
  const rechargePoints = async (amount) => {
    if (!isAuthenticated.value) {
      throw new Error('请先登录');
    }

    if (amount <= 0 || isNaN(amount)) {
      throw new Error('请输入有效的充值金额');
    }

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800));

    // 更新本地积分
    points.value += amount;

    // 更新mock用户数据
    const userIndex = mockUsers.findIndex(u => u.email === user.value.email);
    if (userIndex !== -1) {
      mockUsers[userIndex].points = points.value;
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }

    return points.value;
  };

  // 初始化：如果有token但没有用户信息，尝试加载用户信息
  const initAuth = async () => {
    if (token.value && !user.value) {
      // 模拟从服务器加载用户信息
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundUser = mockUsers.find(u => u.email === 'admin@example.com'); // 简化示例
      if (foundUser) {
        user.value = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          points: foundUser.points
        };
        points.value = foundUser.points;
      }
    }
  };

  return {
    user,
    token,
    points,
    isAuthenticated,
    login,
    register,
    logout,
    rechargePoints,
    initAuth
  };
});