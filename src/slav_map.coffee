$= jQuery
$ -> 
	class SvgView

		constructor: (@data) ->
			@HE=500
			@WI=500
			@svg= d3.select("#map").append("svg").attr({
				width:@WI
				height:@HE

				})
			@draw_map()


		draw_map: ->
			projection= 
				d3.geo
				.mercator()
				#.conicConformal()
				.center([43.46189,53.503417])
				.scale([499])
			    #.scale((@WI + 1) / 2 / Math.PI)
			    #.translate([@WI / 2.5, @HE / 2.5])
			path= d3.geo.path().projection(projection)
			@svg.selectAll("path")
				.data(@data["features"])
				.enter()
				.append("path")
				.attr({
					"d":path
					fill: "white"
					"stroke": "blue"
					})
			console.log projection([33.46189,53.503417]),projection([53.503417,33.46189])
			d3.csv("data/slav_map.csv", (d) =>
				@svg.selectAll("circle").data(d)
					.enter()
					.append("circle")
					.attr({
						title: (d) -> d["place"]
						cx: (d) -> 
							c= projection([d["lon"],d["lat"]])
							c[0]
						cy: (d) -> 
							c= projection([d["lon"],d["lat"]])
							c[1]
						fill: (d) -> switch d["person"]
										when "Dummy" then "blue"
										else "yellow"
						r: 5
						})

			 )





	d3.json("data/world.geojson" , (d) ->
		svg= new SvgView(d)
		)