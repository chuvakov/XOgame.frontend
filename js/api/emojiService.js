import APP_CONSTS from '../common/appConsts.js';
import redirectToAuth from '../components/auth.js';
import session from '../common/session.js';

class EmojiService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Emoji';
	}

	async getAllGroups() {
		let result = null;
		await axios
			.get(this.url + '/GetAllGroups', {
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
				toastr.error('Не удалось получить эмоджи');
				throw new Error();
			});
		return result;
	}
}

export default new EmojiService();
