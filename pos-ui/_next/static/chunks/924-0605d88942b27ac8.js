"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[924],{2394:(e,t,i)=>{i.d(t,{Vw:()=>r,W_:()=>d,iW:()=>n,ms:()=>l,qE:()=>o});let a="America/Bogota",s=/([zZ]|[+-]\d{2}:\d{2})$/,o=e=>{if(null==e)return null;if(e instanceof Date)return e;if("number"==typeof e){let t=new Date(e);return Number.isNaN(t.getTime())?null:t}let t=(e=>{let t=e.trim();if(!t)return"";if(t.includes("T"))return t;let i=t.indexOf(" ");return -1===i?t:`${t.slice(0,i)}T${t.slice(i+1)}`})(e);if(!t)return null;let i=new Date(s.test(t)?t:`${t}Z`);return Number.isNaN(i.getTime())?null:i},r=(e=new Date)=>{let t=o(e)??new Date,i=new Intl.DateTimeFormat("en-GB",{timeZone:a,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).formatToParts(t),s={};return i.forEach(e=>{"literal"!==e.type&&(s[e.type]=e.value)}),{year:s.year??"0000",month:s.month??"01",day:s.day??"01",hour:s.hour??"00",minute:s.minute??"00",second:s.second??"00"}},n=e=>{let{year:t,month:i,day:a}=r(e);return`${t}-${i}-${a}`},d=e=>{let[t,i,a]=e.split("-"),s=Number(t),o=Number(i),r=Number(a);return Number.isNaN(s)||Number.isNaN(o)||Number.isNaN(r)||o<1||o>12||r<1||r>31?new Date:new Date(Date.UTC(s,o-1,r,5,0,0))},l=(e,t)=>{let i=o(e);return i?new Intl.DateTimeFormat("es-CO",{timeZone:a,...t}).format(i):""}},4013:(e,t,i)=>{i.d(t,{Wg:()=>m,_A:()=>p,JL:()=>C,hS:()=>D,Zj:()=>V,g_:()=>k,bw:()=>T,LB:()=>j,E8:()=>z});let a=["212222","222122","222221","121223","121322","131222","122213","122312","132212","221213","221312","231212","112232","122132","122231","113222","123122","123221","223211","221132","221231","213212","223112","312131","311222","321122","321221","312212","322112","322211","212123","212321","232121","111323","131123","131321","112313","132113","132311","211313","231113","231311","112133","112331","132131","113123","113321","133121","313121","211331","231131","213113","213311","213131","311123","311321","331121","312113","312311","332111","314111","221411","431111","111224","111422","121124","121421","141122","141221","112214","112412","122114","122411","142112","142211","241211","221114","413111","241112","134111","111242","121142","121241","114212","124112","124211","411212","421112","421211","212141","214121","412121","111143","111341","131141","114113","114311","411113","411311","113141","114131","311141","411131","211412","211214","211232","2331112"],s={height:52,moduleWidth:2,includeText:!0,includeTextFontSize:10,quietZoneModules:10};function o(e,t){let i,o={...s,...t??{}},r=(e??"").toUpperCase().trim(),n=/^\d+$/.test(r),d=n?(i=(r??"").replace(/\D/g,""))||"0":r.replace(/[^\x20-\x7E]/g,"")||"0",l=[];if(n){d.length%2==1&&(d=`0${d}`),l.push(105);for(let e=0;e<d.length;e+=2)l.push(Number.parseInt(d.slice(e,e+2),10))}else for(let e of(l.push(104),d))l.push(e.charCodeAt(0)-32);let p=l[0];for(let e=1;e<l.length;e+=1)p+=l[e]*e;l.push(p%103),l.push(106);let c=o.moduleWidth*o.quietZoneModules,m=c,u=[];l.forEach(e=>{let t=a[e];if(t)for(let e=0;e<t.length;e+=1){let i=e%2==0,a=Number.parseInt(t[e],10)*o.moduleWidth;i&&u.push(`<rect x="${m.toFixed(2)}" y="0" width="${a.toFixed(2)}" height="${o.height}" fill="#000" />`),m+=a}}),m+=c;let v=o.includeText?`<text x="50%" y="${(o.height+o.includeTextFontSize).toFixed(2)}" font-family="monospace" font-size="${o.includeTextFontSize}" font-weight="700" text-anchor="middle" fill="#0f172a">${d}</text>`:"",g=o.height+16*!!o.includeText;return`<svg xmlns="http://www.w3.org/2000/svg" width="${m.toFixed(2)}" height="${g.toFixed(2)}" viewBox="0 0 ${m.toFixed(2)} ${g.toFixed(2)}">${u.join("")}${v}</svg>`}var r=i(5700),n=i(2394),d=i(6172),l=i(5747);function p(e){let t=Math.max(0,Number(e?.reconciled_amount||0));if(t<=0)return[];let i=(e?.resolution_history??[]).filter(e=>"reconcile"===e.action).map(e=>({amount:Math.max(0,Number(e.amount||0)),reference:"string"==typeof e.reference&&e.reference.trim()?e.reference.trim():void 0,reconciledAt:"string"==typeof e.created_at?e.created_at:void 0})).filter(e=>Number.isFinite(e.amount)&&e.amount>0),a=i.reduce((e,t)=>e+t.amount,0);return a<t-.01&&i.push({amount:t-a,reference:e?.resolution_reference?.trim()||void 0,reconciledAt:e?.resolved_at??e?.updated_at??void 0}),i}var c=i(4566);function m(e){if(!e?.name)return;let t={name:e.name};return e.phone&&(t.phone=e.phone),e.email&&(t.email=e.email),e.taxId&&(t.taxId=e.taxId),e.address&&(t.address=e.address),t}let u="Kensar Electronic",v="Cra. 15 #123 - Bogot\xe1",g="+57 300 000 0000",h="NIT 900000000-0",b="contacto@kensar.com",x="Gracias por tu compra.",f=/^\s*\[\[align=(left|center|right)\]\]\s*\n?/i;function $(e){let t=(e??"").replace(/\r\n/g,"\n"),i=t.match(f),a=i?.[1]??"center";return{text:t.replace(f,""),align:a}}let y=e=>{let t=e?.trim();if(!t)return"";if(/^data:/i.test(t))return t;let i=(()=>{if(window.location?.origin)return window.location.origin;let e="undefined"!=typeof globalThis?globalThis.location:void 0;return e?.origin?e.origin:c.env.NEXT_PUBLIC_APP_URL??""})(),a=(()=>{let e=c.env.NEXT_PUBLIC_API_BASE_URL?.trim();if(e)return e.replace(/\/$/,"");if(window.location){let{protocol:e,hostname:t,port:i}=window.location;return`${e}//${t}:${i&&"3000"!==i?i:"8000"}`}let t="undefined"!=typeof globalThis?globalThis.location:void 0;return t?.origin?t.origin.replace(/\/$/,""):""})();if(/^https?:\/\//i.test(t))try{return new URL(t).toString()}catch{return t}if(t.startsWith("//")){let e=i?new URL(i).protocol:a?new URL(a).protocol:"https:";return`${e}${t}`}let s=t.startsWith("/")?t:`/${t}`,o=/^\/?uploads\//i.test(s)?a||i:i||a;if(!o)return t;let r=o.replace(/\/$/,"");return`${r}${s}`},w=e=>{let t=e?.logoUrl??e?.logo_url??e?.ticket_logo_url??"";return t?.trim()||void 0};function A(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function _(e){return e.replace(/\r\n/g,"\n").split("\n").map(e=>{let t,i,a=e.length>0?1===(i=(t=A(e)).split("**")).length?t:i.map((e,t)=>t%2==0?e:`<strong>${e}</strong>`).join(""):"&nbsp;";return`<div>${a}</div>`}).join("")}function S(e){return`$ ${e.toLocaleString("es-CO",{minimumFractionDigits:0,maximumFractionDigits:0})}`}function N(e){let t=S(Math.abs(e));return e<0?`-${t}`:t}function E(e){return e?(0,n.ms)(e,{dateStyle:"short",timeStyle:"short"})||e:""}function P(e,t){if(!e?.length)return"";let i=0,a=0,s=e.map(e=>{let s="sale"===e.document_type?"Venta original":"change"===e.document_type?`Cambio ${++i}`:`Devoluci\xf3n ${++a}`,o=["voided","anulado","cancelled","canceled"].includes((e.status||"").toLowerCase())?" \xb7 ANULADO":"",r=e.document_number===t,n=(e.items??[]).map(e=>{let t="purchased"===e.action?"Compr\xf3":"received"===e.action?"Cliente recibi\xf3":"Cliente devolvi\xf3",i=Number.isInteger(e.quantity)?e.quantity.toString():e.quantity.toLocaleString("es-CO",{maximumFractionDigits:3});return`<div class="history-product"><strong>${A(t)}:</strong> ${A(i)} \xd7 ${A(e.product_name)}</div>`}).join("");return`<div class="history-row${r?" history-current":""}">
      <div><strong>${A(s)}</strong>${o}${r?" \xb7 ESTE DOCUMENTO":""}</div>
      <div>${A(e.document_number)} \xb7 ${A(E(e.created_at))}</div>
      ${n}
    </div>`}).join(""),o=e.filter(e=>"change"===e.document_type).length,r=e.filter(e=>"return"===e.document_type).length;return`<div class="history">
    <div class="history-title">HISTORIAL DEL PROCESO</div>
    <div class="history-summary">Esta venta registra ${o} ${1===o?"cambio":"cambios"} y ${r} ${1===r?"devoluci\xf3n":"devoluciones"}.</div>
    ${s}
  </div>`}function T(e){let t=e.settings,i=t?.company_name?.trim()||u,a=t?.tax_id?.trim()||h,s=t?.address?.trim()||v,r=t?.contact_phone?.trim()||g,n=t?.contact_email?.trim()||b,d=$(t?.ticket_footer),l=d.text.trim()||x,p=d.align,c=y(w(t)),m=o(e.documentNumber,{height:30,moduleWidth:1.5,includeText:!0,includeTextFontSize:11,quietZoneModules:10}),f=e.items.length?e.items.map(e=>`
          <div class="item-row">
            <div class="item-name">${A(e.name)}</div>
            <div class="item-meta">${e.quantity} \xd7 ${S(e.unitPrice)}</div>
            <div class="item-total">${N(-Math.abs(e.total))}</div>
          </div>`).join(""):'<div class="muted">Sin productos devueltos.</div>',T=e.payments.filter(e=>Math.abs(e.amount)>0).map(e=>`
      <div class="row">
        <span>${A(e.label)}</span>
        <span>${N(-Math.abs(e.amount))}</span>
      </div>`).join(""),D=e.originalDocumentNumber?`<div>Documento origen: ${A(e.originalDocumentNumber)}</div>`:"",z=e.rootSaleDocumentNumber&&e.rootSaleDocumentNumber!==e.originalDocumentNumber?`<div>Venta ra\xedz: ${A(e.rootSaleDocumentNumber)}</div>`:"",C=e.sellerName?`<div>Vendedor: ${A(e.sellerName)}</div>`:"",V=e.posName?`<div>POS: ${A(e.posName)}</div>`:"",j=P(e.operationHistory,e.documentNumber);return`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Devoluci\xf3n ${A(e.documentNumber)}</title>
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
            ${c?`<img class="logo" src="${c}" alt="${A(i)}" />`:""}
            <div class="title">${A(i)}</div>
            <div class="muted">${A(s)}</div>
            <div class="muted">${A(a)}</div>
            <div class="muted">${A(r)} \xb7 ${A(n)}</div>
            <div class="badge">DEVOLUCI\xd3N</div>
          </div>
          <div class="meta">
            <div>Documento: ${A(e.documentNumber)}</div>
            ${D}
            ${z}
            ${V}
            ${C}
            <div>Fecha: ${A(E(e.createdAt))}</div>
          </div>
          ${j}
          <div class="line"></div>
          <div class="section">
            <div class="row">
              <span>Total devoluci\xf3n</span>
              <span class="total">${N(-Math.abs(e.totalRefund))}</span>
            </div>
          </div>
          <div class="section">
            <div class="row"><span>Detalle de productos</span></div>
            <div class="items">${f}</div>
          </div>
          ${T?`<div class="section">
                <div class="row"><span>Reembolso</span></div>
                ${T}
              </div>`:""}
          ${e.notes?`<div class="section muted">Notas: ${A(e.notes)}</div>`:""}
          <div class="barcode">${m}</div>
          <div class="line"></div>
          <div class="muted" style="text-align:${p};">${_(l)}</div>
        </div>
      </body>
    </html>
  `}function D(e){let t=e.settings,i=t?.company_name?.trim()||u,a=t?.tax_id?.trim()||h,s=t?.address?.trim()||v,r=t?.contact_phone?.trim()||g,n=t?.contact_email?.trim()||b,d=$(t?.ticket_footer),l=d.text.trim()||x,p=d.align,c=y(w(t)),m=o(e.documentNumber,{height:30,moduleWidth:1.5,includeText:!0,includeTextFontSize:11,quietZoneModules:10}),f=e.itemsReturned.length?e.itemsReturned.map(e=>`
          <div class="item-row">
            <div class="item-name">${A(e.name)}</div>
            <div class="item-meta">${e.quantity} \xd7 ${S(e.unitPrice)}</div>
            <div class="item-total">${N(-Math.abs(e.total))}</div>
          </div>`).join(""):'<div class="muted">Sin productos devueltos.</div>',T=e.itemsNew.length?e.itemsNew.map(e=>`
          <div class="item-row">
            <div class="item-name">${A(e.name)}</div>
            <div class="item-meta">${e.quantity} \xd7 ${S(e.unitPrice)}</div>
            <div class="item-total">${S(e.total)}</div>
          </div>`).join(""):'<div class="muted">Sin productos nuevos.</div>',D=e.payments.filter(e=>Math.abs(e.amount)>0).map(e=>`
      <div class="row">
        <span>${A(e.label)}</span>
        <span>${S(e.amount)}</span>
      </div>`).join(""),z=e.originalDocumentNumber?`<div>Documento origen: ${A(e.originalDocumentNumber)}</div>`:"",C=e.rootSaleDocumentNumber&&e.rootSaleDocumentNumber!==e.originalDocumentNumber?`<div>Venta ra\xedz: ${A(e.rootSaleDocumentNumber)}</div>`:"",V=e.sellerName?`<div>Vendedor: ${A(e.sellerName)}</div>`:"",j=e.posName?`<div>POS: ${A(e.posName)}</div>`:"",k=P(e.operationHistory,e.documentNumber);return`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Cambio ${A(e.documentNumber)}</title>
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
            ${c?`<img class="logo" src="${c}" alt="${A(i)}" />`:""}
            <div class="title">${A(i)}</div>
            <div class="muted">${A(s)}</div>
            <div class="muted">${A(a)}</div>
            <div class="muted">${A(r)} \xb7 ${A(n)}</div>
            <div class="badge">CAMBIO</div>
          </div>
          <div class="meta">
            <div>Documento: ${A(e.documentNumber)}</div>
            ${z}
            ${C}
            ${j}
            ${V}
            <div>Fecha: ${A(E(e.createdAt))}</div>
          </div>
          ${k}
          <div class="line"></div>
          <div class="section">
            <div class="row">
              <span>Total cr\xe9dito</span>
              <span>${N(-Math.abs(e.totalCredit))}</span>
            </div>
            <div class="row">
              <span>Total nuevo</span>
              <span>${S(e.totalNew)}</span>
            </div>
            <div class="row total">
              <span>Diferencia</span>
              <span>${N(e.extraPayment-e.refundDue)}</span>
            </div>
            ${e.extraPayment>0?`<div class="row"><span>Excedente cobrado</span><span>${S(e.extraPayment)}</span></div>`:""}
            ${e.refundDue>0?`<div class="row"><span>Saldo devuelto${e.refundMethod?` (${A(e.refundMethod)})`:""}</span><span>${S(e.refundDue)}</span></div>`:""}
          </div>
          <div class="section">
            <div class="row"><span>Productos devueltos</span></div>
            <div class="items">${f}</div>
          </div>
          <div class="section">
            <div class="row"><span>Productos nuevos</span></div>
            <div class="items">${T}</div>
          </div>
          ${D?`<div class="section">
                <div class="row"><span>Pagos del excedente</span></div>
                ${D}
              </div>`:""}
          ${e.notes?`<div class="section muted">Notas: ${A(e.notes)}</div>`:""}
          <div class="barcode">${m}</div>
          <div class="line"></div>
          <div class="muted" style="text-align:${p};">${_(l)}</div>
        </div>
      </body>
    </html>
  `}function z(e){var t;let i,a,s,p,c,m,f,N,P,T=e.settings,D=T?.company_name?.trim()||u,z=T?.tax_id?.trim()||h,C=T?.address?.trim()||v,V=T?.contact_phone?.trim()||g,j=T?.contact_email?.trim()||b,k=$(T?.ticket_footer),I=k.text.trim()||x,M=k.align,O=y(w(T)),R=e.payments.length?e.payments.map(e=>`
          <div class="row">
            <span>${A(e.label)}</span>
            <span>${S(e.amount)}</span>
          </div>`).join(""):'<div class="row"><span>Sin pagos registrados</span><span>0</span></div>',L=e.separatedInfo?'<div class="separated-badge">VENTA POR SEPARADO</div>':"",B="number"==typeof e.changeAmount&&0!==e.changeAmount?`<div class="row">
            <span>${e.changeAmount>0?"Cambio":"Saldo"}</span>
            <span>${S(Math.abs(e.changeAmount))}</span>
          </div>`:"",F=e.separatedInfo?(i=[...e.separatedInfo?.initialPayments??[],...e.separatedInfo?.payments??[]],a=e.separatedInfo?.reconciliations??[],s=i.length?i.map(e=>{let t=[];e.method&&t.push(e.method),e.paidAt&&t.push(E(e.paidAt));let i=t.length>0?`<div class="sep-meta">${t.map(e=>A(e)).join(" \xb7 ")}</div>`:"";return`<div class="row separated-row">
                  <div>
                    <div class="sep-label">${A(e.label)}</div>
                    ${i}
                  </div>
                  <span>${S(e.amount)}</span>
                </div>`}).join(""):'<div class="row separated-row"><div class="sep-label">Sin abonos registrados</div><span>0</span></div>',p=a.map((e,t)=>{let i=[];e.reference&&i.push(`Ref. ${e.reference}`),e.reconciledAt&&i.push(E(e.reconciledAt));let s=i.length?`<div class="sep-meta">${i.map(e=>A(e)).join(" \xb7 ")}</div>`:"",o=a.length>1?`Pago conciliado ${t+1}`:"Pago conciliado";return`<div class="row separated-row">
              <div>
                <div class="sep-label">${A(o)}</div>
                ${s}
              </div>
              <span>${S(e.amount)}</span>
            </div>`}).join(""),c=i.reduce((e,t)=>e+Number(t.amount||0),0)+a.reduce((e,t)=>e+Number(t.amount||0),0),m="number"==typeof e.separatedInfo?.appliedTotal?Math.max(e.separatedInfo.appliedTotal,0):c,f=`<div class="row separated-row balance-row">
          <div class="sep-label">Total aplicado</div>
          <span>${S(m)}</span>
        </div>`,N=e.separatedInfo?.dueDate?`<div class="line"><span>Fecha l\xedmite</span><span>${!(t=e.separatedInfo?.dueDate)?"":(0,n.ms)(t,{dateStyle:"short"})||t}</span></div>`:"",P="number"==typeof e.separatedInfo?.balance?`<div class="row separated-row balance-row">
                <div class="sep-label">Saldo pendiente</div>
                <span>${S(Math.max(e.separatedInfo.balance,0))}</span>
              </div>`:"",`<div class="separator"></div>
          <div class="section">
            <div class="line-title">Detalle de abonos</div>
            ${N}
            <div class="payments">${s}</div>
            ${p?`<div class="payments">${p}</div>`:""}
            ${f}
            ${P}
          </div>`):"",q=e.items.length?e.items.map(e=>{let t=Math.max(0,e.quantity*e.unitPrice-e.total),i=t>0?`<span class="item-discount">(Desc -${S(t)})</span>`:"";return`
        <div class="item-row">
          <div>
            <div class="item-name">${A(e.name)}</div>
            <div class="item-meta">${e.quantity} x ${S(e.unitPrice)} ${i}</div>
          </div>
          <div class="item-total">${S(e.total)}</div>
        </div>`}).join(""):'<div class="item-row"><div class="item-name">Sin art\xedculos</div></div>',U=e.customer&&e.customer.name?`<div class="line-title">Cliente</div><div class="customer-name">${A(e.customer.name)}</div>`+(e.customer.phone?`<div class="customer-detail">Tel: ${A(e.customer.phone)}</div>`:"")+(e.customer.email?`<div class="customer-detail">Email: ${A(e.customer.email)}</div>`:"")+(e.customer.taxId?`<div class="customer-detail">NIT / ID: ${A(e.customer.taxId)}</div>`:"")+(e.customer.address?`<div class="customer-detail">Direcci\xf3n: ${A(e.customer.address)}</div>`:""):"",W=e.notes&&e.notes.trim().length?`<div class="section">
          <div class="line-title">Notas</div>
          <div class="notes">${A(e.notes).split("\n").map(e=>e.trim()).filter(Boolean).map(e=>`<div>${e}</div>`).join("")}</div>
        </div>`:"",G=e.documentNumber?.trim()||`V-${String(e.saleNumber??0).padStart(6,"0")}`,H=o(/^OFF-/i.test(G)?(0,r.L)(G)??G:G,{height:30,moduleWidth:2,includeText:!0,includeTextFontSize:12,quietZoneModules:10}),Y=d.d?e.rewardPublicUrl:null,Z=Y?`<div class="separator"></div>
        <div class="loyalty-block">
          <div class="loyalty-title">\xa1TIENES UN BENEFICIO PARA TU PR\xd3XIMA COMPRA!</div>
          <div class="loyalty-copy">Escanea este QR para descubrirlo y activarlo.</div>
          <div class="loyalty-qr"><img src="${function(e,t=8,i=2){let a=(0,l.Ay)(0,"M");return a.addData(e),a.make(),a.createDataURL(t,i)}(Y)}" alt="C\xf3digo QR del beneficio" /></div>
          <div class="loyalty-terms">\xa1No lo dejes para despu\xe9s! Escan\xe9alo ahora, activa tu beneficio y gu\xe1rdalo para tu pr\xf3xima compra.<br /><span>Sujeto a condiciones y vigencia.</span></div>
        </div>`:"",X=Y?`@page {
          size: 80mm auto;
          margin: 0;
        }
        html {
          width: 80mm;
          margin: 0;
          padding: 0;
        }`:"@page { margin: 4mm; }",Q=Y?"0":"0 auto",K=Y?`
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;`:"";return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Ticket ${A(e.documentNumber)}</title>
      <style>
        ${X}
        * { box-sizing: border-box; }
        body {
          font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
          width: 80mm;
          margin: ${Q};
          font-size: 13px;
          color: #0f172a;
          background: #ffffff;${K}
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
          ${O?`<img src="${A(O)}" alt="Logo" />`:`<strong>${A(D)}</strong>`}
        </div>
        <h1>${A(D)}</h1>
        <div class="company-info">
          ${A(C)}<br />
          ${A(V)} \xb7 ${A(j)}<br />
          ${A(z)}<br />
          CONSERVA ESTE RECIBO Y EMPAQUE ORIGINAL PARA GARANT\xcdA
        </div>

        <div class="separator"></div>

        ${U}
        ${U?'<div class="separator"></div>':""}
        ${e.adjustmentBadge?`<div class="adjustment-banner">${A(e.adjustmentBadge)}</div>${e.adjustmentNote?`<div class="adjustment-note">${A(e.adjustmentNote)}</div>`:""}`:""}
        <div class="section">
          <div class="line"><span>No. Recibo</span><span>${A(e.documentNumber)}</span></div>
          <div class="line"><span>Fecha</span><span>${(0,n.ms)(e.date,{dateStyle:"short",timeStyle:"short"})}</span></div>
          ${e.vendorName?`<div class="line"><span>Usuario</span><span>${A(e.vendorName)}</span></div>`:""}
          ${e.posName?`<div class="line"><span>POS</span><span>${A(e.posName)}</span></div>`:""}
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line-title">Detalle de productos</div>
          <div class="items">
            ${q}
          </div>
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line"><span>Subtotal</span><span>${S(e.subtotal)}</span></div>
          ${e.lineDiscountTotal>0?`<div class="line">
                   <span>Descuento art\xedculos</span>
                   <span>- ${S(e.lineDiscountTotal)}</span>
                 </div>`:""}
          <div class="line">
            <span>${A(e.cartDiscountLabel)}</span>
            <span>${A(e.cartDiscountValueDisplay)}</span>
          </div>
          ${e.surchargeLabel&&("number"==typeof e.surchargeAmount?e.surchargeAmount>0:!!(e.surchargeValueDisplay&&e.surchargeValueDisplay.trim()))?`<div class="line">
                   <span>${A(e.surchargeLabel)}</span>
                   <span>${"number"==typeof e.surchargeAmount&&e.surchargeAmount>0?`+ ${S(e.surchargeAmount)}`:A(e.surchargeValueDisplay?.startsWith("+")?e.surchargeValueDisplay:`+${e.surchargeValueDisplay??""}`)}</span>
                 </div>`:""}
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line-title">Pagos recibidos</div>
          ${L}
          <div class="payments">
            ${R}
            ${B}
          </div>
        </div>

        ${F}

        <div class="totals">
          <span>TOTAL</span>
          <strong>${S(e.total)}</strong>
        </div>

        ${W}

        <div class="barcode">${H}</div>

        <div class="footer" style="text-align:${M};">
          ${_(I)}
        </div>

        ${Z}
      </div>
    </body>
  </html>`}function C(e){let t=e.expenses.reduce((e,t)=>e+Math.max(Number(t.amount||0),0),0),i=Number(e.expectedCash||0)-t,a=Number(e.countedCash||0)-i,s=e.expenses.length?e.expenses.map(e=>{let t=e.description?.trim()?`<div class="muted">${A(e.description)}</div>`:"";return`
            <div class="expense">
              <div>
                <div class="strong">${A(e.categoryLabel)}</div>
                ${t}
                <div class="muted">${E(e.createdAt)} \xb7 ${A(e.createdBy)}</div>
              </div>
              <div class="amount">${S(e.amount)}</div>
            </div>`}).join(""):'<div class="muted center">No se registraron gastos de caja.</div>';return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Gastos ${A(e.documentNumber)}</title>
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
        <div class="row"><span>Cierre</span><span>${A(e.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,n.ms)(e.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${e.posName?`<div class="row"><span>POS</span><span>${A(e.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${A(e.responsible)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="row emphasize"><span>Total de HOY</span><span>${S(e.totalToday)}</span></div>
        <div class="row"><span>Efectivo esperado</span><span>${S(e.expectedCash)}</span></div>
        <div class="row"><span>Total gastos</span><span>- ${S(t)}</span></div>
        <div class="row emphasize"><span>Efectivo final esperado</span><span>${S(i)}</span></div>
        <div class="row"><span>Efectivo contado</span><span>${S(e.countedCash)}</span></div>
        <div class="row"><span>Diferencia ajustada</span><span>${S(a)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="muted">Detalle de gastos</div>
        ${s}
      </div>
    </body>
  </html>`}function V(e){let t=e.returns.reduce((e,t)=>e+Math.max(Number(t.totalRefund||0),0),0),i=e.changes.reduce((e,t)=>e+Math.max(Number(t.extraPayment||0),0),0),a=e.changes.reduce((e,t)=>e+Math.max(Number(t.refundDue||0),0),0),s=t+a,o=new Map,r=(e,t,i)=>{let a=e?.trim()||"Otro m\xe9todo",s=a.toLowerCase(),r=o.get(s)??{method:a,entries:0,exits:0};"entry"===i&&(r.entries+=t),"exit"===i&&(r.exits+=t),o.set(s,r)};e.returns.forEach(e=>{(e.payments.length?e.payments:[{method:"Efectivo",amount:e.totalRefund}]).forEach(e=>r(e.method,e.amount,"exit"))}),e.changes.forEach(e=>{(e.payments.length?e.payments:e.extraPayment>0?[{method:"Efectivo",amount:e.extraPayment}]:[]).forEach(e=>r(e.method,e.amount,"entry")),e.refundDue>0&&r(e.refundMethod||"Efectivo",e.refundDue,"exit")});let d=Array.from(o.values()).filter(e=>e.entries>0||e.exits>0).sort((e,t)=>e.method.localeCompare(t.method,"es")).map(e=>`
        <div class="method-row">
          <div class="strong">${A(e.method)}</div>
          <div>${S(e.entries)}</div>
          <div>${S(e.exits)}</div>
          <div class="strong">${S(e.entries-e.exits)}</div>
        </div>`).join(""),l=e=>e.length?e.map(e=>`${A(String(e.quantity))} x ${A(e.name)}${e.total?` (${S(e.total)})`:""}`).join("<br />"):"Sin productos",p=e=>e.length?e.map(e=>`${A(e.method)} ${S(e.amount)}`).join("<br />"):"Efectivo",c=e.returns.length?e.returns.map(e=>`
            <div class="movement">
              <div class="movement-head">
                <div>
                  <div class="strong">${A(e.documentNumber||`DV-${e.id}`)}</div>
                  <div class="muted">Origen ${A(e.saleDocumentNumber||"Sin documento")}</div>
                </div>
                <div class="amount exit">${S(e.totalRefund)}</div>
              </div>
              <div class="muted">${E(e.createdAt)} \xb7 ${A(e.createdBy||"Sin usuario")}</div>
              <div class="muted">${l(e.items)}</div>
              <div class="muted">M\xe9todos: ${p(e.payments)}</div>
            </div>`).join(""):'<div class="muted center">Sin devoluciones en este cierre.</div>',m=e.changes.length?e.changes.map(e=>`
            <div class="movement">
              <div class="movement-head">
                <div>
                  <div class="strong">${A(e.documentNumber||`CB-${e.id}`)}</div>
                  <div class="muted">Origen ${A(e.saleDocumentNumber||"Sin documento")}</div>
                </div>
                <div class="amount">${S(e.extraPayment-e.refundDue)}</div>
              </div>
              <div class="muted">${E(e.createdAt)} \xb7 ${A(e.createdBy||"Sin usuario")}</div>
              <div class="muted">Devuelve: ${l(e.returnedItems)}</div>
              <div class="muted">Entrega: ${l(e.newItems)}</div>
              <div class="row"><span>Cr\xe9dito devuelto</span><span>${S(e.totalCredit)}</span></div>
              <div class="row"><span>Nuevo total</span><span>${S(e.totalNew)}</span></div>
              <div class="row"><span>Entrada</span><span>${S(e.extraPayment)}</span></div>
              <div class="row"><span>Salida</span><span>${S(e.refundDue)}</span></div>
              <div class="muted">M\xe9todos entrada: ${p(e.payments)}</div>
              ${e.refundDue>0?`<div class="muted">M\xe9todo salida: ${A(e.refundMethod||"Efectivo")}</div>`:""}
            </div>`).join(""):'<div class="muted center">Sin cambios en este cierre.</div>';return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Movimientos ${A(e.documentNumber)}</title>
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
        <div class="row"><span>Cierre</span><span>${A(e.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,n.ms)(e.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${e.posName?`<div class="row"><span>POS</span><span>${A(e.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${A(e.responsible)}</span></div>
      </div>
      <hr />
      <div>
        <div class="row"><span>Devoluciones</span><span>${e.returns.length}</span></div>
        <div class="row"><span>Salidas por devoluciones</span><span>${S(t)}</span></div>
        <div class="row"><span>Cambios</span><span>${e.changes.length}</span></div>
        <div class="row"><span>Entradas por cambios</span><span>${S(i)}</span></div>
        <div class="row"><span>Salidas por cambios</span><span>${S(a)}</span></div>
        <div class="row emphasize"><span>Neto movimientos</span><span>${S(i-s)}</span></div>
      </div>
      <hr />
      <h2>M\xe9todos</h2>
      <div class="method-head"><div>M\xe9todo</div><div>Entrada</div><div>Salida</div><div>Neto</div></div>
      ${d||`<div class="muted center" style="padding:6px 0;">Sin m\xe9todos.</div>`}
      <hr />
      <h2>Devoluciones</h2>
      ${c}
      <hr />
      <h2>Cambios</h2>
      ${m}
    </body>
  </html>`}function j(e){let t=e.settings,i=t?.company_name?.trim()||u,a=t?.tax_id?.trim()||h,s=t?.address?.trim()||v,o=t?.contact_phone?.trim()||g,r=t?.contact_email?.trim()||b,d=$(t?.ticket_footer),l=d.text.trim()||x,p=d.align,c=y(w(t)),m=e.payments.reduce((e,t)=>e+(t.amount??0),0)||e.total,f=Math.max(0,e.total-m),N=e.items.length?e.items.map((e,t)=>{let i=e.quantity??1,a=e.unitPrice&&e.unitPrice>0?e.unitPrice:i>0?e.total/i:e.total,s=Math.max(0,a*i-e.total);return`
            <tr>
              <td>${t+1}</td>
              <td>${A(e.name)}</td>
              <td>${i}</td>
              <td>${S(a)}</td>
              <td>${s>0?"-${formatMoney(discount)}":"0"}</td>
              <td>${S(e.total)}</td>
            </tr>`}).join(""):`<tr><td colspan="6" class="muted">Sin art\xedculos</td></tr>`,E=[e.customer?.name?A(e.customer.name):"Cliente Final",e.customer?.taxId?`NIT / Documento: ${A(e.customer.taxId)}`:"",e.customer?.address?`Direcci\xf3n: ${A(e.customer.address)}`:"",e.customer?.phone?`Tel\xe9fono: ${A(e.customer.phone)}`:"",e.customer?.email?`Email: ${A(e.customer.email)}`:""].filter(Boolean).join("<br />"),P=e.payments.length?e.payments.map(e=>`
            <tr>
              <td>${A(e.label)}</td>
              <td>${S(e.amount)}</td>
            </tr>`).join(""):`<tr><td>Pago registrado</td><td>${S(e.total)}</td></tr>`,T=(0,n.ms)(e.date,{dateStyle:"short",timeStyle:"short"})||"",D=e.adjustmentBadge?`<div class="adjustment-banner">${A(e.adjustmentBadge)}</div>${e.adjustmentNote?`<div class="adjustment-note">${A(e.adjustmentNote)}</div>`:""}`:"";return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Factura ${A(e.documentNumber)}</title>
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
            <p><strong>${A(i)}</strong></p>
            <p>${A(s)}</p>
            <p>Tel: ${A(o)} \xb7 Email: ${A(r)}</p>
            <p>NIT: ${A(a)}</p>
          </div>
          <div class="meta">
            <div class="logo">${c?`<img src="${A(c)}" alt="Logo" />`:""}</div>
            <div class="doc-number">${A(e.documentNumber)}</div>
            <div>Fecha: ${T}</div>
            <div>POS: ${A(e.posName??"")}</div>
            <div>Cajero: ${A(e.vendorName??"")}</div>
          </div>
        </header>

        <div class="info-grid">
          <div class="info-box">
            <strong>Cliente</strong>
            ${E}
          </div>
          <div class="info-box">
            <strong>Resumen</strong>
            <div>Ticket #: ${A(e.documentNumber)}</div>
            <div>Documentos: ${A(e.documentNumber)}</div>
            <div>Estado del pago: ${f>0?"Pendiente":"Pagado"}</div>
          </div>
        </div>

        ${D}

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
            ${N}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td>Subtotal</td>
            <td>${S(e.subtotal)}</td>
          </tr>
          ${e.lineDiscountTotal>0?`<tr><td>Descuento art\xedculos</td><td>- ${S(e.lineDiscountTotal)}</td></tr>`:""}
          <tr>
            <td>${A(e.cartDiscountLabel)}</td>
            <td>${A(e.cartDiscountValueDisplay)}</td>
          </tr>
          ${e.surchargeLabel&&("number"==typeof e.surchargeAmount?0!==e.surchargeAmount:!!e.surchargeValueDisplay?.trim())?`<tr><td>${A(e.surchargeLabel)}</td><td>${"number"==typeof e.surchargeAmount?(e.surchargeAmount>=0?"+ ":"- ")+S(Math.abs(e.surchargeAmount)):A(e.surchargeValueDisplay??"")}</td></tr>`:""}
          <tr class="total">
            <td>Total</td>
            <td>${S(e.total)}</td>
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
            ${P}
            <tr>
              <td><strong>Pagado</strong></td>
              <td><strong>${S(m)}</strong></td>
            </tr>
            <tr>
              <td><strong>Saldo</strong></td>
              <td><strong>${S(f)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="footer-note" style="text-align:${p};">
          ${_(l)}
        </div>
        <footer>P\xe1gina 1</footer>
      </div>
    </body>
  </html>`}function k(e){let t=e.settings,i=t?.company_name?.trim()||u,a=t?.tax_id?.trim()||h,s=t?.address?.trim()||v,o=t?.contact_phone?.trim()||g,r=t?.contact_email?.trim()||b,d=y(w(t)),l=function(e){if(!e)return;let t=Number(e.reservedTotal??0),i=Number(e.paymentsTotal??0),a=Math.max(t-i,0),s=a>0?a:Number(e.pendingTotal??0),o=Number(e.dayCollectedTotal??t-s);return{tickets:Number(e.tickets??0),paymentsTotal:i,reservedTotal:t,pendingTotal:s,dayCollectedTotal:o,dayWithPendingTotal:e.dayWithPendingTotal??o+s}}(e.separatedSummary),p=e.methods.some(e=>"number"==typeof e.gross||"number"==typeof e.refunds||"number"==typeof e.net),c=e.methods.length?e.methods.map(e=>{let t=e.gross??e.amount??0,i=e.refunds??0,a=e.net??e.amount??t-i;return p?`
        <div class="method-grid">
          <span>${A(e.label)}</span>
          <span>${S(t)}</span>
          <span>${N(-Math.abs(i))}</span>
          <span>${N(a)}</span>
        </div>`:`
        <div class="row">
          <span>${A(e.label)}</span>
          <span>${N(a)}</span>
        </div>`}).join(""):p?'<div class="method-grid"><span>Sin m\xe9todos registrados</span><span>$ 0</span><span>$ 0</span><span>$ 0</span></div>':'<div class="row"><span>Sin m\xe9todos registrados</span><span>$ 0</span></div>',m=p?`
      <div class="method-grid header">
        <span>M\xe9todo</span>
        <span>Ventas</span>
        <span>Reembolsos</span>
        <span>Neto</span>
      </div>`:"",x=e.userBreakdown&&e.userBreakdown.length?e.userBreakdown.map(e=>`
        <div class="row">
          <span>${A(e.name)}</span>
          <span>${S(e.total)}</span>
        </div>`).join(""):"",f=e.stationBreakdown&&e.stationBreakdown.length?e.stationBreakdown.map(t=>{let i=e.stationBreakdown?.length===1?Number(l?.pendingTotal??0):0,a=Number(t.pendingTotal??0);return`
        <div class="row">
          <span>${A(t.stationLabel)} (${Math.max(0,Number(t.salesCount||0))})</span>
          <span>${S(Math.max(Number(t.netAmount??0)-(i>0&&a<=0?i:a),0))}</span>
        </div>`}).join(""):"",$=!!e.separatedSummary,_=Number(e.totals.registered),E=Number(e.totals.net),P=$?Number(l?.dayCollectedTotal??E):0,T=e.notes&&e.notes.trim().length?`<div class="block">
          <div class="muted">Notas</div>
          <div>${A(e.notes).split("\n").map(e=>e.trim()).filter(Boolean).map(e=>`<div>${e}</div>`).join("")}</div>
        </div>`:"",D=e.isContingency?`<div class="block" style="border:1px solid #b45309;background:#fffbeb;padding:6px;font-weight:700;text-align:center;">
        CIERRE DE CONTINGENCIA<br/><span style="font-weight:400;">Pendiente de consolidaci\xf3n con Metrik al recuperar conexi\xf3n.</span>
      </div>`:"",z=e.totals.changeExtra??0,C=e.totals.changeRefund??0,V=e.totals.changeCount??0,j=z>0||C>0||V>0;return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Reporte ${A(e.documentNumber)}</title>
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
      ${d?`<div class="logo"><img src="${A(d)}" alt="Logo" /></div>`:""}
      <h1>${A(i)}</h1>
      <div class="center muted">${A(s)}</div>
      <div class="center muted">${A(o)}</div>
      <div class="center muted">${A(r)}</div>
      <div class="center muted">${A(a)}</div>
      <div class="center muted subtitle" style="margin-top:4px;">${e.isContingency?"Cierre de contingencia":"Reporte Z - Cierre de caja"}</div>
      <hr />
      ${D}
      <div class="block">
        <div class="row"><span>No. Reporte</span><span>${A(e.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,n.ms)(e.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${e.rangeSummary?`<div class="row"><span>Ventas del</span><span>${A(e.rangeSummary.startLabel===e.rangeSummary.endLabel?e.rangeSummary.startLabel:`${e.rangeSummary.startLabel} - ${e.rangeSummary.endLabel}`)}</span></div>`:""}
        ${e.posName?`<div class="row"><span>POS</span><span>${A(e.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${A(e.responsible)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="row"><span>Total registrado</span><span>${S(_)}</span></div>
        <div class="row"><span>Devoluciones / reembolsos</span><span>- ${S(e.totals.refunds)}</span></div>
        ${j?`<div class="row"><span>Cambios (excedente)</span><span>${S(z)}</span></div>
               <div class="row"><span>Cambios (reembolsos)</span><span>- ${S(C)}</span></div>
               ${V>0?`<div class="row"><span>Total cambios</span><span>${V}</span></div>`:""}`:""}
        <div class="row emphasize"><span>Neto del d\xeda</span><span>${S(E)}</span></div>
        <div class="row"><span>Efectivo esperado</span><span>${S(e.totals.expectedCash)}</span></div>
        <div class="row"><span>Efectivo contado</span><span>${S(e.totals.countedCash)}</span></div>
        <div class="row"><span>Diferencia</span><span>${S(e.totals.difference)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="muted">Detalle por m\xe9todo</div>
        ${m}
        ${c}
        ${p?"":'<div class="muted" style="margin-top:4px;">Totales netos (reembolsos ya descontados).</div>'}
      </div>
      ${x?`<hr />
        <div class="block">
          <div class="muted">Ventas por usuario</div>
          ${x}
        </div>`:""}
      ${$?`<hr />
        <div class="block">
          <div class="muted">Aclaraci\xf3n de total del d\xeda</div>
          <div class="row emphasize"><span>Total de HOY</span><span>${S(P)}</span></div>
        </div>`:""}
      ${f?`<hr />
        <div class="block">
          <div class="muted">Ventas por estaci\xf3n</div>
          ${f}
        </div>`:""}
      ${l?`<hr />
        <div class="block">
          <div class="muted">Ventas por separado</div>
          <div class="row"><span>Tickets registrados</span><span>${l.tickets}</span></div>
          <div class="row"><span>Abonos cobrados</span><span>${S(l.paymentsTotal)}</span></div>
          <div class="row"><span>Total reservado</span><span>${S(l.reservedTotal)}</span></div>
          <div class="row"><span>Saldo pendiente</span><span>${l.pendingTotal>0?S(l.pendingTotal):"$ 0"}</span></div>
        </div>`:""}
      ${T}
    </body>
  </html>`}},5700:(e,t,i)=>{i.d(t,{L:()=>s,x:()=>a});let a=/^9\d{15}$/;function s(e){let t=String(e??"").replace(/^OFF-/i,"").replace(/-/g,"").slice(0,12);return/^[0-9a-f]{12}$/i.test(t)?`9${parseInt(t,16).toString().padStart(15,"0")}`:null}},6172:(e,t,i)=>{i.d(t,{GW:()=>o,Om:()=>d,Wq:()=>r,d:()=>l,r9:()=>n});var a=i(4566);let s=(e,t)=>{if(null==e)return t;let i=e.trim().toLowerCase();return!["0","false","no","off"].includes(i)&&(!!["1","true","yes","on"].includes(i)||t)},o=s(a.env.NEXT_PUBLIC_REQUIRE_FREE_SALE_REASON,!0),r=s(a.env.NEXT_PUBLIC_SHOW_FREE_SALE_TRACEABILITY_REPORT,o),n=s(a.env.NEXT_PUBLIC_ENABLE_POS_CASH_EXPENSES,!0),d=s(a.env.NEXT_PUBLIC_ENABLE_POS_MOVEMENT_CLOSURE_TICKET,!0),l=s(a.env.NEXT_PUBLIC_ENABLE_LOYALTY_QR_TICKETS,!1)},7826:(e,t,i)=>{i.d(t,{di:()=>l,kO:()=>r,ok:()=>n,uj:()=>d});var a=i(1730);async function s(e,t,i,s){let o=new Headers(t?.headers);o.set("Content-Type","application/json"),s&&o.set("Authorization",`Bearer ${s}`);try{let i=(0,a.G)(),s=await fetch(`${i}${e}`,{...t,headers:o,credentials:"include"});if(!s.ok){let e;try{let t=await s.json();"string"==typeof t?.detail&&(e=t.detail)}catch{}throw Error(e??`Error ${s.status}`)}let r=s.headers.get("content-length")||s.headers.get("Content-Length");if(204===s.status||"0"===r||null===r)return;return await s.json()}catch(e){if(console.warn("Settings API fallback:",e),void 0!==i)return i;throw e}}let o={company_name:"",tax_id:"",address:"",contact_email:"",contact_phone:"",ticket_logo_url:"",theme_mode:"light",accent_color:"#0A84FF",ticket_footer:"",auto_close_ticket:!1,low_stock_alert:!0,require_seller_pin:!1,notifications:{daily_summary_email:!1,cash_alert_email:!1,cash_alert_sms:!1,monthly_report_email:!1},closure_email_recipients:[],release_notes_email_recipients:[],ticket_email_cc:[],smtp_host:"",smtp_port:null,smtp_user:"",smtp_password:"",smtp_use_tls:!0,email_from:"",printer_mode:"browser",printer_width:"80mm",printer_name:"",printer_auto_open_drawer:!1,printer_drawer_button:!0,web_pos_send_closure_email:!0,station_closure_email_overrides:{},web_personalization_bindings:{campana_clasica_mediana:{},campana_clasica_grande:{},campana_cromada_mediana:{},campana_cromada_grande:{},guiro_mediano:{},guiro_grande:{},maraca_par:{}},web_personalization_home_images:{campana:{},guiro:{},maraca:{}},web_brand_collage_images:{main:{},top_left:{},top_right:{},bottom:{}},web_home_sections_mode:"categories"},r=[{id:"dashboard",label:"Dashboard",description:"Indicadores generales del negocio.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0},actions:[{id:"dashboard.view",label:"Ver dashboard",description:"Permite acceder al panel principal.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"dashboard.today",label:"Ver m\xe9tricas de hoy",description:"Muestra indicadores operativos del d\xeda actual.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"dashboard.history",label:"Ver hist\xf3rico (semana/mes)",description:"Muestra KPIs y gr\xe1ficas hist\xf3ricas del dashboard.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!0}}]},{id:"pos",label:"POS / Caja",description:"Punto de venta y operaciones de caja.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"pos.sales",label:"Gestionar ventas",description:"Crear, listar y editar ventas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"pos.returns",label:"Devoluciones",description:"Registrar y consultar devoluciones.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"pos.returns.void",label:"Anular devoluciones",description:"Permite anular devoluciones registradas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"pos.changes.void",label:"Anular cambios",description:"Permite anular cambios registrados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"pos.customers",label:"Clientes POS",description:"Crear y administrar clientes.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"pos.closures",label:"Cierres de caja",description:"Gestionar cierres e informes diarios.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}}]},{id:"documents",label:"Documentos",description:"Separados y documentos relacionados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"documents.separated_orders",label:"Separados",description:"Gesti\xf3n de pedidos separados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}},{id:"documents.sales.adjust",label:"Ajustar ventas",description:"Permite registrar ajustes sobre ventas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"documents.sales.void",label:"Anular ventas",description:"Permite anular ventas (si aplica).",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"documents.separated_orders.void_payment",label:"Anular abonos",description:"Permite anular pagos de separados.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"documents.separated_orders.amend",label:"Modificar art\xedculos de separados",description:"Permite cambiar los art\xedculos de un separado (documento MS).",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}}]},{id:"sales_history",label:"Historial de ventas",description:"Consulta de ventas, reimpresi\xf3n y seguimiento.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0},actions:[{id:"sales_history.view",label:"Ver historial de ventas",description:"Permite consultar y reimprimir ventas registradas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"sales_history.history",label:"Ver hist\xf3rico por rango",description:"Permite cambiar rangos de fecha en historial de ventas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!0}}]},{id:"products",label:"Productos",description:"Cat\xe1logo e inventario.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"products.view",label:"Ver productos",description:"Permite consultar cat\xe1logo y grupos para el POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}},{id:"products.manage",label:"Administrar productos",description:"Crear, editar y mantener el cat\xe1logo de productos.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"products.import",label:"Importar productos",description:"Permite importar productos masivamente desde Excel.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}}]},{id:"movements",label:"Movimientos",description:"Movimientos y control de stock.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"movements.view",label:"Ver movimientos",description:"Consultar m\xe9tricas, historial y estado del stock.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"movements.manage",label:"Registrar movimientos",description:"Crear ajustes y movimientos manuales de inventario.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}}]},{id:"labels",label:"Etiquetas",description:"Generaci\xf3n de archivos para etiquetas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"labels.export",label:"Exportar etiquetas",description:"Descarga de plantillas para impresi\xf3n.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}}]},{id:"labels_pilot",label:"Etiquetado (beta)",description:"Vista beta para flujo de etiquetado.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},actions:[{id:"labels.pilot.view",label:"Ver etiquetado beta",description:"Permite acceder a la vista Etiquetado (beta).",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1}}]},{id:"reports",label:"Reportes",description:"Reportes financieros y de inventario.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0},actions:[{id:"reports.view",label:"Ver reportes",description:"Acceso a reportes y anal\xedticas.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!0}}]},{id:"commerce_web",label:"Comercio Web",description:"Operaci\xf3n del canal web: \xf3rdenes, pagos y conversi\xf3n a venta.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1,"Gestor Web":!0},actions:[{id:"commerce_web.view",label:"Ver \xf3rdenes web",description:"Permite entrar al m\xf3dulo Comercio Web y consultar \xf3rdenes.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!0,"Gestor Web":!0}},{id:"commerce_web.manage",label:"Gestionar \xf3rdenes web",description:"Permite registrar pagos, mover estados y convertir \xf3rdenes a venta.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1,"Gestor Web":!0}}]},{id:"settings",label:"Configuraci\xf3n",description:"Preferencias del POS, SMTP y otros ajustes.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},editable:!1,actions:[{id:"settings.view",label:"Ver configuraci\xf3n POS",description:"Permite consultar las preferencias para el POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},editable:!1},{id:"settings.manage",label:"Configurar POS",description:"Permite editar la configuraci\xf3n general del POS.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},editable:!1},{id:"settings.payment_methods",label:"M\xe9todos de pago",description:"Administrar alta, edici\xf3n y estado de m\xe9todos de pago.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},editable:!1},{id:"settings.payment_methods.view",label:"Ver m\xe9todos de pago",description:"Permite consultar m\xe9todos de pago desde el POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!0,Auditor:!1},editable:!1}]},{id:"users",label:"Usuarios",description:"Gesti\xf3n e invitaci\xf3n de usuarios POS.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"users.manage",label:"Administrar usuarios",description:"Crear, editar y suspender usuarios.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"users.invite",label:"Invitar usuarios",description:"Enviar invitaciones para activar cuenta.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"stations.manage",label:"Estaciones POS",description:"Administrar estaciones y PINs de caja.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}}]},{id:"hr",label:"Recursos Humanos",description:"Gesti\xf3n de empleados y datos laborales.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1},actions:[{id:"hr.view",label:"Ver empleados",description:"Permite consultar la plantilla de colaboradores.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}},{id:"hr.manage",label:"Editar empleados",description:"Permite actualizar la informaci\xf3n de empleados.",roles:{Administrador:!0,Supervisor:!1,Vendedor:!1,Auditor:!1}}]},{id:"schedule",label:"Horarios",description:"Planificaci\xf3n semanal de turnos del equipo.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1},actions:[{id:"schedule.view",label:"Ver horarios",description:"Consultar la grilla semanal de turnos.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"schedule.manage",label:"Editar horarios",description:"Crear, mover y actualizar turnos.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"schedule.publish",label:"Publicar horario",description:"Publicar la semana para compartir con el equipo.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}},{id:"schedule.export",label:"Exportar horario",description:"Exportar la semana en CSV o PDF.",roles:{Administrador:!0,Supervisor:!0,Vendedor:!1,Auditor:!1}}]}];async function n(e){return s("/pos/settings",void 0,e?void 0:o,e)}async function d(e){return s("/pos/stations",void 0,[],e)}async function l(e){return s("/pos/roles/permissions",void 0,e?void 0:{modules:r},e).then(e=>e.modules)}},8155:(e,t,i)=>{i.d(t,{Sn:()=>s,v4:()=>o});var a=i(1730);let s=[{id:-1,name:"Efectivo",slug:"cash",is_active:!0,allow_change:!0,order_index:1},{id:-2,name:"Bancolombia QR / Transferencia",slug:"qr",is_active:!0,allow_change:!1,order_index:2},{id:-3,name:"Tarjeta Dat\xe1fono",slug:"card",is_active:!0,allow_change:!1,order_index:3},{id:-4,name:"Nequi",slug:"nequi",is_active:!0,allow_change:!1,order_index:4},{id:-5,name:"Daviplata",slug:"daviplata",is_active:!0,allow_change:!1,order_index:5},{id:-6,name:"Cr\xe9dito",slug:"credito",is_active:!0,allow_change:!1,order_index:6},{id:-7,name:"Separado",slug:"separado",is_active:!0,allow_change:!1,order_index:7}];async function o(e){let t=(0,a.G)(),i=r(e),s=await fetch(`${t}/pos/payment-methods`,{headers:i,credentials:"include"});if(!s.ok)throw Error(`Error ${s.status}`);return await s.json()}let r=e=>{let t={"Content-Type":"application/json"};return e&&(t.Authorization=`Bearer ${e}`),t}}}]);