# text=($ "#max-qda-doc").val()
# codes=($ "#codes").val()
class MaxQDADoc

    constructor: (k,doc) ->
        @NEW_TEXT=($ "#text")
        @ECODES_COL=($ "#codes-col")
        @ECODES_COLSVG=(d3.select "#codes-col-svg")
        @CSCALE=d3.scale.category20()
        @COL_LEFT=@ECODES_COL.width()
        @codes=doc['codes']
        @text=doc['text']
        @sent_pool=@append_text(@text)
        @srt_codes=@codes.sort((a,b)->a[1]>b[1])
        # @position_fn=@position_element(20,"html")
        # ECODES_COL.empty()
        # for c in @srt_codes
        #     el=@append_code(c,@sent_pool)
        #     @position_fn(el)

        @position_fn=@position_element(20,"svg")
        @ECODES_COLSVG.selectAll("*").remove()
        for c in @srt_codes
            el=@append_code_svg(c,@sent_pool)
            @position_fn(el)
        @ECODES_COLSVG.attr("height",@NEW_TEXT.height())
        $(".marked-code").tooltip({
            'container': 'body',
            'placement': 'auto'
        })

    append_text:(t) ->
        sent = (i,s) ->
            if s==""
                s=[i,($ "<p></p>" )]
            else
                s=[i,($ "<span class='sent' data-sentix=#{i}>#{s}</span>" )]
        pool={}
        @NEW_TEXT.empty()
        tsplt=t.split("\n")
        tsplt=if tsplt[0].trim()=="" then tsplt.slice(1) else tsplt
        for l,i in tsplt
            newt=sent(i,l)
            @NEW_TEXT.append(newt[1])
            pool[i+1]=newt[1]
            # pool.push(newt)
        pool

    render_selection:(c,db) ->
        c_range=[c[1]..c[2]]
        sents=(db[i] for i in c_range)
        marked_pool=[]
        select= (event) ->
            s=c[4].split("\n")
            for sent,i in  sents
                ts=sent.text()
                new_ts=ts.replace(s[i],(r)->
                    el="<span class='selected-code'>#{r}</span>"
                    marked_pool.push(el)
                    el)
                sent.html(new_ts)
            # ECODE_EXP.text(c[0])
        unselect = (event) ->
            for sent in sents
                code=sent.children(".selected-code")
                code.contents().unwrap()
            # ECODE_EXP.text("")
        [select,unselect]

    append_code_svg: (c,db) ->
        [s,e]=[c[1],c[2]]
        [ se,ee ]=[db[s],db[e]]
        [ sep,eep ]=[se.position(),ee.position()]
        codes=c[0].split("\\")
        color=@CSCALE(codes[0])
        # elm=(d3.select "rect")
        text=c[0].replace(/\\/g," -> ")
        elm=@ECODES_COLSVG.append("rect").attr({class:"marked-code","title":"#{text}"})
        toppos=sep['top']
        height=if s==e then se.height() else (eep['top']+ee.height())-sep['top']
        elm.attr({y:toppos,x:80})
        elm.attr({height:height,width:"20px"})
        elm.attr({fill:color})
        [hover,unhover]=@render_selection(c,db)
        ($ elm[0]).hover(hover,unhover)
        elm

    append_code: (c,db) ->
        [s,e]=[c[1],c[2]]
        [ se,ee ]=[db[s],db[e]]
        [ sep,eep ]=[se.position(),ee.position()]
        codes=c[0].split("\\")
        color=@CSCALE(codes[1])
        elm=($ "<div class='marked-code' title='#{c[0]}'></div>")
        @ECODES_COL.append(elm)
        toppos=sep['top']
        height=if s==e then se.height() else (eep['top']+ee.height())-sep['top']
        elm.css({top:toppos,left:@COL_LEFT})
        elm.css({ height:height})
        elm.css({"background-color":color})
        [hover,unhover]=@render_selection(c,db)
        elm.hover(hover,unhover)
        elm

    position_element: (width,mod="html") ->
        records=[]
        getPosition= (elm) ->
            if mod=="html"
                pos=elm.position()
                pos_s={top: pos.top,left:pos.left,end:pos.top+elm.height() }
            else
                pos_s={ top:parseFloat( elm.attr("y") ),left:parseFloat( elm.attr("x") ),end:parseInt( elm.attr("y") )+parseFloat( elm.attr("height") ) }
        pushLeft=(elm,curLeft) ->
            if mod=="html"
                elm.css({left:curLeft-width})
            else
                elm.attr("x",curLeft-width)
        position=(el)->
            pos_s=getPosition(el)
            is_good=true
            for rec in records
                if rec.top!=pos_s.top || rec.left!=pos_s.left
                    if rec.left==pos_s.left
                        is_good=pos_s.top>=rec.end
                    else
                        "ok"
                else
                    is_good=false
            if not is_good
                pushLeft(el,pos_s.left)
                position(el)
            else
                records.push(pos_s)
                "ok"
        position

    position_element_or: (width) ->
        records=[]
        position=(el)->
            pos=el.position()
            pos_s=[ pos.top,pos.left,pos.top+el.height()]
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
                el.css({left:pos.left-width})
                position(el)
            else
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

# cscalE=d3.scale.category20()

# render_selection=(c,db) ->
#     c_range=[c[1]..c[2]]
#     sents=(db[i] for i in c_range)
#     marked_pool=[]
#     select= (event) ->
#         s=c[4].split("\n")
#         for sent,i in  sents
#             ts=sent.text()
#             new_ts=ts.replace(s[i],(r)->
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

# position_element= (width) ->
#     records=[]
#     position=(el)->
#         pos=el.position()
#         pos_s=[ pos.top,pos.left,pos.top+el.height()]
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
#             el.css({left:pos.left-width})
#             position(el)
#         else
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
    EDOC_POOL=($ "#maxqda-doc-pool")
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
    fcode=keys[0]
    new MaxQDADoc(fcode,data[fcode])
)
