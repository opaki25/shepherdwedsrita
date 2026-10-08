const rsvpForm=document.querySelector('#rsvpForm');
const attendingDetails=document.querySelector('#attendingDetails');
const guestCount=document.querySelector('#guests');
const extraGuests=document.querySelector('#additionalGuests');
function updateGuestFields(){
  const previous=[...extraGuests.querySelectorAll('input')].map(input=>input.value);
  extraGuests.replaceChildren();
  for(let i=1;i<Number(guestCount.value);i++){
    const label=document.createElement('label');label.htmlFor=`extraGuest${i}`;label.textContent=`Guest ${i+1} full name *`;
    const input=document.createElement('input');input.id=label.htmlFor;input.name='additionalGuest';input.required=true;input.maxLength=100;input.placeholder='First and last name';input.value=previous[i-1]||'';
    extraGuests.append(label,input);
  }
}
rsvpForm.querySelectorAll('[name=attendance]').forEach(input=>input.addEventListener('change',()=>{
  const attending=input.value==='Joyfully attending';attendingDetails.hidden=!attending;
  attendingDetails.querySelectorAll('input,select,textarea').forEach(field=>field.disabled=!attending);
}));
guestCount.addEventListener('change',updateGuestFields);
let submissionId=crypto.randomUUID();
rsvpForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const status=document.querySelector('#rsvpStatus');
  const name=document.querySelector('#guestName');
  name.setCustomValidity(name.value.trim()?'':'Please enter your full name.');
  if(!rsvpForm.reportValidity())return;
  const settings=window.WEDDING?.rsvp;
  if(!settings?.url||!settings?.key){status.textContent='Online replies are not available yet. Please contact Chairman Aggrey on 0701 539 163.';return}
  const data=new FormData(rsvpForm);const attending=data.get('attendance')==='Joyfully attending';
  const payload={id:submissionId,full_name:name.value.trim(),phone:String(data.get('phone')).trim(),email:String(data.get('email')||'').trim()||null,attending,guest_count:attending?Number(data.get('guests')):0,guest_names:attending?data.getAll('additionalGuest').map(value=>value.trim()):[],requirements:attending?String(data.get('dietary')||'').trim():null,message:String(data.get('message')||'').trim()};
  const button=rsvpForm.querySelector('[type=submit]');button.disabled=true;button.textContent='Sending your reply…';status.textContent='';
  try{
    const response=await fetch(settings.url+'/rest/v1/wedding_rsvps',{method:'POST',headers:{apikey:settings.key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error('Could not save your response');
    const success=document.createElement('div');success.className='rsvp-success';success.tabIndex=-1;success.setAttribute('role','status');
    const check=document.createElement('span');check.className='success-check';check.textContent='✓';
    const heading=document.createElement('h3');heading.textContent='Thank you, '+payload.full_name.split(' ')[0]+'.';
    const message=document.createElement('p');message.textContent=attending?'Your RSVP is saved. We look forward to celebrating with you on 12 December!':'Your reply is saved. Thank you for sending your love to Rita and Shepherd.';
    success.append(check,heading,message);rsvpForm.replaceChildren(success);success.focus();
  }catch{status.textContent='Your reply could not be confirmed. Please try again, or contact Aggrey on 0701 539 163.';button.disabled=false;button.textContent='Send my RSVP ↗'}
});
document.querySelector('#guestName').addEventListener('input',event=>event.target.setCustomValidity(''));
