
import { Well, Objective, Problem, AiRecommendation, Procedure } from './types';

export const WELL_DATA: Well[] = [
    { 
        id: 'W666', name: 'The Perfect Storm', field: 'Montrose', region: 'UKCS', type: 'HPHT Gas Condensate', depth: '18,500ft', status: 'Shut-in - Well Integrity Issues', 
        issue: 'A nightmare well with multiple, compounding failures: severe casing deformation, a hard scale blockage, and a failed primary safety valve.', 
        history: [ 
            { date: '2025-06-15', operation: 'Slickline Surveillance', problem: 'Unable to pass 8,500ft due to casing restriction.', lesson: 'This well combines multiple known failure modes from this field into a single asset.' },
            { date: '2025-07-01', operation: 'Production Test', problem: 'Well died after brief flow period. Pressure analysis suggests deep blockage.', lesson: 'Suspect combination of scale and integrity issues.' },
            { date: '2025-07-10', operation: 'DHSV Test', problem: 'TRSSV failed to close on command. Well shut-in on annulus valves.', lesson: 'Well integrity is critically compromised.' }
        ],
        deviation: [
            { md: 0, angle: 0 }, { md: 3000, angle: 5 }, { md: 6000, angle: 15 }, { md: 8000, angle: 35 }, { md: 12000, angle: 45 }, { md: 18500, angle: 50 }
        ],
        completion: { 
            casing: [{type: 'Production', size: '9 5/8', top: 0, bottom: 18500, isProblem: true}], 
            tubing: [{type: 'Production', size: '4 1/2', top: 0, bottom: 18300}], 
            equipment: [
                {item: 'SSSV', top: 2500, comments: 'Failed test', isProblem: true}, 
                {item: 'Casing Deformation', top: 8500, comments: 'Severe Ovalization', isProblem: true, restriction: 0.3},
                {item: 'BaSO4 Scale Bridge', top: 14200, comments: 'Solid blockage', isProblem: true, restriction: 0.4},
                {item: 'Packer', top: 18250}
            ], 
            perforations: [{top: 18350, bottom: 18450}] 
        } 
    },
    { 
        id: 'M-21', name: 'CASE STUDY: The Montrose Squeeze', field: 'Montrose', status: 'Active - Restored Production',
        issue: 'SOLUTION: Casing deformation was successfully remediated with an expandable patch.', 
        history: [ 
            { date: '2024-11-10', operation: 'E-Line MFC Log', problem: 'Standard tools unable to pass 8,500ft. Multi-Finger Caliper (MFC) log confirmed casing ovalization.', lesson: 'Visual/Caliper confirmation of the restriction is critical before attempting remediation. It differentiates collapse from simple deformation.' },
            { date: '2024-12-05', operation: 'Expandable Casing Patch', problem: 'Successfully installed a 60ft expandable steel patch.', lesson: 'This proves an expandable patch is a viable, rigless solution for restoring full-bore access in this field.' }
        ],
    },
    { 
        id: 'S-15', name: 'CASE STUDY: The Scale Trap', field: 'Montrose', status: 'Active - Restored Production',
        issue: 'SOLUTION: Severe BaSO4 scale was successfully removed with a chemical/jetting treatment.', 
        history: [ 
            { date: '2025-01-05', operation: 'Production Logging', problem: 'PLT toolstring unable to pass 9,200ft due to a hard obstruction. Water analysis confirmed high Barium and Sulfate content.', lesson: 'Commingling of injected seawater and formation water is causing severe, insoluble scale deposition.'},
            { date: '2025-02-12', operation: 'CT Chemical/Jetting', problem: 'A 48hr soak with DTPA dissolver followed by a high-pressure rotating jetting tool successfully cleared the blockage.', lesson: 'This two-stage approach is a proven, lower-risk method for removing hard scale compared to aggressive milling.' }
        ],
    },
    { 
        id: 'F-11', name: 'CASE STUDY: The Broken Barrier', field: 'Montrose', status: 'Active - Restored Production',
        issue: 'SOLUTION: Failed TRSSV was replaced with a slickline-retrievable insert valve.', 
        history: [ 
            { date: '2025-02-18', operation: 'Routine DHSV Test', problem: 'Valve failed to close reliably during routine test. Well mandatorily shut-in.', lesson: 'An attempted repair on a similar well with a hydraulic tool failed; a mechanical lock-open tool is more reliable.' },
            { date: '2025-03-20', operation: 'Slickline Insert Valve Job', problem: 'Successfully locked open the failed valve and installed a new wireline-retrievable insert valve.', lesson: 'This standard slickline operation is a proven, cost-effective method for restoring the primary safety barrier.' }
        ],
    }
];

export const OBJECTIVES_DATA: Objective[] = [ 
    { id: 'obj1', name: 'Remediate Casing Deformation', description: 'Run E-Line MFC log then install expandable patch.' }, 
    { id: 'obj2', name: 'Remove BaSO4 Scale', description: 'Use Coiled Tubing with chemicals and a jetting nozzle.' }, 
    { id: 'obj3', name: 'Restore Downhole Safety Valve', description: 'Lock open failed valve and install insert valve using Slickline.' },
];

export const PROBLEMS_DATA: Problem[] = [ 
    { id: 'prob1', name: 'Loss of Well Access (Casing Deformation)', linked_objectives: ['obj1'] }, 
    { id: 'prob2', name: 'Severe Scale Blockage', linked_objectives: ['obj2'] }, 
    { id: 'prob3', name: 'Failed Primary Safety Barrier (DHSV)', linked_objectives: ['obj3'] }, 
];

export const AI_RECOMMENDATIONS_DATA: Record<string, AiRecommendation[]> = {
    prob1: [{ objectiveId: 'obj1', confidence: 95, outcome: 'Full-bore access restored', reason: 'Historical analysis of case study <strong>M-21</strong> confirms an expandable steel patch is the standard, high-success-rate rigless solution for this specific failure mode in this field.' }],
    prob2: [{ objectiveId: 'obj2', confidence: 92, outcome: 'Blockage cleared, production restored', reason: 'Based on the successful intervention on case study <strong>S-15</strong>, a two-stage chemical (DTPA) and mechanical (jetting) intervention via Coiled Tubing has the highest probability of success.' }],
    prob3: [{ objectiveId: 'obj3', confidence: 99, outcome: 'Well returned to safe, compliant production', reason: 'The critical lesson from case study <strong>F-11</strong> is to use a reliable mechanical lock-open tool on Slickline to ensure a successful, single-run repair.' }]
};

export const PROCEDURES_DATA: Record<string, Procedure> = {
    obj1: { 
        name: "E-Line MFC Log & Patch Installation", 
        conveyance: 'E-Line', toolWeight: 800, frictionCoefficient: 0.25,
        steps: ["Hold pre-job safety meeting & TBT.", "Rig up E-Line unit and Pressure Control Equipment (PCE).", "RIH with Multi-Finger Caliper (MFC) to 8,400ft.", "Log casing deformation section from 8,400ft to 8,600ft.", "POOH with MFC toolstring.", "Submit log for analysis.", "(Simulated) Rig down E-Line. Rig up Workover Unit.", "RIH with expandable patch.", "Set patch across deformation at 8,500ft.", "POOH and test well access.", "Job Complete."],
        tfaModel: { pickUp: [[0,0.8], [18500, 15]], slackOff: [[0,0.8], [18500, 4]], alarmUpper: [[0,1.5], [18500, 18]], alarmLower: [[0,0], [18500, 1]] } 
    },
    obj2: { 
        name: "CT Chemical & Mechanical Scale Removal",
        conveyance: 'Coiled Tubing', toolWeight: 2500, frictionCoefficient: 0.35,
        steps: ["Hold pre-job safety meeting & TBT.", "Rig up Coiled Tubing unit and PCE.", "RIH with CT and spot DTPA chemical at 14,000ft.", "POOH and let chemical soak for 24 hours.", "(Simulated) RIH with CT and rotating jetting BHA to 14,000ft.", "Mill through scale bridge from 14,200ft to 14,250ft.", "Circulate well clean with high-vis sweeps.", "POOH to surface.", "Rig down equipment.", "Job Complete."],
        tfaModel: { pickUp: [[0,2.5], [14500, 25]], slackOff: [[0,2.5], [14500, 10]], alarmUpper: [[0,4], [14500, 28]], alarmLower: [[0,1], [14500, 7]] } 
    },
    obj3: { 
        name: "Slickline Insert Safety Valve Installation",
        conveyance: 'Slickline', toolWeight: 150, frictionCoefficient: 0.15,
        steps: ["Hold pre-job safety meeting & TBT.", "Rig up Slickline unit and PCE.", "RIH with gauge ring to 2,450ft to confirm access.", "POOH with gauge ring.", "RIH with lock-open tool for failed TRSSV at 2,500ft.", "POOH and confirm lock-open.", "RIH with new Wireline-Retrievable Safety Valve (WRSV).", "Set and test new WRSV at 2,500ft.", "POOH to surface.", "Rig down equipment.", "Job Complete."], 
        tfaModel: { pickUp: [[0, 150], [2500, 250]], slackOff: [[0, 150], [2500, 50]], alarmUpper: [[0, 350], [2500, 450]], alarmLower: [[0, -50], [2500, -150]] } 
    }
};

export const FAQ_DATA = [
    { question: "What is Well-Tegra?", answer: `<p>Well-Tegra is a platform designed to unify fragmented oil and gas operational data. It uses privacy-preserving AI and blockchain to enable secure collaboration, turning decades of isolated knowledge into actionable, predictive insights to reduce downtime and improve efficiency.</p>` },
    { question: "How does the AI work without sharing my raw data?", answer: `<p>Well-Tegra uses a technique called <strong>federated learning</strong> combined with advanced anonymization. The AI models are trained on your data locally, within your own secure environment. Only the anonymized learnings—not the raw data itself—are shared with the central model. This allows the system to gain collective intelligence without ever compromising your proprietary information.</p>` },
    { question: "Is this a cryptocurrency or public blockchain project?", answer: `<p>No. Well-Tegra uses a <strong>private, permissioned blockchain</strong>. This is a secure, members-only ledger for vetted industry partners. It's used to create an unchangeable, auditable record of operations and data access, ensuring trust and transparency without the volatility and public nature of cryptocurrencies like Bitcoin.</p>` }
];
