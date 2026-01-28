define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this;
    var MAX_VAL = 1000;
    var cssUrl = 'https://devist322.github.io/status-bar/style.css';

    var htmlBody =
      '<link rel="stylesheet" href="' + cssUrl + '" type="text/css">' +
      '<div class="amo-status-widget status-bar-widget-root">' +
      '<main class="main">' +
      '<div class="status-bar-wrapper">' +
      '<div class="status-bar-bg">' +
      '<div id="statusBarFill" class="status-bar-fill"></div>' +
      '<div class="status-bar-label">' +
      '<span id="currentValue">1000</span>/<span id="maxValue">1000</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="controls">' +
      '<button type="button" id="decreaseBtn" class="btn btn-secondary">−</button>' +
      '<button type="button" id="increaseBtn" class="btn btn-primary">+</button>' +
      '</div>' +
      '</main>' +
      '<div id="modalBackdrop" class="modal-backdrop hidden">' +
      '<div class="modal">' +
      '<input id="valueInput" type="number" class="modal-input" min="0" max="1000" step="1" placeholder="Введите значение">' +
      '<p id="errorText" class="error-text hidden"></p>' +
      '<div class="modal-actions">' +
      '<button type="button" id="confirmBtn" class="btn btn-primary">Принять</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    this.callbacks = {
      render: function () {
        self.render_template({
          caption: { class_name: 'status_bar_deal', html: '' },
          body: htmlBody,
          render: ''
        });
        return true;
      },

      init: function () {
        var $root = $('.status-bar-widget-root').last();
        if (!$root.length) return true;

        self._$root = $root;
        self._currentValue = MAX_VAL;
        self._currentMode = 'increase';

        var r = self._refs = {
          currentValue: $root.find('#currentValue'),
          maxValue: $root.find('#maxValue'),
          fill: $root.find('#statusBarFill'),
          increaseBtn: $root.find('#increaseBtn'),
          decreaseBtn: $root.find('#decreaseBtn'),
          modalBackdrop: $root.find('#modalBackdrop'),
          valueInput: $root.find('#valueInput'),
          errorText: $root.find('#errorText'),
          confirmBtn: $root.find('#confirmBtn')
        };

        r.maxValue.text(String(MAX_VAL));

        function updateUI() {
          var val = self._currentValue;
          var ratio = Math.max(0, Math.min(1, val / MAX_VAL || 0));
          r.currentValue.text(String(val));
          r.fill.css('transform', 'scaleX(' + ratio + ')');
          r.fill.removeClass('low empty');
          if (ratio === 0) r.fill.addClass('empty');
          else if (ratio <= 0.25) r.fill.addClass('low');
          r.increaseBtn.prop('disabled', val >= MAX_VAL);
          r.decreaseBtn.prop('disabled', val <= 0);
        }

        function openModal(mode) {
          self._currentMode = mode;
          r.valueInput.val('');
          r.valueInput.removeClass('error');
          r.errorText.text('').addClass('hidden');
          r.modalBackdrop.removeClass('hidden');
          setTimeout(function () { r.valueInput.focus(); }, 0);
        }

        function closeModal() {
          r.modalBackdrop.addClass('hidden');
        }

        function showError(msg) {
          r.errorText.text(msg).removeClass('hidden');
          r.valueInput.addClass('error');
        }

        function parseAndApply() {
          var raw = r.valueInput.val().trim();
          r.valueInput.removeClass('error');
          r.errorText.addClass('hidden');
          if (raw === '') { showError('Введите число.'); return; }
          var num = Number(raw);
          if (!Number.isFinite(num) || !Number.isInteger(num)) { showError('Введите целое число.'); return; }
          if (num < 0) { showError('Число не может быть отрицательным.'); return; }
          var next = self._currentMode === 'increase' ? self._currentValue + num : self._currentValue - num;
          if (next > MAX_VAL) next = MAX_VAL;
          if (next < 0) next = 0;
          self._currentValue = next;
          updateUI();
          closeModal();
        }

        self._updateUI = updateUI;
        self._openModal = openModal;
        self._closeModal = closeModal;
        self._parseAndApply = parseAndApply;

        updateUI();
        return true;
      },

      bind_actions: function () {
        var $root = self._$root;
        if (!$root || !$root.length) return true;

        var r = self._refs;
        r.increaseBtn.off('click').on('click', function () { self._openModal('increase'); });
        r.decreaseBtn.off('click').on('click', function () { self._openModal('decrease'); });
        r.confirmBtn.off('click').on('click', function () { self._parseAndApply(); });
        r.modalBackdrop.off('click').on('click', function (e) {
          if (e.target === r.modalBackdrop[0]) self._closeModal();
        });
        r.valueInput.off('keydown').on('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); self._parseAndApply(); }
          else if (e.key === 'Escape') { e.preventDefault(); self._closeModal(); }
        });

        return true;
      },

      settings: function () {},

      onSave: function () { return true; },

      destroy: function () { return true; }
    };

    return this;
  };

  return CustomWidget;
});
