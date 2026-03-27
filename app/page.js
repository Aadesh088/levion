'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const T = {50:'#E1F5EE',100:'#9FE1CB',400:'#1D9E75',600:'#0F6E56',800:'#085041',900:'#04342C'}
const A = {50:'#FAEEDA',400:'#EF9F27',800:'#633806'}
const R = {50:'#FCEBEB',400:'#E24B4A',800:'#791F1F'}
const today = new Date().toISOString().split('T')[0]

const MOODS = [
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
      <div style={{maxHeight:open?600:0,opacity:open?1:0,overflow:'hidden',transition:'all 0.35s ease',padding:open?'0 16px 16px':'0 16px'}}>{children}</div>
    </div>
  )
}

function Dashboard({user,meds,setMeds,waterLogs,setWaterLogs,coffee,setCoffee,moodEntry,setMoodEntry}){
  const[mood,setMood]=useState(moodEntry?.mood_level||4)
  const[moodDay,setMoodDay]=useState(moodEntry?.short_note||'')
  const[moodJournal,setMoodJournal]=useState(moodEntry?.journal||'')
  const[waterInput,setWaterInput]=useState(false)
  const[waterAmt,setWaterAmt]=useState(250)
  const m=MOODS[mood-1]
  const totalW=(waterLogs.reduce((a,w)=>a+w.amount_ml,0)/1000).toFixed(1)
  const medsDone=meds.filter(med=>med.logs?.some(l=>l.taken&&l.date===today)).length
  const hr=new Date().getHours()

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
    if(moodEntry?.id){await supabase.from('mood_entries').update(p).eq('id',moodEntry.id)}
    else{await supabase.from('mood_entries').upsert(p,{onConflict:'user_id,date'})}
    const{data}=await supabase.from('mood_entries').select('*').eq('user_id',user.id).eq('date',today).single()
    if(data)setMoodEntry(data)
  }

  const days=['Mon','Tue','Wed','Thu','Fri']
  const dow=new Date().getDay()

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
        {days.map((d,i)=>{const dt=new Date();dt.setDate(dt.getDate()-(dow<=0?6:dow-1)+i);const isT=dt.toDateString()===new Date().toDateString();return(
          <div key={d} style={{flex:1,textAlign:'center',padding:'10px 0',borderRadius:10,background:isT?'var(--text)':'transparent'}}>
            <p style={{fontSize:11,color:isT?'var(--bg)':'var(--text-t)',fontWeight:300,opacity:isT?0.6:1}}>{d}</p>
            <p style={{fontSize:15,color:isT?'var(--bg)':'var(--text-s)',marginTop:4,fontWeight:500}}>{dt.getDate()}</p>
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
        <button onClick={saveMood} style={{width:'100%',padding:10,borderRadius:10,border:'none',background:m.color,color:'white',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Save mood</button>
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

      <Accordion icon="exercise" title="Exercise" summary="Log">
        <ExForm uid={user.id}/>
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

function ExForm({uid}){
  const[type,setType]=useState('Walk')
  const[mins,setMins]=useState(30)
  const[saved,setSaved]=useState(false)
  const save=async()=>{await supabase.from('exercise_logs').insert({user_id:uid,type,duration_min:mins,date:today});setSaved(true)}
  if(saved)return<p style={{fontSize:13,color:T[600],textAlign:'center',padding:12}}>Logged: {type} {mins}min</p>
  return(
    <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
      <div style={{display:'flex',gap:8}}>{['Walk','Run','Gym','Yoga'].map(t=><div key={t} onClick={()=>setType(t)} style={{flex:1,padding:8,textAlign:'center',background:type===t?T[50]:'var(--bg2)',borderRadius:10,fontSize:13,color:type===t?T[800]:'var(--text-s)',cursor:'pointer',fontWeight:type===t?500:400}}>{t}</div>)}</div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}><input type="number" value={mins} onChange={e=>setMins(+e.target.value)} style={{flex:1,padding:'10px 12px',borderRadius:10,border:'0.5px solid var(--border)',background:'var(--bg2)',fontSize:14,color:'var(--text)',boxSizing:'border-box'}}/><span style={{fontSize:13,color:'var(--text-s)'}}>min</span></div>
      <button onClick={save} style={{padding:10,borderRadius:10,border:'none',background:T[800],color:T[50],fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Log exercise</button>
    </div>
  )
}

function ProfileScreen({user,meds,setMeds,onLogout}){
  const[newMed,setNewMed]=useState({name:'',dose:'',alarm_time:'09:00'})
  const[adding,setAdding]=useState(false)
  const addMed=async()=>{
    if(!newMed.name||!newMed.dose)return
    await supabase.from('medicines').insert({user_id:user.id,...newMed})
    const{data}=await supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',user.id).eq('active',true)
    if(data)setMeds(data);setNewMed({name:'',dose:'',alarm_time:'09:00'});setAdding(false)
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
        <p style={{fontSize:18,fontWeight:500,color:'var(--text)',marginTop:12}}>{user.name||user.email}</p>
        <p style={{fontSize:13,color:'var(--text-t)',fontWeight:300}}>{user.email}</p>
      </div>
      <div style={{background:'var(--bg)',border:'0.5px solid var(--border)',borderRadius:14,padding:16,marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:15,fontWeight:500,color:'var(--text)'}}>My medicines</span>
          <div onClick={()=>setAdding(!adding)} style={{fontSize:13,color:T[600],cursor:'pointer',fontWeight:500}}>{adding?'Cancel':'+ Add'}</div>
        </div>
        {adding&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12,padding:12,background:'var(--bg2)',borderRadius:10}}>
          <input type="text" placeholder="Medicine name" value={newMed.name} onChange={e=>setNewMed({...newMed,name:e.target.value})} style={{padding:'10px 12px',borderRadius:8,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)'}}/>
          <div style={{display:'flex',gap:8}}>
            <input type="text" placeholder="Dose (e.g. 500mg)" value={newMed.dose} onChange={e=>setNewMed({...newMed,dose:e.target.value})} style={{flex:1,padding:'10px 12px',borderRadius:8,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)'}}/>
            <input type="time" value={newMed.alarm_time} onChange={e=>setNewMed({...newMed,alarm_time:e.target.value})} style={{padding:'10px 12px',borderRadius:8,border:'0.5px solid var(--border)',background:'var(--bg)',fontSize:14,color:'var(--text)',width:120}}/>
          </div>
          <button onClick={addMed} style={{padding:10,borderRadius:8,border:'none',background:T[800],color:T[50],fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>Add medicine</button>
        </div>}
        {meds.map(med=><div key={med.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'var(--bg2)',borderRadius:10,marginBottom:8}}>
          <div><p style={{fontSize:14,color:'var(--text)'}}>{med.name}</p><span style={{fontSize:12,color:'var(--text-t)'}}>{med.dose} - {med.alarm_time}</span></div>
          <div onClick={()=>delMed(med.id)} style={{fontSize:12,color:R[400],cursor:'pointer'}}>Remove</div>
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

  const loadData=useCallback(async(uid)=>{
    const[m,w,c,mo]=await Promise.all([
      supabase.from('medicines').select('*, logs:medicine_logs(*)').eq('user_id',uid).eq('active',true),
      supabase.from('water_logs').select('*').eq('user_id',uid).eq('date',today).order('logged_at'),
      supabase.from('coffee_logs').select('*').eq('user_id',uid).eq('date',today).limit(1),
      supabase.from('mood_entries').select('*').eq('user_id',uid).eq('date',today).limit(1),
    ])
    if(m.data)setMeds(m.data);if(w.data)setWaterLogs(w.data)
    if(c.data?.[0])setCoffee(c.data[0].cups);if(mo.data?.[0])setMoodEntry(mo.data[0])
  },[])

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){const u=session.user;setUser({id:u.id,name:u.user_metadata?.full_name||u.email?.split('@')[0],email:u.email});loadData(u.id)}
      setLoading(false)
    })
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{
      if(session?.user){const u=session.user;setUser({id:u.id,name:u.user_metadata?.full_name||u.email?.split('@')[0],email:u.email});loadData(u.id)}
      else setUser(null)
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
        {tab==='home'&&<Dashboard user={user} meds={meds} setMeds={setMeds} waterLogs={waterLogs} setWaterLogs={setWaterLogs} coffee={coffee} setCoffee={setCoffee} moodEntry={moodEntry} setMoodEntry={setMoodEntry}/>}
        {tab==='calendar'&&<div style={{animation:'cardIn 0.4s ease'}}><p style={{fontSize:20,fontWeight:500,color:'var(--text)',marginBottom:16}}>Calendar</p><p style={{fontSize:13,color:'var(--text-t)',fontWeight:300}}>Coming soon!</p></div>}
        {tab==='stats'&&<div style={{animation:'cardIn 0.4s ease'}}><p style={{fontSize:20,fontWeight:500,color:'var(--text)',marginBottom:16}}>Stats</p><p style={{fontSize:13,color:'var(--text-t)',fontWeight:300}}>Coming soon!</p></div>}
        {tab==='profile'&&<ProfileScreen user={user} meds={meds} setMeds={setMeds} onLogout={logout}/>}
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
