// Generated by LiveScript 1.2.0
var x$, scroll;
x$ = angular.module('color', []);
x$.controller('main', ['$scope'].concat(function($scope){
  var name, noun, randomColors, res$, i$, i, r1, r2, delta, point, to$, ridx$, rad, sep, tick, color, ringBuilder, r2l, configs, hue, sat, lit, updatePtr, update, preWhich, target;
  $scope.tags = ['anime', 'nature', 'item', 'movie', 'festival', 'brand'];
  name = ['Barker', 'Stokes', 'Rhodes', 'Salazar', 'Ellis', 'Bradley', 'Sharp', 'Hogan', 'Harvey', 'Briggs'];
  noun = ['Armenian', 'Citizenship', 'Cloud', 'Community', 'Dinghy', 'Jump', 'Pail', 'Passbook', 'Thing', 'Wasp', 'Century', 'Cherry', 'Deficit', 'Editorial', 'Hub', 'Hydrogen', 'Pelican', 'Puppy', 'Snowboarding', 'Wave'];
  randomColors = function(){
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
    ret.name = name[parseInt(Math.random() * name.length)] + " / " + noun[parseInt(Math.random() * noun.length)];
    return ret;
  };
  res$ = [];
  for (i$ = 0; i$ <= 100; ++i$) {
    i = i$;
    res$.push(randomColors());
  }
  $scope.pals = res$;
  res$ = [];
  for (i$ = 0; i$ <= 3; ++i$) {
    i = i$;
    res$.push(randomColors());
  }
  $scope.refs = res$;
  res$ = [];
  for (i$ = 1; i$ <= 4; ++i$) {
    i = i$;
    res$.push(randomColors());
  }
  $scope.featurePals = res$;
  r1 = 200;
  r2 = 170;
  delta = 2;
  res$ = [];
  for (i$ = 0, to$ = 360 - delta; delta < 0 ? i$ >= to$ : i$ <= to$; i$ += delta) {
    ridx$ = i$;
    res$.push(ridx$);
  }
  point = res$;
  rad = function(it){
    return Math.PI * it / 180;
  };
  sep = d3.scale.linear().domain([0, 1]).range([0, 360]);
  tick = (function(){
    var i$, step$, results$ = [];
    for (i$ = 0, step$ = 1 / 12; step$ < 0 ? i$ >= 1 : i$ <= 1; i$ += step$) {
      results$.push(i$);
    }
    return results$;
  }()).map(function(it){
    return sep(it);
  });
  color = d3.scale.linear().domain(tick).range(['#f00', '#f90', '#ff0', '#9f0', '#0f0', '#0f9', '#0ff', '#09f', '#00f', '#90f', '#f0f', '#f09', '#f00']);
  $scope.cc = (function(){
    var i$, to$, results$ = [];
    for (i$ = 0, to$ = parseInt(Math.random() * 1) + 5; i$ <= to$; ++i$) {
      i = i$;
      results$.push(i);
    }
    return results$;
  }()).map(function(){
    var tc;
    tc = tinycolor({
      r: parseInt(Math.random() * 256),
      g: parseInt(Math.random() * 256),
      b: parseInt(Math.random() * 256)
    });
    return tc.toHexString();
  });
  ringBuilder = function(r1, r2){
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
  };
  r2l = function(it){
    return parseInt(100 * Math.abs((it + 3600) % 360 - 180) / 180);
  };
  configs = [
    {
      name: 'hue',
      r1: 195,
      r2: 175,
      fill: function(it){
        return "hsl(" + it + ",100%,50%)";
      },
      stroke: function(it){
        return "hsl(" + it + ",100%,50%)";
      }
    }, {
      name: 'sat',
      r1: 165,
      r2: 145,
      fill: function(it){
        return "hsl(" + hue + "," + r2l(it - hue) + "%,50%)";
      },
      stroke: function(it){
        return "hsl(" + hue + "," + r2l(it - hue) + "%,50%)";
      }
    }, {
      name: 'lit',
      r1: 135,
      r2: 115,
      fill: function(it){
        return "hsl(" + hue + "," + r2l(sat) + "%," + r2l(it - hue + 90) + "%)";
      },
      stroke: function(it){
        return "hsl(" + hue + "," + r2l(sat) + "%," + r2l(it - hue + 90) + "%)";
      }
    }, {
      name: 'fin',
      r1: 105,
      r2: 85,
      fill: function(){
        return "hsl(" + hue + "," + r2l(sat) + "%," + r2l(lit) + "%)";
      },
      stroke: function(){
        return "hsl(" + hue + "," + r2l(sat) + "%," + r2l(lit) + "%)";
      }
    }
  ];
  hue = 50;
  sat = 100;
  lit = 50;
  updatePtr = function(){
    d3.select('#hue.ptr').attr({
      r: 8,
      cx: function(){
        return 185 * Math.cos(rad(hue));
      },
      cy: function(){
        return 185 * Math.sin(rad(hue));
      },
      fill: 'none',
      stroke: '#444',
      "stroke-width": '3px'
    });
    d3.select('#sat.ptr').attr({
      r: 8,
      cx: function(){
        return 155 * Math.cos(rad(sat + hue));
      },
      cy: function(){
        return 155 * Math.sin(rad(sat + hue));
      },
      fill: 'none',
      stroke: '#444',
      "stroke-width": '3px'
    });
    return d3.select('#lit.ptr').attr({
      r: 8,
      cx: function(){
        return 125 * Math.cos(rad(lit + hue - 90));
      },
      cy: function(){
        return 125 * Math.sin(rad(lit + hue - 90));
      },
      fill: 'none',
      stroke: '#444',
      "stroke-width": '3px'
    });
  };
  update = function(config){
    return d3.select("#svg g." + config.name).selectAll("path." + config.name).attr({
      d: ringBuilder(config.r1, config.r2),
      fill: config.fill,
      stroke: config.stroke
    });
  };
  configs.map(function(config){
    var x$;
    x$ = d3.select("#svg g." + config.name).selectAll('path').data(point);
    x$.enter().append('path').attr('class', config.name);
    x$.exit().remove();
    return update(config);
  });
  preWhich = 0;
  target = 0;
  return $scope.move = function(e){
    var ref$, w, h, mx, my, dx, dy, rx, ang, r, ret, i$, i;
    ref$ = [$(window).width(), $(window).height()], w = ref$[0], h = ref$[1];
    mx = e.clientX;
    my = e.clientY;
    dx = e.offsetX - 200;
    dy = e.offsetY - 200;
    rx = dx / Math.sqrt(dx * dx + dy * dy);
    ang = dy < 0
      ? 2 * Math.PI - Math.acos(rx)
      : Math.acos(rx);
    ang = 360 * ang / (2 * Math.PI);
    r = Math.sqrt(dx * dx + dy * dy);
    if (e.which === 1 && preWhich === 0) {
      ret = configs.map(function(it){
        return it.r1 >= r && it.r2 <= r;
      });
      for (i$ = 0; i$ <= 3; ++i$) {
        i = i$;
        if (ret[i] === true) {
          break;
        }
      }
      if (i === 3 && r > configs[3].r1) {
        i = 4;
      }
      target = i;
      console.log('target: ', target);
    }
    console.log(dx, dy, r, target);
    preWhich = e.which;
    if (e.which === 1) {
      if (target === 0) {
        hue = ang;
      } else if (target === 1) {
        sat = (720 + ang - hue) % 360;
      } else if (target === 2) {
        lit = (720 + ang - hue + 90) % 360;
      } else if (target === 3) {
        if (r >= configs[3].r1) {
          r = configs[3].r1;
        }
        hue = ang;
        sat = 180 - 180 * (r / configs[3].r1);
      }
      update(configs[1]);
      update(configs[2]);
      update(configs[3]);
      return updatePtr();
    }
  };
}));
scroll = function(e){
  var s;
  return s = angular.element("body").scope();
};