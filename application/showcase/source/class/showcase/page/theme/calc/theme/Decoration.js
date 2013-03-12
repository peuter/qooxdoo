/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Theme.define("showcase.page.theme.calc.theme.Decoration",
{
  decorations :
  {
    "calc-button" :
    {
      style :
      {
        borderImage : "showcase/theme/button.png",
        insets : [3, 3, 5, 3],
        backgroundColor: "#D1D1D1"
      }
    },

    "calc-button-pressed" :
    {
      style :
      {
        borderImage : "showcase/theme/button-pressed.png",
        insets : [3, 3, 5, 3],
        backgroundColor: "#009600"
      }
    },

    "calc-display" :
    {
      style :
      {
        borderImage : "showcase/theme/display.png",
        insets : [5, 5, 5, 4],
        backgroundColor: "#F4F4F4"
      }
    },

    "calc-window" :
    {
      style :
      {
        borderImage : "showcase/theme/window.png",
        insets : [6, 2, 2, 2],
        backgroundColor : "#757575"
      }
    }
  }
});
