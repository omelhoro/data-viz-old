// Generated by CoffeeScript 1.8.0
(function() {
  var Session;

  Session = (function() {
    function Session(data) {
      this.HE = 500;
      this.WI = 600;
      this.PAD = 70;
      this.svg = d3.select(MAPCONTAINER).append("svg").attr({
        width: this.WI,
        height: this.HE
      });
      this.data = data;
      this._makeHandlers();
      this.color = d3.scale.category10();
      this.y_scale = this.x_scale = "";
      this._set_scales();
      this._draw_axes();
    }

    Session.prototype._set_scales = function() {
      this.x_scale = d3.scale.linear().domain([3000, 0]).range([this.PAD * 2, this.WI]);
      return this.y_scale = d3.scale.linear().domain([0, 1500]).range([this.PAD, this.HE]);
    };

    Session.prototype._draw_axes = function() {
      var x_axis, x_axisLabel, y_axis;
      x_axis = d3.svg.axis().scale(this.x_scale).orient("top");
      y_axis = d3.svg.axis().scale(this.y_scale).orient("right");
      x_axisLabel = this.svg.append("text").attr({
        x: (this.WI - this.PAD) / 2,
        y: this.PAD / 2
      }).text("F2");
      x_axisLabel = this.svg.append("text").attr({
        x: this.WI - this.PAD / 2,
        y: (this.HE + this.PAD) / 2
      }).text("F1");
      this.svg.append("g").attr({
        "class": "x_axis",
        transform: "translate(-" + this.PAD + "," + this.PAD + ")"
      }).call(x_axis);
      return this.svg.append("g").attr({
        "class": "y_axis",
        transform: "translate(" + (this.WI - this.PAD) + ",0)"
      }).call(y_axis);
    };

    Session.prototype._makeHandlers = function() {
      var input, inputsRadio, k, keys, keysDiv, _, _i, _len;
      keys = (function() {
        var _ref, _results;
        _ref = this.data;
        _results = [];
        for (k in _ref) {
          _ = _ref[k];
          _results.push(k);
        }
        return _results;
      }).call(this);
      keysDiv = $("<div id='options'></div>");
      inputsRadio = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        input = $("<label><input name='parts' type='radio' value='" + k + "'>" + k + "</label><br>");
        inputsRadio.push(input);
        keysDiv.append(input);
      }
      $(MAPCONTAINER).append(keysDiv);
      return $("input[name='parts']").click((function(_this) {
        return function(e) {
          var nm;
          nm = $(e.target).val();
          return _this.draw(nm);
        };
      })(this));
    };

    Session.prototype.draw = function(part) {
      var circles, dataArr;
      if (part == null) {
        part = "112198_ru_07_k";
      }
      dataArr = this.data[part];
      this.svg.selectAll(".textv").remove();
      circles = this.svg.selectAll("text").data(dataArr);
      return circles.enter().append("text").attr({
        "class": function(d, i) {
          return "textv";
        },
        y: (function(_this) {
          return function(d, i) {
            return _this.y_scale(d[0]);
          };
        })(this),
        x: (function(_this) {
          return function(d, i) {
            return _this.x_scale(d[1]);
          };
        })(this),
        title: function(d, i) {
          return d[3];
        },
        fill: (function(_this) {
          return function(d, i) {
            return _this.color(d[3]);
          };
        })(this)
      }).text(function(d, i) {
        return d[3].replace("v", "");
      });
    };

    return Session;

  })();

  d3.json("./static/data/lima/lima_formants_single.json", function(data) {
    var session;
    session = new Session(data);
    return $("input").first().click();
  });

}).call(this);

//# sourceMappingURL=formants.js.map
