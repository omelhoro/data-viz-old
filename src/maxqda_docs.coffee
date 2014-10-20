text=($ "#max-qda-doc").val()
codes=($ "#codes").val()
NEW_TEXT=($ "#text")
ECODES_COL=($ "#codes-col")
CSCALE=d3.scale.category20()
COL_LEFT=ECODES_COL.width()
EDOC_POOL=($ "#maxqda-doc-pool")

class MaxQDADoc
    constructor: (k,doc) ->
        @codes=doc['codes']
        @text=doc['text']
        console.log [ @text ]
        @sent_pool=@append_text(@text)
        @srt_codes=@codes.sort((a,b)->a[1]>b[1])
        @position_fn=@position_element(20)
        ECODES_COL.empty()
        for c in @srt_codes
            el=@append_code(c,@sent_pool)
            @position_fn(el)

    append_text:(t) ->
        sent = (i,s) ->
            if s==""
                s=[i,($ "<p></p>" )]
            else
                s=[i,($ "<span class='sent' data-sentix=#{i}>#{i}-#{s}</span>" )]
        pool={}
        NEW_TEXT.empty()
        tsplt=t.split("\n")
        console.log [tsplt[0]],tsplt[0].trim()=="",tsplt[0]==""
        tsplt=if tsplt[0].trim()=="" then tsplt.slice(1) else tsplt
        for l,i in tsplt
            newt=sent(i,l)
            NEW_TEXT.append(newt[1])
            pool[i+1]=newt[1]
            # pool.push(newt)
        pool

    render_selection:(c,db) ->
        c_range=[c[1]..c[2]]
        sents=(db[i] for i in c_range)
        # console.log "asd",c_range,c,sents
        marked_pool=[]
        select= (event) ->
            s=c[4].split("\n")
            for sent,i in  sents
                ts=sent.text()
                console.log ts,"AAA",s[i],c
                new_ts=ts.replace(s[i],(r)->
                    el="<span class='selected-code'>#{r}</span>"
                    marked_pool.push(el)
                    el)
                sent.html(new_ts)
        unselect = (event) ->
            for sent in sents
                code=sent.children(".selected-code")
                code.contents().unwrap()
        [select,unselect]

    append_code: (c,db) ->
        console.log c
        [s,e]=[c[1],c[2]]
        [ se,ee ]=[db[s],db[e]]
        [ sep,eep ]=[se.position(),ee.position()]
        codes=c[0].split("\\")
        color=CSCALE(codes[1])
        elm=($ "<div class='marked-code' title='#{c[0]}'></div>")
        ECODES_COL.append(elm)
        toppos=sep['top']
        height=if s==e then se.height() else (eep['top']+ee.height())-sep['top']
        elm.css({top:toppos,left:COL_LEFT})
        elm.css({ height:height})
        elm.css({"background-color":color})
        [hover,unhover]=@render_selection(c,db)
        elm.hover(hover,unhover)
        # console.log [s,e],c[0],sep,eep,se.offset(),ee.offset()
        elm

    position_element: (width) ->
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

# split_codes= (c) ->
#     pool=[]
#     for l in c.split("\n")
#         if l[0]==","
#             pool.push(l)
#         else
#             pool_last_ix=pool.length-1
#             last_line=pool[pool_last_ix]
#             pool[pool_last_ix]=last_line+"\n"+l
#     pool

# append_text = (t) ->
#     sent = (i,s) ->
#         if s==""
#             s=[i,($ "<p></p>" )]
#         else
#             s=[i,($ "<span class='sent' data-sentix=#{i}>#{i}-#{s}</span>" )]
#     pool={}
#     for l,i in t
#         newt=sent(i,l)
#         new_text.append(newt[1])
#         pool[i]=newt[1]
#         # pool.push(newt)
#     pool

# CSCALE=d3.scale.category20()

# render_selection=(c,db) ->
#     c_range=[c[1]..c[2]]
#     sents=(db[i] for i in c_range)
#     # console.log "asd",c_range,c,sents
#     marked_pool=[]
#     select= (event) ->
#         s=c[4].split("\n")
#         for sent,i in  sents
#             ts=sent.text()
#             new_ts=ts.replace(s[i],(r)->
#                 # console.log r
#                 el="<span class='selected-code'>#{r}</span>"
#                 marked_pool.push(el)
#                 el)
#             sent.html(new_ts)
#     unselect = (event) ->
#         for sent in sents
#             code=sent.children(".selected-code")
#             code.contents().unwrap()
#     [select,unselect]

# COL_LEFT=codes_col.width()
# append_code=(c,db) ->
#     [s,e]=[c[1],c[2]]
#     [ se,ee ]=[db[s],db[e]]
#     [ sep,eep ]=[se.position(),ee.position()]
#     codes=c[0].split("\\")
#     color=CSCALE(codes[1])
#     elm=($ "<div class='marked-code' title='#{c[0]}'></div>")
#     codes_col.append(elm)
#     toppos=sep['top']
#     height=if s==e then se.height() else (eep['top']+ee.height())-sep['top']
#     elm.css({top:toppos,left:COL_LEFT})
#     elm.css({ height:height})
#     elm.css({"background-color":color})
#     [hover,unhover]=render_selection(c,db)
#     elm.hover(hover,unhover)
#     elm
#     # console.log [s,e],c[0],sep,eep,se.offset(),ee.offset()

# position_element= (width) ->
#     records=[]
#     position=(el)->
#         pos=el.position()
#         pos_s=[ pos.top,pos.left,pos.top+el.height()]
#         # console.log pos,pos_s,records,pos_s of records
#         is_good=true
#         for rec in records
#             if rec[0]!=pos_s[0] || rec[1]!=pos_s[1]
#                 if rec[1]==pos_s[1]
#                     is_good=pos.top>=rec[2]
#                 else
#                     "ok"
#             else
#                 is_good=false
#         if not is_good
#             # console.log "reset"
#             el.css({left:pos.left-width})
#             position(el)
#         else
#             # console.log "ok"
#             records.push(pos_s)
#             "ok"
#     position

# sent_pool=append_text(text.split("\n"))
# code_pool=split_codes(codes)

# codes_csv=code_pool.map((l)->
#     parsed=d3.csv.parseRows(l)[0].slice(2,7)
#     parsed.map((e) ->
#         parseInt(e)+1 or e
#     ))

# srt=codes_csv.sort((a,b)->a[1]>b[1])
# position=position_element(20)
# for c in srt
#     coords={}
#     el=append_code(c,sent_pool)
#     position(el)

$.get("static/public_data/claiming_respect.json",(d)->
    data=d["kosovo_docs"]
    render_choice = (e) ->
        c=EDOC_POOL.children(":selected")[0]
        k=$(c).val()
        new MaxQDADoc(k,data[k])

    keys=Object.keys(data)
    for k in keys
        opt=$("<option value='#{k}'>#{k}</option>")
        EDOC_POOL.append(opt)
    EDOC_POOL.change(render_choice )
    fcode=keys[4]
    new MaxQDADoc(fcode,data[fcode])
)
