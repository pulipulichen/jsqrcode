CONFIG = {
    "counter": {
        /**
         * QR Code的關鍵字
         * @type String
         */
        "keyword": 0,
        
        /**
         * 檢查的間隔
         * 單位：毫秒 (500毫秒=0.5秒)
         * @type Number
         */
        "check_interval": 300,
        
        /**
         * 預設是否啟動
         * @type Boolean
         */
        "default_enable": false,
        
        "zoom": {
            //width: 140,
            //height: 120,
            //x_offset: 240,
            //y_offset: 175
            width: 320,
            height: 240,
            x_offset: 0,
            y_offset: 0
        }
    },
    "template": {
        "header_title": "People Counter",
        "body_title": "People Counter",
        "realtime_report_url": "https://analytics.google.com/analytics/web/#realtime/rt-event/a37178375w162673487p163637193/",
        "daily_report_url": "https://analytics.google.com/analytics/web/#my-reports/bmRPe3mcSuSlb66paFMQ-A/a37178375w162673487p163637193/"
    },
    "google_analytics": {
        "track_id": "UA-37178375-9",
    }
};