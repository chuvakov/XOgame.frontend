import session from './../common/session.js';
import gameService from './../api/gameService.js';
import APP_CONSTS from '../common/appConsts.js';
import { returnToRoom } from './rooms.js';

// SignalR (Соединение)
const gameHub = new signalR.HubConnectionBuilder()
	.withUrl(APP_CONSTS.SERVER_URL + 'hubs/game', {
		skipNegotiation: true,
		transport: signalR.HttpTransportType.WebSockets,
	})
	.build();

gameHub.start();

//Запуск игры
export const startGame = async () => {
	let game = await gameService.get(session.roomName);

	let oponnent = game.players.find((p) => p.nickname != session.nickname);

	$('#OpponentNickname').text(oponnent.nickname);
	$('#PlayerNickname').text(session.nickname);

	for (let step of game.steps) {
		$(`.box[data-number="${step.cellNumber}"]`).text(step.figureType);
	}

	$('#Room').addClass('d-none');
	$('#RoomFooter').addClass('d-none');
	$('#Game').removeClass('d-none');

	// SignalR (Приемник)
	gameHub.on('DoStep-' + session.roomName, async function () {
		let game = await gameService.get(session.roomName);
		for (let step of game.steps) {
			$(`.box[data-number="${step.cellNumber}"]`).text(step.figureType);
		}
	});

	// SignalR (Приемник)
	gameHub.on('GameFinished-' + session.nickname, async function () {
		returnToRoom();
	});
};

$(function () {
	//Обработка хода
	$('.box').click(async function () {
		let cellNumber = $(this).data('number');
		let result = await gameService.doStep(cellNumber, session.nickname);

		if (result == null) return;

		$(this).text(session.figureType);

		// SignalR (Отправка сигнала)
		await gameHub.invoke('DoStep', session.roomName);

		if (result.isWinner == true) {
			//alert('Вы победили!');
		}
	});
});
