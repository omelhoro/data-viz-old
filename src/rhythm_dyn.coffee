rhythmMetric =  (r) ->
    [r.mean()*1000,r.dev()*1000,r.varco(),r.npvi()*100,r.rpvi()*1000]

stats = (a1,a2)->
    r={}
    sum = (a) -> a.reduce(((l,e) -> l+e),0)
    alen=a1.length
    r['mean'] = ->
        if not r._mean?
            r['_mean']=a1.reduce(((a,e) -> a+e),0)/alen
        r['_mean']
    r['dev'] = ->
        if not r._dev?
            m=r.mean()
            pow=(Math.pow(v-m,2) for v in a1)
            mid=sum(pow)/(alen - 1)
            r['_dev']=Math.sqrt(mid)
        r['_dev']
    r['varco'] = -> (r.dev() *100)/r.mean()
    r['npvi'] = ->
        if not r._npvi?
            calc = (e1,e2) ->
                Math.abs(e1-e2)/((e1+e2)/2)
            r['_npvi']=sum((calc(e, a1[i+1]) for e,i in a1.slice(0,-1)))/(alen - 1)
        r['_npvi']
    r['rpvi'] = ->
        if not r._rpvi?
            r['_rpvi']=sum((Math.abs(e - a1[i+1]) for e,i in a1.slice(0,-1)))/(alen - 1)
        r['_rpvi']
    r

r=stats([1..5])
console.log [r.mean(),r.dev(),r.varco(),r.npvi(),r.rpvi()]

lineChart= (a,r=5) ->
    range=(x for x in [0..a.length] by r)
    pairs_a=d3.pairs(range)
    r=([i].concat(rhythmMetric(stats(a.slice(e[0],e[1])))) for e,i in pairs_a)
    h=['bin','mean','dev','varco','npvi','rpvi']
    data=google.visualization.arrayToDataTable([h].concat(r))
    data

getArray = (i,isVow,data)->
    k=Object.keys(data)[i]
    if isVow
        a= data[k].v
    else
        a= data[k].c
    [k,a]

update_chart = (chart,data,opts) ->
    i=1
    isVow=true
    ($ ".inter-chart").click (e) ->
        t=e.target
        id= $(t).prop("id")
        if id=="next-part"
            i++
        else
            isVow=not isVow
        [k,a]=getArray(i,isVow,data)
        d=lineChart(a)
        opts.title=k
        chart.draw(d,opts)

d3.json("./static/data/lima_rhythm_single_raw.json", (data) ->
    [k,a]=getArray(0,true,data)
    d=lineChart(a)
    chart = new google.visualization.LineChart(document.getElementById('chart_div'))
    opts={title:k,vAxis: {maxValue:150},animation:{duration: 500}}
    google.setOnLoadCallback(chart.draw(d,opts))
    update_chart(chart,data,opts)
)
