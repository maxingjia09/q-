<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1 class="admin-logo">户外俱乐部 - 管理后台</h1>
      </div>
      <div class="header-right">
        <span class="welcome-text">
          欢迎，<template v-if="authStore.user?.isSuperAdmin">总管理员</template>
          <template v-else>俱乐部管理员</template>
          {{ authStore.user?.username }}
          <span v-if="authStore.user?.isClubAdmin && clubName" class="club-tag">（{{ clubName }}）</span>
        </span>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </header>

    <div class="admin-content">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <ul>
            <li :class="['nav-item', { active: activeMenu === 'dashboard' }]" @click="activeMenu = 'dashboard'">
              <span class="nav-icon">📊</span><span class="nav-text">仪表盘</span>
            </li>
            <li :class="['nav-item', { active: activeMenu === 'users' }]" @click="activeMenu = 'users'">
              <span class="nav-icon">👥</span><span class="nav-text">用户管理</span>
            </li>
            <li v-if="authStore.user?.isSuperAdmin" :class="['nav-item', { active: activeMenu === 'clubs' }]" @click="activeMenu = 'clubs'">
              <span class="nav-icon">🏢</span><span class="nav-text">俱乐部管理</span>
            </li>
            <li :class="['nav-item', { active: activeMenu === 'activities' }]" @click="activeMenu = 'activities'">
              <span class="nav-icon">🏔️</span><span class="nav-text">活动管理</span>
            </li>
            <li :class="['nav-item', { active: activeMenu === 'courses' }]" @click="activeMenu = 'courses'">
              <span class="nav-icon">📚</span><span class="nav-text">课程管理</span>
            </li>
            <li :class="['nav-item', { active: activeMenu === 'guides' }]" @click="activeMenu = 'guides'">
              <span class="nav-icon">🧑‍🏫</span><span class="nav-text">向导管理</span>
            </li>
            <li :class="['nav-item', { active: activeMenu === 'routes' }]" @click="activeMenu = 'routes'">
              <span class="nav-icon">🗺️</span><span class="nav-text">路线管理</span>
            </li>
            <li :class="['nav-item', { active: activeMenu === 'registrations' }]" @click="activeMenu = 'registrations'">
              <span class="nav-icon">📋</span><span class="nav-text">报名记录</span>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="admin-main">
        <div v-if="activeMenu === 'dashboard'">
          <h2 class="section-title">系统概览</h2>
          <div class="stats-grid">
            <div class="stat-card" v-for="s in statCards" :key="s.label">
              <div class="stat-icon">{{ s.icon }}</div>
              <div class="stat-content"><div class="stat-number">{{ s.value }}</div><div class="stat-label">{{ s.label }}</div></div>
            </div>
          </div>
        </div>

        <div v-if="activeMenu === 'users'">
          <h2 class="section-title">用户管理</h2>
          <div class="table-container">
            <table class="admin-table"><thead><tr><th>ID</th><th>用户名</th><th>邮箱</th><th>角色</th><th>俱乐部</th><th>操作</th></tr></thead>
              <tbody><tr v-for="u in userList" :key="u.id"><td>{{ u.id }}</td><td>{{ u.userName }}</td><td>{{ u.userAccount }}</td><td>{{ roleLabel(u.userRole) }}</td><td>{{ getClubName(u.clubId) }}</td><td><button class="btn-edit" @click="openEdit('user',u)">编辑</button><button class="btn-delete" @click="handleDelete('user',u.id)">删除</button></td></tr></tbody>
            </table>
          </div>
        </div>

        <div v-if="activeMenu === 'clubs'">
          <div class="section-header"><h2 class="section-title">俱乐部管理</h2><button class="btn-add" @click="openAdd('club')">+ 添加俱乐部</button></div>
          <div class="card-grid"><div class="info-card" v-for="c in clubList" :key="c.id"><h3>{{ c.name }}</h3><p>{{ c.description?.substring(0,100) || '暂无描述' }}</p><p>评分: {{ c.rating }} | 评价: {{ c.reviewCount }}条</p><div class="card-actions"><button class="btn-edit" @click="openEdit('club',c)">编辑</button><button class="btn-delete" @click="handleDelete('club',c.id)">删除</button></div></div></div>
        </div>

        <div v-if="activeMenu === 'activities'">
          <div class="section-header"><h2 class="section-title">活动管理</h2><button class="btn-add" @click="openAdd('activity')">+ 添加活动</button></div>
          <div class="tabs" style="margin-bottom:1rem"><button :class="['tab-btn',{active:activityTab==='hiking'}]" @click="activityTab='hiking'">徒步活动</button><button :class="['tab-btn',{active:activityTab==='mountain'}]" @click="activityTab='mountain'">雪山攀登</button></div>
          <div class="table-container"><table class="admin-table"><thead><tr><th>ID</th><th>名称</th><th>地点</th><th>难度</th><th>时长</th><th>价格</th><th>状态</th><th>操作</th></tr></thead>
            <tbody><tr v-for="a in filteredActivityList" :key="a.id"><td>{{ a.id }}</td><td>{{ a.name }}</td><td>{{ a.location }}</td><td>{{ a.difficulty }}</td><td>{{ a.duration }}</td><td>¥{{ a.price }}</td><td>{{ a.status }}</td><td><button class="btn-edit" @click="openEdit('activity',a)">编辑</button><button class="btn-delete" @click="handleDelete('activity',a.id)">删除</button></td></tr></tbody>
          </table></div>
        </div>

        <div v-if="activeMenu === 'courses'">
          <div class="section-header"><h2 class="section-title">课程管理</h2><button class="btn-add" @click="openAdd('course')">+ 添加课程</button></div>
          <div class="table-container"><table class="admin-table"><thead><tr><th>ID</th><th>名称</th><th>分类</th><th>难度</th><th>价格</th><th>状态</th><th>操作</th></tr></thead>
            <tbody><tr v-for="c in courseList" :key="c.id"><td>{{ c.id }}</td><td>{{ c.name }}</td><td>{{ c.category }}</td><td>{{ c.difficulty }}</td><td>¥{{ c.price }}</td><td>{{ c.status }}</td><td><button class="btn-edit" @click="openEdit('course',c)">编辑</button><button class="btn-delete" @click="handleDelete('course',c.id)">删除</button></td></tr></tbody>
          </table></div>
        </div>

        <div v-if="activeMenu === 'guides'">
          <div class="section-header"><h2 class="section-title">向导管理</h2><button class="btn-add" @click="openAdd('guide')">+ 添加向导</button></div>
          <div class="table-container"><table class="admin-table"><thead><tr><th>ID</th><th>姓名</th><th>评分</th><th>状态</th><th>俱乐部</th><th>操作</th></tr></thead>
            <tbody><tr v-for="g in guideList" :key="g.id"><td>{{ g.id }}</td><td>{{ g.name }}</td><td>{{ g.rating }}</td><td>{{ g.status }}</td><td>{{ getClubName(g.clubid) }}</td><td><button class="btn-edit" @click="openEdit('guide',g)">编辑</button><button v-if="g.status!=='active'" class="btn-publish" @click="handlePublish(g.id)">发布</button><button v-if="g.status==='active'" class="btn-unpublish" @click="handleUnpublish(g.id)">下架</button><button class="btn-delete" @click="handleDelete('guide',g.id)">删除</button></td></tr></tbody>
          </table></div>
        </div>

        <div v-if="activeMenu === 'routes'">
          <div class="section-header"><h2 class="section-title">路线管理</h2><button class="btn-add" @click="openAdd('route')">+ 添加路线</button></div>
          <div class="table-container"><table class="admin-table"><thead><tr><th>ID</th><th>名称</th><th>难度</th><th>价格</th><th>地点</th><th>时长</th><th>状态</th><th>俱乐部</th><th>操作</th></tr></thead>
            <tbody><tr v-for="r in routeList" :key="r.id"><td>{{ r.id }}</td><td>{{ r.name }}</td><td>{{ r.difficulty }}</td><td>¥{{ r.price }}</td><td>{{ r.location }}</td><td>{{ r.duration }}</td><td>{{ r.status }}</td><td>{{ getClubName(r.clubid) }}</td><td><button class="btn-edit" @click="openEdit('route',r)">编辑</button><button class="btn-delete" @click="handleDelete('route',r.id)">删除</button></td></tr></tbody>
          </table></div>
        </div>

        <div v-if="activeMenu === 'registrations'">
          <h2 class="section-title">报名记录</h2>
          <div class="tabs"><button :class="['tab-btn',{active:regTab==='activity'}]" @click="regTab='activity'">活动报名</button><button :class="['tab-btn',{active:regTab==='course'}]" @click="regTab='course'">课程报名</button></div>
          <div class="table-container" style="margin-top:1rem">
            <table v-if="regTab==='activity'" class="admin-table"><thead><tr><th>ID</th><th>用户ID</th><th>活动ID</th><th>俱乐部</th><th>状态</th><th>支付</th><th>操作</th></tr></thead>
              <tbody><tr v-for="r in activityRegs" :key="r.id"><td>{{ r.id }}</td><td>{{ r.userid }}</td><td>{{ r.activityid }}</td><td>{{ r.clubid }}</td><td>{{ r.status }}</td><td>{{ r.paymentstatus }}</td><td><button class="btn-edit" @click="openEdit('activityReg',r)">编辑</button></td></tr></tbody>
            </table>
            <table v-if="regTab==='course'" class="admin-table"><thead><tr><th>ID</th><th>用户ID</th><th>课程ID</th><th>状态</th><th>支付</th><th>进度</th><th>操作</th></tr></thead>
              <tbody><tr v-for="r in courseRegs" :key="r.id"><td>{{ r.id }}</td><td>{{ r.userid }}</td><td>{{ r.courseid }}</td><td>{{ r.status }}</td><td>{{ r.paymentstatus }}</td><td>{{ r.progress }}%</td><td><button class="btn-edit" @click="openEdit('courseReg',r)">编辑</button></td></tr></tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- 通用编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal-content">
        <h3 class="modal-title">{{ modalTitle }}</h3>
        <div class="modal-body">
          <template v-if="modalType==='user'">
            <div class="form-group"><label>用户名</label><input v-model="editForm.userName" class="form-input"></div>
            <div class="form-group"><label>邮箱</label><input v-model="editForm.userAccount" class="form-input"></div>
            <div v-if="authStore.user?.isSuperAdmin" class="form-group"><label>角色</label><select v-model="editForm.userRole" class="form-input" @change="onRoleChange"><option value="user">普通用户</option><option value="super_admin">总管理员</option><option value="club_admin">俱乐部管理员</option><option value="ban">已封禁</option></select></div>
            <div v-if="authStore.user?.isSuperAdmin && editForm.userRole === 'club_admin'" class="form-group"><label>所属俱乐部</label><select v-model.number="editForm.clubId" class="form-input"><option value="">-- 选择俱乐部 --</option><option v-for="c in clubList" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
          </template>
          <template v-if="modalType==='club'">
            <div class="form-group"><label>名称</label><input v-model="editForm.name" class="form-input"></div>
            <div class="form-group"><label>描述</label><textarea v-model="editForm.description" class="form-input" rows="3"></textarea></div>
            <div class="form-group"><label>标志图片</label>
              <select v-model="imageQuickPick" class="form-input" style="margin-bottom:0.4rem" @change="onImageQuickPick('club')"><option value="">-- 选中俱乐部Logo --</option><option value="peak-club-logo.svg">巅峰户外俱乐部</option><option value="explorer-club-logo.svg">探索者户外联盟</option><option value="brave-club-logo.svg">勇者户外团队</option><option value="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop">山景Logo1</option><option value="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop">山景Logo2</option></select>
              <input v-model="editForm.image" class="form-input" placeholder="输入Logo图片URL或本地文件名">
              <img v-if="editForm.image" :src="resolveImageUrl(editForm.image)" class="img-preview" @error="e=>e.target.style.display='none'">
            </div>
            <div class="form-group"><label>评分</label><input v-model.number="editForm.rating" type="number" step="0.1" class="form-input"></div>
          </template>
          <template v-if="modalType==='activity'">
            <div class="form-group"><label>名称</label><input v-model="editForm.name" class="form-input"></div>
            <div class="form-group"><label>类型</label><select v-model="editForm.type" class="form-input"><option value="hiking">徒步</option><option value="mountain">雪山</option><option value="climbing">攀岩</option><option value="cycling">骑行</option><option value="camping">露营</option></select></div>
            <div class="form-group"><label>地点</label><input v-model="editForm.location" class="form-input"></div>
            <div class="form-group"><label>描述</label><textarea v-model="editForm.description" class="form-input" rows="3"></textarea></div>
            <div class="form-group"><label>难度</label><select v-model="editForm.difficulty" class="form-input"><option value="beginner">初级</option><option value="intermediate">中等</option><option value="advanced">较高</option><option value="expert">高</option><option value="extreme">困难</option></select></div>
            <div class="form-group"><label>时长</label><input v-model="editForm.duration" class="form-input"></div>
            <div class="form-group"><label>价格(¥)</label><input v-model.number="editForm.price" type="number" step="0.01" class="form-input"></div>
            <div class="form-group"><label>最大人数</label><input v-model.number="editForm.maxParticipants" type="number" class="form-input"></div>
            <div class="form-group"><label>图片</label>
              <select v-model="imageQuickPick" class="form-input" style="margin-bottom:0.4rem" @change="onImageQuickPick('activity')"><option value="">-- 快捷选择 / 手动输入 --</option><optgroup label="Unsplash 高质量图片"><option value="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop">徒步-山景1</option><option value="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop">徒步-山景2</option><option value="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop">徒步-雪景</option><option value="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop">徒步-秋色</option><option value="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=600&fit=crop">攀岩1</option><option value="https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&h=600&fit=crop">攀岩2</option><option value="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop">攀岩3</option></optgroup><optgroup label="本地资源"><option value="ggxs.PNG">四姑娘山</option><option value="1.PNG">玉珠峰</option><option value="sd.PNG">慕士塔格峰</option><option value="xn.PNG">岗什卡雪山</option><option value="sy.PNG">山景</option><option value="sg.PNG">山景2</option></optgroup></select>
              <input v-model="editForm.image" class="form-input" placeholder="输入图片URL或本地文件名">
              <img v-if="editForm.image" :src="resolveImageUrl(editForm.image)" class="img-preview" @error="e=>e.target.style.display='none'">
            </div>
            <div class="form-group"><label>状态</label><select v-model="editForm.status" class="form-input"><option value="draft">草稿</option><option value="published">已发布</option><option value="closed">已关闭</option></select></div>
            <div v-if="authStore.user?.isSuperAdmin" class="form-group"><label>所属俱乐部</label><select v-model.number="editForm.clubId" class="form-input"><option value="">全局(无)</option><option v-for="c in clubList" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
          </template>
          <template v-if="modalType==='course'">
            <div class="form-group"><label>名称</label><input v-model="editForm.name" class="form-input"></div>
            <div class="form-group"><label>分类</label><input v-model="editForm.category" class="form-input"></div>
            <div class="form-group"><label>难度</label><select v-model="editForm.difficulty" class="form-input"><option value="beginner">初级</option><option value="intermediate">中级</option><option value="advanced">高级</option></select></div>
            <div class="form-group"><label>价格</label><input v-model.number="editForm.price" type="number" step="0.01" class="form-input"></div>
            <div class="form-group"><label>图片</label>
              <select v-model="imageQuickPick" class="form-input" style="margin-bottom:0.4rem" @change="onImageQuickPick('course')"><option value="">-- 快捷选择 / 手动输入 --</option><option value="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop">野外急救课程</option><option value="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop">野外生存课程</option><option value="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop">青少年户外课程</option><option value="qsn.PNG">青少年课程-本地</option><option value="course1.jpg">山地探索</option></select>
              <input v-model="editForm.image" class="form-input" placeholder="输入图片URL或本地文件名">
              <img v-if="editForm.image" :src="resolveImageUrl(editForm.image)" class="img-preview" @error="e=>e.target.style.display='none'">
            </div>
            <div class="form-group"><label>状态</label><select v-model="editForm.status" class="form-input"><option value="draft">草稿</option><option value="published">已发布</option><option value="closed">已关闭</option></select></div>
            <div v-if="authStore.user?.isSuperAdmin" class="form-group"><label>俱乐部ID(留空=全局)</label><input v-model.number="editForm.clubId" type="number" class="form-input"></div>
          </template>
          <template v-if="modalType==='guide'">
            <div class="form-group"><label>姓名</label><input v-model="editForm.name" class="form-input"></div>
            <div class="form-group"><label>经验描述</label><textarea v-model="editForm.experience" rows="2" class="form-input"></textarea></div>
            <div class="form-group"><label>认证资质</label><input v-model="editForm.certifications" class="form-input"></div>
            <div class="form-group"><label>评分</label><input v-model.number="editForm.rating" type="number" step="0.1" class="form-input"></div>
            <div class="form-group"><label>活动次数</label><input v-model.number="editForm.activities" type="number" class="form-input"></div>
            <div v-if="authStore.user?.isSuperAdmin" class="form-group"><label>所属俱乐部</label><select v-model.number="editForm.clubid" class="form-input"><option v-for="c in clubList" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
          </template>
          <template v-if="modalType==='route'">
            <div class="form-group"><label>名称</label><input v-model="editForm.name" class="form-input"></div>
            <div class="form-group"><label>描述</label><textarea v-model="editForm.description" rows="2" class="form-input"></textarea></div>
            <div class="form-group"><label>难度</label><select v-model="editForm.difficulty" class="form-input"><option value="beginner">初级</option><option value="intermediate">中等</option><option value="advanced">较高</option><option value="expert">高</option><option value="extreme">困难</option></select></div>
            <div class="form-group"><label>价格</label><input v-model.number="editForm.price" type="number" step="0.01" class="form-input"></div>
            <div class="form-group"><label>时长</label><input v-model="editForm.duration" class="form-input"></div>
            <div class="form-group"><label>地点</label><input v-model="editForm.location" class="form-input"></div>
            <div class="form-group"><label>状态</label><select v-model="editForm.status" class="form-input"><option value="active">启用</option><option value="inactive">禁用</option></select></div>
            <div v-if="authStore.user?.isSuperAdmin" class="form-group"><label>所属俱乐部</label><select v-model.number="editForm.clubid" class="form-input"><option v-for="c in clubList" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
          </template>
          <template v-if="modalType==='activityReg'||modalType==='courseReg'">
            <div class="form-group"><label>状态</label><select v-model="editForm.status" class="form-input"><option value="pending">待确认</option><option value="confirmed">已确认</option><option value="completed">已完成</option><option value="cancelled">已取消</option></select></div>
            <div class="form-group"><label>支付状态</label><select v-model="editForm.paymentstatus" class="form-input"><option value="unpaid">未支付</option><option value="paid">已支付</option><option value="refunded">已退款</option></select></div>
          </template>
        </div>
        <div class="modal-footer"><button class="btn-cancel" @click="showModal=false">取消</button><button class="btn-submit" @click="handleSave">保存</button></div>
      </div>
    </div>

    <!-- 删除确认 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm=false">
      <div class="modal-content" style="max-width:360px"><h3 class="modal-title">确认删除</h3><p style="padding:0 1.5rem">确定要删除吗？此操作不可撤销。</p><div class="modal-footer"><button class="btn-cancel" @click="showDeleteConfirm=false">取消</button><button class="btn-delete" @click="confirmDelete">确认删除</button></div></div>
    </div>

    <div v-if="notify.show" :class="['notification',notify.type]">{{ notify.message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { adminFetch } from '../utils/api';
import { resolveImageUrl } from '../utils/imageUtils';

const router = useRouter();
const authStore = useAuthStore();

const activeMenu = ref('dashboard');
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const modalTitle = ref('');
const modalType = ref('');
const editForm = ref({});
const editingId = ref(null);
const deleteType = ref('');
const deleteId = ref(null);
const clubName = ref('');
const regTab = ref('activity');
const activityTab = ref('hiking');
const imageQuickPick = ref('');
const notify = reactive({ show: false, message: '', type: 'success' });

const onImageQuickPick = (type) => {
  if (imageQuickPick.value) {
    editForm.value.image = imageQuickPick.value;
    imageQuickPick.value = '';
  }
};

const stats = reactive({ totalUsers:0,totalActivities:0,totalCourses:0,totalClubs:0,totalGuides:0,totalRoutes:0,totalActivityRegistrations:0,totalCourseRegistrations:0 });
const userList = ref([]);
const clubList = ref([]);
const activityList = ref([]);
const courseList = ref([]);
const guideList = ref([]);
const routeList = ref([]);
const activityRegs = ref([]);
const courseRegs = ref([]);

const statCards = computed(() => [
  { icon:'👥',label:'总用户数',value:stats.totalUsers },{ icon:'🏔️',label:'活动总数',value:stats.totalActivities },
  { icon:'📚',label:'课程总数',value:stats.totalCourses },{ icon:'🏢',label:'俱乐部总数',value:stats.totalClubs },
  { icon:'🧑‍🏫',label:'向导总数',value:stats.totalGuides },{ icon:'🗺️',label:'路线总数',value:stats.totalRoutes },
  { icon:'📋',label:'活动报名',value:stats.totalActivityRegistrations },{ icon:'📝',label:'课程报名',value:stats.totalCourseRegistrations }
]);

const filteredActivityList = computed(() => {
  if (activityTab.value === 'hiking') return activityList.value.filter(a => a.type === 'hiking');
  if (activityTab.value === 'mountain') return activityList.value.filter(a => a.type === 'mountain');
  return activityList.value;
});

const showMsg = (msg, type='success') => { notify.message=msg; notify.type=type; notify.show=true; setTimeout(()=>notify.show=false,3000); };
const roleLabel = (r) => ({super_admin:'总管理员',club_admin:'俱乐部管理员',user:'普通用户',ban:'已封禁'}[r]||r);
const getClubName = (id) => { if(!id) return '-'; const c = clubList.value.find(x=>x.id===id); return c?c.name:`ID:${id}`; };

const loadStats = async () => { try { const r=await adminFetch('/admin/dashboard/stats'); if(r.code===200) Object.assign(stats,r.data); else console.error('loadStats error:',r); }catch(e){ console.error('loadStats exception:',e); } };
const loadList = async (type, refVar) => { try { const r=await adminFetch(`/admin/${type}`); if(r.code===200) refVar.value=r.data; else console.error('loadList error:',type,r); }catch(e){ console.error('loadList exception:',type,e); } };
const loadAll = () => { loadStats(); loadList('users',userList); loadList('clubs',clubList); loadList('activities',activityList); loadList('courses',courseList); loadList('guides',guideList); loadList('routes',routeList); loadList('registrations/activities',activityRegs); loadList('registrations/courses',courseRegs); };

const endpointMap = { user:'users',club:'clubs',activity:'activities',course:'courses',guide:'guides',route:'routes',activityReg:'registrations/activities',courseReg:'registrations/courses' };

const openAdd = (type) => { editForm.value={}; editingId.value=null; modalType.value=type; modalTitle.value='添加'; showModal.value=true; };
const onRoleChange = () => { if (editForm.value.userRole !== 'club_admin') editForm.value.clubId = null; };
const openEdit = (type, data) => { editForm.value={...data}; editingId.value=data.id; modalType.value=type; modalTitle.value='编辑'; showModal.value=true; };

const handleSave = async () => {
  const ep = endpointMap[modalType.value]; if(!ep) return;
  try {
    const method = editingId.value ? 'PUT' : 'POST';
    const url = editingId.value ? `/admin/${ep}/${editingId.value}` : `/admin/${ep}`;
    const r = await adminFetch(url, { method, body: JSON.stringify(editForm.value) });
    if(r.code===200) { showMsg(r.message||'操作成功'); showModal.value=false; loadAll(); }
    else showMsg(r.message||'操作失败','error');
  }catch(e){ showMsg('网络错误','error'); }
};

const handleDelete = (type, id) => { deleteType.value=type; deleteId.value=id; showDeleteConfirm.value=true; };
const confirmDelete = async () => {
  const ep = endpointMap[deleteType.value]; if(!ep) return;
  try {
    const r = await adminFetch(`/admin/${ep}/${deleteId.value}`, { method:'DELETE' });
    if(r.code===200) { showMsg('删除成功'); showDeleteConfirm.value=false; loadAll(); }
    else showMsg(r.message||'删除失败','error');
  }catch(e){ showMsg('网络错误','error'); }
};

const handlePublish = async (id) => { try { const r=await adminFetch(`/admin/guides/${id}/publish`,{method:'PUT'}); if(r.code===200){showMsg('发布成功');loadAll();}else showMsg(r.message||'失败','error'); }catch(e){showMsg('网络错误','error');} };
const handleUnpublish = async (id) => { try { const r=await adminFetch(`/admin/guides/${id}/unpublish`,{method:'PUT'}); if(r.code===200){showMsg('下架成功');loadAll();}else showMsg(r.message||'失败','error'); }catch(e){showMsg('网络错误','error');} };

const handleLogout = async () => { await authStore.logout(); router.push('/admin/login'); };

onMounted(async () => {
  if (!authStore.user?.isAdmin) { router.push('/login'); return; }
  if (authStore.user?.isClubAdmin && authStore.user?.clubId) {
    try { const r=await adminFetch('/admin/clubs'); if(r.code===200) { const c=r.data.find(x=>x.id===authStore.user.clubId); if(c) clubName.value=c.name; } }catch(e){}
  }
  loadAll();
});
</script>

<style scoped>
.admin-container{min-height:100vh;background-color:#f5f7fa;display:flex;flex-direction:column}
.admin-header{background-color:#2c3e50;color:white;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}
.admin-logo{font-size:1.5rem;margin:0}
.header-right{display:flex;align-items:center;gap:1rem}
.welcome-text{font-weight:500}.club-tag{color:#f39c12;font-size:.9rem}
.logout-btn{padding:.5rem 1rem;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer}
.admin-content{display:flex;flex:1}
.admin-sidebar{width:250px;background:white;box-shadow:2px 0 4px rgba(0,0,0,.05)}
.sidebar-nav ul{list-style:none;padding:0;margin:0}
.nav-item{display:flex;align-items:center;padding:1rem 1.5rem;cursor:pointer;color:#2c3e50;transition:background .3s}
.nav-item:hover{background:#f5f7fa}
.nav-item.active{background:#3498db;color:white}
.nav-icon{margin-right:.8rem;font-size:1.2rem}
.admin-main{flex:1;padding:2rem;overflow-y:auto}
.section-title{font-size:1.8rem;color:#2c3e50;margin-bottom:1.5rem}
.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
.section-header .section-title{margin-bottom:0}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin-bottom:2rem}
.stat-card{background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);display:flex;align-items:center;gap:1rem}
.stat-icon{font-size:2rem}.stat-number{font-size:1.8rem;font-weight:600;color:#2c3e50}.stat-label{font-size:.9rem;color:#666}
.table-container{background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);overflow:hidden}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th,.admin-table td{padding:.8rem 1rem;text-align:left;border-bottom:1px solid #f0f0f0;font-size:.9rem}
.admin-table th{background:#f5f7fa;font-weight:600;color:#2c3e50}
.admin-table tr:hover{background:#f9f9f9}
.btn-edit,.btn-delete,.btn-publish,.btn-unpublish{padding:.4rem .8rem;border:none;border-radius:4px;cursor:pointer;font-size:.8rem;margin-right:.3rem}
.btn-edit{background:#3498db;color:white}.btn-delete{background:#e74c3c;color:white}
.btn-publish{background:#27ae60;color:white}.btn-unpublish{background:#f39c12;color:white}
.btn-add{padding:.8rem 1.5rem;background:#27ae60;color:white;border:none;border-radius:4px;cursor:pointer;font-size:1rem}
.btn-submit{padding:.7rem 1.5rem;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer}
.btn-cancel{padding:.7rem 1.5rem;background:#95a5a6;color:white;border:none;border-radius:4px;cursor:pointer;margin-right:1rem}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
.info-card{background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);padding:1rem}
.info-card h3{color:#2c3e50;margin-bottom:.5rem}
.card-actions{display:flex;gap:.5rem;margin-top:1rem}
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal-content{background:white;border-radius:12px;width:100%;max-width:560px;max-height:80vh;overflow-y:auto}
.modal-title{padding:1.5rem;margin:0;border-bottom:1px solid #f0f0f0}
.modal-body{padding:1.5rem}.modal-footer{padding:1rem 1.5rem;border-top:1px solid #f0f0f0;display:flex;justify-content:flex-end}
.form-group{margin-bottom:1rem}.form-group label{display:block;margin-bottom:.4rem;color:#2c3e50;font-weight:500;font-size:.9rem}
.form-input{width:100%;padding:.6rem;border:1px solid #ddd;border-radius:4px;font-size:.9rem;box-sizing:border-box}
.tabs{display:flex}.tab-btn{padding:.7rem 1.5rem;border:1px solid #ddd;background:#f5f7fa;cursor:pointer}
.tab-btn:first-child{border-radius:6px 0 0 6px}.tab-btn:last-child{border-radius:0 6px 6px 0}
.tab-btn.active{background:#3498db;color:white;border-color:#3498db}
.notification{position:fixed;top:20px;right:20px;padding:1rem 1.5rem;border-radius:6px;color:white;z-index:2000;animation:slideIn .3s}
.notification.success{background:#27ae60}.notification.error{background:#e74c3c}
.img-preview{width:100%;max-height:160px;object-fit:cover;border-radius:6px;margin-top:.4rem;border:1px solid #eee}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
</style>
