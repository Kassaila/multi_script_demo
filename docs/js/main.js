/**Developed by Dmytro Symonov
 * {s} symonov.com
 * 2018
 */
/*
* preloader
*/
function preloader(setProp) {
    // Default options | Настройки по умолчанию
    setProp.delay = setProp.delay !== undefined && typeof setProp.delay === 'number' && setProp.delay >= 0 ? setProp.delay : 600;
    $(window).on('load', () => {
        $('#' + setProp.preloaderId).delay(setProp.delay).fadeOut('slow');
    });
}
/*
* page position
*/
function pagePosition(setProp) {
    // Default options | Настройки по умолчанию
    setProp.scrTopHeight = setProp.scrTopHeight !== undefined && typeof setProp.scrTopHeight === 'number' && setProp.scrTopHeight >= 0.1 && setProp.scrTopHeight <= 1 ? setProp.scrTopHeight : 0.1;
    setProp.scrBottomHeight = setProp.scrBottomHeight !== undefined && typeof setProp.scrBottomHeight === 'number' && setProp.scrBottomHeight >= 0.1 && setProp.scrBottomHeight <= 1 ? setProp.scrBottomHeight : 0.1;
    let scrollBottom = () => $(window).scrollTop() + $(window).height();
    // init page position (top, middle or bottom)
    let initPosition = () => {
        if ($(window).height() * setProp.scrTopHeight > $(window).scrollTop()) {
            if ($('html')[0] != $('.page_top')[0]) {
                $('html').addClass('page_top').removeClass('page_middle page_bottom');
                if (setProp.topCallback) setProp.topCallback();
            }
        } else if ($('html').height() - $(window).height() * setProp.scrBottomHeight < scrollBottom()) {
            if ($('html')[0] != $('.page_bottom')[0]) {
                $('html').addClass('page_bottom').removeClass('page_top page_middle');
                if (setProp.bottomCallback) setProp.bottomCallback();
            }
        } else {
            if (!$('html').hasClass('page_middle')) {
                $('html').addClass('page_middle').removeClass('page_top page_bottom');
                if (setProp.middleCallback) setProp.middleCallback();
            }
        }
    }
    // init page position on events
    $(document).ready(initPosition);
    $(window).scroll(initPosition);
    $(window).resize(initPosition);
}
/*
* scroll to
*/
function scrollTo(setProp) {
    // Default options | Настройки по умолчанию
    setProp.scrollDelay = setProp.scrollDelay !== undefined && typeof setProp.scrollDelay === 'number' && setProp.scrollDelay >= 0 ? setProp.scrollDelay : 600;
    setProp.otherPageStartScroll = setProp.otherPageStartScroll !== undefined && typeof setProp.otherPageStartScroll === 'number' && setProp.otherPageStartScroll >= 0 ? setProp.otherPageStartScroll : 1000;
    setProp.anchorURL = setProp.anchorURL !== undefined && typeof setProp.anchorURL === 'boolean' ? setProp.anchorURL : true;
    setProp.preloader = setProp.preloader !== undefined && typeof setProp.preloader === 'boolean' ? setProp.preloader : false;
    //scroll to anchor
    let scrollToAnchor = (target) => {
        let anchor = $(target).offset().top,
            timeRate = Math.round(Math.abs($(window).scrollTop() - anchor) / $(window).height());
            timeRate = timeRate > 0 ? timeRate : 1;
        if ($(window).height() * 0.1 < Math.abs($(window).scrollTop() - anchor)) {
            if (setProp.preloader && $('html').find('#' + setProp.preloaderId).length > 0 && timeRate > 2) {
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
        console.log(timeRate);
    }
    // current page scroll to anchor
    $('a').bind('click', function (event) {
        if ($(this)['0'].pathname === window.location.pathname) {
            event.preventDefault();
            let currentPageId = $(this).attr('href'),
                timeToAnchor = scrollToAnchor(currentPageId);
            setTimeout(() => {
                if (setProp.anchorURL) window.location.hash = currentPageId;
                if (setProp.afterScrollCallback) setProp.afterScrollCallback();
            }, timeToAnchor);
        }
    });
    // other page scroll to anchor
    let otherPageId = window.location.hash;
    if (otherPageId !== '') {
        window.location.hash = '';
        $(document).ready(() => {
            setTimeout(() => {
                let timeToAnchor = scrollToAnchor(otherPageId);
                setTimeout(() => {
                    if (setProp.anchorURL) window.location.hash = otherPageId;
                    if (setProp.afterScrollCallback) setProp.afterScrollCallback();
                }, timeToAnchor);
            }, setProp.otherPageStartScroll);
        });
    }
}