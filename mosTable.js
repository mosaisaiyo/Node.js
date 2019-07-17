/** moTable version 0.18
 *  This component can be easily help you to render <table> element in Bootstrap Page
 */
function mosTable() {
    this.oData = {}
    this.uuid = function() {
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
        this.oData[n] = d;
        for(var i=0;i<this.oData[n]["items"].length;i++) {
            this.oData[n]["items"][i]["_moskey"]=uuid();
        }
    }

    this.getModal = function (n) {
        return this.oData[n];
    }

    this.refreshTableBody = function(n) {
        var ui_tables = $("table[moscomp='mos_tab']");

        for(var i=0;i<ui_tables.length;i++) {
            var ui_table = ui_tables.eq(i);
            if(ui_table.length==1 && ui_table[0]["_moskey"]==this._moskey) {
                var ui_body = ui_table.children().eq(1);
                ui_body.empty();
                ui_body.append('<tr></tr>');

                (function(o,m){
                    if (o.children().eq(1)[0].tagName == "TBODY") {
                        for(var i=0;i<m["items"].length;i++) {
                            var o_tr = o.children().eq(1).find('tr').last();
                            if(o_tr.children().length>0) {
                                o.children().eq(1).append('<tr></tr>');
                                o_tr = o.children().eq(1).find('tr').last();
                            }
                            o_tr[0]["_moskey"]=m["items"][i]["_moskey"];
                            o_tr[0]["_mosdata"]=m["items"][i];
                            for( var col in m["column"]) {
                                l_html = '<td>'+m["items"][i][col]+'</td>';
                                o_tr.append(l_html);
                            }
                        }
    
                    }
                })(ui_table,this.oData[n]);

            }
        }
    }
    this.init = function (o) {
        if(this._ui_object) {
            return;
        }
        var l_mosdata = o.attr("mosdata");
        var l_modal = this.getModal(l_mosdata);
        var l_html = "";
    
        this._ui_object = o;
        this._ui_object[0]["_moskey"]=uuid();
        this._moskey=this._ui_object[0]["_moskey"];

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
                for(var i=0;i<l_modal["items"].length;i++) {
                    var o_tr = o.children().eq(1).find('tr').last();
                    if(o_tr.children().length>0) {
                        o.children().eq(1).append('<tr></tr>');
                        o_tr = o.children().eq(1).find('tr').last();
                    }
                    o_tr[0]["_moskey"]=l_modal["items"][i]["_moskey"];
                    o_tr[0]["_mosdata"]=l_modal["items"][i];
                    for( var col in l_modal["column"]) {
                        l_html = '<td>'+l_modal["items"][i][col]+'</td>';
                        o_tr.append(l_html);
                    }
                }

            }

        }
        return;
    }
}

module.exports = mosTable;