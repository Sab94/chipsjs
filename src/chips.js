 $(document).ready(function(){

  // Create the defaults, only once!
  var defaults = {
    separetor: [' ','enter'], //seperator
    chipStyle: '', //chip style
    wrapperStyle: null, //wrapper style
    deleteChipStyle: '', //delete chip style
    type: 'text', //input type
    activeOnBlur: false, //create chip from text on blur event
    md: false, //material design
    target: null, //target any external div
    containerStyle: null, //container style
  };

  // The actual plugin constructor
  function Chips(element, chip = {}) {
    this.element = element;
    if(element.length == 0) {
      throw new Error(`${element} is undefined`);
    }
    if(typeof chip.type === 'undefined'){
      chip.type = element[0].type;
    }
    this.options = $.extend({}, defaults, chip);
    let options = this.options;
    const separetor = this.options.separetor;
    const chip_style = this.options.chipStyle;
    const dlt_chip_style = this.options.deleteChipStyle;
    let t = options.target;
    if(options.target){
      if($(options.target).length == 0) {
        throw new Error(`${options.target} is not available in the dom`);
      }
      else {
        t = $(options.target);
      }
    }
    else {
      element.before("<div class='chip-container'></div>");
      t = $(element).parent().children('.chip-container');
    }
    this.options = $.extend({}, this.options, {target : t});
    options = this.options;
    if(options.wrapperStyle) {
      $(element).parent().attr('style',options.wrapperStyle);
    }
    if(options.containerStyle) {
      t.attr('style',options.containerStyle);
    }
    
    const kArray = Object.keys(keyCodes);        // Creating array of keys
    const vArray = Object.values(keyCodes);      // Creating array of values
    const vIndex = vArray.indexOf(separetor[0]);         // Finding value index 

    const defaultWhich =  kArray[vIndex];     
    if(options.md == true) {
      t.addClass('chip-md');
    }


    element.blur(function(){
      if(options.activeOnBlur == true) {
        var ev = $.Event('keydown');
        ev.which = defaultWhich;
        ev.keyCode = defaultWhich;
        $(element).trigger(ev);
      }
    });

    element.keydown(function(e) {
      if(element.attr('value') === '' || typeof element.attr('value') === 'undefined') {
          var Chip = []
      }
      else {
        var Chip = element.attr('value').split(',');
      }
      for (i = 0; i < separetor.length; i++){
        if(keyCodes[e.which] == separetor[i] && element.val().trim() != '') {
          e.preventDefault();
          if(options.type === 'email' && !validateEmail(element.val())){
            return;
          }
          Chip.push(element.val().trim());
          $(t).append("<div style='"+chip_style+"' class='chip-body' id="+(Chip.length-1)+"><span class='chip-text'>"+ element.val().trim() +"</span><span class='chip-closebtn' style='"+dlt_chip_style+"'><img src='https://use.fontawesome.com/releases/v5.0.13/svgs/solid/times-circle.svg' alt='close'></span></div>");
          element.val('');
          element.attr('value', Chip);
        }
      }

      if(e.keyCode == 8 && element.val().trim() == '' && $(element).attr("value")!="" && Chip.length > 0){
        last_chip = (Chip.length - 1);
        $("#"+last_chip,t).remove();
        pop = Chip.pop();

        element.val(pop+" ");
        element.attr('value', Chip);
      }

    });

    $(t).on("click",".chip-closebtn",function() {
      if(element.attr('value') === '' || typeof element.attr('value') === 'undefined') {
        var Chip = []
      }
      else {
        var Chip = element.attr('value').split(',');
      }
      $(".chip-body",t).remove();
      $("#"+this.parentElement.id,t).remove();
      Chip.splice(this.parentElement.id,1);
      var newHTML = [];
      for (var i = 0; i < Chip.length; i++) {
          newHTML.push("<div style='"+chip_style+"' class='chip-body' id="+i+"><span class='chip-text'>"+ Chip[i] + "</span><span class='chip-closebtn' style='"+dlt_chip_style+"'><img src='https://use.fontawesome.com/releases/v5.0.13/svgs/solid/times-circle.svg' alt='close'></span></div>");
      }
      $(t).append(newHTML.join(""));
      $(element).attr('value', Chip);
    });
  }

  //preload chips from array
  Chips.prototype.load = function(data){
    let t = this.options.target;
    let element = this.element;
    let chip_style = this.options.chipStyle;
    let dlt_chip_style = this.options.deleteChipStyle;
    if (typeof data === 'undefined') {
        var Chip = [];
        element.attr('value', Chip);
    } else {
        var Chip = data;
        var newHTML = [];
        for (var i = 0; i < Chip.length; i++) {
            newHTML.push("<div style='"+chip_style+"' class='chip-body' id="+i+"><span class='chip-text'>"+ Chip[i] + "</span><span class='chip-closebtn' style='"+dlt_chip_style+"'><img src='https://use.fontawesome.com/releases/v5.0.13/svgs/solid/times-circle.svg' alt='close'></span></div>");
        }
        //$("#add_chip").attr("placeholder", newHTML);
        $(t).append(newHTML.join(""));
        element.attr('value', Chip);
        element.val("");
    }
  }

  //destroy chips
  Chips.prototype.destory = function(){
    let element = this.element;
    let t = this.options.target;
    element.unwrap(".chip-wrapper");
    $('.chip-body',t).remove();
    element.removeClass('chip-input');
    element.attr('value','');
  }

  //reset chips
  Chips.prototype.reset= function(){
    let element = this.element;
    let t = this.options.target;
    $('.chip-body',t).remove();
    element.attr('value','');
  }

  // current chips
  Chips.prototype.get = function(){
    let element = this.element;
    
    return element.attr('value');
  }

  //check if any chip 
  Chips.prototype.isValid = function(){
    let element = this.element;
    if(element.attr('value') === '' || typeof element.attr('value') === 'undefined') {
      return false;
    }
    else {
      return true;
    }
  }
	$.fn.chips = function(chip = {}){
		var element = $(this);
    
    element.wrap("<div class='chip-wrapper'></div>");
    
    element.addClass("chip-input");
    $(element.parent()).click(function(){
      $(element).focus();
    });
    var wizard = new Chips(element, chip);
    return wizard;
		
	};
  var keyCodes = {
    3 : "break",
    8 : "backspace / delete",
    9 : "tab",
    12 : 'clear',
    13 : "enter",
    16 : "shift",
    17 : "ctrl",
    18 : "alt",
    19 : "pause/break",
    20 : "caps lock",
    27 : "escape",
    28 : "conversion",
    29 : "non-conversion",
    32 : " ",
    33 : "page up",
    34 : "page down",
    35 : "end",
    36 : "home ",
    37 : "left arrow ",
    38 : "up arrow ",
    39 : "right arrow",
    40 : "down arrow ",
    41 : "select",
    42 : "print",
    43 : "execute",
    44 : "Print Screen",
    45 : "insert ",
    46 : "delete",
    48 : "0",
    49 : "1",
    50 : "2",
    51 : "3",
    52 : "4",
    53 : "5",
    54 : "6",
    55 : "7",
    56 : "8",
    57 : "9",
    58 : ":",
    59 : "semicolon (firefox), equals",
    60 : "<",
    61 : "equals (firefox)",
    63 : "ß",
    64 : "@ (firefox)",
    65 : "a",
    66 : "b",
    67 : "c",
    68 : "d",
    69 : "e",
    70 : "f",
    71 : "g",
    72 : "h",
    73 : "i",
    74 : "j",
    75 : "k",
    76 : "l",
    77 : "m",
    78 : "n",
    79 : "o",
    80 : "p",
    81 : "q",
    82 : "r",
    83 : "s",
    84 : "t",
    85 : "u",
    86 : "v",
    87 : "w",
    88 : "x",
    89 : "y",
    90 : "z",
    91 : "Windows Key / Left ⌘ / Chromebook Search key",
    92 : "right window key ",
    93 : "Windows Menu / Right ⌘",
    96 : "numpad 0 ",
    97 : "numpad 1 ",
    98 : "numpad 2 ",
    99 : "numpad 3 ",
    100 : "numpad 4 ",
    101 : "numpad 5 ",
    102 : "numpad 6 ",
    103 : "numpad 7 ",
    104 : "numpad 8 ",
    105 : "numpad 9 ",
    106 : "*",
    107 : "+",
    108 : "numpad period (firefox)",
    109 : "-",
    110 : "decimal point",
    111 : "divide ",
    112 : "f1 ",
    113 : "f2 ",
    114 : "f3 ",
    115 : "f4 ",
    116 : "f5 ",
    117 : "f6 ",
    118 : "f7 ",
    119 : "f8 ",
    120 : "f9 ",
    121 : "f10",
    122 : "f11",
    123 : "f12",
    124 : "f13",
    125 : "f14",
    126 : "f15",
    127 : "f16",
    128 : "f17",
    129 : "f18",
    130 : "f19",
    131 : "f20",
    132 : "f21",
    133 : "f22",
    134 : "f23",
    135 : "f24",
    144 : "num lock ",
    145 : "scroll lock",
    160 : "^",
    161 : '!',
    163 : "#",
    164 : '$',
    165 : 'ù',
    166 : "page backward",
    167 : "page forward",
    169 : "closing paren (AZERTY)",
    170 : '*',
    171 : "~ + * key",
    173 : "minus (firefox), mute/unmute",
    174 : "decrease volume level",
    175 : "increase volume level",
    176 : "next",
    177 : "previous",
    178 : "stop",
    179 : "play/pause",
    180 : "e-mail",
    181 : "mute/unmute (firefox)",
    182 : "decrease volume level (firefox)",
    183 : "increase volume level (firefox)",
    186 : ";",
    187 : "=",
    188 : ",",
    189 : "-",
    190 : ".",
    191 : "forward slash / ç",
    192 : "grave accent / ñ / æ",
    193 : "?, / or °",
    194 : "numpad period (chrome)",
    219 : "open bracket ",
    220 : "back slash ",
    221 : "close bracket / å",
    222 : "single quote / ø",
    223 : "`",
    224 : "left or right ⌘ key (firefox)",
    225 : "altgr",
    226 : "< /git >",
    230 : "GNOME Compose Key",
    231 : "ç",
    233 : "XF86Forward",
    234 : "XF86Back",
    240 : "alphanumeric",
    242 : "hiragana/katakana",
    243 : "half-width/full-width",
    244 : "kanji",
    255 : "toggle touchpad"
  };
  function validateEmail(email) 
  {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
  }
});
