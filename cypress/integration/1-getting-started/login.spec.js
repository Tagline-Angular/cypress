before(() => {
  cy.visit("http://192.168.0.86:4200");
  cy.contains("Sign In");
});

describe("My First Test", () => {
  const timeout30 = { timeout: 30000 };
  it("It can verify Email field is required", () => {
    cy.get("#email-field").type("abcd@gmail.com");
    cy.get("#email-field").clear();
    cy.get(".card-body").click();
    cy.get("#email-error").should("contain", "Email is required");
  });

  it("It can verify Password field is required", () => {
    cy.get("#password-field").type("123");
    cy.get("#password-field").clear();
    cy.get(".card-body").click();
    cy.get("#password-error").should("contain", "Password is required");
  });

  it("It can verify submit button shold remain disable when required field is not filled out", () => {
    cy.get("#login-button").should("be.disabled");
  });

  it("I should get Error when credintials are wrong", () => {
    cy.get("#email-field").clear();
    cy.get("#email-field").type("abcd@gmail.com");
    cy.get("#password-field").clear();
    cy.get("#password-field").type("123");
    cy.get("#login-button").click();
    cy.get("#toast-container .toast-message").should(
      "contain",
      "Invalid credentials !"
    );
  });

  it("I should be able to login when I have enterd right credintials", () => {
    cy.get("#email-field").clear();
    cy.get("#email-field").type("merlin.mekok@trueconvos.com");
    cy.get("#password-field").clear();
    cy.get("#password-field").type("Log4jdubious94@");
    cy.get("#login-button").click();
    cy.get("#toast-container .toast-success").should(
      "contain",
      "Welcome Admin"
    );

    cy.url().should("include", "/dashboard/user");
  });

  it("it can delete embed", () => {
    cy.get("#email-field").clear();
    cy.get("#email-field").type("merlin.mekok@trueconvos.com");
    cy.get("#password-field").clear();
    cy.get("#password-field").type("Log4jdubious94@");
    cy.get("#login-button").click();
    cy.wait(3000);
    let lenBefore;

    cy.get("#bot-user-table", timeout30)
      .find("tr")
      .its("length")
      .then((len) => {
        lenBefore = len;
      });
    cy.get("#delete-btn").click();
    cy.get("#exampleModalLabel").should("contain", "Confirm Delete");
    cy.get("#dialog-delete-btn").click();
    cy.get("#toast-container .toast-success").should(
      "contain",
      "User deleted!"
    );

    let lenAfter;

    cy.get("#bot-user-table", timeout30)
      .find("tr")
      .its("length")
      .then((len) => {
        lenAfter = len;
        expect(lenAfter).to.equal(lenBefore - 1);
      });
  });
});
