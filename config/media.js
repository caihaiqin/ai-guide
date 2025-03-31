/**
 * 媒体资源配置文件
 * 包含背景视频、背景音乐和开场视频的云端访问链接
 */

// 云存储基础URL
const CLOUD_BASE_URL = 'https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com';

// 开场视频配置
const OPENING_VIDEO = {
  url: `${CLOUD_BASE_URL}/video/opening-video.mp4`,
  // 可添加其他配置项，如是否自动播放、循环等
  autoplay: true,
  loop: false
};

// 背景视频配置数组
const BACKGROUND_VIDEOS = [{
  id: 'bg-video-1',
  name: '背景视频1',
  url: `${CLOUD_BASE_URL}/video/backgroud-video/backgroud-video-1.mp4`
},
{
  id: 'bg-video-2',
  name: '背景视频2',
  url: `${CLOUD_BASE_URL}/video/backgroud-video/backgroud-video-2.mp4`
},
{
  id: 'bg-video-3',
  name: '背景视频3',
  url: `${CLOUD_BASE_URL}/video/backgroud-video/backgroud-video-3.mp4`
}
];

// 背景音乐配置数组
const BACKGROUND_MUSIC = [{
  id: 'bg-music-1',
  name: '背景音乐1',
  url: `${CLOUD_BASE_URL}/music/backgroud-music/backgroud-music-1.mp4`
},
{
  id: 'bg-music-2',
  name: '背景音乐2',
  url: `${CLOUD_BASE_URL}/music/backgroud-music/backgroud-music-2.mp4`
},
{
  id: 'bg-music-3',
  name: '背景音乐3',
  url: `${CLOUD_BASE_URL}/music/backgroud-music/backgroud-music-3.mp4`
}
];

// 星座视频配置
const ZODIAC_VIDEOS = {
  aries: `${CLOUD_BASE_URL}/video/zodiac/aries.mp4`,
  taurus: `${CLOUD_BASE_URL}/video/zodiac/taurus.mp4`,
  gemini: `${CLOUD_BASE_URL}/video/zodiac/gemini.mp4`,
  cancer: `${CLOUD_BASE_URL}/video/zodiac/cancer.mp4`,
  leo: `${CLOUD_BASE_URL}/video/zodiac/leo.mp4`,
  virgo: `${CLOUD_BASE_URL}/video/zodiac/virgo.mp4`,
  libra: `${CLOUD_BASE_URL}/video/zodiac/libra.mp4`,
  scorpio: `${CLOUD_BASE_URL}/video/zodiac/scorpio.mp4`,
  sagittarius: `${CLOUD_BASE_URL}/video/zodiac/sagittarius.mp4`,
  capricorn: `${CLOUD_BASE_URL}/video/zodiac/capricorn.mp4`,
  aquarius: `${CLOUD_BASE_URL}/video/zodiac/aquarius.mp4`,
  pisces: `${CLOUD_BASE_URL}/video/zodiac/pisces.mp4`
};

/**
 * 获取随机背景视频
 * @returns {Object} 随机选择的背景视频对象
 */
export function getRandomBackgroundVideo() {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_VIDEOS.length);
  return BACKGROUND_VIDEOS[randomIndex];
}

/**
 * 获取随机背景音乐
 * @returns {Object} 随机选择的背景音乐对象
 */
export function getRandomBackgroundMusic() {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_MUSIC.length);
  return BACKGROUND_MUSIC[randomIndex];
}

/**
 * 获取星座视频URL
 * @param {string} zodiacName - 星座英文名
 * @returns {string} 星座视频URL
 */
export function getZodiacVideoUrl(zodiacName) {
  return ZODIAC_VIDEOS[zodiacName.toLowerCase()] || null;
}

export default {
  CLOUD_BASE_URL,
  OPENING_VIDEO,
  BACKGROUND_VIDEOS,
  BACKGROUND_MUSIC,
  ZODIAC_VIDEOS,
  getRandomBackgroundVideo,
  getRandomBackgroundMusic,
  getZodiacVideoUrl
};