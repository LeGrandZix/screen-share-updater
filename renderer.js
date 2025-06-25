const { ipcRenderer } = require('electron');

let localStream = null;
let peerConnections = {};
let socket = null;
let roomId = null;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const localVideo = document.getElementById('localVideo');
const joinBtn = document.getElementById('joinBtn');
const createBtn = document.getElementById('createBtn');
const roomIdInput = document.getElementById('roomId');
const updateBtn = document.getElementById('updateBtn');

// Démarrer le partage d'écran
startBtn.addEventListener('click', async () => {
    try {
        const sources = await ipcRenderer.invoke('get-sources');
        const screenSource = sources.find(source => source.name === 'Entire Screen') || sources[0];
        
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: screenSource.id
                }
            }
        });
        
        localVideo.srcObject = localStream;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        // Partager avec les pairs connectés
        Object.values(peerConnections).forEach(pc => {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        });
        
    } catch (error) {
        console.error('Erreur lors du partage d\'écran:', error);
        alert('Impossible de démarrer le partage d\'écran');
    }
});

// Arrêter le partage
stopBtn.addEventListener('click', () => {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
        localStream = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

// Créer une salle
createBtn.addEventListener('click', () => {
    roomId = Math.random().toString(36).substring(2, 8);
    roomIdInput.value = roomId;
    connectToSignalingServer();
    alert(`Salle créée: ${roomId}`);
});

// Rejoindre une salle
joinBtn.addEventListener('click', () => {
    roomId = roomIdInput.value.trim();
    if (roomId) {
        connectToSignalingServer();
    } else {
        alert('Veuillez entrer un ID de salle');
    }
});

// Vérifier les mises à jour
updateBtn.addEventListener('click', async () => {
    await ipcRenderer.invoke('check-for-updates');
    alert('Vérification des mises à jour en cours...');
});

// Connexion au serveur de signalisation (simulation)
function connectToSignalingServer() {
    // Simulation d'une connexion WebSocket
    console.log(`Connexion à la salle: ${roomId}`);
    
    // Dans une vraie application, vous utiliseriez WebSocket ou Socket.IO
    // pour la signalisation entre pairs
    
    // Exemple de structure pour WebRTC:
    /*
    socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = handleSignalingMessage;
    socket.send(JSON.stringify({
        type: 'join-room',
        roomId: roomId
    }));
    */
}

// Gestion des messages de signalisation
function handleSignalingMessage(event) {
    const message = JSON.parse(event.data);
    
    switch (message.type) {
        case 'offer':
            handleOffer(message);
            break;
        case 'answer':
            handleAnswer(message);
            break;
        case 'ice-candidate':
            handleIceCandidate(message);
            break;
    }
}

// Configuration WebRTC
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// Créer une connexion peer
function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection(rtcConfig);
    
    pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
            socket.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate,
                to: peerId
            }));
        }
    };
    
    pc.ontrack = (event) => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.className = 'remote-video';
        document.getElementById('remoteVideos').appendChild(remoteVideo);
    };
    
    return pc;
}