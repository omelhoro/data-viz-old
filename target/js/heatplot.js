// Generated by CoffeeScript 1.8.0
(function() {
  var Handler, HeatView, Matrix, dataMain, dataY;

  Matrix = (function() {
    function Matrix(data, dataXraw, dataYraw, isInt) {
      this.data = data;
      this.dataXraw = dataXraw;
      this.dataYraw = dataYraw;
      this.isInt = isInt != null ? isInt : true;
      this.xTags = this.yTags = this.matrix = null;
      this.prepareMatrix();
      this.catsOfY = this.catsOfX = this.curCatY = this.curCatX = this.dataY = this.dataX = null;
      this.prepareSecD();
    }

    Matrix.prototype.prepareMatrix = function() {
      var fnParseFloatAr, fnParseIntAr, o, parser;
      fnParseIntAr = function(a) {
        var d, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = a.length; _i < _len; _i++) {
          d = a[_i];
          _results.push(parseInt(d));
        }
        return _results;
      };
      fnParseFloatAr = function(a) {
        var d, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = a.length; _i < _len; _i++) {
          d = a[_i];
          _results.push(parseFloat(d));
        }
        return _results;
      };
      parser = this.isInt ? fnParseIntAr : fnParseFloatAr;
      this.xTags = this.data[0].slice(1);
      this.matrix = (function() {
        var _i, _len, _ref, _results;
        _ref = this.data.slice(1);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          _results.push([o[0], parser(o.slice(1))]);
        }
        return _results;
      }).call(this);
      this.yTags = (function() {
        var _i, _len, _ref, _results;
        _ref = this.matrix;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          _results.push(o[0]);
        }
        return _results;
      }).call(this);
      return [this.xTags, this.matrix, this.yTags];
    };

    Matrix.prototype.prepareSecD = function() {
      var makeParsers, remap, _ref, _ref1;
      makeParsers = function(d) {
        var k, nm, parsers, v, _ref;
        parsers = {};
        _ref = d[0];
        for (k in _ref) {
          v = _ref[k];
          nm = k.trim().split("_");
          parsers[k.trim()] = (function() {
            switch (_.last(nm)) {
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
      remap = function(d) {
        var catsOf, ixnm, k, nd, nm, obj, parsers, _i, _j, _len, _len1;
        nd = {};
        parsers = makeParsers(d);
        catsOf = _.keys(parsers).slice(1);
        for (_i = 0, _len = d.length; _i < _len; _i++) {
          obj = d[_i];
          ixnm = _.first(_.keys(obj));
          nm = obj[ixnm];
          nd[nm] = {};
          for (_j = 0, _len1 = catsOf.length; _j < _len1; _j++) {
            k = catsOf[_j];
            nd[nm][k] = parsers[k](obj[k]);
          }
        }
        return [nd, catsOf];
      };
      _ref = remap(this.dataXraw), this.dataX = _ref[0], this.catsOfX = _ref[1];
      this.pickRandCat("x");
      _ref1 = remap(this.dataYraw), this.dataY = _ref1[0], this.catsOfY = _ref1[1];
      return this.pickRandCat("y");
    };

    Matrix.prototype.pickRandCat = function(dim) {
      if (dim === "y") {
        return this.curCatY = _.sample(this.catsOfY);
      } else {
        return this.curCatX = _.sample(this.catsOfX);
      }
    };

    Matrix.prototype.setCurCat = function(dim, val) {
      if (dim === "y") {
        return this.curCatY = val;
      } else {
        return this.curCatX = val;
      }
    };

    Matrix.prototype.sortVert = function() {
      var cat, o;
      cat = this.curCatY;
      this.matrix.sort((function(_this) {
        return function(a, b) {
          return _this.dataY[a[0]][cat] < _this.dataY[b[0]][cat];
        };
      })(this));
      return this.yTags = (function() {
        var _i, _len, _ref, _results;
        _ref = this.matrix;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          _results.push(o[0]);
        }
        return _results;
      }).call(this);
    };

    Matrix.prototype.sortHori = function(cat) {
      var e, i, o, transposeToM, transposedMatrix;
      if (cat == null) {
        cat = 'speed';
      }
      cat = this.curCatX;
      transposeToM = function(i, m) {
        var a, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = m.length; _i < _len; _i++) {
          a = m[_i];
          _results.push(a[1][i]);
        }
        return _results;
      };
      transposedMatrix = (function() {
        var _i, _len, _ref, _results;
        _ref = this.xTags;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          e = _ref[i];
          _results.push([e, transposeToM(i, this.matrix)]);
        }
        return _results;
      }).call(this);
      transposedMatrix.sort((function(_this) {
        return function(a, b) {
          return _this.dataX[a[0]][cat] < _this.dataX[b[0]][cat];
        };
      })(this));
      this.xTags = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = transposedMatrix.length; _i < _len; _i++) {
          o = transposedMatrix[_i];
          _results.push(o[0]);
        }
        return _results;
      })();
      return this.matrix = (function() {
        var _i, _len, _ref, _results;
        _ref = this.yTags;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          e = _ref[i];
          _results.push([e, transposeToM(i, transposedMatrix)]);
        }
        return _results;
      }).call(this);
    };

    return Matrix;

  })();

  HeatView = (function() {
    function HeatView(tm, HE, WI, MA) {
      var _ref, _ref1;
      this.tm = tm;
      this.HE = HE;
      this.WI = WI;
      this.MA = MA;
      _ref = this._renderSvgBodyAxes(), this.svg = _ref[0], this.body = _ref[1], this.axes = _ref[2];
      _ref1 = this._set_scales(), this.x_scale = _ref1[0], this.y_scale = _ref1[1];
      this.update = false;
    }

    HeatView.prototype._renderSvgBodyAxes = function() {
      var axes, body, svg;
      svg = d3.select(MAPCONTAINER).append("svg").attr({
        height: this.HE,
        width: this.WI
      });
      svg.append("g").attr({
        "class": "main",
        transform: "translate(" + this.MA + "," + this.MA + ")"
      });
      body = d3.select("g.main").append("g").attr({
        "class": "body",
        transform: "translate(" + this.MA + "," + this.MA + ")"
      });
      axes = d3.select("g.main").append("g").attr("class", "axes");
      return [svg, body, axes];
    };

    HeatView.prototype._make_axes = function() {
      var fnAxis, x_axis, x_axisSec, y_axis, y_axisSec;
      fnAxis = function(scale, fnGet, orient) {
        return d3.svg.axis().scale(scale).tickFormat(function(d, i) {
          return fnGet(i);
        }).orient(orient);
      };
      y_axis = fnAxis(this.y_scale, ((function(_this) {
        return function(i) {
          return _this.tm.yTags[i];
        };
      })(this)), "left");
      y_axisSec = fnAxis(this.y_scale, ((function(_this) {
        return function(i) {
          var res;
          return res = _this.tm.dataY[_this.tm.yTags[i]][_this.tm.curCatY];
        };
      })(this)), "left");
      x_axis = fnAxis(this.x_scale, ((function(_this) {
        return function(i) {
          return _this.tm.xTags[i];
        };
      })(this)), "top");
      x_axisSec = fnAxis(this.x_scale, ((function(_this) {
        return function(i) {
          var res;
          return res = _this.tm.dataX[_this.tm.xTags[i]][_this.tm.curCatX];
        };
      })(this)), "top");
      this.render_axis(y_axis, "y", this.MA, this.MA, this.y_scale, y_axisSec);
      this.render_axis(x_axis, "x", this.MA, this.MA, this.x_scale, x_axisSec);
      return [x_axis, y_axis];
    };

    HeatView.prototype._set_scales = function() {
      var bodyPos, transformedX, transformedY;
      bodyPos = this.body[0][0].getCTM();
      transformedX = bodyPos.e;
      transformedY = bodyPos.f;
      this.y_scale = d3.scale.ordinal().domain(d3.range(this.tm.yTags.length)).rangeRoundBands([0, this.HE - transformedY], 0.15);
      this.x_scale = d3.scale.ordinal().domain(d3.range(this.tm.xTags.length)).rangeRoundBands([0, this.WI - transformedX], 0.15);
      return [this.x_scale, this.y_scale];
    };

    HeatView.prototype.render_axis = function(axis, dim, trans0, trans1, scale, sec) {
      var ax, coords, fontSize, header, headers, isInSvg, renderHeader;
      fontSize = scale.rangeBand();
      if (this.update) {
        ax = this.axes.select("." + dim + "axis").call(axis);
      } else {
        ax = this.axes.append("g").attr({
          "class": "" + dim + "axis",
          transform: "translate(" + trans0 + "," + trans1 + ")"
        }).call(axis);
      }
      ax.selectAll("text").attr("font-size", fontSize);
      if (dim === "x") {
        ax.selectAll("text").attr({
          transform: "rotate(45)",
          style: "text-anchor:end",
          dy: "1em"
        });
      }
      coords = dim === "y" ? [trans0 - this.MA, trans1] : [trans0, trans1 - this.MA];
      if (this.update) {
        ax = this.axes.select("." + dim + "axisSec").call(sec);
      } else {
        ax = this.axes.append("g").attr({
          "class": "" + dim + "axisSec",
          transform: "translate(" + coords[0] + "," + coords[1] + ")"
        }).call(sec);
      }
      ax.selectAll("text").attr("font-size", fontSize);
      if (dim === "x") {
        ax.selectAll("text").attr({
          transform: "rotate(45)",
          style: "text-anchor:end",
          dy: "1em"
        });
      }
      headers = dim === "y" ? [this.tm.curCatY, 0, -10] : [this.tm.curCatX, ax[0][0].getBBox().width / 2, -30];
      ax.select("." + dim + "Title").remove();
      isInSvg = function(h) {
        var bBoxX, transMX;
        bBoxX = h[0][0].getBBox().x;
        transMX = h[0][0].getCTM().e;
        return Math.abs(bBoxX) < transMX;
      };
      renderHeader = function(fSize, x) {
        var header, isGood;
        if (x == null) {
          x = 2;
        }
        header = ax.append("text").attr({
          "class": "" + dim + "Title",
          x: headers[1],
          y: headers[2],
          "font-size": fSize * x,
          style: "text-anchor:middle",
          "text-decoration": "underline"
        }).text(headers[0]);
        isGood = isInSvg(header);
        if (isGood || x < 0.5 || dim === "x") {
          return header;
        } else {
          header.remove();
          return renderHeader(fSize, x - 0.1);
        }
      };
      return header = renderHeader(fontSize, 2);
    };

    HeatView.prototype._renderData = function() {
      var brew, colorscale, i, r, _i, _len, _ref, _results;
      brew = ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"];
      _ref = this.tm.matrix;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        r = _ref[i];
        r = r[1];
        colorscale = d3.scale.ordinal().domain(0, d3.max(r)).range(brew);
        colorscale(1);
        if (this.update) {
          _results.push(this.body.selectAll(".row_" + i).data(r).transition().duration(1000).attr({
            fill: function(d, j) {
              return colorscale(d);
            }
          }));

          /*
          .style "stroke", (d,j) =>
              if @tm.yTags[i]=="112199" or @tm.xTags[j]=="rjukzak"
                  "red"
           */
        } else {
          _results.push(this.body.selectAll(".row_" + i).data(r).enter().append("rect").attr({
            "class": "row_" + i,
            x: (function(_this) {
              return function(d, j) {
                return _this.x_scale(j);
              };
            })(this),
            y: (function(_this) {
              return function(d, j) {
                return _this.y_scale(i);
              };
            })(this),
            width: this.x_scale.rangeBand(),
            height: this.y_scale.rangeBand(),
            fill: function(d, j) {
              return colorscale(d);
            }
          }));
        }
      }
      return _results;
    };

    HeatView.prototype.render = function() {
      this._make_axes();
      this._renderData();
      return this.update = true;
    };

    return HeatView;

  })();

  Handler = (function() {
    function Handler(tm, mv) {
      this.tm = tm;
      this.mv = mv;
      this.renderAxisCats();
    }

    Handler.prototype.renderAxisCats = function(tm, mv) {
      var addList, catsX, catsY, filter;
      if (tm == null) {
        tm = this.tm;
      }
      if (mv == null) {
        mv = this.mv;
      }
      filter = function(itm) {
        return itm.indexOf("Log") === -1;
      };
      addList = function(dim, catn, cat) {
        var c, eli, eul, _i, _len, _ref;
        eul = $("<ul class='cats-list list-group " + catn + "'>" + catn + "</ul>");
        _ref = (function() {
          var _j, _len, _results;
          _results = [];
          for (_j = 0, _len = cat.length; _j < _len; _j++) {
            c = cat[_j];
            if (filter(c)) {
              _results.push(c);
            }
          }
          return _results;
        })();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          eli = $("<li class='' data-filter='" + c + "'><label><input type='radio'value='" + c + "' name='" + catn + "'/>" + c + "</label></li>");
          eul.append(eli);
        }
        eul.click(function(e) {
          var trg;
          trg = $(e.target);
          tm.setCurCat(dim, trg.val());
          if (dim === "y") {
            tm.sortVert();
          } else {
            tm.sortHori();
          }
          return mv.render();
        });
        return ($("#choices")).prepend(eul);
      };
      catsX = this.tm.catsOfX;
      catsY = this.tm.catsOfY;
      addList("x", "X-Axis", catsX);
      return addList("y", "Y-Axis", catsY);
    };

    Handler.prototype.setSecAxis = function(tag) {
      var cat, cats, dim, i, sortDir, _ref, _ref1;
      _ref = tag.split("_"), dim = _ref[0], i = _ref[1];
      _ref1 = dim === "y" ? [this.tm.catsOfY, this.tm.sortVert] : [this.tm.catsOfX, this.tm.sortHori], cats = _ref1[0], sortDir = _ref1[1];
      cat = cats[parseInt(i)];
      this.tm.setCurCat(dim, cat);
      return this.update(dim);
    };

    return Handler;

  })();

  dataY = function(callback) {
    return d3.csv("./static/data/lima/lima_bio.csv", callback);
  };

  dataMain = function(dataSecY) {
    return d3.csv("./static/data/lima/wordfreq_t2.csv", function(dataSecX) {
      return d3.text("./static/data/lima/card_slides.csv", function(data) {
        var handler, matrix, view;
        data = d3.csv.parseRows(data);
        matrix = new Matrix(data, dataSecX, dataSecY);
        view = new HeatView(matrix, 500, 700, 50);
        handler = new Handler(matrix, view);
        return view.render();
      });
    });
  };

  dataY(dataMain);

}).call(this);

//# sourceMappingURL=heatplot.js.map
