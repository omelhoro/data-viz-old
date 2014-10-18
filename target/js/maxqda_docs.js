// Generated by CoffeeScript 1.8.0
(function() {
  var append_code, append_text, c, code_pool, codes, codes_col, codes_csv, col_left, coords, cscale, el, new_text, position, position_element, render_selection, sent_pool, split_codes, srt, text, _i, _len;

  text = ($("#max-qda-doc")).val();

  codes = ($("#codes")).val();

  new_text = $("#text");

  codes_col = $("#codes-col");

  split_codes = function(c) {
    var l, last_line, pool, pool_last_ix, _i, _len, _ref;
    pool = [];
    _ref = c.split("\n");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      if (l[0] === ",") {
        pool.push(l);
      } else {
        pool_last_ix = pool.length - 1;
        last_line = pool[pool_last_ix];
        pool[pool_last_ix] = last_line + "\n" + l;
      }
    }
    return pool;
  };

  append_text = function(t) {
    var i, l, newt, pool, sent, _i, _len;
    sent = function(i, s) {
      if (s === "") {
        return s = [i, $("<p></p>")];
      } else {
        return s = [i, $("<span class='sent' data-sentix=" + i + ">" + i + "-" + s + "</span>")];
      }
    };
    pool = {};
    for (i = _i = 0, _len = t.length; _i < _len; i = ++_i) {
      l = t[i];
      newt = sent(i, l);
      new_text.append(newt[1]);
      pool[i] = newt[1];
    }
    return pool;
  };

  cscale = d3.scale.category20();

  render_selection = function(c, db) {
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

  col_left = codes_col.width();

  append_code = function(c, db) {
    var color, e, ee, eep, elm, height, hover, s, se, sep, toppos, unhover, _ref, _ref1, _ref2, _ref3;
    _ref = [c[1], c[2]], s = _ref[0], e = _ref[1];
    _ref1 = [db[s], db[e]], se = _ref1[0], ee = _ref1[1];
    _ref2 = [se.position(), ee.position()], sep = _ref2[0], eep = _ref2[1];
    codes = c[0].split("\\");
    color = cscale(codes[1]);
    elm = $("<div class='marked-code' title='" + c[0] + "'></div>");
    codes_col.append(elm);
    toppos = sep['top'];
    height = s === e ? se.height() : (eep['top'] + ee.height()) - sep['top'];
    elm.css({
      top: toppos,
      left: col_left
    });
    elm.css({
      height: height
    });
    elm.css({
      "background-color": color
    });
    _ref3 = render_selection(c, db), hover = _ref3[0], unhover = _ref3[1];
    elm.hover(hover, unhover);
    return elm;
  };

  position_element = function(width) {
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

  sent_pool = append_text(text.split("\n"));

  code_pool = split_codes(codes);

  codes_csv = code_pool.map(function(l) {
    var parsed;
    parsed = d3.csv.parseRows(l)[0].slice(2, 7);
    return parsed.map(function(e) {
      return parseInt(e) + 1 || e;
    });
  });

  srt = codes_csv.sort(function(a, b) {
    return a[1] > b[1];
  });

  position = position_element(20);

  for (_i = 0, _len = srt.length; _i < _len; _i++) {
    c = srt[_i];
    coords = {};
    el = append_code(c, sent_pool);
    position(el);
  }

}).call(this);

//# sourceMappingURL=maxqda_docs.js.map
