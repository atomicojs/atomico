(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const _=e=>Symbol.for(`atomico/${e}`),te=e=>({current:e});function re(e,t){const o=e.length;if(o!==t.length)return!1;for(let r=0;r<o;r++)if(e[r]!==t[r])return!1;return!0}const I=e=>typeof e=="function",O=e=>e!==null&&typeof e=="object",{isArray:oe}=Array;function ne(e,t,o=!1){let r;const n=s=>{for(let l=0;l<s.length;l++){const p=s[l];if(p&&oe(p))n(p);else{const d=typeof p,a=d==="function";if(!o&&(p==null||a||d==="boolean")||a)continue;if(d==="string"||d==="number")r=(r??"")+p;else{const u=p===!0?"":p||"";r!=null&&(t(r),r=null),t(u)}}}};n(e),r!=null&&t(r)}const se=(e,t,o,r)=>(e.addEventListener(t,o,r),()=>e.removeEventListener(t,o)),q=_("hooks");globalThis[q]=globalThis[q]||{};let N=globalThis[q];const ie="unmount",Se=_("hook/suspense"),C=e=>{const{i:t,hooks:o}=N.c,r=o[t]=o[t]||{};return r.value=e(r.value),N.c.i++,o[t].value},H=(e,t)=>{const{i:o,hooks:r}=N.c;r[e]=r[e]||{},r[e][o]=t,N.c.i++},ae=e=>C((t=te(e))=>t),B=()=>C((e=te(N.c.host))=>e),le=()=>N.c.update,Te=(e,t,o=0)=>{let r={},n=!1;return{render:d=>{N.c={host:t,hooks:r,update:e,i:0,id:o};let a;try{n=!1,a=d()}catch(u){if(u!==Se)throw u;n=!0}finally{N.c=null}return a},dispatch:(d,a)=>{const u=r[d];for(const g in u)u[g](a)},isSuspense:()=>n}};function X(e,t,o){const r=[I(e)?e():e,n=>{const s=I(n)?n(r[0]):n,l=o?o(r[0],s):s;l!==r[0]&&t(r[0]=l)}];return r}const ce="effect",Ee="layoutEffect",de="insertionEffect",ue=e=>(t,o)=>{const r=ae({});H(e,()=>{const{current:n}=r;if(!n.args||!re(n.args,o)){n.args=o,n.clean?.();const s=t();s&&(n.clean=s)}}),H(ie,()=>{r.current.clean&&(r.current.clean(),r.current={})})},K=ue(de),pe=ue(ce),Z=e=>{const t=le();return C((o=X(e,t))=>o)},Q=(e,t)=>C((r={})=>((!r.args||!re(r.args,t))&&(r.value=e(),r.args=t),r)).value,Y=e=>{const{current:t}=B();if(!(e in t))throw new xe(t,`For useProp("${e}"), the prop does not exist on the host.`,e);return C((o=X(t[e],r=>t[e]=r))=>(o[0]=t[e],o))},Ne="formAssociated",De="formDisabled",fe="formReset",j=_("hook/internals"),Ce=(e,t,o)=>{const r=new FormData,n=typeof o,s=n=="number"||n=="boolean"?o+"":o;return o&&r.append(t,s),e.setFormValue(r,r),r.get(t)},Pe=e=>t=>H(e,o=>t(o)),he=()=>{const{current:e}=B();return e[j]=e[j]||e.attachInternals(),e[j]},ge=(e="name",t="value")=>{const o=he(),[r]=Y(e),[n,s]=Y(t);return Oe(()=>s(null)),pe(()=>{Ce(o,r,n)},[r,n]),[n,s]},Oe=Pe(fe),Ie={checked:1,value:1,selected:1},_e={list:1,type:1,size:1,form:1,width:1,height:1,src:1,href:1,slot:1},Ae={shadowDom:1,staticNode:1,cloneNode:1,children:1,key:1},D={},G=[],Fe=0,L=1,M=2;class J extends Text{}const Le=_("id"),U=_("ref"),ze=()=>{},be=(e,t,...o)=>{const r=t||D;let{children:n}=r;return n=n??(o.length?o:G),e===ze?n:!e.prototype&&e instanceof Function?e(n!=G?{children:n,...r}:r):{type:e,props:r,key:r.key}};function me(e,t,o=Le,r,n){let s;const l=!n;n=l?[]:n;const p=t&&t[o];if(p&&p.vnode==e)return t;const{type:d,props:a=D}=e;r=r||e.type=="svg";const u=d instanceof Node?L:d.prototype instanceof HTMLElement?M:Fe;s=d!="host"&&(u==L?(t&&a.cloneNode?t[U]:t)!=d:u==M?!(t instanceof d):t?t[U]||t.localName!=d:!t),s&&(u==L&&a.cloneNode?(t=d.cloneNode(!0),t[U]=d):t=u==L?d:u==M?new d:r?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,a.is?{is:a.is}:void 0));const g=p||D,{vnode:y=D,cycle:f=0}=g;let{fragment:m,handlers:S={}}=s?{}:g;const{props:v=D}=s?D:y,{children:F=G}=v;if(a.staticNode&&!s)return t;if(a.shadowDom&&!t.shadowRoot&&t.attachShadow({mode:"open",...a.shadowDom}),a!=v&&je(t,v,a,S,r,n),a.children!==F){const w=a.shadowDom?t.shadowRoot:t;m=Re(a.children,m,w,o,r&&e.type=="foreignObject"?!1:r,n)}if(t[o]={vnode:e,handlers:S,fragment:m,cycle:f+1},l)for(let w=0;w<n.length;w++)n[w]();return t}function Be(e){const t=new J(""),o=new J("");return e.append(t,o),{markStart:t,markEnd:o}}function Re(e,t,o,r,n,s){e=e==null?null:oe(e)?e:[e];const l=t||Be(o),{markStart:p,markEnd:d,keyes:a}=l;let u;const g=a&&new Set,y=a&&"moveBefore"in o;let f=p;if(e&&ne(e,m=>{const S=typeof m,v=S==="string";if(!(S=="object"&&"type"in m&&"props"in m)&&!v)return;const w=m.key,c=a&&w!=null&&a.get(w);f!=d&&f===c?g.delete(f):f=f==d?d:f.nextSibling;const x=a?c:f;let b=x;if(v){const k=m+"";!(b instanceof Text)||b instanceof J?b=new Text(k):b.data!=k&&(b.data=k)}else b=me(m,x,r,n,s);if(b!=f){a&&g.delete(b);const k=y&&(b||x).isConnected?"moveBefore":"insertBefore";!x||a?(o[k](b,f),a&&f!=d&&g.add(f)):x==d?o[k](b,d):(o.replaceChild(b,x),f=b)}w!=null&&(u=u||new Map,u.set(w,b))},!a),f=f==d?d:f.nextSibling,t&&f!=d)for(;f!=d;){const m=f;f=f.nextSibling,m.remove()}return g&&g.forEach(m=>m.remove()),l.keyes=u,l}function je(e,t,o,r,n,s){for(const l in t)l in o||V(e,l,t[l],null,r,n,s);for(const l in o)V(e,l,t[l],o[l],r,n,s)}function V(e,t,o,r,n,s,l){if(t=t=="class"&&!s?"className":t,o=o??null,r=r??null,t in e&&Ie[t]&&(o=e[t]),r===o||Ae[t]||t[0]=="_")return;if(e.localName==="slot"&&t==="assignNode"&&"assign"in e){l.push(()=>e.assign(r));return}const p=I(o),d=I(r);if(t.startsWith("on")&&(d||p)){Me(e,t.slice(2),r,n);return}if(t==="ref"){r&&(d?l.push(()=>r(e)):r.current=e);return}if(t==="style"&&"style"in e){const{style:g}=e,y=o&&O(o),f=r&&O(r);if(y&&f){for(const m in o)m in r||$(g,m,null);for(const m in r)o[m]!==r[m]&&$(g,m,r[m])}else if(f)for(const m in r)$(g,m,r[m]);else g.cssText=r||"";return}const a=t.startsWith("$")?t.slice(1):t;a===t&&(!s&&!_e[t]&&t in e||d||p)?e[t]=r??"":r==null?e.removeAttribute(a):e.setAttribute(a,O(r)?JSON.stringify(r):r)}function Me(e,t,o,r){if(!r)return;r.handleEvent||(r.handleEvent=function(s){const l=r[s.type];if(I(l))return l.call(e,s)});const n=!!r[t];if(o){const l=o.capture||o.once||o.passive?{capture:!!o.capture,once:!!o.once,passive:!!o.passive}:void 0;n||e.addEventListener(t,r.handleEvent,l),r[t]=o}else n&&(e.removeEventListener(t,r.handleEvent),delete r[t])}function $(e,t,o){if(t[0]==="-"){o==null?e.removeProperty(t):e.setProperty(t,o);return}e[t]=o}class ye{constructor(t,o,r){this.message=o,this.target=t,this.value=r}}class xe extends ye{}class Ue extends ye{}const $e=null,We={true:1,"":1,1:1};function qe(e,t,o,r,n){const{type:s,reflect:l,value:p,attr:d=He(t)}=O(o)&&o!=$e?o:{type:o};Object.defineProperty(e,t,{configurable:!0,set(a){const u=this[t];p&&a==null&&(a=p.call({self:this,prop:t}));const{error:g,value:y}=Je(s,a);if(g&&y!=null)throw new xe(this,`The value defined for prop '${t}' must be of type '${s.name}'`,y);u!=y&&(this._props[t]=y??void 0,this.update(),this.updated.then(()=>{l&&(this._ignoreAttr=d,Ye(this,s,d,this[t]),this._ignoreAttr=null)}))},get(){return this._props[t]}}),p&&(n[t]=null),r[d]={prop:t,type:s}}const ve=(e,{type:t,base:o=CustomEvent,...r})=>e.dispatchEvent(new o(t,r)),He=e=>e.replace(/([A-Z])/g,"-$1").toLowerCase(),Ye=(e,t,o,r)=>r==null||t==Boolean&&!r?e.removeAttribute(o):e.setAttribute(o,O(r)?JSON.stringify(r):t==Boolean?"":r.toString()),Ge=(e,t)=>e==Boolean?!!We[t]:e==Number?Number(t):e==String?t:e==Array||e==Object?JSON.parse(t):new e(t),Je=(e,t)=>e==null||t==null?{value:t,error:!1}:e!=String&&t===""?{value:void 0,error:!1}:e==Object||e==Array||e==Symbol?{value:t,error:{}.toString.call(t)!==`[object ${e.name}]`}:t instanceof e?{value:t,error:e==Number&&Number.isNaN(t.valueOf())}:e==String||e==Number||e==Boolean?{value:t,error:e==Number?typeof t!="number"||Number.isNaN(t):e==String?typeof t!="string":typeof t!="boolean"}:{value:t,error:!0},W=e=>({type:Function,value(){return t=>ve(this.self,{...e,type:this.prop,detail:t||e?.detail})}});let Xe=0;const P=(e,t)=>{const o={},r={},{props:n,styles:s,form:l}={props:{},...t};class p extends HTMLElement{static formAssociated=l;constructor(){super(),this._setup(),this._render=()=>e({...this._props});for(const a in r)this[a]=r[a]}async _setup(){this._props=this._props||{},this.symbolId=this.symbolId||Symbol(),this._hooks=this._hooks||Te(()=>this.update(),this,"c"+Xe++);let a=new Promise(y=>this._mount=y),u,g=!0;this.update=()=>{if(u)return;u=!0;const y=this._hooks;this.updated=a.then(()=>{try{const f=y.render(this._render);y.dispatch(de),f&&me(f,this,this.symbolId),u=!1,g&&!y.isSuspense()&&(g=!1,Ke(this)),y.dispatch(Ee)}finally{u=!1}}).then(()=>{y.dispatch(ce)})},this.update()}connectedCallback(){this._unmount=()=>{(!this.isConnected||this.lastParentNode!=this.parentNode)&&this._hooks.dispatch(ie),this.parentNode||(this.lastParentNode=this.parentNode)},this.lastParentNode!=this.parentNode&&(this._mount(),this.update()),this.lastParentNode=this.parentNode}disconnectedCallback(){this._unmount()}attributeChangedCallback(a,u,g){if(o[a]){if(a===this._ignoreAttr||u===g)return;const{prop:y,type:f}=o[a];try{this[y]=Ge(f,g)}catch{throw new Ue(this,`The value defined as attr '${a}' cannot be parsed by type '${f.name}'`,g)}}}static get observedAttributes(){for(const a in n)qe(this.prototype,a,n[a],o,r);return Object.keys(o)}static get styles(){return[s]}static get props(){return n}async formResetCallback(){await this.updated,this._hooks.dispatch(fe)}async formAssociatedCallback(a){await this.updated,this._hooks.dispatch(Ne,a)}async formDisabledCallback(a){await this.updated,this._hooks.dispatch(De,a)}}return p};function Ke(e){const{styles:t}=e.constructor,{shadowRoot:o}=e;if(o&&t.length){const r=[];ne(t,n=>r.push(n)),r.length&&(o.adoptedStyleSheets=r)}}const Ze=(e,t={})=>{const o=B();return o[e]||(o[e]=(r=t.detail)=>{e in o.current?o.current[e](r):ve(o.current,{type:e,...t,detail:r})}),o[e]};new Promise(e=>{document.readyState==="loading"?se(document,"DOMContentLoaded",e):e()});const Qe=be("host",{style:"display: contents"}),we="value",Ve="ChangedValue",et="ConnectContext",tt=(e,t)=>{const o=B(),r=Ze(Ve);K(()=>{r()},[t]),K(()=>se(o.current,et,n=>{n.composedPath().at(0)!==n.currentTarget&&e===n.detail.id&&(n.stopPropagation(),n.detail.connect(o.current))}),[e]),o.current[we]=t},rt=e=>{const t=P(({value:o})=>(tt(t,o),Qe),{props:{value:{type:Object,value:()=>e}}});return t[we]=e,t},ot={};function A(e,...t){const o=(e.raw||e).reduce((r,n,s)=>r+n+(t[s]||""),"");return ot[o]||=nt(o)}function nt(e){const t=new CSSStyleSheet;return t.replaceSync(e),t}rt({dispatch(e,t){}});const ee=e=>{const t=le();return C((o=X(e,t,(r,n)=>{let s=!1;for(const l in n)if(r[l]!==n[l]){s=!0;break}return s?{...r,...n}:r}))=>o)},i=(e,t,o)=>(t==null?t={key:o}:t.key=o,be(e,t)),h=i,z=P(({type:e,disabled:t})=>{const o=he();return i("host",{shadowDom:!0,onclick:()=>{t||e==="submit"&&o.form&&o.form.requestSubmit()},children:i("button",{type:e,disabled:t,class:"btn",children:i("slot",{})})})},{form:!0,props:{variant:{type:String,value:()=>"primary",reflect:!0},type:{type:String,value:()=>"button"},disabled:{type:Boolean,value:()=>!1,reflect:!0}},styles:A`
            :host {
                display: inline-block;
                cursor: pointer;
            }
            :host([disabled]) {
                cursor: not-allowed;
                opacity: 0.6;
                pointer-events: none;
            }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 20px;
                font-family: inherit;
                font-size: 0.95rem;
                font-weight: 600;
                border-radius: 12px;
                border: none;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                color: #fff;
                width: 100%;
                box-sizing: border-box;
                background: none;
            }
            /* Colors */
            :host([variant="primary"]) .btn {
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            }
            :host([variant="primary"]:hover) .btn {
                background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
            }
            :host([variant="secondary"]) .btn {
                background: rgba(255, 255, 255, 0.08);
                color: #e4e4e7;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            :host([variant="secondary"]:hover) .btn {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-2px);
            }
            :host([variant="danger"]) .btn {
                background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
                box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
            }
            :host([variant="danger"]:hover) .btn {
                background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(225, 29, 72, 0.4);
            }
            :host([variant="success"]) .btn {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            }
            :host([variant="success"]:hover) .btn {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
            }
            .btn:active {
                transform: translateY(0) !important;
            }
        `}),E=P(({placeholder:e,type:t,disabled:o,required:r,label:n})=>{const[s="",l]=ge(),p=ae();return h("host",{shadowDom:{delegatesFocus:!0},children:[n&&i("label",{class:"label",children:n}),i("input",{ref:p,type:t,value:s,placeholder:e,disabled:o,required:r,class:"input",oninput:d=>{l(d.currentTarget.value)}})]})},{form:!0,props:{name:String,value:String,placeholder:{type:String,value:()=>""},type:{type:String,value:()=>"text"},label:{type:String,value:()=>""},required:{type:Boolean,value:()=>!1,reflect:!0},disabled:{type:Boolean,value:()=>!1,reflect:!0}},styles:A`
            :host {
                display: flex;
                flex-direction: column;
                gap: 6px;
                width: 100%;
            }
            .label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #a1a1aa;
                padding-left: 2px;
            }
            .input {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: #fff;
                font-family: inherit;
                font-size: 0.95rem;
                transition: all 0.2s ease;
                outline: none;
            }
            .input::placeholder {
                color: #52525b;
            }
            .input:focus {
                background: rgba(255, 255, 255, 0.05);
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
            }
            :host([disabled]) .input {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `}),T=P(({label:e,options:t})=>{const[o="",r]=ge();return h("host",{shadowDom:!0,children:[e&&i("label",{class:"label",children:e}),i("select",{value:o,class:"select",onchange:n=>{r(n.currentTarget.value)},children:t.map(n=>i("option",{value:n.value,selected:n.value===o,children:n.label}))})]})},{form:!0,props:{name:String,value:String,label:{type:String,value:()=>""},options:{type:Array,value:()=>[]}},styles:A`
            :host {
                display: flex;
                flex-direction: column;
                gap: 6px;
                width: 100%;
            }
            .label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #a1a1aa;
                padding-left: 2px;
            }
            .select {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: #fff;
                font-family: inherit;
                font-size: 0.95rem;
                transition: all 0.2s ease;
                outline: none;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 16px center;
                background-size: 16px;
            }
            .select option {
                background: #18181b;
                color: #fff;
            }
            .select:focus {
                background-color: rgba(255, 255, 255, 0.05);
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
            }
        `}),ke=P(e=>{const t=e.taskId??0,o=e.text??"",r=e.description??"",n=e.done??!1,s=e.priority??"medium",l=e.category??"",p=e.dueDate??"",[d,a]=Z(!1),[u,g]=Z(()=>({text:o,description:r,priority:s,category:l,dueDate:p})),y=v=>{v.preventDefault(),e.dispatchUpdate?.({id:t,text:u.text,description:u.description,done:n,priority:u.priority,category:u.category,dueDate:u.dueDate||void 0}),a(!1)},f=()=>{g({text:o,description:r,priority:s,category:l,dueDate:p}),a(!1)},m=[{value:"low",label:"Low Priority"},{value:"medium",label:"Medium Priority"},{value:"high",label:"High Priority"}],S=[{value:"Work",label:"Work"},{value:"Personal",label:"Personal"},{value:"Shopping",label:"Shopping"},{value:"Ideas",label:"Ideas"}];return i("host",{shadowDom:!0,children:d?h("form",{onsubmit:y,class:"edit-form",children:[h("div",{class:"form-grid",children:[i(E,{label:"Task Title",value:u.text,placeholder:"Task title...",required:!0,oninput:v=>g({...u,text:v.currentTarget.value??""})}),i(E,{label:"Description",value:u.description,placeholder:"Short description...",oninput:v=>g({...u,description:v.currentTarget.value??""})}),h("div",{class:"row",children:[i(T,{label:"Priority",value:u.priority,options:m,onchange:v=>g({...u,priority:v.currentTarget.value??"medium"})}),i(T,{label:"Category",value:u.category,options:S,onchange:v=>g({...u,category:v.currentTarget.value??""})})]}),i(E,{label:"Due Date",type:"date",value:u.dueDate,oninput:v=>g({...u,dueDate:v.currentTarget.value??""})})]}),h("div",{class:"actions",children:[i(z,{type:"submit",variant:"success",children:"Save"}),i(z,{onclick:f,variant:"secondary",children:"Cancel"})]})]}):h("div",{class:`todo-card ${n?"is-done":""}`,children:[h("label",{class:"checkbox-container",children:[i("input",{type:"checkbox",checked:n,onchange:()=>e.dispatchToggle?.(t)}),i("span",{class:"checkmark",children:i("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3",children:i("polyline",{points:"20 6 9 17 4 12"})})})]}),h("div",{class:"todo-content",children:[h("div",{class:"todo-header",children:[i("h3",{class:"todo-title",children:o}),h("div",{class:"badges",children:[i("span",{class:`badge priority-${s}`,children:s}),i("span",{class:"badge category",children:l})]})]}),r&&i("p",{class:"todo-desc",children:r}),p&&h("div",{class:"due-date",children:[h("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:[i("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),i("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),i("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),i("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]}),h("span",{children:["Due: ",p]})]})]}),h("div",{class:"card-actions",children:[i("button",{class:"action-btn edit-btn",onclick:()=>a(!0),title:"Edit Task",children:h("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:[i("path",{d:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"}),i("path",{d:"M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),i("button",{class:"action-btn delete-btn",onclick:()=>e.dispatchDelete?.(t),title:"Delete Task",children:h("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:[i("polyline",{points:"3 6 5 6 21 6"}),i("path",{d:"M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"}),i("line",{x1:"10",y1:"11",x2:"10",y2:"17"}),i("line",{x1:"14",y1:"11",x2:"14",y2:"17"})]})})]})]})})},{props:{taskId:{type:Number,value:()=>0},text:{type:String,value:()=>""},description:{type:String,value:()=>""},done:{type:Boolean,value:()=>!1,reflect:!0},priority:{type:String,value:()=>"medium",reflect:!0},category:{type:String,value:()=>""},dueDate:{type:String,value:()=>""},dispatchToggle:W({bubbles:!0}),dispatchDelete:W({bubbles:!0}),dispatchUpdate:W({bubbles:!0})},styles:A`
            :host {
                display: block;
                margin-bottom: 12px;
            }
            .todo-card {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 16px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .todo-card:hover {
                background: rgba(255, 255, 255, 0.04);
                border-color: rgba(99, 102, 241, 0.25);
                transform: translateY(-2px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            }
            .todo-card.is-done {
                background: rgba(255, 255, 255, 0.01);
                border-color: rgba(255, 255, 255, 0.03);
            }
            .todo-card.is-done .todo-title {
                text-decoration: line-through;
                color: #52525b;
            }
            .todo-card.is-done .todo-desc {
                color: #3f3f46;
            }
            .todo-card.is-done .badges, 
            .todo-card.is-done .due-date {
                opacity: 0.5;
            }

            /* Custom Checkbox */
            .checkbox-container {
                position: relative;
                display: block;
                width: 24px;
                height: 24px;
                cursor: pointer;
                user-select: none;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }
            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 24px;
                width: 24px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .checkbox-container:hover input ~ .checkmark {
                border-color: #6366f1;
                background: rgba(99, 102, 241, 0.1);
            }
            .checkbox-container input:checked ~ .checkmark {
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                border-color: transparent;
            }
            .checkmark svg {
                width: 14px;
                height: 14px;
                color: #fff;
                display: none;
            }
            .checkbox-container input:checked ~ .checkmark svg {
                display: block;
            }

            /* Todo Content */
            .todo-content {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .todo-header {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
            }
            .todo-title {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
                color: #f4f4f5;
                line-height: 1.4;
            }
            .todo-desc {
                margin: 0;
                font-size: 0.9rem;
                color: #a1a1aa;
                line-height: 1.5;
            }
            .due-date {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.8rem;
                color: #71717a;
                margin-top: 4px;
            }
            .due-date svg {
                width: 14px;
                height: 14px;
            }

            /* Badges */
            .badges {
                display: flex;
                gap: 6px;
            }
            .badge {
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
                padding: 2px 8px;
                border-radius: 9999px;
                letter-spacing: 0.05em;
            }
            .badge.priority-high {
                background: rgba(244, 63, 94, 0.1);
                color: #f43f5e;
                border: 1px solid rgba(244, 63, 94, 0.2);
            }
            .badge.priority-medium {
                background: rgba(245, 158, 11, 0.1);
                color: #f59e0b;
                border: 1px solid rgba(245, 158, 11, 0.2);
            }
            .badge.priority-low {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            .badge.category {
                background: rgba(255, 255, 255, 0.05);
                color: #d4d4d8;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Card Actions */
            .card-actions {
                display: flex;
                gap: 8px;
                align-self: center;
            }
            .action-btn {
                background: none;
                border: none;
                color: #71717a;
                padding: 6px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .action-btn svg {
                width: 18px;
                height: 18px;
            }
            .action-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                color: #f4f4f5;
            }
            .delete-btn:hover {
                background: rgba(244, 63, 94, 0.1);
                color: #f43f5e;
            }

            /* Edit Form Styles */
            .edit-form {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 16px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .form-grid {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .row {
                display: flex;
                gap: 12px;
            }
            .row > * {
                flex: 1;
            }
            .actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
        `}),st=()=>{try{const e=localStorage.getItem("taskly-tasks");if(e)return JSON.parse(e)}catch(e){console.error("Failed to load tasks",e)}return[{id:1,text:"Design the dashboard UI",description:"Create mockups and layout with premium glassmorphism aesthetics",done:!0,priority:"high",category:"Work",dueDate:new Date().toISOString().split("T")[0]},{id:2,text:"Implement custom webcomponents",description:"Use Atomico.js to build UI buttons, inputs, and list elements",done:!1,priority:"high",category:"Work",dueDate:new Date().toISOString().split("T")[0]},{id:3,text:"Configure state management",description:"Use useObjectState for filters and new task forms",done:!1,priority:"medium",category:"Ideas"},{id:4,text:"Buy groceries",description:"Milk, eggs, avocados, premium coffee beans",done:!1,priority:"low",category:"Personal"}]},it=P(e=>{const[t,o]=Y("tasks"),r=t??[],[n,s]=ee({query:"",status:"all",priority:"all",category:"all",sortBy:"newest"}),[l,p]=ee({text:"",description:"",priority:"medium",category:"Work",dueDate:""});pe(()=>{try{localStorage.setItem("taskly-tasks",JSON.stringify(r))}catch(c){console.error("Failed to save tasks",c)}},[r]);const d=c=>{if(c.preventDefault(),!l.text.trim())return;const x={id:Date.now(),text:l.text.trim(),description:l.description.trim(),done:!1,priority:l.priority,category:l.category,dueDate:l.dueDate||void 0};o([...r,x]),p({text:"",description:"",priority:"medium",category:"Work",dueDate:""})},a=c=>{const x=c.detail;o(r.map(b=>b.id===x?{...b,done:!b.done}:b))},u=c=>{const x=c.detail;o(r.filter(b=>b.id!==x))},g=c=>{const x=c.detail;o(r.map(b=>b.id===x.id?{...b,...x}:b))},y=Q(()=>{const c=r.length,x=r.filter(R=>R.done).length,b=c-x,k=c>0?Math.round(x/c*100):0;return{total:c,completed:x,active:b,percent:k}},[r]),f=Q(()=>r.filter(c=>{const x=c.text.toLowerCase().includes(n.query.toLowerCase())||c.description.toLowerCase().includes(n.query.toLowerCase()),b=n.status==="all"||n.status==="completed"&&c.done||n.status==="active"&&!c.done,k=n.priority==="all"||c.priority===n.priority,R=n.category==="all"||c.category===n.category;return x&&b&&k&&R}).sort((c,x)=>{if(n.sortBy==="oldest")return c.id-x.id;if(n.sortBy==="priority"){const b={high:3,medium:2,low:1};return b[x.priority]-b[c.priority]}return n.sortBy==="dueDate"?c.dueDate?x.dueDate?new Date(c.dueDate).getTime()-new Date(x.dueDate).getTime():-1:1:x.id-c.id}),[r,n]),m=[{value:"low",label:"Low Priority"},{value:"medium",label:"Medium Priority"},{value:"high",label:"High Priority"}],S=[{value:"Work",label:"Work"},{value:"Personal",label:"Personal"},{value:"Shopping",label:"Shopping"},{value:"Ideas",label:"Ideas"}],v=[{value:"all",label:"All Priorities"},{value:"low",label:"Low Priority"},{value:"medium",label:"Medium Priority"},{value:"high",label:"High Priority"}],F=[{value:"all",label:"All Categories"},{value:"Work",label:"Work"},{value:"Personal",label:"Personal"},{value:"Shopping",label:"Shopping"},{value:"Ideas",label:"Ideas"}],w=[{value:"newest",label:"Newest First"},{value:"oldest",label:"Oldest First"},{value:"priority",label:"Highest Priority"},{value:"dueDate",label:"Due Date Soonest"}];return i("host",{shadowDom:!0,children:h("div",{class:"app-container",children:[h("header",{class:"app-header",children:[h("div",{class:"brand",children:[i("h1",{class:"logo",children:"Taskly"}),i("span",{class:"subtitle",children:"Aether Productivity Suite"})]}),h("div",{class:"stats-card",children:[h("div",{class:"stats-text",children:[h("span",{class:"stats-count",children:[y.completed," / ",y.total]}),i("span",{class:"stats-label",children:"Tasks completed"})]}),i("div",{class:"progress-bar-container",children:i("div",{class:"progress-bar-fill",style:`width: ${y.percent}%`})}),h("span",{class:"stats-percent",children:[y.percent,"% complete"]})]})]}),h("div",{class:"main-layout",children:[h("section",{class:"form-section",children:[i("h2",{class:"section-title",children:"Create New Task"}),h("form",{onsubmit:d,class:"task-form",children:[i(E,{label:"Task Title",placeholder:"What needs to be done?",value:l.text,required:!0,oninput:c=>p({text:c.currentTarget.value??""})}),i(E,{label:"Description",placeholder:"Add details about this task...",value:l.description,oninput:c=>p({description:c.currentTarget.value??""})}),h("div",{class:"form-row",children:[i(T,{label:"Priority",value:l.priority,options:m,onchange:c=>p({priority:c.currentTarget.value??"medium"})}),i(T,{label:"Category",value:l.category,options:S,onchange:c=>p({category:c.currentTarget.value??"Work"})})]}),i(E,{label:"Due Date",type:"date",value:l.dueDate,oninput:c=>p({dueDate:c.currentTarget.value??""})}),h(z,{type:"submit",variant:"primary",children:[h("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5",class:"btn-icon",children:[i("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),i("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Create Task"]})]})]}),h("section",{class:"list-section",children:[h("div",{class:"filters-container",children:[i("div",{class:"search-row",children:i(E,{placeholder:"Search tasks...",value:n.query,oninput:c=>s({query:c.currentTarget.value??""})})}),h("div",{class:"filter-controls",children:[h("div",{class:"tabs",children:[i("button",{class:`tab-btn ${n.status==="all"?"active":""}`,onclick:()=>s({status:"all"}),children:"All"}),i("button",{class:`tab-btn ${n.status==="active"?"active":""}`,onclick:()=>s({status:"active"}),children:"Active"}),i("button",{class:`tab-btn ${n.status==="completed"?"active":""}`,onclick:()=>s({status:"completed"}),children:"Done"})]}),h("div",{class:"selects-row",children:[i(T,{value:n.priority,options:v,onchange:c=>s({priority:c.currentTarget.value??"all"})}),i(T,{value:n.category,options:F,onchange:c=>s({category:c.currentTarget.value??"all"})}),i(T,{value:n.sortBy,options:w,onchange:c=>s({sortBy:c.currentTarget.value??"newest"})})]})]})]}),i("div",{class:"task-list",children:f.length===0?h("div",{class:"empty-state",children:[i("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5",class:"empty-icon",children:i("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),i("h3",{children:"No tasks match your criteria"}),i("p",{children:"Try clearing your filters or creating a new task to get started."})]}):f.map(c=>i(ke,{taskId:c.id,text:c.text,description:c.description,done:c.done,priority:c.priority,category:c.category,dueDate:c.dueDate,ondispatchToggle:a,ondispatchDelete:u,ondispatchUpdate:g},c.id))})]})]})]})})},{props:{tasks:{type:Array,value:()=>st()}},styles:A`
            :host {
                display: block;
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
                box-sizing: border-box;
            }
            
            .app-container {
                display: flex;
                flex-direction: column;
                gap: 40px;
            }

            /* Header Section */
            .app-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 20px;
                padding-bottom: 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            .logo {
                margin: 0;
                font-size: 2.8rem;
                font-weight: 800;
                background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -0.02em;
            }
            .subtitle {
                font-size: 0.95rem;
                color: #71717a;
                font-weight: 500;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-top: 4px;
                display: block;
            }

            /* Stats Card */
            .stats-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 20px;
                padding: 20px 24px;
                min-width: 260px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .stats-text {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }
            .stats-count {
                font-size: 1.5rem;
                font-weight: 700;
                color: #f4f4f5;
            }
            .stats-label {
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            .progress-bar-container {
                height: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 9999px;
                overflow: hidden;
            }
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
                border-radius: 9999px;
                transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .stats-percent {
                font-size: 0.8rem;
                font-weight: 600;
                color: #a855f7;
                align-self: flex-end;
            }

            /* Main Layout Grid */
            .main-layout {
                display: grid;
                grid-template-columns: 380px 1fr;
                gap: 40px;
                align-items: start;
            }

            @media (max-width: 900px) {
                .main-layout {
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
            }

            /* Form Section */
            .form-section {
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid rgba(255, 255, 255, 0.04);
                padding: 28px;
                border-radius: 24px;
                backdrop-filter: blur(10px);
                position: sticky;
                top: 24px;
            }
            .section-title {
                margin: 0 0 24px 0;
                font-size: 1.4rem;
                font-weight: 700;
                color: #f4f4f5;
            }
            .task-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .form-row {
                display: flex;
                gap: 16px;
            }
            .form-row > * {
                flex: 1;
            }
            .btn-icon {
                width: 18px;
                height: 18px;
            }

            /* Filters */
            .filters-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid rgba(255, 255, 255, 0.04);
                padding: 20px;
                border-radius: 20px;
                margin-bottom: 24px;
            }
            .search-row {
                width: 100%;
            }
            .filter-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 16px;
            }
            .tabs {
                display: flex;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 12px;
                padding: 4px;
            }
            .tab-btn {
                background: transparent;
                border: none;
                padding: 8px 16px;
                font-family: inherit;
                font-size: 0.9rem;
                font-weight: 600;
                color: #a1a1aa;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .tab-btn:hover {
                color: #fff;
            }
            .tab-btn.active {
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .selects-row {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                flex-grow: 1;
                justify-content: flex-end;
            }
            .selects-row > * {
                min-width: 140px;
                max-width: 180px;
            }

            /* Task List */
            .task-list {
                display: flex;
                flex-direction: column;
            }

            /* Empty State */
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                text-align: center;
                background: rgba(255, 255, 255, 0.01);
                border: 1px dashed rgba(255, 255, 255, 0.08);
                border-radius: 20px;
                color: #71717a;
            }
            .empty-icon {
                width: 48px;
                height: 48px;
                margin-bottom: 16px;
                color: #3f3f46;
            }
            .empty-state h3 {
                color: #d4d4d8;
                margin: 0 0 8px 0;
                font-size: 1.2rem;
            }
            .empty-state p {
                margin: 0;
                font-size: 0.95rem;
                max-width: 320px;
            }
        `});customElements.define("ui-button",z);customElements.define("ui-input",E);customElements.define("ui-select",T);customElements.define("todo-item",ke);customElements.define("todo-app",it);
