// Generated by CoffeeScript 1.7.1
(function() {
  var Session, makeParsers,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  makeParsers = function(d) {
    var k, parsers, v, _ref;
    parsers = {};
    _ref = d[0];
    for (k in _ref) {
      v = _ref[k];
      parsers[k.trim()] = (function() {
        switch (k.trim().slice(-1)) {
          case "f":
            return function(i) {
              return Math.round(parseFloat(i) * 100) / 100;
            };
          case "i":
            return function(i) {
              return parseInt(i);
            };
          case "s":
            return function(s) {
              return s;
            };
          case "b":
            return function(s) {
              return s;
            };
          case "p":
            return function(i) {
              return Math.round(parseFloat(i) * 100);
            };
        }
      })();
    }
    return parsers;
  };

  Session = (function() {
    function Session(data, bio_data) {
      this.data = data;
      this.bio_data = bio_data;
      this.HE = 500;
      this.WI = 500;
      this.PAD = 70;
      this.update = false;
      this.imp_keys = ["ger_years", "notger_years", "toksec", "task2cor", "speechrate", "artrate"];
      this.imp_keys_exp = this.imp_keys.concat(["meanC", "meanV"]);
      this.svg = d3.select("div#map").append("svg").attr({
        width: this.WI,
        height: this.HE
      });
      this.y_scale = this.x_scale = "";
      this.subData = this.subPaths = "";
      this.x_axisLabel = this.x_axisLabel = "";
      this._set_scales();
      this.color = d3.scale.category10();
      this._makeHandlers();
      console.log(this.bio_data);
    }

    Session.prototype._set_scales = function(xmin, xmax, xlabel, ymin, ymax, ylabel) {
      if (xmin == null) {
        xmin = 25;
      }
      if (xmax == null) {
        xmax = 100;
      }
      if (ymin == null) {
        ymin = 25;
      }
      if (ymax == null) {
        ymax = 100;
      }
      if (__indexOf.call(this.imp_keys_exp, xlabel) < 0) {
        xmin = 25;
        xmax = 100;
      }
      this.x_scale = d3.scale.linear().domain([xmin, xmax]).range([this.PAD * 1, this.WI - this.PAD]);
      if (__indexOf.call(this.imp_keys_exp, ylabel) < 0) {
        ymin = 25;
        ymax = 100;
      }
      return this.y_scale = d3.scale.linear().domain([ymax, ymin]).range([this.PAD, this.HE - this.PAD]);
    };

    Session.prototype._draw_axes = function() {
      var x_axis, y_axis;
      x_axis = d3.svg.axis().scale(this.x_scale).orient("bottom");
      y_axis = d3.svg.axis().scale(this.y_scale).orient("left");
      if (this.update) {
        this.svg.selectAll(".x_axis").transition().duration(500).call(x_axis);
        return this.svg.select(".y_axis").call(y_axis);
      } else {
        this.x_axisLabel = this.svg.append("text").attr({
          "class": "xlabel",
          x: this.WI / 2,
          y: this.HE - this.PAD / 2
        });
        this.y_axisLabel = this.svg.append("text").attr({
          "class": "ylabel",
          x: this.PAD / 2,
          y: this.HE / 2,
          transform: "rotate(270 " + (this.PAD / 2) + "," + (this.HE / 2) + ")"
        });
        this.svg.append("g").attr({
          "class": "x_axis",
          transform: "translate(0," + (this.HE - this.PAD) + ")"
        }).call(x_axis);
        return this.svg.append("g").attr({
          "class": "y_axis",
          transform: "translate(" + this.PAD + ",0)"
        }).call(y_axis);
      }
    };

    Session.prototype._makeSubset = function() {
      var k, pathAr, pathPerAr, perAr, st_end, v, valAr, vv, xlabel, xmax, xmin, ylabel, ymax, ymin, _ref;
      ylabel = $("input[name=y_axis]:checked").val();
      xlabel = $("input[name=x_axis]:checked").val();
      valAr = [];
      pathAr = [];
      d3.select(".xlabel").text(xlabel);
      d3.select(".ylabel").text(ylabel);
      _ref = this.data;
      for (k in _ref) {
        v = _ref[k];
        pathPerAr = [k];
        for (st_end in v) {
          vv = v[st_end];
          perAr = [vv[xlabel], vv[ylabel], st_end, k];
          valAr.push(perAr);
          pathPerAr.push([perAr[0], perAr[1]]);
        }
        pathAr.push(pathPerAr);
        ymax = d3.max(valAr, function(d) {
          return d[1];
        });
        ymin = d3.min(valAr, function(d) {
          return d[1];
        });
        xmin = d3.min(valAr, function(d) {
          return d[0];
        });
        xmax = d3.max(valAr, function(d) {
          return d[0];
        });
      }
      this._set_scales(xmin, xmax, xlabel, ymin, ymax, ylabel);
      this._draw_axes();
      this.subData = valAr;
      this.subPaths = pathAr;
      return this.draw();
    };

    Session.prototype.draw = function() {
      var circles;
      circles = this.svg.selectAll("circle").data(this.subData);
      if (!this.update) {
        circles = circles.enter().append("circle");
      }
      circles.transition().duration(1000).attr({
        "class": function(d, i) {
          return "circle";
        },
        cy: (function(_this) {
          return function(d, i) {
            return _this.y_scale(d[1]);
          };
        })(this),
        cx: (function(_this) {
          return function(d, i) {
            return _this.x_scale(d[0]);
          };
        })(this),
        r: 4,
        title: function(d, i) {
          return d[3];
        },
        fill: (function(_this) {
          return function(d, i) {
            return _this.color(d[2]);
          };
        })(this)
      });
      this.svg.selectAll(".pathStEnd").remove();
      return this.svg.selectAll("pathStEnd").data(this.subPaths).enter().append("path").attr({
        "class": "pathStEnd",
        d: (function(_this) {
          return function(d, i) {
            var l, m;
            m = "M " + (_this.x_scale(d[1][0])) + " " + (_this.y_scale(d[1][1])) + " ";
            l = " L " + (_this.x_scale(d[2][0])) + " " + (_this.y_scale(d[2][1])) + " Z";
            return m + l;
          };
        })(this),
        stroke: function(d, i) {
          if (d[0].startsWith("112")) {
            return "blue";
          } else {
            return "red";
          }
        },
        strokeWidth: 2
      });
    };

    Session.prototype._addBioData = function() {
      var fp, k, key, knm, obj, part, partsData, ps, v, _, _i, _len, _ref, _results;
      ps = makeParsers(this.bio_data);
      console.log(ps);
      partsData = (function() {
        var _ref, _results;
        _ref = this.data;
        _results = [];
        for (key in _ref) {
          _ = _ref[key];
          _results.push(key);
        }
        return _results;
      }).call(this);
      _ref = this.bio_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        part = obj["index_i"] + "_k";
        if (__indexOf.call(partsData, part) >= 0) {
          console.log(obj);
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (k in obj) {
              v = obj[k];
              fp = ps[k];
              knm = k.slice(0, -2);
              console.log(knm, v);
              if (__indexOf.call(this.imp_keys, knm) >= 0) {
                this.data[part]["start"][knm] = fp(v);
                _results1.push(this.data[part]["end"][knm] = fp(v));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Session.prototype._makeHandlers = function() {
      var axesTabs, cat, catRow, clss, k, keys, options, tabHeader, v, xaxis, yaxis, _i, _j, _len, _len1, _ref;
      this._addBioData();
      keys = (function() {
        var _ref, _results;
        _ref = this.data["112199_k"]["start"];
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          if (__indexOf.call(this.imp_keys_exp, k) < 0) {
            _results.push(k);
          }
        }
        return _results;
      }).call(this);
      keys = keys.sort();
      console.log(this.data, keys);
      options = $("<div id='options'>");
      axesTabs = $("<table>");
      tabHeader = $("<tr><td>X-Axis</td><td>Cat</td><td>Y-Axis</td></tr>");
      axesTabs.append(tabHeader);
      axesTabs.append($("<tr><td>Rhythm</td></tr>"));
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        yaxis = $("<td><input type='radio' name='y_axis' value='" + k + "'></td>");
        xaxis = $("<td><input type='radio' name='x_axis' value='" + k + "'></td>");
        clss = k.slice(-1) + "phon";
        cat = $("<td class='" + clss + "'>" + k + "</td>");
        catRow = $("<tr>").append(xaxis).append(cat).append(yaxis);
        axesTabs.append(catRow);
      }
      axesTabs.append($("<tr><td>Peripher</td></tr>"));
      _ref = this.imp_keys_exp;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        k = _ref[_j];
        yaxis = $("<td><input type='radio' name='y_axis' value='" + k + "'></td>");
        xaxis = $("<td><input type='radio' name='x_axis' value='" + k + "'></td>");
        clss = k.slice(-1) + "phon";
        cat = $("<td class='" + clss + "'>" + k + "</td>");
        catRow = $("<tr>").append(xaxis).append(cat).append(yaxis);
        axesTabs.append(catRow);
      }
      $("#map").append(options.append(axesTabs));
      $("input[name=y_axis]").last().click();
      $("input[type='radio']").change((function(_this) {
        return function(e) {
          return _this._makeSubset();
        };
      })(this));
      $("input[name=x_axis]").last().click();
      return this.update = true;
    };


    /*
    	perif_data: () ->
    		c=d3.csv("data/lima_bio.csv", (data) => console.log @bio_data=data) 
    		console.log @bio_data,d3.csv("data/lima_bio.csv")
     */

    return Session;

  })();

  d3.json("./static/data/rhythm_single.json", function(rhythm_data) {
    return d3.csv("./static/data/lima_bio.csv", (function(_this) {
      return function(bio_data) {
        var session;
        return session = new Session(rhythm_data, bio_data);
      };
    })(this));
  });

}).call(this);

//# sourceMappingURL=rhythm.map
