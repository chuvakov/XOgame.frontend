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
	$('.box').removeClass('winner');
	$('#Field').removeClass('vertical horizontal leftSlash rightSlash');
	$('#PlayerTurn').removeClass('d-none');
	$('#Start').attr('disabled', true);
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

	let opponent = game.players.find((p) => p.nickname != session.nickname);
	let player = game.players.find((p) => p.nickname == session.nickname);

	$('#OpponentNickname').text(opponent.nickname);
	$('#PlayerNickname').text(session.nickname);

	if (opponent.avatar != null) {
		$('#OpponentAvatar').attr('src', `data:img/png;base64,${opponent.avatar}`);
	} else {
		$('#OpponentAvatar').attr('src', '/img/opponent.png');
	}

	if (player.avatar != null) {
		$('#PlayerAvatar').attr('src', `data:img/png;base64,${player.avatar}`);
	} else {
		$('#PlayerAvatar').attr('src', '/img/player.png');
	}

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

		if (session.settings.soundSettings.isEnabledStep) {
			let audio = new Audio();
			audio.src = '/music/doStep.mp3';
			audio.play();
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

			if (session.settings.soundSettings.isEnabledWin) {
				let audio = new Audio();
				audio.src = '/music/win.mp3';
				audio.play();
			}
		} else if (response.result == 1) {
			showMessage = () =>
				Swal.fire({
					icon: 'error',
					title: 'Вы проиграли!',
					showConfirmButton: false,
					timer: 2500,
					timerProgressBar: true,
				});

			if (session.settings.soundSettings.isEnabledLose) {
				let audio = new Audio();
				audio.src = '/music/lose.mp3';
				audio.play();
			}

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

			if (session.settings.soundSettings.isEnabledDraw) {
				let audio = new Audio();
				audio.src = '/music/draw.mp3';
				audio.play();
			}

			$(`.box[data-number="${response.cell}"]`).text(response.figureType);
		}

		if (response.winnerPosition !== undefined) {
			if (response.winnerPosition.type == 0) {
				$('#Field').addClass('vertical');
			}
			if (response.winnerPosition.type == 1) {
				$('#Field').addClass('horizontal');
			}
			if (response.winnerPosition.type == 2) {
				$('#Field').addClass('leftSlash');
			}
			if (response.winnerPosition.type == 3) {
				$('#Field').addClass('rightSlash');
			}

			response.winnerPosition.cells.forEach((cell) => $(`.box[data-number="${cell}"]`).addClass('winner'));
		}

		$('#PlayerTurn').addClass('d-none');

		setTimeout(() => {
			showMessage();
			returnToRoom();
			clearGameField();
		}, 2000);
	});

	session.figureType = await playerService.getFigureType(session.nickname);

	if (session.settings.soundSettings.isEnabledStart) {
		let audio = new Audio();
		audio.src = '/music/startGame.mp3';
		audio.play();
	}
};

$(function () {
	//Обработка хода
	$('.box').click(async function () {
		if (!isMyTurn) {
			return;
		}
		isMyTurn = !isMyTurn;

		let cellNumber = $(this).data('number');
		let result = await gameService.doStep(cellNumber, session.nickname);

		if (result == null) {
			isMyTurn = !isMyTurn;
			return;
		}

		$(this).text(session.figureType);

		// SignalR (Отправка сигнала)
		await gameHub.invoke('DoStep', session.roomName, result.isFinish);

		if (!isMyTurn) {
			$('#PlayerTurn').text('Ход противника');
		} else {
			$('#PlayerTurn').text('Ваш ход');
		}

		if (session.settings.soundSettings.isEnabledStep) {
			let audio = new Audio();
			audio.src = '/music/doStep.mp3';
			audio.play();
		}
		console.log(session.settings);
	});
});
