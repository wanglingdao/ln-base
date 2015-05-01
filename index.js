/**
 * @module: ln-base
 * @author: wanglingdao <wanglingdao00@gmail.com> - 2015-05-01 22:01:00
 *
 * Base
 * ---------
 * Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。
 * fork from:
 *  - https://github.com/aralejs/base/blob/master/src/base.js
 */

'use strict';

var Class = require('nd-class');
var Events = require('nd-events');
var Aspect = require('nd-aspect');
var Attribute = require('nd-attribute');

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function parseEventsFromInstance(host, attrs) {
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      var m = '_onChange' + ucfirst(attr);
      if (host[m]) {
        host.on('change:' + attr, host[m]);
      }
    }
  }
}

module.exports = Class.create({
  Implements: [Events, Aspect, Attribute],

  initialize: function(config) {
    this.initAttrs(config);

    // Automatically register `this._onChangeAttr` method as
    // a `change:attr` event handler.
    parseEventsFromInstance(this, this.attrs);
  },

  destroy: function() {
    this.off();

    for (var p in this) {
      if (this.hasOwnProperty(p)) {
        delete this[p];
      }
    }

    // Destroy should be called only once, generate a fake destroy after called
    // https://github.com/aralejs/widget/issues/50
    this.destroy = function() {};
  }
});
