/**
 * P2P Bridge - WebRTC Manual Signaling Implementation
 * This file contains the logic for establishing a peer-to-peer connection
 * without a signaling server.
 */

class P2PBridge {
  constructor() {
    this.pc = null;
    this.elements = this.getElements();
    this.setupListeners();
  }

  initPC() {
    if (this.pc) {
      this.pc.close();
    }
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    this.pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', this.pc.iceConnectionState);
      this.updateStatus(this.pc.iceConnectionState);

      if (this.pc.iceConnectionState === 'disconnected') {
        this.elements.messageInput.disabled = true;
        this.elements.sendBtn.disabled = true;
      } else if (this.pc.iceConnectionState === 'connected') {
        this.elements.messageInput.disabled = false;
        this.elements.sendBtn.disabled = false;
      }
    };

    this.pc.ondatachannel = (e) => {
      console.log('Data channel received');
      this.setupDataChannel(e.channel);
    };
  }

  getElements() {
    return {
      hostBtn: document.getElementById('host-btn'),
      joinBtn: document.getElementById('join-btn'),
      bridgeSection: document.getElementById('bridge-section'),
      hostControls: document.getElementById('host-controls'),
      joinControls: document.getElementById('join-controls'),
      hostKey: document.getElementById('host-key'),
      hostAnswerInput: document.getElementById('host-answer-input'),
      joinOfferInput: document.getElementById('join-offer-input'),
      joinAnswerKey: document.getElementById('join-answer-key'),
      createAnswerBtn: document.getElementById('create-answer-btn'),
      finalConnectBtn: document.getElementById('final-connect-btn'),
      statusText: document.getElementById('status-text'),
      indicator: document.querySelector('.indicator'),
      setupScreen: document.getElementById('setup-screen'),
      chatScreen: document.getElementById('chat-screen'),
      messageList: document.getElementById('message-list'),
      messageForm: document.getElementById('message-form'),
      sendBtn: document.getElementById('send-btn'),
      messageInput: document.getElementById('message-input'),
      copyHostKeyBtn: document.getElementById('copy-host-key-btn'),
      copyJoinKeyBtn: document.getElementById('copy-join-key-btn'),
      disconnectBtn: document.getElementById('disconnect-btn'),
      joinModal: document.getElementById('join-modal'),
      closeModalBtn: document.getElementById('close-modal-btn'),
    };
  }

  setupListeners() {
    this.elements.hostBtn.onclick = () => this.startHosting();
    this.elements.joinBtn.onclick = () => this.startJoining();
    this.elements.createAnswerBtn.onclick = () => this.handleOffer();
    this.elements.finalConnectBtn.onclick = () => this.handleAnswer();
    this.elements.copyHostKeyBtn.onclick = () =>
      this.copyToClipboard(this.elements.hostKey);
    this.elements.copyJoinKeyBtn.onclick = () =>
      this.copyToClipboard(this.elements.joinAnswerKey);
    this.elements.disconnectBtn.onclick = () => location.reload();
    this.elements.closeModalBtn.onclick = () =>
      this.elements.joinModal.classList.add('hidden');

    // Close modal on outside click
    // window.onclick = (e) => {
    //   if (e.target === this.elements.joinModal) {
    //     this.elements.joinModal.classList.add('hidden');
    //   }
    // };

    this.elements.messageForm.onsubmit = (e) => {
      e.preventDefault();
      this.sendMessage();
    };

    // WebRTC Events moved to initPC()
  }

  async startHosting() {
    this.initPC();
    this.elements.hostControls.classList.remove('hidden');
    this.elements.bridgeSection.classList.remove('hidden');
    this.elements.hostBtn.classList.add('hidden');
    this.elements.joinBtn.classList.add('hidden');

    // Create data channel as host
    this.dc = this.pc.createDataChannel('chat');
    this.setupDataChannel(this.dc);

    const offer = await this.pc.createOffer();

    // Update key as candidates arrive
    this.pc.onicecandidate = (e) => {
      if (this.pc.localDescription) {
        this.elements.hostKey.value = btoa(
          JSON.stringify(this.pc.localDescription),
        );
      }
    };

    await this.pc.setLocalDescription(offer);

    // Initial value
    this.elements.hostKey.value = btoa(
      JSON.stringify(this.pc.localDescription),
    );
  }

  startJoining() {
    this.elements.joinControls.classList.remove('hidden');
    this.elements.bridgeSection.classList.remove('hidden');
    this.elements.hostBtn.classList.add('hidden');
    this.elements.joinBtn.classList.add('hidden');
  }

  async handleOffer() {
    try {
      const input = this.elements.joinOfferInput.value.trim();
      if (!input) return;

      this.initPC();
      console.log('Processing Offer...');

      const rawOffer = atob(input);
      const offer = JSON.parse(rawOffer);

      // Set listener to update as candidates arrive
      this.pc.onicecandidate = (e) => {
        if (this.pc.localDescription) {
          this.elements.joinAnswerKey.value = btoa(
            JSON.stringify(this.pc.localDescription),
          );
          // Show modal immediately so user sees "Generating..."
          this.elements.joinModal.classList.remove('hidden');
          console.log('Updated Answer Key with candidate');
          console.log(this.elements.joinAnswerKey.value);
        }
      };

      await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('Remote description set');

      const answer = await this.pc.createAnswer();

      await this.pc.setLocalDescription(answer);
      console.log('Local description set');

      this.elements.joinAnswerKey.value = btoa(
        JSON.stringify(this.pc.localDescription),
      );
    } catch (err) {
      console.error('Error in handleOffer:', err);
      alert(
        'Invalid Host Key. Please make sure you copied the entire key correctly.',
      );
    }
  }

  async handleAnswer() {
    try {
      const rawAnswer = atob(this.elements.hostAnswerInput.value.trim());
      const answer = JSON.parse(rawAnswer);
      await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      console.error(err);
      alert('Invalid Answer Key. Please check and try again.');
    }
  }

  setupDataChannel(channel) {
    this.dc = channel;
    this.dc.onopen = () => console.log('Data channel open');
    this.dc.onmessage = (e) => this.appendMessage('received', e.data);
  }

  sendMessage() {
    const text = this.elements.messageInput.value.trim();
    if (text && this.dc && this.dc.readyState === 'open') {
      this.dc.send(text);
      this.appendMessage('sent', text);
      this.elements.messageInput.value = '';
    }
  }

  appendMessage(type, text) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    this.elements.messageList.appendChild(msg);
    this.elements.messageList.scrollTop =
      this.elements.messageList.scrollHeight;
  }

  updateStatus(state) {
    let label = state.charAt(0).toUpperCase() + state.slice(1);

    if (state === 'connected' || state === 'completed') {
      this.elements.indicator.classList.add('connected');
      label = 'Connected';
      this.showChat();
    } else if (state === 'checking') {
      label = 'Connecting...';
      this.elements.indicator.classList.remove('connected');
    } else if (state === 'failed' || state === 'disconnected') {
      label = 'Connection Failed';
      this.elements.indicator.classList.remove('connected');
    } else {
      this.elements.indicator.classList.remove('connected');
    }

    this.elements.statusText.textContent = label;
  }

  showChat() {
    this.elements.setupScreen.classList.add('hidden');
    this.elements.chatScreen.classList.remove('hidden');
  }

  copyToClipboard(area) {
    area.select();
    document.execCommand('copy');
    const btn = area.nextElementSibling;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = originalText), 2000);
  }
}

// Initialize
new P2PBridge();
