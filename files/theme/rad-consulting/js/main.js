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

            if (!history.pushState) {
                console.log('pushstate not supported');
                return false;
            }

            jQuery('a').not('[target="_blank"]').on({
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

                $.PushState.initialize();
            });

            request.fail(function(d) {
                console.log(d);
            })
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
})(jQuery);

jQuery(window).on({
    popstate: function(e){
        if (0 == $.PushState.history.length) {
            history.back();
            return true;
        }

        console.log($.PushState.history);

        var l = $.PushState.history.pop();
        $.PushState.load(l.url, true);

    }
})

jQuery(document).ready(function($) {
    $.PushState.generate();
});

