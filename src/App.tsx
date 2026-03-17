import { CRM } from "@/components/atomic-crm/root/CRM";

/**
 * Prisma Negev CRM — Application entry point
 *
 * Built on Atomic CRM (open-source) with custom Prisma Negev branding.
 * Theme colors are defined in src/index.css as CSS variables.
 */
const App = () => <CRM disableTelemetry={true} />;

export default App;
