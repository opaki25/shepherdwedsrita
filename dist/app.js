const music=document.querySelector('#music');
const toggle=document.querySelector('#musicToggle');
const label=document.querySelector('#musicLabel');
music.volume=.45;
function syncMusic(){const playing=!music.paused;toggle.classList.toggle('playing',playing);toggle.setAttribute('aria-pressed',String(playing));toggle.setAttribute('aria-label',playing?'Pause background music':'Play background music');label.textContent=playing?'Music on':'Music off';}
async function playMusic(){try{await prepareRhythm();await music.play()}catch{label.textContent='Tap to play'}syncMusic()}
function openInvitation(sound){const invitation=document.querySelector('#invitation');if(invitation.classList.contains('opening'))return;invitation.classList.add('opening');document.body.classList.add('revealing');if(sound)playMusic();setTimeout(()=>{invitation.hidden=true;document.querySelector('#main').inert=false;document.body.classList.remove('sealed','revealing');document.querySelector('.monogram').focus({preventScroll:true})},matchMedia('(prefers-reduced-motion: reduce)').matches?80:2600)}
document.querySelector('#openInvitation').addEventListener('click',()=>openInvitation(true));
toggle.addEventListener('click',()=>music.paused?playMusic():music.pause());
music.addEventListener('play',syncMusic);music.addEventListener('pause',syncMusic);
// Read the song locally: no microphone, recording, or external audio service.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const rhythm=document.createElement('div');
rhythm.className='rhythm-line';rhythm.setAttribute('aria-hidden','true');
const rhythmBars=Array.from({length:40},()=>{const bar=document.createElement('i');rhythm.append(bar);return bar});
document.body.append(rhythm);
const miniBars=[...document.querySelectorAll('.music-bars i')];
const movingRings=[...document.querySelectorAll('.heading-rings,.monogram-rings')];
let audioContext,analyser,spectrum,frameId=0,lastFrame=0,averageBass=0,pulse=0,lastBeat=0;
async function prepareRhythm(){
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return;
  try{
    if(!audioContext){
      audioContext=new AudioContextClass();
      const source=audioContext.createMediaElementSource(music);
      // Keep a direct audible path even if visual analysis cannot initialize.
      source.connect(audioContext.destination);
      analyser=audioContext.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.72;
      source.connect(analyser);spectrum=new Uint8Array(analyser.frequencyBinCount);
    }
    if(audioContext.state==='suspended')await audioContext.resume();
  }catch{ /* Ordinary audio playback remains the fallback. */ }
}
function stopRhythm(){
  cancelAnimationFrame(frameId);frameId=0;lastFrame=0;averageBass=0;pulse=0;
  document.body.classList.remove('rhythm-active');
  document.body.style.setProperty('--music-pulse','0');
  rhythmBars.forEach(bar=>bar.style.transform='scaleY(.08)');
  miniBars.forEach(bar=>bar.style.removeProperty('height'));
  movingRings.forEach(ring=>ring.style.removeProperty('transform'));
}
function animateRhythm(now){
  if(music.paused||music.ended||document.hidden||reducedMotion.matches||!analyser){stopRhythm();return}
  frameId=requestAnimationFrame(animateRhythm);
  if(now-lastFrame<32)return;
  lastFrame=now;analyser.getByteFrequencyData(spectrum);
  const binHz=audioContext.sampleRate/analyser.fftSize;
  const low=Math.max(1,Math.floor(55/binHz)),high=Math.max(low+1,Math.ceil(220/binHz));
  let bass=0;for(let i=low;i<=high;i++)bass+=spectrum[i]/255;
  bass/=high-low+1;
  const previousAverage=averageBass;
  averageBass=averageBass*.97+bass*.03;
  if(bass>.06&&bass>previousAverage*1.045&&now-lastBeat>260){pulse=Math.min(1,.45+bass);lastBeat=now}
  pulse*=.91;
  const strength=Math.min(1,pulse+bass*.45);
  document.body.style.setProperty('--music-pulse',strength.toFixed(3));
  // A continuous musical sway keeps softer passages alive; real bass accents
  // add a stronger lift. Use the playback clock so the movement follows pause/seek.
  const phase=music.currentTime*Math.PI;
  const sway=Math.sin(phase);
  const breath=(1-Math.cos(phase*2))*.5;
  const audible=Math.min(1,bass*9);
  const scale=1+audible*(.045+breath*.085)+pulse*.12;
  const angle=sway*(4+audible*3);
  const lift=-(breath*4*audible+pulse*5);
  movingRings.forEach(ring=>ring.style.transform=`translateY(${lift.toFixed(2)}px) rotate(${(angle*audible).toFixed(2)}deg) scale(${scale.toFixed(3)})`);
  rhythmBars.forEach((bar,index)=>{
    const bin=Math.min(spectrum.length-1,Math.round(2*Math.pow(100,index/(rhythmBars.length-1))));
    const level=spectrum[bin]/255;
    bar.style.transform=`scaleY(${Math.max(.08,level*level).toFixed(3)})`;
  });
  miniBars.forEach((bar,index)=>bar.style.height=`${3+15*spectrum[3+index*9]/255}px`);
}
function startRhythm(){
  if(frameId||!analyser||music.paused||document.hidden||reducedMotion.matches)return;
  document.body.classList.add('rhythm-active');frameId=requestAnimationFrame(animateRhythm);
}
music.addEventListener('playing',startRhythm);
music.addEventListener('pause',stopRhythm);
music.addEventListener('ended',stopRhythm);
music.addEventListener('waiting',stopRhythm);
music.addEventListener('error',stopRhythm);
// Never keep the soundtrack playing in a hidden tab or background window.
// Returning leaves playback paused until the guest chooses Music on.
function pauseBackgroundMusic(){music.pause();stopRhythm()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseBackgroundMusic()});
window.addEventListener('pagehide',pauseBackgroundMusic);
window.addEventListener('blur',pauseBackgroundMusic);
reducedMotion.addEventListener('change',()=>{stopRhythm();startRhythm()});
const lightbox=document.querySelector('#lightbox');let previousFocus;
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{previousFocus=button;const src='assets/'+button.dataset.photo;document.querySelector('#lightboxImage').src=src;document.querySelector('#lightboxImage').alt=button.querySelector('img').alt;const download=document.querySelector('#downloadPhoto');download.href=src;download.download='Rita-and-Shepherd-'+button.dataset.photo;lightbox.showModal()}));
document.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',event=>{if(event.target===lightbox){const bounds=lightbox.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)lightbox.close()}});lightbox.addEventListener('close',()=>previousFocus?.focus());
const config=window.WEDDING||{};
if(/^https:\/\/chat\.whatsapp\.com\//.test(config.groupUrl||'')){const link=document.createElement('a');link.href=config.groupUrl;link.textContent='Join our wedding WhatsApp group ↗';link.target='_blank';link.rel='noopener';document.querySelector('#groupLink').replaceChildren(link)}
if(/^[\w-]{11}$/.test(config.youtubeVideoId||'')){const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+config.youtubeVideoId;frame.title='Rita and Shepherd’s wedding livestream';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;document.querySelector('#broadcast').replaceChildren(frame);document.querySelector('.status').textContent='Our wedding broadcast';document.querySelector('.watch .small-copy').textContent='Press play to join the celebration. You can watch in full screen.';frame.addEventListener('pointerenter',()=>music.pause())}
if(config.photos?.length){document.querySelector('.album-status').textContent='Our wedding photographs · Choose a photo to download';for(const photo of config.photos){const card=document.createElement('figure');const img=document.createElement('img');img.src=photo.src;img.alt=photo.caption||'Wedding photograph';img.loading='lazy';const link=document.createElement('a');link.href=photo.src;link.download='';link.textContent='Download photograph ↓';card.append(img,link);document.querySelector('#weddingPhotos').append(card)}}
