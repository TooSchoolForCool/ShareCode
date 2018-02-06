module.exports = function(io) {
  var collaborations = {};
  var socket_id2session_id = {};

  io.on('connection', function (socket) {
    var session_id = socket.handshake.query['session_id'];

    socket_id2session_id[socket.id] = session_id;

    // check current session_id is in the collaborations list
    if ( !(session_id in collaborations) ) {
      collaborations[session_id] = {
        'participants': []
      };
    }
    // check if current socket_id is already exist in the participants list
    if( !(socket.id in collaborations[session_id]['participants']) ) {
      collaborations[session_id]['participants'].push(socket.id);
    }

    socket.on('change', function(update) {
      var session_id = socket_id2session_id[socket.id];

      // send change to every socket_id according to its associated session_id
      forwardEvent(session_id, 'change', update);
    });

    socket.on('cursorMove', function(cursor) {
      var session_id = socket_id2session_id[socket.id];
      var cursor_js = JSON.parse(cursor);
      cursor_js['socket_id'] = socket.id;

      // send change to every socket_id according to its associated session_id
      forwardEvent(session_id, 'cursorMove', JSON.stringify(cursor_js));
    });

    function forwardEvent(session_id, event_name, event_content) {
      if( session_id in collaborations ) {
        var participants = collaborations[session_id]['participants'];
        for(var i = 0; i < participants.length; i++) {
          if(socket.id !== participants[i]) {
            io.to(participants[i]).emit(event_name, event_content);
          }
        }
      } else {
        console.error('[ERROR]: Cannot tie socket_id to any session_id in collaborations');
      }
    }
  });
};
