/// <reference types="vss-web-extension-sdk" />

import Controls = require("VSS/Controls");
import VSS_Service = require("VSS/Service");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");
import DT_Client = require("TFS/DistributedTask/TaskRestClient");

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
                taskClient.getPlanAttachments(vsoContext.project.id, "build", build.orchestrationPlan.planId, "stryker-mutator.mutation-report").then((taskAttachments) => {
				if (taskAttachments.length == 0) {
					var element = $("<div />");
		
					var errorText = "No HTML report found!";
		
					element.html("<p>" + errorText + "</p>");
					this._element.replaceWith(element);
				} else {
					$.each(taskAttachments, (_, taskAttachment) => {
						if (taskAttachment._links && taskAttachment._links.self && taskAttachment._links.self.href) {
			
							taskClient.getAttachmentContent(vsoContext.project.id, "build", build.orchestrationPlan.planId, taskAttachment.timelineId, taskAttachment.recordId, "stryker-mutator.mutation-report", taskAttachment.name).then((attachmentContent) => {
			
								var text = new TextDecoder('utf-8').decode(new Uint8Array(attachmentContent));
				
								var reportFrame = $('<iframe>', {
									srcdoc: text,
									id: 'html-artifact',
									frameborder: '0',
									width: '100%',
									height: '100%',
									scrolling: 'yes',
									marginheight: '0',
									marginwidth: '0'
									});
				
								this._element.replaceWith(reportFrame);
				
								VSS.resize();
							})
						}
					});
				}
			}, function() {
				var element = $("<div />");
	
				var errorText = "No HTML report found!";
	
				element.html("<p>" + errorText + "</p>");
				this._element.replaceWith(element);
				});
			});
		}		
	}
	
	private _initBuildInfo(build: TFS_Build_Contracts.Build) {}
}

ReportTab.enhance(ReportTab, $("#html-report"), {});

// Notify the parent frame that the host has been loaded
VSS.notifyLoadSucceeded();