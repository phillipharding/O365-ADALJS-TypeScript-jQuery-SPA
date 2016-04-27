import { expect, should } from "chai";
import { ListsController } from "../source/controllers/listsController";
import * as test from "./testHelpers.spec";

describe("ListsController", () => {
	let testConfig:IAuthenticationConfig;
	
	beforeEach(() => {
		testConfig = test.cloneConfig(test.AuthConfig);
	});

	describe("Constructor", () => {
		it("Should create an instance", () => {
			let instance = new ListsController("");
			expect(instance).to.not.be.null;
		});

		it("Should have an empty ResourceUri on creation", () => {
			let instance = new ListsController("");
			expect(instance.EntityResourceUri).to.be.empty;
		});
	});

	describe("Initialise", () => {
		it("Should have an empty ResourceUri when supplied with an empty siteUrl", () => {
			testConfig.endpoints["https://contoso.sharepoint.com/"] = "https://contoso.sharepoint.com/sites/search";
			
			let authContext: test.FakeAuthenticationContext = new test.FakeAuthenticationContext(testConfig);

			let instance = new ListsController("");
			instance.log = (string?) => { };
			instance.initialise(authContext);
			expect(instance.EntityResourceUri).to.be.empty;
		});

		it("Should have an empty ResourceUri for missing adal endpoint", () => {
			testConfig.endpoints["https://contoso.sharepoint.com/"] = "https://contoso.sharepoint.com/sites/search";
			
			let authContext: test.FakeAuthenticationContext = new test.FakeAuthenticationContext(testConfig);

			let instance = new ListsController("https://acmecorp.sharepoint.com/sites/search");
			instance.log = (string?) => { };
			instance.initialise(authContext);
			expect(instance.EntityResourceUri).to.be.empty;
		});

		it("Should have a ResourceUri for a matching adal endpoint", () => {
			testConfig.endpoints["https://contoso.sharepoint.com/"] = "https://contoso.sharepoint.com/sites/search";
			
			let authContext: test.FakeAuthenticationContext = new test.FakeAuthenticationContext(testConfig);

			let instance = new ListsController("https://contoso.sharepoint.com/sites/search");
			instance.log = (string?) => { };
			instance.initialise(authContext);
			expect(instance.EntityResourceUri).to.be.equal("https://contoso.sharepoint.com");
		});
	});

});

