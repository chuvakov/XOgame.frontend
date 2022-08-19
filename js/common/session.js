const DEFAULT_EXPIRES = 10;

class Session {
	#nickname;
	#roomName;
	#figureType;
	#isGameStarted;
	#settings;
	#token;

	constructor() {
		this.#nickname = $.cookie('nickname');
		this.#roomName = $.cookie('roomName');
		this.#figureType = $.cookie('figureType');
		this.#isGameStarted = $.cookie('isGameStarted');
		this.#token = $.cookie('token');
	}

	get token() {
		return this.#token;
	}

	set token(token) {
		this.#token = token;
		$.cookie('token', token, { expires: DEFAULT_EXPIRES });
	}

	get settings() {
		return this.#settings;
	}

	set settings(settings) {
		this.#settings = settings;
	}

	get nickname() {
		return this.#nickname;
	}

	set nickname(nickname) {
		this.#nickname = nickname;
		$.cookie('nickname', nickname, { expires: DEFAULT_EXPIRES });
	}

	get roomName() {
		return this.#roomName;
	}

	set roomName(roomName) {
		this.#roomName = roomName;
		$.cookie('roomName', roomName, { expires: DEFAULT_EXPIRES });
	}

	get figureType() {
		return this.#figureType;
	}

	set figureType(value) {
		this.#figureType = value;
		$.cookie('figureType', value, { expires: DEFAULT_EXPIRES });
	}

	get isGameStarted() {
		return this.#isGameStarted;
	}

	set isGameStarted(value) {
		this.#isGameStarted = value;
		$.cookie('isGameStarted', value, { expires: DEFAULT_EXPIRES });
	}

	isAuth() {
		return this.#token != undefined;
	}

	logout() {
		$.removeCookie('token');
		this.#token = undefined;
	}

	exitRoom() {
		$.removeCookie('roomName');
		this.#roomName = undefined;
	}
}

export default new Session('roomName');
