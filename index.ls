angular.module \color <[]>
  ..controller \main, <[$scope]> ++ ($scope) ->

    $scope.tags = <[anime nature item movie festival brand]>
    name = <[Barker Stokes Rhodes Salazar Ellis Bradley Sharp Hogan Harvey Briggs]>
    noun = <[Armenian Citizenship Cloud Community Dinghy Jump Pail Passbook Thing Wasp Century Cherry Deficit Editorial Hub Hydrogen Pelican Puppy Snowboarding Wave]>
    randomColors = ->
      ret = []
      primary-size = 20
      count = parseInt(Math.random!*10 + 3)
      for i from 1 to count
        c = {h: parseInt(Math.random!*360), s: parseInt(Math.random!*100), l: parseInt(Math.random!*100)}
        c = tinycolor(c)
        c.width = (100 - primary-size)/count
        ret.push c
      ret[parseInt(Math.random!*ret.length)].width = 20 + ((100 - primary-size) / count)
      ret.name = "#{name[parseInt(Math.random!*name.length)]} / #{noun[parseInt(Math.random!*noun.length)]}"
      ret
    $scope.pals = [randomColors! for i from 0 to 100]
    $scope.refs = [randomColors! for i from 0 to 3]
    $scope.feature-pals = [randomColors! for i from 1 to 4]

    r1 = 200
    r2 = 170
    delta = 2
    point = [0 to 360 - delta by delta] 
    rad = -> Math.PI * it / 180
    sep = d3.scale.linear!domain [0 1] .range [0 360]
    tick = [0 to 1 by 1/12]map -> sep it
    color = d3.scale.linear!domain tick  .range <[#f00 #f90 #ff0 #9f0 #0f0 #0f9 #0ff #09f #00f #90f #f0f #f09 #f00]>
    $scope.cc = [i for i from 0 to parseInt(Math.random!*1) + 5]map ->
      tc = tinycolor r: parseInt(Math.random!*256), g: parseInt(Math.random!*256), b: parseInt(Math.random!*256)
      tc.toHexString!
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
      {name: \hue, r1: 195, r2: 175, fill: -> "hsl(#it,100%,50%)", stroke: -> "hsl(#it,100%,50%)"},
      {name: \sat, r1: 165, r2: 145, fill: -> "hsl(#hue,#{r2l(it - hue)}%,50%)", stroke: -> "hsl(#hue,#{r2l(it - hue)}%,50%)"},
      {name: \lit, r1: 135, r2: 115, fill: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(it - hue + 90)}%)", stroke: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(it - hue + 90)}%)"},
      {name: \fin, r1: 105, r2: 85, fill: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(lit)}%)", stroke: -> "hsl(#hue,#{r2l(sat)}%,#{r2l(lit)}%)"},
    ]
    hue = 50
    sat = 100
    lit = 50

    update-ptr = ->

      d3.select \#hue.ptr .attr do
        r: 8
        cx: -> 185 * Math.cos rad(hue)
        cy: -> 185 * Math.sin rad(hue)
        fill: \none
        stroke: \#444
        "stroke-width": \3px

      d3.select \#sat.ptr .attr do
        r: 8
        cx: -> 155 * Math.cos rad(sat + hue)
        cy: -> 155 * Math.sin rad(sat + hue)
        fill: \none
        stroke: \#444
        "stroke-width": \3px

      d3.select \#lit.ptr .attr do
        r: 8
        cx: -> 125 * Math.cos rad(lit + hue - 90)
        cy: -> 125 * Math.sin rad(lit + hue - 90)
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
      #dx = mx - (w/2)
      #dy = my - 300
      #dx = mx - $("svg").offset!left - 200
      #dy = my - $("svg").offset!top - 200
      dx = e.offsetX - 200
      dy = e.offsetY - 200
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
      console.log dx, dy, r, target

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

scroll = (e) ->
  s = angular.element("body").scope!
  #s.scroll e 
