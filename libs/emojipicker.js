const emojiPicker = async (options) => {
	let $selector = $(options.selector);
	let $input = $(options.input);

	$selector.wrap('<div class="emoji-picker"></div>');

	$selector.after(`
    <div class="intercom-composer-popover intercom-composer-emoji-popover" data-emoji-picker="${options.selector}">
        <div class="intercom-emoji-picker">
            <div class="intercom-composer-popover-header">
                <input class="intercom-composer-popover-input" placeholder="Поиск" value="" />
            </div>
            <div class="intercom-composer-popover-body-container">
                <div class="intercom-composer-popover-body">
                    <div class="intercom-emoji-picker-groups">
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="intercom-composer-popover-caret"></div>
    </div>
    `);

	let $popover = $selector.siblings('.intercom-composer-emoji-popover').find('.intercom-emoji-picker-groups');

	let emojies = [];

	if (options.emojies != undefined) {
		emojies = options.emojies;
	} else {
		//колл бэк с сервера
		emojies = await options.ajax();
	}

	emojies.forEach((group) => {
		$popover.append(
			`
                <div class="intercom-emoji-picker-group">
                            <div class="intercom-emoji-picker-group-title">${group.name}</div>
                            ${group.emojis
								.map(
									(emoji) =>
										`<span class="intercom-emoji-picker-emoji" title="${emoji.name}">${emoji.text}</span>`
								)
								.join('')}				
                </div>
            `
		);
	});

	$selector.click(function (e) {
		e.stopPropagation();
		$(`.intercom-composer-emoji-popover[data-emoji-picker="${options.selector}"]`).toggleClass('active');
	});

	$(`.intercom-composer-emoji-popover[data-emoji-picker="${options.selector}"]`)
		.find('.intercom-emoji-picker-emoji')
		.click(function (e) {
			let text = $input.val();
			$input.val(text + $(this).html());
		});

	//поиск
	$(`.intercom-composer-emoji-popover[data-emoji-picker="${options.selector}"]`)
		.find('.intercom-composer-popover-input')
		.on('input', function () {
			var query = this.value;
			if (query != '') {
				$popover.find(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide();
			} else {
				$popover.find('.intercom-emoji-picker-emoji').show();
			}
		});
};

$(function () {
	$(document).click(function (e) {
		if (
			$(e.target).attr('class') != '.intercom-composer-emoji-popover' &&
			$(e.target).parents('.intercom-composer-emoji-popover').length == 0
		) {
			$('.intercom-composer-emoji-popover').removeClass('active');
		}
	});
});

export default emojiPicker;
