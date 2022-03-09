declare module "webcpu" {
    interface DetectionOptions {
        hardcore?: boolean
        estimateInNode?: boolean
    }

    interface WebCPUResults {
        reportedCores: number | null
        estimatedIdleCores: number
        estimatedPhysicalCores: number
    }

    interface WebCPULib {
        detectCPU: (options?: DetectionOptions) => Promise<WebCPUResults>
    }

    export const WebCPU: WebCPULib 
}
