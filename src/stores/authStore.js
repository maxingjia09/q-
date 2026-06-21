import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// API基础URL（可通过 VITE_API_BASE_URL 环境变量覆盖）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8122/api';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null);
  const token = ref(localStorage.getItem('authToken') || null);
  const points = ref(0); // 用户积分
  const joinedActivities = ref([]); // 用户参与的活动
  const joinedCourses = ref([]); // 用户报名的课程
  const avatar = ref(localStorage.getItem('userAvatar') || null); // 用户头像
  const isAuthenticated = computed(() => !!token.value);

  // 用户个人资料（用于自动填充，按用户隔离）
  const emptyPersonalInfo = () => ({
    name: '', phone: '', email: '', idCard: '', gender: '', age: '',
    emergencyContact: '', emergencyPhone: '', experience: '',
    healthConditions: '', fitnessLevel: '', height: '', weight: ''
  });

  const personalInfo = ref(emptyPersonalInfo());

  function getPersonalInfoKey() {
    return user.value ? `user_${user.value.id}_personalInfo` : null;
  }

  function loadPersonalInfo() {
    // 清理旧的通用资料（一次性迁移）
    if (localStorage.getItem('userPersonalInfo')) {
      localStorage.removeItem('userPersonalInfo');
    }
    const key = getPersonalInfoKey();
    if (!key) {
      personalInfo.value = emptyPersonalInfo();
      return;
    }
    try {
      const saved = localStorage.getItem(key);
      personalInfo.value = saved ? JSON.parse(saved) : emptyPersonalInfo();
    } catch {
      personalInfo.value = emptyPersonalInfo();
    }
  }

  function savePersonalInfo() {
    const key = getPersonalInfoKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(personalInfo.value));
    }
  }

  // 从localStorage获取用户参与的活动
  const loadJoinedActivities = () => {
    if (user.value) {
      const savedActivities = localStorage.getItem(`user_${user.value.id}_activities`);
      joinedActivities.value = savedActivities ? JSON.parse(savedActivities) : [];
    }
  };

  // 保存用户参与的活动到localStorage
  const saveJoinedActivities = () => {
    if (user.value) {
      localStorage.setItem(`user_${user.value.id}_activities`, JSON.stringify(joinedActivities.value));
    }
  };

  // 从localStorage获取用户报名的课程
  const loadJoinedCourses = () => {
    if (user.value) {
      const savedCourses = localStorage.getItem(`user_${user.value.id}_courses`);
      joinedCourses.value = savedCourses ? JSON.parse(savedCourses) : [];
    }
  };

  // 保存用户报名的课程到localStorage
  const saveJoinedCourses = () => {
    if (user.value) {
      localStorage.setItem(`user_${user.value.id}_courses`, JSON.stringify(joinedCourses.value));
    }
  };

  // 登录 - 调用后端API
  const login = async (email, password) => {
    console.log('Login function called with email:', email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const result = await response.json();
      console.log('Login API response:', result);

      if (result.code !== 200) {
        throw new Error(result.message || '邮箱或密码不正确');
      }

      const userData = result.data;
      console.log('Login successful, user details:', userData);
      
      // 保存用户信息和token
      user.value = {
        id: userData.id,
        username: userData.username || email.split('@')[0],
        email: userData.email,
        userRole: userData.userRole,
        isAdmin: userData.userRole === 'super_admin' || userData.userRole === 'club_admin',
        isSuperAdmin: userData.userRole === 'super_admin',
        isClubAdmin: userData.userRole === 'club_admin',
        clubId: userData.clubId || null
      };
      points.value = userData.points || 0;

      // 生成并保存token和userId
      const newToken = 'token-' + Date.now();
      token.value = newToken;
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('userId', userData.id);
      console.log('Token set:', newToken);

      // 保存上次登录的邮箱
      localStorage.setItem('lastLoginEmail', email);
      console.log('Last login email saved:', email);
      
      console.log('isAuthenticated after login:', isAuthenticated.value);
      loadPersonalInfo(); // 按当前用户加载个人资料
      return user.value;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  };

  // 注册 - 调用后端API
  const register = async (userData) => {
    console.log('Register function called with:', userData);
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      const result = await response.json();
      console.log('Register API response:', result);

      if (result.code !== 200) {
        throw new Error(result.message || '注册失败');
      }

      return true;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  };

  // 登出
  const logout = () => {
    user.value = null;
    token.value = null;
    points.value = 0;
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLoginEmail');
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

    return points.value;
  };

  // 扣除积分
  const deductPoints = (amount) => {
    if (!isAuthenticated.value) {
      throw new Error('请先登录');
    }

    if (amount <= 0 || isNaN(amount)) {
      throw new Error('请输入有效的积分数量');
    }

    if (amount > points.value) {
      throw new Error('您的积分不足');
    }

    // 更新本地积分
    points.value -= amount;

    return points.value;
  };

  // 报名活动
  const joinActivity = (activity, formData) => {
    if (!isAuthenticated.value || !user.value) {
      throw new Error('请先登录');
    }

    // 生成活动ID（如果没有）
    const activityId = activity.id || Date.now();
    
    // 创建参与的活动记录
    const joinedActivity = {
      id: activityId,
      name: activity.name,
      location: activity.location,
      image: activity.image,
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: '进行中',
      club: formData.club || '',
      formData: formData
    };

    // 添加到用户参与的活动列表
    joinedActivities.value.push(joinedActivity);
    
    // 保存到localStorage
    saveJoinedActivities();
    
    return joinedActivity;
  };

  // 报名课程
  const joinCourse = (course, formData) => {
    if (!isAuthenticated.value || !user.value) {
      throw new Error('请先登录');
    }

    // 生成课程ID（如果没有）
    const courseId = course.id || Date.now();
    
    // 创建报名的课程记录
    const joinedCourse = {
      id: courseId,
      name: course.name,
      location: course.location,
      image: course.image,
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: '进行中',
      formData: formData
    };

    // 添加到用户报名的课程列表
    joinedCourses.value.push(joinedCourse);
    
    // 保存到localStorage
    saveJoinedCourses();
    
    return joinedCourse;
  };

  // 取消活动报名
  const cancelActivity = (activityId) => {
    const index = joinedActivities.value.findIndex(a => a.id === activityId);
    if (index !== -1) {
      joinedActivities.value.splice(index, 1);
      saveJoinedActivities();
      return true;
    }
    return false;
  };

  // 初始化认证状态
  const initAuth = async () => {
    console.log('initAuth called, token:', token.value);
    
    const savedToken = localStorage.getItem('authToken');
    const lastEmail = localStorage.getItem('lastLoginEmail');
    
    if (savedToken && lastEmail) {
      token.value = savedToken;
      
      // 尝试从后端获取用户信息
      try {
        const response = await fetch(`${API_BASE_URL}/user/detail/account/${lastEmail}`);
        const userData = await response.json();
        
        if (userData) {
          user.value = {
            id: userData.id,
            username: userData.userName || lastEmail.split('@')[0],
            email: userData.userAccount,
            userRole: userData.userRole,
            isAdmin: userData.userRole === 'super_admin' || userData.userRole === 'club_admin',
            isSuperAdmin: userData.userRole === 'super_admin',
            isClubAdmin: userData.userRole === 'club_admin',
            clubId: userData.clubId || null
          };
          localStorage.setItem('userId', userData.id);
          loadPersonalInfo(); // 按当前用户加载个人资料
          console.log('User info loaded from API:', user.value);
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
        // 如果API调用失败，清除登录状态
        logout();
      }
      
      loadJoinedActivities();
      loadJoinedCourses();
    } else {
      console.log('No saved token or email found');
    }
    
    console.log('initAuth completed, isAuthenticated:', isAuthenticated.value);
  };

  // 更新头像
  const updateAvatar = (newAvatar) => {
    avatar.value = newAvatar;
    localStorage.setItem('userAvatar', newAvatar);
  };

  // 更新用户名
  const updateUsername = (newUsername) => {
    if (user.value) {
      user.value.username = newUsername;
    }
  };

  // 更新用户完整资料
  const updateUserProfile = (profileData) => {
    if (user.value) {
      if (profileData.username) user.value.username = profileData.username;
      if (profileData.email) user.value.email = profileData.email;
      if (profileData.phone) user.value.phone = profileData.phone;
    }
  };

  // 更新个人资料（用于自动填充）
  const updatePersonalInfo = (info) => {
    personalInfo.value = { ...personalInfo.value, ...info };
    savePersonalInfo();
  };

  return {
    user,
    token,
    points,
    joinedActivities,
    joinedCourses,
    avatar,
    personalInfo,
    isAuthenticated,
    login,
    register,
    logout,
    rechargePoints,
    deductPoints,
    joinActivity,
    joinCourse,
    cancelActivity,
    initAuth,
    updateAvatar,
    updateUsername,
    updateUserProfile,
    updatePersonalInfo,
    loadPersonalInfo,
    savePersonalInfo,
    loadJoinedActivities,
    saveJoinedActivities,
    loadJoinedCourses,
    saveJoinedCourses
  };
});
