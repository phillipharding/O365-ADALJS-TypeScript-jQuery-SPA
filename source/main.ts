import { ListsController } from "./controllers/listsController";
import { MessagesController } from "./controllers/messagesController";
import { HomeController } from "./controllers/homeController";
import UI from "./UI";

const TenantName: string = "<YourTenantNameHere>";
const ClientId: string = "<YourAzureApplicationClientIdHere>";
const SharePointApi: string = `https://${TenantName}.sharepoint.com`;
const GraphApi: string = "https://graph.microsoft.com";

/** AdalJS configuration for our app */
let authConfig: IAuthenticationConfig = {
	tenant: `${TenantName}.onmicrosoft.com`,
	clientId: `${ClientId}`,

	/** where to navigate to after AD logs you out */
	postLogoutRedirectUri: window.location.origin,

	/** redirect_uri page, this page is the AzureAD callback page and receives access tokens
	 *  this URL must match, at least, the scheme and origin of at least 1 of 
	 *  the Reply URLs entered on your Azure AD Application configuration page
	 */
	redirectUri: `${window.location.origin}/callback.html`,
	endpoints: {},
	// cacheLocation: "localStorage", // enable this for IE, as sessionStorage does not work for localhost.
};
authConfig.endpoints[SharePointApi] = `https://${TenantName}.sharepoint.com/search`;
authConfig.endpoints[GraphApi] = "https://graph.microsoft.com";

/** setup logging for ADAL, set level to 3 or above to see all logging */
Logging = {
	level: 0,
	log: (msg: string) => {
		console.log(`ADAL>>  + ${msg}`);
	},
};

/** loads a controller and view into the page
 * @param  {string} viewName
 * @param  {AuthenticationContext} authContext
 */
function loadController(viewName: string, authContext: AuthenticationContext) {
	console.log(`LoadView: ${viewName}`);

	let controller: IEntityController;
	switch (viewName) {
		case "Lists":
			controller = new ListsController(authConfig.endpoints[SharePointApi]);
			break;
		case "Messages":
			controller = new MessagesController();
			break;
		default:
			controller = new HomeController();
			break;
	}

	UI.setView();
	UI.setErrorMessage();
	UI.showLoading(true);
	controller.initialise(authContext);
	loadHtmlView(controller, viewName)
		.then(controller.preProcess)
		.then(controller.postProcess)
		.fail((msg: string) => {
			UI.setErrorMessage(msg);
		})
		.always(() => {
			UI.showLoading();
		});
};

/** loads a named HTML view fragment
 * @param  {IEntityController} controller
 * @param  {string} viewName
 * @returns JQueryPromise
 */
function loadHtmlView(controller:IEntityController, viewName: string): JQueryPromise<any> {
	let d = $.Deferred<any>();
	$.ajax({
		type: "GET",
		url: `source/views/${viewName}.html`,
		dataType: "html",
	}).done((viewHtml: string) => {
		let $html = $(viewHtml);
		$html.find(".view-template").empty();
		UI.setView($html.html());
		d.resolveWith(controller, [viewHtml]);
	}).fail((xhr:JQueryXHR) => {
		d.reject(`Error loading HTML view: ${viewName}`);
	});
	return d.promise();
}

/** this method is for the verion of the SPA that uses a separate page (callback.html) for the Azure AD OAuth callback
 * @returns void
 */
function loadSPAWithoutPageCallback(): void {
	let $signInButton = $(".app-login");
	let $signOutButton = $(".app-logout");

	let authContext: AuthenticationContext = new AuthenticationContext(authConfig);

	/** just check login status... update UI and/or login */
	let user = authContext.getCachedUser();
	UI.setDisplayForUser(user);
	if (user) {
		console.log(`loadSPAWithoutCallbackVersion>> User IS logged-in: ${JSON.stringify(user)}`);
		$signInButton.hide();
		$signOutButton.show();
	} else {
		console.log("loadSPAWithoutCallbackVersion>> User is NOT logged in!");
		authContext.clearCache();
		authContext.login();
		return;
	}

	/** setup browser hash tracking for SPA view navigation */
	window.onhashchange = function () {
		let viewName = UI.stripHash(window.location.hash);
		if (!viewName || !viewName.length) {
			viewName = viewName || "Home";
		}

		/** set active NavBar element */
		$(".nav li.active").removeClass("active");
		$(`.nav li a[href$="#${viewName}"]`).parent().addClass("active");

		loadController(viewName, authContext);
	};
	window.onload = function () {
		$(window).trigger("hashchange");
	};

	/** register NavBar click handlers */
	$signOutButton.click(function () {
		authContext.logOut();
	});
	$signInButton.click(function () {
		authContext.login();
	});
}

/** this method is for the verion of the SPA that uses the single SPA page for the Azure AD OAuth callback
 * @returns void
 */
function loadSPAWithPageCallback(): void {
	let $signInButton = $(".app-login");
	let $signOutButton = $(".app-logout");

	/** by default this sample uses a different page (callback.html) for the Azure AD OAuth callback
	 *  so we just need to change redirect_uri configuration here
	 */
	authConfig.redirectUri = `${window.location.origin}`;
	let authContext: AuthenticationContext = new AuthenticationContext(authConfig);

	/** the code which handles AzureAD tokens/login callbacks is factored out to a seperate page (callback.html) */
	console.log(`loadSPAWithCallbackVersion>> START, location is: ${window.location.href}`);

	/** check for & handle redirect from AAD after login */
	let isCallback = authContext.isCallback(window.location.hash);
	if (isCallback) {
		let loginReq = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
		console.log(`loadSPAWithCallbackVersion>> IS Callback!!!, CONSTANTS.STORAGE.LOGIN_REQUEST: ${loginReq}`);
		authContext.handleWindowCallback();
		if (authContext.getLoginError()) {
			$(".app-error").html(authContext.getLoginError()).show();
		}
		/** if its a callback...
		 *  	and its a login request, handleWindowCallback(...) will navigate back to the URL the login() call was made from
		 * 	or navigate back to the current page but without the # fragment
		 * 	or, display the login error message
		 */
		return;
	}
	console.log("loadSPAWithCallbackVersion>> Is NOT Callback!!!");

	/** just check login status... update UI and/or login */
	let user = authContext.getCachedUser();
	UI.setDisplayForUser(user);
	if (user) {
		console.log(`loadSPAWithCallbackVersion>> User IS logged-in: ${JSON.stringify(user)}`);
		$signInButton.hide();
		$signOutButton.show();
	} else {
		console.log("loadSPAWithCallbackVersion>> User is NOT logged in!");
		authContext.clearCache();
		authContext.login();
		return;
	}

	/** setup browser hash tracking for SPA view navigation */
	window.onhashchange = function () {
		let viewName = UI.stripHash(window.location.hash);
		if (!viewName || !viewName.length) {
			viewName = viewName || "Home";
		}

		/** set active NavBar element */
		$(".nav li.active").removeClass("active");
		$(`.nav li a[href$="#${viewName}"]`).parent().addClass("active");

		loadController(viewName, authContext);
	};
	window.onload = function () {
		$(window).trigger("hashchange");
	};

	/** register NavBar click handlers */
	$signOutButton.click(function () {
		authContext.logOut();
	});
	$signInButton.click(function () {
		authContext.login();
	});
}

// $(loadSPAWithPageCallback);
$(loadSPAWithoutPageCallback);

