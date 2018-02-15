var redis_client = require('../modules/redisClient');
var redisPrint = require('../modules/redisClient');

const TIME_OUT_SECENDS = 3600

module.exports = function(io) {
  var collaborations = {};
  var socket_id2session_id = {};

  // session path
  var session_path = "/temp_sessions";

  io.on('connection', function (socket) {
    var session_id = socket.handshake.query['session_id'];

    socket_id2session_id[socket.id] = session_id;

    if ( session_id in collaborations) {
      // check if current socket_id is already exist in the participants list
      if( !(socket.id in collaborations[session_id]['participants']) ) {
        collaborations[session_id]['participants'].push(socket.id);
      }
    } else {
      redis_client.get(session_path + '/' + session_id, function(data) {
        if (data) {
          console.log('session terminated previously, pulling back from redis')
          collaborations[session_id] = {
            'cached_events': JSON.parse(data),
            'participants': []
          };
        } else {
          console.log('create new session');
          collaborations[session_id] = {
            'cached_events': [],
            'participants': []
          };
        }
        // add new user
        collaborations[session_id]['participants'].push(socket.id);
      });
    }

    socket.on('change', function(update) {
      var session_id = socket_id2session_id[socket.id];

      // save changing log into event cache
      if (session_id in collaborations) {
        collaborations[session_id]['cached_events'].push(['change', update, Date.now()]);
      }

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

    socket.on('restoreBuffer', function() {
      let session_id = socket_id2session_id[socket.id];
      console.log('restoring buffer for session: ' + session_id + ', socket: ' + socket.id);
      if (session_id in collaborations) {
        let change_events = collaborations[session_id]['cached_events'];
        for (let i = 0; i < change_events.length; i++) {
          socket.emit(change_events[i][0], change_events[i][1]);
        }
      }
    });

    socket.on('disconnect', function() {
      let session_id = socket_id2session_id[socket.id];
      console.log('socket' + socket.id + 'disconnected.');

      if (session_id in collaborations) {
        let participants = collaborations[session_id]['participants'];
        let index = participants.indexOf(socket.id);
        if (index >= 0) {
          participants.splice(index, 1);
          if (participants.length === 0) {
            console.log('last participant left. Storing in Redis');
            let key = session_path + "/" + session_id;
            let value = JSON.stringify(collaborations[session_id]['cached_events']);
            redis_client.set(key, value, redis_client.redisPrint);
            redis_client.expire(key, TIME_OUT_SECENDS);
            delete collaborations[session_id];
          }
        }
      }
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
