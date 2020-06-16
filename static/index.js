
const template = Handlebars.compile('<div class="card" style="width: 100%; padding: 10px; margin-top: 5px;"> <h5>{{ user0 }}</h5><p>{{ content }}</p><div class="right">{{ date }} at {{ time }}</div></div>');

const template0 = Handlebars.compile('<div class="alert alert-secondary" style="text-align: center; margin-top: 5px;">{{ user0 }} has left the Chat Room</div>');

const template1 = Handlebars.compile('<div class="alert alert-success" style="text-align: center; margin-top: 5px;">{{ user0 }} has Joined the Chat Room</div>');

document.addEventListener('DOMContentLoaded', () => {

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () => { /* funtion to trigger when the socket connects */

    socket.emit('get username');

    const enter = template1({'user0': localStorage.getItem('username')});

    socket.emit('joined', enter);

    document.querySelector(".slider").scrollTop = document.querySelector(".slider").scrollHeight;

    document.querySelector('.send').addEventListener("click", () => {
      const text = document.querySelector('.typearea').value;
      const user0 = localStorage.getItem('username');
      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const word = template({'content': text, 'user0': user0, 'date': date, 'time': time});
      document.querySelector('#form1').reset();
      socket.emit('msg recieved', {'content': text, 'user0': user0, 'date': date, 'time': time, 'word': word});
    });

    document.querySelector('.send0').onclick = () => {
      localStorage.removeItem('current_room');
      const user0 = localStorage.getItem('username');
      const left = template0({'user0': user0});
      document.querySelector('.slider').scrollTop = document.querySelector('.slider').scrollHeight;
      socket.emit('left', left);
    }

    document.querySelector('#logout').onclick = () => {
      localStorage.removeItem('current_room');
      localStorage.removeItem('username');
    }
});

  socket.on('username sent', data => {

    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', data);
    }
  });

  socket.on('joined room', data => {

    const join = data['join'];
    localStorage.setItem('current_room', data['room']);
    document.querySelector('#msg-box').innerHTML += join;
    document.querySelector('.slider').scrollTop = document.querySelector('.slider').scrollHeight;
  });

  socket.on('msg display', data => {

    const mesg = data['msg'];
    document.querySelector('#msg-box').innerHTML += mesg;
    document.querySelector('.slider').scrollTop = document.querySelector('.slider').scrollHeight;
  });

  socket.on('left room', data => {

    const left = data;
    document.querySelector('#msg-box').innerHTML += left;
    document.querySelector('.slider').scrollTop = document.querySelector('.slider').scrollHeight;
  });
});
