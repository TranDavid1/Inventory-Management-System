import React from "react";

function FolderList(props) {
    const folders = [...new Set(props.inventory.map((item) => item.folder))];

    const handleFolderChange = (event) => {
        props.onFolderChange(event.target.value);
    };

    return (
        <div>
            <select value={props.selectedFolder} onChange={handleFolderChange}>
                <option value="">All Folders</option>
                {folders.map((folder) => (
                    <option key={folder} value={folder}>
                        {folder}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default FolderList;
