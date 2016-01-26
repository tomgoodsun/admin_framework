//var languages = {
//  "TEXT1": "This is test",
//  "TEXT2": "This is test. Number %s."
//};

(function () {
  var Afw = AdminFramework = {
    Utility: {
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
            data = jQuery.parseJSON(data);
          }
        } else {
          if (data === undefined) {
            data = null;
          }
        }
        return data;
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
        var label = Array.prototype.shift.apply(arguments),
          args = [].slice.apply(arguments);
        return call_user_func_array(sprintf, [Afw.Language._(label), args]);
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
        jQuery('.afw-modal').click(function() {
          var targetExpr = '#' + jQuery(this).attr('data-modal-element');
            title = Afw.Modal.detectTitle(jQuery(this));
          if (title) {
            jQuery(targetExpr).find('.modal-title').html(title);
          }
          jQuery(targetExpr).modal({show:true});
          return false;
        });
      },
      initIframeModal: function () {
        jQuery('.afw-modal-iframe').click(function() {
          var origin = jQuery(this),
            title = Afw.Modal.detectTitle(origin);
          Afw.Modal.openIframeModal(origin.prop('href'), title, origin, origin.hasClass('afw-modal-use-iframe-title'));
          return false;
        });
      },
      openIframeModal: function (url, title, origin, useContentTitle) {
        var elem = jQuery('#afw-template-modal-iframe'),
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
              var title = jQuery(this).contents()[0].title;
              jQuery('#afw-template-modal-iframe .modal-title').html(title);
            } catch (e) {
              console.log(e);
            }
          });
        }
        elem.on('shown.bs.modal', function () {
          var template = jQuery(this),
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
        jQuery('.afw-auto-modal-iframe').click(function() {
          var options = {
            'url': Afw.Utility.getDataAttr(jQuery(this), 'url'),
            'name': Afw.Utility.getDataAttr(jQuery(this), 'name'),
            'useContentTitle': jQuery(this).hasClass('afw-modal-use-iframe-title')
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

    Table: {
      init: function () {
        this.initSorter();
      },
      initSorter: function () {
        jQuery('.table a.sort').each(function (index) {
          var elem = jQuery(this);
          elem.html(elem.html() + '<span class="arrow"></span>');
        });
      }
    },

    Window: {
      init: function () {
        this.initOpener();
        this.initAutoOpener();
        this.initAutoOpenerAction();
      },
      startLoading: function () {
        $('#afw-full-screen').css({height: jQuery(window).height()}).fadeIn();
      },
      endLoading: function () {
        $('#afw-full-screen').fadeOut();
      },
      initOpener: function () {
        jQuery('a.afw-window').click(function() {
          var elem = jQuery(this),
            url = elem.prop('href'),
            name = elem.prop('name'),
            features = Afw.Utility.getDataAttr(elem, 'options');
          Afw.Window.open(url, name, features);
          return false;
        });
      },
      initAutoOpener: function () {
        jQuery('.afw-auto-window').click(function() {
          var elem = jQuery(this),
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
          Afw.Window.open(options.url, options.name, options.features);
        }
      },
      open: function (url, name, features) {
        if (name) {
          name = null;
        }
        var featureParams = [];
        for (var i in features) {
          featureParams.push(i + '=' + features[i]);
        }
        window.open(url, name, featureParams.join(','));
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

  jQuery(document).ready(function () {
    Afw.Modal.init();
    Afw.Table.init();
    Afw.Window.init();

    //console.log(Afw.Language.getText('TEXT1'));
    //console.log(Afw.Language.sprintf('TEXT2', 2));
    //Cookies.remove('test');
    //console.log(Cookies.get('test'));
    //Cookies.set('test', 1);

    $('#main-menu').smartmenus({
      subMenusSubOffsetX: 1,
      subMenusSubOffsetY: -8
    });
  });
})();
