import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors';

declare var io: any;
declare var ace: any;

@Injectable()
export class CollaborationService {

  public collaboration_socket: any;
  private clients_info: Object = {};
  private client_num: number = 0;

  constructor() { }

  // socket initialization
  // Upload session_id to remote server
  // On the server side, server will record session_id and its socket_id
  public init(editor: any, session_id: string): void {
    // upload current session_id to remote server
    this.collaboration_socket = io(window.location.origin, { query: 'session_id=' + session_id });

    // listening from server, check if there is changes available from others
    this.collaboration_socket.on('change', (update: string) => {
      // change json string to a json object
      update = JSON.parse(update);
      // save current version to the editor.lastAppliedChange
      editor.lastAppliedChange = update;
      // change current editor content according to updates
      editor.getSession().getDocument().applyDeltas([update]);
    });

    // listening from server, check if other users' cursor move happened
    this.collaboration_socket.on('cursorMove', (cursor) => {
      let session = editor.getSession();
      cursor = JSON.parse(cursor);
      let x = cursor['row'];
      let y = cursor['column'];
      let change_client_id = cursor['socket_id'];

      if (change_client_id in this.clients_info) {
        session.removeMarker(this.clients_info[change_client_id]['marker']);
      } else {
        this.clients_info[change_client_id] = {};

        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = ".editor_cursor_" + change_client_id
          + " { position:absolute; background:" + COLORS[this.client_num % COLORS.length] + ";"
          + " z-index: 100; width: 3px !important; }";

        document.body.appendChild(css);
        this.client_num++;
      }

      let range = ace.require('ace/range').Range;
      let new_marker = session.addMarker(new range(x, y, x, y + 1),
        'editor_cursor_' + change_client_id, true);
      this.clients_info[change_client_id]['marker'] = new_marker;
    });
  }

  public uploadChange(update: string): void {
    this.collaboration_socket.emit('change', update);
  }

  public cursorMove(cursor: string): void {
    this.collaboration_socket.emit('cursorMove', cursor);
  }

  public restoreBuffer(): void {
    this.collaboration_socket.emit("restoreBuffer");
  }
}
