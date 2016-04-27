export class FakeAuthenticationContext {
	public config: IAuthenticationConfig;
	public instance: string;
	public CONSTANTS: any;
	public REQUEST_TYPE: any;

	public isCallback: () => boolean;
	public handleWindowCallback: () => void;
	public getLoginError: () => string;
	public getCachedUser: () => IUserInfo;
	public login: () => void;
	public loginInProgress: () => boolean;
	public logOut: () => void;
	public acquireToken: (string, any) => void;
	public _getItem: (string) => string;
	public _saveItem: (string, any) => string;
	public _getNavigateUrl: (responseType: string, resource: string) => string;
	public _getHostFromUri: (string) => string;
	public getCachedToken: (string) => string;
	public getResourceForEndpoint: (string) => string;
	public clearCache: () => void;
	public clearCacheForResource: (string) => void;
	public info: (string) => void;
	public verbose: (string) => void;
	public warn: (string) => void;
	public log: (level: number, message: string, error: Error) => void;
	public error: (message: string, error: Error) => void;
	public _libVersion: () => string;

	constructor(config: IAuthenticationConfig) {
		this.config = this._cloneConfig(config);
		if (!this.config.loginResource) {
			this.config.loginResource = this.config.clientId;
		}
	}

	public _cloneConfig(obj: any): any {
		if (null === obj || "object" !== typeof obj) {
			return obj;
		}
		let copy = {};
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = obj[attr];
			}
		}
		return copy;
	}
}

export var TenantName: string = "contoso";
export var ClientId: string = "cc21d86c-a643-4f90-8286-19914d52ed82";
export var AuthConfig: IAuthenticationConfig = {
	tenant: `${TenantName}.onmicrosoft.com`,
	clientId: `${ClientId}`,

	postLogoutRedirectUri: "",
	redirectUri: "",
	endpoints: {},
};

export function cloneConfig(obj: any): any {
	if (null === obj || "object" !== typeof obj) {
		return obj;
	}
	let copy = {};
	for (let attr in obj) {
		if (obj.hasOwnProperty(attr)) {
			copy[attr] = obj[attr];
		}
	}
	return copy;
}

export var FakeConsole = <Console>{
	log: (string?) => { },
	error: (string?) => { },
	warn: (string?) => { },
	info: (string?) => { },
	assert: (test?: boolean, message?: string, ...optionalParams: any[]) => { },
};

