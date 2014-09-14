// Generated by CoffeeScript 1.8.0
(function() {
  var $;

  $ = jQuery;

  $(function() {
    var Session, SvgView, TableView;
    SvgView = (function() {
      function SvgView(data) {
        this.data = data;
        this.HE = 500;
        this.WI = 500;
        this.PAD = 50;
        this.svg = d3.select("#map").append("svg").attr({
          width: this.WI,
          height: this.HE
        });
        this.y_scale = this.x_scale = 0;
        this.draw_map();
      }

      SvgView.prototype._make_axes = function() {
        var x_axis, y_axis;
        y_axis = d3.svg.axis().scale(this.y_scale).tickFormat((function(_this) {
          return function(d, i) {
            return _this.data[i][0];
          };
        })(this)).orient("left");
        x_axis = d3.svg.axis().scale(this.x_scale).tickFormat((function(_this) {
          return function(d, i) {
            return _this.data[0][i + 1];
          };
        })(this)).orient("top");
        return [x_axis, y_axis];
      };

      SvgView.prototype._add_axes = function(data, update) {
        var x_axis, y_axis, _ref;
        if (data == null) {
          data = this.data;
        }
        if (update == null) {
          update = false;
        }
        _ref = this._make_axes(data), x_axis = _ref[0], y_axis = _ref[1];
        this.svg.append("g").attr({
          "class": "xaxis",
          transform: "translate(0," + this.PAD + ")"
        }).call(x_axis).selectAll("text").attr({
          "font-size": this.x_scale.rangeBand(),
          transform: "rotate(90)",
          style: "text-anchor:end",
          "class": "word",
          dy: "1em"
        });
        return this.svg.append("g").attr({
          "class": "yaxis",
          transform: "translate( " + this.PAD + ",0)"
        }).call(y_axis).selectAll("text").attr({
          "font-size": this.y_scale.rangeBand(),
          "class": "word",
          dy: "-1em"
        });
      };

      SvgView.prototype._set_scales = function() {
        this.y_scale = d3.scale.ordinal().domain(d3.range(this.data.length)).rangeRoundBands([0 + this.PAD, this.HE], 0.15);
        this.x_scale = d3.scale.ordinal().domain(d3.range(this.data[1].length - 1)).rangeRoundBands([0 + this.PAD, this.WI], 0.15);
        return [this.x_scale, this.y_scale];
      };

      SvgView.prototype.draw_map = function() {
        var i, r, _i, _len, _ref, _results;
        this._set_scales();
        this._add_axes();
        _ref = this.data.splice(1);
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          r = _ref[i];
          _results.push(this.svg.selectAll(".er" + i).data(r.splice(1)).enter().append("rect").attr({
            "class": "er" + i,
            x: (function(_this) {
              return function(d, ii) {
                return _this.x_scale(ii);
              };
            })(this),
            y: (function(_this) {
              return function(d, ii) {
                return _this.y_scale(i);
              };
            })(this),
            width: this.x_scale.rangeBand(),
            height: this.y_scale.rangeBand(),
            fill: function(d, ii) {
              switch (d) {
                case "1":
                  return "green";
                case "0":
                  return "red";
                default:
                  return "yellow";
              }
            }
          }));
        }
        return _results;
      };

      return SvgView;

    })();
    TableView = (function() {
      function TableView() {}

      TableView.make_table = function(data) {
        var d, dt, i, r, t, tr, _i, _j, _len, _len1;
        t = $("<table>");
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          r = data[i];
          tr = $("<tr>");
          for (_j = 0, _len1 = r.length; _j < _len1; _j++) {
            d = r[_j];
            dt = (function() {
              switch (d) {
                case "1":
                  return $("<td>").prop("class", "cards known");
                case "0":
                  return $("<td>").prop("class", "cards unknown");
                case "  ":
                  return $("<td>").prop("class", "cards unknown");
                default:
                  return $("<td>").prop("class", "parts").text(d);
              }
            })();
            tr.append(dt);
          }
          t.append(tr);
        }
        return $("#map").append(t);
      };

      return TableView;

    })();
    Session = (function() {
      function Session(data) {
        this.data = data;
        this.make_rows();
      }

      Session.prototype.make_rows = function() {
        var d_ar, k, p, svg, v, words, _, _i, _len, _ref;
        d_ar = [];
        words = (function() {
          var _ref, _results;
          _ref = this.data[0];
          _results = [];
          for (k in _ref) {
            _ = _ref[k];
            if (k !== "part") {
              _results.push(k);
            }
          }
          return _results;
        }).call(this);
        words.unshift("");
        d_ar.push(words);
        _ref = this.data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          d_ar.push((function() {
            var _results;
            _results = [];
            for (_ in p) {
              v = p[_];
              _results.push(v);
            }
            return _results;
          })());
        }
        return svg = new SvgView(d_ar);
      };

      return Session;

    })();
    return d3.csv("data/card_slides.csv", function(data) {
      var session;
      return session = new Session(data);
    });
  });

}).call(this);

//# sourceMappingURL=card_slides_t.js.map
