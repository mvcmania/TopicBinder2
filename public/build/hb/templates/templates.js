!function(){var n=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a.assignsummary=n({1:function(n,a,l,e,t,s){var i,o,r=null!=a?a:n.nullContext||{},c=n.lambda,d=n.escapeExpression,u=l.helperMissing;return'            <tr aria-describedby="topic-row">\n                <td class="mailbox-name">'+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.topicid:i,{name:"each",hash:{},fn:n.program(2,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"</td>\n                <td>"+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.document:i,{name:"each",hash:{},fn:n.program(4,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"</td>\n                <td>"+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.searchEngine:i,{name:"each",hash:{},fn:n.program(6,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"</td>\n                <td>"+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.score:i,{name:"each",hash:{},fn:n.program(8,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"</td>\n                <td>"+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.index:i,{name:"each",hash:{},fn:n.program(10,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"</td>\n                <td>"+d(c(null!=(i=s[0][0])?i.assignedDate:i,a))+'</td>\n                <td aria-describedby="'+d(c(null!=(i=s[0][0])?i.isRelated:i,a))+'">\n'+(null!=(i=(l.if_eq||a&&a.if_eq||u).call(r,null!=(i=s[0][0])?i.isRelated:i,2,{name:"if_eq",hash:{},fn:n.program(12,t,0,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+(null!=(i=(l.if_eq||a&&a.if_eq||u).call(r,null!=(i=s[0][0])?i.isRelated:i,1,{name:"if_eq",hash:{},fn:n.program(14,t,0,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+(null!=(i=(l.if_eq||a&&a.if_eq||u).call(r,null!=(i=s[0][0])?i.isRelated:i,0,{name:"if_eq",hash:{},fn:n.program(16,t,0,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+'                </td>\n                <td>\n                    <button  type="button" role="modal" data-index="'+d((o=null!=(o=l.index||t&&t.index)?o:u,"function"==typeof o?o.call(r,{name:"index",hash:{},data:t,blockParams:s}):o))+'" data-target="#relate-modal" data-toggle="modal" data-documentid="'+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.document:i,{name:"each",hash:{},fn:n.program(4,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+'" data-assignmentid="'+d(c(null!=(i=s[0][0])?i._id:i,a))+'" data-topicid="'+(null!=(i=l.each.call(r,null!=(i=null!=(i=s[0][0])?i.topic:i)?i.topicid:i,{name:"each",hash:{},fn:n.program(2,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+'"  class="btn btn-xs btn-flat btn-success"><i class="fa fa-plus"></i>\n                   Action\n                    </button>\n                </td>\n            </tr>\n'},2:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},4:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},6:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},8:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},10:function(n,a,l,e,t,s){return n.escapeExpression(n.lambda(s[0][0],a))},12:function(n,a,l,e,t){return'                        <label class="badge bg-red">&nbsp;</label>                    \n'},14:function(n,a,l,e,t){return'                        <label class="badge bg-green">&nbsp;</label>                     \n'},16:function(n,a,l,e,t){return'                        <label class="badge bg-yellow">&nbsp;</label>                    \n'},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,s){var i;return'  <table id="summary-table" class="table table-bordered table-hover">\n    <thead>\n        <tr>\n            <th class="no-sort">TOPIC ID</th>\n            <th class="no-sort">DOCUMENT</th>\n            <th class="no-sort">SEARCH ENGINE</th>\n            <th class="no-sort">SCORE</th>\n            <th class="no-sort">INDEX</th>\n            <th class="no-sort">ASSIGNED DATE</th>\n            <th class="no-sort">IS RELATED</th>\n            <th></th>\n        </tr>\n    </thead>\n    <tbody>\n'+(null!=(i=l.each.call(null!=a?a:n.nullContext||{},null!=a?a.assignments:a,{name:"each",hash:{},fn:n.program(1,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"    </tbody>\n</table>"},useData:!0,useBlockParams:!0}),a.error=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,i=n.lambda,o=n.escapeExpression;return' <div class="alert alert-danger alert-dismissible">\n<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n<h4><i class="icon fa fa-ban"></i> '+o(i(null!=(s=null!=a?a.message:a)?s.title:s,a))+"</h4>\n"+o(i(null!=(s=null!=a?a.message:a)?s.description:s,a))+"\n</div>"},useData:!0}),a.success=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,i=n.lambda,o=n.escapeExpression;return'<div class="alert alert-success alert-dismissible">\n<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n<h4><i class="icon fa fa-check"></i> '+o(i(null!=(s=null!=a?a.message:a)?s.title:s,a))+"</h4>\n"+o(i(null!=(s=null!=a?a.message:a)?s.description:s,a))+"\n</div>"},useData:!0}),a.topicdetail=n({1:function(n,a,l,e,t,s){return"<p>"+n.escapeExpression(n.lambda(s[0][0],a))+"</p>"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,s){var i,o=n.lambda,r=n.escapeExpression;return'\x3c!-- /.mailbox-controls --\x3e\n<input type="hidden" name="assignment_id" value="'+r(o(null!=(i=null!=a?a.assign:a)?i._id:i,a))+'"/>\n<input type="hidden" name="is_related_temp" value="'+r(o(null!=(i=null!=a?a.assign:a)?i.is_related:i,a))+'"/>\n<div class="mailbox-read-message">\n    <div class="row">\n        <div class="col-md-6">\n            <div class="form-group">\n                <label>TOPIC NUMBER</label>\n                <p>'+r(o(null!=(i=null!=a?a.topic:a)?i.topic_id:i,a))+'</p>\n            </div>\n            <div class="form-group">\n                <label>NARRATIVE</label>\n                <p>'+r(o(null!=(i=null!=a?a.topic:a)?i.narrative:i,a))+'</p>\n            </div>\n            \x3c!-- /.form-group --\x3e\n        </div>\n        \x3c!-- /.col --\x3e\n        <div class="col-md-6">\n             \x3c!-- /.form-group --\x3e\n            <div class="form-group">\n                <label>TITLE</label>\n                <p>'+r(o(null!=(i=null!=a?a.topic:a)?i.title:i,a))+'</p>\n            </div>\n            \x3c!-- /.form-group --\x3e\n            <div class="form-group">\n                <label>DESCRIPTION</label>\n                <p>'+r(o(null!=(i=null!=a?a.topic:a)?i.description:i,a))+'</p>\n            </div>\n            \x3c!-- /.form-group --\x3e\n        </div>\n    </div>\n    <div class="row">\n            <div class="col-md-6">\n                \x3c!-- /.form-group --\x3e\n                <div class="form-group">\n                    <label>DOC NO</label>\n                    <p>'+r(o(null!=(i=null!=a?a.document:a)?i.DOCNO:i,a))+'</p>\n                </div>\n            </div>\n            \x3c!-- /.col --\x3e\n            \x3c!-- /.col --\x3e\n            <div class="col-md-12">\n                \x3c!-- /.form-group --\x3e\n                <div class="form-group">\n                    <label>TEXT</label>\n                    '+(null!=(i=l.each.call(null!=a?a:n.nullContext||{},null!=(i=null!=a?a.document:a)?i.TEXT:i,{name:"each",hash:{},fn:n.program(1,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"\n                </div>\n                \x3c!-- /.form-group --\x3e\n            </div>\n            \x3c!-- /.col --\x3e\n    </div>\n    \x3c!-- /.row --\x3e\n</div>"},useData:!0,useBlockParams:!0}),a.topicsummary=n({1:function(n,a,l,e,t,s){var i,o=n.lambda,r=n.escapeExpression;return'            <tr >\n                <td class="disabled" data-order="'+r(o(null!=(i=s[0][0])?i.status:i,a))+'"><label class="badge '+r(o(null!=(i=s[0][0])?i.status:i,a))+'">&nbsp;</label></td>\n                <td class="mailbox-name">'+r(o(null!=(i=s[0][0])?i.topic_id:i,a))+'</td>\n                <td id="td-'+r(o(null!=(i=s[0][0])?i._id:i,a))+'">'+r(o(null!=(i=s[0][0])?i.count:i,a))+'</td>\n                <td>\n                  <div class="btn-group">\n                   <button onclick="launchAssignModal(this)" type="button" role="assign"  data-remain="'+r(o(null!=(i=s[0][0])?i.remains:i,a))+'" data-topicid="'+r(o(null!=(i=s[0][0])?i.topic_id:i,a))+'"  class="btn btn-xs btn-flat btn-success"><i class="fa fa-plus"></i>\n                   Assign\n                    </button>\n                  </div>\n                 \x3c!-- <div class="btn-group">\n                      <button onclick="launchDetailModal(this)" data-topicid="'+r(o(null!=(i=s[0][0])?i.topic_id:i,a))+'"  class="btn btn-xs btn-flat btn-info"><i class="fa fa-list-alt"></i> Detail</button>\n                      </div>--\x3e\n                </td>\n            </tr>\n'},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,s){var i;return'  <table id="summary-table" class="table table-bordered table-hover">\n    <thead>\n        <tr>\n            <th style="width:10%">#Status</th>\n            <th>TOPIC ID</th>\n            <th>COUNT</th>\n            <th class="no-sort"></th>\n        </tr>\n    </thead>\n    <tbody>\n'+(null!=(i=l.each.call(null!=a?a:n.nullContext||{},null!=a?a.pools:a,{name:"each",hash:{},fn:n.program(1,t,1,s),inverse:n.noop,data:t,blockParams:s}))?i:"")+"    </tbody>\n</table>"},useData:!0,useBlockParams:!0}),a.warning=n({compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var s,i=n.lambda,o=n.escapeExpression;return'<div class="alert alert-warning alert-dismissible">\n    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n    <h4><i class="icon fa fa-warning"></i> '+o(i(null!=(s=null!=a?a.message:a)?s.title:s,a))+"</h4>\n    "+o(i(null!=(s=null!=a?a.message:a)?s.description:s,a))+"\n</div>"},useData:!0})}();