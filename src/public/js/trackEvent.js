
export function globalTrackEvent(project,url='https://www.iaitrade.com/warning/warning.html#/index') {
  //////
  console.log('projiect:' + project)
  if (window.sensors) return;
  if (!project) return;
  (function (para) {
    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
    if (typeof (w['sensorsDataAnalytic201505']) !== 'undefined') {
      return false;
    }
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); } };
    var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister', 'getAppStatus'];
    for (var i = 0; i < ifs.length; i++) {
      w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
      x = d.createElement(s), y = d.getElementsByTagName(s)[0];
      x.async = 1;
      x.src = p;
      x.setAttribute('charset', 'UTF-8');
      y.parentNode.insertBefore(x, y);
      w[n].para = para;
    }
  })({
    // 单页埋点配置
    is_track_single_page: true,
    web_url:url,//埋点的url
    // web_url: "http://172.30.10.20:8080/warning.html#/index",
    sdk_url: 'static/js/sensorsdata.min.js',
    // h5打通app神测埋点
    use_app_track:true,
    //heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.9.1 及以上版本，这个参数必须配置，低于此版本不需要配置。
    heatmap_url: "static/js/heatmap.min.js",
    heatmap: {
      clickmap: 'default',
      scroll_notice_map: 'default',
      loadTimeout: 3000,
      element_selector: 'not_use_id',
      renderRefreshTime: 1000,
      scroll_delay_time: 4000,
    },
    name: 'sensors',
    // server_url: 'https://datapi.gwpm24k.com/sa?project=default',
    server_url: `https://datapi.gwpm24k.com/sa?project=${project}`
  });
  sensors.quick('autoTrack');
}
