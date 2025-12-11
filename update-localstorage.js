// 更新localStorage，移除默认的普通用户账号
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

// 从localStorage获取数据
let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];

// 移除默认的普通用户（ID为2）
mockUsers = mockUsers.filter(user => user.id !== 2);

// 确保管理员账号存在
const adminIndex = mockUsers.findIndex(u => u.id === 1);
if (adminIndex === -1) {
  mockUsers.push(defaultUsers[0]);
} else {
  mockUsers[adminIndex] = { ...mockUsers[adminIndex], ...defaultUsers[0] };
}

// 保存到localStorage
localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

console.log('localStorage updated successfully!');
console.log('Current users:', mockUsers);