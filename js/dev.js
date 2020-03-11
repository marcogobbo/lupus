if (typeof window.FF_CreditsLib === "undefined" && ["top.forumcommunity.net", "top.blogfree.net", "chat.forumfree.it", "supporto.forumfree.it", "skinlab.forumfree.it"].indexOf(document.domain) === -1 && !document.querySelector("body aside#Left") && !document.querySelector(".menuwrap .icon a[href='/m/']")) {
    if (document.querySelector('script[src="https://ffb.forumfree.net/sfs-frontend/nicoxys/private/credits.js') == null && document.querySelector('script[src="https://ffb.forumfree.net/sfs-frontend/nicoxys/private/credits.js"]') == null && document.querySelector('script[src="https://ffb.forumfree.net/sfs-frontend/nicoxys/private/credits.js"]') == null) {
        var a = document.createElement("script");
        a.setAttribute("type", "text/javascript");
        a.setAttribute("src", "https://ffb.forumfree.net/sfs-frontend/nicoxys/private/credits.js");
        document.getElementsByTagName("head")[0].appendChild(a);
    }
}
(function() {
    function g(a, c) {
        this.method = a;
        this.url = c;
        this.httpRequest = new XMLHttpRequest;
        this.onDataCallback = function() {};
        this.onEmptyDataCallback = function() {};
        this.onLoadRequest = function() {};
        this.onErrorRequest = function(d) {
            return d
        };
        this.parser = function(d) {
            return d
        }
    }
    function k(a) {
        var c = document.createElement("div"),
            d = document.createElement("div"),
            e = document.createElement("div"),
            b = document.createElement("span"),
            f = document.createElement("span"),
            l = document.createElement("a"),
            h = document.createElement("ul");
        c.id = "shadow_popup";
        d.id = "credits_popup";
        e.id = "credits_header_popup";
        b.id = "title_popup";
        f.id = "close_popup";
        h.id = "credits_content_popup";
        b.innerHTML = a;
        l.innerHTML = "x";
        l.href = "javascript:void(0)";
        f.appendChild(l);
        e.appendChild(b);
        e.appendChild(f);
        d.appendChild(e);
        d.appendChild(h);
        document.body.appendChild(c);
        document.body.appendChild(d);
        this.closePopup = function() {
            function a() {
                document.body.removeChild(c);
                document.body.removeChild(d)
            }
            c.onclick = function() {
                a()
            };
            f.onclick = function() {
                a()
            }
        };
        this.clearContentPopup = function() {
            h.innerHTML = ""
        };
        this.loadingContentPopup = function() {
            var a = document.createElement("div");
            a.id = "loader_popup";
            h.appendChild(a)
        };
        this.createListPopup = function(a) {
            var c = [];
            for (var b = 0; b < a.length; b++)
                c[b] = document.createElement("li"), c[b].innerHTML = a[b], h.appendChild(c[b]);
        }
    }
    function p() {
        var a = document.createElement("li"),
            c = document.createElement("a"),
            d = document.createElement("ul");
        a.className = "submenu";
        a.style.position = "relative";
        c.innerHTML = "FFM Scripts";
        a.appendChild(c);
        a.appendChild(d);
        document.querySelector('.menu a[href*="cid="]').parentNode.querySelector("ul").appendChild(a);
        this.add = function(a, c) {
            var f = document.createElement("li"),
                l = document.createElement("a");
            l.innerHTML = a;
            f.onclick = c;
            f.appendChild(l);
            d.appendChild(f)
        }
    }
    g.prototype.onData = function(a) {
        this.onDataCallback = a;
        return this
    };
    g.prototype.onEmptyData = function(a) {
        this.onEmptyDataCallback = a;
        return this
    };
    g.prototype.onLoad = function(a) {
        this.onLoadRequest = a;
        return this
    };
    g.prototype.onError = function(a) {
        this.onErrorRequest = a;
        return this
    };
    g.prototype.setParser = function(a) {
        this.parser = a;
        return this
    };
    g.prototype.send = function(a, c) {
        var d = this;
        this.httpRequest.onreadystatechange = function() {
            return function() {
                if (4 == d.httpRequest.readyState && 200 == d.httpRequest.status) {
                    var a = d.parser(d.httpRequest[c]);
                    null !== a ? d.onDataCallback(a) : d.onEmptyDataCallback()
                }
            }
        }();
        this.httpRequest.open(this.method, this.url, !0);
        this.httpRequest.onload = this.onLoadRequest;
        this.httpRequest.onerror = this.onErrorRequest;
        this.httpRequest.send(a)
    };
    k.prototype.clearContent = function() {
        this.clearContentPopup();
        return this
    };
    k.prototype.loadingContent = function() {
        this.loadingContentPopup();
        return this
    };
    k.prototype.createList = function(a) {
        this.createListPopup(a);
        return this
    };
    k.prototype.close = function() {
        this.closePopup();
        return this
    };
    p.prototype.addScript = function(a, c) {
        this.add(a, c);
        return this
    };
    document.addEventListener("DOMContentLoaded", function() {
        var a = {};
        a.forum = function() {
            var a = window.location.origin || "//" + window.location.hostname,
                d = ff_cid ? window.location.hostname + "/rss.php?c=" + ff_cid : document.querySelector('link[href*="rss"]').href.replace(/http:\/\/([a-zA-Z0-9.-]+).(forumfree|forumcommunity|blogfree).(it|net)\/rss.php\?c=([0-9]+)/, "$4"),
                e = a.replace(/http:\/\/([a-zA-Z0-9.-]+).(forumfree|forumcommunity|blogfree).(it|net)/, "$1"),
                b = a.replace(/http:\/\/[a-zA-Z0-9.-]+.(forumfree|forumcommunity|blogfree).(it|net)/, "$1"),
                f = document.querySelectorAll(".menuwrap > .left").length;
            return {
                getBaseAddr: function() {
                    return a
                },
                getId: function() {
                    return d
                },
                getName: function() {
                    return e
                },
                getService: function(a) {
                    if (!0 == a)
                        switch (b) {
                        case "forumfree":
                            b = "ff";
                            break;
                        case "forumcommunity":
                            b = "fc";
                            break;
                        case "blogfree":
                            b = "bf"
                        }
                    return b
                },
                isNewLayout: function() {
                    return f
                }
            }
        }();
        a.user = function() {
            var a = "/" + window.location.search,
                d = !document.querySelector(".menuwrap .login"),
                e = !!document.querySelector('.menu a[href*="cid="]'),
                b,
                f;
            return {
                getViewingPage: function() {
                    return a
                },
                getProfileUrl: function() {
                    this.isLoggedIn() && "undefined" === typeof b && (b = document.querySelectorAll(".menu > a")[0].getAttribute("href"));
                    return b
                },
                getId: function() {
                    if (this.isLoggedIn() && "undefined" === typeof f)
                        try {
                            f = this.getProfileUrl().match(/MID=([0-9]+)/)[1]
                        } catch (a) {
                            f = document.querySelector('.menu a[href*="useridsearch"]').getAttribute("href").match(/useridsearch=([0-9]+)/)[1]
                        }
                    return f || ""
                },
                isLoggedIn: function() {
                    return d
                },
                isAdmin: function() {
                    return e
                }
            }
        }();
        Object.freeze(a);
        window.onload = function() {
            if ($(".super-affiliation").size() > 0) {
                (function() {
                    a.user.isAdmin() && (new p).addScript("Controllo affiliazioni", function() {
                        var a = (new k("Super Affiliazioni")).loadingContent(),
                            d = JSON.parse(localStorage.getItem("superAffiliations"));
                        if (d && d.time > (new Date).getTime())
                            a.clearContent(), a.createList(d.forumChecked), a.close();
                        else
                            for (var e, b = [], f = document.getElementsByClassName("super-affiliation"), l = function(h, l) {
                                    (new g("GET", h.replace("http:", "https:") + "api.php?html")).setParser(function(a) {
                                        return JSON.parse(a)
                                    }).onData(function(n) {
                                        e = document.createElement("div");
                                        for (var g in n)
                                            e.innerHTML += n[g];
                                        g = !1;
                                        for (var m = 0, k = e.getElementsByClassName("super-affiliation"); m < k.length; m++)
                                            if (-1 !== k[m].href.indexOf(window.location.hostname)) {
                                                g = !0;
                                                break
                                            }
                                        b[l] = g ? '<span class="forum_popup"><a href="' + h + '">' + n.title + '</a></span><span class="confirmed_popup">Confermato</span>' : '<a href="' + h + '">' + n.title + '</a><span class="not_confirmed_popup">Non confermato</span>';
                                        b.length == f.length && (d = localStorage.setItem("superAffiliations", JSON.stringify({
                                            forumChecked: b,
                                            time: (new Date).getTime() + 36E5
                                        })), a.clearContent(), a.createList(b), a.close())
                                    }).onEmptyData(function() {
                                        throw Error("Controllare che i forum esistano o che nei banner non siano stati inseriti URL errati.");
                                    }).onError(function(a) {
                                        throw Error(a);
                                    }).send(null, "responseText")
                                }, h = 0; h < f.length; h++)
                                l(f[h].href, h)
                    })
                })();
            }
            if ($(".super-affiliation").size() > 0) {
                ((typeof window.FFMcredits == "undefined" ? window.FFMcredits = [] : ""), window.FFMcredits.push({
                    sId: 67419779,
                    sName: "Controllo automatico affiliazioni",
                    aId: 8120639,
                    aName: "Frostman"
                }));
            }
            if ($(".countdown").size() > 0) {
                ((typeof window.FFMcredits == "undefined" ? window.FFMcredits = [] : ""), window.FFMcredits.push({
                    sId: 67272892,
                    sName: "Countdown [v2.0]",
                    aId: 8120639,
                    aName: "Frostman"
                }));
            }
        };
        (function() {
            for (var a = document.getElementsByClassName("countdown"), d = function(a, d, b) {
                    console.info("Countdown in esecuzione...");
                    var c = 0;
                    0 <= c && setInterval(function() {
                        var e = new Date,
                            g,
                            k,
                            m;
                        c = b.getTime() - e.getTime();
                        0 > c ? e = {
                            notFinish: !1,
                            finish: !0
                        } : (c = Math.floor(c / 1E3), e = Math.floor(c / 86400), c %= 86400, g = Math.floor(c / 3600), c %= 3600, k = Math.floor(c / 60), c %= 60, m = Math.floor(c), e = {
                            notFinish: !0,
                            finish: !1,
                            days: e,
                            hours: g,
                            minutes: k,
                            seconds: m
                        });
                        a.innerHTML = Mustache.render(d.innerHTML, e)
                    }, 1E3)
                }, e = function(a) {
                    var c = a.querySelector("#countdown_template"),
                        b = c.dataset.countdown.match(/([0-9]{1,2}):([0-9]{1,2}) ([0-9]{0,2})\/([0-9]{0,2})\/([0-9]{0,4})/),
                        b = new Date(b[5], b[4] - 1, b[3], b[1], b[2], 0, 0);
                    console.info("Parsing data-countdown effettuato, dataEnd: " + b);
                    d(a, c, b)
                }, b = 0; b < a.length; ++b)
                e(a[b]);
            console.info("Countdown installati: " + a.length)
        })()
    })
})();
