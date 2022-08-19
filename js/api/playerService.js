import APP_CONSTS from '../common/appConsts.js';
import redirectToAuth from '../components/auth.js';
import session from '../common/session.js';

class PlayerService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Players';
	}

	async changeReady(nickname) {
		let result = null;
		await axios
			.post(
				this.url + `/ChangeReady?nickname=${nickname}`,
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
				toastr.error('Не удалось изменить статус!');
			});
		return result;
	}

	async getFigureType(nickname) {
		let result = null;
		await axios
			.get(this.url + `/GetFigureType?nickname=${nickname}`, {
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
				toastr.error('Не удалось получить тип фигуры!');
			});
		return result;
	}
}

export default new PlayerService();
