"use strict";

$(function() {
  var pre = $('pre');
  pre.each(function(){
    $(this).html(htmlEncode($(this).html()));
  })
});

function htmlEncode(value){
  return $('<div/>').text(value).html();
}
