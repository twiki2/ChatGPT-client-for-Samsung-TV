const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "your_api_key_here"; // Replace with your actual API key

document.addEventListener("DOMContentLoaded", function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', function() {
        sendMessage();
    });

    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        let userMessage = userInput.value.trim();
        if (userMessage !== '') {
            appendMessage('user', userMessage);
            userInput.value = '';
            
            try {
                let aiResponse = await getChatGPTResponse(userMessage);
                appendMessage('ai', aiResponse);
            } catch (error) {
                console.error("Error fetching ChatGPT response:", error);
                appendMessage('ai', "Sorry, something went wrong...");
            }
        }
    }

    async function getChatGPTResponse(message) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{"role": "user", "content": message}]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = `<div class="message-content">${message}</div>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }
});
