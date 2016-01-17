(function () {
  var AdminFramework = {
    Utility: {
      calcStyle: function (elem, props) {
        var result = 0;
        for (var i = 0, len = props.length; i < len; i++) {
          result += parseInt(elem.css(props[i]).replace('([0-9]+)', '\1'), 10);
        }
        return result;
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

    Modal: {
      init: function () {
        this.initDefaultModal();
        this.initIframeModal();
      },
      initDefaultModal: function () {
        jQuery('.afw-modal').click(function() {
          var targetExpr = '#' + jQuery(this).attr('data-modal-element');
            title = jQuery(this).attr('title');
          if (title === undefined) {
            title = jQuery(this).text();
          }
          if (title === undefined) {
            jQuery(targetExpr).find('.modal-title').html(title);
          }
          //jQuery(targetExpr).on('shown.bs.modal', function () {
          //  var template = jQuery(this),
          //    contentHeight = AdminFramework.Utility.getHeight(template.find('.modal-content')),
          //    headerHeight = AdminFramework.Utility.getHeight(template.find('.modal-header')),
          //    height = contentHeight - headerHeight;
          //  template.find('.modal-body').css({'height':height});
        	//});
          jQuery(targetExpr).modal({show:true})
          return false;
        });
      },
      initIframeModal: function () {
        jQuery('.afw-modal-iframe').click(function() {
          var targetExpr = '#afw-template-modal-iframe',
            title = jQuery(this).attr('title');
          if (title === undefined) {
            title = jQuery(this).text();
          }
          jQuery(targetExpr).find('.modal-title').html(title);
          jQuery(targetExpr).find('iframe').attr('src', '');
          jQuery(targetExpr).find('iframe').attr('src', jQuery(this).prop('href'));
          jQuery(targetExpr).on('shown.bs.modal', function () {
            var template = jQuery(this),
              contentHeight = AdminFramework.Utility.getHeight(template.find('.modal-content')),
              headerHeight = AdminFramework.Utility.getHeight(template.find('.modal-header')),
              height = contentHeight - headerHeight;
            template.find('.modal-body').css({'height':height});
            template.find('iframe').height(height).css({'height':height}).prop('height', height);
        	});
          jQuery(targetExpr).modal({show:true})
          return false;
        });
      }
    }
  };

  jQuery(document).ready(function () {
    AdminFramework.Modal.init();
  });
})();
