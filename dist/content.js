function G(e){try{return new URL(e,location.href).toString()}catch{return e}}function ee(e){const t=e.closest('section, .block, [role="region"], .card, .content');return t?/最近アクセスされたアイテム/.test(t.textContent??""):!1}function V(e){const t=e.getAttribute("href")??"";return t?t.includes("course/view.php?id=")?!0:t.includes("assign/view.php")||t.includes("mod/assign/")?!1:!!(ee(e)&&(t.includes("course/view.php")||t.includes("/mod/")&&!t.includes("assign"))):!1}function te(e){let t=new Map,n=null;const o=()=>{const r=new Map,m=document.querySelectorAll("a[href]");for(const i of m){if(!V(i))continue;const h=(i.textContent??"").trim(),w=i.href;if(!h||!w)continue;const u=G(w);r.has(u)||r.set(u,{title:h,url:u})}t=r};return o(),n=new MutationObserver(()=>{o()}),n.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["href"]}),{findByAnchor(r){if(!V(r))return null;const m=G(r.href);return t.get(m)??null},disconnect(){n==null||n.disconnect(),n=null}}}const j="timetable_v1",B=["mon","tue","wed","thu","fri","sat"],Y=["p1","p2","p3","p4","p5","other"];function R(){return{mon:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},tue:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},wed:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},thu:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},fri:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null},sat:{p1:null,p2:null,p3:null,p4:null,p5:null,other:null}}}async function ne(){var o;const t=(await chrome.storage.local.get(j))[j];if(!t||typeof t!="object")return R();const n=R();for(const r of B)for(const m of Y){const i=(o=t==null?void 0:t[r])==null?void 0:o[m];i&&typeof i=="object"&&typeof i.title=="string"&&typeof i.url=="string"&&(n[r][m]={title:i.title,url:i.url})}return n}async function _(e){await chrome.storage.local.set({[j]:e})}const re={mon:"月",tue:"火",wed:"水",thu:"木",fri:"金",sat:"土"},oe={p1:"1",p2:"2",p3:"3",p4:"4",p5:"5",other:"その他"},ae={p1:"9:00〜10:35",p2:"10:45〜12:20",p3:"13:10〜14:45",p4:"14:55〜16:30",p5:"16:40〜18:15"};function C(e,t,n){for(const o of t){const r=e.getPropertyValue(o).trim();if(r)return r}return n}function ie(){const e=getComputedStyle(document.documentElement),t=C(e,["--body-bg","--bs-body-bg"],"#f8f9fa"),n=C(e,["--card-bg","--bs-card-bg","--bs-white"],"#ffffff"),o=C(e,["--border-color","--bs-border-color","--gray-300"],"#d9dee4"),r=C(e,["--body-color","--bs-body-color","--gray-900"],"#2b3138"),m=C(e,["--secondary","--bs-secondary-color","--gray-600"],"#5f6b7a"),i=C(e,["--primary","--bs-primary"],"#0f6cbf"),h=C(e,["--primary-600","--bs-primary-text-emphasis"],"#0c5a9f");return`
    --mpt-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    --mpt-bg-page: ${t};
    --mpt-bg-surface: ${n};
    --mpt-bg-subtle: color-mix(in srgb, ${t} 70%, ${n} 30%);
    --mpt-border: ${o};
    --mpt-text: ${r};
    --mpt-text-muted: ${m};
    --mpt-primary: ${i};
    --mpt-primary-hover: ${h};
    --mpt-primary-soft: color-mix(in srgb, ${i} 14%, ${n} 86%);
    --mpt-danger-soft: #eef1f4;
    --mpt-danger-text: #4b5563;
    --mpt-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
    --mpt-radius: 8px;
  `}function le(e){const t=document.createElement("div");t.className="mpt-host";const n=t.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=`
    :host {
      all: initial;
      ${ie()}
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      line-height: 1;
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

    .mpt-btn-danger {
      background: #fff5f5;
      border-color: #f1c8c8;
      color: #a32929;
    }

    .mpt-btn-danger:hover {
      background: #ffecec;
      border-color: #eaa9a9;
    }

    .mpt-btn-danger:active {
      background: #ffdede;
    }

    .mpt-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.24);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
    }

    .mpt-modal-backdrop.mpt-show {
      display: flex;
    }

    .mpt-modal {
      width: min(420px, calc(100vw - 24px));
      background: var(--mpt-bg-surface);
      border: 1px solid var(--mpt-border);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
      padding: 12px;
      box-sizing: border-box;
    }

    .mpt-modal-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--mpt-text);
    }

    .mpt-modal-text {
      font-size: 13px;
      color: var(--mpt-text);
      margin-bottom: 12px;
      line-height: 1.45;
    }

    .mpt-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
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
  `;const r=document.createElement("div");r.className="mpt-wrap";const m=document.createElement("div");m.className="mpt-header";const i=document.createElement("div");i.className="mpt-title-group";const h=document.createElement("div");h.className="mpt-title",h.textContent="時間割";const w=document.createElement("div");w.className="mpt-message";const u=document.createElement("button");u.className="mpt-btn",u.type="button",u.addEventListener("click",()=>e.onToggleEdit());const N=document.createElement("div");N.style.display="flex",N.style.gap="8px",N.style.alignItems="center";const S=document.createElement("button");S.className="mpt-btn mpt-btn-danger",S.type="button",S.textContent="リセット",S.addEventListener("click",()=>{b.classList.add("mpt-show")}),i.append(h,w),N.append(S,u),m.append(i,N);const M=document.createElement("table");M.className="mpt-table";const b=document.createElement("div");b.className="mpt-modal-backdrop";const O=document.createElement("div");O.className="mpt-modal";const q=document.createElement("div");q.className="mpt-modal-title",q.textContent="確認";const D=document.createElement("div");D.className="mpt-modal-text",D.textContent="時間割の中の授業が全て消えます。よろしいですか？";const P=document.createElement("div");P.className="mpt-modal-actions";const A=document.createElement("button");A.type="button",A.className="mpt-btn mpt-btn-secondary",A.textContent="キャンセル";const T=document.createElement("button");T.type="button",T.className="mpt-btn mpt-btn-danger",T.textContent="リセット",P.append(A,T),O.append(q,D,P),b.appendChild(O),A.addEventListener("click",()=>{b.classList.remove("mpt-show")}),T.addEventListener("click",()=>{b.classList.remove("mpt-show"),e.onResetAll()}),b.addEventListener("click",a=>{a.target===b&&b.classList.remove("mpt-show")}),r.append(m,M,b),n.append(o,r);const U=new Map;(()=>{M.innerHTML="";const a=document.createElement("tr"),l=document.createElement("th");l.textContent="",a.appendChild(l);for(const s of B){const d=document.createElement("th");d.textContent=re[s],a.appendChild(d)}M.appendChild(a);for(const s of Y){const d=document.createElement("tr"),f=document.createElement("th");f.className="mpt-period";const z=document.createElement("span");z.className="mpt-period-main",z.textContent=oe[s],f.appendChild(z);const x=ae[s];if(x){const c=document.createElement("span");c.className="mpt-period-time",c.textContent=x,f.appendChild(c)}d.appendChild(f);for(const c of B){const g=document.createElement("td");g.className="mpt-cell",g.dataset.day=c,g.dataset.period=s,g.addEventListener("click",()=>e.onSelectCell({day:c,period:s})),d.appendChild(g),U.set(`${c}:${s}`,g)}M.appendChild(d)}})();const Z=(a,l,s)=>{var g,F;const d=a.dataset.day,f=a.dataset.period;a.innerHTML="";const z=((g=s.selectedCell)==null?void 0:g.day)===d&&((F=s.selectedCell)==null?void 0:F.period)===f;a.classList.toggle("mpt-selected",!!z);const x=document.createElement("div");if(x.className="mpt-cell-inner",!l){const p=document.createElement("span");p.className="mpt-empty",p.textContent=s.editMode?"クリックして選択":" ",x.appendChild(p),a.appendChild(x);return}const c=document.createElement("a");if(c.className="mpt-lesson-link",c.textContent=l.title,c.href=l.url,c.dataset.url=l.url,s.editMode&&c.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation()}),x.appendChild(c),a.appendChild(x),s.editMode){const p=document.createElement("button");p.className="mpt-remove",p.type="button",p.textContent="x",p.setAttribute("aria-label","授業を削除"),p.addEventListener("click",K=>{K.preventDefault(),K.stopPropagation(),e.onRemoveCell({day:d,period:f})}),a.appendChild(p)}};return{mount(a){var l;(l=a.parentNode)==null||l.insertBefore(t,a)},render(a,l){w.textContent=l.message,w.classList.toggle("mpt-show",!!l.message),u.textContent=l.editMode?"編集を終える":"編集する",u.classList.remove("mpt-btn-primary","mpt-btn-secondary"),u.classList.add(l.editMode?"mpt-btn-secondary":"mpt-btn-primary"),S.style.display=l.editMode?"inline-flex":"none";for(const s of B)for(const d of Y){const f=U.get(`${s}:${d}`);f&&Z(f,a[s][d],l)}}}}let v=R(),E=!1,L=null,k="",$=!1,I=!1;const H=le({onToggleEdit:()=>{E=!E,E?(k="枠を選んでください",ce()):(L=null,k="",X()),y()},onSelectCell:e=>{E&&(L=e,k="ダッシュボードから授業を入力してください",y())},onRemoveCell:async({day:e,period:t})=>{v[e][t]=null,await _(v),y()},onResetAll:async()=>{E&&(v=R(),L=null,k="時間割をリセットしました",await _(v),y())}}),Q=te();function y(){H.render(v,{editMode:E,selectedCell:L,message:k})}function se(e){if(!L){k="枠を選んでください",y();return}v[L.day][L.period]=e,_(v).catch(t=>{console.error("[mpt] failed to save timetable",t)}),k=`設定: ${e.title}`,y()}function W(e){if(!E)return;const t=e.target;if(!(t instanceof Element))return;const n=t.closest("a[href]");if(!(n instanceof HTMLAnchorElement))return;const o=Q.findByAnchor(n);o&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),se(o))}function ce(){I||(document.addEventListener("click",W,!0),I=!0)}function X(){I&&(document.removeEventListener("click",W,!0),I=!1)}function pe(){const e=Array.from(document.querySelectorAll('h1, h2, h3, h4, [role="heading"], .card-title, .header'));for(const n of e){if(!(n.textContent??"").trim().includes("コース概要"))continue;return n.closest('section, .block, .card, .container-fluid, [role="region"]')??n}const t=Array.from(document.querySelectorAll('[aria-label*="コース概要"], section, .block, .card, [role="region"]'));for(const n of t){const o=(n.getAttribute("aria-label")??"").trim(),r=(n.textContent??"").trim();if(o.includes("コース概要")||r.includes("コース概要"))return n}return null}function me(){return document.querySelector('[role="main"] .container-fluid')||document.querySelector('[role="main"]')||document.querySelector("main .container-fluid")||document.querySelector("main")||document.querySelector("#page-content")||document.body.firstElementChild}function J(){if($)return!0;if(document.querySelector(".mpt-host"))return $=!0,!0;const e=pe();if(e&&e.parentElement)return H.mount(e),$=!0,!0;const t=me();if(t){const n=document.createElement("div");return t.insertAdjacentElement("afterbegin",n),H.mount(n),n.remove(),$=!0,!0}return!1}function de(){if(J()){y();return}const e=new MutationObserver(()=>{J()&&(y(),e.disconnect())});e.observe(document.documentElement,{childList:!0,subtree:!0})}async function ue(){location.pathname==="/my/courses.php"&&(v=await ne(),de(),window.addEventListener("beforeunload",()=>{X(),Q.disconnect()}))}ue();
