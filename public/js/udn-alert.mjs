/*!
* sweetalert2 v11.22.4
* Released under the MIT License.
*/
function Ut(e, t, n) {
  if (typeof e == "function" ? e === t : e.has(t))
    return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function Xn(e, t) {
  if (t.has(e))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function $t(e, t) {
  return e.get(Ut(e, t));
}
function Gn(e, t, n) {
  Xn(e, t), t.set(e, n);
}
function Jn(e, t, n) {
  return e.set(Ut(e, t), n), n;
}
const Qn = 100, d = {}, eo = () => {
  d.previousActiveElement instanceof HTMLElement ? (d.previousActiveElement.focus(), d.previousActiveElement = null) : document.body && document.body.focus();
}, to = (e) => new Promise((t) => {
  if (!e)
    return t();
  const n = window.scrollX, o = window.scrollY;
  d.restoreFocusTimeout = setTimeout(() => {
    eo(), t();
  }, Qn), window.scrollTo(n, o);
}), Yt = "swal2-", no = ["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error", "draggable", "dragging"], i = no.reduce(
  (e, t) => (e[t] = Yt + t, e),
  /** @type {SwalClasses} */
  {}
), oo = ["success", "warning", "info", "question", "error"], Oe = oo.reduce(
  (e, t) => (e[t] = Yt + t, e),
  /** @type {SwalIcons} */
  {}
), Kt = "SweetAlert2:", ct = (e) => e.charAt(0).toUpperCase() + e.slice(1), T = (e) => {
  console.warn(`${Kt} ${typeof e == "object" ? e.join(" ") : e}`);
}, oe = (e) => {
  console.error(`${Kt} ${e}`);
}, Bt = [], ro = (e) => {
  Bt.includes(e) || (Bt.push(e), T(e));
}, Zt = (e, t = null) => {
  ro(`"${e}" is deprecated and will be removed in the next major release.${t ? ` Use "${t}" instead.` : ""}`);
}, _e = (e) => typeof e == "function" ? e() : e, dt = (e) => e && typeof e.toPromise == "function", ye = (e) => dt(e) ? e.toPromise() : Promise.resolve(e), ut = (e) => e && Promise.resolve(e) === e, L = () => document.body.querySelector(`.${i.container}`), ke = (e) => {
  const t = L();
  return t ? t.querySelector(e) : null;
}, z = (e) => ke(`.${e}`), f = () => z(i.popup), ue = () => z(i.icon), so = () => z(i["icon-content"]), Xt = () => z(i.title), wt = () => z(i["html-container"]), Gt = () => z(i.image), ft = () => z(i["progress-steps"]), Ne = () => z(i["validation-message"]), K = () => (
  /** @type {HTMLButtonElement} */
  ke(`.${i.actions} .${i.confirm}`)
), we = () => (
  /** @type {HTMLButtonElement} */
  ke(`.${i.actions} .${i.cancel}`)
), re = () => (
  /** @type {HTMLButtonElement} */
  ke(`.${i.actions} .${i.deny}`)
), io = () => z(i["input-label"]), fe = () => ke(`.${i.loader}`), xe = () => z(i.actions), Jt = () => z(i.footer), Ue = () => z(i["timer-progress-bar"]), ht = () => z(i.close), ao = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`, mt = () => {
  const e = f();
  if (!e)
    return [];
  const t = e.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'), n = Array.from(t).sort((s, a) => {
    const l = parseInt(s.getAttribute("tabindex") || "0"), c = parseInt(a.getAttribute("tabindex") || "0");
    return l > c ? 1 : l < c ? -1 : 0;
  }), o = e.querySelectorAll(ao), r = Array.from(o).filter((s) => s.getAttribute("tabindex") !== "-1");
  return [...new Set(n.concat(r))].filter((s) => O(s));
}, pt = () => Z(document.body, i.shown) && !Z(document.body, i["toast-shown"]) && !Z(document.body, i["no-backdrop"]), Ye = () => {
  const e = f();
  return e ? Z(e, i.toast) : !1;
}, lo = () => {
  const e = f();
  return e ? e.hasAttribute("data-loading") : !1;
}, R = (e, t) => {
  if (e.textContent = "", t) {
    const o = new DOMParser().parseFromString(t, "text/html"), r = o.querySelector("head");
    r && Array.from(r.childNodes).forEach((a) => {
      e.appendChild(a);
    });
    const s = o.querySelector("body");
    s && Array.from(s.childNodes).forEach((a) => {
      a instanceof HTMLVideoElement || a instanceof HTMLAudioElement ? e.appendChild(a.cloneNode(!0)) : e.appendChild(a);
    });
  }
}, Z = (e, t) => {
  if (!t)
    return !1;
  const n = t.split(/\s+/);
  for (let o = 0; o < n.length; o++)
    if (!e.classList.contains(n[o]))
      return !1;
  return !0;
}, co = (e, t) => {
  Array.from(e.classList).forEach((n) => {
    !Object.values(i).includes(n) && !Object.values(Oe).includes(n) && !Object.values(t.showClass || {}).includes(n) && e.classList.remove(n);
  });
}, D = (e, t, n) => {
  if (co(e, t), !t.customClass)
    return;
  const o = t.customClass[
    /** @type {keyof SweetAlertCustomClass} */
    n
  ];
  if (o) {
    if (typeof o != "string" && !o.forEach) {
      T(`Invalid type of customClass.${n}! Expected string or iterable object, got "${typeof o}"`);
      return;
    }
    p(e, o);
  }
}, Ke = (e, t) => {
  if (!t)
    return null;
  switch (t) {
    case "select":
    case "textarea":
    case "file":
      return e.querySelector(`.${i.popup} > .${i[t]}`);
    case "checkbox":
      return e.querySelector(`.${i.popup} > .${i.checkbox} input`);
    case "radio":
      return e.querySelector(`.${i.popup} > .${i.radio} input:checked`) || e.querySelector(`.${i.popup} > .${i.radio} input:first-child`);
    case "range":
      return e.querySelector(`.${i.popup} > .${i.range} input`);
    default:
      return e.querySelector(`.${i.popup} > .${i.input}`);
  }
}, Qt = (e) => {
  if (e.focus(), e.type !== "file") {
    const t = e.value;
    e.value = "", e.value = t;
  }
}, en = (e, t, n) => {
  !e || !t || (typeof t == "string" && (t = t.split(/\s+/).filter(Boolean)), t.forEach((o) => {
    Array.isArray(e) ? e.forEach((r) => {
      n ? r.classList.add(o) : r.classList.remove(o);
    }) : n ? e.classList.add(o) : e.classList.remove(o);
  }));
}, p = (e, t) => {
  en(e, t, !0);
}, V = (e, t) => {
  en(e, t, !1);
}, G = (e, t) => {
  const n = Array.from(e.children);
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    if (r instanceof HTMLElement && Z(r, t))
      return r;
  }
}, te = (e, t, n) => {
  n === `${parseInt(n)}` && (n = parseInt(n)), n || parseInt(n) === 0 ? e.style.setProperty(t, typeof n == "number" ? `${n}px` : n) : e.style.removeProperty(t);
}, E = (e, t = "flex") => {
  e && (e.style.display = t);
}, S = (e) => {
  e && (e.style.display = "none");
}, gt = (e, t = "block") => {
  e && new MutationObserver(() => {
    Ce(e, e.innerHTML, t);
  }).observe(e, {
    childList: !0,
    subtree: !0
  });
}, St = (e, t, n, o) => {
  const r = e.querySelector(t);
  r && r.style.setProperty(n, o);
}, Ce = (e, t, n = "flex") => {
  t ? E(e, n) : S(e);
}, O = (e) => !!(e && (e.offsetWidth || e.offsetHeight || e.getClientRects().length)), uo = () => !O(K()) && !O(re()) && !O(we()), rt = (e) => e.scrollHeight > e.clientHeight, wo = (e, t) => {
  let n = e;
  for (; n && n !== t; ) {
    if (rt(n))
      return !0;
    n = n.parentElement;
  }
  return !1;
}, tn = (e) => {
  const t = window.getComputedStyle(e), n = parseFloat(t.getPropertyValue("animation-duration") || "0"), o = parseFloat(t.getPropertyValue("transition-duration") || "0");
  return n > 0 || o > 0;
}, bt = (e, t = !1) => {
  const n = Ue();
  n && O(n) && (t && (n.style.transition = "none", n.style.width = "100%"), setTimeout(() => {
    n.style.transition = `width ${e / 1e3}s linear`, n.style.width = "0%";
  }, 10));
}, fo = () => {
  const e = Ue();
  if (!e)
    return;
  const t = parseInt(window.getComputedStyle(e).width);
  e.style.removeProperty("transition"), e.style.width = "100%";
  const n = parseInt(window.getComputedStyle(e).width), o = t / n * 100;
  e.style.width = `${o}%`;
}, ho = () => typeof window > "u" || typeof document > "u", mo = `
 <div aria-labelledby="${i.title}" aria-describedby="${i["html-container"]}" class="${i.popup}" tabindex="-1">
   <button type="button" class="${i.close}"></button>
   <ul class="${i["progress-steps"]}"></ul>
   <div class="${i.icon}"></div>
   <img class="${i.image}" />
   <h2 class="${i.title}" id="${i.title}"></h2>
   <div class="${i["html-container"]}" id="${i["html-container"]}"></div>
   <input class="${i.input}" id="${i.input}" />
   <input type="file" class="${i.file}" />
   <div class="${i.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${i.select}" id="${i.select}"></select>
   <div class="${i.radio}"></div>
   <label class="${i.checkbox}">
     <input type="checkbox" id="${i.checkbox}" />
     <span class="${i.label}"></span>
   </label>
   <textarea class="${i.textarea}" id="${i.textarea}"></textarea>
   <div class="${i["validation-message"]}" id="${i["validation-message"]}"></div>
   <div class="${i.actions}">
     <div class="${i.loader}"></div>
     <button type="button" class="${i.confirm}"></button>
     <button type="button" class="${i.deny}"></button>
     <button type="button" class="${i.cancel}"></button>
   </div>
   <div class="${i.footer}"></div>
   <div class="${i["timer-progress-bar-container"]}">
     <div class="${i["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, ""), po = () => {
  const e = L();
  return e ? (e.remove(), V([document.documentElement, document.body], [i["no-backdrop"], i["toast-shown"], i["has-column"]]), !0) : !1;
}, ee = () => {
  d.currentInstance.resetValidationMessage();
}, go = () => {
  const e = f(), t = G(e, i.input), n = G(e, i.file), o = e.querySelector(`.${i.range} input`), r = e.querySelector(`.${i.range} output`), s = G(e, i.select), a = e.querySelector(`.${i.checkbox} input`), l = G(e, i.textarea);
  t.oninput = ee, n.onchange = ee, s.onchange = ee, a.onchange = ee, l.oninput = ee, o.oninput = () => {
    ee(), r.value = o.value;
  }, o.onchange = () => {
    ee(), r.value = o.value;
  };
}, bo = (e) => typeof e == "string" ? document.querySelector(e) : e, vo = (e) => {
  const t = f();
  t.setAttribute("role", e.toast ? "alert" : "dialog"), t.setAttribute("aria-live", e.toast ? "polite" : "assertive"), e.toast || t.setAttribute("aria-modal", "true");
}, yo = (e) => {
  window.getComputedStyle(e).direction === "rtl" && p(L(), i.rtl);
}, ko = (e) => {
  const t = po();
  if (ho()) {
    oe("SweetAlert2 requires document to initialize");
    return;
  }
  const n = document.createElement("div");
  n.className = i.container, t && p(n, i["no-transition"]), R(n, mo), n.dataset.swal2Theme = e.theme;
  const o = bo(e.target);
  o.appendChild(n), e.topLayer && (n.setAttribute("popover", ""), n.showPopover()), vo(e), yo(o), go();
}, vt = (e, t) => {
  e instanceof HTMLElement ? t.appendChild(e) : typeof e == "object" ? xo(e, t) : e && R(t, e);
}, xo = (e, t) => {
  e.jquery ? Co(t, e) : R(t, e.toString());
}, Co = (e, t) => {
  if (e.textContent = "", 0 in t)
    for (let n = 0; n in t; n++)
      e.appendChild(t[n].cloneNode(!0));
  else
    e.appendChild(t.cloneNode(!0));
}, Ao = (e, t) => {
  const n = xe(), o = fe();
  !n || !o || (!t.showConfirmButton && !t.showDenyButton && !t.showCancelButton ? S(n) : E(n), D(n, t, "actions"), Eo(n, o, t), R(o, t.loaderHtml || ""), D(o, t, "loader"));
};
function Eo(e, t, n) {
  const o = K(), r = re(), s = we();
  !o || !r || !s || (Qe(o, "confirm", n), Qe(r, "deny", n), Qe(s, "cancel", n), Po(o, r, s, n), n.reverseButtons && (n.toast ? (e.insertBefore(s, o), e.insertBefore(r, o)) : (e.insertBefore(s, t), e.insertBefore(r, t), e.insertBefore(o, t))));
}
function Po(e, t, n, o) {
  if (!o.buttonsStyling) {
    V([e, t, n], i.styled);
    return;
  }
  p([e, t, n], i.styled), o.confirmButtonColor && e.style.setProperty("--swal2-confirm-button-background-color", o.confirmButtonColor), o.denyButtonColor && t.style.setProperty("--swal2-deny-button-background-color", o.denyButtonColor), o.cancelButtonColor && n.style.setProperty("--swal2-cancel-button-background-color", o.cancelButtonColor), Je(e), Je(t), Je(n);
}
function Je(e) {
  const t = window.getComputedStyle(e);
  if (t.getPropertyValue("--swal2-action-button-focus-box-shadow"))
    return;
  const n = t.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, "rgba($1, $2, $3, 0.5)");
  e.style.setProperty("--swal2-action-button-focus-box-shadow", t.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${n}`));
}
function Qe(e, t, n) {
  const o = (
    /** @type {'Confirm' | 'Deny' | 'Cancel'} */
    ct(t)
  );
  Ce(e, n[`show${o}Button`], "inline-block"), R(e, n[`${t}ButtonText`] || ""), e.setAttribute("aria-label", n[`${t}ButtonAriaLabel`] || ""), e.className = i[t], D(e, n, `${t}Button`);
}
const $o = (e, t) => {
  const n = ht();
  n && (R(n, t.closeButtonHtml || ""), D(n, t, "closeButton"), Ce(n, t.showCloseButton), n.setAttribute("aria-label", t.closeButtonAriaLabel || ""));
}, Bo = (e, t) => {
  const n = L();
  n && (So(n, t.backdrop), To(n, t.position), Lo(n, t.grow), D(n, t, "container"));
};
function So(e, t) {
  typeof t == "string" ? e.style.background = t : t || p([document.documentElement, document.body], i["no-backdrop"]);
}
function To(e, t) {
  t && (t in i ? p(e, i[t]) : (T('The "position" parameter is not valid, defaulting to "center"'), p(e, i.center)));
}
function Lo(e, t) {
  t && p(e, i[`grow-${t}`]);
}
var b = {
  innerParams: /* @__PURE__ */ new WeakMap(),
  domCache: /* @__PURE__ */ new WeakMap()
};
const Io = ["input", "file", "range", "select", "radio", "checkbox", "textarea"], Oo = (e, t) => {
  const n = f();
  if (!n)
    return;
  const o = b.innerParams.get(e), r = !o || t.input !== o.input;
  Io.forEach((s) => {
    const a = G(n, i[s]);
    a && (Ho(s, t.inputAttributes), a.className = i[s], r && S(a));
  }), t.input && (r && Mo(t), Do(t));
}, Mo = (e) => {
  if (!e.input)
    return;
  if (!k[e.input]) {
    oe(`Unexpected type of input! Expected ${Object.keys(k).join(" | ")}, got "${e.input}"`);
    return;
  }
  const t = nn(e.input);
  if (!t)
    return;
  const n = k[e.input](t, e);
  E(t), e.inputAutoFocus && setTimeout(() => {
    Qt(n);
  });
}, jo = (e) => {
  for (let t = 0; t < e.attributes.length; t++) {
    const n = e.attributes[t].name;
    ["id", "type", "value", "style"].includes(n) || e.removeAttribute(n);
  }
}, Ho = (e, t) => {
  const n = f();
  if (!n)
    return;
  const o = Ke(n, e);
  if (o) {
    jo(o);
    for (const r in t)
      o.setAttribute(r, t[r]);
  }
}, Do = (e) => {
  if (!e.input)
    return;
  const t = nn(e.input);
  t && D(t, e, "input");
}, yt = (e, t) => {
  !e.placeholder && t.inputPlaceholder && (e.placeholder = t.inputPlaceholder);
}, Ae = (e, t, n) => {
  if (n.inputLabel) {
    const o = document.createElement("label"), r = i["input-label"];
    o.setAttribute("for", e.id), o.className = r, typeof n.customClass == "object" && p(o, n.customClass.inputLabel), o.innerText = n.inputLabel, t.insertAdjacentElement("beforebegin", o);
  }
}, nn = (e) => {
  const t = f();
  if (t)
    return G(t, i[
      /** @type {SwalClass} */
      e
    ] || i.input);
}, Me = (e, t) => {
  ["string", "number"].includes(typeof t) ? e.value = `${t}` : ut(t) || T(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof t}"`);
}, k = {};
k.text = k.email = k.password = k.number = k.tel = k.url = k.search = k.date = k["datetime-local"] = k.time = k.week = k.month = /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
(e, t) => (Me(e, t.inputValue), Ae(e, e, t), yt(e, t), e.type = t.input, e);
k.file = (e, t) => (Ae(e, e, t), yt(e, t), e);
k.range = (e, t) => {
  const n = e.querySelector("input"), o = e.querySelector("output");
  return Me(n, t.inputValue), n.type = t.input, Me(o, t.inputValue), Ae(n, e, t), e;
};
k.select = (e, t) => {
  if (e.textContent = "", t.inputPlaceholder) {
    const n = document.createElement("option");
    R(n, t.inputPlaceholder), n.value = "", n.disabled = !0, n.selected = !0, e.appendChild(n);
  }
  return Ae(e, e, t), e;
};
k.radio = (e) => (e.textContent = "", e);
k.checkbox = (e, t) => {
  const n = Ke(f(), "checkbox");
  n.value = "1", n.checked = !!t.inputValue;
  const o = e.querySelector("span");
  return R(o, t.inputPlaceholder || t.inputLabel), n;
};
k.textarea = (e, t) => {
  Me(e, t.inputValue), yt(e, t), Ae(e, e, t);
  const n = (o) => parseInt(window.getComputedStyle(o).marginLeft) + parseInt(window.getComputedStyle(o).marginRight);
  return setTimeout(() => {
    if ("MutationObserver" in window) {
      const o = parseInt(window.getComputedStyle(f()).width), r = () => {
        if (!document.body.contains(e))
          return;
        const s = e.offsetWidth + n(e);
        s > o ? f().style.width = `${s}px` : te(f(), "width", t.width);
      };
      new MutationObserver(r).observe(e, {
        attributes: !0,
        attributeFilter: ["style"]
      });
    }
  }), e;
};
const zo = (e, t) => {
  const n = wt();
  n && (gt(n), D(n, t, "htmlContainer"), t.html ? (vt(t.html, n), E(n, "block")) : t.text ? (n.textContent = t.text, E(n, "block")) : S(n), Oo(e, t));
}, Ro = (e, t) => {
  const n = Jt();
  n && (gt(n), Ce(n, t.footer, "block"), t.footer && vt(t.footer, n), D(n, t, "footer"));
}, Fo = (e, t) => {
  const n = b.innerParams.get(e), o = ue();
  if (!o)
    return;
  if (n && t.icon === n.icon) {
    Lt(o, t), Tt(o, t);
    return;
  }
  if (!t.icon && !t.iconHtml) {
    S(o);
    return;
  }
  if (t.icon && Object.keys(Oe).indexOf(t.icon) === -1) {
    oe(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${t.icon}"`), S(o);
    return;
  }
  E(o), Lt(o, t), Tt(o, t), p(o, t.showClass && t.showClass.icon), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", on);
}, Tt = (e, t) => {
  for (const [n, o] of Object.entries(Oe))
    t.icon !== n && V(e, o);
  p(e, t.icon && Oe[t.icon]), Wo(e, t), on(), D(e, t, "icon");
}, on = () => {
  const e = f();
  if (!e)
    return;
  const t = window.getComputedStyle(e).getPropertyValue("background-color"), n = e.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
  for (let o = 0; o < n.length; o++)
    n[o].style.backgroundColor = t;
}, Vo = (e) => `
  ${e.animation ? '<div class="swal2-success-circular-line-left"></div>' : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${e.animation ? '<div class="swal2-success-fix"></div>' : ""}
  ${e.animation ? '<div class="swal2-success-circular-line-right"></div>' : ""}
`, qo = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`, Lt = (e, t) => {
  if (!t.icon && !t.iconHtml)
    return;
  let n = e.innerHTML, o = "";
  t.iconHtml ? o = It(t.iconHtml) : t.icon === "success" ? (o = Vo(t), n = n.replace(/ style=".*?"/g, "")) : t.icon === "error" ? o = qo : t.icon && (o = It({
    question: "?",
    warning: "!",
    info: "i"
  }[t.icon])), n.trim() !== o.trim() && R(e, o);
}, Wo = (e, t) => {
  if (t.iconColor) {
    e.style.color = t.iconColor, e.style.borderColor = t.iconColor;
    for (const n of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"])
      St(e, n, "background-color", t.iconColor);
    St(e, ".swal2-success-ring", "border-color", t.iconColor);
  }
}, It = (e) => `<div class="${i["icon-content"]}">${e}</div>`, _o = (e, t) => {
  const n = Gt();
  if (n) {
    if (!t.imageUrl) {
      S(n);
      return;
    }
    E(n, ""), n.setAttribute("src", t.imageUrl), n.setAttribute("alt", t.imageAlt || ""), te(n, "width", t.imageWidth), te(n, "height", t.imageHeight), n.className = i.image, D(n, t, "image");
  }
};
let kt = !1, rn = 0, sn = 0, an = 0, ln = 0;
const No = (e) => {
  e.addEventListener("mousedown", je), document.body.addEventListener("mousemove", He), e.addEventListener("mouseup", De), e.addEventListener("touchstart", je), document.body.addEventListener("touchmove", He), e.addEventListener("touchend", De);
}, Uo = (e) => {
  e.removeEventListener("mousedown", je), document.body.removeEventListener("mousemove", He), e.removeEventListener("mouseup", De), e.removeEventListener("touchstart", je), document.body.removeEventListener("touchmove", He), e.removeEventListener("touchend", De);
}, je = (e) => {
  const t = f();
  if (e.target === t || ue().contains(
    /** @type {HTMLElement} */
    e.target
  )) {
    kt = !0;
    const n = cn(e);
    rn = n.clientX, sn = n.clientY, an = parseInt(t.style.insetInlineStart) || 0, ln = parseInt(t.style.insetBlockStart) || 0, p(t, "swal2-dragging");
  }
}, He = (e) => {
  const t = f();
  if (kt) {
    let {
      clientX: n,
      clientY: o
    } = cn(e);
    t.style.insetInlineStart = `${an + (n - rn)}px`, t.style.insetBlockStart = `${ln + (o - sn)}px`;
  }
}, De = () => {
  const e = f();
  kt = !1, V(e, "swal2-dragging");
}, cn = (e) => {
  let t = 0, n = 0;
  return e.type.startsWith("mouse") ? (t = /** @type {MouseEvent} */
  e.clientX, n = /** @type {MouseEvent} */
  e.clientY) : e.type.startsWith("touch") && (t = /** @type {TouchEvent} */
  e.touches[0].clientX, n = /** @type {TouchEvent} */
  e.touches[0].clientY), {
    clientX: t,
    clientY: n
  };
}, Yo = (e, t) => {
  const n = L(), o = f();
  if (!(!n || !o)) {
    if (t.toast) {
      te(n, "width", t.width), o.style.width = "100%";
      const r = fe();
      r && o.insertBefore(r, ue());
    } else
      te(o, "width", t.width);
    te(o, "padding", t.padding), t.color && (o.style.color = t.color), t.background && (o.style.background = t.background), S(Ne()), Ko(o, t), t.draggable && !t.toast ? (p(o, i.draggable), No(o)) : (V(o, i.draggable), Uo(o));
  }
}, Ko = (e, t) => {
  const n = t.showClass || {};
  e.className = `${i.popup} ${O(e) ? n.popup : ""}`, t.toast ? (p([document.documentElement, document.body], i["toast-shown"]), p(e, i.toast)) : p(e, i.modal), D(e, t, "popup"), typeof t.customClass == "string" && p(e, t.customClass), t.icon && p(e, i[`icon-${t.icon}`]);
}, Zo = (e, t) => {
  const n = ft();
  if (!n)
    return;
  const {
    progressSteps: o,
    currentProgressStep: r
  } = t;
  if (!o || o.length === 0 || r === void 0) {
    S(n);
    return;
  }
  E(n), n.textContent = "", r >= o.length && T("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"), o.forEach((s, a) => {
    const l = Xo(s);
    if (n.appendChild(l), a === r && p(l, i["active-progress-step"]), a !== o.length - 1) {
      const c = Go(t);
      n.appendChild(c);
    }
  });
}, Xo = (e) => {
  const t = document.createElement("li");
  return p(t, i["progress-step"]), R(t, e), t;
}, Go = (e) => {
  const t = document.createElement("li");
  return p(t, i["progress-step-line"]), e.progressStepsDistance && te(t, "width", e.progressStepsDistance), t;
}, Jo = (e, t) => {
  const n = Xt();
  n && (gt(n), Ce(n, t.title || t.titleText, "block"), t.title && vt(t.title, n), t.titleText && (n.innerText = t.titleText), D(n, t, "title"));
}, dn = (e, t) => {
  Yo(e, t), Bo(e, t), Zo(e, t), Fo(e, t), _o(e, t), Jo(e, t), $o(e, t), zo(e, t), Ao(e, t), Ro(e, t);
  const n = f();
  typeof t.didRender == "function" && n && t.didRender(n), d.eventEmitter.emit("didRender", n);
}, Qo = () => O(f()), un = () => {
  var e;
  return (e = K()) === null || e === void 0 ? void 0 : e.click();
}, er = () => {
  var e;
  return (e = re()) === null || e === void 0 ? void 0 : e.click();
}, tr = () => {
  var e;
  return (e = we()) === null || e === void 0 ? void 0 : e.click();
}, he = Object.freeze({
  cancel: "cancel",
  backdrop: "backdrop",
  close: "close",
  esc: "esc",
  timer: "timer"
}), wn = (e) => {
  e.keydownTarget && e.keydownHandlerAdded && (e.keydownTarget.removeEventListener("keydown", e.keydownHandler, {
    capture: e.keydownListenerCapture
  }), e.keydownHandlerAdded = !1);
}, nr = (e, t, n) => {
  wn(e), t.toast || (e.keydownHandler = (o) => rr(t, o, n), e.keydownTarget = t.keydownListenerCapture ? window : f(), e.keydownListenerCapture = t.keydownListenerCapture, e.keydownTarget.addEventListener("keydown", e.keydownHandler, {
    capture: e.keydownListenerCapture
  }), e.keydownHandlerAdded = !0);
}, st = (e, t) => {
  var n;
  const o = mt();
  if (o.length) {
    e = e + t, e === -2 && (e = o.length - 1), e === o.length ? e = 0 : e === -1 && (e = o.length - 1), o[e].focus();
    return;
  }
  (n = f()) === null || n === void 0 || n.focus();
}, fn = ["ArrowRight", "ArrowDown"], or = ["ArrowLeft", "ArrowUp"], rr = (e, t, n) => {
  e && (t.isComposing || t.keyCode === 229 || (e.stopKeydownPropagation && t.stopPropagation(), t.key === "Enter" ? sr(t, e) : t.key === "Tab" ? ir(t) : [...fn, ...or].includes(t.key) ? ar(t.key) : t.key === "Escape" && lr(t, e, n)));
}, sr = (e, t) => {
  if (!_e(t.allowEnterKey))
    return;
  const n = Ke(f(), t.input);
  if (e.target && n && e.target instanceof HTMLElement && e.target.outerHTML === n.outerHTML) {
    if (["textarea", "file"].includes(t.input))
      return;
    un(), e.preventDefault();
  }
}, ir = (e) => {
  const t = e.target, n = mt();
  let o = -1;
  for (let r = 0; r < n.length; r++)
    if (t === n[r]) {
      o = r;
      break;
    }
  e.shiftKey ? st(o, -1) : st(o, 1), e.stopPropagation(), e.preventDefault();
}, ar = (e) => {
  const t = xe(), n = K(), o = re(), r = we();
  if (!t || !n || !o || !r)
    return;
  const s = [n, o, r];
  if (document.activeElement instanceof HTMLElement && !s.includes(document.activeElement))
    return;
  const a = fn.includes(e) ? "nextElementSibling" : "previousElementSibling";
  let l = document.activeElement;
  if (l) {
    for (let c = 0; c < t.children.length; c++) {
      if (l = l[a], !l)
        return;
      if (l instanceof HTMLButtonElement && O(l))
        break;
    }
    l instanceof HTMLButtonElement && l.focus();
  }
}, lr = (e, t, n) => {
  e.preventDefault(), _e(t.allowEscapeKey) && n(he.esc);
};
var le = {
  swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
  swalPromiseReject: /* @__PURE__ */ new WeakMap()
};
const cr = () => {
  const e = L();
  Array.from(document.body.children).forEach((n) => {
    n.contains(e) || (n.hasAttribute("aria-hidden") && n.setAttribute("data-previous-aria-hidden", n.getAttribute("aria-hidden") || ""), n.setAttribute("aria-hidden", "true"));
  });
}, hn = () => {
  Array.from(document.body.children).forEach((t) => {
    t.hasAttribute("data-previous-aria-hidden") ? (t.setAttribute("aria-hidden", t.getAttribute("data-previous-aria-hidden") || ""), t.removeAttribute("data-previous-aria-hidden")) : t.removeAttribute("aria-hidden");
  });
}, mn = typeof window < "u" && !!window.GestureEvent, dr = () => {
  if (mn && !Z(document.body, i.iosfix)) {
    const e = document.body.scrollTop;
    document.body.style.top = `${e * -1}px`, p(document.body, i.iosfix), ur();
  }
}, ur = () => {
  const e = L();
  if (!e)
    return;
  let t;
  e.ontouchstart = (n) => {
    t = wr(n);
  }, e.ontouchmove = (n) => {
    t && (n.preventDefault(), n.stopPropagation());
  };
}, wr = (e) => {
  const t = e.target, n = L(), o = wt();
  return !n || !o || fr(e) || hr(e) ? !1 : t === n || !rt(n) && t instanceof HTMLElement && !wo(t, o) && // #2823
  t.tagName !== "INPUT" && // #1603
  t.tagName !== "TEXTAREA" && // #2266
  !(rt(o) && // #1944
  o.contains(t));
}, fr = (e) => e.touches && e.touches.length && e.touches[0].touchType === "stylus", hr = (e) => e.touches && e.touches.length > 1, mr = () => {
  if (Z(document.body, i.iosfix)) {
    const e = parseInt(document.body.style.top, 10);
    V(document.body, i.iosfix), document.body.style.top = "", document.body.scrollTop = e * -1;
  }
}, pr = () => {
  const e = document.createElement("div");
  e.className = i["scrollbar-measure"], document.body.appendChild(e);
  const t = e.getBoundingClientRect().width - e.clientWidth;
  return document.body.removeChild(e), t;
};
let se = null;
const gr = (e) => {
  se === null && (document.body.scrollHeight > window.innerHeight || e === "scroll") && (se = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")), document.body.style.paddingRight = `${se + pr()}px`);
}, br = () => {
  se !== null && (document.body.style.paddingRight = `${se}px`, se = null);
};
function pn(e, t, n, o) {
  Ye() ? Ot(e, o) : (to(n).then(() => Ot(e, o)), wn(d)), mn ? (t.setAttribute("style", "display:none !important"), t.removeAttribute("class"), t.innerHTML = "") : t.remove(), pt() && (br(), mr(), hn()), vr();
}
function vr() {
  V([document.documentElement, document.body], [i.shown, i["height-auto"], i["no-backdrop"], i["toast-shown"]]);
}
function J(e) {
  e = kr(e);
  const t = le.swalPromiseResolve.get(this), n = yr(this);
  this.isAwaitingPromise ? e.isDismissed || (Ee(this), t(e)) : n && t(e);
}
const yr = (e) => {
  const t = f();
  if (!t)
    return !1;
  const n = b.innerParams.get(e);
  if (!n || Z(t, n.hideClass.popup))
    return !1;
  V(t, n.showClass.popup), p(t, n.hideClass.popup);
  const o = L();
  return V(o, n.showClass.backdrop), p(o, n.hideClass.backdrop), xr(e, t, n), !0;
};
function gn(e) {
  const t = le.swalPromiseReject.get(this);
  Ee(this), t && t(e);
}
const Ee = (e) => {
  e.isAwaitingPromise && (delete e.isAwaitingPromise, b.innerParams.get(e) || e._destroy());
}, kr = (e) => typeof e > "u" ? {
  isConfirmed: !1,
  isDenied: !1,
  isDismissed: !0
} : Object.assign({
  isConfirmed: !1,
  isDenied: !1,
  isDismissed: !1
}, e), xr = (e, t, n) => {
  var o;
  const r = L(), s = tn(t);
  typeof n.willClose == "function" && n.willClose(t), (o = d.eventEmitter) === null || o === void 0 || o.emit("willClose", t), s ? Cr(e, t, r, n.returnFocus, n.didClose) : pn(e, r, n.returnFocus, n.didClose);
}, Cr = (e, t, n, o, r) => {
  d.swalCloseEventFinishedCallback = pn.bind(null, e, n, o, r);
  const s = function(a) {
    if (a.target === t) {
      var l;
      (l = d.swalCloseEventFinishedCallback) === null || l === void 0 || l.call(d), delete d.swalCloseEventFinishedCallback, t.removeEventListener("animationend", s), t.removeEventListener("transitionend", s);
    }
  };
  t.addEventListener("animationend", s), t.addEventListener("transitionend", s);
}, Ot = (e, t) => {
  setTimeout(() => {
    var n;
    typeof t == "function" && t.bind(e.params)(), (n = d.eventEmitter) === null || n === void 0 || n.emit("didClose"), e._destroy && e._destroy();
  });
}, ce = (e) => {
  let t = f();
  if (t || new qe(), t = f(), !t)
    return;
  const n = fe();
  Ye() ? S(ue()) : Ar(t, e), E(n), t.setAttribute("data-loading", "true"), t.setAttribute("aria-busy", "true"), t.focus();
}, Ar = (e, t) => {
  const n = xe(), o = fe();
  !n || !o || (!t && O(K()) && (t = K()), E(n), t && (S(t), o.setAttribute("data-button-to-replace", t.className), n.insertBefore(o, t)), p([e, n], i.loading));
}, Er = (e, t) => {
  t.input === "select" || t.input === "radio" ? Tr(e, t) : ["text", "email", "number", "tel", "textarea"].some((n) => n === t.input) && (dt(t.inputValue) || ut(t.inputValue)) && (ce(K()), Lr(e, t));
}, Pr = (e, t) => {
  const n = e.getInput();
  if (!n)
    return null;
  switch (t.input) {
    case "checkbox":
      return $r(n);
    case "radio":
      return Br(n);
    case "file":
      return Sr(n);
    default:
      return t.inputAutoTrim ? n.value.trim() : n.value;
  }
}, $r = (e) => e.checked ? 1 : 0, Br = (e) => e.checked ? e.value : null, Sr = (e) => e.files && e.files.length ? e.getAttribute("multiple") !== null ? e.files : e.files[0] : null, Tr = (e, t) => {
  const n = f();
  if (!n)
    return;
  const o = (r) => {
    t.input === "select" ? Ir(n, ze(r), t) : t.input === "radio" && Or(n, ze(r), t);
  };
  dt(t.inputOptions) || ut(t.inputOptions) ? (ce(K()), ye(t.inputOptions).then((r) => {
    e.hideLoading(), o(r);
  })) : typeof t.inputOptions == "object" ? o(t.inputOptions) : oe(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof t.inputOptions}`);
}, Lr = (e, t) => {
  const n = e.getInput();
  n && (S(n), ye(t.inputValue).then((o) => {
    n.value = t.input === "number" ? `${parseFloat(o) || 0}` : `${o}`, E(n), n.focus(), e.hideLoading();
  }).catch((o) => {
    oe(`Error in inputValue promise: ${o}`), n.value = "", E(n), n.focus(), e.hideLoading();
  }));
};
function Ir(e, t, n) {
  const o = G(e, i.select);
  if (!o)
    return;
  const r = (s, a, l) => {
    const c = document.createElement("option");
    c.value = l, R(c, a), c.selected = bn(l, n.inputValue), s.appendChild(c);
  };
  t.forEach((s) => {
    const a = s[0], l = s[1];
    if (Array.isArray(l)) {
      const c = document.createElement("optgroup");
      c.label = a, c.disabled = !1, o.appendChild(c), l.forEach((w) => r(c, w[1], w[0]));
    } else
      r(o, l, a);
  }), o.focus();
}
function Or(e, t, n) {
  const o = G(e, i.radio);
  if (!o)
    return;
  t.forEach((s) => {
    const a = s[0], l = s[1], c = document.createElement("input"), w = document.createElement("label");
    c.type = "radio", c.name = i.radio, c.value = a, bn(a, n.inputValue) && (c.checked = !0);
    const u = document.createElement("span");
    R(u, l), u.className = i.label, w.appendChild(c), w.appendChild(u), o.appendChild(w);
  });
  const r = o.querySelectorAll("input");
  r.length && r[0].focus();
}
const ze = (e) => {
  const t = [];
  return e instanceof Map ? e.forEach((n, o) => {
    let r = n;
    typeof r == "object" && (r = ze(r)), t.push([o, r]);
  }) : Object.keys(e).forEach((n) => {
    let o = e[n];
    typeof o == "object" && (o = ze(o)), t.push([n, o]);
  }), t;
}, bn = (e, t) => !!t && t.toString() === e.toString(), Mr = (e) => {
  const t = b.innerParams.get(e);
  e.disableButtons(), t.input ? vn(e, "confirm") : Ct(e, !0);
}, jr = (e) => {
  const t = b.innerParams.get(e);
  e.disableButtons(), t.returnInputValueOnDeny ? vn(e, "deny") : xt(e, !1);
}, Hr = (e, t) => {
  e.disableButtons(), t(he.cancel);
}, vn = (e, t) => {
  const n = b.innerParams.get(e);
  if (!n.input) {
    oe(`The "input" parameter is needed to be set when using returnInputValueOn${ct(t)}`);
    return;
  }
  const o = e.getInput(), r = Pr(e, n);
  n.inputValidator ? Dr(e, r, t) : o && !o.checkValidity() ? (e.enableButtons(), e.showValidationMessage(n.validationMessage || o.validationMessage)) : t === "deny" ? xt(e, r) : Ct(e, r);
}, Dr = (e, t, n) => {
  const o = b.innerParams.get(e);
  e.disableInput(), Promise.resolve().then(() => ye(o.inputValidator(t, o.validationMessage))).then((s) => {
    e.enableButtons(), e.enableInput(), s ? e.showValidationMessage(s) : n === "deny" ? xt(e, t) : Ct(e, t);
  });
}, xt = (e, t) => {
  const n = b.innerParams.get(e || void 0);
  n.showLoaderOnDeny && ce(re()), n.preDeny ? (e.isAwaitingPromise = !0, Promise.resolve().then(() => ye(n.preDeny(t, n.validationMessage))).then((r) => {
    r === !1 ? (e.hideLoading(), Ee(e)) : e.close({
      isDenied: !0,
      value: typeof r > "u" ? t : r
    });
  }).catch((r) => yn(e || void 0, r))) : e.close({
    isDenied: !0,
    value: t
  });
}, Mt = (e, t) => {
  e.close({
    isConfirmed: !0,
    value: t
  });
}, yn = (e, t) => {
  e.rejectPromise(t);
}, Ct = (e, t) => {
  const n = b.innerParams.get(e || void 0);
  n.showLoaderOnConfirm && ce(), n.preConfirm ? (e.resetValidationMessage(), e.isAwaitingPromise = !0, Promise.resolve().then(() => ye(n.preConfirm(t, n.validationMessage))).then((r) => {
    O(Ne()) || r === !1 ? (e.hideLoading(), Ee(e)) : Mt(e, typeof r > "u" ? t : r);
  }).catch((r) => yn(e || void 0, r))) : Mt(e, t);
};
function Re() {
  const e = b.innerParams.get(this);
  if (!e)
    return;
  const t = b.domCache.get(this);
  S(t.loader), Ye() ? e.icon && E(ue()) : zr(t), V([t.popup, t.actions], i.loading), t.popup.removeAttribute("aria-busy"), t.popup.removeAttribute("data-loading"), t.confirmButton.disabled = !1, t.denyButton.disabled = !1, t.cancelButton.disabled = !1;
}
const zr = (e) => {
  const t = e.popup.getElementsByClassName(e.loader.getAttribute("data-button-to-replace"));
  t.length ? E(t[0], "inline-block") : uo() && S(e.actions);
};
function kn() {
  const e = b.innerParams.get(this), t = b.domCache.get(this);
  return t ? Ke(t.popup, e.input) : null;
}
function xn(e, t, n) {
  const o = b.domCache.get(e);
  t.forEach((r) => {
    o[r].disabled = n;
  });
}
function Cn(e, t) {
  const n = f();
  if (!(!n || !e))
    if (e.type === "radio") {
      const o = n.querySelectorAll(`[name="${i.radio}"]`);
      for (let r = 0; r < o.length; r++)
        o[r].disabled = t;
    } else
      e.disabled = t;
}
function An() {
  xn(this, ["confirmButton", "denyButton", "cancelButton"], !1);
}
function En() {
  xn(this, ["confirmButton", "denyButton", "cancelButton"], !0);
}
function Pn() {
  Cn(this.getInput(), !1);
}
function $n() {
  Cn(this.getInput(), !0);
}
function Bn(e) {
  const t = b.domCache.get(this), n = b.innerParams.get(this);
  R(t.validationMessage, e), t.validationMessage.className = i["validation-message"], n.customClass && n.customClass.validationMessage && p(t.validationMessage, n.customClass.validationMessage), E(t.validationMessage);
  const o = this.getInput();
  o && (o.setAttribute("aria-invalid", "true"), o.setAttribute("aria-describedby", i["validation-message"]), Qt(o), p(o, i.inputerror));
}
function Sn() {
  const e = b.domCache.get(this);
  e.validationMessage && S(e.validationMessage);
  const t = this.getInput();
  t && (t.removeAttribute("aria-invalid"), t.removeAttribute("aria-describedby"), V(t, i.inputerror));
}
const ie = {
  title: "",
  titleText: "",
  text: "",
  html: "",
  footer: "",
  icon: void 0,
  iconColor: void 0,
  iconHtml: void 0,
  template: void 0,
  toast: !1,
  draggable: !1,
  animation: !0,
  theme: "light",
  showClass: {
    popup: "swal2-show",
    backdrop: "swal2-backdrop-show",
    icon: "swal2-icon-show"
  },
  hideClass: {
    popup: "swal2-hide",
    backdrop: "swal2-backdrop-hide",
    icon: "swal2-icon-hide"
  },
  customClass: {},
  target: "body",
  color: void 0,
  backdrop: !0,
  heightAuto: !0,
  allowOutsideClick: !0,
  allowEscapeKey: !0,
  allowEnterKey: !0,
  stopKeydownPropagation: !0,
  keydownListenerCapture: !1,
  showConfirmButton: !0,
  showDenyButton: !1,
  showCancelButton: !1,
  preConfirm: void 0,
  preDeny: void 0,
  confirmButtonText: "OK",
  confirmButtonAriaLabel: "",
  confirmButtonColor: void 0,
  denyButtonText: "No",
  denyButtonAriaLabel: "",
  denyButtonColor: void 0,
  cancelButtonText: "Cancel",
  cancelButtonAriaLabel: "",
  cancelButtonColor: void 0,
  buttonsStyling: !0,
  reverseButtons: !1,
  focusConfirm: !0,
  focusDeny: !1,
  focusCancel: !1,
  returnFocus: !0,
  showCloseButton: !1,
  closeButtonHtml: "&times;",
  closeButtonAriaLabel: "Close this dialog",
  loaderHtml: "",
  showLoaderOnConfirm: !1,
  showLoaderOnDeny: !1,
  imageUrl: void 0,
  imageWidth: void 0,
  imageHeight: void 0,
  imageAlt: "",
  timer: void 0,
  timerProgressBar: !1,
  width: void 0,
  padding: void 0,
  background: void 0,
  input: void 0,
  inputPlaceholder: "",
  inputLabel: "",
  inputValue: "",
  inputOptions: {},
  inputAutoFocus: !0,
  inputAutoTrim: !0,
  inputAttributes: {},
  inputValidator: void 0,
  returnInputValueOnDeny: !1,
  validationMessage: void 0,
  grow: !1,
  position: "center",
  progressSteps: [],
  currentProgressStep: void 0,
  progressStepsDistance: void 0,
  willOpen: void 0,
  didOpen: void 0,
  didRender: void 0,
  willClose: void 0,
  didClose: void 0,
  didDestroy: void 0,
  scrollbarPadding: !0,
  topLayer: !1
}, Rr = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "draggable", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "theme", "willClose"], Fr = {
  allowEnterKey: void 0
}, Vr = ["allowOutsideClick", "allowEnterKey", "backdrop", "draggable", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"], Tn = (e) => Object.prototype.hasOwnProperty.call(ie, e), Ln = (e) => Rr.indexOf(e) !== -1, In = (e) => Fr[e], qr = (e) => {
  Tn(e) || T(`Unknown parameter "${e}"`);
}, Wr = (e) => {
  Vr.includes(e) && T(`The parameter "${e}" is incompatible with toasts`);
}, _r = (e) => {
  const t = In(e);
  t && Zt(e, t);
}, On = (e) => {
  e.backdrop === !1 && e.allowOutsideClick && T('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'), e.theme && !["light", "dark", "auto", "minimal", "borderless", "embed-iframe", "bulma", "bulma-light", "bulma-dark"].includes(e.theme) && T(`Invalid theme "${e.theme}"`);
  for (const t in e)
    qr(t), e.toast && Wr(t), _r(t);
};
function Mn(e) {
  const t = L(), n = f(), o = b.innerParams.get(this);
  if (!n || Z(n, o.hideClass.popup)) {
    T("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
    return;
  }
  const r = Nr(e), s = Object.assign({}, o, r);
  On(s), t.dataset.swal2Theme = s.theme, dn(this, s), b.innerParams.set(this, s), Object.defineProperties(this, {
    params: {
      value: Object.assign({}, this.params, e),
      writable: !1,
      enumerable: !0
    }
  });
}
const Nr = (e) => {
  const t = {};
  return Object.keys(e).forEach((n) => {
    Ln(n) ? t[n] = e[n] : T(`Invalid parameter to update: ${n}`);
  }), t;
};
function jn() {
  const e = b.domCache.get(this), t = b.innerParams.get(this);
  if (!t) {
    Hn(this);
    return;
  }
  e.popup && d.swalCloseEventFinishedCallback && (d.swalCloseEventFinishedCallback(), delete d.swalCloseEventFinishedCallback), typeof t.didDestroy == "function" && t.didDestroy(), d.eventEmitter.emit("didDestroy"), Ur(this);
}
const Ur = (e) => {
  Hn(e), delete e.params, delete d.keydownHandler, delete d.keydownTarget, delete d.currentInstance;
}, Hn = (e) => {
  e.isAwaitingPromise ? (et(b, e), e.isAwaitingPromise = !0) : (et(le, e), et(b, e), delete e.isAwaitingPromise, delete e.disableButtons, delete e.enableButtons, delete e.getInput, delete e.disableInput, delete e.enableInput, delete e.hideLoading, delete e.disableLoading, delete e.showValidationMessage, delete e.resetValidationMessage, delete e.close, delete e.closePopup, delete e.closeModal, delete e.closeToast, delete e.rejectPromise, delete e.update, delete e._destroy);
}, et = (e, t) => {
  for (const n in e)
    e[n].delete(t);
};
var Yr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  _destroy: jn,
  close: J,
  closeModal: J,
  closePopup: J,
  closeToast: J,
  disableButtons: En,
  disableInput: $n,
  disableLoading: Re,
  enableButtons: An,
  enableInput: Pn,
  getInput: kn,
  handleAwaitingPromise: Ee,
  hideLoading: Re,
  rejectPromise: gn,
  resetValidationMessage: Sn,
  showValidationMessage: Bn,
  update: Mn
});
const Kr = (e, t, n) => {
  e.toast ? Zr(e, t, n) : (Gr(t), Jr(t), Qr(e, t, n));
}, Zr = (e, t, n) => {
  t.popup.onclick = () => {
    e && (Xr(e) || e.timer || e.input) || n(he.close);
  };
}, Xr = (e) => !!(e.showConfirmButton || e.showDenyButton || e.showCancelButton || e.showCloseButton);
let Fe = !1;
const Gr = (e) => {
  e.popup.onmousedown = () => {
    e.container.onmouseup = function(t) {
      e.container.onmouseup = () => {
      }, t.target === e.container && (Fe = !0);
    };
  };
}, Jr = (e) => {
  e.container.onmousedown = (t) => {
    t.target === e.container && t.preventDefault(), e.popup.onmouseup = function(n) {
      e.popup.onmouseup = () => {
      }, (n.target === e.popup || n.target instanceof HTMLElement && e.popup.contains(n.target)) && (Fe = !0);
    };
  };
}, Qr = (e, t, n) => {
  t.container.onclick = (o) => {
    if (Fe) {
      Fe = !1;
      return;
    }
    o.target === t.container && _e(e.allowOutsideClick) && n(he.backdrop);
  };
}, es = (e) => typeof e == "object" && e.jquery, jt = (e) => e instanceof Element || es(e), ts = (e) => {
  const t = {};
  return typeof e[0] == "object" && !jt(e[0]) ? Object.assign(t, e[0]) : ["title", "html", "icon"].forEach((n, o) => {
    const r = e[o];
    typeof r == "string" || jt(r) ? t[n] = r : r !== void 0 && oe(`Unexpected type of ${n}! Expected "string" or "Element", got ${typeof r}`);
  }), t;
};
function ns(...e) {
  return new this(...e);
}
function os(e) {
  class t extends this {
    _main(o, r) {
      return super._main(o, Object.assign({}, e, r));
    }
  }
  return t;
}
const rs = () => d.timeout && d.timeout.getTimerLeft(), Dn = () => {
  if (d.timeout)
    return fo(), d.timeout.stop();
}, zn = () => {
  if (d.timeout) {
    const e = d.timeout.start();
    return bt(e), e;
  }
}, ss = () => {
  const e = d.timeout;
  return e && (e.running ? Dn() : zn());
}, is = (e) => {
  if (d.timeout) {
    const t = d.timeout.increase(e);
    return bt(t, !0), t;
  }
}, as = () => !!(d.timeout && d.timeout.isRunning());
let Ht = !1;
const it = {};
function ls(e = "data-swal-template") {
  it[e] = this, Ht || (document.body.addEventListener("click", cs), Ht = !0);
}
const cs = (e) => {
  for (let t = e.target; t && t !== document; t = t.parentNode)
    for (const n in it) {
      const o = t.getAttribute(n);
      if (o) {
        it[n].fire({
          template: o
        });
        return;
      }
    }
};
class ds {
  constructor() {
    this.events = {};
  }
  /**
   * @param {string} eventName
   * @returns {EventHandlers}
   */
  _getHandlersByEventName(t) {
    return typeof this.events[t] > "u" && (this.events[t] = []), this.events[t];
  }
  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  on(t, n) {
    const o = this._getHandlersByEventName(t);
    o.includes(n) || o.push(n);
  }
  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  once(t, n) {
    const o = (...r) => {
      this.removeListener(t, o), n.apply(this, r);
    };
    this.on(t, o);
  }
  /**
   * @param {string} eventName
   * @param {Array} args
   */
  emit(t, ...n) {
    this._getHandlersByEventName(t).forEach(
      /**
       * @param {EventHandler} eventHandler
       */
      (o) => {
        try {
          o.apply(this, n);
        } catch (r) {
          console.error(r);
        }
      }
    );
  }
  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  removeListener(t, n) {
    const o = this._getHandlersByEventName(t), r = o.indexOf(n);
    r > -1 && o.splice(r, 1);
  }
  /**
   * @param {string} eventName
   */
  removeAllListeners(t) {
    this.events[t] !== void 0 && (this.events[t].length = 0);
  }
  reset() {
    this.events = {};
  }
}
d.eventEmitter = new ds();
const us = (e, t) => {
  d.eventEmitter.on(e, t);
}, ws = (e, t) => {
  d.eventEmitter.once(e, t);
}, fs = (e, t) => {
  if (!e) {
    d.eventEmitter.reset();
    return;
  }
  t ? d.eventEmitter.removeListener(e, t) : d.eventEmitter.removeAllListeners(e);
};
var hs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  argsToParams: ts,
  bindClickHandler: ls,
  clickCancel: tr,
  clickConfirm: un,
  clickDeny: er,
  enableLoading: ce,
  fire: ns,
  getActions: xe,
  getCancelButton: we,
  getCloseButton: ht,
  getConfirmButton: K,
  getContainer: L,
  getDenyButton: re,
  getFocusableElements: mt,
  getFooter: Jt,
  getHtmlContainer: wt,
  getIcon: ue,
  getIconContent: so,
  getImage: Gt,
  getInputLabel: io,
  getLoader: fe,
  getPopup: f,
  getProgressSteps: ft,
  getTimerLeft: rs,
  getTimerProgressBar: Ue,
  getTitle: Xt,
  getValidationMessage: Ne,
  increaseTimer: is,
  isDeprecatedParameter: In,
  isLoading: lo,
  isTimerRunning: as,
  isUpdatableParameter: Ln,
  isValidParameter: Tn,
  isVisible: Qo,
  mixin: os,
  off: fs,
  on: us,
  once: ws,
  resumeTimer: zn,
  showLoading: ce,
  stopTimer: Dn,
  toggleTimer: ss
});
class ms {
  /**
   * @param {Function} callback
   * @param {number} delay
   */
  constructor(t, n) {
    this.callback = t, this.remaining = n, this.running = !1, this.start();
  }
  /**
   * @returns {number}
   */
  start() {
    return this.running || (this.running = !0, this.started = /* @__PURE__ */ new Date(), this.id = setTimeout(this.callback, this.remaining)), this.remaining;
  }
  /**
   * @returns {number}
   */
  stop() {
    return this.started && this.running && (this.running = !1, clearTimeout(this.id), this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime()), this.remaining;
  }
  /**
   * @param {number} n
   * @returns {number}
   */
  increase(t) {
    const n = this.running;
    return n && this.stop(), this.remaining += t, n && this.start(), this.remaining;
  }
  /**
   * @returns {number}
   */
  getTimerLeft() {
    return this.running && (this.stop(), this.start()), this.remaining;
  }
  /**
   * @returns {boolean}
   */
  isRunning() {
    return this.running;
  }
}
const Rn = ["swal-title", "swal-html", "swal-footer"], ps = (e) => {
  const t = typeof e.template == "string" ? (
    /** @type {HTMLTemplateElement} */
    document.querySelector(e.template)
  ) : e.template;
  if (!t)
    return {};
  const n = t.content;
  return As(n), Object.assign(gs(n), bs(n), vs(n), ys(n), ks(n), xs(n), Cs(n, Rn));
}, gs = (e) => {
  const t = {};
  return Array.from(e.querySelectorAll("swal-param")).forEach((o) => {
    ne(o, ["name", "value"]);
    const r = (
      /** @type {keyof SweetAlertOptions} */
      o.getAttribute("name")
    ), s = o.getAttribute("value");
    !r || !s || (typeof ie[r] == "boolean" ? t[r] = s !== "false" : typeof ie[r] == "object" ? t[r] = JSON.parse(s) : t[r] = s);
  }), t;
}, bs = (e) => {
  const t = {};
  return Array.from(e.querySelectorAll("swal-function-param")).forEach((o) => {
    const r = (
      /** @type {keyof SweetAlertOptions} */
      o.getAttribute("name")
    ), s = o.getAttribute("value");
    !r || !s || (t[r] = new Function(`return ${s}`)());
  }), t;
}, vs = (e) => {
  const t = {};
  return Array.from(e.querySelectorAll("swal-button")).forEach((o) => {
    ne(o, ["type", "color", "aria-label"]);
    const r = o.getAttribute("type");
    !r || !["confirm", "cancel", "deny"].includes(r) || (t[`${r}ButtonText`] = o.innerHTML, t[`show${ct(r)}Button`] = !0, o.hasAttribute("color") && (t[`${r}ButtonColor`] = o.getAttribute("color")), o.hasAttribute("aria-label") && (t[`${r}ButtonAriaLabel`] = o.getAttribute("aria-label")));
  }), t;
}, ys = (e) => {
  const t = {}, n = e.querySelector("swal-image");
  return n && (ne(n, ["src", "width", "height", "alt"]), n.hasAttribute("src") && (t.imageUrl = n.getAttribute("src") || void 0), n.hasAttribute("width") && (t.imageWidth = n.getAttribute("width") || void 0), n.hasAttribute("height") && (t.imageHeight = n.getAttribute("height") || void 0), n.hasAttribute("alt") && (t.imageAlt = n.getAttribute("alt") || void 0)), t;
}, ks = (e) => {
  const t = {}, n = e.querySelector("swal-icon");
  return n && (ne(n, ["type", "color"]), n.hasAttribute("type") && (t.icon = n.getAttribute("type")), n.hasAttribute("color") && (t.iconColor = n.getAttribute("color")), t.iconHtml = n.innerHTML), t;
}, xs = (e) => {
  const t = {}, n = e.querySelector("swal-input");
  n && (ne(n, ["type", "label", "placeholder", "value"]), t.input = n.getAttribute("type") || "text", n.hasAttribute("label") && (t.inputLabel = n.getAttribute("label")), n.hasAttribute("placeholder") && (t.inputPlaceholder = n.getAttribute("placeholder")), n.hasAttribute("value") && (t.inputValue = n.getAttribute("value")));
  const o = Array.from(e.querySelectorAll("swal-input-option"));
  return o.length && (t.inputOptions = {}, o.forEach((r) => {
    ne(r, ["value"]);
    const s = r.getAttribute("value");
    if (!s)
      return;
    const a = r.innerHTML;
    t.inputOptions[s] = a;
  })), t;
}, Cs = (e, t) => {
  const n = {};
  for (const o in t) {
    const r = t[o], s = e.querySelector(r);
    s && (ne(s, []), n[r.replace(/^swal-/, "")] = s.innerHTML.trim());
  }
  return n;
}, As = (e) => {
  const t = Rn.concat(["swal-param", "swal-function-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
  Array.from(e.children).forEach((n) => {
    const o = n.tagName.toLowerCase();
    t.includes(o) || T(`Unrecognized element <${o}>`);
  });
}, ne = (e, t) => {
  Array.from(e.attributes).forEach((n) => {
    t.indexOf(n.name) === -1 && T([`Unrecognized attribute "${n.name}" on <${e.tagName.toLowerCase()}>.`, `${t.length ? `Allowed attributes are: ${t.join(", ")}` : "To set the value, use HTML within the element."}`]);
  });
}, Fn = 10, Es = (e) => {
  const t = L(), n = f();
  typeof e.willOpen == "function" && e.willOpen(n), d.eventEmitter.emit("willOpen", n);
  const r = window.getComputedStyle(document.body).overflowY;
  Bs(t, n, e), setTimeout(() => {
    Ps(t, n);
  }, Fn), pt() && ($s(t, e.scrollbarPadding, r), cr()), !Ye() && !d.previousActiveElement && (d.previousActiveElement = document.activeElement), typeof e.didOpen == "function" && setTimeout(() => e.didOpen(n)), d.eventEmitter.emit("didOpen", n), V(t, i["no-transition"]);
}, Ve = (e) => {
  const t = f();
  if (e.target !== t)
    return;
  const n = L();
  t.removeEventListener("animationend", Ve), t.removeEventListener("transitionend", Ve), n.style.overflowY = "auto";
}, Ps = (e, t) => {
  tn(t) ? (e.style.overflowY = "hidden", t.addEventListener("animationend", Ve), t.addEventListener("transitionend", Ve)) : e.style.overflowY = "auto";
}, $s = (e, t, n) => {
  dr(), t && n !== "hidden" && gr(n), setTimeout(() => {
    e.scrollTop = 0;
  });
}, Bs = (e, t, n) => {
  p(e, n.showClass.backdrop), n.animation ? (t.style.setProperty("opacity", "0", "important"), E(t, "grid"), setTimeout(() => {
    p(t, n.showClass.popup), t.style.removeProperty("opacity");
  }, Fn)) : E(t, "grid"), p([document.documentElement, document.body], i.shown), n.heightAuto && n.backdrop && !n.toast && p([document.documentElement, document.body], i["height-auto"]);
};
var Dt = {
  /**
   * @param {string} string
   * @param {string} [validationMessage]
   * @returns {Promise<string | void>}
   */
  email: (e, t) => /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(e) ? Promise.resolve() : Promise.resolve(t || "Invalid email address"),
  /**
   * @param {string} string
   * @param {string} [validationMessage]
   * @returns {Promise<string | void>}
   */
  url: (e, t) => /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(e) ? Promise.resolve() : Promise.resolve(t || "Invalid URL")
};
function Ss(e) {
  e.inputValidator || (e.input === "email" && (e.inputValidator = Dt.email), e.input === "url" && (e.inputValidator = Dt.url));
}
function Ts(e) {
  (!e.target || typeof e.target == "string" && !document.querySelector(e.target) || typeof e.target != "string" && !e.target.appendChild) && (T('Target parameter is not valid, defaulting to "body"'), e.target = "body");
}
function Ls(e) {
  Ss(e), e.showLoaderOnConfirm && !e.preConfirm && T(`showLoaderOnConfirm is set to true, but preConfirm is not defined.
showLoaderOnConfirm should be used together with preConfirm, see usage example:
https://sweetalert2.github.io/#ajax-request`), Ts(e), typeof e.title == "string" && (e.title = e.title.split(`
`).join("<br />")), ko(e);
}
let _;
var Be = /* @__PURE__ */ new WeakMap();
class x {
  /**
   * @param {...any} args
   * @this {SweetAlert}
   */
  constructor(...t) {
    if (Gn(this, Be, void 0), typeof window > "u")
      return;
    _ = this;
    const n = Object.freeze(this.constructor.argsToParams(t));
    this.params = n, this.isAwaitingPromise = !1, Jn(Be, this, this._main(_.params));
  }
  _main(t, n = {}) {
    if (On(Object.assign({}, n, t)), d.currentInstance) {
      const s = le.swalPromiseResolve.get(d.currentInstance), {
        isAwaitingPromise: a
      } = d.currentInstance;
      d.currentInstance._destroy(), a || s({
        isDismissed: !0
      }), pt() && hn();
    }
    d.currentInstance = _;
    const o = Os(t, n);
    Ls(o), Object.freeze(o), d.timeout && (d.timeout.stop(), delete d.timeout), clearTimeout(d.restoreFocusTimeout);
    const r = Ms(_);
    return dn(_, o), b.innerParams.set(_, o), Is(_, r, o);
  }
  // `catch` cannot be the name of a module export, so we define our thenable methods here instead
  then(t) {
    return $t(Be, this).then(t);
  }
  finally(t) {
    return $t(Be, this).finally(t);
  }
}
const Is = (e, t, n) => new Promise((o, r) => {
  const s = (a) => {
    e.close({
      isDismissed: !0,
      dismiss: a
    });
  };
  le.swalPromiseResolve.set(e, o), le.swalPromiseReject.set(e, r), t.confirmButton.onclick = () => {
    Mr(e);
  }, t.denyButton.onclick = () => {
    jr(e);
  }, t.cancelButton.onclick = () => {
    Hr(e, s);
  }, t.closeButton.onclick = () => {
    s(he.close);
  }, Kr(n, t, s), nr(d, n, s), Er(e, n), Es(n), js(d, n, s), Hs(t, n), setTimeout(() => {
    t.container.scrollTop = 0;
  });
}), Os = (e, t) => {
  const n = ps(e), o = Object.assign({}, ie, t, n, e);
  return o.showClass = Object.assign({}, ie.showClass, o.showClass), o.hideClass = Object.assign({}, ie.hideClass, o.hideClass), o.animation === !1 && (o.showClass = {
    backdrop: "swal2-noanimation"
  }, o.hideClass = {}), o;
}, Ms = (e) => {
  const t = {
    popup: f(),
    container: L(),
    actions: xe(),
    confirmButton: K(),
    denyButton: re(),
    cancelButton: we(),
    loader: fe(),
    closeButton: ht(),
    validationMessage: Ne(),
    progressSteps: ft()
  };
  return b.domCache.set(e, t), t;
}, js = (e, t, n) => {
  const o = Ue();
  S(o), t.timer && (e.timeout = new ms(() => {
    n("timer"), delete e.timeout;
  }, t.timer), t.timerProgressBar && (E(o), D(o, t, "timerProgressBar"), setTimeout(() => {
    e.timeout && e.timeout.running && bt(t.timer);
  })));
}, Hs = (e, t) => {
  if (!t.toast) {
    if (!_e(t.allowEnterKey)) {
      Zt("allowEnterKey"), Rs();
      return;
    }
    Ds(e) || zs(e, t) || st(-1, 1);
  }
}, Ds = (e) => {
  const t = Array.from(e.popup.querySelectorAll("[autofocus]"));
  for (const n of t)
    if (n instanceof HTMLElement && O(n))
      return n.focus(), !0;
  return !1;
}, zs = (e, t) => t.focusDeny && O(e.denyButton) ? (e.denyButton.focus(), !0) : t.focusCancel && O(e.cancelButton) ? (e.cancelButton.focus(), !0) : t.focusConfirm && O(e.confirmButton) ? (e.confirmButton.focus(), !0) : !1, Rs = () => {
  document.activeElement instanceof HTMLElement && typeof document.activeElement.blur == "function" && document.activeElement.blur();
};
x.prototype.disableButtons = En;
x.prototype.enableButtons = An;
x.prototype.getInput = kn;
x.prototype.disableInput = $n;
x.prototype.enableInput = Pn;
x.prototype.hideLoading = Re;
x.prototype.disableLoading = Re;
x.prototype.showValidationMessage = Bn;
x.prototype.resetValidationMessage = Sn;
x.prototype.close = J;
x.prototype.closePopup = J;
x.prototype.closeModal = J;
x.prototype.closeToast = J;
x.prototype.rejectPromise = gn;
x.prototype.update = Mn;
x.prototype._destroy = jn;
Object.assign(x, hs);
Object.keys(Yr).forEach((e) => {
  x[e] = function(...t) {
    return _ && _[e] ? _[e](...t) : null;
  };
});
x.DismissReason = he;
x.version = "11.22.4";
const qe = x;
qe.default = qe;
typeof document < "u" && function(e, t) {
  var n = e.createElement("style");
  if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet)
    n.styleSheet.disabled || (n.styleSheet.cssText = t);
  else
    try {
      n.innerHTML = t;
    } catch {
      n.innerText = t;
    }
}(document, ':root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.1s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px $swal2-outline-color;--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}');
var Fs = !1;
function Vs(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function qs(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var Ws = /* @__PURE__ */ function() {
  function e(n) {
    var o = this;
    this._insertTag = function(r) {
      var s;
      o.tags.length === 0 ? o.insertionPoint ? s = o.insertionPoint.nextSibling : o.prepend ? s = o.container.firstChild : s = o.before : s = o.tags[o.tags.length - 1].nextSibling, o.container.insertBefore(r, s), o.tags.push(r);
    }, this.isSpeedy = n.speedy === void 0 ? !Fs : n.speedy, this.tags = [], this.ctr = 0, this.nonce = n.nonce, this.key = n.key, this.container = n.container, this.prepend = n.prepend, this.insertionPoint = n.insertionPoint, this.before = null;
  }
  var t = e.prototype;
  return t.hydrate = function(o) {
    o.forEach(this._insertTag);
  }, t.insert = function(o) {
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(qs(this));
    var r = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var s = Vs(r);
      try {
        s.insertRule(o, s.cssRules.length);
      } catch {
      }
    } else
      r.appendChild(document.createTextNode(o));
    this.ctr++;
  }, t.flush = function() {
    this.tags.forEach(function(o) {
      var r;
      return (r = o.parentNode) == null ? void 0 : r.removeChild(o);
    }), this.tags = [], this.ctr = 0;
  }, e;
}(), B = "-ms-", We = "-moz-", h = "-webkit-", Vn = "comm", At = "rule", Et = "decl", _s = "@import", qn = "@keyframes", Ns = "@layer", Us = Math.abs, Ze = String.fromCharCode, Ys = Object.assign;
function Ks(e, t) {
  return P(e, 0) ^ 45 ? (((t << 2 ^ P(e, 0)) << 2 ^ P(e, 1)) << 2 ^ P(e, 2)) << 2 ^ P(e, 3) : 0;
}
function Wn(e) {
  return e.trim();
}
function Zs(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function m(e, t, n) {
  return e.replace(t, n);
}
function at(e, t) {
  return e.indexOf(t);
}
function P(e, t) {
  return e.charCodeAt(t) | 0;
}
function ge(e, t, n) {
  return e.slice(t, n);
}
function N(e) {
  return e.length;
}
function Pt(e) {
  return e.length;
}
function Se(e, t) {
  return t.push(e), e;
}
function Xs(e, t) {
  return e.map(t).join("");
}
var Xe = 1, de = 1, _n = 0, M = 0, A = 0, me = "";
function Ge(e, t, n, o, r, s, a) {
  return { value: e, root: t, parent: n, type: o, props: r, children: s, line: Xe, column: de, length: a, return: "" };
}
function pe(e, t) {
  return Ys(Ge("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function Gs() {
  return A;
}
function Js() {
  return A = M > 0 ? P(me, --M) : 0, de--, A === 10 && (de = 1, Xe--), A;
}
function H() {
  return A = M < _n ? P(me, M++) : 0, de++, A === 10 && (de = 1, Xe++), A;
}
function Y() {
  return P(me, M);
}
function Te() {
  return M;
}
function Pe(e, t) {
  return ge(me, e, t);
}
function be(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function Nn(e) {
  return Xe = de = 1, _n = N(me = e), M = 0, [];
}
function Un(e) {
  return me = "", e;
}
function Le(e) {
  return Wn(Pe(M - 1, lt(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Qs(e) {
  for (; (A = Y()) && A < 33; )
    H();
  return be(e) > 2 || be(A) > 3 ? "" : " ";
}
function ei(e, t) {
  for (; --t && H() && !(A < 48 || A > 102 || A > 57 && A < 65 || A > 70 && A < 97); )
    ;
  return Pe(e, Te() + (t < 6 && Y() == 32 && H() == 32));
}
function lt(e) {
  for (; H(); )
    switch (A) {
      case e:
        return M;
      case 34:
      case 39:
        e !== 34 && e !== 39 && lt(A);
        break;
      case 40:
        e === 41 && lt(e);
        break;
      case 92:
        H();
        break;
    }
  return M;
}
function ti(e, t) {
  for (; H() && e + A !== 47 + 10; )
    if (e + A === 42 + 42 && Y() === 47)
      break;
  return "/*" + Pe(t, M - 1) + "*" + Ze(e === 47 ? e : H());
}
function ni(e) {
  for (; !be(Y()); )
    H();
  return Pe(e, M);
}
function oi(e) {
  return Un(Ie("", null, null, null, [""], e = Nn(e), 0, [0], e));
}
function Ie(e, t, n, o, r, s, a, l, c) {
  for (var w = 0, u = 0, g = a, F = 0, X = 0, j = 0, y = 1, I = 1, C = 1, $ = 0, q = "", $e = r, Q = s, W = o, v = q; I; )
    switch (j = $, $ = H()) {
      case 40:
        if (j != 108 && P(v, g - 1) == 58) {
          at(v += m(Le($), "&", "&\f"), "&\f") != -1 && (C = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        v += Le($);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        v += Qs(j);
        break;
      case 92:
        v += ei(Te() - 1, 7);
        continue;
      case 47:
        switch (Y()) {
          case 42:
          case 47:
            Se(ri(ti(H(), Te()), t, n), c);
            break;
          default:
            v += "/";
        }
        break;
      case 123 * y:
        l[w++] = N(v) * C;
      case 125 * y:
      case 59:
      case 0:
        switch ($) {
          case 0:
          case 125:
            I = 0;
          case 59 + u:
            C == -1 && (v = m(v, /\f/g, "")), X > 0 && N(v) - g && Se(X > 32 ? Rt(v + ";", o, n, g - 1) : Rt(m(v, " ", "") + ";", o, n, g - 2), c);
            break;
          case 59:
            v += ";";
          default:
            if (Se(W = zt(v, t, n, w, u, r, l, q, $e = [], Q = [], g), s), $ === 123)
              if (u === 0)
                Ie(v, t, W, W, $e, s, g, l, Q);
              else
                switch (F === 99 && P(v, 3) === 110 ? 100 : F) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    Ie(e, W, W, o && Se(zt(e, W, W, 0, 0, r, l, q, r, $e = [], g), Q), r, Q, g, l, o ? $e : Q);
                    break;
                  default:
                    Ie(v, W, W, W, [""], Q, 0, l, Q);
                }
        }
        w = u = X = 0, y = C = 1, q = v = "", g = a;
        break;
      case 58:
        g = 1 + N(v), X = j;
      default:
        if (y < 1) {
          if ($ == 123)
            --y;
          else if ($ == 125 && y++ == 0 && Js() == 125)
            continue;
        }
        switch (v += Ze($), $ * y) {
          case 38:
            C = u > 0 ? 1 : (v += "\f", -1);
            break;
          case 44:
            l[w++] = (N(v) - 1) * C, C = 1;
            break;
          case 64:
            Y() === 45 && (v += Le(H())), F = Y(), u = g = N(q = v += ni(Te())), $++;
            break;
          case 45:
            j === 45 && N(v) == 2 && (y = 0);
        }
    }
  return s;
}
function zt(e, t, n, o, r, s, a, l, c, w, u) {
  for (var g = r - 1, F = r === 0 ? s : [""], X = Pt(F), j = 0, y = 0, I = 0; j < o; ++j)
    for (var C = 0, $ = ge(e, g + 1, g = Us(y = a[j])), q = e; C < X; ++C)
      (q = Wn(y > 0 ? F[C] + " " + $ : m($, /&\f/g, F[C]))) && (c[I++] = q);
  return Ge(e, t, n, r === 0 ? At : l, c, w, u);
}
function ri(e, t, n) {
  return Ge(e, t, n, Vn, Ze(Gs()), ge(e, 2, -2), 0);
}
function Rt(e, t, n, o) {
  return Ge(e, t, n, Et, ge(e, 0, o), ge(e, o + 1, -1), o);
}
function ae(e, t) {
  for (var n = "", o = Pt(e), r = 0; r < o; r++)
    n += t(e[r], r, e, t) || "";
  return n;
}
function si(e, t, n, o) {
  switch (e.type) {
    case Ns:
      if (e.children.length)
        break;
    case _s:
    case Et:
      return e.return = e.return || e.value;
    case Vn:
      return "";
    case qn:
      return e.return = e.value + "{" + ae(e.children, o) + "}";
    case At:
      e.value = e.props.join(",");
  }
  return N(n = ae(e.children, o)) ? e.return = e.value + "{" + n + "}" : "";
}
function ii(e) {
  var t = Pt(e);
  return function(n, o, r, s) {
    for (var a = "", l = 0; l < t; l++)
      a += e[l](n, o, r, s) || "";
    return a;
  };
}
function ai(e) {
  return function(t) {
    t.root || (t = t.return) && e(t);
  };
}
function li(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return function(n) {
    return t[n] === void 0 && (t[n] = e(n)), t[n];
  };
}
var ci = function(t, n, o) {
  for (var r = 0, s = 0; r = s, s = Y(), r === 38 && s === 12 && (n[o] = 1), !be(s); )
    H();
  return Pe(t, M);
}, di = function(t, n) {
  var o = -1, r = 44;
  do
    switch (be(r)) {
      case 0:
        r === 38 && Y() === 12 && (n[o] = 1), t[o] += ci(M - 1, n, o);
        break;
      case 2:
        t[o] += Le(r);
        break;
      case 4:
        if (r === 44) {
          t[++o] = Y() === 58 ? "&\f" : "", n[o] = t[o].length;
          break;
        }
      default:
        t[o] += Ze(r);
    }
  while (r = H());
  return t;
}, ui = function(t, n) {
  return Un(di(Nn(t), n));
}, Ft = /* @__PURE__ */ new WeakMap(), wi = function(t) {
  if (!(t.type !== "rule" || !t.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  t.length < 1)) {
    for (var n = t.value, o = t.parent, r = t.column === o.column && t.line === o.line; o.type !== "rule"; )
      if (o = o.parent, !o)
        return;
    if (!(t.props.length === 1 && n.charCodeAt(0) !== 58 && !Ft.get(o)) && !r) {
      Ft.set(t, !0);
      for (var s = [], a = ui(n, s), l = o.props, c = 0, w = 0; c < a.length; c++)
        for (var u = 0; u < l.length; u++, w++)
          t.props[w] = s[c] ? a[c].replace(/&\f/g, l[u]) : l[u] + " " + a[c];
    }
  }
}, fi = function(t) {
  if (t.type === "decl") {
    var n = t.value;
    // charcode for l
    n.charCodeAt(0) === 108 && // charcode for b
    n.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
};
function Yn(e, t) {
  switch (Ks(e, t)) {
    case 5103:
      return h + "print-" + e + e;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return h + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return h + e + We + e + B + e + e;
    case 6828:
    case 4268:
      return h + e + B + e + e;
    case 6165:
      return h + e + B + "flex-" + e + e;
    case 5187:
      return h + e + m(e, /(\w+).+(:[^]+)/, h + "box-$1$2" + B + "flex-$1$2") + e;
    case 5443:
      return h + e + B + "flex-item-" + m(e, /flex-|-self/, "") + e;
    case 4675:
      return h + e + B + "flex-line-pack" + m(e, /align-content|flex-|-self/, "") + e;
    case 5548:
      return h + e + B + m(e, "shrink", "negative") + e;
    case 5292:
      return h + e + B + m(e, "basis", "preferred-size") + e;
    case 6060:
      return h + "box-" + m(e, "-grow", "") + h + e + B + m(e, "grow", "positive") + e;
    case 4554:
      return h + m(e, /([^-])(transform)/g, "$1" + h + "$2") + e;
    case 6187:
      return m(m(m(e, /(zoom-|grab)/, h + "$1"), /(image-set)/, h + "$1"), e, "") + e;
    case 5495:
    case 3959:
      return m(e, /(image-set\([^]*)/, h + "$1$`$1");
    case 4968:
      return m(m(e, /(.+:)(flex-)?(.*)/, h + "box-pack:$3" + B + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + h + e + e;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return m(e, /(.+)-inline(.+)/, h + "$1$2") + e;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (N(e) - 1 - t > 6)
        switch (P(e, t + 1)) {
          case 109:
            if (P(e, t + 4) !== 45)
              break;
          case 102:
            return m(e, /(.+:)(.+)-([^]+)/, "$1" + h + "$2-$3$1" + We + (P(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
          case 115:
            return ~at(e, "stretch") ? Yn(m(e, "stretch", "fill-available"), t) + e : e;
        }
      break;
    case 4949:
      if (P(e, t + 1) !== 115)
        break;
    case 6444:
      switch (P(e, N(e) - 3 - (~at(e, "!important") && 10))) {
        case 107:
          return m(e, ":", ":" + h) + e;
        case 101:
          return m(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + h + (P(e, 14) === 45 ? "inline-" : "") + "box$3$1" + h + "$2$3$1" + B + "$2box$3") + e;
      }
      break;
    case 5936:
      switch (P(e, t + 11)) {
        case 114:
          return h + e + B + m(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return h + e + B + m(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return h + e + B + m(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return h + e + B + e + e;
  }
  return e;
}
var hi = function(t, n, o, r) {
  if (t.length > -1 && !t.return)
    switch (t.type) {
      case Et:
        t.return = Yn(t.value, t.length);
        break;
      case qn:
        return ae([pe(t, {
          value: m(t.value, "@", "@" + h)
        })], r);
      case At:
        if (t.length)
          return Xs(t.props, function(s) {
            switch (Zs(s, /(::plac\w+|:read-\w+)/)) {
              case ":read-only":
              case ":read-write":
                return ae([pe(t, {
                  props: [m(s, /:(read-\w+)/, ":" + We + "$1")]
                })], r);
              case "::placeholder":
                return ae([pe(t, {
                  props: [m(s, /:(plac\w+)/, ":" + h + "input-$1")]
                }), pe(t, {
                  props: [m(s, /:(plac\w+)/, ":" + We + "$1")]
                }), pe(t, {
                  props: [m(s, /:(plac\w+)/, B + "input-$1")]
                })], r);
            }
            return "";
          });
    }
}, mi = [hi], pi = function(t) {
  var n = t.key;
  if (n === "css") {
    var o = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(o, function(y) {
      var I = y.getAttribute("data-emotion");
      I.indexOf(" ") !== -1 && (document.head.appendChild(y), y.setAttribute("data-s", ""));
    });
  }
  var r = t.stylisPlugins || mi, s = {}, a, l = [];
  a = t.container || document.head, Array.prototype.forEach.call(
    // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll('style[data-emotion^="' + n + ' "]'),
    function(y) {
      for (var I = y.getAttribute("data-emotion").split(" "), C = 1; C < I.length; C++)
        s[I[C]] = !0;
      l.push(y);
    }
  );
  var c, w = [wi, fi];
  {
    var u, g = [si, ai(function(y) {
      u.insert(y);
    })], F = ii(w.concat(r, g)), X = function(I) {
      return ae(oi(I), F);
    };
    c = function(I, C, $, q) {
      u = $, X(I ? I + "{" + C.styles + "}" : C.styles), q && (j.inserted[C.name] = !0);
    };
  }
  var j = {
    key: n,
    sheet: new Ws({
      key: n,
      container: a,
      nonce: t.nonce,
      speedy: t.speedy,
      prepend: t.prepend,
      insertionPoint: t.insertionPoint
    }),
    nonce: t.nonce,
    inserted: s,
    registered: {},
    insert: c
  };
  return j.sheet.hydrate(l), j;
};
function gi(e) {
  for (var t = 0, n, o = 0, r = e.length; r >= 4; ++o, r -= 4)
    n = e.charCodeAt(o) & 255 | (e.charCodeAt(++o) & 255) << 8 | (e.charCodeAt(++o) & 255) << 16 | (e.charCodeAt(++o) & 255) << 24, n = /* Math.imul(k, m): */
    (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16), n ^= /* k >>> r: */
    n >>> 24, t = /* Math.imul(k, m): */
    (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  switch (r) {
    case 3:
      t ^= (e.charCodeAt(o + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(o + 1) & 255) << 8;
    case 1:
      t ^= e.charCodeAt(o) & 255, t = /* Math.imul(h, m): */
      (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  }
  return t ^= t >>> 13, t = /* Math.imul(h, m): */
  (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
var bi = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
}, vi = !1, yi = /[A-Z]|^ms/g, ki = /_EMO_([^_]+?)_([^]*?)_EMO_/g, Kn = function(t) {
  return t.charCodeAt(1) === 45;
}, Vt = function(t) {
  return t != null && typeof t != "boolean";
}, tt = /* @__PURE__ */ li(function(e) {
  return Kn(e) ? e : e.replace(yi, "-$&").toLowerCase();
}), qt = function(t, n) {
  switch (t) {
    case "animation":
    case "animationName":
      if (typeof n == "string")
        return n.replace(ki, function(o, r, s) {
          return U = {
            name: r,
            styles: s,
            next: U
          }, r;
        });
  }
  return bi[t] !== 1 && !Kn(t) && typeof n == "number" && n !== 0 ? n + "px" : n;
}, xi = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
function ve(e, t, n) {
  if (n == null)
    return "";
  var o = n;
  if (o.__emotion_styles !== void 0)
    return o;
  switch (typeof n) {
    case "boolean":
      return "";
    case "object": {
      var r = n;
      if (r.anim === 1)
        return U = {
          name: r.name,
          styles: r.styles,
          next: U
        }, r.name;
      var s = n;
      if (s.styles !== void 0) {
        var a = s.next;
        if (a !== void 0)
          for (; a !== void 0; )
            U = {
              name: a.name,
              styles: a.styles,
              next: U
            }, a = a.next;
        var l = s.styles + ";";
        return l;
      }
      return Ci(e, t, n);
    }
    case "function": {
      if (e !== void 0) {
        var c = U, w = n(e);
        return U = c, ve(e, t, w);
      }
      break;
    }
  }
  var u = n;
  if (t == null)
    return u;
  var g = t[u];
  return g !== void 0 ? g : u;
}
function Ci(e, t, n) {
  var o = "";
  if (Array.isArray(n))
    for (var r = 0; r < n.length; r++)
      o += ve(e, t, n[r]) + ";";
  else
    for (var s in n) {
      var a = n[s];
      if (typeof a != "object") {
        var l = a;
        t != null && t[l] !== void 0 ? o += s + "{" + t[l] + "}" : Vt(l) && (o += tt(s) + ":" + qt(s, l) + ";");
      } else {
        if (s === "NO_COMPONENT_SELECTOR" && vi)
          throw new Error(xi);
        if (Array.isArray(a) && typeof a[0] == "string" && (t == null || t[a[0]] === void 0))
          for (var c = 0; c < a.length; c++)
            Vt(a[c]) && (o += tt(s) + ":" + qt(s, a[c]) + ";");
        else {
          var w = ve(e, t, a);
          switch (s) {
            case "animation":
            case "animationName": {
              o += tt(s) + ":" + w + ";";
              break;
            }
            default:
              o += s + "{" + w + "}";
          }
        }
      }
    }
  return o;
}
var Wt = /label:\s*([^\s;{]+)\s*(;|$)/g, U;
function nt(e, t, n) {
  if (e.length === 1 && typeof e[0] == "object" && e[0] !== null && e[0].styles !== void 0)
    return e[0];
  var o = !0, r = "";
  U = void 0;
  var s = e[0];
  if (s == null || s.raw === void 0)
    o = !1, r += ve(n, t, s);
  else {
    var a = s;
    r += a[0];
  }
  for (var l = 1; l < e.length; l++)
    if (r += ve(n, t, e[l]), o) {
      var c = s;
      r += c[l];
    }
  Wt.lastIndex = 0;
  for (var w = "", u; (u = Wt.exec(r)) !== null; )
    w += "-" + u[1];
  var g = gi(r) + w;
  return {
    name: g,
    styles: r,
    next: U
  };
}
var Ai = !0;
function Zn(e, t, n) {
  var o = "";
  return n.split(" ").forEach(function(r) {
    e[r] !== void 0 ? t.push(e[r] + ";") : r && (o += r + " ");
  }), o;
}
var Ei = function(t, n, o) {
  var r = t.key + "-" + n.name;
  // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (o === !1 || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  Ai === !1) && t.registered[r] === void 0 && (t.registered[r] = n.styles);
}, Pi = function(t, n, o) {
  Ei(t, n, o);
  var r = t.key + "-" + n.name;
  if (t.inserted[n.name] === void 0) {
    var s = n;
    do
      t.insert(n === s ? "." + r : "", s, t.sheet, !0), s = s.next;
    while (s !== void 0);
  }
};
function _t(e, t) {
  if (e.inserted[t.name] === void 0)
    return e.insert("", t, e.sheet, !0);
}
function Nt(e, t, n) {
  var o = [], r = Zn(e, o, n);
  return o.length < 2 ? n : r + t(o);
}
var $i = function(t) {
  var n = pi(t);
  n.sheet.speedy = function(l) {
    this.isSpeedy = l;
  }, n.compat = !0;
  var o = function() {
    for (var c = arguments.length, w = new Array(c), u = 0; u < c; u++)
      w[u] = arguments[u];
    var g = nt(w, n.registered, void 0);
    return Pi(n, g, !1), n.key + "-" + g.name;
  }, r = function() {
    for (var c = arguments.length, w = new Array(c), u = 0; u < c; u++)
      w[u] = arguments[u];
    var g = nt(w, n.registered), F = "animation-" + g.name;
    return _t(n, {
      name: g.name,
      styles: "@keyframes " + F + "{" + g.styles + "}"
    }), F;
  }, s = function() {
    for (var c = arguments.length, w = new Array(c), u = 0; u < c; u++)
      w[u] = arguments[u];
    var g = nt(w, n.registered);
    _t(n, g);
  }, a = function() {
    for (var c = arguments.length, w = new Array(c), u = 0; u < c; u++)
      w[u] = arguments[u];
    return Nt(n.registered, o, Bi(w));
  };
  return {
    css: o,
    cx: a,
    injectGlobal: s,
    keyframes: r,
    hydrate: function(c) {
      c.forEach(function(w) {
        n.inserted[w] = !0;
      });
    },
    flush: function() {
      n.registered = {}, n.inserted = {}, n.sheet.flush();
    },
    sheet: n.sheet,
    cache: n,
    getRegisteredStyles: Zn.bind(null, n.registered),
    merge: Nt.bind(null, n.registered, o)
  };
}, Bi = function e(t) {
  for (var n = "", o = 0; o < t.length; o++) {
    var r = t[o];
    if (r != null) {
      var s = void 0;
      switch (typeof r) {
        case "boolean":
          break;
        case "object": {
          if (Array.isArray(r))
            s = e(r);
          else {
            s = "";
            for (var a in r)
              r[a] && a && (s && (s += " "), s += a);
          }
          break;
        }
        default:
          s = r;
      }
      s && (n && (n += " "), n += s);
    }
  }
  return n;
}, Si = $i({
  key: "css"
}), ot = Si.injectGlobal;
function Ti(e) {
  e.state && (e.customClass.containerName && ot`
      .${e.customClass.containerName} * {
        box-sizing: border-box;
        &:focus {
          outline: none;
        }
      }
    `, e.customClass.confirmButton || ot`
      .swal2-confirm {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0 5px;
        padding: 8px 20px;
        color: #fff;
        font-size: 14px;
        background-color: ${e.masterColor || "#ccc"};
        border: none;
      }
    `, e.customClass.closeButton || ot`
      .swal2-close {
        position: absolute;
        top: 0;
        padding: 0 0.3em;
        width: auto;
      }
    `, qe.mixin().fire(e));
}
window.openAlert = Ti;
export {
  Ti as openAlert
};
