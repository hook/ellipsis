/**
 * HTMLElement.ellipsis
 *
 * This uses a parent block element as a size requirement
 * and shrinks the child (or the parent if a child is not
 * defined) until the content fits within the parent.
 *
 * @author Gabriel Hook
 *
 * @param {Object} options
 * @param {String} options.child - the inner block that gets modified
 * @param {Boolean} options.word - if true, break by word
 * @param {String} options.append - append character
 * @param {Number} options.maxlength - maximum child length
 * @param {Boolean} options.reset - forces new text
 * @param {Boolean} options.force - adds appendation even if its not too long.
*/
(function() {
    function getElement(object) {
        return (typeof object === 'string')? document.getElementById(object): object;
    }
    function getStyle(object, style) {
        return (object.currentStyle)? object.currentStyle[style]: document.defaultView.getComputedStyle(object, null).getPropertyValue(style);
    }
    function height(element) {
        var rect = element.getBoundingClientRect();
        return rect.bottom - rect.top;
    }
    function isSplitChar(character) {
        return character !== ' ' && character!== ',' && character !== '.' && character !== ';';
    }
    var ellipsis = function(options) {
        var child, append, text, maxHeight, oldMaxHeight, oldHeight, min, max, mid, culling, t0, t1;
        
        child = (options!=null&&options.child!=null)? getElement(options.child): this;
        append = (options!=null&&options.append!=null)? options.append: '&#8230;';

        if(getStyle(this, 'overflow') === 'hidden' && getStyle(this, 'display') === 'block' && getStyle(this,'display') === 'block') {
            text = child.defaultInnerHTML;
            if(text == null||(options !=null && options.reset)) {
                text = child.defaultInnerHTML = child.innerHTML;
                if(options != null && options.maxlength != null && options.maxlength < text.length) {
                    child.innerHTML = child.defaultInnerHTML = text = text.substr(0, options.maxlength);
                }
            }
            else {
                child.innerHTML=text;
            }

            maxHeight = height(this);
            oldMaxHeight = getStyle(this,'max-height');
            oldHeight = getStyle(this,'height');

            this.style.overflow='visible';
            this.style.maxHeight='inherit';
            this.style.height='auto';

            min = 0;
            max = text.length;
            culling = (options != null && options.force === true);

            if(maxHeight < height(this)) {
                while(max - min > 1) {
                    mid = min + ((max - min) >> 1);
                    child.innerHTML = text.substr(0, mid) + append;
                    if(maxHeight < height(this)) {
                        max = mid;
                    }
                    else {
                        min = mid;
                    }
                }

                t0 = text.substr(0, mid).lastIndexOf('<');
                t1 = text.substring(t0, mid).lastIndexOf('>');

                if(t0 > -1 && t1 == -1) {
                    mid = t0;
                    if(text.charAt(mid + 1) === '/')
                        mid = text.substr(0, mid - 1).lastIndexOf('<');
                    child.innerHTML = text.substr(0, mid) + append;
                }

                culling = true;
            }
            if(culling) {
                if (options != null && options.word === true) {
                    if(min < mid) {
                        mid = min;
                    }
                    while(mid > 0 && isSplitChar(text.charAt(mid - 1))) {
                        mid--;
                    }
                    while(mid > 0 && !isSplitChar(text.charAt(mid - 1))) {
                        mid--;
                    }
                    child.innerHTML = text.substr(0, mid) + append;
                }   
                else if(min < mid) {
                    child.innerHTML = text.substr(0, min) + append;
                }
            }
            this.style.overflow = 'hidden';
            this.style.maxHeight = oldMaxHeight;
            this.style.height = oldHeight;
        }
    }
    HTMLElement.prototype.ellipsis = ellipsis;
})();
