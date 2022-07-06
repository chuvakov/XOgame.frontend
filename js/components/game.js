import session from './../common/session.js';
import gameService from './../api/gameService.js';
import APP_CONSTS from '../common/appConsts.js';
import { returnToRoom } from './rooms.js';
import playerService from '../api/playerService.js';

// SignalR (Соединение)
const gameHub = new signalR.HubConnectionBuilder()
	.withUrl(APP_CONSTS.SERVER_URL + 'hubs/game', {
		skipNegotiation: true,
		transport: signalR.HttpTransportType.WebSockets,
	})
	.build();

gameHub.start();

const clearGameField = () => {
	$('.box').text('');
};

let isMyTurn = false;

//Запуск игры
export const startGame = async () => {
	clearGameField();
	let game = await gameService.get(session.roomName);

	if (game.playerTurnNickname == session.nickname) {
		$('#PlayerTurn').text('Ваш ход');
		isMyTurn = true;
	} else {
		$('#PlayerTurn').text('Ход противника');
		isMyTurn = false;
	}

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
	gameHub.on('DoStep-' + session.roomName, async function (isFinish) {
		if (isFinish) {
			return;
		}

		let game = await gameService.get(session.roomName);

		if (game.playerTurnNickname == session.nickname) {
			$('#PlayerTurn').text('Ваш ход');
			isMyTurn = true;
		} else {
			$('#PlayerTurn').text('Ход противника');
			isMyTurn = false;
		}

		for (let step of game.steps) {
			$(`.box[data-number="${step.cellNumber}"]`).text(step.figureType);
		}
	});

	// SignalR (Приемник)
	gameHub.on('GameFinished-' + session.nickname, function (response) {
		let showMessage;

		if (response.result == 0) {
			showMessage = () =>
				Swal.fire({
					icon: 'success',
					title: 'Вы победили!',
					showConfirmButton: false,
					timer: 2500,
					timerProgressBar: true,
				});
		} else if (response.result == 1) {
			showMessage = () =>
				Swal.fire({
					icon: 'error',
					title: 'Вы проиграли!',
					showConfirmButton: false,
					timer: 2500,
					timerProgressBar: true,
				});

			$(`.box[data-number="${response.cell}"]`).text(response.figureType);
		} else {
			showMessage = () =>
				Swal.fire({
					icon: 'warning',
					title: 'Ничья!',
					showConfirmButton: false,
					timer: 2500,
					timerProgressBar: true,
				});

			$(`.box[data-number="${response.cell}"]`).text(response.figureType);
		}

		setTimeout(() => {
			showMessage();
			returnToRoom();
			clearGameField();
		}, 2000);
	});

	session.figureType = await playerService.getFigureType(session.nickname);
};

$(function () {
	//Обработка хода
	$('.box').click(async function () {
		let cellNumber = $(this).data('number');
		let result = await gameService.doStep(cellNumber, session.nickname);

		if (result == null) return;

		$(this).text(session.figureType);

		// SignalR (Отправка сигнала)
		await gameHub.invoke('DoStep', session.roomName, result.isFinish);

		if (isMyTurn) {
			$('#PlayerTurn').text('Ход противника');
		} else {
			$('#PlayerTurn').text('Ваш ход');
		}
		isMyTurn = !isMyTurn;
	});
});
