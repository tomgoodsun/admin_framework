var languages = {
  "TEXT1": "This is test",
  "TEXT2": "This is test. Number %s."
};
var AfwConfig = {
  Form: {
    disableEnterSubmissionClassName: 'form.disable-enter-key',
    Select2: {
      wrapperClassName: '.afw-select2-wrapper select',
      className: 'afw-select2',
      options: {
        theme: 'bootstrap'
      }
    },
    Select2Ajax: {
      wrapperClassName: '.afw-select2-ajax-wrapper select',
      className: 'afw-select2-ajax',
      options: {
        theme: 'bootstrap',
        ajax: {
          dataType: 'json',
          delay: 50, // Waiting milisec to send query to ajax API helps reduce too many requests
          data: function (params) {
            return {q: params.term, page: params.page};
          },
          processResults: function (data, params) {
            params.page = params.page || 1;
            return {
              results: data.items,
              pagination: {
                more: (params.page * 30) < data.total_count
              }
            };
          },
          cache: true
        },
        escapeMarkup: function (markup) {
          return markup;
        },
        minimumInputLength: 1,
        templateResult: function (repo) {
          if (repo.loading) {
            return repo.text;
          }
          var markup = '';
          markup += '<div class="select2-result clearfix">';
          var thumb = '';
          if (repo.thumbnail) {
            var imgIndexes = ['alt', 'height', 'src', 'title', 'width'];
            for (var i = 0, len = imgIndexes.length; i < len; i++) {
              if (repo.thumbnail[imgIndexes[i]]) {
                thumb += imgIndexes[i] + '="' + repo.thumbnail[imgIndexes[i]] + '" ';
              }
            }
            thumb = '<img ' + thumb + ' />';
          }
          markup += '<div class="select2-ajax-result__avatar">' + thumb + '</div>';
          markup += '<div class="select2-ajax-result__meta">';
          markup += '<div class="select2-ajax-result__title">' + repo.text + '</div>';
          if (repo.description) {
            markup += '<div class="select2-ajax-result__description">' + repo.description + '</div>';
          }
          markup += '</div>';
          markup += '</div>';
          return markup;
        },
        templateSelection: function (repo) {
          return repo.full_name || repo.text;
        }
      }
    },
    TinyMce: {
      wrapperExpr: '.afw-textarea-tinymce-wrapper textarea',
      className: 'afw-textarea-tinymce',
      options: {
        //selector: '.afw-textarea-tinymce',
        theme: 'modern',
        plugins: [
          'advlist autolink lists link image charmap print preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking save table contextmenu directionality',
          'emoticons template paste textcolor colorpicker textpattern imagetools'
        ],
        toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons',
        image_advtab: true,
        templates: [
          {title: 'Test template 1', content: 'Test 1'},
          {title: 'Test template 2', content: 'Test 2'}
        ],
        file_browser_callback: function (fieldName, url, type, win) {
          var roxyFileman = 'assets/scripts/fileman/index.html';
          if (roxyFileman.indexOf('?') < 0) {     
            roxyFileman += '?type=' + type;   
          } else {
            roxyFileman += '&type=' + type;
          }
          roxyFileman += '&input=' + fieldName + '&value=' + win.document.getElementById(fieldName).value;
          if(tinyMCE.activeEditor.settings.language){
            roxyFileman += '&langCode=' + tinyMCE.activeEditor.settings.language;
          }
          tinyMCE.activeEditor.windowManager.open({
            file: roxyFileman,
            title: 'Roxy Fileman',
            width: 850, 
            height: 650,
            resizable: 'yes',
            plugins: 'media',
            inline: 'yes',
            close_previous: 'no'  
          }, {
            window: win,
            input: fieldName
          });
          return false; 
        }
      }
    }
  }
};
Object.freeze(AfwConfig);

(function () {
  var Afw = AdminFramework = {
    Date: {
      init: function () {
        this.initRealTimeClock();
      },
      initRealTimeClock: function () {
        var currentTime = Date.now();
        var countTime = function () {
          currentTime += 1000;
          var date = new Date(currentTime);
          //console.log(date.toString());
          jQuery('.afw-realtime-clock').html(date.toLocaleString());
          setTimeout(countTime, 1000);
        };
        setTimeout(countTime, 1000);
        var retrieveServerDate = function () {
          jQuery.ajax({
            url: 'assets/bin/date.php',
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
        console.log(elem);
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
        this.initEnterSubmittion();
        this.initSelect2(config.Select2);
        this.initSelect2(config.Select2Ajax);
        this.initTextAreaTinyMce(config.TinyMce);
      },
      initEnterSubmittion: function () {
        jQuery(AfwConfig.Form.disableEnterSubmissionClassName).on('keydown', function(e) {
          if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
          }
          return true;
        });
      },
      initSelect2: function (config) {
        jQuery(config.wrapperClassName).each(function () {
          Afw.Utility.addClass(jQuery(this), config.className);
        });
        jQuery('select.' + config.className).select2(config.options);
      },
      initTextAreaTinyMce: function (config) {
        jQuery(config.wrapperExpr).each(function () {
          Afw.Utility.addClass(jQuery(this), config.className);
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

    Pagination: {
      init: function () {
        this.initActive();
      },
      initActive: function () {
        jQuery('.pagination li a').each(function() {
          var elem = jQuery(this);
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
        jQuery('.table a.sort').each(function (index) {
          var elem = jQuery(this);
          if (elem.hasClass('current')) {
            elem.parent().addClass('current');
            elem.removeClass('current');
          }
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
    Afw.Date.init();
    Afw.Form.init();
    Afw.Modal.init();
    Afw.Pagination.init();
    Afw.Table.init();
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
})();
