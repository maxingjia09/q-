/**
 * API 工具模块
 * 统一的 HTTP 请求封装
 */

const API_BASE_URL = 'http://localhost:8122/api';

/**
 * 管理员专用请求（自动附加 X-User-Id 请求头）
 * @param {string} endpoint - API 路径，例如 '/admin/activities'
 * @param {object} options - fetch 选项
 * @returns {Promise} API 响应数据
 */
export async function adminFetch(endpoint, options = {}) {
  const userId = localStorage.getItem('userId');
  console.log('[adminFetch]', endpoint, 'userId:', userId);
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Id': userId || '',
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  console.log('[adminFetch]', endpoint, 'response:', data);
  return data;
}

/**
 * 普通 API 请求（无认证头）
 * @param {string} endpoint - API 路径
 * @param {object} options - fetch 选项
 * @returns {Promise} API 响应数据
 */
export async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  return response.json();
}

export { API_BASE_URL };
