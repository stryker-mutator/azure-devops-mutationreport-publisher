import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { CommonServiceIds, IProjectPageService, IVssRestClientOptions } from "azure-devops-extension-api";

import { BuildServiceIds, IBuildPageDataService } from "azure-devops-extension-api/Build/BuildServices"
import { BuildRestClient } from "azure-devops-extension-api/Build/BuildClient"

class BuildResultTab extends React.Component<{}> {

    reportType : string = "stryker-mutator.mutation-report";

    public componentDidMount() {
        SDK.init({ loaded: false });
        this.initializeState();
    }

    private async initializeState(): Promise<void> {
        await SDK.ready();

        const buildPageDataService = await SDK.getService<IBuildPageDataService>(BuildServiceIds.BuildPageDataService)
        
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const buildPage = buildPageDataService.getBuildPageData();
        const project = await projectService.getProject();

        if(buildPage?.build && project)
        {
            const buildClient = new BuildRestClient({});
            const reportAttachments = await buildClient.getAttachments(project.id, buildPage.build.id, this.reportType);

            if(reportAttachments.some(e => e))
            {
                const attachmentMetadata = reportAttachments[0];
                const attachment = await buildClient.getAttachment(project.id, buildPage.build.id, "timelineId", "recordId", this.reportType, attachmentMetadata.name)

                const attachmentText = new TextDecoder('utf-8').decode(new Uint8Array(attachment));

                // Now we set component state with attachmentText

                SDK.notifyLoadSucceeded().then(() => {
                    // we are visible in this callback. Resize window to fit needs.
                    SDK.resize();
                });
            }
        }

        SDK.notifyLoadFailed("No HTML report found..");
    }

    public render(): JSX.Element {

        // here we render the iframe with attachmentText as source

        return null;
    }
}
