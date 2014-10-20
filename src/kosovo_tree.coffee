text_tree="<div>
    <p>This site about my participance in a research-project at the <a href='http://www.ifsh.de' >IFSH</a> entiteled <a href='http://www.ifsh.de/projekte/dfg-projekte/'>'Claiming Respect'</a> supported by the DFG. 
    The project tries to identify emotional markers in official Russian political speech that refers to Russian relations with the West.
    </p><p>
    I have worked on one the six cases, namely the <strong>Kosovo-Case 1998/1999</strong>, not only the bombings March-Juny 1999 but also the forerun 1998 and the post-war period.</p>
    <p>
The interactive tree-map is about the codes used in the project. I think the main part is about the division between <strong>interpretation and linguistic</strong> phenoma. Primarily the topic is not linguistics but rather politics, so there are more tags in the A-category (Interpretation). The metaphor of a tree (<strong>top-down</strong>) is really nice, because at the top there are major tags like 'Problem' or 'The Reaction' etc. which split up in minor tags like 'Russia is humiliated' or 'We need to defend Yugoslavia'. It should be noted that the there is a <strong>nice abstraction</strong> in the codes that made them applicable -with minor changes- to <strong>other cases</strong> about NATO-Expansion, Syria-Conflict and Ukraine.</p>
<p>
I've made about <strong>1900 tags</strong> in my six months as student assistant. Although it sounds much, I think, the number is limited compared to quantitative analyses. Now I know <strong>how hard it is</strong> to construct a corpus of maybe one-million words or even 6-million like that of Ruscorpora. So behind the plots there is a LOT of work which I know appreciate much more.
</p>
</div>"

makeData = (data) ->
    format = (d) ->
        [[y,m,d],[n,an]]=d
        [new Date(y,m-1,d),n,an]
    a=[["Date","N","Event"]].concat((format(v) for v in data))
    a.sort( (e1,e2) -> e1[0] - e2[0])
    google.visualization.arrayToDataTable(a)

text_hist="<p>This plot shows how many documents were found in <strong>relation to the time and events</strong> of the Kosovo case. The timeline shows the years '98 and '99 by a step of half a month. Totally I've collected about <strong>250 documents</strong> from <strong>Duma deputies, ministers,president Yelstin and generals</strong> from a text-database <a href='http://integrumworld.com'>Integrum</a> which is a nice source for qualitative studies.</p>"

tree_draw= (data)->
    el=document.getElementById('chart_div')
    ($ text_tree).insertBefore($ el)
    chart = new google.visualization.TreeMap(el)
    data1=[data[0].concat("N")].concat((a.concat(0) for a in data.slice(1)))
    d = google.visualization.arrayToDataTable(data1)
    opts={animation:{duration: 300}}
    google.setOnLoadCallback(chart.draw(d,opts))
    d = google.visualization.arrayToDataTable(data)
    opts={size:"small",allowCollapse:true,animation:{duration: 300}}

hist_draw = (data) ->
    d=makeData(data)
    el=document.getElementById('chart_div_anno')
    chart = new google.visualization.AnnotationChart(el)
    opts={
        animation:{duration: 500}
        displayAnnotations:true
        displayZoomButtons:false
        displayRangeSelector: false
    }
    google.setOnLoadCallback(chart.draw(d,opts))
    ($ text_hist).insertBefore($ el)

d3.json("./static/public_data/claiming_respect.json",(data) ->
    tree_draw(data["kosovo_freq"])
    hist_draw(data["kosovo_hist"])
)
