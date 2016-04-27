import UI from "../UI";

export class ListsController implements IEntityController {
	private _authContext: AuthenticationContext;
	private _apiEndpoint: string;
	private _resourceUri: string;
	private _viewHtml: string;

	public constructor(siteUrl: string) {
		this._apiEndpoint = siteUrl.replace(/\/$/gi, "");
		this._resourceUri = "";
	}

	public log(message: string): void {
		let msg: string = `ListsController>> ${message}`;
		console.log(msg);
	}

	public get EntityResourceUri(): string {
		return this._resourceUri;
	}

	public initialise(authContext: AuthenticationContext) {
		this._authContext = authContext;

		let siteUrl = this._apiEndpoint.toLowerCase();
		for (let key in authContext.config.endpoints) {
			if (siteUrl.match(key.toLowerCase())) {
				this._resourceUri = key.replace(/\/$/gi, "");
				break;
			}
		}
		this.log("initialise");
	}

	public preProcess(viewHtml: string): JQueryPromise<any> {
		this.log("preProcess");
		this._viewHtml = viewHtml;
		
		/** some async' process goes here, maybe getting the token... */
		
		let d = $.Deferred<any>();
		d.resolveWith(this);
		return d.promise();
	}

	public postProcess(): JQueryPromise<any> {
		let d = $.Deferred<any>();
		this.log("postProcess, acquire access_token for SharePoint...");

		let $dataContainer = $(".data-container");
		let $templateHtml = $(this._viewHtml).find(".view-template");

		this._authContext.acquireToken(this._resourceUri, (error: string, token: string) => {
			$(".view-data-siteurl").html(this._apiEndpoint);
			$(".view-data-tokenresource").html(this._resourceUri);
			$(".view-data-token").html(token || "&lt;&lt;null&gt;&gt;");

			/** handle ADAL error */
			if (error || !token) {
				let msg = `ADAL error occurred: ${error}`;
				d.rejectWith(this, [msg]);
				return;
			}

			this.log("postProcess, fetch lists from SharePoint...");
			$.ajax({
				type: "GET",
				url: `${this._apiEndpoint}/_api/web/lists/`,
				headers: {
					"Accept": "application/json; odata=minimalmetadata",
					"Authorization": `Bearer ${token}`,
				},
			}).done((response: { value: any[] }) => {
				this.log("Successfully fetched lists from SP.");

				/** show non-hidden lists/libraries */
				let panelHtml = $.grep(response.value, (e: any, i: number) => {
					return !e.Hidden;
				}).map((e: any, i: number) => {
					let $templ = $templateHtml.clone();
					$templ.find(".view-data-name").html(`<code style="">${e.Title}</code>`);
					return $templ.html();
				});
				$dataContainer.html(panelHtml.join(""));
				d.resolveWith(this);
			}).fail((xhr:JQueryXHR) => {
				let msg = `Fetching lists from SharePoint failed. ${xhr.status}: ${xhr.statusText}`;
				this.log(msg);
				d.rejectWith(this, [msg]);
			});
		});
		return d.promise();
	}
}

