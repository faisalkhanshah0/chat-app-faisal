

        var socket = io();
        var info = $.deparam(window.location.search);
        function scrollToBottom() {
            var messages = $('#message-box');
            var newMessage = messages.children('div.media:last-child');
            
            var clientHeight = messages.prop('clientHeight');
            var scrollTop = messages.prop('scrollTop');
            var scrollHeight = messages.prop('scrollHeight');
            var newMessageHeight = newMessage.innerHeight();
            var lastMessageHeight = newMessage.prev().innerHeight();
            if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
            {
                messages.scrollTop(scrollHeight);
            }
        }

        socket.on('connect', () => {
            
            socket.emit('join', info, function(err) {
                    if(err)
                    {
                        alert(err);
                        window.location.href = '/';
                    }
                    else
                    {
                        // console.log('No error');
                    }
                    
                }); 
        });
        socket.on("disconnect",() => {
            // console.log('disconnected from server');
        });

        socket.on("updateUserList",(usersList) => {
            // console.log(usersList);
            // var usertemp = $('#users-template').html();
            var html = '';
            usersList.forEach((user) => {
                // console.log("hello", user);
                // html += Mustache.render(usertemp,{
                //     username : userloop.name
                // });
                html += `<li>${user}</li>`;
            });
            
            $('#users-box').html(html);
        });
        socket.on('newMessage', (msg) => {
            var messagetemp = $('#message-template').html();
            var html = Mustache.render(messagetemp, {
                from : msg.from,
                text : msg.text,
                createdAt : msg.createdAt
            });
            // var html = `<div class="media">
            //                 <div class="media-left">
            //                 <img src="images/avatar.png" class="media-object img-rounded-chat" style="width:45px">
            //                 </div>
            //                 <div class="media-body">
            //                 <h4 class="media-heading">${msg.from} <small><i>Sent at ${msg.createdAt}</i></small></h4>
            //                 <p><em>${msg.text}</em></p>
            //                 </div>
            //             </div>`;
            $( "#message-box" ).append(html);
            scrollToBottom()
        });
        socket.on('newLocation', (msg) => {
            var locationtemp = $('#location-template').html();
            var html = Mustache.render(locationtemp, {
                from : msg.from,
                url : msg.url,
                createdAt : msg.createdAt
            });
            // var html = `<div class="media">
            //                 <div class="media-left">
            //                 <img src="images/avatar.png" class="media-object img-rounded-chat" style="width:45px">
            //                 </div>
            //                 <div class="media-body">
            //                 <h4 class="media-heading">${msg.from} <small><i>Sent at ${msg.createdAt}</i></small></h4>
            //                 <p><a target="_blank" href="${msg.url}">My Location</a></p>
            //                 </div>
            //             </div>`;
            $( "#message-box" ).append(html);
            scrollToBottom()
        });
        $(document).ready(function() {
            $('#chat_form').on('submit', function(e){
                e.preventDefault();
              
            });
            var send = $('#send');
            var sharelocation = $('#sharelocation');
            send.on('click', function(){
                var text = $('#message').val();
                
                socket.emit('createMessage', {
                from : info.name,
                text,
                createdAt : moment().format('hh:mm A')
                }, function(data) {
                    // console.log('Got it.', data);
                });

            });
            sharelocation.on('click', function(){
                if(!navigator.geolocation)
                {
                    return alert('Geolocation is not supported by your browser.');
                }

                navigator.geolocation.getCurrentPosition(function(position) {
                    var url = `https://www.google.co.in/maps/?q=${position.coords.latitude},${position.coords.longitude}`;
                    // console.log(info);
                    socket.emit('shareLocation', {
                        from : info.name,
                        url,
                        createdAt : moment().format('hh:mm A')
                        }, function(data) {
                            // console.log('Got it.', data);
                        }); 
                });
            });


          });
        


