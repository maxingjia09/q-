// 活动数据文件
// 导入图片
// 徒步活动图片
import hutiaoxiaImage from '../assets/h.jpg';
import yubengImage from '../assets/y (1).jpg';
import gonggaImage from '../assets/g (2).jpg';
import kanasImage from '../assets/g (1).jpg';
// 攀岩活动图片
import yangshuoImage from '../assets/ys.PNG';
import baiheImage from '../assets/bh.PNG';
import shiguImage from '../assets/sg.PNG';
import mashanImage from '../assets/ms.PNG';
// 雪山攀登图片
import peak3Image from '../assets/3.jpg';
import peak4Image from '../assets/4.jpg';
import peak5Image from '../assets/5.jpg';
import peak2Image from '../assets/2.jpg';

// 徒步路线数据
export const hikingRoutes = [
  {
    id: 1,
    name: '虎跳峡徒步',
    location: '云南丽江',
    description: '世界十大经典徒步路线之一，沿途可欣赏金沙江壮丽景色和哈巴雪山风光。',
    difficulty: '中等',
    duration: '2-3天',
    image: hutiaoxiaImage
  },
  {
    id: 2,
    name: '雨崩徒步',
    location: '云南迪庆',
    description: '梅里雪山脚下的秘境，徒步穿越原始森林，感受雪山冰川的震撼。',
    difficulty: '较高',
    duration: '4-5天',
    image: yubengImage
  },
  {
    id: 3,
    name: '贡嘎西南坡徒步',
    location: '四川甘孜',
    description: '近距离接触蜀山之王，欣赏贡嘎雪山群峰和冰川的壮丽景观。',
    difficulty: '高',
    duration: '6-7天',
    image: gonggaImage
  },
  {
    id: 4,
    name: '喀纳斯徒步',
    location: '新疆阿勒泰',
    description: '穿越中国最美秋色，感受童话般的森林、湖泊和白桦林。',
    difficulty: '中等',
    duration: '3-4天',
    image: kanasImage
  }
];

// 攀岩场地数据
export const rockClimbingSpots = [
  {
    id: 1,
    name: '阳朔攀岩基地',
    location: '广西桂林',
    description: '世界闻名的攀岩胜地，拥有数百条不同难度的攀岩线路。',
    difficulty: '初级到高级',
    height: '10-50米',
    image: yangshuoImage
  },
  {
    id: 2,
    name: '白河攀岩场',
    location: '北京密云',
    description: '北京周边最著名的攀岩场地，线路丰富，适合不同水平的攀岩者。',
    difficulty: '初级到中级',
    height: '5-30米',
    image: baiheImage
  },
  {
    id: 3,
    name: '石鼓攀岩基地',
    location: '云南丽江',
    description: '金沙江畔的天然攀岩场，风景优美，线路独特。',
    difficulty: '中级到高级',
    height: '15-40米',
    image: shiguImage
  },
  {
    id: 4,
    name: '马山攀岩公园',
    location: '广西南宁',
    description: '南方地区最大的室外攀岩公园，设施完善，适合家庭和团队活动。',
    difficulty: '初级到高级',
    height: '8-45米',
    image: mashanImage
  }
];

// 雪山攀登数据
export const mountainExpeditions = [
  {
    id: 1,
    name: '四姑娘山二峰',
    location: '四川阿坝',
    description: '入门级雪山，适合有一定徒步经验的登山爱好者。',
    altitude: '5276米',
    duration: '5-6天',
    image: peak3Image
  },
  {
    id: 2,
    name: '玉珠峰',
    location: '青海格尔木',
    description: '昆仑山脉东段最高峰，6000米级雪山的经典入门之选。',
    altitude: '6178米',
    duration: '10-12天',
    image: peak4Image
  },
  {
    id: 3,
    name: '慕士塔格峰',
    location: '新疆喀什',
    description: '帕米尔高原上的"冰山之父"，7000米级雪山的理想选择。',
    altitude: '7546米',
    duration: '20-25天',
    image: peak5Image
  },
  {
    id: 4,
    name: '岗什卡雪山',
    location: '青海海北',
    description: '祁连山脉东段最高峰，适合有一定经验的登山者挑战。',
    altitude: '5254.5米',
    duration: '7-9天',
    image: peak2Image
  }
];