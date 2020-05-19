const socket = io()

// server (emit) => client (receive) --acknowledgement ==> server
// client (emit) => server (receive) --acknowledgement ==> client

// Elements 
// const $messageForm = document.querySelector('#message-form')
// const $messageFromInput = document.querySelector('input')
// const $messageFormButton = document.querySelector('#send-btn')
// const $sendLocationButton = document.querySelector('#send-location')
// const $messages = document.querySelector('#messages')

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage',(message) => {
    const html = Mustache.render(locationMessageTemplate, {
         url: message.url,
         createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable form button
    $messageFormButton.setAttribute('disabled', 'disabled')

    
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        // enable form
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

// Know user location on click button
    $sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
       return alert('Geolocation is not supported by your browser.')
   }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
       
        socket.emit('sendLocation',  {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
         }, () => {
             $sendLocationButton.removeAttribute('disabled')
             console.log("Location shared!")
         })
    })
})