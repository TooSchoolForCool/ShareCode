// module.exports = function(io) {
//   io.on('connetion', (socket) => {
//     console.log(socket);
//
//     var msg = socket.handshake.query['message'];
//     console.log(msg);
//
//     io.to(socket.id).emit('message', 'hehe from server');
//   });
// }

module.exports = function(io) {
  io.on('connection', function (socket) {
    console.log(socket);

    var msg = socket.handshake.query['message'];
    console.log('message: ' + msg);

    io.to(socket.id).emit('message', 'hehe from server');
  });
};
