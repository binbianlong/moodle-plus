function O(e){try{return new URL(e,location.href).toString()}catch{return e}}function F(e){const t=e.closest('section, .block, [role="region"], .card, .content');return t?/最近アクセスされたアイテム/.test(t.textContent??""):!1}function P(e){const t=e.getAttribute("href")??"";return t?t.includes("course/view.php?id=")?!0:t.includes("assign/view.php")||t.includes("mod/assign/")?!1:!!(F(e)&&(t.includes("course/view.php")||t.includes("/mod/")&&!t.includes("assign"))):!1}function K(e){let t=new Map,r=null;const o=()=>{const n=new Map,m=document.querySelectorAll("a[href]");for(const a of m){if(!P(a))continue;const g=(a.textContent??"").trim(),x=a.href;if(!g||!x)continue;const u=O(x);n.has(u)||n.set(u,{title:g,url:u})}t=n};return o(),r=new MutationObserver(()=>{o()}),r.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["href"]}),{findByAnchor(n){if(!P(n))return null;const m=O(n.href);return t.get(m)??null},disconnect(){r==null||r.disconnect(),r=null}}}const N="timetable_v1",A=["mon","tue","wed","thu","fri","sat"],$=["p1","p2","p3","p4","p5","other"];function z(){return{mon:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},tue:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},wed:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},thu:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},fri:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},sat:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null}}}async function G(){var o;const t=(await chrome.storage.local.get(N))[N];if(!t||typeof t!="object")return z();const r=z();for(const n of A)for(const m of $){const a=(o=t==null?void 0:t[n])==null?void 0:o[m];a&&typeof a=="object"&&typeof a.title=="string"&&typeof a.url=="string"&&(r[n][m]={title:a.title,url:a.url})}return r}async function Y(e){await chrome.storage.local.set({[N]:e})}const V={mon:"月",tue:"火",wed:"水",thu:"木",fri:"金",sat:"土"},J={p1:"1",p2:"2",p3:"3",p4:"4",p5:"5",other:"その他"},Q={p1:"9:00〜10:35",p2:"10:45〜12:20",p3:"13:10〜14:45",p4:"14:55〜16:30",p5:"16:40〜18:15"};function v(e,t,r){for(const o of t){const n=e.getPropertyValue(o).trim();if(n)return n}return r}function W(){const e=getComputedStyle(document.documentElement),t=v(e,["--body-bg","--bs-body-bg"],"#f8f9fa"),r=v(e,["--card-bg","--bs-card-bg","--bs-white"],"#ffffff"),o=v(e,["--border-color","--bs-border-color","--gray-300"],"#d9dee4"),n=v(e,["--body-color","--bs-body-color","--gray-900"],"#2b3138"),m=v(e,["--secondary","--bs-secondary-color","--gray-600"],"#5f6b7a"),a=v(e,["--primary","--bs-primary"],"#0f6cbf"),g=v(e,["--primary-600","--bs-primary-text-emphasis"],"#0c5a9f");return`
    --mpt-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    --mpt-bg-page: ${t};
    --mpt-bg-surface: ${r};
    --mpt-bg-subtle: color-mix(in srgb, ${t} 70%, ${r} 30%);
    --mpt-border: ${o};
    --mpt-text: ${n};
    --mpt-text-muted: ${m};
    --mpt-primary: ${a};
    --mpt-primary-hover: ${g};
    --mpt-primary-soft: color-mix(in srgb, ${a} 14%, ${r} 86%);
    --mpt-danger-soft: #eef1f4;
    --mpt-danger-text: #4b5563;
    --mpt-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
    --mpt-radius: 8px;
  `}function X(e){const t=document.createElement("div");t.className="mpt-host";const r=t.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=`
    :host {
      all: initial;
      ${W()}
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

    .mpt-period-main {
      display: block;
      font-weight: 600;
      line-height: 1.2;
    }

    .mpt-period-time {
      display: block;
      margin-top: 2px;
      font-size: 10px;
      font-weight: 400;
      color: var(--mpt-primary);
      line-height: 1.2;
      white-space: nowrap;
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
  `;const n=document.createElement("div");n.className="mpt-wrap";const m=document.createElement("div");m.className="mpt-header";const a=document.createElement("div");a.className="mpt-title-group";const g=document.createElement("div");g.className="mpt-title",g.textContent="時間割";const x=document.createElement("div");x.className="mpt-message";const u=document.createElement("button");u.className="mpt-btn",u.type="button",u.addEventListener("click",()=>e.onToggleEdit()),a.append(g,x),m.append(a,u);const S=document.createElement("table");S.className="mpt-table",n.append(m,S),r.append(o,n);const q=new Map;(()=>{S.innerHTML="";const i=document.createElement("tr"),l=document.createElement("th");l.textContent="",i.appendChild(l);for(const s of A){const d=document.createElement("th");d.textContent=V[s],i.appendChild(d)}S.appendChild(i);for(const s of $){const d=document.createElement("tr"),f=document.createElement("th");f.className="mpt-period";const M=document.createElement("span");M.className="mpt-period-main",M.textContent=J[s],f.appendChild(M);const h=Q[s];if(h){const p=document.createElement("span");p.className="mpt-period-time",p.textContent=h,f.appendChild(p)}d.appendChild(f);for(const p of A){const b=document.createElement("td");b.className="mpt-cell",b.dataset.day=p,b.dataset.period=s,b.addEventListener("click",()=>e.onSelectCell({day:p,period:s})),d.appendChild(b),q.set(`${p}:${s}`,b)}S.appendChild(d)}})();const j=(i,l,s)=>{var b,D;const d=i.dataset.day,f=i.dataset.period;i.innerHTML="";const M=((b=s.selectedCell)==null?void 0:b.day)===d&&((D=s.selectedCell)==null?void 0:D.period)===f;i.classList.toggle("mpt-selected",!!M);const h=document.createElement("div");if(h.className="mpt-cell-inner",!l){const c=document.createElement("span");c.className="mpt-empty",c.textContent=s.editMode?"クリックして選択":" ",h.appendChild(c),i.appendChild(h);return}const p=document.createElement("a");if(p.className="mpt-lesson-link",p.textContent=l.title,p.href=l.url,p.dataset.url=l.url,s.editMode&&p.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation()}),h.appendChild(p),i.appendChild(h),s.editMode){const c=document.createElement("button");c.className="mpt-remove",c.type="button",c.textContent="x",c.setAttribute("aria-label","授業を削除"),c.addEventListener("click",I=>{I.preventDefault(),I.stopPropagation(),e.onRemoveCell({day:d,period:f})}),i.appendChild(c)}};return{mount(i){var l;(l=i.parentNode)==null||l.insertBefore(t,i)},render(i,l){x.textContent=l.message,x.classList.toggle("mpt-show",!!l.message),u.textContent=l.editMode?"編集を終える":"編集する",u.classList.remove("mpt-btn-primary","mpt-btn-secondary"),u.classList.add(l.editMode?"mpt-btn-secondary":"mpt-btn-primary");for(const s of A)for(const d of $){const f=q.get(`${s}:${d}`);f&&j(f,i[s][d],l)}}}}let k=z(),w=!1,C=null,E="",L=!1,T=!1;const B=X({onToggleEdit:()=>{w=!w,w?(E="枠を選んでください",ee()):(C=null,E="",U()),y()},onSelectCell:e=>{w&&(C=e,E="ダッシュボードから授業を入力してください",y())},onRemoveCell:async({day:e,period:t})=>{k[e][t]=null,await Y(k),y()}}),_=K();function y(){B.render(k,{editMode:w,selectedCell:C,message:E})}function Z(e){if(!C){E="枠を選んでください",y();return}k[C.day][C.period]=e,Y(k).catch(t=>{console.error("[mpt] failed to save timetable",t)}),E=`設定: ${e.title}`,y()}function H(e){if(!w)return;const t=e.target;if(!(t instanceof Element))return;const r=t.closest("a[href]");if(!(r instanceof HTMLAnchorElement))return;const o=_.findByAnchor(r);o&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Z(o))}function ee(){T||(document.addEventListener("click",H,!0),T=!0)}function U(){T&&(document.removeEventListener("click",H,!0),T=!1)}function te(){const e=Array.from(document.querySelectorAll('h1, h2, h3, h4, [role="heading"], .card-title, .header'));for(const r of e){if(!(r.textContent??"").trim().includes("コース概要"))continue;return r.closest('section, .block, .card, .container-fluid, [role="region"]')??r}const t=Array.from(document.querySelectorAll('[aria-label*="コース概要"], section, .block, .card, [role="region"]'));for(const r of t){const o=(r.getAttribute("aria-label")??"").trim(),n=(r.textContent??"").trim();if(o.includes("コース概要")||n.includes("コース概要"))return r}return null}function re(){return document.querySelector('[role="main"] .container-fluid')||document.querySelector('[role="main"]')||document.querySelector("main .container-fluid")||document.querySelector("main")||document.querySelector("#page-content")||document.body.firstElementChild}function R(){if(L)return!0;if(document.querySelector(".mpt-host"))return L=!0,!0;const e=te();if(e&&e.parentElement)return B.mount(e),L=!0,!0;const t=re();if(t){const r=document.createElement("div");return t.insertAdjacentElement("afterbegin",r),B.mount(r),r.remove(),L=!0,!0}return!1}function ne(){if(R()){y();return}const e=new MutationObserver(()=>{R()&&(y(),e.disconnect())});e.observe(document.documentElement,{childList:!0,subtree:!0})}async function oe(){location.pathname==="/my/courses.php"&&(k=await G(),ne(),window.addEventListener("beforeunload",()=>{U(),_.disconnect()}))}oe();
