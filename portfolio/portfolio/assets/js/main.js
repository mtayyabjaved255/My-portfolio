(function () {
    'use strict';

    var TO_EMAIL = 'm.tayyebjaved255@gmail.com';
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    /*===== LOADER =====*/
    var loader = $('#loader'), bar = $('#loader-bar'), pct = $('#loader-percent'), ltxt = $('#loader-text');
    var CIRC = 339.3, progress = 0, pageLoaded = false;
    var messages = ['Loading portfolio', 'Preparing designs', 'Polishing details', 'Almost ready'];
    document.body.classList.add('is-loading');

    window.addEventListener('load', function () { pageLoaded = true; });

    var loadTimer = setInterval(function () {
        var step = pageLoaded ? 6 : Math.random() * 3 + .5;
        progress = Math.min(progress + step, pageLoaded ? 100 : 90);
        bar.style.strokeDashoffset = CIRC - (CIRC * progress / 100);
        pct.textContent = Math.floor(progress) + '%';
        ltxt.textContent = messages[Math.min(3, Math.floor(progress / 26))];
        if (progress >= 100) {
            clearInterval(loadTimer);
            setTimeout(function () {
                loader.classList.add('hide');
                document.body.classList.remove('is-loading');
                startTyping();
                countStats();
            }, 350);
        }
    }, 35);

    /*===== TYPING EFFECT =====*/
    var typedStarted = false;
    function startTyping() {
        if (typedStarted) return; typedStarted = true;
        var el = $('#typed');
        var words = ['Graphic Designer', 'Packaging & Label Designer', 'Brand Identity Designer', 'Social Media Designer'];
        var w = 0, c = 0, del = false;
        (function tick() {
            var word = words[w];
            el.textContent = word.substring(0, c);
            if (!del && c < word.length) { c++; setTimeout(tick, 80); }
            else if (!del) { del = true; setTimeout(tick, 1500); }
            else if (c > 0) { c--; setTimeout(tick, 40); }
            else { del = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
        })();
    }

    /*===== STATS COUNTER =====*/
    function countStats() {
        $$('.stats__num').forEach(function (el) {
            var target = +el.getAttribute('data-count'), n = 0, inc = Math.max(1, target / 60);
            var t = setInterval(function () {
                n += inc;
                if (n >= target) { n = target; clearInterval(t); }
                el.textContent = Math.floor(n);
            }, 25);
        });
    }

    /*===== MOBILE MENU =====*/
    var toggle = $('#nav-toggle'), menu = $('#nav-menu');
    toggle.addEventListener('click', function () {
        menu.classList.toggle('show');
        toggle.firstElementChild.className = menu.classList.contains('show') ? 'bx bx-x' : 'bx bx-menu';
    });
    $$('.nav__link').forEach(function (l) {
        l.addEventListener('click', function () {
            menu.classList.remove('show');
            toggle.firstElementChild.className = 'bx bx-menu';
        });
    });

    /*===== SCROLL: SPY, HEADER, PROGRESS, TO-TOP =====*/
    var sections = $$('main section[id]'), links = $$('.nav__link');
    var header = $('#header'), prog = $('#progress'), toTop = $('#to-top');
    function onScroll() {
        var y = window.pageYOffset;
        header.classList.toggle('scrolled', y > 40);
        toTop.classList.toggle('show', y > 500);
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
        var current = 'home';
        sections.forEach(function (s) { if (y >= s.offsetTop - 140) current = s.id; });
        links.forEach(function (l) { l.classList.toggle('active-link', l.getAttribute('href') === '#' + current); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /*===== SKILL BARS =====*/
    var fills = $$('.skills__fill');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.style.width = e.target.getAttribute('data-level') + '%';
                    io.unobserve(e.target);
                }
            });
        }, { threshold: .4 });
        fills.forEach(function (f) { io.observe(f); });
    } else {
        fills.forEach(function (f) { f.style.width = f.getAttribute('data-level') + '%'; });
    }

    /*===== SCROLL REVEAL =====*/
    if (window.ScrollReveal) {
        var sr = ScrollReveal({ origin: 'bottom', distance: '50px', duration: 900, delay: 100, easing: 'cubic-bezier(.22,.9,.3,1)', reset: false });
        sr.reveal('.home__data, .home__img', { origin: 'left', interval: 150 });
        sr.reveal('.home__social-icon', { interval: 150, origin: 'bottom' });
        sr.reveal('.stats__item', { interval: 120 });
        sr.reveal('.about__img', { origin: 'left' });
        sr.reveal('.about__info', { origin: 'right' });
        sr.reveal('.skills__data', { interval: 120, origin: 'left' });
        sr.reveal('.skills__card', { interval: 120 });
        sr.reveal('.work__filters');
        sr.reveal('.contact__card', { interval: 120, origin: 'left' });
        sr.reveal('.contact__form', { origin: 'right' });
    }

    /*===== WORK FILTER =====*/
    var items = $$('.work__item');
    $$('.work__filter').forEach(function (btn) {
        btn.addEventListener('click', function () {
            $$('.work__filter').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var f = btn.getAttribute('data-filter');
            items.forEach(function (it) {
                var show = f === 'all' || it.getAttribute('data-cat') === f;
                it.classList.toggle('hidden', !show);
                it.classList.remove('fade-in');
                if (show) { void it.offsetWidth; it.classList.add('fade-in'); }
            });
        });
    });

    /*===== LIGHTBOX =====*/
    var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-caption'), lbIndex = 0, lbList = [];
    function visibleItems() { return items.filter(function (i) { return !i.classList.contains('hidden'); }); }
    function showLb(i) {
        lbIndex = (i + lbList.length) % lbList.length;
        var it = lbList[lbIndex], im = $('img', it);
        lbImg.src = im.getAttribute('src');
        lbImg.alt = im.alt;
        lbCap.textContent = $('figcaption span', it).textContent + ' - ' + $('figcaption small', it).textContent;
    }
    function openLb(it) { lbList = visibleItems(); showLb(lbList.indexOf(it)); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    items.forEach(function (it) { it.addEventListener('click', function () { openLb(it); }); });
    $('#lb-close').addEventListener('click', closeLb);
    $('#lb-prev').addEventListener('click', function () { showLb(lbIndex - 1); });
    $('#lb-next').addEventListener('click', function () { showLb(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
        if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });

    /*===== CUSTOM CURSOR =====*/
    var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (fine) {
        var dot = $('#cursor-dot'), ring = $('#cursor-ring');
        var mx = -100, my = -100, rx = -100, ry = -100, lastTrail = 0;
        document.body.classList.add('has-cursor');
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.opacity = ring.style.opacity = 1;
            dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
            var now = Date.now();
            if (now - lastTrail > 45) {
                lastTrail = now;
                var t = document.createElement('span');
                t.className = 'cursor-trail';
                t.style.left = mx + 'px'; t.style.top = my + 'px';
                t.style.setProperty('--tx', (Math.random() * 16 - 8) + 'px');
                t.style.setProperty('--ty', (Math.random() * 16 - 8) + 'px');
                document.body.appendChild(t);
                setTimeout(function () { t.remove(); }, 700);
            }
        });
        document.addEventListener('mouseleave', function () { dot.style.opacity = ring.style.opacity = 0; });
        document.addEventListener('mousedown', function () { ring.classList.add('down'); });
        document.addEventListener('mouseup', function () { ring.classList.remove('down'); });
        (function loop() {
            rx += (mx - rx) * .16; ry += (my - ry) * .16;
            ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
            requestAnimationFrame(loop);
        })();

        var hoverSel = 'a, button, .nav__toggle, .skills__card, .stats__item, .contact__card, select';
        document.addEventListener('mouseover', function (e) {
            var t = e.target;
            ring.classList.remove('hover', 'view', 'text');
            ring.textContent = '';
            if (t.closest('.work__item')) { ring.classList.add('view'); ring.textContent = 'VIEW'; }
            else if (t.closest('input, textarea')) { ring.classList.add('text'); }
            else if (t.closest(hoverSel)) { ring.classList.add('hover'); }
        });

        /* magnetic buttons */
        $$('.button, .home__social-icon, .footer__icon, .to-top').forEach(function (b) {
            b.addEventListener('mousemove', function (e) {
                var r = b.getBoundingClientRect();
                var x = (e.clientX - r.left - r.width / 2) * .25, y = (e.clientY - r.top - r.height / 2) * .35;
                b.style.translate = x + 'px ' + y + 'px';
            });
            b.addEventListener('mouseleave', function () { b.style.translate = ''; });
        });
    }

    /*===== TILT ON IMAGES (desktop) =====*/
    if (fine) {
        $$('.about__img img, .home__frame').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
                el.style.rotate = '';
                el.style.transform = 'perspective(700px) rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg)';
            });
            el.addEventListener('mouseleave', function () { el.style.transform = ''; });
        });
    }

    /*===== CONTACT FORM =====*/
    var form = $('#contact-form'), statusEl = $('#form-status'), btn = $('#submit-btn');
    var msg = $('#message'), count = $('#msg-count');
    msg.addEventListener('input', function () { count.textContent = msg.value.length + ' / 1000'; });

    var rules = {
        name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
        phone: function (v) { return !v.trim() || /^[+\d][\d\s\-()]{6,19}$/.test(v.trim()) ? '' : 'Enter a valid phone number.'; },
        service: function (v) { return v ? '' : 'Please select a service.'; },
        subject: function (v) { return v.trim().length >= 3 ? '' : 'Please add a subject.'; },
        message: function (v) { return v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'; }
    };
    function check(field) {
        var wrap = field.closest('.contact__field'), err = $('.contact__error', wrap);
        var rule = rules[field.name];
        if (!rule) return true;
        var m = rule(field.value);
        err.textContent = m;
        wrap.classList.toggle('invalid', !!m);
        wrap.classList.toggle('valid', !m && field.value.trim() !== '');
        return !m;
    }
    $$('.contact__input', form).forEach(function (f) {
        f.addEventListener('blur', function () { check(f); });
        f.addEventListener('input', function () { if (f.closest('.contact__field').classList.contains('invalid')) check(f); });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        statusEl.className = 'contact__status';
        statusEl.textContent = '';

        var ok = true;
        $$('.contact__input', form).forEach(function (f) { if (!check(f)) ok = false; });
        if (!ok) {
            statusEl.className = 'contact__status error';
            statusEl.textContent = 'Please fix the highlighted fields and try again.';
            return;
        }
        if (form.elements._honey.value) return; /* bot */

        var data = {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            phone: form.elements.phone.value.trim() || 'Not provided',
            service: form.elements.service.value,
            subject: form.elements.subject.value.trim(),
            message: form.elements.message.value.trim(),
            _subject: 'New portfolio enquiry: ' + form.elements.subject.value.trim(),
            _replyto: form.elements.email.value.trim(),
            _template: 'table',
            _captcha: 'false'
        };

        btn.classList.add('loading');
        fetch('https://formsubmit.co/ajax/' + TO_EMAIL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
            if (res.ok && (res.body.success === true || res.body.success === 'true')) {
                statusEl.className = 'contact__status success';
                statusEl.textContent = 'Thank you, ' + data.name.split(' ')[0] + '! Your message has been sent. I will reply within 24 hours.';
                form.reset();
                count.textContent = '0 / 1000';
                $$('.contact__field', form).forEach(function (w) { w.classList.remove('valid', 'invalid'); });
            } else {
                throw new Error((res.body && res.body.message) || 'Send failed');
            }
        })
        .catch(function () {
            statusEl.className = 'contact__status error';
            statusEl.innerHTML = 'Sorry, the message could not be sent. Please email me directly at <a href="mailto:' + TO_EMAIL + '" style="text-decoration:underline">' + TO_EMAIL + '</a>.';
        })
        .then(function () { btn.classList.remove('loading'); });
    });

    /*===== FOOTER YEAR =====*/
    $('#year').textContent = new Date().getFullYear();
})();
