<template>
  <view class="opening-container">
    <video
      src="https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/video/opening-video.mp4"
      :autoplay="true"
      :controls="false"
      :show-progress="false"
      :show-fullscreen-btn="false"
      :show-play-btn="false"
      :show-center-play-btn="false"
      :enable-progress-gesture="false"
      object-fit="cover"
      @ended="onOpeningEnd"
      style="width: 100%; height: 100%"
    ></video>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onOpeningEnd() {
      // 开场视频结束后返回到主页
      uni.navigateBack();
    },
  },
};
</script>

<style>
.opening-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>
