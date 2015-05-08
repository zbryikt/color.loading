// Generated by LiveScript 1.2.0
var x$, scroll, drag, editor;
x$ = angular.module('ld.color', []);
x$.service('ldc-random', ['$rootScope'].concat(function($rootScope){
  return import$(this, {
    tags: ['anime', 'nature', 'item', 'movie', 'festival', 'brand'],
    name: ['Barker', 'Stokes', 'Rhodes', 'Salazar', 'Ellis', 'Bradley', 'Sharp', 'Hogan', 'Harvey', 'Briggs'],
    noun: ['Cloud', 'Community', 'Dinghy', 'Jump', 'Pail', 'Passbook', 'Thing', 'Wasp', 'Century', 'Cherry', 'Deficit', 'Editorial', 'Hub', 'Hydrogen', 'Pelican', 'Puppy', 'Wave'],
    palette: function(count){
      var i$, i, results$ = [];
      for (i$ = 1; i$ <= count; ++i$) {
        i = i$;
        results$.push(this.generate());
      }
      return results$;
    },
    convert: function(raw){
      var ret, i$, ref$, len$, c, tc;
      ret = [];
      ret.name = raw.name;
      for (i$ = 0, len$ = (ref$ = raw.palette).length; i$ < len$; ++i$) {
        c = ref$[i$];
        tc = tinycolor(c);
        tc.width = 100 / raw.palette.length;
        ret.push(tc);
      }
      return ret;
    },
    generate: function(){
      var ret, primarySize, count, i$, i, c;
      ret = [];
      primarySize = 20;
      count = parseInt(Math.random() * 10 + 3);
      for (i$ = 1; i$ <= count; ++i$) {
        i = i$;
        c = {
          h: parseInt(Math.random() * 360),
          s: parseInt(Math.random() * 100),
          l: parseInt(Math.random() * 100)
        };
        c = tinycolor(c);
        (c.semantic || (c.semantic = {})).value = 'none';
        c.width = (100 - primarySize) / count;
        ret.push(c);
      }
      ret[parseInt(Math.random() * ret.length)].width = 20 + (100 - primarySize) / count;
      ret.name = this.name[parseInt(Math.random() * this.name.length)] + " / " + this.noun[parseInt(Math.random() * this.noun.length)];
      return ret;
    }
  });
}));
x$.controller('ldc-editor', ['$scope', '$http', '$timeout', 'ldc-random'].concat(function($scope, $http, $timeout, ldcRandom){
  var i, copyPalette, this$ = this;
  $scope.myPals = [];
  $scope.randomPals = ldcRandom.palette(30);
  $scope.refs = ldcRandom.palette(4);
  $scope.history = [];
  $scope.featurePals = ldcRandom.palette(4);
  $scope.active = 0;
  $scope.colorcode = null;
  $scope.login = {
    show: false
  };
  $scope.semantic = {
    options: [
      {
        label: 'none',
        value: 'none'
      }, {
        label: 'danger',
        value: 'danger'
      }, {
        label: 'warning',
        value: 'warning'
      }, {
        label: 'info',
        value: 'info'
      }, {
        label: 'success',
        value: 'success'
      }, {
        label: 'primary',
        value: 'primary'
      }, {
        label: 'default',
        value: 'default'
      }
    ],
    watch: function(){
      var c, s, v, u;
      c = $scope.cc[$scope.active];
      s = $scope.semantic.value;
      v = (s || {}).target || {};
      u = (c || {}).semantic || {};
      if (!deepEq$(s, u, '===')) {
        $scope.editor.history.push($scope.cc[$scope.active]);
      }
      v.semantic = null;
      u.target = null;
      s.target = c;
      return c.semantic = s;
    }
  };
  $scope.editor = {
    toggleEditName: function(){
      return this.editNameToggled = !this.editNameToggled;
    },
    output: {
      prepare: function(pal){
        var this$ = this;
        return setTimeout(function(){
          var i$, ref$, len$, name, x$, results$ = [];
          for (i$ = 0, len$ = (ref$ = ['json', 'sass', 'less', 'svg']).length; i$ < len$; ++i$) {
            name = ref$[i$];
            x$ = $("#download-palette .download-option.download-option-" + name);
            x$.attr('href', this$[name](pal));
            x$.attr('download', pal.name + "." + name);
            results$.push(x$);
          }
          return results$;
        }, 0);
      },
      json: function(pal){
        var ret, i$, len$, c, url;
        ret = {
          name: pal.name,
          palette: []
        };
        for (i$ = 0, len$ = pal.length; i$ < len$; ++i$) {
          c = pal[i$];
          ret.palette.push(import$(import$({
            hex: c.toHexString(),
            isDark: c.isDark(),
            semantic: (c.semantic || (c.semantic = {})).value || 'none'
          }, c.toRgb()), c.toHsl()));
        }
        return url = URL.createObjectURL(new Blob([JSON.stringify(ret)], {
          type: "application/json"
        }));
      },
      sass: function(pal){
        var ret1, idx, c, f, ret2, ret, url;
        ret1 = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = pal).length; i$ < len$; ++i$) {
            idx = i$;
            c = ref$[i$];
            results$.push("$color" + idx + ": " + c.toHexString());
          }
          return results$;
        }()).join('\r\n');
        f = pal.filter(function(it){
          return !deepEq$(it.semantic.value, 'none', '===');
        });
        ret2 = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = f).length; i$ < len$; ++i$) {
            idx = i$;
            c = ref$[i$];
            results$.push("$color-" + (c.semantic.value || 'none') + ": " + c.toHexString());
          }
          return results$;
        }()).join('\r\n');
        ret = ret1 + '\r\n' + ret2;
        return url = URL.createObjectURL(new Blob([ret], {
          type: "plain/text"
        }));
      },
      less: function(pal){
        var ret1, idx, c, f, ret2, ret, url;
        ret1 = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = pal).length; i$ < len$; ++i$) {
            idx = i$;
            c = ref$[i$];
            results$.push("@color" + idx + ": " + c.toHexString());
          }
          return results$;
        }()).join('\r\n');
        f = pal.filter(function(it){
          return !deepEq$(it.semantic.value, 'none', '===');
        });
        ret2 = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = f).length; i$ < len$; ++i$) {
            idx = i$;
            c = ref$[i$];
            results$.push("@color-" + (c.semantic.value || 'none') + ": " + c.toHexString());
          }
          return results$;
        }()).join('\r\n');
        ret = ret1 + '\r\n' + ret2;
        return url = URL.createObjectURL(new Blob([ret], {
          type: "plain/text"
        }));
      },
      svg: function(pal){
        var ret1, idx, c, f, ret2, ret, url;
        ret1 = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = pal).length; i$ < len$; ++i$) {
            idx = i$;
            c = ref$[i$];
            results$.push("<linearGradient id='color" + idx + "'><stop stop-color='" + c.toHexString() + "'/></linearGradient>");
          }
          return results$;
        }()).join('\r\n');
        f = pal.filter(function(it){
          return !deepEq$(it.semantic.value, 'none', '===');
        });
        ret2 = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = f).length; i$ < len$; ++i$) {
            idx = i$;
            c = ref$[i$];
            results$.push("<linearGradient id='color" + (c.semantic.value || 'none') + "'><stop stop-color='" + c.toHexString() + "'/></linearGradient>");
          }
          return results$;
        }()).join('\r\n');
        ret = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"><svg xmlns:svg=\"http://www.w3.org/2000/svg\"><defs>" + ret1 + ret2 + "</defs></svg>";
        return url = URL.createObjectURL(new Blob([ret], {
          type: "image/svg+xml"
        }));
      },
      ase: function(pal){}
    },
    history: {
      data: [],
      isEmpty: true,
      push: function(it){
        this.isEmpty = false;
        return this.data.push(copyPalette($scope.cc));
      },
      pop: function(){
        var ret;
        if (!this.data.length) {
          return;
        }
        ret = this.data.splice(this.data.length - 1, 1)[0];
        $scope.setpalette(ret, true);
        if (!this.data.length) {
          return this.isEmpty = true;
        }
      }
    }
  };
  $scope.color = {
    create: function(colorOption, config){
      var ref$;
      config == null && (config = {});
      return import$((ref$ = tinycolor(colorOption), ref$.semantic = $scope.semantic.options[0], ref$), config);
    },
    update: function(tc, value, config){
      return import$(import$(tc, tinycolor(value)), config);
    }
  };
  $scope.semantic.value = $scope.semantic.options[0];
  $scope.$watch('semantic.value', $scope.semantic.watch);
  $scope.curpos = parseInt((456 / ($scope.cc || [1]).length) * 0.5);
  $scope.setActive = function(it){
    var tc, ref$;
    $scope.active = it;
    $scope.semantic.value = $scope.cc[$scope.active].semantic || $scope.semantic.options[0];
    $scope.curpos = parseInt((456 / $scope.cc.length) * (it + 0.5));
    tc = $scope.cc[$scope.active].toHsl();
    ref$ = $scope.wheel;
    ref$.hue = tc.h;
    ref$.sat = $scope.wheel.l2r(tc.s * 100);
    ref$.lit = $scope.wheel.l2r(tc.l * 100);
    return $scope.wheel.updateAll();
  };
  $scope.cc = (function(){
    var i$, to$, results$ = [];
    for (i$ = 0, to$ = parseInt(Math.random() * 0) + 0; i$ <= to$; ++i$) {
      i = i$;
      results$.push(i);
    }
    return results$;
  }()).map(function(){
    var tc;
    return tc = $scope.color.create({
      r: parseInt(Math.random() * 256),
      g: parseInt(Math.random() * 256),
      b: parseInt(Math.random() * 256)
    });
  });
  $scope.cc.name = "My Palette";
  copyPalette = function(pal){
    var ret, res$, i$, len$, item;
    res$ = [];
    for (i$ = 0, len$ = pal.length; i$ < len$; ++i$) {
      item = pal[i$];
      res$.push(import$($scope.color.create(item.toHexString()), item));
    }
    ret = res$;
    for (i$ = 0, len$ = ret.length; i$ < len$; ++i$) {
      item = ret[i$];
      if (!item.width) {
        item.width = 100 / ret.length;
      }
    }
    ret.name = pal.name;
    ret.category = pal.category;
    ret.key = pal.key;
    return ret;
  };
  $scope.showPaletteStringDialog = function(){
    return setTimeout(function(){
      $scope.paletteString = JSON.stringify({
        name: $scope.cc.name || 'untitled',
        palette: $scope.cc.map(function(it, idx){
          return {
            id: idx,
            code: it.toHexString(),
            type: (it.semantic || (it.semantic = {})).value || 'none'
          };
        })
      });
      return $('#palette-string-dialog').modal('show');
    }, 0);
  };
  $scope.updatePalette = function(){
    var w;
    w = $scope.wheel;
    $scope.color.update($scope.cc[$scope.active], {
      h: w.hue,
      s: w.r2l(w.sat),
      l: w.r2l(w.lit)
    });
    $scope.wheel.updatePtr();
    return $scope.colorcode = $scope.cc[$scope.active].toHexString();
  };
  $scope.$watch('colorcode', function(){
    var ret, tc, ref$;
    ret = /^#[a-fA-F0-9]{6}$/.exec($scope.colorcode);
    if (ret && $scope.cc[$scope.active].toHexString() !== $scope.colorcode) {
      $scope.editor.history.push($scope.cc);
      import$($scope.cc[$scope.active], $scope.color.create($scope.colorcode));
      tc = $scope.cc[$scope.active].toHsl();
      ref$ = $scope.wheel;
      ref$.hue = tc.h;
      ref$.sat = $scope.wheel.l2r(tc.s * 100);
      ref$.lit = $scope.wheel.l2r(tc.l * 100);
      return $scope.wheel.updateAll();
    }
  });
  $scope.setcolor = function(tc, pal){
    pal == null && (pal = null);
    $scope.colorcode = tc.toHexString();
    if (pal && $scope.refs.indexOf(pal) === -1) {
      $scope.refs.splice(0, 1);
      return $scope.refs.push(pal);
    }
  };
  $scope.setpalette = function(pal, isUndo){
    var i$, to$, i, ref$;
    isUndo == null && (isUndo = false);
    if (!isUndo) {
      $scope.editor.history.push($scope.cc);
      if (pal && $scope.refs.indexOf(pal) === -1) {
        $scope.refs.splice(0, 1);
        $scope.refs.push(pal);
      }
    }
    for (i$ = 0, to$ = pal.length; i$ < to$; ++i$) {
      i = i$;
      if ($scope.cc.length <= i) {
        $scope.cc.push($scope.color.create(pal[i].toHexString(), {
          semantic: pal[i].semantic
        }));
      } else {
        import$($scope.cc[i], $scope.color.create(pal[i].toHexString(), {
          semantic: pal[i].semantic
        }));
      }
      ref$ = $scope.cc;
      ref$.name = pal.name;
      ref$.category = pal.category;
      ref$.key = pal.key;
    }
    if ($scope.cc.length > pal.length) {
      $scope.cc.splice(pal.length);
    }
    return $scope.setActive($scope.active < $scope.cc.length
      ? $scope.active
      : $scope.cc.length - 1);
  };
  $scope.dragPaletteColor = function(start, offset){
    var idxFrom, idxTo, name, item, before;
    idxFrom = parseInt(start / (456 / $scope.cc.length));
    idxTo = parseInt((start + offset) / (456 / $scope.cc.length));
    if (idxTo === idxFrom || idxTo >= $scope.cc.length || idxFrom >= $scope.cc.length) {
      return;
    }
    $scope.editor.history.push($scope.cc);
    name = $scope.cc.name;
    item = $scope.cc.splice(idxFrom, 1);
    before = $scope.cc.splice(0, idxTo);
    $scope.cc = before.concat(item, $scope.cc);
    return $scope.cc.name = name;
  };
  $scope.delPal = function(pal){
    if (!pal.key) {
      return;
    }
    return $http({
      url: "/palette/" + pal.key,
      method: 'DELETE'
    }).success(function(d){
      var i;
      $scope.myPals = $scope.myPals.filter(function(it){
        return it.key !== pal.key;
      });
      if ($scope.cc = pal.key) {
        $scope.cc = (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = parseInt(Math.random() * 0) + 0; i$ <= to$; ++i$) {
            i = i$;
            results$.push(i);
          }
          return results$;
        }()).map(function(){
          var tc;
          return tc = $scope.color.create({
            r: parseInt(Math.random() * 256),
            g: parseInt(Math.random() * 256),
            b: parseInt(Math.random() * 256)
          });
        });
        return $scope.cc.name = "My Palette";
      }
    });
  };
  $scope.savePal = function(){
    var idx, pal, payload, item;
    idx = $scope.myPals.map(function(it){
      return it.key;
    }).indexOf($scope.cc.key);
    if (idx === -1) {
      $scope.myPals.push(pal = copyPalette($scope.cc));
    } else {
      $scope.myPals[idx] = pal = copyPalette($scope.cc);
    }
    payload = {
      name: pal.name,
      colors: (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = pal).length; i$ < len$; ++i$) {
          item = ref$[i$];
          results$.push({
            hex: item.toHexString(),
            semantic: (item.semantic || (item.semantic = {})).value || 'none'
          });
        }
        return results$;
      }())
    };
    return $http({
      url: pal.key ? "/palette/" + pal.key : "/palette/",
      method: pal.key ? 'PUT' : 'POST',
      data: payload
    }).success(function(d){
      console.log("saved.", d);
      return $scope.cc.key = pal.key = d.key;
    });
  };
  $scope.undo = function(){
    return $scope.editor.history.pop();
  };
  $scope.randomCc = function(){
    var randomPalette;
    randomPalette = ldcRandom.palette(1);
    return $scope.setpalette(randomPalette[0]);
  };
  $scope.randomRefs = function(){
    return $scope.refs = ldcRandom.palette(4);
  };
  $scope.makeRandomPalettes = function(){
    return $scope.randomPals = ldcRandom.palette(30);
  };
  $scope.$watch('wheel.hue', function(){
    $scope.wheel.updatePolar();
    return $scope.updatePalette();
  });
  $scope.$watch('wheel.sat', function(){
    $scope.wheel.updatePolar();
    return $scope.updatePalette();
  });
  $scope.$watch('wheel.lit', function(){
    return $scope.updatePalette();
  });
  $scope.wheel = {
    hue: 50,
    sat: 100,
    lit: 50,
    delta: 2,
    x: 0,
    y: 0,
    updatePolar: function(){
      var a, r;
      a = Math.PI * this.hue / 180;
      r = this.r2l(this.sat) * 0.6;
      this.x = 195 + r * Math.cos(a);
      return this.y = 195 + r * Math.sin(a);
    },
    init: function(){
      var res$, i$, step$, to$, ridx$, this$ = this;
      res$ = [];
      for (i$ = 0, to$ = 360 - this.delta, step$ = this.delta; step$ < 0 ? i$ >= to$ : i$ <= to$; i$ += step$) {
        ridx$ = i$;
        res$.push(ridx$);
      }
      this.point = res$;
      this.config.map(function(it){
        var x$;
        x$ = d3.select("#svg g." + it.name).selectAll('path').data(this$.point);
        x$.enter().append('path').attr('class', it.name);
        x$.exit().remove();
        return this$.update(it);
      });
      return this.updatePtr();
    },
    add: function(rand){
      rand == null && (rand = false);
      $scope.editor.history.push($scope.cc);
      if (rand) {
        $scope.cc.push($scope.color.create({
          h: parseInt(Math.random() * 360),
          s: parseInt(Math.random() * 100),
          l: parseInt(Math.random() * 100)
        }));
        return $scope.setActive($scope.cc.length - 1);
      } else if ($scope.cc.map(function(it){
        return it.toHexString();
      }).indexOf(new tinycolor({
        h: this.hue,
        s: this.r2l(this.sat),
        l: this.r2l(this.lit)
      }).toHexString()) === -1) {
        return $scope.cc.push($scope.color.create({
          h: this.hue,
          s: this.r2l(this.sat),
          l: this.r2l(this.lit)
        }));
      }
    },
    'delete': function(idx){
      idx == null && (idx = -1);
      if ($scope.cc.length > 1) {
        $scope.cc.splice(idx >= 0
          ? idx
          : $scope.active, 1);
        return $scope.setActive($scope.active < $scope.cc.length - 1
          ? $scope.active
          : $scope.cc.length - 1);
      }
    },
    update: function(it){
      var this$ = this;
      return d3.select("#svg g." + it.name).selectAll("path." + it.name).attr({
        d: this.ring(it.r1, it.r2),
        fill: function(d){
          return it.fill(this$, d);
        },
        stroke: function(d){
          return it.stroke(this$, d);
        }
      });
    },
    rad: function(it){
      return Math.PI * it / 180;
    },
    ring: function(r1, r2){
      var ref$, rad, delta, this$ = this;
      ref$ = [this.rad, this.delta], rad = ref$[0], delta = ref$[1];
      return function(it){
        var p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y;
        p1x = r1 * Math.cos(rad(it + delta / 2));
        p1y = r1 * Math.sin(rad(it + delta / 2));
        p2x = r1 * Math.cos(rad(it - delta / 2));
        p2y = r1 * Math.sin(rad(it - delta / 2));
        p3x = r2 * Math.cos(rad(it + delta / 2));
        p3y = r2 * Math.sin(rad(it + delta / 2));
        p4x = r2 * Math.cos(rad(it - delta / 2));
        p4y = r2 * Math.sin(rad(it - delta / 2));
        return "M" + p1x + " " + p1y + " L" + p2x + " " + p2y + " L" + p4x + " " + p4y + " L" + p3x + " " + p3y + " Z";
      };
    },
    r2l: function(it){
      return parseInt(100 * Math.abs((it + 3600) % 360 - 180) / 180);
    },
    l2r: function(it){
      return (it * 180 / 100 + 180) % 360;
    },
    config: [
      {
        name: 'hue',
        r1: 195,
        r2: 175,
        fill: function(w, d){
          return "hsl(" + d + ",100%,50%)";
        },
        stroke: function(w, d){
          return "hsl(" + d + ",100%,50%)";
        },
        rad: function(w){
          return w.rad(w.hue);
        }
      }, {
        name: 'sat',
        r1: 165,
        r2: 145,
        fill: function(w, d){
          return "hsl(" + w.hue + "," + w.r2l(d - w.hue) + "%,50%)";
        },
        stroke: function(w, d){
          return "hsl(" + w.hue + "," + w.r2l(d - w.hue) + "%,50%)";
        },
        rad: function(w){
          return w.rad(w.sat + w.hue);
        }
      }, {
        name: 'lit',
        r1: 135,
        r2: 115,
        fill: function(w, d){
          return "hsl(" + w.hue + "," + w.r2l(w.sat) + "%," + w.r2l(d - w.hue + 90) + "%)";
        },
        stroke: function(w, d){
          return "hsl(" + w.hue + "," + w.r2l(w.sat) + "%," + w.r2l(d - w.hue + 90) + "%)";
        },
        rad: function(w){
          return w.rad(w.lit + w.hue - 90);
        }
      }, {
        name: 'fin',
        r1: 105,
        r2: 85,
        fill: function(w, d){
          return "hsl(" + w.hue + "," + w.r2l(w.sat) + "%," + w.r2l(w.lit) + "%)";
        },
        stroke: function(w, d){
          return "hsl(" + w.hue + "," + w.r2l(w.sat) + "%," + w.r2l(w.lit) + "%)";
        }
      }
    ],
    updateAll: function(){
      this.update(this.config[1]);
      this.update(this.config[2]);
      this.update(this.config[3]);
      return this.updatePtr();
    },
    updatePtr: function(){
      var i$, ref$, len$, cfg, results$ = [], this$ = this;
      for (i$ = 0, len$ = (ref$ = this.config).length; i$ < len$; ++i$) {
        cfg = ref$[i$];
        if (cfg.rad) {
          results$.push(d3.select("#" + cfg.name + ".ptr").attr({
            r: fn$,
            cx: fn1$,
            cy: fn2$,
            fill: 'none',
            stroke: fn3$
          }));
        }
      }
      return results$;
      function fn$(){
        return 0.8 * (cfg.r1 - cfg.r2) / 2;
      }
      function fn1$(){
        return (cfg.r1 + cfg.r2) / 2 * Math.cos(cfg.rad(this$));
      }
      function fn2$(){
        return (cfg.r1 + cfg.r2) / 2 * Math.sin(cfg.rad(this$));
      }
      function fn3$(){
        if (cfg.name === 'lit' && Math.abs(this$.lit - 180) < 90) {
          return '#fff';
        } else {
          return '#444';
        }
      }
    },
    preWhich: 0,
    target: 0,
    move: function(e){
      var ref$, dx, dy, rx, ang, r, ret, i$, i, target;
      ref$ = [e.offsetX - 200, e.offsetY - 200], dx = ref$[0], dy = ref$[1];
      rx = dx / Math.sqrt(dx * dx + dy * dy);
      ang = dy < 0
        ? 2 * Math.PI - Math.acos(rx)
        : Math.acos(rx);
      ang = 360 * ang / (2 * Math.PI);
      r = Math.sqrt(dx * dx + dy * dy);
      if (e.which === 1 && this.preWhich === 0) {
        ret = this.config.map(function(it){
          return it.r1 >= r && it.r2 <= r;
        });
        for (i$ = 0; i$ <= 3; ++i$) {
          i = i$;
          if (ret[i] === true) {
            break;
          }
        }
        if (i === 3 && r > this.config[3].r1) {
          i = 4;
        }
        this.target = i;
      }
      target = this.target;
      this.preWhich = e.which;
      if (e.which === 1) {
        if (target === 0) {
          this.hue = ang;
        } else if (target === 1) {
          this.sat = (720 + ang - this.hue) % 360;
        } else if (target === 2) {
          this.lit = (720 + ang - this.hue + 90) % 360;
        } else if (target === 3) {
          if (r >= this.config[3].r1) {
            r = this.config[3].r1;
          }
          this.hue = ang;
          this.sat = 180 - 180 * (r / this.config[3].r1);
        }
        return this.updateAll();
      }
    }
  };
  $http({
    url: 'default.json',
    method: 'GET'
  }).success(function(d){
    var i$, len$, item, results$ = [];
    $scope.famousPals = [];
    for (i$ = 0, len$ = d.length; i$ < len$; ++i$) {
      item = d[i$];
      results$.push($scope.famousPals.push(ldcRandom.convert(item)));
    }
    return results$;
  });
  $http({
    url: '/palette/?user=tkirby',
    method: 'GET'
  }).success(function(data){
    var list, i$, len$, item, obj, j$, ref$, len1$, c, tc;
    list = [];
    for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
      item = data[i$];
      obj = [];
      obj.name = item.name;
      obj.cateogry = item.cateogry;
      obj.key = item.key;
      for (j$ = 0, len1$ = (ref$ = item.colors).length; j$ < len1$; ++j$) {
        c = ref$[j$];
        tc = tinycolor(c.hex);
        tc.semantic = $scope.semantic.options.filter(fn$)[0] || $scope.semantic.options[0];
        tc.width = 100 / item.colors.length;
        obj.push(tc);
      }
      list.push(obj);
    }
    return $scope.myPals = list;
    function fn$(it){
      return it.value === c.semantic;
    }
  });
  $scope.wheel.init();
  $(window).scroll(function(){
    var scrollTop;
    scrollTop = $(document.body).scrollTop();
    if (scrollTop < 60) {
      $('#nav-top').removeClass('dim');
    } else {
      $('#nav-top').addClass('dim');
    }
    if (scrollTop < 380) {
      $('#editor-float').addClass('dim');
    } else {
      $('#editor-float').removeClass('dim');
    }
    if (scrollTop < 380) {
      return $('#mask').addClass('dim');
    } else {
      return $('#mask').removeClass('dim');
    }
  });
  return $('#download-palette').popover({
    html: true,
    container: '#download-palette',
    content: "Download via ... " + "<a class='download-option download-option-json'> json </div>" + "<a class='download-option download-option-sass'> sass </div>" + "<a class='download-option download-option-less'> less </div>" + "<a class='download-option download-option-ase'> ase </div>" + "<a class='download-option download-option-svg'> svg </div>",
    placement: "bottom"
  });
}));
scroll = function(e){
  var s;
  return s = angular.element("body").scope();
};
drag = {
  editor: {
    color: {
      drag: function(it){
        if (!this.start) {
          return this.start = $(it.srcElement).width() / 2 + $(it.srcElement).offset().left - $(it.srcElement.parentNode).offset().left;
        }
      },
      dragEnd: function(it){
        angular.element("body").scope().dragPaletteColor(this.start, it.offsetX);
        return this.start = null;
      }
    }
  }
};
editor = {
  output: function(type){
    var $scope;
    $scope = angular.element('body').scope();
    return alert($scope.editor.output[type]($scope.cc));
  }
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
function deepEq$(x, y, type){
  var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
      has = function (obj, key) { return hasOwnProperty.call(obj, key); };
  var first = true;
  return eq(x, y, []);
  function eq(a, b, stack) {
    var className, length, size, result, alength, blength, r, key, ref, sizeB;
    if (a == null || b == null) { return a === b; }
    if (a.__placeholder__ || b.__placeholder__) { return true; }
    if (a === b) { return a !== 0 || 1 / a == 1 / b; }
    className = toString.call(a);
    if (toString.call(b) != className) { return false; }
    switch (className) {
      case '[object String]': return a == String(b);
      case '[object Number]':
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        return +a == +b;
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') { return false; }
    length = stack.length;
    while (length--) { if (stack[length] == a) { return true; } }
    stack.push(a);
    size = 0;
    result = true;
    if (className == '[object Array]') {
      alength = a.length;
      blength = b.length;
      if (first) { 
        switch (type) {
        case '===': result = alength === blength; break;
        case '<==': result = alength <= blength; break;
        case '<<=': result = alength < blength; break;
        }
        size = alength;
        first = false;
      } else {
        result = alength === blength;
        size = alength;
      }
      if (result) {
        while (size--) {
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
        }
      }
    } else {
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
        return false;
      }
      for (key in a) {
        if (has(a, key)) {
          size++;
          if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
        }
      }
      if (result) {
        sizeB = 0;
        for (key in b) {
          if (has(b, key)) { ++sizeB; }
        }
        if (first) {
          if (type === '<<=') {
            result = size < sizeB;
          } else if (type === '<==') {
            result = size <= sizeB
          } else {
            result = size === sizeB;
          }
        } else {
          first = false;
          result = size === sizeB;
        }
      }
    }
    stack.pop();
    return result;
  }
}