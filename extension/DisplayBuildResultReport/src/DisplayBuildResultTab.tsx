import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SDK from "azure-devops-extension-sdk";

import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";

import { CommonServiceIds, IProjectPageService, getClient, IProjectInfo } from "azure-devops-extension-api";

// import { BuildServiceIds, IBuildPageDataService } from "azure-devops-extension-api/Build/BuildServices"
import { BuildRestClient } from "azure-devops-extension-api/Build/BuildClient"
import { BuildReference, Attachment } from "azure-devops-extension-api/Build/Build";

export interface IBuildResultTabData {
    reportText: string;
    loadSuccess: boolean;
}

export class BuildResultTab extends React.Component<{}, IBuildResultTabData>
{
    reportType: string = "stryker-mutator.mutation-report";
    
    constructor(props: {}) {
        super(props);
        this.state = {
            reportText: "",
            loadSuccess: false
        };
    }

    public render(): JSX.Element {
        if (this.state.reportText?.length) {
            return (
                <iframe
                    src={this.getGeneratedPageURL(this.state.reportText)}
                    id="html-report-frame"
                    frameBorder="100"
                    width="100%"
                    height="100%"
                    scrolling="yes"
                    marginHeight={100}
                    marginWidth={100}>
                </iframe>
            );
        }
        return (<p>Something went wrong..</p>);
    }
    
    public async componentDidMount() {
        SDK.init({ loaded: false });
        await this.initializeState();
    }
    
    private async initializeState(): Promise<void> {
        await SDK.ready();
        
        const config = SDK.getConfiguration();
        
        // ugly
        config.onBuildChanged(this.extractReportHtml);
        
        return;
    }

    private extractReportHtml = async (build: BuildReference): Promise<void> => {
        console.trace("Current build is {0}", build);
        
        const project = await this.getProject();

        if (build && project) {
            await this.getAttachmentsFromBuild(build, project);
        }
        else {
            console.error("Build or project not found..");
        }
        
        if (!this.state.loadSuccess) {
            console.error("No HTML report found..");
            SDK.notifyLoadFailed("No HTML report found..");
        }

        return;
    }

    private async getAttachmentsFromBuild(build: BuildReference, project: IProjectInfo): Promise<void> {
        console.trace("Build & Project found");

        const buildClient = getClient(BuildRestClient);
        const reportAttachments = await buildClient.getAttachments(project.id, build.id, this.reportType);

        if (reportAttachments.some(e => e)) {
            const attachmentMetadata = this.getAttachmentMetadata(reportAttachments);

            if (attachmentMetadata._links?.self?.href) {
                await this.getAttachmentFromMetadataUrl(attachmentMetadata, buildClient, project, build);
            }
            else {
                console.error("Attachment file url not found..");
            }
        }
        else {
            console.error("No Attachments found..");
        }
    }

    private async getAttachmentFromMetadataUrl(attachmentMetadata: Attachment, buildClient: BuildRestClient, project: IProjectInfo, build: BuildReference): Promise<void> {
        console.trace("Attachment {0} contains file url {1}", attachmentMetadata.name, attachmentMetadata._links.self.href);

        const reportUrl: string = attachmentMetadata._links.self.href;
        const timelineId = this.getArtifactTimelineId(reportUrl);
        const recordId = this.getArtifactRecordId(reportUrl);

        if (timelineId && recordId) {
            console.trace("Attachment timelineId {0} and recordId {1} found", timelineId, recordId);
            const attachment = await buildClient.getAttachment(project.id, build.id, timelineId, recordId, this.reportType, attachmentMetadata.name);
            const attachmentText = new TextDecoder('utf-8').decode(new Uint8Array(attachment));
            // Now we set component state with attachmentText
            this.setState({
                reportText: attachmentText,
                loadSuccess: true
            });
            SDK.notifyLoadSucceeded();
        }
        else {
            console.error("Attachment timelineId or recordId not found..");
        }
    }

    private getAttachmentMetadata(reportAttachments : Attachment[]) {
        console.trace("Found {0} attachments for {1}", reportAttachments.length, this.reportType);
        const attachmentMetadata = reportAttachments[0];

        return attachmentMetadata;
    }

    private async getProject(): Promise<IProjectInfo> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        console.trace("Current Project is {0}", project);

        return project!;
    }

    private getGeneratedPageURL(html : string) : string {
        const blob = new Blob([html], { type: "text/html" })

        return URL.createObjectURL(blob)
    }

    private splitUrl(url: string): string[] | undefined {
        const startFromUrl = url.split("builds/")[1];
        if (startFromUrl.length > 0) {
            const urlParts = startFromUrl.split("/");

            if (urlParts.length > 0) {
                return urlParts;
            }
        }

        return undefined;
    }

    private getArtifactTimelineId(url: string): string | undefined {
        const urlParts = this.splitUrl(url);
        if (urlParts && urlParts.length > 1) {
            const timelineIdPart = urlParts[1];
            return timelineIdPart;
        }

        return undefined;
    }

    private getArtifactRecordId(url: string): string | undefined {
        const urlParts = this.splitUrl(url);
        if (urlParts && urlParts.length > 2) {
            const recordIdPart = urlParts[2];
            return recordIdPart;
        }

        return undefined;
    }
}

ReactDOM.render(<BuildResultTab />, document.getElementById("mutation-report-frame"));