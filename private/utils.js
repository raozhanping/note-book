/**
 * 获取视窗大小
 * @returns {Object} viewport
 */
export function getViewportRect () {
    var result = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        right: window.innerWidth,
        height: window.innerHeight,
        bottom: window.innerHeight
    };
    if (result.height) {
        return result;
    }
    var mode = document.compatMode;
    if (mode === 'CSS1Compat') {
        result.width = result.right = document.documentElement.clientWidth;
        result.height = result.bottom = document.documentElement.clientHeight;
    } else {
        result.width = result.right = document.body.clientWidth;
        result.height = result.bottom = document.body.clientHeight;
    }
    return result;
}
/**
 * 判断矩形是否相交
 * @param {Object} r1 
 * @param {Object} r2 
 * @returns {Boolean} isIntersect
 */
export function intersectRect (r1, r2) {
    return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
}

