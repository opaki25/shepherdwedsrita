const checker=document.querySelector('#cardCheck');
const codeField=document.querySelector('#cardCode');
const result=document.querySelector('#cardResult');
codeField.addEventListener('input',()=>{result.replaceChildren();codeField.setCustomValidity('')});
checker.addEventListener('submit',async event=>{
 event.preventDefault();const code=codeField.value.toUpperCase().replace(/[\s-]/g,'');
 if(!/^RS[A-F0-9]{20}$/.test(code)){codeField.setCustomValidity('Enter the full RS code printed on your card.');codeField.reportValidity();return}
 const button=checker.querySelector('button');button.disabled=true;button.textContent='Checking card…';result.replaceChildren();
 try{
  const response=await fetch(window.WEDDING.rsvp.url+'/functions/v1/verify-wedding-card',{method:'POST',headers:{'Content-Type':'application/json',apikey:window.WEDDING.rsvp.key},body:JSON.stringify({code}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('unavailable');const data=await response.json();
  const heading=document.createElement('h3');const detail=document.createElement('p');
  if(data.valid){result.className='card-result verified';heading.textContent='✓ Verified card';detail.textContent=[data.title,data.name].filter(Boolean).join(' ');result.append(heading,detail);if(data.admitted_guests){const guests=document.createElement('p');guests.textContent='Admits '+data.admitted_guests+' '+(data.admitted_guests===1?'guest':'guests');result.append(guests)}const note=document.createElement('small');note.textContent='The name shown should match the name printed on your card.';result.append(note)}
  else{result.className='card-result unverified';heading.textContent='Card not verified';detail.textContent='Please check the code on your card and try again. If you need help, contact Chairman Aggrey.';result.append(heading,detail)}
 }catch{result.className='card-result';result.textContent='We cannot check your card right now. Please try again shortly.'}
 finally{button.disabled=false;button.textContent='Verify card ↗'}
});
