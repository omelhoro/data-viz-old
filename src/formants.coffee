class Session

    constructor: (data) ->
        @HE=500
        @WI=600
        @PAD=70
        @svg=d3.select(MAPCONTAINER).append("svg").attr({
            width: @WI,
            height: @HE
            })
        @data= data
        @_makeHandlers()
        @color= d3.scale.category10()
        @y_scale=@x_scale=""
        @_set_scales()
        #@draw()
        @_draw_axes()

    _set_scales: () ->
        @x_scale=d3.scale.linear()
            .domain([3000,0]).range([@PAD*2,@WI])
        @y_scale=d3.scale.linear()
            .domain([0,1500]).range([@PAD,@HE])

    _draw_axes: () ->
        x_axis= d3.svg.axis()
            .scale(@x_scale)
            .orient("top")
        y_axis= d3.svg.axis()
            .scale(@y_scale)
            .orient("right")

        x_axisLabel= @svg.append("text")
            .attr({
                x:(@WI-@PAD)/2
                y: @PAD/2
                })
            .text("F2")

        x_axisLabel= @svg.append("text")
            .attr({
                x:(@WI-@PAD/2)
                y: (@HE+@PAD)/2
                })
            .text("F1")

        @svg.append("g")
            .attr({
                class: "x_axis",
                transform: "translate(-#{@PAD},#{@PAD})"
                })
            .call(x_axis)

        @svg.append("g")
            .attr({
                class: "y_axis",
                transform: "translate(#{@WI-@PAD},0)"
                })
            .call(y_axis)

    _makeHandlers: () ->
        keys= (k for k,_ of @data)
        keysDiv= $("<div id='options'></div>")
        inputsRadio= [] 
        for k in keys
            input= $("<label><input name='parts' type='radio' value='#{k}'>#{k}</label><br>")
            inputsRadio.push(input)
            keysDiv.append(input)
        $(MAPCONTAINER).append(keysDiv)
        $("input[name='parts']").click( (e) =>
            nm= $(e.target).val()
            @draw(nm)
            )

    draw: (part= "112198_ru_07_k") ->
        dataArr= @data[part]
        @svg.selectAll(".textv").remove()
        circles= @svg.selectAll("text").data(dataArr)
        circles.enter().append("text").attr({
            class: (d,i) -> "textv",
            y: (d,i) => @y_scale(d[0]),
            x: (d,i) => @x_scale(d[1]),
            #r: 4,
            title: (d,i) -> d[3]
            fill: (d,i) => @color(d[3])
            }).text( (d,i) -> d[3].replace("v",""))

d3.json("./static/data/lima_formants_single.json", (data) ->
    session= new Session(data)
    $("input").first().click())
