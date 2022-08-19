import APP_CONSTS from '../common/appConsts.js';
import redirectToAuth from '../components/auth.js';
import session from '../common/session.js';

class GameService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Games';
	}

	async doStep(cell, nickname) {
		let result = null;
		await axios
			.post(
				this.url + '/DoStep',
				{
					cellNumber: cell,
					nickname: nickname,
				},
				{
					headers: {
						Authorization: 'Bearer ' + session.token,
					},
				}
			)
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error(error.response.data);
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
				headers: {
					Authorization: 'Bearer ' + session.token,
				},
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось получить данные игры');
			});
		return result;
	}

	async startGame(roomName) {
		let result = null;
		await axios
			.post(
				this.url + '/StartGame?roomName=' + roomName,
				{},
				{
					headers: {
						Authorization: 'Bearer ' + session.token,
					},
				}
			)
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error(error.response.data);
			});
		return result;
	}
}

export default new GameService();
