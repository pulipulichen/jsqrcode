$(function () {
    load(function (_message) {
        var _timestamp = get_timestamp();
        //console.log(_timestamp + " " + _message);
        push_to_log(_timestamp + " " + _message);
        
        // -------------------
        
        if (_message === false) {
            $('#counter_enable').attr('disabled', 'disabled');
        }
        else {
            $('#counter_enable').removeAttr('disabled');
        }
        
        // -------------------
        
    });
});

var get_timestamp = function () {
    var d = new Date;
    var dformat = [d.getMonth()+1,
               d.getDate()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
    return dformat;
};

var max_log_display = 10;
var logs = [];
var push_to_log = function (_log) {
    logs.push(_log);
    
    if (logs.length > max_log_display) {
        logs.shift();
    }
    
    var _show_log = JSON.parse(JSON.stringify(logs));
    _show_log.reverse();
    $("#log").html(_show_log.join("\n"));
};