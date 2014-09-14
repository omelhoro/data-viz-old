// Generated by CoffeeScript 1.8.0
(function() {
  var Handlers, TextMatrix, TextMatrixViz, filterFunc, load_csv,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  TextMatrix = (function() {
    function TextMatrix(_arg) {
      var v;
      this.header = _arg[0], this.values = _arg[1];
      this.max = d3.max((function() {
        var _i, _len, _ref, _results;
        _ref = this.values;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          _results.push(d3.max(v[1]));
        }
        return _results;
      }).call(this));
      this.origin = (function() {
        var _i, _len, _ref, _results;
        _ref = this.values;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          _results.push(v);
        }
        return _results;
      }).call(this);
      this.sortk = this.values[0][1].length - 1;
      this.sortedBy = this.curSubset = null;
      this.logged = this.log();
      this.shares = this.sharesCalc();
    }

    TextMatrix.prototype.sort = function() {
      this.values.sort((function(_this) {
        return function(a, b) {
          return b[1][_this.sortk] - a[1][_this.sortk];
        };
      })(this));
      return this.sortedBy = this.sortk;
    };

    TextMatrix.prototype.serve_n = function(st, n) {
      this.curSubset = this.values.slice(st, n);
      this.maxf("ver");
      return this.curSubset;
    };

    TextMatrix.prototype.log = function() {
      var postpro, v, valar, _i, _len, _ref, _results;
      postpro = function(num) {
        if (num !== -Infinity) {
          return num;
        } else {
          return 0;
        }
      };
      _ref = this.origin;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        valar = _ref[_i];
        _results.push([
          valar[0], (function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = valar[1];
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              v = _ref1[_j];
              _results1.push(postpro(Math.log(v)));
            }
            return _results1;
          })()
        ]);
      }
      return _results;
    };

    TextMatrix.prototype.sharesCalc = function() {
      var i, nm, percent, totals, v, _i, _len, _ref;
      percent = function(ar) {
        var a, i, _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = ar.length; _i < _len; i = ++_i) {
          a = ar[i];
          _results.push(a / totals[i]);
        }
        return _results;
      };
      totals = {};
      _ref = this.header;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        nm = _ref[i];
        totals[i] = d3.sum((function() {
          var _j, _len1, _ref1, _results;
          _ref1 = this.origin;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            v = _ref1[_j];
            _results.push(v[1][i]);
          }
          return _results;
        }).call(this));
      }
      return this.shares = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.origin;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          v = _ref1[_j];
          _results.push([v[0], percent(v[1])]);
        }
        return _results;
      }).call(this);
    };

    TextMatrix.prototype.withShares = function(modus) {
      switch (modus) {
        case "totals":
          this.values = this.origin;
          break;
        case "shared":
          this.values = this.shares;
          break;
        case "logged":
          this.values = this.logged;
      }
      if (this.fnsubset != null) {
        return this.filterY(this.fnsubset);
      }
    };

    TextMatrix.prototype.filterY = function(f) {
      var itm, v;
      v = (function() {
        var _i, _len, _ref, _results;
        _ref = this.values;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          itm = _ref[_i];
          if (f(itm[0])) {
            _results.push(itm);
          }
        }
        return _results;
      }).call(this);
      if (v.length !== 0) {
        if (v.length < this.values.length) {
          this.fnsubset = f;
        } else {
          this.fnsubset = null;
        }
        return this.values = v;
      }
    };

    TextMatrix.prototype.maxf = function(dim) {
      var sum, v;
      if (dim == null) {
        dim = 'ver';
      }
      if (dim === 'hor') {
        sum = d3.sum((function() {
          var _i, _len, _ref, _results;
          _ref = this.curSubset;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(v[1][this.sortk]);
          }
          return _results;
        }).call(this));
        return this.max = this.maxf() / sum;
      } else {
        return this.max = d3.max((function() {
          var _i, _len, _ref, _results;
          _ref = this.curSubset;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(d3.max(v[1]));
          }
          return _results;
        }).call(this));
      }
    };

    return TextMatrix;

  })();

  Handlers = (function() {
    function Handlers(tmv, tm) {
      this.tmv = tmv;
      this.tm = tm;
      this.sortk = this.quaview = null;
      this.menu = $(".viz");
      this.tab = $("<table class='table vizfilter' >");
      this.menu.append(this.tab);
      this.tinp = null;
      this._tableFormat();
      this._addSortVisibs();
      this._addShares();
      this._bashSelect();
      this._yFilter();
    }

    Handlers.prototype._yFilter = function() {
      return $(".submfiltery").click((function(_this) {
        return function(e) {
          var end, f, startI;
          f = filterFunc($(".yregex").val());
          startI = parseInt($(".startrange").val());
          end = parseInt($(".endrange").val());
          _this.tm.filterY(f);
          _this.tmv.start = startI;
          _this.tmv.end = end;
          return _this.tmv.render();
        };
      })(this));
    };

    Handlers.prototype._addSortVisibs = function() {
      $("input[name='sorting']").click((function(_this) {
        return function(e) {
          var nval, val;
          val = $(e.target).val();
          nval = parseInt(val);
          if (nval !== _this.sortk) {
            _this.sortk = nval;
            _this.tm.sortk = nval;
            return _this.tmv.render();
          }
        };
      })(this));
      return $("input[name='visib']").click((function(_this) {
        return function(e) {
          var isvis, nval, opval, val;
          val = $(e.target).val();
          isvis = $(e.target).prop("checked");
          opval = isvis ? 1 : 0;
          nval = parseInt(val);
          return _this.tmv.activate(opval, 500, nval);
        };
      })(this));
    };

    Handlers.prototype._bashSelect = function() {
      this.tinp = $(".catregex");
      return $(".submcatregex").click((function(_this) {
        return function() {
          var f;
          f = filterFunc(_this.tinp.val());
          return _this.filterVis(f);
        };
      })(this));
    };

    Handlers.prototype.filterVis = function(f) {
      return $("input[name='visib']").each((function(_this) {
        return function(i, e) {
          var $e, t;
          $e = $(e);
          t = $e.data("pointer");
          if (f(t)) {
            console.log(t);
            $e.prop("checked", true);
            return _this.tmv.activate(1, 500, i);
          } else {
            $e.prop("checked", false);
            return _this.tmv.activate(0, 500, i);
          }
        };
      })(this));
    };

    Handlers.prototype._tableFormat = function() {
      var h, i, nm, renderButtons, td, trHead, trSort, trVis, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      trHead = $("<tr></tr>");
      trHead.append("<th></th>");
      _ref = this.tm.header;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        nm = _ref[i];
        td = $("<th>" + nm + "</th>");
        td.css("color", this.tmv.colorScale(i));
        trHead.append(td);
      }
      this.tab.append(trHead);
      trSort = $("<tr><td>Sorting</td></tr>");
      renderButtons = (function(_this) {
        return function(nm, i, type, name) {
          var inp;
          if (type == null) {
            type = 'radio';
          }
          if (name == null) {
            name = 'sorting';
          }
          return inp = $("<td><input type=" + type + " name=" + name + " data-pointer=" + nm + " value=" + i + " checked=false ></td>");
        };
      })(this);
      _ref1 = this.tm.header;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        h = _ref1[i];
        trSort.append(renderButtons(h, i));
      }
      this.tab.append(trSort);
      trVis = $("<tr><td>Visibility</td></tr>");
      _ref2 = this.tm.header;
      for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
        h = _ref2[i];
        trVis.append(renderButtons(h, i, 'checkbox', "visib"));
      }
      return this.tab.append(trVis);
    };

    Handlers.prototype._addShares = function() {
      return $("input[name='quaview']").click((function(_this) {
        return function(e) {
          var val;
          val = $(e.target).val();
          if (val !== _this.quaview) {
            _this.tm.withShares(val);
            return _this.tmv.render(_this.sortk);
          }
        };
      })(this));
    };

    return Handlers;

  })();

  filterFunc = function(ftext) {
    var endswith, f, has, startswith, tma, _ref;
    startswith = function(t) {
      var ssub;
      ssub = t.slice(0, tma.length);
      return ssub === tma;
    };
    endswith = function(t) {
      var offset, ssub;
      offset = t.length - tma.length;
      ssub = t.slice(offset);
      return ssub === tma;
    };
    has = function(t) {
      try {
        t.match(tma).index;
        return true;
      } catch (_error) {
        return false;
      }
    };
    _ref = (function() {
      switch ([ftext[0] === "*", ftext[ftext.length - 1] === "*"].join()) {
        case "true,true":
          return [has, ftext.slice(1, ftext.length - 1)];
        case "false,true":
          return [startswith, ftext.slice(0, ftext.length - 1)];
        case "true,false":
          return [endswith, ftext.slice(1)];
        case "false,false":
          return [has, ftext];
      }
    })(), f = _ref[0], tma = _ref[1];
    if (ftext) {
      return f;
    } else {
      return function(d) {
        return true;
      };
    }
  };

  TextMatrixViz = (function() {
    function TextMatrixViz(tm, HE, WI, MA, how_many) {
      var _ref;
      this.tm = tm;
      this.HE = HE;
      this.WI = WI;
      this.MA = MA;
      this.how_many = how_many;
      this.update = false;
      _ref = this._makeSvgBodyAxes(), this.svg = _ref[0], this.body = _ref[1], this.axes = _ref[2];
      this.x_scale = this.y_scale = null;
      this.colorScale = d3.scale.category10();
      this.subs = null;
      this.active = [];
      this.start = 0;
      this.end = 30;
    }

    TextMatrixViz.prototype._makeSvgBodyAxes = function() {
      var axes, body, svg;
      svg = d3.select(".corpus_viz").append("svg").attr({
        height: this.HE,
        width: this.WI
      });
      body = d3.select("svg").append("g").attr({
        "class": "body",
        transform: "translate(" + this.MA + "," + this.MA + ")"
      });
      axes = d3.select("svg").append("g").attr("class", "axes");
      return [svg, body, axes];
    };

    TextMatrixViz.prototype._makeAxes = function() {
      var x_axis, y_axis;
      this._makeScales();
      y_axis = d3.svg.axis().scale(this.y_scale).tickFormat((function(_this) {
        return function(d, i) {
          return _this.tm.values[i + _this.start][0];
        };
      })(this)).orient("left");
      x_axis = d3.svg.axis().scale(this.x_scale).orient("top");
      this._makeAxis(x_axis, "x", this.MA, this.MA);
      this._makeAxis(y_axis, "y", this.MA, this.MA);
      this.update = true;
      return [x_axis, y_axis];
    };

    TextMatrixViz.prototype._makeAxis = function(axis, dim, trans0, trans1) {
      var comp_ax, fontSize;
      if (this.update) {
        comp_ax = this.svg.select("." + dim + "axis").call(axis);
      } else {
        comp_ax = this.axes.append("g").attr({
          "class": "" + dim + "axis",
          transform: "translate(" + trans0 + "," + trans1 + ")"
        }).call(axis);
      }
      d3.selectAll("." + dim + ".grid-line").remove();
      d3.selectAll("g." + dim + "axis g.tick").append("line").classed("" + dim + " grid-line", true).attr({
        x1: dim === "y" ? -10 : 0,
        y1: dim === "x" ? -10 : 0,
        x2: dim === "y" ? this.WI - this.MA : 0,
        y2: dim === "x" ? this.HE - this.MA : 0
      });
      if (dim === "y") {
        fontSize = this.y_scale.rangeBand();
        return comp_ax.selectAll("text").attr("font-size", fontSize);
      }
    };

    TextMatrixViz.prototype._makeScales = function() {
      this.y_scale = d3.scale.ordinal().domain(d3.range(this.end - this.start)).rangeRoundBands([0, this.HE - this.MA], 0);
      this.x_scale = d3.scale.linear().domain([0, this.tm.max]).range([0, this.WI - this.MA]);
      return [this.x_scale, this.y_scale];
    };

    TextMatrixViz.prototype._makeCircles = function() {
      var active, dpoints, i, nm, nmSubs, v, _i, _len, _ref, _results;
      console.log(this.start, this.end);
      _ref = this.tm.header;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        nm = _ref[i];
        nmSubs = (function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.subs;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            v = _ref1[_j];
            _results1.push(v[1][i]);
          }
          return _results1;
        }).call(this);
        active = __indexOf.call(this.active, nm) >= 0 ? 1 : 0;
        dpoints = this.body.selectAll(".circle" + i);
        dpoints.data(nmSubs).exit().remove();
        dpoints.data(nmSubs).enter().append("circle").attr({
          "class": "circle" + i,
          opacity: 0,
          r: 4,
          fill: this.colorScale(i),
          dt: function(d, i) {
            return d;
          }
        });
        _results.push(this.body.selectAll(".circle" + i).data(nmSubs).attr({
          cy: (function(_this) {
            return function(d, i) {
              return _this.y_scale(i);
            };
          })(this),
          cx: (function(_this) {
            return function(d, i) {
              return _this.x_scale(d);
            };
          })(this)
        }));
      }
      return _results;
    };

    TextMatrixViz.prototype._makeLines = function() {
      var i, ldata, v, _line;
      _line = d3.svg.line().x((function(_this) {
        return function(d, i) {
          return _this.x_scale(d);
        };
      })(this)).y((function(_this) {
        return function(d, i) {
          return _this.y_scale(i);
        };
      })(this));
      ldata = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.tm.header.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _len, _ref1, _results1;
            _ref1 = this.subs;
            _results1 = [];
            for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
              v = _ref1[_j];
              _results1.push(v[1][i]);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      }).call(this);
      this.body.selectAll("path.line").data(ldata).exit().remove();
      this.body.selectAll("path.line").data(ldata).enter().append("path").attr({
        "class": function(d, i) {
          return "line a" + i;
        }
      });
      return this.body.selectAll("path.line").data(ldata).transition().style("stroke", (function(_this) {
        return function(d, i) {
          return _this.colorScale(i);
        };
      })(this)).attr({
        "d": function(d) {
          return _line(d);
        }
      });
    };

    TextMatrixViz.prototype.render = function() {
      this.tm.sort();
      this.subs = this.tm.serve_n(this.start, this.end);
      this._makeAxes();
      this._makeCircles();
      return this._makeLines();
    };

    TextMatrixViz.prototype.activate = function(num, time, pool) {
      var i, nm, opa, spool, _i, _len, _results;
      if (num == null) {
        num = 1;
      }
      if (time == null) {
        time = 500;
      }
      if (pool == null) {
        pool = this.tm.header;
      }
      opa = (function(_this) {
        return function(sel) {
          return _this.body.selectAll(sel).transition().duration(time).attr({
            opacity: num
          });
        };
      })(this);
      if (typeof pool === "number") {
        spool = [this.tm.header[pool]];
        pool = this.tm.header;
      } else {
        spool = this.tm.header;
      }
      _results = [];
      for (i = _i = 0, _len = pool.length; _i < _len; i = ++_i) {
        nm = pool[i];
        if (__indexOf.call(spool, nm) >= 0) {
          _results.push(opa("path.a" + i));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return TextMatrixViz;

  })();

  load_csv = function() {
    var reformat;
    reformat = function(data) {
      var header, k, obj, v, values, _i, _len;
      header = (function() {
        var _ref, _results;
        _ref = data[0];
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          if (k !== "index") {
            _results.push(k);
          }
        }
        return _results;
      })();
      values = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        obj = data[_i];
        values.push([
          obj.index, (function() {
            var _results;
            _results = [];
            for (k in obj) {
              v = obj[k];
              if (k !== "index") {
                _results.push(parseFloat(v));
              }
            }
            return _results;
          })()
        ]);
      }
      return [header, values];
    };
    return d3.csv(data_src, function(data) {
      var tm, view, viewMenu;
      tm = new TextMatrix(reformat(data));
      view = new TextMatrixViz(tm, 600, 600, 80, 50);
      viewMenu = new Handlers(view, tm);
      return view.render();
    });
  };

  load_csv();

}).call(this);

//# sourceMappingURL=corpus.js.map
