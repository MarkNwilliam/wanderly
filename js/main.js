/* ==========================================================
   Wanderly — main.js
   Four behaviours:
     1. navigation state + mobile toggle
     2. preference filtering
     3. country selector
     4. contact form validation
   ========================================================== */

(function () {
  "use strict";

  /* ---------------- 1. NAVIGATION ---------------- */

  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu after choosing a link on a phone
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Highlight whichever page you are on
  var path = window.location.pathname.split("/").pop() || "index.html";
  var hash = window.location.hash.replace("#", "");

  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var target = a.getAttribute("href");
    var page = a.dataset.page;
    var isMatch =
      target === path ||
      (path === "index.html" && hash && page === hash) ||
      (path === "" && page === "home");
    if (isMatch) a.classList.add("active");
  });

  /* ---------------- 2. PREFERENCE FILTER ---------------- */

  var PREFERENCE_TEXT = {
    beach: {
      title: "You picked beaches and coast",
      body:
        "Start with Nyali on the Kenyan coast — it is the closest genuine beach to " +
        "Kampala and it works in a long weekend. If you have a full week, fly to " +
        "Zanzibar instead; the water is clearer and the island is worth the trip on its own."
    },
    temple: {
      title: "You picked temples and heritage",
      body:
        "Kandy in Sri Lanka is the stronger of the two. The Temple of the Tooth is an " +
        "active place of worship, the country is safe and inexpensive, and it pairs " +
        "with Yala for wildlife. Prambanan in Indonesia is the pick if you would rather " +
        "see the largest Hindu complex in Java."
    },
    wildlife: {
      title: "You picked wildlife and nature",
      body:
        "Neither of the two beach or temple picks will hold your attention, so skip both. " +
        "Go to Kigali for Volcanoes National Park if you have four days, or make Kenya " +
        "your base and spend two of them in the Maasai Mara."
    },
    city: {
      title: "You picked cities and food",
      body:
        "Zanzibar's Stone Town is the pick — walkable, cheap, and the food markets are " +
        "the reason to go. Kigali is the other one worth your time: clean, safe and " +
        "genuinely easy to eat well in."
    }
  };

  var choices = document.querySelectorAll(".choice");
  var cards = document.querySelectorAll(".card[data-category]");
  var result = document.getElementById("finderResult");

  function applyPreference(pref) {
    choices.forEach(function (c) {
      c.classList.toggle("is-active", c.dataset.pref === pref);
    });

    // Cards that do not match the chosen preference are dimmed, not hidden,
    // so the page never appears to lose content.
    var wantWildlife = pref === "wildlife";
    var wantCity = pref === "city";

    cards.forEach(function (card) {
      var cat = card.dataset.category;
      var show;
      if (wantWildlife || wantCity) {
        show = false;                       // this site has no wildlife/city cards
      } else {
        show = cat === pref;
      }
      card.classList.toggle("dimmed", !show);
    });

    if (result) {
      var t = PREFERENCE_TEXT[pref];
      result.innerHTML =
        "<h3>" + t.title + "</h3><p>" + t.body + "</p>";
    }
  }

  choices.forEach(function (c) {
    c.addEventListener("click", function () {
      applyPreference(c.dataset.pref);
    });
  });

  applyPreference("beach");

  /* ---------------- 3. NAVBAR SEARCH (Search / Clear) ---------------- */

  var searchForm = document.getElementById("navSearch");
  var searchInput = document.getElementById("siteSearch");
  var clearBtn = document.getElementById("clearSearch");

  // Banner that reports how many destinations matched.
  function searchStatusBox() {
    var box = document.getElementById("searchStatus");
    if (!box && document.getElementById("intro")) {
      box = document.createElement("div");
      box.id = "searchStatus";
      box.className = "search-status";
      box.setAttribute("role", "status");
      document.getElementById("intro").appendChild(box);
    }
    return box;
  }

  function clearSearchNow() {
    if (searchInput) searchInput.value = "";

    document.querySelectorAll(".card[data-category]").forEach(function (c) {
      c.classList.remove("dimmed");
    });

    var box = document.getElementById("searchStatus");
    if (box) {
      box.className = "search-status";
      box.textContent = "";
    }

    // Put the preference panel back to its default state.
    applyPreference("beach");
  }

  function runSearch(term) {
    var box = searchStatusBox();
    if (!box) return;

    var q = term.trim().toLowerCase();

    if (!q) {
      clearSearchNow();
      return;
    }

    var cards = document.querySelectorAll(".card[data-category]");
    var hits = 0;

    cards.forEach(function (card) {
      var title = card.querySelector("h3");
      var text = card.textContent.toLowerCase();
      var match = (title ? title.textContent.toLowerCase().indexOf(q) > -1 : false) ||
                  text.indexOf(q) > -1;

      card.classList.toggle("dimmed", !match);
      if (match) hits++;
    });

    // Searching overrides the preference filter for as long as it is active.
    if (hits > 0) {
      box.className = "search-status show";
      box.textContent =
        hits + (hits === 1 ? " destination matches " : " destinations match ") +
        "“" + term.trim() + "”. Close-up view is on.";
    } else {
      box.className = "search-status show none";
      box.textContent =
        "Nothing matches “" + term.trim() + "”. Try a country (Kenya, Zanzibar, " +
        "Sri Lanka) or a type of place (beach, temple, coast).";
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var term = searchInput ? searchInput.value : "";

      // The recommendation cards only exist on the home page, so a search
      // started from About or Contact is carried over to it.
      if (!document.querySelector(".card[data-category]")) {
        window.location.href = "index.html?q=" + encodeURIComponent(term.trim());
        return;
      }
      runSearch(term);
    });
  }

  // Landing back from another page: run the carried query.
  (function applyCarriedQuery() {
    var m = window.location.search.match(/[?&]q=([^&]*)/);
    if (!m) return;
    var term = decodeURIComponent(m[1].replace(/\+/g, " "));
    if (!term) return;
    if (searchInput) searchInput.value = term;
    runSearch(term);
  })();

  if (clearBtn) {
    clearBtn.addEventListener("click", clearSearchNow);
  }

  /* ---------------- 4. COUNTRY SELECTOR ---------------- */

  var COUNTRIES = {
    uganda: {
      name: "Uganda",
      blurb:
        "The country you are standing in, and the cheapest base for the region. " +
        "Fly to Entebbe, and treat Kampala as a stop rather than a destination.",
      places: [
        {
          title: "Source of the Nile, Jinja",
          img: "images/uganda-nile.svg",
          note:
            "Where the Nile leaves Lake Victoria. One day is enough — go in the morning " +
            "before the afternoon wind, and take the boat rather than the viewpoint."
        },
        {
          title: "Kibale Forest, Fort Portal",
          img: "images/uganda-kibale.svg",
          note:
            "Thirteen primate species in one forest, and the cheapest place in East Africa " +
            "to see gorillas. Book the walk with a registered guide — it is required, not optional."
        }
      ]
    },
    kenya: {
      name: "Kenya",
      blurb:
        "Two hundred kilometres of coast on one side, the Maasai Mara on the other. " +
        "Kenya is the most varied country on this list and the easiest to fly around.",
      places: [
        {
          title: "Maasai Mara, Narok",
          img: "images/kenya-maasai.svg",
          note:
            "The great migration crosses the Mara from roughly July to October. It is the " +
            "single most expensive place to see, and it is worth it once."
        },
        {
          title: "Nyali Beach, Mombasa",
          img: "images/kenya-nyali.svg",
          note:
            "The closest proper beach to Kampala. Take Lamu flights from Wilson Airport " +
            "if you would rather skip the six-hour drive."
        }
      ]
    },
    tanzania: {
      name: "Tanzania",
      blurb:
        "Kilimanjaro and the Serengeti make Tanzania famous, which is why it costs more " +
        "than it needs to. The Zanzibar coast is the value in this list.",
      places: [
        {
          title: "Stone Town, Zanzibar",
          img: "images/tanzania-zanzibar.svg",
          note:
            "A working port town with a UNESCO-listed old quarter. Book the night-market " +
            "food tour early, and cross the channel to Nungwi the next day."
        },
        {
          title: "Kilimanjaro, Arusha",
          img: "images/tanzania-kilimanjaro.svg",
          note:
            "Five days on the mountain on the Marangu route. Hire a licensed guide and " +
            "budget for the park fees — they are the expensive part, not the porters."
        }
      ]
    },
    rwanda: {
      name: "Rwanda",
      blurb:
        "Small, safe, clean and expensive for what it is — but it rewards two or three " +
        "days more than most people give it.",
      places: [
        {
          title: "Volcanoes National Park",
          img: "images/rwanda-volcano.svg",
          note:
            "Half of the world's mountain gorillas, with a far better viewing experience " +
            "than Uganda's. Book permits months ahead; they sell out."
        },
        {
          title: "Kigali",
          img: "images/rwanda-kigali.svg",
          note:
            "A genuinely good food city, and the safest place in East Africa. Use it as " +
            "the base for the gorillas rather than a stopover."
        }
      ]
    },
    srilanka: {
      name: "Sri Lanka",
      blurb:
        "The best value long-haul trip from East Africa. Eight hours from Dubai or Doha, " +
        "and the country is inexpensive once you land.",
      places: [
        {
          title: "Kandy &amp; the Temple of the Tooth",
          img: "images/srilanka-kandy.svg",
          note:
            "Sri Lanka's most sacred temple, beside the lake. Cover shoulders and knees, " +
            "remove shoes at the gate, and go early."
        },
        {
          title: "Yala National Park",
          img: "images/srilanka-yala.svg",
          note:
            "Sri Lanka's best wildlife park — elephants guaranteed, leopard genuinely likely. " +
            "A safari here costs a fraction of an East African one."
        }
      ]
    },
    indonesia: {
      name: "Indonesia",
      blurb:
            "Vast, cheap at the edges and expensive in the middle. Java is the most " +
            "interesting part and it is not the Bali everyone pictures.",
      places: [
        {
          title: "Yogyakarta &amp; Prambanan",
          img: "images/indonesia-yogyakarta.svg",
          note:
            "Java's cultural centre. Prambanan and Borobudur are both within a couple of " +
            "hours — buy the combined ticket and give yourself two days."
        },
        {
          title: "Bali",
          img: "images/indonesia-bali.svg",
          note:
            "Crowded and commercial in Ubud, but the east side — Sidemen, Padangtegal — " +
            "is quieter and cheaper for the same scenery."
        }
      ]
    }
  };

  var countrySelect = document.getElementById("countrySelect");
  var countryResult = document.getElementById("countryResult");

  if (countrySelect && countryResult) {
    countrySelect.addEventListener("change", function () {
      var key = this.value;

      if (!key) {
        countryResult.innerHTML =
          '<p class="placeholder">Choose a country above to see its top two destinations.</p>';
        return;
      }

      var c = COUNTRIES[key];
      if (!c) return;

      var html = "<p>" + c.blurb + "</p><div class=\"country-grid\">";

      c.places.forEach(function (p) {
        html +=
          '<article class="card">' +
            '<img src="' + p.img + '" alt="Illustration of ' + p.title.replace(/&amp;/g, "and") + '">' +
            '<div class="card-body">' +
              "<h3>" + p.title + "</h3>" +
              "<p>" + p.note + "</p>" +
            "</div>" +
          "</article>";
      });

      html += "</div>";
      countryResult.innerHTML = html;
    });
  }

  /* ---------------- 5. EXPAND / COLLAPSE ---------------- */

  document.querySelectorAll(".expand").forEach(function (btn) {
    var target = document.getElementById(btn.dataset.more);

    // The text lives in a hidden <p> next to the button, so this keeps working
    // if JavaScript never loads — the detail just stays collapsed.
    if (!target) {
      var sibling = btn.parentElement.querySelector(".more");
      target = sibling;
    }
    if (!target) return;

    var label = btn.textContent;

    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", function () {
      var open = target.hasAttribute("hidden");

      if (open) {
        target.removeAttribute("hidden");
        btn.textContent = "Show less";
        btn.setAttribute("aria-expanded", "true");
      } else {
        target.setAttribute("hidden", "");
        btn.textContent = label;
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------------- 6. CONTACT FORM ---------------- */

  var form = document.getElementById("contactForm");

  if (form) {
    var status = document.getElementById("formStatus");

    // Matches name@domain.tld, with at least one dot in the domain.
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(id, msg) {
      var span = document.getElementById(id);
      var input = document.getElementById(id.replace("Error", ""));
      if (span) span.textContent = msg;
      if (input) input.classList.toggle("invalid", msg !== "");
      return msg === "";
    }

    function checkName() {
      var v = document.getElementById("name").value.trim();
      if (!v) return setError("nameError", "Please enter your name.");
      if (v.length < 2) return setError("nameError", "That name looks too short.");
      return setError("nameError", "");
    }

    function checkEmail() {
      var v = document.getElementById("email").value.trim();
      if (!v) return setError("emailError", "Please enter your email address.");
      if (!EMAIL.test(v)) return setError("emailError", "That email address does not look right.");
      return setError("emailError", "");
    }

    function checkSubject() {
      var v = document.getElementById("subject").value;
      if (!v) return setError("subjectError", "Please choose a subject.");
      return setError("subjectError", "");
    }

    function checkMessage() {
      var v = document.getElementById("message").value.trim();
      if (!v) return setError("messageError", "Please write a message.");
      if (v.length < 15) return setError("messageError", "Please add a little more detail (15+ characters).");
      return setError("messageError", "");
    }

    // Re-check a field only after it has been touched, so the form is not
    // shouting at someone while they are still typing their name.
    function bindLive(el, fn) {
      var touched = false;
      el.addEventListener("blur", function () { touched = true; fn(); });
      el.addEventListener("input", function () { if (touched) fn(); });
      el.addEventListener("change", function () { if (touched) fn(); });
    }

    bindLive(document.getElementById("name"), checkName);
    bindLive(document.getElementById("email"), checkEmail);
    bindLive(document.getElementById("subject"), checkSubject);
    bindLive(document.getElementById("message"), checkMessage);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var results = [checkName(), checkEmail(), checkSubject(), checkMessage()];
      var ok = results.every(Boolean);

      if (!ok) {
        status.className = "form-status bad show";
        status.textContent = "Please fix the highlighted fields and try again.";
        var firstBad = form.querySelector(".invalid");
        if (firstBad) firstBad.focus();
        return;
      }

      var name = document.getElementById("name").value.trim();
      status.className = "form-status ok show";
      status.textContent =
        "Thanks " + name + " — your message passed validation and is ready to send. " +
        "This is a student project with no live mail server, so nothing was actually transmitted.";

      form.reset();
      ["nameError", "emailError", "subjectError", "messageError"].forEach(function (id) {
        setError(id, "");
      });
    });

    var resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        status.className = "form-status";
        ["nameError", "emailError", "subjectError", "messageError"].forEach(function (id) {
          setError(id, "");
        });
      });
    }
  }
})();