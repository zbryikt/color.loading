angular.module \color <[]>
  ..controller \coloreditor, <[$scope]> ++ ($scope) ->
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
    $scope.feature-pals = [randomColors! for i from 1 to 5]

