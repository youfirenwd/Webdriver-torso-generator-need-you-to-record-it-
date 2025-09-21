// WEBDRIVER TORSO JavaScript 
;(function(root) {
  'use strict';
   
  var FSC = function FullScreenCanvas(el) {
    this.element = el;
    this.context = el.getContext("2d");
    this.w = this.h = 0;
    
    this.fit();
    
    var that = this;
    window.addEventListener('resize', function() {
      that.fit();
    })
  };
  
  FSC.prototype.clear = function() {
    this.context.clearRect(0, 0, this.w, this.h);
  };
  
  FSC.prototype.resize = function(width, height) {
    this.w = this.element.width  = width;
    this.h = this.element.height = height;
  };
  
  FSC.prototype.fit = function() {
    this.resize(+window.innerWidth, +window.innerHeight);
  };
  
  var RandomRect = function(xmin, ymin, xmax, ymax, wmin, hmin, wmax, hmax, fit) {
    this.x = Math.randInt(xmin, xmax);
    this.y = Math.randInt(ymin, ymax);
    this.w = Math.randInt(wmin, wmax);
    this.h = Math.randInt(hmin, hmax);
    
    if(fit) {
      if(this.x > (xmax - this.w)) {
        this.x = (xmax - this.w);
      }
      
      if(this.y > (ymax - this.h)) {
        this.y = (ymax - this.h);
      }
    }
  };
  
  root.FullScreenCanvas = FSC;
  root.RandomRect       = RandomRect;
  
  root.rset = function(s, l, c) {
    s += '';
    while(s.length < l) {
      s = c + s;
    }
    
    return s;
  };
  
  root.beep = (function () {
    var ctx = new AudioContext();
    // sine, square, sawtooth, triangle, custom
    return function (duration, frequency, type, cb) {
      var osc;
      
      if(typeof type !== "string") {
        type = "square";
      }
      
      osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.connect(ctx.destination);
      osc.start(0);

      setTimeout(function() {
        osc.stop(0);
        if(typeof cb === "function") { 
          cb();
        }
      }, duration);
      
      return osc;
    };
  })();
  
}(window));

window.addEventListener('load', function() {
  'use strict';
  
  var c = new FullScreenCanvas(document.getElementById('torso')),
      b = 'red',
      r = 'blue',
      s = 0,
      p = true,
      o, r1, r2;
  
  // sepace stops the beeps.
  document.addEventListener('keypress', function(e) {
    if((e.keyCode || e.which) === 32) {
      p = !p;
      
      if(!p && o) {
        o.stop(0);
      }
    }
  });
  
  // generate next slide.
  (function next() {
    r1 = new RandomRect(0, 0, c.w, c.h, 50, 50, ~~(c.w / 2), ~~(c.h / 2), true);
    r2 = new RandomRect(0, 0, c.w, c.h, 50, 50, ~~(c.w / 2), ~~(c.h / 2), true);
    
    if(p) {
      o = beep(900, Math.randInt(500, 2500), "sine");
    }
    
    s = ((s + 1) % 10000);
    
    setTimeout(next, 900);
  }());
  
  // render
  (function draw() {
    requestAnimFrame(draw);
    
    c.clear();
    c.context.fillStyle = r;
    c.context.fillRect(r1.x, r1.y, r1.w, r1.h);
    c.context.fillStyle = b;
    c.context.fillRect(r2.x, r2.y, r2.w, r2.h);
    
    c.context.fillStyle = '#000000';
    c.context.font = '800 15px Courier';
    c.context.textBaseline = 'center';
    c.context.textAlign = 'hanging';
    c.context.fillText("aqua.flv - slide " + rset((s - 1) + '', 4, '0'), 20, c.h - 20);
  }());
  
});
