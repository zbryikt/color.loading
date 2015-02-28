angular.module \color <[]>
  ..controller \main, <[$scope]> ++ ($scope) ->
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

scroll = (e) ->
  s = angular.element("body").scope!
  s.scroll e 
