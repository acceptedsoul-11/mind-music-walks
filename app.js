const $ = (selector) => document.querySelector(selector);
const state = { mood: 'frazzled', minutes: 10, sound: 'music', language: localStorage.getItem('mmw-language') || 'en', guide: [], segment: 0, active: false, paused: false, seconds: 0, timer: null, audio: null, oscillators: [], noise: null, session: 0 };
const guides = {
  en: {
    frazzled: [{ title: 'Find your own easy pace.', text: 'Let your shoulders drop a little. Feel the air move across your face. You can take this one step at a time.' }, { title: 'Notice what is already here.', text: 'Listen for one sound close by, then one further away. Nothing to solve. Just this small patch of the world.' }, { title: 'Let a breath come and go.', text: 'If it feels comfortable, breathe in gently and let the exhale be a little longer. No need to force it.' }, { title: 'Give your eyes somewhere soft to land.', text: 'Find a patch of green, a cloud, or the way light falls on a wall. Let yourself look without naming it.' }, { title: 'Take this quiet with you.', text: 'Feel your feet on the path. When you are ready, head back at your own pace. You did enough by showing up.' }],
    low: [{ title: 'Start exactly where you are.', text: 'There is no need to feel different before you begin. Let the outside air meet you just as you are.' }, { title: 'Look for one small sign of life.', text: 'A leaf shifting, a bird passing, a plant making its way through. Small things count, too.' }, { title: 'Let the light find you.', text: 'Notice where the light touches your path. Take a gentle breath in, and let it leave when it is ready.' }, { title: 'Make a little space for ease.', text: 'Feel the ground hold your steps. You can move slowly. There is no catching up to do.' }, { title: 'Bring one good thing home.', text: 'Maybe it is a colour, a sound, or a breath that felt easier. Carry it softly, without asking it to last.' }],
    restless: [{ title: 'Let your feet find a rhythm.', text: 'Walk at a pace that feels natural. Notice the gentle pattern of one step and then the next.' }, { title: 'Let your attention wander.', text: 'Follow one sound for a moment. Let it fade, then notice something else nearby.' }, { title: 'Feel the air move.', text: 'Notice the breeze on your skin or the warmth of the day. Let your breathing find its own pace.' }, { title: 'Unclench what you can.', text: 'Soften your hands if that feels comfortable. Let your jaw loosen. You can leave the rest for later.' }, { title: 'Choose a slower last minute.', text: 'Let your steps become a little smaller. Notice the path underfoot and take your time heading back.' }],
    steady: [{ title: 'Arrive in the place you are.', text: 'Feel the ground beneath your feet. Take a slow look around at the place you have come to.' }, { title: 'Pick one small detail.', text: 'A shape, a colour, a sound. Stay with it for a few seconds, the way you might greet an old friend.' }, { title: 'Let the world be enough.', text: 'Notice what is moving and what is still. You do not have to make anything of it.' }, { title: 'Take a breath with the day.', text: 'Breathe in as gently as you like. Let the exhale fall away on its own.' }, { title: 'Keep a little room for wonder.', text: 'As you walk on, let your attention rest wherever it likes. The ordinary can be lovely, too.' }]
  },
  hi: {
    frazzled: [{ title: 'अपनी सहज चाल चुनें।', text: 'कंधों को थोड़ा ढीला छोड़ें। चेहरे पर आती हवा को महसूस करें। बस एक कदम, फिर अगला।' }, { title: 'जो आसपास है, उसे सुनें।', text: 'पास की एक आवाज़ सुनें, फिर दूर की। कुछ ठीक करने की ज़रूरत नहीं। बस इस पल में रहें।' }, { title: 'सांस को आने-जाने दें।', text: 'अगर सहज लगे, धीरे से सांस लें और छोड़ते समय थोड़ा आराम करें। कोई ज़ोर नहीं।' }, { title: 'नज़र को किसी मुलायम जगह टिकाएँ।', text: 'हरियाली, बादल या दीवार पर पड़ती रोशनी देखें। उसे नाम देना ज़रूरी नहीं।' }, { title: 'इस शांति को साथ ले जाएँ।', text: 'पैरों के नीचे रास्ता महसूस करें। जब तैयार हों, अपनी चाल से लौटें।' }],
    low: [{ title: 'जहाँ हैं, वहीं से शुरू करें।', text: 'शुरू करने से पहले कुछ बदलना ज़रूरी नहीं। बाहर की हवा आपको ऐसे ही मिलने दें।' }, { title: 'जीवन का एक छोटा संकेत देखें।', text: 'हिलता पत्ता, गुज़रती चिड़िया या उगता पौधा। छोटी बातें भी मायने रखती हैं।' }, { title: 'दिन की रोशनी महसूस करें।', text: 'रास्ते पर रोशनी को देखें। हल्की सांस लें और उसे आराम से छोड़ दें।' }, { title: 'थोड़ी सहजता के लिए जगह बनाएँ।', text: 'कदमों के नीचे ज़मीन को महसूस करें। धीरे चलना ठीक है।' }, { title: 'एक अच्छी बात साथ ले जाएँ।', text: 'कोई रंग, आवाज़ या आसान लगी सांस। उसे बस प्यार से याद रखें।' }],
    restless: [{ title: 'कदमों को अपनी लय खोजने दें।', text: 'स्वाभाविक गति से चलें। एक कदम और फिर अगले की नरम लय महसूस करें।' }, { title: 'ध्यान को थोड़ा भटकने दें।', text: 'एक आवाज़ को पल भर सुनें। फिर आसपास किसी और चीज़ पर ध्यान दें।' }, { title: 'हवा को महसूस करें।', text: 'त्वचा पर हवा या दिन की गर्माहट महसूस करें। सांस अपनी गति से चलने दें।' }, { title: 'जो ढीला कर सकें, करें।', text: 'हाथ सहज छोड़ें, अगर ठीक लगे। बाकी बातें बाद के लिए रख सकते हैं।' }, { title: 'आखिरी मिनट थोड़ा धीमे चलें।', text: 'छोटे कदम लें। रास्ता महसूस करें और लौटने में अपना समय लें।' }],
    steady: [{ title: 'इस जगह में पूरी तरह आएँ।', text: 'पैरों के नीचे ज़मीन महसूस करें। आसपास की जगह को आराम से देखें।' }, { title: 'एक छोटी बात चुनें।', text: 'कोई आकार, रंग या आवाज़। कुछ पल उसके साथ रहें।' }, { title: 'दुनिया को जैसा है वैसा रहने दें।', text: 'जो चल रहा है और जो स्थिर है, उसे देखें। कुछ बनाने की ज़रूरत नहीं।' }, { title: 'दिन के साथ सांस लें।', text: 'जितना सहज लगे, सांस लें। छोड़ते समय उसे अपने आप जाने दें।' }, { title: 'थोड़ी हैरानी के लिए जगह रखें।', text: 'चलते हुए ध्यान जहाँ चाहे ठहरने दें। साधारण चीज़ें भी सुंदर होती हैं।' }]
  }
};

function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2600); }
async function checkModel() {
  const badge = $('#modelBadge');
  try { const data = await fetch('/api/model-status').then((r) => r.json()); badge.classList.toggle('ready', data.available); badge.querySelector('span').textContent = data.available ? 'Gemma · on this device' : 'Offline guide ready'; $('#modelNote').textContent = data.available ? (state.language === 'hi' ? 'Hindi guides are written locally; English guides can be personalized privately with Gemma.' : 'Your English guide is shaped privately by Gemma on this device.') : 'Install Gemma locally for personalized English guides. Ready-to-go guides work without it.'; }
  catch { badge.querySelector('span').textContent = 'Offline guide ready'; }
}
function selectOne(selector, attribute, value) {
  document.querySelectorAll(selector).forEach((button) => { const active = button.dataset[attribute] === value; button.classList.toggle('active', active); button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active)); });
}
document.querySelectorAll('.mood-card').forEach((button) => button.addEventListener('click', () => { state.mood = button.dataset.mood; selectOne('.mood-card', 'mood', state.mood); }));
document.querySelectorAll('.duration-chip').forEach((button) => button.addEventListener('click', () => { state.minutes = Number(button.dataset.minutes); selectOne('.duration-chip', 'minutes', String(state.minutes)); }));
document.querySelectorAll('.sound-chip').forEach((button) => button.addEventListener('click', () => { state.sound = button.dataset.sound; selectOne('.sound-chip', 'sound', state.sound); }));
$('#languageToggle').addEventListener('click', () => { state.language = state.language === 'en' ? 'hi' : 'en'; localStorage.setItem('mmw-language', state.language); $('#languageToggle').innerHTML = `${state.language.toUpperCase()} <span>⌄</span>`; toast(state.language === 'hi' ? 'हिंदी चुनी गई' : 'English selected'); });

function prepareLocalGuide() { const source = guides[state.language][state.mood]; const stride = state.minutes === 5 ? [0, 4] : state.minutes === 10 ? [0, 2, 4] : state.minutes === 15 ? [0, 1, 2, 3, 4] : [0, 1, 1, 2, 3, 4]; return stride.map((index) => source[index]); }
async function makeGuide() {
  if (state.language === 'hi') return { source: 'offline', slides: prepareLocalGuide() };
  const res = await fetch('/api/guide', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood: state.mood, minutes: state.minutes, language: state.language }), signal: AbortSignal.timeout(95000) });
  const payload = await res.json(); if (!res.ok) throw new Error(payload.error || 'Gemma is not available.');
  const sentences = payload.guide.split('\n').map((line) => line.trim()).filter(Boolean); const base = guides[state.language][state.mood];
  return { source: payload.source, slides: sentences.map((text, i) => ({ title: base[Math.min(i, base.length - 1)].title, text })) };
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = state.language === 'hi' ? 'hi-IN' : 'en-IN'; utterance.rate = 0.86; utterance.pitch = 1.0; speechSynthesis.speak(utterance);
}
function stopAudio() { if ('speechSynthesis' in window) speechSynthesis.cancel(); if (state.timer) clearInterval(state.timer); state.timer = null; state.active = false; state.paused = false; if (state.audio) { state.audio.close().catch(() => {}); state.audio = null; } state.oscillators = []; state.noise = null; }
function startAmbience() {
  if (state.sound === 'quiet' || state.audio) return;
  try {
    const ctx = new AudioContext(); state.audio = ctx; ctx.resume().catch(() => {}); const master = ctx.createGain(); master.gain.value = 0.055; master.connect(ctx.destination);
    if (state.sound === 'music') { for (const frequency of [174.61, 220, 261.63]) { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine'; osc.frequency.value = frequency; gain.gain.value = 0.2; osc.connect(gain).connect(master); osc.start(); state.oscillators.push(osc); } return; }
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true; const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = state.sound === 'rain' ? 620 : 360; const gain = ctx.createGain(); gain.gain.value = state.sound === 'rain' ? 0.38 : 0.18; noise.connect(filter).connect(gain).connect(master); noise.start(); state.noise = noise;
    if (state.sound === 'birds') { for (const [freq, delay] of [[329.63, 0], [392, 1.7], [440, 4.4]]) { const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.type = 'sine'; osc.frequency.value = freq; g.gain.value = 0; osc.connect(g).connect(master); osc.start(); const chirp = () => { if (!state.active || state.paused) return; const now = ctx.currentTime; g.gain.cancelScheduledValues(now); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.13, now + 0.12); g.gain.exponentialRampToValueAtTime(0.001, now + 0.9); setTimeout(chirp, 6200 + Math.random() * 4100); }; setTimeout(chirp, delay * 1000); state.oscillators.push(osc); } }
  } catch { /* The spoken guide remains available when browser audio is restricted. */ }
}
function displaySegment() { const slide = state.guide[state.segment]; if (!slide) return; $('#walkTitle').textContent = slide.title; $('#walkText').textContent = slide.text; speak(slide.text); $('#walkSource').textContent = state.guideSource === 'gemma' ? 'A PRIVATE GUIDE, MADE WITH GEMMA' : 'A GENTLE OFFLINE GUIDE'; }
function setPaused(value) { state.paused = value; $('#playPause').textContent = value ? '▶' : 'Ⅱ'; $('#playPause').setAttribute('aria-label', value ? 'Resume walk audio' : 'Pause walk audio'); if (value) { if ('speechSynthesis' in window) speechSynthesis.cancel(); if (state.audio) state.audio.suspend(); } else { if (state.audio) state.audio.resume(); displaySegment(); } }
function setMoodWalkLabel() { const labels = { frazzled: state.language === 'hi' ? 'आपकी नरम सांस' : 'YOUR GENTLE RESET', low: state.language === 'hi' ? 'उजाले की छोटी सैर' : 'A SMALL LIFT', restless: state.language === 'hi' ? 'अपनी लय में चलें' : 'FIND YOUR RHYTHM', steady: state.language === 'hi' ? 'इस पल में रहें' : 'A MOMENT OUTSIDE' }; $('#walkMode').textContent = `${labels[state.mood]} · ${state.minutes} MIN`; }
function beginWalk() {
  if (state.active) return;
  const session = ++state.session;
  const button = $('#startWalk'); button.disabled = true; button.querySelector('b').textContent = 'Opening up a little space…';
  state.guideSource = 'offline'; state.guide = prepareLocalGuide(); state.segment = 0; state.seconds = 0; state.active = true; state.paused = false;
  $('#totalTime').textContent = `${String(state.minutes).padStart(2, '0')}:00`; $('#elapsedTime').textContent = '00:00'; $('#progressFill').style.width = '0%'; setMoodWalkLabel();
  document.body.classList.add('walking'); $('#walkScreen').hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); displaySegment(); startAmbience();
  state.timer = setInterval(() => {
    if (!state.active || state.paused) return;
    state.seconds++; const duration = state.minutes * 60; const progress = Math.min(100, state.seconds / duration * 100); $('#elapsedTime').textContent = `${String(Math.floor(state.seconds / 60)).padStart(2, '0')}:${String(state.seconds % 60).padStart(2, '0')}`; $('#progressFill').style.width = `${progress}%`;
    const next = Math.min(state.guide.length - 1, Math.floor(state.seconds / (duration / state.guide.length))); if (next !== state.segment) { state.segment = next; displaySegment(); }
    if (state.seconds >= duration) finishWalk();
  }, 1000);
  button.disabled = false; button.querySelector('b').textContent = 'Make my walk';
  button.querySelector('small').textContent = 'A quiet companion is waiting';
  makeGuide().then((result) => {
    if (!state.active || state.session !== session || result.source !== 'gemma') return;
    state.guide = result.slides; state.guideSource = 'gemma';
    const duration = state.minutes * 60; state.segment = Math.min(state.guide.length - 1, Math.floor(state.seconds / (duration / state.guide.length)));
    if (!state.paused) displaySegment();
    else { const slide = state.guide[state.segment]; $('#walkTitle').textContent = slide.title; $('#walkText').textContent = slide.text; $('#walkSource').textContent = 'A PRIVATE GUIDE, MADE WITH GEMMA'; }
  }).catch(() => { /* The voice-led authored guide is already playing. */ });
}
function finishWalk() { state.session++; stopAudio(); document.body.classList.remove('walking'); $('#walkScreen').hidden = true; toast(state.language === 'hi' ? 'आपने अपने लिए थोड़ा समय निकाला।' : 'You made a little time for yourself.'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
$('#startWalk').addEventListener('click', beginWalk);
$('#endWalk').addEventListener('click', finishWalk);
$('#playPause').addEventListener('click', () => setPaused(!state.paused));
$('#restartGuide').addEventListener('click', () => { state.segment = 0; displaySegment(); });
$('#soundToggle').addEventListener('click', () => { if (state.audio) { state.audio.close().catch(() => {}); state.audio = null; state.oscillators = []; $('#soundToggle').textContent = '♩'; toast('Ambient sound paused'); } else { startAmbience(); $('#soundToggle').textContent = '♬'; toast('Ambient sound on'); } });
$('#privacyInfo').addEventListener('click', () => toast('Your check-in is used only to shape this guide. It is not saved or sent anywhere.'));
$('#historyButton').addEventListener('click', () => { const panel = $('#historyPanel'); panel.hidden = !panel.hidden; $('#historyButton span').textContent = panel.hidden ? '＋' : '−'; if (!panel.hidden) renderNotes(); });
function getNotes() { try { return JSON.parse(localStorage.getItem('mmw-notes') || '[]'); } catch { return []; } }
function renderNotes() { const notes = getNotes(); $('#clearNotes').hidden = notes.length === 0; $('#pastNotes').innerHTML = notes.slice(0, 3).map((note) => `<div class="past-note"><time>${new Date(note.date).toLocaleString(state.language === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>${escapeHtml(note.text)}</div>`).join(''); }
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
$('#saveReflection').addEventListener('click', () => { const text = $('#reflection').value.trim(); if (!text) return toast('Add a small note first, or leave it blank.'); const notes = [{ date: new Date().toISOString(), text }, ...getNotes()].slice(0, 20); localStorage.setItem('mmw-notes', JSON.stringify(notes)); $('#reflection').value = ''; $('#savedStatus').textContent = 'Saved on this device'; renderNotes(); toast('A little note, just for you.'); });
$('#clearNotes').addEventListener('click', () => { if (!getNotes().length) return; if (!window.confirm('Clear all saved notes from this device?')) return; localStorage.removeItem('mmw-notes'); $('#savedStatus').textContent = 'Saved notes cleared from this device'; renderNotes(); toast('Saved notes cleared from this device.'); });
window.addEventListener('beforeunload', stopAudio);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
$('#languageToggle').innerHTML = `${state.language.toUpperCase()} <span>⌄</span>`;
checkModel();
