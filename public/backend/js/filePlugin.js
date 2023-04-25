tinymce.PluginManager.add('filemanager', function(editor) {
    editor.settings.file_picker_types = 'file image media';
    editor.settings.file_picker_callback = filemanager;

    function filemanager(callback, value, meta) {
        var width = window.innerWidth - 30;
        var height = window.innerHeight - 60;
        if(width > 1800) width = 1800;
        if(height > 1200) height = 1200;
        if(width > 600){
            var width_reduce = (width - 20) % 138;
            width = width - width_reduce + 10;
        }

        var dialogUrl = editor.settings.external_filemanager_path;

        var title = "";
        if(meta) {
            dialogUrl = dialogUrl + '?insert=false';
            title = 'Insert to dialog';
        } else {
            title = 'Insert media';
        }

        window.addEventListener('message', function receiveMessage(event) {
            window.removeEventListener('message', receiveMessage, false);
            callback(event.detail);
            tinyMCE.activeEditor.windowManager.close(window);
        }, false);


        win = editor.windowManager.openUrl({
            title: title,
            url: dialogUrl,
            width: width,
            height: height,
            inline: 1,
            resizable: true,
            maximizable: true
        });
    }
    return false;
});
