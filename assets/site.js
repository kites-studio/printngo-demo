import {initMotion} from './motion.js';
import {serviceLabels,validateEnquiry,createReference,formatBrief,emailLink} from './enquiry.js';
initMotion();
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
function closeMenu(focus=false){toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation');nav?.classList.remove('open');if(focus)toggle?.focus()}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true')closeMenu(true)});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
matchMedia('(min-width:761px)').addEventListener('change',()=>closeMenu());
for(const module of document.querySelectorAll('[data-brief]')){
 const form=module.querySelector('form'),ready=module.querySelector('.brief-ready'),state=module.querySelector('.draft-state');let draft=null,ref='';
 const read=()=>{const d=new FormData(form);return {service:d.get('product'),quantity:d.get('quantity'),deadline:d.get('deadline'),message:d.get('details')}};
 form.addEventListener('input',()=>{const d=read();module.querySelector('[data-summary]').textContent=(d.quantity||'—')+' × '+serviceLabels[d.service]});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;draft=read();ref=createReference();module.querySelector('[data-ready-summary]').textContent=`${draft.quantity} × ${serviceLabels[draft.service]}\n${draft.deadline?'Needed by '+draft.deadline:'Timing to discuss'}`;module.querySelector('[data-reference]').textContent=ref;module.querySelector('[data-email]').href=emailLink(draft,ref,'printngo@gmail.com');form.hidden=true;ready.hidden=false;state.textContent='Prepared';ready.focus()});
 module.querySelector('[data-edit]').addEventListener('click',()=>{ready.hidden=true;form.hidden=false;state.textContent='Draft';form.elements.product.focus()});
 module.querySelector('[data-download]').addEventListener('click',()=>{if(!draft)return;const blob=new Blob([formatBrief(draft,ref)],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=ref+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
}
const form=document.querySelector('#contact-form');
if(form){const service=new URLSearchParams(location.search).get('service');if(Object.hasOwn(serviceLabels,service))form.elements.service.value=service;
 form.addEventListener('submit',e=>{e.preventDefault();const parsed=validateEnquiry(Object.fromEntries(new FormData(form)));form.querySelectorAll('[data-error]').forEach(el=>el.textContent='');form.querySelectorAll('[aria-invalid]').forEach(el=>{el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby')});const feedback=document.querySelector('#form-feedback');feedback.hidden=true;
 if(!parsed.ok){for(const [key,msg] of Object.entries(parsed.errors)){const el=form.elements[key];if(!el)continue;el.setAttribute('aria-invalid','true');let error=form.querySelector(`[data-error="${key}"]`);if(!error){error=document.createElement('small');error.className='field-error';error.dataset.error=key;el.after(error)}error.id=key+'-error';error.textContent=msg;el.setAttribute('aria-describedby',error.id)}const first=Object.keys(parsed.errors)[0];if(first==='companyFax'){feedback.textContent='We could not verify this enquiry. Please contact us directly.';feedback.hidden=false;feedback.focus()}else form.elements[first]?.focus();return;}
 const ref=createReference(),link=emailLink(parsed.data,ref,'printngo@gmail.com');feedback.replaceChildren();const p=document.createElement('p');p.textContent='Your email draft is ready. Open it below, attach your artwork and send it from your email app. Nothing has been sent yet.';const a=document.createElement('a');a.href=link;a.textContent='Open prepared email ↗';const copy=document.createElement('button');copy.type='button';copy.className='plain-button';copy.textContent='Copy enquiry text';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(formatBrief(parsed.data,ref));copy.textContent='Copied ✓'}catch{copy.textContent='Select and copy the text below';const pre=document.createElement('pre');pre.textContent=formatBrief(parsed.data,ref);pre.style.whiteSpace='pre-wrap';feedback.append(pre)}});feedback.append(p,a,copy);feedback.hidden=false;feedback.focus();
 });
}
