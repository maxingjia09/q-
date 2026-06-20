/**
 * 图片路径解析工具
 * 将API返回的图片文件名解析为可显示的URL
 */

// 本地资源映射表：文件名 -> Vite import 的 module URL
// 在开发环境和生产环境都能正确解析
const localImageMap = {
  // 雪山
  'ggxs.PNG': new URL('../assets/ggxs.PNG', import.meta.url).href,
  '1.PNG': new URL('../assets/1.PNG', import.meta.url).href,
  'sd.PNG': new URL('../assets/sd.PNG', import.meta.url).href,
  'xn.PNG': new URL('../assets/xn.PNG', import.meta.url).href,
  // 俱乐部 Logo
  'peak-club-logo.svg': new URL('../assets/peak-club-logo.svg', import.meta.url).href,
  'explorer-club-logo.svg': new URL('../assets/explorer-club-logo.svg', import.meta.url).href,
  'brave-club-logo.svg': new URL('../assets/brave-club-logo.svg', import.meta.url).href,
  // 课程图片
  'qsn.PNG': new URL('../assets/qsn.PNG', import.meta.url).href,
  'course1.jpg': new URL('../assets/g (1).jpg', import.meta.url).href,
  'sd.PNG': new URL('../assets/sd.PNG', import.meta.url).href,
  // 所有本地资源
  'ys.PNG': new URL('../assets/ys.PNG', import.meta.url).href,
  'yb.PNG': new URL('../assets/yb.PNG', import.meta.url).href,
  'htx.PNG': new URL('../assets/htx.PNG', import.meta.url).href,
  'hbsx.PNG': new URL('../assets/hbsx.PNG', import.meta.url).href,
  'sgns.PNG': new URL('../assets/sgns.PNG', import.meta.url).href,
  'bh.PNG': new URL('../assets/bh.PNG', import.meta.url).href,
  'dk.PNG': new URL('../assets/dk.PNG', import.meta.url).href,
  'hd.PNG': new URL('../assets/hd.PNG', import.meta.url).href,
  'ms.PNG': new URL('../assets/ms.PNG', import.meta.url).href,
  'sc.PNG': new URL('../assets/sc.PNG', import.meta.url).href,
  'sg.PNG': new URL('../assets/sg.PNG', import.meta.url).href,
  'sy.PNG': new URL('../assets/sy.PNG', import.meta.url).href,
  'tq.PNG': new URL('../assets/tq.PNG', import.meta.url).href,
  'tx.PNG': new URL('../assets/tx.PNG', import.meta.url).href,
};

/**
 * 决议图片URL
 * @param {string} imagePath - API返回的图片路径或文件名
 * @param {string} fallback - 无法解析时的默认图片URL
 * @returns {string} 可用的图片URL
 */
export function resolveImageUrl(imagePath, fallback = '') {
  if (!imagePath) return fallback;

  // 已经是完整URL（http/https）
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 已经是绝对路径
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // 查找本地资源映射
  if (localImageMap[imagePath]) {
    return localImageMap[imagePath];
  }

  // 尝试作为 assets 路径
  return `/src/assets/${imagePath}`;
}
