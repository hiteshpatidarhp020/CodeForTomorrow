import React, { useState } from "react";

const ExplorerItem = ({ fileAndFolder, setFileExplorerData, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFolderName, setEditedFolderName] = useState(fileAndFolder.name);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [folderError, setFolderError] = useState("");
  const [fileError, setFileError] = useState("");

  const toggleOpen = () => setIsOpen(!isOpen);

  const toggleFolderModal = () => {
    setIsFolderModalOpen(!isFolderModalOpen);
    setFolderError("");
    setFolderName("");
  };

  const toggleFileModal = () => {
    setIsFileModalOpen(!isFileModalOpen);
    setFileError("");
    setFileName("");
  };

  const addFolder = () => {
    if (folderName.trim() === "") {
      setFolderError("Folder name cannot be empty");
      return;
    }

    const isDuplicate = fileAndFolder.children.some(
      (child) => child.name === folderName && child.type === "folder"
    );
    if (isDuplicate) {
      setFolderError("Folder name already exists");
      return;
    }

    const newFolder = { name: folderName, type: "folder", children: [] };
    updateFiles(fileAndFolder, newFolder);
    setFolderName("");
    setIsFolderModalOpen(false);
  };

  const addFile = () => {
    if (fileName.trim() === "") {
      setFileError("File name cannot be empty");
      return;
    }

    const isDuplicate = fileAndFolder.children.some(
      (child) => child.name === fileName && child.type === "file"
    );
    if (isDuplicate) {
      setFileError("File name already exists");
      return;
    }

    const validExtensions = [
      ".txt",
      ".css",
      ".scss",
      ".sass",
      ".json",
      ".html",
      ".js",
      ".md",
      ".svg",
    ];
    const hasValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    if (!hasValidExtension) {
      setFileError(
        "Invalid file extension. Allowed extensions are " + validExtensions
      );
      return;
    }

    const newFile = { name: fileName, type: "file", content: "" };
    updateFiles(fileAndFolder, newFile);
    setFileName("");
    setIsFileModalOpen(false);
  };

  const updateFiles = (targetFile, newFile) => {
    setFileExplorerData((prevFiles) => {
      const updateRecursive = (files) => {
        return files.map((f) => {
          if (f === targetFile) {
            return {
              ...f,
              children: [...(f.children || []), newFile],
            };
          }
          if (f.type === "folder") {
            return {
              ...f,
              children: updateRecursive(f.children || []),
            };
          }
          return f;
        });
      };
      return {
        ...prevFiles,
        children: updateRecursive(prevFiles.children),
      };
    });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${fileAndFolder.name}?`
    );
    if (confirmDelete) {
      setFileExplorerData((prevFiles) => {
        const deleteRecursive = (files) => {
          return files.filter((f) => {
            if (f === fileAndFolder) {
              return false; // Exclude this item from the array
            }
            if (f.type === "folder") {
              f.children = deleteRecursive(f.children || []);
            }
            return true; // Include all other items
          });
        };
        return {
          ...prevFiles,
          children: deleteRecursive(prevFiles.children),
        };
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedFolderName.trim() === "") {
      setFolderError("Folder name cannot be empty");
      return;
    }

    setFileExplorerData((prevFiles) => {
      const updateRecursive = (files) => {
        return files.map((f) => {
          if (f === fileAndFolder) {
            return {
              ...f,
              name: editedFolderName,
            };
          }
          if (f.type === "folder") {
            return {
              ...f,
              children: updateRecursive(f.children || []),
            };
          }
          return f;
        });
      };
      return {
        ...prevFiles,
        children: updateRecursive(prevFiles.children),
      };
    });
    setIsEditing(false);
  };

  if (fileAndFolder.type === "folder") {
    return (
      <div>
        <div className="cursor-pointer hover:bg-gray-700 p-1 flex items-center justify-between">
          <div className="flex items-center" onClick={toggleOpen}>
            <span className="mr-2">{isOpen ? "📂" : "📁"}</span>
            {isEditing ? (
              <input
                type="text"
                value={editedFolderName}
                onChange={(e) => setEditedFolderName(e.target.value)}
                className="border text-black border-gray-300 p-1 rounded"
              />
            ) : (
              <span>{fileAndFolder.name}</span>
            )}
          </div>
          <div className="flex align-center">
            <button
              onClick={toggleFolderModal}
              className="bg-blue-500 text-white p-1 rounded mr-1"
            >
              +📂
            </button>
            <button
              onClick={toggleFileModal}
              className="bg-green-500 text-white p-1 rounded"
            >
              +📄
            </button>
            <div className="m-2">
              <svg
                className="m-2"
                onClick={handleDelete}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash3"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </div>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-yellow-500 text-white p-1 rounded"
              >
                Save
              </button>
            ) : (
              <div className="m-2">
                <svg
                  className="m-1"
                  onClick={handleEdit}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16"
                >
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="ml-4">
            {fileAndFolder.children.map((item, index) => (
              <ExplorerItem
                key={index}
                fileAndFolder={item}
                setFileExplorerData={setFileExplorerData}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}

        {/* Add Folder Modal */}
        {isFolderModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4 bg-black text-center">
                Create new Folder
              </h2>
              <input
                type="text"
                className="border text-black border-gray-300 p-2 rounded mb-2 w-full"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              {folderError && <p className="text-red-500">{folderError}</p>}
              <div className="flex justify-end">
                <button
                  onClick={toggleFolderModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={addFolder}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add File Modal */}
        {isFileModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4 bg-black text-center">
                Create new File
              </h2>
              <input
                type="text"
                className="border text-black border-gray-300 p-2 rounded mb-2 w-full"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              {fileError && <p className="text-red-500">{fileError}</p>}
              <div className="flex justify-end">
                <button
                  onClick={toggleFileModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={addFile}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className=" flex items-center justify-between cursor-pointer hover:bg-gray-700 p-1 flex items-center"
      onClick={() => onSelectFile(fileAndFolder)}
    >
      <div>
        <span className="mr-2">📄</span>

        {isEditing ? (
          <input
            type="text"
            value={editedFolderName}
            onChange={(e) => setEditedFolderName(e.target.value)}
            className="border text-black border-gray-300 p-1 rounded"
          />
        ) : (
          <span>{fileAndFolder.name}</span>
        )}
      </div>
      <div className="flex">
        <div className="m-2">
          <svg
            className="m-2"
            onClick={handleDelete}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash3"
            viewBox="0 0 16 16"
          >
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
          </svg>
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-yellow-500 text-white p-1 rounded"
          >
            Save
          </button>
        ) : (
          <div className="m-2">
            <svg
              className="m-1"
              onClick={handleEdit}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerItem;
