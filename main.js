var sp_notes=[[0,0,0,0]]
var min_time=1
file_open=(file=File)=>{
    min_time=-1
    var reader = new FileReader()
    reader.onload=()=>{
        var total_time=0
        var track = -1
        sp_notes=[]
        console.log("start")
        var b=new Uint8Array(reader.result)
        var _t=-1
        var _time=0
        for (let i = 0; i<b.length; i++){
            //console.log(b[i],_t)
            if (_t>0){
                if (type=="cmd"){
                    if (b[i]==255){
                        _t=b[i+2]+2
                        type="sys"
                        continue
                    }
                    var chan=b[i]%16
                    if(b[i]-chan==192){
                        type=""
                        _t=1
                        continue
                    }
                    else if(b[i]-chan==208){
                        type=""
                        _t=1
                        continue
                    }
                    else if(b[i]-chan==144){
                        type="note_on"
                        _t=2
                        continue
                    }
                    else if(b[i]-chan==128){
                        type="note_off"
                        _t=2
                        continue
                    }
                    else{
                        type=""
                        _t=2
                        continue    
                    }    
                }
                else if (type=="note_on"){
                    if (_t==2){
                        var _note = b[i]
                    }
                    else if (_t==1){
                        total_time+=_time
                        console.log(_time,min_time)
                        if (((min_time==-1)|(min_time>_time))&(_time!=0)){
                            min_time=_time
                        }
                        console.log(_time,min_time)
                        sp_notes.push([total_time,track,_note,b[i]])
                    }
                }
                else if (type=="note_off"){
                    if (_t==2){
                        var _note = b[i]
                    }
                    else if (_t==1){
                        total_time+=_time
                        console.log(_time,min_time)
                        if (((min_time==-1)|(min_time>_time))&(_time!=0)){
                            min_time=_time
                        }
                        console.log(_time,min_time)
                    }
                }
                if(_t==1){
                    _time=0
                }
                _t-=1
            }
            else if (_t==0){
                _time=_time*128+(b[i]%128)
                if(b[i]<128){
                    _t=1
                    var type="cmd"
                }
            }
            if((b[i]==77)&(b[i+1]==84)&(b[i+2]==114)&(b[i+3]==107)){
                console.log("-----MTrk-----")
                _t=3
                total_time=0
                track+=1

            }
        }
    }
    reader.readAsArrayBuffer(file)
}
savefile=()=>{
    const notes=["C","C#","D","D#","E","F","F#","G","G#","A","A#","H"]
    var data = 'info;\n'
    for(let i in sp_notes){
        let [_time,track,note,vol]=sp_notes[i];
        data+=`25;${i};${_time/min_time};${track};1;1;;¶;${notes[note%12]}${(note-note%12)/12};${vol};¶;\n`
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
