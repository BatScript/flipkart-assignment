document.addEventListener('DOMContentLoaded', function () {
  const filterInput = document.getElementById('filter-input')
  const chatList = document.getElementById('chat-list')
  const rightSection = document.getElementById('right-section')

  // Fetch chat data from the API
  fetch('https://my-json-server.typicode.com/codebuds-fk/chat/chats')
    .then((response) => response.json())
    .then((data) => {
      // Populate the chat list
      populateChatList(data)

      // Add event listener for filter input
      filterInput.addEventListener('input', () => {
        filterChatList(data)
      })
    })
    .catch((error) => console.error('Error fetching data:', error))

  function populateChatList(chatData) {
    chatData.forEach((chat) => {
      const listItem = document.createElement('li')
      listItem.classList.add('chat-item')
      listItem.innerHTML = `
                <img src="${
                  chat.imageURL
                }" alt="Profile Picture" class="profile-picture">
                <div class="recipient-info">
                    <div class="recipient-name">${chat.title}</div>
                    <div class="last-message">${getLastMessage(
                      chat.messageList
                    )}</div>
                </div>
            `
      listItem.addEventListener('click', () => {
        displayMessages(chat)
      })
      chatList.appendChild(listItem)
    })
  }

  function filterChatList(chatData) {
    const searchTerm = filterInput.value.toLowerCase()
    const filteredChats = chatData.filter((chat) =>
      chat.title.toLowerCase().includes(searchTerm)
    )
    // Clear current chat list
    chatList.innerHTML = ''
    // Populate filtered chat list
    populateChatList(filteredChats)
  }

  function getLastMessage(messageList) {
    const lastMessage =
      messageList.length > 0 ? messageList[messageList.length - 1].message : ''
    return lastMessage
  }

  function displayMessages(chat) {
    // Clear previous messages
    rightSection.innerHTML = ''

    // Display messages in the right section
    chat.messageList.forEach((message) => {
      const messageContainer = document.createElement('div')
      messageContainer.classList.add('message-container')
      messageContainer.innerHTML = `
                <strong>${message.sender}:</strong> ${message.message}
            `
      rightSection.appendChild(messageContainer)
    })
  }
})
