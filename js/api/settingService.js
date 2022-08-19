import APP_CONSTS from '../common/appConsts.js';
import redirectToAuth from '../components/auth.js';
import session from '../common/session.js';

class SettingService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Settings';
	}

	async getAll(nickname) {
		let result = null;
		await axios
			.get(this.url + '/GetAll', {
				params: {
					nickname: nickname,
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
				toastr.error('Не удалось загрузить настройки!');
			});

		return result;
	}

	async update(nickname, settings, avatar) {
		await axios
			.post(
				this.url + '/Update',
				{
					nickname: nickname,
					settings: settings,
					avatar: avatar,
				},
				{
					headers: {
						Authorization: 'Bearer ' + session.token,
					},
				}
			)
			.then(function () {})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось сохранить настройки!');
				throw new Error();
			});

		await axios
			.post(this.url + '/LoadAvatar?nickname=' + nickname, avatar, {
				headers: {
					'Content-type': 'multipart/form-data',
					Authorization: 'Bearer ' + session.token,
				},
			})
			.then(function () {})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось сохранить аватар!');
				throw new Error();
			});
		toastr.success('Настройки сохранены!');
	}

	async loadAvatar(nickname, avatar) {}
}

export default new SettingService();
