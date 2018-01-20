import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()
export class CollaborationService {

  public collaboration_socket: any;

  constructor() { }

  public init(): void {
    this.collaboration_socket = io(window.location.origin, { query: 'message=' + '123' });

    this.collaboration_socket.on('message', message => {
      console.log('received: ' + message);
    });
  }

}
