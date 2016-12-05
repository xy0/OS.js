/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(Widget, Utils, API, VFS, GUI, Window) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // ITEM
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Widget: AnalogClock
   */
  function WidgetAnalogClock(settings) {
    Widget.call(this, 'AnalogClock', {
      width: 300,
      height: 300,
      aspect: true,
      top: 100,
      right: 20,
      canvas: true,
      frequency: 1,
      resizable: true,
      viewBox: true
    }, settings);

    this.radius = 300 / 2;
  }

  WidgetAnalogClock.prototype = Object.create(Widget.prototype);
  WidgetAnalogClock.constructor = Widget;

  WidgetAnalogClock.prototype.init = function(root) {
    return Widget.prototype.init.apply(this, arguments);
  };

  WidgetAnalogClock.prototype.destroy = function(root) {
    return Widget.prototype.destroy.apply(this, arguments);
  };

  WidgetAnalogClock.prototype.onRender = function() {
    if ( !this._$canvas ) {
      return;
    }

    var ctx = this._$context;
    var radius = Math.round(this.radius * 0.95);

    function drawHand(ctx, pos, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.moveTo(0,0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
    }

    // Clear
    ctx.clearRect(0, 0, this.radius * 2, this.radius * 2);

    // Draw face
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.lineWidth = radius * 0.04;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Draw numbers
    ctx.font = radius * 0.15 + 'px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for ( var num = 1; num < 13; num++ ) {
      var ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }

    // Draw time
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    hour = hour % 12;
    hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    second = (second * Math.PI / 30);

    drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);
    drawHand(ctx, second, radius * 0.9, radius * 0.02);
  };

  WidgetAnalogClock.prototype.onResize = function(dimension) {
    if ( !this._$canvas || !this._$context ) {
      return;
    }

    this.radius = dimension.height / 2;
    this._$context.translate(this.radius, this.radius);
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications.CoreWM = OSjs.Applications.CoreWM || {};
  OSjs.Applications.CoreWM.Widgets = OSjs.Applications.CoreWM.Widgets || {};
  OSjs.Applications.CoreWM.Widgets.AnalogClock = WidgetAnalogClock;

})(OSjs.Applications.CoreWM.Widget, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI, OSjs.Core.Window);
