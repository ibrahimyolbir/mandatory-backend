'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sprite = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _emojioneSpritePositions = require('./emojione-sprite-positions');

var _emojioneSpritePositions2 = _interopRequireDefault(_emojioneSpritePositions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SPRITE_WIDTH = 4160;
var SPRITE_HEIGHT = 2730;
var EMOJI_SIZE = 64;

var base = {
    textIndent: '-9999em',
    imageRendering: 'optimizeQuality',
    fontSize: 'inherit',
    height: 32,
    width: 32,
    top: -3,
    position: 'relative',
    display: 'inline-block',
    margin: '0 .15em',
    lineHeight: 'normal',
    verticalAlign: 'middle',
    backgroundImage: 'url("https://github.com/pladaria/react-emojione/blob/emojione3/assets/sprites/emojione-3.1.2-64x64.png?raw=true")',
    backgroundRepeat: 'no-repeat'
};

var sprite = exports.sprite = function sprite(codepoint) {
    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = Object.assign({}, base, style);

    // ensure square size
    var size = parseInt(result.height);
    result.height = size;
    result.width = size;

    var scale = size / EMOJI_SIZE;

    var _ref = _emojioneSpritePositions2.default[codepoint] || [],
        _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    var left = x * EMOJI_SIZE + x;
    var top = y * EMOJI_SIZE + y;

    result.backgroundPosition = '-' + left * scale + 'px -' + top * scale + 'px';

    var w = SPRITE_WIDTH * scale;
    var h = SPRITE_HEIGHT * scale;
    result.backgroundSize = w + 'px ' + h + 'px';

    return result;
};