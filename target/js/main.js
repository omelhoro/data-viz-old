// Generated by CoffeeScript 1.8.0
(function() {
  var $, MAPS, append_map, chart_wrapper, create_menu, instant, menu, subchoice;

  $ = jQuery;

  MAPS = {
    kosovo_tree: ["Kosovo-Tree", ['', "<h3>Events and Number of Docs</h3><div id='chart_div_anno'></div><div id=chart_div_org></div>"]],
    corpus_of_syl: ["Syllables", ['d3', "htmlj<script type='text/javascript'>forerun_src='templates/corpus_of_sylls.html';predef=[['Russian influenced models','1|2|3'],['Western influenced models','4|5']];data_src='./static/public_data/syl_subset.csv'</script>"]],
    lima_design: ["Lima Project", ['', 'html_']],
    heatplot: ["Cards", ["d3", 'html_']],
    corpus_of_words: ["Child Corpus", ['d3', "htmlj<script type='text/javascript'>forerun_src='templates/corpus_of_words.html';predef=[['Task 4','*4'],['Task 5','*5'],['Task 6','*6']];data_src='./static/data/lima_corpus_group_lemmas.csv'</script>"]],
    rhythm: ["Rhythm & Biography", ['d3', '']],
    rhythm_dyn: ["Dynamics of Rhythm", ['', "<div id='chart_div_end'></div><button id='next-part' class='inter-chart'>Next participant</button><button id='toggle-basis' class='inter-chart'>Toggle letter-class</button><input class='nbin-field'  type=number value=5><button class='bin-update'>Update</button>"]],
    vot: ["VOT", ["d3 TODO: fixplot", 'htmlj']],
    formants: ["Formants", ["d3", 'html_']]
  };

  menu = $(".viz_menu");

  chart_wrapper = $("#chart_wrapper");

  append_map = function(target, el) {
    var content, dir, dom_target, js_lnk, js_target, name, viz_class, _ref, _ref1;
    chart_wrapper.empty();
    _ref = MAPS[target], name = _ref[0], (_ref1 = _ref[1], viz_class = _ref1[0], content = _ref1[1]);
    console.log(name, viz_class, content, MAPS[target]);
    dom_target = $("<div id=chart_div></div>");
    chart_wrapper.append(dom_target);
    dom_target.prop("class", "").prop("style", "");
    js_target = target.split("_of")[0];
    js_lnk = $("<script type='text/javascript' src='target/js/" + js_target + ".js'></script>");
    dom_target.addClass(viz_class);
    ($('.nav > li')).each(function(i, e) {
      return ($(e)).removeClass('active');
    });
    if (el != null) {
      el.addClass("active");
    }
    if (content.indexOf("html") === 0) {
      dir = content[4] === "j" ? 'target' : 'templates';
      content = content.slice(5);
      $.get("" + dir + "/" + js_target + ".html", function(d) {
        return dom_target.html(d);
      });
    }
    chart_wrapper.append($(content));
    return chart_wrapper.append(js_lnk);
  };

  create_menu = function(subchoice) {
    var k, l, lead_to, new_choices, v, _results;
    lead_to = function(target, el) {
      var lead;
      lead = function(e) {
        return append_map(target, el);
      };
      return lead;
    };
    if (subchoice.length > 1) {
      new_choices = 0;
    }
    _results = [];
    for (k in MAPS) {
      v = MAPS[k];
      l = $("<li id=" + k + "><a href='#'>" + v[0] + "</a></li>");
      l.click(lead_to(k, l));
      _results.push(menu.append(l));
    }
    return _results;
  };

  $(".jswarning").remove();

  subchoice = parent.viz_choice;

  if (subchoice != null) {
    if (subchoice.length > 1) {
      create_menu(subchoice);
    } else {
      append_map(subchoice[0]);
    }
  } else {
    create_menu([]);
  }

  instant = 'lima_design';

  ($("#" + instant)).click();

}).call(this);

//# sourceMappingURL=main.js.map
