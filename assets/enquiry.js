/** Adapted from madebykites/lib/contact.ts and components/quote-showcase.tsx.
 * Shared print-specific boundary; never imports client pricing or recipients from another project.
 */
export const serviceLabels=Object.freeze({'business-cards':'Business cards',digital:'Digital printing',offset:'Offset printing','large-format':'Large-format printing','cd-labels':'CD labels',binding:'Binding',lamination:'Lamination','rubber-stamps':'Rubber stamps',photocopying:'Photocopying',scanning:'Scanning',other:'Something else'});
export function validateEnquiry(input){
 const data={name:String(input.name||'').trim(),email:String(input.email||'').trim(),service:String(input.service||''),quantity:String(input.quantity||'').trim(),deadline:String(input.deadline||''),message:String(input.message||'').trim(),companyFax:String(input.companyFax||'')};const errors={};
 if(data.name.length<2||data.name.length>100)errors.name='Please enter your name (2–100 characters).';
 if(data.email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(data.email))errors.email='Please enter a valid email address.';
 if(!Object.hasOwn(serviceLabels,data.service))errors.service='Please choose a service.';
 if(data.message.length<20||data.message.length>5000)errors.message='Please add 20–5,000 characters about your project.';
 if(data.quantity&&(!/^\d+$/.test(data.quantity)||Number(data.quantity)<1||Number(data.quantity)>100000))errors.quantity='Enter a whole quantity between 1 and 100,000.';
 if(data.deadline&&(!/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)||!Number.isFinite(Date.parse(data.deadline))))errors.deadline='Please enter a valid date.';
 if(data.companyFax)errors.companyFax='We could not verify this enquiry.';
 return {ok:Object.keys(errors).length===0,data,errors};
}
export function createReference(){return 'PNG-DRAFT-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomUUID().slice(0,8).toUpperCase();}
export function formatBrief(d,reference='') {return ['Hello Print & Go,',"I'd like to discuss this print job.",'',reference?`Draft reference: ${reference}`:'',d.name?`Name: ${d.name}`:'',d.email?`Email: ${d.email}`:'',`Service: ${serviceLabels[d.service]||d.service}`,`Quantity: ${d.quantity||'To discuss'}`,`Needed by: ${d.deadline||'To discuss'}`,'',d.message||'','', 'Please confirm the specifications, price and turnaround.'].filter((x,i,a)=>x!==''||a[i-1]!=='').join('\n');}
export function emailLink(d,reference='',recipient){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient||''))throw new Error('An explicit client email recipient is required.');return 'mailto:'+recipient+'?subject='+encodeURIComponent('Print enquiry — '+(serviceLabels[d.service]||'New project'))+'&body='+encodeURIComponent(formatBrief(d,reference));}
