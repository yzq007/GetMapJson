/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs = saveAs ||
function(e) {
  "use strict";
  if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return
  }
  var t = e.document,
  n = function() {
    return e.URL || e.webkitURL || e
  },
  r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
  i = "download" in r,
  o = function(e) {
    var t = new MouseEvent("click");
    e.dispatchEvent(t)
  },
  a = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
  f = e.webkitRequestFileSystem,
  u = e.requestFileSystem || f || e.mozRequestFileSystem,
  s = function(t) { (e.setImmediate || e.setTimeout)(function() {
      throw t
    },
    0)
  },
  c = "application/octet-stream",
  d = 0,
  l = 500,
  w = function(t) {
    var r = function() {
      if (typeof t === "string") {
        n().revokeObjectURL(t)
      } else {
        t.remove()
      }
    };
    if (e.chrome) {
      r()
    } else {
      setTimeout(r, l)
    }
  },
  p = function(e, t, n) {
    t = [].concat(t);
    var r = t.length;
    while (r--) {
      var i = e["on" + t[r]];
      if (typeof i === "function") {
        try {
          i.call(e, n || e)
        } catch(o) {
          s(o)
        }
      }
    }
  },
  v = function(e) {
    if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
      return new Blob(["\ufeff", e], {
        type: e.type
      })
    }
    return e
  },
  y = function(t, s, l) {
    if (!l) {
      t = v(t)
    }
    var y = this,
    m = t.type,
    S = false,
    h, R, O = function() {
      p(y, "writestart progress write writeend".split(" "))
    },
    g = function() {
      if (R && a && typeof FileReader !== "undefined") {
        var r = new FileReader;
        r.onloadend = function() {
          var e = r.result;
          R.location.href = "data:attachment/file" + e.slice(e.search(/[,;]/));
          y.readyState = y.DONE;
          O()
        };
        r.readAsDataURL(t);
        y.readyState = y.INIT;
        return
      }
      if (S || !h) {
        h = n().createObjectURL(t)
      }
      if (R) {
        R.location.href = h
      } else {
        var i = e.open(h, "_blank");
        if (i == undefined && a) {
          e.location.href = h
        }
      }
      y.readyState = y.DONE;
      O();
      w(h)
    },
    b = function(e) {
      return function() {
        if (y.readyState !== y.DONE) {
          return e.apply(this, arguments)
        }
      }
    },
    E = {
      create: true,
      exclusive: false
    },
    N;
    y.readyState = y.INIT;
    if (!s) {
      s = "download"
    }
    if (i) {
      h = n().createObjectURL(t);
      r.href = h;
      r.download = s;
      setTimeout(function() {
        o(r);
        O();
        w(h);
        y.readyState = y.DONE
      });
      return
    }
    if (e.chrome && m && m !== c) {
      N = t.slice || t.webkitSlice;
      t = N.call(t, 0, t.size, c);
      S = true
    }
    if (f && s !== "download") {
      s += ".download"
    }
    if (m === c || f) {
      R = e
    }
    if (!u) {
      g();
      return
    }
    d += t.size;
    u(e.TEMPORARY, d, b(function(e) {
      e.root.getDirectory("saved", E, b(function(e) {
        var n = function() {
          e.getFile(s, E, b(function(e) {
            e.createWriter(b(function(n) {
              n.onwriteend = function(t) {
                R.location.href = e.toURL();
                y.readyState = y.DONE;
                p(y, "writeend", t);
                w(e)
              };
              n.onerror = function() {
                var e = n.error;
                if (e.code !== e.ABORT_ERR) {
                  g()
                }
              };
              "writestart progress write abort".split(" ").forEach(function(e) {
                n["on" + e] = y["on" + e]
              });
              n.write(t);
              y.abort = function() {
                n.abort();
                y.readyState = y.DONE
              };
              y.readyState = y.WRITING
            }), g)
          }), g)
        };
        e.getFile(s, {
          create: false
        },
        b(function(e) {
          e.remove();
          n()
        }), b(function(e) {
          if (e.code === e.NOT_FOUND_ERR) {
            n()
          } else {
            g()
          }
        }))
      }), g)
    }), g)
  },
  m = y.prototype,
  S = function(e, t, n) {
    return new y(e, t, n)
  };
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function(e, t, n) {
      if (!n) {
        e = v(e)
      }
      return navigator.msSaveOrOpenBlob(e, t || "download")
    }
  }
  m.abort = function() {
    var e = this;
    e.readyState = e.DONE;
    p(e, "abort")
  };
  m.readyState = m.INIT = 0;
  m.WRITING = 1;
  m.DONE = 2;
  m.error = m.onwritestart = m.onprogress = m.onwrite = m.onabort = m.onerror = m.onwriteend = null;
  return S
} (typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs
} else if (typeof define !== "undefined" && define !== null && define.amd != null) {
  define([],
  function() {
    return saveAs
  })
}
