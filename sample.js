// Generated by LiveScript 1.2.0
var x$;
x$ = angular.module('sample', []);
x$.controller('sample', ['$scope', '$http', '$interval'].concat(function($scope, $http, $interval){
  var name, data, i;
  name = ['Barker', 'Stokes', 'Rhodes', 'Salazar', 'Ellis', 'Bradley', 'Sharp', 'Hogan', 'Harvey', 'Briggs'];
  data = {
    children: (function(){
      var i$, results$ = [];
      for (i$ = 0; i$ <= 100; ++i$) {
        i = i$;
        results$.push({
          name: name[parseInt(Math.random() * name.length)],
          value: Math.random() * 100 + 10
        });
      }
      return results$;
    }())
  };
  return $http({
    url: 'default.json',
    method: 'GET'
  }).success(function(palettes){
    var pack, nodes, x$, y$, z$, z1$;
    $scope.palettes = palettes;
    $scope.palette = $scope.palettes[0];
    pack = d3.layout.pack().size([800, 400]).padding(5).radius(function(it){
      return Math.sqrt(it) * 10;
    });
    nodes = pack.nodes(data).filter(function(it){
      return it.parent;
    });
    $scope.updateColor = function(){
      $scope.color = d3.scale.ordinal().range($scope.palette.palette);
      d3.select('#svg').selectAll('circle').transition().duration(500).attr({
        fill: function(it){
          return $scope.color(it.name);
        },
        stroke: function(it){
          return tinycolor($scope.color(it.name)).darken(20).toHexString();
        }
      });
      return d3.select('#svg').selectAll('text').transition().duration(500).attr({
        fill: function(it){
          if (tinycolor($scope.color(it.name)).isDark()) {
            return '#fff';
          } else {
            return '#222';
          }
        }
      });
    };
    $scope.$watch('palette', $scope.updateColor);
    x$ = d3.select('#svg').selectAll('circle').data(nodes);
    x$.enter().append('circle');
    x$.exit().remove();
    $scope.updateColor();
    y$ = d3.select('#svg').selectAll('circle');
    y$.attr({
      cx: function(it){
        return it.x;
      },
      cy: function(it){
        return it.y;
      },
      r: function(it){
        return it.r;
      },
      fill: function(it){
        return $scope.color(it.name);
      },
      stroke: function(it){
        return tinycolor($scope.color(it.name)).darken(20).toHexString();
      },
      "stroke-width": '2'
    });
    z$ = d3.select('#svg').selectAll('text').data(nodes);
    z$.enter().append('text');
    z$.exit().remove();
    z1$ = d3.select('#svg').selectAll('text');
    z1$.attr({
      x: function(it){
        return it.x;
      },
      y: function(it){
        return it.y;
      },
      fill: function(it){
        if (tinycolor($scope.color(it.name)).isDark()) {
          return '#fff';
        } else {
          return '#222';
        }
      }
    });
    z1$.style({
      "text-anchor": 'middle',
      "dominant-baseline": 'central',
      "font-size": '12'
    });
    z1$.text(function(it){
      return it.name;
    });
    return $interval(function(){
      return $scope.palette = $scope.palettes[parseInt($scope.palettes.length * Math.random())];
    }, 1000);
  });
}));