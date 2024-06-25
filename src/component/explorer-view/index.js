import React, { useState, useEffect } from 'react';
import ExplorerItem from '../explorer-Item/index';
import demoData from '../../data';

const ExplorerView = () => {
  const [fileExplorerData, setFileExplorerData] = useState(demoData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  

  useEffect(() => {
    if (selectedFile) {
      setEditedContent(selectedFile.content || '');
    } else {
      setEditedContent('');
    }
  }, [selectedFile]);

  const addFolder = () => {
    const name = prompt("Enter folder name");
    if (name) {
      setFileExplorerData(prevFiles => ({
        ...prevFiles,
        children: [...prevFiles.children, { name, type: 'folder', children: [] }]
      }));
    }
  };

  const addFile = () => {
    const name = prompt("Enter file name");
    if (name) {
      setFileExplorerData(prevFiles => ({
        ...prevFiles,
        children: [...prevFiles.children, { name, type: 'file', content: '' }]
      }));
    }
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const saveContent = () => {
    setFileExplorerData(prevFiles => ({
      ...prevFiles,
      children: prevFiles.children.map(file => {
        if (file === selectedFile) {
          return {
            ...file,
            content: editedContent
          };
        } else if (file.type === 'folder' && file.children) {
          return {
            ...file,
            children: file.children.map(childFile => {
              if (childFile === selectedFile) {
                return {
                  ...childFile,
                  content: editedContent
                };
              }
              return childFile;
            })
          };
        }
        return file;
      })
    }));
    setSelectedFile(prev => ({
      ...prev,
      content: editedContent
    }));
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-92 bg-gray-800 text-gray-200 h-screen overflow-auto p-2 flex flex-col">
        <div className="flex items-center justify-center w-full mb-4">
          <h1 className="text-lg font-bold">Explorer</h1>
        </div>
        <div className="flex-grow w-full overflow-auto space-y-2">
          {fileExplorerData.children.map((item, index) => (
            <ExplorerItem key={index} fileAndFolder={item} setFileExplorerData={setFileExplorerData} onSelectFile={setSelectedFile} />
          ))}
        </div>
        <div className="mt-4 flex space-x-2 justify-center">
          <button onClick={addFolder} className="bg-blue-500 text-white p-2 rounded">
            +📂
          </button>
          <button onClick={addFile} className="bg-green-500 text-white p-2 rounded">
            +📄
          </button>
        </div>
      </div>
      <div className="flex-1 px-1 overflow-auto w-full bg-gray-700 border-l-4 border-gray-500">
        {selectedFile && selectedFile.type === 'file' && (
          <div>
            <div className="flex items-center">
              <div className='bg-gray-800 inline-block flex items-center p-2 px-4'>
                <h2 className="font-bold m-0 text-gray-200 py-1">{selectedFile.name}</h2>
                <button
                  className="text-gray-300 hover:text-gray-400 ml-2"
                  onClick={() => setSelectedFile(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a9 9 0 110 18 9 9 0 010-18zm4.293 5.293a1 1 0 00-1.414 1.414L10 10.414 6.121 6.536a1 1 0 00-1.414 1.414L8.586 12l-3.88 3.879a1 1 0 001.414 1.414L10 13.414l3.879 3.879a1 1 0 001.414-1.414L11.414 12l3.879-3.879a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <textarea
              className="text-white p-4 w-full h-80 bg-gray-700 "
              value={editedContent}
              onChange={handleContentChange}
              placeholder="Edit content..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={saveContent}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerView;
