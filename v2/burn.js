/* The burn.
   Two full-screen WebGL layers drawn from one shader:
     mode 0 — a multiply layer. White leaves the photo alone; the ember tint
              turns the grey photograph red while keeping its detail.
     mode 1 — a normal layer. The charred core, the orange haze and the thin
              hot line at the edge.
   The edge is an ellipse anchored below the screen whose radius follows the
   scroll, roughened with noise so it licks and chars instead of wiping. */
(function () {
  "use strict";

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;",
    "uniform float uProg;",
    "uniform float uTime;",
    "uniform float uMode;",
    "uniform float uMouse;",   // -1..1: the idle fire leans toward the cursor

    "float hash(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);",
    "  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(11.7,5.3);a*=0.5;}return v;}",

    "void main(){",
    "  vec2 uv=gl_FragCoord.xy/uRes;",
    "  float asp=uRes.x/uRes.y;",
    "  vec2 p=vec2((uv.x-0.5)*asp,uv.y);",
    "  float t=uTime;",

    // a wide dome: centre below the bottom edge, x squashed
    "  const float C=0.55;",
    "  const float KX=0.62;",
    "  float lean=uMouse*0.16*asp*(1.0-smoothstep(0.0,0.4,uProg));",
    "  vec2 q=vec2((p.x-lean)*KX,p.y+C);",
    "  float d=length(q);",
    "  float rMax=length(vec2(0.5*asp*KX,1.0+C))+0.24;",
    "  float r0=C-0.12+0.01*sin(t*0.9);",
    "  float R=mix(r0,rMax,uProg);",

    // slow licks + fine charring along the edge
    "  float big=fbm(p*1.8+vec2(0.0,-t*0.10));",
    "  float fine=fbm(p*9.0+vec2(t*0.05,-t*0.35));",
    "  float e=d-R+(big-0.5)*0.17+(fine-0.5)*0.045;",

    "  float core=1.0-smoothstep(-0.018,0.012,e);",
    "  float g=exp(-max(e,0.0)*4.2)*(1.0-core);",
    "  g*=0.82+0.36*fbm(p*3.5+vec2(t*0.3,-t*0.5));",
    "  g=clamp(g,0.0,1.0);",

    "  vec3 night=vec3(0.055,0.071,0.125);",
    "  vec3 charC=vec3(0.17,0.04,0.025);",
    "  vec3 ember=vec3(1.0,0.29,0.12);",
    "  vec3 hot=vec3(1.0,0.66,0.36);",

    "  if(uMode<0.5){",
    "    vec3 tint=mix(vec3(1.0),ember,smoothstep(0.0,0.85,g));",
    "    tint*=mix(1.0,0.6,smoothstep(0.72,1.0,g));",
    "    gl_FragColor=vec4(tint,1.0);",
    "  }else if(uMode>1.5){",
    // mode 2: embers on the black footer — no charring, only light
    "    vec3 ink=vec3(0.055,0.055,0.051);",
    "    float inG=exp(min(e,0.0)*5.0);",
    "    float line=exp(-abs(e)*55.0);",
    "    vec3 c=mix(ink,ember*0.95,clamp(g*0.82,0.0,1.0));",
    "    c=mix(c,mix(vec3(0.16,0.03,0.02),ember*0.9,inG),core);",
    "    c=mix(c,hot,line*0.7);",
    "    gl_FragColor=vec4(c,1.0);",
    "  }else{",
    "    float depth=clamp(-e/0.28,0.0,1.0);",
    "    vec3 col=mix(charC,night,smoothstep(0.0,1.0,depth))*core;",
    "    float a=core;",
    "    float haze=exp(-max(e,0.0)*20.0)*(1.0-core)*0.5;",
    "    col=hot*haze+col*(1.0-haze);",
    "    a=haze+a*(1.0-haze);",
    "    float line=exp(-abs(e)*70.0)*0.6;",
    "    col=mix(hot,vec3(1.0,0.86,0.62),0.35)*line+col*(1.0-line);",
    "    a=line+a*(1.0-line);",
    "    gl_FragColor=vec4(col,a);",
    "  }",
    "}"
  ].join("\n");

  function layer(canvas, mode) {
    var gl = canvas.getContext("webgl", {
      alpha: mode === 1,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance"
    });
    if (!gl) return null;

    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("burn shader:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    var vs = shader(gl.VERTEX_SHADER, VERT);
    var fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var u = {
      res: gl.getUniformLocation(prog, "uRes"),
      prog: gl.getUniformLocation(prog, "uProg"),
      time: gl.getUniformLocation(prog, "uTime"),
      mode: gl.getUniformLocation(prog, "uMode"),
      mouse: gl.getUniformLocation(prog, "uMouse")
    };
    gl.uniform1f(u.mode, mode);
    return { gl: gl, u: u, canvas: canvas };
  }

  window.createBurn = function (tintCanvas, coreCanvas) {
    var layers = [layer(tintCanvas, 0), layer(coreCanvas, 1)];
    if (!layers[0] || !layers[1]) return null;
    return driver(layers, 1.5);
  };

  // the same fire, as a glow on a black background (the footer)
  window.createGlow = function (canvas) {
    var L = layer(canvas, 2);
    return L ? driver([L], 1.25) : null;
  };

  function driver(layers, maxDpr) {
    var dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    function resize() {
      layers.forEach(function (L) {
        var w = Math.max(1, Math.round(L.canvas.clientWidth * dpr));
        var h = Math.max(1, Math.round(L.canvas.clientHeight * dpr));
        if (L.canvas.width !== w || L.canvas.height !== h) {
          L.canvas.width = w;
          L.canvas.height = h;
        }
        L.gl.viewport(0, 0, w, h);
      });
    }

    function render(progress, time, mouse) {
      layers.forEach(function (L) {
        var gl = L.gl;
        gl.uniform2f(L.u.res, L.canvas.width, L.canvas.height);
        gl.uniform1f(L.u.prog, progress);
        gl.uniform1f(L.u.time, time);
        gl.uniform1f(L.u.mouse, mouse || 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      });
    }

    resize();
    return { resize: resize, render: render };
  }
})();
