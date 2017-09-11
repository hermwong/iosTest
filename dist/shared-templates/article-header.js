var Handlebars = require("handlebars/runtime");module.exports = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "  <script>\n    document.title = "
    + ((stack1 = ((helper = (helper = helpers.safeTitle || (depth0 != null ? depth0.safeTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"safeTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " + ' - Offline Wikipedia';\n    history.replaceState({}, document.title, '/wiki/' + "
    + ((stack1 = ((helper = (helper = helpers.safeUrlId || (depth0 != null ? depth0.safeUrlId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"safeUrlId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " + location.search);\n  </script>\n";
},"3":function(depth0,helpers,partials,data) {
    return " style=\"visibility: hidden\"";
},"5":function(depth0,helpers,partials,data) {
    return " checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"heading-text\">\n  <h1>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n  <div class=\"updated-meta\">- updated "
    + alias3(((helper = (helper = helpers.updated || (depth0 != null ? depth0.updated : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"updated","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.server : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n<label class=\"cache-toggle\""
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.cacheCapable : depth0),{"name":"unless","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <input type=\"checkbox\" name=\"cache\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.cached : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <span class=\"material-switch\">\n    <span class=\"track\"></span>\n    <span class=\"handle\"></span>\n  </span>\n  <span class=\"read-offline-txt\">Read offline</span>\n</label>";
},"useData":true});