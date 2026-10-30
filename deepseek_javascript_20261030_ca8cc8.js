javascript:(async function(){
  document.body.innerHTML=''; document.body.style.margin='0'; document.body.style.overflow='hidden'; document.body.style.background='%23000';
  const v=document.createElement('video'); v.style.display='none'; v.autoplay=true; v.playsInline=true;
  const c=document.createElement('canvas'); c.style.position='absolute'; c.style.top='0'; c.style.left='0'; c.style.width='100%'; c.style.height='100%'; c.style.objectFit='cover'; c.style.transform='scaleX(-1)';
  document.body.appendChild(v); document.body.appendChild(c);
  const ctx=c.getContext('2d');
  function rz(){c.width=window.innerWidth; c.height=window.innerHeight;} window.addEventListener('resize',rz); rz();
  const status=document.createElement('div'); status.style.position='absolute'; status.style.bottom='30px'; status.style.left='50%'; status.style.transform='translateX(-50%)'; status.style.fontSize='2.5rem'; status.style.fontWeight='bold'; status.style.textShadow='0 0 20px %23000'; status.style.color='%23fff'; status.style.zIndex='10'; status.innerText='Yapay Zeka Yükleniyor...'; document.body.appendChild(status);
  const inst=document.createElement('div'); inst.style.position='absolute'; inst.style.top='20px'; inst.style.right='20px'; inst.style.background='rgba(0,0,0,0.7)'; inst.style.padding='10px 20px'; inst.style.borderRadius='8px'; inst.style.fontSize='0.8rem'; inst.style.color='%23fbbf24'; inst.style.border='1px solid %23fbbf24'; inst.style.zIndex='10'; inst.innerHTML='GİRESUN BULANCAK<br>BİLİM VE SANAT MERKEZİ'; document.body.appendChild(inst);
  
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  try {
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
    status.innerText = 'Kamera Bekleniyor...';
    
    let isSmiling=false, parts=[];
    const fm = new FaceMesh({locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`});
    fm.setOptions({maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5, minTrackingConfidence:0.5});
    
    fm.onResults((r) => {
      ctx.save(); ctx.clearRect(0,0,c.width,c.height);
      if(r.multiFaceLandmarks && r.multiFaceLandmarks.length > 0) {
        const l=r.multiFaceLandmarks[0][61], rt=r.multiFaceLandmarks[0][291], t=r.multiFaceLandmarks[0][13], b=r.multiFaceLandmarks[0][14];
        const w=Math.hypot(l.x-rt.x, l.y-rt.y); const h=Math.hypot(t.x-b.x, t.y-b.y);
        const sr=w/h;
        if(sr>3.5) {
          if(!isSmiling){ isSmiling=true; status.innerText='🌿 DOĞA CANLANIYOR!'; status.style.color='%234ade80'; for(let i=0;i<30;i++)mk(true); snd('good'); }
        } else {
          if(isSmiling){ isSmiling=false; status.innerText='🌫️ KİRLİLİK ARTIYOR...'; status.style.color='%23ef4444'; for(let i=0;i<20;i++)mk(false); snd('bad'); }
        }
        const n=r.multiFaceLandmarks[0][1]; const x=(1-n.x)*c.width; const y=n.y*c.height; const rad=150+Math.sin(Date.now()*0.005)*20;
        ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.strokeStyle=isSmiling?'rgba(74,222,128,0.6)':'rgba(239,68,68,0.6)'; ctx.lineWidth=8; ctx.stroke();
        ctx.shadowBlur=20; ctx.shadowColor=isSmiling?'%234ade80':'%23ef4444'; ctx.stroke(); ctx.shadowBlur=0;
      } else { status.innerText='Yüz Algılanamadı...'; status.style.color='%23fff'; isSmiling=false; }
      dr(); ctx.restore();
    });
    
    const cam = new Camera(v, {onFrame: async () => { await fm.send({image:v}); }, width:1280, height:720});
    cam.start();
    
    function mk(g){ parts.push({x:Math.random()*c.width, y:c.height+20, vx:(Math.random()-0.5)*4, vy:-Math.random()*5-2, s:Math.random()*15+10, ml:100+Math.random()*100, g:g, r:Math.random()*Math.PI*2, rs:(Math.random()-0.5)*0.1}); }
    function dr(){ for(let i=parts.length-1;i>=0;i--){ let p=parts[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.02; p.r+=p.rs; p.ml--; if(p.ml<=0){parts.splice(i,1); continue;} ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.globalAlpha=Math.min(1,p.ml/100); if(p.g){ ctx.fillStyle='%2322c55e'; ctx.beginPath(); ctx.ellipse(0,0,p.s,p.s/2,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='%23166534'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-p.s,0); ctx.lineTo(p.s,0); ctx.stroke(); } else { ctx.fillStyle='rgba(75,85,99,0.7)'; ctx.beginPath(); ctx.arc(0,0,p.s,0,Math.PI*2); ctx.fill(); } ctx.restore(); } }
    
    let ac=null;
    function snd(t){ if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended')ac.resume(); const n=ac.currentTime; if(t==='good'){ [800,1000,1200,1500].forEach((f,i)=>{ const o=ac.createOscillator(),g=ac.createGain(); o.connect(g); g.connect(ac.destination); o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,n+i*0.05); g.gain.linearRampToValueAtTime(0.05,n+i*0.05+0.02); g.gain.exponentialRampToValueAtTime(0.01,n+i*0.05+0.15); o.start(n+i*0.05); o.stop(n+i*0.05+0.2); }); } else { const o=ac.createOscillator(),g=ac.createGain(); o.connect(g); g.connect(ac.destination); o.type='sawtooth'; o.frequency.setValueAtTime(200,n); o.frequency.exponentialRampToValueAtTime(100,n+0.3); g.gain.setValueAtTime(0.05,n); g.gain.exponentialRampToValueAtTime(0.01,n+0.35); o.start(n); o.stop(n+0.4); } }
    
  } catch(e) {
    status.innerText = 'Kütüphane yüklenemedi! İnterneti kontrol et.';
    status.style.color = '%23ef4444';
  }
})();