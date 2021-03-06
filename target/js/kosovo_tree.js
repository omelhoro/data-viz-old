// Generated by CoffeeScript 1.8.0
(function() {
  var hist_draw, makeData, tree_draw;

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

  tree_draw = function(data) {
    var a, chart, d, data1, el, opts;
    el = document.getElementById('chart-tags-tree');
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
  };

  hist_draw = function(data) {
    var chart, d, el, opts;
    d = makeData(data);
    el = document.getElementById('chart-doc-hist');
    chart = new google.visualization.AnnotationChart(el);
    opts = {
      animation: {
        duration: 500
      },
      displayAnnotations: true,
      displayZoomButtons: false,
      displayRangeSelector: false
    };
    return google.setOnLoadCallback(chart.draw(d, opts));
  };

  d3.json("./static/public_data/claiming_respect.json", function(data) {
    tree_draw(data["kosovo_freq"]);
    return hist_draw(data["kosovo_hist"]);
  });

}).call(this);

//# sourceMappingURL=kosovo_tree.js.map
