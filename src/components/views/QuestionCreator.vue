<template>
  <section class="qb-wrap">
    <div class="qb-head">
      <div class="title">
        <h2>New Question</h2>
        <span class="badge">{{ answers.length }} answer(s)</span>
      </div>
      <div class="actions">
        <button class="btn ghost" @click="resetForm" :disabled="loading">Reset</button>
        <button class="btn primary" @click="submit" :disabled="loading">
          <span v-if="!loading">Save</span>
          <span v-else class="spinner" aria-label="Saving…"></span>
        </button>
      </div>
    </div>

    <div class="qb-body">
      <!-- Left -->
      <div class="left">
        <div class="card">
          <div class="row-2">
            <div>
              <label class="label">Subject</label>
              <input v-model.trim="form.subject" class="input" placeholder="Mathematics" />
            </div>
            <div>
              <label class="label">Topic</label>
              <input v-model.trim="form.topic" class="input" placeholder="Quadratic equations" />
            </div>
          </div>

          <div class="row-2">
            <div>
              <label class="label">Difficulty</label>
              <div class="chips">
                <label v-for="d in difficulties" :key="d" class="chip" :class="{active: form.difficulty===d}">
                  <input type="radio" name="diff" :value="d" v-model="form.difficulty" />
                  {{ d }}
                </label>
              </div>
            </div>
            <div>
              <label class="label">Points</label>
              <input type="number" min="1" class="input" v-model.number="form.point" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="label-row">
            <label class="label">Question Text</label>
            <small class="muted">Markdown + LaTeX: <code>$a^2$</code> or <code>$$E=mc^2$$</code></small>
          </div>

          <div class="editor">
            <textarea v-model="form.text" class="textarea" placeholder="Write the question..." @input="queueTypeset"></textarea>
            <div class="preview" ref="previewRef" v-html="renderedMarkdown"></div>
          </div>

          <div class="row-2">
            <div>
              <label class="label">Hint (optional)</label>
              <textarea v-model="form.hint" class="textarea sm" placeholder="Short hint..."></textarea>
            </div>
            <div>
              <label class="label">Solution (optional)</label>
              <textarea v-model="form.solution" class="textarea sm" placeholder="Model solution..." @input="queueTypeset"></textarea>
            </div>
          </div>
        </div>

        <!-- Answers -->
        <div class="card">
          <div class="label-row">
            <label class="label">Answers</label>
            <button class="btn tiny ghost" @click="addAnswer">Add answer</button>
          </div>

          <div class="answers">
            <div v-for="(a, i) in answers" :key="a.uid" class="answer">
              <div class="answer-head">
                <div class="order">#{{ i+1 }}</div>
                <label class="check">
                  <input type="checkbox" v-model="a.correct" />
                  Correct
                </label>
                <div class="tools">
                  <button class="icon-btn" @click="moveAnswer(i, -1)" :disabled="i===0" title="Move up">▲</button>
                  <button class="icon-btn" @click="moveAnswer(i, +1)" :disabled="i===answers.length-1" title="Move down">▼</button>
                  <button class="icon-btn danger" @click="removeAnswer(i)" title="Delete">✕</button>
                </div>
              </div>

              <div class="answer-body">
                <textarea v-model="a.text" class="textarea sm" placeholder="Answer text (optional if image)"></textarea>

                <div class="uploader" @dragover.prevent @drop.prevent="onAnswerDrop(i, $event)">
                  <input type="file" accept="image/*" @change="onAnswerImage(i, $event)" />
                  <div v-if="!a.imagePreview" class="uploader-empty">
                    <div class="muted">Drag & drop or click to add image (optional)</div>
                  </div>
                  <div v-else class="uploader-preview">
                    <img :src="a.imagePreview" alt="Answer image" />
                    <button class="btn tiny ghost" @click="clearAnswerImage(i)">Remove image</button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="answers.length===0" class="empty">
              No answers yet. Click “Add answer” to create choices — or leave empty for open-ended questions.
            </div>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="right">
        <div class="card">
          <label class="label">Question Image (optional)</label>
          <div class="uploader" @dragover.prevent @drop.prevent="onQuestionDrop">
            <input type="file" accept="image/*" @change="onQuestionImage" />
            <div v-if="!form.imagePreview" class="uploader-empty">
              <div class="muted">Drag & drop or click to upload</div>
            </div>
            <div v-else class="uploader-preview">
              <img :src="form.imagePreview" alt="Question image" />
              <button class="btn tiny ghost" @click="clearQuestionImage">Remove</button>
            </div>
          </div>
        </div>

        <div class="card">
          <label class="label">Tags</label>
          <input class="input" v-model="tagsText" placeholder="algebra, quadratic, grade-7" />
        </div>

        <div class="card">
          <div class="muted" style="font-size:13px">
            API: <code>POST http://localhost:8080/api/questions</code>
          </div>
          <button class="btn primary w100" @click="submit" :disabled="loading">
            <span v-if="!loading">Save Question</span>
            <span v-else class="spinner" aria-label="Saving…"></span>
          </button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="toast.text" class="toast" :class="toast.kind">{{ toast.text }}</div>
    </transition>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
const API = import.meta.env.VITE_API;

const difficulties = ['EASY', 'MEDIUM', 'HARD'];

const form = reactive({
  subject: '',
  topic: '',
  difficulty: 'MEDIUM',
  text: '',
  hint: '',
  solution: '',
  point: 1,
  imageFile: null,
  imagePreview: ''
});

const answers = reactive([]); // { uid, text, correct, imageFile, imagePreview }
const tagsText = ref('');
const loading = ref(false);
const toast = reactive({ text: '', kind: 'ok' });

const tokenHeader = () => {
  const t = sessionStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* Markdown-lite + MathJax preview */
const previewRef = ref(null);
const renderedMarkdown = computed(() => {
  let s = (form.text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  s = s
    .replace(/^### (.*$)/gim,'<h3>$1</h3>')
    .replace(/^## (.*$)/gim,'<h2>$1</h2>')
    .replace(/^# (.*$)/gim,'<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim,'<em>$1</em>')
    .replace(/`([^`]+)`/gim,'<code>$1</code>')
    .replace(/^- (.*)$/gim,'<li>$1</li>')
    .replace(/\n{2,}/g,'</p><p>')
    .replace(/\n/g,'<br/>');
  if (!/^<h\d|<p|<ul|<ol/.test(s)) s = `<p>${s}</p>`;
  return s;
});
let typesetQueued = false;
function queueTypeset(){
  if (typesetQueued) return;
  typesetQueued = true;
  nextTick(() => {
    typesetQueued = false;
    if (window.MathJax && previewRef.value) window.MathJax.typesetPromise([previewRef.value]);
  });
}
onMounted(() => {
  if (!window.MathJax) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    s.async = true; s.onload = queueTypeset; document.head.appendChild(s);
  } else queueTypeset();
});

/* answer ops */
function addAnswer(){ answers.push({ uid: crypto.randomUUID?.() || String(Date.now()+Math.random()), text:'', correct:false, imageFile:null, imagePreview:'' }); }
function removeAnswer(i){ const a=answers[i]; if(a?.imagePreview) URL.revokeObjectURL(a.imagePreview); answers.splice(i,1); }
function moveAnswer(i,dir){ const j=i+dir; if(j<0||j>=answers.length) return; const t=answers[i]; answers[i]=answers[j]; answers[j]=t; }
function onAnswerImage(i,e){ const f=e.target.files?.[0]; if(!f) return; answers[i].imageFile=f; if(answers[i].imagePreview) URL.revokeObjectURL(answers[i].imagePreview); answers[i].imagePreview=URL.createObjectURL(f); }
function onAnswerDrop(i,evt){ const f=evt.dataTransfer?.files?.[0]; if(!f) return; answers[i].imageFile=f; if(answers[i].imagePreview) URL.revokeObjectURL(answers[i].imagePreview); answers[i].imagePreview=URL.createObjectURL(f); }
function clearAnswerImage(i){ const a=answers[i]; a.imageFile=null; if(a.imagePreview) URL.revokeObjectURL(a.imagePreview); a.imagePreview=''; }

/* question image */
function onQuestionImage(e){ const f=e.target.files?.[0]; if(!f) return; form.imageFile=f; if(form.imagePreview) URL.revokeObjectURL(form.imagePreview); form.imagePreview=URL.createObjectURL(f); }
function onQuestionDrop(evt){ const f=evt.dataTransfer?.files?.[0]; if(!f) return; form.imageFile=f; if(form.imagePreview) URL.revokeObjectURL(form.imagePreview); form.imagePreview=URL.createObjectURL(f); }
function clearQuestionImage(){ form.imageFile=null; if(form.imagePreview) URL.revokeObjectURL(form.imagePreview); form.imagePreview=''; }

/* helpers */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const r = new FileReader();
    r.onload = () => resolve(r.result);          // full data URL (data:image/png;base64,...)
    r.onerror = () => reject(new Error('Failed to read file'));
    r.readAsDataURL(file);
  });
}

function splitTags() {
  return tagsText.value.split(',').map(t=>t.trim()).filter(Boolean);
}

/* submit: send JSON with Base64 (matches backend) */
async function submit(){
  try{
    loading.value = true;

    // Build JSON payload expected by backend (Base64 fields)
    const qDataUrl = await fileToDataUrl(form.imageFile);
    const answersDataUrls = await Promise.all(answers.map(a => fileToDataUrl(a.imageFile)));

    const payload = {
      subject: form.subject,
      topic: form.topic,
      difficulty: form.difficulty,
      text: form.text,
      hint: form.hint || null,
      solution: form.solution || null,
      point: form.point ?? 1,
      tags: splitTags(), // backend can ignore if not used

      // question image (send full data URL; backend strips prefix)
      imageBase64: qDataUrl,
      imageContentType: form.imageFile?.type || null,
      imageFilename: form.imageFile?.name || null,

      // answers (only include ones with text or image)
      answers: answers
        .map((a, idx) => ({
          text: (a.text || '').trim(),
          correct: !!a.correct,
          position: idx,
          imageBase64: answersDataUrls[idx],
          imageContentType: a.imageFile?.type || null,
          imageFilename: a.imageFile?.name || null
        }))
        .filter(a => a.text || a.imageBase64)
    };

    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API}/qustions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text().catch(()=> '');
      throw new Error(`${res.status} ${res.statusText}${txt ? ' — ' + txt : ''}`);
    }

    showToast('Question saved!', 'ok');
    resetForm();
  }catch(e){
    console.error(e);
    showToast('Save failed: ' + (e.message || 'Check API'), 'err');
  }finally{
    loading.value = false;
  }
}

function resetForm(){
  form.subject=''; form.topic=''; form.difficulty='MEDIUM';
  form.text=''; form.hint=''; form.solution=''; form.points=1;
  clearQuestionImage(); tagsText.value=''; answers.splice(0, answers.length);
  queueTypeset();
}
function showToast(text, kind='ok'){ toast.text=text; toast.kind=kind; setTimeout(()=>toast.text='', 1800); }
</script>

<style scoped>
/* unchanged styles from your original */
.qb-wrap{ display:flex; flex-direction:column; gap:14px; height:100%; }
.qb-head{ background:#fff; border-radius:14px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 6px 16px rgba(0,0,0,.05); }
.title{ display:flex; align-items:center; gap:10px; } h2{ margin:0; font-size:20px; font-weight:800; color:#0b1522; }
.badge{ background:#eef2f7; color:#3b4452; padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px; }
.actions{ display:flex; gap:10px; }
.qb-body{ display:grid; grid-template-columns: 1fr 340px; gap:14px; } .left,.right{ display:flex; flex-direction:column; gap:14px; }
.card{ background:#fff; border-radius:14px; padding:12px; box-shadow:0 6px 18px rgba(0,0,0,.05); }
.label{ display:block; font-weight:800; color:#0b1522; margin-bottom:8px; } .label-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.muted{ color:#7c8a9a; }
.row-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.input{ border:1px solid #d6dde7; background:#fff; border-radius:10px; padding:10px 12px; outline:none; }
.input:focus{ border-color:#7aa9ff; box-shadow:0 0 0 3px rgba(58,126,255,.15); }
.chips{ display:flex; gap:8px; flex-wrap:wrap; } .chip{ padding:8px 12px; border-radius:999px; border:1px solid #d6dde7; background:#f6f8fb; font-weight:700; cursor:pointer; } .chip input{ display:none; } .chip.active{ background:#0b1522; border-color:#0b1522; color:#fff; }
.editor{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.textarea{ width:100%; min-height:180px; resize:vertical; border:1px solid #e1e7ef; background:#f9fbfd; border-radius:10px; padding:10px 12px; outline:none; }
.textarea.sm{ min-height:110px; } .preview{ border:1px solid #e1e7ef; background:#fff; border-radius:10px; padding:10px 12px; overflow:auto; min-height:180px; }
.answers{ display:flex; flex-direction:column; gap:12px; }
.answer{ border:1px solid #e7edf5; border-radius:12px; padding:10px; background:#fbfcfe; }
.answer-head{ display:flex; align-items:center; gap:10px; justify-content:space-between; }
.order{ font-weight:800; color:#3a4250; } .check{ display:flex; align-items:center; gap:8px; font-weight:700; color:#2c3645; }
.tools{ display:flex; gap:6px; } .icon-btn{ border:none; background:#eef2f7; border-radius:8px; padding:6px 8px; cursor:pointer; } .icon-btn:disabled{ opacity:.5; cursor:not-allowed; } .icon-btn.danger{ background:#ffe6e6; }
.uploader{ position:relative; border:1px dashed #cfd8e3; border-radius:12px; background:#f9fbfd; padding:12px; text-align:center; }
.uploader input{ position:absolute; inset:0; opacity:0; cursor:pointer; }
.uploader-empty{ font-size:13px; color:#7b8796; }
.uploader-preview{ display:flex; flex-direction:column; gap:8px; align-items:center; }
.uploader-preview img{ max-width:100%; border-radius:10px; }
.btn{ border:none; border-radius:10px; padding:10px 14px; font-weight:800; cursor:pointer; }
.btn.primary{ background:#f7d54c; color:#0b1522; } .btn.ghost{ background:#f1f4f8; color:#0b1522; } .btn.tiny{ padding:6px 10px; font-size:13px; border-radius:8px; }
.w100{ width:100%; } .spinner{ width:18px; height:18px; border-radius:50%; border:2px solid #0b1522; border-right-color:transparent; animation:spin .7s linear infinite; display:inline-block; }
@keyframes spin{ to{ transform:rotate(360deg) } }
.toast{ position:fixed; right:18px; bottom:18px; padding:12px 14px; border-radius:12px; color:#0b1522; box-shadow:0 8px 20px rgba(0,0,0,.12); }
.toast.ok{ background:#c9f7d1; } .toast.err{ background:#ffd3d3; }
.toast-enter-active,.toast-leave-active{ transition: all .2s ease; } .toast-enter-from,.toast-leave-to{ opacity:0; transform: translateY(6px); }
@media (max-width:1100px){ .qb-body{ grid-template-columns:1fr; } .editor{ grid-template-columns:1fr; } }
</style>
