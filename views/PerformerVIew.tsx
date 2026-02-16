import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Well, Procedure, LiveData, ProcedureStep } from '../types';
import Gauge from '../components/performer/Gauge';

interface PerformerVIewProps {
    well: Well;
    plan: Procedure;
    theme: 'light' | 'dark';
    onJobComplete: (finalState: LiveData, lessons: string[]) => void;
}

// Physics Constants
const CONVEYANCE_PARAMS = {
    'Slickline': { weightPerFoot: 0.02, maxSpeed: 400, unit: 'lbs' },
    'E-Line': { weightPerFoot: 0.15, maxSpeed: 200, unit: 'klbf' },
    'Coiled Tubing': { weightPerFoot: 2.5, maxSpeed: 80, unit: 'klbf' },
};

const PerformerVIew: React.FC<PerformerVIewProps> = ({ well, plan, theme, onJobComplete }) => {
    const [liveData, setLiveData] = useState<LiveData>({ depth: 0, weight: 0, speed: 0, pressure: 0, currentStep: 1, jobRunning: true, alarmState: 'none', npt: 0, opTime: 0 });
    const [procedure, setProcedure] = useState<ProcedureStep[]>([]);
    const [logEntries, setLogEntries] = useState<{ time: string; user: string; text: string }[]>([]);
    const [lessons, setLessons] = useState<string[]>([]);

    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const chartData = useRef<{ depth: number, weight: number }[]>([]).current;
    
    const addLogEntry = useCallback((user: string, text: string) => {
        setLogEntries(prev => [{ time: new Date().toLocaleTimeString(), user, text }, ...prev]);
    }, []);

    const advanceStep = useCallback(() => {
        setProcedure(prev => {
            const currentIdx = prev.findIndex(s => s.active);
            const nextIdx = currentIdx + 1;
            
            if (currentIdx > -1) {
                prev[currentIdx].completed = true;
                prev[currentIdx].active = false;
            }

            if (nextIdx < prev.length) {
                prev[nextIdx].active = true;
                addLogEntry('System', `Starting Step ${nextIdx + 1}: ${prev[nextIdx].text}`);
            } else {
                setLiveData(ld => ({ ...ld, jobRunning: false }));
                addLogEntry('System', 'Job procedure complete.');
                setLessons(prev => [...prev, 'The AI-guided plan was executed successfully, validating the historical case study data.']);
            }
            return [...prev];
        });
    }, [addLogEntry]);

    const runSimulation = useCallback(() => {
        if (!well.completion || !well.deviation) return;

        setLiveData(prevData => {
            if (!prevData.jobRunning) return prevData;

            const activeStep = procedure.find(s => s.active);
            if (!activeStep) return prevData;

            let { depth, speed } = prevData;
            const stepText = activeStep.text.toLowerCase();
            const conveyance = plan.conveyance;
            const params = CONVEYANCE_PARAMS[conveyance];
            
            let targetDepth = 0;
            const depthMatch = stepText.match(/(\d{1,3}(,\d{3})*|\d+)ft/);
            if (depthMatch) targetDepth = parseFloat(depthMatch[0].replace(/,/g, ''));
            
            // Speed calculation
            let targetSpeed = 0;
            if(stepText.includes('rih')) targetSpeed = params.maxSpeed;
            if(stepText.includes('pooh')) targetSpeed = -params.maxSpeed;

            // Check for restrictions
            const restrictions = well.completion.equipment.filter(e => e.restriction && e.top);
            for (const r of restrictions) {
                if (Math.abs(depth - r.top) < 200) {
                     targetSpeed *= (0.1 + (Math.abs(depth-r.top) / 200) * 0.9); // Slow down near restriction
                }
            }

            speed = targetSpeed;
            depth += (speed / 60) * 2; // Simulate 2s interval
            depth = Math.max(0, depth);

            // Physics calculation
            const getAngleAtDepth = (d: number) => {
                const upper = well.deviation?.slice().reverse().find(p => p.md <= d);
                return upper?.angle || 0;
            };
            
            const currentAngleRad = (getAngleAtDepth(depth) * Math.PI) / 180;
            const baseWeight = plan.toolWeight + (params.weightPerFoot * depth);
            const drag = baseWeight * Math.sin(currentAngleRad) * plan.frictionCoefficient;

            let weight = baseWeight;
            if (speed > 0) weight += drag; // RIH
            if (speed < 0) weight -= drag; // POOH

            // Add restriction effect
            for (const r of restrictions) {
                if (Math.abs(depth - r.top) < 10) {
                    weight += (baseWeight * 0.5 * (r.restriction || 0)); // Spike at restriction
                    addLogEntry('System', `WARNING: Encountered restriction at ${r.top}ft. Increased tension observed.`);
                    setLessons(prev => [...prev, `High friction at ${r.top}ft confirms casing deformation, validating the MFC log.`]);
                }
            }
            
            if (params.unit === 'klbf') weight /= 1000;

            chartData.push({ depth: Math.round(depth), weight });
            if (chartData.length > 500) chartData.shift();

            // Step completion logic
            if ( (targetSpeed > 0 && depth >= targetDepth) || (targetSpeed < 0 && depth <= targetDepth) || targetSpeed === 0) {
                if(targetDepth > 0) depth = targetDepth;
                speed = 0;
                setTimeout(advanceStep, 2000);
            }

            return { ...prevData, depth, speed, weight: parseFloat(weight.toFixed(2)), opTime: prevData.opTime + 2 };
        });
    }, [procedure, well.completion, well.deviation, plan, chartData, advanceStep, addLogEntry]);


    useEffect(() => {
        const initialProcedure = plan.steps.map((s, i) => ({ id: i + 1, text: s, completed: false, active: i === 0 }));
        setProcedure(initialProcedure);
        addLogEntry('System', 'Job initiated.');
        addLogEntry('System', `Starting Step 1: ${initialProcedure[0].text}`);
        
        simulationInterval.current = setInterval(runSimulation, 2000);
        return () => {
            if (simulationInterval.current) clearInterval(simulationInterval.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!liveData.jobRunning && simulationInterval.current) {
            clearInterval(simulationInterval.current);
            simulationInterval.current = null;
        }
    }, [liveData.jobRunning]);


    const conveyanceParams = CONVEYANCE_PARAMS[plan.conveyance];
    const weightUnit = conveyanceParams.unit;
    const isSlickline = plan.conveyance === 'Slickline';
    const weightDisplay = isSlickline ? liveData.weight.toFixed(0) : liveData.weight.toFixed(2);
    
    return (
        <div className="performer-view p-4 lg:p-6 h-full">
            <div className="h-full dashboard-grid">
                <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col overflow-hidden">
                    <h2 className="text-lg font-semibold mb-2 border-b border-slate-700 pb-2 text-white">Operational Procedure</h2>
                    <p className="text-xs text-slate-400 mb-3">Live simulation running. Monitor KPIs for deviations.</p>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                         {procedure.map(step => (
                            <div key={step.id} className={`procedure-step p-3 rounded-md ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                <p className="font-semibold text-sm text-slate-300">{step.id}. {step.text}</p>
                            </div>
                        ))}
                    </div>
                    {!liveData.jobRunning && (
                         <div className="mt-4">
                            <button onClick={() => onJobComplete(liveData, lessons)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition">View Post-Job Analysis</button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 lg:gap-6 overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                        <Gauge label={`Weight (${weightUnit})`} value={weightDisplay} />
                        <Gauge label="Depth (ft)" value={Math.round(liveData.depth).toLocaleString()} />
                        <Gauge label="Speed (ft/min)" value={Math.round(liveData.speed).toLocaleString()} />
                        <Gauge label="Op Time (hrs)" value={(liveData.opTime / 3600).toFixed(1)} />
                    </div>
                    <div className="flex-1 bg-slate-800/50 rounded-lg p-4 flex flex-col min-h-0">
                        <h3 className="text-lg font-semibold mb-2 text-white">Weight vs. Depth: Plan vs. Actual</h3>
                        <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#d1d5db'} />
                                <XAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#9ca3af', fontSize: 12 }} label={{ value: 'Depth (ft)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} label={{ value: `Weight (${weightUnit})`, angle: -90, position: 'insideLeft', fill: '#9ca3af' }}/>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Legend wrapperStyle={{fontSize: "14px"}} />
                                <Line type="monotone" data={plan.tfaModel.pickUp.map(p => ({depth: p[0], weight: p[1]}))} dataKey="weight" name="Planned Pick-up" stroke="#10b981" dot={false} strokeWidth={1} />
                                <Line type="monotone" data={plan.tfaModel.slackOff.map(p => ({depth: p[0], weight: p[1]}))} dataKey="weight" name="Planned Slack-off" stroke="#3b82f6" dot={false} strokeWidth={1} />
                                <Line type="monotone" dataKey="weight" name="Actual" stroke="#f59e0b" dot={false} strokeWidth={2} />
                                <ReferenceArea x1={plan.tfaModel.alarmUpper[0][0]} x2={plan.tfaModel.alarmUpper[1][0]} y1={plan.tfaModel.alarmUpper[0][1]} y2={plan.tfaModel.alarmUpper[1][1]} stroke="red" strokeOpacity={0.5} fill="red" fillOpacity={0.05} ifOverflow="visible" yAxisId={0} xAxisId={0} />
                                <ReferenceArea x1={plan.tfaModel.alarmLower[0][0]} x2={plan.tfaModel.alarmLower[1][0]} y1={plan.tfaModel.alarmLower[0][1]} y2={plan.tfaModel.alarmLower[1][1]} stroke="red" strokeOpacity={0.5} fill="red" fillOpacity={0.05} ifOverflow="visible" yAxisId={0} xAxisId={0} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2 text-white">Operations Log</h2>
                    <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-2">
                        {logEntries.map((entry, i) => (
                             <div key={i} className="log-entry p-2 border-b border-slate-700/50">
                                <p className="text-xs text-slate-400">{entry.time} - {entry.user}</p>
                                <p className="text-sm text-slate-300">{entry.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformerVIew;