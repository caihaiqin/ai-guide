"use strict";const t=require("../common/vendor.js"),a=require("../utils/zodiac.js"),e={props:{birthMonth:{type:[Number,String],default:1},birthDay:{type:[Number,String],default:1},showSymbols:{type:Boolean,default:!0},showParticles:{type:Boolean,default:!0},symbolsCount:{type:Number,default:12},particlesCount:{type:Number,default:30},showBackgroundVideo:{type:Boolean,default:!0},playBackgroundMusic:{type:Boolean,default:!0}},data:()=>({zodiacSign:null,backgroundStyle:{},elementClass:"",symbols:[],particles:[],bgVideoOpacity:.6,internalPlayMusic:!1,bgAudioManager:null}),created(){if(this.zodiacSign=a.getZodiacSign(this.birthMonth,this.birthDay),this.internalPlayMusic=this.playBackgroundMusic,this.zodiacSign){const t=a.getZodiacElement(this.zodiacSign.engName);this.elementClass=t.type,this.setBackgroundStyle(t.color),this.showSymbols&&this.generateSymbols(),this.showParticles&&this.generateParticles()}this.initBackgroundMusic()},watch:{playBackgroundMusic(t){this.internalPlayMusic=t}},mounted(){setTimeout((()=>{this.initBackgroundMusic(),this.initBackgroundVideo()}),1e3)},methods:{onVideoError(t){console.error("背景视频播放错误:",t)},toggleBackgroundMusic(a){if(this.internalPlayMusic&&!a)this.bgAudioManager&&this.bgAudioManager.pause(),this.internalPlayMusic=!1,this.$emit("update:playBackgroundMusic",!1);else{this.internalPlayMusic=!0,this.$emit("update:playBackgroundMusic",!0);try{this.bgAudioManager||(this.bgAudioManager=t.index.getBackgroundAudioManager(),this.bgAudioManager.title="背景音乐",this.bgAudioManager.src="https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/music/backgroud-music/backgroud-music-1.MP3"),this.bgAudioManager.play()}catch(e){console.error("小程序音频播放失败:",e)}}},setBackgroundStyle(t){if(this.zodiacSign)switch(this.elementClass){case"fire":this.backgroundStyle={background:`linear-gradient(to bottom, ${t}, #8B2500)`};break;case"earth":this.backgroundStyle={background:`linear-gradient(to bottom, ${t}, #556B2F)`};break;case"air":this.backgroundStyle={background:`linear-gradient(to bottom, ${t}, #00688B)`};break;case"water":this.backgroundStyle={background:`linear-gradient(to bottom, ${t}, #27408B)`};break;default:this.backgroundStyle={background:`linear-gradient(to bottom, ${t}, #333333)`}}},generateSymbols(){this.symbols=Array.from({length:this.symbolsCount},(()=>({x:100*Math.random(),y:100*Math.random(),opacity:.1+.5*Math.random(),scale:.5+1*Math.random(),rotate:360*Math.random(),delay:5*Math.random()})))},generateParticles(){this.particles=Array.from({length:this.particlesCount},(()=>({x:100*Math.random(),y:100*Math.random(),size:3+10*Math.random(),opacity:.1+.7*Math.random(),duration:10+20*Math.random(),delay:5*Math.random()})))},initBackgroundMusic(){this.toggleBackgroundMusic(!0)},initBackgroundVideo(){try{const a=t.index.createVideoContext("bgVideo",this);a&&a.play()}catch(a){console.error("小程序视频播放失败:",a)}}}};const i=t._export_sfc(e,[["render",function(a,e,i,o,r,s){return t.e({a:i.showBackgroundVideo},i.showBackgroundVideo?{b:t.o(((...t)=>s.onVideoError&&s.onVideoError(...t)))}:{},{c:r.bgVideoOpacity,d:r.internalPlayMusic},(r.internalPlayMusic,{}),{e:i.showSymbols},i.showSymbols?{f:t.f(r.symbols,((t,a,e)=>({a:a,b:t.x+"%",c:t.y+"%",d:t.opacity,e:`scale(${t.scale}) rotate(${t.rotate}deg)`,f:t.delay+"s"})))}:{},{g:i.showParticles},i.showParticles?{h:t.f(r.particles,((t,a,e)=>({a:a,b:t.x+"%",c:t.y+"%",d:t.size+"px",e:t.size+"px",f:t.opacity,g:t.duration+"s",h:t.delay+"s"}))),i:t.n(r.elementClass)}:{},{j:t.s(r.backgroundStyle)})}]]);wx.createComponent(i);
