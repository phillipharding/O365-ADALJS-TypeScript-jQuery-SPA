# O365-ADALJS-TypeScript-jQuery-SPA
A Visual Studio Code TypeScript project for a SPA application using AdalJS, jQuery, Office365 Graph API and SharePoint Online REST API.

References:
- [OfficeDev/O365-jQuery-CORS](https://github.com/OfficeDev/O365-jQuery-CORS)
- [AzureAD/azure-activedirectory-library-for-js](https://github.com/AzureAD/azure-activedirectory-library-for-js)
- [Authentication Scenarios for Azure AD](https://azure.microsoft.com/en-gb/documentation/articles/active-directory-authentication-scenarios/#single-page-application-spa)
- [Cloud Identity: Introducing ADAL JS v1](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/)
- [Cloud Identity: ADAL JavaScript and AngularJS – Deep Dive](http://www.cloudidentity.com/blog/2014/10/28/adal-javascript-and-angularjs-deep-dive/)
- [http://blog.wolksoftware.com/setting-up-your-typescript-vs-code-development-environment](http://blog.wolksoftware.com/setting-up-your-typescript-vs-code-development-environment)
- [remojansen/ts-vscode-boilerplate](https://github.com/remojansen/ts-vscode-boilerplate)
- [Calling the Office 365 Unified API from JavaScript using ADAL.js](http://paulryan.com.au/2015/unified-api-adal/)

# How to use this sample?

Getting started is simple!  To run this sample you will need:
- Visual Studio Code
- NodeJS
- An Internet connection
- An Azure subscription (a free trial is sufficient)

Every Azure subscription has an associated Azure Active Directory tenant.  If you don't already have an Azure subscription, you can get a free subscription by signing up at [http://www.windowsazure.com](http://www.windowsazure.com).  All of the Azure AD features used by this sample are available free of charge.

## Step 1: Clone or download this repository
```
git clone https://github.com/phillipharding/O365-ADALJS-TypeScript-jQuery-SPA.git
```

## Step 2: Install dependencies and their type definitions:

> Note: Before running the following commands, make sure you have [Node.js]() installed and 
that you have installed *typings* and *gulp* as global packages:
```
$ npm -g install gulp
$ npm -g install typings
```

For your local dev server you can use either NPM [http-server](https://www.npmjs.com/package/http-server) or [browser-sync](https://www.npmjs.com/package/browser-sync), to use [http-server](https://www.npmjs.com/package/http-server) install it globally;
```
$ npm -g install http-server
```

### Restore packages
```
$ cd O365-ADALJS-TypeScript-SPA
$ npm install
$ typings install
```

## Step 3: Set up your Office 365 development environment and Azure Application Registration

Follows Steps 2, 3 and 4 from the [OfficeDev/O365-jQuery-CORS](https://github.com/OfficeDev/O365-jQuery-CORS) sample.

> Note: The sample is configured to use *http://localhost:3000* as the local dev server, so you should use this URL 
> 
> as the Sign-In URL and Reply URL in your Azure AD Application registration.

## Step 4: Configure the sample to use your Azure Active Directory tenant

1. Open the sample in Visual Studio Code
2. Open *source/main.ts* and *source/callback.ts* files, at the top of each file;
    * Replace the value of `TenantName` with your AAD tenant name.
    * Replace the value of `ClientId` with the Client ID from the Azure Management Portal.

## Step 5: Build the sample

1. Use `Command` + `P`
2. Type *task default* and press `ENTER`

    or, at the `Terminal`, type *gulp default* and press `ENTER`
3. The sample will build, the test will run and output will display in the Output window

## Step 6: Run the sample

When the sample is run, it will try to Authenticate you straight away.

To use the NPM *http-server* method;
1. Open a Terminal window
2. cd *O365-ADALJS-TypeScript-SPA*
3. Type *http-server ./ -p 3000 -c-1* and press `ENTER`
4. Go to your browser and enter *http://localhost:3000* into the address bar

To use the NPM *browser-sync* method;
1. Use `Command` + `P` type *task serve* and press `ENTER`
    
    or, at the `Terminal`, type *gulp serve* and press `ENTER`
2. Your browser should open at the URL *http://localhost:3000*

## Step 7: Enjoy coding with TypeScript!

Please send a PR! If you know how to make this sample better.
