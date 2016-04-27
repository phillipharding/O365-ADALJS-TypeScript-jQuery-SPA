import UI from "../UI";

export class MessagesController implements IEntityController {
	private _authContext: AuthenticationContext;
	private _resourceUri: string;
	private _apiEndpoint: string;
	private _viewHtml: string;

	public constructor() {
		this._apiEndpoint = this._resourceUri = "";
	}

	public log(message: string): void {
		let msg: string = `MessagesController>> ${message}`;
		console.log(msg);
	}

	public get EntityResourceUri(): string {
		return this._resourceUri;
	}

	public initialise(authContext: AuthenticationContext) {
		this._authContext = authContext;

		const GraphApi: string = "https://graph.microsoft.com";
		for (let key in authContext.config.endpoints) {
			if (GraphApi.match(key.toLowerCase())) {
				this._resourceUri = key;
				this._apiEndpoint = authContext.config.endpoints[key].replace(/\/$/gi, "");
				break;
			}
		}
		this.log("initialise");
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
		this.log("postProcess, acquire access_token for O365 Graph...");

		let $dataContainer: JQuery = $(".data-container");
		let $templateHtml: JQuery = $(this._viewHtml).find(".view-template");

		this._authContext.acquireToken(this._resourceUri, (error: string, token: string) => {
			$(".view-data-tokenresource").html(this._resourceUri);
			$(".view-data-token").html(token || "&lt;&lt;null&gt;&gt;");

			/** handle ADAL error */
			if (error || !token) {
				let msg = `ADAL error occurred: ${error}`;
				d.rejectWith(this, [msg]);
				return;
			}

			this.log("postProcess, fetch messages from O365...");
			$.ajax({
				type: "GET",
				url: `${this._apiEndpoint}/v1.0/me/messages`,
				headers: {
					"Accept": "application/json;odata.metadata=minimal",
					"Authorization": `Bearer ${token}`,
				},
			}).done((response: { value: any[] }) => {
				this.log("Successfully fetched messages from O365.");

				let panelHtml = $.map(response.value, (e, i) => {
					let $templ = $templateHtml.clone();
					$templ.find(".view-data-from").html(`<h4><small>${e.from.emailAddress.name} (${e.from.emailAddress.address})</small></h4>`);
					$templ.find(".view-data-subject").html(`<small>${e.subject}</small>`);
					return $templ.html();
				});
				$dataContainer.html(panelHtml.join(""));
				d.resolveWith(this);
			}).fail((xhr: JQueryXHR) => {
				let msg = `Fetching messages from Office365 failed. ${xhr.status}: ${xhr.statusText}`;
				this.log(msg);
				d.rejectWith(this, [msg]);
			});
		});
		return d.promise();
	}
}

