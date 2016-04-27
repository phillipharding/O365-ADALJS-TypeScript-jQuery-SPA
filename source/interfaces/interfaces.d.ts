interface IEntityController {
	/** properties */
	EntityResourceUri: string;
	
	/** methods */
	log: (message: string) => void;
	initialise: (authContext: AuthenticationContext) => void;
	preProcess: (viewHtml: string) => JQueryPromise<any>;
	postProcess: () => JQueryPromise<any>;
}
