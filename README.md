## 版本支持

- HBuilderX 正式版 3.7.10+
- HBuilderX alpha 版 3.8.0+

### 文档已移至 uni-ai-chat 文档[https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html](https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html)

### 在线体验

地址：[https://chat.dcloud.net.cn](https://chat.dcloud.net.cn/#/)

注意：需要使用 HBuilder 账号登录，限制：5 条消息/账号/天

## 视频资源格式要求

在小程序环境中，视频格式有严格要求，必须符合以下标准：

1. 格式：MP4（H.264 编码，AAC 音频）
2. 分辨率：建议不超过 720p
3. 帧率：30fps
4. 比特率：不超过 1.5Mbps
5. 大小：不超过 10MB

不符合以上要求的视频可能导致黑屏或无法播放。如遇到视频播放问题，可以：

1. 使用 FFmpeg 进行转换：

   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec aac -strict -2 -vf "scale=-2:720" -b:v 1.5M -r 30 output.mp4
   ```

2. 在测试页面中使用"查看解决方案"按钮获取更多信息

3. 将视频文件放置在 `/static/zodiac/` 目录下，文件名与星座英文名保持一致（如`aries.mp4`）

## 星座背景与动画

本项目支持两种动画类型：

1. 视频动画（MP4 格式）
2. SVG 动画（默认提供，作为视频无法加载时的备选方案）

您可以在测试页面（/pages/test-zodiac/index）中测试不同星座的背景和动画效果。
