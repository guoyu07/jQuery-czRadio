/**
 * $.czRadio
 * @extends jquery.1.4.2
 * @fileOverview Make radios more beautiful and functional
 * @author Lancer
 * @email lancer.he@gmail.com
 * @site crackedzone.com
 * @version 2.0
 * @date 2012-07-06
 * Copyright (c) 2011-2012 Lancer
 * @example
 *    $("#list").czRadio();
 */


(function($){
    //set Namespace.
    var czUI = czUI || {};

    $.fn.czRadio = function( options ) {

        var PNAME   = "czRadio";
        var objData = $(this).data(PNAME);

        //get instance object
        if( typeof options == 'string' && options == 'instance' ){
            return objData;
        }

        var options = $.extend( {}, czUI.czRadio.defaults, options || {} );

        return $(this).each(function(){
            var czRadio = new czUI.czRadio( options );
            czRadio.$elements = $(this);
            czRadio._init();
            $(this).data( PNAME, czRadio );
        });
    }

    czUI.czRadio = function( options ) {
        this.NAME      = 'czRadio';
        this.VERSION   = '2.0';
        this.options   = options;
        this.$elements = null;
        this.$active   = null;
        this._checkedIndex = false;
        this._$radios  = Array();  //real radios
        this._$labels  = Array();  //radio labels
        this._$wraps   = Array();  //new radios
    };

    czUI.czRadio.defaults = {
        inputName      : '',
        className      : '',
        initCallback   : null,
        changeCallback : null,
        forbidCallback : null
    }

    czUI.czRadio.prototype = {

        _init : function() {
            var _that = this;
            this.$elements.addClass('czRadio').addClass( _that.options.className );
            //initialize $elements.
            if ( this.options.inputName ) {
                this.$elements = $(':radio[name=' + this.options.inputName + ']',this.$elements[0]);
            } else {
                this.$elements = $(':radio',this.$elements[0]);
            }

            this.$elements.each(function(item) {
                //set real checkboxs.
                _that._$radios[item] = $( this ).hide();
                _that._$wraps[item]  = $( this ).wrap('<span></span>').parent();
                _that._$wraps[item].css({
                    "display"  : "inline-block",
                    "overflow" : "hidden",
                    "cursor"   : "pointer"}).addClass( 'default' );

                //Add new radio checked style and disabled style.
                if( _that._$radios[item].is(':disabled') == false ) {
                    if( _that._$radios[item].is(':checked')) {
                        _that._setCheckedClass(item);
                        _that.$active  = item;
                    }
                } else {
                    _that._setDisabledClass(item);
                }

                //set label which checkbox has.
                $label = $("label[for='" + _that._$radios[item].attr('id') + "']");
                if ( typeof $label == 'object' && $label.attr('tagName') == 'LABEL') {
                    _that._$labels[item] = $label.removeAttr('for').css('cursor', 'pointer').addClass('default');
                } else {
                    _that._$labels[item] = null;
                }

                //bind click event for $wrap and $label
                _that._$wraps[item].add( _that._$labels[item] ).bind('click', function(){
                    _that._clickEvent(item);
                });
            });

            this._callback('init');
        },

        _clickEvent : function(item) {
            this.$active  = item;

            if( this._$radios[item].is(':disabled') == false ) {
                if( ! this._$radios[item].is(':checked') ) {
                    this.setChecked(item);
                    this._callback('change');
                }
            } else {
                this._callback('forbid');
            }
        },

        _getObjectIndex: function( item ) {
            for ( i in this._$radios ) {
                if( typeof item == 'object' && this._$radios[i].val() == item.val() ) {
                    return i;
                } else if( this._$radios[i].val() == item ) {
                    return i;
                }
            }
            return false;
        },

        _setCheckedClass: function(item) {
            if( this._$radios[item].is( ':disabled' ) == false )
                this._$wraps[item].attr( 'class', 'default default_checked' );
            else
                this._$wraps[item].attr( 'class', 'default disabled_checked' );
        },

        _setUnCheckedClass: function(item) {
            if( this._$radios[item].is( ':disabled' ) == false )
                this._$wraps[item].attr( 'class', 'default' );
            else
                this._$wraps[item].attr( 'class', 'default disabled' );
        },

        _setDisabledClass: function(item) {
            if( this._$radios[item].is( ':checked' ) == false )
                this._$wraps[item].attr( 'class', 'default disabled' );
            else
                this._$wraps[item].attr( 'class', 'default disabled_checked' );
        },

        _setAbledClass: function(item) {
            if( this._$radios[item].is( ':checked' ) == false )
                this._$wraps[item].attr( 'class', 'default' );
            else
                this._$wraps[item].attr( 'class', 'default default_checked' );
        },

        _callback: function(evt) {
            if ( ! $.isFunction(this.options[evt + "Callback"]))
                return;
                this.options[evt + "Callback"].call(this);
        },

        setChecked: function(item) {
            if ( typeof item == 'undefined') return;
            if ( typeof item != 'number' ) {
                var item = this._getObjectIndex(item);
            }
            if ( item === false ) return;

            for ( i in this._$radios ) {
                if ( i == item ) {
                    this._setCheckedClass( i );
                    this._$radios[i].attr('checked', true);
                } else {
                    this._setUnCheckedClass( i );
                    this._$radios[i].removeAttr('checked');
                }
            }
        },

        setAbled: function(item) {
            if ( typeof item == 'undefined') return;
            if ( typeof item != 'number' ) {
                var item = this._getObjectIndex(item);
            }
            if ( item == false) return;
            this._setAbledClass(item);
            this._$radios[item].removeAttr('disabled');
        },

        setDisabled: function(item) {
            if ( typeof item == 'undefined') return;
            if ( typeof item != 'number' ) {
                var item = this._getObjectIndex(item);
            }
            if ( item == false ) return;
            this._setDisabledClass(item);
            this._$radios[item].attr('disabled', true);
        },

        getCheckedText : function() {
            if ( this.$active != null )
                return this._$labels[this.$active].text();
            return null;
        },

        getCheckedValue : function() {
            if ( this.$active != null )
                return this._$radios[this.$active].val();
            return null;
        },

        getObject : function() {
            if ( this.$active == null ) return false;
            return this._$radios[this.$active];
        },

        getValue : function() {
            if ( this.getObject() == false ) return null;
            return this.getObject().val();
        },

        isCheck : function() {
            if ( this.getObject() == false ) return null;
            return this.getObject().is(':checked');
        }
    }
})(jQuery);
