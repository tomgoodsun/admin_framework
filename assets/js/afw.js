(function ($, AfwConfig, window) {
  window.Afw = window.AdminFramework = {
    Date: {
      init: function () {
        var config = AfwConfig.Date;
        this.initRealTimeClock(config);
      },
      initRealTimeClock: function (config) {
        var currentTime = Date.now();
        var countTime = function () {
          currentTime += 1000;
          var date = new Date(currentTime);
          //console.log(date.toString());
          $('.afw-realtime-clock').html(date.toLocaleString());
          setTimeout(countTime, 1000);
        };
        setTimeout(countTime, 1000);
        var retrieveServerDate = function () {
          $.ajax({
            url: config.url,
            dataType: 'json'
          }).success(function(data) {
            currentTime = parseInt(data.time, 10) * 1000;
            setTimeout(retrieveServerDate, 60000);
          });
        };
        retrieveServerDate();
      }
    },
    Utility: {
      addClass: function (elem, className) {
        if (!elem.hasClass(className)) {
          elem.addClass(className);
        }
      },
      calcStyle: function (elem, props) {
        var result = 0;
        for (var i = 0, len = props.length; i < len; i++) {
          result += parseInt(elem.css(props[i]).replace('([0-9]+)', '\1'), 10);
        }
        return result;
      },
      getDataAttr: function (elem, attrName) {
        var data = elem.attr('data-afw-' + attrName);
        if (attrName == 'options') {
          if (data === undefined) {
            data = {};
          } else {
            data = $.parseJSON(data);
          }
        } else {
          if (data === undefined) {
            data = null;
          }
        }
        return data;
      },
      hasDataAttr: function (elem, attrName) {
        var data = elem.attr('data-afw-' + attrName);
        if (data === undefined) {
          return false;
        }
        return true;
      },
      setDataAttr: function (elem, attrName, data) {
        if (typeof data === 'object') {
          data = JSON.stringify(data);
        }
        elem.attr('data-afw-' + attrName, data);
      },
      getWidth: function (elem) {
        var props = [
          'margin-left',
          'border-left-width',
          'padding-left',
          'width',
          'padding-right',
          'border-right-width',
          'margin-right'
        ];
        return this.calcStyle(elem, props);
      },
      getHeight: function (elem) {
        var props = [
          'margin-top',
          'border-top-width',
          'padding-top',
          'height',
          'padding-bottom',
          'border-bottom-width',
          'margin-bottom'
        ];
        return this.calcStyle(elem, props);
      }
    },

    Language: {
      _: function (label) {
        if (window.languages) {
          if (languages[label]) {
            return languages[label];
          }
        }
        return '';
      },
      getText: function (label) {
        return Afw.Language._(label);
      },
      sprintf: function () {
        var args = [].slice.apply(arguments);
        if (args.length === 0) {
          return null;
        }
        args[0] = Afw.Language._(args[0]);
        return sprintf.apply(this, args);
      }
    },

    Form: {
      init: function () {
        var config = AfwConfig.Form;
        this.initResetButton(config);
        this.initDateTimePicker(config.DateTimePicker);
        this.initEnterSubmittion();
        this.initLoginForm(config.Login);
        this.initSelect2(config.Select2);
        this.initSelect2(config.Select2Ajax);
        this.initTextAreaTinyMce(config.TinyMce);
      },
      initResetButton: function (config) {
        $(config.resetButtonExpr).click(function () {
          $(this.form).find(':input').each(function () {
            var elem = $(this);
            if (elem.hasClass(config.Select2.className) || elem.hasClass(config.Select2Ajax.className)) {
              elem.select2('val', '');
            } else if ($.inArray(this.type, ['button', 'reset', 'submit']) < 0) {
              elem.val('');
            }
          });
        });
      },
      initDateTimePicker: function (config) {
        $('.' + config.wrapperClassName).each(function () {
          var elem = $(this);
          elem.find('input').each(function () {
            var type = $(this).prop('type');
            if (type == 'date' || type == 'text') {
              if (Afw.Utility.hasDataAttr(elem, 'options')) {
                var options = Afw.Utility.getDataAttr(elem, 'options');
                Afw.Utility.setDataAttr($(this), 'options', options);
              }
              Afw.Utility.addClass($(this), config.className);
            }
          });
        });
        $('.' + config.className).each(function () {
          var elem = $(this),
            options = Afw.Utility.getDataAttr(elem, 'options');
          options = $.extend(options, AfwConfig.Form.DateTimePicker.options);
          elem.datetimepicker(options);
        });
        $(AfwConfig.Form.disableEnterSubmissionClassName).on('keydown', function(e) {
          if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
          }
          return true;
        });
      },
      initEnterSubmittion: function () {
        $(AfwConfig.Form.disableEnterSubmissionClassName).on('keydown', function(e) {
          if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
          }
          return true;
        });
      },
      initLoginForm: function (config) {
        $(config.expr).find('input').first().focus();
      },
      initSelect2: function (config) {
        $(config.wrapperExpr).each(function () {
          var ajaxUrl = $(this).data('ajax--url');
          $(this).find('select').each(function () {
            Afw.Utility.addClass($(this), config.className);
            if (ajaxUrl !== undefined) {
              $(this).data('ajax--url', ajaxUrl);
            }
          });
        });
        $('select.' + config.className).select2(config.options);
      },
      initTextAreaTinyMce: function (config) {
        $(config.wrapperExpr).each(function () {
          Afw.Utility.addClass($(this), config.className);
        });
        config.options.selector = '.' + config.className;
        tinymce.init(config.options);
      }
    },

    Modal: {
      init: function () {
        this.initDefaultModal();
        this.initIframeModal();
        this.initAutoIframeModal();
        this.initAutoIframeModalAction();
      },
      detectTitle: function (elem) {
        var title = elem.attr('title');
        if (!title) {
          title = elem.html();
        }
        return title;
      },
      initDefaultModal: function () {
        $('.afw-modal').click(function() {
          var targetExpr = '#' + $(this).attr('data-modal-element');
            title = Afw.Modal.detectTitle($(this));
          if (title) {
            $(targetExpr).find('.modal-title').html(title);
          }
          $(targetExpr).modal({show:true});
          return false;
        });
      },
      initIframeModal: function () {
        $('.afw-modal-iframe').click(function() {
          var origin = $(this),
            title = Afw.Modal.detectTitle(origin);
          Afw.Modal.openIframeModal(origin.prop('href'), title, origin, origin.hasClass('afw-modal-use-iframe-title'));
          return false;
        });
      },
      openIframeModal: function (url, title, origin, useContentTitle) {
        var elem = $('#afw-template-modal-iframe'),
          iframe = elem.find('iframe');
        if (origin) {
          var cookieReload = Afw.Utility.getDataAttr(origin, 'cookie-reload');
        }
        elem.find('.modal-title').html('');
        elem.find('.modal-title').html(title);
        iframe.attr('src', 'blank.html');
        iframe.attr('src', url);
        if (useContentTitle) {
          iframe.on('load', function () {
            try {
              var title = $(this).contents()[0].title;
              $('#afw-template-modal-iframe .modal-title').html(title);
            } catch (e) {
              console.log(e);
            }
          });
        }
        elem.on('shown.bs.modal', function () {
          Afw.Window.flushCookieReload('force-cookie-reload');
          var template = $(this),
            contentHeight = Afw.Utility.getHeight(template.find('.modal-content')),
            headerHeight = Afw.Utility.getHeight(template.find('.modal-header')),
            height = contentHeight - headerHeight;
          template.find('.modal-body').css({'height':height});
          template.find('iframe').height(height).css({'height':height}).prop('height', height);
          if (cookieReload) {
            Afw.Window.reserveCookieReload(cookieReload);
          }
        });
        elem.on('hidden.bs.modal', function () {
          if (!cookieReload) {
            var forceCookieReload = Cookies.get('force-cookie-reload');
            if (forceCookieReload) {
              cookieReload = 'force-cookie-reload';
            }
          }
          if (cookieReload) {
            Afw.Window.startLoading();
            if (Afw.Window.flushCookieReload(cookieReload)) {
              setTimeout(function () {
                location.reload();
              }, 1000);
            }
          }
        });
        elem.modal({show:true});
        return elem;
      },
      initAutoIframeModal: function () {
        $('.afw-auto-modal-iframe').click(function() {
          var options = {
            'url': Afw.Utility.getDataAttr($(this), 'url'),
            'name': Afw.Utility.getDataAttr($(this), 'name'),
            'useContentTitle': $(this).hasClass('afw-modal-use-iframe-title')
          };
          Cookies.set('auto-modal-iframe', JSON.stringify(options));
          return true;
        });
      },
      initAutoIframeModalAction: function () {
        var options = Cookies.get('auto-modal-iframe');
        if (options) {
          options = JSON.parse(options);
          Cookies.remove('auto-modal-iframe');
          Afw.Modal.openIframeModal(options.url, options.name, null, options.useContentTitle).modal('show');
        }
      }
    },

    Pagination: {
      init: function () {
        this.initActive();
      },
      initActive: function () {
        $('.pagination li a').each(function() {
          var elem = $(this);
          if (elem.find('.active').length > 0) {
            elem.parent('li').addClass('active');
          }
        });
      }
    },

    Table: {
      init: function () {
        this.initSorter();
      },
      initSorter: function () {
        $('.table a.sort').each(function (index) {
          var elem = $(this);
          if (elem.hasClass('current')) {
            elem.removeClass('current');
            elem.wrap('<span class="current"></span>');
          }
          elem.html(elem.html() + '<span class="arrow"></span>');
        });
      }
    },

    Tooltip: {
      init: function () {
        this.initTooltip();
      },
      initTooltip: function () {
        $('[data-toggle="tooltip"]').tooltip();
      }
    },

    Window: {
      init: function () {
        this.initOpener();
        this.initAutoOpener();
        this.initAutoOpenerAction();
      },
      startLoading: function () {
        $('#afw-full-screen').css({height: $(window).height()}).fadeIn();
      },
      endLoading: function () {
        $('#afw-full-screen').fadeOut();
      },
      initOpener: function () {
        $('a.afw-window').click(function() {
          var elem = $(this),
            url = elem.prop('href'),
            name = elem.prop('name'),
            features = Afw.Utility.getDataAttr(elem, 'options');
          Afw.Window.open(url, name, features);
          return false;
        });
      },
      initAutoOpener: function () {
        $('.afw-auto-window').click(function() {
          var elem = $(this),
            options = {
              'url': Afw.Utility.getDataAttr(elem, 'url'),
              'name': Afw.Utility.getDataAttr(elem, 'name'),
              'features': Afw.Utility.getDataAttr(elem, 'options')
            };
          Cookies.set('auto-window-open', options);
          return true;
        });
      },
      initAutoOpenerAction: function () {
        var options = Cookies.get('auto-window-open');
        if (options) {
          options = JSON.parse(options);
          Cookies.remove('auto-window-open');
          return Afw.Window.open(options.url, options.name, options.features);
        }
        return null;
      },
      open: function (url, name, features) {
        if (!name) {
          name = null;
        }
        var featureParams = [];
        for (var i in features) {
          featureParams.push(i + '=' + features[i]);
        }
        return window.open(url, name, featureParams.join(','));
      },
      reserveForceCookieReload: function () {
        Cookies.set('force-cookie-reload', 1);
      },
      reserveCookieReload: function (name) {
        Cookies.set(name, 1);
      },
      flushCookieReload: function (name) {
        var result = Cookies.get(name);
        Cookies.remove(name);
        return result;
      }
    }
  };

  $(window.document).ready(function () {
    Afw.Date.init();
    Afw.Form.init();
    Afw.Modal.init();
    Afw.Pagination.init();
    Afw.Table.init();
    Afw.Tooltip.init();
    Afw.Window.init();

    console.log(Afw.Language.getText('TEXT1'));
    console.log(Afw.Language.sprintf('TEXT2', 2));
    //Cookies.remove('test');
    //console.log(Cookies.get('test'));
    //Cookies.set('test', 1);

    $('#main-menu').smartmenus({
      subMenusSubOffsetX: 1,
      subMenusSubOffsetY: -8
    });
  });
})(window.Zepto || window.jQuery, AfwConfig, window);

