( function() {
  var canvas = this.__canvas = new fabric.Canvas('c', { selection: false, backgroundColor: 'grey' });

  function createLine(x1, y1, x2, y2) {
     var line = new fabric.Line([x1, y1, x2, y2], {
        stroke: 'white',
        strokeWidth: 2,
        selectable: false
      });
     return line;
  }

  function createCircle(left, top) {

    var c1 = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 5,
        radius: 12,
        fill: '#fff',
        stroke: '#666',
        hasControls: false,
        hasBorders: false,
        selectable: false
      });
    c1.hoverFill = 'grey';
    c1.normalFill = 'white';
    c1.hoverOn = function() {
      this.setFill(this.hoverFill);
    };
    c1.hoverOff = function() {
      this.setFill(this.normalFill);
    };
    c1.originX = c1.originY = 'center';
    c1.lines = [];
    return c1;
  }
  var simple = {};
  var connect = {
      state: 'default', // connecting
      parts: {
        startObject: null,
        endObject: null,
        tail: null,
        points: [],
        lines: []
      },
      reset: function() {
        this.parts = {
          startObject: null,
          endObject: null,
          tail: null,
          points: [],
          lines: []
        };
        this.state = 'default';
      },
      events: {
        "mouseUp" : function(event, ctx) {

          console.log('mouse:up');

          var newPoint, newLine;

          if ( event.target && event.target.type !== 'line') {
            switch (connect.state) {
              case 'connecting':
                console.log('create last line and reset');
                connect.parts.endObject = event.target;

                newLine = createLine(connect.parts.tail.left, connect.parts.tail.top, event.target.left, event.target.top);

                console.log(event.target);
                connect.reset();
                break;
              default:
                console.log('set starting object and set state to connecting');
                connect.parts.startObject = event.target;
                connect.state = 'connecting';
            }
          } else {
            newPoint = createCircle(event.e.x, event.e.y);
            switch (connect.state) {
              case 'connecting':
                console.log('set starting next point and draw line');
                newLine = createLine(connect.parts.tail.left, connect.parts.tail.top, newPoint.left, newPoint.top);
                connect.parts.lines.push(newLine);

                break;
              default:
                connect.state = 'connecting';
                console.log('set starting point and chage state to connecting');
            }
            connect.parts.points.push(newPoint);
            connect.parts.tail = newPoint;
          }

          if (newPoint) {
            ctx.add(newPoint);
          }
          if (newLine) {
            ctx.add(newLine);
          }
          if (newPoint || newLine) {
            ctx.renderAll();
          }
        }
      }
    };

  var cursors = {
    'simple' : simple,
    'connect' : connect
  };
  var cursor = {
    type: 'connect', // connect
    trigger: function(type, args) {
      var cursorAtMoment = cursors[ this.type ];
      if (!cursorAtMoment.events[type] || typeof cursorAtMoment.events[type] !== 'function' ) {
        return;
      }
      cursorAtMoment.events[type].apply(cursorAtMoment, args);
    }
  };

  canvas.on('mouse:over', function(e) {
    cursor.trigger('mouse:over', [e, canvas]);
  });

  canvas.on('mouse:out', function(e) {
    cursor.trigger('mouse:out', [e, canvas]);
  });

  canvas.on('mouse:down', function(e) {
    cursor.trigger('mouse:down', [e, canvas]);
  });
  canvas.on('mouse:up', function(e) {
    cursor.trigger('mouseUp', [e, canvas]);
  });
  canvas.on('mouse:move', function(e) {
   cursor.trigger('mouse:move', [e, canvas]);
  });
})();

http://jsfiddle.net/bi0morph/1q0z02zb/1/