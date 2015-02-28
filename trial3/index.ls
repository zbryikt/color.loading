angular.module \main, <[]>
  ..controller \main, <[$scope $timeout]> ++ ($scope,$timeout) ->
    arc = d3.svg.arc!innerRadius 100 .outerRadius 120 .startAngle(->it.start) .endAngle(->it.start + it.size)
    data = <[#f99]>
    build-data = ->
      data.map (d,i) -> {start: Math.PI * 2 * i / data.length, size: Math.PI * 2 / data.length, color: d}
    init = (d) ->
      d3.select '#svg g.wheel' .selectAll \path .data d
        ..enter!append \path 
          ..attr do
            "class": \arc
            opacity: 0
        ..exit!remove!
    render = ->
      d3.select '#svg g.wheel' .selectAll \path
        ..transition!duration 500
          ..attr do
            d: arc
            fill: -> it.color
            opacity: 1
    init build-data!
    render!

    $scope.update = ->
      tc = tinycolor {} <<< $scope.hsl
      console.log tc.toHexString!, $scope.hsl
      d3.select \circle#color .attr do
        fill: tc.toHexString!
    $scope.hsl = {}
    $scope.click = ->
      data.push tinycolor({} <<< $scope.hsl).toHexString!
      console.log ")", data.map(-> tinycolor(it).toHsl!h)
      data.sort (a,b) -> tinycolor(b).toHsl!h - tinycolor(a).toHsl!h
      console.log ">", data.map(-> tinycolor(it).toHsl!h)
      init build-data!
      render!
    $scope.move = (e) ->
      [w,h] = [$(window).width!, $(window).height!]
      $scope.hsl.h = 360 * e.clientX / w
      $scope.hsl.s = e.clientY / h
      $scope.update!

    $scope.scroll = (e) ->
      $scope.hsl.l = $scope.hsl.l + 0.1 * e.wheelDeltaY / $(window).height!
      $scope.hsl.l <?= 1
      $scope.hsl.l >?= 0
      $scope.update!

scroll = (e) ->
  s = angular.element("body").scope!
  s.scroll e 
