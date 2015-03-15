// Generated by LiveScript 1.2.0
var x$, scroll;
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
        c.width = (100 - primarySize) / count;
        ret.push(c);
      }
      ret[parseInt(Math.random() * ret.length)].width = 20 + (100 - primarySize) / count;
      ret.name = this.name[parseInt(Math.random() * name.length)] + " / " + this.noun[parseInt(Math.random() * this.noun.length)];
      return ret;
    }
  });
}));
x$.controller('ldc-editor', ['$scope', 'ldc-random'].concat(function($scope, ldcRandom){
  var i, this$ = this;
  $scope.pals = ldcRandom.palette(100);
  $scope.refs = ldcRandom.palette(4);
  $scope.featurePals = ldcRandom.palette(4);
  $scope.active = 0;
  $scope.$watch('active', function(){
    return console.log('ok', $scope.active);
  });
  $scope.setActive = function(it){
    var tc, ref$;
    $scope.active = it;
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
    return tc = tinycolor({
      r: parseInt(Math.random() * 256),
      g: parseInt(Math.random() * 256),
      b: parseInt(Math.random() * 256)
    });
  });
  $scope.updatePalette = function(){
    var w;
    w = $scope.wheel;
    $scope.cc[$scope.active] = tinycolor({
      h: w.hue,
      s: w.r2l(w.sat),
      l: w.r2l(w.lit)
    });
    return $scope.wheel.updatePtr();
  };
  $scope.$watch('wheel.hue', function(){
    return $scope.updatePalette();
  });
  $scope.$watch('wheel.sat', function(){
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
      var c;
      rand == null && (rand = false);
      if (rand) {
        c = tinycolor({
          h: parseInt(Math.random() * 360),
          s: parseInt(Math.random() * 100),
          l: parseInt(Math.random() * 100)
        });
        $scope.cc.push(c);
        return $scope.setActive($scope.cc.length - 1);
      } else {
        c = tinycolor({
          h: this.hue,
          s: this.r2l(this.sat),
          l: this.r2l(this.lit)
        });
        if ($scope.cc.map(function(it){
          return it.toHexString();
        }).indexOf(c.toHexString()) === -1) {
          return $scope.cc.push(c);
        }
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
            stroke: '#444'
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
  return $scope.wheel.init();
}));
scroll = function(e){
  var s;
  return s = angular.element("body").scope();
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}