import APP_CONSTS from '../common/appConsts.js';

class AccountService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Account';
	}

	async login(nickname) {
		await axios
			.post(this.url + '/Login', {
				nickname: nickname,
			})
			.then(function (response) {
				toastr.success('Авторизация прошла успешно!');
			})
			.catch(function (error) {
				toastr.error('Не удалось авторизоваться!');
				throw new Error();
			});
	}
}

export default new AccountService();
