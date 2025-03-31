<template>
  <view class="svg-animation">
    <view v-if="zodiac === 'aries'" class="svg-container aries">
      <!-- 白羊座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="aries-symbol">
          <path
            d="M60,140 C90,100 110,100 140,140"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M85,115 C85,80 115,80 115,115"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'taurus'" class="svg-container taurus">
      <!-- 金牛座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="taurus-symbol">
          <circle
            cx="100"
            cy="110"
            r="30"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M50,80 L150,80"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'gemini'" class="svg-container gemini">
      <!-- 双子座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="gemini-symbol">
          <path
            d="M70,60 L70,140"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M130,60 L130,140"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M70,80 L130,80"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M70,120 L130,120"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'cancer'" class="svg-container cancer">
      <!-- 巨蟹座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="cancer-symbol">
          <circle
            cx="80"
            cy="90"
            r="20"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <circle
            cx="120"
            cy="110"
            r="20"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'leo'" class="svg-container leo">
      <!-- 狮子座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="leo-symbol">
          <circle
            cx="100"
            cy="100"
            r="25"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M125,100 C160,100 160,130 125,130"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'virgo'" class="svg-container virgo">
      <!-- 处女座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="virgo-symbol">
          <path
            d="M80,70 L80,130 Q80,150 100,150 Q120,150 120,130 L120,90"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M110,100 L130,100"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'libra'" class="svg-container libra">
      <!-- 天秤座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="libra-symbol">
          <path
            d="M60,100 L140,100"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M60,120 L140,120"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M100,120 L100,140"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'scorpio'" class="svg-container scorpio">
      <!-- 天蝎座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="scorpio-symbol">
          <path
            d="M60,100 L120,100 L140,80 L160,100"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M150,90 L160,80"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view
      v-else-if="zodiac === 'sagittarius'"
      class="svg-container sagittarius"
    >
      <!-- 射手座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="sagittarius-symbol">
          <path
            d="M70,70 L130,130"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M130,70 L130,130 L70,130"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'capricorn'" class="svg-container capricorn">
      <!-- 摩羯座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="capricorn-symbol">
          <path
            d="M60,100 Q90,60 120,100 Q150,140 150,100"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'aquarius'" class="svg-container aquarius">
      <!-- 水瓶座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="aquarius-symbol">
          <path
            d="M60,90 Q80,70 100,90 Q120,110 140,90"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M60,110 Q80,90 100,110 Q120,130 140,110"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else-if="zodiac === 'pisces'" class="svg-container pisces">
      <!-- 双鱼座 SVG 动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="pisces-symbol">
          <circle
            cx="70"
            cy="100"
            r="20"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <circle
            cx="130"
            cy="100"
            r="20"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
          <path
            d="M50,100 L150,100"
            stroke="#FFFFFF"
            stroke-width="4"
            fill="none"
          />
        </g>
      </svg>
    </view>

    <view v-else class="svg-container default">
      <!-- 默认星星动画 -->
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g class="default-symbol">
          <polygon
            points="100,20 115,70 170,70 125,100 145,150 100,120 55,150 75,100 30,70 85,70"
            stroke="#FFFFFF"
            stroke-width="2"
            fill="none"
          />
        </g>
      </svg>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    zodiac: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.svg-animation {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  .svg-container {
    width: 100%;
    height: 100%;

    svg {
      width: 100%;
      height: 100%;

      path,
      circle,
      polygon,
      rect {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: draw 3s linear forwards;
      }

      @keyframes draw {
        to {
          stroke-dashoffset: 0;
        }
      }
    }

    &.aries,
    &.leo,
    &.sagittarius {
      svg {
        path,
        circle,
        polygon,
        rect {
          animation: draw 2s linear forwards,
            glow 2s ease-in-out infinite alternate;
        }
      }
    }

    &.taurus,
    &.virgo,
    &.capricorn {
      svg {
        path,
        circle,
        polygon,
        rect {
          animation: draw 3s linear forwards, pulse 3s ease-in-out infinite;
        }
      }
    }

    &.gemini,
    &.libra,
    &.aquarius {
      svg {
        path,
        circle,
        polygon,
        rect {
          animation: draw 2.5s linear forwards, float 3s ease-in-out infinite;
        }
      }
    }

    &.cancer,
    &.scorpio,
    &.pisces {
      svg {
        path,
        circle,
        polygon,
        rect {
          animation: draw 3.5s linear forwards, wave 4s ease-in-out infinite;
        }
      }
    }
  }
}

@keyframes glow {
  from {
    stroke-width: 4;
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
  }
  to {
    stroke-width: 5;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes wave {
  0% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
  100% {
    transform: rotate(-3deg);
  }
}
</style>
