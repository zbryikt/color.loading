angular.module \sample, <[]>
  ..controller \sample, <[$scope $http]> ++ ($scope, $http) ->
    data = {children: [
      * name: \China,          value: 1369460000
      * name: \India,          value: 1270200000
      * name: 'United States', value:  320858000
      * name: 'Indonesia',     value:  252164800
      * name: 'Brazil',        value:  204210000
      * name: 'Pakistan',      value:  189598000
      * name: 'Nigeria',       value:  173615000
      * name: 'Bangladesh',    value:  158217000
      * name: 'Russia',        value:  146068400
      * name: 'Japan',         value:  127130000
    ]}


    $http do
      url: \default.json
      method: \GET
    .success (palettes) ->
      $scope.palettes = palettes
      $scope.palette = $scope.palettes.0
      pack = d3.layout.pack!size [800 400] .padding 5
      nodes = pack.nodes data .filter -> it.parent
      $scope.update-color = ->
        $scope.color = d3.scale.ordinal!range $scope.palette.palette
        d3.select \#svg .selectAll \circle .transition!duration 500 .attr do
          fill: -> $scope.color it.name
          stroke: -> tinycolor($scope.color it.name).darken 20 .toHexString!

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
