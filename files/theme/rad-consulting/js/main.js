(function($){

    $.PushState = {
        target: '#wrapper',
        container: null,
        current: null, // {title:'', url: ''}
        history: [],

        generate: function() {
            history.replaceState({ path: window.location.href }, '');
            this.initialize();
        },

        initialize: function() {
            var self = this;

            $.Mobile.addHamburgerListener();
            self.checkForHash();

            if (!history.pushState) {
                //console.log('pushstate not supported');
                return false;
            }

            jQuery('a').not('[target="_blank"], ' + $.Mobile.hamburger).on({
                click: function(e) {
                    e.preventDefault();
                    self.load($(this).attr('href'));
                }
            });
        },
        load: function(url, preserveHistory) {
            var self = this;

            if (null === preserveHistory) {
                preserveHistory = false;
            }

            if ($.type(url) !== 'string') {
                return false;
            }

            var request = $.ajax({
                method: 'GET',
                url: url
            });

            request.done(function(m) {
                var d = $('<html/>').html(m);
                var c = d.find(self.target);
                var title = c.data('title');

                self.current = {title: title, url: url};

                if (!preserveHistory) {
                    self.history.push({title: document.title, url: location.href});
                }

                window.history.pushState({path: url}, title, url);
                self.setPageTitle(title);
                self.getContainer().html(c.html());
                self.checkForHash();
                $.PushState.initialize();
            });

            request.fail(function(d) {
                //console.log(d);
            })
        },
        checkForHash: function() {
            var scrollTo = 0;
            var url = location.href;

            if (-1 !== url.indexOf('#')) {
                var target = '#' + (url.split('#')).pop();
                scrollTo = 0 !== jQuery(target).length ? jQuery(target).offset().top : 0;
            }
            window.scrollTo(0,scrollTo);
        },
        setPageTitle: function(title) {
            if ($.type(title) !== 'string') {
                return false;
            }

            document.title = title;
        },
        getContainer: function() {
            if (null === this.container) {
                this.container = jQuery(this.target);
            }

            return this.container;
        }
    };

    $.Mobile = {
        hamburger: '#nav-toggle',
        heightReference: '.spotlight',
        addHamburgerListener: function() {
            var $container = jQuery(this.hamburger);
            var $self = this;
            $container.on({
                click: function(e){
                    e.preventDefault();
                    $(this).toggleClass('active');
                    $('nav.nav-mobile').toggleClass('active');
                }
            });

            var spotlightBottom = $($self.heightReference).position().top + $($self.heightReference).height();
            $.Window.scrollEvents.push(
                function() {
                    var tolerance = $container.offset().top;
                    var $w = $.Window;
                    if ($w.scrollX > spotlightBottom) {
                        $container.addClass('black');
                        return true;
                    }

                    $container.removeClass('black');
                }
            );


        }
    }

    $.Window = {
        scrollX: 0,
        scrollY: 0,
        scrollEvents: [],
        initialize: function() {
            var $self = this;
            $(window).on({
                scroll: function(e){
                    $self.scrollX = $(this).scrollTop();
                    $self.scrollY = $(this).scrollLeft();

                    for (var i = 0; i < $self.scrollEvents.length; i++) {
                        if ('function' === $self.scrollEvents[i]()) {
                            $self.scrollEvents[i]();
                        }
                    }
                    e.stopPropagation();
                }
            });
        }
    }
})(jQuery);

jQuery(window).on({
    popstate: function(e){
        if (0 == $.PushState.history.length) {
            history.back();
            return true;
        }


        var l = $.PushState.history.pop();
        $.PushState.load(l.url, true);

    }
})

jQuery(document).ready(function($) {
    $.PushState.generate();
    $.Window.initialize();
});

