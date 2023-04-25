/*
 * jQuery File Upload Plugin
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","jquery-ui/ui/widget"],e):"object"==typeof exports?e(require("jquery"),require("./vendor/jquery.ui.widget")):e(window.jQuery)}(function(e){"use strict";function t(t){var i="dragover"===t;return function(n){n.dataTransfer=n.originalEvent&&n.originalEvent.dataTransfer;var r=n.dataTransfer;r&&-1!==e.inArray("Files",r.types)&&!1!==this._trigger(t,e.Event(t,{delegatedEvent:n}))&&(n.preventDefault(),i&&(r.dropEffect="copy"))}}e.support.fileInput=!(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent)||e('<input type="file"/>').prop("disabled")),e.support.xhrFileUpload=!(!window.ProgressEvent||!window.FileReader),e.support.xhrFormDataFileUpload=!!window.FormData,e.support.blobSlice=window.Blob&&(Blob.prototype.slice||Blob.prototype.webkitSlice||Blob.prototype.mozSlice),e.widget("blueimp.fileupload",{options:{dropZone:e(document),pasteZone:void 0,fileInput:void 0,replaceFileInput:!0,paramName:void 0,singleFileUploads:!0,limitMultiFileUploads:void 0,limitMultiFileUploadSize:void 0,limitMultiFileUploadSizeOverhead:512,sequentialUploads:!1,limitConcurrentUploads:void 0,forceIframeTransport:!1,redirect:void 0,redirectParamName:void 0,postMessage:void 0,multipart:!0,maxChunkSize:void 0,uploadedBytes:void 0,recalculateProgress:!0,progressInterval:100,bitrateInterval:500,autoUpload:!0,uniqueFilenames:void 0,messages:{uploadedBytes:"Uploaded bytes exceed file size"},i18n:function(t,i){return t=this.messages[t]||t.toString(),i&&e.each(i,function(e,i){t=t.replace("{"+e+"}",i)}),t},formData:function(e){return e.serializeArray()},add:function(t,i){if(t.isDefaultPrevented())return!1;(i.autoUpload||!1!==i.autoUpload&&e(this).fileupload("option","autoUpload"))&&i.process().done(function(){i.submit()})},processData:!1,contentType:!1,cache:!1,timeout:0},_specialOptions:["fileInput","dropZone","pasteZone","multipart","forceIframeTransport"],_blobSlice:e.support.blobSlice&&function(){return(this.slice||this.webkitSlice||this.mozSlice).apply(this,arguments)},_BitrateTimer:function(){this.timestamp=Date.now?Date.now():(new Date).getTime(),this.loaded=0,this.bitrate=0,this.getBitrate=function(e,t,i){var n=e-this.timestamp;return(!this.bitrate||!i||n>i)&&(this.bitrate=(t-this.loaded)*(1e3/n)*8,this.loaded=t,this.timestamp=e),this.bitrate}},_isXHRUpload:function(t){return!t.forceIframeTransport&&(!t.multipart&&e.support.xhrFileUpload||e.support.xhrFormDataFileUpload)},_getFormData:function(t){var i;return"function"===e.type(t.formData)?t.formData(t.form):e.isArray(t.formData)?t.formData:"object"===e.type(t.formData)?(i=[],e.each(t.formData,function(e,t){i.push({name:e,value:t})}),i):[]},_getTotal:function(t){var i=0;return e.each(t,function(e,t){i+=t.size||1}),i},_initProgressObject:function(t){var i={loaded:0,total:0,bitrate:0};t._progress?e.extend(t._progress,i):t._progress=i},_initResponseObject:function(e){var t;if(e._response)for(t in e._response)e._response.hasOwnProperty(t)&&delete e._response[t];else e._response={}},_onProgress:function(t,i){if(t.lengthComputable){var n,r=Date.now?Date.now():(new Date).getTime();if(i._time&&i.progressInterval&&r-i._time<i.progressInterval&&t.loaded!==t.total)return;i._time=r,n=Math.floor(t.loaded/t.total*(i.chunkSize||i._progress.total))+(i.uploadedBytes||0),this._progress.loaded+=n-i._progress.loaded,this._progress.bitrate=this._bitrateTimer.getBitrate(r,this._progress.loaded,i.bitrateInterval),i._progress.loaded=i.loaded=n,i._progress.bitrate=i.bitrate=i._bitrateTimer.getBitrate(r,n,i.bitrateInterval),this._trigger("progress",e.Event("progress",{delegatedEvent:t}),i),this._trigger("progressall",e.Event("progressall",{delegatedEvent:t}),this._progress)}},_initProgressListener:function(t){var i=this,n=t.xhr?t.xhr():e.ajaxSettings.xhr();n.upload&&(e(n.upload).bind("progress",function(e){var n=e.originalEvent;e.lengthComputable=n.lengthComputable,e.loaded=n.loaded,e.total=n.total,i._onProgress(e,t)}),t.xhr=function(){return n})},_deinitProgressListener:function(t){var i=t.xhr?t.xhr():e.ajaxSettings.xhr();i.upload&&e(i.upload).unbind("progress")},_isInstanceOf:function(e,t){return Object.prototype.toString.call(t)==="[object "+e+"]"},_getUniqueFilename:function(e,t){return t[e=String(e)]?(e=e.replace(/(?: \(([\d]+)\))?(\.[^.]+)?$/,function(e,t,i){return" ("+(t?Number(t)+1:1)+")"+(i||"")}),this._getUniqueFilename(e,t)):(t[e]=!0,e)},_initXHRData:function(t){var i,n=this,r=t.files[0],o=t.multipart||!e.support.xhrFileUpload,s="array"===e.type(t.paramName)?t.paramName[0]:t.paramName;t.headers=e.extend({},t.headers),t.contentRange&&(t.headers["Content-Range"]=t.contentRange),o&&!t.blob&&this._isInstanceOf("File",r)||(t.headers["Content-Disposition"]='attachment; filename="'+encodeURI(r.uploadName||r.name)+'"'),o?e.support.xhrFormDataFileUpload&&(t.postMessage?(i=this._getFormData(t),t.blob?i.push({name:s,value:t.blob}):e.each(t.files,function(n,r){i.push({name:"array"===e.type(t.paramName)&&t.paramName[n]||s,value:r})})):(n._isInstanceOf("FormData",t.formData)?i=t.formData:(i=new FormData,e.each(this._getFormData(t),function(e,t){i.append(t.name,t.value)})),t.blob?i.append(s,t.blob,r.uploadName||r.name):e.each(t.files,function(r,o){if(n._isInstanceOf("File",o)||n._isInstanceOf("Blob",o)){var a=o.uploadName||o.name;t.uniqueFilenames&&(a=n._getUniqueFilename(a,t.uniqueFilenames)),i.append("array"===e.type(t.paramName)&&t.paramName[r]||s,o,a)}})),t.data=i):(t.contentType=r.type||"application/octet-stream",t.data=t.blob||r),t.blob=null},_initIframeSettings:function(t){var i=e("<a></a>").prop("href",t.url).prop("host");t.dataType="iframe "+(t.dataType||""),t.formData=this._getFormData(t),t.redirect&&i&&i!==location.host&&t.formData.push({name:t.redirectParamName||"redirect",value:t.redirect})},_initDataSettings:function(e){this._isXHRUpload(e)?(this._chunkedUpload(e,!0)||(e.data||this._initXHRData(e),this._initProgressListener(e)),e.postMessage&&(e.dataType="postmessage "+(e.dataType||""))):this._initIframeSettings(e)},_getParamName:function(t){var i=e(t.fileInput),n=t.paramName;return n?e.isArray(n)||(n=[n]):(n=[],i.each(function(){for(var t=e(this),i=t.prop("name")||"files[]",r=(t.prop("files")||[1]).length;r;)n.push(i),r-=1}),n.length||(n=[i.prop("name")||"files[]"])),n},_initFormSettings:function(t){t.form&&t.form.length||(t.form=e(t.fileInput.prop("form")),t.form.length||(t.form=e(this.options.fileInput.prop("form")))),t.paramName=this._getParamName(t),t.url||(t.url=t.form.prop("action")||location.href),t.type=(t.type||"string"===e.type(t.form.prop("method"))&&t.form.prop("method")||"").toUpperCase(),"POST"!==t.type&&"PUT"!==t.type&&"PATCH"!==t.type&&(t.type="POST"),t.formAcceptCharset||(t.formAcceptCharset=t.form.attr("accept-charset"))},_getAJAXSettings:function(t){var i=e.extend({},this.options,t);return this._initFormSettings(i),this._initDataSettings(i),i},_getDeferredState:function(e){return e.state?e.state():e.isResolved()?"resolved":e.isRejected()?"rejected":"pending"},_enhancePromise:function(e){return e.success=e.done,e.error=e.fail,e.complete=e.always,e},_getXHRPromise:function(t,i,n){var r=e.Deferred(),o=r.promise();return i=i||this.options.context||o,!0===t?r.resolveWith(i,n):!1===t&&r.rejectWith(i,n),o.abort=r.promise,this._enhancePromise(o)},_addConvenienceMethods:function(t,i){var n=this,r=function(t){return e.Deferred().resolveWith(n,t).promise()};i.process=function(t,o){return(t||o)&&(i._processQueue=this._processQueue=(this._processQueue||r([this])).then(function(){return i.errorThrown?e.Deferred().rejectWith(n,[i]).promise():r(arguments)}).then(t,o)),this._processQueue||r([this])},i.submit=function(){return"pending"!==this.state()&&(i.jqXHR=this.jqXHR=!1!==n._trigger("submit",e.Event("submit",{delegatedEvent:t}),this)&&n._onSend(t,this)),this.jqXHR||n._getXHRPromise()},i.abort=function(){return this.jqXHR?this.jqXHR.abort():(this.errorThrown="abort",n._trigger("fail",null,this),n._getXHRPromise(!1))},i.state=function(){return this.jqXHR?n._getDeferredState(this.jqXHR):this._processQueue?n._getDeferredState(this._processQueue):void 0},i.processing=function(){return!this.jqXHR&&this._processQueue&&"pending"===n._getDeferredState(this._processQueue)},i.progress=function(){return this._progress},i.response=function(){return this._response}},_getUploadedBytes:function(e){var t=e.getResponseHeader("Range"),i=t&&t.split("-"),n=i&&i.length>1&&parseInt(i[1],10);return n&&n+1},_chunkedUpload:function(t,i){t.uploadedBytes=t.uploadedBytes||0;var n,r,o=this,s=t.files[0],a=s.size,l=t.uploadedBytes,p=t.maxChunkSize||a,u=this._blobSlice,d=e.Deferred(),h=d.promise();return!(!(this._isXHRUpload(t)&&u&&(l||("function"===e.type(p)?p(t):p)<a))||t.data)&&(!!i||(l>=a?(s.error=t.i18n("uploadedBytes"),this._getXHRPromise(!1,t.context,[null,"error",s.error])):(r=function(){var i=e.extend({},t),h=i._progress.loaded;i.blob=u.call(s,l,l+("function"===e.type(p)?p(i):p),s.type),i.chunkSize=i.blob.size,i.contentRange="bytes "+l+"-"+(l+i.chunkSize-1)+"/"+a,o._trigger("chunkbeforesend",null,i),o._initXHRData(i),o._initProgressListener(i),n=(!1!==o._trigger("chunksend",null,i)&&e.ajax(i)||o._getXHRPromise(!1,i.context)).done(function(n,s,p){l=o._getUploadedBytes(p)||l+i.chunkSize,h+i.chunkSize-i._progress.loaded&&o._onProgress(e.Event("progress",{lengthComputable:!0,loaded:l-i.uploadedBytes,total:l-i.uploadedBytes}),i),t.uploadedBytes=i.uploadedBytes=l,i.result=n,i.textStatus=s,i.jqXHR=p,o._trigger("chunkdone",null,i),o._trigger("chunkalways",null,i),l<a?r():d.resolveWith(i.context,[n,s,p])}).fail(function(e,t,n){i.jqXHR=e,i.textStatus=t,i.errorThrown=n,o._trigger("chunkfail",null,i),o._trigger("chunkalways",null,i),d.rejectWith(i.context,[e,t,n])}).always(function(){o._deinitProgressListener(i)})},this._enhancePromise(h),h.abort=function(){return n.abort()},r(),h)))},_beforeSend:function(e,t){0===this._active&&(this._trigger("start"),this._bitrateTimer=new this._BitrateTimer,this._progress.loaded=this._progress.total=0,this._progress.bitrate=0),this._initResponseObject(t),this._initProgressObject(t),t._progress.loaded=t.loaded=t.uploadedBytes||0,t._progress.total=t.total=this._getTotal(t.files)||1,t._progress.bitrate=t.bitrate=0,this._active+=1,this._progress.loaded+=t.loaded,this._progress.total+=t.total},_onDone:function(t,i,n,r){var o=r._progress.total,s=r._response;r._progress.loaded<o&&this._onProgress(e.Event("progress",{lengthComputable:!0,loaded:o,total:o}),r),s.result=r.result=t,s.textStatus=r.textStatus=i,s.jqXHR=r.jqXHR=n,this._trigger("done",null,r)},_onFail:function(e,t,i,n){var r=n._response;n.recalculateProgress&&(this._progress.loaded-=n._progress.loaded,this._progress.total-=n._progress.total),r.jqXHR=n.jqXHR=e,r.textStatus=n.textStatus=t,r.errorThrown=n.errorThrown=i,this._trigger("fail",null,n)},_onAlways:function(e,t,i,n){this._trigger("always",null,n)},_onSend:function(t,i){i.submit||this._addConvenienceMethods(t,i);var n,r,o,s,a=this,l=a._getAJAXSettings(i),p=function(){return a._sending+=1,l._bitrateTimer=new a._BitrateTimer,n=n||((r||!1===a._trigger("send",e.Event("send",{delegatedEvent:t}),l))&&a._getXHRPromise(!1,l.context,r)||a._chunkedUpload(l)||e.ajax(l)).done(function(e,t,i){a._onDone(e,t,i,l)}).fail(function(e,t,i){a._onFail(e,t,i,l)}).always(function(e,t,i){if(a._deinitProgressListener(l),a._onAlways(e,t,i,l),a._sending-=1,a._active-=1,l.limitConcurrentUploads&&l.limitConcurrentUploads>a._sending)for(var n=a._slots.shift();n;){if("pending"===a._getDeferredState(n)){n.resolve();break}n=a._slots.shift()}0===a._active&&a._trigger("stop")})};return this._beforeSend(t,l),this.options.sequentialUploads||this.options.limitConcurrentUploads&&this.options.limitConcurrentUploads<=this._sending?(this.options.limitConcurrentUploads>1?(o=e.Deferred(),this._slots.push(o),s=o.then(p)):(this._sequence=this._sequence.then(p,p),s=this._sequence),s.abort=function(){return r=[void 0,"abort","abort"],n?n.abort():(o&&o.rejectWith(l.context,r),p())},this._enhancePromise(s)):p()},_onAdd:function(t,i){var n,r,o,s,a=this,l=!0,p=e.extend({},this.options,i),u=i.files,d=u.length,h=p.limitMultiFileUploads,c=p.limitMultiFileUploadSize,f=p.limitMultiFileUploadSizeOverhead,g=0,_=this._getParamName(p),m=0;if(!d)return!1;if(c&&void 0===u[0].size&&(c=void 0),(p.singleFileUploads||h||c)&&this._isXHRUpload(p))if(p.singleFileUploads||c||!h)if(!p.singleFileUploads&&c)for(o=[],n=[],s=0;s<d;s+=1)g+=u[s].size+f,(s+1===d||g+u[s+1].size+f>c||h&&s+1-m>=h)&&(o.push(u.slice(m,s+1)),(r=_.slice(m,s+1)).length||(r=_),n.push(r),m=s+1,g=0);else n=_;else for(o=[],n=[],s=0;s<d;s+=h)o.push(u.slice(s,s+h)),(r=_.slice(s,s+h)).length||(r=_),n.push(r);else o=[u],n=[_];return i.originalFiles=u,e.each(o||u,function(r,s){var p=e.extend({},i);return p.files=o?s:[s],p.paramName=n[r],a._initResponseObject(p),a._initProgressObject(p),a._addConvenienceMethods(t,p),l=a._trigger("add",e.Event("add",{delegatedEvent:t}),p)}),l},_replaceFileInput:function(t){var i=t.fileInput,n=i.clone(!0),r=i.is(document.activeElement);t.fileInputClone=n,e("<form></form>").append(n)[0].reset(),i.after(n).detach(),r&&n.focus(),e.cleanData(i.unbind("remove")),this.options.fileInput=this.options.fileInput.map(function(e,t){return t===i[0]?n[0]:t}),i[0]===this.element[0]&&(this.element=n)},_handleFileTreeEntry:function(t,i){var n,r=this,o=e.Deferred(),s=[],a=function(e){e&&!e.entry&&(e.entry=t),o.resolve([e])},l=function(){n.readEntries(function(e){e.length?(s=s.concat(e),l()):function(e){r._handleFileTreeEntries(e,i+t.name+"/").done(function(e){o.resolve(e)}).fail(a)}(s)},a)};return i=i||"",t.isFile?t._file?(t._file.relativePath=i,o.resolve(t._file)):t.file(function(e){e.relativePath=i,o.resolve(e)},a):t.isDirectory?(n=t.createReader(),l()):o.resolve([]),o.promise()},_handleFileTreeEntries:function(t,i){var n=this;return e.when.apply(e,e.map(t,function(e){return n._handleFileTreeEntry(e,i)})).then(function(){return Array.prototype.concat.apply([],arguments)})},_getDroppedFiles:function(t){var i=(t=t||{}).items;return i&&i.length&&(i[0].webkitGetAsEntry||i[0].getAsEntry)?this._handleFileTreeEntries(e.map(i,function(e){var t;return e.webkitGetAsEntry?((t=e.webkitGetAsEntry())&&(t._file=e.getAsFile()),t):e.getAsEntry()})):e.Deferred().resolve(e.makeArray(t.files)).promise()},_getSingleFileInputFiles:function(t){var i,n,r=(t=e(t)).prop("webkitEntries")||t.prop("entries");if(r&&r.length)return this._handleFileTreeEntries(r);if((i=e.makeArray(t.prop("files"))).length)void 0===i[0].name&&i[0].fileName&&e.each(i,function(e,t){t.name=t.fileName,t.size=t.fileSize});else{if(!(n=t.prop("value")))return e.Deferred().resolve([]).promise();i=[{name:n.replace(/^.*\\/,"")}]}return e.Deferred().resolve(i).promise()},_getFileInputFiles:function(t){return t instanceof e&&1!==t.length?e.when.apply(e,e.map(t,this._getSingleFileInputFiles)).then(function(){return Array.prototype.concat.apply([],arguments)}):this._getSingleFileInputFiles(t)},_onChange:function(t){var i=this,n={fileInput:e(t.target),form:e(t.target.form)};this._getFileInputFiles(n.fileInput).always(function(r){n.files=r,i.options.replaceFileInput&&i._replaceFileInput(n),!1!==i._trigger("change",e.Event("change",{delegatedEvent:t}),n)&&i._onAdd(t,n)})},_onPaste:function(t){var i=t.originalEvent&&t.originalEvent.clipboardData&&t.originalEvent.clipboardData.items,n={files:[]};i&&i.length&&(e.each(i,function(e,t){var i=t.getAsFile&&t.getAsFile();i&&n.files.push(i)}),!1!==this._trigger("paste",e.Event("paste",{delegatedEvent:t}),n)&&this._onAdd(t,n))},_onDrop:function(t){t.dataTransfer=t.originalEvent&&t.originalEvent.dataTransfer;var i=this,n=t.dataTransfer,r={};n&&n.files&&n.files.length&&(t.preventDefault(),this._getDroppedFiles(n).always(function(n){r.files=n,!1!==i._trigger("drop",e.Event("drop",{delegatedEvent:t}),r)&&i._onAdd(t,r)}))},_onDragOver:t("dragover"),_onDragEnter:t("dragenter"),_onDragLeave:t("dragleave"),_initEventHandlers:function(){this._isXHRUpload(this.options)&&(this._on(this.options.dropZone,{dragover:this._onDragOver,drop:this._onDrop,dragenter:this._onDragEnter,dragleave:this._onDragLeave}),this._on(this.options.pasteZone,{paste:this._onPaste})),e.support.fileInput&&this._on(this.options.fileInput,{change:this._onChange})},_destroyEventHandlers:function(){this._off(this.options.dropZone,"dragenter dragleave dragover drop"),this._off(this.options.pasteZone,"paste"),this._off(this.options.fileInput,"change")},_destroy:function(){this._destroyEventHandlers()},_setOption:function(t,i){var n=-1!==e.inArray(t,this._specialOptions);n&&this._destroyEventHandlers(),this._super(t,i),n&&(this._initSpecialOptions(),this._initEventHandlers())},_initSpecialOptions:function(){var t=this.options;void 0===t.fileInput?t.fileInput=this.element.is('input[type="file"]')?this.element:this.element.find('input[type="file"]'):t.fileInput instanceof e||(t.fileInput=e(t.fileInput)),t.dropZone instanceof e||(t.dropZone=e(t.dropZone)),t.pasteZone instanceof e||(t.pasteZone=e(t.pasteZone))},_getRegExp:function(e){var t=e.split("/"),i=t.pop();return t.shift(),new RegExp(t.join("/"),i)},_isRegExpOption:function(t,i){return"url"!==t&&"string"===e.type(i)&&/^\/.*\/[igm]{0,3}$/.test(i)},_initDataAttributes:function(){var t=this,i=this.options,n=this.element.data();e.each(this.element[0].attributes,function(e,r){var o,s=r.name.toLowerCase();/^data-/.test(s)&&(s=s.slice(5).replace(/-[a-z]/g,function(e){return e.charAt(1).toUpperCase()}),o=n[s],t._isRegExpOption(s,o)&&(o=t._getRegExp(o)),i[s]=o)})},_create:function(){this._initDataAttributes(),this._initSpecialOptions(),this._slots=[],this._sequence=this._getXHRPromise(!0),this._sending=this._active=0,this._initProgressObject(this),this._initEventHandlers()},active:function(){return this._active},progress:function(){return this._progress},add:function(t){var i=this;t&&!this.options.disabled&&(t.fileInput&&!t.files?this._getFileInputFiles(t.fileInput).always(function(e){t.files=e,i._onAdd(null,t)}):(t.files=e.makeArray(t.files),this._onAdd(null,t)))},send:function(t){if(t&&!this.options.disabled){if(t.fileInput&&!t.files){var i,n,r=this,o=e.Deferred(),s=o.promise();return s.abort=function(){return n=!0,i?i.abort():(o.reject(null,"abort","abort"),s)},this._getFileInputFiles(t.fileInput).always(function(e){n||(e.length?(t.files=e,(i=r._onSend(null,t)).then(function(e,t,i){o.resolve(e,t,i)},function(e,t,i){o.reject(e,t,i)})):o.reject())}),this._enhancePromise(s)}if(t.files=e.makeArray(t.files),t.files.length)return this._onSend(null,t)}return this._getXHRPromise(!1,t&&t.context)}})});

/*
 * jQuery File Upload Processing Plugin
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global define, require, window */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./jquery.fileupload"],e):"object"==typeof exports?e(require("jquery"),require("./jquery.fileupload")):e(window.jQuery)}(function(e){"use strict";var r=e.blueimp.fileupload.prototype.options.add;e.widget("blueimp.fileupload",e.blueimp.fileupload,{options:{processQueue:[],add:function(s,i){var o=e(this);i.process(function(){return o.fileupload("process",i)}),r.call(this,s,i)}},processActions:{},_processFile:function(r,s){var i=this,o=e.Deferred().resolveWith(i,[r]).promise();return this._trigger("process",null,r),e.each(r.processQueue,function(r,t){var n=function(r){return s.errorThrown?e.Deferred().rejectWith(i,[s]).promise():i.processActions[t.action].call(i,r,t)};o=o.then(n,t.always&&n)}),o.done(function(){i._trigger("processdone",null,r),i._trigger("processalways",null,r)}).fail(function(){i._trigger("processfail",null,r),i._trigger("processalways",null,r)}),o},_transformProcessQueue:function(r){var s=[];e.each(r.processQueue,function(){var i={},o=this.action,t=!0===this.prefix?o:this.prefix;e.each(this,function(s,o){"string"===e.type(o)&&"@"===o.charAt(0)?i[s]=r[o.slice(1)||(t?t+s.charAt(0).toUpperCase()+s.slice(1):s)]:i[s]=o}),s.push(i)}),r.processQueue=s},processing:function(){return this._processing},process:function(r){var s=this,i=e.extend({},this.options,r);return i.processQueue&&i.processQueue.length&&(this._transformProcessQueue(i),0===this._processing&&this._trigger("processstart"),e.each(r.files,function(o){var t=o?e.extend({},i):i,n=function(){return r.errorThrown?e.Deferred().rejectWith(s,[r]).promise():s._processFile(t,r)};t.index=o,s._processing+=1,s._processingQueue=s._processingQueue.then(n,n).always(function(){s._processing-=1,0===s._processing&&s._trigger("processstop")})})),this._processingQueue},_create:function(){this._super(),this._processing=0,this._processingQueue=e.Deferred().resolveWith(this).promise()}})});


/**
 * JavaScript Templates
 * https://github.com/blueimp/JavaScript-Templates
 */
!function(e){"use strict";var r=function(e,n){var t=/[^\w\-.:]/.test(e)?new Function(r.arg+",tmpl","var _e=tmpl.encode"+r.helper+",_s='"+e.replace(r.regexp,r.func)+"';return _s;"):r.cache[e]=r.cache[e]||r(r.load(e));return n?t(n,r):function(e){return t(e,r)}};r.cache={},r.load=function(e){return document.getElementById(e).innerHTML},r.regexp=/([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,r.func=function(e,n,t,r,c,u){return n?{"\n":"\\n","\r":"\\r","\t":"\\t"," ":" "}[n]||"\\"+n:t?"="===t?"'+_e("+r+")+'":"'+("+r+"==null?'':"+r+")+'":c?"';":u?"_s+='":void 0},r.encReg=/[<>&"'\x00]/g,r.encMap={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"},r.encode=function(e){return(null==e?"":""+e).replace(r.encReg,function(e){return r.encMap[e]||""})},r.arg="o",r.helper=",print=function(s,e){_s+=e?(s==null?'':s):_e(s);},include=function(s,d){_s+=tmpl(s,d);}","function"==typeof define&&define.amd?define(function(){return r}):"object"==typeof module&&module.exports?module.exports=r:e.tmpl=r}(this);

/*
 * jQuery File Upload User Interface Plugin
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define, require */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'blueimp-tmpl',
            './jquery.fileupload-image',
            './jquery.fileupload-audio',
            './jquery.fileupload-video',
            './jquery.fileupload-validate'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS:
        factory(
            require('jquery'),
            require('blueimp-tmpl'),
            require('./jquery.fileupload-image'),
            require('./jquery.fileupload-audio'),
            require('./jquery.fileupload-video'),
            require('./jquery.fileupload-validate')
        );
    } else {
        // Browser globals:
        factory(window.jQuery, window.tmpl);
    }
})(function ($, tmpl) {
    'use strict';

    $.blueimp.fileupload.prototype._specialOptions.push(
        'filesContainer',
        'uploadTemplateId',
        'downloadTemplateId'
    );

    // The UI version extends the file upload widget
    // and adds complete user interface interaction:
    $.widget('blueimp.fileupload', $.blueimp.fileupload, {
        options: {
            // By default, files added to the widget are uploaded as soon
            // as the user clicks on the start buttons. To enable automatic
            // uploads, set the following option to true:
            autoUpload: true,
            // The class to show/hide UI elements:
            showElementClass: 'in',
            // The ID of the upload template:
            uploadTemplateId: 'template-upload',
            // The ID of the download template:
            downloadTemplateId: 'template-download',
            // The container for the list of files. If undefined, it is set to
            // an element with class "files" inside of the widget element:
            filesContainer: undefined,
            // By default, files are appended to the files container.
            // Set the following option to true, to prepend files instead:
            prependFiles: false,
            // The expected data type of the upload response, sets the dataType
            // option of the $.ajax upload requests:
            dataType: 'json',

            // Error and info messages:
            messages: {
                unknownError: 'Unknown error'
            },

            // Function returning the current number of files,
            // used by the maxNumberOfFiles validation:
            getNumberOfFiles: function () {
                return this.filesContainer.children().not('.processing').length;
            },

            // Callback to retrieve the list of files from the server response:
            getFilesFromResponse: function (data) {
                if (data.result && $.isArray(data.result.files)) {
                    return data.result.files;
                }
                return [];
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop or add API call).
            // See the basic file upload widget for more information:
            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var $this = $(this),
                    that = $this.data('blueimp-fileupload') ||
                        $this.data('fileupload'),
                    options = that.options;
                data.context = that._renderUpload(data.files)
                    .data('data', data)
                    .addClass('processing');
                $('.uploaded-files').append(data.context);

                setTimeout(function(){
                    $('.upload-edit-song-form').ajaxForm({
                        beforeSubmit: function(data, $form, options) {
                            $form.find("[type='submit']").attr("disabled", "disabled");
                            $form.find("[type='submit']").addClass("btn-loading");
                        },
                        success: function(response, textStatus, xhr, $form) {
                            $form.parent().fadeOut(500);
                            $form.find("[type='submit']").removeClass("btn-loading");
                        },
                        error: function(e, textStatus, xhr, $form) {
                            $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                            $form.find("[type='submit']").removeAttr("disabled");
                            $form.find("[type='submit']").removeClass("btn-loading");
                        }
                    });
                }, 1000)

                //return false;
                that._forceReflow(data.context);
                that._transition(data.context);
                data.process(function () {
                    return $this.fileupload('process', data);
                }).always(function () {
                    data.context.each(function (index) {
                        $(this).find('.size').text(
                            that._formatFileSize(data.files[index].size)
                        );
                    }).removeClass('processing');
                    that._renderPreviews(data);
                }).done(function () {
                    data.context.find('.start').prop('disabled', false);
                    if ((that._trigger('added', e, data) !== false) && (options.autoUpload || data.autoUpload) && data.autoUpload !== false) {
                        data.submit();
                    }
                }).fail(function () {
                    if (data.files.error) {
                        data.context.each(function (index) {
                            var error = data.files[index].error;
                            if (error) {
                                $(this).find('.error').text(error);
                            }
                        });
                    }
                });
            },
            // Callback for the start of each file upload request:
            send: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload');
                if (data.context && data.dataType &&
                    data.dataType.substr(0, 6) === 'iframe') {
                    // Iframe Transport does not support progress events.
                    // In lack of an indeterminate progress bar, we set
                    // the progress to 100%, showing the full animated bar:
                    data.context
                        .find('.progress').addClass(
                        !$.support.transition && 'progress-animated'
                    )
                        .attr('aria-valuenow', 100)
                        .children().first().css(
                        'width',
                        '100%'
                    );
                }
                return that._trigger('sent', e, data);
            },
            // Callback for successful uploads:
            done: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload'),
                    getFilesFromResponse = data.getFilesFromResponse ||
                        that.options.getFilesFromResponse,
                    files = getFilesFromResponse(data),
                    template,
                    deferred;
                if (data.context) {
                    data.context.each(function (index) {
                        var file = files[index] ||
                            {error: 'Empty file upload result'};
                        deferred = that._addFinishedDeferreds();
                        that._transition($(this)).done(

                            function () {
                                var song = data.result;
                                $(this).find('.template-upload').attr('data-id', song.id);
                                $(this).find('input[name="id"]').val(song.id);
                                $(this).find('.upload-info-progress-outer').addClass('hide');
                                $(this).find('.upload-info-file').addClass('hide');
                                $(this).find('.upload-info-footer').removeClass('hide');
                                $(this).find('.song-info-container-overlay').addClass('hide');
                                $(this).find('.img-container img').attr('src', song.artwork_url);
                                $(this).find('.song-name-input').val(song.title);
                                $(this).find('.edit-song-artwork-input').change(function(){
                                    var input = this;
                                    var url = $(this).val();
                                    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                                    if (input.files && input.files[0]&& (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg"))
                                    {
                                        var reader = new FileReader();
                                        reader.onload = function (e) {
                                            $(this).find('.img-container img').attr('src', e.target.result);
                                        };
                                        reader.readAsDataURL(input.files[0]);
                                    }
                                });
                                var that = $(this);
                                if(song.genre) {
                                    song.genre.split(',').forEach(function (i) {
                                        that.find('select[name=genre\\[\\]] option[value="' + i + '"]').attr('selected', 'selected');
                                    });
                                }
                                $(this).find('.select2-active').select2({
                                    placeholder: "Select one or multi",
                                    maximumSelectionLength: 4
                                });

                                if(song.artists && song.artists[0]) {
                                    $(this).find('.song-artists-input option')
                                        .attr('value', song.artists[0].id)
                                        .attr('data-artwork', song.artists[0].artwork_url)
                                        .attr('data-title', song.artists[0].name);
                                } else {
                                    $(this).find('.song-artists-input option').remove();
                                }

                                $(".multi-selector").select2({
                                    width: '100%',
                                    placeholder: 'Select one or multi',
                                    containerCssClass: "with-ajax",
                                    ajax: {
                                        dataType: 'json',
                                        delay: 250,
                                        data: function(params) {
                                            return {
                                                q: params.term,
                                            };
                                        },
                                        processResults: function(response, params) {
                                            params.page = params.page || 1;
                                            return {
                                                results: response.data,
                                            };
                                        },
                                        cache: true
                                    },
                                    escapeMarkup: function(markup) {
                                        return markup;
                                    },
                                    minimumInputLength: 1,
                                    templateResult: function (repo) {
                                        console.log(repo);
                                        if (repo.loading) return repo.text;
                                        var text;
                                        repo.name ? text = repo.name : text = repo.title;
                                        var markup = "<div class='select2-result-repository clearfix'>" +
                                            "<div class='select2-result-repository__avatar'><img src='" + repo.artwork_url + "' /></div>" +
                                            "<div class='select2-result-repository__meta'>" +
                                            "<div class='select2-result-repository__title'>" + text + "</div></div></div>";
                                        return markup;
                                    },
                                    templateSelection: function (repo) {
                                        console.log(repo);
                                        var artwork_url;
                                        if (repo.element && repo.element.dataset && repo.element.dataset.artwork) {
                                            artwork_url = repo.element.dataset.artwork;
                                        } else {
                                            artwork_url = repo.artwork_url;
                                        }
                                        var text;
                                        repo.name ? text = repo.name : text = repo.title;
                                        if (repo.element && repo.element.label) {
                                            text = repo.element.label;
                                        }
                                        if(! text ) {
                                             text = repo.element.dataset.title;
                                        }

                                        var markup = "<div class='select2-result-repository clearfix'>" +
                                            "<div class='select2-result-repository__avatar'><img src='" + artwork_url + "' /></div>" +
                                            "<div class='select2-result-repository__meta'>" +
                                            "<div class='select2-result-repository__title white'>" + text + "</div></div></div>";
                                        return markup || repo.text;
                                    },
                                }).on("select2:select", function(evt) {
                                    var id = evt.params.data.id;
                                    var element = $(this).children("option[value=" + id + "]");
                                    var parent = element.parent();
                                    element.detach();
                                    parent.append(element);
                                    $(this).trigger("change");
                                });
                                $('.datetimepicker').datetimepicker('show');
                                $(".datepicker").datepicker();
                            }

                            /**function () {
                                    var node = $(this);
                                    template = that._renderDownload([file])
                                        .replaceAll(node);
                                    that._forceReflow(template);
                                    that._transition(template).done(
                                        function () {
                                            data.context = $(this);
                                            that._trigger('completed', e, data);
                                            that._trigger('finished', e, data);
                                            deferred.resolve();
                                        }
                                    );
                                }*/
                        );
                    });
                } else {
                    alert('Failed')
                }
            },
            // Callback for failed (abort or error) uploads:
            fail: function (e, data) {
                if(data._response.jqXHR.status !== 200) {
                    $('#fileupload').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
                        data._response.jqXHR.responseText +
                        '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                        '    <span aria-hidden="true">&times;</span>\n' +
                        '  </button>\n' +
                        '</div>')
                }
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that =
                    $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                    template,
                    deferred;
                if (data.context) {
                    data.context.each(function (index) {
                        if (data.errorThrown !== 'abort') {
                            var file = data.files[index];
                            file.error =
                                file.error || data.errorThrown || data.i18n('unknownError');
                            deferred = that._addFinishedDeferreds();
                            that._transition($(this)).done(function () {
                                var node = $(this);
                                template = that._renderDownload([file]).replaceAll(node);
                                that._forceReflow(template);
                                that._transition(template).done(function () {
                                    data.context = $(this);
                                    that._trigger('failed', e, data);
                                    that._trigger('finished', e, data);
                                    deferred.resolve();
                                });
                            });
                        } else {
                            deferred = that._addFinishedDeferreds();
                            that._transition($(this)).done(function () {
                                $(this).remove();
                                that._trigger('failed', e, data);
                                that._trigger('finished', e, data);
                                deferred.resolve();
                            });
                        }
                    });
                } else if (data.errorThrown !== 'abort') {
                    data.context = that
                        ._renderUpload(data.files)
                        [that.options.prependFiles ? 'prependTo' : 'appendTo'](
                        that.options.filesContainer
                    )
                        .data('data', data);
                    that._forceReflow(data.context);
                    deferred = that._addFinishedDeferreds();
                    that._transition(data.context).done(function () {
                        data.context = $(this);
                        that._trigger('failed', e, data);
                        that._trigger('finished', e, data);
                        deferred.resolve();
                    });
                } else {
                    that._trigger('failed', e, data);
                    that._trigger('finished', e, data);
                    that._addFinishedDeferreds().resolve();
                }
            },
            // Callback for upload progress events:
            progress: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');
                var progress = Math.floor((data.loaded / data.total) * 100);
                if (data.context) {
                    data.context.each(function () {
                        $(this)
                            .find('.progress')
                            .attr('aria-valuenow', progress)
                            .css(
                                'width',
                                progress + '%'
                            );
                        $(this).find('.upload-info-extra').html(that._renderExtendedProgress(data));
                        $(this).find('.upload-info-bitrate').html(that._formatBitrate(data.bitrate));
                    });
                }
            },
            // Callback for global upload progress events:
            progressall: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var $this = $(this),
                    progress = Math.floor((data.loaded / data.total) * 100),
                    globalProgressNode = $this.find('.fileupload-progress'),
                    extendedProgressNode = globalProgressNode.find('.progress-extended');
                if (extendedProgressNode.length) {
                    extendedProgressNode.html(
                        (
                            $this.data('blueimp-fileupload') || $this.data('fileupload')
                        )._renderExtendedProgress(data)
                    );
                }
                globalProgressNode
                    .find('.progress')
                    .attr('aria-valuenow', progress)
                    .children()
                    .first()
                    .css('width', progress + '%');
            },
            // Callback for uploads start, equivalent to the global ajaxStart event:
            start: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload');
                that._resetFinishedDeferreds();
                that._transition($(this).find('.fileupload-progress')).done(
                    function () {
                        that._trigger('started', e);
                    }
                );
            },
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            stop: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload'),
                    deferred = that._addFinishedDeferreds();
                $.when.apply($, that._getFinishedDeferreds())
                    .done(function () {
                        that._trigger('stopped', e);
                    });
                that._transition($(this).find('.fileupload-progress')).done(
                    function () {
                        $(this).find('.progress')
                            .attr('aria-valuenow', '0')
                            .css('width', '0%');
                        $(this).find('.progress-extended').html('&nbsp;');
                        deferred.resolve();
                    }
                );
            },
            processstart: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                $(this).addClass('fileupload-processing');
            },
            processstop: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                $(this).removeClass('fileupload-processing');
            },
            // Callback for file deletion:
            destroy: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload'),
                    removeNode = function () {
                        that._transition(data.context).done(
                            function () {
                                $(this).remove();
                                that._trigger('destroyed', e, data);
                            }
                        );
                    };
                if (data.url) {
                    data.dataType = data.dataType || that.options.dataType;
                    $.ajax(data).done(removeNode).fail(function () {
                        that._trigger('destroyfailed', e, data);
                    });
                } else {
                    removeNode();
                }
            }
        },

        _resetFinishedDeferreds: function () {
            this._finishedUploads = [];
        },

        _addFinishedDeferreds: function (deferred) {
            // eslint-disable-next-line new-cap
            var promise = deferred || $.Deferred();
            this._finishedUploads.push(promise);
            return promise;
        },

        _getFinishedDeferreds: function () {
            return this._finishedUploads;
        },

        // Link handler, that allows to download files
        // by drag & drop of the links to the desktop:
        _enableDragToDesktop: function () {
            var link = $(this),
                url = link.prop('href'),
                name = link.prop('download'),
                type = 'application/octet-stream';
            link.on('dragstart', function (e) {
                try {
                    e.originalEvent.dataTransfer.setData(
                        'DownloadURL',
                        [type, name, url].join(':')
                    );
                } catch (ignore) {
                    // Ignore exceptions
                }
            });
        },

        _formatFileSize: function (bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        },

        _formatBitrate: function (bits) {
            if (typeof bits !== 'number') {
                return '';
            }
            if (bits >= 1000000000) {
                return (bits / 1000000000).toFixed(2) + ' Gbit/s';
            }
            if (bits >= 1000000) {
                return (bits / 1000000).toFixed(2) + ' Mbit/s';
            }
            if (bits >= 1000) {
                return (bits / 1000).toFixed(2) + ' kbit/s';
            }
            return bits.toFixed(2) + ' bit/s';
        },

        _formatTime: function (seconds) {
            var date = new Date(seconds * 1000),
                days = Math.floor(seconds / 86400);
            days = days ? days + 'd ' : '';
            return (
                days +
                ('0' + date.getUTCHours()).slice(-2) +
                ':' +
                ('0' + date.getUTCMinutes()).slice(-2) +
                ':' +
                ('0' + date.getUTCSeconds()).slice(-2)
            );
        },

        _formatPercentage: function (floatValue) {
            return (floatValue * 100).toFixed(2) + ' %';
        },

        _renderExtendedProgress: function (data) {
            return (
                this._formatBitrate(data.bitrate) +
                ' | ' +
                this._formatTime(((data.total - data.loaded) * 8) / data.bitrate) +
                ' | ' +
                this._formatPercentage(data.loaded / data.total) +
                ' | ' +
                this._formatFileSize(data.loaded) +
                ' / ' +
                this._formatFileSize(data.total)
            );
        },

        _renderTemplate: function (func, files) {
            if (!func) {
                return $();
            }
            var result = func({
                files: files,
                formatFileSize: this._formatFileSize,
                options: this.options
            });
            if (result instanceof $) {
                return result;
            }
            return $(this.options.templatesContainer).html(result).children();
        },

        _renderPreviews: function (data) {
            data.context.find('.preview').each(function (index, elm) {
                $(elm).empty().append(data.files[index].preview);
            });
        },

        _renderUpload: function (files) {
            return this._renderTemplate(this.options.uploadTemplate, files);
        },

        _renderDownload: function (files) {
            return this._renderTemplate(this.options.downloadTemplate, files)
                .find('a[download]')
                .each(this._enableDragToDesktop)
                .end();
        },

        _editHandler: function (e) {
            e.preventDefault();
            if (!this.options.edit) return;
            var that = this,
                button = $(e.currentTarget),
                template = button.closest('.template-upload'),
                data = template.data('data'),
                index = button.data().index;
            this.options.edit(data.files[index]).then(function (file) {
                if (!file) return;
                data.files[index] = file;
                data.context.addClass('processing');
                template.find('.edit,.start').prop('disabled', true);
                $(that.element)
                    .fileupload('process', data)
                    .always(function () {
                        template
                            .find('.size')
                            .text(that._formatFileSize(data.files[index].size));
                        data.context.removeClass('processing');
                        that._renderPreviews(data);
                    })
                    .done(function () {
                        template.find('.edit,.start').prop('disabled', false);
                    })
                    .fail(function () {
                        template.find('.edit').prop('disabled', false);
                        var error = data.files[index].error;
                        if (error) {
                            template.find('.error').text(error);
                        }
                    });
            });
        },

        _startHandler: function (e) {
            e.preventDefault();
            var button = $(e.currentTarget),
                template = button.closest('.template-upload'),
                data = template.data('data');
            button.prop('disabled', true);
            if (data && data.submit) {
                data.submit();
            }
        },

        _cancelHandler: function (e) {
            e.preventDefault();
            var template = $(e.currentTarget).closest(
                '.template-upload,.template-download'
                ),
                data = template.data('data') || {};
            data.context = data.context || template;
            if (data.abort) {
                data.abort();
            } else {
                data.errorThrown = 'abort';
                this._trigger('fail', e, data);
            }
        },

        _deleteHandler: function (e) {
            e.preventDefault();
            var button = $(e.currentTarget);
            this._trigger(
                'destroy',
                e,
                $.extend(
                    {
                        context: button.closest('.template-download'),
                        type: 'DELETE'
                    },
                    button.data()
                )
            );
        },

        _forceReflow: function (node) {
            return $.support.transition && node.length && node[0].offsetWidth;
        },

        _transition: function (node) {
            // eslint-disable-next-line new-cap
            var dfd = $.Deferred();
            if (
                $.support.transition &&
                node.hasClass('fade') &&
                node.is(':visible')
            ) {
                var transitionEndHandler = function (e) {
                    // Make sure we don't respond to other transition events
                    // in the container element, e.g. from button elements:
                    if (e.target === node[0]) {
                        node.off($.support.transition.end, transitionEndHandler);
                        dfd.resolveWith(node);
                    }
                };
                node
                    .on($.support.transition.end, transitionEndHandler)
                    .toggleClass(this.options.showElementClass);
            } else {
                node.toggleClass(this.options.showElementClass);
                dfd.resolveWith(node);
            }
            return dfd;
        },

        _initButtonBarEventHandlers: function () {
            var fileUploadButtonBar = this.element.find('.fileupload-buttonbar'),
                filesList = this.options.filesContainer;
            this._on(fileUploadButtonBar.find('.start'), {
                click: function (e) {
                    e.preventDefault();
                    filesList.find('.start').trigger('click');
                }
            });
            this._on(fileUploadButtonBar.find('.cancel'), {
                click: function (e) {
                    e.preventDefault();
                    filesList.find('.cancel').trigger('click');
                }
            });
            this._on(fileUploadButtonBar.find('.delete'), {
                click: function (e) {
                    e.preventDefault();
                    filesList
                        .find('.toggle:checked')
                        .closest('.template-download')
                        .find('.delete')
                        .trigger('click');
                    fileUploadButtonBar.find('.toggle').prop('checked', false);
                }
            });
            this._on(fileUploadButtonBar.find('.toggle'), {
                change: function (e) {
                    filesList
                        .find('.toggle')
                        .prop('checked', $(e.currentTarget).is(':checked'));
                }
            });
        },

        _destroyButtonBarEventHandlers: function () {
            this._off(
                this.element
                    .find('.fileupload-buttonbar')
                    .find('.start, .cancel, .delete'),
                'click'
            );
            this._off(this.element.find('.fileupload-buttonbar .toggle'), 'change.');
        },

        _initEventHandlers: function () {
            this._super();
            this._on(this.options.filesContainer, {
                'click .edit': this._editHandler,
                'click .start': this._startHandler,
                'click .cancel': this._cancelHandler,
                'click .delete': this._deleteHandler
            });
            this._initButtonBarEventHandlers();
        },

        _destroyEventHandlers: function () {
            this._destroyButtonBarEventHandlers();
            this._off(this.options.filesContainer, 'click');
            this._super();
        },

        _enableFileInputButton: function () {
            this.element
                .find('.fileinput-button input')
                .prop('disabled', false)
                .parent()
                .removeClass('disabled');
        },

        _disableFileInputButton: function () {
            this.element
                .find('.fileinput-button input')
                .prop('disabled', true)
                .parent()
                .addClass('disabled');
        },

        _initTemplates: function () {
            var options = this.options;
            options.templatesContainer = this.document[0].createElement(
                options.filesContainer.prop('nodeName')
            );
            if (tmpl) {
                if (options.uploadTemplateId) {
                    options.uploadTemplate = tmpl(options.uploadTemplateId);
                }
                if (options.downloadTemplateId) {
                    options.downloadTemplate = tmpl(options.downloadTemplateId);
                }
            }
        },

        _initFilesContainer: function () {
            var options = this.options;
            if (options.filesContainer === undefined) {
                options.filesContainer = this.element.find('.files');
            } else if (!(options.filesContainer instanceof $)) {
                options.filesContainer = $(options.filesContainer);
            }
        },

        _initSpecialOptions: function () {
            this._super();
            this._initFilesContainer();
            this._initTemplates();
        },

        _create: function () {
            this._super();
            this._resetFinishedDeferreds();
            if (!$.support.fileInput) {
                this._disableFileInputButton();
            }
        },

        enable: function () {
            var wasDisabled = false;
            if (this.options.disabled) {
                wasDisabled = true;
            }
            this._super();
            if (wasDisabled) {
                this.element.find('input, button').prop('disabled', false);
                this._enableFileInputButton();
            }
        },

        disable: function () {
            if (!this.options.disabled) {
                this.element.find('input, button').prop('disabled', true);
                this._disableFileInputButton();
            }
            this._super();
        }
    });
});