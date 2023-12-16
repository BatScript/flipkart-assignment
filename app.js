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

      // Add a click event listener to handle the selection
      listItem.addEventListener('click', () => {
        // Remove the 'selected' class from all chat items
        const allChatItems = document.querySelectorAll('.chat-item')
        allChatItems.forEach((item) => item.classList.remove('selected'))

        // Add the 'selected' class to the clicked chat item
        listItem.classList.add('selected')

        // Display messages for the selected chat
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

    // Create header div
    const headerDiv = document.createElement('div')
    headerDiv.classList.add('chat-header')

    // Add profile picture to header
    const profilePicture = document.createElement('img')
    profilePicture.src = chat.imageURL
    profilePicture.alt = 'Profile Picture'
    profilePicture.classList.add('profile-picture')

    // Add recipient info to header
    const recipientInfoDiv = document.createElement('div')
    recipientInfoDiv.classList.add('recipient-info')
    const recipientNameDiv = document.createElement('div')
    recipientNameDiv.classList.add('recipient-name')
    recipientNameDiv.textContent = chat.title

    // Append profile picture and recipient info to header
    recipientInfoDiv.appendChild(recipientNameDiv)
    headerDiv.appendChild(profilePicture)
    headerDiv.appendChild(recipientInfoDiv)

    // Append header to rightSection
    rightSection.appendChild(headerDiv)

    // Create messages container div
    const messagesContainerDiv = document.createElement('div')
    messagesContainerDiv.classList.add('messages-container')

    // Display messages in the messages container
    chat.messageList.forEach((message) => {
      const messageContainer = document.createElement('div')
      messageContainer.classList.add('message-container')

      // Check if the sender is the user
      if (message.sender === 'USER') {
        messageContainer.classList.add('sender-message')
      } else {
        messageContainer.classList.add('receiver-message')
      }

      messageContainer.innerHTML = `
            <strong>${message.sender}:</strong> ${message.message}
        `
      messagesContainerDiv.appendChild(messageContainer)
    })

    // Append messages container to rightSection
    rightSection.appendChild(messagesContainerDiv)

    const sendMessageField = document.createElement('div')
    sendMessageField.classList.add('send-message')
    sendMessageField.innerHTML = `
        <input type="text" placeholder="Type your message">
        <button>Send</button>`
    rightSection.appendChild(sendMessageField)

    // Show the right section
    chatListContainer.style.flexBasis = '70%' // Adjust the width as needed
    rightSection.style.display = 'block'
  }
})
