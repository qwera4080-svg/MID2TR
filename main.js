var sp_notes=[[0,0,0,0]]
var min_time=1
var a
MidiParser.parse(source,(res)=>{
    a=res
    min_time=-1
    var track_id=-1
    for (let track of res.track){
        var last_record_time=0
        track_id+=1
        var total_time = 0
        for (let event of track.event){
            total_time+=event.deltaTime
            if (event.type==9){
                var _time=total_time-last_record_time
                if (((min_time==-1)|(min_time>_time))&(_time!=0)){
                    min_time=_time
                }
                last_record_time=event.deltaTime
                sp_notes.push([total_time, track_id, event.data[0], event.data[0]])
            }
        }
    }
})
savefile=()=>{
    const notes=["C","C#","D","D#","E","F","F#","G","G#","A","A#","H"]
    var data = 'info;\n'
    for(let i in sp_notes){
        let [_time,track,note,vol]=sp_notes[i];
        data+=`25;${i};${_time/(min_time*mult.value)};${track};1;1;;¶;${notes[note%12]}${(note-note%12)/12};${vol};¶;\n`
    }
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'out.trmap'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
