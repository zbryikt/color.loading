angular.module \sample, <[]>
  ..controller \sample, <[$scope $http $interval]> ++ ($scope, $http, $interval) ->
    name = <[ Barker Stokes Rhodes Salazar Ellis Bradley Sharp Hogan Harvey Briggs ]>
    data = {children: [{
      name: name[parseInt(Math.random!*name.length)], value: Math.random!*100 + 10 } for i from 0 to 100
    ]}


    $http do
      url: \default.json
      method: \GET
    .success (palettes) ->
      $scope.palettes = palettes
      $scope.palette = $scope.palettes.0
      pack = d3.layout.pack!size [800 400] .padding 5 .radius( -> Math.sqrt(it)*10)
      nodes = pack.nodes data .filter -> it.parent

      $scope.update-color = ->
        $scope.color = d3.scale.ordinal!range $scope.palette.palette
        d3.select \#svg .selectAll \circle .transition!duration 500 .attr do
          fill: -> $scope.color it.name
          stroke: -> tinycolor($scope.color it.name).darken 20 .toHexString!
        d3.select \#svg .selectAll \text .transition!duration 500 .attr do
          fill: -> if tinycolor($scope.color it.name).isDark! => \#fff else \#222
      $scope.$watch 'palette', $scope.update-color


      d3.select \#svg .selectAll \circle .data nodes
        ..enter!append \circle
        ..exit!remove!
      $scope.update-color!
      d3.select \#svg .selectAll \circle
        ..attr do
          cx: -> it.x
          cy: -> it.y
          r: -> it.r
          fill: -> $scope.color it.name
          stroke: -> tinycolor($scope.color it.name).darken 20 .toHexString!
          "stroke-width": \2
      d3.select \#svg .selectAll \text .data nodes
        ..enter!append \text
        ..exit!remove!
      d3.select \#svg .selectAll \text
        ..attr do
          x: -> it.x
          y: -> it.y
          fill: -> if tinycolor($scope.color it.name).isDark! => \#fff else \#222
        ..style do
          "text-anchor": \middle
          "dominant-baseline": \central
          "font-size": \12
        ..text -> it.name
      $interval (->
        $scope.palette = $scope.palettes[parseInt($scope.palettes.length * Math.random!)]
      ), 1000
