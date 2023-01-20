import { Payload, Process, workflow } from "./machine";

type Ctx = {variable: string}

const MyWorkflow = workflow({
    toA: {
        from: ["start"],
        to: ["a"]
    },
    toB: {
        from: ["a"],
        to: ["end"],
        effect: () => {
            
        }
    }
})
