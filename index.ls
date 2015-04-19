angular.module \ld.color <[]>
  ..service 'ldc-random', <[$rootScope]> ++ ($rootScope) -> @ <<< do
    tags: <[anime nature item movie festival brand]>
    name: <[ Barker Stokes Rhodes Salazar Ellis Bradley Sharp Hogan Harvey Briggs ]>
    noun: <[ Cloud Community Dinghy Jump Pail Passbook Thing Wasp Century Cherry Deficit Editorial Hub Hydrogen Pelican Puppy Wave ]>
    palette: (count) -> [@generate! for i from 1 to count]
    convert: (raw) ->
      ret = []
      ret.name = raw.name
      for c in raw.palette => 
        tc = tinycolor(c)
        tc.width = 100 / raw.palette.length
        ret.push tc
      ret
    generate: ->
      ret = []
      primary-size = 20
      count = parseInt(Math.random!*10 + 3)
      for i from 1 to count
        c = {h: parseInt(Math.random!*360), s: parseInt(Math.random!*100), l: parseInt(Math.random!*100)}
        c = tinycolor(c)
        c.width = (100 - primary-size)/count
        ret.push c
      ret[parseInt(Math.random!*ret.length)].width = 20 + ((100 - primary-size) / count)
      ret.name = "#{@name[parseInt(Math.random!*@name.length)]} / #{@noun[parseInt(Math.random!*@noun.length)]}"
      ret
    
  ..controller \ldc-editor, <[$scope $http ldc-random]> ++ ($scope, $http, ldc-random) ->
    $scope.myPals = []
    $scope.randomPals = ldc-random.palette 30
    $scope.refs = ldc-random.palette 4
    $scope.history = []
    $scope.feature-pals = ldc-random.palette 4
    $scope.active = 0
    $scope.colorcode = null
    $scope.semantic = do
      options: 
        * label: \danger, value: \danger
        * label: \warning, value: \warning
        * label: \info, value: \info
        * label: \success, value: \success
        * label: \primary, value: \primary
        * label: \default, value: \default
        * label: \none, value: \none
      watch: ->
        c = $scope.cc[$scope.active]
        s = $scope.semantic.value
        v = ((s or {}).target or {})
        u = ((c or {}).semantic or {})
        v.semantic = null
        u.target = null
        s.target = c
        c.semantic = s
    $scope.semantic.value = $scope.semantic.options[* - 1]
    $scope.$watch 'semantic.value', $scope.semantic.watch
    $scope.curpos = parseInt((456 / ($scope.cc or [1]).length) * (0.5))
    $scope.setActive = ->
      $scope.active = it
      $scope.semantic.value = $scope.cc[$scope.active].semantic or $scope.semantic.options[* - 1]
      $scope.curpos = parseInt((456 / $scope.cc.length) * (it + 0.5))
      tc = $scope.cc[$scope.active].toHsl!
      $scope.wheel <<< {hue: tc.h, sat: $scope.wheel.l2r(tc.s * 100), lit: $scope.wheel.l2r(tc.l * 100)}
      $scope.wheel.update-all!
    $scope.cc = [i for i from 0 to parseInt(Math.random!*0) + 0]map ->
      tc = tinycolor r: parseInt(Math.random!*256), g: parseInt(Math.random!*256), b: parseInt(Math.random!*256)

    copy-palette = (pal) -> 
      ret = [(tinycolor(item.toHexString!) <<< item) for item in pal]
      for item in ret => if !item.width => item.width = 100 / ret.length
      ret

    $scope.update-palette = ->
      w = $scope.wheel
      $scope.cc[$scope.active] <<< tinycolor h: w.hue, s: w.r2l(w.sat), l: w.r2l(w.lit)
      $scope.wheel.update-ptr!
      $scope.colorcode = $scope.cc[$scope.active].toHexString!
    $scope.$watch 'colorcode' ->
      ret = /^#[a-fA-F0-9]{6}$/.exec $scope.colorcode
      if ret and $scope.cc[$scope.active].toHexString! != $scope.colorcode =>
        $scope.history.push(copy-palette $scope.cc) # need deep dupe and push after stable
        $scope.cc[$scope.active] <<< tinycolor $scope.colorcode
        tc = $scope.cc[$scope.active].toHsl!
        $scope.wheel <<< {hue: tc.h, sat: $scope.wheel.l2r(tc.s * 100), lit: $scope.wheel.l2r(tc.l * 100)}
        $scope.wheel.update-all!
    $scope.setcolor = (tc, pal=null) ->
      $scope.colorcode = tc.toHexString!
      if pal and $scope.refs.indexOf(pal)== -1 => 
        $scope.refs.splice 0,1
        $scope.refs.push pal
    $scope.setpalette = (pal, isUndo = false) -> 
      if !isUndo => 
        $scope.history.push(copy-palette $scope.cc) # need deep dupe
        if pal and $scope.refs.indexOf(pal)== -1 => 
          $scope.refs.splice 0,1
          $scope.refs.push pal
      for i from 0 til pal.length
        if $scope.cc.length <= i => 
          $scope.cc.push tinycolor pal[i].toHexString!
        else $scope.cc[i] <<< tinycolor pal[i].toHexString!
      if $scope.cc.length > pal.length => $scope.cc.splice pal.length
      $scope.set-active if $scope.active < $scope.cc.length => $scope.active else $scope.cc.length - 1

    $scope.drag-palette-color = (start, offset) ->
      idx-from = parseInt(start / (456 / $scope.cc.length)) 
      idx-to = parseInt((start + offset) / (456 / $scope.cc.length))
      if idx-to == idx-from or idx-to >= $scope.cc.length or idx-from >= $scope.cc.length => return
      $scope.history.push(copy-palette $scope.cc) # need deep dupe and push after stable
      item = $scope.cc.splice idx-from, 1
      before = $scope.cc.splice 0, idx-to
      $scope.cc = before ++ item ++ $scope.cc

    $scope.savePal = ->
      $scope.myPals.push copy-palette $scope.cc
    $scope.undo = ->
      if $scope.history.length =>
        $scope.setpalette $scope.history[* - 1], true
        $scope.history.splice ($scope.history.length - 1), 1
    $scope.random-cc = ->
      random-palette = ldc-random.palette 1
      $scope.setpalette random-palette.0
    $scope.random-refs = -> 
      $scope.refs = ldc-random.palette 4
    $scope.makeRandomPalettes = -> $scope.randomPals = ldc-random.palette 30

    $scope.$watch 'wheel.hue' -> $scope.update-palette!
    $scope.$watch 'wheel.sat' -> $scope.update-palette!
    $scope.$watch 'wheel.lit' -> $scope.update-palette!
    $scope.wheel = do
      hue: 50
      sat: 100
      lit: 50
      delta: 2
      init: ->
        @point = [0 to 360 - @delta by @delta]
        @config.map ~>
          d3.select "\#svg g.#{it.name}" .selectAll \path .data @point
            ..enter!append \path .attr \class, it.name
            ..exit!remove!
          @update it
        @update-ptr!
      add: (rand = false)-> 
        if rand =>
          c = tinycolor {h: parseInt(Math.random!*360), s: parseInt(Math.random!*100), l: parseInt(Math.random!*100)}
          $scope.cc.push c
          $scope.setActive $scope.cc.length - 1
        else
          c = tinycolor({h: @hue, s: @r2l(@sat), l: @r2l(@lit)})
          if $scope.cc.map(-> it.toHexString!).indexOf( c.toHexString! ) == -1 => $scope.cc.push c
      delete: (idx = -1) -> if $scope.cc.length > 1 =>
        $scope.cc.splice ( if idx >= 0 => idx else $scope.active ), 1
        $scope.setActive if $scope.active < $scope.cc.length - 1 => $scope.active else $scope.cc.length - 1

      update: ->
        d3.select "\#svg g.#{it.name}" .selectAll "path.#{it.name}" .attr do
          d: @ring it.r1, it.r2
          fill: (d) ~> it.fill @, d
          stroke: (d) ~> it.stroke @, d
      rad: -> Math.PI * it / 180
      ring: (r1, r2) -> 
        [rad,delta] = [@rad, @delta]
        return (~> 
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
      r2l: -> parseInt(100 * Math.abs(((it + 3600) % 360) - 180) / 180) # radian to lit/sat
      l2r: -> (( it * 180 / 100 ) + 180) % 360
      config: 
        * { 
            name: \hue, r1: 195, r2: 175
            fill: (w,d) -> "hsl(#d,100%,50%)"
            stroke: (w,d) -> "hsl(#d,100%,50%)"
            rad: (w) ~> w.rad(w.hue)
          }
        * { 
            name: \sat, r1: 165, r2: 145
            fill: (w,d) ~> "hsl(#{w.hue},#{w.r2l(d - w.hue)}%,50%)"
            stroke: (w,d) -> "hsl(#{w.hue},#{w.r2l(d - w.hue)}%,50%)"
            rad: (w) ~> w.rad(w.sat + w.hue)
          }
        * { 
            name: \lit, r1: 135, r2: 115
            fill: (w,d) ~> "hsl(#{w.hue},#{w.r2l(w.sat)}%,#{w.r2l(d - w.hue + 90)}%)"
            stroke: (w,d) ~> "hsl(#{w.hue},#{w.r2l(w.sat)}%,#{w.r2l(d - w.hue + 90)}%)"
            rad: (w) ~> w.rad(w.lit + w.hue - 90)
          }
        * { 
            name: \fin, r1: 105, r2: 85
            fill: (w,d) ~> "hsl(#{w.hue},#{w.r2l(w.sat)}%,#{w.r2l(w.lit)}%)"
            stroke: (w,d) ~> "hsl(#{w.hue},#{w.r2l(w.sat)}%,#{w.r2l(w.lit)}%)"
          }
      update-all: ->
        @update @config.1
        @update @config.2
        @update @config.3
        @update-ptr!
      update-ptr: ->
        for cfg in @config => if cfg.rad =>
          d3.select "\##{cfg.name}.ptr" .attr do
            r: -> 0.8 * (cfg.r1 - cfg.r2) / 2
            cx: ~> ( cfg.r1 + cfg.r2 ) / 2 * Math.cos cfg.rad @
            cy: ~> ( cfg.r1 + cfg.r2 ) / 2 * Math.sin cfg.rad @
            fill: \none
            stroke: ~> 
              if cfg.name == \lit and Math.abs(@lit - 180) < 90 => \#fff  else \#444
      pre-which: 0
      target: 0
      move: (e) ->
        [dx,dy] = [e.offsetX - 200, e.offsetY - 200]
        rx = dx  / Math.sqrt(dx * dx + dy * dy)
        ang = if dy < 0 => 2 * Math.PI - Math.acos(rx) else Math.acos(rx)
        ang = 360 * ang / ( 2 * Math.PI )

        r = Math.sqrt(dx * dx + dy * dy)
        if e.which == 1 and @pre-which == 0 =>
          ret = @config.map -> (it.r1 >= r and it.r2 <= r)
          for i from 0 to 3 => if ret[i] == true => break
          if i == 3 and r > @config.3.r1 => i = 4
          @target = i
        target = @target

        @pre-which = e.which
        if e.which == 1 => 
          if target == 0 => @hue = ang
          else if target == 1 => @sat = ( 720 + ang - @hue ) % 360
          else if target == 2 => @lit = ( 720 + ang - @hue + 90 ) % 360
          else if target == 3 =>
            if r >= @config.3.r1 => r = @config.3.r1
            @hue = ang
            @sat = 180 - 180 * (r / @config.3.r1)
          @update-all!
    $http do
      url: \default.json
      method: \GET
    .success (d) ->
      $scope.famousPals = []
      for item in d => 
        $scope.famousPals.push ldc-random.convert item 
        

    $scope.wheel.init!
    $(window)scroll ->
      scroll-top = $(document.body)scroll-top!
      if scroll-top < 60 => $(\#nav-top)removeClass \dim
      else => $(\#nav-top)addClass \dim
      if scroll-top < 380 => $(\#editor-float)addClass \dim
      else => $(\#editor-float)removeClass \dim
      if scroll-top < 380 => $(\#mask)addClass \dim
      else => $(\#mask)removeClass \dim


scroll = (e) ->
  s = angular.element("body").scope!
  #s.scroll e 

drag = do
  editor: do
    color: do
      drag: -> 
        if !@start => 
          @start = $(it.srcElement).width!/2 + $(it.srcElement).offset!left - $(it.srcElement.parentNode).offset!left
      drag-end: -> 
        angular.element("body").scope!drag-palette-color @start, it.offsetX
        @start = null
