import emojiPicker from '../../libs/emojipicker.js';
import emojiService from '../api/emojiService.js';
import APP_CONSTS from '../common/appConsts.js';
import session from '../common/session.js';

// SignalR (Соединение)
const chatHub = new signalR.HubConnectionBuilder()
	.withUrl(APP_CONSTS.SERVER_URL + 'hubs/chat', {
		skipNegotiation: true,
		transport: signalR.HttpTransportType.WebSockets,
	})
	.build();

chatHub.start();

const initChat = () => {
	// SignalR (Приемник)
	chatHub.on('SendMessage-' + session.nickname, function (message) {
		$('.opponent .message').text(message);
		$('.opponent .message').fadeIn();

		setTimeout(() => {
			$('.opponent .message').fadeOut();
		}, 2000);
	});

	//Эмоджи
	emojiPicker({
		selector: '#EmojiPicker',
		input: '#Emoji',
		ajax: function () {
			let emojiGroups = emojiService.getAllGroups();
			return emojiGroups;
		},
	});
};

$(function () {
	$('.chat-inp .opts .send').click(async function () {
		var val = $('.chat-inp .input').val().trim();
		if (val.length > 0) {
			if (val === '') {
				return;
			}

			// Вызов серверного метода Хаба (SignalR)
			await chatHub.invoke('SendMessage', val, session.nickname);

			$('.player:not(.opponent) .message').text(val);
			$('.player:not(.opponent) .message').fadeIn();

			if ($('.chat-inp .input').hasClass('disabled')) {
				return;
			}

			$('.chat-inp .input').val('');
			$('.chats-text-cont div').remove();
			$('.chat-inp .input').addClass('disabled');

			setTimeout(() => {
				$('.player:not(.opponent) .message').fadeOut();
				setTimeout(() => {
					$('.player:not(.opponent) .message').text('');
				}, 300);
				$('.chat-inp .input').removeClass('disabled');
			}, 2000);
		}
	});

	$('input,.input').focus(function () {
		$(document).keypress(function (e) {
			if (e.which == 13) {
				$('.chat-inp .opts .send').click();
			}
		});
	});
});

export default initChat;
