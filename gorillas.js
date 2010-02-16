/*global $, Raphael, setTimeout */

var Gorillas = (function() {

  var gravity = 10;
  var width = 1000;
  var height = 400;
  var ticksPerSecond = 200;

  var r = 20;

  var Game = function(paper) {
    var drawTarget = function(x, y, color) {
      var circle = paper.circle(x, y, (r - 0.75));
      color = color || '#666';
      circle.attr({fill: '#aaa', "opacity": ".8", "stroke":"#333", "stroke-width": "3", "stroke-opacity": ".6"});
      circle.animate({"opacity":0}, 800, "<");
      return circle;
    };

    var drawBananas = function(x, y) {
      var circle = paper.image("assets/banana-40px.png", x, y, 40, 41);
      circle.animate({"rotation":4000}, 10000, ">");
      return circle;
    };

    var Path = function(vx, vy) {
      this.vx = vx;
      this.vy = vy;
    };

    Path.prototype = {
      positionAt: function (t) {
        var y = (-gravity * Math.pow(t, 2)) + (this.vy * t);
        var x = this.vx * t;

        return [x, height - y];
      },
      pathParameters: function() {
        var bottom = this.bottom();
        var peak = this.peak();

        var origin = [0, height];

        var control = [bottom[0] / 2, height - ((height - peak[1]) * 2)];

        var end = [bottom[0], height];

        return [["M", origin[0], origin[1]], ["Q", control[0], control[1], end[0], end[1]]];
      },
      makePath: function() {
        var path = paper.path(this.pathParameters());
        path.attr({stroke:"#555", "stroke-width":2, "stroke-dasharray":"- ", "stroke-opacity":1});
        path.animate({"opacity":0}, 1800, "<");
      },
      toss: function() {
        var bottom = this.bottom();
        var peak = this.peak();
        // console.log(peak);
        drawTarget(bottom[0], height);
        drawTarget(peak[0], peak[1]);

        this.makePath();
        var vx = this.vx, vy = this.vy;

        var bananas = drawBananas(0, height);

        var start = +new Date();
        var next = function() {
          var t = (+new Date() - start) / ticksPerSecond;

          var y = (-gravity * Math.pow(t, 2)) + (vy * t);
          y = (height - y) - r;

          var x = (vx * t) - r;

          var dx = x - bananas.attr('x');
          var dy = y - bananas.attr('y');

          bananas.translate(dx, dy);

          if ((y > height) || (x > width)) {
            // bananas.remove();
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

    return {Path: Path};
  };




  return {
    startGame: function (canvasId) {
      var paper = Raphael(canvasId, width, height);
      var game = new Game(paper);

      var rect = paper.image("assets/portland_bg.jpg", 0, 0, 1000, 400);

      rect.mousedown(function(event) {
        var offset = $(event.target).offset();
        var x = event.pageX - offset.left, y = event.pageY - offset.top;

        var p = game.Path.fromPeakOfArc(x, y);
        p.toss();

        return false;
      });

      var guide = paper.path();

      $(rect.node).bind('mousemove', function(event) {
        var offset = $(event.target).offset();
        var x = event.pageX - offset.left, y = event.pageY - offset.top;

        var p = game.Path.fromPeakOfArc(x,y);

        guide.attr({path: p.pathParameters()});
      });

      var monkeyLeft = paper.image("assets/evil_monkey_left.png", -12, 260, 205, 154);
      monkeyLeft.insertAfter(rect);
      var monkeyRight = paper.image("assets/evil_monkey_right2.png", 800, 260, 205, 154);
      monkeyRight.insertAfter(rect);

    }
  };
})();

$(function() {
  Gorillas.startGame("canvas");
});
