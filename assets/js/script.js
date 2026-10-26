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

    // 카드 활성화 시: 선택된 카드의 mokup-content1~3이 1초 간격으로 하나씩 아래에서 위로 슬라이드업
    function startMokupSlide($targetMokupContent) {
        resetMokupSlide();

        if (!$targetMokupContent || !$targetMokupContent.length) {
            $targetMokupContent = $('.mokup-content.active');
            if (!$targetMokupContent.length) {
                $targetMokupContent = $('.mokup-content-box1');
            }
        }

        var $items = [
            $targetMokupContent.find('.mokup-content1'),
            $targetMokupContent.find('.mokup-content2'),
            $targetMokupContent.find('.mokup-content3')
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
        var cardIndex = $card.hasClass('box1') ? 1 : ($card.hasClass('box2') ? 2 : 3);
        var $targetMokup = $('.mokup-content-box' + cardIndex);

        if ($card.hasClass('active')) {
            // 이미 활성화된 상태에서 해당 카드를 다시 누른 경우에도 슬라이드업 재생
            startMokupSlide($targetMokup);
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

        // 목업 컨텐츠 활성화 전환
        $('.mokup-content').removeClass('active');
        $targetMokup.addClass('active');

        // 선택된 목업 컨텐츠의 1, 2, 3 요소 순차 슬라이드업 시작 (box1, box2, box3 동일 효과 적용)
        startMokupSlide($targetMokup);

        // 589px 이하일 때 카드 높이 동기화
        matchSec2CardHeights();
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

    // 브라우저 리사이즈 시 카드 높이 자동 재계산 (디바운스)
    var resizeSec2Timer;
    $(window).on('resize orientationchange', function () {
        clearTimeout(resizeSec2Timer);
        resizeSec2Timer = setTimeout(function () {
            matchSec2CardHeights();
        }, 50);
    });

    // 초기 실행: 카드 1이 기본 활성화 상태이면 슬라이드업 시작
    if ($('.sec2-box .box1').hasClass('active')) {
        startMokupSlide($('.mokup-content-box1'));
    }

    // 초기 카드 높이 일치 실행
    matchSec2CardHeights();
    $(window).on('load', function () {
        matchSec2CardHeights();
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

    // ==========================================
    // SECTION 4 스크롤 도달 시: 중앙 겹침 해제 슬라이드 & 서브박스 순차 블러 해제
    // ==========================================
    var sec4SlideTriggered = false;

    // sec4 슬라이드 및 순차 선명화 시작
    function playSec4Slide() {
        if (sec4SlideTriggered) return;
        sec4SlideTriggered = true;
        $('.sec4').addClass('active');
    }

    // sec4 애니메이션 리셋 (영역을 완전히 벗어났을 때 재실행 가능하도록 초기화)
    function resetSec4Slide() {
        if (!sec4SlideTriggered) return;
        sec4SlideTriggered = false;
        $('.sec4').removeClass('active');
    }

    // 스크롤이 실제로 sec4에 도달했는지 판별하는 함수
    function checkSec4Scroll() {
        var $sec4 = $('.sec4');
        if (!$sec4.length) return;

        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var windowBottom = scrollTop + windowHeight;

        var sec4Top = $sec4.offset().top;
        var sec4Height = $sec4.outerHeight();
        var sec4Bottom = sec4Top + sec4Height;

        // 스크롤이 sec4 상단에서 120px 이상 진입했을 때 도달 시점으로 판정
        var triggerPoint = sec4Top + 120;

        if (windowBottom >= triggerPoint && scrollTop <= sec4Bottom) {
            playSec4Slide();
        } else if (windowBottom < sec4Top - 80 || scrollTop > sec4Bottom + 150) {
            // sec4 영역을 완전히 벗어났을 때 리셋하여 재도달 시 효과 재현
            resetSec4Slide();
        }
    }

    // 스크롤 시 실시간 체크
    $(window).on('scroll', checkSec4Scroll);

    // 페이지 로드 후 현재 스크롤 위치가 이미 sec4에 도달해 있는 경우 즉시 실행
    $(window).on('load', function () {
        checkSec4Scroll();
    });

    // ==========================================
    // SECTION 6 후기 카드 무한 자동 슬라이드(오른쪽 이동) & 양방향 드래그
    // ==========================================
    var $sec6Slider = $('.sec6-right');
    var $sec6Track = $sec6Slider.find('.sec6-track');
    var $sec6OriginCards = $sec6Track.children('.sec6-card');

    if ($sec6Slider.length && $sec6Track.length && $sec6OriginCards.length >= 3) {
        // 원본 3개 카드를 복제하여 총 4세트(12개)로 무한 루프 트랙 구성
        for (var s = 0; s < 3; s++) {
            $sec6OriginCards.clone().appendTo($sec6Track);
        }

        var singleSetWidth = 0;
        var currentX = 0;
        var autoSpeed = -0.75; // 1 -> 2 -> 3 순방향 루프(오른쪽 카드 방향으로 전진)로 천천히 이동 (px/frame)
        var isDragging = false;
        var isHovered = false;
        var dragStartX = 0;
        var touchStartX = 0;
        var touchStartY = 0;
        var lastPointerX = 0;
        var velocityX = 0;
        var hasDragged = false;
        var rafId = null;

        // 1세트(원본 카드 3개)의 실제 총 너비 정밀 계산
        function calculateSec6Width() {
            var $allCards = $sec6Track.children('.sec6-card');
            if ($allCards.length >= 4) {
                // 1번째 카드와 4번째 카드의 시작 위치 차이 = 정확한 1세트 너비
                var w = $allCards.eq(3).offset().left - $allCards.eq(0).offset().left;
                if (w > 0) {
                    singleSetWidth = w;
                }
            }
            if (!singleSetWidth || singleSetWidth <= 0) {
                var cardW = $allCards.eq(0).outerWidth() || 312;
                var gap = parseFloat($sec6Track.css('gap')) || 24;
                singleSetWidth = (cardW + gap) * 3;
            }

            // 초기 위치: 1번 카드가 화면 맨 앞에서 시작하도록 세트 2의 시작점으로 세팅 (-singleSetWidth)
            if (currentX === 0 && singleSetWidth > 0) {
                currentX = -singleSetWidth;
                updateTrackPosition();
            }
        }

        // 트랙 DOM Transform 적용
        function updateTrackPosition() {
            if ($sec6Track[0]) {
                $sec6Track[0].style.transform = 'translate3d(' + currentX.toFixed(2) + 'px, 0, 0)';
            }
        }

        // 루프 경계 처리: 끊김 없이 360도 무한 순환
        function wrapBoundaries() {
            if (!singleSetWidth || singleSetWidth <= 0) return;

            // 1 -> 2 -> 3 순방향으로 계속 흘러가서 1세트 이상 지나갔을 때 -> 한 세트 앞으로 순간 이동
            while (currentX <= -singleSetWidth * 2) {
                currentX += singleSetWidth;
            }
            // 반대 방향(오른쪽)으로 드래그하여 너무 많이 갔을 때 -> 한 세트 뒤로 순간 이동
            while (currentX > -singleSetWidth) {
                currentX -= singleSetWidth;
            }
        }

        // 60fps / 120fps 애니메이션 루프
        function animateSec6Slider() {
            if (!isDragging) {
                // 관성 감속 처리
                if (Math.abs(velocityX) > 0.1) {
                    currentX += velocityX;
                    velocityX *= 0.92; // 부드러운 감쇠
                } else {
                    velocityX = 0;
                    // 마우스 호버 중이 아닐 때만 자동으로 오른쪽 슬라이드
                    if (!isHovered) {
                        currentX += autoSpeed; // 오른쪽으로 이동(+)
                    }
                }
                wrapBoundaries();
                updateTrackPosition();
            }
            rafId = requestAnimationFrame(animateSec6Slider);
        }

        // 마우스 호버 시 일시 정지 (카드를 편하게 읽을 수 있도록 배려)
        $sec6Slider.on('mouseenter', function () {
            isHovered = true;
        }).on('mouseleave', function () {
            isHovered = false;
        });

        // 마우스 드래그 이벤트 (PC)
        $sec6Slider.on('mousedown', function (e) {
            if (e.which !== 1) return; // 좌클릭만
            isDragging = true;
            hasDragged = false;
            touchStartX = e.pageX;
            lastPointerX = e.pageX;
            dragStartX = currentX;
            velocityX = 0;
            $sec6Slider.addClass('is-dragging');
            e.preventDefault();
        });

        $(window).on('mousemove', function (e) {
            if (!isDragging) return;
            var diff = e.pageX - touchStartX;
            if (Math.abs(diff) > 4) {
                hasDragged = true;
            }
            currentX = dragStartX + diff;
            velocityX = (e.pageX - lastPointerX) * 0.8;
            lastPointerX = e.pageX;

            wrapBoundaries();
            updateTrackPosition();
        });

        $(window).on('mouseup', function () {
            if (!isDragging) return;
            isDragging = false;
            $sec6Slider.removeClass('is-dragging');
        });

        // 모바일 터치 이벤트 (양옆 스와이프)
        $sec6Slider.on('touchstart', function (e) {
            var touch = e.originalEvent.touches[0];
            isDragging = true;
            hasDragged = false;
            touchStartX = touch.pageX;
            touchStartY = touch.pageY;
            lastPointerX = touch.pageX;
            dragStartX = currentX;
            velocityX = 0;
        });

        $sec6Slider.on('touchmove', function (e) {
            if (!isDragging) return;
            var touch = e.originalEvent.touches[0];
            var diffX = touch.pageX - touchStartX;
            var diffY = touch.pageY - touchStartY;

            // 수평 스와이프 시 브라우저 기본 세로 스크롤 간섭 방지
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }

            if (Math.abs(diffX) > 4) {
                hasDragged = true;
            }

            currentX = dragStartX + diffX;
            velocityX = (touch.pageX - lastPointerX) * 0.8;
            lastPointerX = touch.pageX;

            wrapBoundaries();
            updateTrackPosition();
        });

        $sec6Slider.on('touchend touchcancel', function () {
            if (!isDragging) return;
            isDragging = false;
        });

        // 드래그 중 내부 클릭 이벤트 오작동 방지
        $sec6Track.on('click', function (e) {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // 초기 계산 및 애니메이션 시작
        calculateSec6Width();
        rafId = requestAnimationFrame(animateSec6Slider);

        // 이미지 로드 완료 시 정확한 폭 재계산
        $(window).on('load', function () {
            calculateSec6Width();
        });

        // 브라우저 리사이즈 시 폭 재계산 (디바운스)
        var resizeSec6Timer;
        $(window).on('resize orientationchange', function () {
            clearTimeout(resizeSec6Timer);
            resizeSec6Timer = setTimeout(function () {
                calculateSec6Width();
            }, 60);
        });
    }
});

