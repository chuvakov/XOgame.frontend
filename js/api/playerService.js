import APP_CONSTS from '../common/appConsts.js';

class PlayerService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Players';
	}

	async changeReady(nickname) {
		let result = null;
		await axios
			.post(this.url + `/ChangeReady?nickname=${nickname}`)
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось изменить статус!');
			});
		return result;
	}

	async getFigureType(nickname) {
		let result = null;
		await axios
			.get(this.url + `/GetFigureType?nickname=${nickname}`)
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось получить тип фигуры!');
			});
		return result;
	}
}

export default new PlayerService();
