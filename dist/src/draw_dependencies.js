"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawDependency = function (x1, y1, x2, y2, pType, pClass, offset) {
    var vDir = 1;
    var vBend = false;
    var vShort = 4;
    var vRow = Math.floor(this.getRowHeight() / 2);
    if (y2 < y1)
        vRow *= -1;
    switch (pType) {
        case 'SF':
            vShort *= -1;
            if (x1 - 10 <= x2 && y1 != y2)
                vBend = true;
            vDir = -1;
            break;
        case 'SS':
            if (x1 < x2)
                vShort *= -1;
            else
                vShort = x2 - x1 - (2 * vShort);
            break;
        case 'FF':
            if (x1 <= x2)
                vShort = x2 - x1 + (2 * vShort);
            vDir = -1;
            break;
        default:
            if (x1 + 10 >= x2 && y1 != y2)
                vBend = true;
            break;
    }
    var y1WithOffset = y1 + offset;
    var y2WithOffset = y2 + offset;
    if (vBend) {
        this.sLine(x1, y1WithOffset, x1 + vShort, y1WithOffset, pClass);
        this.sLine(x1 + vShort, y1WithOffset, x1 + vShort, y2WithOffset - vRow, pClass);
        this.sLine(x1 + vShort, y2WithOffset - vRow, x2 - (vShort * 2), y2WithOffset - vRow, pClass);
        this.sLine(x2 - (vShort * 2), y2WithOffset - vRow, x2 - (vShort * 2), y2WithOffset, pClass);
        this.sLine(x2 - (vShort * 2), y2WithOffset, x2 - (1 * vDir), y2WithOffset, pClass);
    }
    else if (y1 != y2) {
        this.sLine(x1, y1WithOffset, x1 + vShort, y1WithOffset, pClass);
        this.sLine(x1 + vShort, y1WithOffset, x1 + vShort, y2WithOffset, pClass);
        this.sLine(x1 + vShort, y2WithOffset, x2 - (1 * vDir), y2WithOffset, pClass);
    }
    else
        this.sLine(x1, y1WithOffset, x2 - (1 * vDir), y2WithOffset, pClass);
    var vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
    vTmpDiv.style.width = '0px';
    vTmpDiv.style.height = '0px';
};
exports.DrawDependencies = function (vDebug, offset) {
    if (vDebug === void 0) { vDebug = false; }
    if (this.getShowDeps() == 1) {
        this.CalcTaskXY(); //First recalculate the x,y
        this.clearDependencies();
        var vList = this.getList();
        for (var i = 0; i < vList.length; i++) {
            var vDepend = vList[i].getDepend();
            var vDependType = vList[i].getDepType();
            var n = vDepend.length;
            if (n > 0 && vList[i].getVisible() == 1) {
                for (var k = 0; k < n; k++) {
                    var vTask = this.getArrayLocationByID(vDepend[k]);
                    if (vTask >= 0 && vList[vTask].getGroup() != 2) {
                        if (vList[vTask].getVisible() == 1) {
                            if (vDebug) {
                                console.log("init drawDependency ", vList[vTask].getID(), new Date());
                            }
                            var cssClass = 'gDepId' + vList[vTask].getID() +
                                ' ' + 'gDepNextId' + vList[i].getID();
                            var dependedData = vList[vTask].getDataObject();
                            var nextDependedData = vList[i].getDataObject();
                            if (dependedData && dependedData.pID && nextDependedData && nextDependedData.pID) {
                                cssClass += ' gDepDataId' + dependedData.pID + ' ' + 'gDepNextDataId' + nextDependedData.pID;
                            }
                            if (vDependType[k] == 'SS')
                                this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'SS', cssClass + ' gDepSS', offset);
                            else if (vDependType[k] == 'FF')
                                this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getEndX(), vList[i].getEndY(), 'FF', cssClass + ' gDepFF', offset);
                            else if (vDependType[k] == 'SF')
                                this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getEndX(), vList[i].getEndY(), 'SF', cssClass + ' gDepSF', offset);
                            else if (vDependType[k] == 'FS')
                                this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'FS', cssClass + ' gDepFS', offset);
                        }
                    }
                }
            }
        }
    }
    // draw the current date line
    if (this.vTodayPx >= 0)
        this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
};
//# sourceMappingURL=draw_dependencies.js.map