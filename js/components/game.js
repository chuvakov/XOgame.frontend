import session from './../common/session.js';
import gameService from './../api/gameService.js';

$(function () {
	$('.box').click(async function () {
		let cellNumber = $(this).data('number');
		let result = await gameService.doStep(cellNumber, session.nickname);

		if (result == null) return;

		$(this).text(session.figureType);

		if (result.isWinner == true) {
			alert('Вы победили!');
		}
	});

	const startGame = async () => {
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
	};

	let gameIntervalId = setInterval(() => {
		let playerReadyCount = $('.playerStatus.text-bg-success').length;

		if (playerReadyCount === 2) {
			clearInterval(gameIntervalId);
			startGame();
		}
	}, 1000);
});
