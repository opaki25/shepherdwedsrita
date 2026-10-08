const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, authorization','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 try{
  const raw=await req.text();if(raw.length>256)return reply({error:'Invalid request'},400);
  const input=JSON.parse(raw);
  const code=String(input.code||'').toUpperCase().replace(/[\s-]/g,'');
  if(!/^RS[A-F0-9]{20}$/.test(code))return reply({valid:false});
  // The unguessable card code is the bearer credential. No list or partial-name lookup.
  const url=Deno.env.get('SUPABASE_URL')+'/rest/v1/wedding_cards?code=eq.RS-'+code.slice(2)+'&active=eq.true&select=guest_name,title,admitted_guests&limit=1';
  const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const r=await fetch(url,{headers:{apikey:key,Authorization:'Bearer '+key}});
  if(!r.ok)return reply({error:'Verification temporarily unavailable'},503);
  const rows=await r.json();
  if(!rows.length)return reply({valid:false});
  return reply({valid:true,name:rows[0].guest_name,title:rows[0].title,admitted_guests:rows[0].admitted_guests});
 }catch{return reply({error:'Unable to verify this card'},400)}
});
