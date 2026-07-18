(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const I=e=>Symbol.for(`atomico/${e}`),ie=e=>({current:e});function De(e,t){const o=e.length;if(o!==t.length)return!1;for(let r=0;r<o;r++)if(e[r]!==t[r])return!1;return!0}const P=e=>typeof e=="function",F=e=>e!==null&&typeof e=="object",{isArray:se}=Array;function ce(e,t,o=!1){let r;const n=i=>{for(let d=0;d<i.length;d++){const b=i[d];if(b&&se(b))n(b);else{const p=typeof b,s=p==="function";if(!o&&(b==null||s||p==="boolean")||s)continue;if(p==="string"||p==="number")r=(r??"")+b;else{const l=b===!0?"":b||"";r!=null&&(t(r),r=null),t(l)}}}};n(e),r!=null&&t(r)}const Q=(e,t,o,r)=>(e.addEventListener(t,o,r),()=>e.removeEventListener(t,o)),J=I("hooks");globalThis[J]=globalThis[J]||{};let D=globalThis[J];const ae="unmount",Ae=I("hook/suspense"),$=e=>{const{i:t,hooks:o}=D.c,r=o[t]=o[t]||{};return r.value=e(r.value),D.c.i++,o[t].value},re=(e,t)=>{const{i:o,hooks:r}=D.c;r[e]=r[e]||{},r[e][o]=t,D.c.i++},V=e=>$((t=ie(e))=>t),le=()=>$((e=ie(D.c.host))=>e),de=()=>D.c.update,Ce=(e,t,o=0)=>{let r={},n=!1;return{render:p=>{D.c={host:t,hooks:r,update:e,i:0,id:o};let s;try{n=!1,s=p()}catch(l){if(l!==Ae)throw l;n=!0}finally{D.c=null}return s},dispatch:(p,s)=>{const l=r[p];for(const m in l)l[m](s)},isSuspense:()=>n}};function pe(e,t,o){const r=[P(e)?e():e,n=>{const i=P(n)?n(r[0]):n,d=o?o(r[0],i):i;d!==r[0]&&t(r[0]=d)}];return r}const ue="effect",fe="layoutEffect",he="insertionEffect",ee=e=>(t,o)=>{const r=V({});re(e,()=>{const{current:n}=r;if(!n.args||!De(n.args,o)){n.args=o,n.clean?.();const i=t();i&&(n.clean=i)}}),re(ae,()=>{r.current.clean&&(r.current.clean(),r.current={})})},oe=ee(he),Oe=ee(fe),W=ee(ue),q=e=>{const t=de();return $((o=pe(e,t))=>o)},Pe=(e,t,o,r)=>{const n=V();n.current=o,Oe(()=>e.current&&Q(e.current,t,i=>n.current(i),r),[e.current])},_e="formAssociated",Le="formDisabled",Me="formReset",Fe={checked:1,value:1,selected:1},Ie={list:1,type:1,size:1,form:1,width:1,height:1,src:1,href:1,slot:1},Re={shadowDom:1,staticNode:1,cloneNode:1,children:1,key:1},O={},X=[],ze=0,B=1,K=2;class Z extends Text{}const je=I("id"),Y=I("ref"),Ue=()=>{},ge=(e,t,...o)=>{const r=t||O;let{children:n}=r;return n=n??(o.length?o:X),e===Ue?n:!e.prototype&&e instanceof Function?e(n!=X?{children:n,...r}:r):{type:e,props:r,key:r.key}};function be(e,t,o=je,r,n){let i;const d=!n;n=d?[]:n;const b=t&&t[o];if(b&&b.vnode==e)return t;const{type:p,props:s=O}=e;r=r||e.type=="svg";const l=p instanceof Node?B:p.prototype instanceof HTMLElement?K:ze;i=p!="host"&&(l==B?(t&&s.cloneNode?t[Y]:t)!=p:l==K?!(t instanceof p):t?t[Y]||t.localName!=p:!t),i&&(l==B&&s.cloneNode?(t=p.cloneNode(!0),t[Y]=p):t=l==B?p:l==K?new p:r?document.createElementNS("http://www.w3.org/2000/svg",p):document.createElement(p,s.is?{is:s.is}:void 0));const m=b||O,{vnode:y=O,cycle:h=0}=m;let{fragment:x,handlers:A={}}=i?{}:m;const{props:S=O}=i?O:y,{children:z=X}=S;if(s.staticNode&&!i)return t;if(s.shadowDom&&!t.shadowRoot&&t.attachShadow({mode:"open",...s.shadowDom}),s!=S&&He(t,S,s,A,r,n),s.children!==z){const c=s.shadowDom?t.shadowRoot:t;x=$e(s.children,x,c,o,r&&e.type=="foreignObject"?!1:r,n)}if(t[o]={vnode:e,handlers:A,fragment:x,cycle:h+1},d)for(let c=0;c<n.length;c++)n[c]();return t}function Be(e){const t=new Z(""),o=new Z("");return e.append(t,o),{markStart:t,markEnd:o}}function $e(e,t,o,r,n,i){e=e==null?null:se(e)?e:[e];const d=t||Be(o),{markStart:b,markEnd:p,keyes:s}=d;let l;const m=s&&new Set,y=s&&"moveBefore"in o;let h=b;if(e&&ce(e,x=>{const A=typeof x,S=A==="string";if(!(A=="object"&&"type"in x&&"props"in x)&&!S)return;const c=x.key,w=s&&c!=null&&s.get(c);h!=p&&h===w?m.delete(h):h=h==p?p:h.nextSibling;const g=s?w:h;let f=g;if(S){const k=x+"";!(f instanceof Text)||f instanceof Z?f=new Text(k):f.data!=k&&(f.data=k)}else f=be(x,g,r,n,i);if(f!=h){s&&m.delete(f);const k=y&&(f||g).isConnected?"moveBefore":"insertBefore";!g||s?(o[k](f,h),s&&h!=p&&m.add(h)):g==p?o[k](f,p):(o.replaceChild(f,g),h=f)}c!=null&&(l=l||new Map,l.set(c,f))},!s),h=h==p?p:h.nextSibling,t&&h!=p)for(;h!=p;){const x=h;h=h.nextSibling,x.remove()}return m&&m.forEach(x=>x.remove()),d.keyes=l,d}function He(e,t,o,r,n,i){for(const d in t)d in o||ne(e,d,t[d],null,r,n,i);for(const d in o)ne(e,d,t[d],o[d],r,n,i)}function ne(e,t,o,r,n,i,d){if(t=t=="class"&&!i?"className":t,o=o??null,r=r??null,t in e&&Fe[t]&&(o=e[t]),r===o||Re[t]||t[0]=="_")return;if(e.localName==="slot"&&t==="assignNode"&&"assign"in e){d.push(()=>e.assign(r));return}const b=P(o),p=P(r);if(t.startsWith("on")&&(p||b)){qe(e,t.slice(2),r,n);return}if(t==="ref"){r&&(p?d.push(()=>r(e)):r.current=e);return}if(t==="style"&&"style"in e){const{style:m}=e,y=o&&F(o),h=r&&F(r);if(y&&h){for(const x in o)x in r||G(m,x,null);for(const x in r)o[x]!==r[x]&&G(m,x,r[x])}else if(h)for(const x in r)G(m,x,r[x]);else m.cssText=r||"";return}const s=t.startsWith("$")?t.slice(1):t;s===t&&(!i&&!Ie[t]&&t in e||p||b)?e[t]=r??"":r==null?e.removeAttribute(s):e.setAttribute(s,F(r)?JSON.stringify(r):r)}function qe(e,t,o,r){if(!r)return;r.handleEvent||(r.handleEvent=function(i){const d=r[i.type];if(P(d))return d.call(e,i)});const n=!!r[t];if(o){const d=o.capture||o.once||o.passive?{capture:!!o.capture,once:!!o.once,passive:!!o.passive}:void 0;n||e.addEventListener(t,r.handleEvent,d),r[t]=o}else n&&(e.removeEventListener(t,r.handleEvent),delete r[t])}function G(e,t,o){if(t[0]==="-"){o==null?e.removeProperty(t):e.setProperty(t,o);return}e[t]=o}class me{constructor(t,o,r){this.message=o,this.target=t,this.value=r}}class Ke extends me{}class Ye extends me{}const xe=I("event"),Ge=null,Je={true:1,"":1,1:1};function We(e,t,o,r,n){const{type:i,reflect:d,value:b,attr:p=Xe(t)}=F(o)&&o!=Ge?o:{type:o};Object.defineProperty(e,t,{configurable:!0,set(s){const l=this[t];b&&s==null&&(s=b.call({self:this,prop:t}));const{error:m,value:y}=Ve(i,s);if(m&&y!=null)throw new Ke(this,`The value defined for prop '${t}' must be of type '${i.name}'`,y);l!=y&&(this._props[t]=y??void 0,this.update(),this.updated.then(()=>{d&&(this._ignoreAttr=p,Ze(this,i,p,this[t]),this._ignoreAttr=null)}))},get(){return this._props[t]}}),b&&(n[t]=null),r[p]={prop:t,type:i}}const ye=(e,{type:t,base:o=CustomEvent,...r})=>e.dispatchEvent(new o(t,r)),Xe=e=>e.replace(/([A-Z])/g,"-$1").toLowerCase(),Ze=(e,t,o,r)=>r==null||t==Boolean&&!r?e.removeAttribute(o):e.setAttribute(o,F(r)?JSON.stringify(r):t==Boolean?"":r.toString()),Qe=(e,t)=>e==Boolean?!!Je[t]:e==Number?Number(t):e==String?t:e==Array||e==Object?JSON.parse(t):new e(t),Ve=(e,t)=>e==null||t==null?{value:t,error:!1}:e!=String&&t===""?{value:void 0,error:!1}:e==Object||e==Array||e==Symbol?{value:t,error:{}.toString.call(t)!==`[object ${e.name}]`}:t instanceof e?{value:t,error:e==Number&&Number.isNaN(t.valueOf())}:e==String||e==Number||e==Boolean?{value:t,error:e==Number?typeof t!="number"||Number.isNaN(t):e==String?typeof t!="string":typeof t!="boolean"}:{value:t,error:!0},N=e=>({type:Function,value(){const t=o=>ye(this.self,{...e,type:this.prop,detail:o||e?.detail});return t[xe]=!0,t}});let et=0;const _=(e,t)=>{const o={},r={},{props:n,styles:i,form:d}={props:{},...t};class b extends HTMLElement{static formAssociated=d;constructor(){super(),this._setup(),this._render=()=>e({...this._props});for(const s in r)this[s]=r[s]}async _setup(){this._props=this._props||{},this.symbolId=this.symbolId||Symbol(),this._hooks=this._hooks||Ce(()=>this.update(),this,"c"+et++);let s=new Promise(y=>this._mount=y),l,m=!0;this.update=()=>{if(l)return;l=!0;const y=this._hooks;this.updated=s.then(()=>{try{const h=y.render(this._render);y.dispatch(he),h&&be(h,this,this.symbolId),l=!1,m&&!y.isSuspense()&&(m=!1,tt(this)),y.dispatch(fe)}finally{l=!1}}).then(()=>{y.dispatch(ue)})},this.update()}connectedCallback(){this._unmount=()=>{(!this.isConnected||this.lastParentNode!=this.parentNode)&&this._hooks.dispatch(ae),this.parentNode||(this.lastParentNode=this.parentNode)},this.lastParentNode!=this.parentNode&&(this._mount(),this.update()),this.lastParentNode=this.parentNode}disconnectedCallback(){this._unmount()}attributeChangedCallback(s,l,m){if(o[s]){if(s===this._ignoreAttr||l===m)return;const{prop:y,type:h}=o[s];try{this[y]=Qe(h,m)}catch{throw new Ye(this,`The value defined as attr '${s}' cannot be parsed by type '${h.name}'`,m)}}}static get observedAttributes(){for(const s in n)We(this.prototype,s,n[s],o,r);return Object.keys(o)}static get styles(){return[i]}static get props(){return n}async formResetCallback(){await this.updated,this._hooks.dispatch(Me)}async formAssociatedCallback(s){await this.updated,this._hooks.dispatch(_e,s)}async formDisabledCallback(s){await this.updated,this._hooks.dispatch(Le,s)}}return b};function tt(e){const{styles:t}=e.constructor,{shadowRoot:o}=e;if(o&&t.length){const r=[];ce(t,n=>r.push(n)),r.length&&(o.adoptedStyleSheets=r)}}const rt=(e,t={})=>{const o=le();return o[e]||(o[e]=(r=t.detail)=>{const n=o.current[e];P(n)&&(n[xe]||e==="click")?n(r):ye(o.current,{type:e,...t,detail:r})}),o[e]};new Promise(e=>{document.readyState==="loading"?Q(document,"DOMContentLoaded",e):e()});const ot=ge("host",{style:"display: contents"}),we="value",nt="ChangedValue",it="ConnectContext",st=(e,t)=>{const o=le(),r=rt(nt);oe(()=>{r()},[t]),oe(()=>Q(o.current,it,n=>{n.composedPath().at(0)!==n.currentTarget&&e===n.detail.id&&(n.stopPropagation(),n.detail.connect(o.current))}),[e]),o.current[we]=t},ct=e=>{const t=_(({value:o})=>(st(t,o),ot),{props:{value:{type:Object,value:()=>e}}});return t[we]=e,t},at={};function R(e,...t){const o=(e.raw||e).reduce((r,n,i)=>r+n+(t[i]||""),"");return at[o]||=lt(o)}function lt(e){const t=new CSSStyleSheet;return t.replaceSync(e),t}ct({dispatch(e,t){}});const ke=e=>{const t=de();return $((o=pe(e,t,(r,n)=>{let i=!1;for(const d in n)if(r[d]!==n[d]){i=!0;break}return i?{...r,...n}:r}))=>o)},a=(e,t,o)=>(t==null?t={key:o}:t.key=o,ge(e,t)),u=a,ve=_(({selectedTask:e,submittask:t,canceledit:o})=>{const[r,n]=ke({title:"",description:"",priority:"Medium",dueDate:""});W(()=>{n(e?{title:e.title,description:e.description,priority:e.priority,dueDate:e.dueDate}:{title:"",description:"",priority:"Medium",dueDate:""})},[e]);const i=!!e;return a("host",{shadowDom:!0,children:u("div",{class:"form-container",children:[a("h3",{class:"form-title",children:i?"Edit Task":"Create New Task"}),u("form",{onsubmit:d=>{d.preventDefault(),r.title.trim()&&(t({title:r.title,description:r.description,priority:r.priority,dueDate:r.dueDate,...i&&{id:e.id}}),i||n({title:"",description:"",priority:"Medium",dueDate:""}))},children:[u("div",{class:"field-group",children:[u("label",{for:"title-input",children:["Title ",a("span",{class:"required",children:"*"})]}),a("input",{id:"title-input",type:"text",placeholder:"e.g. Implement tree navigation",required:!0,value:r.title,oninput:d=>n({title:d.currentTarget.value})})]}),u("div",{class:"field-group",children:[a("label",{for:"description-input",children:"Description"}),a("textarea",{id:"description-input",placeholder:"Add details about this task...",value:r.description,oninput:d=>n({description:d.currentTarget.value})})]}),u("div",{class:"form-row",children:[u("div",{class:"field-group flex-1",children:[a("label",{for:"priority-input",children:"Priority"}),u("select",{id:"priority-input",value:r.priority,onchange:d=>n({priority:d.currentTarget.value}),children:[a("option",{value:"Low",children:"Low"}),a("option",{value:"Medium",children:"Medium"}),a("option",{value:"High",children:"High"})]})]}),u("div",{class:"field-group flex-1",children:[a("label",{for:"due-date-input",children:"Due Date"}),a("input",{id:"due-date-input",type:"date",value:r.dueDate,oninput:d=>n({dueDate:d.currentTarget.value})})]})]}),u("div",{class:"button-group",children:[i&&a("button",{type:"button",class:"btn btn-secondary",onclick:()=>o(),children:"Cancel"}),a("button",{type:"submit",class:"btn btn-primary",children:i?"Save Changes":"Create Task"})]})]})]})})},{props:{selectedTask:{type:Object,value:()=>null},submittask:N({bubbles:!0,composed:!0}),canceledit:N({bubbles:!0,composed:!0})},styles:R`
        :host {
            display: block;
            width: 100%;
        }

        .form-container {
            padding: 24px;
            background: rgba(22, 24, 30, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .form-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .field-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 16px;
        }

        .form-row {
            display: flex;
            gap: 16px;
        }

        .flex-1 {
            flex: 1;
        }

        label {
            font-size: 0.85rem;
            font-weight: 500;
            color: #9ca3af;
        }

        .required {
            color: #f43f5e;
        }

        input[type="text"],
        input[type="date"],
        textarea,
        select {
            padding: 10px 14px;
            background: rgba(11, 12, 16, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            color: #f3f4f6;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            outline: none;
        }

        input:hover,
        textarea:hover,
        select:hover {
            border-color: rgba(255, 255, 255, 0.16);
            background: rgba(11, 12, 16, 0.8);
        }

        input:focus,
        textarea:focus,
        select:focus {
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
            background: rgba(11, 12, 16, 0.9);
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 10px;
        }

        .btn {
            padding: 10px 18px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }

        .btn-primary {
            background: #6366f1;
            color: #ffffff;
        }

        .btn-primary:hover {
            background: #4f46e5;
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.35);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.08);
            color: #d1d5db;
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
    `}),Te=_(({query:e,priority:t,startDate:o,endDate:r,filterchange:n})=>a("host",{shadowDom:!0,children:u("div",{class:"search-bar-container",children:[u("div",{class:"search-input-wrapper",children:[a("svg",{class:"search-icon",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),a("input",{type:"text",placeholder:"Search tasks by title or description...",value:e,oninput:i=>{n({query:i.currentTarget.value,priority:t,startDate:o,endDate:r})}})]}),u("div",{class:"filters-row",children:[u("div",{class:"filter-group",children:[a("label",{for:"priority-filter",children:"Priority"}),u("select",{id:"priority-filter",value:t,onchange:i=>{n({query:e,priority:i.currentTarget.value,startDate:o,endDate:r})},children:[a("option",{value:"All",children:"All Priorities"}),a("option",{value:"Low",children:"Low"}),a("option",{value:"Medium",children:"Medium"}),a("option",{value:"High",children:"High"})]})]}),u("div",{class:"filter-group",children:[a("label",{for:"start-date-filter",children:"Start Date"}),a("input",{id:"start-date-filter",type:"date",value:o,oninput:i=>{n({query:e,priority:t,startDate:i.currentTarget.value,endDate:r})}})]}),u("div",{class:"filter-group",children:[a("label",{for:"end-date-filter",children:"End Date"}),a("input",{id:"end-date-filter",type:"date",value:r,oninput:i=>{n({query:e,priority:t,startDate:o,endDate:i.currentTarget.value})}})]})]})]})}),{props:{query:{type:String,value:()=>""},priority:{type:String,value:()=>"All"},startDate:{type:String,value:()=>""},endDate:{type:String,value:()=>""},filterchange:N({bubbles:!0,composed:!0})},styles:R`
        :host {
            display: block;
            width: 100%;
        }

        .search-bar-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px;
            background: rgba(22, 24, 30, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .search-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
        }

        .search-icon {
            position: absolute;
            left: 14px;
            width: 20px;
            height: 20px;
            color: #6b7280;
            pointer-events: none;
        }

        input[type="text"] {
            width: 100%;
            padding: 12px 14px 12px 46px;
            background: rgba(11, 12, 16, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            color: #f3f4f6;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.2s ease;
        }

        input[type="text"]:focus {
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
            background: rgba(11, 12, 16, 0.8);
        }

        .filters-row {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: flex-end;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
            min-width: 150px;
        }

        label {
            font-size: 0.8rem;
            font-weight: 500;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        select,
        input[type="date"] {
            padding: 10px 12px;
            background: rgba(11, 12, 16, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            color: #f3f4f6;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.2s ease;
            width: 100%;
        }

        select:focus,
        input[type="date"]:focus {
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
            background: rgba(11, 12, 16, 0.8);
        }

        select option {
            background-color: #16181e;
            color: #f3f4f6;
        }
    `}),Ee=_(()=>a("host",{shadowDom:!0,children:u("div",{class:"footer-container",children:[a("span",{class:"footer-title",children:"Keyboard Shortcuts:"}),u("div",{class:"shortcut-list",children:[u("div",{class:"shortcut-item",children:[a("span",{class:"key-badge",children:"↑↓"}),a("span",{class:"shortcut-desc",children:"Navigate"})]}),u("div",{class:"shortcut-item",children:[a("span",{class:"key-badge",children:"←→"}),a("span",{class:"shortcut-desc",children:"Nest / Unnest"})]}),u("div",{class:"shortcut-item",children:[a("span",{class:"key-badge",children:"Ctrl + ↑↓"}),a("span",{class:"shortcut-desc",children:"Move Position"})]}),u("div",{class:"shortcut-item",children:[a("span",{class:"key-badge",children:"Space"}),a("span",{class:"shortcut-desc",children:"Toggle Complete"})]}),u("div",{class:"shortcut-item",children:[a("span",{class:"key-badge",children:"Enter"}),a("span",{class:"shortcut-desc",children:"Edit Task"})]})]})]})}),{styles:R`
        :host {
            display: block;
            width: 100%;
        }

        .footer-container {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            padding: 12px 24px;
            background: rgba(22, 24, 30, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            color: #9ca3af;
            font-size: 0.8rem;
        }

        .footer-title {
            font-weight: 600;
            color: #d1d5db;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .shortcut-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .shortcut-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .key-badge {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 4px;
            padding: 2px 6px;
            color: #f3f4f6;
            font-family: monospace;
            font-size: 0.75rem;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .shortcut-desc {
            color: #9ca3af;
        }
    `}),Ne=_(({tasks:e,selectedIndex:t,selecttask:o,togglecomplete:r,indent:n,outdent:i,moveup:d,movedown:b,edittask:p})=>{const s=V();return Pe(s,"keydown",l=>{if(e.length===0)return;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","Enter"].includes(l.key)&&!l.ctrlKey&&l.preventDefault(),l.key==="ArrowUp")if(l.ctrlKey)l.preventDefault(),d(t);else{const y=t>0?t-1:e.length-1;o(y)}else if(l.key==="ArrowDown")if(l.ctrlKey)l.preventDefault(),b(t);else{const y=t<e.length-1?t+1:0;o(y)}else l.key==="ArrowRight"?n(t):l.key==="ArrowLeft"?i(t):l.key==="Space"?t>=0&&t<e.length&&r(e[t].id):l.key==="Enter"&&t>=0&&t<e.length&&p(e[t].id)}),a("host",{shadowDom:!0,children:a("div",{class:"list-container",tabindex:0,ref:s,"aria-label":"Task Tree List",children:e.length===0?u("div",{class:"empty-state",children:[a("svg",{class:"empty-icon",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5",d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"})}),a("p",{class:"empty-text",children:"No tasks found. Click inside the form to add one!"})]}):e.map((l,m)=>{const y=m===t,h=`priority-${l.priority.toLowerCase()}`;return u("div",{class:`task-card-wrapper ${y?"selected":""} ${l.completed?"completed":""}`,style:{marginLeft:`${l.level*24}px`},onclick:()=>o(m),children:[a("div",{class:"task-card-accent"}),u("div",{class:"task-card-content",children:[u("div",{class:"task-header",children:[u("div",{class:"title-row",children:[a("span",{class:`priority-badge ${h}`,children:l.priority}),a("h4",{class:"task-title",children:l.title})]}),a("div",{class:"checkbox-wrapper",onclick:x=>x.stopPropagation(),children:a("input",{type:"checkbox",checked:l.completed,onchange:()=>r(l.id)})})]}),l.description?a("p",{class:"task-desc",children:l.description}):null,l.dueDate?u("div",{class:"task-meta",children:[a("svg",{class:"meta-icon",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),u("span",{class:"meta-text",children:["Due: ",l.dueDate]})]}):null]})]},l.id)})})})},{props:{tasks:{type:Array,value:()=>[]},selectedIndex:{type:Number,value:()=>-1},selecttask:N({bubbles:!0,composed:!0}),togglecomplete:N({bubbles:!0,composed:!0}),indent:N({bubbles:!0,composed:!0}),outdent:N({bubbles:!0,composed:!0}),moveup:N({bubbles:!0,composed:!0}),movedown:N({bubbles:!0,composed:!0}),edittask:N({bubbles:!0,composed:!0})},styles:R`
        :host {
            display: block;
            width: 100%;
        }

        .list-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 4px;
            min-height: 400px;
            max-height: 65vh;
            overflow-y: auto;
            outline: none;
        }

        /* Keyboard focus styling for the entire container */
        .list-container:focus-visible {
            box-shadow: inset 0 0 0 2px rgba(99, 102, 241, 0.2);
            border-radius: 8px;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 60px 20px;
            text-align: center;
            background: rgba(22, 24, 30, 0.4);
            border: 1px dashed rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #6b7280;
        }

        .empty-icon {
            width: 48px;
            height: 48px;
            stroke-width: 1.5;
        }

        .empty-text {
            font-size: 0.95rem;
        }

        .task-card-wrapper {
            display: flex;
            position: relative;
            background: rgba(22, 24, 30, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .task-card-wrapper:hover {
            background: rgba(30, 33, 42, 0.8);
            border-color: rgba(255, 255, 255, 0.12);
            transform: translateY(-1px);
        }

        /* Glowing selection styling */
        .task-card-wrapper.selected {
            background: rgba(30, 33, 42, 0.9);
            border-color: #6366f1;
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.25), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        .task-card-accent {
            width: 4px;
            background: rgba(255, 255, 255, 0.1);
            transition: background 0.2s ease;
        }

        .priority-high .task-card-accent {
            background: #f43f5e;
        }

        .priority-medium .task-card-accent {
            background: #8b5cf6;
        }

        .priority-low .task-card-accent {
            background: #10b981;
        }

        .selected .task-card-accent {
            background: #6366f1;
        }

        .task-card-content {
            flex: 1;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
        }

        .title-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .task-title {
            font-size: 1rem;
            font-weight: 600;
            color: #f3f4f6;
            margin: 0;
            transition: color 0.2s ease;
        }

        .completed .task-title {
            color: #6b7280;
            text-decoration: line-through;
        }

        .priority-badge {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 6px;
            border-radius: 4px;
            letter-spacing: 0.05em;
        }

        .priority-high {
            background: rgba(244, 63, 94, 0.1);
            color: #f43f5e;
            border: 1px solid rgba(244, 63, 94, 0.2);
        }

        .priority-medium {
            background: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .priority-low {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
        }

        input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            background: transparent;
            cursor: pointer;
            position: relative;
            outline: none;
            transition: all 0.2s ease;
        }

        input[type="checkbox"]:hover {
            border-color: rgba(99, 102, 241, 0.6);
        }

        input[type="checkbox"]:focus-visible {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
        }

        input[type="checkbox"]:checked {
            background: #10b981;
            border-color: #10b981;
        }

        input[type="checkbox"]:checked::after {
            content: "";
            position: absolute;
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        .task-desc {
            font-size: 0.85rem;
            color: #9ca3af;
            margin: 0;
            line-height: 1.4;
        }

        .completed .task-desc {
            color: #4b5563;
        }

        .task-meta {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
            color: #6b7280;
            font-size: 0.78rem;
        }

        .meta-icon {
            width: 14px;
            height: 14px;
        }
    `}),M=e=>{if(e.length===0)return e;const t=e.map(o=>({...o}));t[0].level=0;for(let o=1;o<t.length;o++){const r=t[o-1].level+1;t[o].level>r&&(t[o].level=r)}return t},C=(e,t)=>{const o=t,r=e[t].level;let n=t;for(;n+1<e.length&&e[n+1].level>r;)n++;return{start:o,end:n}},dt=_(()=>{const[e,t]=q(()=>{try{const c=localStorage.getItem("atomico-tasks");return c?JSON.parse(c):[{id:"1",title:"Welcome to Atomico Task Manager! 👋",description:"A keyboard-driven nested todo tree application.",priority:"High",dueDate:"",completed:!1,level:0},{id:"2",title:"Try selecting tasks with ArrowUp / ArrowDown",description:"Press ArrowUp and ArrowDown to navigate through this list.",priority:"Medium",dueDate:"",completed:!1,level:1},{id:"3",title:"Nest and outdent tasks with ArrowRight / ArrowLeft",description:"Use ArrowRight to indent tasks under the item above, or ArrowLeft to outdent.",priority:"Medium",dueDate:"",completed:!1,level:2},{id:"4",title:"Move tasks with Ctrl + ArrowUp / ArrowDown",description:"Use Ctrl + ArrowUp/Down to shift a task and all its subtasks up/down in the tree.",priority:"High",dueDate:"",completed:!1,level:1},{id:"5",title:"Use Space to complete tasks",description:"Press Space to check/uncheck the task checkbox.",priority:"Low",dueDate:"",completed:!1,level:0},{id:"6",title:"Press Enter to edit task details",description:"Pressing Enter focuses details on the form to the right.",priority:"Low",dueDate:"",completed:!1,level:0}]}catch{return[]}});W(()=>{localStorage.setItem("atomico-tasks",JSON.stringify(e))},[e]);const[o,r]=ke({query:"",priority:"All",startDate:"",endDate:""}),[n,i]=q(0),[d,b]=q(null),p=c=>{if(o.query.trim()){const w=o.query.toLowerCase(),g=c.title.toLowerCase().includes(w),f=c.description.toLowerCase().includes(w);if(!g&&!f)return!1}return!(o.priority!=="All"&&c.priority!==o.priority||o.startDate&&(!c.dueDate||c.dueDate<o.startDate)||o.endDate&&(!c.dueDate||c.dueDate>o.endDate))},s=e.filter(p);W(()=>{s.length===0?i(-1):n>=s.length?i(s.length-1):n<0&&s.length>0&&i(0)},[s.length,n]);const l=n>=0&&n<s.length?s[n]:null,m=d&&e.find(c=>c.id===d)||null,y=c=>{if(c.id){const w=e.map(g=>g.id===c.id?{...g,title:c.title||"",description:c.description||"",priority:c.priority||"Medium",dueDate:c.dueDate||""}:g);t(w),b(null)}else{const w=String(Date.now()),g={id:w,title:c.title||"",description:c.description||"",priority:c.priority||"Medium",dueDate:c.dueDate||"",completed:!1,level:0};let f=[...e];if(l){const T=e.findIndex(E=>E.id===l.id),{end:v}=C(e,T);g.level=e[T].level,f.splice(v+1,0,g)}else f.push(g);const k=M(f);t(k),setTimeout(()=>{const v=k.filter(p).findIndex(E=>E.id===w);v!==-1&&i(v)},0)}},h=c=>{const w=e.map(g=>g.id===c?{...g,completed:!g.completed}:g);t(w)},x=c=>{if(c<0||c>=s.length)return;const w=s[c],g=e.findIndex(f=>f.id===w.id);if(g>0&&e[g].level<=e[g-1].level){const{start:f,end:k}=C(e,g),T=e.map((v,E)=>E>=f&&E<=k?{...v,level:v.level+1}:v);t(M(T))}},A=c=>{if(c<0||c>=s.length)return;const w=s[c],g=e.findIndex(f=>f.id===w.id);if(e[g].level>0){const{start:f,end:k}=C(e,g),T=e.map((v,E)=>E>=f&&E<=k?{...v,level:v.level-1}:v);t(M(T))}},S=c=>{if(c<0||c>=s.length)return;const w=s[c],g=e.findIndex(T=>T.id===w.id),{start:f,end:k}=C(e,g);if(f>0){const T=e.slice(f,k+1),v=[...e.slice(0,f),...e.slice(k+1)],E=[...v.slice(0,f-1),...T,...v.slice(f-1)],L=M(E);t(L),setTimeout(()=>{const j=L.filter(p).findIndex(U=>U.id===w.id);j!==-1&&i(j)},0)}},z=c=>{if(c<0||c>=s.length)return;const w=s[c],g=e.findIndex(T=>T.id===w.id),{start:f,end:k}=C(e,g);if(k<e.length-1){const T=k+1,v=C(e,T),E=e.slice(f,k+1),L=[...e.slice(0,f),...e.slice(k+1)],H=v.end-(k-f+1)+1,j=[...L.slice(0,H),...E,...L.slice(H)],U=M(j);t(U),setTimeout(()=>{const te=U.filter(p).findIndex(Se=>Se.id===w.id);te!==-1&&i(te)},0)}};return a("host",{shadowDom:!0,children:u("div",{class:"manager-layout",children:[u("header",{class:"app-header",children:[u("div",{class:"logo-area",children:[a("svg",{class:"logo-icon",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"})}),a("h1",{children:"AetherTasks"})]}),a("span",{class:"logo-badge",children:"Atomico.js"})]}),u("main",{class:"app-body",children:[a("div",{class:"top-row",children:a(Te,{query:o.query,priority:o.priority,startDate:o.startDate,endDate:o.endDate,onfilterchange:c=>r(c.detail)})}),u("div",{class:"content-row",children:[u("section",{class:"task-list-section glass-panel",children:[u("div",{class:"section-header",children:[a("h2",{class:"section-title",children:"Tasks Tree"}),u("span",{class:"task-count",children:[s.filter(c=>c.completed).length," / ",s.length," Completed"]})]}),a(Ne,{tasks:s,selectedIndex:n,onselecttask:c=>i(c.detail),ontogglecomplete:c=>h(c.detail),onindent:c=>x(c.detail),onoutdent:c=>A(c.detail),onmoveup:c=>S(c.detail),onmovedown:c=>z(c.detail),onedittask:c=>b(c.detail)})]}),u("aside",{class:"task-form-section",children:[a(ve,{selectedTask:m,onsubmittask:c=>y(c.detail),oncanceledit:()=>b(null)}),u("div",{class:"info-card glass-panel",children:[a("h4",{class:"info-title",children:"Keyboard Mode Active"}),a("p",{class:"info-text",children:"Click inside the **Tasks Tree** list panel to focus it. Once focused, you can manage all tasks entirely using hotkeys shown below."})]})]})]})]}),a("footer",{class:"app-footer",children:a(Ee,{})})]})})},{styles:R`
        :host {
            display: block;
            width: 100%;
            min-height: 100vh;
            padding: 24px 0 0 0;
            box-sizing: border-box;
        }

        .manager-layout {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 0 24px;
        }

        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            background: rgba(22, 24, 30, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 28px;
            height: 28px;
            color: #6366f1;
        }

        h1 {
            font-size: 1.4rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #f3f4f6, #9ca3af);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0;
        }

        .logo-badge {
            font-size: 0.75rem;
            font-weight: 600;
            color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            padding: 4px 10px;
            border-radius: 99px;
            letter-spacing: 0.05em;
        }

        .app-body {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .top-row {
            width: 100%;
        }

        .content-row {
            display: grid;
            grid-template-columns: 1.6fr 1fr;
            gap: 24px;
        }

        @media (max-width: 768px) {
            .content-row {
                grid-template-columns: 1fr;
            }
        }

        .task-list-section {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            padding-bottom: 14px;
        }

        .section-title {
            font-size: 1.15rem;
            font-weight: 600;
            color: #f3f4f6;
            margin: 0;
        }

        .task-count {
            font-size: 0.85rem;
            color: #9ca3af;
            font-weight: 500;
        }

        .task-form-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .info-card {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: rgba(99, 102, 241, 0.03);
            border-color: rgba(99, 102, 241, 0.1);
        }

        .info-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #8b5cf6;
        }

        .info-text {
            font-size: 0.82rem;
            color: #9ca3af;
            line-height: 1.5;
        }

        .app-footer {
            margin-top: 24px;
            margin-bottom: 40px;
        }
    `});customElements.define("task-form",ve);customElements.define("search-bar",Te);customElements.define("shortcuts-footer",Ee);customElements.define("task-list",Ne);customElements.define("task-manager",dt);
