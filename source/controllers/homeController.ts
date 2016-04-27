import UI from "../UI";

export class HomeController implements IEntityController {
	private _authContext: AuthenticationContext;
	private _resourceUri: string;
	private _viewHtml: string;

	public constructor() {
		this._resourceUri = "";
	}

	public log(message: string): void {
		let msg: string = `HomeController>> ${message}`;
		console.log(msg);
	}

	public get EntityResourceUri(): string {
		return this._resourceUri;
	}

	public initialise(authContext: AuthenticationContext): void {
		this._authContext = authContext;
		this.log("initialise");
		this._resourceUri = authContext.config.loginResource;
	}

	public preProcess(viewHtml: string): JQueryPromise<any> {
		this.log("preProcess");
		this._viewHtml = viewHtml;

		let d = $.Deferred<any>();
		d.resolveWith(this);
		return d.promise();
	}

	public postProcess(): JQueryPromise<any> {
		let d = $.Deferred<any>();
		this.log("postProcess, fetching ID_TOKEN+USER+CLAIMS information...");

		let $dataContainer = $(".data-container");
		let $templateHtml = $(this._viewHtml).find(".view-template");

		let token = this._authContext.getCachedToken(this._resourceUri);
		$(".view-data-tokenresource").html(this._resourceUri);
		$(".view-data-token").html(token || "&lt;&lt;null&gt;&gt;");

		let panelHtml: string[] = [];
		let user: IUserInfo = this._authContext.getCachedUser();
		for (let property in user.profile) {
			if (user.profile.hasOwnProperty(property)) {
				let $templ = $templateHtml.clone();
				$templ.find(".view-data-claim").html(property);
				$templ.find(".view-data-value").html(user.profile[property]);
				panelHtml.push($templ.html());
			}
		}
		$dataContainer.html(panelHtml.join(""));
		d.resolveWith(this);
		return d.promise();
	}
}

