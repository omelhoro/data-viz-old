text=($ "#max-qda-doc").val()
codes=($ "#codes").val()
new_text=($ "#text")
codes_col=($ "#codes-col")
split_codes= (c) ->
    pool=[]
    for l in c.split("\n")
        if l[0]==","
            pool.push(l)
        else
            pool_last_ix=pool.length-1
            last_line=pool[pool_last_ix]
            pool[pool_last_ix]=last_line+"\n"+l
    pool

append_text = (t) ->
    sent = (i,s) ->
        if s==""
            s=[i,($ "<p></p>" )]
        else
            s=[i,($ "<span class='sent' data-sentix=#{i}>#{i}-#{s}</span>" )]
    pool={}
    for l,i in t
        newt=sent(i,l)
        new_text.append(newt[1])
        pool[i]=newt[1]
        # pool.push(newt)
    pool

cscale=d3.scale.category20()

render_selection=(c,db) ->
    c_range=[c[1]..c[2]]
    sents=(db[i] for i in c_range)
    # console.log "asd",c_range,c,sents
    marked_pool=[]
    select= (event) ->
        s=c[4].split("\n")
        for sent,i in  sents
            ts=sent.text()
            new_ts=ts.replace(s[i],(r)->
                # console.log r
                el="<span class='selected-code'>#{r}</span>"
                marked_pool.push(el)
                el)
            sent.html(new_ts)
    unselect = (event) ->
        for sent in sents
            code=sent.children(".selected-code")
            code.contents().unwrap()
    [select,unselect]

col_left=codes_col.width()
append_code=(c,db) ->
    [s,e]=[c[1],c[2]]
    [ se,ee ]=[db[s],db[e]]
    [ sep,eep ]=[se.position(),ee.position()]
    codes=c[0].split("\\")
    color=cscale(codes[1])
    elm=($ "<div class='marked-code' title='#{c[0]}'></div>")
    codes_col.append(elm)
    toppos=sep['top']
    height=if s==e then se.height() else (eep['top']+ee.height())-sep['top']
    elm.css({top:toppos,left:col_left})
    elm.css({ height:height})
    elm.css({"background-color":color})
    [hover,unhover]=render_selection(c,db)
    elm.hover(hover,unhover)
    elm
    # console.log [s,e],c[0],sep,eep,se.offset(),ee.offset()

position_element= (width) ->
    records=[]
    position=(el)->
        pos=el.position()
        pos_s=[ pos.top,pos.left,pos.top+el.height()]
        # console.log pos,pos_s,records,pos_s of records
        is_good=true
        for rec in records
            if rec[0]!=pos_s[0] || rec[1]!=pos_s[1]
                if rec[1]==pos_s[1]
                    is_good=pos.top>=rec[2]
                else
                    "ok"
            else
                is_good=false
        if not is_good
            # console.log "reset"
            el.css({left:pos.left-width})
            position(el)
        else
            # console.log "ok"
            records.push(pos_s)
            "ok"
    position

sent_pool=append_text(text.split("\n"))
code_pool=split_codes(codes)

codes_csv=code_pool.map((l)->
    parsed=d3.csv.parseRows(l)[0].slice(2,7)
    parsed.map((e) ->
        parseInt(e)+1 or e
    ))

srt=codes_csv.sort((a,b)->a[1]>b[1])
position=position_element(20)
for c in srt
    coords={}
    el=append_code(c,sent_pool)
    position(el)
