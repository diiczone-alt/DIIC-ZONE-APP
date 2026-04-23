const fs = require('fs');
const file = 'c:/PROYECTOS/DIICZONE_APP/components/workstation/cm/CMWorkstationLayout.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/user\?\.full_name\.split/g, 'user?.full_name?.split');

const insertUserHook = (fnName) => {
    const searchStr = 'function ' + fnName + '(';
    const idx = content.indexOf(searchStr);
    if (idx !== -1) {
        const braceIdx = content.indexOf('{', idx);
        if (braceIdx !== -1) {
            content = content.slice(0, braceIdx + 1) + '\n    const { user } = useAuth();' + content.slice(braceIdx + 1);
        }
    }
};

[
  'CMOverviewDashboard',
  'CMSettingsClients',
  'AIChatView',
  'EnterpriseChatView',
  'MessageContextModal',
  'CreativeCoordination',
  'CMReports'
].forEach(insertUserHook);

fs.writeFileSync(file, content);
