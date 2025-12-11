import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null);
  const token = ref(localStorage.getItem('authToken') || null);
  const points = ref(0); // 用户积分
  const isAuthenticated = computed(() => !!token.value);

  // 模拟用户数据 - 只保留管理员账号，普通用户需要注册
  const defaultUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'mmm@qq.com',
      password: '20041209',
      points: 1000,
      isAdmin: true // 管理员标识
    }
  ];
  
  // 从localStorage获取数据，如果不存在则使用默认数据
  let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [...defaultUsers];
  
  // 移除默认的普通用户账号（ID为2）
  mockUsers = mockUsers.filter(user => user.id !== 2);
  
  // 确保管理员账号始终存在且信息正确
  const adminIndex = mockUsers.findIndex(u => u.id === 1);
  if (adminIndex === -1) {
    // 如果管理员账号不存在，添加到用户列表
    mockUsers.push(defaultUsers[0]);
  } else {
    // 如果管理员账号存在，更新信息确保正确
    mockUsers[adminIndex] = { ...mockUsers[adminIndex], ...defaultUsers[0] };
  }
  
  // 保存到localStorage
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));


  // 登录
  const login = async (email, password) => {
    console.log('Login function called with email:', email);
    console.log('Available users:', mockUsers.map(u => u.email));
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    console.log('User found:', !!foundUser);
    
    if (!foundUser) {
      console.log('User not found or password incorrect');
      throw new Error('邮箱或密码不正确');
    }

    console.log('Login successful, user details:', foundUser);
    
    // 保存用户信息和token
    user.value = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      points: foundUser.points,
      isAdmin: foundUser.isAdmin // 保存管理员标识
    };
    points.value = foundUser.points;
    
    // 生成并保存token
    const newToken = 'mock-token-' + Date.now();
    token.value = newToken;
    localStorage.setItem('authToken', newToken);
    console.log('Token set:', newToken);
    
    // 保存上次登录的邮箱，用于initAuth中加载用户信息
    localStorage.setItem('lastLoginEmail', email);
    console.log('Last login email saved:', email);
    
    console.log('isAuthenticated after login:', isAuthenticated.value);
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

  // 初始化认证状态
  const initAuth = async () => {
    console.log('InitAuth called');
    
    // 检查是否有token
    const savedToken = localStorage.getItem('authToken');
    const savedEmail = localStorage.getItem('lastLoginEmail');
    
    console.log('Token exists:', !!savedToken);
    console.log('User exists:', !!user.value);
    console.log('lastLoginEmail:', savedEmail);
    console.log('Available mock users:', mockUsers.map(u => u.email));
    
    // 更新token状态
    token.value = savedToken;
    
    // 如果有token但没有用户信息，尝试加载用户信息
    if (savedToken && savedEmail) {
      console.log('Attempting to load user by email:', savedEmail);
      const foundUser = mockUsers.find(u => u.email === savedEmail);
      console.log('Found user:', !!foundUser);
      
      if (foundUser) {
        user.value = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          points: foundUser.points,
          isAdmin: foundUser.isAdmin // 保存管理员标识
        };
        points.value = foundUser.points;
        console.log('User loaded successfully:', user.value);
      } else {
        console.log('User not found, clearing token');
        // 如果找不到用户，清除token
        localStorage.removeItem('authToken');
        localStorage.removeItem('lastLoginEmail');
        token.value = null;
        user.value = null;
      }
    } else if (savedToken && !savedEmail) {
      console.log('Token exists but no lastLoginEmail, clearing token');
      localStorage.removeItem('authToken');
      token.value = null;
    }
    
    console.log('InitAuth completed, isAuthenticated:', isAuthenticated.value);
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