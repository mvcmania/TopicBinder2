!function(){var n=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a.alert=n({1:function(n,a,l,e,t){var s;return'    <div class="alert alert-danger alert-dismissible">\r\n        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\r\n        '+n.escapeExpression((s=null!=(s=l.error||(null!=a?a.error:a))?s:l.helperMissing,"function"==typeof s?s.call(null!=a?a:n.nullContext||{},{name:"error",hash:{},data:t}):s))+"\r\n    </div>\r\n"},3:function(n,a,l,e,t){var s;return'    <div class="alert alert-info alert-dismissible">\r\n        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\r\n        '+n.escapeExpression((s=null!=(s=l.info||(null!=a?a.info:a))?s:l.helperMissing,"function"==typeof s?s.call(null!=a?a:n.nullContext||{},{name:"info",hash:{},data:t}):s))+"\r\n    </div>\r\n"},5:function(n,a,l,e,t){var s;return'    <div class="alert alert-success alert-dismissible">\r\n        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\r\n        '+n.escapeExpression((s=null!=(s=l.success||(null!=a?a.success:a))?s:l.helperMissing,"function"==typeof s?s.call(null!=a?a:n.nullContext||{},{name:"success",hash:{},data:t}):s))+"\r\n    </div>\r\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,r=null!=a?a:n.nullContext||{};return(null!=(s=l.if.call(r,null!=a?a.error:a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?s:"")+(null!=(s=l.if.call(r,null!=a?a.info:a,{name:"if",hash:{},fn:n.program(3,t,0),inverse:n.noop,data:t}))?s:"")+(null!=(s=l.if.call(r,null!=a?a.success:a,{name:"if",hash:{},fn:n.program(5,t,0),inverse:n.noop,data:t}))?s:"")},useData:!0}),a.assignsummary=n({1:function(n,a,l,e,t,s){var r,i,o=null!=a?a:n.nullContext||{},c=n.lambda,u=n.escapeExpression,d=l.helperMissing;return'            <tr aria-describedby="topic-row">\n                <td class="mailbox-name">'+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.topicid:r,{name:"each",hash:{},fn:n.program(2,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"</td>\n                <td>"+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.document:r,{name:"each",hash:{},fn:n.program(4,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"</td>\n                <td>"+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.searchEngine:r,{name:"each",hash:{},fn:n.program(6,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"</td>\n                <td>"+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.score:r,{name:"each",hash:{},fn:n.program(8,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"</td>\n                <td>"+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.index:r,{name:"each",hash:{},fn:n.program(10,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"</td>\n                <td>"+u(c(null!=(r=s[0][0])?r.assignedDate:r,a))+'</td>\n                <td aria-describedby="'+u(c(null!=(r=s[0][0])?r.isRelated:r,a))+'">\n'+(null!=(r=(l.eq||a&&a.eq||d).call(o,null!=(r=s[0][0])?r.isRelated:r,2,{name:"eq",hash:{},fn:n.program(12,t,0,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+(null!=(r=(l.eq||a&&a.eq||d).call(o,null!=(r=s[0][0])?r.isRelated:r,1,{name:"eq",hash:{},fn:n.program(14,t,0,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+(null!=(r=(l.eq||a&&a.eq||d).call(o,null!=(r=s[0][0])?r.isRelated:r,0,{name:"eq",hash:{},fn:n.program(16,t,0,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+'                </td>\n                <td>\n                    <button  type="button" role="modal" data-index="'+u((i=null!=(i=l.index||t&&t.index)?i:d,"function"==typeof i?i.call(o,{name:"index",hash:{},data:t,blockParams:s}):i))+'" data-target="#relate-modal" data-toggle="modal" data-documentid="'+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.document:r,{name:"each",hash:{},fn:n.program(4,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+'" data-assignmentid="'+u(c(null!=(r=s[0][0])?r._id:r,a))+'" data-topicid="'+(null!=(r=l.each.call(o,null!=(r=null!=(r=s[0][0])?r.topic:r)?r.topicid:r,{name:"each",hash:{},fn:n.program(2,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+'"  class="btn btn-xs btn-flat btn-success"><i class="fa fa-plus"></i>\n                   Action\n                    </button>\n                </td>\n            </tr>\n'},2:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},4:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},6:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},8:function(n,a,l,e,t,s){var r;return n.escapeExpression(n.lambda(null!=(r=s[0][0])?r.$numberDecimal:r,a))},10:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},12:function(n,a,l,e,t){return'                        <label class="badge bg-yellow">&nbsp;</label>                    \n'},14:function(n,a,l,e,t){return'                        <label class="badge bg-green">&nbsp;</label>                     \n'},16:function(n,a,l,e,t){return'                        <label class="badge bg-red">&nbsp;</label>                    \n'},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,s){var r;return'  <table id="summary-table" class="table table-bordered table-hover">\n    <thead>\n        <tr>\n            <th class="no-sort">TOPIC ID</th>\n            <th class="no-sort">DOCUMENT</th>\n            <th class="no-sort">SEARCH ENGINE</th>\n            <th class="no-sort">SCORE</th>\n            <th class="no-sort">INDEX</th>\n            <th class="no-sort">ASSIGNED DATE</th>\n            <th class="no-sort">IS RELATED</th>\n            <th></th>\n        </tr>\n    </thead>\n    <tbody>\n'+(null!=(r=l.each.call(null!=a?a:n.nullContext||{},null!=a?a.assignments:a,{name:"each",hash:{},fn:n.program(1,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"    </tbody>\n</table>"},useData:!0,useBlockParams:!0}),a.createpoolconfirm=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){return'<table class="table table-condensed">\r\n    <tr>\r\n        <td colspan="2">Are you sure!</td>\r\n    </tr>\r\n    <tr>\r\n        <td>\r\n            <button  data-dismiss="alert" class="btn btn-sm btn-danger cancel">Cancel</button>\r\n        </td>\r\n        <td>\r\n            <button type="submit" class="btn btn-sm btn-success">Ok</button>\r\n        </td>\r\n    </tr>\r\n</table>'},useData:!0}),a.error=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,r=n.lambda,i=n.escapeExpression;return' <div class="alert alert-danger alert-dismissible">\n<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n<h4><i class="icon fa fa-ban"></i> '+i(r(null!=(s=null!=a?a.message:a)?s.title:s,a))+"</h4>\n"+i(r(null!=(s=null!=a?a.message:a)?s.description:s,a))+"\n</div>"},useData:!0}),a.pagination=n({1:function(n,a,l,e,t){return"disabled"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,r,i=null!=a?a:n.nullContext||{},o=n.lambda,c=n.escapeExpression;return'<ul class="pagination pagination-sm inline">\r\n                            <li><button class="btn prev btn-sm" data-skip="0" title="First"><i class="fa fa-step-backward"></i></button></li>\r\n                            <li><button class="btn prev btn-sm" '+(null!=(s=l.if.call(i,null!=(s=null!=a?a.prev:a)?s.disabled:s,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?s:"")+' data-skip="'+c(o(null!=(s=null!=a?a.prev:a)?s.skip:s,a))+'">« Prev</button></li>\r\n                            <li><button class="btn next btn-sm" '+(null!=(s=l.if.call(i,null!=(s=null!=a?a.next:a)?s.disabled:s,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?s:"")+' data-skip="'+c(o(null!=(s=null!=a?a.next:a)?s.skip:s,a))+'">Next »</button></li>\r\n                            <li><button class="btn prev btn-sm" data-skip="'+c((r=null!=(r=l.last||(null!=a?a.last:a))?r:l.helperMissing,"function"==typeof r?r.call(i,{name:"last",hash:{},data:t}):r))+'" title="Last"><i class="fa fa-step-forward"></i></button></li>\r\n                            </ul>'},useData:!0}),a.success=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,r=n.lambda,i=n.escapeExpression;return'<div class="alert alert-success alert-dismissible">\n<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n<h4><i class="icon fa fa-check"></i> '+i(r(null!=(s=null!=a?a.message:a)?s.title:s,a))+"</h4>\n"+i(r(null!=(s=null!=a?a.message:a)?s.description:s,a))+"\n</div>"},useData:!0}),a.topicdetail=n({1:function(n,a,l,e,t){var s;return null!=(s=n.invokePartial(e.warning,a,{name:"warning",data:t,indent:"        ",helpers:l,partials:e,decorators:n.decorators}))?s:""},3:function(n,a,l,e,t){var s,r=n.lambda;return'    <div class="row">\n            <div class="col-md-6">\n                \x3c!-- /.form-group --\x3e\n                <div class="form-group">\n                    <label>DOC NO</label>\n                    <p>'+n.escapeExpression(r(null!=(s=null!=a?a.document:a)?s.DOCNO:s,a))+'</p>\n                </div>\n            </div>\n            \x3c!-- /.col --\x3e\n            \x3c!-- /.col --\x3e\n            <div class="col-md-12">\n                \x3c!-- /.form-group --\x3e\n                <div class="form-group">\n                    <label>TEXT</label>\n                    <p>\n                    '+(null!=(s=r(null!=(s=null!=a?a.document:a)?s.TEXT:s,a))?s:"")+"\n                    </p>\n                </div>\n                \x3c!-- /.form-group --\x3e\n            </div>\n            \x3c!-- /.col --\x3e\n    </div>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,r=n.lambda,i=n.escapeExpression,o=null!=a?a:n.nullContext||{};return'\x3c!-- /.mailbox-controls --\x3e\n<input type="hidden" name="assignment_id" value="'+i(r(null!=(s=null!=a?a.assign:a)?s._id:s,a))+'"/>\n<input type="hidden" name="is_related_temp" value="'+i(r(null!=(s=null!=a?a.assign:a)?s.is_related:s,a))+'"/>\n<div class="mailbox-read-message">\n'+(null!=(s=l.if.call(o,null!=a?a.message:a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?s:"")+'    <div class="row">\n        <div class="col-md-6">\n            <div class="form-group">\n                <label>TOPIC NUMBER</label>\n                <p>'+i(r(null!=(s=null!=a?a.topic:a)?s.topic_id:s,a))+'</p>\n            </div>\n            <div class="form-group">\n                <label>NARRATIVE</label>\n                <p>'+i(r(null!=(s=null!=a?a.topic:a)?s.narrative:s,a))+'</p>\n            </div>\n            \x3c!-- /.form-group --\x3e\n        </div>\n        \x3c!-- /.col --\x3e\n        <div class="col-md-6">\n             \x3c!-- /.form-group --\x3e\n            <div class="form-group">\n                <label>TITLE</label>\n                <p>'+i(r(null!=(s=null!=a?a.topic:a)?s.title:s,a))+'</p>\n            </div>\n            \x3c!-- /.form-group --\x3e\n            <div class="form-group">\n                <label>DESCRIPTION</label>\n                <p>'+i(r(null!=(s=null!=a?a.topic:a)?s.description:s,a))+"</p>\n            </div>\n            \x3c!-- /.form-group --\x3e\n        </div>\n    </div>\n"+(null!=(s=l.if.call(o,null!=(s=null!=a?a.document:a)?s.DOCNO:s,{name:"if",hash:{},fn:n.program(3,t,0),inverse:n.noop,data:t}))?s:"")+"    \x3c!-- /.row --\x3e\n</div>"},usePartial:!0,useData:!0}),a.topicsummary=n({1:function(n,a,l,e,t,s){var r,i=n.lambda,o=n.escapeExpression;return'            <tr >\n                <td class="disabled" data-order="'+o(i(null!=(r=s[0][0])?r.status:r,a))+'"><label class="badge '+o(i(null!=(r=s[0][0])?r.status:r,a))+'">&nbsp;</label></td>\n                <td class="mailbox-name">'+o(i(null!=(r=s[0][0])?r.topic:r,a))+'</td>\n                <td id="td-'+o(i(null!=(r=s[0][0])?r.topic:r,a))+'">'+o(i(null!=(r=s[0][0])?r.count:r,a))+'</td>\n                \n                    <td>\n                            <div class="btn-group">\n                                <button onclick="launchAssignModal(this)" type="button" role="assign"  data-remain="'+o(i(null!=(r=s[0][0])?r.remains:r,a))+'" data-topicid="'+o(i(null!=(r=s[0][0])?r.topic:r,a))+'"  class="btn btn-xs btn-flat btn-success"><i class="fa fa-plus"></i>\n                                        Assign\n                                </button>\n                            </div>\n                    </td>  \n                 \n            </tr>\n'},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,s){var r;return'  <table id="summary-table" class="table table-bordered table-hover">\n    <thead>\n        <tr>\n            <th style="width:10%">#Status</th>\n            <th>TOPIC ID</th>\n            <th>COUNT</th>\n            <th class="no-sort"></th>\n        </tr>\n    </thead>\n    <tbody>\n'+(null!=(r=l.each.call(null!=a?a:n.nullContext||{},null!=a?a.pools:a,{name:"each",hash:{},fn:n.program(1,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:"")+"    </tbody>\n</table>"},useData:!0,useBlockParams:!0}),a.usersummarywidgets=n({1:function(n,a,l,e,t,s){var r,i=n.lambda,o=n.escapeExpression;return'        <div class="col-lg-3 col-xs-6">\r\n            \x3c!-- small box --\x3e\r\n            <div class="small-box bg-aqua">\r\n                <div class="inner">\r\n                    <h3 id="total-topic-count">'+o(i(null!=(r=s[0][0])?r.count:r,a))+'</h3>\r\n                    <p>Topic Count in  Project</p>\r\n                </div>\r\n                <div class="icon">\r\n                    <i class="ion ion-clipboard"></i>\r\n                </div>\r\n                <a href="/" class="small-box-footer">More info <i class="fa fa-arrow-circle-right"></i></a>\r\n            </div>\r\n        </div>\r\n        \x3c!-- ./col --\x3e\r\n        <div class="col-lg-3 col-xs-6">\r\n            \x3c!-- small box --\x3e\r\n            <div class="small-box bg-green">\r\n                <div class="inner">\r\n                    <h3 id="total-related-topic-count">'+o(i(null!=(r=s[0][0])?r.relatedCount:r,a))+'</h3>\r\n                    <p>Related Topics</p>\r\n                </div>\r\n                <div class="icon">\r\n                    <i class="ion ion-ios-checkmark-outline"></i>\r\n                </div>\r\n                <a href="javascript:void(0)" data-relation="1"  class="small-box-footer btn-widget">More info <i class="fa fa-arrow-circle-right"></i></a>\r\n            </div>\r\n        </div>\r\n        \x3c!-- ./col --\x3e\r\n        <div class="col-lg-3 col-xs-6">\r\n            \x3c!-- small box --\x3e\r\n            <div class="small-box bg-yellow">\r\n                <div class="inner">\r\n                    <h3 id="total-not-started-topic-count">'+o(i(null!=(r=s[0][0])?r.notStartedCount:r,a))+'</h3>\r\n                    <p>Not Started Topics</p>\r\n                </div>\r\n                <div class="icon">\r\n                    <i class="ion ion-load-a"></i>\r\n                </div>\r\n                <a href="javascript:void(0)" data-relation="2"  class="small-box-footer btn-widget">More info <i class="fa fa-arrow-circle-right"></i></a>\r\n            </div>\r\n        </div>\r\n        \x3c!-- ./col --\x3e\r\n        <div class="col-lg-3 col-xs-6">\r\n            \x3c!-- small box --\x3e\r\n            <div class="small-box bg-red">\r\n                <div class="inner">\r\n                    <h3 id="total-not-related-topic-count">'+o(i(null!=(r=s[0][0])?r.notRelatedCount:r,a))+'</h3>\r\n                    <p>Not Related Topics</p>\r\n                </div>\r\n                <div class="icon">\r\n                    <i class="ion ion-alert"></i>\r\n                </div>\r\n                <a href="javascript:void(0)" data-relation="0" class="small-box-footer btn-widget">More info <i class="fa fa-arrow-circle-right"></i></a>\r\n            </div>\r\n        </div>\r\n'},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,s){var r;return null!=(r=l.each.call(null!=a?a:n.nullContext||{},null!=a?a.summary:a,{name:"each",hash:{},fn:n.program(1,t,1,s),inverse:n.noop,data:t,blockParams:s}))?r:""},useData:!0,useBlockParams:!0}),a.warning=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,r=n.lambda;return'<div class="alert alert-warning alert-dismissible">\n    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n    <h4><i class="icon fa fa-warning"></i> '+(null!=(s=r(null!=(s=null!=a?a.message:a)?s.title:s,a))?s:"")+"</h4>\n    "+n.escapeExpression(r(null!=(s=null!=a?a.message:a)?s.description:s,a))+"\n</div>  "},useData:!0})}();