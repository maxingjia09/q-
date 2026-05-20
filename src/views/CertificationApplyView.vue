<template>
  <div class="certification-apply-page">
    <div class="page-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <img src="../assets/logo.svg" alt="Logo">
          </div>
          <h3 class="brand-name">探索户外运动中心</h3>
        </div>

        <nav class="sidebar-nav">
          <div 
            v-for="tab in [
              { id: 'personal', label: '个人信息', icon: '👤' },
              { id: 'course', label: '课程证书', icon: '📚' },
              { id: 'training', label: '培训证书', icon: '🎓' },
              { id: 'review', label: '审核状态', icon: '📋' }
            ]"
            :key="tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="icon">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </div>
          <div class="nav-item back" @click="goBack">
            <span class="icon">⬅️</span>
            <span>返回首页</span>
          </div>
        </nav>
      </aside>

      <main class="main-content">
        <div class="content-wrapper">
          <div class="apply-header">
            <h1 class="page-title">认证申请</h1>
            <p class="page-description">请填写您的个人信息并上传相关证书，我们将尽快审核您的申请</p>
          </div>

          <div class="form-container">
            <div v-if="activeTab === 'personal'" class="tab-section">
              <h2 class="section-title">个人信息</h2>
              <form @submit.prevent="handleSubmit" class="apply-form">
                <div class="form-group">
                  <label class="form-label">姓名 <span class="required">*</span></label>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    class="form-input" 
                    placeholder="请输入您的真实姓名"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">身份证号 <span class="required">*</span></label>
                  <input 
                    v-model="formData.idCard" 
                    type="text" 
                    class="form-input" 
                    placeholder="请输入您的身份证号码"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">联系电话 <span class="required">*</span></label>
                  <input 
                    v-model="formData.phone" 
                    type="tel" 
                    class="form-input" 
                    placeholder="请输入您的联系电话"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">电子邮箱 <span class="required">*</span></label>
                  <input 
                    v-model="formData.email" 
                    type="email" 
                    class="form-input" 
                    placeholder="请输入您的电子邮箱"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">申请认证类型 <span class="required">*</span></label>
                  <select v-model="formData.certificationType" class="form-select" required>
                    <option value="">请选择认证类型</option>
                    <option value="outdoor-coach">户外教练认证</option>
                    <option value="rock-climbing">攀岩教练认证</option>
                    <option value="mountain-guide">登山向导认证</option>
                    <option value="survival-expert">野外生存专家认证</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">从业经验</label>
                  <textarea 
                    v-model="formData.experience" 
                    class="form-textarea" 
                    placeholder="请简要描述您的户外从业经验"
                    rows="4"
                  ></textarea>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn-next" @click="activeTab = 'course'">下一步</button>
                </div>
              </form>
            </div>

            <div v-if="activeTab === 'course'" class="tab-section">
              <h2 class="section-title">课程证书</h2>
              <p class="section-description">请上传您完成的相关课程证书，证明您已掌握相应的户外技能</p>

              <div class="upload-section">
                <div class="upload-item">
                  <label class="upload-label">课程证书图片 <span class="required">*</span></label>
                  <div class="upload-area" @click="triggerFileUpload('courseCertificate')">
                    <div v-if="!formData.courseCertificate" class="upload-placeholder">
                      <span class="upload-icon">📤</span>
                      <p class="upload-text">点击上传课程证书图片</p>
                      <p class="upload-hint">支持 JPG、PNG 格式，文件大小不超过 5MB</p>
                    </div>
                    <div v-else class="upload-preview">
                      <img :src="formData.courseCertificate" alt="课程证书预览" class="preview-image">
                      <button type="button" class="btn-remove" @click.stop="removeFile('courseCertificate')">删除</button>
                    </div>
                  </div>
                  <input 
                    ref="courseCertificateInput"
                    type="file" 
                    accept="image/*"
                    @change="handleFileUpload($event, 'courseCertificate')"
                    class="hidden-input"
                  >
                </div>

                <div class="upload-item">
                  <label class="upload-label">课程名称 <span class="required">*</span></label>
                  <input 
                    v-model="formData.courseName" 
                    type="text" 
                    class="form-input" 
                    placeholder="请输入完成的课程名称"
                    required
                  >
                </div>

                <div class="upload-item">
                  <label class="upload-label">培训机构</label>
                  <input 
                    v-model="formData.trainingInstitution" 
                    type="text" 
                    class="form-input" 
                    placeholder="请输入培训机构名称"
                  >
                </div>

                <div class="upload-item">
                  <label class="upload-label">完成日期 <span class="required">*</span></label>
                  <input 
                    v-model="formData.completionDate" 
                    type="date" 
                    class="form-input" 
                    required
                  >
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-prev" @click="activeTab = 'personal'">上一步</button>
                <button type="button" class="btn-next" @click="activeTab = 'training'">下一步</button>
              </div>
            </div>

            <div v-if="activeTab === 'training'" class="tab-section">
              <h2 class="section-title">培训证书</h2>
              <p class="section-description">请上传您的培训证书，用于申请相关的资格证书</p>

              <div class="upload-section">
                <div class="upload-item">
                  <label class="upload-label">培训证书图片 <span class="required">*</span></label>
                  <div class="upload-area" @click="triggerFileUpload('trainingCertificate')">
                    <div v-if="!formData.trainingCertificate" class="upload-placeholder">
                      <span class="upload-icon">📤</span>
                      <p class="upload-text">点击上传培训证书图片</p>
                      <p class="upload-hint">支持 JPG、PNG 格式，文件大小不超过 5MB</p>
                    </div>
                    <div v-else class="upload-preview">
                      <img :src="formData.trainingCertificate" alt="培训证书预览" class="preview-image">
                      <button type="button" class="btn-remove" @click.stop="removeFile('trainingCertificate')">删除</button>
                    </div>
                  </div>
                  <input 
                    ref="trainingCertificateInput"
                    type="file" 
                    accept="image/*"
                    @change="handleFileUpload($event, 'trainingCertificate')"
                    class="hidden-input"
                  >
                </div>

                <div class="upload-item">
                  <label class="upload-label">证书名称 <span class="required">*</span></label>
                  <input 
                    v-model="formData.certificateName" 
                    type="text" 
                    class="form-input" 
                    placeholder="请输入培训证书名称"
                    required
                  >
                </div>

                <div class="upload-item">
                  <label class="upload-label">颁发机构</label>
                  <input 
                    v-model="formData.issuingOrganization" 
                    type="text" 
                    class="form-input" 
                    placeholder="请输入颁发机构名称"
                  >
                </div>

                <div class="upload-item">
                  <label class="upload-label">获得日期 <span class="required">*</span></label>
                  <input 
                    v-model="formData.issuanceDate" 
                    type="date" 
                    class="form-input" 
                    required
                  >
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-prev" @click="activeTab = 'course'">上一步</button>
                <button type="button" class="btn-next" @click="activeTab = 'review'">下一步</button>
              </div>
            </div>

            <div v-if="activeTab === 'review'" class="tab-section">
              <h2 class="section-title">审核状态</h2>
              <p class="section-description">请确认您的申请信息无误后提交</p>

              <div class="review-section">
                <div class="review-group">
                  <h3 class="review-group-title">个人信息</h3>
                  <div class="review-item">
                    <span class="review-label">姓名：</span>
                    <span class="review-value">{{ formData.name }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">身份证号：</span>
                    <span class="review-value">{{ formData.idCard }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">联系电话：</span>
                    <span class="review-value">{{ formData.phone }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">电子邮箱：</span>
                    <span class="review-value">{{ formData.email }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">认证类型：</span>
                    <span class="review-value">{{ getCertificationTypeName(formData.certificationType) }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">从业经验：</span>
                    <span class="review-value">{{ formData.experience || '未填写' }}</span>
                  </div>
                </div>

                <div class="review-group">
                  <h3 class="review-group-title">课程证书</h3>
                  <div class="review-item">
                    <span class="review-label">课程名称：</span>
                    <span class="review-value">{{ formData.courseName }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">培训机构：</span>
                    <span class="review-value">{{ formData.trainingInstitution || '未填写' }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">完成日期：</span>
                    <span class="review-value">{{ formData.completionDate }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">证书图片：</span>
                    <span class="review-value">{{ formData.courseCertificate ? '已上传' : '未上传' }}</span>
                  </div>
                </div>

                <div class="review-group">
                  <h3 class="review-group-title">培训证书</h3>
                  <div class="review-item">
                    <span class="review-label">证书名称：</span>
                    <span class="review-value">{{ formData.certificateName }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">颁发机构：</span>
                    <span class="review-value">{{ formData.issuingOrganization || '未填写' }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">获得日期：</span>
                    <span class="review-value">{{ formData.issuanceDate }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">证书图片：</span>
                    <span class="review-value">{{ formData.trainingCertificate ? '已上传' : '未上传' }}</span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-prev" @click="activeTab = 'training'">上一步</button>
                <button type="submit" class="btn-submit" @click="handleSubmit">提交申请</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref('personal');

const formData = ref({
  name: '',
  idCard: '',
  phone: '',
  email: '',
  certificationType: '',
  experience: '',
  courseName: '',
  trainingInstitution: '',
  completionDate: '',
  courseCertificate: null,
  certificateName: '',
  issuingOrganization: '',
  issuanceDate: '',
  trainingCertificate: null
});

const courseCertificateInput = ref(null);
const trainingCertificateInput = ref(null);

const triggerFileUpload = (type) => {
  if (type === 'courseCertificate' && courseCertificateInput.value) {
    courseCertificateInput.value.click();
  } else if (type === 'trainingCertificate' && trainingCertificateInput.value) {
    trainingCertificateInput.value.click();
  }
};

const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value[type] = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeFile = (type) => {
  formData.value[type] = null;
  if (type === 'courseCertificate' && courseCertificateInput.value) {
    courseCertificateInput.value.value = '';
  } else if (type === 'trainingCertificate' && trainingCertificateInput.value) {
    trainingCertificateInput.value.value = '';
  }
};

const getCertificationTypeName = (type) => {
  const types = {
    'outdoor-coach': '户外教练认证',
    'rock-climbing': '攀岩教练认证',
    'mountain-guide': '登山向导认证',
    'survival-expert': '野外生存专家认证'
  };
  return types[type] || type;
};

const handleSubmit = () => {
  alert('认证申请已提交！我们将尽快审核您的申请。');
  router.push('/');
};

const goBack = () => {
  router.push('/');
};

const refreshUserData = async () => {
  try {
    await authStore.initAuth();
  } catch (error) {
    console.error('刷新用户数据失败:', error);
  }
};

let refreshInterval = null;

onMounted(() => {
  // 自动填充个人资料
  if (authStore.isAuthenticated) {
    const info = authStore.personalInfo;
    formData.value.name = info.name || '';
    formData.value.idCard = info.idCard || '';
    formData.value.phone = info.phone || '';
    formData.value.email = info.email || '';
    formData.value.experience = info.experience || '';
  }

  refreshInterval = setInterval(async () => {
    await refreshUserData();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.certification-apply-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  padding-top: 80px;
}

.page-container {
  display: flex;
  min-height: calc(100vh - 80px);
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.brand-name {
  margin: 0;
  font-size: 16px;
  color: #2196F3;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  color: #495057;
  font-size: 15px;
  margin: 5px 15px;
  border-radius: 8px;
  position: relative;
  z-index: 101;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #2196F3;
}

.nav-item.active {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.nav-item.back {
  margin-top: auto;
  color: #2196F3;
}

.nav-item.back:hover {
  background: #2196F3;
  color: white;
}

.icon {
  font-size: 18px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.content-wrapper {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.apply-header {
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #2196F3;
}

.section-description {
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.upload-area {
  border: 2px dashed #3498db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
}

.upload-area:hover {
  background: #e3f2fd;
  border-color: #2980b9;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 3rem;
}

.upload-text {
  color: #2c3e50;
  font-weight: 500;
  margin: 0;
}

.upload-hint {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.upload-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #c0392b;
}

.hidden-input {
  display: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn-prev,
.btn-next,
.btn-submit {
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-prev {
  background: #95a5a6;
  color: white;
}

.btn-prev:hover {
  background: #7f8c8d;
}

.btn-next {
  background: #3498db;
  color: white;
  margin-left: auto;
}

.btn-next:hover {
  background: #2980b9;
}

.btn-submit {
  background: #27ae60;
  color: white;
  margin-left: auto;
}

.btn-submit:hover {
  background: #229954;
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.review-group {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.review-group-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.review-item {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.review-item:last-child {
  border-bottom: none;
}

.review-label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 150px;
}

.review-value {
  color: #34495e;
  flex: 1;
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
  }

  .main-content {
    min-width: 100%;
  }

  .content-wrapper {
    padding: 20px;
  }

  .form-container {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-next,
  .btn-submit {
    margin-left: 0;
  }
}
</style>
