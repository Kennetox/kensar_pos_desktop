"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[200],{4013:(t,e,a)=>{a.d(e,{Wg:()=>m,_A:()=>p,JL:()=>j,hS:()=>A,Zj:()=>k,g_:()=>I,bw:()=>D,LB:()=>P,E8:()=>C});let i=["212222","222122","222221","121223","121322","131222","122213","122312","132212","221213","221312","231212","112232","122132","122231","113222","123122","123221","223211","221132","221231","213212","223112","312131","311222","321122","321221","312212","322112","322211","212123","212321","232121","111323","131123","131321","112313","132113","132311","211313","231113","231311","112133","112331","132131","113123","113321","133121","313121","211331","231131","213113","213311","213131","311123","311321","331121","312113","312311","332111","314111","221411","431111","111224","111422","121124","121421","141122","141221","112214","112412","122114","122411","142112","142211","241211","221114","413111","241112","134111","111242","121142","121241","114212","124112","124211","411212","421112","421211","212141","214121","412121","111143","111341","131141","114113","114311","411113","411311","113141","114131","311141","411131","211412","211214","211232","2331112"],s={height:52,moduleWidth:2,includeText:!0,includeTextFontSize:10,quietZoneModules:10};function n(t,e){let a,n={...s,...e??{}},o=(t??"").toUpperCase().trim(),d=/^\d+$/.test(o),r=d?(a=(o??"").replace(/\D/g,""))||"0":o.replace(/[^\x20-\x7E]/g,"")||"0",l=[];if(d){r.length%2==1&&(r=`0${r}`),l.push(105);for(let t=0;t<r.length;t+=2)l.push(Number.parseInt(r.slice(t,t+2),10))}else for(let t of(l.push(104),r))l.push(t.charCodeAt(0)-32);let p=l[0];for(let t=1;t<l.length;t+=1)p+=l[t]*t;l.push(p%103),l.push(106);let c=n.moduleWidth*n.quietZoneModules,m=c,v=[];l.forEach(t=>{let e=i[t];if(e)for(let t=0;t<e.length;t+=1){let a=t%2==0,i=Number.parseInt(e[t],10)*n.moduleWidth;a&&v.push(`<rect x="${m.toFixed(2)}" y="0" width="${i.toFixed(2)}" height="${n.height}" fill="#000" />`),m+=i}}),m+=c;let u=n.includeText?`<text x="50%" y="${(n.height+n.includeTextFontSize).toFixed(2)}" font-family="monospace" font-size="${n.includeTextFontSize}" font-weight="700" text-anchor="middle" fill="#0f172a">${r}</text>`:"",g=n.height+16*!!n.includeText;return`<svg xmlns="http://www.w3.org/2000/svg" width="${m.toFixed(2)}" height="${g.toFixed(2)}" viewBox="0 0 ${m.toFixed(2)} ${g.toFixed(2)}">${v.join("")}${u}</svg>`}var o=a(5700),d=a(2394),r=a(6172),l=a(5747);function p(t){let e=Math.max(0,Number(t?.reconciled_amount||0));if(e<=0)return[];let a=(t?.resolution_history??[]).filter(t=>"reconcile"===t.action).map(t=>({amount:Math.max(0,Number(t.amount||0)),reference:"string"==typeof t.reference&&t.reference.trim()?t.reference.trim():void 0,reconciledAt:"string"==typeof t.created_at?t.created_at:void 0})).filter(t=>Number.isFinite(t.amount)&&t.amount>0),i=a.reduce((t,e)=>t+e.amount,0);return i<e-.01&&a.push({amount:e-i,reference:t?.resolution_reference?.trim()||void 0,reconciledAt:t?.resolved_at??t?.updated_at??void 0}),a}var c=a(4566);function m(t){if(!t?.name)return;let e={name:t.name};return t.phone&&(e.phone=t.phone),t.email&&(e.email=t.email),t.taxId&&(e.taxId=t.taxId),t.address&&(e.address=t.address),e}let v="Kensar Electronic",u="Cra. 15 #123 - Bogot\xe1",g="+57 300 000 0000",h="NIT 900000000-0",x="contacto@kensar.com",f="Gracias por tu compra.",$=/^\s*\[\[align=(left|center|right)\]\]\s*\n?/i;function b(t){let e=(t??"").replace(/\r\n/g,"\n"),a=e.match($),i=a?.[1]??"center";return{text:e.replace($,""),align:i}}let y=t=>{let e=t?.trim();if(!e)return"";if(/^data:/i.test(e))return e;let a=(()=>{if(window.location?.origin)return window.location.origin;let t="undefined"!=typeof globalThis?globalThis.location:void 0;return t?.origin?t.origin:c.env.NEXT_PUBLIC_APP_URL??""})(),i=(()=>{let t=c.env.NEXT_PUBLIC_API_BASE_URL?.trim();if(t)return t.replace(/\/$/,"");if(window.location){let{protocol:t,hostname:e,port:a}=window.location;return`${t}//${e}:${a&&"3000"!==a?a:"8000"}`}let e="undefined"!=typeof globalThis?globalThis.location:void 0;return e?.origin?e.origin.replace(/\/$/,""):""})();if(/^https?:\/\//i.test(e))try{return new URL(e).toString()}catch{return e}if(e.startsWith("//")){let t=a?new URL(a).protocol:i?new URL(i).protocol:"https:";return`${t}${e}`}let s=e.startsWith("/")?e:`/${e}`,n=/^\/?uploads\//i.test(s)?i||a:a||i;if(!n)return e;let o=n.replace(/\/$/,"");return`${o}${s}`},w=t=>{let e=t?.logoUrl??t?.logo_url??t?.ticket_logo_url??"";return e?.trim()||void 0};function N(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function S(t){return t.replace(/\r\n/g,"\n").split("\n").map(t=>{let e,a,i=t.length>0?1===(a=(e=N(t)).split("**")).length?e:a.map((t,e)=>e%2==0?t:`<strong>${t}</strong>`).join(""):"&nbsp;";return`<div>${i}</div>`}).join("")}function _(t){return`$ ${t.toLocaleString("es-CO",{minimumFractionDigits:0,maximumFractionDigits:0})}`}function T(t){let e=_(Math.abs(t));return t<0?`-${e}`:e}function z(t){return t?(0,d.ms)(t,{dateStyle:"short",timeStyle:"short"})||t:""}function E(t,e){if(!t?.length)return"";let a=0,i=0,s=t.map(t=>{let s="sale"===t.document_type?"Venta original":"change"===t.document_type?`Cambio ${++a}`:`Devoluci\xf3n ${++i}`,n=["voided","anulado","cancelled","canceled"].includes((t.status||"").toLowerCase())?" \xb7 ANULADO":"",o=t.document_number===e,d=(t.items??[]).map(t=>{let e="purchased"===t.action?"Compr\xf3":"received"===t.action?"Cliente recibi\xf3":"Cliente devolvi\xf3",a=Number.isInteger(t.quantity)?t.quantity.toString():t.quantity.toLocaleString("es-CO",{maximumFractionDigits:3});return`<div class="history-product"><strong>${N(e)}:</strong> ${N(a)} \xd7 ${N(t.product_name)}</div>`}).join("");return`<div class="history-row${o?" history-current":""}">
      <div><strong>${N(s)}</strong>${n}${o?" \xb7 ESTE DOCUMENTO":""}</div>
      <div>${N(t.document_number)} \xb7 ${N(z(t.created_at))}</div>
      ${d}
    </div>`}).join(""),n=t.filter(t=>"change"===t.document_type).length,o=t.filter(t=>"return"===t.document_type).length;return`<div class="history">
    <div class="history-title">HISTORIAL DEL PROCESO</div>
    <div class="history-summary">Esta venta registra ${n} ${1===n?"cambio":"cambios"} y ${o} ${1===o?"devoluci\xf3n":"devoluciones"}.</div>
    ${s}
  </div>`}function D(t){let e=t.settings,a=e?.company_name?.trim()||v,i=e?.tax_id?.trim()||h,s=e?.address?.trim()||u,o=e?.contact_phone?.trim()||g,d=e?.contact_email?.trim()||x,r=b(e?.ticket_footer),l=r.text.trim()||f,p=r.align,c=y(w(e)),m=n(t.documentNumber,{height:30,moduleWidth:1.5,includeText:!0,includeTextFontSize:11,quietZoneModules:10}),$=t.items.length?t.items.map(t=>`
          <div class="item-row">
            <div class="item-name">${N(t.name)}</div>
            <div class="item-meta">${t.quantity} \xd7 ${_(t.unitPrice)}</div>
            <div class="item-total">${T(-Math.abs(t.total))}</div>
          </div>`).join(""):'<div class="muted">Sin productos devueltos.</div>',D=t.payments.filter(t=>Math.abs(t.amount)>0).map(t=>`
      <div class="row">
        <span>${N(t.label)}</span>
        <span>${T(-Math.abs(t.amount))}</span>
      </div>`).join(""),A=t.originalDocumentNumber?`<div>Documento origen: ${N(t.originalDocumentNumber)}</div>`:"",C=t.rootSaleDocumentNumber&&t.rootSaleDocumentNumber!==t.originalDocumentNumber?`<div>Venta ra\xedz: ${N(t.rootSaleDocumentNumber)}</div>`:"",j=t.sellerName?`<div>Vendedor: ${N(t.sellerName)}</div>`:"",k=t.posName?`<div>POS: ${N(t.posName)}</div>`:"",P=E(t.operationHistory,t.documentNumber);return`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Devoluci\xf3n ${N(t.documentNumber)}</title>
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
            ${c?`<img class="logo" src="${c}" alt="${N(a)}" />`:""}
            <div class="title">${N(a)}</div>
            <div class="muted">${N(s)}</div>
            <div class="muted">${N(i)}</div>
            <div class="muted">${N(o)} \xb7 ${N(d)}</div>
            <div class="badge">DEVOLUCI\xd3N</div>
          </div>
          <div class="meta">
            <div>Documento: ${N(t.documentNumber)}</div>
            ${A}
            ${C}
            ${k}
            ${j}
            <div>Fecha: ${N(z(t.createdAt))}</div>
          </div>
          ${P}
          <div class="line"></div>
          <div class="section">
            <div class="row">
              <span>Total devoluci\xf3n</span>
              <span class="total">${T(-Math.abs(t.totalRefund))}</span>
            </div>
          </div>
          <div class="section">
            <div class="row"><span>Detalle de productos</span></div>
            <div class="items">${$}</div>
          </div>
          ${D?`<div class="section">
                <div class="row"><span>Reembolso</span></div>
                ${D}
              </div>`:""}
          ${t.notes?`<div class="section muted">Notas: ${N(t.notes)}</div>`:""}
          <div class="barcode">${m}</div>
          <div class="line"></div>
          <div class="muted" style="text-align:${p};">${S(l)}</div>
        </div>
      </body>
    </html>
  `}function A(t){let e=t.settings,a=e?.company_name?.trim()||v,i=e?.tax_id?.trim()||h,s=e?.address?.trim()||u,o=e?.contact_phone?.trim()||g,d=e?.contact_email?.trim()||x,r=b(e?.ticket_footer),l=r.text.trim()||f,p=r.align,c=y(w(e)),m=n(t.documentNumber,{height:30,moduleWidth:1.5,includeText:!0,includeTextFontSize:11,quietZoneModules:10}),$=t.itemsReturned.length?t.itemsReturned.map(t=>`
          <div class="item-row">
            <div class="item-name">${N(t.name)}</div>
            <div class="item-meta">${t.quantity} \xd7 ${_(t.unitPrice)}</div>
            <div class="item-total">${T(-Math.abs(t.total))}</div>
          </div>`).join(""):'<div class="muted">Sin productos devueltos.</div>',D=t.itemsNew.length?t.itemsNew.map(t=>`
          <div class="item-row">
            <div class="item-name">${N(t.name)}</div>
            <div class="item-meta">${t.quantity} \xd7 ${_(t.unitPrice)}</div>
            <div class="item-total">${_(t.total)}</div>
          </div>`).join(""):'<div class="muted">Sin productos nuevos.</div>',A=t.payments.filter(t=>Math.abs(t.amount)>0).map(t=>`
      <div class="row">
        <span>${N(t.label)}</span>
        <span>${_(t.amount)}</span>
      </div>`).join(""),C=t.originalDocumentNumber?`<div>Documento origen: ${N(t.originalDocumentNumber)}</div>`:"",j=t.rootSaleDocumentNumber&&t.rootSaleDocumentNumber!==t.originalDocumentNumber?`<div>Venta ra\xedz: ${N(t.rootSaleDocumentNumber)}</div>`:"",k=t.sellerName?`<div>Vendedor: ${N(t.sellerName)}</div>`:"",P=t.posName?`<div>POS: ${N(t.posName)}</div>`:"",I=E(t.operationHistory,t.documentNumber);return`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Cambio ${N(t.documentNumber)}</title>
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
            ${c?`<img class="logo" src="${c}" alt="${N(a)}" />`:""}
            <div class="title">${N(a)}</div>
            <div class="muted">${N(s)}</div>
            <div class="muted">${N(i)}</div>
            <div class="muted">${N(o)} \xb7 ${N(d)}</div>
            <div class="badge">CAMBIO</div>
          </div>
          <div class="meta">
            <div>Documento: ${N(t.documentNumber)}</div>
            ${C}
            ${j}
            ${P}
            ${k}
            <div>Fecha: ${N(z(t.createdAt))}</div>
          </div>
          ${I}
          <div class="line"></div>
          <div class="section">
            <div class="row">
              <span>Total cr\xe9dito</span>
              <span>${T(-Math.abs(t.totalCredit))}</span>
            </div>
            <div class="row">
              <span>Total nuevo</span>
              <span>${_(t.totalNew)}</span>
            </div>
            <div class="row total">
              <span>Diferencia</span>
              <span>${T(t.extraPayment-t.refundDue)}</span>
            </div>
            ${t.extraPayment>0?`<div class="row"><span>Excedente cobrado</span><span>${_(t.extraPayment)}</span></div>`:""}
            ${t.refundDue>0?`<div class="row"><span>Saldo devuelto${t.refundMethod?` (${N(t.refundMethod)})`:""}</span><span>${_(t.refundDue)}</span></div>`:""}
          </div>
          <div class="section">
            <div class="row"><span>Productos devueltos</span></div>
            <div class="items">${$}</div>
          </div>
          <div class="section">
            <div class="row"><span>Productos nuevos</span></div>
            <div class="items">${D}</div>
          </div>
          ${A?`<div class="section">
                <div class="row"><span>Pagos del excedente</span></div>
                ${A}
              </div>`:""}
          ${t.notes?`<div class="section muted">Notas: ${N(t.notes)}</div>`:""}
          <div class="barcode">${m}</div>
          <div class="line"></div>
          <div class="muted" style="text-align:${p};">${S(l)}</div>
        </div>
      </body>
    </html>
  `}function C(t){var e;let a,i,s,p,c,m,$,T,E,D=t.settings,A=D?.company_name?.trim()||v,C=D?.tax_id?.trim()||h,j=D?.address?.trim()||u,k=D?.contact_phone?.trim()||g,P=D?.contact_email?.trim()||x,I=b(D?.ticket_footer),M=I.text.trim()||f,L=I.align,R=y(w(D)),O=t.payments.length?t.payments.map(t=>`
          <div class="row">
            <span>${N(t.label)}</span>
            <span>${_(t.amount)}</span>
          </div>`).join(""):'<div class="row"><span>Sin pagos registrados</span><span>0</span></div>',B=t.separatedInfo?'<div class="separated-badge">VENTA POR SEPARADO</div>':"",F="number"==typeof t.changeAmount&&0!==t.changeAmount?`<div class="row">
            <span>${t.changeAmount>0?"Cambio":"Saldo"}</span>
            <span>${_(Math.abs(t.changeAmount))}</span>
          </div>`:"",U=t.separatedInfo?(a=[...t.separatedInfo?.initialPayments??[],...t.separatedInfo?.payments??[]],i=t.separatedInfo?.reconciliations??[],s=a.length?a.map(t=>{let e=[];t.method&&e.push(t.method),t.paidAt&&e.push(z(t.paidAt));let a=e.length>0?`<div class="sep-meta">${e.map(t=>N(t)).join(" \xb7 ")}</div>`:"";return`<div class="row separated-row">
                  <div>
                    <div class="sep-label">${N(t.label)}</div>
                    ${a}
                  </div>
                  <span>${_(t.amount)}</span>
                </div>`}).join(""):'<div class="row separated-row"><div class="sep-label">Sin abonos registrados</div><span>0</span></div>',p=i.map((t,e)=>{let a=[];t.reference&&a.push(`Ref. ${t.reference}`),t.reconciledAt&&a.push(z(t.reconciledAt));let s=a.length?`<div class="sep-meta">${a.map(t=>N(t)).join(" \xb7 ")}</div>`:"",n=i.length>1?`Pago conciliado ${e+1}`:"Pago conciliado";return`<div class="row separated-row">
              <div>
                <div class="sep-label">${N(n)}</div>
                ${s}
              </div>
              <span>${_(t.amount)}</span>
            </div>`}).join(""),c=a.reduce((t,e)=>t+Number(e.amount||0),0)+i.reduce((t,e)=>t+Number(e.amount||0),0),m="number"==typeof t.separatedInfo?.appliedTotal?Math.max(t.separatedInfo.appliedTotal,0):c,$=`<div class="row separated-row balance-row">
          <div class="sep-label">Total aplicado</div>
          <span>${_(m)}</span>
        </div>`,T=t.separatedInfo?.dueDate?`<div class="line"><span>Fecha l\xedmite</span><span>${!(e=t.separatedInfo?.dueDate)?"":(0,d.ms)(e,{dateStyle:"short"})||e}</span></div>`:"",E="number"==typeof t.separatedInfo?.balance?`<div class="row separated-row balance-row">
                <div class="sep-label">Saldo pendiente</div>
                <span>${_(Math.max(t.separatedInfo.balance,0))}</span>
              </div>`:"",`<div class="separator"></div>
          <div class="section">
            <div class="line-title">Detalle de abonos</div>
            ${T}
            <div class="payments">${s}</div>
            ${p?`<div class="payments">${p}</div>`:""}
            ${$}
            ${E}
          </div>`):"",V=t.items.length?t.items.map(t=>{let e=Math.max(0,t.quantity*t.unitPrice-t.total),a=e>0?`<span class="item-discount">(Desc -${_(e)})</span>`:"";return`
        <div class="item-row">
          <div>
            <div class="item-name">${N(t.name)}</div>
            <div class="item-meta">${t.quantity} x ${_(t.unitPrice)} ${a}</div>
          </div>
          <div class="item-total">${_(t.total)}</div>
        </div>`}).join(""):'<div class="item-row"><div class="item-name">Sin art\xedculos</div></div>',q=t.customer&&t.customer.name?`<div class="line-title">Cliente</div><div class="customer-name">${N(t.customer.name)}</div>`+(t.customer.phone?`<div class="customer-detail">Tel: ${N(t.customer.phone)}</div>`:"")+(t.customer.email?`<div class="customer-detail">Email: ${N(t.customer.email)}</div>`:"")+(t.customer.taxId?`<div class="customer-detail">NIT / ID: ${N(t.customer.taxId)}</div>`:"")+(t.customer.address?`<div class="customer-detail">Direcci\xf3n: ${N(t.customer.address)}</div>`:""):"",W=t.notes&&t.notes.trim().length?`<div class="section">
          <div class="line-title">Notas</div>
          <div class="notes">${N(t.notes).split("\n").map(t=>t.trim()).filter(Boolean).map(t=>`<div>${t}</div>`).join("")}</div>
        </div>`:"",H=t.documentNumber?.trim()||`V-${String(t.saleNumber??0).padStart(6,"0")}`,Y=n(/^OFF-/i.test(H)?(0,o.L)(H)??H:H,{height:30,moduleWidth:2,includeText:!0,includeTextFontSize:12,quietZoneModules:10}),X=r.d?t.rewardPublicUrl:null,G=X?`<div class="separator"></div>
        <div class="loyalty-block">
          <div class="loyalty-title">\xa1TIENES UN BENEFICIO PARA TU PR\xd3XIMA COMPRA!</div>
          <div class="loyalty-copy">Escanea este QR para descubrirlo y activarlo.</div>
          <div class="loyalty-qr"><img src="${function(t,e=8,a=2){let i=(0,l.Ay)(0,"M");return i.addData(t),i.make(),i.createDataURL(e,a)}(X)}" alt="C\xf3digo QR del beneficio" /></div>
          <div class="loyalty-terms">\xa1No lo dejes para despu\xe9s! Escan\xe9alo ahora, activa tu beneficio y gu\xe1rdalo para tu pr\xf3xima compra.<br /><span>Sujeto a condiciones y vigencia.</span></div>
        </div>`:"",Z=X?`@page {
          size: 80mm auto;
          margin: 0;
        }
        html {
          width: 80mm;
          margin: 0;
          padding: 0;
        }`:"@page { margin: 4mm; }",Q=X?"0":"0 auto",K=X?`
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;`:"";return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Ticket ${N(t.documentNumber)}</title>
      <style>
        ${Z}
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
          ${R?`<img src="${N(R)}" alt="Logo" />`:`<strong>${N(A)}</strong>`}
        </div>
        <h1>${N(A)}</h1>
        <div class="company-info">
          ${N(j)}<br />
          ${N(k)} \xb7 ${N(P)}<br />
          ${N(C)}<br />
          CONSERVA ESTE RECIBO Y EMPAQUE ORIGINAL PARA GARANT\xcdA
        </div>

        <div class="separator"></div>

        ${q}
        ${q?'<div class="separator"></div>':""}
        ${t.adjustmentBadge?`<div class="adjustment-banner">${N(t.adjustmentBadge)}</div>${t.adjustmentNote?`<div class="adjustment-note">${N(t.adjustmentNote)}</div>`:""}`:""}
        <div class="section">
          <div class="line"><span>No. Recibo</span><span>${N(t.documentNumber)}</span></div>
          <div class="line"><span>Fecha</span><span>${(0,d.ms)(t.date,{dateStyle:"short",timeStyle:"short"})}</span></div>
          ${t.vendorName?`<div class="line"><span>Usuario</span><span>${N(t.vendorName)}</span></div>`:""}
          ${t.posName?`<div class="line"><span>POS</span><span>${N(t.posName)}</span></div>`:""}
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line-title">Detalle de productos</div>
          <div class="items">
            ${V}
          </div>
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line"><span>Subtotal</span><span>${_(t.subtotal)}</span></div>
          ${t.lineDiscountTotal>0?`<div class="line">
                   <span>Descuento art\xedculos</span>
                   <span>- ${_(t.lineDiscountTotal)}</span>
                 </div>`:""}
          <div class="line">
            <span>${N(t.cartDiscountLabel)}</span>
            <span>${N(t.cartDiscountValueDisplay)}</span>
          </div>
          ${t.surchargeLabel&&("number"==typeof t.surchargeAmount?t.surchargeAmount>0:!!(t.surchargeValueDisplay&&t.surchargeValueDisplay.trim()))?`<div class="line">
                   <span>${N(t.surchargeLabel)}</span>
                   <span>${"number"==typeof t.surchargeAmount&&t.surchargeAmount>0?`+ ${_(t.surchargeAmount)}`:N(t.surchargeValueDisplay?.startsWith("+")?t.surchargeValueDisplay:`+${t.surchargeValueDisplay??""}`)}</span>
                 </div>`:""}
        </div>

        <div class="separator"></div>
        <div class="section">
          <div class="line-title">Pagos recibidos</div>
          ${B}
          <div class="payments">
            ${O}
            ${F}
          </div>
        </div>

        ${U}

        <div class="totals">
          <span>TOTAL</span>
          <strong>${_(t.total)}</strong>
        </div>

        ${W}

        <div class="barcode">${Y}</div>

        <div class="footer" style="text-align:${L};">
          ${S(M)}
        </div>

        ${G}
      </div>
    </body>
  </html>`}function j(t){let e=t.expenses.reduce((t,e)=>t+Math.max(Number(e.amount||0),0),0),a=Number(t.expectedCash||0)-e,i=Number(t.countedCash||0)-a,s=t.expenses.length?t.expenses.map(t=>{let e=t.description?.trim()?`<div class="muted">${N(t.description)}</div>`:"";return`
            <div class="expense">
              <div>
                <div class="strong">${N(t.categoryLabel)}</div>
                ${e}
                <div class="muted">${z(t.createdAt)} \xb7 ${N(t.createdBy)}</div>
              </div>
              <div class="amount">${_(t.amount)}</div>
            </div>`}).join(""):'<div class="muted center">No se registraron gastos de caja.</div>';return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Gastos ${N(t.documentNumber)}</title>
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
        <div class="row"><span>Cierre</span><span>${N(t.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,d.ms)(t.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${t.posName?`<div class="row"><span>POS</span><span>${N(t.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${N(t.responsible)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="row emphasize"><span>Total de HOY</span><span>${_(t.totalToday)}</span></div>
        <div class="row"><span>Efectivo esperado</span><span>${_(t.expectedCash)}</span></div>
        <div class="row"><span>Total gastos</span><span>- ${_(e)}</span></div>
        <div class="row emphasize"><span>Efectivo final esperado</span><span>${_(a)}</span></div>
        <div class="row"><span>Efectivo contado</span><span>${_(t.countedCash)}</span></div>
        <div class="row"><span>Diferencia ajustada</span><span>${_(i)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="muted">Detalle de gastos</div>
        ${s}
      </div>
    </body>
  </html>`}function k(t){let e=t.returns.reduce((t,e)=>t+Math.max(Number(e.totalRefund||0),0),0),a=t.changes.reduce((t,e)=>t+Math.max(Number(e.extraPayment||0),0),0),i=t.changes.reduce((t,e)=>t+Math.max(Number(e.refundDue||0),0),0),s=e+i,n=new Map,o=(t,e,a)=>{let i=t?.trim()||"Otro m\xe9todo",s=i.toLowerCase(),o=n.get(s)??{method:i,entries:0,exits:0};"entry"===a&&(o.entries+=e),"exit"===a&&(o.exits+=e),n.set(s,o)};t.returns.forEach(t=>{(t.payments.length?t.payments:[{method:"Efectivo",amount:t.totalRefund}]).forEach(t=>o(t.method,t.amount,"exit"))}),t.changes.forEach(t=>{(t.payments.length?t.payments:t.extraPayment>0?[{method:"Efectivo",amount:t.extraPayment}]:[]).forEach(t=>o(t.method,t.amount,"entry")),t.refundDue>0&&o(t.refundMethod||"Efectivo",t.refundDue,"exit")});let r=Array.from(n.values()).filter(t=>t.entries>0||t.exits>0).sort((t,e)=>t.method.localeCompare(e.method,"es")).map(t=>`
        <div class="method-row">
          <div class="strong">${N(t.method)}</div>
          <div>${_(t.entries)}</div>
          <div>${_(t.exits)}</div>
          <div class="strong">${_(t.entries-t.exits)}</div>
        </div>`).join(""),l=t=>t.length?t.map(t=>`${N(String(t.quantity))} x ${N(t.name)}${t.total?` (${_(t.total)})`:""}`).join("<br />"):"Sin productos",p=t=>t.length?t.map(t=>`${N(t.method)} ${_(t.amount)}`).join("<br />"):"Efectivo",c=t.returns.length?t.returns.map(t=>`
            <div class="movement">
              <div class="movement-head">
                <div>
                  <div class="strong">${N(t.documentNumber||`DV-${t.id}`)}</div>
                  <div class="muted">Origen ${N(t.saleDocumentNumber||"Sin documento")}</div>
                </div>
                <div class="amount exit">${_(t.totalRefund)}</div>
              </div>
              <div class="muted">${z(t.createdAt)} \xb7 ${N(t.createdBy||"Sin usuario")}</div>
              <div class="muted">${l(t.items)}</div>
              <div class="muted">M\xe9todos: ${p(t.payments)}</div>
            </div>`).join(""):'<div class="muted center">Sin devoluciones en este cierre.</div>',m=t.changes.length?t.changes.map(t=>`
            <div class="movement">
              <div class="movement-head">
                <div>
                  <div class="strong">${N(t.documentNumber||`CB-${t.id}`)}</div>
                  <div class="muted">Origen ${N(t.saleDocumentNumber||"Sin documento")}</div>
                </div>
                <div class="amount">${_(t.extraPayment-t.refundDue)}</div>
              </div>
              <div class="muted">${z(t.createdAt)} \xb7 ${N(t.createdBy||"Sin usuario")}</div>
              <div class="muted">Devuelve: ${l(t.returnedItems)}</div>
              <div class="muted">Entrega: ${l(t.newItems)}</div>
              <div class="row"><span>Cr\xe9dito devuelto</span><span>${_(t.totalCredit)}</span></div>
              <div class="row"><span>Nuevo total</span><span>${_(t.totalNew)}</span></div>
              <div class="row"><span>Entrada</span><span>${_(t.extraPayment)}</span></div>
              <div class="row"><span>Salida</span><span>${_(t.refundDue)}</span></div>
              <div class="muted">M\xe9todos entrada: ${p(t.payments)}</div>
              ${t.refundDue>0?`<div class="muted">M\xe9todo salida: ${N(t.refundMethod||"Efectivo")}</div>`:""}
            </div>`).join(""):'<div class="muted center">Sin cambios en este cierre.</div>';return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Movimientos ${N(t.documentNumber)}</title>
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
        <div class="row"><span>Cierre</span><span>${N(t.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,d.ms)(t.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${t.posName?`<div class="row"><span>POS</span><span>${N(t.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${N(t.responsible)}</span></div>
      </div>
      <hr />
      <div>
        <div class="row"><span>Devoluciones</span><span>${t.returns.length}</span></div>
        <div class="row"><span>Salidas por devoluciones</span><span>${_(e)}</span></div>
        <div class="row"><span>Cambios</span><span>${t.changes.length}</span></div>
        <div class="row"><span>Entradas por cambios</span><span>${_(a)}</span></div>
        <div class="row"><span>Salidas por cambios</span><span>${_(i)}</span></div>
        <div class="row emphasize"><span>Neto movimientos</span><span>${_(a-s)}</span></div>
      </div>
      <hr />
      <h2>M\xe9todos</h2>
      <div class="method-head"><div>M\xe9todo</div><div>Entrada</div><div>Salida</div><div>Neto</div></div>
      ${r||`<div class="muted center" style="padding:6px 0;">Sin m\xe9todos.</div>`}
      <hr />
      <h2>Devoluciones</h2>
      ${c}
      <hr />
      <h2>Cambios</h2>
      ${m}
    </body>
  </html>`}function P(t){let e=t.settings,a=e?.company_name?.trim()||v,i=e?.tax_id?.trim()||h,s=e?.address?.trim()||u,n=e?.contact_phone?.trim()||g,o=e?.contact_email?.trim()||x,r=b(e?.ticket_footer),l=r.text.trim()||f,p=r.align,c=y(w(e)),m=t.payments.reduce((t,e)=>t+(e.amount??0),0)||t.total,$=Math.max(0,t.total-m),T=t.items.length?t.items.map((t,e)=>{let a=t.quantity??1,i=t.unitPrice&&t.unitPrice>0?t.unitPrice:a>0?t.total/a:t.total,s=Math.max(0,i*a-t.total);return`
            <tr>
              <td>${e+1}</td>
              <td>${N(t.name)}</td>
              <td>${a}</td>
              <td>${_(i)}</td>
              <td>${s>0?"-${formatMoney(discount)}":"0"}</td>
              <td>${_(t.total)}</td>
            </tr>`}).join(""):`<tr><td colspan="6" class="muted">Sin art\xedculos</td></tr>`,z=[t.customer?.name?N(t.customer.name):"Cliente Final",t.customer?.taxId?`NIT / Documento: ${N(t.customer.taxId)}`:"",t.customer?.address?`Direcci\xf3n: ${N(t.customer.address)}`:"",t.customer?.phone?`Tel\xe9fono: ${N(t.customer.phone)}`:"",t.customer?.email?`Email: ${N(t.customer.email)}`:""].filter(Boolean).join("<br />"),E=t.payments.length?t.payments.map(t=>`
            <tr>
              <td>${N(t.label)}</td>
              <td>${_(t.amount)}</td>
            </tr>`).join(""):`<tr><td>Pago registrado</td><td>${_(t.total)}</td></tr>`,D=(0,d.ms)(t.date,{dateStyle:"short",timeStyle:"short"})||"",A=t.adjustmentBadge?`<div class="adjustment-banner">${N(t.adjustmentBadge)}</div>${t.adjustmentNote?`<div class="adjustment-note">${N(t.adjustmentNote)}</div>`:""}`:"";return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Factura ${N(t.documentNumber)}</title>
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
            <p><strong>${N(a)}</strong></p>
            <p>${N(s)}</p>
            <p>Tel: ${N(n)} \xb7 Email: ${N(o)}</p>
            <p>NIT: ${N(i)}</p>
          </div>
          <div class="meta">
            <div class="logo">${c?`<img src="${N(c)}" alt="Logo" />`:""}</div>
            <div class="doc-number">${N(t.documentNumber)}</div>
            <div>Fecha: ${D}</div>
            <div>POS: ${N(t.posName??"")}</div>
            <div>Cajero: ${N(t.vendorName??"")}</div>
          </div>
        </header>

        <div class="info-grid">
          <div class="info-box">
            <strong>Cliente</strong>
            ${z}
          </div>
          <div class="info-box">
            <strong>Resumen</strong>
            <div>Ticket #: ${N(t.documentNumber)}</div>
            <div>Documentos: ${N(t.documentNumber)}</div>
            <div>Estado del pago: ${$>0?"Pendiente":"Pagado"}</div>
          </div>
        </div>

        ${A}

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
            ${T}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td>Subtotal</td>
            <td>${_(t.subtotal)}</td>
          </tr>
          ${t.lineDiscountTotal>0?`<tr><td>Descuento art\xedculos</td><td>- ${_(t.lineDiscountTotal)}</td></tr>`:""}
          <tr>
            <td>${N(t.cartDiscountLabel)}</td>
            <td>${N(t.cartDiscountValueDisplay)}</td>
          </tr>
          ${t.surchargeLabel&&("number"==typeof t.surchargeAmount?0!==t.surchargeAmount:!!t.surchargeValueDisplay?.trim())?`<tr><td>${N(t.surchargeLabel)}</td><td>${"number"==typeof t.surchargeAmount?(t.surchargeAmount>=0?"+ ":"- ")+_(Math.abs(t.surchargeAmount)):N(t.surchargeValueDisplay??"")}</td></tr>`:""}
          <tr class="total">
            <td>Total</td>
            <td>${_(t.total)}</td>
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
            ${E}
            <tr>
              <td><strong>Pagado</strong></td>
              <td><strong>${_(m)}</strong></td>
            </tr>
            <tr>
              <td><strong>Saldo</strong></td>
              <td><strong>${_($)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="footer-note" style="text-align:${p};">
          ${S(l)}
        </div>
        <footer>P\xe1gina 1</footer>
      </div>
    </body>
  </html>`}function I(t){let e=t.settings,a=e?.company_name?.trim()||v,i=e?.tax_id?.trim()||h,s=e?.address?.trim()||u,n=e?.contact_phone?.trim()||g,o=e?.contact_email?.trim()||x,r=y(w(e)),l=function(t){if(!t)return;let e=Number(t.reservedTotal??0),a=Number(t.paymentsTotal??0),i=Math.max(e-a,0),s=i>0?i:Number(t.pendingTotal??0),n=Number(t.dayCollectedTotal??e-s);return{tickets:Number(t.tickets??0),paymentsTotal:a,reservedTotal:e,pendingTotal:s,dayCollectedTotal:n,dayWithPendingTotal:t.dayWithPendingTotal??n+s}}(t.separatedSummary),p=t.methods.some(t=>"number"==typeof t.gross||"number"==typeof t.refunds||"number"==typeof t.net),c=t.methods.length?t.methods.map(t=>{let e=t.gross??t.amount??0,a=t.refunds??0,i=t.net??t.amount??e-a;return p?`
        <div class="method-grid">
          <span>${N(t.label)}</span>
          <span>${_(e)}</span>
          <span>${T(-Math.abs(a))}</span>
          <span>${T(i)}</span>
        </div>`:`
        <div class="row">
          <span>${N(t.label)}</span>
          <span>${T(i)}</span>
        </div>`}).join(""):p?'<div class="method-grid"><span>Sin m\xe9todos registrados</span><span>$ 0</span><span>$ 0</span><span>$ 0</span></div>':'<div class="row"><span>Sin m\xe9todos registrados</span><span>$ 0</span></div>',m=p?`
      <div class="method-grid header">
        <span>M\xe9todo</span>
        <span>Ventas</span>
        <span>Reembolsos</span>
        <span>Neto</span>
      </div>`:"",f=t.userBreakdown&&t.userBreakdown.length?t.userBreakdown.map(t=>`
        <div class="row">
          <span>${N(t.name)}</span>
          <span>${_(t.total)}</span>
        </div>`).join(""):"",$=t.stationBreakdown&&t.stationBreakdown.length?t.stationBreakdown.map(e=>{let a=t.stationBreakdown?.length===1?Number(l?.pendingTotal??0):0,i=Number(e.pendingTotal??0);return`
        <div class="row">
          <span>${N(e.stationLabel)} (${Math.max(0,Number(e.salesCount||0))})</span>
          <span>${_(Math.max(Number(e.netAmount??0)-(a>0&&i<=0?a:i),0))}</span>
        </div>`}).join(""):"",b=!!t.separatedSummary,S=Number(t.totals.registered),z=Number(t.totals.net),E=b?Number(l?.dayCollectedTotal??z):0,D=t.notes&&t.notes.trim().length?`<div class="block">
          <div class="muted">Notas</div>
          <div>${N(t.notes).split("\n").map(t=>t.trim()).filter(Boolean).map(t=>`<div>${t}</div>`).join("")}</div>
        </div>`:"",A=t.isContingency?`<div class="block" style="border:1px solid #b45309;background:#fffbeb;padding:6px;font-weight:700;text-align:center;">
        CIERRE DE CONTINGENCIA<br/><span style="font-weight:400;">Pendiente de consolidaci\xf3n con Metrik al recuperar conexi\xf3n.</span>
      </div>`:"",C=t.totals.changeExtra??0,j=t.totals.changeRefund??0,k=t.totals.changeCount??0,P=C>0||j>0||k>0;return`<!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Reporte ${N(t.documentNumber)}</title>
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
      ${r?`<div class="logo"><img src="${N(r)}" alt="Logo" /></div>`:""}
      <h1>${N(a)}</h1>
      <div class="center muted">${N(s)}</div>
      <div class="center muted">${N(n)}</div>
      <div class="center muted">${N(o)}</div>
      <div class="center muted">${N(i)}</div>
      <div class="center muted subtitle" style="margin-top:4px;">${t.isContingency?"Cierre de contingencia":"Reporte Z - Cierre de caja"}</div>
      <hr />
      ${A}
      <div class="block">
        <div class="row"><span>No. Reporte</span><span>${N(t.documentNumber)}</span></div>
        <div class="row"><span>Fecha cierre</span><span>${(0,d.ms)(t.closedAt,{dateStyle:"short",timeStyle:"short"})}</span></div>
        ${t.rangeSummary?`<div class="row"><span>Ventas del</span><span>${N(t.rangeSummary.startLabel===t.rangeSummary.endLabel?t.rangeSummary.startLabel:`${t.rangeSummary.startLabel} - ${t.rangeSummary.endLabel}`)}</span></div>`:""}
        ${t.posName?`<div class="row"><span>POS</span><span>${N(t.posName)}</span></div>`:""}
        <div class="row"><span>Responsable</span><span>${N(t.responsible)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="row"><span>Total registrado</span><span>${_(S)}</span></div>
        <div class="row"><span>Devoluciones / reembolsos</span><span>- ${_(t.totals.refunds)}</span></div>
        ${P?`<div class="row"><span>Cambios (excedente)</span><span>${_(C)}</span></div>
               <div class="row"><span>Cambios (reembolsos)</span><span>- ${_(j)}</span></div>
               ${k>0?`<div class="row"><span>Total cambios</span><span>${k}</span></div>`:""}`:""}
        <div class="row emphasize"><span>Neto del d\xeda</span><span>${_(z)}</span></div>
        <div class="row"><span>Efectivo esperado</span><span>${_(t.totals.expectedCash)}</span></div>
        <div class="row"><span>Efectivo contado</span><span>${_(t.totals.countedCash)}</span></div>
        <div class="row"><span>Diferencia</span><span>${_(t.totals.difference)}</span></div>
      </div>
      <hr />
      <div class="block">
        <div class="muted">Detalle por m\xe9todo</div>
        ${m}
        ${c}
        ${p?"":'<div class="muted" style="margin-top:4px;">Totales netos (reembolsos ya descontados).</div>'}
      </div>
      ${f?`<hr />
        <div class="block">
          <div class="muted">Ventas por usuario</div>
          ${f}
        </div>`:""}
      ${b?`<hr />
        <div class="block">
          <div class="muted">Aclaraci\xf3n de total del d\xeda</div>
          <div class="row emphasize"><span>Total de HOY</span><span>${_(E)}</span></div>
        </div>`:""}
      ${$?`<hr />
        <div class="block">
          <div class="muted">Ventas por estaci\xf3n</div>
          ${$}
        </div>`:""}
      ${l?`<hr />
        <div class="block">
          <div class="muted">Ventas por separado</div>
          <div class="row"><span>Tickets registrados</span><span>${l.tickets}</span></div>
          <div class="row"><span>Abonos cobrados</span><span>${_(l.paymentsTotal)}</span></div>
          <div class="row"><span>Total reservado</span><span>${_(l.reservedTotal)}</span></div>
          <div class="row"><span>Saldo pendiente</span><span>${l.pendingTotal>0?_(l.pendingTotal):"$ 0"}</span></div>
        </div>`:""}
      ${D}
    </body>
  </html>`}},5700:(t,e,a)=>{a.d(e,{L:()=>s,x:()=>i});let i=/^9\d{15}$/;function s(t){let e=String(t??"").replace(/^OFF-/i,"").replace(/-/g,"").slice(0,12);return/^[0-9a-f]{12}$/i.test(e)?`9${parseInt(e,16).toString().padStart(15,"0")}`:null}},6172:(t,e,a)=>{a.d(e,{GW:()=>n,Om:()=>r,Wq:()=>o,d:()=>l,r9:()=>d});var i=a(4566);let s=(t,e)=>{if(null==t)return e;let a=t.trim().toLowerCase();return!["0","false","no","off"].includes(a)&&(!!["1","true","yes","on"].includes(a)||e)},n=s(i.env.NEXT_PUBLIC_REQUIRE_FREE_SALE_REASON,!0),o=s(i.env.NEXT_PUBLIC_SHOW_FREE_SALE_TRACEABILITY_REPORT,n),d=s(i.env.NEXT_PUBLIC_ENABLE_POS_CASH_EXPENSES,!0),r=s(i.env.NEXT_PUBLIC_ENABLE_POS_MOVEMENT_CLOSURE_TICKET,!0),l=s(i.env.NEXT_PUBLIC_ENABLE_LOYALTY_QR_TICKETS,!1)},8155:(t,e,a)=>{a.d(e,{Sn:()=>s,v4:()=>n});var i=a(1730);let s=[{id:-1,name:"Efectivo",slug:"cash",is_active:!0,allow_change:!0,order_index:1},{id:-2,name:"Bancolombia QR / Transferencia",slug:"qr",is_active:!0,allow_change:!1,order_index:2},{id:-3,name:"Tarjeta Dat\xe1fono",slug:"card",is_active:!0,allow_change:!1,order_index:3},{id:-4,name:"Nequi",slug:"nequi",is_active:!0,allow_change:!1,order_index:4},{id:-5,name:"Daviplata",slug:"daviplata",is_active:!0,allow_change:!1,order_index:5},{id:-6,name:"Cr\xe9dito",slug:"credito",is_active:!0,allow_change:!1,order_index:6},{id:-7,name:"Separado",slug:"separado",is_active:!0,allow_change:!1,order_index:7}];async function n(t){let e=(0,i.G)(),a=o(t),s=await fetch(`${e}/pos/payment-methods`,{headers:a,credentials:"include"});if(!s.ok)throw Error(`Error ${s.status}`);return await s.json()}let o=t=>{let e={"Content-Type":"application/json"};return t&&(e.Authorization=`Bearer ${t}`),e}}}]);