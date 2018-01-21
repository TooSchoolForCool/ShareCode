import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()
export class CollaborationService {

  public collaboration_socket: any;

  constructor() { }

  // socket initialization
  // Upload session_id to remote server
  // On the server side, server will record session_id and its socket_id
  public init(editor: any, session_id: string): void {
    // upload current session_id to remote server
    this.collaboration_socket = io(window.location.origin, { query: 'session_id=' + session_id });

    // listening from server, check if there is changes available from others
    this.collaboration_socket.on('change', (update: string) => {
      // console.log('collaboration: editor changed by others' + update);
      // change json string to a json object
      update = JSON.parse(update);
      // save current version to the editor.lastAppliedChange
      editor.lastAppliedChange = update;
      // change current editor content according to updates
      editor.getSession().getDocument().applyDeltas([update]);
    });
  }

  public uploadChange(update: string): void {
    this.collaboration_socket.emit('change', update);
  }
}
