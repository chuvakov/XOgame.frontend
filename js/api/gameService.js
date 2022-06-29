import APP_CONSTS from '../common/appConsts.js';

class GameService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Games';
	}

	async doStep(cell, nickname) {
		let result = null;
		await axios
			.post(this.url + '/DoStep', {
				cellNumber: cell,
				nickname: nickname,
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось сделать ход');
			});
		return result;
	}

	async get(roomName) {
		let result = null;
		await axios
			.get(this.url + '/Get', {
				params: {
					roomName,
				},
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось получить данные игры');
			});
		return result;
	}
}

export default new GameService();
