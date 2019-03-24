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
                $('html').addClass('page_top').removeClass('page_bottom');
            } else if ($('html').height() - screen.availHeight * setProp.initScrHeight < scrollBottom()) {
                $('html').addClass('page_bottom').removeClass('page_top');
            } else {
                $('html').removeClass('page_top page_bottom').removeAttr('class');
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
                $('#' + setProp.preloaderId).fadeIn('normal').delay(setProp.scrollDelay * 2 + 300).fadeOut('slow');
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
            if (setProp.anchorURL === true) {
                setTimeout(() => {
                    window.location.hash = currentPageId;
                }, timeToAnchor);
            }
        }
    });
    // other page scroll to anchor
    otherPageId = window.location.hash;
    if (otherPageId !== '') {
        window.location.hash = '';
        $(document).ready(() => {
            setTimeout(() => {
                let timeToAnchor = scrollToAnchor(otherPageId);
                if (setProp.anchorURL === true) {
                    setTimeout(() => {
                        window.location.hash = otherPageId;
                    }, timeToAnchor);
                }
            }, 1500);
        });
    }
}