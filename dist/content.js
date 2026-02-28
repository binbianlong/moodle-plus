function P(e){try{return new URL(e,location.href).toString()}catch{return e}}function F(e){const t=e.closest('section, .block, [role="region"], .card, .content');return t?/最近アクセスされたアイテム/.test(t.textContent??""):!1}function R(e){const t=e.getAttribute("href")??"";return t?t.includes("course/view.php?id=")?!0:t.includes("assign/view.php")||t.includes("mod/assign/")?!1:!!(F(e)&&(t.includes("course/view.php")||t.includes("/mod/")&&!t.includes("assign"))):!1}function K(e){let t=new Map,r=null;const o=()=>{const n=new Map,p=document.querySelectorAll("a[href]");for(const a of p){if(!R(a))continue;const b=(a.textContent??"").trim(),g=a.href;if(!b||!g)continue;const u=P(g);n.has(u)||n.set(u,{title:b,url:u})}t=n};return o(),r=new MutationObserver(()=>{o()}),r.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["href"]}),{findByAnchor(n){if(!R(n))return null;const p=P(n.href);return t.get(p)??null},disconnect(){r==null||r.disconnect(),r=null}}}const $="timetable_v1",M=["mon","tue","wed","thu","fri","sat"],N=["p1","p2","p3","p4","p5","other"];function z(){return{mon:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},tue:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},wed:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},thu:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},fri:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},sat:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null}}}async function G(){var o;const t=(await chrome.storage.local.get($))[$];if(!t||typeof t!="object")return z();const r=z();for(const n of M)for(const p of N){const a=(o=t==null?void 0:t[n])==null?void 0:o[p];a&&typeof a=="object"&&typeof a.title=="string"&&typeof a.url=="string"&&(r[n][p]={title:a.title,url:a.url})}return r}async function Y(e){await chrome.storage.local.set({[$]:e})}const V={mon:"月",tue:"火",wed:"水",thu:"木",fri:"金",sat:"土"},J={p1:"1",p2:"2",p3:"3",p4:"4",p5:"5",other:"その他"};function h(e,t,r){for(const o of t){const n=e.getPropertyValue(o).trim();if(n)return n}return r}function Q(){const e=getComputedStyle(document.documentElement),t=h(e,["--body-bg","--bs-body-bg"],"#f8f9fa"),r=h(e,["--card-bg","--bs-card-bg","--bs-white"],"#ffffff"),o=h(e,["--border-color","--bs-border-color","--gray-300"],"#d9dee4"),n=h(e,["--body-color","--bs-body-color","--gray-900"],"#2b3138"),p=h(e,["--secondary","--bs-secondary-color","--gray-600"],"#5f6b7a"),a=h(e,["--primary","--bs-primary"],"#0f6cbf"),b=h(e,["--primary-600","--bs-primary-text-emphasis"],"#0c5a9f");return`
    --mpt-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    --mpt-bg-page: ${t};
    --mpt-bg-surface: ${r};
    --mpt-bg-subtle: color-mix(in srgb, ${t} 70%, ${r} 30%);
    --mpt-border: ${o};
    --mpt-text: ${n};
    --mpt-text-muted: ${p};
    --mpt-primary: ${a};
    --mpt-primary-hover: ${b};
    --mpt-primary-soft: color-mix(in srgb, ${a} 14%, ${r} 86%);
    --mpt-danger-soft: #eef1f4;
    --mpt-danger-text: #4b5563;
    --mpt-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
    --mpt-radius: 8px;
  `}function W(e){const t=document.createElement("div");t.className="mpt-host";const r=t.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=`
    :host {
      all: initial;
      ${Q()}
      color: var(--mpt-text);
      font-family: var(--mpt-font-family);
    }

    .mpt-wrap {
      font-family: var(--mpt-font-family);
      background: var(--mpt-bg-surface);
      border: 1px solid var(--mpt-border);
      border-radius: var(--mpt-radius);
      box-shadow: var(--mpt-shadow);
      margin: 6px 0 14px;
      padding: 12px;
      box-sizing: border-box;
      width: 100%;
      max-width: 1200px;
    }

    .mpt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }

    .mpt-title-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      flex: 1;
    }

    .mpt-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--mpt-text);
      line-height: 1.3;
    }

    .mpt-message {
      font-size: 12px;
      color: var(--mpt-text-muted);
      border-radius: 6px;
      border: 1px solid transparent;
      border-left-width: 3px;
      padding: 0;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-2px);
      transition: opacity 120ms ease, transform 120ms ease, max-height 160ms ease, padding 120ms ease;
    }

    .mpt-message.mpt-show {
      background: var(--mpt-primary-soft);
      border-color: color-mix(in srgb, var(--mpt-primary) 20%, var(--mpt-bg-surface) 80%);
      color: color-mix(in srgb, var(--mpt-primary) 75%, var(--mpt-text) 25%);
      opacity: 1;
      transform: translateY(0);
      max-height: 52px;
      padding: 6px 8px;
    }

    .mpt-btn {
      height: 34px;
      border-radius: 6px;
      border: 1px solid transparent;
      padding: 0 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .mpt-btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 0.18rem color-mix(in srgb, var(--mpt-primary) 28%, transparent 72%);
    }

    .mpt-btn-primary {
      background: var(--mpt-primary);
      border-color: var(--mpt-primary);
      color: #fff;
    }

    .mpt-btn-primary:hover {
      background: var(--mpt-primary-hover);
      border-color: var(--mpt-primary-hover);
    }

    .mpt-btn-primary:active {
      background: color-mix(in srgb, var(--mpt-primary-hover) 88%, #000 12%);
    }

    .mpt-btn-secondary {
      background: var(--mpt-bg-surface);
      border-color: var(--mpt-border);
      color: var(--mpt-text);
    }

    .mpt-btn-secondary:hover {
      background: var(--mpt-bg-subtle);
      border-color: color-mix(in srgb, var(--mpt-border) 85%, var(--mpt-text) 15%);
    }

    .mpt-btn-secondary:active {
      background: color-mix(in srgb, var(--mpt-bg-subtle) 90%, #000 10%);
    }

    .mpt-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 13px;
      background: var(--mpt-bg-surface);
    }

    .mpt-table th,
    .mpt-table td {
      border: 1px solid var(--mpt-border);
      padding: 0;
      vertical-align: middle;
      background: var(--mpt-bg-surface);
    }

    .mpt-table th {
      background: var(--mpt-bg-subtle);
      color: color-mix(in srgb, var(--mpt-text) 85%, var(--mpt-text-muted) 15%);
      font-weight: 600;
      height: 34px;
      text-align: center;
    }

    .mpt-period {
      width: 54px;
      min-width: 54px;
      font-size: 12px;
    }

    .mpt-cell {
      position: relative;
      cursor: pointer;
      transition: background-color 120ms ease, box-shadow 120ms ease;
    }

    .mpt-cell:hover {
      background: color-mix(in srgb, var(--mpt-primary) 4%, var(--mpt-bg-surface) 96%);
    }

    .mpt-cell.mpt-selected {
      background: color-mix(in srgb, var(--mpt-primary) 8%, var(--mpt-bg-surface) 92%);
      box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--mpt-primary) 55%, var(--mpt-bg-surface) 45%);
    }

    .mpt-cell-inner {
      display: flex;
      align-items: center;
      min-height: 46px;
      padding: 6px 10px;
      width: 100%;
      box-sizing: border-box;
      min-width: 0;
    }

    .mpt-lesson-link {
      display: block;
      color: var(--mpt-primary);
      text-decoration: none;
      min-width: 0;
      width: 100%;
      white-space: normal;
      overflow-wrap: anywhere;
      line-height: 1.35;
      padding-right: 18px;
    }

    .mpt-lesson-link:hover {
      text-decoration: underline;
    }

    .mpt-empty {
      display: block;
      width: 100%;
      color: color-mix(in srgb, var(--mpt-text-muted) 80%, var(--mpt-bg-surface) 20%);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.7;
    }

    .mpt-remove {
      position: absolute;
      right: 6px;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 999px;
      border: 1px solid transparent;
      background: var(--mpt-danger-soft);
      color: var(--mpt-danger-text);
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 120ms ease, background-color 120ms ease, border-color 120ms ease;
    }

    .mpt-cell:hover .mpt-remove,
    .mpt-cell:focus-within .mpt-remove,
    .mpt-remove:focus-visible {
      opacity: 1;
      pointer-events: auto;
    }

    .mpt-remove:hover {
      background: color-mix(in srgb, var(--mpt-danger-soft) 75%, #d1d5db 25%);
      border-color: color-mix(in srgb, var(--mpt-border) 80%, var(--mpt-text) 20%);
    }

    .mpt-remove:focus-visible {
      outline: none;
      box-shadow: 0 0 0 0.16rem color-mix(in srgb, var(--mpt-primary) 24%, transparent 76%);
    }

    @media (max-width: 640px) {
      .mpt-wrap {
        padding: 10px;
      }

      .mpt-header {
        align-items: flex-start;
      }

      .mpt-title {
        font-size: 15px;
      }

      .mpt-btn {
        height: 32px;
        padding: 0 10px;
        font-size: 12px;
      }

      .mpt-table {
        font-size: 12px;
      }

      .mpt-period {
        width: 42px;
        min-width: 42px;
      }

      .mpt-cell,
      .mpt-cell-inner {
        min-height: 40px;
      }

      .mpt-cell-inner {
        padding: 4px 7px;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --mpt-shadow: 0 1px 2px rgb(0 0 0 / 0.24);
      }
    }
  `;const n=document.createElement("div");n.className="mpt-wrap";const p=document.createElement("div");p.className="mpt-header";const a=document.createElement("div");a.className="mpt-title-group";const b=document.createElement("div");b.className="mpt-title",b.textContent="時間割";const g=document.createElement("div");g.className="mpt-message";const u=document.createElement("button");u.className="mpt-btn",u.type="button",u.addEventListener("click",()=>e.onToggleEdit()),a.append(b,g),p.append(a,u);const E=document.createElement("table");E.className="mpt-table",n.append(p,E),r.append(o,n);const B=new Map;(()=>{E.innerHTML="";const i=document.createElement("tr"),l=document.createElement("th");l.textContent="",i.appendChild(l);for(const s of M){const m=document.createElement("th");m.textContent=V[s],i.appendChild(m)}E.appendChild(i);for(const s of N){const m=document.createElement("tr"),f=document.createElement("th");f.className="mpt-period",f.textContent=J[s],m.appendChild(f);for(const S of M){const d=document.createElement("td");d.className="mpt-cell",d.dataset.day=S,d.dataset.period=s,d.addEventListener("click",()=>e.onSelectCell({day:S,period:s})),m.appendChild(d),B.set(`${S}:${s}`,d)}E.appendChild(m)}})();const j=(i,l,s)=>{var q,D;const m=i.dataset.day,f=i.dataset.period;i.innerHTML="";const S=((q=s.selectedCell)==null?void 0:q.day)===m&&((D=s.selectedCell)==null?void 0:D.period)===f;i.classList.toggle("mpt-selected",!!S);const d=document.createElement("div");if(d.className="mpt-cell-inner",!l){const c=document.createElement("span");c.className="mpt-empty",c.textContent=s.editMode?"クリックして選択":" ",d.appendChild(c),i.appendChild(d);return}const v=document.createElement("a");if(v.className="mpt-lesson-link",v.textContent=l.title,v.href=l.url,v.dataset.url=l.url,s.editMode&&v.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation()}),d.appendChild(v),i.appendChild(d),s.editMode){const c=document.createElement("button");c.className="mpt-remove",c.type="button",c.textContent="x",c.setAttribute("aria-label","授業を削除"),c.addEventListener("click",O=>{O.preventDefault(),O.stopPropagation(),e.onRemoveCell({day:m,period:f})}),i.appendChild(c)}};return{mount(i){var l;(l=i.parentNode)==null||l.insertBefore(t,i)},render(i,l){g.textContent=l.message,g.classList.toggle("mpt-show",!!l.message),u.textContent=l.editMode?"編集を終える":"編集する",u.classList.remove("mpt-btn-primary","mpt-btn-secondary"),u.classList.add(l.editMode?"mpt-btn-secondary":"mpt-btn-primary");for(const s of M)for(const m of N){const f=B.get(`${s}:${m}`);f&&j(f,i[s][m],l)}}}}let k=z(),y=!1,w=null,C="",L=!1,A=!1;const T=W({onToggleEdit:()=>{y=!y,y?(C="枠を選んでください",Z()):(w=null,C="",_()),x()},onSelectCell:e=>{y&&(w=e,C="ダッシュボードから授業を入力してください",x())},onRemoveCell:async({day:e,period:t})=>{k[e][t]=null,await Y(k),x()}}),H=K();function x(){T.render(k,{editMode:y,selectedCell:w,message:C})}function X(e){if(!w){C="枠を選んでください",x();return}k[w.day][w.period]=e,Y(k).catch(t=>{console.error("[mpt] failed to save timetable",t)}),C=`設定: ${e.title}`,x()}function U(e){if(!y)return;const t=e.target;if(!(t instanceof Element))return;const r=t.closest("a[href]");if(!(r instanceof HTMLAnchorElement))return;const o=H.findByAnchor(r);o&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),X(o))}function Z(){A||(document.addEventListener("click",U,!0),A=!0)}function _(){A&&(document.removeEventListener("click",U,!0),A=!1)}function ee(){const e=Array.from(document.querySelectorAll('h1, h2, h3, h4, [role="heading"], .card-title, .header'));for(const r of e){if(!(r.textContent??"").trim().includes("コース概要"))continue;return r.closest('section, .block, .card, .container-fluid, [role="region"]')??r}const t=Array.from(document.querySelectorAll('[aria-label*="コース概要"], section, .block, .card, [role="region"]'));for(const r of t){const o=(r.getAttribute("aria-label")??"").trim(),n=(r.textContent??"").trim();if(o.includes("コース概要")||n.includes("コース概要"))return r}return null}function te(){return document.querySelector('[role="main"] .container-fluid')||document.querySelector('[role="main"]')||document.querySelector("main .container-fluid")||document.querySelector("main")||document.querySelector("#page-content")||document.body.firstElementChild}function I(){if(L)return!0;if(document.querySelector(".mpt-host"))return L=!0,!0;const e=ee();if(e&&e.parentElement)return T.mount(e),L=!0,!0;const t=te();if(t){const r=document.createElement("div");return t.insertAdjacentElement("afterbegin",r),T.mount(r),r.remove(),L=!0,!0}return!1}function re(){if(I()){x();return}const e=new MutationObserver(()=>{I()&&(x(),e.disconnect())});e.observe(document.documentElement,{childList:!0,subtree:!0})}async function ne(){location.pathname==="/my/courses.php"&&(k=await G(),re(),window.addEventListener("beforeunload",()=>{_(),H.disconnect()}))}ne();
