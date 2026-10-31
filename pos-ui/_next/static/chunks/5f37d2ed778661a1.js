(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,69426,e=>{"use strict";function t(e){let t=String(e??"").replace(/^OFF-/i,"").replace(/-/g,"").slice(0,12);return/^[0-9a-f]{12}$/i.test(t)?`9${parseInt(t,16).toString().padStart(15,"0")}`:null}e.s(["OFFLINE_RECEIPT_BARCODE_PATTERN",0,/^9\d{15}$/,"offlineReceiptBarcodeValue",()=>t])},95433,e=>{"use strict";let t=["212222","222122","222221","121223","121322","131222","122213","122312","132212","221213","221312","231212","112232","122132","122231","113222","123122","123221","223211","221132","221231","213212","223112","312131","311222","321122","321221","312212","322112","322211","212123","212321","232121","111323","131123","131321","112313","132113","132311","211313","231113","231311","112133","112331","132131","113123","113321","133121","313121","211331","231131","213113","213311","213131","311123","311321","331121","312113","312311","332111","314111","221411","431111","111224","111422","121124","121421","141122","141221","112214","112412","122114","122411","142112","142211","241211","221114","413111","241112","134111","111242","121142","121241","114212","124112","124211","411212","421112","421211","212141","214121","412121","111143","111341","131141","114113","114311","411113","411311","113141","114131","311141","411131","211412","211214","211232","2331112"],i={height:52,moduleWidth:2,includeText:!0,includeTextFontSize:10,quietZoneModules:10};function r(e,r){let a,o={...i,...r??{}},n=(e??"").toUpperCase().trim(),s=/^\d+$/.test(n),d=s?(a=(n??"").replace(/\D/g,""))||"0":n.replace(/[^\x20-\x7E]/g,"")||"0",l=[];if(s){d.length%2==1&&(d=`0${d}`),l.push(105);for(let e=0;e<d.length;e+=2)l.push(Number.parseInt(d.slice(e,e+2),10))}else for(let e of(l.push(104),d))l.push(e.charCodeAt(0)-32);let c=l[0];for(let e=1;e<l.length;e+=1)c+=l[e]*e;l.push(c%103),l.push(106);let p=o.moduleWidth*o.quietZoneModules,u=p,m=[];l.forEach(e=>{let i=t[e];if(i)for(let e=0;e<i.length;e+=1){let t=e%2==0,r=Number.parseInt(i[e],10)*o.moduleWidth;t&&m.push(`<rect x="${u.toFixed(2)}" y="0" width="${r.toFixed(2)}" height="${o.height}" fill="#000" />`),u+=r}}),u+=p;let g=o.includeText?`<text x="50%" y="${(o.height+o.includeTextFontSize).toFixed(2)}" font-family="monospace" font-size="${o.includeTextFontSize}" font-weight="700" text-anchor="middle" fill="#0f172a">${d}</text>`:"",v=o.height+16*!!o.includeText;return`<svg xmlns="http://www.w3.org/2000/svg" width="${u.toFixed(2)}" height="${v.toFixed(2)}" viewBox="0 0 ${u.toFixed(2)} ${v.toFixed(2)}">${m.join("")}${g}</svg>`}e.s(["generateCode128Svg",()=>r])},90063,78692,50910,e=>{"use strict";let t,i,r,a,o,n,s;var d=e.i(47167),l=e.i(95433),c=e.i(69426),p=e.i(56828);let u=(e,t)=>{if(null==e)return t;let i=e.trim().toLowerCase();return!["0","false","no","off"].includes(i)&&(!!["1","true","yes","on"].includes(i)||t)},m=u(d.default.env.NEXT_PUBLIC_REQUIRE_FREE_SALE_REASON,!0),g=u(d.default.env.NEXT_PUBLIC_SHOW_FREE_SALE_TRACEABILITY_REPORT,m),v=u(d.default.env.NEXT_PUBLIC_ENABLE_POS_CASH_EXPENSES,!0),h=u(d.default.env.NEXT_PUBLIC_ENABLE_POS_MOVEMENT_CLOSURE_TICKET,!0),f=u(d.default.env.NEXT_PUBLIC_ENABLE_LOYALTY_QR_TICKETS,!1);e.s(["ENABLE_LOYALTY_QR_TICKETS",0,f,"ENABLE_POS_CASH_EXPENSES",0,v,"ENABLE_POS_MOVEMENT_CLOSURE_TICKET",0,h,"REQUIRE_FREE_SALE_REASON",0,m,"SHOW_FREE_SALE_TRACEABILITY_REPORT",0,g],78692);let b=function(e,t){let i=e,r=x[t],a=null,o=0,n=null,s=[],d={},l=function(e,t){a=function(e){let t=Array(e);for(let i=0;i<e;i+=1){t[i]=Array(e);for(let r=0;r<e;r+=1)t[i][r]=null}return t}(o=4*i+17),c(0,0),c(o-7,0),c(0,o-7),m(),u(),v(e,t),i>=7&&g(e),null==n&&(n=b(i,r,s)),h(n,t)},c=function(e,t){for(let i=-1;i<=7;i+=1)if(!(e+i<=-1)&&!(o<=e+i))for(let r=-1;r<=7;r+=1)t+r<=-1||o<=t+r||(0<=i&&i<=6&&(0==r||6==r)||0<=r&&r<=6&&(0==i||6==i)||2<=i&&i<=4&&2<=r&&r<=4?a[e+i][t+r]=!0:a[e+i][t+r]=!1)},p=function(){let e=0,t=0;for(let i=0;i<8;i+=1){l(!0,i);let r=$.getLostPoint(d);(0==i||e>r)&&(e=r,t=i)}return t},u=function(){for(let e=8;e<o-8;e+=1)null==a[e][6]&&(a[e][6]=e%2==0);for(let e=8;e<o-8;e+=1)null==a[6][e]&&(a[6][e]=e%2==0)},m=function(){let e=$.getPatternPosition(i);for(let t=0;t<e.length;t+=1)for(let i=0;i<e.length;i+=1){let r=e[t],o=e[i];if(null==a[r][o])for(let e=-2;e<=2;e+=1)for(let t=-2;t<=2;t+=1)-2==e||2==e||-2==t||2==t||0==e&&0==t?a[r+e][o+t]=!0:a[r+e][o+t]=!1}},g=function(e){let t=$.getBCHTypeNumber(i);for(let i=0;i<18;i+=1){let r=!e&&(t>>i&1)==1;a[Math.floor(i/3)][i%3+o-8-3]=r}for(let i=0;i<18;i+=1){let r=!e&&(t>>i&1)==1;a[i%3+o-8-3][Math.floor(i/3)]=r}},v=function(e,t){let i=r<<3|t,n=$.getBCHTypeInfo(i);for(let t=0;t<15;t+=1){let i=!e&&(n>>t&1)==1;t<6?a[t][8]=i:t<8?a[t+1][8]=i:a[o-15+t][8]=i}for(let t=0;t<15;t+=1){let i=!e&&(n>>t&1)==1;t<8?a[8][o-t-1]=i:t<9?a[8][15-t-1+1]=i:a[8][15-t-1]=i}a[o-8][8]=!e},h=function(e,t){let i=-1,r=o-1,n=7,s=0,d=$.getMaskFunction(t);for(let t=o-1;t>0;t-=2)for(6==t&&(t-=1);;){for(let i=0;i<2;i+=1)if(null==a[r][t-i]){let o=!1;s<e.length&&(o=(e[s]>>>n&1)==1),d(r,t-i)&&(o=!o),a[r][t-i]=o,-1==(n-=1)&&(s+=1,n=7)}if((r+=i)<0||o<=r){r-=i,i=-i;break}}},f=function(e,t){let i=0,r=0,a=0,o=Array(t.length),n=Array(t.length);for(let s=0;s<t.length;s+=1){let d=t[s].dataCount,l=t[s].totalCount-d;r=Math.max(r,d),a=Math.max(a,l),o[s]=Array(d);for(let t=0;t<o[s].length;t+=1)o[s][t]=255&e.getBuffer()[t+i];i+=d;let c=$.getErrorCorrectPolynomial(l),p=w(o[s],c.getLength()-1).mod(c);n[s]=Array(c.getLength()-1);for(let e=0;e<n[s].length;e+=1){let t=e+p.getLength()-n[s].length;n[s][e]=t>=0?p.getAt(t):0}}let s=0;for(let e=0;e<t.length;e+=1)s+=t[e].totalCount;let d=Array(s),l=0;for(let e=0;e<r;e+=1)for(let i=0;i<t.length;i+=1)e<o[i].length&&(d[l]=o[i][e],l+=1);for(let e=0;e<a;e+=1)for(let i=0;i<t.length;i+=1)e<n[i].length&&(d[l]=n[i][e],l+=1);return d},b=function(e,t,i){let r=A.getRSBlocks(e,t),a=S();for(let t=0;t<i.length;t+=1){let r=i[t];a.put(r.getMode(),4),a.put(r.getLength(),$.getLengthInBits(r.getMode(),e)),r.write(a)}let o=0;for(let e=0;e<r.length;e+=1)o+=r[e].dataCount;if(a.getLengthInBits()>8*o)throw"code length overflow. ("+a.getLengthInBits()+">"+8*o+")";for(a.getLengthInBits()+4<=8*o&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(!1);for(;!(a.getLengthInBits()>=8*o)&&(a.put(236,8),!(a.getLengthInBits()>=8*o));){;a.put(17,8)}return f(a,r)};d.addData=function(e,t){let i=null;switch(t=t||"Byte"){case"Numeric":i=_(e);break;case"Alphanumeric":i=C(e);break;case"Byte":i=N(e);break;case"Kanji":i=E(e);break;default:throw"mode:"+t}s.push(i),n=null},d.isDark=function(e,t){if(e<0||o<=e||t<0||o<=t)throw e+","+t;return a[e][t]},d.getModuleCount=function(){return o},d.make=function(){if(i<1){let e=1;for(;e<40;e++){let t=A.getRSBlocks(e,r),i=S();for(let t=0;t<s.length;t++){let r=s[t];i.put(r.getMode(),4),i.put(r.getLength(),$.getLengthInBits(r.getMode(),e)),r.write(i)}let a=0;for(let e=0;e<t.length;e++)a+=t[e].dataCount;if(i.getLengthInBits()<=8*a)break}i=e}l(!1,p())},d.createTableTag=function(e,t){e=e||2;let i="";i+='<table style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: '+(t=void 0===t?4*e:t)+'px;"><tbody>';for(let t=0;t<d.getModuleCount();t+=1){i+="<tr>";for(let r=0;r<d.getModuleCount();r+=1)i+='<td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: '+e+"px;"+(" height: "+e)+"px; background-color: "+(d.isDark(t,r)?"#000000":"#ffffff")+';"/>';i+="</tr>"}return i+"</tbody></table>"},d.createSvgTag=function(e,t,i,r){let a={};"object"==typeof arguments[0]&&(a=arguments[0],e=a.cellSize,t=a.margin,i=a.alt,r=a.title),e=e||2,t=void 0===t?4*e:t,(i="string"==typeof i?{text:i}:i||{}).text=i.text||null,i.id=i.text?i.id||"qrcode-description":null,(r="string"==typeof r?{text:r}:r||{}).text=r.text||null,r.id=r.text?r.id||"qrcode-title":null;let o=d.getModuleCount()*e+2*t,n,s,l,c="",p;for(p="l"+e+",0 0,"+e+" -"+e+",0 0,-"+e+"z ",c+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',c+=a.scalable?"":' width="'+o+'px" height="'+o+'px"',c+=' viewBox="0 0 '+o+" "+o+'" ',c+=' preserveAspectRatio="xMinYMin meet"',c+=r.text||i.text?' role="img" aria-labelledby="'+y([r.id,i.id].join(" ").trim())+'"':"",c+=">",c+=r.text?'<title id="'+y(r.id)+'">'+y(r.text)+"</title>":"",c+=i.text?'<description id="'+y(i.id)+'">'+y(i.text)+"</description>":"",c+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',c+='<path d="',s=0;s<d.getModuleCount();s+=1)for(n=0,l=s*e+t;n<d.getModuleCount();n+=1)d.isDark(s,n)&&(c+="M"+(n*e+t)+","+l+p);return c+='" stroke="transparent" fill="black"/>',c+="</svg>"},d.createDataURL=function(e,t){e=e||2,t=void 0===t?4*e:t;let i=d.getModuleCount()*e+2*t,r=t,a=i-t;return B(i,i,function(t,i){if(!(r<=t)||!(t<a)||!(r<=i)||!(i<a))return 1;{let a=Math.floor((t-r)/e),o=Math.floor((i-r)/e);return+!d.isDark(o,a)}})},d.createImgTag=function(e,t,i){e=e||2,t=void 0===t?4*e:t;let r=d.getModuleCount()*e+2*t,a="";return a+="<img",a+=' src="',a+=d.createDataURL(e,t),a+='"',a+=' width="',a+=r,a+='"',a+=' height="',a+=r,a+='"',i&&(a+=' alt="',a+=y(i),a+='"'),a+="/>"};let y=function(e){let t="";for(let i=0;i<e.length;i+=1){let r=e.charAt(i);switch(r){case"<":t+="&lt;";break;case">":t+="&gt;";break;case"&":t+="&amp;";break;case'"':t+="&quot;";break;default:t+=r}}return t},T=function(e){let t,i,r,a,o;e=void 0===e?2:e;let n=+d.getModuleCount()+2*e,s=e,l=n-e,c={"██":"█","█ ":"▀"," █":"▄","  ":" "},p={"██":"▀","█ ":"▀"," █":" ","  ":" "},u="";for(t=0;t<n;t+=2){for(i=0,r=Math.floor((t-s)/1),a=Math.floor((t+1-s)/1);i<n;i+=1)o="█",s<=i&&i<l&&s<=t&&t<l&&d.isDark(r,Math.floor((i-s)/1))&&(o=" "),s<=i&&i<l&&s<=t+1&&t+1<l&&d.isDark(a,Math.floor((i-s)/1))?o+=" ":o+="█",u+=e<1&&t+1>=l?p[o]:c[o];u+="\n"}return n%2&&e>0?u.substring(0,u.length-n-1)+Array(n+1).join("▀"):u.substring(0,u.length-1)};return d.createASCII=function(e,t){let i,r,a,o;if((e=e||1)<2)return T(t);e-=1,t=void 0===t?2*e:t;let n=d.getModuleCount()*e+2*t,s=t,l=n-t,c=Array(e+1).join("██"),p=Array(e+1).join("  "),u="",m="";for(i=0;i<n;i+=1){for(r=0,a=Math.floor((i-s)/e),m="";r<n;r+=1)o=1,s<=r&&r<l&&s<=i&&i<l&&d.isDark(a,Math.floor((r-s)/e))&&(o=0),m+=o?c:p;for(a=0;a<e;a+=1)u+=m+"\n"}return u.substring(0,u.length-1)},d.renderTo2dContext=function(e,t){t=t||2;let i=d.getModuleCount();for(let r=0;r<i;r++)for(let a=0;a<i;a++)e.fillStyle=d.isDark(r,a)?"black":"white",e.fillRect(a*t,r*t,t,t)},d};b.stringToBytes=function(e){let t=[];for(let i=0;i<e.length;i+=1){let r=e.charCodeAt(i);t.push(255&r)}return t},b.createStringToBytes=function(e,t){let i=function(){let i=k(e),r=function(){let e=i.read();if(-1==e)throw"eof";return e},a=0,o={};for(;;){let e=i.read();if(-1==e)break;let t=r(),n=r(),s=r(),d=String.fromCharCode(e<<8|t),l=n<<8|s;o[d]=l,a+=1}if(a!=t)throw a+" != "+t;return o}();return function(e){let t=[];for(let r=0;r<e.length;r+=1){let a=e.charCodeAt(r);if(a<128)t.push(a);else{let a=i[e.charAt(r)];"number"==typeof a?(255&a)==a?t.push(a):(t.push(a>>>8),t.push(255&a)):t.push(63)}}return t}};let x={L:1,M:0,Q:3,H:2},$=(t=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],i={},r=function(e){let t=0;for(;0!=e;)t+=1,e>>>=1;return t},i.getBCHTypeInfo=function(e){let t=e<<10;for(;r(t)-r(1335)>=0;)t^=1335<<r(t)-r(1335);return(e<<10|t)^21522},i.getBCHTypeNumber=function(e){let t=e<<12;for(;r(t)-r(7973)>=0;)t^=7973<<r(t)-r(7973);return e<<12|t},i.getPatternPosition=function(e){return t[e-1]},i.getMaskFunction=function(e){switch(e){case 0:return function(e,t){return(e+t)%2==0};case 1:return function(e,t){return e%2==0};case 2:return function(e,t){return t%3==0};case 3:return function(e,t){return(e+t)%3==0};case 4:return function(e,t){return(Math.floor(e/2)+Math.floor(t/3))%2==0};case 5:return function(e,t){return e*t%2+e*t%3==0};case 6:return function(e,t){return(e*t%2+e*t%3)%2==0};case 7:return function(e,t){return(e*t%3+(e+t)%2)%2==0};default:throw"bad maskPattern:"+e}},i.getErrorCorrectPolynomial=function(e){let t=w([1],0);for(let i=0;i<e;i+=1)t=t.multiply(w([1,y.gexp(i)],0));return t},i.getLengthInBits=function(e,t){if(1<=t&&t<10)switch(e){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+e}if(t<27)switch(e){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+e}if(t<41)switch(e){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+e}throw"type:"+t},i.getLostPoint=function(e){let t=e.getModuleCount(),i=0;for(let r=0;r<t;r+=1)for(let a=0;a<t;a+=1){let o=0,n=e.isDark(r,a);for(let i=-1;i<=1;i+=1)if(!(r+i<0)&&!(t<=r+i))for(let s=-1;s<=1;s+=1)a+s<0||t<=a+s||(0!=i||0!=s)&&n==e.isDark(r+i,a+s)&&(o+=1);o>5&&(i+=3+o-5)}for(let r=0;r<t-1;r+=1)for(let a=0;a<t-1;a+=1){let t=0;e.isDark(r,a)&&(t+=1),e.isDark(r+1,a)&&(t+=1),e.isDark(r,a+1)&&(t+=1),e.isDark(r+1,a+1)&&(t+=1),(0==t||4==t)&&(i+=3)}for(let r=0;r<t;r+=1)for(let a=0;a<t-6;a+=1)e.isDark(r,a)&&!e.isDark(r,a+1)&&e.isDark(r,a+2)&&e.isDark(r,a+3)&&e.isDark(r,a+4)&&!e.isDark(r,a+5)&&e.isDark(r,a+6)&&(i+=40);for(let r=0;r<t;r+=1)for(let a=0;a<t-6;a+=1)e.isDark(a,r)&&!e.isDark(a+1,r)&&e.isDark(a+2,r)&&e.isDark(a+3,r)&&e.isDark(a+4,r)&&!e.isDark(a+5,r)&&e.isDark(a+6,r)&&(i+=40);let r=0;for(let i=0;i<t;i+=1)for(let a=0;a<t;a+=1)e.isDark(a,i)&&(r+=1);return i+10*(Math.abs(100*r/t/t-50)/5)},i),y=function(){let e=Array(256),t=Array(256);for(let t=0;t<8;t+=1)e[t]=1<<t;for(let t=8;t<256;t+=1)e[t]=e[t-4]^e[t-5]^e[t-6]^e[t-8];for(let i=0;i<255;i+=1)t[e[i]]=i;let i={};return i.glog=function(e){if(e<1)throw"glog("+e+")";return t[e]},i.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return e[t]},i}(),w=function(e,t){if(void 0===e.length)throw e.length+"/"+t;let i=function(){let i=0;for(;i<e.length&&0==e[i];)i+=1;let r=Array(e.length-i+t);for(let t=0;t<e.length-i;t+=1)r[t]=e[t+i];return r}(),r={};return r.getAt=function(e){return i[e]},r.getLength=function(){return i.length},r.multiply=function(e){let t=Array(r.getLength()+e.getLength()-1);for(let i=0;i<r.getLength();i+=1)for(let a=0;a<e.getLength();a+=1)t[i+a]^=y.gexp(y.glog(r.getAt(i))+y.glog(e.getAt(a)));return w(t,0)},r.mod=function(e){if(r.getLength()-e.getLength()<0)return r;let t=y.glog(r.getAt(0))-y.glog(e.getAt(0)),i=Array(r.getLength());for(let e=0;e<r.getLength();e+=1)i[e]=r.getAt(e);for(let r=0;r<e.getLength();r+=1)i[r]^=y.gexp(y.glog(e.getAt(r))+t);return w(i,0).mod(e)},r},A=(a=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],o=function(e,t){let i={};return i.totalCount=e,i.dataCount=t,i},n={},s=function(e,t){switch(t){case x.L:return a[(e-1)*4+0];case x.M:return a[(e-1)*4+1];case x.Q:return a[(e-1)*4+2];case x.H:return a[(e-1)*4+3];default:return}},n.getRSBlocks=function(e,t){let i=s(e,t);if(void 0===i)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;let r=i.length/3,a=[];for(let e=0;e<r;e+=1){let t=i[3*e+0],r=i[3*e+1],n=i[3*e+2];for(let e=0;e<t;e+=1)a.push(o(r,n))}return a},n),S=function(){let e=[],t=0,i={};return i.getBuffer=function(){return e},i.getAt=function(t){return(e[Math.floor(t/8)]>>>7-t%8&1)==1},i.put=function(e,t){for(let r=0;r<t;r+=1)i.putBit((e>>>t-r-1&1)==1)},i.getLengthInBits=function(){return t},i.putBit=function(i){let r=Math.floor(t/8);e.length<=r&&e.push(0),i&&(e[r]|=128>>>t%8),t+=1},i},_=function(e){let t={};t.getMode=function(){return 1},t.getLength=function(t){return e.length},t.write=function(t){let r=0;for(;r+2<e.length;)t.put(i(e.substring(r,r+3)),10),r+=3;r<e.length&&(e.length-r==1?t.put(i(e.substring(r,r+1)),4):e.length-r==2&&t.put(i(e.substring(r,r+2)),7))};let i=function(e){let t=0;for(let i=0;i<e.length;i+=1)t=10*t+r(e.charAt(i));return t},r=function(e){if("0"<=e&&e<="9")return e.charCodeAt(0)-48;throw"illegal char :"+e};return t},C=function(e){let t={};t.getMode=function(){return 2},t.getLength=function(t){return e.length},t.write=function(t){let r=0;for(;r+1<e.length;)t.put(45*i(e.charAt(r))+i(e.charAt(r+1)),11),r+=2;r<e.length&&t.put(i(e.charAt(r)),6)};let i=function(e){if("0"<=e&&e<="9")return e.charCodeAt(0)-48;if("A"<=e&&e<="Z")return e.charCodeAt(0)-65+10;switch(e){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+e}};return t},N=function(e){let t=b.stringToBytes(e),i={};return i.getMode=function(){return 4},i.getLength=function(e){return t.length},i.write=function(e){for(let i=0;i<t.length;i+=1)e.put(t[i],8)},i},E=function(e){let t=b.stringToBytes,i=t("友");if(2!=i.length||(i[0]<<8|i[1])!=38726)throw"sjis not supported.";let r=t(e),a={};return a.getMode=function(){return 8},a.getLength=function(e){return~~(r.length/2)},a.write=function(e){let t=0;for(;t+1<r.length;){let i=(255&r[t])<<8|255&r[t+1];if(33088<=i&&i<=40956)i-=33088;else if(57408<=i&&i<=60351)i-=49472;else throw"illegal char at "+(t+1)+"/"+i;i=(i>>>8&255)*192+(255&i),e.put(i,13),t+=2}if(t<r.length)throw"illegal char at "+(t+1)},a},T=function(){let e=[],t={};return t.writeByte=function(t){e.push(255&t)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,i,r){i=i||0,r=r||e.length;for(let a=0;a<r;a+=1)t.writeByte(e[a+i])},t.writeString=function(e){for(let i=0;i<e.length;i+=1)t.writeByte(e.charCodeAt(i))},t.toByteArray=function(){return e},t.toString=function(){let t="";t+="[";for(let i=0;i<e.length;i+=1)i>0&&(t+=","),t+=e[i];return t+"]"},t},D=function(){let e=0,t=0,i=0,r="",a={},o=function(e){r+=String.fromCharCode(n(63&e))},n=function(e){if(e<0)throw"n:"+e;if(e<26)return 65+e;if(e<52)return 97+(e-26);if(e<62)return 48+(e-52);if(62==e)return 43;else if(63==e)return 47;else throw"n:"+e};return a.writeByte=function(r){for(e=e<<8|255&r,t+=8,i+=1;t>=6;)o(e>>>t-6),t-=6},a.flush=function(){if(t>0&&(o(e<<6-t),e=0,t=0),i%3!=0){let e=3-i%3;for(let t=0;t<e;t+=1)r+="="}},a.toString=function(){return r},a},k=function(e){let t=0,i=0,r=0,a={};a.read=function(){for(;r<8;){if(t>=e.length){if(0==r)return -1;throw"unexpected end of file./"+r}let a=e.charAt(t);if(t+=1,"="==a)return r=0,-1;a.match(/^\s$/)||(i=i<<6|o(a.charCodeAt(0)),r+=6)}let a=i>>>r-8&255;return r-=8,a};let o=function(e){if(65<=e&&e<=90)return e-65;if(97<=e&&e<=122)return e-97+26;if(48<=e&&e<=57)return e-48+52;if(43==e)return 62;if(47==e)return 63;else throw"c:"+e};return a},P=function(e,t){let i=Array(e*t),r={};r.setPixel=function(t,r,a){i[r*e+t]=a},r.write=function(i){i.writeString("GIF87a"),i.writeShort(e),i.writeShort(t),i.writeByte(128),i.writeByte(0),i.writeByte(0),i.writeByte(0),i.writeByte(0),i.writeByte(0),i.writeByte(255),i.writeByte(255),i.writeByte(255),i.writeString(","),i.writeShort(0),i.writeShort(0),i.writeShort(e),i.writeShort(t),i.writeByte(0);let r=o(2);i.writeByte(2);let a=0;for(;r.length-a>255;)i.writeByte(255),i.writeBytes(r,a,255),a+=255;i.writeByte(r.length-a),i.writeBytes(r,a,r.length-a),i.writeByte(0),i.writeString(";")};let a=function(e){let t=0,i=0,r={};return r.write=function(r,a){if(r>>>a!=0)throw"length over";for(;t+a>=8;)e.writeByte(255&(r<<t|i)),a-=8-t,r>>>=8-t,i=0,t=0;i=r<<t|i,t+=a},r.flush=function(){t>0&&e.writeByte(i)},r},o=function(e){let t=1<<e,r=(1<<e)+1,o=e+1,s=n();for(let e=0;e<t;e+=1)s.add(String.fromCharCode(e));s.add(String.fromCharCode(t)),s.add(String.fromCharCode(r));let d=T(),l=a(d);l.write(t,o);let c=0,p=String.fromCharCode(i[0]);for(c+=1;c<i.length;){let e=String.fromCharCode(i[c]);c+=1,s.contains(p+e)?p+=e:(l.write(s.indexOf(p),o),4095>s.size()&&(s.size()==1<<o&&(o+=1),s.add(p+e)),p=e)}return l.write(s.indexOf(p),o),l.write(r,o),l.flush(),d.toByteArray()},n=function(){let e={},t=0,i={};return i.add=function(r){if(i.contains(r))throw"dup key:"+r;e[r]=t,t+=1},i.size=function(){return t},i.indexOf=function(t){return e[t]},i.contains=function(t){return void 0!==e[t]},i};return r},B=function(e,t,i){let r=P(e,t);for(let a=0;a<t;a+=1)for(let t=0;t<e;t+=1)r.setPixel(t,a,i(t,a));let a=T();r.write(a);let o=D(),n=a.toByteArray();for(let e=0;e<n.length;e+=1)o.writeByte(n[e]);return o.flush(),"data:image/gif;base64,"+o};function M(e){let t=Math.max(0,Number(e?.reconciled_amount||0));if(t<=0)return[];let i=(e?.resolution_history??[]).filter(e=>"reconcile"===e.action).map(e=>({amount:Math.max(0,Number(e.amount||0)),reference:"string"==typeof e.reference&&e.reference.trim()?e.reference.trim():void 0,reconciledAt:"string"==typeof e.created_at?e.created_at:void 0})).filter(e=>Number.isFinite(e.amount)&&e.amount>0),r=i.reduce((e,t)=>e+t.amount,0);return r<t-.01&&i.push({amount:t-r,reference:e?.resolution_reference?.trim()||void 0,reconciledAt:e?.resolved_at??e?.updated_at??void 0}),i}function z(e){if(!e?.name)return;let t={name:e.name};return e.phone&&(t.phone=e.phone),e.email&&(t.email=e.email),e.taxId&&(t.taxId=e.taxId),e.address&&(t.address=e.address),t}b.stringToBytes,e.s(["buildSeparatedTicketReconciliations",()=>M],50910);let L="Kensar Electronic",V="Cra. 15 #123 - Bogotá",I="+57 300 000 0000",j="NIT 900000000-0",R="contacto@kensar.com",O="Gracias por tu compra.",F=/^\s*\[\[align=(left|center|right)\]\]\s*\n?/i;function q(e){let t=(e??"").replace(/\r\n/g,"\n"),i=t.match(F),r=i?.[1]??"center";return{text:t.replace(F,""),align:r}}let U=e=>{let t=e?.trim();if(!t)return"";if(/^data:/i.test(t))return t;let i=(()=>{if(window.location?.origin)return window.location.origin;let e="undefined"!=typeof globalThis?globalThis.location:void 0;return e?.origin?e.origin:d.default.env.NEXT_PUBLIC_APP_URL??""})(),r=(()=>{let e=d.default.env.NEXT_PUBLIC_API_BASE_URL?.trim();if(e)return e.replace(/\/$/,"");if(window.location){let{protocol:e,hostname:t,port:i}=window.location;return`${e}//${t}:${i&&"3000"!==i?i:"8000"}`}let t="undefined"!=typeof globalThis?globalThis.location:void 0;return t?.origin?t.origin.replace(/\/$/,""):""})();if(/^https?:\/\//i.test(t))try{return new URL(t).toString()}catch{return t}if(t.startsWith("//")){let e=i?new URL(i).protocol:r?new URL(r).protocol:"https:";return`${e}${t}`}let a=t.startsWith("/")?t:`/${t}`,o=/^\/?uploads\//i.test(a)?r||i:i||r;if(!o)return t;let n=o.replace(/\/$/,"");return`${n}${a}`},H=e=>{let t=e?.logoUrl??e?.logo_url??e?.ticket_logo_url??"";return t?.trim()||void 0};function W(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function G(e){return e.replace(/\r\n/g,"\n").split("\n").map(e=>{let t,i,r=e.length>0?1===(i=(t=W(e)).split("**")).length?t:i.map((e,t)=>t%2==0?e:`<strong>${e}</strong>`).join(""):"&nbsp;";return`<div>${r}</div>`}).join("")}function Y(e){return`$ ${e.toLocaleString("es-CO",{minimumFractionDigits:0,maximumFractionDigits:0})}`}function Q(e){let t=Y(Math.abs(e));return e<0?`-${t}`:t}function X(e){return e?(0,p.formatBogotaDate)(e,{dateStyle:"short",timeStyle:"short"})||e:""}function K(e,t){if(!e?.length)return"";let i=0,r=0,a=e.map(e=>{let a="sale"===e.document_type?"Venta original":"change"===e.document_type?`Cambio ${++i}`:`Devoluci\xf3n ${++r}`,o=["voided","anulado","cancelled","canceled"].includes((e.status||"").toLowerCase())?" · ANULADO":"",n=e.document_number===t,s=(e.items??[]).map(e=>{let t="purchased"===e.action?"Compró":"received"===e.action?"Cliente recibió":"Cliente devolvió",i=Number.isInteger(e.quantity)?e.quantity.toString():e.quantity.toLocaleString("es-CO",{maximumFractionDigits:3});return`<div class="history-product"><strong>${W(t)}:</strong> ${W(i)} \xd7 ${W(e.product_name)}</div>`}).join("");return`<div class="history-row${n?" history-current":""}">
      <div><strong>${W(a)}</strong>${o}${n?" · ESTE DOCUMENTO":""}</div>
      <div>${W(e.document_number)} \xb7 ${W(X(e.created_at))}</div>
      ${s}
    </div>`}).join(""),o=e.filter(e=>"change"===e.document_type).length,n=e.filter(e=>"return"===e.document_type).length;return`<div class="history">
    <div class="history-title">HISTORIAL DEL PROCESO</div>
    <div class="history-summary">Esta venta registra ${o} ${1===o?"cambio":"cambios"} y ${n} ${1===n?"devolución":"devoluciones"}.</div>
    ${a}
  </div>`}function Z(e){let t=e.settings,i=t?.company_name?.trim()||L,r=t?.tax_id?.trim()||j,a=t?.address?.trim()||V,o=t?.contact_phone?.trim()||I,n=t?.contact_email?.trim()||R,s=q(t?.ticket_footer),d=s.text.trim()||O,c=s.align,p=U(H(t)),u=(0,l.generateCode128Svg)(e.documentNumber,{height:30,moduleWidth:1.5,includeText:!0,includeTextFontSize:11,quietZoneModules:10}),m=e.items.length?e.items.map(e=>`
          <div class="item-row">
            <div class="item-name">${W(e.name)}</div>
            <div class="item-meta">${e.quantity} \xd7 ${Y(e.unitPrice)}</div>
            <div class="item-total">${Q(-Math.abs(e.total))}</div>
          </div>`).join(""):'<div class="muted">Sin productos devueltos.</div>',g=e.payments.filter(e=>Math.abs(e.amount)>0).map(e=>`
      <div class="row">
        <span>${W(e.label)}</span>
        <span>${Q(-Math.abs(e.amount))}</span>
      </div>`).join(""),v=e.originalDocumentNumber?`<div>Documento origen: ${W(e.originalDocumentNumber)}</div>`:"",h=e.rootSaleDocumentNumber&&e.rootSaleDocumentNumber!==e.originalDocumentNumber?`<div>Venta ra\xedz: ${W(e.rootSaleDocumentNumber)}</div>`:"",f=e.sellerName?`<div>Vendedor: ${W(e.sellerName)}</div>`:"",b=e.posName?`<div>POS: ${W(e.posName)}</div>`:"",x=K(e.operationHistory,e.documentNumber);return`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Devoluci\xf3n ${W(e.documentNumber)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; background: #fff; color: #000000; }
          .ticket { max-width: 340px; margin: 0 auto; padding: 18px; }
          .header { text-align: center; }
          .logo { max-height: 60px; margin-bottom: 8px; }
          .title { font-size: 20px; font-weight: 800; letter-spacing: 0.04em; color: #000000; }
          .badge { display: inline-block; margin-top: 6px; padding: 5px 12px; border-radius: 999px; border: 2px solid #000000; color: #000000; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; }
          .meta { font-size: 14px; text-align: left; margin-top: 12px; color: #000000; }
          .meta div { margin-bottom: 4px; }
          .section { margin-top: 12px; }
          .line { border-top: 2px solid #000000; margin: 12px 0; }
          .row { display: flex; justify-content: space-between; font-size: 14px; margin: 4px 0; color: #000000; }
          .items { margin-top: 6px; }
          .item-row { border-bottom: 2px solid #000000; padding: 8px 0; }
          .item-name { font-size: 14px; font-weight: 700; color: #000000; }
          .item-meta { font-size: 13px; color: #000000; }
          .item-total { font-size: 14px; text-align: right; color: #000000; font-weight: 700; }
          .total { font-size: 16px; font-weight: 800; color: #000000; }
          .muted { font-size: 13px; color: #000000; white-space: pre-wrap; }
          .history { margin-top: 12px; border: 2px solid #000000; padding: 8px; font-size: 12px; }
          .history-title { font-size: 13px; font-weight: 900; text-align: center; }
          .history-summary { margin: 4px 0 6px; font-weight: 700; }
          .history-row { border-top: 1px solid #000000; padding: 4px 0; line-height: 1.25; }
          .history-current { font-weight: 800; background: #eeeeee; }
          .history-product { margin-top: 2px; padding-left: 6px; font-size: 11px; font-weight: 400; }
          .barcode { margin-top: 14px; text-align: center; }
          .barcode svg { width: 96%; height: auto; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            ${p?`<img class="logo" src="${p}" alt="${W(i)}" />`:""}
            <div class="title">${W(i)}</div>
            <div class="muted">${W(a)}</div>
            <div class="muted">${W(r)}</div>
            <div class="muted">${W(o)} \xb7 ${W(n)}</div>
            <div class="badge">DEVOLUCI\xd3N</div>
          </div>
          <div class="meta">
            <div>Documento: ${W(e.documentNumber)}</div>
            ${v}
            ${h}
            ${b}
            ${f}
            <div>Fecha: ${W(X(e.createdAt))}</div>
          </div>
          ${x}
          <div class="line"></div>
          <div class="section">
            <div class="row">
              <span>Total devoluci\xf3n</span>
              <span class="total">${Q(-Math.abs(e.totalRefund))}</span>
            </div>
          </div>
          <div class="section">
            <div class="row"><span>Detalle de productos</span></div>
            <div class="items">${m}</div>
          </div>
          ${g?`<div class="section">
                <div class="row"><span>Reembolso</span></div>
                ${g}
              </div>`:""}
          ${e.notes?`<div class="section muted">Notas: ${W(e.notes)}</div>`:""}
          <div class="barcode">${u}</div>
          <div class="line"></div>
          <div class="muted" style="text-align:${c};">${G(d)}</div>
        </div>
      </body>
    </html>
  `}function J(e){let t=e.settings,i=t?.company_name?.trim()||L,r=t?.tax_id?.trim()||j,a=t?.address?.trim()||V,o=t?.contact_phone?.trim()||I,n=t?.contact_email?.trim()||R,s=q(t?.ticket_footer),d=s.text.trim()||O,c=s.align,p=U(H(t)),u=(0,l.generateCode128Svg)(e.documentNumber,{height:30,moduleWidth:1.5,includeText:!0,includeTextFontSize:11,quietZoneModules:10}),m=e.itemsReturned.length?e.itemsReturned.map(e=>`
          <div class="item-row">
            <div class="item-name">${W(e.name)}</div>
            <div class="item-meta">${e.quantity} \xd7 ${Y(e.unitPrice)}</div>
            <div class="item-total">${Q(-Math.abs(e.total))}</div>
          </div>`).join(""):'<div class="muted">Sin productos devueltos.</div>',g=e.itemsNew.length?e.itemsNew.map(e=>`
          <div class="item-row">
            <div class="item-name">${W(e.name)}</div>
            <div class="item-meta">${e.quantity} \xd7 ${Y(e.unitPrice)}</div>
            <div class="item-total">${Y(e.total)}</div>
          </div>`).join(""):'<div class="muted">Sin productos nuevos.</div>',v=e.payments.filter(e=>Math.abs(e.amount)>0).map(e=>`
      <div class="row">
        <span>${W(e.label)}</span>
        <span>${Y(e.amount)}</span>
      </div>`).join(""),h=e.originalDocumentNumber?`<div>Documento origen: ${W(e.originalDocumentNumber)}</div>`:"",f=e.rootSaleDocumentNumber&&e.rootSaleDocumentNumber!==e.originalDocumentNumber?`<div>Venta ra\xedz: ${W(e.rootSaleDocumentNumber)}</div>`:"",b=e.sellerName?`<div>Vendedor: ${W(e.sellerName)}</div>`:"",x=e.posName?`<div>POS: ${W(e.posName)}</div>`:"",$=K(e.operationHistory,e.documentNumber);return`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Cambio ${W(e.documentNumber)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; background: #fff; color: #000000; }
          .ticket { max-width: 340px; margin: 0 auto; padding: 18px; }
          .header { text-align: center; }
          .logo { max-height: 60px; margin-bottom: 8px; }
          .title { font-size: 20px; font-weight: 800; letter-spacing: 0.04em; color: #000000; }
          .badge { display: inline-block; margin-top: 6px; padding: 5px 12px; border-radius: 999px; border: 2px solid #000000; color: #000000; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; }
          .meta { font-size: 14px; text-align: left; margin-top: 12px; color: #000000; }
          .meta div { margin-bottom: 4px; }
          .section { margin-top: 12px; }
          .line { border-top: 2px solid #000000; margin: 12px 0; }
          .row { display: flex; justify-content: space-between; font-size: 14px; margin: 4px 0; color: #000000; }
          .items { margin-top: 6px; }
          .item-row { border-bottom: 2px solid #000000; padding: 8px 0; }
          .item-name { font-size: 14px; font-weight: 700; color: #000000; }
          .item-meta { font-size: 13px; color: #000000; }
          .item-total { font-size: 14px; text-align: right; color: #000000; font-weight: 700; }
          .total { font-size: 16px; font-weight: 800; color: #000000; }
          .muted { font-size: 13px; color: #000000; white-space: pre-wrap; }
          .history { margin-top: 12px; border: 2px solid #000000; padding: 8px; font-size: 12px; }
          .history-title { font-size: 13px; font-weight: 900; text-align: center; }
          .history-summary { margin: 4px 0 6px; font-weight: 700; }
          .history-row { border-top: 1px solid #000000; padding: 4px 0; line-height: 1.25; }
          .history-current { font-weight: 800; background: #eeeeee; }
          .history-product { margin-top: 2px; padding-left: 6px; font-size: 11px; font-weight: 400; }
          .barcode { margin-top: 14px; text-align: center; }
          .barcode svg { width: 96%; height: auto; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            ${p?`<img class="logo" src="${p}" alt="${W(i)}" />`:""}
            <div class="title">${W(i)}</div>
            <div class="muted">${W(a)}</div>
            <div class="muted">${W(r)}</div>
            <div class="muted">${W(o)} \xb7 ${W(n)}</div>
            <div class="badge">CAMBIO</div>
          </div>
          <div class="meta">
            <div>Documento: ${W(e.documentNumber)}</div>
            ${h}
            ${f}
            ${x}
            ${b}
            <div>Fecha: ${W(X(e.createdAt))}</div>
          </div>
          ${$}
          <div class="line"></div>
          <div class="section">
            <div class="row">
              <span>Total cr\xe9dito</span>
              <span>${Q(-Math.abs(e.totalCredit))}</span>
            </div>
            <div class="row">
              <span>Total nuevo</span>
              <span>${Y(e.totalNew)}</span>
            </div>
            <div class="row total">
              <span>Diferencia</span>
              <span>${Q(e.extraPayment-e.refundDue)}</span>
            </div>
            ${e.extraPayment>0?`<div class="row"><span>Excedente cobrado</span><span>${Y(e.extraPayment)}</span></div>`:""}
            ${e.refundDue>0?`<div class="row"><span>Saldo devuelto${e.refundMethod?` (${W(e.refundMethod)})`:""}</span><span>${Y(e.refundDue)}</span></div>`:""}
          </div>
          <div class="section">
            <div class="row"><span>Productos devueltos</span></div>
            <div class="items">${m}</div>
          </div>
          <div class="section">
            <div class="row"><span>Productos nuevos</span></div>
            <div class="items">${g}</div>
          </div>
          ${v?`<div class="section">
                <div class="row"><span>Pagos del excedente</span></div>
                ${v}
              </div>`:""}
          ${e.notes?`<div class="section muted">Notas: ${W(e.notes)}</div>`:""}
          <div class="barcode">${u}</div>
          <div class="line"></div>
          <div class="muted" style="text-align:${c};">${G(d)}</div>
        </div>
      </body>
    </html>
  `}function ee(e){var t;let i,r,a,o,n,s,d,u,m,g=e.settings,v=g?.company_name?.trim()||L,h=g?.tax_id?.trim()||j,x=g?.address?.trim()||V,$=g?.contact_phone?.trim()||I,y=g?.contact_email?.trim()||R,w=q(g?.ticket_footer),A=w.text.trim()||O,S=w.align,_=U(H(g)),C=e.payments.length?e.payments.map(e=>`
          <div class="row">
            <span>${W(e.label)}</span>
            <span>${Y(e.amount)}</span>
          </div>`).join(""):'<div class="row"><span>Sin pagos registrados</span><span>0</span></div>',N=e.separatedInfo?'<div class="separated-badge">VENTA POR SEPARADO</div>':"",E="number"==typeof e.changeAmount&&0!==e.changeAmount?`<div class="row">
            <span>${e.changeAmount>0?"Cambio":"Saldo"}</span>
            <span>${Y(Math.abs(e.changeAmount))}</span>
          </div>`:"",T=e.separatedInfo?(i=[...e.separatedInfo?.initialPayments??[],...e.separatedInfo?.payments??[]],r=e.separatedInfo?.reconciliations??[],a=i.length?i.map(e=>{let t=[];e.method&&t.push(e.method),e.paidAt&&t.push(X(e.paidAt));let i=t.length>0?`<div class="sep-meta">${t.map(e=>W(e)).join(" · ")}</div>`:"";return`<div class="row separated-row">
                  <div>
                    <div class="sep-label">${W(e.label)}</div>
                    ${i}
                  </div>
                  <span>${Y(e.amount)}</span>
                </div>`}).join(""):'<div class="row separated-row"><div class="sep-label">Sin abonos registrados</div><span>0</span></div>',o=r.map((e,t)=>{let i=[];e.reference&&i.push(`Ref. ${e.reference}`),e.reconciledAt&&i.push(X(e.reconciledAt));let a=i.length?`<div class="sep-meta">${i.map(e=>W(e)).join(" · ")}</div>`:"",o=r.length>1?`Pago conciliado ${t+1}`:"Pago conciliado";return`<div class="row separated-row">
              <div>
                <div class="sep-label">${W(o)}</div>
                ${a}
              </div>
              <span>${Y(e.amount)}</span>
            </div>`}).join(""),n=i.reduce((e,t)=>e+Number(t.amount||0),0)+r.reduce((e,t)=>e+Number(t.amount||0),0),s="number"==typeof e.separatedInfo?.appliedTotal?Math.max(e.separatedInfo.appliedTotal,0):n,d=`<div class="row separated-row balance-row">
          <div class="sep-label">Total aplicado</div>
          <span>${Y(s)}</span>
        </div>`,u=e.separatedInfo?.dueDate?`<div class="line"><span>Fecha l\xedmite</span><span>${!(t=e.separatedInfo?.dueDate)?"":(0,p.formatBogotaDate)(t,{dateStyle:"short"})||t}</span></div>`:"",m="number"==typeof e.separatedInfo?.balance?`<div class="row separated-row balance-row">
                <div class="sep-label">Saldo pendiente</div>
                <span>${Y(Math.max(e.separatedInfo.balance,0))}</span>
              </div>`:"",`<div class="separator"></div>
          <div class="section">
            <div class="line-title">Detalle de abonos</div>
            ${u}
            <div class="payments">${a}</div>
            ${o?`<div class="payments">${o}</div>`:""}
            ${d}
            ${m}
          </div>`):"",D=e.items.length?e.items.map(e=>{let t=Math.max(0,e.quantity*e.unitPrice-e.total),i=t>0?`<span class="item-discount">(Desc -${Y(t)})</span>`:"";return`
        <div class="item-row">
          <div>
            <div class="item-name">${W(e.name)}</div>
            <div class="item-meta">${e.quantity} x ${Y(e.unitPrice)} ${i}</div>
          </div>
          <div class="item-total">${Y(e.total)}</div>
        </div>`}).join(""):'<div class="item-row"><div class="item-name">Sin artículos</div></div>',k=e.customer&&e.customer.name?`<div class="line-title">Cliente</div><div class="customer-name">${W(e.customer.name)}</div>`+(e.customer.phone?`<div class="customer-detail">Tel: ${W(e.customer.phone)}</div>`:"")+(e.customer.email?`<div class="customer-detail">Email: ${W(e.customer.email)}</div>`:"")+(e.customer.taxId?`<div class="customer-detail">NIT / ID: ${W(e.customer.taxId)}</div>`:"")+(e.customer.address?`<div class="customer-detail">Direcci\xf3n: ${W(e.customer.address)}</div>`:""):"",P=e.notes&&e.notes.trim().length?`<div class="section">
          <div class="line-title">Notas</div>
          <div class="notes">${W(e.notes).split("\n").map(e=>e.trim()).filter(Boolean).map(e=>`<div>${e}</div>`).join("")}</div>
        </div>`:"",B=e.documentNumber?.trim()||`V-${String(e.saleNumber??0).padStart(6,"0")}`,M=/^OFF-/i.test(B)?(0,c.offlineReceiptBarcodeValue)(B)??B:B,z=(0,l.generateCode128Svg)(M,{height:30,moduleWidth:2,includeText:!0,includeTextFontSize:12,quietZoneModules:10}),F=f?e.rewardPublicUrl:null,Q=F?`<div class="separator"></div>
        <div class="loyalty-block">
          <div class="loyalty-title">\xa1TIENES UN BENEFICIO PARA TU PR\xd3XIMA COMPRA!</div>
          <div class="loyalty-copy">Escanea este QR para descubrirlo y activarlo.</div>
          <div class="loyalty-qr"><img src="${function(e,t=8,i=2){let r=b(0,"M");return r.addData(e),r.make(),r.createDataURL(t,i)}(F)}" alt="C\xf3digo QR del beneficio" /></div>
          <div class="loyalty-terms">\xa1No lo dejes para despu\xe9s! Escan\xe9alo ahora, activa tu beneficio y gu\xe1rdalo para tu pr\xf3xima compra.<br /><span>Sujeto a condiciones y vigencia.</span></div>
        </div>`:"",K=F?`@page {
          size: 80mm auto;
          margin: 0;
        }
        html {
          width: 80mm;
          margin: 0;
          padding: 0;
        }`:"@page { margin: 4mm; }",Z=F?"0":"0 auto",J=F?`
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;`:"";return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Ticket ${W(e.documentNumber)}</title>
      <style>
        ${K}
        * { box-sizing: border-box; }
        body {
          font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
          width: 80mm;
          margin: ${Z};
          font-size: 13px;
          color: #0f172a;
          background: #ffffff;${J}
        }
        .ticket {
          padding: 3mm 3mm 8mm;
        }
        .logo {
          text-align: center;
          margin-bottom: 8px;
        }
        .logo img {
          max-width: 60mm;
          max-height: 28mm;
          object-fit: contain;
        }
        h1 {
          font-size: 20px;
          text-align: center;
          margin: 0;
        }
        .company-info {
          text-align: center;
          color: #111827;
          font-size: 13px;
          line-height: 1.4;
          margin-top: 4px;
        }
        .separator {
          border-top: 1px solid #111827;
          margin: 10px 0;
        }
        .line-title {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #111827;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .customer-name {
          font-weight: 600;
          font-size: 14px;
        }
        .customer-detail {
          color: #111827;
          font-size: 12px;
        }
        .line {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 30mm;
          column-gap: 2mm;
          font-size: 13px;
          margin-bottom: 2px;
          line-height: 1.4;
        }
        .line span:first-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .line span:last-child {
          min-width: 0;
          text-align: right;
          font-weight: 700;
          white-space: nowrap;
        }
        .items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .item-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 24mm;
          column-gap: 2mm;
          width: 100%;
        }
        .item-row > div:first-child {
          min-width: 0;
        }
        .item-name {
          font-weight: 600;
          overflow-wrap: anywhere;
        }
        .item-meta {
          color: #0f172a;
          font-size: 11px;
          overflow-wrap: anywhere;
        }
        .item-discount {
          color: #0f172a;
          margin-left: 4px;
        }
        .item-total {
          font-weight: 600;
          min-width: 0;
          text-align: right;
          white-space: nowrap;
        }
        .totals {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          margin-top: 8px;
        }
        .totals span {
          font-weight: 800;
          font-size: 20px;
        }
        .totals strong {
          font-size: 20px;
          font-weight: 800;
        }
        .payments .row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 30mm;
          column-gap: 2mm;
          font-size: 13px;
          margin-bottom: 2px;
        }
        .payments .row > :first-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .payments .row span:last-child {
          min-width: 0;
          text-align: right;
          white-space: nowrap;
        }
        .separated-badge {
          display: table;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          margin: 6px auto 6px;
          padding: 5px 12px;
          border: 2px solid #0f172a;
          border-radius: 999px;
          letter-spacing: 0.08em;
        }
        .adjustment-banner {
          margin: 8px 0 10px;
          padding: 7px 10px;
          border: 1px solid #111827;
          background: #ffffff;
          color: #111827;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 10px;
        }
        .adjustment-note {
          margin-top: 4px;
          color: #111827;
          font-size: 11px;
          line-height: 1.35;
          text-align: center;
        }
        .separated-row {
          align-items: flex-start;
        }
        .sep-label {
          font-weight: 600;
        }
        .sep-meta {
          font-size: 11px;
          color: #111827;
        }
        .section { margin-bottom: 12px; }
        .barcode { margin-top: 16px; text-align: center; }
        .barcode svg {
          width: 96%;
          height: auto;
        }
        .loyalty-block {
          text-align: center;
          margin: 12px 0;
          page-break-inside: avoid;
        }
        .loyalty-title {
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }
        .loyalty-copy,
        .loyalty-terms {
          font-size: 11px;
          line-height: 1.35;
          color: #111827;
        }
        .loyalty-terms span {
          font-size: 10px;
        }
        .loyalty-qr {
          margin: 8px auto 6px;
          width: 34mm;
          height: 34mm;
        }
        .loyalty-qr img {
          width: 34mm;
          height: 34mm;
          display: block;
          margin: 0 auto;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
        .footer {
          margin-top: 6px;
          text-align: center;
          font-size: 12px;
          color: #111827;
          line-height: 1.4;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="logo">
          ${_?`<img src="${W(_)}" alt="Logo" />`:`<strong>${W(v)}</strong>`}
        </div>
        <h1>${W(v)}</h1>
        <div class="company-info">
          ${W(x)}<br />
          ${W($)} \xb7 ${W(y)}<br />
          ${W(h)}<br />
          CONSERVA ESTE RECIBO Y EMPAQUE ORIGINAL PARA GARANT\xcdA
        </div>

        <div class="separator"></div>

        ${k}
        ${k?'<div class="separator"></div>':""}
        ${e.adjustmentBadge?`<div class="adjustment-banner">${W(e.adjustmentBadge)}</div>${e.adjustmentNote?`<div class="adjustment-note">${W(e.adjustmentNote)}</div>`:""}`:""}
        <div class="section">
          <div class="line"><span>No. Recibo</span><span>${W(e.documentNumber)}</span></div>
          <div class="line"><span>Fecha</span><span>${(0,p.formatBogotaDate)(e.date,{dateStyle:"short",timeStyle:"short"})}</span></div>
          ${e.vendorName?`<div class="line"><span>Usuario</span><span>${W(e.vendorName)}</span></div>`:""}
          ${e.posName?`<div class="line"><span>POS</span><span>${W(e.posName)}</span></div>`:""}
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line-title">Detalle de productos</div>
          <div class="items">
            ${D}
          </div>
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line"><span>Subtotal</span><span>${Y(e.subtotal)}</span></div>
          ${e.lineDiscountTotal>0?`<div class="line">
                   <span>Descuento art\xedculos</span>
                   <span>- ${Y(e.lineDiscountTotal)}</span>
                 </div>`:""}
          <div class="line">
            <span>${W(e.cartDiscountLabel)}</span>
            <span>${W(e.cartDiscountValueDisplay)}</span>
          </div>
          ${e.surchargeLabel&&("number"==typeof e.surchargeAmount?e.surchargeAmount>0:!!(e.surchargeValueDisplay&&e.surchargeValueDisplay.trim()))?`<div class="line">
                   <span>${W(e.surchargeLabel)}</span>
                   <span>${"number"==typeof e.surchargeAmount&&e.surchargeAmount>0?`+ ${Y(e.surchargeAmount)}`:W(e.surchargeValueDisplay?.startsWith("+")?e.surchargeValueDisplay:`+${e.surchargeValueDisplay??""}`)}</span>
                 </div>`:""}
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line-title">Pagos recibidos</div>
          ${N}
          <div class="payments">
            ${C}
            ${E}
          </div>
        </div>

        ${T}

        <div class="totals">
          <span>TOTAL</span>
          <strong>${Y(e.total)}</strong>
        </div>

        ${P}

        <div class="barcode">${z}</div>

        <div class="footer" style="text-align:${S};">
          ${G(A)}
        </div>

        ${Q}
      </div>
    </body>
  </html>`}function et(e){let t=e.expenses.reduce((e,t)=>e+Math.max(Number(t.amount||0),0),0),i=Number(e.expectedCash||0)-t,r=Number(e.countedCash||0)-i,a=e.expenses.length?e.expenses.map(e=>{let t=e.description?.trim()?`<div class="muted">${W(e.description)}</div>`:"";return`
            <div class="expense">
              <div>
                <div class="strong">${W(e.categoryLabel)}</div>
                ${t}
                <div class="muted">${X(e.createdAt)} \xb7 ${W(e.createdBy)}</div>
              </div>
              <div class="amount">${Y(e.amount)}</div>
            </div>`}).join(""):'<div class="muted center">No se registraron gastos de caja.</div>';return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Gastos ${W(e.documentNumber)}</title>
      <style>
        @page { margin: 4mm; }
        body {
          font-family: "Helvetica Neue", Arial, sans-serif;
          width: 80mm;
          margin: 0 auto;
          font-size: 12px;
          color: #0f172a;
        }
        h1 { font-size: 18px; text-align: center; margin: 2px 0; }
        .center { text-align: center; }
        .muted { color: #374151; font-size: 11px; }
        .subtitle { font-size: 12px; font-weight: 700; }
        .block { margin-top: 10px; }
        .strong { font-weight: 700; }
        hr { border: none; border-top: 1px solid #111827; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; }
        .row.emphasize { font-weight: 700; padding-bottom: 4px; margin-bottom: 2px; }
        .expense {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px dashed #94a3b8;
        }
        .expense:last-child { border-bottom: none; }
        .amount { font-weight: 700; text-align: right; white-space: nowrap; }
      </style>
    </head>
    <body>
      <h1>Gastos de caja</h1>
      <div class="center muted subtitle" style="margin-top:4px;">Ticket complementario</div>
      <hr />
      <div class="block">
        <div class="row"><span>Cierre</span><span>${W(e.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,p.formatBogotaDate)(e.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${e.posName?`<div class="row"><span>POS</span><span>${W(e.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${W(e.responsible)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="row emphasize"><span>Total de HOY</span><span>${Y(e.totalToday)}</span></div>
        <div class="row"><span>Efectivo esperado</span><span>${Y(e.expectedCash)}</span></div>
        <div class="row"><span>Total gastos</span><span>- ${Y(t)}</span></div>
        <div class="row emphasize"><span>Efectivo final esperado</span><span>${Y(i)}</span></div>
        <div class="row"><span>Efectivo contado</span><span>${Y(e.countedCash)}</span></div>
        <div class="row"><span>Diferencia ajustada</span><span>${Y(r)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="muted">Detalle de gastos</div>
        ${a}
      </div>
    </body>
  </html>`}function ei(e){let t=e.returns.reduce((e,t)=>e+Math.max(Number(t.totalRefund||0),0),0),i=e.changes.reduce((e,t)=>e+Math.max(Number(t.extraPayment||0),0),0),r=e.changes.reduce((e,t)=>e+Math.max(Number(t.refundDue||0),0),0),a=t+r,o=new Map,n=(e,t,i)=>{let r=e?.trim()||"Otro método",a=r.toLowerCase(),n=o.get(a)??{method:r,entries:0,exits:0};"entry"===i&&(n.entries+=t),"exit"===i&&(n.exits+=t),o.set(a,n)};e.returns.forEach(e=>{(e.payments.length?e.payments:[{method:"Efectivo",amount:e.totalRefund}]).forEach(e=>n(e.method,e.amount,"exit"))}),e.changes.forEach(e=>{(e.payments.length?e.payments:e.extraPayment>0?[{method:"Efectivo",amount:e.extraPayment}]:[]).forEach(e=>n(e.method,e.amount,"entry")),e.refundDue>0&&n(e.refundMethod||"Efectivo",e.refundDue,"exit")});let s=Array.from(o.values()).filter(e=>e.entries>0||e.exits>0).sort((e,t)=>e.method.localeCompare(t.method,"es")).map(e=>`
        <div class="method-row">
          <div class="strong">${W(e.method)}</div>
          <div>${Y(e.entries)}</div>
          <div>${Y(e.exits)}</div>
          <div class="strong">${Y(e.entries-e.exits)}</div>
        </div>`).join(""),d=e=>e.length?e.map(e=>`${W(String(e.quantity))} x ${W(e.name)}${e.total?` (${Y(e.total)})`:""}`).join("<br />"):"Sin productos",l=e=>e.length?e.map(e=>`${W(e.method)} ${Y(e.amount)}`).join("<br />"):"Efectivo",c=e.returns.length?e.returns.map(e=>`
            <div class="movement">
              <div class="movement-head">
                <div>
                  <div class="strong">${W(e.documentNumber||`DV-${e.id}`)}</div>
                  <div class="muted">Origen ${W(e.saleDocumentNumber||"Sin documento")}</div>
                </div>
                <div class="amount exit">${Y(e.totalRefund)}</div>
              </div>
              <div class="muted">${X(e.createdAt)} \xb7 ${W(e.createdBy||"Sin usuario")}</div>
              <div class="muted">${d(e.items)}</div>
              <div class="muted">M\xe9todos: ${l(e.payments)}</div>
            </div>`).join(""):'<div class="muted center">Sin devoluciones en este cierre.</div>',u=e.changes.length?e.changes.map(e=>`
            <div class="movement">
              <div class="movement-head">
                <div>
                  <div class="strong">${W(e.documentNumber||`CB-${e.id}`)}</div>
                  <div class="muted">Origen ${W(e.saleDocumentNumber||"Sin documento")}</div>
                </div>
                <div class="amount">${Y(e.extraPayment-e.refundDue)}</div>
              </div>
              <div class="muted">${X(e.createdAt)} \xb7 ${W(e.createdBy||"Sin usuario")}</div>
              <div class="muted">Devuelve: ${d(e.returnedItems)}</div>
              <div class="muted">Entrega: ${d(e.newItems)}</div>
              <div class="row"><span>Cr\xe9dito devuelto</span><span>${Y(e.totalCredit)}</span></div>
              <div class="row"><span>Nuevo total</span><span>${Y(e.totalNew)}</span></div>
              <div class="row"><span>Entrada</span><span>${Y(e.extraPayment)}</span></div>
              <div class="row"><span>Salida</span><span>${Y(e.refundDue)}</span></div>
              <div class="muted">M\xe9todos entrada: ${l(e.payments)}</div>
              ${e.refundDue>0?`<div class="muted">M\xe9todo salida: ${W(e.refundMethod||"Efectivo")}</div>`:""}
            </div>`).join(""):'<div class="muted center">Sin cambios en este cierre.</div>';return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Movimientos ${W(e.documentNumber)}</title>
      <style>
        @page { margin: 4mm; }
        body {
          font-family: "Helvetica Neue", Arial, sans-serif;
          width: 80mm;
          margin: 0 auto;
          font-size: 12px;
          color: #0f172a;
        }
        h1 { font-size: 18px; text-align: center; margin: 2px 0; }
        h2 { font-size: 13px; margin: 10px 0 4px; text-transform: uppercase; }
        .center { text-align: center; }
        .muted { color: #374151; font-size: 11px; }
        .subtitle { font-size: 12px; font-weight: 700; }
        .strong { font-weight: 700; }
        .amount { font-weight: 700; text-align: right; white-space: nowrap; }
        .exit { color: #be123c; }
        hr { border: none; border-top: 1px solid #111827; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; }
        .row.emphasize { font-weight: 700; padding-bottom: 4px; margin-bottom: 2px; }
        .method-head,
        .method-row {
          display: grid;
          grid-template-columns: 1.1fr 0.85fr 0.85fr 0.85fr;
          gap: 4px;
          align-items: start;
          font-size: 10px;
          text-align: right;
        }
        .method-head div:first-child,
        .method-row div:first-child { text-align: left; }
        .method-head { font-weight: 700; border-bottom: 1px solid #111827; padding-bottom: 3px; }
        .method-row { border-bottom: 1px dashed #94a3b8; padding: 4px 0; }
        .movement { border-bottom: 1px dashed #94a3b8; padding: 7px 0; }
        .movement:last-child { border-bottom: none; }
        .movement-head { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
      </style>
    </head>
    <body>
      <h1>Devoluciones y cambios</h1>
      <div class="center muted subtitle" style="margin-top:4px;">Ticket complementario</div>
      <hr />
      <div>
        <div class="row"><span>Cierre</span><span>${W(e.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,p.formatBogotaDate)(e.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${e.posName?`<div class="row"><span>POS</span><span>${W(e.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${W(e.responsible)}</span></div>
      </div>
      <hr />
      <div>
        <div class="row"><span>Devoluciones</span><span>${e.returns.length}</span></div>
        <div class="row"><span>Salidas por devoluciones</span><span>${Y(t)}</span></div>
        <div class="row"><span>Cambios</span><span>${e.changes.length}</span></div>
        <div class="row"><span>Entradas por cambios</span><span>${Y(i)}</span></div>
        <div class="row"><span>Salidas por cambios</span><span>${Y(r)}</span></div>
        <div class="row emphasize"><span>Neto movimientos</span><span>${Y(i-a)}</span></div>
      </div>
      <hr />
      <h2>M\xe9todos</h2>
      <div class="method-head"><div>M\xe9todo</div><div>Entrada</div><div>Salida</div><div>Neto</div></div>
      ${s||`<div class="muted center" style="padding:6px 0;">Sin m\xe9todos.</div>`}
      <hr />
      <h2>Devoluciones</h2>
      ${c}
      <hr />
      <h2>Cambios</h2>
      ${u}
    </body>
  </html>`}function er(e){let t=e.settings,i=t?.company_name?.trim()||L,r=t?.tax_id?.trim()||j,a=t?.address?.trim()||V,o=t?.contact_phone?.trim()||I,n=t?.contact_email?.trim()||R,s=q(t?.ticket_footer),d=s.text.trim()||O,l=s.align,c=U(H(t)),u=e.payments.reduce((e,t)=>e+(t.amount??0),0)||e.total,m=Math.max(0,e.total-u),g=e.items.length?e.items.map((e,t)=>{let i=e.quantity??1,r=e.unitPrice&&e.unitPrice>0?e.unitPrice:i>0?e.total/i:e.total,a=Math.max(0,r*i-e.total);return`
            <tr>
              <td>${t+1}</td>
              <td>${W(e.name)}</td>
              <td>${i}</td>
              <td>${Y(r)}</td>
              <td>${a>0?"-${formatMoney(discount)}":"0"}</td>
              <td>${Y(e.total)}</td>
            </tr>`}).join(""):`<tr><td colspan="6" class="muted">Sin art\xedculos</td></tr>`,v=[e.customer?.name?W(e.customer.name):"Cliente Final",e.customer?.taxId?`NIT / Documento: ${W(e.customer.taxId)}`:"",e.customer?.address?`Direcci\xf3n: ${W(e.customer.address)}`:"",e.customer?.phone?`Tel\xe9fono: ${W(e.customer.phone)}`:"",e.customer?.email?`Email: ${W(e.customer.email)}`:""].filter(Boolean).join("<br />"),h=e.payments.length?e.payments.map(e=>`
            <tr>
              <td>${W(e.label)}</td>
              <td>${Y(e.amount)}</td>
            </tr>`).join(""):`<tr><td>Pago registrado</td><td>${Y(e.total)}</td></tr>`,f=(0,p.formatBogotaDate)(e.date,{dateStyle:"short",timeStyle:"short"})||"",b=e.adjustmentBadge?`<div class="adjustment-banner">${W(e.adjustmentBadge)}</div>${e.adjustmentNote?`<div class="adjustment-note">${W(e.adjustmentNote)}</div>`:""}`:"";return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Factura ${W(e.documentNumber)}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
          margin: 0;
          padding: 32px;
          background: #f3f4f6;
          color: #0f172a;
        }
        .sheet {
          width: 210mm;
          margin: 0 auto;
          background: #ffffff;
          padding: 28px 32px 40px;
          border: 1px solid #d1d5db;
        }
        header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 2px solid #1f2937;
          padding-bottom: 12px;
          margin-bottom: 18px;
        }
        .company blockquote {
          margin: 0;
        }
        .company h1 {
          margin: 0;
          font-size: 22px;
          letter-spacing: 0.08em;
        }
        .company p {
          margin: 2px 0;
          font-size: 12px;
        }
        .meta {
          text-align: right;
          font-size: 12px;
        }
        .meta div {
          margin-bottom: 4px;
        }
        .meta .doc-number {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .logo img {
          max-width: 140px;
          max-height: 60px;
          object-fit: contain;
          margin-bottom: 8px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 18px;
          font-size: 12px;
        }
        .info-box {
          border: 1px solid #d1d5db;
          padding: 12px;
        }
        .info-box strong {
          display: block;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.08em;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        thead {
          background: #f8fafc;
        }
        th, td {
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          text-align: left;
        }
        th {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
        }
        td:nth-child(1) { width: 36px; text-align: center; }
        td:nth-child(3),
        td:nth-child(4),
        td:nth-child(5),
        td:nth-child(6) {
          text-align: right;
        }
        .totals {
          width: 300px;
          margin-left: auto;
          margin-top: 16px;
          font-size: 13px;
        }
        .totals tr td:first-child {
          text-align: right;
          padding-right: 12px;
        }
        .totals tr td:last-child {
          text-align: right;
          font-weight: 600;
        }
        .totals tr.total td {
          font-size: 15px;
          font-weight: 700;
        }
        .payments {
          margin-top: 20px;
          width: 340px;
          font-size: 12px;
        }
        .payments th,
        .payments td {
          text-align: left;
        }
        .footer-note {
          margin-top: 24px;
          font-size: 11.5px;
          text-align: center;
          color: #475569;
          white-space: pre-wrap;
        }
        footer {
          margin-top: 18px;
          font-size: 11px;
          text-align: right;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="sheet">
        <header>
          <div class="company">
            <h1>FACTURA</h1>
            <p><strong>${W(i)}</strong></p>
            <p>${W(a)}</p>
            <p>Tel: ${W(o)} \xb7 Email: ${W(n)}</p>
            <p>NIT: ${W(r)}</p>
          </div>
          <div class="meta">
            <div class="logo">${c?`<img src="${W(c)}" alt="Logo" />`:""}</div>
            <div class="doc-number">${W(e.documentNumber)}</div>
            <div>Fecha: ${f}</div>
            <div>POS: ${W(e.posName??"")}</div>
            <div>Cajero: ${W(e.vendorName??"")}</div>
          </div>
        </header>

        <div class="info-grid">
          <div class="info-box">
            <strong>Cliente</strong>
            ${v}
          </div>
          <div class="info-box">
            <strong>Resumen</strong>
            <div>Ticket #: ${W(e.documentNumber)}</div>
            <div>Documentos: ${W(e.documentNumber)}</div>
            <div>Estado del pago: ${m>0?"Pendiente":"Pagado"}</div>
          </div>
        </div>

        ${b}

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Descripci\xf3n</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Desc.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${g}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td>Subtotal</td>
            <td>${Y(e.subtotal)}</td>
          </tr>
          ${e.lineDiscountTotal>0?`<tr><td>Descuento art\xedculos</td><td>- ${Y(e.lineDiscountTotal)}</td></tr>`:""}
          <tr>
            <td>${W(e.cartDiscountLabel)}</td>
            <td>${W(e.cartDiscountValueDisplay)}</td>
          </tr>
          ${e.surchargeLabel&&("number"==typeof e.surchargeAmount?0!==e.surchargeAmount:!!e.surchargeValueDisplay?.trim())?`<tr><td>${W(e.surchargeLabel)}</td><td>${"number"==typeof e.surchargeAmount?(e.surchargeAmount>=0?"+ ":"- ")+Y(Math.abs(e.surchargeAmount)):W(e.surchargeValueDisplay??"")}</td></tr>`:""}
          <tr class="total">
            <td>Total</td>
            <td>${Y(e.total)}</td>
          </tr>
        </table>

        <table class="payments">
          <thead>
            <tr>
              <th>M\xe9todo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            ${h}
            <tr>
              <td><strong>Pagado</strong></td>
              <td><strong>${Y(u)}</strong></td>
            </tr>
            <tr>
              <td><strong>Saldo</strong></td>
              <td><strong>${Y(m)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="footer-note" style="text-align:${l};">
          ${G(d)}
        </div>
        <footer>P\xe1gina 1</footer>
      </div>
    </body>
  </html>`}function ea(e){let t=e.settings,i=t?.company_name?.trim()||L,r=t?.tax_id?.trim()||j,a=t?.address?.trim()||V,o=t?.contact_phone?.trim()||I,n=t?.contact_email?.trim()||R,s=U(H(t)),d=function(e){if(!e)return;let t=Number(e.reservedTotal??0),i=Number(e.paymentsTotal??0),r=Math.max(t-i,0),a=r>0?r:Number(e.pendingTotal??0),o=Number(e.dayCollectedTotal??t-a);return{tickets:Number(e.tickets??0),paymentsTotal:i,reservedTotal:t,pendingTotal:a,dayCollectedTotal:o,dayWithPendingTotal:e.dayWithPendingTotal??o+a}}(e.separatedSummary),l=e.methods.some(e=>"number"==typeof e.gross||"number"==typeof e.refunds||"number"==typeof e.net),c=e.methods.length?e.methods.map(e=>{let t=e.gross??e.amount??0,i=e.refunds??0,r=e.net??e.amount??t-i;return l?`
        <div class="method-grid">
          <span>${W(e.label)}</span>
          <span>${Y(t)}</span>
          <span>${Q(-Math.abs(i))}</span>
          <span>${Q(r)}</span>
        </div>`:`
        <div class="row">
          <span>${W(e.label)}</span>
          <span>${Q(r)}</span>
        </div>`}).join(""):l?'<div class="method-grid"><span>Sin métodos registrados</span><span>$ 0</span><span>$ 0</span><span>$ 0</span></div>':'<div class="row"><span>Sin métodos registrados</span><span>$ 0</span></div>',u=l?`
      <div class="method-grid header">
        <span>M\xe9todo</span>
        <span>Ventas</span>
        <span>Reembolsos</span>
        <span>Neto</span>
      </div>`:"",m=e.userBreakdown&&e.userBreakdown.length?e.userBreakdown.map(e=>`
        <div class="row">
          <span>${W(e.name)}</span>
          <span>${Y(e.total)}</span>
        </div>`).join(""):"",g=e.stationBreakdown&&e.stationBreakdown.length?e.stationBreakdown.map(t=>{let i=e.stationBreakdown?.length===1?Number(d?.pendingTotal??0):0,r=Number(t.pendingTotal??0);return`
        <div class="row">
          <span>${W(t.stationLabel)} (${Math.max(0,Number(t.salesCount||0))})</span>
          <span>${Y(Math.max(Number(t.netAmount??0)-(i>0&&r<=0?i:r),0))}</span>
        </div>`}).join(""):"",v=!!e.separatedSummary,h=Number(e.totals.registered),f=Number(e.totals.net),b=v?Number(d?.dayCollectedTotal??f):0,x=e.notes&&e.notes.trim().length?`<div class="block">
          <div class="muted">Notas</div>
          <div>${W(e.notes).split("\n").map(e=>e.trim()).filter(Boolean).map(e=>`<div>${e}</div>`).join("")}</div>
        </div>`:"",$=e.isContingency?`<div class="block" style="border:1px solid #b45309;background:#fffbeb;padding:6px;font-weight:700;text-align:center;">
        CIERRE DE CONTINGENCIA<br/><span style="font-weight:400;">Pendiente de consolidaci\xf3n con Metrik al recuperar conexi\xf3n.</span>
      </div>`:"",y=e.totals.changeExtra??0,w=e.totals.changeRefund??0,A=e.totals.changeCount??0,S=y>0||w>0||A>0;return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Reporte ${W(e.documentNumber)}</title>
      <style>
        @page { margin: 4mm; }
        body {
          font-family: "Helvetica Neue", Arial, sans-serif;
          width: 80mm;
          margin: 0 auto;
          font-size: 12px;
          color: #0f172a;
        }
        h1 { font-size: 18px; text-align: center; margin: 2px 0; }
        .center { text-align: center; }
        .muted { color: #374151; font-size: 11px; }
        .subtitle { font-size: 12px; font-weight: 700; }
        .block { margin-top: 10px; }
        hr { border: none; border-top: 1px solid #111827; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; font-size: 12px; }
        .row.emphasize {
          font-weight: 700;
          padding-bottom: 4px;
          margin-bottom: 2px;
        }
        .method-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 6px; font-size: 11px; }
        .method-grid span:not(:first-child) { text-align: right; }
        .method-grid.header {
          font-weight: 700;
          border-bottom: 1px solid #111827;
          padding-bottom: 4px;
          margin-bottom: 4px;
        }
        .logo { text-align: center; margin-bottom: 8px; }
        .logo img { max-height: 28mm; max-width: 60mm; object-fit: contain; }
      </style>
    </head>
    <body>
      ${s?`<div class="logo"><img src="${W(s)}" alt="Logo" /></div>`:""}
      <h1>${W(i)}</h1>
      <div class="center muted">${W(a)}</div>
      <div class="center muted">${W(o)}</div>
      <div class="center muted">${W(n)}</div>
      <div class="center muted">${W(r)}</div>
      <div class="center muted subtitle" style="margin-top:4px;">${e.isContingency?"Cierre de contingencia":"Reporte Z - Cierre de caja"}</div>
      <hr />
      ${$}
      <div class="block">
        <div class="row"><span>No. Reporte</span><span>${W(e.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,p.formatBogotaDate)(e.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${e.rangeSummary?`<div class="row"><span>Ventas del</span><span>${W(e.rangeSummary.startLabel===e.rangeSummary.endLabel?e.rangeSummary.startLabel:`${e.rangeSummary.startLabel} - ${e.rangeSummary.endLabel}`)}</span></div>`:""}
        ${e.posName?`<div class="row"><span>POS</span><span>${W(e.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${W(e.responsible)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="row"><span>Total registrado</span><span>${Y(h)}</span></div>
        <div class="row"><span>Devoluciones / reembolsos</span><span>- ${Y(e.totals.refunds)}</span></div>
        ${S?`<div class="row"><span>Cambios (excedente)</span><span>${Y(y)}</span></div>
               <div class="row"><span>Cambios (reembolsos)</span><span>- ${Y(w)}</span></div>
               ${A>0?`<div class="row"><span>Total cambios</span><span>${A}</span></div>`:""}`:""}
        <div class="row emphasize"><span>Neto del d\xeda</span><span>${Y(f)}</span></div>
        <div class="row"><span>Efectivo esperado</span><span>${Y(e.totals.expectedCash)}</span></div>
        <div class="row"><span>Efectivo contado</span><span>${Y(e.totals.countedCash)}</span></div>
        <div class="row"><span>Diferencia</span><span>${Y(e.totals.difference)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="muted">Detalle por m\xe9todo</div>
        ${u}
        ${c}
        ${l?"":'<div class="muted" style="margin-top:4px;">Totales netos (reembolsos ya descontados).</div>'}
      </div>
      ${m?`<hr />
        <div class="block">
          <div class="muted">Ventas por usuario</div>
          ${m}
        </div>`:""}
      ${v?`<hr />
        <div class="block">
          <div class="muted">Aclaraci\xf3n de total del d\xeda</div>
          <div class="row emphasize"><span>Total de HOY</span><span>${Y(b)}</span></div>
        </div>`:""}
      ${g?`<hr />
        <div class="block">
          <div class="muted">Ventas por estaci\xf3n</div>
          ${g}
        </div>`:""}
      ${d?`<hr />
        <div class="block">
          <div class="muted">Ventas por separado</div>
          <div class="row"><span>Tickets registrados</span><span>${d.tickets}</span></div>
          <div class="row"><span>Abonos cobrados</span><span>${Y(d.paymentsTotal)}</span></div>
          <div class="row"><span>Total reservado</span><span>${Y(d.reservedTotal)}</span></div>
          <div class="row"><span>Saldo pendiente</span><span>${d.pendingTotal>0?Y(d.pendingTotal):"$ 0"}</span></div>
        </div>`:""}
      ${x}
    </body>
  </html>`}e.s(["buildSaleTicketCustomer",()=>z,"renderCashExpenseClosureTicket",()=>et,"renderChangeTicket",()=>J,"renderClosureMovementTicket",()=>ei,"renderClosureTicket",()=>ea,"renderReturnTicket",()=>Z,"renderSaleInvoice",()=>er,"renderSaleTicket",()=>ee],90063)},94415,e=>{"use strict";var t=e.i(35458);async function i(e,i,r,a){let o=new Headers(i?.headers);o.set("Content-Type","application/json"),a&&o.set("Authorization",`Bearer ${a}`);try{let r=(0,t.getApiBase)(),a=await fetch(`${r}${e}`,{...i,headers:o,credentials:"include"});if(!a.ok){let e;try{let t=await a.json();"string"==typeof t?.detail&&(e=t.detail)}catch{}throw Error(e??`Error ${a.status}`)}let n=a.headers.get("content-length")||a.headers.get("Content-Length");if(204===a.status||"0"===n||null===n)return;return await a.json()}catch(e){if(console.warn("Settings API fallback:",e),void 0!==r)return r;throw e}}let r={company_name:"",tax_id:"",address:"",contact_email:"",contact_phone:"",ticket_logo_url:"",theme_mode:"light",accent_color:"#0A84FF",ticket_footer:"",auto_close_ticket:!1,low_stock_alert:!0,require_seller_pin:!1,notifications:{daily_summary_email:!1,cash_alert_email:!1,cash_alert_sms:!1,monthly_report_email:!1},closure_email_recipients:[],release_notes_email_recipients:[],ticket_email_cc:[],smtp_host:"",smtp_port:null,smtp_user:"",smtp_password:"",smtp_use_tls:!0,email_from:"",printer_mode:"browser",printer_width:"80mm",printer_name:"",printer_auto_open_drawer:!1,printer_drawer_button:!0,web_pos_send_closure_email:!0,station_closure_email_overrides:{},web_personalization_bindings:{campana_clasica_mediana:{},campana_clasica_grande:{},campana_cromada_mediana:{},campana_cromada_grande:{},guiro_mediano:{},guiro_grande:{},maraca_par:{}},web_personalization_home_images:{campana:{},guiro:{},maraca:{}},web_brand_collage_images:{main:{},top_left:{},top_right:{},bottom:{}},web_home_sections_mode:"categories"},a=[{id:"dashboard",label:"Dashboard",description:"Indicadores generales del negocio.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0},actions:[{id:"dashboard.view",label:"Ver dashboard",description:"Permite acceder al panel principal.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"dashboard.today",label:"Ver métricas de hoy",description:"Muestra indicadores operativos del día actual.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"dashboard.history",label:"Ver histórico (semana/mes)",description:"Muestra KPIs y gráficas históricas del dashboard.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!0}}]},{id:"pos",label:"POS / Caja",description:"Punto de venta y operaciones de caja.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"pos.sales",label:"Gestionar ventas",description:"Crear, listar y editar ventas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"pos.returns",label:"Devoluciones",description:"Registrar y consultar devoluciones.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"pos.returns.void",label:"Anular devoluciones",description:"Permite anular devoluciones registradas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"pos.changes.void",label:"Anular cambios",description:"Permite anular cambios registrados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"pos.customers",label:"Clientes POS",description:"Crear y administrar clientes.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"pos.closures",label:"Cierres de caja",description:"Gestionar cierres e informes diarios.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}}]},{id:"documents",label:"Documentos",description:"Separados y documentos relacionados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"documents.separated_orders",label:"Separados",description:"Gestión de pedidos separados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"documents.sales.adjust",label:"Ajustar ventas",description:"Permite registrar ajustes sobre ventas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"documents.sales.void",label:"Anular ventas",description:"Permite anular ventas (si aplica).",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"documents.separated_orders.void_payment",label:"Anular abonos",description:"Permite anular pagos de separados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"documents.separated_orders.amend",label:"Modificar artículos de separados",description:"Permite cambiar los artículos de un separado (documento MS).",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}}]},{id:"sales_history",label:"Historial de ventas",description:"Consulta de ventas, reimpresión y seguimiento.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0},actions:[{id:"sales_history.view",label:"Ver historial de ventas",description:"Permite consultar y reimprimir ventas registradas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"sales_history.history",label:"Ver histórico por rango",description:"Permite cambiar rangos de fecha en historial de ventas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!0}}]},{id:"products",label:"Productos",description:"Catálogo e inventario.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"products.view",label:"Ver productos",description:"Permite consultar catálogo y grupos para el POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"products.manage",label:"Administrar productos",description:"Crear, editar y mantener el catálogo de productos.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"products.import",label:"Importar productos",description:"Permite importar productos masivamente desde Excel.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}}]},{id:"movements",label:"Movimientos",description:"Movimientos y control de stock.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"movements.view",label:"Ver movimientos",description:"Consultar métricas, historial y estado del stock.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"movements.manage",label:"Registrar movimientos",description:"Crear ajustes y movimientos manuales de inventario.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}}]},{id:"labels",label:"Etiquetas",description:"Generación de archivos para etiquetas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"labels.export",label:"Exportar etiquetas",description:"Descarga de plantillas para impresión.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}}]},{id:"labels_pilot",label:"Etiquetado (beta)",description:"Vista beta para flujo de etiquetado.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"labels.pilot.view",label:"Ver etiquetado beta",description:"Permite acceder a la vista Etiquetado (beta).",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}}]},{id:"reports",label:"Reportes",description:"Reportes financieros y de inventario.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0},actions:[{id:"reports.view",label:"Ver reportes",description:"Acceso a reportes y analíticas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}}]},{id:"commerce_web",label:"Comercio Web",description:"Operación del canal web: órdenes, pagos y conversión a venta.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1,"Gestor Web":!0},actions:[{id:"commerce_web.view",label:"Ver órdenes web",description:"Permite entrar al módulo Comercio Web y consultar órdenes.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!0,"Gestor Web":!0}},{id:"commerce_web.manage",label:"Gestionar órdenes web",description:"Permite registrar pagos, mover estados y convertir órdenes a venta.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1,"Gestor Web":!0}}]},{id:"settings",label:"Configuración",description:"Preferencias del POS, SMTP y otros ajustes.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},editable:!1,actions:[{id:"settings.view",label:"Ver configuración POS",description:"Permite consultar las preferencias para el POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},editable:!1},{id:"settings.manage",label:"Configurar POS",description:"Permite editar la configuración general del POS.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},editable:!1},{id:"settings.payment_methods",label:"Métodos de pago",description:"Administrar alta, edición y estado de métodos de pago.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},editable:!1},{id:"settings.payment_methods.view",label:"Ver métodos de pago",description:"Permite consultar métodos de pago desde el POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},editable:!1}]},{id:"users",label:"Usuarios",description:"Gestión e invitación de usuarios POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"users.manage",label:"Administrar usuarios",description:"Crear, editar y suspender usuarios.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"users.invite",label:"Invitar usuarios",description:"Enviar invitaciones para activar cuenta.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"stations.manage",label:"Estaciones POS",description:"Administrar estaciones y PINs de caja.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}}]},{id:"hr",label:"Recursos Humanos",description:"Gestión de empleados y datos laborales.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},actions:[{id:"hr.view",label:"Ver empleados",description:"Permite consultar la plantilla de colaboradores.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}},{id:"hr.manage",label:"Editar empleados",description:"Permite actualizar la información de empleados.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}}]},{id:"schedule",label:"Horarios",description:"Planificación semanal de turnos del equipo.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"schedule.view",label:"Ver horarios",description:"Consultar la grilla semanal de turnos.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"schedule.manage",label:"Editar horarios",description:"Crear, mover y actualizar turnos.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"schedule.publish",label:"Publicar horario",description:"Publicar la semana para compartir con el equipo.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"schedule.export",label:"Exportar horario",description:"Exportar la semana en CSV o PDF.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}}]}];async function o(e){return i("/pos/settings",void 0,e?void 0:r,e)}async function n(e){return i("/pos/stations",void 0,[],e)}async function s(e){return i("/pos/roles/permissions",void 0,e?void 0:{modules:a},e).then(e=>e.modules)}e.s(["defaultRolePermissions",0,a,"fetchPosSettings",()=>o,"fetchPosStations",()=>n,"fetchRolePermissions",()=>s])},6800,e=>{"use strict";var t=e.i(35458);async function i(e){let i=(0,t.getApiBase)(),a=r(e),o=await fetch(`${i}/pos/payment-methods`,{headers:a,credentials:"include"});if(!o.ok)throw Error(`Error ${o.status}`);return await o.json()}let r=e=>{let t={"Content-Type":"application/json"};return e&&(t.Authorization=`Bearer ${e}`),t};e.s(["DEFAULT_PAYMENT_METHODS",0,[{id:-1,name:"Efectivo",slug:"cash",is_active:!0,allow_change:!0,order_index:1},{id:-2,name:"Bancolombia QR / Transferencia",slug:"qr",is_active:!0,allow_change:!1,order_index:2},{id:-3,name:"Tarjeta Datáfono",slug:"card",is_active:!0,allow_change:!1,order_index:3},{id:-4,name:"Nequi",slug:"nequi",is_active:!0,allow_change:!1,order_index:4},{id:-5,name:"Daviplata",slug:"daviplata",is_active:!0,allow_change:!1,order_index:5},{id:-6,name:"Crédito",slug:"credito",is_active:!0,allow_change:!1,order_index:6},{id:-7,name:"Separado",slug:"separado",is_active:!0,allow_change:!1,order_index:7}],"fetchPaymentMethods",()=>i])}]);