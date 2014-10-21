$=jQuery
#format is as follows: Key is the name of sources (js,html): Values are
#[Name as in Menu,[class of plot, Custom html insert]]
MAPS={
    kosovo_tree:
        ["Kosovo-Tree",['',"<h3>Events and Number of Docs</h3><div id='chart_div_anno'></div><div id=chart_div_org></div>"]]
    maxqda_docs: ["Respect-Docs",["",'html_']]
    corpus_of_syl: ["Syllables",['d3',"htmlj<script type='text/javascript'>forerun_src='templates/corpus_of_sylls.html';predef=[['Russian influenced models','1|2|3'],['Western influenced models','4|5']];data_src='./static/public_data/syl_subset.csv'</script>"]]
    lima_design:["Lima Project",['','html_']],
    heatplot: ["Cards",["d3",'html_']]
    corpus_of_words: ["Child Corpus",['d3',"htmlj<script type='text/javascript'>forerun_src='templates/corpus_of_words.html';predef=[['Task 4','*4'],['Task 5','*5'],['Task 6','*6']];data_src='./static/data/lima_corpus_group_lemmas.csv'</script>"]]
    rhythm: ["Rhythm & Biography",['d3','']]
    rhythm_dyn: ["Dynamics of Rhythm",['',"<div id='chart_div_end'></div><button id='next-part' class='inter-chart'>Next participant</button><button id='toggle-basis' class='inter-chart'>Toggle letter-class</button><input class='nbin-field'  type=number value=5><button class='bin-update'>Update</button>"]]
    vot: ["VOT",["d3 TODO: fixplot",'htmlj']]
    formants: ["Formants",["d3",'html_']]
    cv_plot: ["CV-related",["",'html_']]
}

menu=($ ".viz_menu")
chart_wrapper=($ "#chart_wrapper")

append_map = (target,el) ->
  chart_wrapper.empty() #empty the div containing the plot
  [name,[viz_class,content]]=MAPS[target]
  dom_target=($ "<div id=chart_div></div>") #create the parent of plot
  chart_wrapper.append(dom_target)
  dom_target.prop("class","").prop("style","") #reset classes and style
  #split the name of plot: first is the abstraction
  js_target=target.split("_of")[0]
  #link script source
  js_lnk=$ "<script type='text/javascript' src='target/js/#{js_target}.js'></script>"
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
  chart_wrapper.append js_lnk

create_menu = (sub_choice) ->
  lead_to=(target,el) ->
    lead = (e) ->
      append_map(target,el)
    lead
  filter_choice=if sub_choice.length==0 then Object.keys(MAPS) else sub_choice
  if sub_choice.length==1
    $(".navbar").remove()
  for k,v of MAPS
    if k in filter_choice
      l=($ "<li id=#{k}><a href='#'>#{v[0]}</a></li>")
      l.click lead_to(k,l)
      menu.append(l)

$(".jswarning").remove()

# subchoice=['lima_design'] #parent.viz_choice
subchoice=parent.viz_choice
console.log subchoice,subchoice?,
if subchoice? then create_menu(subchoice) else create_menu([])
instant='maxqda_docs'
($ "##{instant}").click()
