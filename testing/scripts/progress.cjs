const fs=require('node:fs');const path=require('node:path');const root=path.resolve(__dirname,'..');
const cases=JSON.parse(fs.readFileSync(path.join(root,'docs','customer-cases.json'),'utf8'));
for(const {id} of cases)console.log(id+': '+(fs.existsSync(path.join(root,'tests/uat',id+'.spec.cjs'))?'FILE PRESENT - review and execute to establish its result':'TO AUTHOR - expected at the participant starting point'));
console.log('This is a preparation inventory, not a test report. Missing starter tests are not product defects.');
