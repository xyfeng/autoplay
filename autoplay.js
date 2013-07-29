/*
Created by XY Feng on 04/02/13.
Copyright (c) 2013 Xiaoyang Feng. All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/


var autoplay;

autoplay = {
  init: function() {
    this.message = $('<div id="autoplay_display"><div class="message"><p></p></div></div>').appendTo($('body'));
    this.cursor = $('<div id="autoplay_cursor"><div class="one"></div><div class="two"></div></div>').appendTo($('body')).css({
      left: -16,
      top: -16
    });
    this.animationDuration = 600;
    this.addControls();
    // console.log('autoplay script initiated!');
  },
  initWithScript: function(script) {
    this.init();
    this.loadScript(script);
  },
  addControls: function() {
    var instance = this;
    $('body').on('keydown', function(e) {
      if( e.keyCode === 32 && instance.cursor.queue("fx").length > 0 ){
        e.preventDefault();
        e.stopPropagation();
        $('input').blur();
        $('textarea').blur();
        instance.cursor.queue("fx", []).hide(); 
        console.log('autoplay Pause');
      }
      else if( e.keyCode === 39 && instance.commandIndex < instance.commandLength )
      {
        e.preventDefault();
        e.stopPropagation();
        instance.message.hide();
        instance.cursor.show();
        instance.runScript();
        console.log('autoplay Resume');
      }
    });
    $('body').on('mousedown', function(){
      instance.message.hide();
      instance.cursor.queue("fx", []);
      instance.cursor.stop().hide().css({
        left: -16,
        top: -16
      });
      instance.commandIndex = instance.commandLength;
    });
  },
  loadScript: function(script) {
    //build commands 
    this.commandArr = [];
    this.commandIndex = 0;
    this.commandLength = 0;
    for(var i = 0; i < script.length; i++)
    {
      var parameters = script[i].split('->');
      var command = parameters[0].toLowerCase();
      if( command === 'goclick' )
      { 
        var obj = parameters[1];
        this.commandArr.push('move->'+obj);
        this.commandArr.push('hover->'+obj);
        this.commandArr.push('wait->600');
        this.commandArr.push('click->'+obj);
        this.commandArr.push('wait->600');
      }
      else if( command === 'type' ){
        var obj = parameters[1];
        var value = parameters[2];
        var length = value.length;
        this.commandArr.push('hide');
        for( var i = 0; i < length; i++ )
        {
          var str = value.substring(0, i+1);
          this.commandArr.push('type->'+obj+'->'+str);
        }
        this.commandArr.push('show');
      }
      else if( command === 'gotype' )
      {
        var obj = parameters[1];
        var value = parameters[2];
        this.commandArr.push('move->'+obj);
        this.commandArr.push('wait->600');
        var length = value.length;
        this.commandArr.push('hide');
        for( var s = 0; s < length; s++ )
        {
          var str = value.substring(0, s+1);
          this.commandArr.push('type->'+obj+'->'+str);
        }
        this.commandArr.push('show');
      }
      else {
        this.commandArr.push(script[i]);
      }
    }
    this.commandLength = this.commandArr.length;
    this.runScript();
  },
  runScript: function(){
    var instance = this;
    var waitForMilliseconds = function(ms, callback){
      instance.cursor.delay(ms);
      instance.cursor.queue(function() {
        callback();
        return instance.cursor.dequeue();
      });
    };
    var moveTo = function(obj, x, y, duration, callback){
      var left = x; 
      var top = y;
      if( obj != null )
      {
        var $obj = $(obj);
        left = $obj.offset().left + x - $('body').scrollLeft();
        top = $obj.offset().top + y - $('body').scrollTop();
      }
      instance.cursor.animate({
        left: left,
        top: top
      }, duration, callback);
    };
    var hoverObj = function(obj, callback){
      $(obj).trigger('mouseenter').trigger('mouseenter').trigger('hover');
      instance.cursor.delay(100);
      instance.cursor.queue(function() {
        callback();
        return instance.cursor.dequeue();
      });
    };
    var clickObj = function(obj, callback){
      instance.cursor.queue(function() {
        instance.cursor.addClass('click');
        return instance.cursor.dequeue();
      });
      instance.cursor.delay(300);
      instance.cursor.queue(function() {
        $(obj).trigger('click');
        instance.cursor.removeClass('click');
        callback();
        return instance.cursor.dequeue();
      });
    };
    var typeObj = function(obj, value, callback){
      $(obj).focus();
      instance.cursor.delay(200);
      instance.cursor.queue(function() {
        $(obj).val(value).trigger('keyup');
        callback();
        return instance.cursor.dequeue();
      });
      instance.cursor.delay(200);
    };
    var scrollObj = function(obj, direction, value, callback){
      if( direction === 'y')
      {
        instance.cursor.queue(function() {
          instance.cursor.addClass('scrolly');
          $(obj).animate({
            scrollTop: value
          }, instance.animationDuration, function() {
            instance.cursor.removeClass('scrolly');
            callback();
          });
          return instance.cursor.dequeue();
        });
      }
      else if( direction === 'x')
      {
        instance.cursor.queue(function() {
          instance.cursor.addClass('scrollx');
          $(obj).animate({
            scrollLeft: value
          }, instance.animationDuration, function() {
            instance.cursor.removeClass('scrollx');
            callback();
          });
          return instance.cursor.dequeue();
        });
      }
    };
    var display = function(message, msgClass, duration, callback) {
      instance.message.fadeIn().removeClass().addClass(msgClass).find('div').show().html(message);
      instance.cursor.delay(duration);
      instance.cursor.queue(function() {
        instance.message.fadeOut().find('div').hide();
        callback();
        return instance.cursor.dequeue();
      });
      instance.cursor.delay(300);
    };
    var checkObj = function(obj, line) {
      if( $(obj).length !== 1 )
      {
        console.log( 'Error!!! \n   Line: ' + line + '\n   Index: ' + (instance.commandIndex - 1) + '\n   Object:' + obj + '\n   Found: ' + $(obj).length);
        return false;
      }
      return true;
    };

    var decodeCommand = function(){
      var line;
      if( instance.commandIndex < instance.commandLength ){
        line = instance.commandArr[instance.commandIndex];
        instance.commandIndex ++;
      }
      else{
        instance.cursor.hide().css({
          left: -16,
          top: -16
        });
        return;
      }
      var parameters = line.split('->');
      command = parameters[0].toLowerCase();
      switch(command){
        case 'hide':
          instance.cursor.hide();
          decodeCommand();
          break;
        case 'show':
          instance.cursor.show();
          decodeCommand();
          break;
        case 'move':
          instance.cursor.show();
          var obj = null;
          var x = 0;
          var y = 0;
          var duration = instance.animationDuration;
          if( parameters[1].indexOf(',') === -1 )
          {
            obj = parameters[1];
            x = $(obj).outerWidth()/2;
            y = $(obj).outerHeight()/2;
            if( parameters.length === 3 && parameters[2].indexOf(',') === -1 )
            {
              duration = parseInt(parameters[2], 10);
            }
            else if( parameters.length > 2 )
            {
              var posArray = parameters[2].split(',');
              x = parseInt(posArray[0], 10);
              y = parseInt(posArray[1], 10);
              if( parameters.length === 4 )
              {
                duration = parseInt(parameters[3], 10);
              }
            }
          }
          else{
            var posArray = parameters[1].split(',');
            x = parseInt(posArray[0], 10);
            y = parseInt(posArray[1], 10);
            if( parameters.length === 3)
              duration = parseInt(parameters[2], 10)
          }
          if( obj === null || checkObj(obj, line) )
          {
            moveTo(obj, x, y, duration, decodeCommand);
          }
          else {
            decodeCommand();
          }
          break;
        case 'hover':
          instance.cursor.show();
          var obj = parameters[1];
          if( checkObj(obj, line) )
          {
            hoverObj(obj, decodeCommand);
          }
          else {
            decodeCommand();
          }
          break;
        case 'wait':
          instance.cursor.show();
          waitForMilliseconds(parseInt(parameters[1], 10), decodeCommand);
          break;
        case 'click':
          instance.cursor.show();
          var obj = parameters[1];
          if( checkObj(obj, line) )
          {
            clickObj(obj, decodeCommand);
          }
          else {
            decodeCommand();
          }
          break;
        case 'type':
          instance.cursor.show();
          var obj = parameters[1];
          if( checkObj(obj, line) )
          {
            typeObj(obj, parameters[2], decodeCommand);
          }
          else {
            decodeCommand();
          }
          break;
        case 'scrollx':
          instance.cursor.show();
          var parameter = parameters[1];
          if( parameters.length === 2 )
          {
            scrollObj('body', 'x', parseInt(parameter, 10), decodeCommand);
          }
          else{
            var obj = parameters[1];
            if( checkObj(obj, line) )
            {
              scrollObj(obj, 'x', parseInt(parameters[2], 10), decodeCommand);
            }
            else {
              decodeCommand();
            }
          }
          break;
        case 'scrolly':
          instance.cursor.show();
          var parameter = parameters[1];
          if( parameters.length === 2 )
          {
            scrollObj('body', 'y', parseInt(parameter, 10), decodeCommand);
          }
          else{
            var obj = parameters[1];
            if( checkObj(obj, line) )
            {
              scrollObj(obj, 'y', parseInt(parameters[2], 10), decodeCommand);
            }
            else {
              decodeCommand();
            }
          }
          break;
        case 'display':
          var message = '';
          var msgClass = 'center';
          var duration = 2000;
          if( parameters.length === 2 )
          {
            message = parameters[1];
          }
          else if( parameters.length === 3 )
          {
            if(  /^\d+$/.test(parameters[2]) )
            {
              message = parameters[1];
              duration = parseInt(parameters[2], 10);
            }
            else{
              msgClass = parameters[1]; 
              message = parameters[2];
            }
          }
          else if( parameters.length === 4 )
          {
            msgClass = parameters[1];
            message = parameters[2];
            duration = parseInt(parameters[3], 10);
          }
          display(message, msgClass, duration, decodeCommand);
          break;
      };
    };
    decodeCommand();
  },
};