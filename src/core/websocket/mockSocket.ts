import EventEmitter from 'events';

class MockWebSocket extends EventEmitter {
  connect() {
    setTimeout(() => {
      this.emit('open');
    }, 500);
  }

  send(data: any) {
    // Simulate server echoing or processing
    console.log('WS Send:', data);
  }

  simulateIncoming(event: string, data: any) {
    this.emit('message', JSON.stringify({ event, data }));
  }
}

export const socket = new MockWebSocket();
