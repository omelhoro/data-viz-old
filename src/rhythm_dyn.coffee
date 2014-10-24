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

lineChart= (a,r=4) ->
    range=(x for x in [0..a.length] by r)
    pairs_a=d3.pairs(range)
    r=([i].concat(rhythmMetric(stats(a.slice(e[0],e[1])))) for e,i in pairs_a)
    h=['bin','mean','dev','varco','npvi','rpvi']
    data=google.visualization.arrayToDataTable([h].concat(r))
    data

getArray = (i,isVow,data)->
    k=Object.keys(data)[i]
    if isVow
        a= [data[k].start.v,data[k].end.v]
    else
        a= [data[k].start.c,data[k].end.c]
    [k,a]

update_chart = (charts,data,opts) ->
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
        [s,e]=calc_start_end(a)
        opts.title=k
        charts[0].draw(s,opts)
        charts[1].draw(e,opts)

calc_start_end = (d) ->
    [lineChart(d[0]),lineChart(d[1])]

update_opts= (o,n,v) ->
    o[n]=v
    o

d3.json("./static/data/lima/lima_rhythm_single_raw.json", (data) ->
    [k,a]=getArray(0,true,data)
    [startd,endd]=calc_start_end(a)
    chartStart = new google.visualization.LineChart(document.getElementById('chart_div'))
    chartEnd = new google.visualization.LineChart(document.getElementById('chart_div_end'))
    opts={title:k,vAxis: {maxValue:150},animation:{duration: 500}}
    google.setOnLoadCallback(chartStart.draw(startd,update_opts(opts,"title","Start")))
    google.setOnLoadCallback(chartEnd.draw(endd,update_opts(opts,"title","End")))
    update_chart([chartStart,chartEnd],data,opts)
)
