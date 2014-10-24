makeData = (data) ->
    format = (d) ->
        [[y,m,d],[n,an]]=d
        [new Date(y,m-1,d),n,an]
    a=[["Date","N","Event"]].concat((format(v) for v in data))
    a.sort( (e1,e2) -> e1[0] - e2[0])
    google.visualization.arrayToDataTable(a)

tree_draw= (data)->
    el=document.getElementById('chart-tags-tree')
    chart = new google.visualization.TreeMap(el)
    data1=[data[0].concat("N")].concat((a.concat(0) for a in data.slice(1)))
    d = google.visualization.arrayToDataTable(data1)
    opts={animation:{duration: 300}}
    google.setOnLoadCallback(chart.draw(d,opts))
    d = google.visualization.arrayToDataTable(data)
    opts={size:"small",allowCollapse:true,animation:{duration: 300}}

hist_draw = (data) ->
    d=makeData(data)
    el=document.getElementById('chart-doc-hist')
    chart = new google.visualization.AnnotationChart(el)
    opts={
        animation:{duration: 500}
        displayAnnotations:true
        displayZoomButtons:false
        displayRangeSelector: false
    }
    google.setOnLoadCallback(chart.draw(d,opts))

d3.json("./static/public_data/claiming_respect.json",(data) ->
    tree_draw(data["kosovo_freq"])
    hist_draw(data["kosovo_hist"])
)
