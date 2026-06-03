(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const M=t=>Symbol.for(`atomico/${t}`),he=t=>({current:t});function ze(t,e){const o=t.length;if(o!==e.length)return!1;for(let r=0;r<o;r++)if(t[r]!==e[r])return!1;return!0}const L=t=>typeof t=="function",I=t=>t!==null&&typeof t=="object",{isArray:pe}=Array;function fe(t,e,o=!1){let r;const s=i=>{for(let a=0;a<i.length;a++){const u=i[a];if(u&&pe(u))s(u);else{const c=typeof u,l=c==="function";if(!o&&(u==null||l||c==="boolean")||l)continue;if(c==="string"||c==="number")r=(r??"")+u;else{const f=u===!0?"":u||"";r!=null&&(e(r),r=null),e(f)}}}};s(t),r!=null&&e(r)}const ne=(t,e,o,r)=>(t.addEventListener(e,o,r),()=>t.removeEventListener(e,o)),te=M("hooks");globalThis[te]=globalThis[te]||{};let A=globalThis[te];const me="unmount",Ie=M("hook/suspense"),R=t=>{const{i:e,hooks:o}=A.c,r=o[e]=o[e]||{};return r.value=t(r.value),A.c.i++,o[e].value},re=(t,e)=>{const{i:o,hooks:r}=A.c;r[t]=r[t]||{},r[t][o]=e,A.c.i++},U=t=>R((e=he(t))=>e),J=()=>R((t=he(A.c.host))=>t),be=()=>A.c.update,je=(t,e,o=0)=>{let r={},s=!1;return{render:c=>{A.c={host:e,hooks:r,update:t,i:0,id:o};let l;try{s=!1,l=c()}catch(f){if(f!==Ie)throw f;s=!0}finally{A.c=null}return l},dispatch:(c,l)=>{const f=r[c];for(const m in f)f[m](l)},isSuspense:()=>s}};function ie(t,e,o){const r=[L(t)?t():t,s=>{const i=L(s)?s(r[0]):s,a=o?o(r[0],i):i;a!==r[0]&&e(r[0]=a)}];return r}const ge="effect",ve="layoutEffect",ye="insertionEffect",ae=t=>(e,o)=>{const r=U({});re(t,()=>{const{current:s}=r;if(!s.args||!ze(s.args,o)){s.args=o,s.clean?.();const i=e();i&&(s.clean=i)}}),re(me,()=>{r.current.clean&&(r.current.clean(),r.current={})})},ce=ae(ye),Le=ae(ve),K=ae(ge),j=t=>{const e=be();return R((o=ie(t,e))=>o)},Be=(t,e,o,r)=>{const s=U();s.current=o,Le(()=>t.current&&ne(t.current,e,i=>s.current(i),r),[t.current])},y=t=>{const{current:e}=J();if(!(t in e))throw new De(e,`For useProp("${t}"), the prop does not exist on the host.`,t);return R((o=ie(e[t],r=>e[t]=r))=>(o[0]=e[t],o))},Me="formAssociated",Re="formDisabled",xe="formReset",Z=M("hook/internals"),Ue=(t,e,o)=>{const r=new FormData,s=typeof o,i=s=="number"||s=="boolean"?o+"":o;return o&&r.append(e,i),t.setFormValue(r,r),r.get(e)},$e=t=>e=>re(t,o=>e(o)),X=()=>{const{current:t}=J();return t[Z]=t[Z]||t.attachInternals(),t[Z]},we=(t="name",e="value")=>{const o=X(),[r]=y(t),[s,i]=y(e);return le(()=>i(null)),K(()=>{Ue(o,r,s)},[r,s]),[s,i]},ke=(t,e)=>{const[,o]=j(""),[r]=j(()=>({args:e,report:!1})),s=X(),i=()=>{if(r.report||(r.report=!e.every((m,p)=>m===r.args[p])),!r.report)return;const a={},{message:u,report:c=r.report,...l}=t();l.customError=l.customError??!!u;let f=`${u}`;for(const m in s.validity)a[m]=l?.[m]??!1,f+=`${m}:${a[m]}`;s.setValidity(a,u),u&&c&&(s.form||s).reportValidity(),a.message=s.validationMessage,o(f)};return qe(a=>{r.report=!0,i(),s.validity.valid||a.preventDefault()}),K(i,e),[s.validationMessage,s.validity]},qe=(t,e)=>{const o=X(),r=U(o.form);Be(r,"submit",t,e)},le=$e(xe),He={checked:1,value:1,selected:1},Ye={list:1,type:1,size:1,form:1,width:1,height:1,src:1,href:1,slot:1},We={shadowDom:1,staticNode:1,cloneNode:1,children:1,key:1},z={},oe=[],Ge=0,Y=1,Q=2;class se extends Text{}const Je=M("id"),V=M("ref"),Ke=()=>{},Se=(t,e,...o)=>{const r=e||z;let{children:s}=r;return s=s??(o.length?o:oe),t===Ke?s:!t.prototype&&t instanceof Function?t(s!=oe?{children:s,...r}:r):{type:t,props:r,key:r.key}};function Te(t,e,o=Je,r,s){let i;const a=!s;s=a?[]:s;const u=e&&e[o];if(u&&u.vnode==t)return e;const{type:c,props:l=z}=t;r=r||t.type=="svg";const f=c instanceof Node?Y:c.prototype instanceof HTMLElement?Q:Ge;i=c!="host"&&(f==Y?(e&&l.cloneNode?e[V]:e)!=c:f==Q?!(e instanceof c):e?e[V]||e.localName!=c:!e),i&&(f==Y&&l.cloneNode?(e=c.cloneNode(!0),e[V]=c):e=f==Y?c:f==Q?new c:r?document.createElementNS("http://www.w3.org/2000/svg",c):document.createElement(c,l.is?{is:l.is}:void 0));const m=u||z,{vnode:p=z,cycle:b=0}=m;let{fragment:g,handlers:F={}}=i?{}:m;const{props:C=z}=i?z:p,{children:$=oe}=C;if(l.staticNode&&!i)return e;if(l.shadowDom&&!e.shadowRoot&&e.attachShadow({mode:"open",...l.shadowDom}),l!=C&&Qe(e,C,l,F,r,s),l.children!==$){const w=l.shadowDom?e.shadowRoot:e;g=Ze(l.children,g,w,o,r&&t.type=="foreignObject"?!1:r,s)}if(e[o]={vnode:t,handlers:F,fragment:g,cycle:b+1},a)for(let w=0;w<s.length;w++)s[w]();return e}function Xe(t){const e=new se(""),o=new se("");return t.append(e,o),{markStart:e,markEnd:o}}function Ze(t,e,o,r,s,i){t=t==null?null:pe(t)?t:[t];const a=e||Xe(o),{markStart:u,markEnd:c,keyes:l}=a;let f;const m=l&&new Set,p=l&&"moveBefore"in o;let b=u;if(t&&fe(t,g=>{const F=typeof g,C=F==="string";if(!(F=="object"&&"type"in g&&"props"in g)&&!C)return;const w=g.key,q=l&&w!=null&&l.get(w);b!=c&&b===q?m.delete(b):b=b==c?c:b.nextSibling;const P=l?q:b;let x=P;if(C){const N=g+"";!(x instanceof Text)||x instanceof se?x=new Text(N):x.data!=N&&(x.data=N)}else x=Te(g,P,r,s,i);if(x!=b){l&&m.delete(x);const N=p&&(x||P).isConnected?"moveBefore":"insertBefore";!P||l?(o[N](x,b),l&&b!=c&&m.add(b)):P==c?o[N](x,c):(o.replaceChild(x,P),b=x)}w!=null&&(f=f||new Map,f.set(w,x))},!l),b=b==c?c:b.nextSibling,e&&b!=c)for(;b!=c;){const g=b;b=b.nextSibling,g.remove()}return m&&m.forEach(g=>g.remove()),a.keyes=f,a}function Qe(t,e,o,r,s,i){for(const a in e)a in o||de(t,a,e[a],null,r,s,i);for(const a in o)de(t,a,e[a],o[a],r,s,i)}function de(t,e,o,r,s,i,a){if(e=e=="class"&&!i?"className":e,o=o??null,r=r??null,e in t&&He[e]&&(o=t[e]),r===o||We[e]||e[0]=="_")return;if(t.localName==="slot"&&e==="assignNode"&&"assign"in t){a.push(()=>t.assign(r));return}const u=L(o),c=L(r);if(e.startsWith("on")&&(c||u)){Ve(t,e.slice(2),r,s);return}if(e==="ref"){r&&(c?a.push(()=>r(t)):r.current=t);return}if(e==="style"&&"style"in t){const{style:m}=t,p=o&&I(o),b=r&&I(r);if(p&&b){for(const g in o)g in r||ee(m,g,null);for(const g in r)o[g]!==r[g]&&ee(m,g,r[g])}else if(b)for(const g in r)ee(m,g,r[g]);else m.cssText=r||"";return}const l=e.startsWith("$")?e.slice(1):e;l===e&&(!i&&!Ye[e]&&e in t||c||u)?t[e]=r??"":r==null?t.removeAttribute(l):t.setAttribute(l,I(r)?JSON.stringify(r):r)}function Ve(t,e,o,r){if(!r)return;r.handleEvent||(r.handleEvent=function(i){const a=r[i.type];if(L(a))return a.call(t,i)});const s=!!r[e];if(o){const a=o.capture||o.once||o.passive?{capture:!!o.capture,once:!!o.once,passive:!!o.passive}:void 0;s||t.addEventListener(e,r.handleEvent,a),r[e]=o}else s&&(t.removeEventListener(e,r.handleEvent),delete r[e])}function ee(t,e,o){if(e[0]==="-"){o==null?t.removeProperty(e):t.setProperty(e,o);return}t[e]=o}class Ee{constructor(e,o,r){this.message=o,this.target=e,this.value=r}}class De extends Ee{}class et extends Ee{}const tt=null,rt={true:1,"":1,1:1};function ot(t,e,o,r,s){const{type:i,reflect:a,value:u,attr:c=nt(e)}=I(o)&&o!=tt?o:{type:o};Object.defineProperty(t,e,{configurable:!0,set(l){const f=this[e];u&&l==null&&(l=u.call({self:this,prop:e}));const{error:m,value:p}=lt(i,l);if(m&&p!=null)throw new De(this,`The value defined for prop '${e}' must be of type '${i.name}'`,p);f!=p&&(this._props[e]=p??void 0,this.update(),this.updated.then(()=>{a&&(this._ignoreAttr=c,it(this,i,c,this[e]),this._ignoreAttr=null)}))},get(){return this._props[e]}}),u&&(s[e]=null),r[c]={prop:e,type:i}}const st=(t,{type:e,base:o=CustomEvent,...r})=>t.dispatchEvent(new o(e,r)),nt=t=>t.replace(/([A-Z])/g,"-$1").toLowerCase(),it=(t,e,o,r)=>r==null||e==Boolean&&!r?t.removeAttribute(o):t.setAttribute(o,I(r)?JSON.stringify(r):e==Boolean?"":r.toString()),at=(t,e)=>t==Boolean?!!rt[e]:t==Number?Number(e):t==String?e:t==Array||t==Object?JSON.parse(e):new t(e),lt=(t,e)=>t==null||e==null?{value:e,error:!1}:t!=String&&e===""?{value:void 0,error:!1}:t==Object||t==Array||t==Symbol?{value:e,error:{}.toString.call(e)!==`[object ${t.name}]`}:e instanceof t?{value:e,error:t==Number&&Number.isNaN(e.valueOf())}:t==String||t==Number||t==Boolean?{value:e,error:t==Number?typeof e!="number"||Number.isNaN(e):t==String?typeof e!="string":typeof e!="boolean"}:{value:e,error:!0};let ct=0;const T=(t,e)=>{const o={},r={},{props:s,styles:i,form:a}={props:{},...e};class u extends HTMLElement{static formAssociated=a;constructor(){super(),this._setup(),this._render=()=>t({...this._props});for(const l in r)this[l]=r[l]}async _setup(){this._props=this._props||{},this.symbolId=this.symbolId||Symbol(),this._hooks=this._hooks||je(()=>this.update(),this,"c"+ct++);let l=new Promise(p=>this._mount=p),f,m=!0;this.update=()=>{if(f)return;f=!0;const p=this._hooks;this.updated=l.then(()=>{try{const b=p.render(this._render);p.dispatch(ye),b&&Te(b,this,this.symbolId),f=!1,m&&!p.isSuspense()&&(m=!1,dt(this)),p.dispatch(ve)}finally{f=!1}}).then(()=>{p.dispatch(ge)})},this.update()}connectedCallback(){this._unmount=()=>{(!this.isConnected||this.lastParentNode!=this.parentNode)&&this._hooks.dispatch(me),this.parentNode||(this.lastParentNode=this.parentNode)},this.lastParentNode!=this.parentNode&&(this._mount(),this.update()),this.lastParentNode=this.parentNode}disconnectedCallback(){this._unmount()}attributeChangedCallback(l,f,m){if(o[l]){if(l===this._ignoreAttr||f===m)return;const{prop:p,type:b}=o[l];try{this[p]=at(b,m)}catch{throw new et(this,`The value defined as attr '${l}' cannot be parsed by type '${b.name}'`,m)}}}static get observedAttributes(){for(const l in s)ot(this.prototype,l,s[l],o,r);return Object.keys(o)}static get styles(){return[i]}static get props(){return s}async formResetCallback(){await this.updated,this._hooks.dispatch(xe)}async formAssociatedCallback(l){await this.updated,this._hooks.dispatch(Me,l)}async formDisabledCallback(l){await this.updated,this._hooks.dispatch(Re,l)}}return u};function dt(t){const{styles:e}=t.constructor,{shadowRoot:o}=t;if(o&&e.length){const r=[];fe(e,s=>r.push(s)),r.length&&(o.adoptedStyleSheets=r)}}const _=(t,e={})=>{const o=J();return o[t]||(o[t]=(r=e.detail)=>{t in o.current?o.current[t](r):st(o.current,{type:t,...e,detail:r})}),o[t]};new Promise(t=>{document.readyState==="loading"?ne(document,"DOMContentLoaded",t):t()});const ut=Se("host",{style:"display: contents"}),Ce="value",ht="ChangedValue",pt="ConnectContext",ft=(t,e)=>{const o=J(),r=_(ht);ce(()=>{r()},[e]),ce(()=>ne(o.current,pt,s=>{s.composedPath().at(0)!==s.currentTarget&&t===s.detail.id&&(s.stopPropagation(),s.detail.connect(o.current))}),[t]),o.current[Ce]=e},mt=t=>{const e=T(({value:o})=>(ft(e,o),ut),{props:{value:{type:Object,value:()=>t}}});return e[Ce]=t,e},bt={};function D(t,...e){const o=(t.raw||t).reduce((r,s,i)=>r+s+(e[i]||""),"");return bt[o]||=gt(o)}function gt(t){const e=new CSSStyleSheet;return e.replaceSync(t),e}mt({dispatch(t,e){}});const Pe=t=>{const e=be();return R((o=ie(t,e,(r,s)=>{let i=!1;for(const a in s)if(r[a]!==s[a]){i=!0;break}return i?{...r,...s}:r}))=>o)},n=(t,e,o)=>(e==null?e={key:o}:e.key=o,Se(t,e)),d=n,W=T(({label:t})=>n("host",{shadowDom:!0,children:n("span",{children:t})}),{props:{label:{type:String,value:()=>""},variant:{type:String,value:()=>"info",reflect:!0}},styles:D`
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.25rem 0.625rem;
                font-size: 0.75rem;
                font-weight: 600;
                border-radius: 9999px;
                line-height: 1;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            :host([variant="info"]) {
                background-color: rgba(59, 130, 246, 0.15);
                color: #60a5fa;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
            :host([variant="success"]) {
                background-color: rgba(16, 185, 129, 0.15);
                color: #34d399;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            :host([variant="warning"]) {
                background-color: rgba(245, 158, 11, 0.15);
                color: #fbbf24;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }
            :host([variant="danger"]) {
                background-color: rgba(239, 68, 68, 0.15);
                color: #f87171;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            :host([variant="neutral"]) {
                background-color: rgba(255, 255, 255, 0.05);
                color: var(--theme-text-muted, #94a3b8);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        `}),B=T(()=>{const t=X(),[e]=y("type"),[o]=y("disabled");return n("host",{shadowDom:!0,onclick:s=>{if(o){s.preventDefault(),s.stopPropagation();return}e==="submit"&&t.form&&t.form.requestSubmit()},children:n("button",{class:"btn",disabled:o,type:e==="submit"?"submit":"button",children:n("slot",{})})})},{form:!0,props:{variant:{type:String,value:()=>"primary",reflect:!0},type:{type:String,value:()=>"button"},disabled:{type:Boolean,value:()=>!1,reflect:!0}},styles:D`
            :host {
                display: inline-block;
                cursor: pointer;
                --btn-radius: 10px;
                --btn-padding: 0.75rem 1.5rem;
                --btn-font-size: 0.875rem;
                --btn-font-weight: 600;
            }
            :host([disabled]) {
                cursor: not-allowed;
                pointer-events: none;
            }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                padding: var(--btn-padding);
                font-family: inherit;
                font-size: var(--btn-font-size);
                font-weight: var(--btn-font-weight);
                border-radius: var(--btn-radius);
                border: 1px solid var(--btn-border-color, transparent);
                background-color: var(--btn-bg, var(--theme-primary, #6366f1));
                color: var(--btn-color, var(--theme-text-main, #f8fafc));
                outline: none;
                cursor: inherit;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px -2px var(--btn-shadow, rgba(99, 102, 241, 0.3));
            }
            .btn:hover {
                background-color: var(--btn-hover-bg, var(--theme-primary-hover, #4f46e5));
                transform: translateY(-1px);
                box-shadow: 0 6px 16px -2px var(--btn-shadow, rgba(99, 102, 241, 0.4));
            }
            .btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 6px -1px var(--btn-shadow, rgba(99, 102, 241, 0.2));
            }
            .btn:focus-visible {
                ring: 2px solid var(--btn-ring, rgba(255, 255, 255, 0.2));
                outline: 2px solid transparent;
                outline-offset: 2px;
            }
            
            :host([variant="primary"]) {
                --btn-bg: var(--theme-primary, #6366f1);
                --btn-hover-bg: var(--theme-primary-hover, #4f46e5);
                --btn-color: var(--theme-text-main, #f8fafc);
                --btn-shadow: rgba(99, 102, 241, 0.3);
            }
            :host([variant="secondary"]) {
                --btn-bg: rgba(255, 255, 255, 0.05);
                --btn-hover-bg: rgba(255, 255, 255, 0.1);
                --btn-color: var(--theme-text-main, #f8fafc);
                --btn-border-color: rgba(255, 255, 255, 0.1);
                --btn-shadow: rgba(0, 0, 0, 0);
            }
            :host([variant="danger"]) {
                --btn-bg: #ef4444;
                --btn-hover-bg: #dc2626;
                --btn-color: #ffffff;
                --btn-shadow: rgba(239, 68, 68, 0.3);
            }
            :host([variant="success"]) {
                --btn-bg: #10b981;
                --btn-hover-bg: #059669;
                --btn-color: #ffffff;
                --btn-shadow: rgba(16, 185, 129, 0.3);
            }
            :host([disabled]) .btn {
                background-color: rgba(255, 255, 255, 0.02);
                color: var(--theme-text-muted, #94a3b8);
                border-color: rgba(255, 255, 255, 0.05);
                box-shadow: none;
                transform: none;
                opacity: 0.5;
            }
        `}),Ne=T(()=>{const[t,e]=y("checked"),[o]=y("disabled"),r=_("change",{bubbles:!0});return n("host",{shadowDom:!0,onclick:i=>{if(o)return;const a=!t;e(a),r(a)},children:d("div",{class:"checkbox-wrapper",children:[n("div",{class:"box",children:n("svg",{class:"check-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round",children:n("polyline",{points:"20 6 9 17 4 12"})})}),n("span",{class:"label",children:n("slot",{})})]})})},{props:{checked:{type:Boolean,value:()=>!1,reflect:!0},disabled:{type:Boolean,value:()=>!1,reflect:!0}},styles:D`
            :host {
                display: inline-block;
                cursor: pointer;
                user-select: none;
            }
            :host([disabled]) {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid var(--theme-input-border, rgba(255, 255, 255, 0.2));
                border-radius: 6px;
                background-color: var(--theme-input-bg, rgba(15, 23, 42, 0.4));
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .check-icon {
                width: 0.875rem;
                height: 0.875rem;
                color: #ffffff;
                transform: scale(0);
                transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            :host([checked]) .box {
                background-color: var(--theme-primary, #6366f1);
                border-color: var(--theme-primary, #6366f1);
                box-shadow: 0 0 12px var(--theme-primary-shadow, rgba(99, 102, 241, 0.3));
            }
            :host([checked]) .check-icon {
                transform: scale(1);
            }
            :host(:hover:not([disabled])) .box {
                border-color: var(--theme-primary, #6366f1);
            }
            .label {
                font-size: 0.875rem;
                color: var(--theme-text-main, #f8fafc);
            }
        `}),Oe=({validity:t,validationMessage:e})=>{const o={message:e};for(const r in t)o[r]=t[r];return o},G=T(()=>{const[t="",e]=we(),[o]=y("placeholder"),[r="text"]=y("type"),[s]=y("label"),[i]=y("required"),a=U(),[,u]=ke(()=>a.current?Oe(a.current):{},[t]);return le(()=>{e("")}),n("host",{shadowDom:{delegatesFocus:!0},children:d("div",{class:"input-container",children:[(s||i)&&d("label",{class:"label",children:[s,i&&n("span",{class:"required-asterisk",children:"*"}),!u.valid&&n("span",{class:"validation-dot",children:"●"})]}),n("input",{ref:a,class:"input-field",type:r,value:t,placeholder:o,required:i,oninput:c=>{e(c.currentTarget.value)}})]})})},{form:!0,props:{name:String,value:String,placeholder:{type:String,value:()=>""},type:{type:String,value:()=>"text"},label:{type:String,value:()=>""},required:{type:Boolean,value:()=>!1,reflect:!0}},styles:D`
            :host {
                display: block;
                width: 100%;
                --input-bg: var(--theme-input-bg, rgba(15, 23, 42, 0.4));
                --input-border: var(--theme-input-border, rgba(255, 255, 255, 0.1));
                --input-border-focus: var(--theme-primary, #6366f1);
                --input-text: var(--theme-text-main, #f8fafc);
                --input-placeholder: var(--theme-text-muted, #94a3b8);
                --input-shadow-focus: rgba(99, 102, 241, 0.2);
            }
            .input-container {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;
            }
            .label {
                font-size: 0.8125rem;
                font-weight: 600;
                color: var(--theme-text-muted, #94a3b8);
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            .required-asterisk {
                color: var(--theme-primary, #6366f1);
                font-weight: 700;
            }
            .validation-dot {
                color: #ef4444;
                font-size: 0.625rem;
            }
            .input-field {
                font-family: inherit;
                font-size: 0.875rem;
                padding: 0.75rem 1rem;
                border: 1px solid var(--input-border);
                border-radius: 10px;
                background-color: var(--input-bg);
                color: var(--input-text);
                outline: none;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.3);
                width: 100%;
                box-sizing: border-box;
            }
            .input-field:focus {
                border-color: var(--input-border-focus);
                box-shadow: 0 0 0 3px var(--input-shadow-focus);
                background-color: var(--theme-input-bg-focus, rgba(15, 23, 42, 0.6));
            }
            .input-field::placeholder {
                color: var(--input-placeholder);
                opacity: 0.7;
            }
            :host([required]) .input-field {
                border-left-width: 3px;
                border-left-color: var(--theme-primary, #6366f1);
            }
        `}),O=T(()=>{const[t="",e]=we(),[o]=y("options"),[r]=y("label"),[s]=y("required"),i=U(),[,a]=ke(()=>i.current?Oe(i.current):{},[t]);return le(()=>{e("")}),n("host",{shadowDom:{delegatesFocus:!0},children:d("div",{class:"select-container",children:[(r||s)&&d("label",{class:"label",children:[r,s&&n("span",{class:"required-asterisk",children:"*"}),!a.valid&&n("span",{class:"validation-dot",children:"●"})]}),d("div",{class:"select-wrapper",children:[n("select",{ref:i,class:"select-field",value:t,required:s,onchange:u=>{e(u.currentTarget.value)},children:o.map(u=>n("option",{value:u.value,children:u.label},u.value))}),n("svg",{class:"select-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:n("polyline",{points:"6 9 12 15 18 9"})})]})]})})},{form:!0,props:{name:String,value:String,options:{type:Array,value:()=>[]},label:{type:String,value:()=>""},required:{type:Boolean,value:()=>!1,reflect:!0}},styles:D`
            :host {
                display: block;
                width: 100%;
                --select-bg: var(--theme-input-bg, rgba(15, 23, 42, 0.4));
                --select-border: var(--theme-input-border, rgba(255, 255, 255, 0.1));
                --select-border-focus: var(--theme-primary, #6366f1);
                --select-text: var(--theme-text-main, #f8fafc);
                --select-shadow-focus: rgba(99, 102, 241, 0.2);
            }
            .select-container {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;
            }
            .label {
                font-size: 0.8125rem;
                font-weight: 600;
                color: var(--theme-text-muted, #94a3b8);
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            .required-asterisk {
                color: var(--theme-primary, #6366f1);
                font-weight: 700;
            }
            .validation-dot {
                color: #ef4444;
                font-size: 0.625rem;
            }
            .select-wrapper {
                position: relative;
                width: 100%;
            }
            .select-field {
                font-family: inherit;
                font-size: 0.875rem;
                padding: 0.75rem 2.5rem 0.75rem 1rem;
                border: 1px solid var(--select-border);
                border-radius: 10px;
                background-color: var(--select-bg);
                color: var(--select-text);
                outline: none;
                width: 100%;
                appearance: none;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.3);
                box-sizing: border-box;
            }
            .select-field:focus {
                border-color: var(--select-border-focus);
                box-shadow: 0 0 0 3px var(--select-shadow-focus);
                background-color: var(--theme-input-bg-focus, rgba(15, 23, 42, 0.6));
            }
            .select-field option {
                background-color: #0f172a;
                color: #f8fafc;
            }
            .select-icon {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1rem;
                height: 1rem;
                color: var(--theme-text-muted, #94a3b8);
                pointer-events: none;
                transition: transform 0.25s ease, color 0.25s ease;
            }
            .select-field:focus + .select-icon {
                color: var(--theme-primary, #6366f1);
                transform: translateY(-50%) rotate(180deg);
            }
            :host([required]) .select-field {
                border-left-width: 3px;
                border-left-color: var(--theme-primary, #6366f1);
            }
        `}),Ae=T(()=>{const[t]=y("total"),[e]=y("completed"),[o]=y("inProgress"),[r]=y("pending"),s=t>0?Math.round(e/t*100):0,i=36,a=2*Math.PI*i,u=a-s/100*a;return n("host",{shadowDom:!0,children:d("div",{class:"stats-grid",children:[d("div",{class:"card progress-card",children:[d("div",{class:"progress-info",children:[n("h3",{children:"Productivity"}),n("p",{class:"subtitle",children:"Your daily goal progression"}),d("div",{class:"stats-summary",children:[n("span",{class:"highlight",children:e})," of ",n("span",{class:"total",children:t})," tasks completed"]})]}),d("div",{class:"radial-container",children:[d("svg",{class:"radial-svg",viewBox:"0 0 100 100",children:[n("circle",{class:"radial-bg",cx:"50",cy:"50",r:i}),n("circle",{class:"radial-bar",cx:"50",cy:"50",r:i,style:`stroke-dasharray: ${a}; stroke-dashoffset: ${u}`})]}),n("div",{class:"radial-text",children:d("span",{class:"percentage",children:[s,"%"]})})]})]}),d("div",{class:"detail-cards",children:[d("div",{class:"card mini-card pending",children:[n("span",{class:"dot"}),d("div",{class:"card-content",children:[n("span",{class:"label",children:"Pending"}),n("span",{class:"value",children:r})]})]}),d("div",{class:"card mini-card progress",children:[n("span",{class:"dot"}),d("div",{class:"card-content",children:[n("span",{class:"label",children:"In Progress"}),n("span",{class:"value",children:o})]})]}),d("div",{class:"card mini-card completed",children:[n("span",{class:"dot"}),d("div",{class:"card-content",children:[n("span",{class:"label",children:"Completed"}),n("span",{class:"value",children:e})]})]})]})]})})},{props:{total:{type:Number,value:()=>0},completed:{type:Number,value:()=>0},inProgress:{type:Number,value:()=>0},pending:{type:Number,value:()=>0}},styles:D`
            :host {
                display: block;
                width: 100%;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 1.25rem;
                width: 100%;
            }
            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
            .card {
                background: var(--theme-bg-card, rgba(30, 41, 59, 0.4));
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: var(--theme-shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.5));
                border: 1px solid var(--theme-border-color, rgba(255, 255, 255, 0.08));
                backdrop-filter: var(--theme-glass-blur, blur(12px));
                display: flex;
                position: relative;
                overflow: hidden;
            }
            .progress-card {
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, var(--theme-bg-card, rgba(30, 41, 59, 0.4)) 0%, rgba(30, 41, 59, 0.2) 100%);
            }
            .progress-info {
                display: flex;
                flex-direction: column;
            }
            h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--theme-text-main, #f8fafc);
            }
            .subtitle {
                margin: 0.25rem 0 1rem 0;
                font-size: 0.8125rem;
                color: var(--theme-text-muted, #94a3b8);
            }
            .stats-summary {
                font-size: 0.875rem;
                color: var(--theme-text-muted, #94a3b8);
            }
            .stats-summary .highlight {
                font-weight: 700;
                color: var(--theme-primary, #6366f1);
            }
            .stats-summary .total {
                font-weight: 600;
                color: var(--theme-text-main, #f8fafc);
            }
            .radial-container {
                position: relative;
                width: 90px;
                height: 90px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .radial-svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            .radial-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.05);
                stroke-width: 8;
            }
            .radial-bar {
                fill: none;
                stroke: var(--theme-primary, #6366f1);
                stroke-width: 8;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .radial-text {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .percentage {
                font-size: 1.125rem;
                font-weight: 700;
                color: var(--theme-text-main, #f8fafc);
            }
            .detail-cards {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .mini-card {
                padding: 0.875rem 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .mini-card.pending .dot {
                background-color: #f59e0b;
                box-shadow: 0 0 8px #f59e0b;
            }
            .mini-card.progress .dot {
                background-color: #3b82f6;
                box-shadow: 0 0 8px #3b82f6;
            }
            .mini-card.completed .dot {
                background-color: #10b981;
                box-shadow: 0 0 8px #10b981;
            }
            .card-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            .label {
                font-size: 0.8125rem;
                font-weight: 500;
                color: var(--theme-text-muted, #94a3b8);
            }
            .value {
                font-size: 1.125rem;
                font-weight: 700;
                color: var(--theme-text-main, #f8fafc);
            }
        `}),Fe=T(({task:t})=>{const e=_("toggle-status",{bubbles:!0}),o=_("delete-task",{bubbles:!0}),r=_("edit-task",{bubbles:!0}),s=t,i=s.priority==="High"?"danger":s.priority==="Medium"?"warning":"info",a=s.status==="Completed"?"success":s.status==="In Progress"?"info":"neutral",u=s.status!=="Completed"&&s.dueDate&&new Date(s.dueDate)<new Date(new Date().setHours(0,0,0,0)),c=f=>{e({id:s.id,completed:f.detail})},l=()=>{s.status==="Pending"?e({id:s.id,completed:!1}):s.status==="In Progress"?e({id:s.id,completed:!0}):e({id:s.id,completed:!1})};return n("host",{shadowDom:!0,children:d("div",{class:`task-card ${s.status==="Completed"?"completed":""}`,children:[d("div",{class:"card-header",children:[d("div",{class:"tags",children:[n(W,{label:s.category,variant:"neutral"}),n(W,{label:s.priority,variant:i})]}),d("div",{class:"actions",children:[n("button",{class:"action-btn edit",onclick:()=>r(s),title:"Edit Task",children:d("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:[n("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),n("path",{d:"M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),n("button",{class:"action-btn delete",onclick:()=>o(s.id),title:"Delete Task",children:d("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:[n("polyline",{points:"3 6 5 6 21 6"}),n("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]})})]})]}),d("div",{class:"card-body",children:[n("div",{class:"checkbox-container",children:n(Ne,{checked:s.status==="Completed",onchange:c})}),d("div",{class:"content",children:[n("h4",{class:"title",children:s.title}),s.description&&n("p",{class:"description",children:s.description})]})]}),d("div",{class:"card-footer",children:[d("div",{class:`due-date ${u?"overdue":""}`,children:[d("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:[n("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),n("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),n("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),n("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]}),n("span",{children:s.dueDate?s.dueDate:"No due date"})]}),n("div",{class:"status-selector",onclick:l,children:n(W,{label:s.status,variant:a})})]})]})})},{props:{task:{type:Object,value:()=>({})}},styles:D`
            :host {
                display: block;
                width: 100%;
            }
            .task-card {
                background: var(--theme-bg-card, rgba(30, 41, 59, 0.4));
                border-radius: 14px;
                padding: 1.25rem;
                box-shadow: var(--theme-shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.5));
                border: 1px solid var(--theme-border-color, rgba(255, 255, 255, 0.08));
                backdrop-filter: var(--theme-glass-blur, blur(12px));
                display: flex;
                flex-direction: column;
                gap: 0.875rem;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            .task-card:hover {
                transform: translateY(-2px);
                border-color: var(--theme-primary, #6366f1);
                box-shadow: 0 12px 28px -8px rgba(99, 102, 241, 0.25);
            }
            .task-card.completed {
                background-color: rgba(30, 41, 59, 0.2);
                border-color: rgba(255, 255, 255, 0.03);
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .tags {
                display: flex;
                gap: 0.375rem;
            }
            .actions {
                display: flex;
                gap: 0.25rem;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            .task-card:hover .actions {
                opacity: 1;
            }
            .action-btn {
                background: none;
                border: none;
                padding: 0.375rem;
                border-radius: 6px;
                color: var(--theme-text-muted, #94a3b8);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .action-btn svg {
                width: 0.875rem;
                height: 0.875rem;
            }
            .action-btn.edit:hover {
                background-color: rgba(99, 102, 241, 0.15);
                color: #818cf8;
            }
            .action-btn.delete:hover {
                background-color: rgba(239, 68, 68, 0.15);
                color: #f87171;
            }
            .card-body {
                display: flex;
                gap: 0.75rem;
                align-items: flex-start;
            }
            .checkbox-container {
                padding-top: 0.125rem;
                flex-shrink: 0;
            }
            .content {
                display: flex;
                flex-direction: column;
                gap: 0.375rem;
                flex-grow: 1;
            }
            .title {
                margin: 0;
                font-size: 0.9375rem;
                font-weight: 600;
                color: var(--theme-text-main, #f8fafc);
                transition: all 0.2s ease;
                line-height: 1.4;
            }
            .completed .title {
                text-decoration: line-through;
                color: var(--theme-text-muted, #94a3b8);
                opacity: 0.6;
            }
            .description {
                margin: 0;
                font-size: 0.8125rem;
                color: var(--theme-text-muted, #94a3b8);
                line-height: 1.5;
            }
            .completed .description {
                color: var(--theme-text-muted, #94a3b8);
                opacity: 0.5;
            }
            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px dashed rgba(255, 255, 255, 0.08);
                padding-top: 0.75rem;
                margin-top: 0.25rem;
            }
            .due-date {
                display: flex;
                align-items: center;
                gap: 0.375rem;
                font-size: 0.75rem;
                color: var(--theme-text-muted, #94a3b8);
            }
            .due-date svg {
                width: 0.875rem;
                height: 0.875rem;
            }
            .due-date.overdue {
                color: #ef4444;
                font-weight: 600;
            }
            .status-selector {
                cursor: pointer;
            }
            .status-selector:hover {
                transform: scale(1.05);
            }
        `}),_e=T(({task:t,active:e})=>{const o=_("submit-task",{bubbles:!0}),r=_("close",{bubbles:!0}),s=t,[i,a]=Pe({title:"",description:"",category:"Personal",priority:"Low",dueDate:"",status:"Pending"});K(()=>{s&&s.id?a({title:s.title||"",description:s.description||"",category:s.category||"Personal",priority:s.priority||"Low",dueDate:s.dueDate||"",status:s.status||"Pending"}):a({title:"",description:"",category:"Personal",priority:"Low",dueDate:"",status:"Pending"})},[s]);const u=p=>{p.preventDefault(),i.title.trim()&&o({id:s?.id,title:i.title,description:i.description,category:i.category,priority:i.priority,dueDate:i.dueDate,status:i.status})},c=[{value:"Work",label:"Work"},{value:"Personal",label:"Personal"},{value:"Shopping",label:"Shopping"},{value:"Urgent",label:"Urgent"}],l=[{value:"High",label:"High"},{value:"Medium",label:"Medium"},{value:"Low",label:"Low"}],f=[{value:"Pending",label:"Pending"},{value:"In Progress",label:"In Progress"},{value:"Completed",label:"Completed"}],m=s&&s.id;return d("host",{shadowDom:!0,children:[n("div",{class:"backdrop",onclick:()=>r()}),d("div",{class:"modal",children:[d("div",{class:"modal-header",children:[n("h2",{children:m?"Edit Task":"Create New Task"}),n("button",{class:"close-btn",onclick:()=>r(),children:d("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:[n("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),n("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),d("form",{onsubmit:u,class:"form-body",children:[n(G,{label:"Task Title",placeholder:"Enter task name...",value:i.title,required:!0,oninput:p=>a({title:p.currentTarget.value})}),d("div",{class:"form-field",children:[n("label",{class:"field-label",children:"Description"}),n("textarea",{class:"textarea-field",placeholder:"Add some notes about this task...",value:i.description,oninput:p=>a({description:p.currentTarget.value})})]}),d("div",{class:"form-row",children:[n(O,{label:"Category",value:i.category,options:c,onchange:p=>a({category:p.currentTarget.value})}),n(O,{label:"Priority",value:i.priority,options:l,onchange:p=>a({priority:p.currentTarget.value})})]}),d("div",{class:"form-row",children:[n(G,{label:"Due Date",type:"date",value:i.dueDate,oninput:p=>a({dueDate:p.currentTarget.value})}),m&&n(O,{label:"Status",value:i.status,options:f,onchange:p=>a({status:p.currentTarget.value})})]}),d("div",{class:"form-actions",children:[n(B,{type:"button",variant:"secondary",onclick:()=>r(),children:"Cancel"}),n(B,{type:"submit",variant:"primary",children:m?"Save Changes":"Create Task"})]})]})]})]})},{props:{task:{type:Object,value:()=>({})},active:{type:Boolean,value:()=>!1,reflect:!0}},styles:D`
            :host {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
            }
            :host([active]) {
                display: flex;
            }
            .backdrop {
                position: absolute;
                inset: 0;
                background-color: rgba(9, 9, 11, 0.6);
                backdrop-filter: blur(8px);
                transition: all 0.3s ease;
            }
            .modal {
                position: relative;
                width: 100%;
                max-width: 520px;
                background: var(--theme-bg-card, rgba(30, 41, 59, 0.4));
                border-radius: 20px;
                box-shadow: var(--theme-shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.5));
                border: 1px solid var(--theme-border-color, rgba(255, 255, 255, 0.08));
                backdrop-filter: var(--theme-glass-blur, blur(12px));
                display: flex;
                flex-direction: column;
                z-index: 101;
                animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem 1.5rem;
                border-bottom: 1px solid var(--theme-border-color, rgba(255, 255, 255, 0.08));
            }
            h2 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--theme-text-main, #f8fafc);
            }
            .close-btn {
                background: none;
                border: none;
                padding: 0.375rem;
                border-radius: 50%;
                color: var(--theme-text-muted, #94a3b8);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .close-btn:hover {
                background-color: rgba(255, 255, 255, 0.05);
                color: var(--theme-text-main, #f8fafc);
            }
            .close-btn svg {
                width: 1.25rem;
                height: 1.25rem;
            }
            .form-body {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }
            .form-field {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .field-label {
                font-size: 0.8125rem;
                font-weight: 600;
                color: var(--theme-text-muted, #94a3b8);
            }
            .textarea-field {
                font-family: inherit;
                font-size: 0.875rem;
                padding: 0.75rem 1rem;
                border: 1px solid var(--theme-input-border, rgba(255, 255, 255, 0.1));
                border-radius: 10px;
                background-color: var(--theme-input-bg, rgba(15, 23, 42, 0.4));
                color: var(--theme-text-main, #f8fafc);
                outline: none;
                min-height: 100px;
                resize: vertical;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.3);
                box-sizing: border-box;
            }
            .textarea-field:focus {
                border-color: var(--theme-primary, #6366f1);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
                background-color: var(--theme-input-bg-focus, rgba(15, 23, 42, 0.6));
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            @media (max-width: 480px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
            }
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
                margin-top: 0.5rem;
            }
        `}),ue=[{id:"1",title:"Build elegant Atomico.js application",description:"Develop a highly polished, fully functional Task Management Dashboard with Custom Elements.",category:"Work",priority:"High",dueDate:new Date().toISOString().split("T")[0],status:"In Progress"},{id:"2",title:"Review Design System tokens",description:"Check CSS custom property scopes, color palettes, and component responsiveness.",category:"Work",priority:"Medium",dueDate:new Date(Date.now()+864e5).toISOString().split("T")[0],status:"Pending"},{id:"3",title:"Weekly grocery list items",description:"Organic apples, almond milk, whole grain sourdough, and fresh greens.",category:"Shopping",priority:"Low",dueDate:new Date(Date.now()+1728e5).toISOString().split("T")[0],status:"Completed"}],vt=T(()=>{const[t,e]=j(()=>{try{const h=localStorage.getItem("atomico_tasks");return h?JSON.parse(h):ue}catch{return ue}}),[o,r]=Pe({searchQuery:"",statusFilter:"All",priorityFilter:"All",categoryFilter:"All",sortBy:"dueDateAsc"}),[s,i]=j(null),[a,u]=j(!1);K(()=>{localStorage.setItem("atomico_tasks",JSON.stringify(t))},[t]);const c=h=>{const v=h.detail;if(v.id)e(k=>k.map(S=>S.id===v.id?{...S,...v}:S));else{const k={...v,id:Date.now().toString(),status:"Pending"};e(S=>[k,...S])}u(!1),i(null)},l=h=>{const v=h.detail;e(k=>k.filter(S=>S.id!==v))},f=h=>{const{id:v,completed:k}=h.detail;e(S=>S.map(E=>{if(E.id!==v)return E;if(k)return{...E,status:"Completed"};{let H="Pending";return E.status==="Completed"?H="Pending":E.status==="Pending"?H="In Progress":E.status==="In Progress"&&(H="Completed"),{...E,status:H}}}))},m=h=>{i(h.detail),u(!0)},p=()=>{i(null),u(!0)},g=[...t.filter(h=>{const v=h.title.toLowerCase().includes(o.searchQuery.toLowerCase())||h.description.toLowerCase().includes(o.searchQuery.toLowerCase()),k=o.statusFilter==="All"||h.status===o.statusFilter,S=o.priorityFilter==="All"||h.priority===o.priorityFilter,E=o.categoryFilter==="All"||h.category===o.categoryFilter;return v&&k&&S&&E})].sort((h,v)=>{if(o.sortBy==="dueDateAsc")return h.dueDate?v.dueDate?new Date(h.dueDate).getTime()-new Date(v.dueDate).getTime():-1:1;if(o.sortBy==="dueDateDesc")return h.dueDate?v.dueDate?new Date(v.dueDate).getTime()-new Date(h.dueDate).getTime():-1:1;if(o.sortBy==="priority"){const k={High:3,Medium:2,Low:1};return k[v.priority]-k[h.priority]}return o.sortBy==="alphabetical"?h.title.localeCompare(v.title):0}),F=t.length,C=t.filter(h=>h.status==="Completed").length,$=t.filter(h=>h.status==="In Progress").length,w=t.filter(h=>h.status==="Pending").length,q=[{value:"All",label:"All Statuses"},{value:"Pending",label:"Pending"},{value:"In Progress",label:"In Progress"},{value:"Completed",label:"Completed"}],P=[{value:"All",label:"All Priorities"},{value:"High",label:"High"},{value:"Medium",label:"Medium"},{value:"Low",label:"Low"}],x=[{value:"All",label:"All Categories"},{value:"Work",label:"Work"},{value:"Personal",label:"Personal"},{value:"Shopping",label:"Shopping"},{value:"Urgent",label:"Urgent"}],N=[{value:"dueDateAsc",label:"Due Date (Oldest)"},{value:"dueDateDesc",label:"Due Date (Newest)"},{value:"priority",label:"Priority (High to Low)"},{value:"alphabetical",label:"Alphabetical"}];return n("host",{shadowDom:!0,children:d("div",{class:"dashboard-container",children:[d("header",{class:"dashboard-header",children:[d("div",{class:"header-left",children:[n("h1",{children:"Task Board"}),n("p",{class:"subtitle",children:"State-of-the-art productivity manager and planner"})]}),n("div",{class:"header-right",children:d(B,{variant:"primary",onclick:p,children:[d("svg",{class:"plus-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round","stroke-linejoin":"round",children:[n("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),n("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Add Task"]})})]}),n("section",{class:"stats-section",children:n(Ae,{total:F,completed:C,inProgress:$,pending:w})}),d("section",{class:"controls-section",children:[n("div",{class:"search-bar",children:n(G,{placeholder:"Search by title or description...",value:o.searchQuery,oninput:h=>r({searchQuery:h.currentTarget.value})})}),d("div",{class:"filters-grid",children:[n(O,{value:o.statusFilter,options:q,onchange:h=>r({statusFilter:h.currentTarget.value})}),n(O,{value:o.priorityFilter,options:P,onchange:h=>r({priorityFilter:h.currentTarget.value})}),n(O,{value:o.categoryFilter,options:x,onchange:h=>r({categoryFilter:h.currentTarget.value})}),n(O,{value:o.sortBy,options:N,onchange:h=>r({sortBy:h.currentTarget.value})})]})]}),n("section",{class:"tasks-section",children:g.length>0?n("div",{class:"tasks-grid",children:g.map(h=>n(Fe,{task:h,"ontoggle-status":f,"ondelete-task":l,"onedit-task":m},h.id))}):d("div",{class:"empty-state",children:[n("div",{class:"empty-illustration",children:d("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",children:[n("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),n("polyline",{points:"14 2 14 8 20 8"}),n("line",{x1:"9",y1:"15",x2:"15",y2:"15"}),n("line",{x1:"9",y1:"11",x2:"15",y2:"11"}),n("line",{x1:"9",y1:"19",x2:"15",y2:"19"})]})}),n("h4",{children:"No tasks found"}),n("p",{children:"Try clearing filters or create a new task to get started."}),n(B,{variant:"secondary",onclick:p,children:"Create a Task"})]})}),n(_e,{active:a,task:s||{},"onsubmit-task":c,onclose:()=>{u(!1),i(null)}})]})})},{styles:D`
            :host {
                display: block;
                width: 100%;
                max-width: 1140px;
                margin: 0 auto;
                padding: 2rem 1.5rem;
                box-sizing: border-box;

                /* Core design system tokens */
                --theme-primary: #6366f1;
                --theme-primary-hover: #4f46e5;
                --theme-primary-shadow: rgba(99, 102, 241, 0.3);
                --theme-bg-card: rgba(30, 41, 59, 0.45);
                --theme-border-color: rgba(255, 255, 255, 0.08);
                --theme-text-main: #f8fafc;
                --theme-text-muted: #94a3b8;
                --theme-input-bg: rgba(15, 23, 42, 0.4);
                --theme-input-bg-focus: rgba(15, 23, 42, 0.6);
                --theme-input-border: rgba(255, 255, 255, 0.1);
                --theme-shadow-premium: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
                --theme-glass-blur: blur(12px);
            }
            .dashboard-container {
                display: flex;
                flex-direction: column;
                gap: 1.75rem;
                width: 100%;
            }
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--theme-border-color, rgba(255, 255, 255, 0.08));
                padding-bottom: 1.25rem;
            }
            @media (max-width: 640px) {
                .dashboard-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                .header-right {
                    width: 100%;
                }
            }
            h1 {
                margin: 0;
                font-size: 2.25rem;
                font-weight: 800;
                color: var(--theme-text-main, #f8fafc);
                letter-spacing: -0.025em;
                background: linear-gradient(135deg, var(--theme-text-main, #f8fafc) 0%, var(--theme-primary, #6366f1) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                margin: 0.375rem 0 0 0;
                font-size: 0.9375rem;
                color: var(--theme-text-muted, #94a3b8);
            }
            .plus-icon {
                width: 1.125rem;
                height: 1.125rem;
                margin-right: 0.5rem;
            }
            .stats-section {
                width: 100%;
            }
            .controls-section {
                display: flex;
                flex-direction: column;
                gap: 0.875rem;
                background: var(--theme-bg-card, rgba(30, 41, 59, 0.45));
                padding: 1.25rem;
                border-radius: 16px;
                border: 1px solid var(--theme-border-color, rgba(255, 255, 255, 0.08));
                backdrop-filter: var(--theme-glass-blur, blur(12px));
                box-shadow: var(--theme-shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.5));
            }
            .filters-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.75rem;
            }
            @media (max-width: 768px) {
                .filters-grid {
                    grid-template-columns: 1fr 1fr;
                }
            }
            @media (max-width: 480px) {
                .filters-grid {
                    grid-template-columns: 1fr;
                }
            }
            .tasks-section {
                width: 100%;
            }
            .tasks-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 1.25rem;
            }
            @media (max-width: 480px) {
                .tasks-grid {
                    grid-template-columns: 1fr;
                }
            }
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 4rem 2rem;
                background: var(--theme-bg-card, rgba(30, 41, 59, 0.45));
                border-radius: 20px;
                border: 1px dashed var(--theme-border-color, rgba(255, 255, 255, 0.08));
                text-align: center;
                backdrop-filter: var(--theme-glass-blur, blur(12px));
                box-shadow: var(--theme-shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.5));
            }
            .empty-illustration {
                width: 4rem;
                height: 4rem;
                color: var(--theme-text-muted, #94a3b8);
                margin-bottom: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.02);
                border-radius: 50%;
                padding: 1rem;
            }
            .empty-illustration svg {
                width: 100%;
                height: 100%;
            }
            .empty-state h4 {
                margin: 0;
                font-size: 1.125rem;
                font-weight: 700;
                color: var(--theme-text-main, #f8fafc);
            }
            .empty-state p {
                margin: 0.5rem 0 1.5rem 0;
                font-size: 0.875rem;
                color: var(--theme-text-muted, #94a3b8);
                max-width: 320px;
            }
        `});customElements.define("ui-badge",W);customElements.define("ui-button",B);customElements.define("ui-checkbox",Ne);customElements.define("ui-input",G);customElements.define("ui-select",O);customElements.define("dashboard-stats",Ae);customElements.define("task-item",Fe);customElements.define("task-form",_e);customElements.define("todo-app",vt);
