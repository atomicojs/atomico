(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const z=e=>Symbol.for(`atomico/${e}`),ie=e=>({current:e});function ae(e,t){const o=e.length;if(o!==t.length)return!1;for(let r=0;r<o;r++)if(e[r]!==t[r])return!1;return!0}const _=e=>typeof e=="function",O=e=>e!==null&&typeof e=="object",{isArray:ce}=Array;function le(e,t,o=!1){let r;const n=s=>{for(let a=0;a<s.length;a++){const u=s[a];if(u&&ce(u))n(u);else{const d=typeof u,c=d==="function";if(!o&&(u==null||c||d==="boolean")||c)continue;if(d==="string"||d==="number")r=(r??"")+u;else{const p=u===!0?"":u||"";r!=null&&(t(r),r=null),t(p)}}}};n(e),r!=null&&t(r)}const Z=(e,t,o,r)=>(e.addEventListener(t,o,r),()=>e.removeEventListener(t,o)),G=z("hooks");globalThis[G]=globalThis[G]||{};let v=globalThis[G];const de="unmount",Ae=z("hook/suspense"),C=e=>{const{i:t,hooks:o}=v.c,r=o[t]=o[t]||{};return r.value=e(r.value),v.c.i++,o[t].value},J=(e,t)=>{const{i:o,hooks:r}=v.c;r[e]=r[e]||{},r[e][o]=t,v.c.i++},L=e=>C((t=ie(e))=>t),j=()=>C((e=ie(v.c.host))=>e),ue=()=>v.c.update,Ce=(e,t,o=0)=>{let r={},n=!1;return{render:d=>{v.c={host:t,hooks:r,update:e,i:0,id:o};let c;try{n=!1,c=d()}catch(p){if(p!==Ae)throw p;n=!0}finally{v.c=null}return c},dispatch:(d,c)=>{const p=r[d];for(const f in p)p[f](c)},isSuspense:()=>n}};function Q(e,t,o){const r=[_(e)?e():e,n=>{const s=_(n)?n(r[0]):n,a=o?o(r[0],s):s;a!==r[0]&&t(r[0]=a)}];return r}const fe="effect",pe="layoutEffect",he="insertionEffect",V=e=>(t,o)=>{const r=L({});J(e,()=>{const{current:n}=r;if(!n.args||!ae(n.args,o)){n.args=o,n.clean?.();const s=t();s&&(n.clean=s)}}),J(de,()=>{r.current.clean&&(r.current.clean(),r.current={})})},re=V(he),Oe=V(pe),B=V(fe),F=e=>{const t=ue();return C((o=Q(e,t))=>o)},oe=(e,t)=>C((r={})=>((!r.args||!ae(r.args,t))&&(r.value=e(),r.args=t),r)).value,Pe=(e,t,o,r)=>{const n=L();n.current=o,Oe(()=>e.current&&Z(e.current,t,s=>n.current(s),r),[e.current])},ne=e=>{const{current:t}=j();if(!(e in t))throw new ve(t,`For useProp("${e}"), the prop does not exist on the host.`,e);return C((o=Q(t[e],r=>t[e]=r))=>(o[0]=t[e],o))},_e="formAssociated",Fe="formDisabled",me="formReset",q=z("hook/internals"),ze=(e,t,o)=>{const r=new FormData,n=typeof o,s=n=="number"||n=="boolean"?o+"":o;return o&&r.append(t,s),e.setFormValue(r,r),r.get(t)},Le=e=>t=>J(e,o=>t(o)),$=()=>{const{current:e}=j();return e[q]=e[q]||e.attachInternals(),e[q]},be=(e="name",t="value")=>{const o=$(),[r]=ne(e),[n,s]=ne(t);return ee(()=>s(null)),B(()=>{ze(o,r,n)},[r,n]),[n,s]},ge=(e,t)=>{const[,o]=F(""),[r]=F(()=>({args:t,report:!1})),n=$(),s=()=>{if(r.report||(r.report=!t.every((f,h)=>f===r.args[h])),!r.report)return;const a={},{message:u,report:d=r.report,...c}=e();c.customError=c.customError??!!u;let p=`${u}`;for(const f in n.validity)a[f]=c?.[f]??!1,p+=`${f}:${a[f]}`;n.setValidity(a,u),u&&d&&(n.form||n).reportValidity(),a.message=n.validationMessage,o(p)};return Ie(a=>{r.report=!0,s(),n.validity.valid||a.preventDefault()}),B(s,t),[n.validationMessage,n.validity]},Ie=(e,t)=>{const o=$(),r=L(o.form);Pe(r,"submit",e,t)},ee=Le(me),Re={checked:1,value:1,selected:1},Me={list:1,type:1,size:1,form:1,width:1,height:1,src:1,href:1,slot:1},je={shadowDom:1,staticNode:1,cloneNode:1,children:1,key:1},N={},K=[],Be=0,I=1,U=2;class W extends Text{}const $e=z("id"),Y=z("ref"),qe=()=>{},ye=(e,t,...o)=>{const r=t||N;let{children:n}=r;return n=n??(o.length?o:K),e===qe?n:!e.prototype&&e instanceof Function?e(n!=K?{children:n,...r}:r):{type:e,props:r,key:r.key}};function xe(e,t,o=$e,r,n){let s;const a=!n;n=a?[]:n;const u=t&&t[o];if(u&&u.vnode==e)return t;const{type:d,props:c=N}=e;r=r||e.type=="svg";const p=d instanceof Node?I:d.prototype instanceof HTMLElement?U:Be;s=d!="host"&&(p==I?(t&&c.cloneNode?t[Y]:t)!=d:p==U?!(t instanceof d):t?t[Y]||t.localName!=d:!t),s&&(p==I&&c.cloneNode?(t=d.cloneNode(!0),t[Y]=d):t=p==I?d:p==U?new d:r?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,c.is?{is:c.is}:void 0));const f=u||N,{vnode:h=N,cycle:m=0}=f;let{fragment:i,handlers:b={}}=s?{}:f;const{props:y=N}=s?N:h,{children:T=K}=y;if(c.staticNode&&!s)return t;if(c.shadowDom&&!t.shadowRoot&&t.attachShadow({mode:"open",...c.shadowDom}),c!=y&&He(t,y,c,b,r,n),c.children!==T){const w=c.shadowDom?t.shadowRoot:t;i=Ye(c.children,i,w,o,r&&e.type=="foreignObject"?!1:r,n)}if(t[o]={vnode:e,handlers:b,fragment:i,cycle:m+1},a)for(let w=0;w<n.length;w++)n[w]();return t}function Ue(e){const t=new W(""),o=new W("");return e.append(t,o),{markStart:t,markEnd:o}}function Ye(e,t,o,r,n,s){e=e==null?null:ce(e)?e:[e];const a=t||Ue(o),{markStart:u,markEnd:d,keyes:c}=a;let p;const f=c&&new Set,h=c&&"moveBefore"in o;let m=u;if(e&&le(e,i=>{const b=typeof i,y=b==="string";if(!(b=="object"&&"type"in i&&"props"in i)&&!y)return;const w=i.key,te=c&&w!=null&&c.get(w);m!=d&&m===te?f.delete(m):m=m==d?d:m.nextSibling;const D=c?te:m;let x=D;if(y){const S=i+"";!(x instanceof Text)||x instanceof W?x=new Text(S):x.data!=S&&(x.data=S)}else x=xe(i,D,r,n,s);if(x!=m){c&&f.delete(x);const S=h&&(x||D).isConnected?"moveBefore":"insertBefore";!D||c?(o[S](x,m),c&&m!=d&&f.add(m)):D==d?o[S](x,d):(o.replaceChild(x,D),m=x)}w!=null&&(p=p||new Map,p.set(w,x))},!c),m=m==d?d:m.nextSibling,t&&m!=d)for(;m!=d;){const i=m;m=m.nextSibling,i.remove()}return f&&f.forEach(i=>i.remove()),a.keyes=p,a}function He(e,t,o,r,n,s){for(const a in t)a in o||se(e,a,t[a],null,r,n,s);for(const a in o)se(e,a,t[a],o[a],r,n,s)}function se(e,t,o,r,n,s,a){if(t=t=="class"&&!s?"className":t,o=o??null,r=r??null,t in e&&Re[t]&&(o=e[t]),r===o||je[t]||t[0]=="_")return;if(e.localName==="slot"&&t==="assignNode"&&"assign"in e){a.push(()=>e.assign(r));return}const u=_(o),d=_(r);if(t.startsWith("on")&&(d||u)){Ge(e,t.slice(2),r,n);return}if(t==="ref"){r&&(d?a.push(()=>r(e)):r.current=e);return}if(t==="style"&&"style"in e){const{style:f}=e,h=o&&O(o),m=r&&O(r);if(h&&m){for(const i in o)i in r||H(f,i,null);for(const i in r)o[i]!==r[i]&&H(f,i,r[i])}else if(m)for(const i in r)H(f,i,r[i]);else f.cssText=r||"";return}const c=t.startsWith("$")?t.slice(1):t;c===t&&(!s&&!Me[t]&&t in e||d||u)?e[t]=r??"":r==null?e.removeAttribute(c):e.setAttribute(c,O(r)?JSON.stringify(r):r)}function Ge(e,t,o,r){if(!r)return;r.handleEvent||(r.handleEvent=function(s){const a=r[s.type];if(_(a))return a.call(e,s)});const n=!!r[t];if(o){const a=o.capture||o.once||o.passive?{capture:!!o.capture,once:!!o.once,passive:!!o.passive}:void 0;n||e.addEventListener(t,r.handleEvent,a),r[t]=o}else n&&(e.removeEventListener(t,r.handleEvent),delete r[t])}function H(e,t,o){if(t[0]==="-"){o==null?e.removeProperty(t):e.setProperty(t,o);return}e[t]=o}class we{constructor(t,o,r){this.message=o,this.target=t,this.value=r}}class ve extends we{}class Je extends we{}const Ke=null,We={true:1,"":1,1:1};function Xe(e,t,o,r,n){const{type:s,reflect:a,value:u,attr:d=Ze(t)}=O(o)&&o!=Ke?o:{type:o};Object.defineProperty(e,t,{configurable:!0,set(c){const p=this[t];u&&c==null&&(c=u.call({self:this,prop:t}));const{error:f,value:h}=et(s,c);if(f&&h!=null)throw new ve(this,`The value defined for prop '${t}' must be of type '${s.name}'`,h);p!=h&&(this._props[t]=h??void 0,this.update(),this.updated.then(()=>{a&&(this._ignoreAttr=d,Qe(this,s,d,this[t]),this._ignoreAttr=null)}))},get(){return this._props[t]}}),u&&(n[t]=null),r[d]={prop:t,type:s}}const ke=(e,{type:t,base:o=CustomEvent,...r})=>e.dispatchEvent(new o(t,r)),Ze=e=>e.replace(/([A-Z])/g,"-$1").toLowerCase(),Qe=(e,t,o,r)=>r==null||t==Boolean&&!r?e.removeAttribute(o):e.setAttribute(o,O(r)?JSON.stringify(r):t==Boolean?"":r.toString()),Ve=(e,t)=>e==Boolean?!!We[t]:e==Number?Number(t):e==String?t:e==Array||e==Object?JSON.parse(t):new e(t),et=(e,t)=>e==null||t==null?{value:t,error:!1}:e!=String&&t===""?{value:void 0,error:!1}:e==Object||e==Array||e==Symbol?{value:t,error:{}.toString.call(t)!==`[object ${e.name}]`}:t instanceof e?{value:t,error:e==Number&&Number.isNaN(t.valueOf())}:e==String||e==Number||e==Boolean?{value:t,error:e==Number?typeof t!="number"||Number.isNaN(t):e==String?typeof t!="string":typeof t!="boolean"}:{value:t,error:!0},A=e=>({type:Function,value(){return t=>ke(this.self,{...e,type:this.prop,detail:t||e?.detail})}});let tt=0;const k=(e,t)=>{const o={},r={},{props:n,styles:s,form:a}={props:{},...t};class u extends HTMLElement{static formAssociated=a;constructor(){super(),this._setup(),this._render=()=>e({...this._props});for(const c in r)this[c]=r[c]}async _setup(){this._props=this._props||{},this.symbolId=this.symbolId||Symbol(),this._hooks=this._hooks||Ce(()=>this.update(),this,"c"+tt++);let c=new Promise(h=>this._mount=h),p,f=!0;this.update=()=>{if(p)return;p=!0;const h=this._hooks;this.updated=c.then(()=>{try{const m=h.render(this._render);h.dispatch(he),m&&xe(m,this,this.symbolId),p=!1,f&&!h.isSuspense()&&(f=!1,rt(this)),h.dispatch(pe)}finally{p=!1}}).then(()=>{h.dispatch(fe)})},this.update()}connectedCallback(){this._unmount=()=>{(!this.isConnected||this.lastParentNode!=this.parentNode)&&this._hooks.dispatch(de),this.parentNode||(this.lastParentNode=this.parentNode)},this.lastParentNode!=this.parentNode&&(this._mount(),this.update()),this.lastParentNode=this.parentNode}disconnectedCallback(){this._unmount()}attributeChangedCallback(c,p,f){if(o[c]){if(c===this._ignoreAttr||p===f)return;const{prop:h,type:m}=o[c];try{this[h]=Ve(m,f)}catch{throw new Je(this,`The value defined as attr '${c}' cannot be parsed by type '${m.name}'`,f)}}}static get observedAttributes(){for(const c in n)Xe(this.prototype,c,n[c],o,r);return Object.keys(o)}static get styles(){return[s]}static get props(){return n}async formResetCallback(){await this.updated,this._hooks.dispatch(me)}async formAssociatedCallback(c){await this.updated,this._hooks.dispatch(_e,c)}async formDisabledCallback(c){await this.updated,this._hooks.dispatch(Fe,c)}}return u};function rt(e){const{styles:t}=e.constructor,{shadowRoot:o}=e;if(o&&t.length){const r=[];le(t,n=>r.push(n)),r.length&&(o.adoptedStyleSheets=r)}}const ot=(e,t={})=>{const o=j();return o[e]||(o[e]=(r=t.detail)=>{e in o.current?o.current[e](r):ke(o.current,{type:e,...t,detail:r})}),o[e]};new Promise(e=>{document.readyState==="loading"?Z(document,"DOMContentLoaded",e):e()});const nt=ye("host",{style:"display: contents"}),Ee="value",st="ChangedValue",it="ConnectContext",at=(e,t)=>{const o=j(),r=ot(st);re(()=>{r()},[t]),re(()=>Z(o.current,it,n=>{n.composedPath().at(0)!==n.currentTarget&&e===n.detail.id&&(n.stopPropagation(),n.detail.connect(o.current))}),[e]),o.current[Ee]=t},ct=e=>{const t=k(({value:o})=>(at(t,o),nt),{props:{value:{type:Object,value:()=>e}}});return t[Ee]=e,t},lt={};function E(e,...t){const o=(e.raw||e).reduce((r,n,s)=>r+n+(t[s]||""),"");return lt[o]||=dt(o)}function dt(e){const t=new CSSStyleSheet;return t.replaceSync(e),t}ct({dispatch(e,t){}});const X=e=>{const t=ue();return C((o=Q(e,t,(r,n)=>{let s=!1;for(const a in n)if(r[a]!==n[a]){s=!0;break}return s?{...r,...n}:r}))=>o)},l=(e,t,o)=>(t==null?t={key:o}:t.key=o,ye(e,t)),g=l,R=k(()=>{const e=$();return l("host",{shadowDom:!0,onclick:o=>{e.form&&e.form.requestSubmit()},children:l("button",{type:"submit",class:"btn",children:l("slot",{})})})},{form:!0,props:{variant:{type:String,value:()=>"primary",reflect:!0},disabled:{type:Boolean,value:()=>!1,reflect:!0}},styles:E`
            :host {
                display: inline-block;
                cursor: pointer;
                user-select: none;
                font-family: inherit;
            }

            :host([disabled]) {
                pointer-events: none;
                opacity: 0.5;
                cursor: not-allowed;
            }

            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                border: none;
                font-family: inherit;
                font-size: 0.9rem;
                font-weight: 600;
                padding: 0.75rem 1.5rem;
                border-radius: 12px;
                cursor: inherit;
                outline: none;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                width: 100%;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
            }

            /* Primary Variant */
            :host([variant="primary"]) .btn {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: #ffffff;
                box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
            }

            :host([variant="primary"]:hover) .btn {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
            }

            :host([variant="primary"]:active) .btn {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
            }

            /* Secondary Variant */
            :host([variant="secondary"]) .btn {
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #cbd5e1;
                backdrop-filter: blur(12px);
            }

            :host([variant="secondary"]:hover) .btn {
                background: rgba(51, 65, 85, 0.8);
                color: #ffffff;
                border-color: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
            }

            :host([variant="secondary"]:active) .btn {
                transform: translateY(0);
            }

            /* Danger Variant */
            :host([variant="danger"]) .btn {
                background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                color: #ffffff;
                box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
            }

            :host([variant="danger"]:hover) .btn {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
                background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
            }

            :host([variant="danger"]:active) .btn {
                transform: translateY(0);
            }

            /* Focus States */
            .btn:focus-visible {
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
            }
        `}),Te=({validity:e,validationMessage:t})=>{const o={message:t};for(const r in e)o[r]=e[r];return o},M=k(({placeholder:e,required:t,type:o,label:r})=>{const[n="",s]=be(),a=L();return ge(()=>Te(a.current),[n]),ee(()=>{s("")}),l("host",{shadowDom:{delegatesFocus:!0},children:g("div",{class:"input-container",children:[r&&l("label",{class:"label",children:r}),l("div",{class:"input-wrapper",children:l("input",{ref:a,type:o,value:n,placeholder:e,required:t,oninput:u=>s(u.currentTarget.value),class:"input-field"})})]})})},{form:!0,props:{name:String,value:String,type:{type:String,value:()=>"text"},placeholder:{type:String,value:()=>""},required:{type:Boolean,value:()=>!1,reflect:!0},label:{type:String,value:()=>""}},styles:E`
            :host {
                display: block;
                width: 100%;
                font-family: inherit;
            }

            .input-container {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;
            }

            .label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #94a3b8;
                letter-spacing: 0.025em;
                transition: color 0.2s ease;
            }

            :host(:focus-within) .label {
                color: #3b82f6;
            }

            .input-wrapper {
                position: relative;
                width: 100%;
            }

            .input-field {
                width: 100%;
                padding: 0.75rem 1rem;
                font-family: inherit;
                font-size: 0.95rem;
                color: #f8fafc;
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                outline: none;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-sizing: border-box;
                backdrop-filter: blur(8px);
            }

            .input-field::placeholder {
                color: #64748b;
                opacity: 0.8;
            }

            .input-field:hover {
                border-color: rgba(255, 255, 255, 0.16);
                background: rgba(15, 23, 42, 0.8);
            }

            .input-field:focus {
                border-color: #3b82f6;
                background: rgba(15, 23, 42, 0.95);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            }

            /* Validation Visual State */
            :host([required]) .input-field:placeholder-shown {
                border-left: 3px solid #f59e0b;
            }
        `}),P=k(({label:e,options:t})=>{const[o="",r]=be(),n=L();return ge(()=>Te(n.current),[o]),ee(()=>{r(t[0]?.value||"")}),l("host",{shadowDom:{delegatesFocus:!0},children:g("div",{class:"select-container",children:[e&&l("label",{class:"label",children:e}),g("div",{class:"select-wrapper",children:[l("select",{ref:n,value:o,onchange:s=>r(s.currentTarget.value),class:"select-field",children:t.map(s=>l("option",{value:s.value,class:"select-option",children:s.label},s.value))}),l("span",{class:"chevron",children:"▼"})]})]})})},{form:!0,props:{name:String,value:String,label:{type:String,value:()=>""},options:{type:Array,value:()=>[]}},styles:E`
            :host {
                display: block;
                width: 100%;
                font-family: inherit;
            }

            .select-container {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;
            }

            .label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #94a3b8;
                letter-spacing: 0.025em;
                transition: color 0.2s ease;
            }

            :host(:focus-within) .label {
                color: #3b82f6;
            }

            .select-wrapper {
                position: relative;
                width: 100%;
            }

            .select-field {
                width: 100%;
                padding: 0.75rem 2.5rem 0.75rem 1rem;
                font-family: inherit;
                font-size: 0.95rem;
                color: #f8fafc;
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                outline: none;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-sizing: border-box;
                backdrop-filter: blur(8px);
                appearance: none;
                cursor: pointer;
            }

            .select-field:hover {
                border-color: rgba(255, 255, 255, 0.16);
                background: rgba(15, 23, 42, 0.8);
            }

            .select-field:focus {
                border-color: #3b82f6;
                background: rgba(15, 23, 42, 0.95);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            }

            .chevron {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.7rem;
                color: #64748b;
                pointer-events: none;
                transition: color 0.2s ease;
            }

            :host(:focus-within) .chevron {
                color: #3b82f6;
            }

            .select-option {
                background-color: #0f172a;
                color: #f8fafc;
            }
        `}),De=k(({task:e,toggle:t,remove:o,edit:r})=>{const[n,s]=F(!1),[a,u]=F(e.text),d=()=>{a.trim()&&a.trim()!==e.text&&r({id:e.id,text:a.trim()}),s(!1)},c=h=>{h.key==="Enter"?d():h.key==="Escape"&&(u(e.text),s(!1))},p=h=>{if(!h)return"";try{return new Date(h+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return h}},f=e.dueDate&&!e.completed&&new Date(e.dueDate+"T23:59:59")<new Date;return l("host",{shadowDom:!0,children:g("div",{class:`task-card ${e.completed?"completed":""} ${f?"overdue":""}`,priority:e.priority,children:[g("div",{class:"left-section",children:[l("button",{class:`checkbox ${e.completed?"checked":""}`,onclick:()=>t(e.id),"aria-label":"Toggle task completion",children:e.completed&&l("svg",{class:"checkmark",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"4",children:l("path",{d:"M20 6L9 17L4 12","stroke-linecap":"round","stroke-linejoin":"round"})})}),g("div",{class:"content-area",children:[n?l("input",{type:"text",class:"edit-input",value:a,oninput:h=>u(h.currentTarget.value),onkeydown:c,autofocus:!0}):l("span",{class:"task-text",children:e.text}),g("div",{class:"meta-row",children:[l("span",{class:`priority-badge ${e.priority}`,children:e.priority.toUpperCase()}),e.dueDate&&g("span",{class:`due-date ${f?"text-overdue":""}`,children:["📅 ",p(e.dueDate)," ",f&&"(Overdue)"]})]})]})]}),g("div",{class:"actions",children:[n?l("button",{class:"action-btn save-btn",onclick:d,title:"Save changes",children:"💾"}):l("button",{class:"action-btn edit-btn",onclick:()=>{u(e.text),s(!0)},title:"Edit task",children:"✏️"}),l("button",{class:"action-btn delete-btn",onclick:()=>o(e.id),title:"Delete task",children:"🗑️"})]})]})})},{props:{task:{type:Object,value:()=>({})},toggle:A({bubbles:!0,composed:!0}),remove:A({bubbles:!0,composed:!0}),edit:A({bubbles:!0,composed:!0})},styles:E`
            :host {
                display: block;
                margin-bottom: 0.75rem;
                font-family: inherit;
            }

            .task-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 1.25rem;
                background: rgba(30, 41, 59, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 16px;
                backdrop-filter: blur(12px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .task-card::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: transparent;
                transition: all 0.3s ease;
            }

            /* Priority Indicator Bars */
            .task-card[priority="high"]::before {
                background: #ef4444;
            }
            .task-card[priority="medium"]::before {
                background: #f59e0b;
            }
            .task-card[priority="low"]::before {
                background: #3b82f6;
            }

            .task-card:hover {
                transform: translateY(-2px);
                background: rgba(30, 41, 59, 0.65);
                border-color: rgba(255, 255, 255, 0.12);
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
            }

            /* Completed state */
            .task-card.completed {
                background: rgba(15, 23, 42, 0.2);
                opacity: 0.75;
                border-color: rgba(255, 255, 255, 0.03);
            }

            .task-card.completed::before {
                background: #10b981 !important;
            }

            .task-card.overdue {
                border-color: rgba(239, 68, 68, 0.25);
            }

            .left-section {
                display: flex;
                align-items: center;
                gap: 1.25rem;
                flex: 1;
                min-width: 0;
            }

            /* Custom Checkbox */
            .checkbox {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid #475569;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                flex-shrink: 0;
                padding: 0;
                outline: none;
            }

            .checkbox:hover {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
            }

            .checkbox.checked {
                border-color: #10b981;
                background: #10b981;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
            }

            .checkmark {
                width: 14px;
                height: 14px;
                color: #ffffff;
            }

            /* Content & Typography */
            .content-area {
                display: flex;
                flex-direction: column;
                gap: 0.35rem;
                flex: 1;
                min-width: 0;
            }

            .task-text {
                font-size: 1rem;
                font-weight: 500;
                color: #f1f5f9;
                transition: all 0.2s ease;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .completed .task-text {
                text-decoration: line-through;
                color: #64748b;
            }

            .edit-input {
                font-family: inherit;
                font-size: 1rem;
                font-weight: 500;
                color: #f1f5f9;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid #3b82f6;
                border-radius: 8px;
                padding: 0.2rem 0.5rem;
                outline: none;
                width: 100%;
                box-sizing: border-box;
            }

            /* Meta Details */
            .meta-row {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex-wrap: wrap;
            }

            .priority-badge {
                font-size: 0.65rem;
                font-weight: 700;
                padding: 0.1rem 0.5rem;
                border-radius: 6px;
                letter-spacing: 0.05em;
            }

            .priority-badge.high {
                background: rgba(239, 68, 68, 0.15);
                color: #f87171;
                border: 1px solid rgba(239, 68, 68, 0.25);
            }

            .priority-badge.medium {
                background: rgba(245, 158, 11, 0.15);
                color: #fbbf24;
                border: 1px solid rgba(245, 158, 11, 0.25);
            }

            .priority-badge.low {
                background: rgba(59, 130, 246, 0.15);
                color: #60a5fa;
                border: 1px solid rgba(59, 130, 246, 0.25);
            }

            .due-date {
                font-size: 0.75rem;
                color: #94a3b8;
                font-weight: 500;
            }

            .text-overdue {
                color: #f87171;
                font-weight: 600;
            }

            /* Action Buttons */
            .actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-left: 1rem;
            }

            .action-btn {
                background: transparent;
                border: none;
                font-size: 1.1rem;
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                padding: 0;
                outline: none;
            }

            .action-btn:hover {
                background: rgba(255, 255, 255, 0.08);
                transform: scale(1.1);
            }

            .delete-btn:hover {
                background: rgba(239, 68, 68, 0.15);
            }
        `}),Se=k(({change:e})=>{const[t,o]=X({query:"",status:"all",priority:"all",sortBy:"dueDateAsc"});B(()=>{e(t)},[t]);const r=[{value:"all",label:"All Statuses"},{value:"active",label:"Active"},{value:"completed",label:"Completed"}],n=[{value:"all",label:"All Priorities"},{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}],s=[{value:"dueDateAsc",label:"Due Date (Closest)"},{value:"dueDateDesc",label:"Due Date (Furthest)"},{value:"createdAtDesc",label:"Newest Created"},{value:"createdAtAsc",label:"Oldest Created"},{value:"priorityDesc",label:"Highest Priority"}];return l("host",{shadowDom:!0,children:g("div",{class:"filters-grid",children:[l("div",{class:"search-field",children:l(M,{placeholder:"Search tasks...",value:t.query,oninput:a=>o({query:a.currentTarget.value})})}),l("div",{class:"filter-field",children:l(P,{options:r,value:t.status,onchange:a=>o({status:a.currentTarget.value})})}),l("div",{class:"filter-field",children:l(P,{options:n,value:t.priority,onchange:a=>o({priority:a.currentTarget.value})})}),l("div",{class:"sort-field",children:l(P,{options:s,value:t.sortBy,onchange:a=>o({sortBy:a.currentTarget.value})})})]})})},{props:{change:A({bubbles:!0,composed:!0})},styles:E`
            :host {
                display: block;
                background: rgba(30, 41, 59, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                backdrop-filter: blur(12px);
            }

            .filters-grid {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1.2fr;
                gap: 0.75rem;
                align-items: end;
            }

            @media (max-width: 768px) {
                .filters-grid {
                    grid-template-columns: 1fr 1fr;
                }
                .search-field {
                    grid-column: span 2;
                }
            }

            @media (max-width: 480px) {
                .filters-grid {
                    grid-template-columns: 1fr;
                }
                .search-field, .filter-field, .sort-field {
                    grid-column: span 1;
                }
            }
        `}),Ne=k(({completedCount:e,totalCount:t,clearCompleted:o,markAllCompleted:r})=>{const n=t>0?Math.round(e/t*100):0;return l("host",{shadowDom:!0,children:g("div",{class:"stats-container",children:[g("div",{class:"header-row",children:[g("div",{class:"text-stats",children:[l("span",{class:"completed-num",children:e}),g("span",{class:"total-num",children:[" / ",t," Tasks Done"]}),t>0&&g("span",{class:"percentage",children:["(",n,"%)"]})]}),g("div",{class:"quick-actions",children:[l(R,{variant:"secondary",disabled:e===t,onclick:()=>r(),children:"✓ Mark All Done"}),l(R,{variant:"secondary",disabled:e===0,onclick:()=>o(),children:"🗑 Clear Done"})]})]}),l("div",{class:"progress-track",children:l("div",{class:"progress-bar",style:{width:`${n}%`}})})]})})},{props:{completedCount:{type:Number,value:()=>0},totalCount:{type:Number,value:()=>0},clearCompleted:A({bubbles:!0,composed:!0}),markAllCompleted:A({bubbles:!0,composed:!0})},styles:E`
            :host {
                display: block;
                background: rgba(30, 41, 59, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                padding: 1.25rem;
                margin-bottom: 1.5rem;
                backdrop-filter: blur(12px);
                font-family: inherit;
            }

            .stats-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .header-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.75rem;
            }

            .text-stats {
                font-size: 0.95rem;
                font-weight: 500;
                color: #94a3b8;
            }

            .completed-num {
                font-size: 1.5rem;
                font-weight: 700;
                color: #10b981;
                text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
            }

            .total-num {
                font-size: 1rem;
                font-weight: 600;
                color: #f1f5f9;
            }

            .percentage {
                margin-left: 0.5rem;
                color: #3b82f6;
                font-weight: 700;
            }

            .quick-actions {
                display: flex;
                gap: 0.5rem;
            }

            /* Custom sizing inside stats component for compact secondary buttons */
            .quick-actions ui-button {
                --btn-padding: 0.5rem 1rem;
                font-size: 0.8rem;
            }

            /* Linear Progress Bar Track */
            .progress-track {
                width: 100%;
                height: 8px;
                background: rgba(15, 23, 42, 0.6);
                border-radius: 999px;
                overflow: hidden;
                position: relative;
            }

            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
                border-radius: 999px;
                transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
            }
        `});customElements.define("ui-button",R);customElements.define("ui-input",M);customElements.define("ui-select",P);customElements.define("todo-item",De);customElements.define("todo-filters",Se);customElements.define("todo-stats",Ne);const ut=k(()=>{const[e,t]=F(()=>{try{const i=localStorage.getItem("tasks-flow-data");return i?JSON.parse(i):[]}catch{return[]}});B(()=>{localStorage.setItem("tasks-flow-data",JSON.stringify(e))},[e]);const[o,r]=X({query:"",status:"all",priority:"all",sortBy:"dueDateAsc"}),[n,s]=X({text:"",priority:"medium",dueDate:""}),a=oe(()=>e.filter(i=>!(o.query&&!i.text.toLowerCase().includes(o.query.toLowerCase())||o.status==="active"&&i.completed||o.status==="completed"&&!i.completed||o.priority!=="all"&&i.priority!==o.priority)).sort((i,b)=>{if(o.sortBy==="dueDateAsc")return i.dueDate?b.dueDate?new Date(i.dueDate).getTime()-new Date(b.dueDate).getTime():-1:1;if(o.sortBy==="dueDateDesc")return i.dueDate?b.dueDate?new Date(b.dueDate).getTime()-new Date(i.dueDate).getTime():-1:1;if(o.sortBy==="createdAtDesc")return b.createdAt-i.createdAt;if(o.sortBy==="createdAtAsc")return i.createdAt-b.createdAt;if(o.sortBy==="priorityDesc"){const y={high:3,medium:2,low:1};return y[b.priority]-y[i.priority]}return 0}),[e,o]),u=oe(()=>{const i=e.length,b=e.filter(y=>y.completed).length;return{totalCount:i,completedCount:b}},[e]),d=i=>{if(i.preventDefault(),!n.text.trim())return;const b={id:Date.now(),text:n.text.trim(),completed:!1,priority:n.priority,dueDate:n.dueDate,createdAt:Date.now()};t(y=>[...y,b]),s({text:"",priority:"medium",dueDate:""})},c=i=>{t(b=>b.map(y=>y.id===i?{...y,completed:!y.completed}:y))},p=i=>{t(b=>b.filter(y=>y.id!==i))},f=(i,b)=>{t(y=>y.map(T=>T.id===i?{...T,text:b}:T))},h=()=>{t(i=>i.filter(b=>!b.completed))},m=()=>{t(i=>i.map(b=>({...b,completed:!0})))};return l("host",{shadowDom:!0,children:g("div",{class:"app-container",children:[l("header",{class:"app-header",children:g("div",{class:"logo-area",children:[l("span",{class:"logo-icon",children:"⚡"}),g("div",{children:[l("h1",{children:"TaskFlow"}),l("p",{class:"subtitle",children:"Organize. Prioritize. Execute."})]})]})}),g("main",{class:"app-main",children:[l(Ne,{completedCount:u.completedCount,totalCount:u.totalCount,onclearCompleted:h,onmarkAllCompleted:m}),g("section",{class:"creation-card",children:[l("h2",{children:"New Task"}),g("form",{onsubmit:d,class:"creation-form",children:[l("div",{class:"form-row",children:l(M,{name:"taskText",placeholder:"What needs to be done?",required:!0,value:n.text,oninput:i=>s({text:i.currentTarget.value})})}),g("div",{class:"form-row form-grid",children:[l(P,{name:"priority",label:"Priority",options:[{value:"high",label:"🔴 High"},{value:"medium",label:"🟡 Medium"},{value:"low",label:"🔵 Low"}],value:n.priority,onchange:i=>s({priority:i.currentTarget.value})}),l(M,{type:"date",name:"dueDate",label:"Due Date",value:n.dueDate,oninput:i=>s({dueDate:i.currentTarget.value})})]}),l("div",{class:"form-actions",children:l(R,{variant:"primary",children:"+ Add Task"})})]})]}),l(Se,{onchange:i=>r(i.detail)}),g("section",{class:"list-section",children:[l("div",{class:"list-header",children:g("h3",{children:["Filtered Tasks (",a.length,")"]})}),l("div",{class:"task-list",children:a.length>0?a.map(i=>l(De,{task:i,ontoggle:()=>c(i.id),onremove:()=>p(i.id),onedit:b=>f(i.id,b.detail.text)},i.id)):g("div",{class:"empty-state",children:[l("span",{class:"empty-icon",children:"✨"}),l("p",{children:"No tasks match your criteria."}),l("span",{class:"empty-hint",children:"Create a task or clear your search query to begin."})]})})]})]})]})})},{styles:E`
        :host {
            display: block;
            width: 100%;
            max-width: 768px;
            margin: 0 auto;
            font-family: var(--font-sans);
        }

        .app-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        /* Header Styles */
        .app-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0;
        }

        .logo-area {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .logo-icon {
            font-size: 2.2rem;
            background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3));
        }

        h1 {
            font-size: 1.8rem;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            font-size: 0.85rem;
            color: #64748b;
            margin: 0.1rem 0 0 0;
            font-weight: 500;
        }

        .app-main {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        /* Task Creation Card */
        .creation-card {
            background: rgba(30, 41, 59, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 20px;
            padding: 1.5rem;
            backdrop-filter: blur(16px);
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
        }

        .creation-card h2 {
            font-size: 1.15rem;
            font-weight: 700;
            color: #f1f5f9;
            margin: 0 0 1.25rem 0;
            letter-spacing: -0.01em;
        }

        .creation-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-row {
            width: 100%;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
        }

        .form-actions {
            margin-top: 0.5rem;
            display: flex;
            justify-content: flex-end;
        }

        .form-actions ui-button {
            width: 100%;
            max-width: 200px;
        }

        @media (max-width: 640px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
            .form-actions ui-button {
                max-width: 100%;
            }
        }

        /* List Section */
        .list-section {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .list-header h3 {
            font-size: 0.95rem;
            font-weight: 600;
            color: #94a3b8;
            margin: 0;
            letter-spacing: 0.025em;
            text-transform: uppercase;
        }

        .task-list {
            min-height: 100px;
        }

        /* Empty State */
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
            background: rgba(30, 41, 59, 0.15);
            border: 1px dashed rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            text-align: center;
        }

        .empty-icon {
            font-size: 2rem;
            margin-bottom: 0.75rem;
            opacity: 0.8;
        }

        .empty-state p {
            font-size: 1rem;
            font-weight: 600;
            color: #e2e8f0;
            margin: 0 0 0.25rem 0;
        }

        .empty-hint {
            font-size: 0.8rem;
            color: #64748b;
        }
    `});customElements.define("todo-app",ut);
