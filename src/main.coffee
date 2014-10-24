$=jQuery
#format is as follows: Key is the name of sources (js,html): Values are
#[Name as in Menu,[class of plot, Custom html insert]]
MAPS={
  kosovo_tree:["Kosovo-Tree",['',"html_"]]
  maxqda_docs: ["Respect-Docs",["",'html_']]
  syllables: ["Syllables",['d3',"html_"]]
  lima_design:["Lima Project",['','html_']],
  heatplot: ["Cards",["d3",'html_']]
  lima_corpus:["Child Corpus",['d3',"html"]]
  rhythm: ["Rhythm & Biography",['d3','']]
  dynam_rhythm:["Dynamics of Rhythm", ['',"html_"]]
  vot: ["VOT",["d3 TODO: fixplot",'htmlj']]
  formants: ["Formants",["d3",'html_']]
  cv_plot: ["CV-related",["",'html_']]
}

menu=($ ".viz_menu")
chart_wrapper=($ "#chart_wrapper")

append_map = (target,el) ->
  chart_wrapper.empty() #empty the div containing the plot
  [name,[viz_class,content]]=MAPS[target]
  dom_target=($ "<div id=template></div>") #create the parent of plot
  chart_wrapper.append(dom_target)
  dom_target.prop("class","").prop("style","") #reset classes and style
  #split the name of plot: first is the abstraction
  js_target=target.split("_of")[0]
  #link script source
  js_lnk=
    $ "<script type='text/javascript' src='target/js/#{js_target}.js'></script>"
  dom_target.addClass(viz_class)
  ($ '.nav > li').each (i,e) -> ($ e).removeClass('active')
  el?.addClass "active"
  if content.indexOf("html")==0
    #decide whether html source is jade (->compiles to 'target'-dir) or raw html
    dir=if content[4]=="j" then 'target' else 'templates'
    content=content.slice(5)
    $.get "#{dir}/#{js_target}.html", (d) ->
      dom_target.html d
  chart_wrapper.append ($ content)
  # chart_wrapper.append js_lnk

create_menu = (sub_choice,instant) ->
  lead_to=(target,el) ->
    lead = (e) ->
      append_map(target,el)
    lead
  filter_choice=if sub_choice.length==0 then Object.keys(MAPS) else sub_choice
  if sub_choice.length==1
    $(".navbar").remove()
    append_map(sub_choice[0])
  for k,v of MAPS
    if k in filter_choice
      l=($ "<li id=#{k}><a href='#'>#{v[0]}</a></li>")
      l.click lead_to(k,l)
      menu.append(l)
  if instant in filter_choice
    ($ "##{instant}").click()
  else
    ($ "li",menu).first().click()

$(".jswarning").remove()

# subchoice=['corpus_of_syl'] #parent.viz_choice
subchoice=parent.viz_choice
instant='dynam_rhythm'
if subchoice? then create_menu(subchoice,instant) else create_menu([],instant)
