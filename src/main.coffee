$=jQuery
MAPS={
    kosovo_tree:
        ["Kosovo-Tree",['',"<h3>Events and Number of Docs</h3><div id='chart_div_anno'></div><div id=chart_div_org></div>"]]
    rhythm_dyn: ["Rhythm2",['',"<div id='chart_div_end'></div><button id='next-part' class='inter-chart'>Next participant</button>
    <button id='toggle-basis' class='inter-chart'>Toggle letter-class</button><input class='nbin-field'  type=number value=5><button class='bin-update'>Update</button>"]]
    rhythm: ["Rhythm",['d3','']]
    vot: ["VOT",["d3 TODO: fixplot",'html']]
    heatplot: ["Cards",["d3",'']]
    formants: ["Formants",["d3",'']]
    corpus_of_words: ["Child Corpus",['d3',"html<script type='text/javascript'>data_src='./static/data/lima_corpus_group_lemmas.csv'</script>"]]
    corpus_of_syl: ["Syllables",['d3',"html<script type='text/javascript'>data_src='./static/public_data/syl_subset.csv'</script>"]]
}

menu=($ ".viz_menu")
chart_wrapper=($ "#chart_wrapper")

append_map = (target,el) ->
            chart_wrapper.empty()
            [name,[viz_class,content]]=MAPS[target]
            dom_target=($ "<div id=chart_div></div>")
            chart_wrapper.append(dom_target)
            dom_target.prop("class","").prop("style","")
            js_target=target.split("_of")[0]
            js_lnk=$ "<script type='text/javascript' src='target/js/#{js_target}.js'></script>"
            dom_target.addClass(viz_class)
            ($ '.nav > li').each (i,e) -> ($ e).removeClass('active')
            el?.addClass "active"
            if content.startsWith("html")
                content=content.slice(4)
                $.get "target/#{js_target}.html", (d) ->
                    dom_target.html d
            chart_wrapper.append ($ content)
            chart_wrapper.append js_lnk
            
create_menu = (subchoice) ->
    lead_to=(target,el) ->
        lead = (e) ->
            append_map(target,el)
        lead
    if subchoice.length>1
        new_choices=0 #TODO: filter by subchoices
    for k,v of MAPS
        l=($ "<li id=#{k}><a href='#'>#{v[0]}</a></li>")
        l.click lead_to(k,l)
        menu.append(l)

subchoice=parent.viz_choice
if subchoice?
    if subchoice.length>1
        create_menu(subchoice)
    else
        append_map(subchoice[0])
else
    create_menu([])
instant='vot'
($ "##{instant}").click()
