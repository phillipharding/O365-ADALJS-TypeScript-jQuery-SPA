import { expect, should } from "chai";
import { MessagesController } from "../source/controllers/messagesController";
import * as test from "./testHelpers.spec";

describe("MessagesController", () => {
	let testConfig:IAuthenticationConfig;
	
	beforeEach(() => {
		testConfig = test.cloneConfig(test.AuthConfig);
	});

	describe("Constructor", () => {
		it("Should create an instance", () => {
			let instance = new MessagesController();
			expect(instance).to.not.be.null;
		});

		it("Should have an empty ResourceUri on creation", () => {
			let instance = new MessagesController();
			expect(instance.EntityResourceUri).to.be.empty;
		});
	});

	describe("Initialise", () => {
		it("Should have an empty ResourceUri for missing adal endpoint", () => {
			testConfig.endpoints["https://contoso.sharepoint.com/"] = "https://contoso.sharepoint.com/sites/search";
			
			let authContext: test.FakeAuthenticationContext = new test.FakeAuthenticationContext(testConfig);

			let instance = new MessagesController();
			instance.log = (string?) => { };
			instance.initialise(authContext);
			expect(instance.EntityResourceUri).to.be.empty;
		});

		it("Should have a ResourceUri for a matching adal endpoint", () => {
			testConfig.endpoints["https://graph.microsoft.com"] = "https://graph.microsoft.com";
			
			let authContext: test.FakeAuthenticationContext = new test.FakeAuthenticationContext(testConfig);

			let instance = new MessagesController();
			instance.log = (string?) => { };
			instance.initialise(authContext);
			expect(instance.EntityResourceUri).to.be.equal("https://graph.microsoft.com");
		});
	});

});

