/* ── NAV ─────────────────────────────────────────────── */
const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60));
document.getElementById('hb').addEventListener('click',()=>document.getElementById('nl').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nl').classList.remove('open')));


/* ── ANIMATIONS ENTRÉE ───────────────────────────────── */
const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('v');}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.fu').forEach(el=>obs.observe(el));

/* ── LOGO ────────────────────────────────────────────── */
function changeLogo(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    const s=ev.target.result;
    const i=document.getElementById('logo-img'),p=document.getElementById('logo-ph');
    i.src=s;i.style.display='block';p.style.display='none';
    const fi=document.getElementById('ft-logo'),fp=document.getElementById('ft-ph');
    fi.src=s;fi.style.display='block';fp.style.display='none';
    try{localStorage.setItem('sm_logo', s);}catch(e){}
    showToast('Logo intégré et sauvegardé !','success');
  };r.readAsDataURL(f);
}

/* ── IMAGE DE FOND — TÉMOIGNAGES ─────────────────────── */
function applyBgImage(id, data){
  const el=document.getElementById(id);
  if(!el)return;
  el.style.backgroundImage='url('+data+')';
  el.style.backgroundSize='cover';
  el.style.backgroundPosition='center';
}
function setBgImage(bgId,input){
  const f=input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    const data=ev.target.result;
    applyBgImage(bgId,data);
    const lbl=input.closest('label');
    if(lbl){lbl.querySelectorAll('img').forEach(i=>i.remove());}
    try{localStorage.setItem('sm_bg_'+bgId,data);}
    catch(e){showToast('Image trop lourde pour être sauvegardée','error');return;}
    showToast('Image sauvegardée — elle restera après rechargement ✓','success');
  };r.readAsDataURL(f);
}

/* ── IMAGE DE FOND — PROJETS ─────────────────────────── */
function applyPrBg(id, data){
  const el=document.getElementById(id);
  if(!el)return;
  el.style.backgroundImage='url('+data+')';
  el.style.backgroundSize='cover';
  el.style.backgroundPosition='center';
}
function setPrBg(bgId,input){
  const f=input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    const data=ev.target.result;
    applyPrBg(bgId,data);
    try{localStorage.setItem('sm_bg_'+bgId,data);}
    catch(e){showToast('Image trop lourde pour être sauvegardée','error');return;}
    showToast('Image sauvegardée — elle restera après rechargement ✓','success');
  };r.readAsDataURL(f);
}

/* ── RESTAURATION AU CHARGEMENT DE PAGE ──────────────── */
(function restoreAll(){
  // Témoignages
  ['bg-ananth','bg-ion'].forEach(id=>{
    const d=localStorage.getItem('sm_bg_'+id);
    if(d)applyBgImage(id,d);
  });
  // Projets
  ['pr-bg-1','pr-bg-2','pr-bg-3'].forEach(id=>{
    const d=localStorage.getItem('sm_bg_'+id);
    if(d)applyPrBg(id,d);
  });
  // Logo
  const logo=localStorage.getItem('sm_logo');
  if(logo){
    const i=document.getElementById('logo-img'),p=document.getElementById('logo-ph');
    if(i&&p){i.src=logo;i.style.display='block';p.style.display='none';}
    const fi=document.getElementById('ft-logo'),fp=document.getElementById('ft-ph');
    if(fi&&fp){fi.src=logo;fi.style.display='block';fp.style.display='none';}
  }
})();

/* ── DON — PAIEMENTS (Carte › Western Union › Wave) ─── */
const PI={
  card:{t:'Don par carte bancaire',s:'Visa, Mastercard, CB — 100% sécurisé',i:'💳 <strong>Carte bancaire :</strong> Virement ou PayPal à <strong>maggie.langlier@gmail.com</strong> réf. <strong>"DON SAINT MARTIN"</strong>.'},
  western:{t:'Don par Western Union',s:'Virement international sécurisé',i:'🌍 <strong>Western Union :</strong> Nom <strong>Marguerite Marie Langlier</strong>, Paris, France. Contact : <strong>+33 6 13 85 16 79</strong>.'},
  wave:{t:'Don par Wave',s:'Rapide, sécurisé, direct',i:'📱 <strong>Wave :</strong> Envoyez au <strong>+33 6 13 85 16 79</strong> (Marguerite Marie Langlier) réf. <strong>"DON SAINT MARTIN"</strong>.'},
  ria:{t:'Don par RIA',s:'Transfert d\'argent international',i:'💸 <strong>RIA :</strong> Envoyez à <strong>Marguerite Marie Langlier</strong>, Paris, France. Contact : <strong>+33 6 13 85 16 79</strong> réf. <strong>"DON SAINT MARTIN"</strong>.'},
  moneygram:{t:'Don par MoneyGram',s:'Transfert international sécurisé',i:'🏦 <strong>MoneyGram :</strong> Nom <strong>Marguerite Marie Langlier</strong>, Paris, France. Contact : <strong>+33 6 13 85 16 79</strong> réf. <strong>"DON SAINT MARTIN"</strong>.'}
};
let CM='card',CA=10;

function selM(m){
  CM=m;
  document.querySelectorAll('.dm').forEach(x=>x.classList.remove('active'));
  document.getElementById('m-'+m).classList.add('active');
  document.getElementById('don-title').textContent=PI[m].t;
  document.getElementById('don-sub').textContent=PI[m].s;
  document.getElementById('pay-info').innerHTML=PI[m].i;
}

function selA(a,e){
  document.querySelectorAll('.amt').forEach(b=>b.classList.remove('active'));
  e.target.classList.add('active');
  if(a==='custom'){document.getElementById('ca-grp').style.display='block';CA='custom';}
  else{document.getElementById('ca-grp').style.display='none';CA=a;document.getElementById('don-amt').textContent=a+' €';}
}

function procDon(){
  const em=document.getElementById('d-email').value;let a=CA;
  if(a==='custom'){a=document.getElementById('ca').value;if(!a||a<1){showToast('Montant invalide','error');return;}document.getElementById('don-amt').textContent=a+' €';}
  if(!em){showToast('Email requis pour le reçu','error');return;}
  const nm={card:'Carte bancaire',western:'Western Union',wave:'Wave',ria:'RIA',moneygram:'MoneyGram'};
  document.getElementById('m-ic').textContent='✅';
  document.getElementById('m-title').textContent='Merci pour votre don !';
  document.getElementById('m-body').innerHTML=`<strong>Récapitulatif :</strong><br>• Montant : <strong>${a} €</strong><br>• Méthode : <strong>${nm[CM]}</strong><br>• Email : <strong>${em}</strong><br><br>${PI[CM].i}<br><br><em style="color:var(--GR)">Un email de confirmation vous sera envoyé après réception. Merci !</em>`;
  openM('mDon');
}

/* ════════════════════════════════════════════════════════
   EMAILJS — Configuration
   ① Créez un compte gratuit sur https://www.emailjs.com
   ② Allez dans "Email Services" → connectez votre Gmail/Outlook
   ③ Allez dans "Email Templates" → créez un template avec les
      variables : {{prenom}}, {{nom}}, {{email}}, {{telephone}},
      {{mission}}, {{message}}
   ④ Remplacez les 3 valeurs ci-dessous par vos vraies clés
   ════════════════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'O9gYbfs245aeJVDdS';   // Account > API Keys
const EMAILJS_SERVICE_ID  = 'service_yqfb5pe';   // Email Services > Service ID
const EMAILJS_TEMPLATE_ID = 'template_vh6bae8';  // Email Templates > Template ID
const EMAILJS_TEMPLATE_CT     = 'template_z0cf3bc';  // contact  → Marguerite

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ── FORMULAIRES ─────────────────────────────────────── */
function sendBen(){
  const pr=document.getElementById('v-pr').value.trim();
  const nm=document.getElementById('v-nm').value.trim();
  const em=document.getElementById('v-em').value.trim();
  const tel=document.getElementById('v-tel').value.trim();
  const type=document.getElementById('v-type').value;
  const msg=document.getElementById('v-msg').value.trim();

  if(!pr||!nm||!em){showToast('Champs obligatoires manquants','error');return;}

  // Vérifier que les clés EmailJS ont été configurées
  if(EMAILJS_PUBLIC_KEY==='VOTRE_PUBLIC_KEY'){
    // Mode démonstration sans EmailJS configuré
    openM('mJoin');
    ['v-pr','v-nm','v-em','v-tel','v-msg'].forEach(i=>document.getElementById(i).value='');
    showToast('⚠️ EmailJS non configuré — email non envoyé','error');
    return;
  }

  const btn=document.querySelector('#join .btn-r');
  const origTxt=btn.textContent;
  btn.textContent='Envoi en cours…';btn.disabled=true;

  const params={
    prenom:   pr,
    nom:      nm,
    email:    em,
    telephone:tel||'Non renseigné',
    mission:  type||'Non renseignée',
    message:  msg||'Aucun message',
    to_email: em,          // destinataire = le candidat
    reply_to: em
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(()=>{
      openM('mJoin');
      ['v-pr','v-nm','v-em','v-tel','v-msg'].forEach(i=>document.getElementById(i).value='');
      showToast('Email de confirmation envoyé à '+em+' ✓','success');
    })
    .catch(err=>{
      console.error('EmailJS error:',err);
      showToast('Erreur envoi email — vérifiez la configuration EmailJS','error');
    })
    .finally(()=>{btn.textContent=origTxt;btn.disabled=false;});
}
function sendCt(){
  const pr=document.getElementById('ct-pr').value.trim();
  const nm=document.getElementById('ct-nm').value.trim();
  const em=document.getElementById('ct-em').value.trim();
  const sj=document.getElementById('ct-sj').value;
  const msg=document.getElementById('ct-msg').value.trim();

  if(!pr||!em||!msg){showToast('Champs obligatoires manquants','error');return;}

  if(EMAILJS_PUBLIC_KEY==='VOTRE_PUBLIC_KEY'){
    openM('mCt');
    ['ct-pr','ct-nm','ct-em','ct-msg'].forEach(i=>document.getElementById(i).value='');
    showToast('⚠️ EmailJS non configuré — email non envoyé','error');
    return;
  }

  const btn=document.querySelector('#contact .btn-r');
  const origTxt=btn.textContent;
  btn.textContent='Envoi en cours…';btn.disabled=true;

  const params={
    prenom:   pr,
    nom:      nm||'Non renseigné',
    email:    em,
    sujet:    sj||'Question générale',
    message:  msg,
    to_email: 'maggie.langlier@gmail.com',
    reply_to: em
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CT, params)
    .then(()=>{
      openM('mCt');
      ['ct-pr','ct-nm','ct-em','ct-msg'].forEach(i=>document.getElementById(i).value='');
      showToast('Message envoyé avec succès ✓','success');
    })
    .catch(err=>{
      console.error('EmailJS error:',err);
      showToast('Erreur envoi email — vérifiez la configuration EmailJS','error');
    })
    .finally(()=>{btn.textContent=origTxt;btn.disabled=false;});
}

/* ── MODALS ──────────────────────────────────────────── */
function openM(id){document.getElementById(id).classList.add('active');}
function closeM(id){document.getElementById(id).classList.remove('active');}
document.querySelectorAll('.modal-ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('active');}));

/* ── TOAST ───────────────────────────────────────────── */
function showToast(msg,type='info'){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast '+type+' show';
  setTimeout(()=>t.classList.remove('show'),3500);
}

/* ── NAV ACTIF ───────────────────────────────────────── */
window.addEventListener('scroll',()=>{
  let c='';
  document.querySelectorAll('section[id]').forEach(s=>{if(scrollY>=s.offsetTop-100)c=s.id;});
  document.querySelectorAll('.nav-links a').forEach(a=>a.style.color=a.getAttribute('href')==='#'+c?'var(--B)':'');
});
