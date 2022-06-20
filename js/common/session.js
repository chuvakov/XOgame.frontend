class Session {
	#nickname;

	constructor() {
		this.nickname = $.cookie('nickname');
	}

	get nickname() {
		return this.#nickname;
	}

	set nickname(nickname) {
		this.#nickname = nickname;
		$.cookie('nickname', nickname, { expires: 10 });
	}

    isAuth() {
        return this.nickname != undefined;
    }

	logout() {
		$.removeCookie('nickname');
        this.#nickname = undefined;
	}
}

export default new Session();
