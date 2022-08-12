sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/syncStyleClass"
], function (Controller, UIComponent, mobileLibrary, History, JSONModel, syncStyleClass) {
	"use strict";
	
	// shortcut for sap.m.URLHelper
	//var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("Homepage.Homepage.controller.BaseController", {
		
		onNavToHome: function (oEvent) {
			this.getRouter().navTo("HomeView");
		},
		onNavToWiki: function (oEvent) {
			this.getRouter().navTo("WikiView");
		},
		onNavToList: function (oEvent) {
			this.getRouter().navTo("ListView");
		},
		onNavToAboutMe: function (oEvent) {
			this.getRouter().navTo("AboutMeView");
		},
		
		onNavToContactMe: function (oEvent) {
			//Dialog öffnen
			if (!this.ContactMeDialog) {
				this.refDateDialog = sap.ui.core.Fragment.load({
					id: "idFragContactMeDialog",
					name: "Homepage.Homepage.view.fragments.ContactMe",
					controller: this
				}).then(function (oDialog) {
					this.ContactMeDialog = oDialog;
					// connect dialog to the root view of this component
					this.getView().addDependent(oDialog);
					// forward compact/cozy style into dialog
					//syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oDialog);
					oDialog.open();
				}.bind(this));
			} else {
				this.ContactMeDialog.open();
			}
		},
		
		onPressContactMeDialogCancel: function (oEvent){
			this.ContactMeDialog.close();
		},
		
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Go Back in history
		 * @public
		 */
		onNavBack: function () {

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("HomeView", {}, true);
			}
		},

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()

	});

});