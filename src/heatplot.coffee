class Matrix
    constructor: (@data,@dataXraw,@dataYraw,@isInt=true) ->
        @xTags=@yTags=@matrix=null
        @prepareMatrix()
        @catsOfY=@catsOfX=@curCatY=@curCatX=@dataY=@dataX=null
        @prepareSecD()

    prepareMatrix: ->
        fnParseIntAr= (a) ->
            (parseInt(d) for d in a)
        fnParseFloatAr= (a) ->
            (parseFloat(d) for d in a)

        parser= if @isInt then fnParseIntAr else fnParseFloatAr
        @xTags= @data[0][1..]
        @matrix= ([o[0],parser(o[1..])] for o in @data[1..])
        @yTags=  (o[0] for o in @matrix)
        [@xTags,@matrix,@yTags]

    prepareSecD: ->
        makeParsers= (d) ->
            parsers= {}
            for k,v of d[0]
                nm= k.trim().split("_")
                parsers[k.trim()] = switch _.last(nm)
                    when "f" then (i) -> Math.round(parseFloat(i)*100)/100
                    when "i" then (i) -> parseInt(i)
                    when "s" then (s) -> s
                    when "b" then (s) -> s
                    when "p" then (i) -> Math.round(parseFloat(i)*100)
            parsers
        remap= (d) ->
            nd= {}
            parsers= makeParsers(d)
            catsOf= _.keys(parsers)[1..]
            for obj in d
                ixnm= _.first(_.keys(obj))
                nm= obj[ixnm]
                nd[nm]= {}
                for k in catsOf
                    nd[nm][k]=parsers[k](obj[k])
            [nd,catsOf]

        [@dataX,@catsOfX]=remap(@dataXraw)
        @pickRandCat("x")

        [@dataY,@catsOfY]=remap(@dataYraw)
        @pickRandCat("y")

    pickRandCat: (dim) ->
        if dim=="y"
            @curCatY= _.sample(@catsOfY)
        else
            @curCatX= _.sample(@catsOfX)

    setCurCat: (dim,val) ->
        if dim=="y"
            @curCatY= val
        else
            @curCatX= val

    sortVert: ->
        cat=@curCatY
        @matrix.sort (a,b) => @dataY[a[0]][cat] < @dataY[b[0]][cat]
        @yTags=  (o[0] for o in @matrix)

    sortHori: (cat='speed') ->
        cat=@curCatX

        transposeToM= (i,m) ->
            (a[1][i] for a in m)

        transposedMatrix= ([e,transposeToM(i,@matrix)] for e,i in @xTags)
        transposedMatrix.sort (a,b) =>
            @dataX[a[0]][cat] < @dataX[b[0]][cat]

        @xTags=  (o[0] for o in transposedMatrix)
        @matrix= ([e,transposeToM(i,transposedMatrix)] for e,i in @yTags)

class HeatView
    constructor: (@tm,@HE,@WI,@MA)->
        [@svg,@body,@axes]=@_renderSvgBodyAxes()
        [@x_scale,@y_scale]=@_set_scales()
        @update=false

    _renderSvgBodyAxes: ->
        svg= d3.select(MAPCONTAINER)
            .append("svg")
                .attr {
                    height:@HE
                    width:@WI
                }
        svg.append("g").attr {
            class: "main"
            transform: "translate(#{@MA},#{@MA})"
        }
        body= d3.select("g.main")
                .append("g")
                    .attr {
                        class: "body"
                        transform: "translate(#{@MA},#{@MA})"
                    }
        axes= d3.select("g.main")
                .append("g")
                    .attr("class","axes")
        [svg,body,axes]


    _make_axes: ->
        fnAxis= (scale,fnGet,orient) ->
            d3.svg.axis().scale(scale).tickFormat( (d,i) -> fnGet(i) ).orient(orient)

        y_axis= fnAxis(@y_scale,((i) => @tm.yTags[i]),"left")
        y_axisSec= fnAxis(@y_scale,((i) =>
                res= @tm.dataY[@tm.yTags[i]][@tm.curCatY]),"left")
        x_axis= fnAxis(@x_scale,((i) => @tm.xTags[i]),"top")
        x_axisSec= fnAxis(@x_scale,((i) =>
            res= @tm.dataX[@tm.xTags[i]][@tm.curCatX]),"top")
        @render_axis(y_axis,"y",@MA,@MA,@y_scale,y_axisSec)
        @render_axis(x_axis,"x",@MA,@MA,@x_scale,x_axisSec)
        [x_axis,y_axis]

    _set_scales: () ->
        bodyPos= @body[0][0].getCTM()
        transformedX= bodyPos.e #gets offset coordinates of body for right domain
        transformedY= bodyPos.f

        @y_scale=d3.scale.ordinal()
            .domain(d3.range(@tm.yTags.length)).rangeRoundBands([0, @HE-transformedY], 0.15)
        @x_scale=d3.scale.ordinal()
            .domain(d3.range(@tm.xTags.length)).rangeRoundBands([0, @WI-transformedX], 0.15)
        [@x_scale,@y_scale]

    render_axis: (axis,dim,trans0,trans1,scale,sec) ->
        fontSize= scale.rangeBand()
        if @update
            ax= @axes.select(".#{dim}axis").call(axis)
        else
            ax= @axes.append("g")
            .attr {
                class: "#{dim}axis",
                transform: "translate(#{trans0},#{trans1})"
                }
            .call(axis)
        ax.selectAll("text").attr("font-size",fontSize)
        if dim=="x"
            ax.selectAll("text").attr {
                    transform: "rotate(45)"
                    style: "text-anchor:end"
                    dy: "1em"
                    }

        coords= if dim=="y" then [trans0-@MA,trans1] else [trans0,trans1-@MA]

        if @update
            ax= @axes.select(".#{dim}axisSec").call(sec)
        else
            ax= @axes.append("g")
            .attr {
                class: "#{dim}axisSec",
                transform: "translate(#{coords[0]},#{coords[1]})"
                }
            .call(sec)
        ax.selectAll("text").attr("font-size",fontSize)
        if dim=="x"
            ax.selectAll("text").attr {
                    transform: "rotate(45)"
                    style: "text-anchor:end"
                    dy: "1em"
                    }
        headers= if dim=="y" then [@tm.curCatY,
            0,
            -10] else [@tm.curCatX, ax[0][0].getBBox().width/2,-30]

        ax.select(".#{dim}Title").remove()

        isInSvg = (h) ->
            bBoxX= h[0][0].getBBox().x
            transMX= h[0][0].getCTM().e
            Math.abs(bBoxX) < transMX

        renderHeader= (fSize,x=2) ->
            header= ax.append("text").attr {
                class: "#{dim}Title"
                x: headers[1]
                y: headers[2]
                "font-size":fSize*x
                style: "text-anchor:middle"
                "text-decoration":"underline"
            }
            .text(headers[0])
            isGood= isInSvg(header)
            if isGood or x<0.5 or dim=="x"
                header
            else
                header.remove()
                renderHeader(fSize,x-0.1)
        header= renderHeader(fontSize,2)

    _renderData: ->
        brew= ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
        for r,i in @tm.matrix
            r= r[1]
            colorscale= d3.scale.ordinal()
                .domain(0,d3.max(r))
                .range(brew)

            colorscale(1) #dont know it doesnt work without this (non sense) call
            if @update
                @body.selectAll(".row_#{i}")
                    .data(r)
                    .transition().duration(1000)
                    .attr {
                            fill: (d,j) -> colorscale(d)

                    }
                ###
                .style "stroke", (d,j) =>
                    if @tm.yTags[i]=="112199" or @tm.xTags[j]=="rjukzak"
                        "red"
                ###
            else
                @body.selectAll(".row_#{i}")
                    .data(r)
                    .enter()
                    .append("rect").attr {
                    class: "row_#{i}"
                    x: (d,j) => @x_scale(j)
                    y: (d,j) => @y_scale(i)
                    width: @x_scale.rangeBand()
                    height: @y_scale.rangeBand()
                    fill: (d,j) -> colorscale(d)
                    }

    render: ->
        @_make_axes()
        @_renderData()
        @update=true

class Handler
    constructor: (@tm,@mv) ->
        # @setButtons()
        @renderAxisCats()
    
    renderAxisCats: (tm=@tm,mv=@mv) ->
        filter= (itm)->
            itm.indexOf("Log")==-1
        addList= (dim,catn,cat) ->
            eul=($ "<ul class='cats-list list-group #{catn}'>#{catn}</ul>")
            for c in (c for c  in cat when filter(c))
                # lab=($ "<label><input type='radio' name='#{catn}'/>#{c}</label>" )
                eli=($ "<li class='' data-filter='#{c}'><label><input type='radio'value='#{c}' name='#{catn}'/>#{c}</label></li>")
                eul.append(eli)
            eul.click( (e)->
                trg=($ e.target )
                tm.setCurCat(dim,trg.val())
                if dim=="y" then tm.sortVert() else tm.sortHori()
                mv.render()
            )
            ($ "#choices" ).prepend(eul)
            
        catsX=@tm.catsOfX
        catsY=@tm.catsOfY
        addList("x","X-Axis",catsX)
        addList("y","Y-Axis",catsY)

    setSecAxis: (tag)->
        [dim,i]=tag.split("_")
        [cats,sortDir]= if dim=="y" then [@tm.catsOfY,@tm.sortVert] else [@tm.catsOfX,@tm.sortHori]
        cat= cats[parseInt(i)]
        @tm.setCurCat(dim,cat)
        @update(dim)

dataY= (callback) -> d3.csv("./static/data/lima/lima_bio.csv",callback)

dataMain= (dataSecY) ->
    d3.csv "./static/data/lima/wordfreq_t2.csv", (dataSecX) ->
        d3.text "./static/data/lima/card_slides.csv", (data) ->
            data= d3.csv.parseRows(data)
            matrix= new Matrix(data,dataSecX,dataSecY)
            view= new HeatView(matrix,500,700,50)
            handler= new Handler(matrix,view)
            view.render()
            # handler.setButtons()

dataY(dataMain)
