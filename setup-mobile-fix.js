const fs = require('fs');
const path = require('path');

// Add responsive classNames to all dashboard client components
const files = [
  'app/dashboard/budget/BudgetClient.tsx',
  'app/dashboard/goals/GoalsClient.tsx',
  'app/dashboard/networth/NetWorthClient.tsx',
  'app/dashboard/retirement/RetirementClient.tsx',
  'app/dashboard/investments/InvestmentsClient.tsx',
  'app/dashboard/debt/DebtClient.tsx',
];

const replacements = [
  // Budget - summary cards grid
  {
    file: 'app/dashboard/budget/BudgetClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px"',
    to: 'display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px"} className="dash-cards"',
  },
  // Budget - main split
  {
    file: 'app/dashboard/budget/BudgetClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px"',
    to: 'display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px"} className="dash-split"',
  },
  // Goals - summary cards
  {
    file: 'app/dashboard/goals/GoalsClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px"',
    to: 'display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px"} className="dash-cards"',
  },
  // NetWorth - top cards
  {
    file: 'app/dashboard/networth/NetWorthClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px", marginBottom: "24px"',
    to: 'display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px", marginBottom: "24px"} className="dash-cards"',
  },
  // NetWorth - assets/liabilities split
  {
    file: 'app/dashboard/networth/NetWorthClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"',
    to: 'display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"} className="dash-split"',
  },
  // Retirement - countdown/readiness split
  {
    file: 'app/dashboard/retirement/RetirementClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "16px"',
    to: 'display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "16px"} className="dash-split"',
  },
  // Retirement - plan/gap split
  {
    file: 'app/dashboard/retirement/RetirementClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"',
    to: 'display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"} className="dash-split"',
  },
  // Investments - top split
  {
    file: 'app/dashboard/investments/InvestmentsClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "24px"',
    to: 'display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "24px"} className="dash-split"',
  },
  // Debt - top cards
  {
    file: 'app/dashboard/debt/DebtClient.tsx',
    from: 'display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px"',
    to: 'display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px"} className="dash-cards"',
  },
];

replacements.forEach(({ file, from, to }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log('Skipping (not found):', file);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(from)) {
    content = content.replace(from, to);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', file);
  } else {
    console.log('Pattern not found:', file);
  }
});

console.log('Done');