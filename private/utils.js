/**
 * @package rzpUtils
 */
export function isArray (val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}
export function isArrayBuffer (val) {
    return Object.prototype.toString.call(val) === '[object ArrayBuffer]';
}
export function isFormData (val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
}
export function isString (val) {
    return typeof val === 'string';
}
export function isNumber (val) {
    return typeof val === 'number';
}
export function isUndefined (val) {
    return typeof val === 'undefined';
}
export function isObject () {
    return val !== null && typeof val === 'object';
}
export function isDate (val) {
    return Object.prototype.toString.call(val) === '[object Date]';
}
export function isFile(val) {
    return Object.prototype.toString.call(val) === '[object File]';
}
export function isBlob(val) {
    return Object.prototype.toString.call(val) === '[object Blob]';
}
export function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}
export function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

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
/**
 * a, b，thisArg 参数都为一个对象
 * @param {Object} a 
 * @param {Object} b 
 * @param {Object} thisArg 
 * @returns {Object}
 * @requires forEach
 */
export function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
        // 如果指定了 thisArg 那么绑定执行上下文到 thisArg
        if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
        } else {
        a[key] = val;
        }
    });

    return a;
}
/**
 * 遍历基本数据，数组，对象
 * @param {Object} obj 
 * @param {Function} fn 
 * @requires isArray
 */
export function forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') {
        return;
    }
    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
        }
        }
    }
}

/**
 * 合并对象的属性，相同属性后面的替换前面的
 * @requires forEach
 * @returns mergedObj
 */
export function merge() {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = merge(result[key], val);
      } else {
        result[key] = val;
      }
    }
  
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
}

/**
 * 没有引用的合并对象
 * @requires forEach
 * @returns mergedObj
 */
export function deepMerge() {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }
  
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
}
/**
 * 传入的方法执行上下文绑定到 thisArg上
 * @param {Function} fn 
 * @param {Context} thisArg 
 * @returns {Function} wrap
 */
export function bind(fn, thisArg) {
    return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }

        return fn.apply(thisArg, args);
    };
}
/**
 * 请求重试
 * 重试条件: data.header.code 不为0
 * 注意: resolve 和 reject 不要混入
 * @param {*} service 必须返回promise
 * @param {*} time 未成功返回的最大重试次数
 */
export function retryRequest (service, time) {
    var deferred = $q.defer();

    service().then(dealResponse, dealResponse);
    function dealResponse (data) {
        if (data.header && Number(data.header.code) && time > 1) {
            commonService.retryRequest(service, --time).then(function () {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
        } else {
            data.header && !Number(data.header.code) ? deferred.resolve(data) : deferred.reject(data);
        }
    }

    return deferred.promise;
}
/**
 * 接口轮询
 * @param {Function} serviceFunction 返回 promise 的api service
 * @param {Function} callback        成功后的回调
 * @param {Object} config            interval 配置
 */
export function intervalRun (serviceFunction, callback, config) {
    config = angular.merge({
        delay: 5000,        // interval 间隔
        count: 20,          // interval 最大执行次数
        repeat: false,      // 是否一直重复
        returnRes: false    // 是否返回 整个res
    }, config);

    var timeId = null;
    var finished = false;
    var isResponsed = 0;

    function fun(inter, flag) {
        flag = flag || isResponsed;
        if (!flag) return false;
        isResponsed = 0;
        serviceFunction().then(function (data) {
            var dealData;
            isResponsed = 1;
            if (!config.repeat) {
                // 所有数据都完成了
                if (!data || !data.header || data.header.code !== 210) finished = true;
                (finished && promise) && clearInterval(timeId);
            }

            dealData = config.returnRes ? data : data.body;
            if (angular.isFunction(callback)) {
                callback(dealData, finished);
            }
        })
    }
    fun(null, 1);
    timeId = setInterval(fun, config.delay, config.count);

    return timeId;
};
/**
 * 解析url
 * @param {Url} url 
 */
export function parseUrl (url) {
    url = /^(http|https):\/\//.test(url) ? url : 'http://' + (url || '');
    var a = document.createElement('a');
    a.href = url;

    return {
        hash: a.hash.replace('#', ''),
        host: a.host,
        hostname: a.hostname,
        href: a.href,
        origin: a.origin,
        pathname: a.pathname.replace(/^([^\/])/, '/$1'),
        port: a.port,
        protocol: a.protocol.replace(':', ''),
        search: a.search
    };
}
/**
 * 获取popover的位置信息
 * @param {Object} conf 
 */
export function popover (conf) {
    if (typeof conf != 'object') return {};

    function Popover(conf) {
        // var box1 = document.getElementById('box1');
        /**
         * 1, 由元素距离 视窗的的 位置 长短 来  判定 popover 显示位置是  top， bottom， 
         * left， right
         * 2、 由元素的 中心位置  计算出 popover 四个方向的 坐标
         * 3、 确定 坐标
         *
         * conf = {
         *      ele: DOM,
         *      clientEle: document.body,
         *      type: 'ele',
         *      dialogWidth: 358,
         *      dialogHeight: 286,
         *      dialogOffset: 10,
         *  }
         */
        var _this = this;
        var ele = conf.ele;
        // 相对于 谁的 可视宽高  absolute position
        this.clientEle = conf.clientEle || document.body;
        this.dialogWidth = conf.dialogWidth || 358;
        this.dialogHeight = (conf.dialogHeight || 286);
        this.dialogOffset = conf.dialogOffset || 10;
        this.clientWidth = this.clientEle.clientWidth;
        this.clientHeight = this.clientEle.clientHeight;
        // limit
        this.maxViewTop = conf.maxViewTop || 0;
        this.maxViewLeft = conf.maxViewLeft || 0;
        this.maxViewBottom = conf.maxViewBottom || (this.clientHeight - this.dialogHeight);
        this.maxViewRight = conf.maxViewRight || (this.clientWidth - this.dialogWidth);

        this.rectObj = conf.type === 'ele' ? ele.getBoundingClientRect() : ele;
        this.init = function () {
            this.bestPosition = this.getBestPosition();
        };
        this.getBestPosition = function (flag) {
            var position = calcDialogPosition();
            var direction = ensureDialogDirection();
            var bestPosition = position[direction.name][direction.align.name];
            if (flag) {
                bestPosition.x = calcBoundaryVal(bestPosition.x, this.maxViewLeft, this.maxViewRight);
                bestPosition.y = calcBoundaryVal(bestPosition.y, this.maxViewTop, this.maxViewBottom, this.maxViewTop);
            }
            return bestPosition;
        };
        this.init();

        function calcBoundaryVal(val, minVal, maxVal, offsetVal) {
            // flag decide lt or gt
            val += (offsetVal || 0);
            if (val <= minVal) {
                return val = minVal;
            } else if (val >= maxVal) {
                return val = maxVal;
            }
            return val;
        }

        function ensureDialogDirection() {
            var directionList = ['top', 'bottom', 'left', 'right'];
            var top = _this.rectObj.top;
            var bottom = _this.clientHeight - _this.rectObj.bottom;
            var left = _this.rectObj.left;
            var right = _this.clientWidth - _this.rectObj.right;
            var directionValue = [{
                name: 'top',
                value: top,
            }, {
                name: 'bottom',
                value: bottom,
            }, {
                name: 'left',
                value: left,
            }, {
                name: 'right',
                value: right,
            }];
            // 取出 directionValue 最大值；
            var maxValue = directionValue.reduce(function (v1, v2, index) {
                return v1.value > v2.value ? v1 : v2;
            });
            // debugger;
            if (directionList.indexOf(maxValue.name) < 2) {
                // top  bottom
                maxValue.align = left > right ? directionValue[2] : directionValue[3];
            } else {
                // left  right
                maxValue.align = top < bottom ? directionValue[0] : directionValue[1];
            }

            return maxValue;
        }

        function calcDialogPosition() {
            var top = {
                left: {},
                right: {},
            };
            var bottom = {
                left: {},
                right: {},
            };
            var left = {
                top: {},
                bottom: {},
            };
            var right = {
                top: {},
                bottom: {},
            };
            // top left(align)
            top.left.x = (_this.rectObj.left);
            top.left.y = (_this.rectObj.top - _this.dialogHeight - _this.dialogOffset);
            // limit
            // top right(align)
            top.right.x = (_this.rectObj.right - _this.dialogWidth);
            top.right.y = (_this.rectObj.top - _this.dialogHeight - _this.dialogOffset);
            // bottom left(align)
            bottom.left.x = (_this.rectObj.left);
            bottom.left.y = (_this.rectObj.bottom + _this.dialogOffset);
            // limit
            // bottom right(align)
            bottom.right.x = (_this.rectObj.right - _this.dialogWidth);
            bottom.right.y = (_this.rectObj.bottom + _this.dialogOffset);
            // left top(align)
            left.top.x = (_this.rectObj.left - _this.dialogWidth - _this.dialogOffset);
            left.top.y = (_this.rectObj.top);
            // left bottom(align)
            left.bottom.x = (_this.rectObj.left - _this.dialogWidth - _this.dialogOffset);
            left.bottom.y = (_this.rectObj.bottom - _this.dialogHeight);
            // right top(align)
            right.top.x = (_this.rectObj.right + _this.dialogOffset);
            right.top.y = (_this.rectObj.top);
            // right bottom(align)
            right.bottom.x = (_this.rectObj.right + _this.dialogOffset);
            right.bottom.y = (_this.rectObj.bottom);

            return {
                top: top,
                bottom: bottom,
                left: left,
                right: right,
            };
        }
    }

    return new Popover(conf);
}


/** ============================ 偏业务 ================================= */
/**
 * 漏斗分析创建趋势图层
 * @param {ele} containerEle 
 * @param {Object} options 
 */
export function createCanvas (containerEle, options) {
    var canvasEle = document.createElement('canvas');

    containerEle.css({
        position: 'fixed',
        top: 0,
        left: 0
    });

    canvasEle.width = options.width;
    canvasEle.height = options.height;
    canvasEle.style.position = 'absolute';
    canvasEle.style.top = 0;
    canvasEle.style.left = 0;
    canvasEle.style['z-index'] = 1;

    function CreateCanvas(ele) {
        this.ele = ele || this.getEle();
        this.ctx = this.ele.getContext('2d');
        this.getEle = function () {
            return document.createElement('canvas');
        };

        this.getDrawDataFromEle = function (options) {
            var eleSource = options.eleSource;
            options.shadeData = [];
            options.lineData = [];
            options.circleData = [];

            function initDomRectData (domRectData) {
                // top middle bottom
                var elePointData = {
                    'top.left': {
                            x: domRectData.left,
                            y: domRectData.top
                        },
                    'top.left.offsetHalfHeight.up': {
                        x: domRectData.left,
                        y: domRectData.top - domRectData.height/2
                    },
                    'top.left.offsetHalfHeight.outer': {
                        x: domRectData.left - domRectData.height/2,
                        y: domRectData.top
                    },
                    'top.left.offsetHalfHeight.inner': {
                        x: domRectData.left + domRectData.height / 2,
                        y: domRectData.top
                    },
                    'top.right': {
                        x: domRectData.right,
                        y: domRectData.top
                    },
                    'top.right.offsetHalfHeight.up': {
                        x: domRectData.right,
                        y: domRectData.top - domRectData.height / 2
                    },
                    'top.right.offsetHalfHeight.outer': {
                        x: domRectData.right + domRectData.height / 2,
                        y: domRectData.top
                    },
                    'top.right.offsetHalfHeight.inner': {
                        x: domRectData.right - domRectData.height/2 < domRectData.left ? domRectData.right + domRectData.height/2 : domRectData.right - domRectData.height/2,
                        y: domRectData.top
                    },

                    'middle.left': {
                        x: domRectData.left,
                        y: domRectData.top + domRectData.height / 2
                    },
                    'middle.left.offsetHalfHeight.outer': {
                        x: domRectData.left - domRectData.height / 2,
                        y: domRectData.top + domRectData.height / 2
                    },
                    'middle.left.offsetHalfHeight.inner': {
                        x: domRectData.left + domRectData.height / 2,
                        y: domRectData.top + domRectData.height / 2
                    },
                    'middle.right': {
                        x: domRectData.right,
                        y: domRectData.top + domRectData.height / 2
                    },
                    'middle.right.offsetHalfHeight.outer': {
                        x: domRectData.right + domRectData.height / 2,
                        y: domRectData.top + domRectData.height / 2
                    },
                    // 特殊处理
                    'middle.right.offsetHalfHeight.inner': {
                        x: domRectData.right - domRectData.height / 2 < domRectData.left ? domRectData.right + domRectData.height / 2 : domRectData.right - domRectData.height / 2,
                        y: domRectData.top + domRectData.height / 2
                    },

                    'bottom.left': {
                        x: domRectData.left,
                        y: domRectData.bottom
                    },
                    'bottom.right': {
                        x: domRectData.left,
                        y: domRectData.bottom
                    },
                    'bottom.right.offsetHalfHeight.inner': {
                        x: domRectData.right - domRectData.height / 2 < domRectData.left ? domRectData.right + domRectData.height / 2 : domRectData.right - domRectData.height / 2,
                        y: domRectData.bottom
                    }
                };
                domRectData.rectPosData = elePointData;
                CreateCanvas.prototype = options;
                return domRectData;
            }

            function getExtremum(domRectData) {
                var xPos = getMaxRightXPos(domRectData);
                var yPos = parseInt(domRectData.top + domRectData.height / 2);
                return {
                    x: xPos,
                    y: yPos,
                };
            }

            function getMaxRightXPos(domRectData) {
                var xPos = parseInt(domRectData.left + domRectData.width - domRectData.height / 2);
                return xPos = xPos <= domRectData.left ? parseInt(domRectData.left + domRectData.height / 2) : xPos;
            };

            function getMaxPos(pos, direction, domRectData) {
                var directionMap = {
                    left: domRectData.left,
                    right: domRectData.right,
                    top: domRectData.top,
                    bottom: domRectData.bottom,
                };

                return pos > directionMap[direction] ? parseInt(pos) : parseInt(directionMap[direction]);
            }

            eleSource.each(function (index, ele) {
                var $first = !index;
                var $last = index === eleSource.length - 1;
                var eleData = ele.getBoundingClientRect();
                initDomRectData(eleData);
                // 获得极值
                var extremum = getExtremum(eleData);
                var shadePath = [['middle.left', 'middle.right', 'bottom.right.offsetHalfHeight.inner'],  ['top.right.offsetHalfHeight.inner', 'bottom.right.offsetHalfHeight.inner'], ['top.right.offsetHalfHeight.inner', 'middle.right.offsetHalfHeight.inner', 'middle.left']];
                var linePath = [['middle.right.offsetHalfHeight.inner', 'bottom.right.offsetHalfHeight.inner'], ['top.right.offsetHalfHeight.inner', 'bottom.right.offsetHalfHeight.inner'], ['top.right.offsetHalfHeight.inner', 'middle.right.offsetHalfHeight.inner']];
                var circleCenter = ['middle.right.offsetHalfHeight.inner'];

                getShadeData(extremum, eleData);
                getLineData(extremum, eleData);
                getCircleData(extremum, eleData);


                function getShadeData(extremum, domRectData) {
                    switch (index) {
                        case 0:
                            shadePath[0].forEach(function (path, i) {
                                var data = domRectData.rectPosData[path];
                                if (!i) data.shadeColor = options.shadeColor;
                                options.shadeData.push(data);
                            });
                            break;
                        case (eleSource.length - 1):
                            shadePath[2].forEach(function (path, i) {
                                var data = domRectData.rectPosData[path];
                                options.shadeData.push(data);
                            });
                            break;
                        default:
                            shadePath[1].forEach(function (path) {
                                var data = domRectData.rectPosData[path];
                                options.shadeData.push(data);
                            });
                    }
                }

                function getLineData(extremum, domRectData) {
                    if ($first) {
                        linePath[0].forEach(function (path, i) {
                            var $last = i === linePath[0].length - 1;
                            var data = domRectData.rectPosData[path];
                            data.lineWidth = options.lineWidth;
                            data.lineColor = options.lineColor;
                            if ($last) data.y -= data.lineWidth/2;
                            options.lineData.push(data);
                        });
                    } else if ($last) {
                        linePath[2].forEach(function (path, i) {
                            var $first = !i;

                            var data = domRectData.rectPosData[path];
                            data.lineWidth = options.lineWidth;
                            data.lineColor = options.lineColor;

                            $first && (data.y += data.lineWidth);

                            options.lineData.push(data);
                        });
                    } else {
                        linePath[1].forEach(function (path, i) {
                            var $first = !i;
                            var $last = i === linePath[1].length - 1;

                            var data = domRectData.rectPosData[path];
                            data.lineWidth = options.lineWidth;
                            data.lineColor = options.lineColor;

                            $first && (data.y += data.lineWidth);
                            $last && (data.y -= data.lineWidth);

                            options.lineData.push(data);
                        });
                    }
                }

                function getCircleData(extremum, domRectData) {
                    circleCenter.forEach(function (path) {
                        var data = domRectData.rectPosData[path];
                        data.radius = parseInt(domRectData.height / 2),
                        data.circleColor = options.circleColor,

                        options.circleData.push(data);
                    });
                }
            });
        };

        this.init = function (options) {
            this.getDrawDataFromEle(options);

            this.drawShade(options.shadeData, this.ctx);
            this.drawLine(options.lineData, this.ctx);
            this.drawCircle(options.circleData, this.ctx);

        };

        this.drawShade = function (posArr, ctx) {
            posArr.forEach(function (pos, index) {
                if (!index) {
                    ctx.fillStyle = pos.shadeColor;
                    ctx.beginPath();
                    ctx.moveTo(pos.x, pos.y);
                }
                ctx.lineTo(pos.x, pos.y);
                if (index === posArr.length - 1) {
                    ctx.closePath();
                    ctx.fill();
                }
            });
        }

        this.drawCircle = function (posArr, ctx) {
            posArr.forEach(function (pos) {
                ctx.fillStyle = pos.circleColor;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2, true);
                ctx.fill();
            });
        };

        this.drawLine = function (posArr, ctx) {
            ctx.beginPath();
            posArr.forEach(function (pos, index) {
                ctx.strokeStyle = pos.lineColor;
                ctx.lineWidth = pos.lineWidth;
                ctx.lineCap = pos.lineCap;
                if (!index) {
                    return ctx.moveTo(pos.x, pos.y);
                }
                ctx.lineTo(pos.x, pos.y);
                if (index === posArr.length - 1) ctx.stroke();
            });
        };
    }

    var chart = new CreateCanvas(canvasEle);
    chart.init(options);

    containerEle.append(canvasEle);

    return chart;
}

