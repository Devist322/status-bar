define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this;

    this.callbacks = {
      render: function () {
        var $el = self.$element();
        $el.empty();

        var $wrapper = $('<div>', {
          css: {
            padding: '12px 10px',
            boxSizing: 'border-box',
            width: '100%'
          }
        });

        var $iframe = $('<iframe>', {
          src: 'https://devist322.github.io/status-bar/index.html',
          frameborder: '0',
          css: {
            width: '100%',
            height: '160px',
            border: 'none',
            overflow: 'hidden'
          }
        });

        $wrapper.append($iframe);
        $el.append($wrapper);

        return true;
      },

      init: function () {
        return true;
      },

      bind_actions: function () {
        return true;
      },

      settings: function () {
        return true;
      },

      onSave: function () {
        return true;
      },

      destroy: function () {
        return true;
      }
    };

    return this;
  };

  return CustomWidget;
});

