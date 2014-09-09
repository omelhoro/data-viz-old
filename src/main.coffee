$=jQuery

choices=[['rhythm','Rhythm'],['vot',"VOT"],["heat_map","Cards"],["formants","Formants"],["corpus","Corpus"]]
menu=($ ".viz_menu")

append_map = (target,el) ->
            $.get "target/#{target}.html", (d) ->
                ($ '.nav > li').each (i,e) -> ($ e).removeClass('active')
                el?.addClass "active"
                ($ ".viz-map").html d
create_menu = (subchoice) ->
    lead_to=(target,el) ->
        lead = (e) ->
            append_map(target,el)
        return lead
    if subchoice.length>1
        new_choices=0 #TODO: filter by subchoices
    for itm in choices
        l=($ "<li><a href='#'>#{itm[1]}</a></li>")
        l.click lead_to(itm[0],l)
        menu.append(l)

subchoice=parent.viz_choice
if subchoice?
    if subchoice.length>1
        create_menu(subchoice)
    else
        append_map(subchoice[0])
else
    create_menu([])
