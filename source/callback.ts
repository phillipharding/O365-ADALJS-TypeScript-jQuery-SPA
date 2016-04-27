const TenantName: string = "<YourTenantNameHere>";
const ClientId: string = "<YourAzureApplicationClientIdHere>";
const SharePointApi: string = `https://${TenantName}.sharepoint.com`;
const GraphApi: string = "https://graph.microsoft.com/";

/** AdalJS configuration for our app */
let authConfig: IAuthenticationConfig = {
	tenant: `${TenantName}.onmicrosoft.com`,
	clientId: `${ClientId}`,
	
	/** where to navigate to after AD logs you out */
	postLogoutRedirectUri: window.location.origin,
	
	/** redirect_uri page, this is the page that receives access tokens
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

$(function () {
	let authContext: AuthenticationContext = new AuthenticationContext(authConfig);
	console.log(`Callback.html>> START, location is: ${window.location.href}`);
	
	/** check for & handle redirect from AAD after login */
	let isCallback = authContext.isCallback(window.location.hash);
	if (isCallback) {
		let loginReq = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
		console.log(`Callback.html>> IS Callback!!!, CONSTANTS.STORAGE.LOGIN_REQUEST: ${loginReq}`);
		authContext.handleWindowCallback();
		if (authContext.getLoginError()) {
			$(".app-error").html(authContext.getLoginError()).removeClass("hidden");
		}
		/** if its a callback...
		 *  	and its a login request, handleWindowCallback(...) will navigate back to the URL the login() call was made from
		 * 	or navigate back to the current page but without the # fragment
		 * 	or, display the login error message
		 */
		return;
	}
	console.log("Callback.html>> Is NOT Callback!!!");
	
	/** check login status */
	let user = authContext.getCachedUser();
	if (user) {
		console.log(`Callback.html>> User is logged-in: ${JSON.stringify(user)}`);
	} else {
		console.log("Callback.html>> User is NOT logged-in!!");
	}
});
