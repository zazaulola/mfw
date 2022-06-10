(() => {
  /**
   * Query Selector
   * @function $
   * @param  {...{object|string}} q query
   * @returns {Element}
   */

  function $(...q) {
    return !q.length
      ? null
      : Array.isArray(q[0])
      ? $(q[0].reduce((r, s, i) => ((r += (i ? q[i] : "") + s), r), ""))
      : q.reduce(
          (r, s) => (!r ? null : "object" == typeof s ? s : r.querySelector(s)),
          document
        );
  }

  /**
   * Query Selector All
   * @function $$
   * @param  {...{object|string}} q query
   * @returns {ElementCollection}
   */
  function $$(...q) {
    return !q.length
      ? null
      : Array.isArray(q[0])
      ? $$(q[0].reduce((r, s, i) => ((r += (i ? q[i] : "") + s), r), ""))
      : q.reduce(
          (r, s, i, q) =>
            !r
              ? null
              : "object" == typeof s
              ? s
              : r["querySelector" + (i == q.length - 1 ? "All" : "")](s),
          document
        );
  }

  /**
   * Element fabric
   *
   * Syntax:
   *   _({... def }) ==> <Element>
   *
   * DEFINITION PARAMS:
   *   ┏━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *   ┃ param ┃ param                 ┃ default   ┃ assignation               ┃
   *   ┃ name  ┃ type                  ┃ value     ┃ description               ┃
   *   ┣━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
   *   ┃ Element initialization                                                ┃
   *   ┠───────┰───────────────────────┰───────────┰───────────────────────────┨
   *   ┃ def.d ┃ {Document}            ┃ document  ┃ element document          ┃
   *   ┃ def.n ┃ {String}              ┃ "div"     ┃ element name              ┃
   *   ┃ def.x ┃ {String}              ┃ ""        ┃ element namespace (xmlns) ┃
   *   ┃ def.o ┃ {Element}             ┃ undefined ┃ clone element             ┃
   *   ┃ def.t ┃ {Boolean}             ┃ false     ┃ clone tree                ┃
   *   ┃ def.u ┃ {Element}             ┃ undefined ┃ use node (without create) ┃
   *   ┠───────┸───────────────────────┸───────────┸───────────────────────────┨
   *   ┃ Element characteristics                                               ┃
   *   ┠───────┰───────────────────────┰───────────┰───────────────────────────┨
   *   ┃ def.c ┃ {[String]|String}     ┃ undefined ┃ element class list        ┃
   *   ┃ def.p ┃ {Object}              ┃ {}        ┃ element param attributes  ┃
   *   ┃ def.e ┃ {Object}              ┃ {}        ┃ element events            ┃
   *   ┃ def.k ┃ {Object}              ┃ {}        ┃ element object key values ┃
   *   ┃ def.s ┃ {Object}              ┃ {}        ┃ element styles            ┃
   *   ┠───────┸───────────────────────┸───────────┸───────────────────────────┨
   *   ┃ Element offspring                                                     ┃
   *   ┠───────┰───────────────────────┰───────────┰───────────────────────────┨
   *   ┃ def.h ┃ {String}              ┃ ""        ┃ innerHTML                 ┃
   *   ┃ def.i ┃ {[Element]|Element}   ┃ []        ┃ tags inside               ┃
   *   ┃ def.z ┃ {Boolean}             ┃ false     ┃ zip list                  ┃
   *   ┠───────┸───────────────────────┸───────────┸───────────────────────────┨
   *   ┃ Element arrangement                                                   ┃
   *   ┠───────┰───────────────────────┰───────────┰───────────────────────────┨
   *   ┃ def.f ┃ {Element}             ┃ undefined ┃ insert first              ┃
   *   ┃ def.l ┃ {Element}             ┃ undefined ┃ insert last               ┃
   *   ┃ def.b ┃ {Element}             ┃ undefined ┃ insert before             ┃
   *   ┃ def.a ┃ {Element}             ┃ undefined ┃ insert after              ┃
   *   ┃ def.r ┃ {Element}             ┃ undefined ┃ replace with              ┃
   *   ┠───────┸───────────────────────┸───────────┸───────────────────────────┨
   *   ┃ Miscellaneous                                                         ┃
   *   ┠───────┰───────────────────────┰───────────┰───────────────────────────┨
   *   ┃ def.m ┃ {[Function]|Function} ┃ undefined ┃ def mixin list            ┃
   *   ┃ def.w ┃ {[Function]|Function} ┃ undefined ┃ element mixin list        ┃
   *   ┗━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   *  abcdefhiklmnoprstuwxz
   *  gjqvy
   *
   * @function _
   * @param {object} def
   * @returns {Element}
   */

  function _(def) {
    const create = (
        name = "div",
        doc = document,
        xmlns = "http://www.w3.org/1999/xhtml"
      ) => doc.createElementNS(xmlns, name),
      oneOrMany = (object, callback) =>
        (Array.isArray(object) ? object : object instanceof NodeList ? [...object] : [object]).map(callback),
      replaceCssProperty = (property) =>
        property.replace(/-(\w)/g, (matches) => matches[1].toUpperCase()),
      forEachEntry = (object, callback) =>
        Object.entries(object).forEach(callback);
    if ("string" == typeof def) {
      return create(def);
    }
    if (Array.isArray(def)) {
      return def.map(_);
    }
    if (def instanceof Element) {
      return def;
    }
    if(def.u instanceof NodeList||Array.isArray(def.u)){
      return def.u.map(u => _(Object.assign({}, def, {u})));
    }
    const element = def.u
        ? $(def.u)
        : def.o
        ? $(def.o).cloneNode(def.t)
        : create(def.n, def.d, def.x),
      zip = [element];
    if (def.m) {
      oneOrMany(def.m, (m) => m.call(element, def));
    }
    if (def.c) {
      if ("string" == typeof def.c) {
        element.className = def.c;
      } else {
        oneOrMany(def.c, (cls) => element.classList.add(cls));
      }
    }
    if (def.p) {
      forEachEntry(def.p, (prop) => element.setAttribute(...prop));
    }
    if (def.e) {
      forEachEntry(def.e, (event) => element.addEventListener(...event));
    }
    if (def.s) {
      forEachEntry(
        def.s,
        ([prop, value]) => (element.style[replaceCssProperty(prop)] = value)
      );
    }
    if (def.k) {
      Object.assign(element, def.k);
    }
    if (def.h) {
      element.innerHTML = def.h;
    }
    if (def.f) {
      $(def.f).firstChild.before(element);
    }
    if (def.l) {
      $(def.l).appendChild(element);
    }
    if (def.b) {
      $(def.b).before(element);
    }
    if (def.a) {
      $(def.a).after(element);
    }
    if (def.r) {
      $(def.r).replaceWith(element);
    }
    if (def.i) {
      const appendElement = subElement => {
        zip.push(subElement);
        element.appendChild(subElement);
      };
      oneOrMany(
        _(def.i),
        subElement => subElement instanceof Document
          ? [...(subElement.body ? subElement.body : subElement.documentElement).childNodes].map(appendElement)
          : appendElement(subElement)
      );
    }
    if (def.w) {
      oneOrMany(def.w, (w) => w.call(def, element));
    }
    return def.z ? zip : element;
  }

  /**
   * Template render
   *
   * @function __
   * @param {[string]} c
   * @param {*} ...o
   * @returns {DocumentFragment}
   */
  // function __(c, ...o) {
  //   const e = [];
  //   const f = document
  //     .createRange()
  //     .createContextualFragment(
  //       c.flatMap((v, i) => [
  //         v,
  //         !o[i]
  //           ? ""
  //           : o[i] instanceof Element
  //           ? (e.push(i), `<s id="_${i}_"></s>`)
  //           : o[i],
  //       ]).join``
  //     );
  //   e.forEach((i) => $(f, `#_${i}_`).replaceWith(o[i]));
  //   return f;
  // }

  function __(c, ...o) {
    const e = [];
    const f = document
      .createRange()
      .createContextualFragment(
        c.flatMap((v, i) => [
          v,
          [
            "number",
            "string",
            "bigint",
            "undefined",
            "symbol",
            "boolean",
            "function",
          ].includes(typeof o[i])
            ? o[i]
            : `<s id="_${i}_"></s>`,
        ])
      );
    e.forEach((i) => $(f, `#_${i}_`).replaceWith(_(o[i])));
    return f;
  }

  // return {
  //   $,
  //   $$,
  //   _,
  //   __,
  // };

  Object.defineProperties(
    "undefined" != typeof module && module.exports
      ? module.exports
      : window
      ? window
      : globalThis
      ? globalThis
      : {},
    [$, $$, _, __].reduce(
      (acc, fn) => ((acc[fn.name] = { value: fn }), acc),
      {}
    )
  );
})();
