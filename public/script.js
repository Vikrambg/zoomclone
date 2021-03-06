const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

var peer = new Peer(undefined, {
    path:'/peerjs',
    host: '/',
    port: '3030'
}); 

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false,
}).then(stream =>{
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId)=>{
        connecToNewUser(userId, stream)
    })
    let text = $('input')
    $('html').keydown((e)=>{
        if(e.which == 13 && text.val().length !== 0){
            console.log(text.val())
            socket.emit('message', text.val())
            text.val('')
        }
    })


    socket.on('createMessage', message =>{
        //console.log('this is coming from server', message)
        $('ul').append(`<li class="message"><b>user</b><br/> ${message}</li>`)
    })
})

peer.on('open', id =>{
    //console.log(id)
    socket.emit('join-room', ROOM_ID, id)
})


const connecToNewUser= (userId, stream) =>{
    //console.log(userId)
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream)=>{
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}



