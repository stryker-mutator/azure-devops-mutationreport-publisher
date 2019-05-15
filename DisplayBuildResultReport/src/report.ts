/// <reference types="vss-web-extension-sdk" />

import Controls = require("VSS/Controls");
import DT_Client = require("TFS/Build/RestClient");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");

export class ReportTab extends Controls.BaseControl {	
	constructor() {
		super();
	}
		
	public initialize(): void {
		super.initialize();
		// Get configuration that's shared between extension and the extension host
		var sharedConfig: TFS_Build_Extension_Contracts.IBuildResultsViewExtensionConfig = VSS.getConfiguration();
		var vsoContext = VSS.getWebContext();
		if(sharedConfig) {
			// register your extension with host through callback
			sharedConfig.onBuildChanged((build: TFS_Build_Contracts.Build) => {
				this._initBuildInfo(build);	
                
                var taskClient = DT_Client.getClient();
                taskClient.getArtifact(build.id, "Mutation Report", vsoContext.project.name).then((artifact: TFS_Build_Contracts.BuildArtifact) => {
                    var $reportDiv = $('#html-report');
                    $reportDiv.load("<iframe src=\"" + artifact.resource.url + "\"></iframe>");
                });
			});
		}		
	}
	
	private _initBuildInfo(build: TFS_Build_Contracts.Build) {
		
	}
}

ReportTab.enhance(ReportTab, $(".build-info"), {});

// Notify the parent frame that the host has been loaded
VSS.notifyLoadSucceeded();