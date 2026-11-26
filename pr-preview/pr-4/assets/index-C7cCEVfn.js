(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Symbol.for(`preact-signals`);function t(){if(o>1)o--;else{var e,t=!1;for((function(){var e=l;for(l=void 0;e!==void 0;){var t=e.S;if(t.v===e.v)for(var n=t.t;n!==void 0;n=n.x)n.i===e.i&&(n.i=t.i);e=e.o}})();a!==void 0;){var n=a;for(a=void 0,s++;n!==void 0;){var r=n.u;if(n.u=void 0,n.f&=-3,!(8&n.f)&&m(n))try{n.c()}catch(n){t||=(e=n,!0)}n=r}}if(s=0,o--,t)throw e}}var n,r=void 0;function i(e){var t=r,i=n;r=void 0,n=void 0;try{return e()}finally{r=t,n=i}}var a=void 0,o=0,s=0,c=0,l=void 0,u=0;function d(e){if(r!==void 0){var t=e.n;if(t===void 0||t.t!==r)return t={i:0,S:e,p:r.s,n:void 0,t:r,e:void 0,x:void 0,r:t},r.s!==void 0&&(r.s.n=t),r.s=t,e.n=t,32&r.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=r.s,t.n=void 0,r.s.n=t,r.s=t),t}}function f(e,t){this.v=e,this.i=0,this.n=void 0,this.t=void 0,this.l=0,this.W=t?.watched,this.Z=t?.unwatched,this.name=t?.name}f.prototype.brand=e,f.prototype.h=function(){return!0},f.prototype.S=function(e){var t=this,n=this.t;n!==e&&e.e===void 0&&(e.x=n,this.t=e,n===void 0?i(function(){var e;(e=t.W)==null||e.call(t)}):n.e=e)},f.prototype.U=function(e){var t=this;if(this.t!==void 0){var n=e.e,r=e.x;n!==void 0&&(n.x=r,e.e=void 0),r!==void 0&&(r.e=n,e.x=void 0),e===this.t&&(this.t=r,r===void 0&&i(function(){var e;(e=t.Z)==null||e.call(t)}))}},f.prototype.subscribe=function(e){var t=this;return x(function(){var n=t.value;i(function(){return e(n)})},{name:`sub`})},f.prototype.valueOf=function(){return this.value},f.prototype.toString=function(){return this.value+``},f.prototype.toJSON=function(){return this.value},f.prototype.peek=function(){var e=this;return i(function(){return e.value})},Object.defineProperty(f.prototype,"value",{get:function(){var e=d(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(s>100)throw Error(`Cycle detected`);(function(e){o!==0&&s===0&&e.l!==c&&(e.l=c,l={S:e,v:e.v,i:e.i,o:l})})(this),this.v=e,this.i++,u++,o++;try{for(var n=this.t;n!==void 0;n=n.x)n.t.N()}finally{t()}}}});function p(e,t){return new f(e,t)}function m(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function h(e){for(var t=e.s;t!==void 0;t=t.n){var n=t.S.n;if(n!==void 0&&(t.r=n),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function g(e){for(var t=e.s,n=void 0;t!==void 0;){var r=t.p;t.i===-1?(t.S.U(t),r!==void 0&&(r.n=t.n),t.n!==void 0&&(t.n.p=r)):n=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=r}e.s=n}function _(e,t){f.call(this,void 0,t),this.x=e,this.s=void 0,this.g=u-1,this.f=4}_.prototype=new f,_.prototype.h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===u))return!0;if(this.g=u,this.f|=1,this.i>0&&!m(this))return this.f&=-2,!0;var e=r;try{h(this),r=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(e){this.v=e,this.f|=16,this.i++}return r=e,g(this),this.f&=-2,!0},_.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}f.prototype.S.call(this,e)},_.prototype.U=function(e){if(this.t!==void 0&&(f.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}},_.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}},Object.defineProperty(_.prototype,"value",{get:function(){if(1&this.f)throw Error(`Cycle detected`);var e=d(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function v(e,t){return new _(e,t)}function ee(e){var n=e.j;if(e.j=void 0,typeof n==`function`){o++;var i=r;r=void 0;try{n()}catch(t){throw e.f&=-2,e.f|=8,y(e),t}finally{r=i,t()}}}function y(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,ee(e)}function te(e){if(r!==this)throw Error(`Out-of-order effect`);g(this),r=e,this.f&=-2;try{8&this.f&&y(this)}finally{t()}}function b(e,t){this.x=e,this.j=void 0,this.s=void 0,this.u=void 0,this.f=32,this.name=t?.name,n&&n.push(this)}b.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t==`function`&&(this.j=t)}finally{e()}},b.prototype.S=function(){if(1&this.f)throw Error(`Cycle detected`);this.f|=1,this.f&=-9,ee(this),h(this),o++;var e=r;return r=this,te.bind(this,e)},b.prototype.N=function(){2&this.f||(this.f|=2,this.u=a,a=this)},b.prototype.d=function(){this.f|=8,1&this.f||y(this)},b.prototype.dispose=function(){this.d()};function x(e,t){var n=new b(e,t);try{n.c()}catch(e){throw n.d(),e}var r=n.d.bind(n);return r[Symbol.dispose]=r,r}var S;(function(e){e.Unimplemented=`UNIMPLEMENTED`,e.Unavailable=`UNAVAILABLE`})(S||={});var ne=class extends Error{constructor(e,t,n){super(e),this.message=e,this.code=t,this.data=n}},re=e=>e?.androidBridge?`android`:e?.webkit?.messageHandlers?.bridge?`ios`:`web`,ie=e=>{let t=e.CapacitorCustomPlatform||null,n=e.Capacitor||{},r=n.Plugins=n.Plugins||{},i=()=>t===null?re(e):t.name,a=()=>i()!==`web`,o=e=>!!(l.get(e)?.platforms.has(i())||s(e)),s=e=>n.PluginHeaders?.find(t=>t.name===e),c=t=>e.console.error(t),l=new Map;return n.convertFileSrc||=e=>e,n.getPlatform=i,n.handleError=c,n.isNativePlatform=a,n.isPluginAvailable=o,n.registerPlugin=(e,a={})=>{let o=l.get(e);if(o)return console.warn(`Capacitor plugin "${e}" already registered. Cannot register plugins twice.`),o.proxy;let c=i(),u=s(e),d,f=async()=>(!d&&c in a?d=d=typeof a[c]==`function`?await a[c]():a[c]:t!==null&&!d&&`web`in a&&(d=d=typeof a.web==`function`?await a.web():a.web),d),p=(t,r)=>{if(u){let i=u?.methods.find(e=>r===e.name);if(i)return i.rtype===`promise`?t=>n.nativePromise(e,r.toString(),t):(t,i)=>n.nativeCallback(e,r.toString(),t,i);if(t)return t[r]?.bind(t)}else if(t)return t[r]?.bind(t);else throw new ne(`"${e}" plugin is not implemented on ${c}`,S.Unimplemented)},m=t=>{let n,r=(...r)=>{let i=f().then(i=>{let a=p(i,t);if(a){let e=a(...r);return n=e?.remove,e}throw new ne(`"${e}.${t}()" is not implemented on ${c}`,S.Unimplemented)});return t===`addListener`&&(i.remove=async()=>n()),i};return r.toString=()=>`${t.toString()}() { [capacitor code] }`,Object.defineProperty(r,"name",{value:t,writable:!1,configurable:!1}),r},h=m(`addListener`),g=m(`removeListener`),_=(e,t)=>{let n=h({eventName:e},t).then(e=>e),r=async()=>{let t=await n;await g({eventName:e,callbackId:t})},i=new Promise(e=>n.then(()=>e({remove:r})));return i.remove=async()=>{console.warn(`Using addListener() without 'await' is deprecated.`),await r()},i},v=new Proxy({},{get(e,t){switch(t){case`$$typeof`:return;case`toJSON`:return()=>({});case`addListener`:return u?_:h;case`removeListener`:return g;default:return m(t)}}});return r[e]=v,l.set(e,{name:e,proxy:v,platforms:new Set([...Object.keys(a),...u?[c]:[]])}),v},n.Exception=ne,n.DEBUG=!!n.DEBUG,n.isLoggingEnabled=!!n.isLoggingEnabled,n},C=(e=>e.Capacitor=ie(e))(typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{}),w=C.registerPlugin,ae=class{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let n=!1;this.listeners[e]||(this.listeners[e]=[],n=!0),this.listeners[e].push(t);let r=this.windowListeners[e];return r&&!r.registered&&this.addWindowListener(r),n&&this.sendRetainedArgumentsForEvent(e),Promise.resolve({remove:async()=>this.removeListener(e,t)})}async removeAllListeners(){this.listeners={};for(let e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,n){let r=this.listeners[e];if(r)r.forEach(e=>e(t));else if(n){let n=this.retainedEventArguments[e];n||=[],n.push(t),this.retainedEventArguments[e]=n}}hasListeners(e){return!!this.listeners[e]?.length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:e=>{this.notifyListeners(t,e)}}}unimplemented(e=`not implemented`){return new C.Exception(e,S.Unimplemented)}unavailable(e=`not available`){return new C.Exception(e,S.Unavailable)}async removeListener(e,t){let n=this.listeners[e];if(!n)return;let r=n.indexOf(t);r!==-1&&this.listeners[e].splice(r,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){let t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(t=>{this.notifyListeners(e,t)}))}},oe=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),se=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent),ce=class extends ae{async getCookies(){let e=document.cookie,t={};return e.split(`;`).forEach(e=>{if(e.length<=0)return;let[n,r]=e.replace(/=/,`CAP_COOKIE`).split(`CAP_COOKIE`);n=se(n).trim(),r=se(r).trim(),t[n]=r}),t}async setCookie(e){try{let t=oe(e.key),n=oe(e.value),r=e.expires?`; expires=${e.expires.replace(`expires=`,``)}`:``,i=(e.path||`/`).replace(`path=`,``),a=e.url!=null&&e.url.length>0?`domain=${e.url}`:``;document.cookie=`${t}=${n||``}${r}; path=${i}; ${a};`}catch(e){return Promise.reject(e)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(e){return Promise.reject(e)}}async clearCookies(){try{let e=document.cookie.split(`;`)||[];for(let t of e)document.cookie=t.replace(/^ +/,``).replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}};w(`CapacitorCookies`,{web:()=>new ce});var le=async e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{let e=r.result;t(e.indexOf(`,`)>=0?e.split(`,`)[1]:e)},r.onerror=e=>n(e),r.readAsDataURL(e)}),ue=(e={})=>{let t=Object.keys(e);return Object.keys(e).map(e=>e.toLocaleLowerCase()).reduce((n,r,i)=>(n[r]=e[t[i]],n),{})},de=(e,t=!0)=>e?Object.entries(e).reduce((e,n)=>{let[r,i]=n,a,o;return Array.isArray(i)?(o=``,i.forEach(e=>{a=t?encodeURIComponent(e):e,o+=`${r}=${a}&`}),o.slice(0,-1)):(a=t?encodeURIComponent(i):i,o=`${r}=${a}`),`${e}&${o}`},``).substr(1):null,fe=(e,t={})=>{let n=Object.assign({method:e.method||`GET`,headers:e.headers},t),r=ue(e.headers)[`content-type`]||``;if(typeof e.data==`string`)n.body=e.data;else if(r.includes(`application/x-www-form-urlencoded`)){let t=new URLSearchParams;for(let[n,r]of Object.entries(e.data||{}))t.set(n,r);n.body=t.toString()}else if(r.includes(`multipart/form-data`)||e.data instanceof FormData){let t=new FormData;if(e.data instanceof FormData)e.data.forEach((e,n)=>{t.append(n,e)});else for(let n of Object.keys(e.data))t.append(n,e.data[n]);n.body=t;let r=new Headers(n.headers);r.delete(`content-type`),n.headers=r}else(r.includes(`application/json`)||typeof e.data==`object`)&&(n.body=JSON.stringify(e.data));return n},pe=class extends ae{async request(e){let t=fe(e,e.webFetchExtra),n=de(e.params,e.shouldEncodeUrlParams),r=n?`${e.url}?${n}`:e.url,i=await fetch(r,t),a=i.headers.get(`content-type`)||``,{responseType:o=`text`}=i.ok?e:{};a.includes(`application/json`)&&(o=`json`);let s,c;switch(o){case`arraybuffer`:case`blob`:c=await i.blob(),s=await le(c);break;case`json`:s=await i.json();break;default:s=await i.text()}let l={};return i.headers.forEach((e,t)=>{l[t]=e}),{data:s,headers:l,status:i.status,url:i.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:`GET`}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:`POST`}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:`PUT`}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:`PATCH`}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:`DELETE`}))}};w(`CapacitorHttp`,{web:()=>new pe});var me;(function(e){e.Dark=`DARK`,e.Light=`LIGHT`,e.Default=`DEFAULT`})(me||={});var he;(function(e){e.StatusBar=`StatusBar`,e.NavigationBar=`NavigationBar`})(he||={});var ge=class extends ae{async setStyle(){this.unavailable(`not available for web`)}async setAnimation(){this.unavailable(`not available for web`)}async show(){this.unavailable(`not available for web`)}async hide(){this.unavailable(`not available for web`)}};w(`SystemBars`,{web:()=>new ge});var _e={theme:`system`,dnd:!0,vibrate:!1},ve=`jabuto`,ye=1;function be(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error)})}function xe(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error),e.onabort=()=>n(e.error)})}function Se(){let e=indexedDB.open(ve,ye);return e.onupgradeneeded=()=>{let t=e.result;t.createObjectStore(`kv`),t.createObjectStore(`log`,{keyPath:`id`})},be(e)}async function Ce(){let e=await Se();navigator.storage?.persist?.();let t=async t=>be(e.transaction(`kv`).objectStore(`kv`).get(t)),n=async(t,n)=>{let r=e.transaction(`kv`,`readwrite`);r.objectStore(`kv`).put(n,t),await xe(r)};return{loadPresets:async()=>await t(`presets`)??null,savePresets:e=>n(`presets`,e),loadLog:async()=>(await be(e.transaction(`log`).objectStore(`log`).getAll())).sort((e,t)=>e.startedAt.localeCompare(t.startedAt)),addLogEntry:async t=>{let n=e.transaction(`log`,`readwrite`);n.objectStore(`log`).put(t),await xe(n)},replaceAll:async(t,n)=>{let r=e.transaction([`kv`,`log`],`readwrite`);r.objectStore(`kv`).put(t,`presets`);let i=r.objectStore(`log`);i.clear();for(let e of n)i.put(e);await xe(r)},loadSettings:async()=>({..._e,...await t(`settings`)}),saveSettings:e=>n(`settings`,e)}}var T=w(`Session`);function we(e){return{id:e.request.sessionId,startedAt:e.request.startedAt,preset:e.request.preset,plan:e.request.plan,activeSeconds:e.activeSeconds,pauseDuration:e.pauseDuration,ending:e.ending}}function Te(){let e=null,t=null,n=null,r=new Set,i=new Set,a=()=>{if(!e||!t)return null;let n=t.paused?0:(performance.now()-t.at)/1e3;return{request:e,elapsed:t.elapsed+n,paused:t.paused,notice:t.notice}},o=()=>{let e=a();for(let t of r)t(e)},s=()=>{n&&clearInterval(n),n=null},c=()=>{e=null,t=null,s(),o()},l=r=>{r.request&&(e=r.request),r.elapsed===void 0?c():(t={elapsed:r.elapsed,at:performance.now(),paused:!!r.paused,notice:r.notice??null},n||=setInterval(o,200),o())};return T.addListener(`tick`,l),T.addListener(`finished`,async({record:e})=>{c();let t=we(e);for(let e of i)e(t);await T.clearJournal()}),document.addEventListener(`visibilitychange`,async()=>{document.visibilityState===`visible`&&e&&l(await T.state())}),{async start(r){e=r,t={elapsed:0,at:performance.now(),paused:!1,notice:null},await T.start({request:r}),n||=setInterval(o,200),o()},pause:()=>void T.pause(),resume:()=>void T.resume(),async stop(){let{record:e}=await T.stop();return c(),e?we(e):null},subscribe(e){return r.add(e),e(a()),()=>r.delete(e)},onFinished(e){return i.add(e),()=>i.delete(e)},async active(){let e=await T.state();return e.request?(l(e),a()):null},async recover(){let{record:e}=await T.recover();return e?we(e):null},preview:e=>T.preview({sound:e}),stopPreview:()=>void T.stopPreview()}}async function Ee(){return{storage:await Ce(),runner:Te(),files:{async save(e,t){await T.saveFile({name:e,text:t})},async open(){return(await T.openFile()).text??null}},device:{native:!0,dndAccess:async()=>(await T.dndAccess()).access,requestDndAccess:async()=>(await T.requestDndAccess()).access,requestNotifications:async()=>(await T.requestNotifications()).access,onBack:e=>void T.addListener(`back`,e),exit:()=>void T.exit()}}}var De={async save(e,t){let n=URL.createObjectURL(new Blob([t],{type:`application/json`})),r=document.createElement(`a`);r.href=n,r.download=e,r.click(),setTimeout(()=>URL.revokeObjectURL(n),1e4)},open(){return new Promise(e=>{let t=document.createElement(`input`);t.type=`file`,t.accept=`application/json,.json`,t.addEventListener(`change`,async()=>{let n=t.files?.[0];e(n?await n.text():null)}),t.addEventListener(`cancel`,()=>e(null)),t.click()})}},Oe=[];globalThis.__jabuto={scheduledStrikes:Oe};var ke=()=>typeof Audio<`u`&&new Audio().canPlayType(`audio/ogg; codecs="vorbis"`)?`ogg`:`mp3`;function Ae(){let e=null,t=new Map,n=null,r=null,i=null,a=null,o=new Set,s=new Set;function c(){if(!e){e=new AudioContext;let t=navigator.audioSession;t&&(t.type=`playback`)}return e.resume(),e}function l(e){let n=t.get(e);if(!n){let r=c();n=fetch(new URL(`sounds/${e}.${ke()}`,document.baseURI)).then(e=>e.arrayBuffer()).then(e=>r.decodeAudioData(e)).catch(()=>null),t.set(e,n)}return n}let u=()=>performance.now();function d(e){let t=e.pausedMs+(e.pauseStart===null?0:u()-e.pauseStart);return(u()-e.t0-t)/1e3}function f(){return n?{request:n.request,elapsed:d(n),paused:n.pauseStart!==null,notice:null}:null}function p(){let e=f();for(let t of o)t(e);n&&e&&e.elapsed>=n.request.plan.capAt&&y(`cap`)}function m(e){let t=c(),r=d(e);for(let i of e.request.plan.strikes)i.at<r-.05||l(i.sound).then(r=>{if(!r||n!==e||e.pauseStart!==null)return;let a=i.at-d(e);if(a<-.25)return;let o=t.createBufferSource();o.buffer=r,o.connect(t.destination),o.start(t.currentTime+Math.max(0,a)),e.scheduled.push(o),Oe.push(i),e.request.vibrate&&`vibrate`in navigator&&e.vibrations.push(window.setTimeout(()=>navigator.vibrate(200),Math.max(0,a)*1e3))})}function h(t){let n=e?.currentTime??0;for(let e of t.scheduled)try{e.stop(n)}catch{}t.scheduled=[];for(let e of t.vibrations)clearTimeout(e);t.vibrations=[]}async function g(){try{i=await navigator.wakeLock?.request(`screen`)??null}catch{i=null}}function _(){document.visibilityState===`visible`&&n&&(g(),p())}function v(e,t){let{request:n}=e;return{id:n.sessionId,startedAt:n.startedAt,preset:n.preset,plan:n.plan,activeSeconds:Math.min(d(e),n.plan.capAt),pauseDuration:(e.pausedMs+(e.pauseStart===null?0:u()-e.pauseStart))/1e3,ending:t}}function ee(){n&&h(n),n=null,r&&clearInterval(r),r=null,i?.release().catch(()=>{}),i=null,document.removeEventListener(`visibilitychange`,_),p()}function y(e){if(!n)return null;let t=v(n,e);if(ee(),e===`cap`)for(let e of s)e(t);return t}return{async start(e){c(),n&&ee(),n={request:e,t0:u(),pausedMs:0,pauseStart:null,scheduled:[],vibrations:[]},Oe.length=0,m(n),r=setInterval(p,200),document.addEventListener(`visibilitychange`,_),await g(),p()},pause(){n&&n.pauseStart===null&&(n.pauseStart=u(),h(n),p())},resume(){n&&n.pauseStart!==null&&(n.pausedMs+=u()-n.pauseStart,n.pauseStart=null,m(n),p())},async stop(){return y(`user`)},subscribe(e){return o.add(e),e(f()),()=>o.delete(e)},onFinished(e){return s.add(e),()=>s.delete(e)},async active(){return f()},async recover(){return null},async preview(e){this.stopPreview();let t=c(),n=await l(e);if(!n)return;let r=t.createBufferSource();r.buffer=n,r.connect(t.destination),a=r,await new Promise(e=>{r.onended=()=>e(),r.start()}),a===r&&(a=null)},stopPreview(){try{a?.stop()}catch{}a=null}}}var je={native:!1,dndAccess:async()=>`denied`,requestDndAccess:async()=>`denied`,requestNotifications:async()=>`denied`};async function Me(){return C.isNativePlatform()?Ee():{storage:await Ce(),runner:Ae(),files:De,device:je}}var Ne=3600;function Pe(e,t,n){if(e.sound===`silent`)return[];let r=e.sound;return Array.from({length:e.strikes},(e,i)=>({at:t+i*4,role:n,sound:r}))}function Fe(e){let t=e.warmupDuration,n=t+e.meditationDuration,r=e.intervalSound,i=r===`silent`?[]:e.intervalBells.map(e=>({at:t+e,role:`interval`,sound:r})),a=Pe(e.endBell,n,`end`),o=a.at(-1);return{warmupDuration:t,meditationDuration:e.meditationDuration,endAt:n,capAt:n+Ne,dndUntil:o?o.at+10:n,strikes:[...Pe(e.startBell,t,`start`),...i,...a]}}function Ie(e,t){return t<e.warmupDuration?{phase:`warmup`,remaining:e.warmupDuration-t}:t<e.endAt?{phase:`sitting`,remaining:e.endAt-t}:t<e.capAt?{phase:`overtime`,overtime:t-e.endAt}:{phase:`capped`,overtime:Ne}}var Le=(e,t,n)=>Math.round(Math.min(n,Math.max(t,e)));function Re(e){let{plan:t,activeSeconds:n}=e;if(n<t.warmupDuration)return null;let r=n>=t.endAt,{id:i,...a}=e.preset;return{id:e.id,startedAt:e.startedAt,presetId:i,preset:a,warmupDuration:t.warmupDuration,meditationDuration:Le(n-t.warmupDuration,0,t.meditationDuration),pauseDuration:Math.round(Math.max(0,e.pauseDuration)),overtimeDuration:Le(n-t.endAt,0,Ne),outcome:r?`completed`:e.ending===`interrupted`?`interrupted`:`endedEarly`}}var E={nameMax:24,meditationMin:30,meditationMax:10800,warmupMax:600,endGap:5},ze=(e,t,n)=>Math.min(n,Math.max(t,Math.round(e)));function Be(e){return{id:e,name:`Sit`,warmupDuration:0,meditationDuration:600,startBell:{sound:`bowl`,strikes:1},intervalBells:[],intervalSound:`small-bell`,endBell:{sound:`bowl`,strikes:3}}}function Ve(e){let t=e.trim();return t.length>0&&t.length<=E.nameMax?t:null}function D(e,t){return Number.isInteger(e)&&e>0&&e<t-E.endGap}function He(e,t){let n=ze(t,E.meditationMin,E.meditationMax);return{...e,meditationDuration:n,intervalBells:e.intervalBells.filter(e=>D(e,n))}}function Ue(e,t){return{...e,warmupDuration:ze(t,0,E.warmupMax)}}function We(e,t){let n=[0,...e,t],r=null,i=0;for(let a=1;a<n.length;a++){let o=n[a-1],s=n[a]-o,c=Math.round(o+s/2);s>i&&D(c,t)&&!e.includes(c)&&(i=s,r=c)}return r}function Ge(e,t){return!D(t,e.meditationDuration)||e.intervalBells.includes(t)?e:{...e,intervalBells:[...e.intervalBells,t].sort((e,t)=>e-t)}}function Ke(e,t){return{...e,intervalBells:e.intervalBells.filter(e=>e!==t)}}var qe=[{id:`bowl`,name:`Bowl`},{id:`small-bell`,name:`Small bell`},{id:`deep-bell`,name:`Deep bell`},{id:`chime`,name:`Chime`},{id:`wood`,name:`Wood`}],Je=[`silent`,...qe.map(e=>e.id)];function O(e){return e===`silent`?`Silent`:qe.find(t=>t.id===e)?.name??e}var k=e=>String(e).padStart(2,`0`);function Ye(e){let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=e%60;return t>0?`${t}:${k(n)}:${k(r)}`:`${k(n)}:${k(r)}`}function A(e){return Ye(Math.max(0,Math.ceil(e)))}function Xe(e){return`+`+Ye(Math.max(0,Math.floor(e)))}function Ze(e){let t=-e.getTimezoneOffset(),n=t>=0?`+`:`-`,r=Math.abs(t);return`${e.getFullYear()}-${k(e.getMonth()+1)}-${k(e.getDate())}T${k(e.getHours())}:${k(e.getMinutes())}:${k(e.getSeconds())}${n}${k(Math.floor(r/60))}:${k(r%60)}`}function Qe(e){return e.slice(0,10)}function $e(e=new Date){return Qe(Ze(e))}function et(e,t){let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),n.toISOString().slice(0,10)}function tt(e){let t=e.trim();if(/^\d{1,3}$/.test(t))return Number(t)*60;let n=t.split(`:`);if(n.length<2||n.length>3||!n.every(e=>/^\d{1,3}$/.test(e)))return null;let r=n.map(Number),i=r.at(-1),a=r.at(-2);return i>=60||n.length===3&&a>=60?null:(n.length===3?r[0]:0)*3600+a*60+i}function nt(e){return e.outcome===`completed`||e.meditationDuration>=60}function rt(e,t){let n=new Set(e.filter(nt).map(e=>Qe(e.startedAt))),r=n.has(t)?t:et(t,-1),i=0;for(;n.has(r);)i++,r=et(r,-1);return i}var it=`net.litynski.jabuto`,at={};function ot(e,t,n=new Date){let r={schemaVersion:1,app:it,exportedAt:Ze(n),presets:e,sessions:t};return JSON.stringify(r,null,2)}function st(e=new Date){return`jabuto-${$e(e)}.json`}var j=e=>typeof e==`object`&&!!e&&!Array.isArray(e),M=(e,t,n)=>Number.isInteger(e)&&e>=t&&e<=n,ct=e=>typeof e==`string`&&e.length>0,lt=[`completed`,`endedEarly`,`interrupted`],ut=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;function dt(e){return j(e)&&Je.includes(e.sound)&&M(e.strikes,1,3)}function ft(e){let t=e.name;return typeof t==`string`&&t.trim()===t&&t.length>0&&t.length<=E.nameMax&&M(e.warmupDuration,0,E.warmupMax)&&M(e.meditationDuration,E.meditationMin,E.meditationMax)&&dt(e.startBell)&&dt(e.endBell)&&Je.includes(e.intervalSound)&&Array.isArray(e.intervalBells)&&e.intervalBells.every(t=>D(t,e.meditationDuration))}function pt(e){return j(e)&&ct(e.id)&&ft(e)}function mt(e){return j(e)&&ct(e.id)&&typeof e.startedAt==`string`&&ut.test(e.startedAt)&&(e.presetId===null||ct(e.presetId))&&j(e.preset)&&ft(e.preset)&&M(e.warmupDuration,0,E.warmupMax)&&M(e.meditationDuration,0,E.meditationMax)&&M(e.pauseDuration,0,2**53-1)&&M(e.overtimeDuration,0,3600)&&lt.includes(e.outcome)}function ht(e){let t;try{t=JSON.parse(e)}catch{return{ok:!1,reason:`invalid`}}if(!j(t))return{ok:!1,reason:`invalid`};if(t.app!==`net.litynski.jabuto`)return{ok:!1,reason:`otherApp`};if(!M(t.schemaVersion,1,2**53-1))return{ok:!1,reason:`invalid`};if(t.schemaVersion>1)return{ok:!1,reason:`newerVersion`};let n=t;for(let e=t.schemaVersion;e<1;e++){let t=at[e];if(!t)return{ok:!1,reason:`invalid`};n=t(n)}let{presets:r,sessions:i}=n;return!Array.isArray(r)||!r.every(pt)||!Array.isArray(i)||!i.every(mt)||new Set(r.map(e=>e.id)).size!==r.length?{ok:!1,reason:`invalid`}:{ok:!0,presets:r,sessions:i}}function gt(e){let[t,n,r,i]=e.replace(/^#\/?/,``).split(`/`).filter(Boolean).map(decodeURIComponent);return t===`preset`&&n&&r===`sound`&&(i===`start`||i===`interval`||i===`end`)?{name:`sound`,id:n,role:i}:t===`preset`&&n&&!r?{name:`preset`,id:n}:t===`session`?{name:`session`}:t===`setup`?{name:`setup`}:t===`licences`?{name:`licences`}:{name:`home`}}function N(e){switch(e.name){case`home`:return`#/`;case`preset`:return`#/preset/${encodeURIComponent(e.id)}`;case`sound`:return`#/preset/${encodeURIComponent(e.id)}/sound/${e.role}`;default:return`#/${e.name}`}}var _t=p(gt(location.hash)),vt=null,P=location.hash||`#/`,F=[P];function yt(e){vt=e}window.addEventListener(`hashchange`,()=>{let e=gt(location.hash);vt&&!vt(e)?history.pushState(null,``,P):(P=location.hash||`#/`,F.at(-2)===P?F.pop():F.push(P),_t.value=e)});function I(e,t={}){let n=N(e);t.replace?(history.replaceState(null,``,n),P=n,F[F.length-1]=n,_t.value=e):location.hash!==n&&(location.hash=n)}function bt(e){F.at(-2)===N(e)?history.back():I(e,{replace:!0})}function xt(){return _t.value.name!==`home`&&(F.length>1?history.back():I({name:`home`},{replace:!0}),!0)}var L,R=p([]),z=p([]),B=p(_e),V=p(null),H=p(!1),U=p(!1),W=p(null);function St(e){return new Promise(t=>{W.value={text:e,answer:e=>{W.value=null,t(e)}}})}var Ct=p($e()),wt=v(()=>rt(z.value,Ct.value));function Tt(){return L}async function Et(e){L=e;let{storage:t,runner:n}=e,[r,i,a]=await Promise.all([t.loadPresets(),t.loadLog(),t.loadSettings()]);B.value=a,z.value=i,r===null?(R.value=[Be(crypto.randomUUID())],await t.savePresets(R.value)):R.value=r,e.device.native&&(U.value=a.dnd&&await e.device.dndAccess()===`denied`);let o=await n.recover();o&&await Dt(o),n.subscribe(e=>V.value=e),n.onFinished(e=>void Ot(e));let s=await n.active();s&&(V.value=s,kt(),I({name:`session`},{replace:!0})),e.device.onBack?.(()=>{W.value?W.value.answer(!1):H.value?Ut():xt()||e.device.exit?.()}),setInterval(()=>Ct.value=$e(),6e4),document.addEventListener(`visibilitychange`,()=>Ct.value=$e())}async function Dt(e){let t=Re(e);t&&(await L.storage.addLogEntry(t),z.value=[...z.value,t])}async function Ot(e){yt(null),H.value=!1,e&&await Dt(e),I({name:`home`},{replace:!0})}function kt(){yt(e=>e.name===`session`||(H.value=!0,!1))}async function G(e){R.value=e,await L.storage.savePresets(e)}function At(e){return R.value.find(t=>t.id===e)}function K(e){G(R.value.map(t=>t.id===e.id?e:t))}function jt(){let e=Be(crypto.randomUUID());return G([...R.value,e]),e}function Mt(e){G(R.value.filter(t=>t.id!==e))}function Nt(e){let t=new Map(R.value.map(e=>[e.id,e])),n=e.map(e=>t.get(e)).filter(e=>e!==void 0);n.length===R.value.length&&G(n)}function Pt(e){B.value={...B.value,...e},L.storage.saveSettings(B.value)}async function Ft(e){Pt({dnd:e}),L.device.native&&(U.value=e&&await L.device.dndAccess()===`denied`)}async function It(){U.value=await L.device.requestDndAccess()===`denied`}var Lt=`jabuto.permissionsAsked`;async function Rt(){let{device:e}=L;if(!e.native)return;let t=!1;try{t=localStorage.getItem(Lt)===`1`,localStorage.setItem(Lt,`1`)}catch{}t||(B.value.dnd&&await e.dndAccess()===`denied`&&(U.value=!await St(`Jabuto turns on Do Not Disturb from warmup to the end bell. Allow it on the next screen.`)||await e.requestDndAccess()===`denied`),await St(`Jabuto shows the time left, Pause and End in a notification while you sit.`)&&await e.requestNotifications())}async function zt(e){let{runner:t}=L,n={sessionId:crypto.randomUUID(),startedAt:Ze(new Date),preset:e,plan:Fe(e),dnd:B.value.dnd,vibrate:B.value.vibrate};L.device.native&&await Rt(),await t.start(n),kt(),I({name:`session`})}function Bt(){L.runner.pause()}function Vt(){L.runner.resume()}async function Ht(){await Ot(await L.runner.stop())}function Ut(){H.value=!1}async function Wt(){await L.files.save(st(),ot(R.value,z.value))}async function Gt(){let e=await L.files.open();return e===null?null:ht(e)}async function Kt(e){await L.storage.replaceAll(e.presets,e.sessions),R.value=e.presets,z.value=[...e.sessions].sort((e,t)=>e.startedAt.localeCompare(t.startedAt))}function q(e,t={},...n){let r=document.createElement(e);t.class&&(r.className=t.class),t.text!==void 0&&(r.textContent=t.text);for(let[e,n]of Object.entries(t.attrs??{}))n===!0?r.setAttribute(e,``):n!==!1&&n!==void 0&&r.setAttribute(e,n);for(let[e,n]of Object.entries(t.on??{}))r.addEventListener(e,n);for(let e of n)e!==null&&e!==!1&&e!==void 0&&r.append(e);return r}var J=class extends HTMLElement{disposers=[];connectedCallback(){this.classList.add(`screen`),this.replaceChildren(...this.render().filter(e=>e!==null))}disconnectedCallback(){for(let e of this.disposers.splice(0))e()}bind(e){this.disposers.push(x(e))}own(e){this.disposers.push(e)}};function Y(e,t){e.textContent!==t&&(e.textContent=t)}function X(...e){return q(`header`,{class:`bar`},...e)}function qt(e={name:`home`}){return q(`a`,{class:`bar-link`,text:`Back`,attrs:{href:N(e)},on:{click:t=>{t.preventDefault(),bt(e)}}})}function Z(e){return q(`div`,{class:`label`,text:e})}var Q=p(!1),$=p([]),Jt=class extends J{render(){let e=q(`div`,{class:`streak-numeral`}),t=q(`div`,{class:`streak-unit`});this.bind(()=>{let n=wt.value;Y(e,String(n)),Y(t,n===1?`day in a row`:`days in a row`)});let n=q(`div`,{class:`list`}),r=q(`div`,{class:`row-actions`});return this.bind(()=>{Q.value?this.renderEditing(n,r):this.renderViewing(n,r)}),[X(q(`span`),q(`a`,{class:`bar-link`,text:`Setup`,attrs:{href:`#/setup`}})),q(`section`,{class:`streak`},Z(`Streak`),e,t),q(`div`,{class:`spacer`}),q(`section`,{class:`presets`},Z(`Presets`),n,r)]}renderViewing(e,t){e.replaceChildren(...R.value.map(e=>q(`button`,{class:`row row-big`,attrs:{"aria-label":`Start ${e.name}, ${A(e.meditationDuration)}`},on:{click:()=>void zt(e)}},q(`span`,{class:`grow`,text:e.name}),q(`span`,{class:`num`,text:A(e.meditationDuration)})))),t.replaceChildren(q(`span`),q(`button`,{class:`small-action`,text:`Edit`,on:{click:()=>{$.value=R.value.map(e=>e.id),Q.value=!0}}}))}renderEditing(e,t){let n=new Map(R.value.map(e=>[e.id,e])),r=[...$.value.filter(e=>n.has(e)),...R.value.map(e=>e.id).filter(e=>!$.value.includes(e))].map(t=>this.editRow(n.get(t),e));e.replaceChildren(...r,q(`button`,{class:`row row-big muted`,text:`New preset`,on:{click:()=>{$.value=[...this.order(e)],I({name:`preset`,id:jt().id})}}})),t.replaceChildren(q(`button`,{class:`small-action`,text:`Cancel`,on:{click:()=>Q.value=!1}}),q(`button`,{class:`small-action strong`,text:`Done`,on:{click:()=>{Nt(this.order(e)),Q.value=!1}}}))}order(e){return[...e.querySelectorAll(`[data-id]`)].map(e=>e.dataset.id)}editRow(e,t){let n=q(`button`,{class:`handle`,text:`≡`,attrs:{"aria-label":`Move ${e.name}. Drag, or use the arrow keys.`}}),r=q(`div`,{class:`row row-big`,attrs:{"data-id":e.id}},n,q(`span`,{class:`grow`,text:e.name}),q(`span`,{class:`num muted`,text:A(e.meditationDuration)}),q(`a`,{class:`row-link`,text:`Edit`,attrs:{href:N({name:`preset`,id:e.id}),"aria-label":`Edit ${e.name}`},on:{click:()=>$.value=this.order(t)}}));return n.addEventListener(`pointerdown`,e=>{e.preventDefault(),n.setPointerCapture(e.pointerId),r.classList.add(`lifted`);let i=e=>{let n=[...t.querySelectorAll(`[data-id]`)].filter(e=>e!==r),i=n.find(t=>{let n=t.getBoundingClientRect();return e.clientY<n.top+n.height/2});i?t.insertBefore(r,i):n.at(-1)?.after(r)},a=()=>{r.classList.remove(`lifted`),n.removeEventListener(`pointermove`,i),n.removeEventListener(`pointerup`,a),n.removeEventListener(`pointercancel`,a)};n.addEventListener(`pointermove`,i),n.addEventListener(`pointerup`,a),n.addEventListener(`pointercancel`,a)}),n.addEventListener(`keydown`,e=>{if(e.key===`ArrowUp`&&r.previousElementSibling?.hasAttribute(`data-id`))r.previousElementSibling.before(r);else if(e.key===`ArrowDown`&&r.nextElementSibling?.hasAttribute(`data-id`))r.nextElementSibling.after(r);else return;e.preventDefault(),n.focus()}),r}},Yt=[{title:`Sounds`,credits:qe.map(e=>({name:e.name,detail:`Placeholder, synthesised for Jabuto · CC0 1.0`}))},{title:`Typeface`,credits:[{name:`Inter Tight`,detail:`The Inter Project Authors · SIL Open Font License 1.1`,text:`Copyright 2022 The Inter Project Authors (https://github.com/rsms/inter-tight) InterTight-Italic[wght].ttf: Copyright 2022 The Inter Project Authors (https://github.com/rsms/inter-tight)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`}]},{title:`Software`,credits:[{name:`Capacitor`,detail:`Drifty Co. · MIT`,text:`MIT License

Copyright (c) 2017-present Drifty Co.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},{name:`Capacitor Android`,detail:`Drifty Co. · MIT`,text:`MIT License

Copyright (c) 2017-present Drifty Co.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},{name:`Preact Signals`,detail:`Preact Team · MIT`,text:`The MIT License (MIT)

Copyright (c) 2022-present Preact Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},{name:`AndroidX`,detail:`The Android Open Source Project · Apache 2.0 (Android app)`,text:`                                 Apache License\r
                           Version 2.0, January 2004\r
                        http://www.apache.org/licenses/\r
\r
   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION\r
\r
   1. Definitions.\r
\r
      "License" shall mean the terms and conditions for use, reproduction,\r
      and distribution as defined by Sections 1 through 9 of this document.\r
\r
      "Licensor" shall mean the copyright owner or entity authorized by\r
      the copyright owner that is granting the License.\r
\r
      "Legal Entity" shall mean the union of the acting entity and all\r
      other entities that control, are controlled by, or are under common\r
      control with that entity. For the purposes of this definition,\r
      "control" means (i) the power, direct or indirect, to cause the\r
      direction or management of such entity, whether by contract or\r
      otherwise, or (ii) ownership of fifty percent (50%) or more of the\r
      outstanding shares, or (iii) beneficial ownership of such entity.\r
\r
      "You" (or "Your") shall mean an individual or Legal Entity\r
      exercising permissions granted by this License.\r
\r
      "Source" form shall mean the preferred form for making modifications,\r
      including but not limited to software source code, documentation\r
      source, and configuration files.\r
\r
      "Object" form shall mean any form resulting from mechanical\r
      transformation or translation of a Source form, including but\r
      not limited to compiled object code, generated documentation,\r
      and conversions to other media types.\r
\r
      "Work" shall mean the work of authorship, whether in Source or\r
      Object form, made available under the License, as indicated by a\r
      copyright notice that is included in or attached to the work\r
      (an example is provided in the Appendix below).\r
\r
      "Derivative Works" shall mean any work, whether in Source or Object\r
      form, that is based on (or derived from) the Work and for which the\r
      editorial revisions, annotations, elaborations, or other modifications\r
      represent, as a whole, an original work of authorship. For the purposes\r
      of this License, Derivative Works shall not include works that remain\r
      separable from, or merely link (or bind by name) to the interfaces of,\r
      the Work and Derivative Works thereof.\r
\r
      "Contribution" shall mean any work of authorship, including\r
      the original version of the Work and any modifications or additions\r
      to that Work or Derivative Works thereof, that is intentionally\r
      submitted to Licensor for inclusion in the Work by the copyright owner\r
      or by an individual or Legal Entity authorized to submit on behalf of\r
      the copyright owner. For the purposes of this definition, "submitted"\r
      means any form of electronic, verbal, or written communication sent\r
      to the Licensor or its representatives, including but not limited to\r
      communication on electronic mailing lists, source code control systems,\r
      and issue tracking systems that are managed by, or on behalf of, the\r
      Licensor for the purpose of discussing and improving the Work, but\r
      excluding communication that is conspicuously marked or otherwise\r
      designated in writing by the copyright owner as "Not a Contribution."\r
\r
      "Contributor" shall mean Licensor and any individual or Legal Entity\r
      on behalf of whom a Contribution has been received by Licensor and\r
      subsequently incorporated within the Work.\r
\r
   2. Grant of Copyright License. Subject to the terms and conditions of\r
      this License, each Contributor hereby grants to You a perpetual,\r
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable\r
      copyright license to reproduce, prepare Derivative Works of,\r
      publicly display, publicly perform, sublicense, and distribute the\r
      Work and such Derivative Works in Source or Object form.\r
\r
   3. Grant of Patent License. Subject to the terms and conditions of\r
      this License, each Contributor hereby grants to You a perpetual,\r
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable\r
      (except as stated in this section) patent license to make, have made,\r
      use, offer to sell, sell, import, and otherwise transfer the Work,\r
      where such license applies only to those patent claims licensable\r
      by such Contributor that are necessarily infringed by their\r
      Contribution(s) alone or by combination of their Contribution(s)\r
      with the Work to which such Contribution(s) was submitted. If You\r
      institute patent litigation against any entity (including a\r
      cross-claim or counterclaim in a lawsuit) alleging that the Work\r
      or a Contribution incorporated within the Work constitutes direct\r
      or contributory patent infringement, then any patent licenses\r
      granted to You under this License for that Work shall terminate\r
      as of the date such litigation is filed.\r
\r
   4. Redistribution. You may reproduce and distribute copies of the\r
      Work or Derivative Works thereof in any medium, with or without\r
      modifications, and in Source or Object form, provided that You\r
      meet the following conditions:\r
\r
      (a) You must give any other recipients of the Work or\r
          Derivative Works a copy of this License; and\r
\r
      (b) You must cause any modified files to carry prominent notices\r
          stating that You changed the files; and\r
\r
      (c) You must retain, in the Source form of any Derivative Works\r
          that You distribute, all copyright, patent, trademark, and\r
          attribution notices from the Source form of the Work,\r
          excluding those notices that do not pertain to any part of\r
          the Derivative Works; and\r
\r
      (d) If the Work includes a "NOTICE" text file as part of its\r
          distribution, then any Derivative Works that You distribute must\r
          include a readable copy of the attribution notices contained\r
          within such NOTICE file, excluding those notices that do not\r
          pertain to any part of the Derivative Works, in at least one\r
          of the following places: within a NOTICE text file distributed\r
          as part of the Derivative Works; within the Source form or\r
          documentation, if provided along with the Derivative Works; or,\r
          within a display generated by the Derivative Works, if and\r
          wherever such third-party notices normally appear. The contents\r
          of the NOTICE file are for informational purposes only and\r
          do not modify the License. You may add Your own attribution\r
          notices within Derivative Works that You distribute, alongside\r
          or as an addendum to the NOTICE text from the Work, provided\r
          that such additional attribution notices cannot be construed\r
          as modifying the License.\r
\r
      You may add Your own copyright statement to Your modifications and\r
      may provide additional or different license terms and conditions\r
      for use, reproduction, or distribution of Your modifications, or\r
      for any such Derivative Works as a whole, provided Your use,\r
      reproduction, and distribution of the Work otherwise complies with\r
      the conditions stated in this License.\r
\r
   5. Submission of Contributions. Unless You explicitly state otherwise,\r
      any Contribution intentionally submitted for inclusion in the Work\r
      by You to the Licensor shall be under the terms and conditions of\r
      this License, without any additional terms or conditions.\r
      Notwithstanding the above, nothing herein shall supersede or modify\r
      the terms of any separate license agreement you may have executed\r
      with Licensor regarding such Contributions.\r
\r
   6. Trademarks. This License does not grant permission to use the trade\r
      names, trademarks, service marks, or product names of the Licensor,\r
      except as required for reasonable and customary use in describing the\r
      origin of the Work and reproducing the content of the NOTICE file.\r
\r
   7. Disclaimer of Warranty. Unless required by applicable law or\r
      agreed to in writing, Licensor provides the Work (and each\r
      Contributor provides its Contributions) on an "AS IS" BASIS,\r
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or\r
      implied, including, without limitation, any warranties or conditions\r
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A\r
      PARTICULAR PURPOSE. You are solely responsible for determining the\r
      appropriateness of using or redistributing the Work and assume any\r
      risks associated with Your exercise of permissions under this License.\r
\r
   8. Limitation of Liability. In no event and under no legal theory,\r
      whether in tort (including negligence), contract, or otherwise,\r
      unless required by applicable law (such as deliberate and grossly\r
      negligent acts) or agreed to in writing, shall any Contributor be\r
      liable to You for damages, including any direct, indirect, special,\r
      incidental, or consequential damages of any character arising as a\r
      result of this License or out of the use or inability to use the\r
      Work (including but not limited to damages for loss of goodwill,\r
      work stoppage, computer failure or malfunction, or any and all\r
      other commercial damages or losses), even if such Contributor\r
      has been advised of the possibility of such damages.\r
\r
   9. Accepting Warranty or Additional Liability. While redistributing\r
      the Work or Derivative Works thereof, You may choose to offer,\r
      and charge a fee for, acceptance of support, warranty, indemnity,\r
      or other liability obligations and/or rights consistent with this\r
      License. However, in accepting such obligations, You may act only\r
      on Your own behalf and on Your sole responsibility, not on behalf\r
      of any other Contributor, and only if You agree to indemnify,\r
      defend, and hold each Contributor harmless for any liability\r
      incurred by, or claims asserted against, such Contributor by reason\r
      of your accepting any such warranty or additional liability.\r
\r
   END OF TERMS AND CONDITIONS\r
`}]}],Xt=class extends J{render(){return[X(qt({name:`setup`})),q(`section`,{class:`title-block`},q(`h1`,{class:`title`,text:`Licences`})),...Yt.map(e=>q(`section`,{class:`block`},Z(e.title),q(`div`,{class:`list ruled`},...e.credits.map(e=>{let t=q(`summary`,{class:`row row-tall`},q(`span`,{class:`stack`},q(`span`,{class:`row-title small-title`,text:e.name}),q(`span`,{class:`hint`,text:e.detail})));return e.text?q(`details`,{class:`credit`},t,q(`pre`,{class:`licence-text`,text:e.text})):q(`div`,{class:`row row-tall`},q(`span`,{class:`stack`},q(`span`,{class:`row-title small-title`,text:e.name}),q(`span`,{class:`hint`,text:e.detail})))}))))]}};function Zt(e,t,n,r,i,a){let o=q(`input`,{class:`duration ${t}`,attrs:{type:`text`,inputmode:`numeric`,"aria-label":e,autocomplete:`off`,spellcheck:`false`}});return a(()=>{document.activeElement!==o&&(o.value=A(r()))}),o.addEventListener(`change`,()=>{let e=tt(o.value);e!==null&&i(e),o.value=A(r())}),o.addEventListener(`focus`,()=>o.select()),[o,q(`div`,{class:`steppers`},...n.map(e=>q(`button`,{class:`num`,text:e.label,attrs:{"aria-label":e.aria},on:{click:()=>i(r()+e.by)}})))]}function Qt(e,t,n,r){let i=q(`span`,{class:`grow`}),a=q(`span`,{class:`num muted small`});return r(()=>{Y(i,e()),Y(a,t())}),q(`a`,{class:`row row-mid`,attrs:{href:n}},i,a)}var $t=class extends J{presetId=``;preset=v(()=>R.value.find(e=>e.id===this.presetId));render(){if(!At(this.presetId))return queueMicrotask(()=>I({name:`home`},{replace:!0})),[];let e=()=>this.preset.value,t=e=>{let t=this.preset.value;t&&K(e(t))},n=e=>this.bind(()=>this.preset.value&&e()),r=q(`input`,{class:`name-input`,attrs:{type:`text`,maxlength:String(E.nameMax),"aria-label":`Preset name`,autocomplete:`off`}});n(()=>{document.activeElement!==r&&(r.value=e().name)}),r.addEventListener(`change`,()=>{let n=Ve(r.value);n&&t(e=>({...e,name:n})),r.value=e().name});let i=e=>e.sound===`silent`?``:`${e.strikes}×`,a=e=>N({name:`sound`,id:this.presetId,role:e}),o=q(`div`,{class:`list`});n(()=>{o.replaceChildren(...e().intervalBells.map(e=>q(`div`,{class:`row row-mid`},q(`span`,{class:`grow num`,text:A(e)}),q(`button`,{class:`row-link`,text:`Remove`,attrs:{"aria-label":`Remove bell at ${A(e)}`},on:{click:()=>t(t=>Ke(t,e))}}))))});let s=q(`span`,{class:`grow num`});return n(()=>Y(s,A(e().meditationDuration))),[X(qt()),q(`section`,{class:`title-block`},Z(`Preset`),r),q(`section`,{class:`block`},Z(`Warmup`),...Zt(`Warmup`,`duration-mid`,[{label:`−1:00`,by:-60,aria:`Shorten warmup by 1 minute`},{label:`−0:10`,by:-10,aria:`Shorten warmup by 10 seconds`},{label:`+0:10`,by:10,aria:`Lengthen warmup by 10 seconds`},{label:`+1:00`,by:60,aria:`Lengthen warmup by 1 minute`}],()=>e().warmupDuration,e=>t(t=>Ue(t,e)),n)),q(`section`,{class:`block`},Z(`Start bell`),q(`div`,{class:`list ruled`},Qt(()=>O(e().startBell.sound),()=>i(e().startBell),a(`start`),n))),q(`section`,{class:`block`},Z(`Length`),...Zt(`Length`,`duration-big`,[{label:`−5:00`,by:-300,aria:`Shorten by 5 minutes`},{label:`−1:00`,by:-60,aria:`Shorten by 1 minute`},{label:`+1:00`,by:60,aria:`Lengthen by 1 minute`},{label:`+5:00`,by:300,aria:`Lengthen by 5 minutes`}],()=>e().meditationDuration,e=>t(t=>He(t,e)),n)),q(`section`,{class:`block`},Z(`Interval bells`),q(`div`,{class:`list`},q(`a`,{class:`row row-mid`,attrs:{href:a(`interval`)}},q(`span`,{class:`grow muted small-text`,text:`Sound`}),(()=>{let t=q(`span`,{class:`small-text`});return n(()=>Y(t,O(e().intervalSound))),t})()),o,this.addBellRow(e,t),q(`div`,{class:`row row-mid muted`},s,q(`span`,{class:`small-text`,text:`End`})))),q(`section`,{class:`block`},Z(`End bell`),q(`div`,{class:`list ruled`},Qt(()=>O(e().endBell.sound),()=>i(e().endBell),a(`end`),n))),q(`div`,{class:`spacer`}),q(`button`,{class:`small-action`,text:`Delete preset`,on:{click:()=>{Mt(this.presetId),I({name:`home`},{replace:!0})}}})]}addBellRow(e,t){let n=q(`div`),r=q(`div`,{class:`hint`,attrs:{role:`status`}}),i=q(`button`,{class:`row row-mid muted add-bell`,text:`Add bell`}),a=()=>n.replaceChildren(i);return i.addEventListener(`click`,()=>{let i=We(e().intervalBells,e().meditationDuration),o=q(`input`,{class:`grow num inline-input`,attrs:{type:`text`,inputmode:`numeric`,"aria-label":`New bell time`,autocomplete:`off`}});o.value=i===null?``:A(i);let s=()=>{let n=tt(o.value),i=e().intervalBells.length;n!==null&&t(e=>Ge(e,n)),n===null||e().intervalBells.length===i?Y(r,`A bell must be between 00:01 and ${A(e().meditationDuration-E.endGap-1)}, once.`):a()};o.addEventListener(`keydown`,e=>{e.key===`Enter`&&s(),e.key===`Escape`&&a()}),Y(r,``),n.replaceChildren(q(`div`,{class:`row row-mid`},o,q(`button`,{class:`row-link`,text:`Cancel`,on:{click:a}}),q(`button`,{class:`row-link strong`,text:`Add`,on:{click:s}})),r),o.focus(),o.select()}),a(),n}},en={volumeOff:`Media volume is off`,dndMuting:`Do Not Disturb is muting bells`},tn=class extends J{render(){if(!V.value)return queueMicrotask(()=>I({name:`home`},{replace:!0})),[];let e=q(`div`,{class:`notice`,attrs:{role:`status`}}),t=q(`div`,{class:`label`}),n=q(`div`,{class:`session-time`,attrs:{role:`timer`}}),r=q(`button`,{class:`control`}),i=q(`div`,{class:`controls`},r,q(`button`,{class:`control strong end`,text:`End`,on:{click:()=>void Ht()}}));r.addEventListener(`click`,()=>V.value?.paused?Vt():Bt()),this.bind(()=>{let a=V.value;if(!a)return;let o=Ie(a.request.plan,a.elapsed);Y(e,a.notice?en[a.notice]:``);let s=o.phase===`warmup`||o.phase===`sitting`?A(o.remaining):Xe(o.overtime);Y(n,s),n.classList.toggle(`long`,s.length>6),Y(t,a.paused?`Paused`:o.phase===`warmup`?`Warmup`:o.phase===`sitting`?`Sitting`:``);let c=o.phase===`overtime`||o.phase===`capped`;r.hidden=c,i.classList.toggle(`single`,c),Y(r,a.paused?`Resume`:`Pause`)});let a=q(`dialog`,{class:`sheet`,attrs:{"aria-labelledby":`end-q`}},q(`h2`,{class:`title`,text:`End session?`,attrs:{id:`end-q`}}),q(`button`,{class:`row row-big strong`,text:`Keep sitting`,on:{click:Ut}}),q(`button`,{class:`row row-big muted`,text:`End`,on:{click:()=>void Ht()}}));return a.addEventListener(`cancel`,e=>{e.preventDefault(),Ut()}),this.bind(()=>{H.value&&!a.open&&a.showModal(),!H.value&&a.open&&a.close()}),[q(`header`,{class:`bar`},e),q(`section`,{class:`session-main`},t,n),i,a]}},nn={invalid:`That file is not a Jabuto export. Nothing was changed.`,otherApp:`That file is from another app. Nothing was changed.`,newerVersion:`That file is from a newer version of Jabuto. Update the app first. Nothing was changed.`};function rn(e,t,n,r,i){let a=q(`span`,{class:`toggle-state`}),o=q(`button`,{class:`row row-tall`,on:{click:()=>r(!n())}},q(`span`,{class:`grow stack`},q(`span`,{class:`row-title`,text:e}),t?q(`span`,{class:`hint`,text:t}):null),a);return i(()=>{Y(a,n()?`On`:`Off`),o.setAttribute(`aria-pressed`,String(n()))}),o}var an=class extends J{pending=p(null);message=p(``);render(){let{device:e}=Tt(),t=e=>this.bind(e),n=[`system`,`light`,`dark`].map(e=>{let n=q(`button`,{class:`row row-big choice`,text:e[0].toUpperCase()+e.slice(1),on:{click:()=>Pt({theme:e})}});return t(()=>{let t=B.value.theme===e;n.classList.toggle(`selected`,t),n.setAttribute(`aria-pressed`,String(t))}),n}),r=q(`div`,{class:`row row-small`},q(`span`,{class:`grow hint`,text:`DND access not granted`}),q(`button`,{class:`row-link strong`,text:`Grant`,on:{click:()=>void It()}}));t(()=>r.classList.toggle(`invisible`,!(B.value.dnd&&U.value)));let i=q(`section`,{class:`block`},Z(`Session`),q(`div`,{class:`list`},e.native?rn(`Do Not Disturb`,`From warmup to the end bell`,()=>B.value.dnd,e=>void Ft(e),t):null,e.native?r:null,rn(`Vibrate with bells`,null,()=>B.value.vibrate,e=>Pt({vibrate:e}),t))),a=q(`div`,{class:`hint message`,attrs:{role:`status`}});t(()=>Y(a,this.message.value));let o=q(`div`,{class:`confirm`});return t(()=>{let e=this.pending.value;e?o.replaceChildren(q(`div`,{class:`row-title`,text:`Replace ${e.presets.length} presets and ${e.sessions.length} sessions?`}),q(`div`,{class:`hint`,text:`Everything on this device is replaced by the file.`}),q(`div`,{class:`row-actions`},q(`button`,{class:`small-action`,text:`Cancel`,on:{click:()=>this.pending.value=null}}),q(`button`,{class:`small-action strong`,text:`Replace`,on:{click:async()=>{await Kt(e),this.pending.value=null,this.message.value=`Imported.`}}}))):o.replaceChildren()}),[X(qt()),q(`section`,{class:`title-block`},q(`h1`,{class:`title`,text:`Setup`})),q(`section`,{class:`block`},Z(`Theme`),q(`div`,{class:`list`},...n)),i,q(`section`,{class:`block`},Z(`Data`),q(`div`,{class:`list ruled`},q(`button`,{class:`row row-tall`,on:{click:async()=>{this.message.value=``,await Wt()}}},q(`span`,{class:`stack`},q(`span`,{class:`row-title`,text:`Export`}),q(`span`,{class:`hint`,text:`Presets and session log as one file`}))),q(`button`,{class:`row row-tall`,on:{click:async()=>{this.message.value=``;let e=await Gt();e&&(e.ok?this.pending.value=e:this.message.value=nn[e.reason])}}},q(`span`,{class:`stack`},q(`span`,{class:`row-title`,text:`Import`}),q(`span`,{class:`hint`,text:`Replace presets and session log from a file`}))),q(`a`,{class:`row row-big`,text:`Licences`,attrs:{href:`#/licences`}})),o,a),q(`div`,{class:`spacer`}),q(`p`,{class:`hint footer`,text:`No account. Everything stays on this device.`})]}},on={start:`Start bell`,interval:`Interval bells`,end:`End bell`},sn=class extends J{presetId=``;bellRole=`start`;preset=v(()=>R.value.find(e=>e.id===this.presetId));playing=p(null);render(){if(!this.preset.value)return queueMicrotask(()=>I({name:`home`},{replace:!0})),[];let{runner:e}=Tt();this.own(()=>e.stopPreview());let t=e=>this.bellRole===`interval`?e.intervalSound:this.bellRole===`start`?e.startBell.sound:e.endBell.sound,n=e=>this.bellRole===`start`?e.startBell.strikes:e.endBell.strikes,r=e=>{let t=this.preset.value;this.bellRole===`interval`?K({...t,intervalSound:e}):this.bellRole===`start`?K({...t,startBell:{...t.startBell,sound:e}}):K({...t,endBell:{...t.endBell,sound:e}})},i=e=>{let t=this.preset.value;this.bellRole===`start`?K({...t,startBell:{...t.startBell,strikes:e}}):K({...t,endBell:{...t.endBell,strikes:e}})},a=async t=>{this.playing.value===t?(e.stopPreview(),this.playing.value=null):(this.playing.value=t,await e.preview(t),this.playing.value===t&&(this.playing.value=null))},o=Je.map(e=>{let n=q(`button`,{class:`grow choice`,text:O(e),on:{click:()=>r(e)}}),i=e===`silent`?null:q(`button`,{class:`row-link`,on:{click:()=>void a(e)}});return this.bind(()=>{let r=this.preset.value;if(!r)return;let a=t(r)===e;if(n.classList.toggle(`selected`,a),n.setAttribute(`aria-pressed`,String(a)),i){let t=this.playing.value===e;Y(i,t?`Stop`:`Play`),i.setAttribute(`aria-label`,`${t?`Stop`:`Play`} ${O(e)}`)}}),q(`div`,{class:`row row-big`},n,i)}),s=this.bellRole===`interval`?null:q(`section`,{class:`block`},Z(`Strikes`),q(`div`,{class:`steppers three ruled-bottom`},...[1,2,3].map(e=>{let t=q(`button`,{class:`choice num`,text:`${e}×`,attrs:{"aria-label":e===1?`1 strike`:`${e} strikes`},on:{click:()=>i(e)}});return this.bind(()=>{let r=this.preset.value;if(!r)return;let i=n(r)===e;t.classList.toggle(`selected`,i),t.setAttribute(`aria-pressed`,String(i))}),t}))),c=q(`div`,{class:`label`});return this.bind(()=>this.preset.value&&Y(c,this.preset.value.name)),[X(qt({name:`preset`,id:this.presetId})),q(`section`,{class:`title-block`},c,q(`h1`,{class:`title`,text:on[this.bellRole]})),q(`section`,{class:`block`},Z(`Sound`),q(`div`,{class:`list`},...o)),s]}};customElements.define(`home-screen`,Jt),customElements.define(`preset-screen`,$t),customElements.define(`sound-screen`,sn),customElements.define(`session-screen`,tn),customElements.define(`setup-screen`,an),customElements.define(`licences-screen`,Xt);function cn(e){switch(e.name){case`home`:return new Jt;case`preset`:return Object.assign(new $t,{presetId:e.id});case`sound`:return Object.assign(new sn,{presetId:e.id,bellRole:e.role});case`session`:return new tn;case`setup`:return new an;case`licences`:return new Xt}}async function ln(){await Et(await Me());let e=document.getElementById(`app`);x(()=>{let e=B.value.theme;e===`system`?delete document.documentElement.dataset.theme:document.documentElement.dataset.theme=e}),x(()=>{let t=_t.value;i(()=>e.replaceChildren(cn(t))),window.scrollTo(0,0)});let t=q(`p`,{class:`row-title explain-text`}),n=q(`dialog`,{class:`sheet`},t,q(`div`,{class:`row-actions`},q(`button`,{class:`small-action`,text:`Not now`,on:{click:()=>W.value?.answer(!1)}}),q(`button`,{class:`small-action strong`,text:`Continue`,on:{click:()=>W.value?.answer(!0)}})));n.addEventListener(`cancel`,e=>{e.preventDefault(),W.value?.answer(!1)}),document.body.append(n),x(()=>{let e=W.value;t.textContent=e?.text??``,e&&!n.open&&n.showModal(),!e&&n.open&&n.close()}),await document.fonts.ready,document.documentElement.classList.add(`ready`)}ln();