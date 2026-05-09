import { useState, useRef, useEffect } from "react";

// ─── STORAGE (comptes + historique) ─────────────────────────────────────────
const store = {
  async get(key) {
    try { const r = await window.storage.get(key, false); return r ? JSON.parse(r.value) : null; } catch { return null; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val), false); return true; } catch { return false; }
  }
};

// ─── CATALOGUE ───────────────────────────────────────────────────────────────
const AJOUTS = [
  { id:"sommeil", emoji:"😴", label:"Sommeil profond", detail:"Aide à améliorer l'endormissement et la qualité du sommeil, ce qui est essentiel pour les hormones et la perte de poids.", duree:"3 mois", prix_brut:29.97, contre:["antidepresseurs"] },
  { id:"assimilation", emoji:"🌿", label:"Booster d'assimilation", detail:"Permet d'améliorer la digestion des nutriments et d'optimiser l'efficacité globale du programme.", duree:"3 mois", prix_brut:40.38, contre:[] },
  { id:"capteur", emoji:"🟢", label:"Capteur de graisse", detail:"Agit directement dans le système digestif pour limiter l'absorption d'une partie des graisses alimentaires. Particulièrement intéressant lors de repas plus riches.", duree:"1 mois", prix_brut:22, contre:[] },
  { id:"libido", emoji:"💋", label:"Booster de libido", detail:"Aide à retrouver le désir et l'énergie intime, souvent impacté par les déséquilibres hormonaux.", duree:"1 mois", prix_brut:25, contre:["antidepresseurs"] },
  { id:"cellulite", emoji:"💧", label:"Anti-cellulite drainant", detail:"Agit sur la rétention d'eau, la cellulite et la circulation pour affiner la silhouette.", duree:"3 mois", prix_brut:89.91, contre:["problemes_renaux"] },
];

const SYSTEM_BILAN = `Tu es une conseillère experte en compléments alimentaires pour Les Audacieuses, spécialisée en régulation hormonale féminine et perte de poids.

STYLE IMPÉRATIF :
- Écris comme une vraie conseillère humaine, chaleureuse et experte — PAS comme une IA
- Utilise "vous", sois empathique, naturelle, jamais clinique
- Jamais de bullet points ou de tirets — que des paragraphes fluides
- Jamais culpabilisant sur l'alimentation, le poids, le sport
- Toujours rassurant : ce n'est pas de leur faute, leur corps a besoin d'aide
- Minimum 400 mots, style conversationnel et humain
- Explique le lien entre hormones, digestion, métabolisme propre à CETTE cliente
- Montre que tu as vraiment lu et compris son questionnaire

STRUCTURE :
1. Introduction personnalisée (accroche sur sa situation spécifique)
2. Explication de ce qui se passe dans son corps (hormones, digestion, métabolisme)
3. Lien entre ses symptômes et ses objectifs
4. Axes fondamentaux à travailler (numérotés avec emojis chiffres, adaptés à elle)
5. Fin OBLIGATOIRE mot pour mot :

Si vous le souhaitez, je peux maintenant vous proposer trois programmes parfaitement adaptés à votre situation.

📦 Les programmes sont conçus sur 4 mois, afin de permettre un rééquilibrage en profondeur.

🌿 Ils sont composés de compléments naturels adaptés à votre terrain hormonal, digestif et métabolique.

🛍 Aucun abonnement, aucun engagement, avec possibilité de paiement en plusieurs fois.

👉 Souhaitez-vous que je vous prépare les trois programmes adaptés à votre situation ? 😊

Texte brut uniquement, aucun JSON, aucun markdown.`;

const SYSTEM_PROGRAMMES = `Experte Les Audacieuses. Génère 3 programmes STAR 4 mois.

STAR: Mois1=S(3m)+T(1m). Mois2-4=S+A(3m)+R(3m). Prog2=Prog1+1produit ciblé. Prog3=Prog2+produit premium.
CALCUL: total_remise=brut×0.9(nouvelle) ou =brut. cout_mensuel=remise/4.
JAMAIS les noms de produits dans programmes_texte — uniquement les fonctions (ex: "régulateur hormonal", "détox digestive", "brûle-graisse").

RÈGLES: FireWorks/Duo/SkinnyCoffe=A+R pas doublon. Dijo=T+A pas doublon. RétentionEau→DailyFlow obligatoire. MauvaiseAlim→CapteurGraisse prog2.
CONTREINDIC: CancerSeinPerso→0phyto. CancerSeinFamille→Equilibrist. HypertSévère/Cardio/Thyroïde/Anticoag→0stimulant. PbRénaux→détoxDouce+0DailyFlow. ColonIrrit→ProbioOuDijo. MénopChirurg→UnderControl/Equilibrist+détoxDouce.

AJOUTS MALINS (ne jamais mettre en ajout un produit déjà dans le programme, prix avec -10% si nouvelle):
- Sommeil profond 3m (29.97€ brut) → si troubles sommeil
- Booster assimilation 3m (40.38€ brut) → quasi toujours pertinent
- Capteur de graisse 1m (22€ brut) → si mauvaise alimentation ET pas déjà en programme
- Booster libido 1m (25€ brut) → si perte libido mentionnée
- Anti-cellulite drainant 3m (89.91€ brut) → si cellulite/jambes lourdes ET pas déjà drainant en programme

CATALOGUE(nom|marque|cat|1m|2m|3m):
Activateur Équilibre|MiYé|S|28|56|63
Under Control|Birdie|S|-|-|82.90
Essentiels Équilibre Féminin|MiYé|S|-|-|74
Complexe Cycle Féminin|D-LAB|S|24|-|-
Équilibre Hormonal|Equilibrist|S|35|-|-
Detox Drops|Birdie|T|22|-|56.10
Sweet Detox|Birdie|T|19.20|-|-
Detox Artichaut|Birdie|T|22|-|56.10
Absolu Probiotiques 360|D-LAB|T|24|-|-
Détox MiYé|MiYé|T|25|-|-
Poudre Métabolique|Dijo|TA|45|-|-
Boost Métabolisme|Epycure|A|25|-|67.50
Fire Works|Birdie|AR|22|-|56.10
Skinny Coffee|Birdie|AR|-|-|56.10
Duo Brûle-Graisse|Epycure|AR|-|-|124.80
Sculpt Me Up|Yfen|R|-|-|105.90
Gummies Morosil|LoveBeLoved|R|-|47.42|-
Oops I Did It Again|Birdie|R|22|-|56.10
Daily Flow|Yfen|drain|-|67.90|89.91
Shots Ventre Plat|Birdie|drain|61|-|183
Collagène Minceur|D-LAB|PLUS|-|-|177.99
Night Drops|Birdie|PLUS|-|-|56.10
Probiotiful|Birdie|PLUS|24|-|61.20
Shot of Vitality|Birdie|PLUS|22|-|53.04

SECTION INCLUS à mettre après les ajouts malins (mot pour mot) :
🤝 INCLUS DANS LE PROGRAMME CHOISI
💬 Mon suivi personnalisé
Je reste disponible tout au long du programme pour répondre à vos questions, suivre votre évolution et vous accompagner.

📚 Accès à une plateforme privée (gratuit)
– conseils nutritionnels simples
– recettes rapides
– explications pour mieux comprendre votre fonctionnement

🎯 Un accompagnement complet
L'objectif est que vous ne soyez jamais seule et que vous obteniez des résultats durables.

✨ Pour vous permettre de démarrer dans les meilleures conditions, je vous offre une remise de -10 % sur votre première commande.
Cette réduction est déjà incluse dans les prix indiqués ci-dessus et vous profitez des offres des frenchdays pendant quelques jours.

N'hésitez pas si vous avez des questions et dites-moi quel programme vous parle le + 😊

JSON STRICT uniquement, rien d'autre:
{"prenom":"","nouvelle_cliente":true,"points_attention":[],"ajouts_selectionnes":[{"id":"","label":"","detail":"","duree":"","prix_brut":0,"raison_selection":""}],"programmes_texte":"🔬 COMMENT SE DÉROULE VOTRE PROGRAMME ?\\n\\n👉 PENDANT LE PREMIER MOIS :\\n[explication personnalisée selon les produits choisis — si détox digestive expliquer la détox digestive, si drainant expliquer le drainage, etc.]\\n\\n👉 CE PREMIER MOIS EST PRIMORDIAL. Sans cette étape, la suite ne servirait à rien.\\n\\n👉 PENDANT LES 2ᵉ, 3ᵉ ET 4ᵉ MOIS :\\n[explication personnalisée selon les produits — brûle-graisse, métabolisme, etc.]\\n\\n🔥 LES 3 PROGRAMMES AU CHOIX\\n\\n🔹 PROGRAMME 1\\nDans ce programme, vous allez retrouver :\\n– [bénéfice 1 adapté aux produits choisis]\\n– [bénéfice 2]\\n– [bénéfice 3]\\n XX,XX € / mois pendant 18 semaines\\n👉 au lieu de XX,XX € / mois\\n\\n🔹 PROGRAMME 2 🔥\\nOn reprend la base du programme 1 et on va plus loin :\\n– [bénéfice supplémentaire spécifique au produit ajouté]\\n XX,XX € / mois pendant 18 semaines\\n👉 au lieu de XX,XX € / mois\\n\\n🔹 PROGRAMME 3 🔥🔥\\nLe programme le plus complet :\\n– [bénéfice supplémentaire]\\n XX,XX € / mois pendant 18 semaines\\n👉 au lieu de XX,XX € / mois\\n\\n✨ LES AJOUTS MALINS (pas obligatoire mais qui peuvent accélérer le processus)\\n[ajouts sélectionnés avec emoji, label, detail, prix mensuel calculé]\\n\\n[SECTION INCLUS mot pour mot]","programmes":[{"numero":1,"titre":"","produits":[{"nom":"","marque":"","categorie":"","duree":"","prix":0,"raison":""}],"total_brut":0,"total_remise":0,"cout_mensuel":0}]}`;

const accentColors = ["#c9a96e","#a78bfa","#4ade80"];
const catMap = {
  S:{bg:"#fdf2f8",bo:"#e879b0",tx:"#9d174d",lb:"🌿 S — Stabiliser"},
  T:{bg:"#f0fdf4",bo:"#4ade80",tx:"#166534",lb:"🧹 T — Traiter"},
  A:{bg:"#fff7ed",bo:"#fb923c",tx:"#9a3412",lb:"⚡ A — Activer"},
  R:{bg:"#fef2f2",bo:"#f87171",tx:"#991b1b",lb:"🔥 R — Réduire"},
  TA:{bg:"#f5f3ff",bo:"#a78bfa",tx:"#5b21b6",lb:"🔀 T+A"},
  AR:{bg:"#fef9c3",bo:"#facc15",tx:"#713f12",lb:"🔥 A+R"},
  drain:{bg:"#eff6ff",bo:"#60a5fa",tx:"#1e40af",lb:"💧 Drainant"},
  PLUS:{bg:"#f0fdf4",bo:"#86efac",tx:"#166534",lb:"➕ Complément"}
};

export default function App() {
  const [screen, setScreen] = useState("auth"); // auth | accueil | saisie | results
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [authForm, setAuthForm] = useState({ prenom:"", nom:"", email:"", password:"" });
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [nouvelleCliente, setNouvelleCliente] = useState(null);
  const [questionnaire, setQuestionnaire] = useState("");
  const [bilan, setBilan] = useState("");
  const [progData, setProgData] = useState(null);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTab, setActiveTab] = useState("bilan");
  const [openProg, setOpenProg] = useState(0);
  const [copied, setCopied] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showHistorique, setShowHistorique] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  // ── AUTH ────────────────────────────────────────────────────────────────────
  const handleAuth = async () => {
    setAuthError("");
    const { prenom, nom, email, password } = authForm;
    if (!email || !password) { setAuthError("Email et mot de passe requis."); return; }

    if (authMode === "register") {
      if (!prenom || !nom) { setAuthError("Prénom et nom requis."); return; }
      const existing = await store.get(`user:${email}`);
      if (existing) { setAuthError("Ce compte existe déjà."); return; }
      const newUser = { prenom, nom, email, password, createdAt: new Date().toISOString() };
      await store.set(`user:${email}`, newUser);
      await store.set(`history:${email}`, []);
      setUser(newUser);
      setHistorique([]);
      setScreen("accueil");
    } else {
      const found = await store.get(`user:${email}`);
      if (!found || found.password !== password) { setAuthError("Email ou mot de passe incorrect."); return; }
      const hist = await store.get(`history:${email}`) || [];
      setUser(found);
      setHistorique(hist);
      setScreen("accueil");
    }
  };

  const logout = () => { setUser(null); setScreen("auth"); setAuthForm({ prenom:"", nom:"", email:"", password:"" }); };

  // ── API ─────────────────────────────────────────────────────────────────────
  const callAPI = async (system, content, maxTokens) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, system, messages:[{ role:"user", content }] })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${data?.error?.message || res.statusText}`);
    return data.content?.find(b => b.type==="text")?.text || "";
  };

  const generate = async () => {
    if (!questionnaire.trim()) { setError("Merci de coller le questionnaire."); return; }
    if (nouvelleCliente === null) { setError("Merci d'indiquer si c'est une nouvelle ou ancienne cliente."); return; }
    setError("");
    const info = `Conseillère: ${user?.prenom} ${user?.nom}\nCliente: ${nouvelleCliente ? "NOUVELLE (remise -10%)" : "ANCIENNE"}\n\nQuestionnaire:\n${questionnaire}`;
    try {
      setLoadingStep(1);
      const bilanText = await callAPI(SYSTEM_BILAN, info, 2000);
      setBilan(bilanText);
      setLoadingStep(2);
      const progRaw = await callAPI(SYSTEM_PROGRAMMES, info, 4000);
      const clean = progRaw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setProgData(parsed);
      setChatMessages([{ role:"assistant", content:`Programmes générés pour ${parsed.prenom} ✨\nTu peux me demander d'ajuster un produit ou d'expliquer un choix 😊` }]);

      // Sauvegarder dans l'historique
      const entry = { id: Date.now(), date: new Date().toLocaleString("fr-FR"), prenom: parsed.prenom, nouvelle_cliente: parsed.nouvelle_cliente, bilan: bilanText, progData: parsed, questionnaire };
      const newHist = [entry, ...historique].slice(0, 100);
      setHistorique(newHist);
      await store.set(`history:${user.email}`, newHist);

      setScreen("results");
      setActiveTab("bilan");
    } catch(e) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoadingStep(0);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role:"user", content:userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);
    try {
      const context = progData?.programmes?.map(p => `Prog${p.numero}: ${p.produits?.map(pr=>`${pr.nom}(${pr.duree},${pr.prix}€)`).join(", ")} → ${p.cout_mensuel}€/mois`).join(" | ") || "";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, system:`Experte Les Audacieuses. Programmes actuels: ${context}. Réponds de façon concise et professionnelle pour aider la conseillère à ajuster les programmes.`, messages: newMessages.map(m=>({role:m.role,content:m.content})) })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role:"assistant", content: data.content?.find(b=>b.type==="text")?.text || "" }]);
    } catch { setChatMessages(prev => [...prev, { role:"assistant", content:"Désolée, une erreur s'est produite." }]); }
    finally { setChatLoading(false); }
  };

  const copyText = (text, key) => { navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(()=>setCopied(null),2500); }); };
  const reset = () => { setScreen("accueil"); setNouvelleCliente(null); setQuestionnaire(""); setBilan(""); setProgData(null); setError(""); setOpenProg(0); setChatMessages([]); setShowHistorique(false); };

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const wrap = { minHeight:"100vh", background:"linear-gradient(160deg,#0f0c1a 0%,#1a1128 45%,#0c1a14 100%)", fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif", display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 16px 40px", boxSizing:"border-box" };
  const glass = (maxW=520) => ({ background:"rgba(255,255,255,0.055)", backdropFilter:"blur(16px)", border:"1px solid rgba(201,169,110,0.2)", borderRadius:22, padding:28, width:"100%", maxWidth:maxW, boxSizing:"border-box" });
  const ghostBtn = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"10px 22px", color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer" };
  const goldBtn = { background:"linear-gradient(135deg,#c9a96e,#e8c98a)", border:"none", borderRadius:12, padding:"13px 32px", color:"#1a0a2e", fontSize:15, fontWeight:700, cursor:"pointer" };
  const cpBtn = (key) => ({ background:copied===key?"rgba(74,222,128,0.18)":"rgba(255,255,255,0.07)", border:`1px solid ${copied===key?"#4ade80":"rgba(255,255,255,0.15)"}`, borderRadius:8, padding:"6px 14px", color:copied===key?"#4ade80":"rgba(255,255,255,0.55)", fontSize:12, cursor:"pointer" });

  const Header = ({ showUser=true }) => (
    <div style={{textAlign:"center",marginBottom:20,marginTop:8,width:"100%",maxWidth:640}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{width:60}}/>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:13,letterSpacing:5,color:"#c9a96e",textTransform:"uppercase",marginBottom:4}}>🔥 Les Audacieuses</div>
          <h1 style={{fontSize:20,color:"#fff",margin:0,fontWeight:400,letterSpacing:0.5}}>Conseillère IA</h1>
        </div>
        {showUser && user ? (
          <button onClick={logout} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",color:"rgba(255,255,255,0.4)",fontSize:11,cursor:"pointer"}}>Déco</button>
        ) : <div style={{width:60}}/>}
      </div>
      {showUser && user && <div style={{color:"rgba(255,255,255,0.35)",fontSize:12}}>Bonjour {user.prenom} 👋</div>}
      <div style={{width:44,height:2,background:"linear-gradient(90deg,#c9a96e,#e8c98a)",margin:"8px auto 0"}}/>
    </div>
  );

  // ── LOADING ─────────────────────────────────────────────────────────────────
  if (loadingStep > 0) return (
    <div style={wrap}>
      <Header showUser={false}/>
      <div style={{textAlign:"center",color:"#fff",padding:50}}>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <div style={{fontSize:44,marginBottom:20,display:"inline-block",animation:"spin 2s linear infinite"}}>🔥</div>
        <h3 style={{fontWeight:400,fontSize:18,marginBottom:12}}>{loadingStep===1?"Rédaction du bilan...":"Génération des programmes..."}</h3>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {["1. Bilan","2. Programmes"].map((s,i)=>(
            <span key={i} style={{background:loadingStep>i?"rgba(201,169,110,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${loadingStep>i?"#c9a96e":"rgba(255,255,255,0.1)"}`,borderRadius:20,padding:"5px 14px",color:loadingStep>i?"#c9a96e":"rgba(255,255,255,0.3)",fontSize:13}}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // ── AUTH ─────────────────────────────────────────────────────────────────────
  if (screen === "auth") return (
    <div style={wrap}>
      <Header showUser={false}/>
      <div style={{...glass(),textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>🔥</div>
        <h2 style={{color:"#fff",fontSize:18,fontWeight:400,marginBottom:6}}>Espace Conseillères</h2>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24}}>Ton espace privé — tes clientes, ton historique</p>

        <div style={{display:"flex",gap:8,marginBottom:22}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setAuthMode(m);setAuthError("");}} style={{flex:1,background:authMode===m?"rgba(201,169,110,0.18)":"rgba(255,255,255,0.04)",border:`1.5px solid ${authMode===m?"#c9a96e":"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"10px",color:authMode===m?"#e8c98a":"rgba(255,255,255,0.4)",fontSize:14,fontWeight:authMode===m?700:400,cursor:"pointer"}}>
              {m==="login"?"Se connecter":"Créer un compte"}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {authMode==="register" && (
            <>
              <input placeholder="Prénom" value={authForm.prenom} onChange={e=>setAuthForm({...authForm,prenom:e.target.value})}
                style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}/>
              <input placeholder="Nom" value={authForm.nom} onChange={e=>setAuthForm({...authForm,nom:e.target.value})}
                style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}/>
            </>
          )}
          <input placeholder="Email" type="email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})}
            style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}/>
          <input placeholder="Mot de passe" type="password" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})}
            onKeyDown={e=>{if(e.key==="Enter")handleAuth();}}
            style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}/>
        </div>

        {authError && <div style={{color:"#fca5a5",fontSize:13,marginBottom:12}}>⚠️ {authError}</div>}
        <button style={{...goldBtn,width:"100%"}} onClick={handleAuth}>
          {authMode==="login" ? "Se connecter →" : "Créer mon compte →"}
        </button>
      </div>
    </div>
  );

  // ── ACCUEIL ──────────────────────────────────────────────────────────────────
  if (screen === "accueil") return (
    <div style={wrap}>
      <Header/>
      <div style={{width:"100%",maxWidth:520,display:"flex",flexDirection:"column",gap:14}}>
        <div style={{...glass(),textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:10}}>✨</div>
          <h2 style={{color:"#fff",fontSize:17,fontWeight:400,marginBottom:10}}>Générateur de bilans & programmes STAR</h2>
          <p style={{color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:22,fontSize:14}}>
            Colle le questionnaire de ta cliente → bilan personnalisé + 3 programmes prêts pour WhatsApp.
          </p>
          <button style={goldBtn} onClick={()=>setScreen("saisie")}>🔥 Nouveau bilan</button>
        </div>

        {/* Historique */}
        {historique.length > 0 && (
          <div style={glass()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showHistorique?14:0}}>
              <h3 style={{color:"#c9a96e",fontSize:13,fontWeight:600,margin:0,letterSpacing:2,textTransform:"uppercase"}}>📁 Mes clientes ({historique.length})</h3>
              <button onClick={()=>setShowHistorique(!showHistorique)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer"}}>{showHistorique?"Masquer ▲":"Voir ▼"}</button>
            </div>
            {showHistorique && historique.map((h,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 14px",marginBottom:8,cursor:"pointer"}}
                onClick={()=>{ setBilan(h.bilan); setProgData(h.progData); setQuestionnaire(h.questionnaire); setNouvelleCliente(h.nouvelle_cliente); setScreen("results"); setActiveTab("bilan"); setChatMessages([]); }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"#fff",fontWeight:600,fontSize:14}}>{h.prenom}</span>
                  <span style={{color:h.nouvelle_cliente?"#4ade80":"#a78bfa",fontSize:11}}>{h.nouvelle_cliente?"🆕 Nouvelle":"🔄 Ancienne"}</span>
                </div>
                <div style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:2}}>{h.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── SAISIE ───────────────────────────────────────────────────────────────────
  if (screen === "saisie") return (
    <div style={wrap}>
      <Header/>
      <div style={{...glass(),display:"flex",flexDirection:"column",gap:22}}>
        <div>
          <h3 style={{color:"#fff",fontSize:16,fontWeight:400,marginBottom:14}}>1. Nouvelle ou ancienne cliente ?</h3>
          <div style={{display:"flex",gap:10}}>
            {[{val:true,label:"🆕 Nouvelle",sub:"Remise -10%"},{val:false,label:"🔄 Ancienne",sub:"Pas de remise"}].map(opt=>(
              <button key={String(opt.val)} onClick={()=>setNouvelleCliente(opt.val)} style={{flex:1,background:nouvelleCliente===opt.val?"rgba(201,169,110,0.2)":"rgba(255,255,255,0.03)",border:`1.5px solid ${nouvelleCliente===opt.val?"#c9a96e":"rgba(255,255,255,0.08)"}`,borderRadius:14,padding:"14px 10px",color:nouvelleCliente===opt.val?"#e8c98a":"rgba(255,255,255,0.6)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                <div style={{fontSize:15,fontWeight:600,marginBottom:3}}>{opt.label}</div>
                <div style={{fontSize:12,opacity:0.6}}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{color:"#fff",fontSize:16,fontWeight:400,marginBottom:6}}>2. Colle le questionnaire rempli</h3>
          <p style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginBottom:10}}>Copie-colle directement depuis JotForm — l'IA s'adapte à n'importe quel format.</p>
          <textarea value={questionnaire} onChange={e=>setQuestionnaire(e.target.value)}
            placeholder={"Colle ici les réponses de ta cliente..."}
            rows={10} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"14px",color:"#fff",fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.6}}/>
        </div>
        {error && <div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:10,padding:"10px 14px",color:"#fca5a5",fontSize:13}}>⚠️ {error}</div>}
        <div style={{display:"flex",gap:10}}>
          <button style={ghostBtn} onClick={()=>setScreen("accueil")}>← Retour</button>
          <button onClick={generate} disabled={nouvelleCliente===null||!questionnaire.trim()}
            style={{flex:1,background:(nouvelleCliente===null||!questionnaire.trim())?"rgba(255,255,255,0.07)":"linear-gradient(135deg,#c9a96e,#e8c98a)",border:"none",borderRadius:12,padding:"13px",color:(nouvelleCliente===null||!questionnaire.trim())?"rgba(255,255,255,0.2)":"#1a0a2e",fontSize:15,fontWeight:700,cursor:(nouvelleCliente===null||!questionnaire.trim())?"not-allowed":"pointer"}}>
            Générer le bilan ✨
          </button>
        </div>
      </div>
    </div>
  );

  // ── RÉSULTATS ────────────────────────────────────────────────────────────────
  if (screen === "results" && progData) return (
    <div style={wrap}>
      <Header/>
      <div style={{width:"100%",maxWidth:640}}>
        <div style={{...glass(640),marginBottom:14,padding:"18px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{color:"#c9a96e",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:3}}>Bilan généré</div>
              <h2 style={{color:"#fff",fontSize:20,fontWeight:600,margin:0}}>{progData.prenom}</h2>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{background:progData.nouvelle_cliente?"rgba(74,222,128,0.15)":"rgba(167,139,250,0.15)",border:`1px solid ${progData.nouvelle_cliente?"#4ade80":"#a78bfa"}`,color:progData.nouvelle_cliente?"#4ade80":"#a78bfa",borderRadius:20,padding:"4px 14px",fontSize:12,fontWeight:600}}>
                {progData.nouvelle_cliente?"🆕 Nouvelle · -10%":"🔄 Ancienne"}
              </span>
              <button onClick={()=>setScreen("accueil")} style={ghostBtn}>← Accueil</button>
            </div>
          </div>
          {progData.points_attention?.filter(p=>p).length>0&&(
            <div style={{marginTop:12,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:10,padding:"10px 14px"}}>
              <div style={{color:"#fca5a5",fontSize:12,fontWeight:600,marginBottom:5}}>⚠️ Points d'attention</div>
              {progData.points_attention.filter(p=>p).map((p,i)=><div key={i} style={{color:"rgba(255,200,200,0.7)",fontSize:12,marginBottom:2}}>• {p}</div>)}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {[{k:"bilan",l:"📋 Bilan"},{k:"programmes",l:"💊 Programmes"},{k:"detail",l:"🔍 Détail"},{k:"chat",l:"🤖 Ajuster"}].map(tab=>(
            <button key={tab.k} onClick={()=>setActiveTab(tab.k)} style={{flex:1,background:activeTab===tab.k?"rgba(201,169,110,0.18)":"rgba(255,255,255,0.04)",border:`1.5px solid ${activeTab===tab.k?"#c9a96e":"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"10px 2px",color:activeTab===tab.k?"#e8c98a":"rgba(255,255,255,0.35)",fontSize:12,fontWeight:activeTab===tab.k?700:400,cursor:"pointer"}}>
              {tab.l}
            </button>
          ))}
        </div>

        {/* BILAN */}
        {activeTab==="bilan"&&(
          <div style={glass(640)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{color:"#c9a96e",fontSize:13,fontWeight:600,margin:0,letterSpacing:2,textTransform:"uppercase"}}>Bilan personnalisé</h3>
              <button onClick={()=>copyText(bilan,"bilan")} style={cpBtn("bilan")}>{copied==="bilan"?"✓ Copié !":"📋 Copier"}</button>
            </div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{bilan}</div>
          </div>
        )}

        {/* PROGRAMMES */}
        {activeTab==="programmes"&&(
          <div style={glass(640)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{color:"#c9a96e",fontSize:13,fontWeight:600,margin:0,letterSpacing:2,textTransform:"uppercase"}}>Message WhatsApp</h3>
              <button onClick={()=>copyText(progData.programmes_texte||"","prog")} style={cpBtn("prog")}>{copied==="prog"?"✓ Copié !":"📋 Copier"}</button>
            </div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{progData.programmes_texte}</div>
          </div>
        )}

        {/* DÉTAIL */}
        {activeTab==="detail"&&(
          <div style={{width:"100%",maxWidth:640}}>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {progData.programmes?.map((p,i)=>(
                <button key={i} onClick={()=>setOpenProg(i)} style={{flex:1,background:openProg===i?`rgba(${i===0?"201,169,110":i===1?"167,139,250":"74,222,128"},0.18)`:"rgba(255,255,255,0.04)",border:`1.5px solid ${openProg===i?accentColors[i]:"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"9px 4px",color:openProg===i?accentColors[i]:"rgba(255,255,255,0.3)",fontSize:13,fontWeight:openProg===i?700:400,cursor:"pointer"}}>
                  Prog. {p.numero}
                </button>
              ))}
            </div>
            {progData.programmes?.map((prog,i)=>i!==openProg?null:(
              <div key={i} style={{...glass(640),position:"relative",overflow:"hidden",marginBottom:14}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${accentColors[i]},${accentColors[i]}44)`}}/>
                <h3 style={{color:"#fff",fontSize:16,fontWeight:600,margin:"0 0 16px"}}>{prog.titre}</h3>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                  {prog.produits?.map((p,j)=>{
                    const c=catMap[p.categorie]||{bg:"#eee",bo:"#999",tx:"#333",lb:p.categorie};
                    return(
                      <div key={j} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 13px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                          <span style={{background:c.bg,border:`1px solid ${c.bo}`,color:c.tx,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,flexShrink:0}}>{c.lb}</span>
                          <span style={{color:"#fff",fontWeight:600,fontSize:14}}>{p.nom}</span>
                          <span style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>{p.marque}</span>
                          <span style={{color:"#c9a96e",fontWeight:700,fontSize:14,marginLeft:"auto"}}>{Number(p.prix).toFixed(2)}€</span>
                        </div>
                        <div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{p.duree} · {p.raison}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{background:"rgba(201,169,110,0.07)",border:"1px solid rgba(201,169,110,0.18)",borderRadius:12,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Total brut</span>
                    <span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>{Number(prog.total_brut).toFixed(2)}€</span>
                  </div>
                  {progData.nouvelle_cliente&&(<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Après -10%</span><span style={{color:"#4ade80",fontSize:13,fontWeight:600}}>{Number(prog.total_remise).toFixed(2)}€</span></div>)}
                  <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(201,169,110,0.12)",paddingTop:8}}>
                    <span style={{color:"#fff",fontSize:15,fontWeight:600}}>Coût mensuel</span>
                    <span style={{color:"#e8c98a",fontSize:18,fontWeight:700}}>{Number(prog.cout_mensuel).toFixed(2)}€/mois</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Ajouts malins */}
            {progData.ajouts_selectionnes?.filter(a=>a.id).length>0&&(
              <div style={glass(640)}>
                <h3 style={{color:"#c9a96e",fontSize:13,fontWeight:600,margin:"0 0 14px",letterSpacing:2,textTransform:"uppercase"}}>✨ Ajouts malins recommandés</h3>
                {progData.ajouts_selectionnes.filter(a=>a.id).map((a,i)=>{
                  const prix_remise = progData.nouvelle_cliente ? a.prix_brut*0.9 : a.prix_brut;
                  const prix_mois = (prix_remise/4).toFixed(2);
                  return(
                    <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{color:"#fff",fontWeight:600,fontSize:14}}>{a.label}</span>
                        <span style={{color:"#c9a96e",fontSize:12,fontWeight:600}}>{prix_mois}€/mois</span>
                      </div>
                      <div style={{color:"rgba(255,255,255,0.45)",fontSize:13,marginBottom:3}}>{a.detail}</div>
                      <div style={{color:"rgba(255,255,255,0.25)",fontSize:11,fontStyle:"italic"}}>{a.duree} · {a.raison_selection}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CHAT */}
        {activeTab==="chat"&&(
          <div style={glass(640)}>
            <h3 style={{color:"#c9a96e",fontSize:13,fontWeight:600,margin:"0 0 4px",letterSpacing:2,textTransform:"uppercase"}}>🤖 Ajuster avec l'IA</h3>
            <p style={{color:"rgba(255,255,255,0.35)",fontSize:12,margin:"0 0 14px"}}>Propose un changement ou pose une question sur les programmes.</p>
            <div style={{background:"rgba(0,0,0,0.2)",borderRadius:12,padding:14,marginBottom:14,maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
              {chatMessages.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{background:m.role==="user"?"rgba(201,169,110,0.2)":"rgba(255,255,255,0.06)",border:`1px solid ${m.role==="user"?"rgba(201,169,110,0.3)":"rgba(255,255,255,0.08)"}`,borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",maxWidth:"85%",color:"rgba(255,255,255,0.8)",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:"rgba(255,255,255,0.06)",borderRadius:"14px 14px 14px 4px",padding:"10px 14px",color:"rgba(255,255,255,0.4)",fontSize:13}}>✨ En train de réfléchir...</div></div>}
              <div ref={chatEndRef}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
                placeholder="Ex: Je préférerais Fire Works à la place du Boost Métabolisme..."
                style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={sendChat} disabled={!chatInput.trim()||chatLoading}
                style={{background:(!chatInput.trim()||chatLoading)?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#c9a96e,#e8c98a)",border:"none",borderRadius:10,padding:"10px 18px",color:(!chatInput.trim()||chatLoading)?"rgba(255,255,255,0.2)":"#1a0a2e",fontSize:13,fontWeight:700,cursor:(!chatInput.trim()||chatLoading)?"not-allowed":"pointer"}}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}
