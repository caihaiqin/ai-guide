"use strict";const e=require("../../common/vendor.js"),t=require("./lib/markdown-it.min.js"),l=require("./lib/highlight/uni-highlight.min.js");require("./lib/html-parser.js");const s={__name:"ua-markdown",props:{source:String,showLine:{type:[Boolean,String],default:!0}},setup(s){const r=s;let a=[];const n=t.mt({html:!0,highlight:function(e,t){let s="";try{s=l.$e.highlightAuto(e).value}catch(c){s=n.utils.escapeHtml(e)}let i=s.split(/\n/).slice(0,-1).map(((e,t)=>""==e?"":'<li><span class="line-num" data-line="'+(t+1)+'"></span>'+e+"</li>")).join("");i=r.showLine?'<ol style="padding: 0px 30px;">'+i+"</ol>":'<ol style="padding: 0px 7px;list-style:none;">'+i+"</ol>",a.push(e);let o='<div class="markdown-wrap">';return o+=`<pre class="hljs" style="padding:10px 8px 0;margin-bottom:5px;overflow: auto;display: block;border-radius: 5px;"><code>${i}</code></pre>`,o+="</div>",o}}),i=e=>{if(!e)return;let t="";if((e=(e=e.replace(/<br>|<br\/>|<br \/>/g,"\n")).replace(/&nbsp;/g," ")).split("```").length%2){let l=e;"\n"!=l[l.length-1]&&(l+="\n"),t=n.render(l)}else t=n.render(e);return t=t.replace(/<table/g,'<table class="table"'),t=t.replace(/<tr/g,'<tr class="tr"'),t=t.replace(/<th>/g,'<th class="th">'),t=t.replace(/<td/g,'<td class="td"'),t=t.replace(/<hr>|<hr\/>|<hr \/>/g,'<hr class="hr">'),t},o=t=>{let{attrs:l}=t.detail.node,{"code-data-index":s,class:r}=l;"copy-btn"==r&&e.index.setClipboardData({data:a[s],showToast:!1,success(){e.index.showToast({title:"复制成功",icon:"none"})}})};return(t,l)=>({a:i(s.source),b:e.o(o)})}},r=e._export_sfc(s,[["__scopeId","data-v-4614c01d"]]);wx.createComponent(r);
