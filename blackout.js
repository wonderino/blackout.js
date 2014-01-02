/*
  STOP SOPA
  Embeddable code for SOPA blackout solidarity

  by Greg Leuch <http://gleuch.com> / @gleuch,
  based on the blocker series by @gleuch (Shaved Bieber, Tinted Sheen, Ctrl+F'd, and more).

  MIT License - http://creativecommons.org/licenses/MIT.

  ------------------------------------------------------------------------------------
 <script type="text/javascript">
  var BLACKOUT_OPTION = {
    color : '#000000',
    promote : true
  };

  document.write('<scr'+'ipt src="http://fffff.at/stop_sopa/blackout.js?v=1"></scr'+'ipt>');
</script>
*/

function blackout_start($_) {
  $_.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);};

  (function($_) {
    $_.blackout = function(data, c) {
      if (!$_.blackout.settings.finish) $_.blackout.init();
      $_(data).blackout(c);
      if (!$_.blackout.settings.finish) $_.blackout.finish(c);
    };

    $_.fn.blackout = function(c) {
      return this.filter(function() {
        return $_.blackout.filter(this);
      }).each(function() {
        $_.blackout.blackout(this, c);
      });
    };

    $_.extend($_.blackout, {
      settings : {hide_bg : true, href : false, page_height : 0, replace: '<ins class="blackout" style="color: %C; background-color: %C;">$1</ins>', init : false, finish : false},

      pluck : function(str) {
        return $_.map(str.split(' '), function(s) {return s.replace(/.{1}/img, '*');}).join(' ');
      },

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !($_(self).hasClass('blackout') || $_(self).hasClass('skip_stop_sopa') || tag == 'head' || tag == 'img' || tag == 'textarea' || tag == 'option' || tag == 'style' || tag == 'script' || tag == 'code' || tag == 'samp');
        } else {
          return true;
        }
      },

      blackout : function(self, c) {
        $_(self).css({'text-shadow' : 'none'});

        if (self.nodeType == 3) {
          if (self.nodeValue.replace(/\s/ig, '')) {
            var text = $_.map(self.nodeValue.split(' '), function(s) {return $_.blackout.settings.replace.replace(/\%C/mg, c).replace(/\$1/mg, s);}).join(' '),
                sp1 = document.createElement("span");
            sp1.className = 'blackout';
            sp1.innerHTML = text;
            self.parentNode.replaceChild(sp1, self)
          }
        } else if (self.nodeType == 1) {
          if ($_(self).children().length > 0) {
            $_.blackout($_(self).contents(), c);
          } else {
            if ($_(self).html() != '') {
              text = $_.map($_(self).html().split(' '), function(s) {return $_.blackout.settings.replace.replace(/\%C/mg, c).replace(/\$1/mg, s);}).join(' '),
              $_(self).html(text);
            }
          }
        }
      },

      init : function() {
        $_.blackout.settings.init = true;
      },

      finish : function(c) {
        $_(document).each(function() {this.title = $_.blackout.pluck(this.title);});

        $_('img, input[type=image], iframe, embed, object').each(function() {
          try {
            if ($_(this).attr('alt').match($_.blackout.settings.search) || $_(this).attr('title').match($_.blackout.settings.search) || $_(this).attr('src').match($_.blackout.settings.search)) {
              var r = $_(this), w = r.width(), h = r.height(), el_c = c;
              r.addClass('blackout').css({background: el_c, width: r.width(), height: r.height()}).attr('src', ("https:" == document.location.protocol ? 'http:' : 'http:')+'//assets.gleuch.com/blank.png').width(w).height(h);
            }
          } catch(e) {}
        });
        
        // $_('input[type=text]').each(function() {if ($_(this).val().match($_.blackout.settings.search) ) $_(this).val( $_.blackout.pluck($_(this).val()) );});
        // $_('textarea, option').each(function() {if ($_(this).html().match($_.blackout.settings.search) ) $_(this).html( $_.blackout.pluck($_(this).html()) );});

        var s = document.createElement("style");
        s.innerHTML = ".blackout, .blackout:hover {display:inline-block; font-size: inherit !important; box-shadow: 0 1px 2px rgba(0,0,0,.12); text-decoration: none !important;"+ ($_.blackout.settings.hide_bg ? "background-image: none !important;" : "") +"} .bg_blackout {box-shadow: 0 1px 2px rgba(0,0,0,.12); "+ ($_.blackout.settings.hide_bg ? "background-image: none !important;" : "") +"}";
        $_('head').append(s);

        $_.blackout.settings.href = location.href;
        $_.blackout.settings.page_height = $_('body').height();

        $_.blackout.settings.finish = true;
      }
    });
  })($_);

  if (localStorage) {
    if (localStorage.disable_blackout != '1' || !BLACKOUT_OPTION.promote) {
      $_.blackout('body', BLACKOUT_OPTION.color);
    }

    if (!!BLACKOUT_OPTION.promote) {
      var html = '';
      if (localStorage.disable_blackout == '1') {
        html = ' \
          <div id="blackout_promote" class="skip_stop_sopa" style="position: fixed; z-index: 3000; top: 0; right: 0;"> \
           <a onmouseover="this.style.opacity=.64;" onmouseout="this.style.opacity=1.0;" style="display: inline-block; margin: 5px; padding: 8px 8px 7px 8px; font: 18px/18px normal Helvetica,Arial,sans-serif; font-weight: bold; color: #fff; background: #f0f; text-shadow: 0 1px 2px rgba(0,0,0,.18); box-shadow: 0 1px 2px rgba(0,0,0,.18); font-weight: bold; border: 1px solid #f0f; border-radius: 7px;" href="http://bit.ly/FATSOPA" title="http://fightforthefuture.org/" target="_blank" id="blackout_action">STOP SOPA!</a> \
          </div> \
        ';
        
        setInterval(function() {
          var el = $_('#blackout_promote a');
          if (el.size() > 0) {
            if (el.hasClass('sopa_ff0')) {
              el.removeClass('sopa_ff0').addClass('sopa_f0f').css({'background-color':'#f0f', 'color':'#fff', 'border-color':'#f0f'});
            } else {
              el.removeClass('sopa_f0f').addClass('sopa_ff0').css({'background-color':'#ff0', 'color':'#000', 'border-color':'#ff0'});
            }
          }
        }, 1000);
      } else {
        html = ' \
          <div id="blackout_promote" class="skip_stop_sopa" style="position: fixed; z-index: 3000; top: 30%; left: 0; right: 0;"> \
           <div style="width: 550px; margin: 0 auto; padding: 14px; background: #ff0; border-radius: 10px; border: 9px solid #ff0; box-shadow: 0px 3px 5px rgba(0,0,0,.24);"> \
            <h1 style="text-align: center; font: 24px/29px bold Helvetica,Arial,sans-serif; color: #000; margin: 0; padding: 0 0 4px 0; font-weight: bold; ">Prevent Online Censorship!</h1> \
            <p style="text-align: center; font: 17px/21px normal Helvetica,Arial,sans-serif; color: #222; margin: 0; padding: 0 0 4px 0; font-weight: bold;">This and many other web sites could disappear under SOPA!</p> \
            <p style="text-align: left;font: 13px/19px normal Helvetica,Arial,sans-serif; color: #222; margin: 0; padding: 0 0 4px 0;">Speak up and voice your concerns against SOPA ("Stop Online Piracy Act"), a terrible piece of Congressional legislation that gives broad powers for the courts to take down sites by claims from "infringed" users.</p> \
            <div style="text-align: center; padding: 14px 0 0 0; margin: 0;"> \
             <a onmouseover="this.style.opacity=.64;" onmouseout="this.style.opacity=1.0;" style="display: inline-block; margin: 0 5px; padding: 8px 8px; font: 18px/18px normal Helvetica,Arial,sans-serif; font-weight: bold; color: #fff; background: #f0f; text-shadow: 0 1px 2px rgba(0,0,0,.18); box-shadow: 0 1px 2px rgba(0,0,0,.18); font-weight: bold; border: 1px solid #f0f; border-radius: 7px;" href="http://americancensorship.org/" title="http://americancensorship.org/" target="_blank" id="blackout_action">Make Some Noise</a> \
             <a onmouseover="this.style.opacity=.64;" onmouseout="this.style.opacity=1.0;" style="display: inline-block; margin: 0 5px; padding: 8px 8px; font: 18px/18px normal Helvetica,Arial,sans-serif; font-weight: bold; color: #444; background: #ddd; text-shadow: 0 1px 2px rgba(0,0,0,.18); box-shadow: 0 1px 2px rgba(0,0,0,.18); font-weight: bold; border: 1px solid #ddd; border-radius: 7px;" href="javascript:;" id="blackout_skip">No Thanks</a> \
            </div> \
           </div> \
          </div> \
        ';
      }

      if ($_('#blackout_promote').size() <= 0) $_('body').append(html);

      $_('#blackout_action, #blackout_skip').click(function() {
        if (localStorage.disable_blackout != '1') {
          $_('#blackout_promote').remove();
          localStorage.disable_blackout = '1';
          window.location.reload();
        }
        return true;
      });
    }
  }


  if (!localStorage.disable_blackout) {
    /* Allow AJAX detection */
    setInterval(function() {
      var h = $_('body').height(), ch = $_.blackout.settings.page_height;

      if (location.href != $_.blackout.settings.href || Math.abs(ch-h) > 20 ) {
        $_.blackout.settings.href = location.href;
        $_.blackout.settings.page_height = h;
        $_.blackout.settings.init = false;
        $_.blackout.settings.finish = false;
        $_.blackout('body', BLACKOUT_OPTION.color);
      }
    }, 1000);
  }
};






/* STOP SOPA!! */
try {
  if (typeof(jQuery) == 'undefined') {
    document.write('<scr'+'ipt src="'+ ("https:" == document.location.protocol ? 'https:' : 'http:') +'//code.jquery.com/jquery-1.10.2.min.js"></scr'+'ipt>');
  }
  

  if (typeof(BLACKOUT_OPTION) != 'object') var BLACKOUT_OPTION = {promote:false}
  if (typeof(BLACKOUT_OPTION.promote) == 'undefined') BLACKOUT_OPTION.promote = true;
  if (typeof(BLACKOUT_OPTION.color) == 'undefined') BLACKOUT_OPTION.color = '#000000';
 
  setTimeout(function() {
    try {
      if (!jQuery('body').hasClass('black_out')) {
        jQuery('body').addClass('black_out');
        blackout_start(jQuery);
      }
    } catch(err) {
      
    }
  }, (typeof(jQuery) == 'undefined' ? 1000 : 100));
} catch(err) {}