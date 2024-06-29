import React from 'react';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';

const App = () => {
    return (
        <div>
            <h1>Chatbot</h1>
            <FileUpload />
            <Chat />
        </div>
    );
};

export default App;
