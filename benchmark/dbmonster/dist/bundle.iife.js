var e = "#text",
    t = "host",
    n = "@tag",
    r = "@attrs",
    o = "shadowDom",
    a = "@create",
    i = "@update",
    s = "@created",
    c = "@updated",
    u = "@remove",
    l = [],
    f = {},
    d = { maxConcurrentTask: 5e3 };
function p(e) {
    return Array.isArray(e);
}
function v(e, t) {
    var n = e.length;
    if (n !== t.length) return !1;
    for (var r = 0; r < n; r++) if (e[r] !== t[r]) return !1;
    return !0;
}
function h(e, t) {
    for (var n = [], r = arguments.length - 2; r-- > 0; )
        n[r] = arguments[r + 2];
    return g(e, t, n);
}
function y(e) {
    var t = typeof e;
    return "object" === t && e.tag
        ? e
        : {
              tag: "#text",
              children: "number" === t || "string" === t ? "" + e : ""
          };
}
function g(e, t, n) {
    t = t || {};
    var r,
        a,
        i,
        s,
        c,
        u = 1,
        f = {},
        d = !0,
        v = function(e, t, n) {
            void 0 === t && (t = 0), void 0 === n && (n = []);
            for (var o = e.length, a = !0; !t && 1 === o && p(e[0]); )
                o = (e = e[0]).length;
            for (var i = 0; i < o; i++) {
                var s = e[i];
                if (p(s)) v(s, t + 1, n), (a = !1);
                else {
                    if ("object" === typeof s && void 0 !== s.key) {
                        if (((r = r || {}), s.key in r))
                            throw new Error(
                                "Each key must be unique among children"
                            );
                        r[s.key] = !0;
                    } else if (r) throw new Error("Each child must have a key");
                    n.push(s);
                }
            }
            return a ? e : n;
        };
    for (var h in t) {
        var y = t[h];
        switch (h) {
            case "context":
                "object" == typeof y && (s = y);
                continue;
            case "children":
                !1 === y && (d = !1), (n = y);
                continue;
            case "innerHTML":
            case "textContent":
            case "contenteditable":
                d = !1;
                break;
            case "class":
                h = "className";
                break;
            case o:
                c = y;
                break;
            case "key":
                if (void 0 === y) continue;
                a = y = "" + y;
        }
        (f[h] = y), u++;
    }
    return (
        (i = v(n || [])),
        (f.children = i = i.length ? i : l),
        {
            tag: e,
            key: a,
            size: u,
            props: f,
            children: i,
            useKeys: r,
            useContext: s,
            useChildren: d,
            useShadowDom: c
        }
    );
}
function m(e, t) {
    var n = (t[e] || {}).dispatch,
        r = t.childNodes,
        o = r.length;
    n && n(u);
    for (var a = 0; a < o; a++) m(e, r[a]);
}
var k = {};
function w(e, t, n) {
    var r = t,
        o = n;
    if ("object" == typeof n)
        for (var a in ((o = ""), n))
            n[a] &&
                (k[a] ||
                    (k[a] = a.replace(/([^A-Z])([A-Z])/g, function(e, t, n) {
                        return t + "-" + n.toLowerCase();
                    })),
                (o += k[a] + ":" + n[a] + ";"));
    return r !== o && (e.style.cssText = o), o;
}
function b(e, t, n, r, o) {
    if ("o" === t[0] || "n" === t[1]) {
        f[t] || (f[t] = t.slice(2).toLocaleLowerCase()),
            (t = f[t]),
            o[t] ||
                (o[t] = [
                    function(e) {
                        return o[t][1].call(e.target, e);
                    }
                ]);
        var a = o[t][0];
        n && !r
            ? (e.removeEventListener(t, a), delete o[t])
            : (!n && r && e.addEventListener(t, a), (o[t][1] = r));
    }
}
var x = { children: 1 };
var C,
    E,
    N,
    S,
    M,
    A,
    j = [],
    L = Promise.resolve();
function T() {
    var e = j,
        t = e.length;
    j = [];
    for (var n = 0; n < t; n++) {
        var r = e[n];
        --r.lvl
            ? r.fun(r.arg)
            : (j.length > d.maxConcurrentTask && r.lvl++, j.push(r));
    }
    j.length && L.then(T);
}
function z() {
    if (!C)
        throw new Error(
            "the hooks can only be called from an existing functional component in the diff queue"
        );
    return C;
}
function P(e) {
    var t,
        n,
        r = z().component,
        o = E++;
    return (
        r.hooks[o] || ((n = !0), (r.hooks[o] = {})),
        ((t = r.hooks[o]).reducer = e),
        n && q(t, { type: a }),
        [
            t.state,
            function(e) {
                return q(t, e);
            }
        ]
    );
}
function q(e, t) {
    e.state = e.reducer(e.state, t);
}
function B(e, t) {
    for (var n = e.length, r = 0; r < n; r++) {
        var o = e[r],
            a = o.hooks,
            i = a.length;
        t.type === u && (o.remove = !0);
        for (var s = 0; s < i; s++) q(a[s], t);
    }
}
function D(e, t) {
    var n,
        r = [];
    function o(l, f, d) {
        if (n) {
            if ("function" != typeof (l = l || "").tag)
                return (
                    B(r.splice(d), { type: u }),
                    (n = O(e, n, l, t, f, a)),
                    void (r.length && (n[e].updateComponent = a))
                );
            var p,
                v,
                h = r[d] || {};
            if (
                (h.tag !== l.tag &&
                    ((p = !0),
                    (r[d] = {
                        lvl: 1,
                        size: 1,
                        tag: l.tag,
                        hooks: [],
                        props: {},
                        context: {}
                    }),
                    B(r.splice(d + 1), { type: u }),
                    (v = !0)),
                (h = r[d]).context !== l.useContext &&
                    ((h.context = l.useContext),
                    (f = Object.assign({}, f, l.useContext)),
                    (v = !0)),
                !v && (l.size !== h.size && (v = !0), !v))
            )
                for (var y in l.props)
                    if (l.props[y] !== h.props[y]) {
                        v = !0;
                        break;
                    }
            (h.props = l.props),
                (h.size = l.size),
                v &&
                    !h.prevent &&
                    (function e() {
                        if (h.remove) return n;
                        (C = {
                            component: h,
                            context: f,
                            next: function() {
                                h.prevent ||
                                    ((h.prevent = !0),
                                    (function(e, t, n) {
                                        void 0 === n && (n = 1);
                                        var r = j.length;
                                        j.push({ fun: e, arg: t, lvl: n }),
                                            r || L.then(T);
                                    })(function() {
                                        (h.prevent = !1), e();
                                    }));
                            }
                        }),
                            (E = 0),
                            B([h], { type: i });
                        var t = h.tag(h.props, f);
                        (C = !1),
                            (E = 0),
                            o(t, f, d + 1),
                            B([h], { type: p ? s : c }),
                            (p = !1);
                    })();
        }
    }
    function a(e, t, r, a) {
        switch (e) {
            case i:
                return (n = t), o(r, a, 0), n;
            case u:
                (n = !1), B(history, { type: e }), (history = []);
        }
    }
    return a;
}
function V(t, r) {
    var o,
        a = document;
    return (
        ((o =
            t !== e
                ? r
                    ? a.createElementNS("http://www.w3.org/2000/svg", t)
                    : a.createElement(t)
                : a.createTextNode(""))[n] = t),
        o
    );
}
function O(t, a, s, c, u, l) {
    s = y(s);
    var f = (a && a[t]) || {},
        d = f.vnode,
        p = f.handlers;
    void 0 === p && (p = {});
    var v = f.updateComponent;
    if (s === d) return a;
    var h = s.tag,
        g = s.props,
        k = s.children,
        C = s.useKeys,
        E = s.useChildren,
        N = s.useShadowDom;
    c = c || "svg" === h;
    var S = a,
        M = "function" == typeof h;
    return (
        M && !v && (v = D(t, c)),
        (function(e) {
            if (e) return e[n] || (e[n] = e.nodeName.toLowerCase()), e[n];
        })(a) === h ||
            "host" === h ||
            M ||
            ((S = V(h, c)), (p = {}), a && a.parentNode.replaceChild(S, a)),
        v && l !== v
            ? v(i, S, s, u)
            : (h !== e
                  ? ((function(e, t, n, a) {
                        var i = e[r] || {};
                        for (var s in i)
                            x[s] ||
                                "ref" === s ||
                                s in t ||
                                ("key" === s
                                    ? delete e.dataset.key
                                    : s in e
                                    ? (e[s] = null)
                                    : e.removeAttribute(
                                          a && "xlink" === s ? "xlink:href" : s
                                      ),
                                delete i[s]);
                        for (var c in t)
                            if (!x[c]) {
                                var u = void 0,
                                    l = t[c],
                                    f = typeof l,
                                    d = c in n ? n[c] : i[c],
                                    p = typeof d;
                                l !== d &&
                                    ("key" !== c
                                        ? "ref" !== c
                                            ? o === c && "attachShadow" in e
                                                ? ((e.shadowRoot && !l) ||
                                                      (!e.shadowRoot && l)) &&
                                                  e.attachShadow({
                                                      mode: l
                                                          ? "open"
                                                          : "closed"
                                                  })
                                                : ("function" === f ||
                                                  "function" === p
                                                      ? (b(e, c, d, l, n),
                                                        (u = !0))
                                                      : (c in e && !a) ||
                                                        (a && "style" === c)
                                                      ? "style" === c
                                                          ? (l = w(
                                                                e,
                                                                d ||
                                                                    e.style
                                                                        .cssText,
                                                                l
                                                            ))
                                                          : (e[c] = l)
                                                      : a
                                                      ? e.setAttributeNS(
                                                            a && "xlink" === c
                                                                ? "http://www.w3.org/1999/xlink"
                                                                : null,
                                                            "xlink" === c
                                                                ? "xlink:href"
                                                                : c,
                                                            l
                                                        )
                                                      : e.setAttribute(c, l),
                                                  u || (i[c] = l))
                                            : l && (l.current = e)
                                        : e.dataset.key !== l &&
                                          (e.dataset.key = l));
                            }
                        e[r] = i;
                    })(S, g, p, c),
                    E &&
                        (d || {}).children !== s.children &&
                        (function(t, n, r, o, a, i) {
                            for (
                                var s = {},
                                    c = n.childNodes,
                                    u = c.length,
                                    l = r.length,
                                    f = o ? 0 : u > l ? l : u;
                                f < u;
                                f++
                            ) {
                                var d = c[f],
                                    p = void 0,
                                    v = f;
                                o && (v = d.dataset.key) in o
                                    ? (s[v] = d)
                                    : (p = !0),
                                    d &&
                                        p &&
                                        (m(t, d), u--, f--, n.removeChild(d));
                            }
                            for (var h = 0; h < l; h++) {
                                var g = y(r[h]),
                                    k = c[h + 1],
                                    w = (o && g.key, c[h]),
                                    b = o ? s[g.key] : w;
                                o && b !== w && n.insertBefore(b, w),
                                    "function" == typeof g.tag &&
                                        (b ||
                                            ((b = V(e)),
                                            k
                                                ? n.insertBefore(b, k)
                                                : n.appendChild(b)));
                                var x = O(t, b, g, a, i);
                                b ||
                                    (k
                                        ? n.insertBefore(x, k)
                                        : n.appendChild(x));
                            }
                        })(t, (N && S.shadowRoot) || S, k, C, c, u))
                  : S.nodeValue !== k && (S.nodeValue = k),
              (S[t] = { handlers: p, vnode: s, updateComponent: v }),
              S)
    );
}
function Q(e, t) {
    P(function(n, r) {
        switch (r.type) {
            case a:
                return { args: t };
            case i:
            case u:
                if (n.clear)
                    (r.type === u || !t || !n.args || !v(t, n.args)) &&
                        n.clear();
                return Object.assign({}, n, { args: t });
            case s:
            case c:
                var o = r.type === s || !t || !n.args || !v(t, n.args),
                    l = n.clear;
                return (
                    o && (l = e()), Object.assign({}, n, { clear: l, args: t })
                );
        }
        return n;
    });
}
function R(e) {
    return h(
        "table",
        { class: "table table-striped latest-data" },
        h(
            "tbody",
            null,
            e.dbs.map(function(e) {
                return h(
                    "tr",
                    null,
                    h("td", { class: "dbname" }, e.dbname),
                    h(
                        "td",
                        { class: "query-count" },
                        h(
                            "span",
                            { class: e.lastSample.countClassName },
                            e.lastSample.nbQueries
                        )
                    ),
                    e.lastSample.topFiveQueries.map(function(e) {
                        return h(
                            "td",
                            { class: "Query " + e.elapsedClassName },
                            e.formatElapsed,
                            h(
                                "div",
                                { class: "popover left" },
                                h("div", { class: "popover-content" }, e.query),
                                h("div", { class: "arrow" })
                            )
                        );
                    })
                );
            })
        )
    );
}
function F() {
    return ENV.generateData().toArray();
}
perfMonitor.startFPSMonitor(),
    perfMonitor.startMemMonitor(),
    perfMonitor.initProfiler("view update"),
    (N = h(function() {
        perfMonitor.startProfile("view update");
        var e = (function(e) {
                var t = z().next,
                    n = "useState/update",
                    r = P(function(t, r) {
                        switch (r.type) {
                            case a:
                                return "function" == typeof e ? e() : e;
                            case n:
                                var o = r.state;
                                return "function" == typeof o ? o(t) : o;
                        }
                        return t;
                    }),
                    o = r[0],
                    i = r[1];
                return [
                    o,
                    function(e) {
                        i({ state: e, type: n }), t();
                    }
                ];
            })(F),
            t = e[0],
            n = e[1];
        return (
            Q(function() {
                !(function e() {
                    n(F()), setTimeout(e, ENV.timeout);
                })();
            }, []),
            Q(function() {
                perfMonitor.endProfile("view update");
            }),
            h(R, { dbs: t })
        );
    }, null)),
    (S = document.getElementById("body")),
    void 0 === M && (M = "vstate"),
    A || ((N = y(N)).tag !== t && (N = g(t, {}, [N]))),
    O(M, S, N);
//# sourceMappingURL=bundle.iife.js.map
