angular.module \color <[]>
  ..controller \coloreditor, <[$scope]> ++ ($scope) ->
    $scope.pal = []
    $scope.cur = {h: 0, s: 0, l: 0}
    $scope.makecolor = (h,s,l) -> tinycolor {h,s,l} 
    $scope.add = ->
      c = $scope.makecolor $scope.cur.h, $scope.cur.s, $scope.cur.l
      console.log c, c.toHexString!
      $scope.pal.push c

