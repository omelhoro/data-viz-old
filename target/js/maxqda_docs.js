// Generated by CoffeeScript 1.8.0
(function() {
  var COL_LEFT, CSCALE, ECODES_COL, ECODES_COLSVG, EDOC_POOL, MaxQDADoc, NEW_TEXT, codes, text;

  text = ($("#max-qda-doc")).val();

  codes = ($("#codes")).val();

  NEW_TEXT = $("#text");

  ECODES_COL = $("#codes-col");

  ECODES_COLSVG = d3.select("#codes-col-svg");

  CSCALE = d3.scale.category20();

  COL_LEFT = ECODES_COL.width();

  EDOC_POOL = $("#maxqda-doc-pool");

  MaxQDADoc = (function() {
    function MaxQDADoc(k, doc) {
      var c, el, _i, _len, _ref;
      this.codes = doc['codes'];
      this.text = doc['text'];
      this.sent_pool = this.append_text(this.text);
      this.srt_codes = this.codes.sort(function(a, b) {
        return a[1] > b[1];
      });
      this.position_fn = this.position_element(20, "svg");
      ECODES_COLSVG.selectAll("*").remove();
      _ref = this.srt_codes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        el = this.append_code_svg(c, this.sent_pool);
        this.position_fn(el);
      }
      ECODES_COLSVG.attr("height", NEW_TEXT.height());
    }

    MaxQDADoc.prototype.append_text = function(t) {
      var i, l, newt, pool, sent, tsplt, _i, _len;
      sent = function(i, s) {
        if (s === "") {
          return s = [i, $("<p></p>")];
        } else {
          return s = [i, $("<span class='sent' data-sentix=" + i + ">" + i + "-" + s + "</span>")];
        }
      };
      pool = {};
      NEW_TEXT.empty();
      tsplt = t.split("\n");
      tsplt = tsplt[0].trim() === "" ? tsplt.slice(1) : tsplt;
      for (i = _i = 0, _len = tsplt.length; _i < _len; i = ++_i) {
        l = tsplt[i];
        newt = sent(i, l);
        NEW_TEXT.append(newt[1]);
        pool[i + 1] = newt[1];
      }
      return pool;
    };

    MaxQDADoc.prototype.render_selection = function(c, db) {
      var c_range, i, marked_pool, select, sents, unselect, _i, _ref, _ref1, _results;
      c_range = (function() {
        _results = [];
        for (var _i = _ref = c[1], _ref1 = c[2]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
      sents = (function() {
        var _j, _len, _results1;
        _results1 = [];
        for (_j = 0, _len = c_range.length; _j < _len; _j++) {
          i = c_range[_j];
          _results1.push(db[i]);
        }
        return _results1;
      })();
      marked_pool = [];
      select = function(event) {
        var new_ts, s, sent, ts, _j, _len, _results1;
        s = c[4].split("\n");
        _results1 = [];
        for (i = _j = 0, _len = sents.length; _j < _len; i = ++_j) {
          sent = sents[i];
          ts = sent.text();
          new_ts = ts.replace(s[i], function(r) {
            var el;
            el = "<span class='selected-code'>" + r + "</span>";
            marked_pool.push(el);
            return el;
          });
          _results1.push(sent.html(new_ts));
        }
        return _results1;
      };
      unselect = function(event) {
        var code, sent, _j, _len, _results1;
        _results1 = [];
        for (_j = 0, _len = sents.length; _j < _len; _j++) {
          sent = sents[_j];
          code = sent.children(".selected-code");
          _results1.push(code.contents().unwrap());
        }
        return _results1;
      };
      return [select, unselect];
    };

    MaxQDADoc.prototype.append_code_svg = function(c, db) {
      var color, e, ee, eep, elm, height, hover, s, se, sep, toppos, unhover, _ref, _ref1, _ref2, _ref3;
      _ref = [c[1], c[2]], s = _ref[0], e = _ref[1];
      _ref1 = [db[s], db[e]], se = _ref1[0], ee = _ref1[1];
      _ref2 = [se.position(), ee.position()], sep = _ref2[0], eep = _ref2[1];
      codes = c[0].split("\\");
      color = CSCALE(codes[1]);
      elm = ECODES_COLSVG.append("rect").attr({
        "class": "marked-code",
        "title": "" + c[0]
      });
      toppos = sep['top'];
      height = s === e ? se.height() : (eep['top'] + ee.height()) - sep['top'];
      elm.attr({
        y: toppos,
        x: 80
      });
      elm.attr({
        height: height,
        width: "20px"
      });
      elm.attr({
        fill: color
      });
      _ref3 = this.render_selection(c, db), hover = _ref3[0], unhover = _ref3[1];
      ($(elm[0])).hover(hover, unhover);
      return elm;
    };

    MaxQDADoc.prototype.append_code = function(c, db) {
      var color, e, ee, eep, elm, height, hover, s, se, sep, toppos, unhover, _ref, _ref1, _ref2, _ref3;
      _ref = [c[1], c[2]], s = _ref[0], e = _ref[1];
      _ref1 = [db[s], db[e]], se = _ref1[0], ee = _ref1[1];
      _ref2 = [se.position(), ee.position()], sep = _ref2[0], eep = _ref2[1];
      codes = c[0].split("\\");
      color = CSCALE(codes[1]);
      elm = $("<div class='marked-code' title='" + c[0] + "'></div>");
      ECODES_COL.append(elm);
      toppos = sep['top'];
      height = s === e ? se.height() : (eep['top'] + ee.height()) - sep['top'];
      elm.css({
        top: toppos,
        left: COL_LEFT
      });
      elm.css({
        height: height
      });
      elm.css({
        "background-color": color
      });
      _ref3 = this.render_selection(c, db), hover = _ref3[0], unhover = _ref3[1];
      elm.hover(hover, unhover);
      return elm;
    };

    MaxQDADoc.prototype.position_element = function(width, mod) {
      var getPosition, position, pushLeft, records;
      if (mod == null) {
        mod = "html";
      }
      records = [];
      getPosition = function(elm) {
        var pos, pos_s;
        if (mod === "html") {
          pos = elm.position();
          return pos_s = {
            top: pos.top,
            left: pos.left,
            end: pos.top + elm.height()
          };
        } else {
          return pos_s = {
            top: parseFloat(elm.attr("y")),
            left: parseFloat(elm.attr("x")),
            end: parseInt(elm.attr("y")) + parseFloat(elm.attr("height"))
          };
        }
      };
      pushLeft = function(elm, curLeft) {
        if (mod === "html") {
          return elm.css({
            left: curLeft - width
          });
        } else {
          return elm.attr("x", curLeft - width);
        }
      };
      position = function(el) {
        var is_good, pos_s, rec, _i, _len;
        pos_s = getPosition(el);
        is_good = true;
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          rec = records[_i];
          if (rec.top !== pos_s.top || rec.left !== pos_s.left) {
            if (rec.left === pos_s.left) {
              is_good = pos_s.top >= rec.end;
            } else {
              "ok";
            }
          } else {
            is_good = false;
          }
        }
        if (!is_good) {
          pushLeft(el, pos_s.left);
          return position(el);
        } else {
          records.push(pos_s);
          return "ok";
        }
      };
      return position;
    };

    MaxQDADoc.prototype.position_element_or = function(width) {
      var position, records;
      records = [];
      position = function(el) {
        var is_good, pos, pos_s, rec, _i, _len;
        pos = el.position();
        pos_s = [pos.top, pos.left, pos.top + el.height()];
        is_good = true;
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          rec = records[_i];
          if (rec[0] !== pos_s[0] || rec[1] !== pos_s[1]) {
            if (rec[1] === pos_s[1]) {
              is_good = pos.top >= rec[2];
            } else {
              "ok";
            }
          } else {
            is_good = false;
          }
        }
        if (!is_good) {
          el.css({
            left: pos.left - width
          });
          return position(el);
        } else {
          records.push(pos_s);
          return "ok";
        }
      };
      return position;
    };

    return MaxQDADoc;

  })();

  $.get("static/public_data/claiming_respect.json", function(d) {
    var data, fcode, k, keys, opt, render_choice, _i, _len;
    data = d["kosovo_docs"];
    render_choice = function(e) {
      var c, k;
      c = EDOC_POOL.children(":selected")[0];
      k = $(c).val();
      return new MaxQDADoc(k, data[k]);
    };
    keys = Object.keys(data);
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      k = keys[_i];
      opt = $("<option value='" + k + "'>" + k + "</option>");
      EDOC_POOL.append(opt);
    }
    EDOC_POOL.change(render_choice);
    fcode = keys[4];
    return new MaxQDADoc(fcode, data[fcode]);
  });

}).call(this);

//# sourceMappingURL=maxqda_docs.js.map
