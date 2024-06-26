var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _this = this;
// @ts-ignore
var buildFileSystem = function (paths) { return __awaiter(_this, void 0, void 0, function () {
    var root, _i, paths_1, path, splitPath, parent_1, index, _a, splitPath_1, fileOrFolder, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                return [4 /*yield*/, navigator.storage.getDirectory()];
            case 1:
                root = _b.sent();
                _i = 0, paths_1 = paths;
                _b.label = 2;
            case 2:
                if (!(_i < paths_1.length)) return [3 /*break*/, 10];
                path = paths_1[_i];
                splitPath = path.split("/");
                parent_1 = root;
                index = 0;
                _a = 0, splitPath_1 = splitPath;
                _b.label = 3;
            case 3:
                if (!(_a < splitPath_1.length)) return [3 /*break*/, 9];
                fileOrFolder = splitPath_1[_a];
                if (!(index === splitPath.length - 1)) return [3 /*break*/, 5];
                return [4 /*yield*/, parent_1.getFileHandle(fileOrFolder, { create: true })];
            case 4:
                _b.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, parent_1.getDirectoryHandle(fileOrFolder, { create: true })];
            case 6:
                parent_1 = _b.sent();
                _b.label = 7;
            case 7:
                index++;
                _b.label = 8;
            case 8:
                _a++;
                return [3 /*break*/, 3];
            case 9:
                _i++;
                return [3 /*break*/, 2];
            case 10: return [3 /*break*/, 12];
            case 11:
                e_1 = _b.sent();
                console.log(e_1);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
var buildTree = function (directory) { return __awaiter(_this, void 0, void 0, function () {
    var html, _a, _b, _c, handle, _d, _e, e_2_1;
    var _f, e_2, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                html = "<ul>";
                _j.label = 1;
            case 1:
                _j.trys.push([1, 8, 9, 14]);
                _a = true, _b = __asyncValues(directory.values());
                _j.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _j.sent(), _f = _c.done, !_f)) return [3 /*break*/, 7];
                _h = _c.value;
                _a = false;
                handle = _h;
                if (!(handle.kind === "directory")) return [3 /*break*/, 5];
                _d = html;
                _e = "<li>" + handle.name + " ";
                return [4 /*yield*/, buildTree(handle)];
            case 4:
                html = _d + (_e + (_j.sent()) + "</li>");
                return [3 /*break*/, 6];
            case 5:
                if (handle.kind === "file") {
                    html += "<li>" + handle.name + "</li>";
                }
                _j.label = 6;
            case 6:
                _a = true;
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_2_1 = _j.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 14];
            case 9:
                _j.trys.push([9, , 12, 13]);
                if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 11];
                return [4 /*yield*/, _g.call(_b)];
            case 10:
                _j.sent();
                _j.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14:
                html += "</ul>";
                return [2 /*return*/, html];
        }
    });
}); };
buildFileSystem([
    "test.sqlite",
    "root.txt",
    "a/b/c/d.txt",
    "databases/animals.sqlite3",
    "animals/dogs/peach.txt",
    "animals/dogs/melchior.txt",
    "animals/cats/sir-winston-churchill.txt",
]).then(
// @ts-ignore
function () { return __awaiter(_this, void 0, void 0, function () {
    var root, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, navigator.storage.getDirectory()];
            case 1:
                root = _b.sent();
                _a = document.getElementById("filesystem");
                return [4 /*yield*/, buildTree(root)];
            case 2:
                _a.innerHTML = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
