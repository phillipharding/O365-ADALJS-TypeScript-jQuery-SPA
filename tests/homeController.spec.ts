import { expect, should } from "chai";
import { HomeController } from "../source/controllers/homeController";
import * as test from "./testHelpers.spec";

describe("HomeController", () => {

	describe("Constructor", () => {
		it("Should create an instance", () => {
			let instance = new HomeController();
			expect(instance).to.not.be.null;
		});

		it("Should have an empty ResourceUri on creation", () => {
			let instance = new HomeController();
			expect(instance.EntityResourceUri).to.be.empty;
		});
	});

	describe("Initialise", () => {
		it("Should have the loginResource ResourceUri on initialisation", () => {
			let authContext: test.FakeAuthenticationContext = new test.FakeAuthenticationContext(test.AuthConfig);

			let instance = new HomeController();
			instance.log = (string?) => { };
			instance.initialise(authContext);
			expect(instance.EntityResourceUri).to.be.equal(test.ClientId);
		});
	});

});

