/** Portable adaptation of madebykites/components/motion.tsx.
 * Feature Bench reuse: L-09 kinetic word cycle, L-02 80ms reveal stagger,
 * L-26 radius-based magnetic pointer response. Native scroll remains native.
 */
export function initMotion(){
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)'),button=document.querySelector('.motion-toggle');let paused=false;try{paused=localStorage.getItem('kites-motion')==='off';}catch{}
 const nodes=[...document.querySelectorAll('.reveal')];
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach((e,i)=>{if(e.isIntersecting){e.target.style.transitionDelay=Math.min(i,2)*80+'ms';e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.07}):null;
 function sync(){const off=reduce.matches||paused;root.classList.toggle('motion-active',!off);root.classList.toggle('motion-paused',off);if(off||!observer)nodes.forEach(n=>n.classList.add('is-visible'));if(button){button.setAttribute('aria-pressed',String(off));button.setAttribute('aria-label',reduce.matches?'Reduced motion enabled':off?'Enable motion':'Pause motion');button.innerHTML=(off?'▶':'Ⅱ')+' <span>'+(off?'Motion off':'Motion on')+'</span>';button.disabled=reduce.matches;}}
 const hero=document.querySelector('.hero');if(hero&&'IntersectionObserver'in window){const heroObserver=new IntersectionObserver(entries=>root.classList.toggle('hero-out-of-view',!entries[0].isIntersecting));heroObserver.observe(hero)}document.addEventListener('visibilitychange',()=>root.classList.toggle('motion-idle',document.hidden));
 sync();nodes.forEach(n=>observer?.observe(n));reduce.addEventListener('change',sync);button?.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('kites-motion',paused?'off':'on')}catch{}sync()});
 if(matchMedia('(pointer:fine)').matches)document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduce.matches||paused)return;const b=el.getBoundingClientRect(),dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2),d=Math.hypot(dx,dy),k=d<120?.08:0;el.style.transform=`translate(${dx*k}px,${dy*k}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
}
