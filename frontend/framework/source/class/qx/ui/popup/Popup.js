/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Popups are widgets, which can be placed on top of the application.
 *
 * Popups are automatically added to the root {@link qx.application.AbstractGui#getRoot}
 * widget. They can be positioned relative to other widgets using
 * {@link #positionRelativeTo} and they can be restricted be inside of the
 * viewport's visible area using {@link #restrictToPageOnOpen}.
 *
 * Popups are used to display menus, the lists of combo boxes and tooltips.
 *
 * @appearance popup
 */
qx.Class.define("qx.ui.popup.Popup",
{
  extend : qx.ui.container.Composite,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(layout)
  {
    this.base(arguments, layout);

    // Excluded by default
    this.exclude();

    // Automatically add to application's root
    qx.core.Init.getApplication().getRoot().add(this);

    // Resize listener
    this.addListener("resize", this._onMove);
    this.addListener("move", this._onMove);
  },





  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "popup"
    },


    /**
     * Whether to let the system decide when to hide the popup. Setting
     * this to false gives you better control but it also requires you
     * to handle the closing of the popup.
     */
    autoHide :
    {
      check : "Boolean",
      init : true
    }
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // overridden
    _applyVisibility : function(value, old)
    {
      this.base(arguments, value, old);

      var mgr = qx.ui.popup.PopupManager.getInstance();
      if (value === "visible")
      {
        mgr.add(this);
        this.bringToFront();
      }
      else
      {
        mgr.remove(this);
      }
    },





    /*
    ---------------------------------------------------------------------------
      ZINDEX SUPPORT
    ---------------------------------------------------------------------------
    */

    _minZIndex : 1e6,


    /**
     * Sets the {@link #zIndex} to Infinity and calls the
     * method {@link #_sendTo}
     *
     * @type member
     * @return {void}
     */
    bringToFront : function()
    {
      this.setZIndex(this._minZIndex+1000000);
      this._sendTo();
    },


    /**
     * Sets the {@link #zIndex} to -Infinity and calls the
     * method {@link #_sendTo}
     *
     * @type member
     * @return {void}
     */
    sendToBack : function()
    {
      this.setZIndex(this._minZIndex+1);
      this._sendTo();
    },


    /**
     * Resets the zIndex of all registered popups and menus
     * (getting the instances via the {@link qx.legacy.ui.popup.PopupManager} and
     * the {@link qx.legacy.ui.menu.Manager}) one higher than the defined minimum zIndex.
     *
     * @type member
     * @return {void}
     */
    _sendTo : function()
    {
      var popups = qx.ui.popup.PopupManager.getInstance().getAll();

      var all = popups.sort(function(a, b) {
        return a.getZIndex() - b.getZIndex()
      });

      var index = this._minZIndex;

      for (var i=0, l=all.length; i<l; i++) {
        all[i].setZIndex(index++);
      }
    },




    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    moveTo : function(left, top)
    {
      this.setLayoutProperties({
        left : left,
        top : top
      });
    },





    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    _onMove : function(e)
    {
      var bounds = this.getBounds();

      // Normalize coordinates
      var left = this._normalizeLeft(bounds.left);
      var top = this._normalizeTop(bounds.top);

      // Detect changes and apply them
      if (left != bounds.left || top != bounds.top) {
        this.setLayoutProperties({ left: left, top: top });
      }
    },






    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */

    _normalizeLeft : function(left)
    {
      var bounds = this.getBounds();
      var parentBounds = this.getLayoutParent().getBounds();

      if (!bounds || !parentBounds) {
        return left;
      }

      if (bounds.left < 0) {
        return 0;
      } else if ((bounds.left + bounds.width) > parentBounds.width) {
        return parentBounds.width - bounds.width;
      }

      return left;
    },


    _normalizeTop : function(top)
    {
      var bounds = this.getBounds();
      var parentBounds = this.getLayoutParent().getBounds();

      if (!bounds || !parentBounds) {
        return top;
      }

      if (bounds.top < 0) {
        return 0;
      } else if ((bounds.top + bounds.height) > parentBounds.height) {
        return parentBounds.height - bounds.height;
      }

      return top;
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    qx.ui.popup.PopupManager.getInstance().remove(this);
  }
});