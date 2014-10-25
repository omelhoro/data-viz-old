makeParsers= (d) ->
	parsers= {}
	for k,v of d[0]
		parsers[k.trim()] = switch k.trim().slice(-1)
			when "f" then (i) -> Math.round(parseFloat(i)*100)/100
			when "i" then (i) -> parseInt(i)
			when "s" then (s) -> s
			when "b" then (s) -> s
			when "p" then (i) -> Math.round(parseFloat(i)*100)
	parsers

MAPCONTAINER=BIO_RHYTHM

class Session

	constructor: (@data,@bio_data) ->
		@HE=500
		@WI=500
		@PAD=70
		@update=false
		@imp_keys= ["ger_years","notger_years","toksec","task2cor","speechrate","artrate"]
		@imp_keys_exp=@imp_keys.concat(["meanC","meanV"])
		@svg=d3.select(MAPCONTAINER).append("svg").attr({
			width: @WI,
			height: @HE
			})
		@y_scale=@x_scale=""
		@subData=@subPaths=""
		@x_axisLabel=@x_axisLabel=""
		@_set_scales()
		#@_draw_axes()
		@color= d3.scale.category10()
		#@_draw_axes()
		@_makeHandlers()

	_set_scales: (xmin=25,xmax=100,xlabel,ymin=25,ymax=100,ylabel) ->
		if xlabel not in @imp_keys_exp
			xmin= 25
			xmax= 100
		@x_scale=d3.scale.linear()
			.domain([xmin,xmax]).range([@PAD*1,@WI-@PAD])

		if ylabel not in @imp_keys_exp
			ymin= 25
			ymax= 100
		
		@y_scale=d3.scale.linear()
			.domain([ymax,ymin]).range([@PAD,@HE-@PAD])

	_draw_axes: ->
		x_axis= d3.svg.axis()
			.scale(@x_scale)
			.orient("bottom")
		y_axis= d3.svg.axis()
			.scale(@y_scale)
			.orient("left")
		if @update
			@svg.selectAll(".x_axis").transition().duration(500).call(x_axis)
			@svg.select(".y_axis").call(y_axis)

		else
			@x_axisLabel= @svg.append("text")
				.attr({
					class: "xlabel"
					x:@WI/2
					y: @HE-@PAD/2
					})
				#.text("Dummyx")

			@y_axisLabel= @svg.append("text")
				.attr({
					class: "ylabel"
					x:(@PAD/2)
					y: (@HE)/2
					transform: "rotate(270 #{@PAD/2},#{@HE/2})"
					})
				#.text("Dummyy")

			@svg.append("g")
				.attr({
					class: "x_axis",
					transform: "translate(0,#{@HE-@PAD})"
					})
				.call(x_axis)

			@svg.append("g")
				.attr({
					class: "y_axis",
					transform: "translate(#{@PAD},0)"
					})
				.call(y_axis)

	_makeSubset: ->
		ylabel= $("input[name=y_axis]:checked").val()#.filter( -> $(@).is(":checked"))
		xlabel= $("input[name=x_axis]:checked").val()#.filter( -> $(@).is(":checked"))
		valAr= []
		pathAr= []
		#@y_axisLabel.text(ylabel)
		#@x_axisLabel.text(xlabel)
		d3.select(".xlabel").text(xlabel)
		d3.select(".ylabel").text(ylabel)
		for k,v of @data
			pathPerAr= [k]
			for st_end,vv of v
				perAr= [vv[xlabel],vv[ylabel],st_end,k]
				valAr.push(perAr)
				pathPerAr.push([perAr[0],perAr[1]])
			pathAr.push(pathPerAr)
			ymax=d3.max(valAr, (d) -> d[1])
			ymin=d3.min(valAr, (d) -> d[1])
			xmin=d3.min(valAr, (d) -> d[0])
			xmax=d3.max(valAr, (d) -> d[0])
		@_set_scales(xmin,xmax,xlabel,ymin,ymax,ylabel)
		@_draw_axes()
		@subData=valAr
		@subPaths=pathAr
		@draw()

	draw: () ->
		#@_draw_axes()
		circles= @svg.selectAll("circle").data(@subData)
		if not @update
			circles= circles.enter().append("circle")
		circles.transition().duration(1000).attr({
			class: (d,i) -> "circle",
			cy: (d,i) => @y_scale(d[1]),
			cx: (d,i) => @x_scale(d[0]),
			r: 4,
			title: (d,i) -> d[3]
			fill: (d,i) => @color(d[2])
			})
		@svg.selectAll(".pathStEnd").remove()
		@svg.selectAll("pathStEnd").data(@subPaths)
			.enter().append("path").attr({
				class: "pathStEnd"
				d: (d,i) =>
					m= "M #{@x_scale(d[1][0])} #{@y_scale(d[1][1])} "
					l= " L #{@x_scale(d[2][0])} #{@y_scale(d[2][1])} Z"
					m+l
				stroke: (d,i) ->
					if d[0].startsWith("112")
						"blue"
					else
						"red" 

				strokeWidth:2
				})

	_addBioData: ->
		ps=makeParsers(@bio_data)
		partsData= (key for key,_ of @data)
		for obj in @bio_data
			part= obj["index_i"]+"_k"
			if part in partsData
				for k,v of obj
					fp=ps[k]
					knm=k.slice(0,-2)
					if knm in @imp_keys
						@data[part]["start"][knm]=fp(v)
						@data[part]["end"][knm]=fp(v)

	_makeHandlers: () ->
		@_addBioData()
		keys= (k for k,v of @data["112199_k"]["start"] when k not in @imp_keys_exp)
		keys= keys.sort()
		options= $("<div id='options'>")
		axesTabs= $("<table>")
		tabHeader= $("<tr><td>X-Axis</td><td>Cat</td><td>Y-Axis</td></tr>")
		axesTabs.append(tabHeader)
		#optionsDivY=$("<div class='axis' id='y_axis'>Y Axis</div>")
		#optionsDivX=$("<div class='axis' id='x_axis'>X Axis</div>")
		#append main rhythm metrics
		axesTabs.append($("<tr><td>Rhythm</td></tr>"))
		for k in keys
			yaxis= $("<td><input type='radio' name='y_axis' value='#{k}'></td>")
			xaxis= $("<td><input type='radio' name='x_axis' value='#{k}'></td>")
			clss= k.slice(-1)+"phon"
			cat= $("<td class='#{clss}'>#{k}</td>")
			catRow=$("<tr>").append(xaxis).append(cat).append(yaxis)
			axesTabs.append(catRow)
		axesTabs.append($("<tr><td>Peripher</td></tr>"))
		for k in @imp_keys_exp
			yaxis= $("<td><input type='radio' name='y_axis' value='#{k}'></td>")
			xaxis= $("<td><input type='radio' name='x_axis' value='#{k}'></td>")
			clss= k.slice(-1)+"phon"
			cat= $("<td class='#{clss}'>#{k}</td>")
			catRow=$("<tr>").append(xaxis).append(cat).append(yaxis)
			axesTabs.append(catRow)
		#bio_keys= (@bio_data[0])
		$(MAPCONTAINER).append(options.append(axesTabs))
		$("input[name=y_axis]").last().click()
		$("input[type='radio']").change( (e) =>
			@_makeSubset()
			)
		$("input[name=x_axis]").last().click()
		@update=true


d3.json("./static/data/lima/lima_rhythm_single.json",(rhythm_data) ->
	d3.csv("./static/data/lima/lima_bio.csv", (bio_data)=>
		session= new Session(rhythm_data,bio_data)))
