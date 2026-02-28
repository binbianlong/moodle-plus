function R(e){try{return new URL(e,location.href).toString()}catch{return e}}function F(e){const t=e.closest('section, .block, [role="region"], .card, .content');return t?/最近アクセスされたアイテム/.test(t.textContent??""):!1}function H(e){const t=e.getAttribute("href")??"";return t?t.includes("course/view.php?id=")?!0:t.includes("assign/view.php")||t.includes("mod/assign/")?!1:!!(F(e)&&(t.includes("course/view.php")||t.includes("/mod/")&&!t.includes("assign"))):!1}function K(e){let t=new Map,r=null;const l=()=>{const n=new Map,c=document.querySelectorAll("a[href]");for(const o of c){if(!H(o))continue;const b=(o.textContent??"").trim(),g=o.href;if(!b||!g)continue;const u=R(g);n.has(u)||n.set(u,{title:b,url:u})}t=n};return l(),r=new MutationObserver(()=>{l()}),r.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["href"]}),{findByAnchor(n){if(!H(n))return null;const c=R(n.href);return t.get(c)??null},disconnect(){r==null||r.disconnect(),r=null}}}const A="timetable_v1",S=["mon","tue","wed","thu","fri","sat"],N=["p1","p2","p3","p4","p5","other"];function z(){return{mon:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},tue:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},wed:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},thu:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},fri:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},sat:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null}}}async function G(){var l;const t=(await chrome.storage.local.get(A))[A];if(!t||typeof t!="object")return z();const r=z();for(const n of S)for(const c of N){const o=(l=t==null?void 0:t[n])==null?void 0:l[c];o&&typeof o=="object"&&typeof o.title=="string"&&typeof o.url=="string"&&(r[n][c]={title:o.title,url:o.url})}return r}async function Y(e){await chrome.storage.local.set({[A]:e})}const V={mon:"月",tue:"火",wed:"水",thu:"木",fri:"金",sat:"土"},J={p1:"1",p2:"2",p3:"3",p4:"4",p5:"5",other:"その他"};function x(e,t,r){for(const l of t){const n=e.getPropertyValue(l).trim();if(n)return n}return r}function Q(){const e=getComputedStyle(document.documentElement),t=x(e,["--body-bg","--bs-body-bg"],"#f8f9fa"),r=x(e,["--card-bg","--bs-card-bg","--bs-white"],"#ffffff"),l=x(e,["--border-color","--bs-border-color","--gray-300"],"#d9dee4"),n=x(e,["--body-color","--bs-body-color","--gray-900"],"#2b3138"),c=x(e,["--secondary","--bs-secondary-color","--gray-600"],"#5f6b7a"),o=x(e,["--primary","--bs-primary"],"#0f6cbf"),b=x(e,["--primary-600","--bs-primary-text-emphasis"],"#0c5a9f");return`
    --mpt-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    --mpt-bg-page: ${t};
    --mpt-bg-surface: ${r};
    --mpt-bg-subtle: color-mix(in srgb, ${t} 70%, ${r} 30%);
    --mpt-border: ${l};
    --mpt-text: ${n};
    --mpt-text-muted: ${c};
    --mpt-primary: ${o};
    --mpt-primary-hover: ${b};
    --mpt-primary-soft: color-mix(in srgb, ${o} 14%, ${r} 86%);
    --mpt-danger-soft: #eef1f4;
    --mpt-danger-text: #4b5563;
    --mpt-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
    --mpt-radius: 8px;
  `}function W(e){const t=document.createElement("div");t.className="mpt-host";const r=t.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=`
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
      transition: opacity 120ms ease, background-color 120ms ease, border-color 120ms ease;
    }

    .mpt-cell:hover .mpt-remove,
    .mpt-cell:focus-within .mpt-remove,
    .mpt-remove:focus-visible {
      opacity: 1;
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
  `;const n=document.createElement("div");n.className="mpt-wrap";const c=document.createElement("div");c.className="mpt-header";const o=document.createElement("div");o.className="mpt-title-group";const b=document.createElement("div");b.className="mpt-title",b.textContent="時間割";const g=document.createElement("div");g.className="mpt-message";const u=document.createElement("button");u.className="mpt-btn",u.type="button",u.addEventListener("click",()=>e.onToggleEdit()),o.append(b,g),c.append(o,u);const k=document.createElement("table");k.className="mpt-table",n.append(c,k),r.append(l,n);const B=new Map;(()=>{k.innerHTML="";const i=document.createElement("tr"),a=document.createElement("th");a.textContent="",i.appendChild(a);for(const s of S){const m=document.createElement("th");m.textContent=V[s],i.appendChild(m)}k.appendChild(i);for(const s of N){const m=document.createElement("tr"),f=document.createElement("th");f.className="mpt-period",f.textContent=J[s],m.appendChild(f);for(const L of S){const d=document.createElement("td");d.className="mpt-cell",d.dataset.day=L,d.dataset.period=s,d.addEventListener("click",()=>e.onSelectCell({day:L,period:s})),m.appendChild(d),B.set(`${L}:${s}`,d)}k.appendChild(m)}})();const q=(i,a,s)=>{var D,O;const m=i.dataset.day,f=i.dataset.period;i.innerHTML="";const L=((D=s.selectedCell)==null?void 0:D.day)===m&&((O=s.selectedCell)==null?void 0:O.period)===f;i.classList.toggle("mpt-selected",!!L);const d=document.createElement("div");if(d.className="mpt-cell-inner",!a){const p=document.createElement("span");p.className="mpt-empty",p.textContent=s.editMode?"クリックして選択":" ",d.appendChild(p),i.appendChild(d);return}const h=document.createElement("a");if(h.className="mpt-lesson-link",h.textContent=a.title,h.href=a.url,h.dataset.url=a.url,s.editMode?h.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation()}):h.addEventListener("click",p=>{p.preventDefault(),e.onOpenLesson(a)}),d.appendChild(h),i.appendChild(d),s.editMode){const p=document.createElement("button");p.className="mpt-remove",p.type="button",p.textContent="x",p.setAttribute("aria-label","授業を削除"),p.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),e.onRemoveCell({day:m,period:f})}),i.appendChild(p)}};return{mount(i){var a;(a=i.parentNode)==null||a.insertBefore(t,i)},render(i,a){g.textContent=a.message,g.classList.toggle("mpt-show",!!a.message),u.textContent=a.editMode?"編集を終える":"編集する",u.classList.remove("mpt-btn-primary","mpt-btn-secondary"),u.classList.add(a.editMode?"mpt-btn-secondary":"mpt-btn-primary");for(const s of S)for(const m of N){const f=B.get(`${s}:${m}`);f&&q(f,i[s][m],a)}}}}let E=z(),y=!1,w=null,C="",$=!1,M=!1;const T=W({onToggleEdit:()=>{y=!y,y?(C="枠を選んでください",Z()):(w=null,C="",j()),v()},onSelectCell:e=>{y&&(w=e,C="ダッシュボードから授業を入力してください",v())},onRemoveCell:async({day:e,period:t})=>{E[e][t]=null,await Y(E),v()},onOpenLesson:e=>{window.location.href=e.url}}),U=K();function v(){T.render(E,{editMode:y,selectedCell:w,message:C})}function X(e){if(!w){C="枠を選んでください",v();return}E[w.day][w.period]=e,Y(E).catch(t=>{console.error("[mpt] failed to save timetable",t)}),C=`設定: ${e.title}`,v()}function _(e){if(!y)return;const t=e.target;if(!(t instanceof Element))return;const r=t.closest("a[href]");if(!(r instanceof HTMLAnchorElement))return;const l=U.findByAnchor(r);l&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),X(l))}function Z(){M||(document.addEventListener("click",_,!0),M=!0)}function j(){M&&(document.removeEventListener("click",_,!0),M=!1)}function ee(){const e=Array.from(document.querySelectorAll("h1, h2, h3, .page-header-headings, .breadcrumb-nav"));for(const t of e){const r=(t.textContent??"").trim();if(r==="ダッシュボード"||r.includes("ダッシュボード"))return t}return null}function te(){return document.querySelector("main .container-fluid")||document.querySelector("main")||document.querySelector("#page-content")||document.body.firstElementChild}function I(){if($)return!0;const e=ee();if(e&&e.parentElement)return T.mount(e),$=!0,!0;const t=te();if(t){const r=document.createElement("div");return t.insertAdjacentElement("afterbegin",r),T.mount(r),r.remove(),$=!0,!0}return!1}function re(){if(I()){v();return}const e=new MutationObserver(()=>{I()&&(v(),e.disconnect())});e.observe(document.documentElement,{childList:!0,subtree:!0})}async function ne(){document.title&&!document.title.includes("ダッシュボード")||(E=await G(),re(),window.addEventListener("beforeunload",()=>{j(),U.disconnect()}))}ne();
