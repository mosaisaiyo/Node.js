/** moTable version 0.18
 *  This component can be easily help you to render <table> element in Bootstrap Page
 */

define([], function () {
    var mosTable = function () {

        this.initOData = function () {
            return { temp: { column: {}, items: [] } };
        }

        this.oData = this.initOData();

        this.uuid = function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        }

        this.setModal = function (n, d) {
            this.oData = this.initOData();
            this.modalName = n;
            this.oData[n] = d;
            for (var i = 0; i < this.oData[n]["items"].length; i++) {
                this.oData[n]["items"][i]["_moskey"] = this.uuid();
            }
        }

        this.getModal = function (n) {
            return this.oData[n];
        }

        this.removeTableBodyRows = function () {

            var n = $("table[moscomp='mos_tab']");
            var o = undefined;

            for (var i = 0; i < n.length; i++) {
                if (n.eq(i).attr('mosdata') == this.modalName) {
                    o = n.eq(i);
                    break;
                }
            }

            if (o == undefined)
                return;

            var ui_body = o.children().eq(1);
            ui_body.empty();
            ui_body.append('<tr></tr>');

            return;
        }

        this.eventHandle = function (e) {
            if (e != undefined && e["data"] != undefined)
                console.log(e.data.key + " ~ " + e.target.innerText);
            return;
        }

        this.refreshTableBodyRows = function (name, data, cfg) {

            this.setModal(name, data);

            var n = $("table[moscomp='mos_tab']");
            var o = undefined;

            for (var i = 0; i < n.length; i++) {
                if (n.eq(i).attr('mosdata') == this.modalName) {
                    o = n.eq(i);
                    break;
                }
            }

            if (o == undefined) return;

            var l_data = o.attr("mosdata");
            var l_modal = this.getModal(l_data);
            var l_html = "";

            if (o.children().eq(1)[0].tagName == "TBODY") {
                for (var i = 0; i < l_modal["items"].length; i++) {
                    var o_tr = o.children().eq(1).find('tr').last();
                    if (o_tr.children().length > 0) {
                        o.children().eq(1).append('<tr></tr>');
                        o_tr = o.children().eq(1).find('tr').last();
                    }
                    o_tr[0]["_moskey"] = l_modal["items"][i]["_moskey"];
                    o_tr[0]["_mosdata"] = l_modal["items"][i];
                    var idx = 0;
                    for (var col in l_modal["column"]) {

                        idx++;
                        if (idx == 1) {
                            if (cfg != undefined && cfg["fstColBtn"] == true)
                                l_html = '<td>' + l_modal["items"][i][col] + '&nbsp&nbsp<button moscomp="mosBtn" class="btn btn-primary btn-xs">' + cfg["fstColBtnTxt"] + '</button></td>';
                            else
                                l_html = '<td>' + l_modal["items"][i][col] + '</td>';
                        } else
                            l_html = '<td>' + l_modal["items"][i][col] + '</td>';
                        o_tr.append(l_html);

                        if (idx == 1) {
                            var o_btn = o_tr.find("button").eq(0);
                            var data = { key: o_tr[0]["_moskey"] };
                            o_btn.click(data, this.eventHandle);
                        }
                    }
                }
            }

            return;
        }

        this.init = function (name, data, cfg) {

            if (this._ui_object) {
                return;
            }

            this.setModal(name, data);

            var n = $("table[moscomp='mos_tab']");
            var o = undefined;

            for (var i = 0; i < n.length; i++) {
                if (n.eq(i).attr('mosdata') == this.modalName) {
                    o = n.eq(i);
                    break;
                }
            }

            if (o == undefined) return;

            var l_data = o.attr("mosdata");
            var l_modal = this.getModal(l_data);
            var l_html = "";

            this._ui_object = o;
            this._ui_object[0]["_moskey"] = this.uuid();
            this._moskey = this._ui_object[0]["_moskey"];

            if (o.children().length == 3) {
                if (o.children().eq(0)[0].tagName == "THEAD") {
                    var o_thead = o.children().eq(0);
                    var o_tr = o.children().eq(0).children().eq(0);
                    if (o_tr.children().length == 0) {

                        for (var col in l_modal["column"]) {
                            l_html = '<td>' + l_modal.column[col] + '</td>';
                            o_tr.append(l_html);
                        }
                    }
                }
                if (o.children().eq(1)[0].tagName == "TBODY") {
                    for (var i = 0; i < l_modal["items"].length; i++) {
                        var o_tr = o.children().eq(1).find('tr').last();
                        if (o_tr.children().length > 0) {
                            o.children().eq(1).append('<tr></tr>');
                            o_tr = o.children().eq(1).find('tr').last();
                        }
                        o_tr[0]["_moskey"] = l_modal["items"][i]["_moskey"];
                        o_tr[0]["_mosdata"] = l_modal["items"][i];
                        var idx = 0;
                        for (var col in l_modal["column"]) {

                            idx++;
                            if (idx == 1) {
                                if (cfg != undefined && cfg["fstColBtn"] == true)
                                    l_html = '<td>' + l_modal["items"][i][col] + '&nbsp&nbsp<button moscomp="mosBtn" class="btn btn-primary btn-xs">' + cfg["fstColBtnTxt"] + '</button></td>';
                                else
                                    l_html = '<td>' + l_modal["items"][i][col] + '</td>';
                            } else
                                l_html = '<td>' + l_modal["items"][i][col] + '</td>';
                            o_tr.append(l_html);

                            if (idx == 1) {
                                var o_btn = o_tr.find("button").eq(0);
                                var data = { key: o_tr[0]["_moskey"] };
                                o_btn.click(data, this.eventHandle);
                            }
                        }
                    }
                }
            }
            return;
        }
    };
    return { mosTable: mosTable };
});