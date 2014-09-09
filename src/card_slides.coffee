$= jQuery
$ ->
	class Session
		constructor: (data) ->
			@data=data
			@present_words()
			@present_pics()

		present_words: ->
			words= (k for k,_ of @data[0] when k!="part")
			wordList= $("<ol></ol>")
			for word in words
				listItem= $("<li class='card_slide' id='#{word}'>#{word}</li>")
				wordList.append(listItem)
			$("#word_list").append(wordList)

		_get_stats: (word) ->
			group11= 0
			group15= 0
			for obj in @data
				if obj["part"].startsWith("112")
					group11+=parseInt(obj[word])
				else
					group15+=parseInt(obj[word])
			{
				group11: Math.floor((group11/18)*100)
				group15:Math.floor((group15/18)*100)
			}	



		present_pics: ->
			onHover= (e) =>
				word=$(e.target).prop("id")
				$("#pic").append($("<img class='word_pic' width=200px height=200px src='data/gallery/#{word}.jpg'>"))
				#$("#pic").append($("<img class='word_pic' width=200px height=200px src='data/gallery/#{word}.png'>"))
				freqWord= @_get_stats(word)
				group11= $("<span class='word_freq' id='freq11'>#{freqWord['group11']}%</span>")
				group15= $("<span class='word_freq' id='freq15'>#{freqWord['group15']}%</span>")
				($("#stats").append(group11)).append(group15)


			outHover= (e) ->
				$(".word_pic").remove()
				$("#stats").children().remove()
			$(".card_slide").hover(onHover,outHover)


	d3.csv("data/card_slides.csv", (data) ->
		session= new Session(data)
		)