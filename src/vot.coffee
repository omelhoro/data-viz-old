under=_
class Session
	constructor: (data) ->
		@HE=500
		@WI=500
		@PAD=70
		@update= false
		@chart=""
		@partAr=(k for k,_ of data)
		@txt=""

		###
		@svg=d3.select("div#map").append("svg").attr({
			width: @WI,
			height: @HE
			})
		###
		@y_scale=@x_scale=""
		@subData={}
		@x_axisLabel=@x_axisLabel=""
		@data= data
		#@_draw_axes()
		@color= d3.scale.category10()
		@_makeHandlers()

	_set_scales: () ->

		@x_scale=d3.scale.linear()
			.domain([20,100]).range([@PAD*2,@WI])
		@y_scale=d3.scale.linear()
			.domain([100,20]).range([@PAD*2,@HE])

	_draw_axes: () ->
		x_axis= d3.svg.axis()
			.scale(@x_scale)
			.orient("bottom")
		y_axis= d3.svg.axis()
			.scale(@y_scale)
			.orient("left")

		@x_axisLabel= @svg.append("text")
			.attr({
				x:@WI/2
				y: @HE-@PAD/2
				})
			.text("Dummyx")

		@y_axisLabel= @svg.append("text")
			.attr({
				x:(@PAD/2)
				y: (@HE)/2
				transform: "rotate(270 #{@PAD/2},#{@HE/2})"
				})
			.text("Dummyy")

		@svg.append("g")
			.attr({
				class: "x_axis",
				transform: "translate(-#{@PAD},#{@HE-@PAD})"
				})
			.call(x_axis)

		@svg.append("g")
			.attr({
				class: "y_axis",
				transform: "translate(#{@PAD},-#{@PAD})"
				})
			.call(y_axis)

	_makeSubset: (con="b") ->
		votAr= []
		min= Infinity
		max= -Infinity
		for part,v of @data
			val= v[con]
			votAr.push(val)
			lmax= d3.max(val)
			lmin= d3.min(val)
			max= if lmax > max then lmax else max
			min= if  lmin < min then lmin else min
		{
			min:min
			max:max
			votAr:votAr
		}

	_makeHandlers: () ->
		keys= (k for k,v of @data["113_e"])
		for k in keys
			@subData[k]=@_makeSubset(k)
		options= $("<div id='options'>")
		for k in keys
			cons= $("<input type='radio' name='con' value='#{k}'>#{k}<br>")
			options.append(cons)
		$("#map").append(options)
		$("input[type='radio']").click( (e) =>
			console.log e.target
			#@_makeSubset($(e.target).val())
			subData= @subData[$(e.target).val()]
			@draw(subData)
		)
		$("input[name='con']").first().click()
		@update= true
		okeys= ((vv.length for kk,vv of v) for k,v of @data)
		console.log okeys
		#okeys= under.zip(*okeys)
		console.log okeys
		okeys.push(keys)
		parts= ({sTitle:k} for k,_ of @data )
		#okeys=(ar.push(keys[i]) for ar,i in okeys )
		parts.push({sTitle:"Consonant"})
		#options.append($("<table id='opt'>"))
		#$("#opt").dataTable({
		#	aaData:okeys
		#	aoColumns:parts
		#	})

	draw: (subData) ->
		chart = d3.box()
				.whiskers(iqr(1.5))
				.width(10)
				.height(@HE)
				#.domain([subData["min"],subData["max"]])
				.domain([0.00,0.125])
				.duration(1000)
		if @update
			@chart.data(subData["votAr"]).call(chart)
			@txt.data(subData["votAr"]).text( (d,i) => @partAr[i]+ ": " +d.length)
		else
			@chart=d3.select("#map").selectAll("svg").data(subData["votAr"]).enter()
				.append("svg")
				.attr({
					class: "box"
					title: (d,i) => d.length
					width: (@WI+200)/@partAr.length
					height: @HE
					})
				.append("g")
				.attr({
					transform: "translate(50,10)"
					})
				.call(chart)
			@txt= d3.select("#map").selectAll("svg").data(subData["votAr"])
				.append("text")
				.attr({
					y:10
					x:10
					})
				.text( (d,i) => @partAr[i]+ ": " +d.length)

session= new Session(votBoxplot)


