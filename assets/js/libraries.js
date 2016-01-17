// https://github.com/alexei/sprintf.js/blob/master/dist/sprintf.min.js
/*! sprintf-js | Alexandru Marasteanu <hello@alexei.ro> (http://alexei.ro/) | BSD-3-Clause */
!function(a){function b(){var a=arguments[0],c=b.cache;return c[a]&&c.hasOwnProperty(a)||(c[a]=b.parse(a)),b.format.call(null,c[a],arguments)}function c(a){return"number"==typeof a?"number":"string"==typeof a?"string":Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}function d(a,b){return b>=0&&7>=b&&g[a]?g[a][b]:Array(b+1).join(a)}var e={not_string:/[^s]/,not_bool:/[^t]/,not_type:/[^T]/,not_primitive:/[^v]/,number:/[diefg]/,numeric_arg:/bcdiefguxX/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[\+\-]/};b.format=function(a,f){var g,h,i,j,k,l,m,n=1,o=a.length,p="",q=[],r=!0,s="";for(h=0;o>h;h++)if(p=c(a[h]),"string"===p)q[q.length]=a[h];else if("array"===p){if(j=a[h],j[2])for(g=f[n],i=0;i<j[2].length;i++){if(!g.hasOwnProperty(j[2][i]))throw new Error(b('[sprintf] property "%s" does not exist',j[2][i]));g=g[j[2][i]]}else g=j[1]?f[j[1]]:f[n++];if(e.not_type.test(j[8])&&e.not_primitive.test(j[8])&&"function"==c(g)&&(g=g()),e.numeric_arg.test(j[8])&&"number"!=c(g)&&isNaN(g))throw new TypeError(b("[sprintf] expecting number but found %s",c(g)));switch(e.number.test(j[8])&&(r=g>=0),j[8]){case"b":g=parseInt(g,10).toString(2);break;case"c":g=String.fromCharCode(parseInt(g,10));break;case"d":case"i":g=parseInt(g,10);break;case"j":g=JSON.stringify(g,null,j[6]?parseInt(j[6]):0);break;case"e":g=j[7]?parseFloat(g).toExponential(j[7]):parseFloat(g).toExponential();break;case"f":g=j[7]?parseFloat(g).toFixed(j[7]):parseFloat(g);break;case"g":g=j[7]?parseFloat(g).toPrecision(j[7]):parseFloat(g);break;case"o":g=g.toString(8);break;case"s":g=String(g),g=j[7]?g.substring(0,j[7]):g;break;case"t":g=String(!!g),g=j[7]?g.substring(0,j[7]):g;break;case"T":g=c(g),g=j[7]?g.substring(0,j[7]):g;break;case"u":g=parseInt(g,10)>>>0;break;case"v":g=g.valueOf(),g=j[7]?g.substring(0,j[7]):g;break;case"x":g=parseInt(g,10).toString(16);break;case"X":g=parseInt(g,10).toString(16).toUpperCase()}e.json.test(j[8])?q[q.length]=g:(!e.number.test(j[8])||r&&!j[3]?s="":(s=r?"+":"-",g=g.toString().replace(e.sign,"")),l=j[4]?"0"===j[4]?"0":j[4].charAt(1):" ",m=j[6]-(s+g).length,k=j[6]&&m>0?d(l,m):"",q[q.length]=j[5]?s+g+k:"0"===l?s+k+g:k+s+g)}return q.join("")},b.cache={},b.parse=function(a){for(var b=a,c=[],d=[],f=0;b;){if(null!==(c=e.text.exec(b)))d[d.length]=c[0];else if(null!==(c=e.modulo.exec(b)))d[d.length]="%";else{if(null===(c=e.placeholder.exec(b)))throw new SyntaxError("[sprintf] unexpected placeholder");if(c[2]){f|=1;var g=[],h=c[2],i=[];if(null===(i=e.key.exec(h)))throw new SyntaxError("[sprintf] failed to parse named argument key");for(g[g.length]=i[1];""!==(h=h.substring(i[0].length));)if(null!==(i=e.key_access.exec(h)))g[g.length]=i[1];else{if(null===(i=e.index_access.exec(h)))throw new SyntaxError("[sprintf] failed to parse named argument key");g[g.length]=i[1]}c[2]=g}else f|=2;if(3===f)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");d[d.length]=c}b=b.substring(c[0].length)}return d};var f=function(a,c,d){return d=(c||[]).slice(0),d.splice(0,0,a),b.apply(null,d)},g={0:["","0","00","000","0000","00000","000000","0000000"]," ":[""," ","  ","   ","    ","     ","      ","       "],_:["","_","__","___","____","_____","______","_______"]};"undefined"!=typeof exports?(exports.sprintf=b,exports.vsprintf=f):(a.sprintf=b,a.vsprintf=f,"function"==typeof define&&define.amd&&define(function(){return{sprintf:b,vsprintf:f}}))}("undefined"==typeof window?this:window);
//# sourceMappingURL=sprintf.min.js.map

// https://github.com/kvz/phpjs/blob/master/functions/funchand/call_user_func.js
function call_user_func(cb) {
  //  discuss at: http://phpjs.org/functions/call_user_func/
  // original by: Brett Zamir (http://brett-zamir.me)
  // improved by: Diplom@t (http://difane.com/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: call_user_func('isNaN', 'a');
  //   returns 1: true

  var func;

  if (typeof cb === 'string') {
    func = (typeof this[cb] === 'function') ? this[cb] : func = (new Function(null, 'return ' + cb))();
  } else if (Object.prototype.toString.call(cb) === '[object Array]') {
    func = (typeof cb[0] === 'string') ? eval(cb[0] + "['" + cb[1] + "']") : func = cb[0][cb[1]];
  } else if (typeof cb === 'function') {
    func = cb;
  }

  if (typeof func !== 'function') {
    throw new Error(func + ' is not a valid function');
  }

  var parameters = Array.prototype.slice.call(arguments, 1);
  return (typeof cb[0] === 'string') ? func.apply(eval(cb[0]), parameters) : (typeof cb[0] !== 'object') ? func.apply(
    null, parameters) : func.apply(cb[0], parameters);
}

// https://github.com/kvz/phpjs/blob/master/functions/funchand/call_user_func_array.js
function call_user_func_array(cb, parameters) {
  //  discuss at: http://phpjs.org/functions/call_user_func_array/
  // original by: Thiago Mata (http://thiagomata.blog.com)
  //  revised by: Jon Hohle
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Diplom@t (http://difane.com/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: call_user_func_array('isNaN', ['a']);
  //   returns 1: true
  //   example 2: call_user_func_array('isNaN', [1]);
  //   returns 2: false

  var func;

  if (typeof cb === 'string') {
    func = (typeof this[cb] === 'function') ? this[cb] : func = (new Function(null, 'return ' + cb))();
  } else if (Object.prototype.toString.call(cb) === '[object Array]') {
    func = (typeof cb[0] === 'string') ? eval(cb[0] + "['" + cb[1] + "']") : func = cb[0][cb[1]];
  } else if (typeof cb === 'function') {
    func = cb;
  }

  if (typeof func !== 'function') {
    throw new Error(func + ' is not a valid function');
  }

  return (typeof cb[0] === 'string') ? func.apply(eval(cb[0]), parameters) : (typeof cb[0] !== 'object') ? func.apply(
    null, parameters) : func.apply(cb[0], parameters);
}

