"use strict";const e=require("../../common/vendor.js"),n={data:()=>({userInfo:{nickname:"",signature:"",birthYear:"1996",birthMonth:"11",birthDay:"3",date:""},startDate:"1920-01-01",endDate:"2100-12-31",years:Array.from({length:100},((e,n)=>((new Date).getFullYear()-99+n).toString())),months:Array.from({length:12},((e,n)=>(n+1).toString())),days:Array.from({length:31},((e,n)=>(n+1).toString()))}),methods:{navigateBack(){e.index.navigateBack()},onYearChange(e){this.userInfo.birthYear=this.years[e.detail.value]},onMonthChange(e){this.userInfo.birthMonth=this.months[e.detail.value]},onDayChange(e){this.userInfo.birthDay=this.days[e.detail.value]},saveUserInfo(){console.log("打印用户信息",this.userInfo),e.index.setStorageSync("isFirstTime",!0),e.index.setStorageSync("userInfo",this.userInfo),e.index.showToast({title:"保存成功",icon:"success",duration:1500}),console.log("保存个人信息，跳转到首页"),setTimeout((()=>{e.index.switchTab({url:"/pages/index/index",success:function(){console.log("成功跳转到首页")},fail:function(n){console.error("跳转失败:",n),e.index.reLaunch({url:"/pages/index/index"})}})}),300)}}};if(!Array){e.resolveComponent("uni-icons")()}Math;const t=e._export_sfc(n,[["render",function(n,t,a,o,r,s){return{a:e.p({type:"left",size:"20"}),b:e.o(((...e)=>s.navigateBack&&s.navigateBack(...e))),c:e.p({type:"more-filled",size:"20"}),d:r.userInfo.nickname,e:e.o((e=>r.userInfo.nickname=e.detail.value)),f:r.userInfo.signature,g:e.o((e=>r.userInfo.signature=e.detail.value)),h:e.t(r.userInfo.birthYear),i:r.years,j:e.o(((...e)=>s.onYearChange&&s.onYearChange(...e))),k:e.t(r.userInfo.birthMonth),l:r.months,m:e.o(((...e)=>s.onMonthChange&&s.onMonthChange(...e))),n:e.t(r.userInfo.birthDay),o:r.days,p:e.o(((...e)=>s.onDayChange&&s.onDayChange(...e))),q:e.o(((...e)=>s.saveUserInfo&&s.saveUserInfo(...e)))}}]]);wx.createPage(t);
