var languages = {
  "TEXT1": "This is test",
  "TEXT2": "This is test. Number %s."
};
var AfwConfig = {
  Form: {
    disableEnterSubmissionClassName: 'form.disable-enter-key',
    DateTimePicker: {
      wrapperClassName: 'afw-datetimepicker-wrapper',
      className: 'afw-datetimepicker ',
      options: {
        timepicker: true,
        format: 'Y-m-d H:i:00',
        language: 'ja-JP'
      }
    },
    Login: {
      expr: '#afw-login-screen .login-form'
    },
    Select2: {
      wrapperExpr: '.afw-select2-wrapper',
      className: 'afw-select2',
      options: {
        theme: 'bootstrap'
      }
    },
    Select2Ajax: {
      wrapperExpr: '.afw-select2-ajax-wrapper',
      className: 'afw-select2-ajax',
      options: {
        theme: 'bootstrap',
        ajax: {
          dataType: 'json',
          delay: 1000, // Waiting milisec to send query to ajax API helps reduce too many requests
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
  jQuery(document).ready(function () {
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
})();
