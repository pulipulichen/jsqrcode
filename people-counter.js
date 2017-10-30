$(function () {
    init_google_analytics(function () {
        init_template();
        init_webqr();
    }); // setup_ga(function () {
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

var init_google_analytics = function (_callback) {
    // <!-- Global site tag (gtag.js) - Google Analytics -->
    // <script async src="https://www.googletagmanager.com/gtag/js?id=UA-37178375-9"></script>
    
    /*
    var _url  = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.google_analytics.track_id;
    $.getScript(_url, function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        ga('require', 'displayfeatures');
        gtag('config', CONFIG.google_analytics.track_id);
        
        _callback();
    });
    */
    $.getScript("https://www.google-analytics.com/analytics.js", function () {
        ga('create', CONFIG.google_analytics.track_id);
        ga('send', 'pageview');
        _callback();
    });
        
};

init_template = function () {
    $("#template_header_title").html(CONFIG.template.header_title);
    $("#template_body_title").html(CONFIG.template.body_title);
    
    $("#template_realtime_report_url").attr("href", CONFIG.template.realtime_report_url);
    $("#template_daily_report_url").attr("href", CONFIG.template.daily_report_url);

    if (CONFIG.counter.default_enable === true) {
        //$('#counter_enable').removeAttr("disabled");
        $('#counter_enable').attr("checked", "checked")
    }
};

init_webqr = function () {
    LAST_STATUS = true;
    load(function (_message) {
        var _timestamp = get_timestamp();
        //console.log(_timestamp + " " + _message);
        var _log_message = "empty";
        if (_message === false) {
            _log_message = "block";
        }
        push_to_log(_timestamp + " " + _log_message);

        // -------------------

        if (_message === false) {
            $('#counter_enable').attr('disabled', 'disabled');
            if ($('#counter_enable input:checkbox:checked').length === 0) {
                $("#counter_enable_message").addClass("visible");
            }
        } else {
            $('#counter_enable').removeAttr('disabled');
            $("#counter_enable_message").removeClass("visible");
        }

        // -------------------

        if ($('#counter_enable input:checkbox:checked').length > 0) {
            if (_message === false) {
                if (LAST_STATUS === true) {
                    ga("send", "event", "count", "add");
                    console.log("ga");
                    add_people_counter();
                }

                LAST_STATUS = false;
            } else {
                LAST_STATUS = true;
            }
        }
    }, CONFIG.counter.check_interval);
};

PEOPLE_COUNTER = 0;
var add_people_counter = function () {
    PEOPLE_COUNTER++;
    //PEOPLE_COUNTER = PEOPLE_COUNTER + 5000;
    //console.log(PEOPLE_COUNTER);
    $("#people_counter").html(PEOPLE_COUNTER);
}