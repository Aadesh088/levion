'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const T={50:'#E1F5EE',100:'#9FE1CB',200:'#5DCAA5',400:'#1D9E75',600:'#0F6E56',800:'#085041',900:'#04342C'}
const A={50:'#FAEEDA',400:'#EF9F27',800:'#633806'}
const R={50:'#FCEBEB',400:'#E24B4A',800:'#791F1F'}

function getLocalDate(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
const today=getLocalDate()

const MOODS=[
  {label:'Rough day',sub:"It's okay, tomorrow is new",bg:R[50],color:R[800]},
  {label:'Not great',sub:'Hang in there',bg:A[50],color:A[800]},
  {label:'Doing okay',sub:'Steady and balanced',bg:'#F1EFE8',color:'#444'},
  {label:'Feeling great!',sub:"Keep it up, amazing",bg:T[50],color:T[800]},
  {label:'On top of the world!',sub:'What a wonderful day!',bg:T[50],color:T[800]},
]

function Icon({type,size=18,color=T[600]}){
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
    case'check':return<svg style={s} viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case'chev':return<svg {...p}><path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'fire':return<svg style={s} viewBox="0 0 28 34" fill="none"><path d="M14 0s-10 10-10 20c0 6 4.5 12 10 14 5.5-2 10-8 10-14C24 10 14 0 14 0z" fill={A[400]}/><path d="M14 14s-4 4-4 8c0 2.5 1.8 5 4 6 2.2-1 4-3.5 4-6 0-4-4-8-4-8z" fill={A[50]}/></svg>
    case'close':return<svg {...p}><path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    case'notes':return<svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="1.5"/><path d="M14 2v6h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>
    default:return null
  }
}

function Accordion({icon,title,summary,children,open:def=false}){
  const[open,setOpen]=useState(def)
  return(
    <div style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,marginBottom:10,overflow:'hidden'}}>
      <div onClick={()=>setOpen(!open)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:T[50],display:'flex',alignItems:'center',justifyContent:'center'}}><Icon type={icon}/></div>
          <span style={{fontSize:15,fontWeight:500,color:'var(--text)'}}>{title}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:13,color:T[600],fontWeight:500}}>{summary}</span>
          <div style={{transform:open?'rotate(90deg)':'rotate(0)',transition:'transform 0.3s'}}><Icon type="chev" size={16} color="var(--text-t)"/></div>
        </div>
      </div>
      <div style={{maxHeight:open?800:0,opacity:open?1:0,overflow:'hidden',transition:'all 0.35s ease',padding:open?'0 16px 16px':'0 16px'}}>{children}</div>
    </div>
  )
}

async function ensureProfile(userId, email) {
  const {data} = await supabase.from('profiles').select('id').eq('id', userId).single()
  if (!data) {
    await supabase.from('profiles').insert({id: userId, name: email.split('@')[0]})
  }
}

function Dashboard({user,meds,setMeds,waterLogs,setWaterLogs,coffee,setCoffee,moodEntry,setMoodEntry,exerciseLogs,setExerciseLogs}){
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

  useEffect(()=>{
    if(moodEntry){setMood(moodEntry.mood_level);setMoodDay(moodEntry.short_note||'');setMoodJournal(moodEntry.journal||'')}
  },[moodEntry])

  const toggleMed=async(med)=>{
    const log=med.logs?.find(l=>l.date===today)
    if(log){await supabase.from('medicine_logs').update({taken:!log.taken,taken_at:!log.taken?new Date().toISOString():null}).eq('id',log.id)}
    else{await supabase.from('medicine_logs').insert({user_id:user.id,medicine_id:med.id,taken:true,date:today,taken_at:new Date().toISOString()})}
    const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true)
    if(data)setMeds(data)
  }

  const addWater=async()=>{
    await supabase.from('water_logs').insert({user_id:user.id,amount_ml:waterAmt,date:today})
    const{data}=await supabase.from('water_logs').select('*').eq('user_id',user.id).eq('date',today).order('logged_at')
    if(data)setWaterLogs(data)
    setWaterInput(false)
  }

  const updateCoffee=async(val)=>{
    setCoffee(val)
    const{data:ex}=await supabase.from('coffee_logs').select('*').eq('user_id',user.id).eq('date',today).limit(1)
    if(ex?.length){await supabase.from('coffee_logs').update({cups:val}).eq('id',ex[0].id)}
    else{await supabase.from('coffee_logs').insert({user_id:user.id,cups:val,date:today})}
  }

  const saveMood=async()=>{
    const p={user_id:user.id,mood_level:mood,short_note:moodDay,journal:moodJournal,date:today}
    if(moodEntry?.id){await supabase.from('mood_entries').update({mood_level:mood,short_note:moodDay,journal:moodJournal}).eq('id',moodEntry.id)}
    else{await supabase.from('mood_entries').insert(p)}
    const{data}=await supabase.from('mood_entries').select('*').eq('user_id',user.id).eq('date',today).single()
    if(data)setMoodEntry(data)
    setMoodSaved(true)
    setTimeout(()=>setMoodSaved(false),2000)
  }

  const weekDates=[]
  const startOfWeek=new Date(now)
  const dow=startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate()-(dow===0?6:dow-1))
  for(let i=0;i<5;i++){const d=new Date(startOfWeek);d.setDate(d.getDate()+i);weekDates.push(d)}

  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
        <div>
          <p style={{fontSize:13,color:'var(--text-s)',fontWeight:300}}>Good {hr<12?'morning':hr<17?'afternoon':'evening'}</p>
          <p style={{fontSize:24,fontWeight:500,marginTop:4,color:'var(--text)',letterSpacing:'-0.02em'}}>{user.name||'Friend'}</p>
        </div>
        <div style={{width:42,height:42,borderRadius:'50%',background:'var(--bg)',border:'0.5px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:500,fontSize:15,color:'var(--text)'}}>{(user.name||'U')[0].toUpperCase()}</div>
      </div>

      <div style={{display:'flex',gap:6,margin:'20px 0'}}>
        {weekDates.map((d,i)=>{const isT=d.toDateString()===now.toDateString();return(
          <div key={i} style={{flex:1,textAlign:'center',padding:'10px 0',borderRadius:10,background:isT?'var(--text)':'transparent'}}>
            <p style={{fontSize:11,color:isT?'var(--bg)':'var(--text-t)',fontWeight:300,opacity:isT?0.6:1}}>{dayNames[d.getDay()]}</p>
            <p style={{fontSize:15,color:isT?'var(--bg)':'var(--text-s)',marginTop:4,fontWeight:500}}>{d.getDate()}</p>
          </div>
        )})}
      </div>

      <div style={{background:T[800],borderRadius:14,padding:'16px 18px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><p style={{fontSize:13,color:T[100],fontWeight:300}}>Current streak</p><p style={{fontSize:24,fontWeight:500,color:T[50],marginTop:4,letterSpacing:'-0.02em'}}>Day 1</p></div>
        <Icon type="fire" size={28}/>
      </div>

      <div style={{background:m.bg,borderRadius:14,padding:16,marginBottom:12,transition:'background 0.4s'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.6)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon type="mood" color={m.color}/></div>
          <span style={{fontSize:15,fontWeight:500,color:m.color}}>Mood</span>
          <span style={{marginLeft:'auto',fontSize:13,color:m.color,fontWeight:500}}>{m.label}</span>
        </div>
        <p style={{textAlign:'center',fontSize:18,fontWeight:500,color:m.color,margin:'8px 0 2px'}}>{m.label}</p>
        <p style={{textAlign:'center',fontSize:12,color:m.color,fontWeight:300,marginBottom:14,opacity:0.8}}>{m.sub}</p>
        <input type="range" min={1} max={5} value={mood} step={1} onChange={e=>setMood(+e.target.value)} style={{marginBottom:14}}/>
        <div style={{background:'rgba(255,255,255,0.5)',borderRadius:10,padding:12,marginBottom:8}}>
          <label style={{fontSize:12,color:m.color,display:'block',marginBottom:4}}>How was your day?</label>
          <input type="text" value={moodDay} onChange={e=>setMoodDay(e.target.value)} placeholder="In a few words..." style={{width:'100%',boxSizing:'border-box',padding:'9px 12px',borderRadius:8,border:'0.5px solid rgba(8,80,65,0.15)',background:'rgba(255,255,255,0.7)',fontSize:13,color:T[900]}}/>
        </div>
        <div style={{background:'rgba(255,255,255,0.5)',borderRadius:10,padding:12,marginBottom:10}}>
          <label style={{fontSize:12,color:m.color,display:'block',marginBottom:4}}>What happened today?</label>
          <textarea value={moodJournal} onChange={e=>setMoodJournal(e.target.value)} placeholder="Write about your day..." rows={2} style={{width:'100%',boxSizing:'border-box',padding:'9px 12px',borderRadius:8,border:'0.5px solid rgba(8,80,65,0.15)',background:'rgba(255,255,255,0.7)',fontSize:13,color:T[900],resize:'none',lineHeight:1.5}}/>
        </div>
        <button onClick={saveMood} style={{width:'100%',padding:10,borderRadius:10,border:'none',background:m.color,color:'white',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>
          {moodSaved?'Saved!':'Save mood'}
        </button>
      </div>

      <Accordion icon="med" title="Medicines" summary={`${medsDone}/${meds.length}`} open={true}>
        {meds.length===0?<p style={{fontSize:13,color:'var(--text-t)',textAlign:'center',padding:16}}>No medicines yet. Go to Profile to add.</p>:
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {meds.map(med=>{const log=med.logs?.find(l=>l.date===today);const taken=log?.taken||false;return(
            <div key={med.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'var(--bg2)',borderRadius:10}}>
              <div><p style={{fontSize:14,color:'var(--text)'}}>{med.name}</p><div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}><span style={{fontSize:12,color:'var(--text-t)',fontWeight:300}}>{med.dose}</span><span style={{fontSize:11,padding:'2px 8px',borderRadius:6,color:T[800],background:T[50]}}>{med.alarm_time}</span></div></div>
              <div onClick={()=>toggleMed(med)} style={{width:22,height:22,borderRadius:7,background:taken?T[400]:'transparent',border:taken?'none':'1.5px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s'}}>{taken&&<Icon type="check" size={12}/>}</div>
            </div>
          )})}
        </div>}
      </Accordion>

      <Accordion icon="water" title="Water" summary={`${totalW} L`}>
        {!waterInput?
          <div onClick={()=>setWaterInput(true)} style={{padding:16,background:'var(--bg2)',borderRadius:10,textAlign:'center',cursor:'pointer',marginTop:4}}>
            <Icon type="water"/><p style={{fontSize:14,color:'var(--text)',fontWeight:500,marginTop:4}}>Have you drunk water?</p><p style={{fontSize:12,color:'var(--text-t)',marginTop:4,fontWeight:300}}>Tap to log</p>
          </div>:
          <div style={{marginTop:4}}>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
              <input type="number" value={waterAmt} onChange={e=>setWaterAmt(+e.target.value)} style={{flex:1,padding:'10px 12px',borderRadius:10,border:'0.5px solid var(--border)',background:'var(--bg2)',fontSize:14,color:'var(--text)',boxSizing:'border-box'}}/>
              <span style={{fontSize:14,color:'var(--text-s)',fontWeight:500}}>ml</span>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              {[100,250,500].map(v=><div key={v} onClick={()=>setWaterAmt(v)} style={{flex:1,padding:8,textAlign:'center',background:waterAmt===v?T[50]:'var(--bg2)',borderRadius:10,fontSize:13,color:waterAmt===v?T[800]:'var(--text-s)',cursor:'pointer',fontWeight:waterAmt===v?500:400}}>{v}</div>)}
            </div>
            <button onClick={addWater} style={{width:'100%',padding:10,borderRadius:10,border:'none',background:T[800],color:T[50],fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Add water</button>
          </div>}
        <div style={{marginTop:10}}>
          {waterLogs.map((w,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderTop:i>0?'0.5px solid var(--border)':'none'}}>
            <span style={{fontSize:12,color:'var(--text-t)',fontWeight:300}}>{new Date(w.logged_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
            <span style={{fontSize:13,color:'var(--text-s)'}}>{w.amount_ml} ml</span>
          </div>)}
        </div>
      </Accordion>

      <Accordion icon="exercise" title="Exercise" summary={exerciseLogs.length>0?`${exerciseLogs.reduce((a,e)=>a+e.duration_min,0)} min`:'Log'}>
        <ExForm uid={user.id} logs={exerciseLogs} setLogs={setExerciseLogs}/>
      </Accordion>

      <div style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:T[50],display:'flex',alignItems:'center',justifyContent:'center'}}><Icon type="coffee"/></div>
            <span style={{fontSize:15,fontWeight:500,color:'var(--text)'}}>Coffee</span>
            <span style={{fontSize:11,padding:'2px 8px',borderRadius:6,color:T[800],background:T[50]}}>Max 3</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div onClick={()=>updateCoffee(Math.max(0,coffee-1))} style={{width:28,height:28,borderRadius:'50%',border:'0.5px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:14,color:'var(--text-s)'}}>-</div>
            <span style={{fontSize:18,fontWeight:500,color:'var(--text)',minWidth:14,textAlign:'center'}}>{coffee}</span>
            <div onClick={()=>updateCoffee(coffee+1)} style={{width:28,height:28,borderRadius:'50%',border:'0.5px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:14,color:'var(--text-s)'}}>+</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExForm({uid,logs,setLogs}){
  const[type,setType]=useState('Walk')
  const[customType,setCustomType]=useState('')
  const[mins,setMins]=useState(30)
  const[notes,setNotes]=useState('')
  const[showForm,setShowForm]=useState(false)
  const types=['Walk','Run','Gym','Yoga','Cycling','Swimming']

  const save=async()=>{
    const exType=type==='Custom'?customType:type
    if(!exType)return
    await supabase.from('exercise_logs').insert({user_id:uid,type:exType,duration_min:mins,date:today})
    const{data}=await supabase.from('exercise_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at')
    if(data)setLogs(data)
    setShowForm(false);setNotes('');setMins(30)
  }

  return(
    <div style={{marginTop:4}}>
      {logs.length>0&&<div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:10}}>
        {logs.map((l,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:'var(--bg2)',borderRadius:10}}>
          <span style={{fontSize:13,color:'var(--text)'}}>{l.type}</span>
          <span style={{fontSize:13,color:T[600],fontWeight:500}}>{l.duration_min} min</span>
        </div>)}
      </div>}
      {!showForm?
        <div onClick={()=>setShowForm(true)} style={{padding:14,background:'var(--bg2)',borderRadius:10,textAlign:'center',cursor:'pointer'}}>
          <span style={{fontSize:13,color:'var(--text-s)'}}>+ Add exercise</span>
        </div>:
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[...types,'Custom'].map(t=><div key={t} onClick={()=>setType(t)} style={{padding:'6px 12px',background:type===t?T[50]:'var(--bg2)',borderRadius:8,fontSize:12,color:type===t?T[800]:'var(--text-s)',cursor:'pointer',fontWeight:type===t?500:400}}>{t}</div>)}
          </div>
          {type==='Custom'&&<input type="text" value={customType} onChange={e=>setCustomType(e.target.value)} placeholder="Exercise name" style={{padding:'10px 12px',borderRadius:10,border:'0.5px solid var(--border)',background:'var(--bg2)',fontSize:14,color:'var(--text)',boxSizing:'border-box'}}/>}
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="number" value={mins} onChange={e=>setMins(+e.target.value)} style={{flex:1,padding:'10px 12px',borderRadius:10,border:'0.5px solid var(--border)',background:'var(--bg2)',fontSize:14,color:'var(--text)',boxSizing:'border-box'}}/>
            <span style={{fontSize:13,color:'var(--text-s)'}}>min</span>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} style={{flex:1,padding:10,borderRadius:10,border:'none',background:T[800],color:T[50],fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Save</button>
            <button onClick={()=>setShowForm(false)} style={{padding:10,borderRadius:10,border:'0.5px solid var(--border)',background:'transparent',color:'var(--text-s)',fontSize:14,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
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
  const now=new Date()
  const year=now.getFullYear()
  const month=now.getMonth()
  const daysInMonth=new Date(year,month+1,0).getDate()
  const firstDay=new Date(year,month,1).getDay()
  const todayDate=now.getDate()
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']

  useEffect(()=>{
    async function load(){
      const startDate=`${year}-${String(month+1).padStart(2,'0')}-01`
      const endDate=`${year}-${String(month+1).padStart(2,'0')}-${daysInMonth}`
      const[medRes,waterRes,exRes,cofRes,moodRes]=await Promise.all([
        supabase.from('medicine_logs').select('*,medicine:medicines(name)').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('water_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('exercise_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('coffee_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('mood_entries').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate).order('date',{ascending:false}),
      ])
      const data={}
      for(let d=1;d<=daysInMonth;d++){
        const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
        const dayMeds=(medRes.data||[]).filter(m=>m.date===dateStr)
        const dayWater=(waterRes.data||[]).filter(w=>w.date===dateStr)
        const dayEx=(exRes.data||[]).filter(e=>e.date===dateStr)
        const dayCof=(cofRes.data||[]).filter(c=>c.date===dateStr)
        const totalWater=dayWater.reduce((a,w)=>a+w.amount_ml,0)
        const medsTaken=dayMeds.filter(m=>m.taken).length
        const hasActivity=dayMeds.length>0||dayWater.length>0||dayEx.length>0||dayCof.length>0
        data[d]={medsTaken,totalMeds:dayMeds.length,water:totalWater,exercise:dayEx.reduce((a,e)=>a+e.duration_min,0),coffee:dayCof.reduce((a,c)=>a+c.cups,0),hasActivity,meds:dayMeds,waterLogs:dayWater,exLogs:dayEx}
      }
      setMonthData(data)
      if(moodRes.data)setMoodNotes(moodRes.data)
    }
    load()
  },[user.id,year,month,daysInMonth])

  const getDayColor=(d)=>{
    if(d>todayDate||!monthData[d]?.hasActivity)return{bg:'var(--bg)',border:'var(--border)'}
    const dd=monthData[d]
    if(dd.medsTaken>0&&dd.water>500&&dd.exercise>0)return{bg:T[50],border:T[100]}
    if(dd.medsTaken>0||dd.water>0)return{bg:A[50],border:'#FAC775'}
    return{bg:R[50],border:'#F7C1C1'}
  }

  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <p style={{fontSize:20,fontWeight:500,color:'var(--text)',letterSpacing:'-0.02em'}}>{monthNames[month]} {year}</p>
        <div onClick={()=>setShowNotes(!showNotes)} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:10,background:showNotes?T[800]:'var(--bg)',border:`0.5px solid ${showNotes?T[800]:'var(--border)'}`,cursor:'pointer',transition:'all 0.2s'}}>
          <Icon type="notes" size={16} color={showNotes?T[50]:T[600]}/>
          <span style={{fontSize:12,color:showNotes?T[50]:T[600],fontWeight:500}}>Notes</span>
        </div>
      </div>

      {showNotes&&<div style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,padding:16,marginBottom:14,maxHeight:260,overflowY:'auto',animation:'cardIn 0.3s ease'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:15,fontWeight:500,color:'var(--text)'}}>Your journal</span>
          <div onClick={()=>setShowNotes(false)} style={{cursor:'pointer'}}><Icon type="close" size={16} color="var(--text-t)"/></div>
        </div>
        {moodNotes.length===0?<p style={{fontSize:13,color:'var(--text-t)',textAlign:'center',padding:12}}>No journal entries yet</p>:
        moodNotes.map((n,i)=><div key={i} style={{padding:'10px 12px',borderRadius:10,background:'var(--bg2)',marginBottom:i<moodNotes.length-1?8:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{new Date(n.date+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
            <div style={{width:8,height:8,borderRadius:'50%',background:n.mood_level>=4?T[400]:n.mood_level>=3?A[400]:R[400]}}/>
            <span style={{fontSize:11,color:'var(--text-t)',fontWeight:300}}>{MOODS[n.mood_level-1]?.label}</span>
          </div>
          {n.short_note&&<p style={{fontSize:13,color:'var(--text-s)',fontWeight:300}}>{n.short_note}</p>}
          {n.journal&&<p style={{fontSize:12,color:'var(--text-t)',fontWeight:300,marginTop:2}}>{n.journal}</p>}
        </div>)}
      </div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:6}}>
        {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:12,color:'var(--text-t)',fontWeight:300,padding:'4px 0'}}>{d}</div>)}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:16}}>
        {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>{
          const c=getDayColor(d)
          const future=d>todayDate
          return(
            <div key={d} onClick={()=>!future&&setSelectedDay(selectedDay===d?null:d)}
              style={{aspectRatio:'1',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:future?'default':'pointer',transition:'all 0.18s',background:c.bg,border:d===todayDate?`2px solid ${T[800]}`:`0.5px solid ${c.border}`,opacity:future?0.4:1}}>
              <span style={{fontSize:13,fontWeight:d===todayDate?500:400,color:d===todayDate?T[800]:future?'var(--text-t)':'var(--text)'}}>{d}</span>
            </div>
          )
        })}
      </div>

      {selectedDay&&monthData[selectedDay]&&(
        <div style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,padding:16,marginBottom:16,animation:'cardIn 0.3s ease'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <span style={{fontSize:16,fontWeight:500,color:'var(--text)'}}>{monthNames[month]} {selectedDay}</span>
            <div onClick={()=>setSelectedDay(null)} style={{cursor:'pointer'}}><Icon type="close" size={16} color="var(--text-t)"/></div>
          </div>
          {[
            {icon:'med',label:'Medicines',value:`${monthData[selectedDay].medsTaken} taken`,ok:monthData[selectedDay].medsTaken>0},
            {icon:'water',label:'Water',value:`${(monthData[selectedDay].water/1000).toFixed(1)} L`,ok:monthData[selectedDay].water>500},
            {icon:'exercise',label:'Exercise',value:monthData[selectedDay].exercise>0?`${monthData[selectedDay].exercise} min`:'Skipped',ok:monthData[selectedDay].exercise>0},
            {icon:'coffee',label:'Coffee',value:`${monthData[selectedDay].coffee} cups`,ok:true},
          ].map((item,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'var(--bg2)',borderRadius:10,marginBottom:i<3?8:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}><Icon type={item.icon} size={16}/><span style={{fontSize:13,color:'var(--text)'}}>{item.label}</span></div>
              <span style={{fontSize:13,fontWeight:500,color:item.ok?T[600]:R[400]}}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatsScreen({user}){
  const[stats,setStats]=useState(null)
  const now=new Date()
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']

  useEffect(()=>{
    async function load(){
      const year=now.getFullYear(),month=now.getMonth()
      const daysInMonth=new Date(year,month+1,0).getDate()
      const startDate=`${year}-${String(month+1).padStart(2,'0')}-01`
      const endDate=`${year}-${String(month+1).padStart(2,'0')}-${daysInMonth}`
      const todayDate=now.getDate()

      const[medRes,waterRes,exRes,cofRes,moodRes]=await Promise.all([
        supabase.from('medicine_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('water_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('exercise_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('coffee_logs').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
        supabase.from('mood_entries').select('*').eq('user_id',user.id).gte('date',startDate).lte('date',endDate),
      ])

      const medsTaken=(medRes.data||[]).filter(m=>m.taken).length
      const totalMedLogs=(medRes.data||[]).length
      const totalWater=(waterRes.data||[]).reduce((a,w)=>a+w.amount_ml,0)
      const waterDays=new Set((waterRes.data||[]).map(w=>w.date)).size
      const totalEx=(exRes.data||[]).reduce((a,e)=>a+e.duration_min,0)
      const exDays=new Set((exRes.data||[]).map(e=>e.date)).size
      const totalCoffee=(cofRes.data||[]).reduce((a,c)=>a+c.cups,0)
      const cofDays=new Set((cofRes.data||[]).map(c=>c.date)).size
      const avgMood=moodRes.data?.length?Math.round(moodRes.data.reduce((a,m)=>a+m.mood_level,0)/moodRes.data.length*10)/10:0

      setStats({
        medsTaken,totalMedLogs,
        totalWater,waterDays,avgWater:waterDays>0?Math.round(totalWater/waterDays):0,
        totalEx,exDays,avgEx:exDays>0?Math.round(totalEx/exDays):0,
        totalCoffee,cofDays,avgCoffee:cofDays>0?Math.round(totalCoffee/cofDays*10)/10:0,
        avgMood,moodCount:moodRes.data?.length||0,
        activeDays:todayDate
      })
    }
    load()
  },[user.id])

  if(!stats)return<p style={{fontSize:14,color:'var(--text-t)',textAlign:'center',padding:40}}>Loading stats...</p>

  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <p style={{fontSize:20,fontWeight:500,color:'var(--text)',letterSpacing:'-0.02em'}}>Your stats</p>
      <p style={{fontSize:13,color:'var(--text-t)',fontWeight:300,marginTop:2,marginBottom:20}}>{monthNames[now.getMonth()]} {now.getFullYear()}</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
        {[
          {v:stats.activeDays,l:'Days this month',c:T[600]},
          {v:stats.avgMood>0?MOODS[Math.round(stats.avgMood)-1]?.label:'No data',l:'Avg mood',small:true},
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,padding:'14px 12px',textAlign:'center'}}>
            <p style={{fontSize:s.small?16:28,fontWeight:500,color:s.c||'var(--text)',letterSpacing:'-0.03em'}}>{s.v}</p>
            <p style={{fontSize:12,color:'var(--text-t)',fontWeight:300,marginTop:2}}>{s.l}</p>
          </div>
        ))}
      </div>

      {[
        {icon:'med',title:'Medicines',summary:`${stats.medsTaken} taken`,items:[
          {n:'Total logged',v:stats.totalMedLogs},
          {n:'Taken',v:stats.medsTaken},
          {n:'Completion',v:stats.totalMedLogs>0?Math.round(stats.medsTaken/stats.totalMedLogs*100)+'%':'0%'},
        ]},
        {icon:'water',title:'Water',summary:`${stats.avgWater} ml avg`,items:[
          {n:'Total',v:`${(stats.totalWater/1000).toFixed(1)} L`},
          {n:'Days tracked',v:stats.waterDays},
          {n:'Daily average',v:`${stats.avgWater} ml`},
        ]},
        {icon:'exercise',title:'Exercise',summary:`${stats.avgEx} min avg`,items:[
          {n:'Total time',v:`${stats.totalEx} min`},
          {n:'Days active',v:stats.exDays},
          {n:'Daily average',v:`${stats.avgEx} min`},
        ]},
        {icon:'coffee',title:'Coffee',summary:`${stats.avgCoffee} avg`,items:[
          {n:'Total cups',v:stats.totalCoffee},
          {n:'Days tracked',v:stats.cofDays},
          {n:'Daily average',v:stats.avgCoffee},
        ]},
      ].map((section,si)=>(
        <div key={si} style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,borderRadius:10,background:T[50],display:'flex',alignItems:'center',justifyContent:'center'}}><Icon type={section.icon}/></div>
            <div style={{flex:1}}><p style={{fontSize:15,fontWeight:500,color:'var(--text)'}}>{section.title}</p></div>
            <span style={{fontSize:13,fontWeight:500,color:T[600]}}>{section.summary}</span>
          </div>
          {section.items.map((item,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:i>0?'0.5px solid var(--border)':'none'}}>
              <span style={{fontSize:13,color:'var(--text-s)',fontWeight:300}}>{item.n}</span>
              <span style={{fontSize:13,color:'var(--text)',fontWeight:500}}>{item.v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ProfileScreen({user,meds,setMeds,onLogout,setUser}){
  const[newMed,setNewMed]=useState({name:'',dose:'',alarm_time:'09:00'})
  const[adding,setAdding]=useState(false)
  const[editName,setEditName]=useState(user.name||'')
  const[showNameEdit,setShowNameEdit]=useState(false)
  const[savingName,setSavingName]=useState(false)

  const saveName=async()=>{
    setSavingName(true)
    await supabase.from('profiles').update({name:editName}).eq('id',user.id)
    setUser(prev=>({...prev,name:editName}))
    setShowNameEdit(false)
    setSavingName(false)
  }

  const addMed=async()=>{
    if(!newMed.name||!newMed.dose)return
    const{error}=await supabase.from('medicines').insert({user_id:user.id,...newMed})
    if(error){console.error('Add med error:',error);return}
    const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true)
    if(data)setMeds(data)
    setNewMed({name:'',dose:'',alarm_time:'09:00'});setAdding(false)
  }

  const delMed=async(id)=>{
    await supabase.from('medicines').update({active:false}).eq('id',id)
    const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true)
    if(data)setMeds(data)
  }

  return(
    <div style={{animation:'cardIn 0.4s ease'}}>
      <p style={{fontSize:20,fontWeight:500,color:'var(--text)',letterSpacing:'-0.02em',marginBottom:20}}>Profile</p>

      <div style={{textAlign:'center',marginBottom:24}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:T[50],border:`2px solid ${T[400]}`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:500,color:T[800]}}>{(user.name||'U')[0].toUpperCase()}</div>
        {!showNameEdit?<>
          <p style={{fontSize:18,fontWeight:500,color:'var(--text)',marginTop:12}}>{user.name||user.email}</p>
          <p style={{fontSize:13,color:'var(--text-t)',fontWeight:300}}>{user.email}</p>
          <div onClick={()=>setShowNameEdit(true)} style={{display:'inline-block',marginTop:8,fontSize:13,color:T[600],cursor:'pointer',fontWeight:500}}>Edit name</div>
        </>:<div style={{marginTop:12}}>
          <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your name" style={{width:'100%',boxSizing:'border-box',padding:'10px 14px',borderRadius:10,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)',textAlign:'center',marginBottom:8}}/>
          <div style={{display:'flex',gap:8,justifyContent:'center'}}>
            <button onClick={saveName} disabled={savingName} style={{padding:'8px 20px',borderRadius:8,border:'none',background:T[800],color:T[50],fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>{savingName?'Saving...':'Save'}</button>
            <button onClick={()=>setShowNameEdit(false)} style={{padding:'8px 20px',borderRadius:8,border:'0.5px solid var(--border)',background:'transparent',color:'var(--text-s)',fontSize:13,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
          </div>
        </div>}
      </div>

      <div style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,padding:16,marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:15,fontWeight:500,color:'var(--text)'}}>My medicines</span>
          <div onClick={()=>setAdding(!adding)} style={{fontSize:13,color:T[600],cursor:'pointer',fontWeight:500}}>{adding?'Cancel':'+ Add'}</div>
        </div>
        {adding&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12,padding:12,background:'var(--bg2)',borderRadius:10}}>
          <input type="text" placeholder="Medicine name (e.g. Vitamin B12)" value={newMed.name} onChange={e=>setNewMed({...newMed,name:e.target.value})} style={{padding:'10px 12px',borderRadius:8,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)'}}/>
          <div style={{display:'flex',gap:8}}>
            <input type="text" placeholder="Dose (e.g. 1500 mcg)" value={newMed.dose} onChange={e=>setNewMed({...newMed,dose:e.target.value})} style={{flex:1,padding:'10px 12px',borderRadius:8,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)'}}/>
            <input type="time" value={newMed.alarm_time} onChange={e=>setNewMed({...newMed,alarm_time:e.target.value})} style={{padding:'10px 12px',borderRadius:8,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)',width:120}}/>
          </div>
          <button onClick={addMed} style={{padding:10,borderRadius:8,border:'none',background:T[800],color:T[50],fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Add medicine</button>
        </div>}
        {meds.map(med=><div key={med.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'var(--bg2)',borderRadius:10,marginBottom:8}}>
          <div><p style={{fontSize:14,color:'var(--text)'}}>{med.name}</p><span style={{fontSize:12,color:'var(--text-t)'}}>{med.dose} - {med.alarm_time}</span></div>
          <div onClick={()=>delMed(med.id)} style={{fontSize:12,color:R[400],cursor:'pointer',fontWeight:500}}>Remove</div>
        </div>)}
        {meds.length===0&&!adding&&<p style={{fontSize:13,color:'var(--text-t)',textAlign:'center'}}>No medicines yet</p>}
      </div>

      <div onClick={onLogout} style={{display:'flex',justifyContent:'center',padding:'14px 16px',background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:12,cursor:'pointer',marginTop:8}}>
        <span style={{fontSize:14,color:R[400],fontWeight:500}}>Sign out</span>
      </div>
    </div>
  )
}

export default function Home(){
  const[user,setUser]=useState(null)
  const[loading,setLoading]=useState(true)
  const[tab,setTab]=useState('home')
  const[meds,setMeds]=useState([])
  const[waterLogs,setWaterLogs]=useState([])
  const[coffee,setCoffee]=useState(0)
  const[moodEntry,setMoodEntry]=useState(null)
  const[exerciseLogs,setExerciseLogs]=useState([])

  const loadData=useCallback(async(uid)=>{
    const[m,w,c,mo,ex]=await Promise.all([
      supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',uid).eq('active',true),
      supabase.from('water_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at'),
      supabase.from('coffee_logs').select('*').eq('user_id',uid).eq('date',today).limit(1),
      supabase.from('mood_entries').select('*').eq('user_id',uid).eq('date',today).limit(1),
      supabase.from('exercise_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at'),
    ])
    if(m.data)setMeds(m.data)
    if(w.data)setWaterLogs(w.data)
    if(c.data?.[0])setCoffee(c.data[0].cups)
    if(mo.data?.[0])setMoodEntry(mo.data[0])
    if(ex.data)setExerciseLogs(ex.data)
  },[])

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){
        const u=session.user
        const userData={id:u.id,name:u.user_metadata?.full_name||u.email?.split('@')[0],email:u.email}
        await ensureProfile(u.id,u.email)
        setUser(userData)
        loadData(u.id)
      }
      setLoading(false)
    })
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(_e,session)=>{
      if(session?.user){
        const u=session.user
        const userData={id:u.id,name:u.user_metadata?.full_name||u.email?.split('@')[0],email:u.email}
        await ensureProfile(u.id,u.email)
        setUser(userData)
        loadData(u.id)
      }else setUser(null)
    })
    return()=>subscription.unsubscribe()
  },[loadData])

  const logout=async()=>{await supabase.auth.signOut();setUser(null);window.location.href='/login'}

  if(loading)return<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{fontSize:14,color:'var(--text-t)',fontWeight:300}}>Loading...</p></div>
  if(!user){if(typeof window!=='undefined')window.location.href='/login';return null}

  const tabs=[{key:'home',label:'Today',icon:'home'},{key:'calendar',label:'Calendar',icon:'calendar'},{key:'stats',label:'Stats',icon:'stats'},{key:'profile',label:'Profile',icon:'profile'}]

  return(
    <div style={{display:'flex',justifyContent:'center',minHeight:'100vh'}}>
      <div style={{width:'100%',maxWidth:375,background:'var(--bg2)',position:'relative',padding:'1.5rem',paddingBottom:72}}>
        {tab==='home'&&<Dashboard user={user} meds={meds} setMeds={setMeds} waterLogs={waterLogs} setWaterLogs={setWaterLogs} coffee={coffee} setCoffee={setCoffee} moodEntry={moodEntry} setMoodEntry={setMoodEntry} exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs}/>}
        {tab==='calendar'&&<CalendarScreen user={user}/>}
        {tab==='stats'&&<StatsScreen user={user}/>}
        {tab==='profile'&&<ProfileScreen user={user} meds={meds} setMeds={setMeds} onLogout={logout} setUser={setUser}/>}
        <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:375,display:'flex',justifyContent:'space-around',padding:'12px 0 20px',borderTop:'0.5px solid var(--border)',background:'var(--bg2)',zIndex:50}}>
          {tabs.map(t=><div key={t.key} onClick={()=>setTab(t.key)} style={{textAlign:'center',cursor:'pointer'}}>
            <Icon type={t.icon} size={22} color={tab===t.key?T[600]:'var(--text-t)'}/>
            <p style={{fontSize:11,color:tab===t.key?T[600]:'var(--text-t)',marginTop:4,fontWeight:tab===t.key?500:400}}>{t.label}</p>
          </div>)}
        </div>
      </div>
    </div>
  )
}
