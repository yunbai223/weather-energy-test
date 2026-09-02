/* =====================================================
   答题流程 · 判分 · 结果渲染
   ===================================================== */

(function () {
  "use strict";

  /* ---------- DOM 引用 ---------- */
  var pages = {
    welcome: document.getElementById("page-welcome"),
    quiz: document.getElementById("page-quiz"),
    loading: document.getElementById("page-loading"),
    result: document.getElementById("page-result")
  };

  var qText = document.getElementById("q-text");
  var optionList = document.getElementById("option-list");
  var qCurrent = document.getElementById("q-current");
  var qTotal = document.getElementById("q-total");
  var progressFill = document.getElementById("progress-fill");
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");

  /* ---------- 状态 ---------- */
  var quizOrder = [];        // 打乱后的题目顺序（原下标）
  var answers = [];          // 每题的选项下标
  var currentIndex = 0;      // 当前题在 quizOrder 中的位置

  /* ---------- 工具函数 ---------- */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function switchPage(name) {
    Object.keys(pages).forEach(function (key) {
      pages[key].classList.remove("active");
    });
    pages[name].classList.add("active");
    if (name === "result" || name === "quiz") {
      window.scrollTo(0, 0);
    }
  }

  function showToast(msg) {
    var toast = document.getElementById("toast");
    toast.textContent = msg || "已复制 ✨";
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  /* ---------- 初始化与页面切换 ---------- */
  document.getElementById("btn-start").addEventListener("click", startQuiz);

  function startQuiz() {
    quizOrder = shuffle(QUESTIONS.map(function (_, i) { return i; }));
    answers = [];
    currentIndex = 0;
    qTotal.textContent = QUESTIONS.length;
    switchPage("quiz");
    renderQuestion();
  }

  /* ---------- 渲染当前题 ---------- */
  function renderQuestion() {
    var qi = quizOrder[currentIndex];
    var question = QUESTIONS[qi];
    var chosen = answers[currentIndex];

    qCurrent.textContent = currentIndex + 1;
    progressFill.style.width = ((currentIndex + 1) / QUESTIONS.length * 100) + "%";

    qText.textContent = question.q;
    qText.classList.remove("anim-in");
    void qText.offsetWidth; // 强制重绘以重新触发动画
    qText.classList.add("anim-in");

    optionList.innerHTML = "";
    question.options.forEach(function (opt, idx) {
      var card = document.createElement("div");
      card.className = "option-card" + (chosen === idx ? " selected" : "");
      card.textContent = opt.text;
      card.style.animationDelay = (idx * 0.06) + "s";
      card.addEventListener("click", function () {
        selectOption(idx);
      });
      optionList.appendChild(card);
    });

    btnPrev.disabled = currentIndex === 0;
    var isLast = currentIndex === QUESTIONS.length - 1;
    btnNext.textContent = isLast ? "查看我的天气" : "下一题";
    btnNext.disabled = chosen === undefined;
  }

  function selectOption(idx) {
    answers[currentIndex] = idx;
    var cards = optionList.querySelectorAll(".option-card");
    cards.forEach(function (card, i) {
      card.classList.toggle("selected", i === idx);
    });
    btnNext.disabled = false;
  }

  btnPrev.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  btnNext.addEventListener("click", function () {
    if (answers[currentIndex] === undefined) return;
    if (currentIndex < QUESTIONS.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });

  /* ---------- 判分 ---------- */
  function calculateResult() {
    var scores = {};
    TYPE_ORDER.forEach(function (id) { scores[id] = 0; });

    quizOrder.forEach(function (qi, pos) {
      var optIdx = answers[pos];
      if (optIdx === undefined) return;
      var weights = QUESTIONS[qi].options[optIdx].weights;
      Object.keys(weights).forEach(function (typeId) {
        if (scores[typeId] !== undefined) {
          scores[typeId] += weights[typeId];
        }
      });
    });

    var max = -1;
    var bestId = TYPE_ORDER[0];
    TYPE_ORDER.forEach(function (id) {
      if (scores[id] > max) {
        max = scores[id];
        bestId = id;
      }
    });
    return bestId;
  }

  /* ---------- 完成测试：加载动效 → 结果 ---------- */
  function finishQuiz() {
    switchPage("loading");

    // 依次点亮加载文案
    var lines = [
      document.getElementById("load-line-1"),
      document.getElementById("load-line-2"),
      document.getElementById("load-line-3")
    ];
    lines.forEach(function (el) { el.classList.remove("show"); });

    var orb = document.getElementById("loading-orb");
    var orbFaces = ["🌥", "🌦", "🌧", "⛈", "🌈"];
    var faceIdx = 0;

    lines[0].classList.add("show");
    var faceTimer = setInterval(function () {
      orb.textContent = orbFaces[faceIdx % orbFaces.length];
      faceIdx++;
    }, 350);

    setTimeout(function () { lines[1].classList.add("show"); }, 700);
    setTimeout(function () { lines[2].classList.add("show"); }, 1400);

    setTimeout(function () {
      clearInterval(faceTimer);
      var resultId = calculateResult();
      renderResult(resultId);
      switchPage("result");
    }, 2100);
  }

  /* ---------- 渲染结果 ---------- */
  function renderResult(id) {
    var r = RESULTS[id];
    if (!r) {
      r = RESULTS[TYPE_ORDER[0]];
    }

    document.getElementById("r-icon").textContent = r.icon;
    document.getElementById("r-type").textContent = r.name;
    document.getElementById("r-slogan").textContent = r.slogan;

    // 关键词标签
    var tagBox = document.getElementById("r-tags");
    tagBox.innerHTML = "";
    r.tags.forEach(function (tag) {
      var span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagBox.appendChild(span);
    });

    // 能量档案
    document.getElementById("r-base").textContent = r.base;
    document.getElementById("r-good").textContent = r.good;
    document.getElementById("r-misunderstood").textContent = r.misunderstood;
    document.getElementById("r-company").textContent = r.company;
    document.getElementById("r-charge").textContent = r.charge;
    document.getElementById("r-quote").textContent = "「" + r.quote + "」";

    // 背景主题
    var bg = document.getElementById("result-bg");
    bg.setAttribute("data-theme", r.theme || "day");

    // 分享文案
    renderResult._share = r.shareText;
  }

  /* ---------- 复制分享 ---------- */
  document.getElementById("btn-copy").addEventListener("click", function () {
    var text = renderResult._share ||
      "我测出了我的能量天气，你也来测测看吧 ✨";

    function done() {
      showToast("已复制，去发小红书吧 ✨");
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("已复制，去发小红书吧 ✨");
    } catch (e) {
      showToast("复制失败，请长按手动复制");
    }
    document.body.removeChild(ta);
  }

  /* ---------- 再测一次 ---------- */
  document.getElementById("btn-again").addEventListener("click", function () {
    startQuiz();
  });

})();