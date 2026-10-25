/**
 * Triply Landing Page Script
 * Stack: HTML, CSS, JavaScript, jQuery
 */

$(document).ready(function () {
    var $hamburger = $('.hamburger-btn');
    var $nav = $('.header .nav');
    var $header = $('.header');
    var $navLinks = $('.header .navi a');

    // 스크롤 방지 이벤트 핸들러
    function preventDefaultScroll(e) {
        e.preventDefault();
    }

    // 햄버거 메뉴 열릴 때 스크롤 잠금 (CSS + Touch/Wheel 이벤트 차단)
    function lockScroll() {
        $('html, body').addClass('menu-open');
        window.addEventListener('touchmove', preventDefaultScroll, { passive: false });
        window.addEventListener('wheel', preventDefaultScroll, { passive: false });
    }

    // 햄버거 메뉴 닫힐 때 스크롤 잠금 해제
    function unlockScroll() {
        $('html, body').removeClass('menu-open');
        window.removeEventListener('touchmove', preventDefaultScroll);
        window.removeEventListener('wheel', preventDefaultScroll);
    }

    // 햄버거 메뉴 클릭 토글
    $hamburger.on('click', function (e) {
        e.stopPropagation();
        var isOpen = $(this).toggleClass('active').hasClass('active');
        $nav.toggleClass('active', isOpen);
        $header.toggleClass('nav-open', isOpen);
        $(this).attr('aria-expanded', isOpen);

        if (isOpen) {
            lockScroll();
        } else {
            unlockScroll();
        }
    });

    // 4개 네비게이션 버튼 클릭 시: main-color가 0.2초(200ms)만 나타났다가 다시 body-color로 복귀
    $navLinks.on('click', function (e) {
        e.preventDefault();
        var $btn = $(this);

        // 기존 타이머가 동작 중이면 초기화
        var prevTimer = $btn.data('colorTimer');
        if (prevTimer) {
            clearTimeout(prevTimer);
        }

        // 클릭 즉시 main-color 활성화
        $navLinks.removeClass('main-color active').addClass('body-color');
        $btn.removeClass('body-color').addClass('main-color active');

        // 정확히 0.1초(100ms) 후 다시 body-color로 복귀
        var timer = setTimeout(function () {
            $btn.removeClass('main-color active').addClass('body-color');
            $btn.removeData('colorTimer');
        }, 100);

        $btn.data('colorTimer', timer);
    });

    // 모바일 전체 화면 흰 배경 영역 터치/클릭 시 메뉴 닫기
    $nav.on('click', function (e) {
        if ($(e.target).is('.nav')) {
            closeMobileMenu();
        }
    });

    // 헤더 외부 영역 클릭 시 메뉴 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.header').length) {
            closeMobileMenu();
        }
    });

    // ESC 키 입력 시 메뉴 닫기
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeMobileMenu();
        }
    });

    // 모바일(425px) 초과 화면으로 리사이즈 시 모바일 메뉴 상태 초기화
    $(window).on('resize', function () {
        if ($(window).width() > 425) {
            closeMobileMenu();
        }
    });

    function closeMobileMenu() {
        $hamburger.removeClass('active').attr('aria-expanded', 'false');
        $nav.removeClass('active');
        $header.removeClass('nav-open');
        unlockScroll();
    }

    // ==========================================
    // SECTION 2 (589px 이하 카드 높이 동일 정렬 & 카드1 토글 시 슬라이드업)
    // ==========================================
    var $sec2Cards = $('.sec2-box .box1, .sec2-box .box2, .sec2-box .box3');
    var mokupSlideTimers = [];

    // 589px 이하 화면에서 카드 1~3의 높이를 동일하게 맞추는 함수
    function matchSec2CardHeights() {
        var $cards = $('.sec2-box .box1, .sec2-box .box2, .sec2-box .box3');
        var $contents = $('.sec2-box .box-content');

        if (window.innerWidth <= 589) {
            // 1. 기존 인라인 높이 초기화 후 실제 콘텐츠 높이 측정
            $cards.css('min-height', '');
            $contents.css('min-height', '');

            var maxHeight = 0;
            $cards.each(function () {
                var h = $(this).outerHeight();
                if (h > maxHeight) {
                    maxHeight = h;
                }
            });

            // 2. 세 카드 중 가장 큰 높이로 동일하게 적용
            if (maxHeight > 0) {
                $cards.css('min-height', maxHeight + 'px');
                $contents.css('min-height', maxHeight + 'px');
            }
        } else {
            // 589px 초과 시 인라인 min-height 초기화
            $cards.css('min-height', '');
            $contents.css('min-height', '');
        }
    }

    // mokup-content 애니메이션 리셋
    function resetMokupSlide() {
        for (var i = 0; i < mokupSlideTimers.length; i++) {
            clearTimeout(mokupSlideTimers[i]);
        }
        mokupSlideTimers = [];
        $('.mokup-content1, .mokup-content2, .mokup-content3').removeClass('slide-up');
    }

    // 카드 1 활성화 시: mokup-content1~3이 1초 간격으로 하나씩 아래에서 위로 슬라이드업
    function startMokupSlide() {
        resetMokupSlide();

        var $items = [
            $('.mokup-content1'),
            $('.mokup-content2'),
            $('.mokup-content3')
        ];

        // 1초 간격 순차 슬라이드업 (0초: 카드1, 1초: 카드2, 2초: 카드3)
        $items.forEach(function ($item, idx) {
            var delay = (idx === 0) ? 60 : (idx * 1000);
            var timer = setTimeout(function () {
                $item.addClass('slide-up');
            }, delay);
            mokupSlideTimers.push(timer);
        });
    }

    // 카드 활성화 및 토글 핸들러
    function activateSec2Card($card) {
        var isCard1 = $card.hasClass('box1');

        if ($card.hasClass('active')) {
            // 이미 활성화된 상태에서 카드 1을 다시 누른 경우에도 슬라이드업 재생
            if (isCard1) {
                startMokupSlide();
            }
            return;
        }

        // 모든 카드 토글 해제 (기본 테두리/배경 복원 및 icon2로 변경)
        $sec2Cards.removeClass('active');
        $sec2Cards.find('.box1-icon img, .box2-icon img, .box3-icon img')
            .attr('src', 'assets/images/icon/icon2.svg');

        // 선택한 카드 토글 활성화 (main-color 테두리, #f7faff 배경, icon1으로 변경)
        $card.addClass('active');
        $card.find('.box1-icon img, .box2-icon img, .box3-icon img')
            .attr('src', 'assets/images/icon/icon1.svg');

        // 카드 1이 활성화되면 1초 간격으로 mokup-content1~3 슬라이드업, 그 외 카드는 리셋
        if (isCard1) {
            startMokupSlide();
        } else {
            resetMokupSlide();
        }

        // 589px 이하일 때 카드 높이 동기화, 768~320px일 때 목업 컨텐츠 높이 동기화
        matchSec2CardHeights();
        matchMokupContentHeights();
    }

    // 768px ~ 320px 화면에서 목업 안 요소간 간격이 벌어지지 않고 목업 이미지 안에 쏙 들어가도록 동기화하는 함수
    function matchMokupContentHeights() {
        var winWidth = window.innerWidth;
        var $mokup = $('.mokup');
        var $mokupImg = $('.mokup-img');
        var $mokupContent = $('.mokup-content');
        var $text1 = $('.mokup-text1');
        var $text2 = $('.mokup-text2');
        var $content3Img = $('.mokup-content3 img');

        // 768px 초과(데스크탑)인 경우 인라인 스타일 초기화
        if (winWidth > 768) {
            $mokupContent.css('gap', '');
            $text1.css('min-height', '');
            $text2.css('min-height', '');
            $content3Img.css('max-height', '');
            $('.mokup-content1, .mokup-content2, .mokup-content3').css('min-height', '');
            return;
        }

        // 1. 목업 렌더링 높이 측정
        var mokupH = $mokupImg.height() || $mokup.height();
        if (!mokupH || mokupH <= 0) {
            var mokupW = $mokup.width() || (winWidth <= 425 ? 250 : 330);
            mokupH = mokupW * 1.948;
        }

        // 2. 목업 스크린 내부 안전 가용 높이 (상단 노치 및 하단 홈바 제외한 약 74%)
        var screenH = mokupH * 0.74;

        // 3. 요소 간 간격을 4~5px로 좁혀 벌어짐을 완전히 방지
        var matchedGap = (winWidth <= 425) ? 4 : 5;
        $mokupContent.css('gap', matchedGap + 'px');

        // 4. 컨테이너 자체의 과도한 min-height 제거 및 두 텍스트 말풍선(1, 2) 높이만 자연스럽게 일치
        $('.mokup-content1, .mokup-content2, .mokup-content3').css('min-height', '');
        $text1.css('min-height', '');
        $text2.css('min-height', '');
        var h1 = $text1.outerHeight() || 0;
        var h2 = $text2.outerHeight() || 0;
        var matchedTextH = Math.max(h1, h2);

        if (matchedTextH > 0) {
            $text1.css('min-height', matchedTextH + 'px');
            $text2.css('min-height', matchedTextH + 'px');
        }

        // 5. 3번 이미지 카드가 목업 이미지 바깥(하단 베젤)으로 삐져나가거나 겹치지 않도록 안전 영역 내로 제한
        var usedH = (matchedTextH * 2) + (matchedGap * 2) + (winWidth <= 425 ? 18 : 22);
        var remainingH = screenH - usedH;
        var maxImgH = (winWidth <= 425 ? 80 : 105);
        if (remainingH > 25) {
            $content3Img.css('max-height', Math.min(maxImgH, Math.floor(remainingH)) + 'px');
        }
    }

    // 카드 영역 클릭 시 토글
    $sec2Cards.on('click', function (e) {
        activateSec2Card($(this));
    });

    // 버튼 클릭 시 토글
    $('.sec2-box button').on('click', function (e) {
        e.stopPropagation();
        var $parentCard = $(this).closest('.box1, .box2, .box3');
        activateSec2Card($parentCard);
    });

    // 브라우저 리사이즈 시 높이 자동 재계산 (디바운스)
    var resizeSec2Timer;
    $(window).on('resize orientationchange', function () {
        clearTimeout(resizeSec2Timer);
        resizeSec2Timer = setTimeout(function () {
            matchSec2CardHeights();
            matchMokupContentHeights();
        }, 50);
    });

    // 초기 실행: 카드 1이 기본 활성화 상태이면 슬라이드업 시작
    if ($('.sec2-box .box1').hasClass('active')) {
        startMokupSlide();
    }

    // 초기 카드 및 목업 높이 일치 실행
    matchSec2CardHeights();
    matchMokupContentHeights();
    $(window).on('load', function () {
        matchSec2CardHeights();
        matchMokupContentHeights();
    });

    // ==========================================
    // SECTION 3 스크롤 도달 시 카드 순차 슬라이드인 (왼쪽 -> 오른쪽 정렬)
    // ==========================================
    var sec3SlideTriggered = false;
    var sec3SlideTimers = [];

    // 카드 슬라이드인 애니메이션 실행
    function playSec3CardsSlide() {
        if (sec3SlideTriggered) return;
        sec3SlideTriggered = true;

        // 기존 타이머 취소
        for (var t = 0; t < sec3SlideTimers.length; t++) {
            clearTimeout(sec3SlideTimers[t]);
        }
        sec3SlideTimers = [];

        var $cards = $('.sec3-cards .sec3-card1-box');
        $cards.each(function (idx) {
            var $card = $(this);
            // 왼쪽 카드부터 160ms 간격으로 순차 슬라이드인
            var timer = setTimeout(function () {
                $card.addClass('slide-in');
            }, idx * 160);
            sec3SlideTimers.push(timer);
        });
    }

    // 카드 슬라이드인 리셋 (다시 위로 스크롤 시 재실행 가능하도록)
    function resetSec3CardsSlide() {
        if (!sec3SlideTriggered) return;
        sec3SlideTriggered = false;

        for (var t = 0; t < sec3SlideTimers.length; t++) {
            clearTimeout(sec3SlideTimers[t]);
        }
        sec3SlideTimers = [];

        $('.sec3-cards .sec3-card1-box').removeClass('slide-in');
    }

    // 스크롤이 실제로 sec3에 도달했는지 정밀 판별하는 함수
    function checkSec3Scroll() {
        var $sec3 = $('.sec3');
        if (!$sec3.length) return;

        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var windowBottom = scrollTop + windowHeight;

        var sec3Top = $sec3.offset().top;
        var sec3Height = $sec3.outerHeight();
        var sec3Bottom = sec3Top + sec3Height;

        // 스크롤이 sec3 상단에서 100px 이상 진입했을 때 (도달 시점)
        var triggerPoint = sec3Top + 100;

        if (windowBottom >= triggerPoint && scrollTop <= sec3Bottom) {
            playSec3CardsSlide();
        } else if (windowBottom < sec3Top - 50 || scrollTop > sec3Bottom + 150) {
            // sec3 영역을 완전히 벗어났을 때 리셋하여 스크롤 재도달 시 효과 재현
            resetSec3CardsSlide();
        }
    }

    // 스크롤 시 실시간 체크
    $(window).on('scroll', checkSec3Scroll);

    // 페이지 로드 후 현재 스크롤 위치가 이미 sec3에 도달해 있는 경우에만 실행
    $(window).on('load', function () {
        checkSec3Scroll();
    });
});
