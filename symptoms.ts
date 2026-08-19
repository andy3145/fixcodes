import type { CodeItem } from '@/lib/codes';

export interface SymptomCheck {
    /** Short imperative label, e.g. "Clean the drain pump filter". */
    label: string;
    /** One or two sentences on how to do it and what the result means. */
    detail: string;
}

export interface SymptomTopic {
    slug: string;
    title: string;
    shortTitle: string;
    /** Meta description and hero paragraph. */
    description: string;
    appliance?: string;
    /** Unique opening prose framing what this symptom actually means. */
    intro: string;
    /** Free checks to run before buying any part. This is the page's real value. */
    freeChecks: SymptomCheck[];
    /** What to do when the display shows no code at all. */
    noCodeGuidance: string;
    /** Causes worth checking, ordered by how cheap and quick each is to rule out. */
    commonCauses: string[];
    /** Where the DIY boundary sits for this symptom. */
    stopAndCall: string;
}

export const symptoms: SymptomTopic[] = [
    {
        slug: 'washer-not-draining',
        title: 'Washer Not Draining: Error Codes, Causes & Fixes',
        shortTitle: 'Washer not draining',
        description:
            'Water left standing in the tub is almost always a restriction, not a failed pump. Work through the free checks first, then match your error code.',
        appliance: 'Washer',
        intro:
            'A washer that will not drain reports one of the most predictable faults in the appliance. The control starts a drain phase, watches the water level sensor, and throws a code when the level has not dropped far enough within the window that model allows. That code tells you water did not leave. It does not tell you the pump failed, and in most cases it has not.',
        freeChecks: [
            {
                label: 'Clean the drain pump filter',
                detail:
                    'On many front-loaders this sits behind a small access panel near the bottom front. Put a shallow pan and towels down first because retained water may drain when the filter opens. Coins, hair clips, lint, and other debris are common restrictions.',
            },
            {
                label: 'Check the drain hose for kinks and height',
                detail:
                    'Drain height requirements vary widely between models — check the installation specification for your exact machine rather than a general rule. Too low and the tub siphons; too high and the pump cannot lift the water. Pull the machine out and look for a hose crushed against the wall.',
            },
            {
                label: 'Test the standpipe or disposer connection',
                detail:
                    'Test the standpipe with a controlled amount of water appropriate for the drain. If it backs up or drains slowly, the household drain may be the problem rather than the washer. On units draining into a disposer, confirm the inlet was opened correctly during installation.',
            },
            {
                label: 'Listen to the pump during a drain cycle',
                detail:
                    'Start a drain and spin, then listen. A steady hum with no water movement usually means a jammed impeller or a failed pump. Complete silence more often points to a control, wiring, or lid-switch problem than to the pump itself.',
            },
        ],
        noCodeGuidance:
            'Plenty of washers hold water without ever showing a code — older top-loaders in particular have no level feedback to fail on. Every check above still applies. If the pump runs and the filter is clear, suspect the drain hose or house plumbing before any electrical part.',
        commonCauses: [
            'Clogged drain pump filter or trapped foreign object',
            'Kinked, crushed, or incorrectly routed drain hose',
            'Blocked house standpipe or capped disposer inlet',
            'Failed drain pump motor or seized impeller',
            'Water level pressure sensor reporting the wrong level',
            'Lid or door lock fault preventing the drain phase from starting',
        ],
        stopAndCall:
            'If the pump is clear and running but water still will not leave, or you find water in the machine base pan, stop. Persistent leaks and control board faults are worth a service call rather than parts guessing.',
    },
    {
        slug: 'washer-not-filling',
        title: 'Washer Not Filling: Water Inlet Error Codes & Fixes',
        shortTitle: 'Washer not filling',
        description:
            'Slow-fill and no-fill codes usually trace to supply valves, inlet screens, or hoses long before the inlet valve itself has failed.',
        appliance: 'Washer',
        intro:
            'Fill faults trigger when the machine does not reach its target water level within an allowed time — the control measures rate, not just presence. A partial restriction therefore produces the same code as no water at all, which is why "the water is on, so it cannot be the supply" leads people to replace the wrong part.',
        freeChecks: [
            {
                label: 'Open both supply valves fully',
                detail:
                    'Half-open valves are common after a machine has been moved. Both hot and cold must be open even if you only wash cold — many machines fill through both to reach a target temperature.',
            },
            {
                label: 'Clean the inlet screens',
                detail:
                    'Shut the water off, unthread the fill hoses at the machine, and look into the ports. Small mesh screens there catch sediment. Rinse or pick them clean, and do not remove them permanently.',
            },
            {
                label: 'Check for kinked or crushed fill hoses',
                detail:
                    'Look behind the machine. A hose pinched against the wall restricts flow enough to trip a slow-fill timeout without ever fully stopping the water.',
            },
            {
                label: 'Confirm real household pressure',
                detail:
                    "Your model's manual lists a minimum supply pressure. Compare flow against another fixture on the same line: if a nearby tap also runs weak, the supply is the problem rather than the appliance.",
            },
        ],
        noCodeGuidance:
            'If the drum stays dry with no code, confirm the machine actually entered a fill state. A door or lid that has not latched looks exactly like a fill failure. Listen for the valve solenoid clicking as the cycle starts.',
        commonCauses: [
            'Supply valve partially closed or turned off',
            'Clogged inlet screen filters at the machine ports',
            'Kinked or collapsed fill hose',
            'Low household water pressure',
            'Failed water inlet valve solenoid',
            'Water level pressure sensor or air dome tube fault',
            'Door or lid lock not confirming, so fill never begins',
        ],
        stopAndCall:
            'Electrical testing of the inlet valve means working near live terminals. If the screens and supply check out, that is a sensible point to hand off.',
    },
    {
        slug: 'washer-wont-spin',
        title: "Washer Won't Spin: Motor, Balance & Speed Error Codes",
        shortTitle: "Washer won't spin",
        description:
            'Most spin failures are load balance or drainage problems in disguise. A washer will not spin on a tub full of water, and it will not spin a load it cannot distribute.',
        appliance: 'Washer',
        intro:
            'Spin faults split into two groups that need completely different responses. Balance codes mean the machine tried, detected uneven weight, and stopped to protect itself — that is the machine working correctly. Motor and speed codes mean the drive system never reached commanded RPM, which is a real hardware question. Work out which group your code belongs to before touching anything.',
        freeChecks: [
            {
                label: 'Redistribute the load and retry',
                detail:
                    'One heavy item — a bath mat, a hoodie, a single towel — is the most common trigger. Add two or three similar items to balance it rather than washing the item alone.',
            },
            {
                label: 'Confirm the machine drained first',
                detail:
                    'No washer will spin with water in the tub. If you also see standing water, the real fault is drainage and the spin code is downstream of it.',
            },
            {
                label: 'Check that the machine is level',
                detail:
                    'Rock each corner. A washer on an uneven floor triggers balance protection constantly at high speed. Adjust the feet and tighten the lock nuts.',
            },
            {
                label: 'Verify shipping bolts were removed',
                detail:
                    'On a recently delivered front-loader, unremoved transit bolts cause violent noise and immediate balance faults. They come out of the back panel.',
            },
            {
                label: 'Spin the drum by hand',
                detail:
                    'With the machine off, the drum should turn freely with slight resistance. Grinding, scraping, or a drum that drops noticeably when pushed suggests worn bearings or broken suspension.',
            },
        ],
        noCodeGuidance:
            'A drum that fills and drains but never spins, with no code, often means a broken drive belt on belt-driven machines or a failed lid switch on top-loaders — by design, these will not spin with the lid reading open.',
        commonCauses: [
            'Unbalanced or single-item load',
            'Water still in the tub from an unresolved drain fault',
            'Machine not level or sitting on a flexing floor',
            'Worn suspension rods, shock absorbers, or springs',
            'Broken or slipping drive belt',
            'Lid lock or door lock not confirming closed',
            'Motor control board or rotor position sensor fault',
            'Worn drum bearings',
        ],
        stopAndCall:
            'Bearing and suspension work means substantially disassembling the machine, and on many models the labor exceeds the value of an older washer. Get a quote before committing.',
    },
    {
        slug: 'dryer-not-heating',
        title: 'Dryer Not Heating: Heating & Temperature Error Codes',
        shortTitle: 'Dryer not heating',
        description:
            'A dryer that tumbles but stays cold is usually a blown thermal fuse, a restricted vent, or — on electric models — a half-lost 240V supply.',
        appliance: 'Dryer',
        intro:
            'When a dryer tumbles normally but produces no heat, the motor circuit is fine and the heating circuit is not. On electric dryers that circuit runs on 240V across two legs; lose one leg and the drum still turns on 120V while the element does nothing at all. That single fact explains a large share of no-heat calls, and it costs nothing to rule out before opening the cabinet.',
        freeChecks: [
            {
                label: 'Check both halves of the breaker',
                detail:
                    'An electric dryer uses a double-pole breaker. One tripped half leaves the drum turning with no heat. Switch it fully off, then back on — a partially tripped breaker can look seated.',
            },
            {
                label: 'Clear the lint screen and the vent run',
                detail:
                    'Restricted airflow makes the dryer overheat, which opens a thermal fuse or cutoff and kills heat entirely. Pull the screen, vacuum the housing beneath it, then disconnect the duct at the wall and check for compacted lint.',
            },
            {
                label: 'Verify the exterior vent flap opens',
                detail:
                    'Run the dryer and go outside. If the flap barely moves, the duct is blocked — often by lint at a bend or a bird nest. Blocked venting is also a leading cause of dryer fires, so this is worth doing regardless.',
            },
            {
                label: 'Confirm gas supply on gas models',
                detail:
                    'Check that the shutoff behind the dryer is open and other gas appliances still work. A dryer that clicks repeatedly without igniting usually has an igniter or flame sensor issue rather than a supply problem.',
            },
        ],
        noCodeGuidance:
            'Many dryers throw no code for a no-heat condition, especially older models. The lost-leg check and the vent check cover most of them. If both pass, a blown thermal fuse is the next most likely single part.',
        commonCauses: [
            'One leg of the 240V supply lost at the breaker or outlet',
            'Restricted or blocked exhaust vent causing thermal cutoff',
            'Blown thermal fuse',
            'Failed heating element on electric models',
            'Failed igniter or flame sensor on gas models',
            'Open thermistor or cycling thermostat',
            'Control board relay failure',
        ],
        stopAndCall:
            'Gas dryers involve a live gas valve and combustion. If the igniter glows but no flame establishes, or you smell gas at any point, stop immediately and call a licensed technician.',
    },
    {
        slug: 'dryer-taking-too-long',
        title: 'Dryer Taking Too Long: Vent & Airflow Error Codes',
        shortTitle: 'Dryer taking too long',
        description:
            'Long dry times are an airflow problem in the overwhelming majority of cases — and the fix is usually free.',
        appliance: 'Dryer',
        intro:
            'A dryer removes moisture by moving heated air through the load and exhausting that damp air outside. Restrict the airflow and the machine may still heat and tumble while drying takes progressively longer. Some brands detect vent restriction directly; others simply show longer cycles or poor drying performance.',
        freeChecks: [
            {
                label: 'Clean the lint screen every load',
                detail:
                    'Also wash the screen with soap and water a few times a year. Dryer sheets leave an invisible film that blocks airflow while the screen still looks clean — if water beads on it rather than passing through, it needs washing.',
            },
            {
                label: 'Disconnect and clear the full duct run',
                detail:
                    'Pull the dryer out, disconnect the duct, and clean the entire run to the outside wall. A brush kit costs less than a service call. Pay attention to elbows, where lint compacts first.',
            },
            {
                label: 'Replace foil or vinyl flexible duct',
                detail:
                    'Ribbed flexible duct traps lint at every corrugation and crushes easily behind the machine. Rigid or semi-rigid smooth-wall metal duct moves substantially more air and is required by code in most areas.',
            },
            {
                label: 'Measure the total duct length',
                detail:
                    'Every model specifies a maximum duct run, and each bend counts against it — the exact allowance is in your installation manual and differs meaningfully between models. A long run with several bends can exceed the limit and will never dry well no matter how clean it is.',
            },
            {
                label: 'Stop overloading the drum',
                detail:
                    'Air needs a path through the load, and a packed drum has none. Your manual gives a load capacity — dry a smaller load and see whether the time drops.',
            },
        ],
        noCodeGuidance:
            'Many dryers give no dedicated warning for gradual airflow loss, so increasing cycle time can be the first clue. If drying has become progressively slower, inspect the lint path, transition duct, and exterior vent before assuming a heating component has failed.',
        commonCauses: [
            'Lint-clogged exhaust duct or exterior vent flap',
            'Film buildup on the lint screen from dryer sheets',
            'Crushed, kinked, or excessively long flexible duct',
            'Overloaded drum',
            'Failed or drifting moisture sensor bars inside the drum',
            'Weak heating element producing partial heat',
            'Worn blower wheel',
        ],
        stopAndCall:
            'If airflow is verified clear and cycles are still long, the next steps involve testing heating components on a live circuit. That is a reasonable handoff point.',
    },
    {
        slug: 'dishwasher-not-draining',
        title: 'Dishwasher Not Draining: Error Codes, Causes & Fixes',
        shortTitle: 'Dishwasher not draining',
        description:
            'Standing water in the tub usually means a blocked filter, a clogged air gap, or a disposer knockout plug that was never removed.',
        appliance: 'Dishwasher',
        intro:
            'Dishwashers are designed to leave a small amount of water in the sump, which keeps seals from drying out. A genuine drain fault means water sits well above that, often covering the tub floor. Because a dishwasher shares plumbing with the sink, the cause is frequently outside the appliance entirely.',
        freeChecks: [
            {
                label: 'Remove and clean the filter assembly',
                detail:
                    'Twist out the cylindrical filter at the tub floor and lift the flat mesh screen beneath it. Rinse both under hot water and scrub with a brush. Food debris here is the most common single cause.',
            },
            {
                label: 'Check the disposer knockout plug',
                detail:
                    'If a disposal was installed after the dishwasher, the knockout plug in its inlet may still be in place, leaving the dishwasher nowhere to drain. This catches a lot of people and is a five-minute fix.',
            },
            {
                label: 'Clear the air gap',
                detail:
                    'If there is a small chrome cylinder on the counter beside the faucet, pull its cap and clean inside. They clog with debris and back water up into the dishwasher.',
            },
            {
                label: 'Run the disposal',
                detail:
                    'A disposal full of waste blocks the shared drain line. Run it fully before rerunning the dishwasher.',
            },
            {
                label: 'Check the drain hose high loop',
                detail:
                    'The drain hose should rise up under the counter before dropping to the disposer or standpipe. Without that loop, sink water siphons back into the dishwasher.',
            },
        ],
        noCodeGuidance:
            'Many dishwashers show nothing and simply leave water behind. Every check above still applies. If the filter is clean and the disposal path is clear, the drain pump or the sump check valve is the next suspect.',
        commonCauses: [
            'Clogged filter assembly or sump screen',
            'Disposer knockout plug never removed',
            'Blocked air gap on the countertop',
            'Kinked drain hose or missing high loop',
            'Full or clogged garbage disposal',
            'Failed drain pump or jammed impeller',
            'Stuck check valve allowing backflow',
        ],
        stopAndCall:
            'If the drain path is verified clear and the pump does not run, testing means working in a wet cabinet near live connections. Worth handing off, particularly on integrated units that must be unmounted to service.',
    },
    {
        slug: 'dishwasher-leaking',
        title: 'Dishwasher Leaking: Leak & Overflow Error Codes',
        shortTitle: 'Dishwasher leaking',
        description:
            'Leak-detect codes latch and will not clear until the base pan is dry. Find the source before resetting anything.',
        appliance: 'Dishwasher',
        intro:
            'Most modern dishwashers carry a float switch in the base pan. When water collects there the machine locks into a protection mode, runs the drain pump continuously, and refuses to fill. That behavior is the machine containing a leak, not causing one — so clearing the code without finding the water simply repeats the cycle.',
        freeChecks: [
            {
                label: 'Check the detergent first',
                detail:
                    'Hand dish soap in a dishwasher produces enormous quantities of suds that push past the door seal and pool on the floor. If anyone recently used the wrong soap, run several rinse-only cycles before diagnosing anything mechanical.',
            },
            {
                label: 'Inspect the door gasket',
                detail:
                    'Run a finger around the full seal looking for tears, hardening, or debris holding it open. Clean it with warm soapy water. A compressed gasket that has taken a set leaks at the bottom corners first.',
            },
            {
                label: 'Confirm the unit is level',
                detail:
                    'A dishwasher tilted forward overflows at the door. Check side to side and front to back, and adjust the leveling feet.',
            },
            {
                label: 'Look underneath with a flashlight',
                detail:
                    'Pull the lower access panel. Water at the front points to the door seal; water at the back or center points to hose connections, the sump gasket, or the pump seal.',
            },
            {
                label: 'Dry the base pan completely',
                detail:
                    'Towels and time. The float must drop before the code clears, and the machine keeps reporting the fault while any water remains under the tub.',
            },
        ],
        noCodeGuidance:
            'A leak with no code often means water is escaping before it reaches the base pan — usually the door seal or a supply connection. Lay dry paper towel under the front edge and run a short cycle to see where it appears.',
        commonCauses: [
            'Hand dish soap or excessive detergent causing suds overflow',
            'Torn, hardened, or dirty door gasket',
            'Unit not level',
            'Loose or split drain and supply hose connections',
            'Failed sump or pump seal',
            'Cracked tub or spray arm',
            'Water inlet valve failing to close fully',
        ],
        stopAndCall:
            'Water and electricity in one cabinet raise the stakes. If you cannot locate the source quickly, shut the supply valve and get a technician — a slow leak under a dishwasher damages subfloor and cabinetry well before it becomes visible.',
    },
    {
        slug: 'refrigerator-not-cooling',
        title: 'Refrigerator Not Cooling: Fan, Defrost & Sensor Error Codes',
        shortTitle: 'Refrigerator not cooling',
        description:
            'A freezer that works while the fresh food side warms is a very different fault from both compartments failing together. That distinction narrows it fast.',
        appliance: 'Refrigerator',
        intro:
            'Start by identifying the pattern, because it splits the diagnosis cleanly. Most refrigerators cool a single evaporator in the freezer and blow that air into the fresh food compartment. A cold freezer with a warm fresh food side therefore almost always means air is not moving — a failed evaporator fan or a damper stuck closed. Both compartments warming together points instead to the sealed system, the compressor, or a defrost failure that has iced the evaporator solid.',
        freeChecks: [
            {
                label: 'Listen for the evaporator fan',
                detail:
                    'Open the freezer and press the door switch. You should hear a fan spin up inside. Silence with a running compressor is a strong signal, and this is the single most useful five-second test on the appliance.',
            },
            {
                label: 'Clean the condenser coils',
                detail:
                    'Pull the fridge out and vacuum the coils underneath or behind. Dust-blanketed coils cannot reject heat, so the unit runs constantly and still drifts warm. Pet hair makes this dramatically worse.',
            },
            {
                label: 'Check for frost on the back freezer wall',
                detail:
                    'Remove the rear freezer panel if you can. A solid sheet of ice across the evaporator coil means the defrost system has failed — heater, thermostat, or control. That ice blocks airflow completely.',
            },
            {
                label: 'Verify vents are not blocked',
                detail:
                    'Boxes packed against the rear vents in either compartment stop circulation. Leave clear space around the airflow openings.',
            },
            {
                label: 'Confirm door seals and closure',
                detail:
                    'Close a dollar bill in the door and pull. Noticeable resistance means the seal is doing its job. A door held slightly open by a drawer is a common and easily missed cause.',
            },
        ],
        noCodeGuidance:
            'Many refrigerators surface nothing on the display. The freezer-cold-fridge-warm split and the frost check will get you most of the way regardless of brand. If the compressor is silent, warm to the touch, and never cycles, that is a service call.',
        commonCauses: [
            'Failed evaporator fan motor',
            'Defrost system failure icing over the evaporator coil',
            'Dust-blocked condenser coils',
            'Damper control stuck closed between compartments',
            'Failed condenser fan',
            'Worn or misaligned door gasket',
            'Thermistor reporting incorrect temperature',
            'Compressor or sealed system failure',
        ],
        stopAndCall:
            'Anything involving refrigerant — a sealed system leak, compressor replacement, recharging — is legally restricted work in most jurisdictions and requires certification. If the coils are clean, the fans run, and it still will not cool, that is the boundary.',
    },
    {
        slug: 'refrigerator-ice-maker-not-working',
        title: 'Ice Maker Not Working: Error Codes, Causes & Fixes',
        shortTitle: 'Ice maker not working',
        description:
            'Ice makers fail for boring reasons far more often than mechanical ones — a raised shutoff arm, a closed supply valve, or a freezer running slightly too warm.',
        appliance: 'Refrigerator',
        intro:
            'An ice maker needs three things at once: water arriving, a freezer cold enough to freeze the mold, and a working harvest cycle to eject the cubes. Any one missing produces the same visible symptom of no ice, which is why this is worth diagnosing in that order rather than replacing the assembly first.',
        freeChecks: [
            {
                label: 'Check the shutoff arm or switch',
                detail:
                    'Wire-arm models pause when the arm is raised, and a bag of frozen food can lift it accidentally. Newer units use a paddle or an on/off setting in the display menu.',
            },
            {
                label: 'Confirm the water supply valve is open',
                detail:
                    'Trace the line back to the shutoff, usually under the sink or behind the fridge. A valve half-closed after a move restricts flow enough to make undersized or hollow cubes.',
            },
            {
                label: 'Verify freezer temperature',
                detail:
                    'An ice maker will not complete a harvest cycle if the freezer is running above the temperature your manual specifies. Put a thermometer in for a few hours rather than trusting the display, then compare against that spec.',
            },
            {
                label: 'Look for a fill tube ice plug',
                detail:
                    'A frozen slug in the fill tube at the back of the compartment blocks water. Thaw it carefully with warm water or a hair dryer on low — never a sharp tool, which punctures the liner.',
            },
            {
                label: 'Change the water filter',
                detail:
                    'A filter past its service life restricts flow badly, and many refrigerators deliberately cut ice production when the filter is overdue.',
            },
        ],
        noCodeGuidance:
            'Ice makers frequently fail silently. If water reaches the mold and freezes but cubes never eject, the harvest motor or mold heater is the likely culprit. If no water arrives at all, work backward through the fill tube, the inlet valve, and the supply line.',
        commonCauses: [
            'Shutoff arm raised or ice maker switched off',
            'Water supply valve closed or line kinked',
            'Freezer temperature too warm to complete harvest',
            'Frozen fill tube',
            'Clogged or overdue water filter',
            'Failed water inlet valve solenoid',
            'Failed harvest motor or mold thermostat',
            'Jammed dispenser auger',
        ],
        stopAndCall:
            'Ice maker assemblies are often sold as complete modules, which makes DIY replacement practical. If the fault traces to the inlet valve behind the unit or to the main control, weigh the part cost against a service call on an older refrigerator.',
    },
    {
        slug: 'oven-not-heating',
        title: 'Oven Not Heating: Sensor, Element & Control Error Codes',
        shortTitle: 'Oven not heating',
        description:
            'Oven temperature faults concentrate in one component more than any other — the resistance sensor probe inside the cavity.',
        appliance: 'Oven / Range',
        intro:
            'Many electric ovens regulate temperature with a resistance sensor probe in the cavity. The control reads that sensor and cycles the heating elements to maintain the set temperature. A sensor that drifts, opens, or shorts can therefore produce temperature faults, but heating elements, wiring, relays, controls, and power-supply problems can create similar symptoms depending on the model.',
        freeChecks: [
            {
                label: 'Watch the bake element during preheat',
                detail:
                    'On models with an exposed element, look for obvious blistering, breaks, or uneven heating during preheat. Hidden elements cannot be judged visually, and bake and broil circuits are separate on many ovens, so use the service information for the exact model before concluding an element has failed.',
            },
            {
                label: 'Check for a self-clean lockout',
                detail:
                    'An interrupted self-clean cycle can leave the door latch motor mid-travel and the oven locked out entirely. Cut power at the breaker for five minutes and see whether the latch resets.',
            },
            {
                label: 'Verify both legs of the breaker',
                detail:
                    'Like a dryer, an electric range runs on 240V. Losing one leg often leaves the surface burners or the clock working while the oven does nothing.',
            },
            {
                label: 'Compare actual temperature to the setpoint',
                detail:
                    'Put an oven thermometer on the center rack and preheat to a set temperature, then compare after it stabilises. A consistent gap points at the sensor or calibration. Many ovens allow a calibration offset in the settings for small errors.',
            },
            {
                label: 'Confirm gas supply on gas ranges',
                detail:
                    'If the surface burners light but the oven does not, supply is fine and the oven igniter is the likely fault. A weak igniter glows but never draws enough current to open the safety valve.',
            },
        ],
        noCodeGuidance:
            'An oven that heats but runs consistently hot or cold may have a sensor, calibration, airflow, or control issue, so start by comparing actual temperature with the setpoint. An oven that does not heat at all points the diagnosis toward power, heating components, ignition, door-lock state, wiring, or controls depending on the model.',
        commonCauses: [
            'Open or drifting oven temperature sensor probe',
            'Burned-out bake or broil element',
            'Door latch stuck after an interrupted self-clean cycle',
            'One leg of the 240V supply lost',
            'Weak oven igniter on gas models',
            'Failed electronic oven control board',
            'Stuck or shorted touchpad key locking the control',
        ],
        stopAndCall:
            'Gas ranges and 240V circuits both carry real risk. Element and sensor replacement is within reach for a careful DIYer with power off at the breaker, but anything involving the gas valve or safety circuit should go to a licensed technician.',
    },
];

/**
 * Codes shown on a symptom page.
 *
 * Association is resolved at authoring time by scripts/assign-symptoms.mjs and
 * stored as `symptomSlugs` on each record. There is deliberately no substring
 * matching here: the previous implementation searched every text field on a
 * record, so a diagnostic step mentioning a drain restriction in passing pulled
 * that code onto the "not draining" page. Runtime does a set membership test
 * and nothing else.
 *
 * To change what appears on a page, edit src/data/symptom-rules.json (including
 * its per-record `include` / `exclude` overrides) and re-run the script.
 */
export function codesForSymptom(topic: SymptomTopic, items: CodeItem[]): CodeItem[] {
    return items.filter((item) => item.symptomSlugs?.includes(topic.slug) ?? false);
}

export function findSymptom(slug: string): SymptomTopic | undefined {
    return symptoms.find((topic) => topic.slug === slug);
}
