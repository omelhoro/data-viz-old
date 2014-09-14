d3.json("./static/data/resp_kosovo_tree.json",(data) ->
    chart = new google.visualization.TreeMap(document.getElementById('chart_div'))
    d = google.visualization.arrayToDataTable(data)
    opts={animation:{duration: 300}}
    google.setOnLoadCallback(chart.draw(d,opts))

    chart1 = new google.visualization.OrgChart(document.getElementById('chart_div_org'))
    d = google.visualization.arrayToDataTable(data)
    opts={size:"small",allowCollapse:true,animation:{duration: 300}}
    google.setOnLoadCallback(chart1.draw(d,opts))
)

makeData = (data) ->
    format = (d) ->
        console.log d
        [[y,m,d],[n,an]]=d
        [new Date(y,m-1,d),n,an]
    a=[["Date","N","Event"]].concat((format(v) for v in data))
    a.sort( (e1,e2) -> e1[0] - e2[0])
    google.visualization.arrayToDataTable(a)
    
d3.json("./static/data/resp_kosovo_hist.json", (data) ->
    d=makeData(data)
    console.log d
    chart = new google.visualization.AnnotationChart(document.getElementById('chart_div_anno'))
    opts={
        animation:{duration: 500}
        displayAnnotations:true
        displayZoomButtons:false
        displayRangeSelector: false
    }
    google.setOnLoadCallback(chart.draw(d,opts))
)
