/**Developed by Dmytro Symonov
 * {s} symonov.com
 * 2018
 */
// preloader
function preloader(setProp) {
    // Default options | Настройки по умолчанию
    setProp.delay = setProp.delay !== undefined && typeof setProp.delay === 'number' && setProp.delay >= 0 ? setProp.delay : 600;
    $(window).on('load', () => {
        $('#' + setProp.preloaderId).delay(setProp.delay).fadeOut('slow');
    });
}
// page position
function pagePosition(setProp) {
    // Default options | Настройки по умолчанию
    setProp.initScrHeight = setProp.initScrHeight !== undefined && typeof setProp.initScrHeight === 'number' && setProp.initScrHeight >= 0.1 && setProp.initScrHeight <= 1 ? setProp.initScrHeight : 0.75;
    // page position (top or bottom)
    let scrollBottom = () => $(window).scrollTop() + screen.availHeight,
        initPosition = () => {
            if (screen.availHeight * setProp.initScrHeight > $(window).scrollTop()) {
                if ($('html')[0] != $('.page_top')[0]) {
                    $('html').addClass('page_top').removeClass('page_bottom');
                    if(setProp.topCallback !== undefined) setProp.topCallback();
                }
            } else if ($('html').height() - screen.availHeight * setProp.initScrHeight < scrollBottom()) {
                if ($('html')[0] != $('.page_bottom')[0]) {
                    $('html').addClass('page_bottom').removeClass('page_top');
                    if(setProp.bottomCallback !== undefined) setProp.bottomCallback();
                }
            } else {
                if ($('html').attr('class') !== undefined) {
                    $('html').removeAttr('class');
                    if(setProp.middleCallback !== undefined) setProp.middleCallback();
                }
            }
        }
    // init page position on events
    $(document).ready(() => initPosition());
    $(window).scroll(() => initPosition());
    $(window).resize(() => initPosition());
}
// scroll to
function scrollTo(setProp) {
    // Default options | Настройки по умолчанию
    setProp.scrollDelay = setProp.scrollDelay !== undefined && typeof setProp.scrollDelay === 'number' && setProp.scrollDelay >= 0 ? setProp.scrollDelay : 600;
    setProp.anchorURL = setProp.anchorURL !== undefined && typeof setProp.anchorURL === 'boolean' ? setProp.anchorURL : true;
    setProp.preloader = setProp.preloader !== undefined && typeof setProp.preloader === 'boolean' ? setProp.preloader : false;
    //scroll to anchor
    let scrollToAnchor = (target) => {
        let anchor = $(target).offset().top,
            timeRate = Math.round(Math.abs($(window).scrollTop() - anchor) / screen.availHeight);
        if (screen.availHeight * 0.75 < Math.abs($(window).scrollTop() - anchor)) {
            if (setProp.preloader && $('html').find('#' + setProp.preloaderId).length !== 0 && timeRate > 2) {
                $('#' + setProp.preloaderId).fadeIn('normal').delay(setProp.scrollDelay * 2).fadeOut('slow');
                $('html, body').stop();
                setTimeout(() => $('html, body').animate({
                    scrollTop: anchor
                }, setProp.scrollDelay * 2), 300);
                return setProp.scrollDelay * 2 + 300;
            } else {
                $('html, body').stop().animate({
                    scrollTop: anchor
                }, setProp.scrollDelay * timeRate);
                return setProp.scrollDelay * timeRate;
            }
        }
    }
    // current page scroll to anchor
    $('a').bind('click', function (event) {
        if ($(this)['0'].pathname === window.location.pathname) {
            event.preventDefault();
            let currentPageId = $(this).attr('href'),
                timeToAnchor = scrollToAnchor(currentPageId);
            setTimeout(() => {
                if (setProp.anchorURL === true) window.location.hash = currentPageId;
                if (setProp.scrollToCallback !== undefined) setProp.scrollToCallback();
            }, timeToAnchor);
        }
    });
    // other page scroll to anchor
    otherPageId = window.location.hash;
    if (otherPageId !== '') {
        window.location.hash = '';
        $(document).ready(() => {
            setTimeout(() => {
                let timeToAnchor = scrollToAnchor(otherPageId);
                setTimeout(() => {
                    if (setProp.anchorURL === true) window.location.hash = otherPageId;
                    if (setProp.scrollToCallback !== undefined) setProp.scrollToCallback();
                }, timeToAnchor);
            }, 1500);
        });
    }
}