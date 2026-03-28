'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const C={accent:'#1D9E75',accentDim:'rgba(29,158,117,0.12)',accentText:'#9FE1CB',accentDark:'#0F6E56',bg:'#0f0f0f',bg2:'#1a1a1a',bg3:'#222222',text:'#f0efe8',textS:'#9a9a90',textT:'#5a5a55',border:'rgba(255,255,255,0.07)',border2:'rgba(255,255,255,0.12)',amber:'#EF9F27',amberDim:'rgba(239,159,39,0.12)',amberText:'#FAC775',red:'#E24B4A',redDim:'rgba(226,75,74,0.1)',redText:'#F09595'}

function getLocalDate(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

const MOODS=[
  {label:'Rough day',sub:"Tomorrow is a fresh start",bg:C.redDim,color:C.redText,accent:C.red},
  {label:'Not great',sub:'Small steps matter',bg:C.amberDim,color:C.amberText,accent:C.amber},
  {label:'Doing okay',sub:'Steady and balanced',bg:'rgba(255,255,255,0.04)',color:C.textS,accent:C.textS},
  {label:'Feeling great!',sub:"You're doing amazing",bg:C.accentDim,color:C.accentText,accent:C.accent},
  {label:'On top of the world!',sub:'What a wonderful day!',bg:C.accentDim,color:C.accentText,accent:C.accent},
]

function Icon({type,size=18,color=C.accent}){
  const s={width:size,height:size,flexShrink:0}
  const p={style:s,viewBox:'0 0 24 24',fill:'none'}
  switch(type){
    case'med':return<svg {...p}><rect x="7" y="2" width="10" height="6" rx="2" stroke={color} strokeWidth="1.5"/><path d="M5 8h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z" stroke={color} strokeWidth="1.5"/><path d="M12 14v3M10.5 15.5h3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'water':return<svg {...p}><path d="M12 2s-7 8-7 14c0 4 3 6 7 6s7-2 7-6c0-6-7-14-7-14z" stroke={color} strokeWidth="1.5"/></svg>
    case'exercise':return<svg {...p}><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/><path d="M8 12l2.5 2.5L16 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case'coffee':return<svg {...p}><path d="M18 8h1a4 4 0 010 8h-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M6 8h12v9a4 4 0 01-4 4H10a4 4 0 01-4-4V8z" stroke={color} strokeWidth="1.5"/><path d="M6 2v3M10 2v3M14 2v3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'mood':return<svg {...p}><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill={color}/><circle cx="15" cy="10" r="1" fill={color}/></svg>
    case'home':return<svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color} strokeWidth="1.5"/></svg>
    case'calendar':return<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/></svg>
    case'stats':return<svg {...p}><path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'profile':return<svg {...p}><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/><path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'check':return<svg style={s} viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case'chev':return<svg {...p}><path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'fire':return<svg style={s} viewBox="0 0 28 34" fill="none"><path d="M14 0s-10 10-10 20c0 6 4.5 12 10 14 5.5-2 10-8 10-14C24 10 14 0 14 0z" fill={C.amber}/><path d="M14 14s-4 4-4 8c0 2.5 1.8 5 4 6 2.2-1 4-3.5 4-6 0-4-4-8-4-8z" fill={C.amberText}/></svg>
    case'close':return<svg {...p}><path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'notes':return<svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="1.5"/><path d="M14 2v6h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    default:return null
  }
}

const card={background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,marginBottom:10,overflow:'hidden'}
const cardHead={display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',cursor:'pointer'}
const iconBox=(bg=C.accentDim)=>({width:36,height:36,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center'})
const pill=(bg=C.accentDim,color=C.accentText)=>({fontSize:11,padding:'3px 10px',borderRadius:20,color,background:bg,fontWeight:400,letterSpacing:'0.02em'})
const inputStyle={width:'100%',boxSizing:'border-box',padding:'11px 14px',borderRadius:12,border:`0.5px solid ${C.border2}`,background:C.bg3,fontSize:14,color:C.text}
const btnPrimary={width:'100%',padding:11,borderRadius:12,border:'none',background:C.accent,color:C.bg,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}
const btnGhost={padding:'11px 18px',borderRadius:12,border:`0.5px solid ${C.border2}`,background:'transparent',color:C.textS,fontSize:14,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}

function Accordion({icon,title,summary,children,open:def=false}){
  const[open,setOpen]=useState(def)
  return(
    <div style={card}>
      <div onClick={()=>setOpen(!open)} style={cardHead}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={iconBox()}><Icon type={icon}/></div>
          <span style={{fontSize:15,fontWeight:500,color:C.text}}>{title}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:13,color:C.accent,fontWeight:500}}>{summary}</span>
          <div style={{transform:open?'rotate(90deg)':'rotate(0)',transition:'transform 0.3s'}}><Icon type="chev" size={16} color={C.textT}/></div>
        </div>
      </div>
      <div style={{maxHeight:open?800:0,opacity:open?1:0,overflow:'hidden',transition:'all 0.35s ease',padding:open?'0 16px 16px':'0 16px'}}>{children}</div>
    </div>
  )
}

function Dashboard({user,meds,setMeds,waterLogs,setWaterLogs,coffee,setCoffee,moodEntry,setMoodEntry,exerciseLogs,setExerciseLogs}){
  const today=getLocalDate()
  const[mood,setMood]=useState(moodEntry?.mood_level||4)
  const[moodDay,setMoodDay]=useState(moodEntry?.short_note||'')
  const[moodJournal,setMoodJournal]=useState(moodEntry?.journal||'')
  const[waterInput,setWaterInput]=useState(false)
  const[waterAmt,setWaterAmt]=useState(250)
  const[moodSaved,setMoodSaved]=useState(false)
  const m=MOODS[mood-1]
  const totalW=(waterLogs.reduce((a,w)=>a+w.amount_ml,0)/1000).toFixed(1)
  const medsDone=meds.filter(med=>med.logs?.some(l=>l.taken&&l.date===today)).length
  const hr=new Date().getHours()
  const now=new Date()
  const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  useEffect(()=>{if(moodEntry){setMood(moodEntry.mood_level);setMoodDay(moodEntry.short_note||'');setMoodJournal(moodEntry.journal||'')}},[moodEntry])

  const toggleMed=async(med)=>{try{const log=med.logs?.find(l=>l.date===today);if(log){await supabase.from('medicine_logs').update({taken:!log.taken,taken_at:!log.taken?new Date().toISOString():null}).eq('id',log.id)}else{await supabase.from('medicine_logs').insert({user_id:user.id,medicine_id:med.id,taken:true,date:today,taken_at:new Date().toISOString()})};const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true);if(data)setMeds(data)}catch(e){console.error(e)}}
  const addWater=async()=>{try{await supabase.from('water_logs').insert({user_id:user.id,amount_ml:waterAmt,date:today});const{data}=await supabase.from('water_logs').select('*').eq('user_id',user.id).eq('date',today).order('logged_at');if(data)setWaterLogs(data);setWaterInput(false)}catch(e){console.error(e)}}
  const updateCoffee=async(val)=>{try{setCoffee(val);const{data:ex}=await supabase.from('coffee_logs').select('*').eq('user_id',user.id).eq('date',today).limit(1);if(ex?.length){await supabase.from('coffee_logs').update({cups:val}).eq('id',ex[0].id)}else{await supabase.from('coffee_logs').insert({user_id:user.id,cups:val,date:today})}}catch(e){console.error(e)}}
  const saveMood=async()=>{try{if(moodEntry?.id){await supabase.from('mood_entries').update({mood_level:mood,short_note:moodDay,journal:moodJournal}).eq('id',moodEntry.id)}else{await supabase.from('mood_entries').insert({user_id:user.id,mood_level:mood,short_note:moodDay,journal:moodJournal,date:today})};const{data}=await supabase.from('mood_entries').select('*').eq('user_id',user.id).eq('date',today).maybeSingle();if(data)setMoodEntry(data);setMoodSaved(true);setTimeout(()=>setMoodSaved(false),2000)}catch(e){console.error(e)}}

  const weekDates=[];const sow=new Date(now);const dow=sow.getDay();sow.setDate(sow.getDate()-(dow===0?6:dow-1))
  for(let i=0;i<5;i++){const d=new Date(sow);d.setDate(d.getDate()+i);weekDates.push(d)}

  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <div>
          <p style={{fontSize:13,color:C.textT,fontWeight:300,letterSpacing:'0.03em'}}>Good {hr<12?'morning':hr<17?'afternoon':'evening'}</p>
          <p style={{fontSize:26,fontWeight:500,marginTop:4,color:C.text,letterSpacing:'-0.03em'}}>{user.name||'Friend'}</p>
        </div>
        <div style={{width:44,height:44,borderRadius:'50%',background:C.bg3,border:`0.5px solid ${C.border2}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:500,fontSize:16,color:C.accent}}>{(user.name||'U')[0].toUpperCase()}</div>
      </div>

      <p style={{fontSize:14,fontWeight:400,color:C.textS,marginBottom:16}}>{now.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>

      <div style={{display:'flex',gap:6,marginBottom:16}}>
        {weekDates.map((d,i)=>{const isT=d.toDateString()===now.toDateString();return(
          <div key={i} style={{flex:1,textAlign:'center',padding:'10px 0',borderRadius:12,background:isT?C.accent:'transparent',border:isT?'none':`0.5px solid ${C.border}`}}>
            <p style={{fontSize:11,color:isT?C.bg:C.textT,fontWeight:300}}>{dayNames[d.getDay()]}</p>
            <p style={{fontSize:15,color:isT?C.bg:C.textS,marginTop:4,fontWeight:500}}>{d.getDate()}</p>
          </div>)})}
      </div>

      <div style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,padding:'16px 18px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center',animation:'glow 4s ease-in-out infinite'}}>
        <div><p style={{fontSize:12,color:C.textT,fontWeight:300,letterSpacing:'0.05em',textTransform:'uppercase'}}>Streak</p><p style={{fontSize:28,fontWeight:500,color:C.accent,marginTop:2,letterSpacing:'-0.03em'}}>Day 1</p></div>
        <Icon type="fire" size={32}/>
      </div>

      <div style={{background:m.bg,borderRadius:16,padding:16,marginBottom:12,transition:'background 0.4s',border:`0.5px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={iconBox(m.bg)}><Icon type="mood" color={m.accent}/></div>
          <span style={{fontSize:15,fontWeight:500,color:m.color}}>Mood</span>
          <span style={{marginLeft:'auto',fontSize:12,...pill(m.bg,m.color)}}>{m.label}</span>
        </div>
        <p style={{textAlign:'center',fontSize:20,fontWeight:500,color:m.color,margin:'12px 0 2px'}}>{m.label}</p>
        <p style={{textAlign:'center',fontSize:12,color:m.color,fontWeight:300,marginBottom:16,opacity:0.7}}>{m.sub}</p>
        <input type="range" min={1} max={5} value={mood} step={1} onChange={e=>setMood(+e.target.value)} style={{marginBottom:16}}/>
        <div style={{background:'rgba(255,255,255,0.03)',borderRadius:12,padding:12,marginBottom:8,border:`0.5px solid ${C.border}`}}>
          <label style={{fontSize:11,color:m.color,display:'block',marginBottom:4,fontWeight:300,letterSpacing:'0.03em'}}>How was your day?</label>
          <input type="text" value={moodDay} onChange={e=>setMoodDay(e.target.value)} placeholder="In a few words..." style={{...inputStyle,background:'rgba(255,255,255,0.04)',border:`0.5px solid ${C.border}`}}/>
        </div>
        <div style={{background:'rgba(255,255,255,0.03)',borderRadius:12,padding:12,marginBottom:10,border:`0.5px solid ${C.border}`}}>
          <label style={{fontSize:11,color:m.color,display:'block',marginBottom:4,fontWeight:300,letterSpacing:'0.03em'}}>What happened today?</label>
          <textarea value={moodJournal} onChange={e=>setMoodJournal(e.target.value)} placeholder="Write about your day..." rows={2} style={{...inputStyle,background:'rgba(255,255,255,0.04)',border:`0.5px solid ${C.border}`,resize:'none',lineHeight:1.5}}/>
        </div>
        <button onClick={saveMood} style={{...btnPrimary,background:m.accent}}>{moodSaved?'Saved!':'Save mood'}</button>
      </div>

      <Accordion icon="med" title="Medicines" summary={`${medsDone}/${meds.length}`} open={true}>
        {meds.length===0?<p style={{fontSize:13,color:C.textT,textAlign:'center',padding:16}}>No medicines yet. Add in Profile tab.</p>:
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {meds.map(med=>{const log=med.logs?.find(l=>l.date===today);const taken=log?.taken||false;return(
            <div key={med.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:C.bg3,borderRadius:12,border:`0.5px solid ${taken?'rgba(29,158,117,0.2)':C.border}`}}>
              <div><p style={{fontSize:14,color:taken?C.accentText:C.text,fontWeight:400}}>{med.name}</p><div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}><span style={{fontSize:12,color:C.textT,fontWeight:300}}>{med.dose}</span><span style={pill()}>{med.alarm_time}</span></div></div>
              <div onClick={()=>toggleMed(med)} style={{width:24,height:24,borderRadius:8,background:taken?C.accent:'transparent',border:taken?'none':`1.5px solid ${C.border2}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s'}}>{taken&&<Icon type="check" size={12}/>}</div>
            </div>)})}
        </div>}
      </Accordion>

      <Accordion icon="water" title="Water" summary={`${totalW} L`}>
        {!waterInput?
          <div onClick={()=>setWaterInput(true)} style={{padding:20,background:C.bg3,borderRadius:12,textAlign:'center',cursor:'pointer',marginTop:4,border:`0.5px solid ${C.border}`}}>
            <Icon type="water" color={C.textT}/><p style={{fontSize:14,color:C.textS,fontWeight:400,marginTop:6}}>Have you drunk water?</p><p style={{fontSize:12,color:C.textT,marginTop:4,fontWeight:300}}>Tap to log</p>
          </div>:
          <div style={{marginTop:4}}>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
              <input type="number" value={waterAmt} onChange={e=>setWaterAmt(+e.target.value)} style={inputStyle}/>
              <span style={{fontSize:14,color:C.textS,fontWeight:500}}>ml</span>
            </div>
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              {[100,250,500].map(v=><div key={v} onClick={()=>setWaterAmt(v)} style={{flex:1,padding:9,textAlign:'center',background:waterAmt===v?C.accentDim:C.bg3,borderRadius:10,fontSize:13,color:waterAmt===v?C.accentText:C.textT,cursor:'pointer',fontWeight:waterAmt===v?500:400,border:`0.5px solid ${waterAmt===v?'rgba(29,158,117,0.2)':C.border}`}}>{v}</div>)}
            </div>
            <button onClick={addWater} style={btnPrimary}>Add water</button>
          </div>}
        <div style={{marginTop:10}}>
          {waterLogs.map((w,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:i>0?`0.5px solid ${C.border}`:'none'}}>
            <span style={{fontSize:12,color:C.textT,fontWeight:300}}>{new Date(w.logged_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
            <span style={{fontSize:13,color:C.textS}}>{w.amount_ml} ml</span>
          </div>)}
        </div>
      </Accordion>

      <Accordion icon="exercise" title="Exercise" summary={exerciseLogs.length>0?`${exerciseLogs.reduce((a,e)=>a+e.duration_min,0)} min`:'Log'}>
        <ExForm uid={user.id} logs={exerciseLogs} setLogs={setExerciseLogs}/>
      </Accordion>

      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={iconBox(C.amberDim)}><Icon type="coffee" color={C.amber}/></div>
            <span style={{fontSize:15,fontWeight:500,color:C.text}}>Coffee</span>
            <span style={pill(C.amberDim,C.amberText)}>Max 3</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div onClick={()=>updateCoffee(Math.max(0,coffee-1))} style={{width:30,height:30,borderRadius:10,border:`0.5px solid ${C.border2}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,color:C.textS}}>-</div>
            <span style={{fontSize:20,fontWeight:500,color:C.text,minWidth:16,textAlign:'center'}}>{coffee}</span>
            <div onClick={()=>updateCoffee(coffee+1)} style={{width:30,height:30,borderRadius:10,border:`0.5px solid ${C.border2}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,color:C.textS}}>+</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExForm({uid,logs,setLogs}){
  const today=getLocalDate()
  const[type,setType]=useState('Walk')
  const[customType,setCustomType]=useState('')
  const[mins,setMins]=useState(30)
  const[showForm,setShowForm]=useState(false)
  const types=['Walk','Run','Gym','Yoga','Cycling','Swimming']
  const save=async()=>{const exType=type==='Custom'?customType:type;if(!exType)return;await supabase.from('exercise_logs').insert({user_id:uid,type:exType,duration_min:mins,date:today});const{data}=await supabase.from('exercise_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at');if(data)setLogs(data);setShowForm(false);setMins(30)}
  return(
    <div style={{marginTop:4}}>
      {logs.length>0&&<div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:10}}>
        {logs.map((l,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:C.bg3,borderRadius:12,border:`0.5px solid ${C.border}`}}>
          <span style={{fontSize:13,color:C.text}}>{l.type}</span>
          <span style={{fontSize:13,color:C.accent,fontWeight:500}}>{l.duration_min} min</span>
        </div>)}
      </div>}
      {!showForm?<div onClick={()=>setShowForm(true)} style={{padding:16,background:C.bg3,borderRadius:12,textAlign:'center',cursor:'pointer',border:`0.5px solid ${C.border}`}}><span style={{fontSize:13,color:C.textT}}>+ Add exercise</span></div>:
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {[...types,'Custom'].map(t=><div key={t} onClick={()=>setType(t)} style={{padding:'7px 14px',background:type===t?C.accentDim:C.bg3,borderRadius:10,fontSize:12,color:type===t?C.accentText:C.textT,cursor:'pointer',fontWeight:type===t?500:400,border:`0.5px solid ${type===t?'rgba(29,158,117,0.2)':C.border}`}}>{t}</div>)}
        </div>
        {type==='Custom'&&<input type="text" value={customType} onChange={e=>setCustomType(e.target.value)} placeholder="Exercise name" style={inputStyle}/>}
        <div style={{display:'flex',gap:8,alignItems:'center'}}><input type="number" value={mins} onChange={e=>setMins(+e.target.value)} style={inputStyle}/><span style={{fontSize:13,color:C.textS}}>min</span></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={save} style={{...btnPrimary,flex:1}}>Save</button>
          <button onClick={()=>setShowForm(false)} style={btnGhost}>Cancel</button>
        </div>
      </div>}
    </div>
  )
}

function CalendarScreen({user}){
  const[monthData,setMonthData]=useState({})
  const[selectedDay,setSelectedDay]=useState(null)
  const[showNotes,setShowNotes]=useState(false)
  const[moodNotes,setMoodNotes]=useState([])
  const now=new Date();const year=now.getFullYear();const month=now.getMonth()
  const daysInMonth=new Date(year,month+1,0).getDate();const firstDay=new Date(year,month,1).getDay();const todayDate=now.getDate()
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']

  useEffect(()=>{async function load(){const s=`${year}-${String(month+1).padStart(2,'0')}-01`,e=`${year}-${String(month+1).padStart(2,'0')}-${daysInMonth}`;const[mR,wR,eR,cR,moR]=await Promise.all([supabase.from('medicine_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('water_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('exercise_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('coffee_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('mood_entries').select('*').eq('user_id',user.id).gte('date',s).lte('date',e).order('date',{ascending:false})]);const data={};for(let d=1;d<=daysInMonth;d++){const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const dm=(mR.data||[]).filter(m=>m.date===ds),dw=(wR.data||[]).filter(w=>w.date===ds),de=(eR.data||[]).filter(x=>x.date===ds),dc=(cR.data||[]).filter(c=>c.date===ds);data[d]={medsTaken:dm.filter(m=>m.taken).length,water:dw.reduce((a,w)=>a+w.amount_ml,0),exercise:de.reduce((a,x)=>a+x.duration_min,0),coffee:dc.reduce((a,c)=>a+c.cups,0),hasActivity:dm.length>0||dw.length>0||de.length>0||dc.length>0}};setMonthData(data);if(moR.data)setMoodNotes(moR.data)};load()},[user.id,year,month,daysInMonth])

  const getDayStyle=(d)=>{
    if(d>todayDate||!monthData[d]?.hasActivity)return{bg:C.bg2,border:C.border}
    const dd=monthData[d]
    if(dd.medsTaken>0&&dd.water>500&&dd.exercise>0)return{bg:C.accentDim,border:'rgba(29,158,117,0.25)'}
    if(dd.medsTaken>0||dd.water>0)return{bg:C.amberDim,border:'rgba(239,159,39,0.2)'}
    return{bg:C.redDim,border:'rgba(226,75,74,0.2)'}
  }

  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <p style={{fontSize:22,fontWeight:500,color:C.text,letterSpacing:'-0.02em'}}>{monthNames[month]} {year}</p>
        <div onClick={()=>setShowNotes(!showNotes)} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:12,background:showNotes?C.accent:C.bg2,border:`0.5px solid ${showNotes?C.accent:C.border}`,cursor:'pointer'}}>
          <Icon type="notes" size={16} color={showNotes?C.bg:C.accent}/><span style={{fontSize:12,color:showNotes?C.bg:C.accent,fontWeight:500}}>Notes</span>
        </div>
      </div>
      {showNotes&&<div style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:14,maxHeight:260,overflowY:'auto',animation:'cardIn 0.3s ease'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:15,fontWeight:500,color:C.text}}>Your journal</span>
          <div onClick={()=>setShowNotes(false)} style={{cursor:'pointer'}}><Icon type="close" size={16} color={C.textT}/></div>
        </div>
        {moodNotes.length===0?<p style={{fontSize:13,color:C.textT,textAlign:'center',padding:12}}>No entries yet</p>:
        moodNotes.map((n,i)=><div key={i} style={{padding:'12px 14px',borderRadius:12,background:C.bg3,border:`0.5px solid ${C.border}`,marginBottom:i<moodNotes.length-1?8:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{fontSize:13,fontWeight:500,color:C.text}}>{new Date(n.date+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
            <div style={{width:6,height:6,borderRadius:'50%',background:n.mood_level>=4?C.accent:n.mood_level>=3?C.amber:C.red}}/>
            <span style={{fontSize:11,color:C.textT}}>{MOODS[n.mood_level-1]?.label}</span>
          </div>
          {n.short_note&&<p style={{fontSize:13,color:C.textS,fontWeight:300}}>{n.short_note}</p>}
          {n.journal&&<p style={{fontSize:12,color:C.textT,fontWeight:300,marginTop:2}}>{n.journal}</p>}
        </div>)}
      </div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:6}}>
        {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:12,color:C.textT,fontWeight:300,padding:'4px 0'}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:16}}>
        {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>{const st=getDayStyle(d);const future=d>todayDate;return(
          <div key={d} onClick={()=>!future&&setSelectedDay(selectedDay===d?null:d)} style={{aspectRatio:'1',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:future?'default':'pointer',background:st.bg,border:d===todayDate?`2px solid ${C.accent}`:`0.5px solid ${st.border}`,opacity:future?0.3:1}}>
            <span style={{fontSize:13,fontWeight:d===todayDate?500:400,color:d===todayDate?C.accent:future?C.textT:C.textS}}>{d}</span>
          </div>)})}
      </div>
      {selectedDay&&monthData[selectedDay]&&<div style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,padding:16,animation:'cardIn 0.3s ease'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <span style={{fontSize:16,fontWeight:500,color:C.text}}>{monthNames[month]} {selectedDay}</span>
          <div onClick={()=>setSelectedDay(null)} style={{cursor:'pointer'}}><Icon type="close" size={16} color={C.textT}/></div>
        </div>
        {[{icon:'med',label:'Medicines',value:`${monthData[selectedDay].medsTaken} taken`,ok:monthData[selectedDay].medsTaken>0},{icon:'water',label:'Water',value:`${(monthData[selectedDay].water/1000).toFixed(1)} L`,ok:monthData[selectedDay].water>500},{icon:'exercise',label:'Exercise',value:monthData[selectedDay].exercise>0?`${monthData[selectedDay].exercise} min`:'Skipped',ok:monthData[selectedDay].exercise>0},{icon:'coffee',label:'Coffee',value:`${monthData[selectedDay].coffee} cups`,ok:true}].map((item,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:C.bg3,borderRadius:12,border:`0.5px solid ${C.border}`,marginBottom:i<3?6:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}><Icon type={item.icon} size={16} color={C.textT}/><span style={{fontSize:13,color:C.textS}}>{item.label}</span></div>
            <span style={{fontSize:13,fontWeight:500,color:item.ok?C.accent:C.red}}>{item.value}</span>
          </div>))}
      </div>}
    </div>
  )
}

function StatsScreen({user}){
  const[stats,setStats]=useState(null);const now=new Date()
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']
  useEffect(()=>{async function load(){const year=now.getFullYear(),month=now.getMonth(),dim=new Date(year,month+1,0).getDate();const s=`${year}-${String(month+1).padStart(2,'0')}-01`,e=`${year}-${String(month+1).padStart(2,'0')}-${dim}`;const[mR,wR,eR,cR,moR]=await Promise.all([supabase.from('medicine_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('water_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('exercise_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('coffee_logs').select('*').eq('user_id',user.id).gte('date',s).lte('date',e),supabase.from('mood_entries').select('*').eq('user_id',user.id).gte('date',s).lte('date',e)]);const mt=(mR.data||[]).filter(m=>m.taken).length,tml=(mR.data||[]).length,tw=(wR.data||[]).reduce((a,w)=>a+w.amount_ml,0),wd=new Set((wR.data||[]).map(w=>w.date)).size,te=(eR.data||[]).reduce((a,x)=>a+x.duration_min,0),ed=new Set((eR.data||[]).map(x=>x.date)).size,tc=(cR.data||[]).reduce((a,c)=>a+c.cups,0),cd=new Set((cR.data||[]).map(c=>c.date)).size,am=moR.data?.length?Math.round(moR.data.reduce((a,m)=>a+m.mood_level,0)/moR.data.length*10)/10:0;setStats({mt,tml,tw,wd,aw:wd>0?Math.round(tw/wd):0,te,ed,ae:ed>0?Math.round(te/ed):0,tc,cd,ac:cd>0?Math.round(tc/cd*10)/10:0,am,mc:moR.data?.length||0,ad:now.getDate()})};load()},[user.id])
  if(!stats)return<p style={{fontSize:14,color:C.textT,textAlign:'center',padding:40}}>Loading stats...</p>
  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <p style={{fontSize:22,fontWeight:500,color:C.text,letterSpacing:'-0.02em'}}>Your stats</p>
      <p style={{fontSize:13,color:C.textT,fontWeight:300,marginTop:2,marginBottom:20}}>{monthNames[now.getMonth()]} {now.getFullYear()}</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
        {[{v:stats.ad,l:'Days tracked',c:C.accent},{v:stats.am>0?MOODS[Math.round(stats.am)-1]?.label:'—',l:'Avg mood',sm:true}].map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,padding:'16px 14px',textAlign:'center'}}>
            <p style={{fontSize:s.sm?14:30,fontWeight:500,color:s.c||C.text,letterSpacing:'-0.03em'}}>{s.v}</p>
            <p style={{fontSize:11,color:C.textT,fontWeight:300,marginTop:4,letterSpacing:'0.03em',textTransform:'uppercase'}}>{s.l}</p>
          </div>))}
      </div>
      {[{icon:'med',title:'Medicines',sum:`${stats.mt} taken`,items:[{n:'Logged',v:stats.tml},{n:'Taken',v:stats.mt},{n:'Rate',v:stats.tml>0?Math.round(stats.mt/stats.tml*100)+'%':'0%'}]},{icon:'water',title:'Water',sum:`${stats.aw} ml avg`,items:[{n:'Total',v:`${(stats.tw/1000).toFixed(1)} L`},{n:'Days',v:stats.wd},{n:'Avg',v:`${stats.aw} ml`}]},{icon:'exercise',title:'Exercise',sum:`${stats.ae} min avg`,items:[{n:'Total',v:`${stats.te} min`},{n:'Days',v:stats.ed},{n:'Avg',v:`${stats.ae} min`}]},{icon:'coffee',title:'Coffee',sum:`${stats.ac} avg`,items:[{n:'Total',v:stats.tc},{n:'Days',v:stats.cd},{n:'Avg',v:stats.ac}]}].map((sec,si)=>(
        <div key={si} style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={iconBox()}><Icon type={sec.icon}/></div>
            <div style={{flex:1}}><p style={{fontSize:15,fontWeight:500,color:C.text}}>{sec.title}</p></div>
            <span style={{fontSize:13,fontWeight:500,color:C.accent}}>{sec.sum}</span>
          </div>
          {sec.items.map((item,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:i>0?`0.5px solid ${C.border}`:'none'}}>
            <span style={{fontSize:13,color:C.textT,fontWeight:300}}>{item.n}</span>
            <span style={{fontSize:13,color:C.textS,fontWeight:500}}>{item.v}</span>
          </div>)}
        </div>))}
    </div>
  )
}

function ProfileScreen({user,meds,setMeds,onLogout,setUser}){
  const[newMed,setNewMed]=useState({name:'',dose:'',alarm_time:'09:00'})
  const[adding,setAdding]=useState(false)
  const[editName,setEditName]=useState(user.name||'')
  const[showNameEdit,setShowNameEdit]=useState(false)
  const saveName=async()=>{await supabase.from('profiles').update({name:editName}).eq('id',user.id);setUser(prev=>({...prev,name:editName}));setShowNameEdit(false)}
  const addMed=async()=>{if(!newMed.name||!newMed.dose)return;const{error}=await supabase.from('medicines').insert({user_id:user.id,...newMed});if(error){alert('Error: '+error.message);return};const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true);if(data)setMeds(data);setNewMed({name:'',dose:'',alarm_time:'09:00'});setAdding(false)}
  const delMed=async(id)=>{await supabase.from('medicines').update({active:false}).eq('id',id);const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true);if(data)setMeds(data)}
  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <p style={{fontSize:22,fontWeight:500,color:C.text,letterSpacing:'-0.02em',marginBottom:24}}>Profile</p>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{width:76,height:76,borderRadius:'50%',background:C.accentDim,border:`2px solid ${C.accent}`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:500,color:C.accent}}>{(user.name||'U')[0].toUpperCase()}</div>
        {!showNameEdit?<>
          <p style={{fontSize:20,fontWeight:500,color:C.text,marginTop:14}}>{user.name||user.email}</p>
          <p style={{fontSize:13,color:C.textT,fontWeight:300,marginTop:2}}>{user.email}</p>
          <div onClick={()=>{setEditName(user.name||'');setShowNameEdit(true)}} style={{display:'inline-block',marginTop:10,fontSize:13,color:C.accent,cursor:'pointer',fontWeight:500}}>Edit name</div>
        </>:<div style={{marginTop:14}}>
          <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} style={{...inputStyle,maxWidth:200,textAlign:'center',marginBottom:10}}/>
          <div style={{display:'flex',gap:8,justifyContent:'center'}}>
            <button onClick={saveName} style={{padding:'9px 24px',borderRadius:12,border:'none',background:C.accent,color:C.bg,fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Save</button>
            <button onClick={()=>setShowNameEdit(false)} style={btnGhost}>Cancel</button>
          </div>
        </div>}
      </div>
      <div style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:15,fontWeight:500,color:C.text}}>My medicines</span>
          <div onClick={()=>setAdding(!adding)} style={{fontSize:13,color:C.accent,cursor:'pointer',fontWeight:500}}>{adding?'Cancel':'+ Add'}</div>
        </div>
        {adding&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12,padding:14,background:C.bg3,borderRadius:12,border:`0.5px solid ${C.border}`}}>
          <input type="text" placeholder="Medicine name" value={newMed.name} onChange={e=>setNewMed({...newMed,name:e.target.value})} style={inputStyle}/>
          <div style={{display:'flex',gap:8}}>
            <input type="text" placeholder="Dose" value={newMed.dose} onChange={e=>setNewMed({...newMed,dose:e.target.value})} style={{...inputStyle,flex:1}}/>
            <input type="time" value={newMed.alarm_time} onChange={e=>setNewMed({...newMed,alarm_time:e.target.value})} style={{...inputStyle,width:120}}/>
          </div>
          <button onClick={addMed} style={btnPrimary}>Add medicine</button>
        </div>}
        {meds.map(med=><div key={med.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:C.bg3,borderRadius:12,border:`0.5px solid ${C.border}`,marginBottom:6}}>
          <div><p style={{fontSize:14,color:C.text}}>{med.name}</p><span style={{fontSize:12,color:C.textT}}>{med.dose} - {med.alarm_time}</span></div>
          <div onClick={()=>delMed(med.id)} style={{fontSize:12,color:C.red,cursor:'pointer',fontWeight:500}}>Remove</div>
        </div>)}
        {meds.length===0&&!adding&&<p style={{fontSize:13,color:C.textT,textAlign:'center',padding:8}}>No medicines yet</p>}
      </div>
      <div onClick={onLogout} style={{display:'flex',justifyContent:'center',padding:'14px 16px',background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:14,cursor:'pointer',marginTop:10}}>
        <span style={{fontSize:14,color:C.red,fontWeight:500}}>Sign out</span>
      </div>
    </div>
  )
}

export default function Home(){
  const[user,setUser]=useState(null);const[loading,setLoading]=useState(true);const[tab,setTab]=useState('home')
  const[meds,setMeds]=useState([]);const[waterLogs,setWaterLogs]=useState([]);const[coffee,setCoffee]=useState(0);const[moodEntry,setMoodEntry]=useState(null);const[exerciseLogs,setExerciseLogs]=useState([])

  const loadData=useCallback(async(uid)=>{const today=getLocalDate();try{const[m,w,c,mo,ex]=await Promise.all([supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',uid).eq('active',true),supabase.from('water_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at'),supabase.from('coffee_logs').select('*').eq('user_id',uid).eq('date',today).limit(1),supabase.from('mood_entries').select('*').eq('user_id',uid).eq('date',today).maybeSingle(),supabase.from('exercise_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at')]);if(m.data)setMeds(m.data);if(w.data)setWaterLogs(w.data);if(c.data?.[0])setCoffee(c.data[0].cups);if(mo.data)setMoodEntry(mo.data);if(ex.data)setExerciseLogs(ex.data)}catch(e){console.error(e)}},[])

  useEffect(()=>{
   supabase.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){const u=session.user;const name=u.user_metadata?.full_name||u.email?.split('@')[0]||'User';setUser({id:u.id,name,email:u.email});loadData(u.id)}
      setLoading(false)
    }).catch(()=>{setLoading(false)})
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(_e,session)=>{if(session?.user){const u=session.user;const name=u.user_metadata?.full_name||u.email?.split('@')[0]||'User';setUser({id:u.id,name,email:u.email});try{await supabase.from('profiles').upsert({id:u.id,name},{onConflict:'id',ignoreDuplicates:true})}catch(e){};loadData(u.id)}else setUser(null)})
    return()=>subscription.unsubscribe()
  },[loadData])

  const logout=async()=>{await supabase.auth.signOut();setUser(null);window.location.href='/login'}
  if(loading)return<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg}}><div style={{textAlign:'center'}}><div style={{width:48,height:48,borderRadius:14,background:C.accentDim,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:10,animation:'glow 3s ease-in-out infinite'}}><Icon type="water" size={24} color={C.accent}/></div><p style={{fontSize:13,color:C.textT,fontWeight:300}}>Loading...</p></div></div>
  if(!user){if(typeof window!=='undefined')window.location.href='/login';return null}

  const tabs=[{key:'home',label:'Today',icon:'home'},{key:'calendar',label:'Calendar',icon:'calendar'},{key:'stats',label:'Stats',icon:'stats'},{key:'profile',label:'Profile',icon:'profile'}]

  return(
    <div style={{display:'flex',justifyContent:'center',minHeight:'100vh',background:C.bg}}>
      <div style={{width:'100%',maxWidth:375,position:'relative',padding:'1.5rem',paddingBottom:80}}>
        {tab==='home'&&<Dashboard user={user} meds={meds} setMeds={setMeds} waterLogs={waterLogs} setWaterLogs={setWaterLogs} coffee={coffee} setCoffee={setCoffee} moodEntry={moodEntry} setMoodEntry={setMoodEntry} exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs}/>}
        {tab==='calendar'&&<CalendarScreen user={user}/>}
        {tab==='stats'&&<StatsScreen user={user}/>}
        {tab==='profile'&&<ProfileScreen user={user} meds={meds} setMeds={setMeds} onLogout={logout} setUser={setUser}/>}
        <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:375,display:'flex',justifyContent:'space-around',padding:'14px 0 22px',background:C.bg,borderTop:`0.5px solid ${C.border}`,zIndex:50,backdropFilter:'blur(20px)'}}>
          {tabs.map(t=><div key={t.key} onClick={()=>setTab(t.key)} style={{textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}>
            <Icon type={t.icon} size={22} color={tab===t.key?C.accent:C.textT}/>
            <p style={{fontSize:10,color:tab===t.key?C.accent:C.textT,marginTop:4,fontWeight:tab===t.key?500:300,letterSpacing:'0.03em'}}>{t.label}</p>
          </div>)}
        </div>
      </div>
    </div>
  )
}
