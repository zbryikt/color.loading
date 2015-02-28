angular.module \color <[]>
  ..controller \main, <[$scope]> ++ ($scope) ->
    r1 = 200
    r2 = 170
    delta = 2
    point = [0 to 360 - delta by delta] 
    rad = -> Math.PI * it / 180
    sep = d3.scale.linear!domain [0 1] .range [0 360]
    tick = [0 to 1 by 1/12]map -> sep it
    color = d3.scale.linear!domain tick  .range <[#f00 #f90 #ff0 #9f0 #0f0 #0f9 #0ff #09f #00f #90f #f0f #f09 #f00]>
    ring-builder = (r1, r2) ->
      return (-> 
        p1x = r1 * Math.cos rad(it + delta / 2)
        p1y = r1 * Math.sin rad(it + delta / 2)
        p2x = r1 * Math.cos rad(it - delta / 2)
        p2y = r1 * Math.sin rad(it - delta / 2)
        p3x = r2 * Math.cos rad(it + delta / 2)
        p3y = r2 * Math.sin rad(it + delta / 2)
        p4x = r2 * Math.cos rad(it - delta / 2)
        p4y = r2 * Math.sin rad(it - delta / 2)
        "M#p1x #p1y L#p2x #p2y L#p4x #p4y L#p3x #p3y Z"
      )
    r2l = -> parseInt(100 * Math.abs(((it + 3600) % 360) - 180) / 180)
    configs = [
      {name: \hue, r1: 200, r2: 180, fill: -> "hsl(#it,100%,50%)", stroke: -> "hsl(#it,100%,50%)"},
      {name: \sat, r1: 170, r2: 150, fill: -> "hsl(#hue,#{r2l(it - hue)}%,50%)", stroke: -> "hsl(#hue,#{r2l(it - hue)}%,50%)"},
      {name: \lit, r1: 140, r2: 120, fill: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(it - hue + 90)}%)", stroke: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(it - hue + 90)}%)"},
      {name: \fin, r1: 110, r2: 80, fill: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(lit)}%)", stroke: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(lit)}%)"},
    ]
    hue = 50
    sat = 100
    lit = 50

    update-ptr = ->

      d3.select \#hue.ptr .attr do
        r: 8
        cx: -> 190 * Math.cos rad(hue)
        cy: -> 190 * Math.sin rad(hue)
        fill: \none
        stroke: \#444
        "stroke-width": \3px

      d3.select \#sat.ptr .attr do
        r: 8
        cx: -> 160 * Math.cos rad(sat + hue)
        cy: -> 160 * Math.sin rad(sat + hue)
        fill: \none
        stroke: \#444
        "stroke-width": \3px

      d3.select \#lit.ptr .attr do
        r: 8
        cx: -> 130 * Math.cos rad(lit + hue - 90)
        cy: -> 130 * Math.sin rad(lit + hue - 90)
        fill: \none
        stroke: \#444
        "stroke-width": \3px

    update = (config) ->
      d3.select "\#svg g.#{config.name}" .selectAll "path.#{config.name}" .attr do
        d: ring-builder config.r1, config.r2
        fill: config.fill
        stroke: config.stroke

    configs.map (config) ->
      d3.select "\#svg g.#{config.name}" .selectAll \path .data point
        ..enter!append \path .attr \class, config.name
        ..exit!remove!
      update config
      #console.log config.r1, config.r2

    pre-which = 0
    target = 0
    $scope.move = (e) ->
      [w,h] = [$(window).width!, $(window).height!]
      mx = e.clientX
      my = e.clientY
      dx = mx - (w/2)
      dy = my - 300
      rx = dx  / Math.sqrt(dx * dx + dy * dy)
      ang = if dy < 0 => 2 * Math.PI - Math.acos(rx) else Math.acos(rx)
      #ang = 360 * (Math.acos(rx) + (if dy > 0 => Math.PI else 0)) / ( 2 * Math.PI )
      ang = 360 * ang / ( 2 * Math.PI )

      r = Math.sqrt(dx * dx + dy * dy)
      if e.which == 1 and pre-which == 0 =>
        ret = configs.map -> (it.r1 >= r and it.r2 <= r)
        for i from 0 to 3 => if ret[i] == true => break
        if i == 3 and r > configs.3.r1 => i = 4
        target := i
        console.log 'target: ', target

      pre-which := e.which
      if e.which == 1 => 
        if target == 0 => hue := ang
        else if target == 1 => sat := ( 720 + ang - hue ) % 360
        else if target == 2 => lit := ( 720 + ang - hue + 90 ) % 360
        else if target == 3 =>
          if r >= configs.3.r1 => r = configs.3.r1
          hue := ang
          sat := 180 - 180 * (r / configs.3.r1)
        update configs.1
        update configs.2
        update configs.3
        update-ptr!


    /*
    $scope.savedPal = []
    $scope.pal = do
      hash: {}
      order: []
      name: "untitled"
      save: ->
        data = [item.hex.replace(/#/,'') for item in @order].join "-"
        $scope.url = data
      load: (data) ->
        @order = [$scope.build(null,hex) for hex in data.split("-")]
        for item in @order => @hash[item.hex] = item
        console.log @order, data
    $scope.edit = do
      hsl: h: 0, s: 0, l: 0
      bind: null
    $scope.update = ->
      tc = tinycolor({} <<< $scope.edit.hsl)
      $scope.edit <<< color: tc.toHsl!, hex: tc.toHexString!, comp: tc.complement!toHexString!
      $scope.edit.triad1 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 240)%360, l:0.5}).toHexString!
      $scope.edit.triad2 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 0)%360, l:0.5}).toHexString!
      $scope.edit.triad3 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 120)%360, l:0.5}).toHexString!
      $scope.edit.analog1 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 320)%360, l:0.5}).toHexString!
      $scope.edit.analog2 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 340)%360, l:0.5}).toHexString!
      $scope.edit.analog3 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h)%360, l:0.5}).toHexString!
      $scope.edit.analog4 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 20)%360, l:0.5}).toHexString!
      $scope.edit.analog5 = tinycolor({} <<< $scope.edit.color <<< {h: ($scope.edit.color.h + 40)%360, l:0.5}).toHexString!
      $scope.edit.random = tinycolor({h: parseInt(Math.random!*360), s: Math.random!, l: Math.random!}).toHexString!
      if $scope.edit.bind => $scope.build that
    $scope.build = (upon, src) ->
      if !upon => upon = {}
      if src =>
        nc = upon <<< tinycolor: tinycolor src
        nc.hsl = nc.tinycolor.toHsl!
      else
        nc = upon <<< $scope.edit{hsl}
        nc.tinycolor = tinycolor({} <<< nc.hsl)
      nc.hex = nc.tinycolor.toHexString!toUpperCase!
      nc.textColor = (if nc.tinycolor.isDark! => 'rgba(255,255,255,0.5)' else 'rgba(0,0,0,0.5)')
      nc
    $scope.scroll = (e) ->
      $scope.edit.hsl.l = $scope.edit.hsl.l + 0.1 * e.wheelDeltaY / $(window).height!
      $scope.edit.hsl.l <?= 1
      $scope.edit.hsl.l >?= 0
      $scope.update!
    $scope.move = (e) ->
      [w,h] = [$(window).width!, $(window).height!]
      if e.which == 1 =>
        $scope.x = e.clientX - 5
        $scope.y = e.clientY - 5
        $scope.edit.hsl.h = 360 * e.clientX / w
        $scope.edit.hsl.s = e.clientY / h
        $scope.update!
    $scope.debind = ->
      if $scope.edit.bind => that.active = false
      $scope.edit.bind = null

    $scope.click = (e, color, debind = false) ->
      if debind => $scope.debind!
      $scope.update!
      nc = $scope.build $scope.edit.bind, color
      nc.active = false
      $scope.edit.bind = null
      if $scope.pal.hash[nc.hex] => return
      if nc.oldHex and $scope.pal.hash[nc.oldHex] => 
        delete $scope.pal.hash[nc.oldHex]
      else $scope.pal.order.push nc
      $scope.pal.hash[nc.hex] = nc
      $scope.pal.save!
    $scope.choose = (c) ->
      if c == $scope.edit.bind => return
      if $scope.edit.bind => 
        b = $scope.edit.bind
        b.active = false
        $scope.build b, b.oldHex
      c.oldHex = c.hex
      c.active = true
      $scope.edit.bind = c
      $scope.edit.hsl = {} <<< c.tinycolor.toHsl!
      $scope.update!
      [w,h] = [$(window).width!, $(window).height!]
      $scope.x = ($scope.edit.hsl.h * w / 360) - 5
      $scope.y = ($scope.edit.hsl.s * h) - 5
    #$scope.pal.load "ff0000-00ff00-0000ff-ffff00-00ffff-ff00ff"
    */

scroll = (e) ->
  s = angular.element("body").scope!
  #s.scroll e 
