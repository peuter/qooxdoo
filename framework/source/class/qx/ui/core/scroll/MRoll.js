/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Mixin holding the handler for roll event. Please
 * keep in mind that the including widget has to have the scroll bars
 * implemented as child controls named <code>scrollbar-x</code> and
 * <code>scrollbar-y</code> to get the handler working. Also, you have to
 * attach the listener yourself.
 */
qx.Mixin.define("qx.ui.core.scroll.MRoll",
{
  members :
  {
    __cancelRoll : null,
    __cancelTimer : null,
    __pointerDown : null,
    __currentMomentumDirection: null,

    /**
     * Responsible for adding the event listener needed for scroll handling.
     */
    _addRollHandling : function() {
      this.addListener("roll", this._onRoll, this);
      this.addListener("pointerdown", this._onPointerDownForRoll, this);
    },


    /**
     * Responsible for removing the event listener needed for scroll handling.
     */
    _removeRollHandling : function() {
      this.removeListener("roll", this._onRoll, this);
      this.removeListener("pointerdown", this._onPointerDownForRoll, this);
    },


    /**
     * Handler for the pointerdown event which adds a timer and listeners to check if the momentum scrolling can be canceled.
     *
     * @param e {qx.event.type.Pointer} pointerdown event
     */
    _onPointerDownForRoll : function(e) {
      this.__pointerDown = {
        top: e.getDocumentTop(),
        left: e.getDocumentLeft(),
        time: Date.now(),
        id : e.getPointerId()
      }
      this.__cancelTimer = qx.event.Timer.once(this._checkForCancel, this, 10);
      this.addListener("pointermove", this._checkForCancel, this);
      this.addListener("pointerup", this._checkForCancel, this);
    },

    /**
     * Checks if the momentum scrolling can be canceled.
     *
     * @param e {qx.event.type.Event} pointermove/-up or interval event
     */
    _checkForCancel : function(e) {
      var removeListeners = false;
      if (!this.__cancelRoll) {
        if (e.getType() === "interval") {
          // fired by the timer, which means the user triggered no pointermove/-up events in the meantime
          this.__cancelRoll = this.__pointerDown.id;
          removeListeners = true;
          this.__cancelTimer = null;
        }
        else {
          if (this.__cancelTimer) {
            this.__cancelTimer.stop();
            this.__cancelTimer = null;
          }
          var deltaX = e.getDocumentLeft() - this.__pointerDown.left;
          var deltaY = e.getDocumentTop() - this.__pointerDown.top;
          var delta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
          if (delta < 5) {
            // not much movement here, abort the momentum scroll
            this.__cancelRoll = this.__pointerDown.id;
            removeListeners = true;
          }
        }
      } else {
        removeListeners = true;
        if (this.__cancelTimer) {
          this.__cancelTimer.stop();
          this.__cancelTimer = null;
        }
      }
      if (removeListeners) {
        this.removeListener("pointermove", this._checkForCancel, this);
        this.removeListener("pointerup", this._checkForCancel, this);
      }
    },


    /**
     * Roll event handler
     *
     * @param e {qx.event.type.Roll} Roll event
     */
    _onRoll : function(e)
    {
      // only wheel and touch
      if (e.getPointerType() == "mouse") {
        return;
      }

      if (this.__cancelRoll && e.getMomentum()) {
        e.stopMomentum();
        this.__cancelRoll = null;
        return;
      }
      this.__cancelRoll = null;

      var showX = this._isChildControlVisible("scrollbar-x");
      var showY = this._isChildControlVisible("scrollbar-y");

      var scrollbarY = showY ? this.getChildControl("scrollbar-y", true) : null;
      var scrollbarX = showX ? this.getChildControl("scrollbar-x", true) : null;

      var deltaY = e.getDelta().y;
      var deltaX = e.getDelta().x;

      var endY = !showY;
      var endX = !showX;

      // y case
      if (scrollbarY) {
        if (deltaY !== 0) {
          scrollbarY.scrollBy(parseInt(deltaY, 10));
        }

        var position = scrollbarY.getPosition();
        var max = scrollbarY.getMaximum();

        // pass the event to the parent if the scrollbar is at an edge
        if (deltaY < 0 && position <= 0 || deltaY > 0 && position >= max) {
          endY = true;
        }
      }

      // x case
      if (scrollbarX) {
        if (deltaX !== 0) {
          scrollbarX.scrollBy(parseInt(deltaX, 10));
        }

        var position = scrollbarX.getPosition();
        var max = scrollbarX.getMaximum();
        // pass the event to the parent if the scrollbar is at an edge
        if (deltaX < 0 && position <= 0 || deltaX > 0 && position >= max) {
          endX = true;
        }
      }

      if (endX && endY) {
        e.stopMomentum();
      }

      // pass the event to the parent if both scrollbars are at the end
      if ((!endY && deltaX === 0) ||
          (!endX && deltaY === 0) ||
          ((!endX || !endY ) && deltaX !== 0 && deltaY !== 0)) {
        // Stop bubbling and native event only if a scrollbar is visible
        e.stop();
      }
    }
  }
});
