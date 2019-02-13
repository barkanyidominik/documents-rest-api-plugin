
var apiUrl = "https://localhost/wp-json/documents/dir/";

window.onload = function() {
    listDocuments("Documents"); // First request for https://localhost/wp-json/documents/dir/Documents
}

function listDocuments(path) {
    url = apiUrl + path;
    request = new XMLHttpRequest();
    request.open( "GET", url, false );
    request.onload = function () {
        // Begin accessing JSON data here
        data = JSON.parse(this.response);
        html = tableOpenHTML();

        if (request.status >= 200 && request.status < 400 && data != false) {
            data.forEach(file => {
                if(file.dir)
                {
                    html = html + tableRowFolderHTML(file.basename, file.filepath);
                }
            });
            data.forEach(file => {
                if(!file.dir)
                {
                    html = html + tableRowFileHTML(file.basename, file.fileurl);
                }
            });
            html = html + tableCloseHTML();
            if(path.includes('/')){
                html = html + backButtonHTML(path);
            }
        } else {
            console.log('folder-error');
            html = '<div class="empty-folder">Empty folder!</div>' + backButtonHTML(path);
        }

        document.getElementById('file-wrap').innerHTML = html;
    }

    request.send();

    foldersClickEventRefresh();
}    

function foldersClickEventRefresh() {
    var folders = document.querySelectorAll(".folder-navigator");
    folders.forEach(function(folder) {
        folder.addEventListener('click', function(event){
                listDocuments(folder.dataset.info); //New request for https://localhost/wp-json/documents/dir/{folder.dataset.info}
        });
    });
}

function tableOpenHTML() {
    return '<table><tbody>';
}

function tableCloseHTML() {
    return '</tbody></table>';
}

function tableRowFolderHTML(name, path) {
    return `<tr class="folder-navigator" data-info="${path}">
                <td class="icon">
                    <svg class="octicon-file-directory" width="14" height="16" role="img"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>
                </td>
                <td>
                    <span><a href="#${path}">${name}</a></span>
                </td>
            </tr>`;
}

function tableRowFileHTML(name, url) {
    return `<tr>
                <td class="icon">
                    <svg class="octicon octicon-file" width="12" height="16" role="img"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>
                </td>
                <td>
                    <span><a href="${url}" target="_blank">${name}</a></span>
                </td>
            </tr>`;
}

function backButtonHTML(path) {
    new_path = path.substr(0, path.lastIndexOf("/"));
    return `<tr>
                <td class="icon">
                        <i class="fa fa-arrow-left"></i>
                </td>
                <td>
                    <span class="folder-back-button folder-navigator" data-info="${new_path}"><a href="#${new_path}">Back</a></span>
                </td>
            </tr>`;
}

