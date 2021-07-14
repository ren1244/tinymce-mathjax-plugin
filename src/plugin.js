tinymce.PluginManager.add('math', function (editor, url) {
    let editTarget=false; //目前修改的公式<img>，如果是新公式則為 false
    var openDialog = function () {
        const panel=editor.windowManager.open({
            title: '方程式編輯器',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'textarea',
                        name: 'latex',
                        label: 'latex 公式'
                    },
                    {
                        type: 'iframe', // component type
                        name: 'preview',
                        label: '預覽'
                    },
                ]
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Close'
                },
                {
                    type: 'submit',
                    text: 'Save',
                    primary: true
                }
            ],
            onChange: function (api, details) {
                if (details.name === 'latex') {
                    let svg = MathJax.tex2svg(`${api.getData().latex}`).querySelector('svg').outerHTML;
                    api.setData({
                        preview: svg
                    });
                } else {

                }
            },
            onSubmit: function (api) {
                var data = api.getData();
                /* Insert content when the window form is submitted */
                editor.execCommand(
                    'mceInsertContent',
                    false,
                    `<img style="vertical-align: middle" src='data:image/svg+xml;base64,${btoa(data.preview)}' data-latex='${btoa(data.latex)}'>`
                );
                api.close();
            }
        });
        panel.focus('latex');
        if(editTarget) {
            let latexCode=atob(editTarget.dataset.latex);
            let svg = MathJax.tex2svg(latexCode).querySelector('svg').outerHTML;
            panel.setData({
                latex: latexCode,
                preview: svg
            });
            editTarget=false;
        }
        return panel;
    };
    editor.on('click', (e)=>{
        if(e.target.dataset.latex) {
            editTarget=e.target;
            openDialog();
        }
    });
    /* Add a button that opens a window */
    editor.ui.registry.addButton('math', {
        icon: 'math',
        onAction: function () {
            /* Open window */
            openDialog();
        }
    });
    /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
    editor.ui.registry.addMenuItem('math', {
        text: '數學公式',
        onAction: function () {
            /* Open window */
            openDialog();
        }
    });
    /* 快捷鍵 */
    editor.shortcuts.add("alt+e", "", ()=>{
        openDialog();
    });
    /* Return the metadata for the help plugin */
    return {
        getMetadata: function () {
            return {
                name: 'mathjax plugin',
                url: ''
            };
        }
    };
});