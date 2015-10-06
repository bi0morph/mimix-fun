( function() {
  var canvas = this.__canvas = new fabric.Canvas('c', { selection: false, backgroundColor: 'grey' });
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

  var cursorConnection = {
    type: 'connection',
    exampleLine: null,
    start: null,
    end: null,
    createLine: function(coords) {
      return new fabric.Line(coords, {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        strokeDashArray: [10, 10]
      })
    },
    'mouse:down': function (e) {
      console.log('mouse:down');
      console.log(e.target.left, e.target.top);

      var newLine = this.createLine([ e.target.left,  e.target.top,  e.target.left, e.target.top  ]);
      this.exampleLine  = newLine;
      this.start = e.target;
      canvas.add(this.exampleLine);
    },
    'mouse:up': function (e) {
      console.log('mouse:up');
      var newLine = this.exampleLine;
      canvas.remove(this.exampleLine);
      this.exampleLine = null;
      this.end = e.target;

      newLine.set({
        'x2': e.target.left,
        'y2':e.target.top,
        'strokeDashArray':null,
        'strokeWidth': 5,
        'stroke': 'green'
      });
      canvas.add(newLine);

      this.start.lines.push(newLine);
      this.end.lines.push(newLine);
    },
    'mouse:move': function (e) {
      if (!this.exampleLine) {
        return;
      }
      console.log('mouse:move');
      console.log(e.e.x, e.e.y);
      console.log(this.exampleLine);
      this.exampleLine.set({ 'x2': e.e.x, 'y2':e.e.y });
      canvas.renderAll();
    }
  };

  var c1 = new fabric.Circle({
      left: 50,
      top: 50,
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
  c1.lines = [];

  var c2 = fabric.util.object.clone(c1);
  c2.hoverFill = 'green';
  c2.normalFill = 'white';
  c2.left = 300;

  var c3 = fabric.util.object.clone(c1);
  c3.top = 100;
  var c4 = fabric.util.object.clone(c1);
  c4.top = 120;
  c4.left = 320;
  canvas.on('mouse:over', function(e) {
    if (e.target.hoverOn) {
          e.target.hoverOn();
          canvas.renderAll();
        };
  });

      canvas.on('mouse:out', function(e) {
        if (e.target.hoverOff) {
          e.target.hoverOff();
          canvas.renderAll();
        };
      });

    canvas.on('mouse:down', function(e) {
        cursorConnection['mouse:down'](e);
        canvas.renderAll();
    });
    canvas.on('mouse:up', function(e) {
        cursorConnection['mouse:up'](e);
        canvas.renderAll();
    });
    canvas.on('mouse:move', function(e) {
        cursorConnection['mouse:move'](e);
    });
    canvas.add(c1, c2, c3, c4);

})();

http://jsfiddle.net/bi0morph/ft78n1ur/