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
      initDefaultModal: function () {
        jQuery('.afw-modal').click(function() {
          var targetExpr = '#' + jQuery(this).attr('data-modal-element');
            title = jQuery(this).attr('title');
          if (title) {
            title = jQuery(this).text();
          }
          if (title) {
            jQuery(targetExpr).find('.modal-title').html(title);
          }
          jQuery(targetExpr).modal({show:true})
          return false;
        });
      },
      initIframeModal: function () {
        jQuery('.afw-modal-iframe').click(function() {
          var origin = jQuery(this),
            title = origin.attr('title');
          if (title) {
            title = origin.text();
          }
          Afw.Modal.openIframeModal(origin.prop('href'), title, origin);
          return false;
        });
      },
      openIframeModal: function (url, title, origin) {
        var elem = jQuery('#afw-template-modal-iframe');
        if (origin) {
          var cookieReload = Afw.Utility.getDataAttr(origin, 'cookie-reload');
        }
        elem.find('.modal-title').html(title);
        elem.find('iframe').attr('src', '');
        elem.find('iframe').attr('src', url);
        elem.on('shown.bs.modal', function () {
          var template = jQuery(this),
            contentHeight = Afw.Utility.getHeight(template.find('.modal-content')),
            headerHeight = Afw.Utility.getHeight(template.find('.modal-header')),
            height = contentHeight - headerHeight;
          template.find('.modal-body').css({'height':height});
          template.find('iframe').height(height).css({'height':height}).prop('height', height);
          if (cookieReload) {
            Cookies.set(cookieReload, 1);
          }
        });
        elem.on('hidden.bs.modal', function () {
          if (cookieReload) {
            var result = Cookies.get(cookieReload);
            Cookies.remove(cookieReload);
            if (result) {
              location.reload();
            }
          }
        });
        elem.modal({show:true})
        return elem;
      },
      initAutoIframeModal: function () {
        jQuery('.afw-auto-modal-iframe').click(function() {
          Cookies.set('auto-modal-iframe-url', Afw.Utility.getDataAttr(jQuery(this), 'url'));
          return true;
        });
      },
      initAutoIframeModalAction: function () {
        var url = Cookies.get('auto-modal-iframe-url');
        if (url) {
          Cookies.remove('auto-modal-iframe-url');
          Afw.Modal.openIframeModal(url, 'test').modal('show');
        }
      }
    },

    Window: {
      init: function () {
        this.initOpener();
      },
      initOpener: function () {
        jQuery('a.afw-window').click(function() {
          var elem = jQuery(this),
            url = elem.prop('href'),
            name = elem.prop('name'),
            features = Afw.Utility.getDataAttr(elem, 'options');
          if (name === undefined) {
            name = null;
          }
          var featureParams = [];
          for (var i in features) {
            featureParams.push(i + '=' + features[i]);
          }
          window.open(url, name, featureParams.join(','));
          return false;
        });
      }
    }
  };

  jQuery(document).ready(function () {
    Afw.Modal.init();
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
