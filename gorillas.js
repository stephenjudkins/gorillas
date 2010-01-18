var Gorillas = (function() {

  var gravity = 10;
  var width = 1000;
  var height = 400;

  var r = 20;

  var Path = function(vx, vy) {
    this.vx = vx, this.vy = vy;
  };

  Path.prototype = {
    positionAt: function (t) {
      var y = (-gravity * Math.pow(t, 2)) + (this.vy * t);
      var x = this.vx * t;

      return [x, height - y];
    },
    toss: function() {
      var bottom = this.bottom();
      var peak = this.peak();
      // console.log(peak);
      drawTarget(bottom[0], height);
      drawTarget(peak[0], peak[1]);

      var origin = '0 ' + height;

      var control = bottom[0] / 2 + ' ' + (height - ((height - peak[1]) * 2));

      var end = bottom[0] + ' ' + height;

      var p = 'M ' + origin +
        ' Q ' + control + ' ' + end;

      console.log(p);
      var path = paper.path(p);
      path.attr({stroke:"#555", "stroke-width":2, "stroke-dasharray":"- ", "stroke-opacity":1});
      path.animate({"opacity":0}, 1800, "<");

      var vx = this.vx, vy = this.vy;

      var bananas = drawBananas(0, height);

      var start = +new Date();
      var next = function() {
        var t = (+new Date() - start) / 200;

        var y = (-gravity * Math.pow(t, 2)) + (vy * t);
        y = height - y;

        var x = vx * t;

        var x = x - 20, y = y - 20;
        var dx = x - bananas.attr('x');
        var dy = y - bananas.attr('y');

        bananas.translate(dx, dy);

        if ((y > height) || (x > width)) {
          // circle.remove();
          return;
        }
        setTimeout(next);
      };

      next();

    },
    bottom: function() {
      var tb = this.vy / gravity;
      return this.positionAt(tb);
    },
    showArc: function() {

    },
    peak: function() {
      var tp = this.vy / (2 * gravity);
      return this.positionAt(tp);
    }
  };

  Path.fromPeakOfArc = function(x,y) {
    var vy = Math.sqrt(4 * gravity * (height - y));

    var vx = (2 * gravity * x)  / vy;

    return new Path(vx, vy);
  };

  var drawTarget = function(x, y, color) {
    var circle = paper.circle(x, y, (r - .75));
    color = color || '#666';
    circle.attr({fill: '#aaa', "opacity": ".8", "stroke":"#333", "stroke-width": "3", "stroke-opacity": ".6"});
    circle.animate({"opacity":0}, 800, "<");
    return circle;
  };

  var drawBananas = function(x, y) {
    var circle = paper.image("banana-40px.png", x, y, 40, 41);
    circle.animate({"rotation":4000}, 10000, ">");
    return circle;
  };


  return {
    Path: Path,
    drawPaper: function () {
      Gorillas.paper = Raphael("canvas", width, height);
      var paper = Gorillas.paper;

      window.paper = Gorillas.paper;

      var rect = paper.image("portland_bg.jpg", 0, 0, 1000, 400);

      rect.click(function(event) {
        var offset = $(event.target).offset();
        var x = event.pageX - offset.left, y = event.pageY - offset.top;

        // drawTarget(x,y, "#f00");
        var p = Path.fromPeakOfArc(x, y);
        p.toss();

        return false;
      });

      var monkeyLeft = paper.image("evil_monkey_left.png", -12, 260, 205, 154);
      monkeyLeft.insertAfter(rect);
      var monkeyRight = paper.image("evil_monkey_right2.png", 800, 260, 205, 154);
      monkeyRight.insertAfter(rect);

    }
  };
})();

$(function() {
  Gorillas.drawPaper();
  // var path = paper.path('M 0 400' + 'Q 500 -400 1000 400');
  // path.attr({stroke:"#555", "stroke-width":2, "stroke-dasharray":"- ", "stroke-opacity":.25});




});
