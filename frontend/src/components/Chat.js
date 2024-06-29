import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleAsk = async () => {
        const response = await axios.post('http://localhost:4000/query', { question });
        setAnswer(response.data.answer);
    };

    return (
        <div>
            <input 
                type="text" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                placeholder="Ask a question"
            />
            <button onClick={handleAsk}>Ask</button>
            <div>
                <h3>Answer:</h3>
                <p>{answer}</p>
            </div>
        </div>
    );
};

export default Chat;
