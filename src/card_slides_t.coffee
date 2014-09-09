$= jQuery
$ ->
	class SvgView

		constructor: (@data)->
			@HE=500
			@WI=500
			@PAD=50
			@svg=d3.select("#map").append("svg").attr({
				width:@WI
				height:@HE
				})
			@y_scale=@x_scale=0
			@draw_map()

		_make_axes: ->
			y_axis=d3.svg.axis()
				.scale(@y_scale)
				.tickFormat( (d,i) => 
					@data[i][0]
				)
				.orient("left")

			x_axis=d3.svg.axis()
				.scale(@x_scale)
				.tickFormat( (d,i) =>
					@data[0][i+1]
					)
				.orient("top")
			return [x_axis,y_axis]
			
		_add_axes: (data=@data,update=false) ->
			[x_axis,y_axis]=@_make_axes(data)
			@svg.append("g")
			.attr({
				class: "xaxis",
				transform: "translate(0,#{@PAD})"
				})
			.call(x_axis)
			.selectAll("text")
			.attr({
					"font-size": @x_scale.rangeBand()
					transform: "rotate(90)"
					style: "text-anchor:end"
					class:"word"
					dy: "1em"
					})

			
			@svg.append("g")
				.attr({
					class: "yaxis"
					transform: "translate( #{@PAD},0)"
					})
				.call(y_axis)
				.selectAll("text")
				.attr({
						"font-size": @y_scale.rangeBand()
						class:"word"
						dy: "-1em"
						})

		_set_scales: () ->
			@y_scale=d3.scale.ordinal()
				.domain(d3.range(@data.length)).rangeRoundBands([0+@PAD, @HE], 0.15)
			@x_scale=d3.scale.ordinal()
				.domain(d3.range(@data[1].length-1)).rangeRoundBands([0+@PAD, @WI], 0.15)
			[@x_scale,@y_scale]

		draw_map: ->
			@_set_scales()
			@_add_axes()

			for r,i in @data.splice(1)#.slice(1,4)
				@svg.selectAll(".er#{i}").data(r.splice(1)).enter().append("rect").attr({
					class: "er"+i
					x: (d,ii) => @x_scale(ii) 
					y: (d,ii) => @y_scale(i)
					width: @x_scale.rangeBand()
					height: @y_scale.rangeBand()
					fill: (d,ii) -> 
									switch d
										when "1" then "green"
										when "0" then "red"
										else "yellow"
					})

	class TableView

		#constructor: (@data)->

		@make_table: (data) ->
			t= $("<table>") 
			for r,i in data
				tr= $("<tr>")
				for d in r
					dt= switch d
							when "1" 
								$("<td>").prop("class","cards known")
							when "0" then $("<td>").prop("class","cards unknown")
							when "  " then $("<td>").prop("class","cards unknown")
							else  $("<td>").prop("class","parts").text(d)
					tr.append(dt)
				t.append(tr)
			$("#map").append(t)

	class Session

		constructor: (@data) ->
			@make_rows()


		make_rows: ->
			d_ar= []
			words= (k for k,_ of @data[0] when k!="part")
			words.unshift("")
			d_ar.push(words)
			for p in @data
				d_ar.push((v for _,v of p))
			#TableView.make_table(d_ar)
			svg= new SvgView(d_ar) 


	d3.csv("data/card_slides.csv", (data) ->
		session= new Session(data)
		)