class UI {
	/** strips the leading hash from the input
	 * @param  {string} input
	 * @returns string
	 */
	public static stripHash(input: string): string {
		return input ? input.substr(input.indexOf("#") + 1) : "";
	}

	/** sets the error message panel
	 * @param  {string} message
	 * @returns void
	 */
	public static setErrorMessage(message?: string): void {
		let $errorMessage = $(".app-error");
		$errorMessage.html(message || "");
		if (!message) {
			$errorMessage.addClass("hidden");
		} else {
			$errorMessage.removeClass("hidden");
		}
	}

	/** sets the main panel content or clears the panel content
	 * @param  {string} html?
	 * @returns void
	 */
	public static setView(html?: string): void {
		let $panel = $(".view-container");
		if (!html) {
			$panel.empty();
		} else {
			$panel.html(html);
		}
	}

	/** sets the display logged in/out user
	 * @param  {IUserInfo} userInfo?
	 * @returns void
	 */
	public static setDisplayForUser(userInfo?: IUserInfo): void {
		let $userDisplay = $(".app-user");
		if (userInfo) {
			$userDisplay.html(userInfo.userName).show();
		} else {
			$userDisplay.html("").hide();
		}
	}

	/** shows or hides the loading panel
	 * @param  {boolean} on?
	 * @returns void
	 */
	public static showLoading(on?: boolean): void {
		if (on) {
			$(".panel-loading").removeClass("hidden");
		} else {
			$(".panel-loading").addClass("hidden");
		}
	}
}

export default UI;
