$= jQuery
$ ->
	class TableView

		constructor: (@data, @biodata)->
			@append_bio()
			@make_table()
			$("input").last().click()

		make_table: ->
			t= $("<table id='myTable' class='tablesorter'>") 
			for r,i in @data
				tr= $("<tr>")
				for v,j in r
					tag= if i==0 then "<th>" else "<td>"
					dt= switch v
							when "1" 
								$(tag).prop("class","cards known")
							when "0" then $(tag).prop("class","cards unknown")
							when "  " then $(tag).prop("class","cards unknown")
							else  $(tag).prop("class","parts #{r[0]}i#{j}").text(v)
					tr.append(dt)
				if i==0
					tr= $("<thead>").append(tr)
				t.append(tr)
			$("#map").append(t)

		insert_bio: (colm,cat) ->
			for part in @biodata
				searchKey= part["ID"]+"i"+colm

				val= part[cat]
				console.log $('.'+searchKey),searchKey
				$('.'+searchKey).text(val)
				$("#myTable").tablesorter()


		append_bio: ->
			for k,v of @biodata[0]
				ktext= "<input type='radio' name='card_sort' value='#{k}'>#{k}<br>" 
				$("#map").append(ktext)

			$("input[name='card_sort']").change( (e) =>
				console.log "goio"
				cat= $(e.target).val()
				@insert_bio(1,cat)
				)
			console.log @biodata

	
	class Session

		constructor: (@data,@biodata) ->
			@make_rows()


		make_rows: ->
			d_ar= []
			words= (k.slice(0,3) for k,_ of @data[0] when k!="part")
			words.unshift("Part","Sort1","Sort2")
			d_ar.push(words)
			for p in @data
				ar= (v for _,v of p)
				ar.splice(1,0,Math.floor(Math.random()*ar.length),Math.floor(Math.random()*ar.length))
				d_ar.push(ar)
			table= new TableView(d_ar,@biodata)
			console.log $("#myTable") 
			$("#myTable").tablesorter()


	d3.csv("data/card_slides.csv", (data) ->
		d3.csv("data/lima_bio.csv", (biodata) ->
			session= new Session(data,biodata)
		 )
		)