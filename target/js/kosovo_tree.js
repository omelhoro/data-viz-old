// Generated by CoffeeScript 1.8.0
(function() {
  var makeData, text_hist, text_tree;

  text_tree = "<div> <p>This site about my participance in a research-project at the <a href='http://www.ifsh.de' >ISHF</a> titeled <a href='http://ifsh.de/projekte/dfg-projekte/i'>'Claiming Respect'</a>. I have worked six months on the <strong>Kosovo-Case 1998/1999</strong>, not only the bombings March-Juny 1999 but also the forerun 1998 and the post-war period.</p> <p> The interactive tree-map is about the codes used in the project. I think the main part is about the division between <strong>interpretation and linguistic</strong> phenoma. Primarily the topic is not linguistics but rather politics, so there are more tags in the A-category (Interpretation). The metaphor of a tree (<strong>top-down</strong>) is really nice, because at the top there are major tags like 'Problem' or 'The Reaction' etc. which split up in minor tags like 'Russia is humiliated' or 'We need to defend Yugoslavia'. It should be noted that the there is a <strong>nice abstraction</strong> in the codes that made them applicable -with minor changes- to <strong>other projects</strong> about NATO-Expansion, Syria-Conflict and Ukraine.</p> <p> I've made about <strong>1900 tags</strong> in my six months as student assistant. Although it may sound like much, I think it's a quite <strong>qualitative</strong> number, especially in comparison to my other projects. Now I know <strong>how hard it is</strong> to construct a corpus of maybe one-million words or even 6-million like that of Ruscorpora. So behind the plots there is a LOT of work which I know appreciate much more. </p> </div>";

  d3.json("./static/data/resp_kosovo_tree.json", function(data) {
    var a, chart, d, data1, el, opts;
    el = document.getElementById('chart_div');
    ($(text_tree)).insertBefore($(el));
    chart = new google.visualization.TreeMap(el);
    data1 = [data[0].concat("N")].concat((function() {
      var _i, _len, _ref, _results;
      _ref = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(a.concat(0));
      }
      return _results;
    })());
    d = google.visualization.arrayToDataTable(data1);
    opts = {
      animation: {
        duration: 300
      }
    };
    google.setOnLoadCallback(chart.draw(d, opts));
    d = google.visualization.arrayToDataTable(data);
    return opts = {
      size: "small",
      allowCollapse: true,
      animation: {
        duration: 300
      }
    };
  });

  makeData = function(data) {
    var a, format, v;
    format = function(d) {
      var an, m, n, y, _ref, _ref1, _ref2;
      _ref = d, (_ref1 = _ref[0], y = _ref1[0], m = _ref1[1], d = _ref1[2]), (_ref2 = _ref[1], n = _ref2[0], an = _ref2[1]);
      return [new Date(y, m - 1, d), n, an];
    };
    a = [["Date", "N", "Event"]].concat((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        _results.push(format(v));
      }
      return _results;
    })());
    a.sort(function(e1, e2) {
      return e1[0] - e2[0];
    });
    return google.visualization.arrayToDataTable(a);
  };

  text_hist = "<p>This plot shows how many documents were found in <strong>relation to the time and events</strong> of the Kosovo-Case. Every month is divided in two halves, so 15. of the month means second part. Totally I've collected about <strong>250 documents</strong> from <strong>Duma deputies, ministers, Yelstin and generals</strong> from text-collection of <a href='http://integrumworld.com'>Integrum</a> which is a nice source for qualitative studies.</p>";

  d3.json("./static/data/resp_kosovo_hist.json", function(data) {
    var chart, d, el, opts;
    d = makeData(data);
    el = document.getElementById('chart_div_anno');
    chart = new google.visualization.AnnotationChart(el);
    opts = {
      animation: {
        duration: 500
      },
      displayAnnotations: true,
      displayZoomButtons: false,
      displayRangeSelector: false
    };
    google.setOnLoadCallback(chart.draw(d, opts));
    return ($(text_hist)).insertBefore($(el));
  });

}).call(this);

//# sourceMappingURL=kosovo_tree.js.map
